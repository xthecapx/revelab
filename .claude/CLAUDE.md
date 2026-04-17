# revelab

Tailwind CSS plugin providing slide components for Reveal.js presentations.

## Architecture
- `src/base/` — Reveal.js overrides (layout, typography, images)
- `src/components/` — One CSS file per component (card, diagram-flow, etc.)
- `src/themes/` — CSS custom properties (--rui-* prefix)
- `src/utilities/` — Font-size scale, text helpers, backgrounds
- `src/layouts/` — Slide type modifiers (divider, title-slide, etc.)
- `index.js` — Tailwind plugin entry using plugin.withOptions()

## Conventions
- CSS custom properties use `--rui-` prefix
- Component selectors use `.reveal` prefix for specificity over Reveal.js defaults
- One component per file in src/components/
- No JS in components — CSS only
- Use pnpm as package manager
