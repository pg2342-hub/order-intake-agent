"""Agents for golive-gate. golive calls each with case.input (one email) and grades the outcome.

- recorded_agent:  the full pipeline, with Claude's replies replayed from recordings/ (no key)
- live_agent:      the full pipeline, calling Claude now and recording each reply (needs ANTHROPIC_API_KEY)
- template_parser: the no-model template parser the gate must block
Only the model's replies are recorded; account lookup, guardrails and the TMS payload always run
as code, so CI tests the current code against the recorded model decisions.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from golive_gate import Response

from intake import pipeline
from intake.baseline import baseline
from intake.recorded import ROOT, Tape, recording_extractor, replay_extractor

TAPE = Tape(ROOT / "extractor.jsonl")


def fingerprint():
    """Model, prompts and schemas: a recording made with any other version does not replay."""
    from intake import extractor

    return {
        "model": extractor.MODEL,
        "effort": extractor.EFFORT,
        "system": extractor.SYSTEM,
        "schema": extractor.SCHEMA,
        "note_system": extractor.NOTE_SYSTEM,
        "note_schema": extractor.NOTE_SCHEMA,
    }


_live = None


def _respond(out):
    return Response(out, cost_usd=out.get("_meta", {}).get("cost_usd", 0.0))


def recorded_agent(case_input):
    return _respond(pipeline.run(case_input, replay_extractor(TAPE, fingerprint())))


def live_agent(case_input):
    global _live
    if _live is None:  # created on first use, so importing this file needs no key
        from intake.extractor import ClaudeExtractor

        _live = recording_extractor(ClaudeExtractor(), TAPE, fingerprint())
    return _respond(pipeline.run(case_input, _live))


def template_parser(case_input):
    return baseline(case_input)
