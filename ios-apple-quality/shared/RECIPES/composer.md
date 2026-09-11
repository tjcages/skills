# Recipe: Floating composer / comment island

**Surfaces:** Totem deal comment bar, Linear issue comment, ChatGPT Ask capsule.  
**Primary rules:** R32, R45, R56.2, R59, R89-ish, hit ≥44 (R21).  
**CORPUS:** Linear issue detail (local ref) · ChatGPT composer `fcc6d071-3fdf-46a3-9af5-2ee465d1e471` · Totem `pipeline_deal_detail.png`.

## Layout skeleton

```
┌─────────────────────────────────────────────────────┐
│  content                                            │
│                                                     │
│   ┌──────────────────────────────────────────┐      │
│   │  +  Comment / Add a comment…      (↑)○   │      │
│   └──────────── stadium composer ────────────┘      │
│   optional flanking circles (scope / search)        │
└─────────────────────────────────────────────────────┘
```

## Tokens

| Token | Value |
|-------|-------|
| Side inset | **12–24** (align with dock language) |
| Bottom inset | **16–32** above home indicator |
| Height | **44–56** (comfortable ~50–56) |
| Shape | Capsule / stadium; send = circle ≥44 hit |
| Leading | `plus` or text affordance — **SF Symbol**, not emoji |
| Placeholder | secondary label style |
| Material | ultraThin / glass on chrome; soft shadow |

## Anatomy

1. Floating island above home indicator (not a full-bleed input glued to bottom safe area without inset)  
2. Optional left circle (context/scope) + center field + right send/search circles sharing **one baseline** (Linear detail pattern)  
3. Send uses SF Symbol (`arrow.up` in circle) — brand color fill OK  
4. Keyboard avoidance: island rides keyboard; Reduce Motion respected  

## Anti-patterns

- Emoji send glyphs  
- Send control **< 44** hit  
- Composer merged into a vertical dock tower  
- Opaque full-width text field with no floating inset language on admin details  
- Giant empty gaps above a lonely input with no content density above  

## Pair with

`detail.md` for deal/issue; do not stack a tab dock **and** composer overlapping — on detail, prefer composer-only bottom chrome (Linear) or hide tab island.
