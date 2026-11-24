"""The fictional operation the agent works for: a carrier's order desk and its five shipper accounts.

Everything here is invented. A real deployment fills the same three things from the customer's
systems during discovery: the facility directory (from the TMS), each account's rules (from the
operators, written down once and kept in memory), and the open orders (from the TMS, for duplicates
and changes).
"""

from __future__ import annotations

# Facility directory, as the TMS knows it. Aliases are what shippers actually write.
FACILITIES = {
    "NGP-MILL": {
        "name": "Northgate Paper Co., Appleton mill",
        "city": "Appleton, WI",
        "type": "plant",
        "aliases": ["Appleton mill", "the mill", "Northgate Appleton"],
    },
    "NGP-DC": {
        "name": "Northgate Paper Co., Romeoville DC",
        "city": "Romeoville, IL",
        "type": "dc",
        "aliases": ["Romeoville DC", "Romeoville"],
    },
    "MG-JOL": {
        "name": "Metro Grocers DC, Joliet",
        "city": "Joliet, IL",
        "type": "dc",
        "aliases": ["Metro Grocers Joliet", "Metro Joliet"],
    },
    "MG-IND": {
        "name": "Metro Grocers DC, Indianapolis",
        "city": "Indianapolis, IN",
        "type": "dc",
        "aliases": ["Metro Grocers Indy", "Metro Indianapolis"],
    },
    "HPF-PLANT": {
        "name": "Harbor Point Foods plant",
        "city": "Green Bay, WI",
        "type": "plant",
        "aliases": ["Green Bay plant", "GB plant", "GB PLANT"],
    },
    "HPF-COLD": {
        "name": "Harbor Point Foods cold storage",
        "city": "Milwaukee, WI",
        "type": "dc",
        "aliases": ["Milwaukee cold storage", "the Milwaukee freezer", "MKE CS"],
    },
    "RBS-YARD": {
        "name": "Ridgeline Building Supply yard",
        "city": "Elgin, IL",
        "type": "yard",
        "aliases": ["Elgin yard", "our yard"],
    },
    "OAK-NAP": {
        "name": "Oakbrook Homes job site",
        "city": "Naperville, IL",
        "type": "jobsite",
        "aliases": ["Oakbrook Homes Naperville", "the Naperville site"],
    },
    "CCH-PLANT": {"name": "Calder Chemical plant", "city": "Gary, IN", "type": "plant", "aliases": ["Gary plant", "Calder Gary"]},
    "PRC-WH": {
        "name": "Prairie Coatings warehouse",
        "city": "Rockford, IL",
        "type": "dc",
        "aliases": ["Prairie Coatings Rockford", "Prairie Coatings"],
    },
    "LHG-DC": {"name": "Lakeshore Home Goods DC", "city": "Kenosha, WI", "type": "dc", "aliases": ["Kenosha DC", "our DC"]},
    "LHG-S14": {
        "name": "Lakeshore Home Goods store 14",
        "city": "Schaumburg, IL",
        "type": "store",
        "aliases": ["store 14", "store #14", "Schaumburg store"],
    },
    "LHG-S22": {
        "name": "Lakeshore Home Goods store 22",
        "city": "Oak Park, IL",
        "type": "store",
        "aliases": ["store 22", "store #22", "Oak Park store"],
    },
}

EQUIPMENT = ["dry_van_53", "reefer_53", "flatbed_48"]
ACCESSORIALS = ["appointment", "liftgate", "tarps", "driver_assist"]

# Each account's rules, as the operators explained them. The model gets these in the prompt;
# code re-checks the ones a rule can state exactly (see rules.py).
ACCOUNTS = {
    "NGP": {
        "name": "Northgate Paper Co.",
        "domain": "northgatepaper.example",
        "equipment": ["dry_van_53"],
        "rules": [
            "The reference is the Load Tender number (LT- followed by five digits). Never use the PO number as the reference.",
            "Equipment is 53 ft dry van.",
            "Every delivery needs an appointment: set delivery_appt_required true and add the appointment accessorial.",
            "If no pickup window is given for the Appleton mill, use 06:00-14:00 (the mill's shipping hours).",
        ],
    },
    "HPF": {
        "name": "Harbor Point Foods",
        "domain": "harborpointfoods.example",
        "equipment": ["reefer_53"],
        "required": ["pallets"],
        "rules": [
            "The reference is their PO number.",
            "Equipment is 53 ft reefer. If no temperature is given, the load ships frozen at -10 F.",
            "A pallet count is required on every order. If it is missing, do not guess.",
            "Deliveries to any Metro Grocers DC need an appointment: set delivery_appt_required true and add the appointment accessorial.",
        ],
    },
    "RBS": {
        "name": "Ridgeline Building Supply",
        "domain": "ridgelinebuild.example",
        "equipment": ["flatbed_48"],
        "rules": [
            "The reference is their PO number.",
            "Equipment is 48 ft flatbed.",
            "Lumber and drywall must be tarped: add the tarps accessorial. Steel and rebar ship without tarps.",
            "They write relative dates (tomorrow, Thursday). Resolve them against the date the email was sent.",
        ],
    },
    "CCH": {
        "name": "Calder Chemical",
        "domain": "calderchem.example",
        "equipment": ["dry_van_53"],
        "rules": [
            "The reference is the Shipment No. (CS- followed by four digits).",
            "Equipment is 53 ft dry van.",
            "Any hazardous material (a UN number, a hazard class, flammable or corrosive) goes to an operator, who checks the safety data sheet and placards before the load is booked. Set hazmat true and copy the UN number if one is given.",
        ],
    },
    "LHG": {
        "name": "Lakeshore Home Goods",
        "domain": "lakeshorehome.example",
        "equipment": ["dry_van_53"],
        "rules": [
            "The reference is their Order # (five digits).",
            "Equipment is 53 ft dry van.",
            "Their customer service team forwards orders. In a forwarded thread, the latest message wins over anything quoted below it.",
            "Deliveries to a store (not the DC) need a liftgate: add the liftgate accessorial.",
        ],
    },
}

DOMAINS = {a["domain"]: code for code, a in ACCOUNTS.items()}

# Orders already in the TMS (for duplicate checks, changes and cancellations).
OPEN_ORDERS = {
    ("NGP", "LT-48810"): {"pickup_date": "2026-12-08", "delivery_date": "2026-12-09"},
    ("RBS", "7731-A"): {"pickup_date": "2026-12-10", "delivery_date": "2026-12-11"},
    ("LHG", "55102"): {"pickup_date": "2026-12-09", "delivery_date": "2026-12-10"},
}


def account_for(sender: str) -> str | None:
    """The account an email belongs to, from the sender's domain. Code decides this, not the model."""
    domain = sender.rsplit("@", 1)[-1].strip().lower().rstrip(">")
    return DOMAINS.get(domain)


def directory_for_prompt() -> list[dict]:
    return [
        {"code": code, "name": f["name"], "city": f["city"], "type": f["type"], "also_called": f["aliases"]}
        for code, f in FACILITIES.items()
    ]
