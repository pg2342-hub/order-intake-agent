"""Rule checks plus one Claude judge check for what a rule cannot state exactly: whether the
operator's handoff note is something an operator can act on.

The judge runs live (and records each reply) when GOLIVE_LIVE=1, and replays the recorded
replies otherwise, so CI and the demo page need no API key.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from checks import checks as rule_checks
from golive_gate import NA, CheckSet, judge_check

from intake.recorded import ROOT, Tape, recording_judge, replay_judge

JUDGE_TAPE = Tape(ROOT / "judge.jsonl")
_judge = None


def judge(prompt):
    global _judge
    if _judge is None:
        if os.environ.get("GOLIVE_LIVE") == "1":
            from golive_gate import ClaudeJudge

            _judge = recording_judge(ClaudeJudge(model="claude-opus-5-5", effort="low"), JUDGE_TAPE)
        else:
            _judge = replay_judge(JUDGE_TAPE)
    return _judge(prompt)


def _held(out):
    return f"Held because (codes): {', '.join(out['reasons'])}\n\nNote to the operator:\n{out['note']}"


checks = CheckSet(rule_checks)

_usable = judge_check(
    "operator_note_usable",
    "The note tells an operator, in plain words, what the shipper asked for (or what the email is, if it is not an "
    "order), why it was not entered automatically, and exactly what to check or do next. It agrees with the codes "
    "shown and invents no facts. A note that only repeats a code, or that an operator could not act on, fails.",
    judge=judge,
    render_case=lambda case: (
        f"Email {case.id}: {case.title}\nSubject: {case.input['email']['subject']}\n\n{case.input['email']['body']}"
    ),
    render_output=_held,
)


@checks.check("operator_note_usable", text=_usable.text.split(".")[0] + ".")
def operator_note_usable(case, out):
    if out["route"] != "operator":
        return NA
    return _usable.run(case, out)
