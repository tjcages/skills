# Product fidelity

Classify what the viewer is looking at **before** building a shot. The classification follows the film's claim, not whether an element is easy to import.

| Role | Examples | Default treatment |
| --- | --- | --- |
| **Primary product UI** | A `panels` slider, gradient editor, floating panel, or capture control when the film claims to show `panels`; komo's toolbar when showing komo; a website's own pages when that website is the subject | Show the real implementation or a verified capture. Preserve its appearance, labels that matter, states, interaction sequence, and animation. |
| **Accessory context** | The website behind komo's toolbar, a sample document edited by an app, decorative background, device shell, editorial title card | May be composed or abstracted if it does not imply a false product capability or obscure the primary UI. |

An element can change roles between briefs. A website that is background context for a toolbar film is accessory; that same website is primary when the user asks for a launch film about it. A component library's controls are primary even when shown without its playground page.

## Source order for primary UI

1. Run the product and record the actual interaction when it relies on browser layout, CSS, portals, real-time state, or animation that the renderer cannot reproduce. Screen capture is valid film material; match resolution and frame rate, and use a repeatable fixture when possible.
2. Import the product's real components and styles when they render correctly. Drive real props and state through an isolated fixture or adapter. A frame-driven port is acceptable only when it preserves the exact visual states, timing, easing, and behavior of the source and is checked against the running product.
3. Use existing product footage or approved captures when source/runtime access is unavailable. If no reliable source exists, request access or label the result as a concept before proceeding; do not quietly fill the gap with a plausible invented interface.

Keep a short provenance record for every primary shot: repository or URL and version, component/page, action, capture or import method, and the source animation or measured timing. A hand-built approximation using the right colors and labels is still an approximation. An animation preset in this skill never overrides product motion.

## What editorial freedom allows

Crop, zoom, camera movement, cut, background, sound, and title cards may amplify the product. You may isolate a real component from surrounding app chrome, but the component's geometry, styles, behavior, and interaction states stay true. Do not stretch its proportions, redraw controls at a larger font, substitute generic easing, add a result indicator the product lacks, or imply a feature that is not shipped. If legibility is poor, change the shot framing, playback length, or output format rather than changing primary UI. Abstract the primary UI only when the user explicitly requests that treatment, and identify which shots use it.

## Fidelity review before sound

Compare representative before, interaction, peak-motion, and after frames side by side with the actual product at the same viewport, theme, and state. Watch the source interaction and film at normal speed. Check geometry, type, colors, labels, cursor/gesture, timing, easing, intermediate states, and result. Record deviations and fix them before declaring the picture ready. A passing render, technical QC report, or generally similar look is not evidence of fidelity.
