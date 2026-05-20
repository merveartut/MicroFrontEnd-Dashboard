
# 🚀 Micro FrontEnd Dashboard (Vite Edition)

A production-inspired Micro Frontend (MFE) architecture built with **Vite** and **Native ESM Federation**. This project demonstrates how to orchestrate multiple independent React applications under a single shell, with shared state management, runtime health monitoring, and isolated error handling.

## 🏗️ Architecture

### Shell / Remote Pattern

The project follows a **Shell (Host) + Remote** pattern. The Shell is the container application — it owns the layout, the sidebar, and the shared state layer. Remote apps are independently deployed React applications that are loaded into the Shell at runtime via ES Module Federation.

```
┌─────────────────────────────────────────────────┐
│                   Shell (5000)                  │
│                                                 │
│   ┌─────────────────┐   ┌─────────────────┐     │
│   │  Finance App    │   │   Trends App    │     │
│   │   (Remote)      │   │   (Remote)      │     │
│   │   Port 5001     │   │   Port 5002     │     │
│   └────────┬────────┘   └────────┬────────┘     │
│            │                     │              │
│            └──────────┬──────────┘              │
│                       │                         │
│              @mfe/store (Shared)                │
│           window.__MFE_SYSTEM_STORE__           │
└─────────────────────────────────────────────────┘
```


| Layer | Technology |
|---|---|
| Bundler | Vite 7 |
| Federation | `@originjs/vite-plugin-federation` |
| UI Framework | React 19 |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 3 |
| Language | TypeScript |
| Package Manager | pnpm |

---

## 🔄 Shared State: Why Zustand?

State sharing in MFE is non-trivial. React Context and Redux depend on a Provider tree — each remote has its own React instance, so a Provider in the Shell doesn't reach into remote components.

Zustand solves this because its store is a **plain JavaScript object**, independent of React. The store is attached to `window.__MFE_SYSTEM_STORE__` as a singleton on first access. Any app — regardless of how it was bundled — reads and writes to the same instance.

### Store structure

| Store | Persistence | Purpose |
|---|---|---|
| `useSystemStore` | None (runtime only) | Tracks `online / offline / loading` status per remote |
| `useThemeStore` | `localStorage` via `persist` middleware | Dark/light mode preference across sessions |

The `persist` middleware wraps Zustand's `set` — on every state change it writes to `localStorage["mfe-theme-storage"]` and rehydrates from it on page load.

---

## 🩺 Runtime Health Monitoring

The Shell polls each remote's `remoteEntry.js` every **5 seconds** with a `HEAD` request. If the request fails, the corresponding module's status is set to `offline` in the shared store. The sidebar reflects this in real time.

## 🛡️ Error Isolation: ErrorBoundary

Each remote is wrapped in a class-based `ErrorBoundary`. It is a class component by necessity — React's `getDerivedStateFromError` and `componentDidCatch` lifecycle methods are not available as hooks.

When a remote fails to load (network error, chunk mismatch, runtime exception), `componentDidCatch` catches it, updates the shared store via Zustand's vanilla `.setState()` API, and renders the fallback UI instead of crashing the Shell.

### The Ecosystem
* **Shell (Host):** Port `5000` — The container app that stitches everything together.
* **Finance App (Remote):** Port `5001` — Handles financial data visualizations.
* **Trends App (Remote):** Port `5002` — Manages market trends and analytics.
* **Shared Store:** A shared library (`@mfe/store`) that ensures state synchronization across all apps.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

### Install dependencies

```bash
pnpm install
```

### Build shared packages

Shared packages must be built before running any app. The store and ui-library are consumed as source references (`workspace:*`) but federation requires them to be resolvable.

```bash
pnpm --filter @mfe/store build
pnpm --filter @mfe/ui-library build
```

### Run the applications

Open three separate terminals. **Remotes must start before the Shell** so the Shell can locate their `remoteEntry.js` at startup.

```bash
# Terminal 1 — Finance remote
pnpm --filter finance build && pnpm --filter finance preview
```

```bash
# Terminal 2 — Trends remote
pnpm --filter trends build && pnpm --filter trends preview
```

```bash
# Terminal 3 — Shell (dev mode with HMR)
pnpm --filter shell dev
```

| App | URL | Mode |
|---|---|---|
| Shell | http://localhost:5000 | dev (HMR active) |
| Finance | http://localhost:5001 | preview (built bundle) |
| Trends | http://localhost:5002 | preview (built bundle) |

### Development workflow for remotes

`@originjs/vite-plugin-federation` does not fully support dev mode for remote apps — remotes must be served as built bundles. To avoid restarting preview on every change, run build in watch mode alongside preview:

```bash
# In the remote's directory
pnpm build --watch   # rebuilds on file change
pnpm preview         # serves the built output
```

---