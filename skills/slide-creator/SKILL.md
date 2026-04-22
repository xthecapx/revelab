---
name: revelab-slide-creator
description: Create and edit Reveal.js presentation slides using revelab components. Use when the user mentions slides, presentations, talks, or wants to present content.
---

# revelab Slide Creator

Create Reveal.js slides using the revelab component library. This skill generates HTML slides with proper component classes, layouts, and theming.

> For advanced Reveal.js features (transitions, fragments, auto-animate, backgrounds, code highlighting), see `references/advanced-features.md`.

## When to use

Use this skill when the user wants to:
- Create a new presentation or slide deck
- Add slides to an existing presentation
- Edit slide content or layout
- Convert content into a visual slide format

## Slide structure

Every presentation follows this HTML structure:

```html
<!doctype html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/serif.css">
  <link rel="stylesheet" href="revelab.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section><!-- slide content --></section>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
  <script>
    Reveal.initialize({ hash: true, slideNumber: 'c/t', transition: 'none', center: false, margin: 0.08 });
  </script>
</body>
</html>
```

## Slide content pattern

Each slide uses title + slide-content wrapper:

```html
<section>
  <h3>Slide Title</h3>
  <div class="slide-content">
    <!-- components here -->
  </div>
  <aside class="notes">Speaker notes here</aside>
</section>
```

## Available components

### diagram-flow
Horizontal flow: box → arrow → box. Use for processes, architectures, pipelines.
```html
<div class="diagram-flow">
  <div class="df-box bg-input"><strong>Step 1</strong><br><small>description</small></div>
  <div class="df-arrow">→</div>
  <div class="df-box bg-cool"><strong>Step 2</strong><br><small>description</small></div>
</div>
```

### card
Content card with header + body. Tables auto-fill inside card-body.
```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body text-sm">Content</div>
</div>
```

**Card color modifiers** — change header background by adding a class to the card:

| Class | Header color |
|-------|-------------|
| `card-danger` | Red (`--rlab-color-danger`) |
| `card-success` | Green (`--rlab-color-success`) |
| `card-warning` | Yellow (`--rlab-color-warning`) |
| `card-neutral` | Surface bg, normal text color |

```html
<div class="card card-danger">
  <div class="card-header">Error</div>
  <div class="card-body text-sm">Something went wrong</div>
</div>
```

**Card body alignment** — default is centered. Use `card-body-left` for left-aligned content:
```html
<div class="card-body card-body-left text-sm">Left-aligned paragraphs</div>
```

**Tables in cards** — tables inside `card-body` auto-fill width with no extra borders. Use `table-sm` for compact tables:
```html
<div class="card-body">
  <table class="table-sm">
    <thead><tr><th>Key</th><th>Value</th></tr></thead>
    <tbody><tr><td>Accuracy</td><td>99%</td></tr></tbody>
  </table>
</div>
```

### stats-row + highlight-number
Side-by-side statistics.
```html
<div class="stats-row">
  <div class="stat-item">
    <div class="highlight-number">99%</div>
    <div class="highlight-unit">accuracy</div>
  </div>
</div>
```

### principle-grid
2x2 numbered cards.
```html
<div class="principle-grid">
  <div class="principle-card">
    <span class="pc-number">1</span>
    <span class="pc-title">Title</span>
    <span class="pc-sub">Subtitle</span>
  </div>
</div>
```

### code-box
Terminal-style display for code/errors.
```html
<div class="code-box">
  <div class="cb-label">LABEL</div>
  <p class="cb-prompt">$ command</p>
  <p class="cb-response">response text</p>
  <p class="cb-error">⚠ error message</p>
</div>
```

### qr-block
QR code with link button.
```html
<div class="qr-block">
  <img src="qr.png" alt="QR">
  <a href="https://example.com" class="btn btn-warning">Link</a>
</div>
```

### btn
Styled buttons and links.
```html
<a href="#" class="btn">Default</a>
<a href="#" class="btn btn-warning">Warning</a>
<a href="#" class="btn btn-danger">Danger</a>
<a href="#" class="btn btn-success">Success</a>
```

### emoji-row
```html
<div class="emoji-row">🧠 🔀 💥</div>
```

## Layouts (section classes)

| Class | Use |
|-------|-----|
| `.divider` | Section breaks |
| `.title-slide` | Opening/closing slides |
| `.big-question` | Large centered question |
| `.coffee-slide` | Warm gradient break |
| `.rho-story` | Narrative with avatar |

## Utility classes

- Font sizes: `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`
- Text: `.small-muted`, `.text-muted`, `.caption` (on `<p>`), `.on-dark`, `.text-bg`
- Backgrounds: `.bg-warm`, `.bg-cool`, `.bg-input`, `.bg-purple`, `.bg-danger-light`

## Transitions & animations

Use Reveal.js built-in features — never custom JS/CSS for slide animations.

### Slide transitions
Set per-slide via `data-transition` or globally in `Reveal.initialize()`.
Values: `fade`, `slide`, `convex`, `concave`, `zoom`, `none`

```html
<section data-transition="fade">Content</section>
<section data-transition="slide-in fade-out">Combined</section>
```

### Fragments (step-by-step reveals)
```html
<p class="fragment fade-up">Appears on click</p>
<p class="fragment fade-up" data-fragment-index="2">Second</p>
```

Fragment classes: `fade-in`, `fade-out`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `highlight-red`, `highlight-green`, `highlight-blue`, `strike`

### Auto-animate
Smoothly animate matching elements between slides using `data-auto-animate` + `data-id`:

```html
<section data-auto-animate>
  <div data-id="box" style="width:100px; background:var(--rlab-color-accent);"></div>
</section>
<section data-auto-animate>
  <div data-id="box" style="width:300px; background:var(--rlab-color-success);"></div>
</section>
```

### Slide backgrounds
```html
<section data-background-color="#0d1117">Dark</section>
<section data-background-gradient="linear-gradient(to right, #6366f1, #a78bfa)">Gradient</section>
```

## Themes

Apply theme class to `.reveal-viewport`: `theme-forest`, `theme-midnight`, `theme-coral`, or no class for default.

CSS variables use `--rlab-*` prefix. Override per-element:
```html
<div class="card" style="--rlab-color-card-header-bg: #198754;">Custom card</div>
```

## Design principles

1. **Less text, more visuals** — use diagram-flow and cards instead of bullet lists
2. **Speaker notes for details** — slide shows key points, `<aside class="notes">` has the full explanation
3. **One idea per slide** — split complex topics across slides
4. **Use the component that fits** — stats-row for numbers, diagram-flow for processes, cards for comparisons
5. **Consistent backgrounds** — use bg-* classes on df-box elements for semantic color coding
