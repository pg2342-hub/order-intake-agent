from intake.rules import numbers_in
from intake.world import account_for


def test_numbers_in_reads_commas_k_and_decimals():
    assert {41200, 38000, 33400} <= numbers_in("41,200 lbs, 38K LBS, 33400.00")


def test_account_comes_from_the_sender_domain():
    assert account_for("Dana <orders@harborpointfoods.example>") == "HPF"
    assert account_for("someone@gmail.com") is None
