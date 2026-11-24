"""An oracle for the reading step: the replies a correct model would give for a case.

Used by the tests to show the pipeline, guardrails and checks reach GO when the model is right,
and to plant single mistakes and watch the right check catch them.
"""

from golive_gate import load_cases

CASES = {c.id: c for c in load_cases("evals/cases.yml")}
META = {"model": "oracle", "cost_usd": 0.0, "latency_s": 0.0}

# What a correct reading of each exception email looks like.
EXCEPTIONS = {
    "x01": {"request_type": "new_order", "hazmat": True, "un_number": "UN1263", "customer_ref": "CS-2299"},
    "x02": {"request_type": "new_order", "hazmat": True, "customer_ref": "CS-2307"},
    "x03": {"request_type": "new_order", "customer_ref": "LT-48810"},
    "x04": {"request_type": "change", "customer_ref": "7731-A"},
    "x05": {"request_type": "cancel", "customer_ref": "55102"},
    "x06": {"request_type": "new_order", "customer_ref": "30440", "uncertain": ["pallets"]},
    "x07": {"request_type": "new_order", "customer_ref": "30442", "uncertain": ["delivery_facility"]},
    "x08": {"request_type": "not_an_order"},
}


def blank():
    return {
        "customer_ref": None, "pickup_facility": None, "pickup_date": None, "pickup_window": None,
        "delivery_facility": None, "delivery_date": None, "delivery_appt_required": False, "equipment": "dry_van_53",
        "temp_f": None, "weight_lb": None, "pallets": None, "commodity": None, "hazmat": False, "un_number": None,
        "accessorials": [],
    }


def oracle(case, tweak=None):
    """An extractor that answers like a correct model; tweak(order) can plant a mistake."""

    def extractor(view):
        if view.get("task") == "note":
            f = view["facts"]
            return {"note": f"Held because {', '.join(f['held_because'])}; please check the email from {f['from']}.",
                    "_meta": META}
        if case.expected["route"] == "post":
            order = {**dict(case.expected["order"]), "commodity": "goods"}
            uncertain, request_type = [], "new_order"
        else:
            spec = dict(EXCEPTIONS[case.id])
            request_type = spec.pop("request_type")
            uncertain = spec.pop("uncertain", [])
            order = {**blank(), **spec}
        if tweak:
            order = tweak(order)
        return {"request_type": request_type, "order": order, "uncertain": uncertain,
                "evidence": {"customer_ref": order.get("customer_ref"), "weight": None},
                "applied_rules": [], "_meta": META}

    return extractor
