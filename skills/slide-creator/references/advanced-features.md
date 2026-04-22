# Reveal.js 5.1.0 — Advanced Features Reference

Reference for Reveal.js features beyond basic slide creation. Use these when the presentation needs progressive reveals, animated transitions, or rich backgrounds.

## Slide Transitions

Control how slides enter and exit. Set globally or per-slide.

**Global** (in `Reveal.initialize()`):
```js
Reveal.initialize({ transition: 'slide', transitionSpeed: 'fast' });
```

**Per-slide**:
```html
<section data-transition="fade">Fades in and out</section>
<section data-transition="slide-in fade-out">Slides in, fades out</section>
<section data-transition="none">No transition</section>
```

**Values**: `none`, `fade`, `slide`, `convex`, `concave`, `zoom`

**Directional**: append `-in` or `-out` to control entry/exit independently:
`slide-in`, `fade-out`, `convex-in`, `zoom-out`, etc.

**Speed**: `data-transition-speed="fast|default|slow"` per-slide or `transitionSpeed` globally.

## Fragments (Step-by-step Reveals)

Add `class="fragment"` to any element. It appears on the next click/keypress.

```html
<p class="fragment">Appears first</p>
<p class="fragment">Appears second</p>
```

### Animation Classes

Combine with `fragment`:

| Class | Effect |
|-------|--------|
| `fade-in` | Default — fades in |
| `fade-out` | Visible initially, fades out |
| `fade-up` | Slides up while fading in |
| `fade-down` | Slides down while fading in |
| `fade-left` | Slides left while fading in |
| `fade-right` | Slides right while fading in |
| `fade-in-then-out` | Fades in, then out on next step |
| `fade-in-then-semi-out` | Fades in, then dims to 50% |
| `highlight-red` | Text turns red |
| `highlight-green` | Text turns green |
| `highlight-blue` | Text turns blue |
| `highlight-current-red` | Red on current step only |
| `highlight-current-green` | Green on current step only |
| `highlight-current-blue` | Blue on current step only |
| `semi-fade-out` | Dims to 50% |
| `strike` | Strikethrough |
| `grow` | Scales up |
| `shrink` | Scales down |

### Fragment Ordering

Override default order with `data-fragment-index`:
```html
<p class="fragment" data-fragment-index="2">Second</p>
<p class="fragment" data-fragment-index="1">First</p>
```

Same index = simultaneous:
```html
<p class="fragment" data-fragment-index="1">Together A</p>
<p class="fragment" data-fragment-index="1">Together B</p>
```

### Nested Fragments

```html
<span class="fragment fade-in">
  <span class="fragment highlight-red">Appears, then turns red</span>
</span>
```

## Auto-Animate

Smoothly animates matching elements between consecutive slides. Add `data-auto-animate` to both `<section>` tags and `data-id` to elements that should animate.

```html
<section data-auto-animate>
  <h3 data-id="title">Step 1</h3>
  <div data-id="box" style="width:100px; height:100px; background:#6366f1;"></div>
</section>
<section data-auto-animate>
  <h3 data-id="title">Step 2</h3>
  <div data-id="box" style="width:300px; height:100px; background:#22c55e;"></div>
</section>
```

### What Animates

Auto-animate interpolates:
- Position, size (width, height)
- Background color, opacity
- Padding, margin, border-radius
- Font size, line height, letter spacing, font weight, color
- Transform (translate, rotate, scale)

### Matching Rules

Elements match between slides by:
1. `data-id` attribute (explicit — preferred)
2. Tag name + text content (implicit — for headings, paragraphs)

### Configuration

