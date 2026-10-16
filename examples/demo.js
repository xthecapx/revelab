// Example behavior only. Revelab components remain CSS-only.
const panel = document.querySelector('[data-example-demo]');
if (panel) {
  const run = panel.querySelector('[data-run]');
  const reset = panel.querySelector('[data-reset]');
  const output = panel.querySelector('.dp-output');
  const status = panel.querySelector('.dp-status');
  let pending;

  function ready() {
    clearTimeout(pending);
    pending = undefined;
    panel.dataset.state = 'ready';
    output.setAttribute('aria-busy', 'false');
    output.textContent = 'Run the example to see its output.';
    status.textContent = 'Local JavaScript example.';
    run.disabled = false;
  }

  run.addEventListener('click', () => {
    if (pending) return;
    panel.dataset.state = 'pending';
    output.setAttribute('aria-busy', 'true');
    status.textContent = 'Running…';
    run.disabled = true;
    // A short delay makes the pending state visible; no network request.
    pending = setTimeout(() => {
      pending = undefined;
      output.textContent = JSON.stringify([1, 2, 3].map(n => n * 2));
      output.setAttribute('aria-busy', 'false');
      panel.dataset.state = 'complete';
      status.textContent = 'Finished.';
      run.disabled = false;
    }, 800);
  });

  reset.addEventListener('click', ready);
  panel.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Enter' || event.key.startsWith('Arrow')) {
      event.stopPropagation();
    }
  });
  window.Reveal?.on('slidechanged', event => {
    if (pending && !event.currentSlide.contains(panel)) ready();
  });
}
