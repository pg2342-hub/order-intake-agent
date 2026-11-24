"""One email in, one decision out: post the order to the TMS on its own, or hold it for an operator.

email -> account (code, from the sender's domain)
      -> Claude reads the order (extractor.py)
      -> guardrails (rules.py)
      -> post, or hold with reasons and a handoff note (a second Claude call)
      -> the account's rollout stage decides what actually happens (rollout.py)
"""

from __future__ import annotations

from collections.abc import Callable

from intake.rollout import action
from intake.rules import check
from intake.world import ACCOUNTS, FACILITIES, account_for, directory_for_prompt

Extractor = Callable[[dict], dict]


def view(email: dict, account: str | None) -> dict:
    """What the model sees: the email, the account's rules and the facility directory."""
    return {
        "email": email,
        "account": None
        if account is None
        else {"code": account, "name": ACCOUNTS[account]["name"], "rules": ACCOUNTS[account]["rules"]},
        "facilities": directory_for_prompt(),
    }


def normalize(order: dict) -> dict:
    out = dict(order)
    out["accessorials"] = sorted(set(order.get("accessorials") or []))
    for k in ("customer_ref", "pickup_window", "un_number"):
        if isinstance(out.get(k), str):
            out[k] = out[k].strip() or None
    return out


def tms_payload(account: str, order: dict) -> dict:
    """The load as it would be sent to the TMS (shaped like an EDI 204 load tender)."""
    return {
        "shipper": ACCOUNTS[account]["name"],
        "reference": order["customer_ref"],
        "stops": [
            {
                "type": "pickup",
                "facility": order["pickup_facility"],
                "name": FACILITIES[order["pickup_facility"]]["name"],
                "date": order["pickup_date"],
                "window": order.get("pickup_window"),
            },
            {
                "type": "delivery",
                "facility": order["delivery_facility"],
                "name": FACILITIES[order["delivery_facility"]]["name"],
                "date": order["delivery_date"],
                "appointment": bool(order.get("delivery_appt_required")),
            },
        ],
        "equipment": order["equipment"],
        "temp_f": order.get("temp_f"),
        "weight_lb": order["weight_lb"],
        "pallets": order.get("pallets"),
        "commodity": order.get("commodity"),
        "accessorials": order["accessorials"],
    }


def run(case_input: dict, extractor: Extractor, stage: str = "auto") -> dict:
    """One email through the agent. stage is the account's rollout stage (see rollout.py); the
    test set runs every account at auto, the strictest test of what would post on its own."""
    email = case_input["email"]
    account = account_for(email["from"])
    calls = []
    if account is None:
        read = {"request_type": "not_an_order", "order": {}, "uncertain": [], "evidence": {}, "applied_rules": []}
    else:
        read = extractor(view(email, account))
        calls.append(read.get("_meta", {}))
    order = normalize(read.get("order") or {})
    reasons = check(account, read["request_type"], order, read.get("uncertain", []), email)
    route = "post" if not reasons else "operator"
    out = {
        "account": account,
        "request_type": read["request_type"],
        "order": order,
        "uncertain": sorted(set(read.get("uncertain", []))),
        "evidence": read.get("evidence", {}),
        "applied_rules": read.get("applied_rules", []),
        "route": route,
        "stage": stage,
        "action": action(route, stage),
        "reasons": reasons,
        "tms": tms_payload(account, order) if route == "post" else None,
        "note": "",
    }
    if route == "operator":
        facts = {
            "from": email["from"],
            "subject": email.get("subject", ""),
            "request_type": read["request_type"],
            "order_as_read": order,
            "held_because": reasons,
        }
        written = extractor({"task": "note", "facts": facts})
        calls.append(written.get("_meta", {}))
        out["note"] = written["note"]
    out["_meta"] = {
        "calls": len(calls),
        "cost_usd": round(sum(c.get("cost_usd", 0.0) for c in calls), 6),
        "latency_s": round(sum(c.get("latency_s", 0.0) for c in calls), 3),
        "model": next((c["model"] for c in calls if c.get("model")), None),
    }
    return out
