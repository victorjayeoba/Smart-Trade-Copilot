# 🛡️ Smart Trade Copilot

> **An autonomous AI agent with a non-overridable deterministic safety core.**
> It decides for itself which OKX onchainOS skills to call to vet a token —
> then a fixed, unit-tested safety engine the LLM *cannot override* delivers
> the final 🟢 BUY / 🟡 CAUTION / 🔴 AVOID ruling.
>
> Built for the **Build X-Agent Hackathon** (OKX Web3) · Builder Track · X Layer.

**▶ Live demo:** _<add your Vercel URL here>_ &nbsp;·&nbsp; **Code:** github.com/victorjayeoba/Smart-Trade-Copilot

---

## The thesis (why this wins)

Most "AI trading agents" let the model decide everything — including whether
your money is safe. That's exactly backwards. LLMs are great at *deciding what
to investigate* and terrible at *being a reliable safety authority*.

Smart Trade Copilot splits those two jobs:

| Layer | Who decides | Property |
|---|---|---|
| **Investigation** | The LLM agent | Autonomous — picks which OKX skills to call, in what order, aborts early on a veto |
| **Judgement** | `verdict.js` | Deterministic, unit-tested, **the agent is contractually forbidden from overriding it** |

So the agent is genuinely agentic *and* the safety verdict is something you can
actually trust — **because** an LLM didn't make it. That separation is the
whole product.

## What it does

Ask about any token. The agent autonomously orchestrates the OKX onchainOS
skill suite as tools:

```
security ─→ token/market ─→ holder clusters ─→ smart-money signals
         ↘ (honeypot/CRITICAL? abort immediately, don't waste calls)
            ↘ memepump (if meme) ─→ defi alternatives
                                  ↘ deterministic safety core ─→ VERDICT
```

- **Security can hard-veto** (honeypot / CRITICAL → AVOID, full stop).
- **A scan that doesn't complete is never a "pass"** → degrades to CAUTION.
- Negatives downgrade; positives only enrich the explanation. On the buy
  side, caution is cheap and being wrong is permanent.

### It doesn't just advise — it executes (gated) on X Layer

If the verdict permits **and** you explicitly confirm, the agent quotes and
broadcasts a real swap through the **OKX Agentic Wallet on X Layer** (the host
chain — near-zero gas). The execution path is *structurally* gated: when the
verdict is AVOID, the buy code is **unreachable** — the agent cannot route
around its own safety core. It never auto-confirms and never fakes a tx hash.

## Three ways it ships (one identity, three surfaces)

1. **`web/` — the product.** A deployed Next.js app: type a token, watch the
   agent reason live (streaming skill-trace), get the verdict card. *This is
   the entry.*
2. **`app/` — a CLI.** Same engine, terminal-native, with a confirmation-gated
   real swap through the OKX Agentic Wallet.
3. **`skills/` — an OKX Plugin Store skill.** The same pipeline as an
   installable `SKILL.md`.

## Run the live demo locally

```bash
cd web
npm install
echo "STC_FORCE_DEMO=1" > .env.local      # add OPENAI_API_KEY for the agent layer
npm run dev                                # open http://localhost:3000
```

Try **`BONK`** (🟢 BUY), **`SCAM`** (🔴 AVOID — honeypot veto), **`NEWPEPE`**
(🟡 CAUTION). Every data point is tagged `live` or `demo` in the UI — we never
pass fixtures off as live data.

For fully-live data, unset `STC_FORCE_DEMO` and add a personal OKX key
([OKX Developer Portal](https://web3.okx.com/onchain-os/dev-portal)).

## Verify the safety core (no network, no keys)

```bash
cd app && node tests/verdict.test.mjs      # 7/7 — honeypot vetoes, failed-scan ≠ pass
```

## Deploy (Vercel)

Import `web/` into Vercel. Set env vars: `OPENAI_API_KEY` and
`STC_FORCE_DEMO=1`. Both are server-side only — never shipped to the browser.

## License

MIT — © 2026 Victor Jayeoba
