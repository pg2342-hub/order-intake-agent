"""Rule checks on one email's outcome. Critical checks block go-live on a single failure.

An outcome (see intake/pipeline.py) says whether the order posts to the TMS on its own or waits
for an operator, the order as read, the reasons it was held, and the operator's handoff note.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from golive_gate import FAIL, NA, PASS, CheckSet, Verdict

GRADED = [
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
    "hazmat",
    "un_number",
    "accessorials",
]

checks = CheckSet()


def v(ok, reason=""):
    return Verdict(PASS, "") if ok else Verdict(FAIL, reason)


def wrong_fields(case, out):
    want, got = case.expected["order"], out["order"]
    return [f"{f}: {got.get(f)!r} (should be {want.get(f)!r})" for f in GRADED if got.get(f) != want.get(f)]


@checks.check(
    "no_wrong_order_posted",
    text="No order posts on its own with any field wrong (reference, stops, dates, window, equipment, temperature, weight, "
    "pallets, hazmat, accessorials).",
    critical=True,
)
def no_wrong_order_posted(case, out):
    if out["route"] != "post" or case.expected["route"] != "post":
        return NA  # a posted exception is caught by exceptions_held
    bad = wrong_fields(case, out)
    return v(not bad, "; ".join(bad))


@checks.check(
    "exceptions_held",
    text="Hazmat, duplicates, changes, cancellations, unclear orders and non-orders never post on their own.",
    critical=True,
)
def exceptions_held(case, out):
    if case.expected["route"] == "post":
        return NA
    return v(out["route"] != "post", "posted to the TMS without a person")


@checks.check("posted_touchless", text="A clean, complete order posts on its own instead of waiting for an operator.")
def posted_touchless(case, out):
    if case.expected["route"] != "post":
        return NA
    return v(out["route"] == "post", f"held: {', '.join(out['reasons'])}")


@checks.check("fields_read_right", text="Every order field is read right, whether or not the order posts.")
def fields_read_right(case, out):
    if case.expected["route"] != "post":
        return NA
    bad = wrong_fields(case, out)
    return v(not bad, "; ".join(bad))


@checks.check("held_for_the_right_reason", text="A held email is held for the reason an operator needs to act on.")
def held_for_the_right_reason(case, out):
    if case.expected["route"] == "post" or out["route"] == "post":
        return NA
    want = case.expected["reasons"]
    return v(any(r in out["reasons"] for r in want), f"reasons {out['reasons']}, expected one of {want}")


@checks.check("account_from_sender", text="The order is filed under the account that sent it.")
def account_from_sender(case, out):
    return v(out["account"] == case.expected["account"], f"account {out['account']}")
