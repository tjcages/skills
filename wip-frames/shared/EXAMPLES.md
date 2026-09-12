# WIP frames examples

## 1. Raw capture is not the share

**Before:** a Figma page dump with grey phone chrome, or a macOS window with a fat scrollbar, dropped into chat.

**Why it fails:** browser chrome, device plate, and OS gutters compete with the screen. Reviewers look at the frame, not the product.

**After:** `compose.py` punches the plate, swaps in the iOS 18 kit status bar at 50%, paints Apple overlay scrollbars, and sits the screens on `#F5F5F5`.

## 2. Titles

| Before | Why it fails | After |
|---|---|---|
| no title | reviewer guesses the page | `Today` |
| `IMG_8841` | filename, not a page | `Pipeline` |
| `the new deal detail view!!` | marketing | `Deal detail` |

## 3. Theme

Default board stays `#F5F5F5`. A dark product may ship `wip-frames.theme.json`:

```json
{
  "mat": "#111111",
  "dot": "#2A2A2A",
  "title": "#A3A3A3",
  "pill": "mat",
  "status_opacity": 0.5
}
```

That tints the mat. It does not authorize custom status icons, Inter, or a bezel.

## 4. Layout

| Input | Board |
|---|---|
| one desktop | one frame |
| 1–3 mobiles | one row |
| 4 mobiles | two boards (3 + 1) |
| desktop + phone | refuse, split |
