"""The template parser the gate must block: what order entry looks like with OCR-style templates.

It pulls labelled values with patterns, maps a facility only when its name or a known alias appears
word for word, fills each account's fixed defaults (equipment, NGP's delivery appointment), assumes
every email is a new order, judges nothing (no hazmat, no relative dates, no threads), and posts
everything. It does well on a clean, labelled tender and badly on everything else, which is the point: a decent pass rate on easy
emails is not a reason to let it post on its own.
"""

from __future__ import annotations

import re
from datetime import datetime

from intake.pipeline import normalize, tms_payload
from intake.rules import email_text
from intake.world import ACCOUNTS, FACILITIES, account_for

LABEL_REF = re.compile(r"(?:Load Tender|Shipment No\.?|Order #|PO)\s*[:#]?\s*([A-Z0-9-]+)", re.I)
LABEL_WEIGHT = re.compile(r"(\d{1,3}(?:,\d{3})+|\d{4,6})\s*(?:lbs?|LB)", re.I)
LABEL_PALLETS = re.compile(r"(?:(\d+)\s*(?:pallets|plts?)\b|Pallets:\s*(\d+))", re.I)
WINDOW = re.compile(r"\b(\d{2}):?(\d{2})-(\d{2}):?(\d{2})\b")
DATE = re.compile(r"\b(\d{1,2})/(\d{1,2})(?:/(\d{4}))?\b|\b(\d{4})-(\d{2})-(\d{2})\b")
TEMP = re.compile(r"(-?\d+)\s*F\b")


def _facilities(text: str) -> list[str]:
    hits = []
    for code, f in FACILITIES.items():
        found = [p for p in (text.find(n) for n in [f["name"], *f["aliases"]]) if p >= 0]
        if found:
            hits.append((min(found), code))
    return [code for _, code in sorted(hits)]


def parse(email: dict) -> dict:
    text = email_text(email)
    account = account_for(email["from"])
    ref = LABEL_REF.search(text)
    weight = LABEL_WEIGHT.search(text)
    pallets = LABEL_PALLETS.search(text)
    dates = []
    for m, d, y, iy, im, idd in DATE.findall(text):
        try:
            dates.append(datetime(int(iy or y or 2026), int(im or m), int(idd or d)).date().isoformat())
        except ValueError:
            continue
    window = next(
        (
            w
            for w in WINDOW.finditer(text)
            if int(w.group(1)) < 24 and int(w.group(3)) < 24 and int(w.group(2)) < 60 and int(w.group(4)) < 60
        ),
        None,
    )
    temp = TEMP.search(text)
    stops = _facilities(text)
    order = {
        "customer_ref": ref.group(1) if ref else None,
        "pickup_facility": stops[0] if stops else None,
        "pickup_date": dates[0] if dates else None,
        "pickup_window": "{}:{}-{}:{}".format(*window.groups()) if window else None,
        "delivery_facility": stops[1] if len(stops) > 1 else None,
        "delivery_date": dates[1] if len(dates) > 1 else None,
        "delivery_appt_required": account == "NGP",
        "equipment": ACCOUNTS[account]["equipment"][0] if account else "dry_van_53",
        "temp_f": int(temp.group(1)) if temp and account == "HPF" else None,
        "weight_lb": int(weight.group(1).replace(",", "")) if weight else None,
        "pallets": int(pallets.group(1) or pallets.group(2)) if pallets else None,
        "commodity": None,
        "hazmat": False,
        "un_number": None,
        "accessorials": ["appointment"] if account == "NGP" else [],
    }
    return {"account": account, "order": normalize(order)}


def baseline(case_input: dict) -> dict:
    email = case_input["email"]
    parsed = parse(email)
    order, account = parsed["order"], parsed["account"]
    complete = account and order["pickup_facility"] and order["delivery_facility"]
    return {
        "account": account,
        "request_type": "new_order",
        "order": order,
        "uncertain": [],
        "evidence": {},
        "applied_rules": [],
        "route": "post",
        "reasons": [],
        "tms": tms_payload(account, order) if complete else None,
        "note": "",
        "_meta": {"calls": 0, "cost_usd": 0.0, "latency_s": 0.0, "model": None},
    }
