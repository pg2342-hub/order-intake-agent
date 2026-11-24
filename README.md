# order-intake-agent

[![CI](https://github.com/pg2342-hub/order-intake-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/pg2342-hub/order-intake-agent/actions/workflows/ci.yml)

Demo page: https://pranavgudise.dev/order-intake-agent/ (pick any of the 30 test emails and see the order the agent fills in, or the note it leaves an operator; switch a shipper's rollout stage; no install needed)

An order-desk agent for a trucking company. Shippers email load requests as PDF tenders, spreadsheets, forwarded threads and one-line notes. The agent reads each email with that shipper's own rules and the facility directory, fills in the order for the transportation management system (TMS), and either posts it or hands it to an operator with a note saying why. Code, not the model, decides which: an order posts only when every guardrail passes and the shipper's rollout stage allows it.

## What happens to one email

1. **Account.** Code files the email under the shipper by the sender's domain (`intake/world.py`). The model never picks the customer.
2. **Read.** Claude reads the email and its attachments with the shipper's rules and the facility directory, and returns the order, the kind of request (new, change, cancel, not an order), the fields it is unsure of, and the exact text it read the reference and weight from (`intake/extractor.py`, structured output).
3. **Check.** Code holds the order if the reference or weight is not written in the email, a facility is not in the directory, a required field is missing, the dates run backwards, a shipper rule a rule can state is broken, or it is hazmat, a duplicate of an open order, a change or a cancellation (`intake/rules.py`). Hazmat words in the email hold it even if the model missed them.
4. **Hand off.** A held order goes to an operator with a two or three sentence note, written by a second Claude call after code has decided, so the note never guesses what the guardrails did.
5. **Rollout stage.** Each shipper is in `shadow` (nothing posts; the agent's order is compared with the one the operator keys), `approve` (good orders wait for one click) or `auto` (good orders post on their own), set in `rollout.yml` (`intake/rollout.py`). A held order never posts at any stage.

## The shippers

Five fictional accounts, each with the kind of rule operators carry in their heads:

| Shipper | Rules the agent must apply |
|---|---|
| Northgate Paper Co. | Reference is the Load Tender number, never the PO; every delivery needs an appointment; mill pickups default to 06:00-14:00 |
| Harbor Point Foods | Reefer; frozen at -10 F unless stated; pallet count required; Metro Grocers deliveries need an appointment |
| Ridgeline Building Supply | Flatbed; tarp lumber and drywall, not steel; relative dates ("tomorrow") |
| Calder Chemical | Reference is the Shipment No.; anything hazardous goes to an operator |
| Lakeshore Home Goods | Forwarded threads, latest message wins; store deliveries need a liftgate |

## The test set and the bar to post on its own

30 emails (`scripts/make_cases.py` writes `evals/cases.yml`): 10 clean, 7 messy formats (spreadsheet, run-together PDF text, a forwarded thread that moves the date, relative dates, nicknames, "38K LBS", an order under a signature full of other numbers), 5 that are only right if the shipper's rule is applied, and 8 exceptions that must never post (hazmat with and without a UN number, a duplicate, a change, a cancellation, a missing pallet count, an ambiguous facility, a rate question).

Checks (`evals/checks.py`, `evals/judge_checks.py`), graded with [golive-gate](https://github.com/pg2342-hub/golive-gate):

- critical: no order posts with any field wrong; no exception posts on its own
- an order that could post does post; every field is read right; a held email is held for the right reason; the operator note is usable (Claude judge)

A shipper can move from shadow to approve when its emails show no critical error on any of 3 runs, and to auto when, on top of that, every clean order posted and every held email was held for the right reason. The demo page shows the stage each shipper's test emails support. A template parser (labels plus fixed defaults, no model) on the same emails is the baseline the bar must block (`intake/baseline.py`).

## Run it

```
pip install -e ".[dev]"
pytest -q                                   # 43 tests, no network
order-intake case f03                       # replay one test email from the recorded live run, no key
order-intake read my_email.eml --stage approve   # read your own saved email, live Claude call (ANTHROPIC_API_KEY)
golive run evals/golive.yml                 # the whole test set on the recorded run
golive run evals/golive.baseline.yml        # the template parser: blocked
GOLIVE_LIVE=1 ANTHROPIC_API_KEY=... golive run evals/golive.live.yml   # a fresh live run, recorded to recordings/
```

`order-intake read` takes a `.eml` file (text, CSV and, with `pip install ".[pdf]"`, PDF attachments) or a JSON email.

## How the live run is recorded

The reader, the operator note and the judge call Claude (`claude-opus-5-5`, low effort, structured output). A live run writes every reply to `recordings/`, with cost and latency per call. CI and the demo page replay those replies through the current code (account lookup, guardrails, rollout and the TMS payload always run for real), so they need no API key. The **Record a live run** workflow (Actions tab, needs the `ANTHROPIC_API_KEY` secret) refreshes the recording and the demo page.

## CI

Every push runs ruff, the tests on Python 3.10 and 3.12, the template parser (which must be blocked), and the test set on the recorded run, which fails the build if any wrong order or exception would have posted.

All shippers, facilities, people, addresses and numbers are invented.
