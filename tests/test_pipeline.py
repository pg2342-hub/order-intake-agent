import pytest
from golive_gate import Gate, evaluate, load_cases, run_eval
from oracle import CASES, oracle

from intake import pipeline
from intake.baseline import baseline

ALL = load_cases("evals/cases.yml")


def test_thirty_cases_in_four_groups():
    groups = {}
    for c in ALL:
        groups[c.group] = groups.get(c.group, 0) + 1
    assert groups == {"clean": 10, "formats": 7, "rules": 5, "exceptions": 8}


@pytest.mark.parametrize("cid", sorted(CASES))
def test_correct_reading_routes_as_expected(cid):
    case = CASES[cid]
    out = pipeline.run(case.input, oracle(case))
    assert out["route"] == case.expected["route"], out["reasons"]
    if case.expected["route"] == "operator":
        assert any(r in out["reasons"] for r in case.expected["reasons"]), out["reasons"]
        assert out["note"]
    else:
        assert out["tms"]["reference"] == case.expected["order"]["customer_ref"]


def _gate(agent, checks_module="checks"):
    import importlib

    checks = importlib.import_module(checks_module).checks
    result = run_eval(agent, ALL, checks, runs=1)
    return evaluate(Gate.load("evals/gate.yml"), result)


def test_oracle_is_go_and_template_parser_is_no_go():
    by_id = {c.id: c for c in ALL}

    def agent(case_input):
        case = next(c for c in by_id.values() if c.input == case_input)
        return pipeline.run(case_input, oracle(case))

    assert _gate(agent).decision == "go"
    assert _gate(baseline).decision == "no-go"


def test_guardrail_holds_a_reference_the_email_never_wrote():
    case = CASES["c01"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "customer_ref": "LT-48823"}))
    assert out["route"] == "operator" and "ref_not_in_email" in out["reasons"]


def test_guardrail_holds_a_weight_the_email_never_wrote():
    case = CASES["c03"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "weight_lb": 36000}))
    assert "weight_not_in_email" in out["reasons"]


def test_hazmat_words_hold_even_if_the_model_misses_them():
    case = CASES["x02"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "hazmat": False}))
    assert out["route"] == "operator" and "hazmat" in out["reasons"]


def test_missing_liftgate_on_a_store_delivery_is_held():
    case = CASES["a04"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "accessorials": []}))
    assert "account_rule:liftgate" in out["reasons"]


def test_missing_tarps_posts_wrong_and_the_gate_catches_it():
    # tarps depend on what the load is, which only the model can judge: the critical check catches it
    from checks import no_wrong_order_posted

    case = CASES["a03"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "accessorials": []}))
    assert out["route"] == "post"
    verdict = no_wrong_order_posted(case, out)
    assert verdict.result == "fail" and "accessorials" in verdict.reason


def test_relative_date_in_the_past_is_held():
    case = CASES["f04"]
    out = pipeline.run(case.input, oracle(case, lambda o: {**o, "pickup_date": "2026-12-06"}))
    assert "date_check:order" in out["reasons"]


def test_rollout_stage_decides_what_happens():
    case = CASES["c01"]
    assert pipeline.run(case.input, oracle(case), stage="shadow")["action"] == "logged"
    assert pipeline.run(case.input, oracle(case), stage="approve")["action"] == "awaiting_approval"
    assert pipeline.run(case.input, oracle(case), stage="auto")["action"] == "posted"
    held = CASES["x01"]
    for stage in ("approve", "auto"):
        assert pipeline.run(held.input, oracle(held), stage=stage)["action"] == "to_operator"


def test_eml_file_loads(tmp_path):
    from intake.cli import load

    raw = (
        "From: Dana <orders@harborpointfoods.example>\nTo: orders@lanternfreight.example\n"
        "Date: Mon, 07 Dec 2026 07:55:00 -0600\nSubject: PO 30417\nMIME-Version: 1.0\n"
        'Content-Type: multipart/mixed; boundary="b"\n\n--b\nContent-Type: text/plain\n\nNeed a reefer.\n'
        '--b\nContent-Type: text/csv\nContent-Disposition: attachment; filename="loads.csv"\n\nPO,Weight\n30417,36500\n--b--\n'
    )
    p = tmp_path / "x.eml"
    p.write_text(raw)
    mail = load(p)
    assert mail["date"].startswith("2026-12-07") and mail["attachments"][0]["name"] == "loads.csv"
    assert "Need a reefer" in mail["body"]
