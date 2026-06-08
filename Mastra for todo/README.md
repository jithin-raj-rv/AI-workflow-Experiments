# `Mastra for todo` — Mastra todo application

This folder groups the **Mastra‑powered todo application** work. The actual
Mastra project lives in [`todo-app/`](./todo-app/README.md); this parent
folder exists to keep the related scaffolding (tunnel scripts, deployment
helpers, etc.) in one place.

## Contents

```
Mastra for todo/
├── todo-app/              # The Mastra application (npm project)
│   ├── README.md          # App-level docs (start here)
│   ├── package.json
│   ├── src/mastra/        # Agents, tools, workflows, scorers
│   └── ...
├── tunnel.bat             # Windows helper for tunneling the dev server
└── README.md              # This file
```

## Getting started

1. Open the Mastra app README for the canonical setup:
   [`todo-app/README.md`](./todo-app/README.md)
2. From the `todo-app` directory:
   ```bash
   npm install
   npm run dev
   ```
3. Open [http://localhost:4111](http://localhost:4111) to access
   [Mastra Studio](https://mastra.ai/docs/studio/overview).

## Helper scripts

- **`tunnel.bat`** — convenience Windows script for exposing the local dev
  server via a tunnel (e.g., for testing webhooks).

## License

Released under the project's [community license](../../LICENSE). Use it as you
wish — see the root `LICENSE` file for the full text.
