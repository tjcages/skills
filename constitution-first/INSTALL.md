# Install — constitution-first

```bash
npx skills add tjcages/constitution-first-skill -g -a '*' -y
```

Copies `constitution-first` into `~/.claude/skills`, `~/.cursor/skills`, `~/.codex/skills`, `~/.agents/skills`.

## First use

In Agent chat:

```text
Does this product have a North Star? Run constitution-first.
```

Or: write / audit a constitution before `linear-setup`.

Template: `shared/north-star.template.md` → product `docs/north-star.md` or `docs/manifesto.md`.

Site: [offbr.co/skills/constitution-first](https://offbr.co/skills/constitution-first) (D1 row pending if 404)

| Symptom | Fix |
|---------|-----|
| Eve / PromptScript failed | Expected — no global install. Use `npx skills add tjcages/constitution-first-skill` **without** `-g` in the project, or ignore. |
