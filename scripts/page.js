(() => {
  const D = window.DATA;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const STAGES = ["shadow", "approve", "auto"];
  const STAGE_TXT = { shadow: "Shadow", approve: "Approve", auto: "Auto" };
  const ACTION_TXT = { posted: "POSTED TO TMS", awaiting_approval: "READY, ONE CLICK TO POST", to_operator: "HELD FOR AN OPERATOR", logged: "SHADOW, LOGGED ONLY" };
  const REASON_TXT = {
    hazmat: "Hazardous material: an operator checks the safety data sheet and placards first.",
    duplicate: "This reference is already an open order in the TMS.",
    change_request: "It changes an order already booked.",
    cancel_request: "It cancels an order already booked.",
    not_an_order: "It is not an order.",
    ref_not_in_email: "The reference read is not written anywhere in the email.",
    weight_not_in_email: "The weight read is not written anywhere in the email.",
    unknown_sender: "The sender is not a known shipper account.",
    "date_check:order": "The dates run backwards or start before the email was sent.",
    "date_check:format": "A date could not be read.",
    "account_rule:equipment": "Wrong equipment for this shipper.",
    "account_rule:appointment": "This shipper's deliveries need an appointment.",
    "account_rule:temperature": "A reefer load with no temperature.",
    "account_rule:liftgate": "Store deliveries need a liftgate.",
    "account_rule:reference_format": "The reference is not in this shipper's format.",
  };
  const FIELD_TXT = {
    customer_ref: "reference", pickup_facility: "pickup facility", pickup_date: "pickup date", delivery_facility: "delivery facility",
    delivery_date: "delivery date", weight_lb: "weight", pallets: "pallet count", pickup_window: "pickup window",
  };
  const reasonText = (r) => {
    if (REASON_TXT[r]) return REASON_TXT[r];
    const [k, f] = r.split(":");
    const name = FIELD_TXT[f] || f;
    if (k === "missing_field") return `No ${name} in the email.`;
    if (k === "uncertain") return `The agent was not sure of the ${name}.`;
    if (k === "unknown_facility") return `The ${name} is not in the facility directory.`;
    return r;
  };
  const EQ = { dry_van_53: "53 ft dry van", reefer_53: "53 ft reefer", flatbed_48: "48 ft flatbed" };
  const fac = (c) => (c ? D.facilities[c] || c : null);
  const num = (n) => (n == null ? null : Number(n).toLocaleString("en-US"));

  let who = "agent", sel = D.cases[0].id, group = "all";
  const stageFor = {};
  for (const [k, a] of Object.entries(D.accounts)) stageFor[k] = a.supports || "shadow";

  const status = (r, c) => (r.crit ? "crit" : r.failed.length ? "fail" : "pass");

  function list() {
    const ul = $("#mlist");
    const shown = D.cases.filter((c) => group === "all" || c.group === group);
    $("#icount").textContent = `${shown.length} emails`;
    ul.innerHTML = shown
      .map((c) => {
        const r = c[who];
        const st = status(r, c);
        const from = D.accounts[c.expected.account]?.name || c.email.from;
        return `<li><button type="button" role="option" aria-selected="${c.id === sel}" data-id="${c.id}"><i class="dot ${st}" aria-label="${st}"></i><span class="who">${esc(from)}</span><small>${esc(c.email.subject || "(no subject)")}</small></button></li>`;
      })
      .join("");
    ul.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => pick(b.dataset.id)));
  }

  function mail(c) {
    const e = c.email;
    const att = (e.attachments || []).map((a) => `<div class="att"><b>${esc(a.name)}</b><pre>${esc(a.text)}</pre></div>`).join("");
    $("#mail").innerHTML = `<div class="mh"><b>From</b> ${esc(e.from)}<br><b>Sent</b> ${esc(e.date.replace("T", " ").slice(0, 16))}</div><h2>${esc(e.subject || "(no subject)")}</h2><pre>${esc(e.body)}</pre>${att}`;
  }

  function action(route, stage) {
    if (stage === "shadow") return "logged";
    if (route !== "post") return "to_operator";
    return stage === "approve" ? "awaiting_approval" : "posted";
  }

  function row(label, got, want, fmt = (x) => x) {
    const g = got == null || got === "" || (Array.isArray(got) && !got.length) ? null : got;
    const same = JSON.stringify(got ?? null) === JSON.stringify(want ?? null);
    const shown = g == null ? "none" : esc(fmt(g));
    if (want === undefined || same) return `<dt>${label}</dt><dd class="${g == null ? "na" : ""}">${shown}</dd>`;
    const w = want == null || (Array.isArray(want) && !want.length) ? "none" : esc(fmt(want));
    return `<dt>${label}</dt><dd class="bad">${shown}<small>should be ${w}</small></dd>`;
  }

  function doc(c) {
    const r = c[who];
    const o = r.out.order || {};
    const acct = c.expected.account;
    const stage = stageFor[acct];
    const act = action(r.out.route, stage);
    const want = c.expected.route === "post" ? c.expected.order : undefined;
    const W = (k) => (want ? want[k] : undefined);
    const stops = (f, d, extra) => [fac(f), d, extra].filter(Boolean).join(", ");
    const isOrder = r.out.request_type !== "not_an_order" && r.out.request_type !== "cancel";
    let body = "";
    if (isOrder) {
      body += `<dl class="tender">
        ${row("Shipper", D.accounts[r.out.account]?.name, undefined)}
        ${row("Reference", o.customer_ref, W("customer_ref"))}
        ${row("Pickup", stops(o.pickup_facility, o.pickup_date, o.pickup_window), want ? stops(W("pickup_facility"), W("pickup_date"), W("pickup_window")) : undefined)}
        ${row("Delivery", stops(o.delivery_facility, o.delivery_date, o.delivery_appt_required ? "appointment" : ""), want ? stops(W("delivery_facility"), W("delivery_date"), W("delivery_appt_required") ? "appointment" : "") : undefined)}
        ${row("Equipment", o.equipment, W("equipment"), (x) => EQ[x] || x)}
        ${row("Temperature", o.temp_f, W("temp_f"), (x) => `${x} F`)}
        ${row("Weight", o.weight_lb, W("weight_lb"), (x) => `${num(x)} lb`)}
        ${row("Pallets", o.pallets, W("pallets"))}
        ${row("Hazmat", o.hazmat ? o.un_number || "yes" : null, want ? (W("hazmat") ? W("un_number") || "yes" : null) : undefined)}
        ${row("Accessorials", o.accessorials, W("accessorials"), (x) => x.join(", "))}
      </dl>`;
    } else {
      body += `<p class="point">${r.out.request_type === "cancel" ? `A cancellation of order ${esc(o.customer_ref || "")}. Nothing to enter.` : "Not an order. Nothing to enter."}</p>`;
    }
    if (r.out.reasons?.length) {
      body += `<div class="why"><h3>Why it is held</h3><ul>${r.out.reasons.map((x) => `<li>${esc(reasonText(x))}</li>`).join("")}</ul>${r.out.note ? `<p><b>Note to the operator:</b> ${esc(r.out.note)}</p>` : ""}</div>`;
    } else if (who === "parser") {
      body += `<div class="why"><h3>The template parser posts everything</h3><p>It has no way to hold an email it does not understand.</p></div>`;
    }
    const expTxt = c.expected.route === "post" ? "post on its own with every field right" : "be held for an operator";
    const res = r.crit ? "<b>Critical:</b> " : r.failed.length ? "<b>Missed:</b> " : "<b>Right.</b> ";
    const detail = Object.values(r.why).filter(Boolean)[0] || "";
    body += `<p class="grade">This email should ${expTxt}. ${res}${esc(detail)} Passed on ${r.passed_runs} of ${r.runs} run${r.runs > 1 ? "s" : ""}.</p>`;
    if (who === "agent") body += `<div class="dmeta"><span>${esc(D.model)}</span><span>$${r.cost_usd.toFixed(4)}</span><span>${r.latency_s.toFixed(1)} s</span></div>`;
    const segs = STAGES.map((s) => `<button type="button" role="radio" aria-checked="${s === stage}" data-s="${s}">${STAGE_TXT[s]}</button>`).join("");
    const readers = [["agent", "Claude agent"], ["parser", "Template parser"]].map(([k, t]) => `<button type="button" role="radio" aria-checked="${k === who}" data-w="${k}">${t}</button>`).join("");
    $("#doc").innerHTML = `<div class="dhead"><span class="status st-${act}">${ACTION_TXT[act]}</span><span class="n">${esc(c.id)}</span></div>
      <div class="ctl"><div class="seg" role="radiogroup" aria-label="Reader" id="wseg">${readers}</div>
      <label>${esc(D.accounts[acct].name)} stage</label><div class="seg" role="radiogroup" aria-label="Rollout stage" id="sseg">${segs}</div></div>
      <div class="dbody">${body}</div>`;
    $("#sseg").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { stageFor[acct] = b.dataset.s; doc(c); }));
    $("#wseg").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { who = b.dataset.w; list(); doc(c); }));
  }

  function pick(id) {
    sel = id;
    const c = D.cases.find((x) => x.id === id);
    list(); mail(c); doc(c);
  }

  function compare() {
    const rows = [["agent", "Claude agent", `${D.model}, guardrails in code`], ["parser", "Template parser", "Labels and fixed defaults, no model"]];
    $("#vrows").innerHTML = rows
      .map(([k, name, sub]) => {
        const cells = D.cases.map((c) => `<a class="cell ${status(c[k])}" href="#tool" data-id="${c.id}" aria-label="${name}, email ${c.id}: ${status(c[k])}"></a>`).join("");
        const passed = D.cases.filter((c) => c[k].passed_runs === c[k].runs).length;
        const crit = D.cases.filter((c) => c[k].crit).length;
        const dec = D[k].decision;
        const badge = dec === "go" ? `<span class="gate go">GO</span>` : dec === "partial" ? `<span class="gate partial">PARTIAL</span>` : `<span class="gate nogo">NO-GO</span>`;
        return `<div class="vrow"><div class="vwho"><b>${name}</b><span>${sub}</span></div><div class="strip">${cells}</div><div class="vscore"><b>${passed}</b><span>of 30 right on every run<br>${crit} critical</span></div>${badge}</div>`;
      })
      .join("");
    document.querySelectorAll("#vrows .cell").forEach((a) => a.addEventListener("click", () => { who = a.closest(".vrow") === document.querySelectorAll("#vrows .vrow")[1] ? "parser" : "agent"; pick(a.dataset.id); }));
  }

  function ladder() {
    const accts = Object.entries(D.accounts);
    const W = 760, L = 230, rowH = 52, top = 34, colW = (W - L - 10) / 3;
    let svg = `<svg viewBox="0 0 ${W} ${top + rowH * accts.length + 8}" role="img" aria-label="Rollout stage each account's test emails support">`;
    STAGES.forEach((s, i) => { svg += `<text class="col" x="${L + colW * i + 8}" y="20">${STAGE_TXT[s].toUpperCase()}</text>`; });
    accts.forEach(([code, a], j) => {
      const y = top + rowH * j;
      const reach = STAGES.indexOf(a.supports || "shadow");
      svg += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--rule-soft)"/>`;
      svg += `<text class="lab" x="0" y="${y + 22}">${esc(a.name)}</text><text class="sub" x="0" y="${y + 40}">${a.emails} test emails, ${a.critical} critical, ${a.misses} missed (3 runs)</text>`;
      for (let i = 0; i < 3; i++) {
        const on = i <= reach;
        svg += `<rect x="${L + colW * i + 4}" y="${y + 12}" width="${colW - 8}" height="26" rx="8" fill="${on ? (i === reach && reach === 2 ? "var(--green)" : "var(--green-wash)") : "none"}" stroke="${on ? "none" : "var(--rule)"}"/>`;
      }
    });
    svg += `</svg>`;
    $("#ladder").innerHTML = svg;
    const auto = accts.filter(([, a]) => a.supports === "auto").map(([, a]) => a.name);
    $("#laddernote").textContent = `Counts are over 3 runs of each email. An account supports approve with no critical error on any run, and auto when every clean order also posted on its own and every held email was held for the right reason. ${auto.length} of ${accts.length} accounts support auto on this test set. In a pilot the same bar runs on the shipper's real email, during shadow.`;
  }

  function accounts() {
    $("#accts").innerHTML = Object.values(D.accounts).map((a) => `<div class="acct"><h3>${esc(a.name)}</h3><ul>${a.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("");
  }

  document.querySelectorAll("#ifilter button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("#ifilter button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    group = b.dataset.g; list();
  }));

  $("#datanote").textContent = `All shippers, facilities, people and numbers are invented: 30 emails written for this test, 5 fictional shipper accounts and a 13-facility directory. The agent's results are a recorded live run of ${D.model} (${D.calls} calls, mean $${D.mean_cost_usd.toFixed(4)} and ${D.mean_latency_s.toFixed(1)} s per call), replayed through the current code; the judge that grades operator notes is also ${D.model}.`;
  compare(); ladder(); accounts(); pick(sel);
})();
