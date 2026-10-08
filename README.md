# DevToolkit

All Essential Developer Utilities in One Place — a zero-build, static, browser-only SPA for GitHub Pages.

## Features

- Pure HTML, CSS, and JavaScript with native ES modules.
- Hash routing for static hosting and GitHub Pages deep links.
- Dark mode by default with persisted light/dark toggle.
- Responsive desktop sidebar and mobile drawer.
- Global search, favorites, recent tools, shortcuts, toasts, and modal help.
- 14 client-side tools: Diff Checker, Regex Tester, Text Formatter, JSON Formatter, JSON Compare, JSON Path Tester, Base64 Tool, JWT Decoder, Hash Generator, UUID Generator, HTML Preview, CSS Generator, Token Counter, Prompt Builder.
- No dependencies, no package manager, no backend, no build step.

## Run locally

Open `index.html` from a static server so ES modules load consistently:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

## Validate

Run the dependency-free smoke test with Node.js:

```bash
node tests/smoke-test.mjs
```

The test verifies required files, manifest JSON, registered tool modules, service-worker coverage, and JavaScript syntax.

## GitHub Pages deployment

Deploy the repository root from GitHub Pages. All paths are relative and routing uses hashes, so no server rewrites are required.

## Troubleshooting

If a tool still shows an older error after code changes, Chrome may be serving a stale service-worker cache. Open DevTools, go to **Application → Service Workers**, click **Unregister**, then hard refresh the page. You can also try a new port, for example `python -m http.server 8082`, to avoid an old local cache scope.

## Caveats

- JSONPath intentionally supports a practical subset: `$`, dot paths, bracket keys, array indexes, and wildcards.
- Token counts are estimates, not tokenizer-exact vendor counts.
- JWT signatures are decoded but not verified.
- Service workers only register under HTTP(S), not `file://`.
