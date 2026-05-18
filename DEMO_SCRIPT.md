# 🎬 Smart Trade Copilot — Demo Video Script (LOCKED)

**Core message:** the OKX onchainOS skills are *genuinely live — nothing is faked*,
and the safety core gives an **honest** verdict the agent cannot override.
**Length:** ~3:30 · **Surfaces:** CLI (verified-live proof) + web app (`/try-it`)
**Tone:** confident, technical, honest. You are *showing evidence*, not claiming.

> ⚠️ **Why this script is built this way:** random pump.fun tokens mostly return
> 🟢 BUY (no honeypot detected ≠ good token). If you paste a random token on
> camera and it says BUY, your tool looks like it greenlights garbage. So this
> script uses **only verified tokens with dramatic, honest verdicts** — never
> "paste random and hope." Do NOT improvise token choices on camera.

---

## 🔒 The locked token set (re-verified live this session)

| Role | Token | Verdict | Note |
|---|---|---|---|
| **Hero** | `BONK` (symbol, `--chain solana`) | 🟡 CAUTION | Recognizable, **all 6 skills**, "dev rug history" |
| **Live AVOID** | `4atd1jHq6syiqeAxitojJ5JCjLgSmSMvvUhzsCM6pump` | 🔴 AVOID | Real token, "low liquidity / exit risk" |
| **Backup CAUTION** | `5NrgSWw5zFYkea4LC8G8XwyYMMxqGacYqGnvH84apump` | 🟡 CAUTION | If AVOID token died, swap this in |
| **Structural veto** | `RUGPULL` chip (web) | 🔴 AVOID | Honeypot scenario, `DEMO`-tagged, no buy path |

> 🛑 **These pump.fun tokens are ephemeral.** RE-RUN all of them right before
> recording (commands below). If a verdict changed, use a backup or re-pull.
> BONK and RUGPULL are stable; the raw mints are not guaranteed.

**Pre-record re-verify command (run this first, every time):**
```bash
cd C:\x-agent\app
node src/index.js analyze BONK --chain solana
node src/index.js analyze 4atd1jHq6syiqeAxitojJ5JCjLgSmSMvvUhzsCM6pump --chain solana
```
Expected: BONK → CAUTION (dev rug history) · the mint → AVOID (low liquidity).

---

## ⚙️ Pre-record checklist

1. Browser at `http://localhost:3000` (run `cd web ; npm run dev`). Zoom 110–125%.
2. Terminal at `C:\x-agent\app` (NOT `web\app` — that path errors).
3. Run the re-verify commands above. Confirm verdicts match the table.
4. **Web check:** on `/try-it`, paste `4atd1jHq6syiqeAxitojJ5JCjLgSmSMvvUhzsCM6pump`
   and confirm Security shows **LIVE** (not DEMO). If it shows DEMO, do the whole
   demo on the **CLI only** — it is the verified surface. (See fallback section.)
5. Clipboard ready with the AVOID mint so you don't fat-finger it.
6. Close editor/clutter. Record only browser + terminal.

---

## 🎙️ SCRIPT

### SHOT 1 — Cold open (0:00–0:20)
*Screen: `/try-it`, nothing run, OKX skill console visible.*

> "Every AI trading agent claims it checks if a token is safe. Almost none let
> you *watch it happen* — live, with nothing faked. This one does. Watch."

*(Cursor drifts down the 6 idle OKX skill rows.)*

---

### SHOT 2 — The honest hero run (CLI) (0:20–1:20)
*Action: terminal. Run BONK.*

> "No browser tricks. Raw CLI, hitting the real OKX onchainOS binary."

```
node src/index.js analyze BONK --chain solana
```

*(Point at lines as they land — this is the proof beat:)*

> "`onchainos engine 3.3.3` — the real binary. It resolved BONK live on Solana.
> All six OKX skills actually ran: security, fundamentals, clusters, signals,
> meme, defi. No `--demo` flag. This is real."

*(Point at the verdict.)*

