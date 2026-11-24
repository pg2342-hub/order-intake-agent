"""The judgment step: Claude reads one shipment-request email and fills in the order.

Rules cannot do this part: tenders arrive as PDFs, spreadsheets, forwarded threads and one-line
emails, facilities go by nicknames, dates are relative, and each account has its own conventions.
The model gets the email, the account's rules and the facility directory, and returns the order
fields, what kind of request it is, which fields it is unsure of, and the exact text it read the
reference and weight from. Code then checks all of it before anything is posted (see rules.py).

A second, smaller call writes the handoff note for an operator, after code has decided the order
cannot post on its own, so the note never guesses what the guardrails did.
"""

from __future__ import annotations

import json
import time
from typing import Any

from intake.world import ACCESSORIALS, EQUIPMENT

MODEL = "claude-opus-5-5"
EFFORT = "low"
# USD per million tokens (input, output), first-party list prices.
PRICES = {"claude-opus-5-5": (4.00, 20.00), "claude-opus-4-8": (5.00, 25.00), "claude-sonnet-5-5": (2.00, 10.00)}

FIELDS = [
    "customer_ref",
    "pickup_facility",
    "pickup_date",
    "pickup_window",
    "delivery_facility",
    "delivery_date",
    "delivery_appt_required",
    "equipment",
    "temp_f",
    "weight_lb",
    "pallets",
    "commodity",
    "hazmat",
    "un_number",
    "accessorials",
]

_s = {"type": ["string", "null"]}
_i = {"type": ["integer", "null"]}
SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["request_type", "order", "uncertain", "evidence", "applied_rules"],
    "properties": {
        "request_type": {"type": "string", "enum": ["new_order", "change", "cancel", "not_an_order"]},
        "order": {
            "type": "object",
            "additionalProperties": False,
            "required": FIELDS,
            "properties": {
                "customer_ref": _s,
                "pickup_facility": _s,
                "pickup_date": _s,
                "pickup_window": _s,
                "delivery_facility": _s,
                "delivery_date": _s,
                "delivery_appt_required": {"type": "boolean"},
                "equipment": {"type": "string", "enum": EQUIPMENT},
                "temp_f": _i,
                "weight_lb": _i,
                "pallets": _i,
                "commodity": _s,
                "hazmat": {"type": "boolean"},
                "un_number": _s,
                "accessorials": {"type": "array", "items": {"type": "string", "enum": ACCESSORIALS}},
            },
        },
        "uncertain": {"type": "array", "items": {"type": "string", "enum": FIELDS}},
        "evidence": {
            "type": "object",
            "additionalProperties": False,
            "required": ["customer_ref", "weight"],
            "properties": {"customer_ref": _s, "weight": _s},
        },
        "applied_rules": {"type": "array", "items": {"type": "string"}},
    },
}

NOTE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["note"],
    "properties": {"note": {"type": "string"}},
}

SYSTEM = """You work the order desk of a trucking company. Shippers email load requests; you turn each email into one order for the transportation management system (TMS). You handle one email at a time.

You get the email (headers, body, and the text of any attachment), the rules for the shipper's account, and the facility directory.

request_type:
- new_order: the email asks for a new load to be moved.
- change: it changes an order already sent (new date, new weight). Fill the order with the values after the change.
- cancel: it cancels an order already sent.
- not_an_order: anything else (a rate question, a thank-you, a newsletter).

order fields:
- customer_ref: the shipper's reference, exactly as written, following the account's rule on which number is the reference.
- pickup_facility, delivery_facility: the facility code from the directory. Match names, cities and nicknames. If no single facility clearly fits, use null and list the field in uncertain.
- pickup_date, delivery_date: YYYY-MM-DD. Resolve relative dates ("tomorrow", "Thursday") against the email's Date header. In a forwarded thread, the latest message wins.
- pickup_window: "HH:MM-HH:MM" in 24-hour time, or null if none is given and no account rule supplies one.
- equipment: dry_van_53, reefer_53 or flatbed_48.
- temp_f: the temperature in Fahrenheit for a reefer load, else null.
- weight_lb: total weight in pounds as an integer. pallets: the pallet count, or null if not given.
- commodity: a short plain description.
- hazmat: true if the email shows any hazardous material; un_number like "UN1263" if given.
- accessorials: from appointment, liftgate, tarps, driver_assist, only as the email or the account's rules require.
- delivery_appt_required: true if the email or the account's rules require a delivery appointment.

Apply every account rule. List the rules you applied in applied_rules, in a few words each.

uncertain: every field you could not fill with confidence. Never guess to make an order look complete: an order with a wrong field gets a truck to the wrong place on the wrong day, while an uncertain field only costs an operator a minute.

evidence: copy, character for character, the piece of the email you read the reference from and the piece you read the weight from (for example "Load Tender: LT-48822" and "Weight: 41,200 lbs")."""

NOTE_SYSTEM = """You write the handoff note an operator reads before touching an order that could not be entered automatically. Code has already decided the order is held and why; you explain it. Use only the facts given.

Two or three plain sentences: what the shipper is asking for (reference, lane, date, and for a change exactly what changes), why it is held (in words, not codes), and exactly what the operator needs to check or do next. If the email is not an order, say what it is, repeat its specifics (lanes, volumes), and who should answer it. State only what the email text says: order_as_read may hold account defaults (equipment, windows) the email never states, so leave those out unless the email says them. Do not ask the operator to confirm anything the email already states plainly. No greetings."""


def prompt(view: dict) -> str:
    return "Email and context:\n" + json.dumps(view, indent=1, sort_keys=True)


def note_prompt(facts: dict) -> str:
    return "Held order:\n" + json.dumps(facts, indent=1, sort_keys=True)


class ClaudeExtractor:
    """Calls Claude through the Anthropic SDK; reads credentials the way the SDK does."""

    def __init__(self, model: str = MODEL, effort: str = EFFORT, client: Any = None) -> None:
        if client is None:
            import anthropic

            client = anthropic.Anthropic()
        self.client = client
        self.model = model
        self.effort = effort

    def __call__(self, view: dict) -> dict:
        """The order read from an email view, or the operator note for a held order (task: note)."""
        if view.get("task") == "note":
            system, schema, content = NOTE_SYSTEM, NOTE_SCHEMA, note_prompt(view["facts"])
        else:
            system, schema, content = SYSTEM, SCHEMA, prompt(view)
        start = time.perf_counter()
        response = self.client.beta.messages.create(
            model=self.model,
            max_tokens=8000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"effort": self.effort, "format": {"type": "json_schema", "schema": schema}},
            system=system,
            messages=[{"role": "user", "content": content}],
        )
        latency = time.perf_counter() - start
        if response.stop_reason == "refusal":
            raise RuntimeError("the model declined this email")
        if response.stop_reason == "max_tokens":
            raise RuntimeError("the reply was cut off at max_tokens")
        text = next(b.text for b in response.content if b.type == "text")
        reply = json.loads(text)
        reply["_meta"] = {
            "model": getattr(response, "model", self.model),
            "cost_usd": self.cost(response),
            "latency_s": round(latency, 3),
        }
        return reply

    def cost(self, response: Any) -> float:
        price = PRICES.get(getattr(response, "model", self.model)) or PRICES.get(self.model, (0.0, 0.0))
        usage = response.usage
        written = getattr(usage, "cache_creation_input_tokens", 0) or 0
        cached = getattr(usage, "cache_read_input_tokens", 0) or 0
        tokens_in = (usage.input_tokens or 0) + written * 1.25 + cached * 0.05
        return (tokens_in * price[0] + (usage.output_tokens or 0) * price[1]) / 1e6
