"""Guardrails: what code checks before an order may post to the TMS without a person.

The model reads the email; code decides whether what it read can be trusted. Any one reason below
holds the order for an operator. An order posts only when there is no reason at all.
"""

from __future__ import annotations

import re
from datetime import date

from intake.world import ACCOUNTS, FACILITIES, OPEN_ORDERS

HAZMAT_WORDS = re.compile(r"\bUN ?\d{4}\b|\bhazmat\b|\bhazardous\b|\bclass [2-9]\b|\bflammable\b|\bcorrosive\b", re.I)
REQUIRED = ["customer_ref", "pickup_facility", "pickup_date", "delivery_facility", "delivery_date", "weight_lb"]
REF_FORMAT = {"NGP": r"LT-\d{5}", "CCH": r"CS-\d{4}", "LHG": r"\d{5}"}


def email_text(email: dict) -> str:
    parts = [email.get("subject", ""), email.get("body", "")]
    parts += [a.get("text", "") for a in email.get("attachments", [])]
    return "\n".join(parts)


def numbers_in(text: str) -> set[int]:
    """Every whole number written in the text: 41,200 / 41200 / 41200.00 / 38K."""
    found = set()
    for m in re.finditer(r"(?<![\w.])(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*([kK])?\b", text):
        n = int(m.group(1).replace(",", ""))
        found.add(n * 1000 if m.group(2) else n)
    return found


def _iso(value: str | None) -> date | None:
    try:
        return date.fromisoformat(value) if value else None
    except ValueError:
        return None


def check(account: str | None, request_type: str, order: dict, uncertain: list[str], email: dict) -> list[str]:
    """Reasons to hold this order for an operator. Empty means it may post on its own."""
    if account is None:
        return ["unknown_sender"]
    if request_type == "not_an_order":
        return ["not_an_order"]
    reasons: list[str] = []
    text = email_text(email)
    rules = ACCOUNTS[account]
    if request_type == "change":
        reasons.append("change_request")
    if request_type == "cancel":
        reasons.append("cancel_request")
    if request_type == "new_order" and (account, order.get("customer_ref")) in OPEN_ORDERS:
        reasons.append("duplicate")
    if order.get("hazmat") or order.get("un_number") or HAZMAT_WORDS.search(text):
        reasons.append("hazmat")
    if request_type == "cancel":
        return reasons  # a cancellation carries no order to check

    for f in REQUIRED + rules.get("required", []):
        if order.get(f) in (None, ""):
            reasons.append(f"missing_field:{f}")
    for f in ("pickup_facility", "delivery_facility"):
        if order.get(f) and order[f] not in FACILITIES:
            reasons.append(f"unknown_facility:{f}")
    for f in sorted(set(uncertain)):
        reasons.append(f"uncertain:{f}")

    ref = order.get("customer_ref")
    if ref and ref not in text:
        reasons.append("ref_not_in_email")
    fmt = REF_FORMAT.get(account)
    if ref and fmt and not re.fullmatch(fmt, ref):
        reasons.append("account_rule:reference_format")
    if order.get("weight_lb") and order["weight_lb"] not in numbers_in(text):
        reasons.append("weight_not_in_email")

    sent, pick, drop = _iso(email.get("date", "")[:10]), _iso(order.get("pickup_date")), _iso(order.get("delivery_date"))
    if (order.get("pickup_date") and not pick) or (order.get("delivery_date") and not drop):
        reasons.append("date_check:format")
    elif pick and drop and (drop < pick or (sent and pick < sent)):
        reasons.append("date_check:order")

    reasons += account_rules(account, order)
    return reasons


def account_rules(account: str, order: dict) -> list[str]:
    """The account rules a rule can state exactly. The rest (tarps for lumber, the latest message
    in a thread wins) only the model can apply, and the gate tests them case by case."""
    rules = ACCOUNTS[account]
    acc = set(order.get("accessorials") or [])
    drop = FACILITIES.get(order.get("delivery_facility") or "", {})
    out = []
    if order.get("equipment") not in rules["equipment"]:
        out.append("account_rule:equipment")
    needs_appt = account == "NGP" or (account == "HPF" and (order.get("delivery_facility") or "").startswith("MG-"))
    if needs_appt and not (order.get("delivery_appt_required") and "appointment" in acc):
        out.append("account_rule:appointment")
    if account == "HPF" and order.get("temp_f") is None:
        out.append("account_rule:temperature")
    if account == "LHG" and drop.get("type") == "store" and "liftgate" not in acc:
        out.append("account_rule:liftgate")
    return out