Per-slide attributes:
```html
<section data-auto-animate
  data-auto-animate-easing="ease-in-out"
  data-auto-animate-duration="0.8"
  data-auto-animate-unmatched="fade">
```

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-auto-animate-easing` | `ease` | CSS easing function |
| `data-auto-animate-duration` | `1.0` | Seconds |
| `data-auto-animate-unmatched` | `true` | How unmatched elements appear: `true` (instant), `fade`, `false` (hidden) |

### Auto-Animate + Code

Animate code changes between slides:
```html
<section data-auto-animate>
  <pre data-id="code"><code data-line-numbers class="language-js">
let x = 1;
  </code></pre>
</section>
<section data-auto-animate>
  <pre data-id="code"><code data-line-numbers class="language-js">
let x = 1;
let y = 2;
  </code></pre>
</section>
```

## Slide Backgrounds

Override slide background with `data-background-*` attributes on `<section>`.

### Solid Color
```html
<section data-background-color="#0d1117">Dark background</section>
<section data-background-color="rgb(34, 197, 94)">Green</section>
```

### Gradient
```html
<section data-background-gradient="linear-gradient(to right, #6366f1, #a78bfa)">
  Purple gradient
</section>
<section data-background-gradient="radial-gradient(circle, #fef3e8, #fde68a)">
  Radial warm
</section>
```

### Image
```html
<section data-background-image="url.jpg"
         data-background-size="cover"
         data-background-position="center"
         data-background-opacity="0.3">
  Image with 30% opacity overlay
</section>
```

### Video
```html
<section data-background-video="video.mp4"
         data-background-video-loop
         data-background-video-muted>
</section>
```

### Iframe
```html
<section data-background-iframe="https://example.com"
         data-background-interactive>
  Interactive embedded page
</section>
```

## Speaker Notes

Add notes visible only in speaker view (press `S` to open):
```html
<section>
  <h3>Slide Title</h3>
  <p>Visible content</p>
  <aside class="notes">
    Only the speaker sees this.
    Can include HTML, timing cues, delivery notes.
  </aside>
</section>
```

## Vertical Slides

Nest `<section>` inside `<section>` for vertical navigation:
```html
<section>
  <section>Horizontal slide 1, vertical 1</section>
  <section>Horizontal slide 1, vertical 2</section>
</section>
<section>
  <section>Horizontal slide 2, vertical 1</section>
</section>
```

Navigate: left/right for horizontal, up/down for vertical.

## Slide Visibility

```html
<!-- Hidden from navigation, accessible by URL hash -->
<section data-visibility="hidden">Secret slide</section>

<!-- Visible but not counted in slide numbers -->
<section data-visibility="uncounted">Bonus slide</section>
```

## Code Highlighting

Requires the highlight plugin. Line-by-line highlighting with `data-line-numbers`:

```html
<pre><code data-line-numbers="1|3-4|6">
line 1 — highlighted first
line 2
line 3 — highlighted second (with line 4)
line 4
line 5
line 6 — highlighted third
</code></pre>
```

`|` separates steps. Each step highlights those line numbers.

Static highlight (no stepping):
```html
<pre><code data-line-numbers="2,4">
line 1
line 2 — always highlighted
line 3
line 4 — always highlighted
</code></pre>
```

## KaTeX / Math

With the math plugin loaded:

**Inline**: `$E = mc^2$` or `\(E = mc^2\)`

**Block**:
```html
$$\text{Loss} \propto \frac{1}{m}$$
```

Or:
```html
\[\sum_{i=1}^{n} x_i\]
```

Configure delimiters in `Reveal.initialize()`:
```js
katex: {
  version: 'latest',
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
  ],
}
```

## Overview Mode

Press `O` to see all slides in a grid. Click to navigate. Press `O` again to exit.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `↑` / `↓` | Vertical navigation |
| `F` | Fullscreen |
| `S` | Speaker notes |
| `O` | Overview |
| `B` / `.` | Blackout |
| `Esc` | Overview (toggle) |
| `Alt + click` | Zoom in |

## PDF Export

Append `?print-pdf` to URL, then use browser Print → Save as PDF:
```
http://localhost:8000/?print-pdf
```
