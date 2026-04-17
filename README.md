# revelab

Slide components for [Reveal.js](https://revealjs.com/) presentations. Works standalone or as a Tailwind CSS plugin.

## Install

```bash
pnpm add revelab
```

## Usage

### Option 1: CSS import (Tailwind v4, no build step, CDN)

```html
<link rel="stylesheet" href="node_modules/revelab/dist/revelab.css">
```

Or via CDN (after publishing to npm):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/revelab/dist/revelab.css">
```

### Option 2: Tailwind v3 plugin

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('revelab')({
      // include: ['card', 'diagram-flow'], // only load specific components
      // exclude: ['framework-diagram'],     // skip heavy components
    })
  ]
}
```

### Option 3: Tailwind v4 (CSS import)

```css
@import "tailwindcss";
@import "revelab/dist/revelab.css";
```

## Components

### Diagram Flow

Horizontal box → arrow → box layout for processes and architectures.

```html
<div class="diagram-flow">
  <div class="df-box bg-input">
    👨‍💻 <strong>Input</strong><br>
    <small>description</small>
  </div>
  <div class="df-arrow">→</div>
  <div class="df-box bg-cool">
    🔧 <strong>Process</strong><br>
    <small>description</small>
  </div>
  <div class="df-arrow">→</div>
  <div class="df-box bg-warm">
    📊 <strong>Output</strong><br>
    <small>description</small>
  </div>
</div>
```

### Card

Content cards with header and body. Tables auto-fill the card body.

```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">
    Content here
  </div>
</div>
```

### Stats Row

Side-by-side statistics display.

```html
<div class="stats-row">
  <div class="stat-item">
    <div class="highlight-number">84.5%</div>
    <div class="highlight-unit">accuracy</div>
  </div>
  <div class="stat-item">
    <div class="highlight-number">4B</div>
    <div class="highlight-unit">parameters</div>
  </div>
</div>
```

### Principle Grid

2x2 numbered card grid.

```html
<div class="principle-grid">
  <div class="principle-card">
    <span class="pc-number">1</span>
    <span class="pc-title">Modularidad</span>
    <span class="pc-sub">One agent per task</span>
  </div>
  <!-- repeat for 2, 3, 4 -->
</div>
```

### Hallucination Box

Terminal-style code/output display.

```html
<div class="hallucination-box">
  <div class="hb-label">ERROR</div>
  <p class="hb-prompt">$ ask "How do I deploy?"</p>
  <p class="hb-response">Use the SDK v3.2.1...</p>
  <p class="hb-error">⚠ The SDK does not exist.</p>
</div>
```

### QR Block

QR code with optional action button.

```html
<div class="qr-block">
  <img src="qr.png" alt="QR Code">
  <a href="https://example.com" class="btn btn-warning">
    ☕ Buy me a coffee
  </a>
</div>
```

### Timeline Table

Project timeline with status badges.

```html
<table class="timeline-table">
  <tr>
    <td class="tl-phase">Phase 1</td>
    <td class="tl-done">Complete</td>
    <td class="tl-progress">In Progress</td>
    <td class="tl-proposed">Planned</td>
  </tr>
</table>
```

### Emoji Row

```html
<div class="emoji-row">🧠 🔀 💥 🎯</div>
```

## Layouts

Add these classes to `<section>` elements:

| Class | Effect |
|-------|--------|
| `.divider` | Centered content (section breaks) |
| `.title-slide` | Centered (opening/closing) |
| `.big-question` | Centered, large text |
| `.coffee-slide` | Warm gradient background |
| `.rho-story` | Narrative with avatar + gradient border |

## Utilities

### Font Size Scale

| Class | Size |
|-------|------|
| `.text-xs` | 0.6em |
| `.text-sm` | 0.7em |
| `.text-base` | 0.8em |
| `.text-lg` | 0.85em |
| `.text-xl` | 0.9em |

### Text Helpers

| Class | Effect |
|-------|--------|
| `.small-muted` | Muted color |
| `.caption` | Muted, italic (use on `<p>`) |
| `.on-dark` | White text with shadow (use with `.text`) |
| `.text-bg` | Semi-transparent dark background |

### Background Colors

| Class | Color | Use |
|-------|-------|-----|
| `.bg-warm` | #fef3e8 | Output, skills |
| `.bg-cool` | #e8f8f5 | Context, success |
| `.bg-input` | #e8f4f8 | Input, speaker |
| `.bg-purple` | #f0e8f8 | Execution |
| `.bg-danger-light` | #fdedec | Error states |

## Theming

Override CSS custom properties to customize:

```css
:root {
  --rui-color-accent: #8b5cf6;
  --rui-color-danger: #ef4444;
  --rui-color-success: #22c55e;
  --rui-radius-md: 12px;
}
```

All available variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--rui-color-text` | #1a1a1a | Primary text |
| `--rui-color-muted` | #666 | Secondary text |
| `--rui-color-faint` | #999 | Tertiary text |
| `--rui-color-accent` | #6366f1 | Brand/accent |
| `--rui-color-danger` | #dc3545 | Error/alert |
| `--rui-color-success` | #198754 | Success |
| `--rui-color-warning` | #f0ad4e | Warning |
| `--rui-color-border` | #ccc | Borders |
| `--rui-color-bg-light` | #f8f9fa | Light background |
| `--rui-color-bg-surface` | #f5f5f5 | Surface |
| `--rui-color-bg-code` | #1e1e2e | Code blocks |
| `--rui-radius-sm` | 4px | Small radius |
| `--rui-radius-md` | 8px | Medium radius |

## With Tailwind

Components work alongside Tailwind utilities. Override defaults with Tailwind classes:

```html
<div class="df-box bg-blue-100 border-blue-300">
  Custom colored box
</div>
```

## License

MIT
