"""Write evals/cases.yml: 30 shipment-request emails from five fictional shipper accounts.

Groups:
  clean      (10) labelled tenders and plain emails that should post on their own
  formats    (7)  spreadsheets, forwarded threads, shorthand, nicknames, relative dates
  rules      (5)  orders that are only right if the account's own rule is applied
  exceptions (8)  hazmat, duplicates, changes, cancellations, a missing pallet count,
                  an ambiguous facility and an email that is not an order: none may post

All companies, people, addresses, phone numbers and numbers are invented.
"""

from pathlib import Path

import yaml

NGP, HPF, RBS, CCH, LHG = (
    "dispatch@northgatepaper.example",
    "orders@harborpointfoods.example",
    "purchasing@ridgelinebuild.example",
    "logistics@calderchem.example",
    "cs@lakeshorehome.example",
)
DESK = "orders@lanternfreight.example"


def email(sender, date, subject, body, attachments=()):
    return {"from": sender, "to": DESK, "date": date, "subject": subject, "body": body.strip("\n"),
            "attachments": [{"name": n, "text": t.strip("\n")} for n, t in attachments]}


def order(ref, pick, pdate, drop, ddate, equipment, weight, *, window=None, appt=False, temp=None, pallets=None,
          hazmat=False, un=None, acc=()):
    return {"customer_ref": ref, "pickup_facility": pick, "pickup_date": pdate, "pickup_window": window,
            "delivery_facility": drop, "delivery_date": ddate, "delivery_appt_required": appt, "equipment": equipment,
            "temp_f": temp, "weight_lb": weight, "pallets": pallets, "hazmat": hazmat, "un_number": un,
            "accessorials": sorted(acc)}


def post(cid, group, title, mail, account, expected_order, rule=None):
    exp = {"route": "post", "account": account, "order": expected_order}
    if rule:
        exp["rule"] = rule
    return {"id": cid, "group": group, "title": title, "input": {"email": mail}, "expected": exp}


def hold(cid, title, mail, account, reasons):
    return {"id": cid, "group": "exceptions", "title": title, "input": {"email": mail},
            "expected": {"route": "operator", "account": account, "reasons": reasons}}


NGP_PDF = """
NORTHGATE PAPER CO.                      LOAD TENDER
Load Tender: {lt}            PO: {po}
Ship from: Northgate Paper Co., Appleton mill, 1200 River Rd, Appleton, WI
Pickup: {pd} {win}
Ship to: {to}
Deliver: {dd}
Commodity: {com}
Weight: {wt} lbs      Pallets: {pl}
Equipment: 53' Dry Van
Please confirm by reply.
"""

