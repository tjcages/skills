---
name: ios-apple-quality
description: Legacy compatibility entry. When explicitly invoked or required by an older repository, migrate to apple-native for native iOS product work.
metadata:
  deprecated: "true"
  replacement: apple-native
---

# Replaced by Apple Native

Use the installed `apple-native` skill. If unavailable, read its public entry at
https://native.offbr.co/skills/apple-native/SKILL.md and retrieve relevant records
from https://native.offbr.co/registry/v1/catalog.json.

Install with `npx skills add tjcages/skills --skill apple-native` when installation
is authorized. Do not load the old CRAFT_SPEC or blanket visual rules automatically.
The old shared files remain historical references, not current general requirements.
Preserve explicit host contracts, especially Totem's existing AdminChrome ownership.
Do not silently rewrite repository instructions or uninstall another skill.
