const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const postcss = require('postcss');
const revelab = require('../index.js');

function collect(options) {
  const result = { base: [], components: {}, utilities: {} };
  revelab(options).handler({
    addBase: rules => result.base.push(rules),
    addComponents: rules => { result.components = rules; },
    addUtilities: rules => { result.utilities = rules; },
  });
  return result;
}

test('plugin retains print rules inside @media instead of leaking them into screen styles', () => {
  const { components } = collect();
  const selector = '.reveal .demo-panel .dp-print';
  assert.equal(components[selector].display, 'none');
  assert.equal(components['@media print'][selector].display, 'block');
  assert.equal(components['@media print']['.reveal .demo-panel .dp-controls'].display, 'none');
});

test('include and exclude filter nested rules while retaining required base styles', () => {
  const included = collect({ include: ['demo-panel'] });
  assert.ok(included.components['@media print']);
  assert.ok(included.components['.reveal .demo-panel']);
  assert.equal(included.components['.reveal .card'], undefined);
  assert.ok(included.base[0][':root']);
  assert.ok(included.base[1]['.reveal table']);
  const excluded = collect({ exclude: ['demo-panel'] });
  assert.equal(excluded.components['@media print'], undefined);
  assert.equal(excluded.components['.reveal .demo-panel'], undefined);
  assert.ok(excluded.components['.reveal .process-diagram']);
});

test('comments are not selectors and CSS fallbacks survive conversion', () => {
  const { components } = collect();
  function visit(rules) {
    for (const [key, value] of Object.entries(rules)) {
      assert.ok(!key.includes('/*'), key);
      if (key.startsWith('@')) visit(value);
    }
  }
  visit(components);
  const backgrounds = components['.reveal .process-diagram .pd-focus'].background;
  assert.deepEqual(backgrounds, [
    'var(--rlab-color-bg-light)',
    'color-mix(in srgb, var(--rlab-color-accent) 12%, var(--rlab-color-bg))',
  ]);
});

test('plain and card table defaults can be overridden without !important', () => {
  const root = path.join(__dirname, '..');
  for (const filename of ['src/base/tables.css', 'src/components/card.css']) {
    const css = postcss.parse(fs.readFileSync(path.join(root, filename), 'utf8'));
    css.walkRules(rule => {
      if (!rule.selector.includes('table')) return;
      rule.walkDecls(decl => assert.equal(decl.important, undefined, `${rule.selector}: ${decl.prop}`));
    });
  }
});

test('Tailwind v3 compiles the real gallery with nested print rules and theme fallbacks', async () => {
  const tailwind = require('tailwindcss-v3');
  const html = fs.readFileSync(path.join(__dirname, '../examples/index.html'), 'utf8');
  const result = await postcss([tailwind({
    content: [{ raw: html, extension: 'html' }],
    plugins: [revelab()],
    corePlugins: { preflight: false },
  })]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  const css = postcss.parse(result.css);
  const printRules = [];
  css.walkAtRules('media', media => {
    if (media.params === 'print') media.walkRules(rule => printRules.push(rule));
  });
  assert.ok(printRules.some(rule => rule.selector.includes('.dp-print') && rule.nodes.some(decl => decl.value === 'block')));
  let backgrounds;
  css.walkRules(rule => {
    if (rule.selector === '.reveal .process-diagram .pd-focus') {
      backgrounds = rule.nodes.filter(decl => decl.prop === 'background').map(decl => decl.value);
    }
  });
  assert.deepEqual(backgrounds, [
    'var(--rlab-color-bg-light)',
    'color-mix(in srgb, var(--rlab-color-accent) 12%, var(--rlab-color-bg))',
  ]);
  assert.ok(result.css.includes('.reveal table.table-comparison'));
});

test('standalone entry remains usable without Tailwind installed', () => {
  const script = `
    const Module = require('node:module');
    const original = Module._load;
    Module._load = function(name, ...args) {
      if (name === 'tailwindcss/plugin') {
        const error = new Error('Not installed');
        error.code = 'MODULE_NOT_FOUND';
        throw error;
      }
      return original.call(this, name, ...args);
    };
    const entry = require('./index.js');
    if (!entry.css.endsWith('/dist/revelab.css')) process.exit(1);
  `;
  execFileSync(process.execPath, ['-e', script], { cwd: path.join(__dirname, '..') });
});

test('all source files and both generated bundles parse as CSS', () => {
  const root = path.join(__dirname, '..');
  for (const dir of ['base', 'components', 'layouts', 'themes', 'utilities']) {
    for (const file of fs.readdirSync(path.join(root, 'src', dir))) {
      if (file.endsWith('.css')) {
        postcss.parse(fs.readFileSync(path.join(root, 'src', dir, file), 'utf8'));
      }
    }
  }
  for (const file of ['revelab.css', 'revelab.min.css']) {
    const css = postcss.parse(fs.readFileSync(path.join(root, 'dist', file), 'utf8'));
    const selectors = [];
    css.walkRules(rule => selectors.push(rule.selector));
    for (const component of ['table-comparison', 'process-diagram', 'demo-panel']) {
      assert.ok(selectors.some(selector => selector.includes(component)), `${file}: ${component}`);
    }
    let printFallback = false;
    css.walkAtRules('media', media => {
      if (media.params !== 'print') return;
      media.walkRules(rule => {
        if (rule.selector.includes('.dp-print')) printFallback = true;
      });
    });
    assert.ok(printFallback, file);
  }
});
