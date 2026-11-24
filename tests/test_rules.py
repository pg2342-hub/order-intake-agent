from intake.rules import numbers_in
from intake.world import account_for


def test_numbers_in_reads_commas_k_and_decimals():
    assert {41200, 38000, 33400} <= numbers_in("41,200 lbs, 38K LBS, 33400.00")


def test_account_comes_from_the_sender_domain():
    assert account_for("Dana <orders@harborpointfoods.example>") == "HPF"
    assert account_for("someone@gmail.com") is None


def test_readiness_needs_zero_critical_for_approve_and_no_misses_for_auto():
    from intake.rollout import readiness

    def run(account, passed, crit=False, posted="pass"):
        v = {"no_wrong_order_posted": {"result": "fail" if crit else "pass"}, "posted_touchless": {"result": posted}}
        return {"passed": passed, "verdicts": v, "output": {"account": account}}

    cases = [
        {"runs": [run("A", True), run("A", True)]},
        {"runs": [run("B", True), run("B", False, posted="fail")]},
        {"runs": [run("C", False, crit=True), run("C", True)]},
    ]
    r = readiness(cases)
    assert (r["A"]["supports"], r["B"]["supports"], r["C"]["supports"]) == ("auto", "approve", "shadow")
