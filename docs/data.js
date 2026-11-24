window.DATA = {
 "accounts": {
  "CCH": {
   "critical": 0,
   "emails": 4,
   "misses": 1,
   "name": "Calder Chemical",
   "posted": 6,
   "rules": [
    "The reference is the Shipment No. (CS- followed by four digits).",
    "Equipment is 53 ft dry van.",
    "Any hazardous material (a UN number, a hazard class, flammable or corrosive) goes to an operator, who checks the safety data sheet and placards before the load is booked. Set hazmat true and copy the UN number if one is given."
   ],
   "runs": 12,
   "should_post": 6,
   "stage": "shadow",
   "supports": "approve"
  },
  "HPF": {
   "critical": 0,
   "emails": 8,
   "misses": 0,
   "name": "Harbor Point Foods",
   "posted": 18,
   "rules": [
    "The reference is their PO number.",
    "Equipment is 53 ft reefer. If no temperature is given, the load ships frozen at -10 F.",
    "A pallet count is required on every order. If it is missing, do not guess.",
    "Deliveries to any Metro Grocers DC need an appointment: set delivery_appt_required true and add the appointment accessorial."
   ],
   "runs": 24,
   "should_post": 18,
   "stage": "shadow",
   "supports": "auto"
  },
  "LHG": {
   "critical": 0,
   "emails": 5,
   "misses": 0,
   "name": "Lakeshore Home Goods",
   "posted": 12,
   "rules": [
    "The reference is their Order # (five digits).",
    "Equipment is 53 ft dry van.",
    "Their customer service team forwards orders. In a forwarded thread, the latest message wins over anything quoted below it.",
    "Deliveries to a store (not the DC) need a liftgate: add the liftgate accessorial."
   ],
   "runs": 15,
   "should_post": 12,
   "stage": "shadow",
   "supports": "auto"
  },
  "NGP": {
   "critical": 0,
   "emails": 8,
   "misses": 0,
   "name": "Northgate Paper Co.",
   "posted": 18,
   "rules": [
    "The reference is the Load Tender number (LT- followed by five digits). Never use the PO number as the reference.",
    "Equipment is 53 ft dry van.",
    "Every delivery needs an appointment: set delivery_appt_required true and add the appointment accessorial.",
    "If no pickup window is given for the Appleton mill, use 06:00-14:00 (the mill's shipping hours)."
   ],
   "runs": 24,
   "should_post": 18,
   "stage": "shadow",
   "supports": "auto"
  },
  "RBS": {
   "critical": 0,
   "emails": 5,
   "misses": 0,
   "name": "Ridgeline Building Supply",
   "posted": 12,
   "rules": [
    "The reference is their PO number.",
    "Equipment is 48 ft flatbed.",
    "Lumber and drywall must be tarped: add the tarps accessorial. Steel and rebar ship without tarps.",
    "They write relative dates (tomorrow, Thursday). Resolve them against the date the email was sent."
   ],
   "runs": 15,
   "should_post": 12,
   "stage": "shadow",
   "supports": "auto"
  }
 },
 "agent": {
  "by_run": [
   {
    "critical": 0,
    "passed": 30,
    "run": 1,
    "total": 30
   },
   {
    "critical": 0,
    "passed": 30,
    "run": 2,
    "total": 30
   },
   {
    "critical": 0,
    "passed": 29,
    "run": 3,
    "total": 30
   }
  ],
  "decision": "no-go",
  "reasons": [
   "run 3: exceptions passed 7 of 8, needs 8 (no-go)"
  ]
 },
 "calls": 114,
 "cases": [
  {
   "agent": {
    "cost_usd": 0.0221,
    "crit": false,
    "failed": [],
    "latency_s": 3.29,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required, appointment accessorial added"
     ],
     "evidence": {
      "customer_ref": "Load Tender: LT-48822",
      "weight": "Weight: 41,200 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Coated paper rolls",
      "customer_ref": "LT-48822",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-09",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-08",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "07:00-11:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 41200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Coated paper rolls",
      "equipment": "dry_van_53",
      "pallets": 22,
      "reference": "LT-48822",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "07:00-11:00"
       },
       {
        "appointment": true,
        "date": "2026-12-09",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 41200
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "LT-48822.pdf",
      "text": "NORTHGATE PAPER CO.                      LOAD TENDER\nLoad Tender: LT-48822            PO: 4500-1182\nShip from: Northgate Paper Co., Appleton mill, 1200 River Rd, Appleton, WI\nPickup: 12/08/2026 07:00-11:00\nShip to: Northgate Paper Co., Romeoville DC, 300 Joliet Rd, Romeoville, IL\nDeliver: 12/09/2026\nCommodity: Coated paper rolls\nWeight: 41,200 lbs      Pallets: 22\nEquipment: 53' Dry Van\nPlease confirm by reply."
     }
    ],
    "body": "Tender attached, please confirm.\n\nNorthgate Dispatch",
    "date": "2026-12-07T08:12:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Load Tender LT-48822",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48822",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-09",
     "delivery_facility": "NGP-DC",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 22,
     "pickup_date": "2026-12-08",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "07:00-11:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 41200
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c01",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "LT-48822",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-09",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-08",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "07:00-11:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 41200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 22,
      "reference": "LT-48822",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "07:00-11:00"
       },
       {
        "appointment": true,
        "date": "2026-12-09",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 41200
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Labelled PDF tender, mill to Romeoville DC"
  },
  {
   "agent": {
    "cost_usd": 0.022292,
    "crit": false,
    "failed": [],
    "latency_s": 3.876,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required, appointment accessorial added",
      "Appleton default window not needed (window given)"
     ],
     "evidence": {
      "customer_ref": "Load Tender: LT-48830",
      "weight": "Weight: 18,600 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Paper towels, cased",
      "customer_ref": "LT-48830",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-10",
      "delivery_facility": "MG-JOL",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 26,
      "pickup_date": "2026-12-09",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "08:00-12:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 18600
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Paper towels, cased",
      "equipment": "dry_van_53",
      "pallets": 26,
      "reference": "LT-48830",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "08:00-12:00"
       },
       {
        "appointment": true,
        "date": "2026-12-10",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 18600
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "LT-48830.pdf",
      "text": "NORTHGATE PAPER CO.                      LOAD TENDER\nLoad Tender: LT-48830            PO: 4500-1190\nShip from: Northgate Paper Co., Appleton mill, 1200 River Rd, Appleton, WI\nPickup: 12/09/2026 08:00-12:00\nShip to: Metro Grocers DC, Joliet, 2100 Channahon Rd, Joliet, IL\nDeliver: 12/10/2026\nCommodity: Paper towels, cased\nWeight: 18,600 lbs      Pallets: 26\nEquipment: 53' Dry Van\nPlease confirm by reply."
     }
    ],
    "body": "New tender attached.",
    "date": "2026-12-07T09:40:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Load Tender LT-48830",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48830",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-10",
     "delivery_facility": "MG-JOL",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 26,
     "pickup_date": "2026-12-09",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "08:00-12:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 18600
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c02",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "LT-48830",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-10",
      "delivery_facility": "MG-JOL",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 26,
      "pickup_date": "2026-12-09",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "08:00-12:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 18600
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 26,
      "reference": "LT-48830",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "08:00-12:00"
       },
       {
        "appointment": true,
        "date": "2026-12-10",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 18600
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Labelled PDF tender, mill to Metro Grocers Joliet"
  },
  {
   "agent": {
    "cost_usd": 0.02074,
    "crit": false,
    "failed": [],
    "latency_s": 3.41,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 53 ft reefer at -10 F",
      "Pallet count present (18)"
     ],
     "evidence": {
      "customer_ref": "PO 30417",
      "weight": "36,500 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "frozen fish fillets",
      "customer_ref": "30417",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 18,
      "pickup_date": "2026-12-10",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 36500
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "frozen fish fillets",
      "equipment": "reefer_53",
      "pallets": 18,
      "reference": "30417",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 36500
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Hi team,\n\nNeed a reefer Thursday 12/10 from our Green Bay plant to the Milwaukee cold storage, delivering Friday 12/11.\nPO 30417. 18 pallets, 36,500 lbs frozen fish fillets, keep at -10F.\n\nThanks,\nDana, Harbor Point Foods",
    "date": "2026-12-07T07:55:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "Reefer needed Thu",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [],
     "customer_ref": "30417",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "HPF-COLD",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 18,
     "pickup_date": "2026-12-10",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": null,
     "temp_f": -10,
     "un_number": null,
     "weight_lb": 36500
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c03",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30417",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 18,
      "pickup_date": "2026-12-10",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 36500
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": 18,
      "reference": "30417",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 36500
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Plain email, frozen fish to Milwaukee cold storage"
  },
  {
   "agent": {
    "cost_usd": 0.02144,
    "crit": false,
    "failed": [],
    "latency_s": 3.943,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 53 ft reefer (temp given: 34F, frozen default not used)",
      "Pallet count present (14)",
      "Metro Grocers DC delivery: appointment required and appointment accessorial added"
     ],
     "evidence": {
      "customer_ref": "Please book PO 30422",
      "weight": "21,800 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "fresh cheese",
      "customer_ref": "30422",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-10",
      "delivery_facility": "MG-IND",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 14,
      "pickup_date": "2026-12-09",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": 34,
      "un_number": null,
      "weight_lb": 21800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "fresh cheese",
      "equipment": "reefer_53",
      "pallets": 14,
      "reference": "30422",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": true,
        "date": "2026-12-10",
        "facility": "MG-IND",
        "name": "Metro Grocers DC, Indianapolis",
        "type": "delivery"
       }
      ],
      "temp_f": 34,
      "weight_lb": 21800
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Please book PO 30422: pick up 12/09 at the Green Bay plant, deliver 12/10 to Metro Grocers DC, Indianapolis.\n14 pallets fresh cheese, 21,800 lbs. Hold at 34F.\n\nDana",
    "date": "2026-12-08T10:05:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30422 to Metro Indy",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "30422",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-10",
     "delivery_facility": "MG-IND",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 14,
     "pickup_date": "2026-12-09",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": null,
     "temp_f": 34,
     "un_number": null,
     "weight_lb": 21800
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c04",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30422",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "MG-IND",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 14,
      "pickup_date": "2026-12-09",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": 34,
      "un_number": null,
      "weight_lb": 21800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": 14,
      "reference": "30422",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "MG-IND",
        "name": "Metro Grocers DC, Indianapolis",
        "type": "delivery"
       }
      ],
      "temp_f": 34,
      "weight_lb": 21800
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "delivery_appt_required: False (should be True); accessorials: [] (should be ['appointment'])",
     "no_wrong_order_posted": "delivery_appt_required: False (should be True); accessorials: [] (should be ['appointment'])"
    }
   },
   "title": "Plain email, fresh cheese to Metro Grocers Indianapolis"
  },
  {
   "agent": {
    "cost_usd": 0.025808,
    "crit": false,
    "failed": [],
    "latency_s": 5.332,
    "out": {
     "account": "RBS",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 48 ft flatbed",
      "Lumber tarped: tarps accessorial added",
      "Relative dates resolved against email date (Thu 12/10, Fri 12/11 confirmed)"
     ],
     "evidence": {
      "customer_ref": "PO 7745",
      "weight": "44,000 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "tarps"
      ],
      "commodity": "Lumber, 24 bundles",
      "customer_ref": "7745",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-10",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 44000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "tarps"
      ],
      "commodity": "Lumber, 24 bundles",
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7745",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 44000
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 7745: 24 bundles of lumber, 44,000 lbs.\nPick up at our Elgin yard Thursday 12/10, deliver to the Oakbrook Homes job site in Naperville Friday 12/11.\nFlatbed please.\n\nMike R., Ridgeline Building Supply",
    "date": "2026-12-07T06:30:00-06:00",
    "from": "purchasing@ridgelinebuild.example",
    "subject": "PO 7745 flatbed",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "RBS",
    "order": {
     "accessorials": [
      "tarps"
     ],
     "customer_ref": "7745",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "OAK-NAP",
     "equipment": "flatbed_48",
     "hazmat": false,
     "pallets": null,
     "pickup_date": "2026-12-10",
     "pickup_facility": "RBS-YARD",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 44000
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c05",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "RBS",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "7745",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-10",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 44000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7745",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 44000
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "accessorials: [] (should be ['tarps'])",
     "no_wrong_order_posted": "accessorials: [] (should be ['tarps'])"
    }
   },
   "title": "Lumber to a job site, dates written out"
  },
  {
   "agent": {
    "cost_usd": 0.020524,
    "crit": false,
    "failed": [],
    "latency_s": 3.464,
    "out": {
     "account": "RBS",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 48 ft flatbed",
      "Rebar ships without tarps",
      "Dates resolved against email sent date"
     ],
     "evidence": {
      "customer_ref": "PO 7752",
      "weight": "38,000 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "rebar",
      "customer_ref": "7752",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-09",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 38000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "rebar",
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7752",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 38000
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 7752, rebar, 38,000 lbs. Elgin yard pickup 12/09, deliver Oakbrook Homes Naperville 12/10. Flatbed.\nMike",
    "date": "2026-12-08T13:15:00-06:00",
    "from": "purchasing@ridgelinebuild.example",
    "subject": "PO 7752",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "RBS",
    "order": {
     "accessorials": [],
     "customer_ref": "7752",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-10",
     "delivery_facility": "OAK-NAP",
     "equipment": "flatbed_48",
     "hazmat": false,
     "pallets": null,
     "pickup_date": "2026-12-09",
     "pickup_facility": "RBS-YARD",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 38000
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c06",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "RBS",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "7752",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-09",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 38000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7752",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 38000
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Rebar to a job site, no tarps"
  },
  {
   "agent": {
    "cost_usd": 0.021352,
    "crit": false,
    "failed": [],
    "latency_s": 3.556,
    "out": {
     "account": "CCH",
     "action": "posted",
     "applied_rules": [
      "Reference is Shipment No. CS-####",
      "Equipment 53 ft dry van",
      "Hazmat check: stated not regulated, no UN number or hazard class, hazmat false"
     ],
     "evidence": {
      "customer_ref": "Shipment No. CS-2291",
      "weight": "16,800 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "water-based latex binder in drums",
      "customer_ref": "CS-2291",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 5,
      "pickup_date": "2026-12-09",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 16800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "water-based latex binder in drums",
      "equipment": "dry_van_53",
      "pallets": 5,
      "reference": "CS-2291",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 16800
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Shipment No. CS-2291\nPickup: Calder Chemical plant, Gary IN, 12/09\nDeliver: Prairie Coatings warehouse, Rockford IL, 12/10\n20 drums water-based latex binder (not regulated for transport), 16,800 lbs, 5 pallets.\n\nCalder Logistics",
    "date": "2026-12-07T11:20:00-06:00",
    "from": "logistics@calderchem.example",
    "subject": "Shipment No. CS-2291",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "CCH",
    "order": {
     "accessorials": [],
     "customer_ref": "CS-2291",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-10",
     "delivery_facility": "PRC-WH",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 5,
     "pickup_date": "2026-12-09",
     "pickup_facility": "CCH-PLANT",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 16800
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c07",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "CCH",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "CS-2291",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 5,
      "pickup_date": "2026-12-09",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 16800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 5,
      "reference": "CS-2291",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 16800
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Non-regulated drums, plant to customer warehouse"
  },
  {
   "agent": {
    "cost_usd": 0.02056,
    "crit": false,
    "failed": [],
    "latency_s": 3.404,
    "out": {
     "account": "LHG",
     "action": "posted",
     "applied_rules": [
      "Reference is Order # (five digits)",
      "Equipment 53 ft dry van",
      "Store delivery requires liftgate"
     ],
     "evidence": {
      "customer_ref": "Order # 55130",
      "weight": "7,400 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "housewares",
      "customer_ref": "55130",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-09",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 9,
      "pickup_date": "2026-12-08",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 7400
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "housewares",
      "equipment": "dry_van_53",
      "pallets": 9,
      "reference": "55130",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-09",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 7400
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Order # 55130\nFrom our Kenosha DC to store 14 (Schaumburg).\nPick up 12/08, deliver 12/09.\n9 pallets housewares, 7,400 lbs.\n\nLakeshore Home Goods Customer Service",
    "date": "2026-12-07T15:02:00-06:00",
    "from": "cs@lakeshorehome.example",
    "subject": "Order # 55130",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "LHG",
    "order": {
     "accessorials": [
      "liftgate"
     ],
     "customer_ref": "55130",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-09",
     "delivery_facility": "LHG-S14",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 9,
     "pickup_date": "2026-12-08",
     "pickup_facility": "LHG-DC",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 7400
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c08",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "LHG",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55130",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-09",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 9,
      "pickup_date": "2026-12-08",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 7400
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 9,
      "reference": "55130",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-09",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 7400
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "accessorials: [] (should be ['liftgate'])",
     "no_wrong_order_posted": "accessorials: [] (should be ['liftgate'])"
    }
   },
   "title": "Store replenishment, Kenosha DC to store 14"
  },
  {
   "agent": {
    "cost_usd": 0.020504,
    "crit": false,
    "failed": [],
    "latency_s": 3.833,
    "out": {
     "account": "LHG",
     "action": "posted",
     "applied_rules": [
      "Reference is Order # (five digits)",
      "Equipment 53 ft dry van",
      "Store delivery: liftgate added"
     ],
     "evidence": {
      "customer_ref": "Order # 55141",
      "weight": "5,100 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "small furniture",
      "customer_ref": "55141",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "LHG-S22",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 6,
      "pickup_date": "2026-12-10",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 5100
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "small furniture",
      "equipment": "dry_van_53",
      "pallets": 6,
      "reference": "55141",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "LHG-S22",
        "name": "Lakeshore Home Goods store 22",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 5100
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Order # 55141: Kenosha DC to the Oak Park store (store 22), pick up 12/10, deliver 12/11. 6 pallets, 5,100 lbs, small furniture.\nThanks!",
    "date": "2026-12-08T09:30:00-06:00",
    "from": "cs@lakeshorehome.example",
    "subject": "Order # 55141",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "LHG",
    "order": {
     "accessorials": [
      "liftgate"
     ],
     "customer_ref": "55141",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "LHG-S22",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 6,
     "pickup_date": "2026-12-10",
     "pickup_facility": "LHG-DC",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 5100
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c09",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "LHG",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55141",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "LHG-S22",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 6,
      "pickup_date": "2026-12-10",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 5100
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 6,
      "reference": "55141",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "LHG-S22",
        "name": "Lakeshore Home Goods store 22",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 5100
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "accessorials: [] (should be ['liftgate'])",
     "no_wrong_order_posted": "accessorials: [] (should be ['liftgate'])"
    }
   },
   "title": "Store replenishment, Kenosha DC to store 22"
  },
  {
   "agent": {
    "cost_usd": 0.022024,
    "crit": false,
    "failed": [],
    "latency_s": 3.603,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required + appointment accessorial"
     ],
     "evidence": {
      "customer_ref": "Load Tender: LT-48851",
      "weight": "Weight: 16,950 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Toilet tissue, cased",
      "customer_ref": "LT-48851",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-11",
      "delivery_facility": "MG-IND",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 30,
      "pickup_date": "2026-12-10",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "06:00-10:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 16950
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Toilet tissue, cased",
      "equipment": "dry_van_53",
      "pallets": 30,
      "reference": "LT-48851",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "06:00-10:00"
       },
       {
        "appointment": true,
        "date": "2026-12-11",
        "facility": "MG-IND",
        "name": "Metro Grocers DC, Indianapolis",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 16950
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "LT-48851.pdf",
      "text": "NORTHGATE PAPER CO.                      LOAD TENDER\nLoad Tender: LT-48851            PO: 4500-1203\nShip from: Northgate Paper Co., Appleton mill, 1200 River Rd, Appleton, WI\nPickup: 12/10/2026 06:00-10:00\nShip to: Metro Grocers DC, Indianapolis, 5500 W Raymond St, Indianapolis, IN\nDeliver: 12/11/2026\nCommodity: Toilet tissue, cased\nWeight: 16,950 lbs      Pallets: 30\nEquipment: 53' Dry Van\nPlease confirm by reply."
     }
    ],
    "body": "Attached.",
    "date": "2026-12-08T08:00:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Load Tender LT-48851",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48851",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-11",
     "delivery_facility": "MG-IND",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 30,
     "pickup_date": "2026-12-10",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "06:00-10:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 16950
    },
    "route": "post"
   },
   "group": "clean",
   "id": "c10",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "LT-48851",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-11",
      "delivery_facility": "MG-IND",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 30,
      "pickup_date": "2026-12-10",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "06:00-10:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 16950
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 30,
      "reference": "LT-48851",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "06:00-10:00"
       },
       {
        "appointment": true,
        "date": "2026-12-11",
        "facility": "MG-IND",
        "name": "Metro Grocers DC, Indianapolis",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 16950
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Labelled PDF tender, mill to Metro Grocers Indianapolis"
  },
  {
   "agent": {
    "cost_usd": 0.021444,
    "crit": false,
    "failed": [],
    "latency_s": 3.691,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 53 ft reefer, temp -10 F as given",
      "Pallet count present (20)",
      "Metro Grocers DC delivery: appointment required and appointment accessorial added"
     ],
     "evidence": {
      "customer_ref": "30431",
      "weight": "33400"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Frozen breaded shrimp",
      "customer_ref": "30431",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-15",
      "delivery_facility": "MG-JOL",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 20,
      "pickup_date": "2026-12-14",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 33400
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Frozen breaded shrimp",
      "equipment": "reefer_53",
      "pallets": 20,
      "reference": "30431",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-14",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": true,
        "date": "2026-12-15",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 33400
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "HPF_loads_wk50.csv",
      "text": "PO,Ship From,Ship To,Pickup Date,Delivery Date,Pallets,Weight (lb),Product,Temp\n30431,Green Bay plant,Metro Grocers Joliet,2026-12-14,2026-12-15,20,33400,Frozen breaded shrimp,-10"
     }
    ],
    "body": "See attached. One load this time.\n\nDana",
    "date": "2026-12-07T14:45:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "loads for next week",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "30431",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-15",
     "delivery_facility": "MG-JOL",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 20,
     "pickup_date": "2026-12-14",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": null,
     "temp_f": -10,
     "un_number": null,
     "weight_lb": 33400
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f01",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": null,
      "delivery_appt_required": false,
      "delivery_date": "2026-12-15",
      "delivery_facility": "MG-JOL",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-14",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": null,
      "reference": null,
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-14",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-15",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": null
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "customer_ref: None (should be '30431'); delivery_appt_required: False (should be True); temp_f: None (should be -10); weight_lb: None (should be 33400); pallets: None (should be 20); accessorials: [] (should be ['appointment'])",
     "no_wrong_order_posted": "customer_ref: None (should be '30431'); delivery_appt_required: False (should be True); temp_f: None (should be -10); weight_lb: None (should be 33400); pallets: None (should be 20); accessorials: [] (should be ['appointment'])"
    }
   },
   "title": "Spreadsheet attachment, body says see attached"
  },
  {
   "agent": {
    "cost_usd": 0.021656,
    "crit": false,
    "failed": [],
    "latency_s": 3.165,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required + appointment accessorial"
     ],
     "evidence": {
      "customer_ref": "Load Tender:LT-48860",
      "weight": "Weight:42150 LB"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Kraft paper rolls",
      "customer_ref": "LT-48860",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-12",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 24,
      "pickup_date": "2026-12-11",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "09:00-13:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 42150
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Kraft paper rolls",
      "equipment": "dry_van_53",
      "pallets": 24,
      "reference": "LT-48860",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "09:00-13:00"
       },
       {
        "appointment": true,
        "date": "2026-12-12",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 42150
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "LT-48860.pdf",
      "text": "NORTHGATE PAPER CO. LOAD TENDER Load Tender:LT-48860 PO:4500-1211 Ship from:Northgate Paper Co., Appleton mill\nPickup:12/11/2026 09:00-13:00Ship to:Northgate Paper Co., Romeoville DC Deliver:12/12/2026 Commodity:Kraft paper rolls\nWeight:42150 LB Pallets:24 Equipment:53' Dry Van"
     }
    ],
    "body": "",
    "date": "2026-12-08T16:10:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "LT-48860",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48860",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-12",
     "delivery_facility": "NGP-DC",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 24,
     "pickup_date": "2026-12-11",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "09:00-13:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 42150
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f02",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "Load",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-12",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 24,
      "pickup_date": "2026-12-11",
      "pickup_facility": "NGP-MILL",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 42150
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 24,
      "reference": "Load",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": true,
        "date": "2026-12-12",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 42150
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "customer_ref: 'Load' (should be 'LT-48860'); pickup_window: None (should be '09:00-13:00')",
     "no_wrong_order_posted": "customer_ref: 'Load' (should be 'LT-48860'); pickup_window: None (should be '09:00-13:00')"
    }
   },
   "title": "PDF tender with the columns run together"
  },
  {
   "agent": {
    "cost_usd": 0.02464,
    "crit": false,
    "failed": [],
    "latency_s": 4.633,
    "out": {
     "account": "LHG",
     "action": "posted",
     "applied_rules": [
      "Reference is five-digit Order #",
      "Equipment 53 ft dry van",
      "Latest forwarded message wins: delivery 12/11",
      "Store delivery requires liftgate"
     ],
     "evidence": {
      "customer_ref": "Order # 55137, Kenosha DC to store 14 Schaumburg",
      "weight": "8,900 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "bedding",
      "customer_ref": "55137",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 11,
      "pickup_date": "2026-12-09",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 8900
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "bedding",
      "equipment": "dry_van_53",
      "pallets": 11,
      "reference": "55137",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 8900
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Please book with delivery on 12/11 instead, the store asked us to push it a day. Everything else is the same.\n\nJess, Lakeshore CS\n\n---------- Forwarded message ---------\nFrom: Store 14 Receiving\nDate: Mon, Dec 7, 2026\nSubject: Order # 55137\n\nOrder # 55137, Kenosha DC to store 14 Schaumburg. Pick up 12/09, deliver 12/10. 11 pallets, 8,900 lbs, bedding.",
    "date": "2026-12-08T11:47:00-06:00",
    "from": "cs@lakeshorehome.example",
    "subject": "Fwd: Order # 55137",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "LHG",
    "order": {
     "accessorials": [
      "liftgate"
     ],
     "customer_ref": "55137",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "LHG-S14",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 11,
     "pickup_date": "2026-12-09",
     "pickup_facility": "LHG-DC",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 8900
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f03",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "LHG",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55137",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-09",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 11,
      "pickup_date": "2026-12-11",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 8900
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 11,
      "reference": "55137",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-09",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 8900
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "pickup_date: '2026-12-11' (should be '2026-12-09'); delivery_date: '2026-12-09' (should be '2026-12-11'); accessorials: [] (should be ['liftgate'])",
     "no_wrong_order_posted": "pickup_date: '2026-12-11' (should be '2026-12-09'); delivery_date: '2026-12-09' (should be '2026-12-11'); accessorials: [] (should be ['liftgate'])"
    }
   },
   "title": "Forwarded thread, the latest message moves the delivery date"
  },
  {
   "agent": {
    "cost_usd": 0.0235,
    "crit": false,
    "failed": [],
    "latency_s": 4.843,
    "out": {
     "account": "RBS",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 48 ft flatbed",
      "Steel ships without tarps",
      "Relative dates resolved against email send date (Mon 2026-12-07)"
     ],
     "evidence": {
      "customer_ref": "PO 7758",
      "weight": "31,500 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "Steel joists",
      "customer_ref": "7758",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-09",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-08",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 31500
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "Steel joists",
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7758",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-09",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 31500
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Need a flatbed tomorrow at the Elgin yard for PO 7758, going to the Naperville site, deliver Wednesday.\nSteel joists, 31,500 lbs.\nMike",
    "date": "2026-12-07T07:05:00-06:00",
    "from": "purchasing@ridgelinebuild.example",
    "subject": "truck tomorrow",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "RBS",
    "order": {
     "accessorials": [],
     "customer_ref": "7758",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-09",
     "delivery_facility": "OAK-NAP",
     "equipment": "flatbed_48",
     "hazmat": false,
     "pallets": null,
     "pickup_date": "2026-12-08",
     "pickup_facility": "RBS-YARD",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 31500
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f04",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "RBS",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "7758",
      "delivery_appt_required": false,
      "delivery_date": null,
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": null,
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 31500
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7758",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": null,
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": null,
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 31500
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "pickup_date: None (should be '2026-12-08'); delivery_date: None (should be '2026-12-09')",
     "no_wrong_order_posted": "pickup_date: None (should be '2026-12-08'); delivery_date: None (should be '2026-12-09')"
    }
   },
   "title": "Relative dates (tomorrow, Wednesday)"
  },
  {
   "agent": {
    "cost_usd": 0.02074,
    "crit": false,
    "failed": [],
    "latency_s": 3.509,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 53 ft reefer; stated temp -5F used instead of -10F default",
      "Pallet count present (16)"
     ],
     "evidence": {
      "customer_ref": "PO 30426",
      "weight": "29,700 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "frozen vegetables",
      "customer_ref": "30426",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 16,
      "pickup_date": "2026-12-10",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -5,
      "un_number": null,
      "weight_lb": 29700
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "frozen vegetables",
      "equipment": "reefer_53",
      "pallets": 16,
      "reference": "30426",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -5,
      "weight_lb": 29700
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 30426 from the GB plant into the Milwaukee freezer. Pick up 12/10, deliver 12/10 same day.\n16 pallets frozen vegetables, 29,700 lbs, -5F please.",
    "date": "2026-12-08T08:25:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30426",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [],
     "customer_ref": "30426",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-10",
     "delivery_facility": "HPF-COLD",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 16,
     "pickup_date": "2026-12-10",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": null,
     "temp_f": -5,
     "un_number": null,
     "weight_lb": 29700
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f05",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30426",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 16,
      "pickup_date": "2026-12-10",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -5,
      "un_number": null,
      "weight_lb": 29700
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": 16,
      "reference": "30426",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -5,
      "weight_lb": 29700
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Facility by nickname (the Milwaukee freezer)"
  },
  {
   "agent": {
    "cost_usd": 0.021196,
    "crit": false,
    "failed": [],
    "latency_s": 3.352,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 53 ft reefer at -10 F",
      "Pallet count present (20)",
      "Metro Grocers appointment rule not applicable (delivery to HPF cold storage)"
     ],
     "evidence": {
      "customer_ref": "PO 30428",
      "weight": "38K LBS"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "frozen pizza",
      "customer_ref": "30428",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 20,
      "pickup_date": "2026-12-09",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": "06:00-10:00",
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 38000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "frozen pizza",
      "equipment": "reefer_53",
      "pallets": 20,
      "reference": "30428",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": "06:00-10:00"
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 38000
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 30428\nP/U 12/9 GB PLANT 0600-1000\nDEL 12/10 MKE CS\n20 PLTS 38K LBS FROZEN PIZZA -10F",
    "date": "2026-12-08T05:50:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30428 P/U 12/9",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [],
     "customer_ref": "30428",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-10",
     "delivery_facility": "HPF-COLD",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 20,
     "pickup_date": "2026-12-09",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": "06:00-10:00",
     "temp_f": -10,
     "un_number": null,
     "weight_lb": 38000
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f06",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30428",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-09",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 20,
      "pickup_date": "2026-12-09",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": "06:00-10:00",
      "temp_f": -10,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": 20,
      "reference": "30428",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-09",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": "06:00-10:00"
       },
       {
        "appointment": false,
        "date": "2026-12-09",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": null
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "delivery_date: '2026-12-09' (should be '2026-12-10'); weight_lb: None (should be 38000)",
     "no_wrong_order_posted": "delivery_date: '2026-12-09' (should be '2026-12-10'); weight_lb: None (should be 38000)"
    }
   },
   "title": "All-caps shorthand with 38K for the weight"
  },
  {
   "agent": {
    "cost_usd": 0.021436,
    "crit": false,
    "failed": [],
    "latency_s": 3.479,
    "out": {
     "account": "CCH",
     "action": "posted",
     "applied_rules": [
      "Reference is Shipment No. CS-####",
      "Equipment 53 ft dry van",
      "Hazmat check: none shown (not regulated)"
     ],
     "evidence": {
      "customer_ref": "Shipment No. CS-2304",
      "weight": "19,200 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "acrylic resin, 24 drums",
      "customer_ref": "CS-2304",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-15",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 6,
      "pickup_date": "2026-12-14",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 19200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "acrylic resin, 24 drums",
      "equipment": "dry_van_53",
      "pallets": 6,
      "reference": "CS-2304",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-14",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-15",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 19200
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Yes, go ahead with Shipment No. CS-2304: Gary plant to Prairie Coatings in Rockford, pick up 12/14, deliver 12/15.\n24 drums acrylic resin (not regulated for transport), 19,200 lbs on 6 pallets.\n\nThanks,\nPriya Nair | Logistics Coordinator | Calder Chemical\nOffice 219-555-0148 | Mobile 219-555-0193 | Fax 219-555-0110\nPlant: 4400 Industrial Hwy, Gary IN 46406 | Account 88213",
    "date": "2026-12-08T12:35:00-06:00",
    "from": "logistics@calderchem.example",
    "subject": "RE: next week",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "CCH",
    "order": {
     "accessorials": [],
     "customer_ref": "CS-2304",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-15",
     "delivery_facility": "PRC-WH",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 6,
     "pickup_date": "2026-12-14",
     "pickup_facility": "CCH-PLANT",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 19200
    },
    "route": "post"
   },
   "group": "formats",
   "id": "f07",
   "parser": {
    "cost_usd": 0.0,
    "crit": false,
    "failed": [],
    "latency_s": 0.0,
    "out": {
     "account": "CCH",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "CS-2304",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-15",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 6,
      "pickup_date": "2026-12-14",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 19200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 6,
      "reference": "CS-2304",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-14",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-15",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 19200
     },
     "uncertain": []
    },
    "passed_runs": 1,
    "runs": 1,
    "why": {}
   },
   "title": "Order buried under a signature full of other numbers"
  },
  {
   "agent": {
    "cost_usd": 0.021164,
    "crit": false,
    "failed": [],
    "latency_s": 3.707,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required + appointment accessorial"
     ],
     "evidence": {
      "customer_ref": "Load Tender LT-48866",
      "weight": "40,800 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "coated paper rolls",
      "customer_ref": "LT-48866",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-11",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-10",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "08:00-12:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 40800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "coated paper rolls",
      "equipment": "dry_van_53",
      "pallets": 22,
      "reference": "LT-48866",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "08:00-12:00"
       },
       {
        "appointment": true,
        "date": "2026-12-11",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 40800
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 4500-1220 is ready to ship. Load Tender LT-48866.\nAppleton mill pickup 12/10 08:00-12:00, deliver Romeoville DC 12/11.\n40,800 lbs coated paper rolls, 22 pallets.",
    "date": "2026-12-08T10:30:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "PO 4500-1220 ready",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48866",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-11",
     "delivery_facility": "NGP-DC",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 22,
     "pickup_date": "2026-12-10",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "08:00-12:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 40800
    },
    "route": "post",
    "rule": "reference is the LT number"
   },
   "group": "rules",
   "id": "a01",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "4500-1220",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-11",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-10",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "08:00-12:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 40800
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 22,
      "reference": "4500-1220",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "08:00-12:00"
       },
       {
        "appointment": true,
        "date": "2026-12-11",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 40800
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "customer_ref: '4500-1220' (should be 'LT-48866')",
     "no_wrong_order_posted": "customer_ref: '4500-1220' (should be 'LT-48866')"
    }
   },
   "title": "Tender shows a PO and a Load Tender number: the reference is the LT"
  },
  {
   "agent": {
    "cost_usd": 0.020576,
    "crit": false,
    "failed": [],
    "latency_s": 2.967,
    "out": {
     "account": "HPF",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "53 ft reefer equipment",
      "No temp given: frozen at -10 F",
      "Pallet count present (12)"
     ],
     "evidence": {
      "customer_ref": "PO 30433",
      "weight": "18,300 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": "fish sticks",
      "customer_ref": "30433",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 12,
      "pickup_date": "2026-12-11",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 18300
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [],
      "commodity": "fish sticks",
      "equipment": "reefer_53",
      "pallets": 12,
      "reference": "30433",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 18300
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 30433: Green Bay plant to Milwaukee cold storage, pick up 12/11, deliver 12/11. 12 pallets fish sticks, 18,300 lbs.",
    "date": "2026-12-08T13:40:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30433",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "order": {
     "accessorials": [],
     "customer_ref": "30433",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "HPF-COLD",
     "equipment": "reefer_53",
     "hazmat": false,
     "pallets": 12,
     "pickup_date": "2026-12-11",
     "pickup_facility": "HPF-PLANT",
     "pickup_window": null,
     "temp_f": -10,
     "un_number": null,
     "weight_lb": 18300
    },
    "route": "post",
    "rule": "frozen at -10 F when no temperature is given"
   },
   "group": "rules",
   "id": "a02",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30433",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 12,
      "pickup_date": "2026-12-11",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 18300
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": 12,
      "reference": "30433",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 18300
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "temp_f: None (should be -10)",
     "no_wrong_order_posted": "temp_f: None (should be -10)"
    }
   },
   "title": "No temperature given: frozen at -10 F by account rule"
  },
  {
   "agent": {
    "cost_usd": 0.020752,
    "crit": false,
    "failed": [],
    "latency_s": 3.23,
    "out": {
     "account": "RBS",
     "action": "posted",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 48 ft flatbed",
      "Drywall tarped: tarps accessorial added",
      "Dates resolved against email sent date"
     ],
     "evidence": {
      "customer_ref": "PO 7761",
      "weight": "42,000 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "tarps"
      ],
      "commodity": "Drywall",
      "customer_ref": "7761",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-10",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 42000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "tarps"
      ],
      "commodity": "Drywall",
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7761",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 42000
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 7761, 60 sheets x 12 bundles drywall, 42,000 lbs. Elgin yard 12/10, Oakbrook Homes Naperville 12/10 afternoon.",
    "date": "2026-12-08T07:20:00-06:00",
    "from": "purchasing@ridgelinebuild.example",
    "subject": "PO 7761",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "RBS",
    "order": {
     "accessorials": [
      "tarps"
     ],
     "customer_ref": "7761",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-10",
     "delivery_facility": "OAK-NAP",
     "equipment": "flatbed_48",
     "hazmat": false,
     "pallets": null,
     "pickup_date": "2026-12-10",
     "pickup_facility": "RBS-YARD",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 42000
    },
    "route": "post",
    "rule": "tarps for drywall"
   },
   "group": "rules",
   "id": "a03",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "RBS",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "7761",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": "OAK-NAP",
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-10",
      "pickup_facility": "RBS-YARD",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 42000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "flatbed_48",
      "pallets": null,
      "reference": "7761",
      "shipper": "Ridgeline Building Supply",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "RBS-YARD",
        "name": "Ridgeline Building Supply yard",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-10",
        "facility": "OAK-NAP",
        "name": "Oakbrook Homes job site",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 42000
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "accessorials: [] (should be ['tarps'])",
     "no_wrong_order_posted": "accessorials: [] (should be ['tarps'])"
    }
   },
   "title": "Drywall must be tarped"
  },
  {
   "agent": {
    "cost_usd": 0.020448,
    "crit": false,
    "failed": [],
    "latency_s": 3.382,
    "out": {
     "account": "LHG",
     "action": "posted",
     "applied_rules": [
      "Reference is Order # (five digits)",
      "Equipment 53 ft dry van",
      "Store delivery requires liftgate"
     ],
     "evidence": {
      "customer_ref": "Order # 55150",
      "weight": "3,200 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "lamps",
      "customer_ref": "55150",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 4,
      "pickup_date": "2026-12-10",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 3200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "liftgate"
      ],
      "commodity": "lamps",
      "equipment": "dry_van_53",
      "pallets": 4,
      "reference": "55150",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 3200
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Order # 55150, Kenosha DC to Schaumburg store, 12/10 pickup, 12/11 delivery, 4 pallets, 3,200 lbs, lamps.",
    "date": "2026-12-09T10:10:00-06:00",
    "from": "cs@lakeshorehome.example",
    "subject": "Order # 55150",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "LHG",
    "order": {
     "accessorials": [
      "liftgate"
     ],
     "customer_ref": "55150",
     "delivery_appt_required": false,
     "delivery_date": "2026-12-11",
     "delivery_facility": "LHG-S14",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 4,
     "pickup_date": "2026-12-10",
     "pickup_facility": "LHG-DC",
     "pickup_window": null,
     "temp_f": null,
     "un_number": null,
     "weight_lb": 3200
    },
    "route": "post",
    "rule": "liftgate for store deliveries"
   },
   "group": "rules",
   "id": "a04",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "LHG",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55150",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "LHG-S14",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 4,
      "pickup_date": "2026-12-10",
      "pickup_facility": "LHG-DC",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 3200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 4,
      "reference": "55150",
      "shipper": "Lakeshore Home Goods",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "LHG-DC",
        "name": "Lakeshore Home Goods DC",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "LHG-S14",
        "name": "Lakeshore Home Goods store 14",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 3200
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "accessorials: [] (should be ['liftgate'])",
     "no_wrong_order_posted": "accessorials: [] (should be ['liftgate'])"
    }
   },
   "title": "Store delivery needs a liftgate though the email does not say so"
  },
  {
   "agent": {
    "cost_usd": 0.021352,
    "crit": false,
    "failed": [],
    "latency_s": 3.635,
    "out": {
     "account": "NGP",
     "action": "posted",
     "applied_rules": [
      "Reference is Load Tender number",
      "Equipment 53 ft dry van",
      "Delivery appointment required + appointment accessorial",
      "Default Appleton mill pickup window 06:00-14:00"
     ],
     "evidence": {
      "customer_ref": "Load Tender LT-48871",
      "weight": "17,900 lbs"
     },
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "paper towels",
      "customer_ref": "LT-48871",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-14",
      "delivery_facility": "MG-JOL",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 26,
      "pickup_date": "2026-12-11",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "06:00-14:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 17900
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "stage": "auto",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "paper towels",
      "equipment": "dry_van_53",
      "pallets": 26,
      "reference": "LT-48871",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "06:00-14:00"
       },
       {
        "appointment": true,
        "date": "2026-12-14",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 17900
     },
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Load Tender LT-48871. Appleton mill to Metro Grocers Joliet. Pick up 12/11, deliver 12/14.\n17,900 lbs paper towels, 26 pallets.",
    "date": "2026-12-09T08:45:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Load Tender LT-48871",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "order": {
     "accessorials": [
      "appointment"
     ],
     "customer_ref": "LT-48871",
     "delivery_appt_required": true,
     "delivery_date": "2026-12-14",
     "delivery_facility": "MG-JOL",
     "equipment": "dry_van_53",
     "hazmat": false,
     "pallets": 26,
     "pickup_date": "2026-12-11",
     "pickup_facility": "NGP-MILL",
     "pickup_window": "06:00-14:00",
     "temp_f": null,
     "un_number": null,
     "weight_lb": 17900
    },
    "route": "post",
    "rule": "mill window 06:00-14:00"
   },
   "group": "rules",
   "id": "a05",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "no_wrong_order_posted",
     "fields_read_right"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "LT-48871",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-14",
      "delivery_facility": "MG-JOL",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 26,
      "pickup_date": "2026-12-11",
      "pickup_facility": "NGP-MILL",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 17900
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 26,
      "reference": "LT-48871",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": true,
        "date": "2026-12-14",
        "facility": "MG-JOL",
        "name": "Metro Grocers DC, Joliet",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 17900
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "fields_read_right": "pickup_window: None (should be '06:00-14:00')",
     "no_wrong_order_posted": "pickup_window: None (should be '06:00-14:00')"
    }
   },
   "title": "No pickup window: the mill's shipping hours apply"
  },
  {
   "agent": {
    "cost_usd": 0.029444,
    "crit": false,
    "failed": [],
    "latency_s": 6.551,
    "out": {
     "account": "CCH",
     "action": "to_operator",
     "applied_rules": [
      "Reference is Shipment No. CS-####",
      "Equipment 53 ft dry van",
      "Hazmat flagged true with UN1263; route to operator for SDS and placard check before booking"
     ],
     "evidence": {
      "customer_ref": "Shipment No. CS-2299",
      "weight": "14,200 lbs"
     },
     "note": "Calder Chem (logistics@calderchem.example) is placing new order CS-2299: 40 pails of solvent paint, UN1263, Class 3, PG II, 14,200 lbs on 8 pallets, picking up at their Gary plant on 12/10 and delivering to Prairie Coatings in Rockford on 12/11, with an SDS attached. It is held because the load is hazardous material. Review the attached SDS against the stated UN1263 / Class 3 / PG II details, then confirm the assigned carrier and driver are hazmat-qualified and that placards and shipping papers are arranged before entering the order.",
     "order": {
      "accessorials": [],
      "commodity": "Paint (solvent), 40 pails",
      "customer_ref": "CS-2299",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": true,
      "pallets": 8,
      "pickup_date": "2026-12-10",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": "UN1263",
      "weight_lb": 14200
     },
     "reasons": [
      "hazmat"
     ],
     "request_type": "new_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "SDS_paint.pdf",
      "text": "SAFETY DATA SHEET  Product: Solvent paint  UN1263  Class 3 Flammable liquid  Packing group II"
     }
    ],
    "body": "Shipment No. CS-2299: 40 pails paint, UN1263, Class 3, PG II, 14,200 lbs, 8 pallets.\nGary plant to Prairie Coatings Rockford, pick up 12/10, deliver 12/11. SDS attached.",
    "date": "2026-12-08T09:15:00-06:00",
    "from": "logistics@calderchem.example",
    "subject": "Shipment No. CS-2299",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "CCH",
    "reasons": [
     "hazmat"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x01",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "CCH",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "CS-2299",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 8,
      "pickup_date": "2026-12-10",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 14200
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 8,
      "reference": "CS-2299",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-10",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 14200
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Hazmat with a UN number and class"
  },
  {
   "agent": {
    "cost_usd": 0.028816,
    "crit": false,
    "failed": [],
    "latency_s": 6.085,
    "out": {
     "account": "CCH",
     "action": "to_operator",
     "applied_rules": [
      "Reference is Shipment No. CS-####",
      "Equipment 53 ft dry van",
      "Flammable material: hazmat true, route to operator for SDS/placard check; no UN number given"
     ],
     "evidence": {
      "customer_ref": "Shipment No. CS-2307",
      "weight": "6,600 lbs"
     },
     "note": "Calder Chem is placing new order CS-2307: 12 drums of cleaning solvent (6,600 lbs, 3 pallets) from the Gary plant to Prairie Coatings in Rockford, picking up 12/11 and delivering 12/14. It is held because the email describes the solvent as flammable, which makes it likely hazardous material, and the email gives no UN number or hazmat class. Contact logistics@calderchem.example for the UN number, hazard class, packing group and emergency contact, and confirm a hazmat-qualified carrier, before entering the order.",
     "order": {
      "accessorials": [],
      "commodity": "Cleaning solvent, 12 drums",
      "customer_ref": "CS-2307",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-14",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": true,
      "pallets": 3,
      "pickup_date": "2026-12-11",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 6600
     },
     "reasons": [
      "hazmat",
      "uncertain:hazmat",
      "uncertain:un_number"
     ],
     "request_type": "new_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": [
      "hazmat",
      "un_number"
     ]
    },
    "passed_runs": 2,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Shipment No. CS-2307, Gary plant to Rockford (Prairie Coatings), 12/11 pickup, 12/14 delivery.\n12 drums cleaning solvent, flammable, 6,600 lbs, 3 pallets.",
    "date": "2026-12-09T14:00:00-06:00",
    "from": "logistics@calderchem.example",
    "subject": "Shipment No. CS-2307",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "CCH",
    "reasons": [
     "hazmat"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x02",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "CCH",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "CS-2307",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-14",
      "delivery_facility": "PRC-WH",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 3,
      "pickup_date": "2026-12-11",
      "pickup_facility": "CCH-PLANT",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 6600
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 3,
      "reference": "CS-2307",
      "shipper": "Calder Chemical",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "CCH-PLANT",
        "name": "Calder Chemical plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-14",
        "facility": "PRC-WH",
        "name": "Prairie Coatings warehouse",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 6600
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Hazmat described in words only"
  },
  {
   "agent": {
    "cost_usd": 0.032712,
    "crit": false,
    "failed": [],
    "latency_s": 9.551,
    "out": {
     "account": "NGP",
     "action": "to_operator",
     "applied_rules": [
      "Reference is Load Tender number, not PO",
      "Equipment 53 ft dry van",
      "Delivery appointment required; appointment accessorial added",
      "Appleton default window not needed (window given)"
     ],
     "evidence": {
      "customer_ref": "Load Tender: LT-48810",
      "weight": "Weight: 40,950 lbs"
     },
     "note": "Northgate Paper is resending load tender LT-48810 (PO 4500-1170): 22 pallets of coated paper rolls, 40,950 lbs, 53' dry van, picking up 12/08/2026 07:00-11:00 at the Appleton, WI mill and delivering 12/09/2026 to the Romeoville DC. It is held because an open order already exists under reference LT-48810, and the email says it is a resend in case the first did not come through. Compare it against the existing order; if the details match, do not enter a duplicate and just reply to dispatch@northgatepaper.example confirming the tender, and if anything differs, update the existing order instead.",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "Coated paper rolls",
      "customer_ref": "LT-48810",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-09",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-08",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "07:00-11:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 40950
     },
     "reasons": [
      "duplicate"
     ],
     "request_type": "new_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [
     {
      "name": "LT-48810.pdf",
      "text": "NORTHGATE PAPER CO.                      LOAD TENDER\nLoad Tender: LT-48810            PO: 4500-1170\nShip from: Northgate Paper Co., Appleton mill, 1200 River Rd, Appleton, WI\nPickup: 12/08/2026 07:00-11:00\nShip to: Northgate Paper Co., Romeoville DC\nDeliver: 12/09/2026\nCommodity: Coated paper rolls\nWeight: 40,950 lbs      Pallets: 22\nEquipment: 53' Dry Van\nPlease confirm by reply."
     }
    ],
    "body": "Resending in case it did not come through. Thanks.",
    "date": "2026-12-07T10:02:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Resend: Load Tender LT-48810",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "reasons": [
     "duplicate"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x03",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": "LT-48810",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-09",
      "delivery_facility": "NGP-DC",
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": 22,
      "pickup_date": "2026-12-08",
      "pickup_facility": "NGP-MILL",
      "pickup_window": "07:00-11:00",
      "temp_f": null,
      "un_number": null,
      "weight_lb": 40950
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "equipment": "dry_van_53",
      "pallets": 22,
      "reference": "LT-48810",
      "shipper": "Northgate Paper Co.",
      "stops": [
       {
        "date": "2026-12-08",
        "facility": "NGP-MILL",
        "name": "Northgate Paper Co., Appleton mill",
        "type": "pickup",
        "window": "07:00-11:00"
       },
       {
        "appointment": true,
        "date": "2026-12-09",
        "facility": "NGP-DC",
        "name": "Northgate Paper Co., Romeoville DC",
        "type": "delivery"
       }
      ],
      "temp_f": null,
      "weight_lb": 40950
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Duplicate: a tender already in the TMS sent again"
  },
  {
   "agent": {
    "cost_usd": 0.032044,
    "crit": false,
    "failed": [],
    "latency_s": 7.965,
    "out": {
     "account": "RBS",
     "action": "to_operator",
     "applied_rules": [
      "Reference is PO number",
      "Equipment 48 ft flatbed",
      "Lumber tarped: tarps accessorial",
      "Dates resolved against email sent date (Monday 12/14/2026 confirmed)"
     ],
     "evidence": {
      "customer_ref": "PO 7731-A",
      "weight": "36,000 lbs lumber"
     },
     "note": "Mike at Ridgeline Build (purchasing@ridgelinebuild.example) is changing existing PO 7731-A: delivery moves to Monday 12/14, pickup stays 12/10, same load of 36,000 lbs lumber. It is held because it modifies an order already in the system and the email names neither the pickup nor the delivery facility, so the lane could not be read with confidence. Pull up the existing PO 7731-A, confirm it is the 36,000 lb lumber load with a 12/10 pickup, take the pickup and delivery facilities from that order, and update only the delivery date to 12/14.",
     "order": {
      "accessorials": [
       "tarps"
      ],
      "commodity": "lumber",
      "customer_ref": "7731-A",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-14",
      "delivery_facility": null,
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-10",
      "pickup_facility": null,
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 36000
     },
     "reasons": [
      "change_request",
      "missing_field:pickup_facility",
      "missing_field:delivery_facility",
      "uncertain:delivery_facility",
      "uncertain:pickup_facility"
     ],
     "request_type": "change",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": [
      "delivery_facility",
      "pickup_facility"
     ]
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Change on PO 7731-A: push delivery to Monday 12/14, pickup stays 12/10. Same load, 36,000 lbs lumber.\nMike",
    "date": "2026-12-08T15:30:00-06:00",
    "from": "purchasing@ridgelinebuild.example",
    "subject": "Change on PO 7731-A",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "RBS",
    "reasons": [
     "change_request"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x04",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "RBS",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "7731-A",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-10",
      "delivery_facility": null,
      "equipment": "flatbed_48",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-14",
      "pickup_facility": null,
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": 36000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Change to an order already sent"
  },
  {
   "agent": {
    "cost_usd": 0.025372,
    "crit": false,
    "failed": [],
    "latency_s": 5.034,
    "out": {
     "account": "LHG",
     "action": "to_operator",
     "applied_rules": [
      "Reference is Order # (five digits)",
      "Equipment is 53 ft dry van"
     ],
     "evidence": {
      "customer_ref": "Please cancel Order # 55102",
      "weight": null
     },
     "note": "Lakeshore Home (cs@lakeshorehome.example) is asking to cancel Order # 55102 because the store no longer needs it; the email gives no lane or date. It is held because it cancels an order that already exists, and cancellations are not processed automatically. Find Order # 55102 in the system, check whether it has already been dispatched or picked up, and if not, cancel it and confirm the cancellation back to the shipper.",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55102",
      "delivery_appt_required": false,
      "delivery_date": null,
      "delivery_facility": null,
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": null,
      "pickup_facility": null,
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [
      "cancel_request"
     ],
     "request_type": "cancel",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": [
      "commodity",
      "delivery_date",
      "delivery_facility",
      "pallets",
      "pickup_date",
      "pickup_facility",
      "weight_lb"
     ]
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Please cancel Order # 55102, the store no longer needs it. Sorry for the late notice.",
    "date": "2026-12-08T16:45:00-06:00",
    "from": "cs@lakeshorehome.example",
    "subject": "Cancel Order # 55102",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "LHG",
    "reasons": [
     "cancel_request"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x05",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "LHG",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "55102",
      "delivery_appt_required": false,
      "delivery_date": null,
      "delivery_facility": null,
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": null,
      "pickup_facility": null,
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Cancellation"
  },
  {
   "agent": {
    "cost_usd": 0.027252,
    "crit": false,
    "failed": [],
    "latency_s": 5.543,
    "out": {
     "account": "HPF",
     "action": "to_operator",
     "applied_rules": [
      "Reference is PO number",
      "53 ft reefer equipment",
      "Pallet count missing - not guessed, flagged uncertain",
      "Metro Grocers appointment rule not applicable (delivery to HPF cold storage)"
     ],
     "evidence": {
      "customer_ref": "PO 30440",
      "weight": "27,000 lbs"
     },
     "note": "Harbor Point Foods is placing new order PO 30440: frozen chicken, 27,000 lbs at -10F, from their Green Bay plant to Milwaukee cold storage, picking up and delivering 12/11. It is held because the email never gives a pallet count, which is required to enter the order. Get the pallet count from Harbor Point Foods (orders@harborpointfoods.example), add it, and release the order.",
     "order": {
      "accessorials": [],
      "commodity": "frozen chicken",
      "customer_ref": "30440",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-11",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 27000
     },
     "reasons": [
      "missing_field:pallets",
      "uncertain:pallets"
     ],
     "request_type": "new_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": [
      "pallets"
     ]
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 30440, Green Bay plant to Milwaukee cold storage, 12/11 to 12/11, 27,000 lbs frozen chicken, -10F.",
    "date": "2026-12-09T07:30:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30440",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "reasons": [
     "missing_field:pallets",
     "uncertain:pallets"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x06",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30440",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-11",
      "delivery_facility": "HPF-COLD",
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": "2026-12-11",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -10,
      "un_number": null,
      "weight_lb": 27000
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": {
      "accessorials": [],
      "commodity": null,
      "equipment": "reefer_53",
      "pallets": null,
      "reference": "30440",
      "shipper": "Harbor Point Foods",
      "stops": [
       {
        "date": "2026-12-11",
        "facility": "HPF-PLANT",
        "name": "Harbor Point Foods plant",
        "type": "pickup",
        "window": null
       },
       {
        "appointment": false,
        "date": "2026-12-11",
        "facility": "HPF-COLD",
        "name": "Harbor Point Foods cold storage",
        "type": "delivery"
       }
      ],
      "temp_f": -10,
      "weight_lb": 27000
     },
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Pallet count missing on an account that requires it"
  },
  {
   "agent": {
    "cost_usd": 0.028884,
    "crit": false,
    "failed": [],
    "latency_s": 6.664,
    "out": {
     "account": "HPF",
     "action": "to_operator",
     "applied_rules": [
      "Reference is PO number",
      "53 ft reefer; stated temp -20F used instead of the -10F default",
      "Pallet count present (18)",
      "Metro Grocers DC delivery: appointment required and appointment accessorial added",
      "Delivery DC ambiguous (Joliet or Indianapolis): left null for operator"
     ],
     "evidence": {
      "customer_ref": "PO 30442",
      "weight": "24,600 lbs"
     },
     "note": "Harbor Point Foods is placing new order PO 30442: 18 pallets of ice cream, 24,600 lbs at -20F, picking up at the Green Bay plant on 12/14 and delivering to the Metro Grocers DC on 12/15. It is held because the email names \"Metro Grocers DC\" without saying which location, so the delivery facility could not be matched with confidence. Identify the correct Metro Grocers DC (from the account's facility list or by asking orders@harborpointfoods.example), set it as the delivery facility, and enter the order.",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": "ice cream",
      "customer_ref": "30442",
      "delivery_appt_required": true,
      "delivery_date": "2026-12-15",
      "delivery_facility": null,
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 18,
      "pickup_date": "2026-12-14",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -20,
      "un_number": null,
      "weight_lb": 24600
     },
     "reasons": [
      "missing_field:delivery_facility",
      "uncertain:delivery_facility"
     ],
     "request_type": "new_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": [
      "delivery_facility"
     ]
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "PO 30442 to the Metro Grocers DC, pick up Green Bay plant 12/14, deliver 12/15. 18 pallets ice cream, 24,600 lbs, -20F.",
    "date": "2026-12-09T11:00:00-06:00",
    "from": "orders@harborpointfoods.example",
    "subject": "PO 30442",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "HPF",
    "reasons": [
     "uncertain:delivery_facility",
     "missing_field:delivery_facility"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x07",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "HPF",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": "30442",
      "delivery_appt_required": false,
      "delivery_date": "2026-12-15",
      "delivery_facility": null,
      "equipment": "reefer_53",
      "hazmat": false,
      "pallets": 18,
      "pickup_date": "2026-12-14",
      "pickup_facility": "HPF-PLANT",
      "pickup_window": null,
      "temp_f": -20,
      "un_number": null,
      "weight_lb": 24600
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "Two Metro Grocers DCs could fit"
  },
  {
   "agent": {
    "cost_usd": 0.024184,
    "crit": false,
    "failed": [],
    "latency_s": 5.352,
    "out": {
     "account": "NGP",
     "action": "to_operator",
     "applied_rules": [
      "Rate request, not a load tender: no order created"
     ],
     "evidence": {
      "customer_ref": null,
      "weight": null
     },
     "note": "This is not an order but a rate request from dispatch@northgatepaper.example asking for Q1 rates on two dry van lanes: Appleton mill to Atlanta and Appleton mill to Dallas, about 6 loads a week each. It is held because it does not ask to move a load, so nothing should be entered. Forward it to the sales or pricing team to quote and reply to the shipper.",
     "order": {
      "accessorials": [],
      "commodity": null,
      "customer_ref": null,
      "delivery_appt_required": false,
      "delivery_date": null,
      "delivery_facility": null,
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": null,
      "pickup_facility": null,
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [
      "not_an_order"
     ],
     "request_type": "not_an_order",
     "route": "operator",
     "stage": "auto",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 3,
    "runs": 3,
    "why": {}
   },
   "email": {
    "attachments": [],
    "body": "Can you send your Q1 rates for Appleton mill to Atlanta and Appleton mill to Dallas, dry van, about 6 loads a week each?\nThanks",
    "date": "2026-12-09T13:20:00-06:00",
    "from": "dispatch@northgatepaper.example",
    "subject": "Q1 rates",
    "to": "orders@lanternfreight.example"
   },
   "expected": {
    "account": "NGP",
    "reasons": [
     "not_an_order"
    ],
    "route": "operator"
   },
   "group": "exceptions",
   "id": "x08",
   "parser": {
    "cost_usd": 0.0,
    "crit": true,
    "failed": [
     "exceptions_held"
    ],
    "latency_s": 0.0,
    "out": {
     "account": "NGP",
     "applied_rules": [],
     "evidence": {},
     "note": "",
     "order": {
      "accessorials": [
       "appointment"
      ],
      "commodity": null,
      "customer_ref": null,
      "delivery_appt_required": true,
      "delivery_date": null,
      "delivery_facility": null,
      "equipment": "dry_van_53",
      "hazmat": false,
      "pallets": null,
      "pickup_date": null,
      "pickup_facility": "NGP-MILL",
      "pickup_window": null,
      "temp_f": null,
      "un_number": null,
      "weight_lb": null
     },
     "reasons": [],
     "request_type": "new_order",
     "route": "post",
     "tms": null,
     "uncertain": []
    },
    "passed_runs": 0,
    "runs": 1,
    "why": {
     "exceptions_held": "posted to the TMS without a person"
    }
   },
   "title": "A rate question, not an order"
  }
 ],
 "facilities": {
  "CCH-PLANT": "Calder Chemical plant (Gary, IN)",
  "HPF-COLD": "Harbor Point Foods cold storage (Milwaukee, WI)",
  "HPF-PLANT": "Harbor Point Foods plant (Green Bay, WI)",
  "LHG-DC": "Lakeshore Home Goods DC (Kenosha, WI)",
  "LHG-S14": "Lakeshore Home Goods store 14 (Schaumburg, IL)",
  "LHG-S22": "Lakeshore Home Goods store 22 (Oak Park, IL)",
  "MG-IND": "Metro Grocers DC, Indianapolis (Indianapolis, IN)",
  "MG-JOL": "Metro Grocers DC, Joliet (Joliet, IL)",
  "NGP-DC": "Northgate Paper Co., Romeoville DC (Romeoville, IL)",
  "NGP-MILL": "Northgate Paper Co., Appleton mill (Appleton, WI)",
  "OAK-NAP": "Oakbrook Homes job site (Naperville, IL)",
  "PRC-WH": "Prairie Coatings warehouse (Rockford, IL)",
  "RBS-YARD": "Ridgeline Building Supply yard (Elgin, IL)"
 },
 "judge_calls": 24,
 "judge_cost_usd": 0.102048,
 "mean_cost_usd": 0.018535929824561405,
 "mean_latency_s": 3.619877192982456,
 "model": "claude-opus-5-5",
 "parser": {
  "by_run": [
   {
    "critical": 22,
    "passed": 8,
    "run": 1,
    "total": 30
   }
  ],
  "decision": "no-go",
  "reasons": [
   "run 1: 22 critical failure(s): no_wrong_order_posted on case c04, no_wrong_order_posted on case c05, no_wrong_order_posted on case c08, no_wrong_order_posted on case c09, no_wrong_order_posted on case f01, no_wrong_order_posted on case f02, no_wrong_order_posted on case f03, no_wrong_order_posted on case f04, no_wrong_order_posted on case f06, no_wrong_order_posted on case a01, no_wrong_order_posted on case a02, no_wrong_order_posted on case a03, no_wrong_order_posted on case a04, no_wrong_order_posted on case a05, exceptions_held on case x01, exceptions_held on case x02, exceptions_held on case x03, exceptions_held on case x04, exceptions_held on case x05, exceptions_held on case x06, exceptions_held on case x07, exceptions_held on case x08",
   "run 1: all emails passed 8 of 30, needs 28 (no-go)",
   "run 1: clean tenders passed 6 of 10, needs 10 (no-go)",
   "run 1: exceptions passed 0 of 8, needs 8 (no-go)",
   "run 1: messy formats passed 2 of 7, needs 6 (no-go)",
   "run 1: account rules passed 0 of 5, needs 4 (partial)"
  ]
 }
};
