"""Build the demo page data (docs/data.js) from the recorded live run and the template parser run.

    golive run evals/golive.yml --out reports/recorded
    golive run evals/golive.baseline.yml --out reports/baseline
    python scripts/build_page.py

Every number on the page comes from those two results files and recordings/.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import yaml

from intake.rollout import readiness, stages
from intake.world import ACCOUNTS, FACILITIES


def load(path):
    return json.loads(Path(path).read_text())


def runs_view(case):
    first = case["runs"][0]
    return {
        "passed_runs": sum(r["passed"] for r in case["runs"]),
        "runs": len(case["runs"]),
        "failed": first["failed_checks"],
        "why": {k: v["reason"] for k, v in first["verdicts"].items() if v["result"] == "fail"},
        "crit": any(
            r["verdicts"].get(k, {}).get("result") == "fail"
            for r in case["runs"]
            for k in ("no_wrong_order_posted", "exceptions_held")
        ),
        "out": {k: v for k, v in (first["output"] or {}).items() if k != "_meta"},
        "cost_usd": (first["output"] or {}).get("_meta", {}).get("cost_usd", 0.0),
        "latency_s": (first["output"] or {}).get("_meta", {}).get("latency_s", 0.0),
    }


def main(recorded="reports/recorded/results.json", parser="reports/baseline/results.json", out="docs/data.js"):
    rec, base = load(ROOT / recorded), load(ROOT / parser)
    cases = yaml.safe_load((ROOT / "evals" / "cases.yml").read_text())["cases"]
    by_rec = {c["id"]: c for c in rec["cases"]}
    by_base = {c["id"]: c for c in base["cases"]}
    tape = [json.loads(x)["value"] for x in (ROOT / "recordings" / "extractor.jsonl").read_text().splitlines() if x.strip()]
    metas = [t["_meta"] for t in tape]
    judge = [json.loads(x)["value"] for x in (ROOT / "recordings" / "judge.jsonl").read_text().splitlines() if x.strip()]
    ready = readiness(rec["cases"])
    data = {
        "model": metas[0]["model"],
        "calls": len(metas),
        "mean_cost_usd": sum(m["cost_usd"] for m in metas) / len(metas),
        "mean_latency_s": sum(m["latency_s"] for m in metas) / len(metas),
        "judge_calls": len(judge),
        "judge_cost_usd": sum(j["cost_usd"] for j in judge),
        "agent": {"decision": rec["decision"], "reasons": rec["gate_result"]["reasons"], "by_run": rec["summary"]["by_run"]},
        "parser": {"decision": base["decision"], "reasons": base["gate_result"]["reasons"], "by_run": base["summary"]["by_run"]},
        "accounts": {
            code: {"name": a["name"], "rules": a["rules"], "stage": stages().get(code, "shadow"), **ready.get(code, {})}
            for code, a in ACCOUNTS.items()
        },
        "facilities": {code: f"{f['name']} ({f['city']})" for code, f in FACILITIES.items()},
        "cases": [
            {
                "id": c["id"],
                "group": c["group"],
                "title": c["title"],
                "email": c["input"]["email"],
                "expected": c["expected"],
                "agent": runs_view(by_rec[c["id"]]),
                "parser": runs_view(by_base[c["id"]]),
            }
            for c in cases
        ],
    }
    Path(ROOT / out).write_text("window.DATA = " + json.dumps(data, indent=1, sort_keys=True) + ";\n")
    print(f"wrote {out}: {len(cases)} emails, agent {rec['decision']}, parser {base['decision']}")


if __name__ == "__main__":
    main(*sys.argv[1:])
