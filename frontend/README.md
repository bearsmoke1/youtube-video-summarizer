# Frontend — React + Vite

A single-page interface: a hero section containing the summarizer, plus explanatory sections
below it. There is no router and no global state library — the app is one page, and the only
meaningful state lives in one component.

**Stack:** React 18 · Vite 5 · Tailwind CSS 3 (+ typography plugin) · react-markdown with remark-gfm

## Component tree

```
App
├── BackgroundGlow          decorative dotted-grid backdrop
├── Nav
├── main
│   ├── Hero
│   │   └── Summarizer      ← all the logic lives here
│   │       ├── URLInputForm    input + short/detailed toggle + submit
│   │       ├── LoadingState    animated skeleton while waiting
│   │       ├── ErrorState      inline error banner
│   │       └── SummaryDisplay  rendered markdown + Copy / Download
│   ├── HowItWorks
│   └── Features
└── Footer
```

`main.jsx` mounts `App` into `#root` under `React.StrictMode` and imports the global stylesheet.

## State and data flow

`Summarizer.jsx` is the only stateful component. It holds six pieces of state — the URL, the
chosen type, a loading flag, the returned summary, the type that summary came back as, and an
error string — and passes what the children need down as props. The children are presentational:
`URLInputForm` reports changes upward, `SummaryDisplay` only renders what it's given.

```
User submits
   → setLoading(true), clear previous summary and error
   → requestSummary(url, type)        services/apiService.js
   → success: store summary + the type the server confirmed
   → failure: store the error message
   → finally: setLoading(false)
```

Exactly one of loading / error / summary is visible at a time, so the panel never shows a stale
summary next to a new error.

## Talking to the API

`services/apiService.js` is the single place that performs network calls. It posts to the
**same-origin** path `/api/summarize`, never an absolute backend URL, which keeps the browser free
of any host configuration and avoids CORS entirely.

Vite's dev server proxies `/api` to the backend (`vite.config.js`). The target comes from
`VITE_PROXY_TARGET`, defaulting to `http://localhost:4000` for local runs; Docker Compose sets it
to `http://backend:4000`, the backend's name on the internal network.

The service distinguishes two failure kinds: a rejected `fetch` (the backend is unreachable)
becomes *"Cannot reach the server…"*, while an HTTP error surfaces the server's own `error`
message, so users see the specific reason — no captions, bad URL — rather than a generic failure.

## Rendering summaries

Summaries arrive as markdown. `SummaryDisplay` renders them with `react-markdown` + `remark-gfm`
(tables, strikethrough, task lists) inside a Tailwind `prose` container, so headings, bold text
and bullets are styled consistently. Rendering markdown rather than injecting HTML means model
output is never treated as executable markup.

Two actions sit above the summary:
- **Copy** — `navigator.clipboard`, with a brief "Copied ✓" confirmation. The call is wrapped in a
  `try/catch` because clipboard access is blocked in some browser contexts.
- **Download** — builds a text `Blob`, triggers an anchor click, then revokes the object URL.

## Styling

Tailwind utility classes throughout, with a neo-brutalist look: thick black borders, hard offset
shadows, flat high-contrast colours. Shared pieces (`btn-brutal`, `card-brutal`, `shadow-hard-*`,
the `brut-*` palette, the `ink`/`paper` colours) are defined once in `styles.css` and
`tailwind.config.js` rather than repeated across components.

Accessibility basics are in place: a labelled URL input, `role="radiogroup"` on the length toggle,
`role="alert"` on errors, and disabled controls while a request is in flight.

## Local development

```bash
npm install
npm run dev       # dev server on :5173, proxying /api to the backend
npm run build     # production bundle into dist/
npm run preview   # serve the built bundle
```

The backend must be running for summaries to work; the page itself loads fine without it and will
report that the server is unreachable on submit.
