# Recipe: Admin / product feed list (borderless or light-separator)

**Surfaces:** Totem Today, Pipeline list, People, Releases catalog, Linear-class Inbox.  
**Primary rules:** R1, R2, R3, R15, R71–R76, R96–R97, **R104–R105**, R107.  
**CORPUS:** Linear Inbox `f97b18e7-5e86-42f2-85df-9e7a000fae0e` · Inbox alt `97e4122c-…` · Totem refs `ap300-integrate/today_idle.png`, `pipeline_list.png`.

## Layout skeleton

```
┌ safe top / status (real or omit) ─────────────────────┐
│ Large Title (34 bold)          [trailing capsule]     │
│ optional segmented (Deals|People) — selected fill pill│
│                                                       │
│ SECTION LABEL                    count                │
│ optional hairline (density mode)                      │
│ ┌────┐ Title………………………………… meta (time)            │
│ │thumb│ Secondary context line                        │
│ └────┘ • Status (optional)                            │
│ …rows…                                                │
│ SECTION …                                             │
│                                                       │
│        [==== floating dock ====]  (○ search)          │
└───────────────────────────────────────────────────────┘
```

## Tokens

| Token | Value |
|-------|-------|
| Side gutter | **20 pt** (admin feed) |
| Section gap | **24–32 pt** |
| Row band | Comfortable **64–80** (Today) or compact admin **52–64** (Pipeline) — pick via R97 |
| Avatar | Circle **40–44** |
| Deal thumb | Rounded rect **~12** radius, ~40–44 square |
| Title | 17 semibold / `.headline` |
| Secondary | 13 regular secondary / `.footnote` |
| Trailing meta | 12–13 tertiary, top-aligned to title |
| Avatar→text | **12–16 pt** |
| Title→subtitle | **2–4 pt** |

## Row anatomy (mandatory — R104)

1. Leading media (realistic — R107)  
2. Primary title  
3. Secondary context (`Reply to Label · Org`, `Label · Company`, comment snippet)  
4. Trailing relative time  
5. Optional status dot + label  

## Anti-patterns

- Title-only rows; title + date with no secondary  
- Flat solid-hue avatar circles/squares  
- Section gaps ≫ 32 creating wireframe voids  
- Full-width hairlines under avatars on Linear-style feeds (prefer none or inset-to-text)  
- Emoji leading icons  

## Totem notes

- Today: artwork circles + secondary + status (`Response Due`) — match `today_idle`.  
- Pipeline: rounded-rect thumbs + badge overlay OK; secondary includes status inline.  
- Always pair with `floating-tab.md` on phone.
