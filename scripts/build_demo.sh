#!/usr/bin/env bash
# Rebuild the GitHub Pages demo in docs/ from the recorded live run (no API key needed).
set -euo pipefail
cd "$(dirname "$0")/.."
golive run evals/golive.yml --out reports/recorded >/dev/null || true
golive run evals/golive.baseline.yml --out reports/baseline >/dev/null || true
python scripts/build_page.py
python - <<'PY'
from pathlib import Path
s = Path("scripts")
desc = ("Order Intake Agent: Claude reads shipment-request emails, applies each shipper's rules, and posts the order "
        "or hands it to an operator; recorded live run on 30 test emails against a template parser.")
page = (
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
    f'<title>Order Intake Agent</title>\n<meta name="description" content="{desc}">\n'
    "<style>\n" + (s / "starter.css").read_text() + (s / "page.css").read_text() + "</style></head><body>\n"
    + (s / "page_body.html").read_text()
    + '<script src="data.js"></script>\n<script>\n' + (s / "page.js").read_text() + "</script></body></html>\n"
)
Path("docs/index.html").write_text(page)
PY
python scripts/demo_chrome.py docs/index.html --repo order-intake-agent
touch docs/.nojekyll
echo "demo written to docs/"
