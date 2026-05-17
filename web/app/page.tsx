"use client";

import { useRef, useState } from "react";

type Step =
  | { kind: "thought"; text: string }
  | { kind: "skill"; skill: string; state: "run" | "done" | "error"; source?: string; note?: string };

const SKILL_LABEL: Record<string, string> = {
  okx_security_scan: "OKX Security · honeypot / rug / tax",
  "okx-security": "OKX Security · honeypot / rug / tax",
  okx_token_report: "OKX Token + Market · liquidity, dev history",
  "okx-token/market": "OKX Token + Market · liquidity, dev history",
  okx_holder_clusters: "OKX Clusters · holder concentration",
  "okx-clusters": "OKX Clusters · holder concentration",
  okx_smart_money: "OKX Signals · smart-money flow",
  "okx-signals": "OKX Signals · smart-money flow",
  okx_meme_risk: "OKX Memepump · bundler / sniper risk",
  "okx-memepump": "OKX Memepump · bundler / sniper risk",
  okx_defi_alternatives: "OKX DeFi · yield alternatives",
  "okx-defi": "OKX DeFi · yield alternatives",
};

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [verdict, setVerdict] = useState<any>(null);
  const [dataSource, setDataSource] = useState<string>("");
  const [lastSymbol, setLastSymbol] = useState("");
  const [exec, setExec] = useState<any>(null); // execution events
  const [amount, setAmount] = useState("0.5");
  const traceEnd = useRef<HTMLDivElement>(null);

  function push(s: Step) {
    setSteps((prev) => {
      // collapse skill run→done into one row
      if (s.kind === "skill" && (s.state === "done" || s.state === "error")) {
        const i = [...prev]
          .reverse()
          .findIndex((p) => p.kind === "skill" && (p as any).skill === s.skill && (p as any).state === "run");
        if (i >= 0) {
          const idx = prev.length - 1 - i;
          const next = [...prev];
          next[idx] = s;
          return next;
        }
      }
      return [...prev, s];
    });
    setTimeout(() => traceEnd.current?.scrollIntoView({ behavior: "smooth" }), 30);
  }

  async function analyze(sym?: string) {
    const s = (sym || symbol).trim();
    if (!s || busy) return;
    setBusy(true);
    setSteps([]);
    setVerdict(null);
    setDataSource("");
    setExec(null);
    setLastSymbol(s);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: s, prompt: `should I buy ${s}?` }),
    });
    if (!res.body) {
      setBusy(false);
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() || "";
      for (const p of parts) {
        const line = p.replace(/^data: /, "").trim();
        if (!line) continue;
        let ev: any;
        try {
          ev = JSON.parse(line);
        } catch {
          continue;
        }
        if (ev.type === "thought") push({ kind: "thought", text: ev.text });
        else if (ev.type === "note") push({ kind: "thought", text: ev.text });
        else if (ev.type === "skill_start")
          push({ kind: "skill", skill: ev.skill, state: "run" });
        else if (ev.type === "skill_done")
          push({ kind: "skill", skill: ev.skill, state: "done", source: ev.source, note: ev.note });
        else if (ev.type === "skill_error")
          push({ kind: "skill", skill: ev.skill, state: "error", note: ev.error });
        else if (ev.type === "verdict") {
          setVerdict(ev.verdict);
          setDataSource(ev.dataSource);
        } else if (
          ev.type === "execution_blocked" ||
          ev.type === "execution_offered" ||
          ev.type === "execution_unavailable" ||
          ev.type === "swap_quote" ||
          ev.type === "awaiting_confirmation" ||
          ev.type === "swap_broadcast" ||
          ev.type === "execution_error"
        ) {
          setExec((prev: any) => ({ ...(prev || {}), [ev.type]: ev }));
        } else if (ev.type === "fatal")
          push({ kind: "thought", text: "Error: " + ev.error });
      }
    }
    setBusy(false);
  }

  // Gated buy. `confirmed` is only ever true when the user clicks the
  // explicit Broadcast button — the agent never self-confirms.
  async function buy(confirmed: boolean) {
    if (!lastSymbol || busy) return;
    setBusy(true);
    if (!confirmed) setExec(null);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: lastSymbol,
        buy: true,
        amount,
        // omit payToken — the agent picks the chain-correct one
        confirmed,
      }),
    });
    if (!res.body) {
      setBusy(false);
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() || "";
      for (const p of parts) {
        const line = p.replace(/^data: /, "").trim();
        if (!line) continue;
        let ev: any;
        try {
          ev = JSON.parse(line);
        } catch {
          continue;
        }
        if (
          ev.type?.startsWith("execution_") ||
          ev.type === "swap_quote" ||
          ev.type === "awaiting_confirmation" ||
          ev.type === "swap_broadcast"
        ) {
          setExec((prev: any) => ({ ...(prev || {}), [ev.type]: ev }));
        }
      }
    }
    setBusy(false);
  }

  return (
    <div className="wrap">
      <div className="brand">
        <span className="dot" />
        <h1>Smart Trade Copilot</h1>
      </div>
      <p className="tagline">
        An <b>autonomous AI agent</b> that decides which OKX onchainOS skills to
        call to vet a token — wrapped around a <b>non-overridable deterministic
        safety core</b>. The agent investigates; it cannot decide a token is
        safe. Built for X&nbsp;Layer.
      </p>

      <div className="card">
        <div className="row">
          <input
            className="token"
            placeholder="Real token contract address — e.g. 0xa0b8…eb48 (USDC), or a symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            disabled={busy}
          />
          <button className="go" onClick={() => analyze()} disabled={busy}>
            {busy ? "Analyzing…" : "Analyze"}
          </button>
        </div>
        <div className="chips">
          {[
            { label: "USDC", q: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
            { label: "WETH", q: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
            { label: "WBTC", q: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" },
            { label: "PEPE", q: "0x6982508145454ce325ddbe47a25d4ec3d2311933" },
          ].map((c) => (
            <span
              key={c.label}
              className="chip chip-live"
              onClick={() => !busy && (setSymbol(c.q), analyze(c.q))}
              title="Real token — fully live OKX onchainOS data"
            >
              ▶ {c.label} · LIVE
            </span>
          ))}
          <span
            className="chip chip-scenario"
            onClick={() => !busy && (setSymbol("RUGPULL"), analyze("RUGPULL"))}
            title="Curated honeypot scenario — every datapoint is tagged 'demo' in the trace, never disguised as live. Shows the safety core's hard-veto."
          >
            ⚠ RUGPULL · SCENARIO
          </span>
        </div>
        <p className="chip-hint">
          The first four are <b>real on-chain tokens analysed fully live</b> on
          OKX onchainOS (each datapoint tagged <code>live</code>); the verdict
          is whatever the real data says. <b>RUGPULL</b> is a{" "}
          <b>curated honeypot scenario</b> (tagged <code>demo</code>, never
          shown as live) so you can see the deterministic safety core hard-veto
          and block execution. Or paste any real contract address.
        </p>

        {steps.length > 0 && (
          <div className="trace">
            {steps.map((s, i) =>
              s.kind === "thought" ? (
                <div key={i} className="step thought">
                  <span className="ic">»</span>
                  <span>{s.text}</span>
                </div>
              ) : (
                <div key={i} className="step">
                  <span className="ic">
                    {s.state === "run" ? "◴" : s.state === "error" ? "✕" : "✔"}
                  </span>
                  <span>{SKILL_LABEL[s.skill] || s.skill}</span>
                  {s.source && (
                    <span className={`src ${s.source}`}>{s.source}</span>
                  )}
                </div>
              ),
            )}
            <div ref={traceEnd} />
          </div>
        )}
      </div>

      {verdict && (
        <div className={`verdict ${verdict.verdict}`}>
          <h2>
            {verdict.verdict === "BUY" ? "🟢" : verdict.verdict === "CAUTION" ? "🟡" : "🔴"}{" "}
            {verdict.verdict}
          </h2>
          {verdict.biggestRisk ? (
            <p className="big-risk">
              <b>Biggest risk — {verdict.biggestRisk.tag}:</b>{" "}
              {verdict.biggestRisk.detail}
            </p>
          ) : (
            <p className="big-risk">No blocking risk detected.</p>
          )}
          <div className="findings">
            {verdict.reasons?.map((r: any, i: number) => (
              <div key={i} className="finding">
                <span className="t">{r.weight === "veto" ? "■" : "▲"} {r.tag}</span> — {r.detail}
              </div>
            ))}
            {verdict.positives?.map((p: string, i: number) => (
              <div key={"p" + i} className="finding">
                + {p}
              </div>
            ))}
          </div>
          <div className="moat">
            <b>Why you can trust this verdict:</b> the LLM agent gathered the
            evidence autonomously, but this ruling was computed by a
            deterministic, unit-tested safety core the model is contractually
            forbidden from overriding. Security can hard-veto; a scan that
            doesn’t complete is never treated as a pass. Data source:{" "}
            <b>{dataSource}</b>.
          </div>

          {/* Execution is structurally gated: this panel does not even
              render on AVOID — there is no buy path for a vetoed token. */}
          {verdict.verdict === "AVOID" ? (
            <div className="exec blocked">
              🔒 Execution path is <b>structurally unreachable</b> — the agent
              cannot swap a token the safety core vetoed. No override exists.
            </div>
          ) : (
            <div className="exec">
              <div className="exec-head">
                Execute buy on{" "}
                <b>
                  {exec?.execution_offered?.chain
                    ? exec.execution_offered.chain === "xlayer"
                      ? "X Layer"
                      : cap(exec.execution_offered.chain)
                    : "the token's chain"}
                </b>{" "}
                (OKX Agentic Wallet)
              </div>
              <div className="row">
                <input
                  className="token"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={busy}
                  style={{ maxWidth: 120 }}
                />
                <span className="pay">
                  {exec?.execution_offered?.payToken || "pay"} →
                </span>
                <button className="go" onClick={() => buy(false)} disabled={busy}>
                  {busy ? "…" : "Get quote"}
                </button>
              </div>

              {exec?.execution_unavailable && (
                <p className="exec-note">
                  ⚠ {exec.execution_unavailable.reason}
                </p>
              )}
              {exec?.execution_offered && !exec?.execution_unavailable && (
                <p className="exec-note ok">
                  ✔ Verdict permits execution — quoting…
                </p>
              )}
              {exec?.swap_quote && (
                <div className="quote">
                  Quote: ~<b>{String(exec.swap_quote.toAmount ?? "?")}</b> out ·
                  price impact {String(exec.swap_quote.priceImpactPct ?? "?")}%
                  {exec.swap_quote.isHoneypot && (
                    <span className="src error"> HONEYPOT — blocked</span>
                  )}
                </div>
              )}
              {exec?.awaiting_confirmation && !exec?.swap_broadcast && (
                <div className="confirm">
                  <p>{exec.awaiting_confirmation.text}</p>
                  <button
                    className="go danger"
                    onClick={() => buy(true)}
                    disabled={busy}
                  >
                    {busy ? "Broadcasting…" : "✓ Yes, broadcast for real"}
                  </button>
                </div>
              )}
              {exec?.swap_broadcast && (
                <p className="exec-note ok">
                  ✔ Broadcast — tx{" "}
                  <code>{exec.swap_broadcast.txHash || "(see explorer)"}</code> ·{" "}
                  {exec.swap_broadcast.note}
                </p>
              )}
              {exec?.execution_error && (
                <p className="exec-note">✕ {exec.execution_error.error}</p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="foot">
        Powered by OKX onchainOS · X&nbsp;Layer · the agent calls{" "}
        <code>security · token · clusters · signals · memepump · defi</code> as
        tools.
        <br />
        Also ships as an OKX Plugin Store skill and a standalone CLI ·{" "}
        <a href="https://github.com/victorjayeoba/Smart-Trade-Copilot">
          source on GitHub
        </a>
      </p>
    </div>
  );
}
