# visual-cursor — behavior contracts (dogfood draft)

Platform-neutral promises for a Tool that may grow a second surface (e.g. VS Code webview). Not installed into `tjcages/visual-cursor` (bot push 403) — lives here as pack evidence.

## WHAT / HOW

| Floor | This product |
|---|---|
| WHAT | Stamp · Overlay · Composer thread · Agent turn · Undo stack |
| HOW | Vite plugins + React overlay (today’s only kit) |

## Contracts

### 1. Stamp / locate

> A stamped element can be: **resolved to `file:line:col`** · **highlighted under ⌘-hover** · **opened into a composer on ⌘-click**. Resolution works through portals (`asChild`, body-mounted menus).

### 2. Composer

> A composer can: **open on a target** · **send an instruction** · **stream progress** · **keep a thread for follow-ups** · **coexist with other open composers**. Closing does not delete undo history for turns already applied.

### 3. Agent turn / write trust

> An agent turn can: **edit scoped files** · **auto-revert on broken syntax** · **surface empty/stale agent errors** · **be undone (⌘Z) and redone (⌘⇧Z)**. Turns never apply from non-loopback / cross-site callers (unless `allowRemote` is explicit).

### 4. Key setup

> Key setup can: **capture an API key** · **refuse whitespace/invalid** · **refuse non-loopback writes**.

## Drift audit (single kit today)

| Contract | Kit (Vite/React) | Status |
|---|---|---|
| Stamp | `stamp.ts` + `client.tsx` | Pass |
| Composer | `panel.tsx` | Pass |
| Agent turn | `agent.ts` | Pass (no pre-diff accept — see accept-gated-ai dogfood) |
| Key setup | `key-setup.tsx` | Pass |

**Second kit:** none yet — §1 says skip multi-platform ship rule until surface #2 starts. Contracts written *before* that start.
