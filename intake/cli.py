"""Read one shipment-request email and show what the agent would do with it.

    order-intake read request.eml                 # a saved email (.eml), live Claude call
    order-intake read request.json --stage approve
    order-intake case f03                         # one of the 30 test emails, replayed from the recording

Needs ANTHROPIC_API_KEY for `read`. `case` replays the recorded live run and needs no key.
"""

from __future__ import annotations

import argparse
import email
import json
import sys
from email import policy
from email.utils import parsedate_to_datetime
from pathlib import Path

from intake import pipeline
from intake.rollout import STAGES, stages
from intake.world import account_for

ROOT = Path(__file__).resolve().parent.parent


def _pdf_text(data: bytes) -> str:
    try:
        from io import BytesIO

        from pypdf import PdfReader
    except ImportError:
        return "[PDF attached; install pypdf (pip install 'order-intake-agent[pdf]') to read it]"
    return "\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(data)).pages)


def load_eml(path: Path) -> dict:
    msg = email.message_from_bytes(path.read_bytes(), policy=policy.default)
    body = msg.get_body(preferencelist=("plain",))
    attachments = []
    for part in msg.iter_attachments():
        name = part.get_filename() or "attachment"
        data = part.get_payload(decode=True) or b""
        if part.get_content_type() == "application/pdf" or name.lower().endswith(".pdf"):
            text = _pdf_text(data)
        elif part.get_content_maintype() == "text" or name.lower().endswith((".csv", ".txt")):
            text = data.decode(part.get_content_charset() or "utf-8", errors="replace")
        else:
            continue
        attachments.append({"name": name, "text": text})
    sent = parsedate_to_datetime(msg["Date"]).isoformat() if msg["Date"] else ""
    return {
        "from": str(msg["From"] or ""),
        "to": str(msg["To"] or ""),
        "date": sent,
        "subject": str(msg["Subject"] or ""),
        "body": body.get_content() if body else "",
        "attachments": attachments,
    }


def load(path: Path) -> dict:
    if path.suffix.lower() == ".eml":
        return load_eml(path)
    data = json.loads(path.read_text())
    return data.get("email", data)


def show(out: dict) -> str:
    o, lines = out["order"], []
    head = {
        "posted": "POSTED to the TMS",
        "awaiting_approval": "READY, waiting for one click from an operator",
        "to_operator": "HELD for an operator",
        "logged": "SHADOW: logged next to the operator's order, nothing posted",
    }
    lines.append(f"{head[out['action']]}  (account {out['account']}, stage {out['stage']}, {out['request_type']})")
    if out["reasons"]:
        lines.append("Held because: " + ", ".join(out["reasons"]))
    if o.get("customer_ref"):
        lines.append(
            f"Ref {o['customer_ref']}: {o.get('pickup_facility')} {o.get('pickup_date')} {o.get('pickup_window') or ''}"
            f" -> {o.get('delivery_facility')} {o.get('delivery_date')}"
        )
        lines.append(
            f"{o.get('equipment')}, {o.get('weight_lb')} lb, {o.get('pallets')} pallets, temp {o.get('temp_f')},"
            f" accessorials {o.get('accessorials')}"
        )
    if out["note"]:
        lines.append("Note to the operator: " + out["note"])
    meta = out["_meta"]
    lines.append(f"{meta['calls']} Claude call(s), ${meta['cost_usd']:.4f}, {meta['latency_s']:.1f} s")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="order-intake", description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("read", help="read an email file (.eml or .json) with a live Claude call")
    r.add_argument("path", type=Path)
    c = sub.add_parser("case", help="replay one of the 30 test emails from the recorded run")
    c.add_argument("case_id")
    for p in (r, c):
        p.add_argument("--stage", choices=STAGES, help="override the account's stage in rollout.yml")
        p.add_argument("--json", action="store_true", help="print the full outcome as JSON")
    args = ap.parse_args(argv)

    if args.cmd == "read":
        from intake.extractor import ClaudeExtractor

        mail, extractor = load(args.path), ClaudeExtractor()
    else:
        sys.path.insert(0, str(ROOT / "evals"))
        from agent import TAPE, fingerprint
        from golive_gate import load_cases

        from intake.recorded import replay_extractor

        case = next((x for x in load_cases(ROOT / "evals" / "cases.yml") if x.id == args.case_id), None)
        if case is None:
            ap.error(f"no case {args.case_id}")
        mail, extractor = case.input["email"], replay_extractor(TAPE, fingerprint())
    stage = args.stage or stages().get(account_for(mail["from"]) or "", "shadow")
    out = pipeline.run({"email": mail}, extractor, stage=stage)
    print(json.dumps(out, indent=2) if args.json else show(out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
