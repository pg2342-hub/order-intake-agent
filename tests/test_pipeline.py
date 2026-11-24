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