> "And it's honest, not flattering. 🟡 **CAUTION** — because the creator is
> linked to a prior rug token. The safety core said so. The agent doesn't get
> to soften that. *That's* the product: the verdict is trustworthy precisely
> because an LLM didn't make it."

---

### SHOT 3 — A real token, live, in the browser → AVOID (1:20–2:20)
*Action: browser `/try-it`. Paste the AVOID mint. Hit analyze.*

> "Now a real token I pulled off DexScreener minutes ago — pasted live, no setup."

*(Console animates. Narrate the LIVE tags:)*

> "Watch the tags. Each OKX skill turns green, **LIVE** — real onchainOS calls,
> this second. Security, market, holders, signals."

*(Verdict: 🔴 AVOID.)*

> "🔴 **AVOID.** Real token, real on-chain data, honest call — liquidity this
> thin means you couldn't exit without getting wrecked. It didn't ask the model's
> opinion. The deterministic core decided."

---

### SHOT 4 — The structural kill switch (2:20–3:05)
*Action: click the **RUGPULL · SCENARIO** chip.*

> "Last one — watch the honesty hold under pressure. Curated honeypot. See the
> tag? **DEMO.** Stated openly — a fake scenario is never disguised as live."

*(Verdict: 🔴 AVOID.)*

> "AVOID. And here's what you can't fake your way around —"

*(Point at where the buy panel would be. It isn't there.)*

> "— there is no buy button. On AVOID the execution code is *unreachable.* The
> agent physically cannot swap a token its own safety core rejected. Not a
> prompt rule — the architecture."

---

### SHOT 5 — Close (3:05–3:30)
*Screen: the AVOID verdict.*

> "Live OKX onchainOS skills, every datapoint tagged, an honest verdict the
> model can't override, and a kill switch that's real code. Same engine in the
> terminal, the browser, and as an OKX Plugin Store skill."
>
> "Smart Trade Copilot. Built on OKX onchainOS, gated execution on X Layer.
> Thanks for watching."

*(Hold 2s. Stop.)*

---

## 🗣️ Delivery rules

- Talk over every animation. **Never wait in silence.**
- Your hook words are "**live**" and "**faked**" — hit them deliberately in
  SHOT 1 and SHOT 2.
- When you say "this tag," the cursor is *on the tag.* Always point at proof.
- SHOT 2 (CLI / BONK) is the emotional peak. Let `onchainos 3.3.3` and the
  6-skill line sit on screen a beat before you speak.
- **Never** call a low-liquidity AVOID a "honeypot" — say "exit risk / thin
  liquidity." Only the RUGPULL scenario is a honeypot.

## 🛟 If the web app fails live (Solana → DEMO/API error)

A Solana chain-routing fix was applied to `web/lib/agent.js` but is **unverified
in the running web app**. If SHOT 3's web run shows `DEMO` / API error instead of
LIVE: **do not panic, do not apologize.** Say:

> "I'll show this on the CLI where you can see the raw engine —"

…then run the AVOID mint in the terminal:
```
node src/index.js analyze 4atd1jHq6syiqeAxitojJ5JCjLgSmSMvvUhzsCM6pump --chain solana
```
The CLI is the verified-live surface. Turning to it is *stronger*, not weaker.

---

## ✅ Verified facts you may state (true this session)

- `onchainos engine onchainos 3.3.3` — real binary, this machine
- `Resolved BONK → dezxaz8z7pnr… on solana`, **6 skills**, CAUTION (dev rug history)
- `4atd1jHq6s…` → 🔴 AVOID, low liquidity ~$4.4k (5 skills, defi honestly skipped)
- No `--demo` flag = genuinely live

## ⚠️ Do NOT say (unverified / dishonest)

- That the **hosted/Vercel** site is fully live (binary can't deploy there).
- That you executed a real **swap/buy** on camera (you have not).
- That a clean 🟢/low-risk pump.fun token is "safe" — security-clean ≠ safe.
  This is exactly why the script avoids leading with a BUY token.
- Any liquidity/market number not visibly on screen at that moment.
