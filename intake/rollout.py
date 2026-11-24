"""Rollout stages: an account earns the right to post on its own, one stage at a time.

The pipeline decides whether an order *could* post on its own (route post) or needs an operator
(route operator). The account's stage decides what actually happens to it:

    shadow   nothing is posted; the operator keys the order as today and the agent's copy is compared
    approve  a post-route order waits for one click from an operator; the rest go to an operator with a note
    auto     a post-route order posts to the TMS on its own; the rest go to an operator with a note

An operator-route order never posts on its own at any stage.
"""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path

import yaml

STAGES = ["shadow", "approve", "auto"]
CONFIG = Path(__file__).resolve().parent.parent / "rollout.yml"


def stages(path: Path = CONFIG) -> dict[str, str]:
    data = yaml.safe_load(path.read_text()) if path.exists() else {}
    out = {}
    for account, stage in (data or {}).get("accounts", {}).items():
        if stage not in STAGES:
            raise ValueError(f"{account}: unknown stage {stage!r} (use one of {STAGES})")
        out[account] = stage
    return out


def action(route: str, stage: str) -> str:
    """What happens to one order: logged, awaiting_approval, posted or to_operator."""
    if stage not in STAGES:
        raise ValueError(f"unknown stage {stage!r}")
    if stage == "shadow":
        return "logged"
    if route != "post":
        return "to_operator"
    return "awaiting_approval" if stage == "approve" else "posted"


def readiness(cases: list[dict]) -> dict[str, dict]:
    """Per account, from a golive results.json 'cases' list: the highest stage its test emails support.

    approve needs: no wrong order and no exception that would have posted, on any run.
    auto needs, on top: every clean order posted on its own and every held email held for the right reason, on every run.
    """
    acc: dict[str, dict] = defaultdict(
        lambda: {"emails": 0, "runs": 0, "critical": 0, "misses": 0, "posted": 0, "should_post": 0}
    )
    for case in cases:
        for run in case["runs"]:
            out = run.get("output") or {}
            account = out.get("account") or "?"
            a = acc[account]
            a["runs"] += 1
            v = run["verdicts"]
            crit = any(v.get(k, {}).get("result") == "fail" for k in ("no_wrong_order_posted", "exceptions_held"))
            a["critical"] += crit
            if v.get("posted_touchless", {}).get("result") in ("pass", "fail"):
                a["should_post"] += 1
                a["posted"] += v["posted_touchless"]["result"] == "pass"
            a["misses"] += (not run["passed"]) and not crit
        acc[(case["runs"][0].get("output") or {}).get("account") or "?"]["emails"] += 1
    for a in acc.values():
        a["supports"] = "shadow" if a["critical"] else ("auto" if a["misses"] == 0 else "approve")
    return dict(acc)
