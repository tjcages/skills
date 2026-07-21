# Install — Linear tracking skill pack

**Goal:** same Linear skills + same assumption on every agent — **Linear is the default source of truth** each session.

Complete install = skills on disk + always-on loaded + Linear MCP auth. Cursor Monitor Automation is optional.

Always-on text: [shared/ALWAYS_ON.md](./shared/ALWAYS_ON.md)

---

## Recommended (2 steps)

### Step 1 — Install the skills (~30 sec)

```bash
npx skills add tjcages/linear-methodology-skill -g -a '*' -y
```

This installs `linear-setup`, `linear-sync`, `linear-monitor`, `linear-discipline`, `linear-finish-install`, and `linear-methodology`.

`npx github:tjcages/linear-methodology-skill` also **auto-writes** the always-on block into:

- `~/.claude/CLAUDE.md`
- `~/.codex/AGENTS.md`
- `~/.agents/AGENTS.md`

(Cursor User Rules live in the app — Step 2 handles them.)

### Step 2 — Finish in the agent (~2 min)

In Agent chat, say exactly:

```text
finish linear-tracking install
```

The `linear-finish-install` skill will:

1. Write always-on (Cursor User Rule **or** CLAUDE.md / AGENTS.md) — Linear = default SoT every session  
2. Probe Linear MCP auth  
3. **Optionally** offer Cursor Monitor Automation (weekly health) — skip on other harnesses

If Linear is not connected yet, follow the links it prints (or [AUTH.md](./shared/AUTH.md)).

---

## What you may still click (only if prompted)

| Need | Where |
|------|--------|
| Linear OAuth | [Cursor Settings → MCP](https://cursor.com/settings) · [Linear MCP docs](https://linear.app/docs/mcp) · Claude: `/mcp` or [claude.ai settings](https://claude.ai/settings) |
| Manual User Rules (if agent can’t write them) | [Cursor Settings → Rules](https://cursor.com/settings) → User Rules → paste [ALWAYS_ON.md](./shared/ALWAYS_ON.md) |
| Optional weekly digest (Cursor) | [Automations](https://cursor.com/automations) — recipe in [AUTOMATION.md](./shared/AUTOMATION.md) |

---

## Verify

```bash
npx skills list -g
```

You should see: `linear-setup`, `linear-sync`, `linear-monitor`, `linear-discipline`, `linear-finish-install`, `linear-methodology`.

**Install complete when:**

1. Always-on present (Cursor User Rule **or** CLAUDE.md / AGENTS.md block)
2. Linear MCP lists teams

Optional: Monitor Automation enabled (Cursor only). Otherwise run `/linear-monitor` when you want a health check.

Untracked repo → at most one nudge to run `linear-setup`.

---

## Update / uninstall

```bash
npx skills update -g
npx skills remove linear-setup linear-sync linear-monitor linear-discipline linear-finish-install linear-methodology -g -y
```

Remove the User Rule / ALWAYS_ON markers. Disable Automation if you created one.

## Claude Code plugin (optional)

```
/plugin marketplace add tjcages/linear-methodology-skill
/plugin install linear-methodology@linear-methodology-skill
```

Still run Step 2 (or ensure `~/.claude/CLAUDE.md` has the always-on block + Linear auth).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No soft nudge / no Linear SoT | Say `finish linear-tracking install`, or paste [ALWAYS_ON.md](./shared/ALWAYS_ON.md) into User Rules / CLAUDE.md / AGENTS.md |
| Auth errors | [AUTH.md](./shared/AUTH.md) + [Linear MCP](https://linear.app/docs/mcp) |
| Want weekly digest | [AUTOMATION.md](./shared/AUTOMATION.md) (Cursor) or `/linear-monitor` manually |
| Eve / PromptScript | No global install — `npx skills add` **without** `-g` in the project |
