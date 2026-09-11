# Recipe: Inset-grouped settings / system lists

**Surfaces:** Totem Settings, Notes Folders, Wallet transactions list, ChatGPT/Photos settings.  
**Primary rules:** R1 (16 gutter-to-card), R11.3, R49–R55, R79, R29 inset separators.  
**CORPUS:** Apple Notes Folders · Wallet transaction lists · Photos/ChatGPT settings proxies in CORPUS.md.

## Layout skeleton

```
┌ canvas #F2F2F7 / systemGroupedBackground ───────────┐
│ Large Title or inline nav                           │
│                                                     │
│   ┌──────── white group r~10–12 ─────────────┐      │
│   │ Row                                        │      │
│   │ ─ inset hairline ─                         │      │
│   │ Row                                        │      │
│   └────────────────────────────────────────────┘      │
│                                                     │
│   SECTION FOOTER caption                            │
│                                                     │
│   ┌──────── next group ──────────────────────┐      │
│   │ …                                        │      │
│   └────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

## Tokens

| Token | Value |
|-------|-------|
| Canvas | `systemGroupedBackground` / `#F2F2F7` |
| Card edge gutter | **16 pt** |
| Group radius | **10–12** (Notes) — continuous |
| Row height | **44–52** compact |
| Separators | Inset to **label column** — not under leading icons (R29) |
| Destructive | Semantic red text row, often standalone group |

## Anatomy

- Prefer `List { }.listStyle(.insetGrouped)` over hand-rolled cards  
- Leading SF Symbols in list rows; **no emoji**  
- Toggle rows, disclosure chevrons, value-trailing patterns  
- Footers as secondary caption under groups  

## Anti-patterns

- White full-bleed table on white (lose grouped canvas)  
- Outline strokes around groups instead of fill-on-gray  
- Bootstrap/HTML admin tables  
- Mixing Linear borderless feed separators with Settings inset style randomly  
- Applying Photos **1–2 pt** micro gutters to settings text lists  

## Totem notes

Settings and account surfaces use this recipe. Pipeline/Today feeds do **not** — those use `list.md` (borderless/light). Pick density deliberately (R97).
