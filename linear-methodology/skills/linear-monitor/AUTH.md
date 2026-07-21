# Step 0 — Linear MCP auth

Run **before any Linear read or write** in setup, sync, monitor, or discipline.

## Probe

Call a cheap Linear tool (`list_teams` or `get_user`).

- **Success** → continue.
- **Unauthorized / missing server / needsAuth** → stop. Give the steps below for the current agent. Never invent GraphQL, curl, or unofficial API wrappers.

## Cursor

1. Open **Settings → MCP** (or Features → MCP).
2. Enable / add the **Linear** MCP server (official Linear plugin).
3. Complete the OAuth / connect prompt in the browser.
4. Start a **new agent chat**.
5. Retry: ask the agent to list Linear teams.

## Claude Code

1. Run `/mcp` (or open Claude connector settings).
2. Connect **Linear** and authorize the workspace.
3. Confirm Linear tools show as available.
4. New session if tools were just added.
5. Retry: list teams.

## Codex / other Agent Skills harnesses

1. Open that agent’s MCP / integrations settings.
2. Add Linear MCP and complete OAuth.
3. Restart the agent so tools reload.
4. Retry: list teams.
5. If the harness has no MCP: say so in one line — this skill pack requires Linear MCP.

## After auth

Restate: “Linear connected. Next: …” and continue the interrupted skill.
