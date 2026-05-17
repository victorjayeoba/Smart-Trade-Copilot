# Smart Trade Copilot

> An autonomous AI agent that decides for itself which OKX onchainOS skills to call to vet a token — then a fixed, unit-tested safety core the LLM **cannot override** delivers the final 🟢 BUY / 🟡 CAUTION / 🔴 AVOID ruling, and (only when it's safe) executes the swap.

**Build X-Agent Hackathon (OKX Web3) · Builder Track · X Layer**

---

## Live demo / video

> 📹 **Demo video:** _coming soon — placeholder_

**Live demo:** _<deploy URL TBD>_

> Note: the genuinely-live proof is the local CLI running against the real `onchainos`
> binary. The serverless web host (Vercel) cannot ship that binary, so a hosted site
> serves clearly `demo`-tagged data with the same engine and UI. Nothing is ever faked.

---

## The thesis — why this is different

Most "AI trading agents" let the model decide everything — including whether your money
is safe. That is backwards. LLMs are excellent at *deciding what to investigate* and
unreliable as a *safety authority*.

Smart Trade Copilot splits those two jobs:

| Layer | Who decides | Property |
|---|---|---|
| **Investigation** | The LLM agent | Autonomous — picks which OKX skills to call, in what order, and aborts early on a security veto |
| **Judgement** | `verdict.js` | Deterministic, unit-tested; the agent is **structurally forbidden from overriding it** |

The agent is genuinely agentic *and* the verdict is trustworthy — **because** an LLM
didn't make it. On AVOID, the execution path is unreachable code, not a prompt
guardrail. That separation is the whole product.

## What it does

Ask about any token. The agent orchestrates the OKX onchainOS skill suite as tools and
normalizes each response into the signals the safety core expects:

```
security ─→ token/market ─→ holder clusters ─→ smart-money signals
         ↘ (honeypot / CRITICAL? abort immediately — don't waste calls)
            ↘ memepump (if meme/launchpad) ─→ defi alternatives
                                            ↘ deterministic safety core ─→ VERDICT
                                                                         ↘ gated swap
```

- **Security can hard-veto** (honeypot or CRITICAL → AVOID, full stop).
- **A scan that doesn't complete is never a "pass"** → it degrades to CAUTION.
- Negatives downgrade; positives only enrich the explanation. Two independent
  downgrades collapse to AVOID even without a veto.
- If the verdict permits **and** the user explicitly confirms, the agent quotes and
  broadcasts a real swap through the OKX Agentic Wallet. It never auto-confirms and
  never fabricates a tx hash.

## Three surfaces, one engine

1. **`web/` — Next.js app.** Routes `/` (landing) and `/try-it` (live analyzer):
   type a token or paste a contract address, watch the agent reason live (streamed
   skill trace), get the verdict card and gated execution panel.
2. **`app/` — standalone CLI.** Same safety core, terminal-native, with a
   confirmation-gated real swap. Run via `node src/index.js …` or the `stc` bin.
3. **`skills/smart-trade-copilot/` — OKX Plugin Store skill.** The same disciplined
   pipeline packaged as an installable plugin (`plugin.yaml` + `skills/`).

## Architecture

- **Agent loop (`web/lib/agent.js`)** — a real OpenAI tool-calling loop. The model is
  given the OKX skills as tools (`okx_security_scan`, `okx_token_report`,
  `okx_holder_clusters`, `okx_smart_money`, `okx_meme_risk`, `okx_defi_alternatives`,
  `finalize`) and chooses what to call. Without `OPENAI_API_KEY` it falls back to an
  honest, non-LLM deterministic sweep (the UI states the agent layer is inactive).
- **Skill layer (`web/lib/okx.js`, `app/src/onchainos.js`)** — shells out to the real
  `onchainos` CLI. Every datapoint is tagged `live` or `demo`. If the binary/key is
  unavailable (e.g. serverless), it transparently falls back to curated fixtures,
  always tagged `demo` — never disguised as live.
- **Deterministic safety core (`verdict.js`)** — pure function, no network, no LLM.
  Computes BUY / CAUTION / AVOID. The agent must report it verbatim.
- **Gated execution (`app/src/swap.js`, swap path in `agent.js`)** — re-quotes
  immediately before executing; AVOID makes the buy code unreachable; honeypot-on-quote
  blocks; reports "broadcast — pending", never "successful".

## Getting started

### Prerequisites

- **Node.js >= 18.17**
- **The OKX `onchainos` CLI**, installed separately — it is an external dependency and
  is **not** in this repo. The wrappers look for it at `~/.local/bin/onchainos`
  (`onchainos.exe` on Windows) or via the `ONCHAINOS_BIN` env override.
  Install: _<OKX onchainOS CLI install — see the OKX Developer Portal>_
  ([OKX Developer Portal](https://web3.okx.com/onchain-os/dev-portal)).
- An OKX API key (set in a gitignored `.env`). The CLI also runs fully offline with
  `--demo`.
- For the agentic web layer: an `OPENAI_API_KEY`.

### CLI quickstart (`app/`)

```bash
cd app
npm install

# Fully LIVE — runs all 6 OKX onchainOS skills against the real CLI
node src/index.js analyze BONK --chain solana

# Offline sample run — no API key, no network
node src/index.js --demo analyze BONK --chain solana
# (equivalent to: npm run demo)

# By contract address, with gated, confirmation-required on-chain execution
node src/index.js analyze 0xabc… --chain base --buy 0.05 --pay eth

# Run the deterministic safety-core unit tests (no network, no keys)
npm test
```

Supported `--chain` values: `ethereum` (`eth`), `solana` (`sol`), `base`, `bsc`
(`bnb`), `polygon` (`matic`/`pol`), `arbitrum` (`arb`), `optimism` (`op`),
`avalanche` (`avax`), `xlayer`. A token can be a symbol or a contract address (`0x…`
or Solana base58 — auto-detected). Add `--meme` to force the launchpad/bundler scan
(auto-on for Solana). `--buy <amount>` requires `--pay <token>` and triggers the
gated flow: it quotes, requires you to type `yes`, and only then broadcasts. If the
verdict is AVOID, `--buy` exits without executing.

### Web app quickstart (`web/`)

```bash
cd web
npm install

# .env.local — set the agent key, or run the honest deterministic fallback
#   OPENAI_API_KEY=sk-...        (enables the real tool-calling agent)
#   STC_FORCE_DEMO=1             (forces demo fixtures; good for hosted demos)

npm run dev    # http://localhost:3000
```

- `/` — landing page (the thesis, how it works, CLI showcase).
- `/try-it` — live analyzer. Paste a real contract address for fully-live OKX
  onchainOS analysis, or load the `RUGPULL` scenario chip to see the safety core
  hard-veto and block execution.

## Environment variables

Create a gitignored `.env` (CLI, in `app/`) or `.env.local` (web, in `web/`). Never
commit real secrets.

```env
# OKX onchainOS credentials (used by the onchainos CLI)
OKX_API_KEY=
OKX_SECRET_KEY=
OKX_PASSPHRASE=

# Web agent layer — enables the real OpenAI tool-calling agent.
# If unset, the web app runs an honest non-LLM deterministic sweep.
OPENAI_API_KEY=

# Optional
STC_MODEL=gpt-4o-mini          # override the agent model (web)
STC_FORCE_DEMO=1               # force demo fixtures (hosted/serverless demos)
ONCHAINOS_BIN=                 # explicit path to the onchainos binary
```

## Safety model

- **Non-overridable core.** `verdict.js` is a deterministic, unit-tested pure function.
  The LLM is instructed it may not override, soften, or contradict the ruling and must
  present it verbatim. It is structurally separate from the agent.
- **Security hard-veto.** Honeypot or CRITICAL → AVOID immediately; the agent aborts
  further calls.
- **An incomplete scan is never a pass.** A scan that didn't complete floors the
  verdict to CAUTION.
- **Honesty tags.** Every datapoint is tagged `live` or `demo` in the UI and trace.
  Curated showcase scenarios are always `demo`-tagged. tx hashes are never faked.
- **Gated execution.** On AVOID the buy path is unreachable code. Execution always
  re-quotes first, requires an explicit user confirmation, blocks on honeypot-on-quote,
  and reports "broadcast — pending", never "successful".

## Project structure

```
x-agent/
├── app/                         # Standalone CLI (Node, ESM)
│   ├── src/
│   │   ├── index.js             # CLI entrypoint, args, gated --buy flow
│   │   ├── pipeline.js          # Ordered OKX skill pipeline → normalized signals
│   │   ├── verdict.js           # Deterministic non-overridable safety core
│   │   ├── swap.js              # Confirmation-gated swap execution
│   │   ├── onchainos.js         # Defensive onchainos CLI wrapper
│   │   ├── ui.js / demo-data.js # Terminal UI + offline --demo data
│   └── tests/verdict.test.mjs   # Safety-core unit tests (npm test)
├── web/                         # Next.js app (landing + live analyzer)
│   ├── app/page.tsx             # Route /  (landing)
│   ├── app/try-it/page.tsx      # Route /try-it (live analyzer)
│   ├── app/api/analyze/route.js # Streaming analyze/buy endpoint
│   └── lib/
│       ├── agent.js             # OpenAI tool-calling agent + deterministic fallback
│       ├── okx.js               # OKX skill layer + live/demo fixture fallback
│       ├── verdict.js           # Same deterministic safety core
│       └── fixtures.js          # Curated demo scenarios (always demo-tagged)
└── skills/smart-trade-copilot/  # OKX Plugin Store skill (plugin.yaml + skills/)
```

## License

MIT © 2026 Victor Jayeoba ([github.com/victorjayeoba](https://github.com/victorjayeoba)).
See [`skills/smart-trade-copilot/LICENSE`](skills/smart-trade-copilot/LICENSE).