CASES = [
    # ---------------- clean ----------------
    post("c01", "clean", "Labelled PDF tender, mill to Romeoville DC",
         email(NGP, "2026-12-07T08:12:00-06:00", "Load Tender LT-48822", "Tender attached, please confirm.\n\nNorthgate Dispatch",
               [("LT-48822.pdf", NGP_PDF.format(lt="LT-48822", po="4500-1182", pd="12/08/2026", win="07:00-11:00",
                                               to="Northgate Paper Co., Romeoville DC, 300 Joliet Rd, Romeoville, IL",
                                               dd="12/09/2026", com="Coated paper rolls", wt="41,200", pl="22"))]),
         "NGP", order("LT-48822", "NGP-MILL", "2026-12-08", "NGP-DC", "2026-12-09", "dry_van_53", 41200,
                      window="07:00-11:00", appt=True, pallets=22, acc=["appointment"])),
    post("c02", "clean", "Labelled PDF tender, mill to Metro Grocers Joliet",
         email(NGP, "2026-12-07T09:40:00-06:00", "Load Tender LT-48830", "New tender attached.",
               [("LT-48830.pdf", NGP_PDF.format(lt="LT-48830", po="4500-1190", pd="12/09/2026", win="08:00-12:00",
                                               to="Metro Grocers DC, Joliet, 2100 Channahon Rd, Joliet, IL",
                                               dd="12/10/2026", com="Paper towels, cased", wt="18,600", pl="26"))]),
         "NGP", order("LT-48830", "NGP-MILL", "2026-12-09", "MG-JOL", "2026-12-10", "dry_van_53", 18600,
                      window="08:00-12:00", appt=True, pallets=26, acc=["appointment"])),
    post("c03", "clean", "Plain email, frozen fish to Milwaukee cold storage",
         email(HPF, "2026-12-07T07:55:00-06:00", "Reefer needed Thu",
               """Hi team,

Need a reefer Thursday 12/10 from our Green Bay plant to the Milwaukee cold storage, delivering Friday 12/11.
PO 30417. 18 pallets, 36,500 lbs frozen fish fillets, keep at -10F.

Thanks,
Dana, Harbor Point Foods"""),
         "HPF", order("30417", "HPF-PLANT", "2026-12-10", "HPF-COLD", "2026-12-11", "reefer_53", 36500, temp=-10, pallets=18)),
    post("c04", "clean", "Plain email, fresh cheese to Metro Grocers Indianapolis",
         email(HPF, "2026-12-08T10:05:00-06:00", "PO 30422 to Metro Indy",
               """Please book PO 30422: pick up 12/09 at the Green Bay plant, deliver 12/10 to Metro Grocers DC, Indianapolis.
14 pallets fresh cheese, 21,800 lbs. Hold at 34F.

Dana"""),
         "HPF", order("30422", "HPF-PLANT", "2026-12-09", "MG-IND", "2026-12-10", "reefer_53", 21800, temp=34, pallets=14,
                      appt=True, acc=["appointment"])),
    post("c05", "clean", "Lumber to a job site, dates written out",
         email(RBS, "2026-12-07T06:30:00-06:00", "PO 7745 flatbed",
               """PO 7745: 24 bundles of lumber, 44,000 lbs.
Pick up at our Elgin yard Thursday 12/10, deliver to the Oakbrook Homes job site in Naperville Friday 12/11.
Flatbed please.

Mike R., Ridgeline Building Supply"""),
         "RBS", order("7745", "RBS-YARD", "2026-12-10", "OAK-NAP", "2026-12-11", "flatbed_48", 44000, acc=["tarps"])),
    post("c06", "clean", "Rebar to a job site, no tarps",
         email(RBS, "2026-12-08T13:15:00-06:00", "PO 7752",
               """PO 7752, rebar, 38,000 lbs. Elgin yard pickup 12/09, deliver Oakbrook Homes Naperville 12/10. Flatbed.
Mike"""),
         "RBS", order("7752", "RBS-YARD", "2026-12-09", "OAK-NAP", "2026-12-10", "flatbed_48", 38000)),
    post("c07", "clean", "Non-regulated drums, plant to customer warehouse",
         email(CCH, "2026-12-07T11:20:00-06:00", "Shipment No. CS-2291",
               """Shipment No. CS-2291
Pickup: Calder Chemical plant, Gary IN, 12/09
Deliver: Prairie Coatings warehouse, Rockford IL, 12/10
20 drums water-based latex binder (not regulated for transport), 16,800 lbs, 5 pallets.

Calder Logistics"""),
         "CCH", order("CS-2291", "CCH-PLANT", "2026-12-09", "PRC-WH", "2026-12-10", "dry_van_53", 16800, pallets=5)),
    post("c08", "clean", "Store replenishment, Kenosha DC to store 14",
         email(LHG, "2026-12-07T15:02:00-06:00", "Order # 55130",
               """Order # 55130
From our Kenosha DC to store 14 (Schaumburg).
Pick up 12/08, deliver 12/09.
9 pallets housewares, 7,400 lbs.

Lakeshore Home Goods Customer Service"""),
         "LHG", order("55130", "LHG-DC", "2026-12-08", "LHG-S14", "2026-12-09", "dry_van_53", 7400, pallets=9, acc=["liftgate"])),
    post("c09", "clean", "Store replenishment, Kenosha DC to store 22",
         email(LHG, "2026-12-08T09:30:00-06:00", "Order # 55141",
               """Order # 55141: Kenosha DC to the Oak Park store (store 22), pick up 12/10, deliver 12/11. 6 pallets, 5,100 lbs, small furniture.
Thanks!"""),
         "LHG", order("55141", "LHG-DC", "2026-12-10", "LHG-S22", "2026-12-11", "dry_van_53", 5100, pallets=6, acc=["liftgate"])),
    post("c10", "clean", "Labelled PDF tender, mill to Metro Grocers Indianapolis",
         email(NGP, "2026-12-08T08:00:00-06:00", "Load Tender LT-48851", "Attached.",
               [("LT-48851.pdf", NGP_PDF.format(lt="LT-48851", po="4500-1203", pd="12/10/2026", win="06:00-10:00",
                                               to="Metro Grocers DC, Indianapolis, 5500 W Raymond St, Indianapolis, IN",
                                               dd="12/11/2026", com="Toilet tissue, cased", wt="16,950", pl="30"))]),
         "NGP", order("LT-48851", "NGP-MILL", "2026-12-10", "MG-IND", "2026-12-11", "dry_van_53", 16950,
                      window="06:00-10:00", appt=True, pallets=30, acc=["appointment"])),
    # ---------------- formats ----------------
    post("f01", "formats", "Spreadsheet attachment, body says see attached",
         email(HPF, "2026-12-07T14:45:00-06:00", "loads for next week", "See attached. One load this time.\n\nDana",
               [("HPF_loads_wk50.csv", """PO,Ship From,Ship To,Pickup Date,Delivery Date,Pallets,Weight (lb),Product,Temp
30431,Green Bay plant,Metro Grocers Joliet,2026-12-14,2026-12-15,20,33400,Frozen breaded shrimp,-10""")]),
         "HPF", order("30431", "HPF-PLANT", "2026-12-14", "MG-JOL", "2026-12-15", "reefer_53", 33400, temp=-10, pallets=20,
                      appt=True, acc=["appointment"])),
    post("f02", "formats", "PDF tender with the columns run together",
         email(NGP, "2026-12-08T16:10:00-06:00", "LT-48860", "",
               [("LT-48860.pdf", """NORTHGATE PAPER CO. LOAD TENDER Load Tender:LT-48860 PO:4500-1211 Ship from:Northgate Paper Co., Appleton mill
Pickup:12/11/2026 09:00-13:00Ship to:Northgate Paper Co., Romeoville DC Deliver:12/12/2026 Commodity:Kraft paper rolls
Weight:42150 LB Pallets:24 Equipment:53' Dry Van""")]),
         "NGP", order("LT-48860", "NGP-MILL", "2026-12-11", "NGP-DC", "2026-12-12", "dry_van_53", 42150,
                      window="09:00-13:00", appt=True, pallets=24, acc=["appointment"])),
    post("f03", "formats", "Forwarded thread, the latest message moves the delivery date",
         email(LHG, "2026-12-08T11:47:00-06:00", "Fwd: Order # 55137",
               """Please book with delivery on 12/11 instead, the store asked us to push it a day. Everything else is the same.

Jess, Lakeshore CS

---------- Forwarded message ---------
From: Store 14 Receiving
Date: Mon, Dec 7, 2026
Subject: Order # 55137

Order # 55137, Kenosha DC to store 14 Schaumburg. Pick up 12/09, deliver 12/10. 11 pallets, 8,900 lbs, bedding."""),
         "LHG", order("55137", "LHG-DC", "2026-12-09", "LHG-S14", "2026-12-11", "dry_van_53", 8900, pallets=11, acc=["liftgate"])),
    post("f04", "formats", "Relative dates (tomorrow, Wednesday)",
         email(RBS, "2026-12-07T07:05:00-06:00", "truck tomorrow",
               """Need a flatbed tomorrow at the Elgin yard for PO 7758, going to the Naperville site, deliver Wednesday.
Steel joists, 31,500 lbs.
Mike"""),
         "RBS", order("7758", "RBS-YARD", "2026-12-08", "OAK-NAP", "2026-12-09", "flatbed_48", 31500)),
    post("f05", "formats", "Facility by nickname (the Milwaukee freezer)",
         email(HPF, "2026-12-08T08:25:00-06:00", "PO 30426",
               """PO 30426 from the GB plant into the Milwaukee freezer. Pick up 12/10, deliver 12/10 same day.
16 pallets frozen vegetables, 29,700 lbs, -5F please."""),
         "HPF", order("30426", "HPF-PLANT", "2026-12-10", "HPF-COLD", "2026-12-10", "reefer_53", 29700, temp=-5, pallets=16)),
    post("f06", "formats", "All-caps shorthand with 38K for the weight",
         email(HPF, "2026-12-08T05:50:00-06:00", "PO 30428 P/U 12/9",
               """PO 30428
P/U 12/9 GB PLANT 0600-1000
DEL 12/10 MKE CS
20 PLTS 38K LBS FROZEN PIZZA -10F"""),
         "HPF", order("30428", "HPF-PLANT", "2026-12-09", "HPF-COLD", "2026-12-10", "reefer_53", 38000, temp=-10, pallets=20,
                      window="06:00-10:00")),
    post("f07", "formats", "Order buried under a signature full of other numbers",
         email(CCH, "2026-12-08T12:35:00-06:00", "RE: next week",
               """Yes, go ahead with Shipment No. CS-2304: Gary plant to Prairie Coatings in Rockford, pick up 12/14, deliver 12/15.
24 drums acrylic resin (not regulated for transport), 19,200 lbs on 6 pallets.

Thanks,
Priya Nair | Logistics Coordinator | Calder Chemical
Office 219-555-0148 | Mobile 219-555-0193 | Fax 219-555-0110
Plant: 4400 Industrial Hwy, Gary IN 46406 | Account 88213"""),
         "CCH", order("CS-2304", "CCH-PLANT", "2026-12-14", "PRC-WH", "2026-12-15", "dry_van_53", 19200, pallets=6)),
    # ---------------- rules ----------------
    post("a01", "rules", "Tender shows a PO and a Load Tender number: the reference is the LT",
         email(NGP, "2026-12-08T10:30:00-06:00", "PO 4500-1220 ready",
               """PO 4500-1220 is ready to ship. Load Tender LT-48866.
Appleton mill pickup 12/10 08:00-12:00, deliver Romeoville DC 12/11.
40,800 lbs coated paper rolls, 22 pallets."""),
         "NGP", order("LT-48866", "NGP-MILL", "2026-12-10", "NGP-DC", "2026-12-11", "dry_van_53", 40800,
                      window="08:00-12:00", appt=True, pallets=22, acc=["appointment"]), rule="reference is the LT number"),
    post("a02", "rules", "No temperature given: frozen at -10 F by account rule",
         email(HPF, "2026-12-08T13:40:00-06:00", "PO 30433",
               """PO 30433: Green Bay plant to Milwaukee cold storage, pick up 12/11, deliver 12/11. 12 pallets fish sticks, 18,300 lbs."""),
         "HPF", order("30433", "HPF-PLANT", "2026-12-11", "HPF-COLD", "2026-12-11", "reefer_53", 18300, temp=-10, pallets=12),
         rule="frozen at -10 F when no temperature is given"),
    post("a03", "rules", "Drywall must be tarped",
         email(RBS, "2026-12-08T07:20:00-06:00", "PO 7761",
               """PO 7761, 60 sheets x 12 bundles drywall, 42,000 lbs. Elgin yard 12/10, Oakbrook Homes Naperville 12/10 afternoon."""),
         "RBS", order("7761", "RBS-YARD", "2026-12-10", "OAK-NAP", "2026-12-10", "flatbed_48", 42000, acc=["tarps"]),
         rule="tarps for drywall"),
    post("a04", "rules", "Store delivery needs a liftgate though the email does not say so",
         email(LHG, "2026-12-09T10:10:00-06:00", "Order # 55150",
               """Order # 55150, Kenosha DC to Schaumburg store, 12/10 pickup, 12/11 delivery, 4 pallets, 3,200 lbs, lamps."""),
         "LHG", order("55150", "LHG-DC", "2026-12-10", "LHG-S14", "2026-12-11", "dry_van_53", 3200, pallets=4, acc=["liftgate"]),
         rule="liftgate for store deliveries"),
    post("a05", "rules", "No pickup window: the mill's shipping hours apply",
         email(NGP, "2026-12-09T08:45:00-06:00", "Load Tender LT-48871",
               """Load Tender LT-48871. Appleton mill to Metro Grocers Joliet. Pick up 12/11, deliver 12/14.
17,900 lbs paper towels, 26 pallets."""),
         "NGP", order("LT-48871", "NGP-MILL", "2026-12-11", "MG-JOL", "2026-12-14", "dry_van_53", 17900,
                      window="06:00-14:00", appt=True, pallets=26, acc=["appointment"]), rule="mill window 06:00-14:00"),
    # ---------------- exceptions ----------------
    hold("x01", "Hazmat with a UN number and class",
         email(CCH, "2026-12-08T09:15:00-06:00", "Shipment No. CS-2299",
               """Shipment No. CS-2299: 40 pails paint, UN1263, Class 3, PG II, 14,200 lbs, 8 pallets.
Gary plant to Prairie Coatings Rockford, pick up 12/10, deliver 12/11. SDS attached.""",
               [("SDS_paint.pdf", "SAFETY DATA SHEET  Product: Solvent paint  UN1263  Class 3 Flammable liquid  Packing group II")]),
         "CCH", ["hazmat"]),
    hold("x02", "Hazmat described in words only",
         email(CCH, "2026-12-09T14:00:00-06:00", "Shipment No. CS-2307",
               """Shipment No. CS-2307, Gary plant to Rockford (Prairie Coatings), 12/11 pickup, 12/14 delivery.
12 drums cleaning solvent, flammable, 6,600 lbs, 3 pallets."""),
         "CCH", ["hazmat"]),
    hold("x03", "Duplicate: a tender already in the TMS sent again",
         email(NGP, "2026-12-07T10:02:00-06:00", "Resend: Load Tender LT-48810",
               "Resending in case it did not come through. Thanks.",
               [("LT-48810.pdf", NGP_PDF.format(lt="LT-48810", po="4500-1170", pd="12/08/2026", win="07:00-11:00",
                                               to="Northgate Paper Co., Romeoville DC", dd="12/09/2026",
                                               com="Coated paper rolls", wt="40,950", pl="22"))]),
         "NGP", ["duplicate"]),
    hold("x04", "Change to an order already sent",
         email(RBS, "2026-12-08T15:30:00-06:00", "Change on PO 7731-A",
               """Change on PO 7731-A: push delivery to Monday 12/14, pickup stays 12/10. Same load, 36,000 lbs lumber.
Mike"""),
         "RBS", ["change_request"]),
    hold("x05", "Cancellation",
         email(LHG, "2026-12-08T16:45:00-06:00", "Cancel Order # 55102",
               "Please cancel Order # 55102, the store no longer needs it. Sorry for the late notice."),
         "LHG", ["cancel_request"]),
    hold("x06", "Pallet count missing on an account that requires it",
         email(HPF, "2026-12-09T07:30:00-06:00", "PO 30440",
               """PO 30440, Green Bay plant to Milwaukee cold storage, 12/11 to 12/11, 27,000 lbs frozen chicken, -10F."""),
         "HPF", ["missing_field:pallets", "uncertain:pallets"]),
    hold("x07", "Two Metro Grocers DCs could fit",
         email(HPF, "2026-12-09T11:00:00-06:00", "PO 30442",
               """PO 30442 to the Metro Grocers DC, pick up Green Bay plant 12/14, deliver 12/15. 18 pallets ice cream, 24,600 lbs, -20F."""),
         "HPF", ["uncertain:delivery_facility", "missing_field:delivery_facility"]),
    hold("x08", "A rate question, not an order",
         email(NGP, "2026-12-09T13:20:00-06:00", "Q1 rates",
               """Can you send your Q1 rates for Appleton mill to Atlanta and Appleton mill to Dallas, dry van, about 6 loads a week each?
Thanks"""),
         "NGP", ["not_an_order"]),
]


def main():
    assert len(CASES) == 30 and len({c["id"] for c in CASES}) == 30
    out = Path(__file__).resolve().parent.parent / "evals" / "cases.yml"
    header = ("# 30 shipment-request emails for a fictional carrier's order desk. Generated by scripts/make_cases.py;\n"
              "# edit that file, not this one. All companies, people, addresses and numbers are made up.\n")
    out.write_text(header + yaml.safe_dump({"cases": CASES}, sort_keys=False, allow_unicode=True, width=120))
    print(f"wrote {len(CASES)} cases to {out}")


if __name__ == "__main__":
    main()
