# Presentation components

These CSS components work with the standalone stylesheet and the Tailwind v3 plugin. Open `examples/index.html` after `pnpm build`, or run `pnpm dev` and visit `/`, to try the gallery. The gallery includes light and dark themes in the development view.

## Comparison table

Use a real table so column headings stay associated with their cells. The component is intended for two columns. Reveal.js can reveal each row as a fragment without shifting the remaining rows.

```html
<table class="table-comparison">
  <thead>
    <tr><th scope="col">What can happen?</th><th scope="col">What should we do?</th></tr>
  </thead>
  <tbody>
    <tr><td>The computer is busy</td><td>Inform the user</td></tr>
    <tr class="fragment fade-up"><td>An execution fails</td><td>Explain and offer a retry</td></tr>
  </tbody>
</table>
```

Customize the component with `--tc-left-color`, `--tc-right-color`, `--tc-column-gap` and `--tc-row-gap`. Colors inherit the theme; column backgrounds mix the selected color with the current background. Labels and actions should still explain the relationship without relying on color alone.

Plain tables retain the previous default borders and collapsed layout. Starting with 0.4.0, these defaults and card table rules no longer use `!important`, so your component styles can override them normally. Existing `table-sm`, `table-research` and `timeline-table` variants remain available. Check presentations that previously relied on forced table styles winning over custom CSS.

## Process diagrams

Build diagrams from `.pd-node` elements and decorative `.pd-link` connectors inside `.process-diagram`. Provide a complete description with `role="img"` and `aria-label` when the diagram conveys a relationship that text order alone does not explain. Connectors use `aria-hidden="true"`.

```html
<div class="process-diagram pd-flow" role="img" aria-label="Input passes through processing to output.">
  <div class="pd-node"><strong>Input</strong><small>Prepare the data</small></div>
  <span class="pd-link" aria-hidden="true"></span>
  <div class="pd-node"><strong>Process</strong></div>
  <span class="pd-link" aria-hidden="true"></span>
  <div class="pd-node pd-focus"><strong>Output</strong><small>Evaluate the result</small></div>
</div>
```

| Class | Purpose |
| --- | --- |
| `pd-flow` | Horizontal flow; nodes share available width |
| `pd-cycle` | Three-node flow with a second row for a return connector |
| `pd-return` | Return path from the last node to the first, inside `pd-cycle` |
| `pd-hub` | Left, center and right nodes with optional top and transverse bottom nodes |
| `pd-link--both` | Arrowheads in both directions |
| `pd-link--down` | Vertical connector, pointing down |
| `pd-link--dashed` | Dashed connector; combines with direction modifiers |
| `pd-focus` | Emphasize a node when revisiting the same diagram |

For a cycle, use three nodes separated by two links, then append `<span class="pd-return" aria-hidden="true"></span>`. The gallery shows the complete markup.

For a hub, position nodes with `pd-top`, `pd-left`, `pd-center`, `pd-right` and `pd-bottom`. Position links with `pd-top-link`, `pd-left-link`, `pd-right-link`, `pd-bottom-left-link`, `pd-bottom-center-link` and `pd-bottom-right-link`. Combine vertical links with `pd-link--down`. Omit the top node and link when they are not needed. The gallery includes a full example.

Customize connector color, thickness and length with `--pd-line-color`, `--pd-line-width` and `--pd-link-size`. For other arrangements, supply your own grid placement while retaining the same nodes and connectors. Keep diagrams small enough to read when projected.

## Code and demo panel

The layout pairs code with a preview and wraps into a single column when there is not enough space. It supplies styling, not a code evaluator or a networking client.

```html
<div class="demo-panel" data-state="ready">
  <div class="dp-code">
    <p class="dp-label">JavaScript</p>
    <pre><code>[1, 2, 3].map(n =&gt; n * 2)</code></pre>
  </div>
  <div class="dp-preview">
    <p class="dp-label">Output</p>
    <div class="dp-controls">
      <button type="button" class="btn">Run</button>
    </div>
    <pre class="dp-output" role="log" aria-label="Example output" aria-live="polite" aria-busy="false"></pre>
    <pre class="dp-print" aria-label="Sample output">[2,4,6]</pre>
    <p class="dp-status" role="status">Ready</p>
  </div>
</div>
```

The application sets `data-state` to `ready`, `pending`, `complete` or `error`, updates the output and status, and disables controls as appropriate. During execution, set `aria-busy="true"` on the output; keep the live status outside that busy region so waiting messages can be announced.

Own the timers and listeners in your application. Reset pending work when leaving a slide, prevent repeated simultaneous runs, and keep button/input keyboard events from accidentally navigating Reveal.js. The gallery's `examples/demo.js` demonstrates run, reset and cancellation on navigation. It executes local fixed JavaScript; the short delay only demonstrates the pending state. It is example code, not a shipped Revelab runtime.

In print, controls disappear. If `.dp-print` exists, its authored static output replaces the live output and status, even if the demo has never run. Without `.dp-print`, the current output stays visible. The component does not add animation; use native Reveal.js fragments and respect reduced-motion preferences in application-owned effects.

## Development checks

```sh
pnpm install --frozen-lockfile
pnpm test
```

The test command builds both stylesheets and checks parsing, the standalone entry point, Tailwind filtering, fallback declarations, print rules and overridable table defaults. The development gallery imports source CSS; the examples gallery imports the built stylesheet.
