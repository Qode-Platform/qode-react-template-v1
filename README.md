# React template

Provisioned from [`Qode-Platform/fleet-template-v1`](https://github.com/Qode-Platform/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows) with a
React starter laid on top.

## Origin

    npx create-vite@latest react --template react-ts

Generated 2026-09-21 on Node v22.12.0 / Python 3.12.3. **Dependencies were
never installed and this has never been built or run.** Boot it once before
trusting it.

## Fleet lifecycle

`fleet.conf` drives every script in `bin/`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `npx vite preview --host 0.0.0.0 --port $PORT` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

Listens on `$PORT` (default `3000`); health check hits `/`.

## BASE_PATH

The fleet injects `BASE_PATH` (`/direct/<agent>:<port>`) and nginx forwards
that prefix **unchanged** — so this app serves every route and asset under
it. An empty or unset value means standalone mode: serve at the host root.

- Vite `base` in vite.config.ts, baked at BUILD time from $BASE_PATH.
- `HEALTH_PATH` in `fleet.conf` stays un-prefixed; the fleet prepends `$BASE_PATH` itself.
- A value like `direct/x:3000/` is normalised to `/direct/x:3000`.

## What differs from stock output

- `vite preview` serves the production build; swap for a CDN or static host in real deployments.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Rule: everything under BASE_PATH

This app is served behind a proxy under a prefix (`BASE_PATH=/direct/<agent>:<port>`),
and the prefix is forwarded to the app unchanged. **Every API call and every asset
reference must carry the base path.** Anything hard-coded to `/` hits the host root,
not the app, and 404s in production even though it works on localhost.

The framework rewrites only *some* things for you:

- **Vite / Astro** rewrite `index.html` and bundled asset imports.
- **Next** rewrites `next/link` and `next/image`.

What is **not** rewritten: `fetch` / tRPC / XHR URLs, and string literals in code
(`<use href="/icons.svg#x">`, `<link href="/favicon.ico">`, `url: "/api/trpc"`, …).
Those must build the URL themselves from:

- `import.meta.env.BASE_URL` (Vite / Astro), or
- `process.env.NEXT_PUBLIC_BASE_PATH` (Next).

Run `npm run check:base-path` to verify — it scans `src/` for host-root literals and
fails if it finds any. A line that is genuinely framework-handled can be exempted with
a trailing `// base-path-ok` comment.
