const NEW_LINE = String.fromCharCode(10);

export const DEFAULT_HTML_PREVIEW = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1">',
  '  <title>DevToolkit Preview</title>',
  '  <style>',
  '    body { font-family: system-ui, sans-serif; padding: 2rem; color: #0f172a; }',
  '    h1 { color: #3b82f6; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <h1>Hello DevToolkit</h1>',
  '  <p>Edit HTML to preview it live.</p>',
  '</body>',
  '</html>'
].join(NEW_LINE);

export function normalizeHtmlDocument(value) {
  const html = String(value ?? '').trim();
  if (!html) return '';
  return /^<!doctype html>/i.test(html) ? html : ['<!doctype html>', html].join(NEW_LINE);
}

export function getHtmlPreviewStatus(value) {
  const html = String(value ?? '');
  if (!html.trim()) return { type: 'warning', message: 'Preview is empty. Add HTML to render the iframe.' };
  if (html.length > 250000) return { type: 'warning', message: 'Large HTML documents may render slowly in the browser.' };
  return { type: 'success', message: 'Preview updated.' };
}
