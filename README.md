# AI Workflow Experiments

A collection of hands-on projects I built **to learn how to design and ship AI workflows**. Each sub-folder is an independent experiment with its own toolchain, dependencies, and documentation, focused on a different part of the AI agent stack.

> ⚠️ **Security Notice:** This repository **does not** track any `.env` files, API keys, service-role tokens, certificates, or other secrets. Every sub-project has its own `.gitignore` that excludes these files. See the [Security](#security) section below for details.

---

## 📚 Learning Projects

These are the four projects I built while learning AI workflow patterns — each one tackles a different problem area:

| # | Project | Stack | What I learned |
|---|---------|-------|----------------|
| 1️⃣ | [Mastra AI Agent Team](./Mastra%20first%20test/README.md) | TypeScript, Node.js | Multi-agent orchestration with [Mastra](https://mastra.ai) — agents, tools, and a coordinator pattern. |
| 2️⃣ | [Mastra for Todo App](./Mastra%20for%20todo/README.md) | TypeScript, Node.js, Mastra | A full Mastra-powered todo / goals / reminders app — agents, tools, workflows, scorers, Supabase integration. |
| 3️⃣ | [Hindsight Docker](./hindsight%20docker/README.md) | Docker | Containerised deployment of the Hindsight service and environment-based configuration. |
| 4️⃣ | [Agno for Todo](./agno%20for%20todo/README.md) | Python, Supabase (optional) | AI-assisted task management with [Agno](https://github.com/agno-agi/agno), Riverpod-style state, and a CLI/API. |

> 💡 **Why this repo exists:** I wanted a single place to keep every AI workflow experiment, compare approaches side-by-side, and have a reference for future projects. The code is intentionally kept simple and self-contained so the focus stays on the *workflow* rather than production polish.

---

## 📂 Repository Layout

```
AI workflow Experiments/
├── Mastra first test/      # 1️⃣ Mastra multi-agent team (TypeScript)
├── Mastra for todo/        # 2️⃣ Mastra-powered todo application (TypeScript)
├── hindsight docker/       # 3️⃣ Hindsight Docker deployment
├── agno for todo/          # 4️⃣ Agno-powered todo assistant (Python)
└── README.md               # ← you are here
```

Each sub-project is **self-contained** — pick the one you want to work on and follow its README.

---

## 🚀 Sub-Projects

### 1️⃣ [Mastra AI Agent Team](./Mastra%20first%20test/README.md)
A multi-agent system built with [Mastra](https://mastra.ai) for collaborative AI workflows. Includes Research, Analytics, and Coordinator agents powered via Open Router.

- **Stack:** TypeScript, Node.js, npm
- **Use case:** Multi-agent orchestration
- **Quick start:** `cd "Mastra first test" && npm install && npm run dev`
- **Quick links:**
  - [Project README](./Mastra%20first%20test/README.md)
  - [Usage guide](./Mastra%20first%20test/USAGE_GUIDE.md)
  - [Agno side-by-side experiment](./Mastra%20first%20test/agno/README.md)
  - [Mastra framework](https://mastra.ai)
  - [Mastra Studio docs](https://mastra.ai/docs/studio/overview)

### 2️⃣ [Mastra for Todo App](./Mastra%20for%20todo/README.md)
A full [Mastra](https://mastra.ai)-powered todo / goals / reminders application that lives in `Mastra for todo/todo-app/`. Showcases agents, tools, workflows, scorers, and Supabase integration.

- **Stack:** TypeScript, Node.js, npm, Supabase
- **Use case:** End-to-end Mastra app (multi-agent todo + goals + reminders)
- **Quick start:** `cd "Mastra for todo/todo-app" && npm install && npm run dev`
- **Quick links:**
  - [Project README](./Mastra%20for%20todo/README.md)
  - [Mastra todo app (todo-app)](./Mastra%20for%20todo/todo-app/README.md)
  - [Mastra framework](https://mastra.ai)
  - [Mastra Studio docs](https://mastra.ai/docs/studio/overview)

### 3️⃣ [Hindsight Docker](./hindsight%20docker/README.md)
Dockerised deployment configuration for the Hindsight service. Provides reproducible container builds and environment-based configuration.

- **Stack:** Docker
- **Use case:** Containerised service deployment
- **Quick start:** Populate the local `.env` files, then run the install command from `terminal command docker install.env`
- **Quick links:**
  - [Project README](./hindsight%20docker/README.md)
  - [Docker docs](https://docs.docker.com/)
  - [Docker Compose overview](https://docs.docker.com/compose/)

### 4️⃣ [Agno for Todo](./agno%20for%20todo/README.md)
An [Agno](https://github.com/agno-agi/agno)-based AI agent project that powers a todo / task-management assistant, with an optional Supabase backend.

- **Stack:** Python 3.10+, Supabase (optional)
- **Use case:** AI-assisted todo / task management
- **Quick start:** `cd "agno for todo" && python -m venv .venv && pip install -r requirements.txt && python cli.py`
- **Quick links:**
  - [Project README](./agno%20for%20todo/README.md)
  - [Agno framework](https://github.com/agno-agi/agno)
  - [Supabase CLI docs](https://supabase.com/docs/guides/cli)
  - [Python virtual environments guide](https://docs.python.org/3/tutorial/venv.html)

---

## 🛠️ Getting Started

### Prerequisites

Different sub-projects have different prerequisites. At a glance:

| Sub-project       | Required tools                                 |
|-------------------|------------------------------------------------|
| Mastra first test | Node.js LTS, npm (or pnpm/yarn)                |
| Mastra for todo   | Node.js LTS, npm, (optional) Supabase CLI      |
| Hindsight Docker  | Docker 20.10+, (optional) Docker Compose v2    |
| Agno for Todo     | Python 3.10+, pip, (optional) Supabase CLI    |

### Clone the repository

```bash
git clone <your-github-repo-url>
cd "AI workflow Experiments"
```

### Choose a sub-project

```bash
cd "Mastra first test"        # or
cd "Mastra for todo"          # or
cd "hindsight docker"         # or
cd "agno for todo"
```

Then follow the **Installation** section in that sub-project's `README.md`.

---

## 🔒 Security

🔒 **Never commit sensitive credentials.** This repository enforces a strict no-secrets policy:

### Already excluded by `.gitignore` in every sub-project

- `.env`, `.env.*`, `*.env`, `*.env.local`
- `*.key`, `*.pem`
- `secrets.json`, `credentials.json`
- IDE / OS junk (`.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`)

### Before every push

```bash
# From the repo root
git status                                           # nothing sensitive staged
git ls-files | grep -E "\.(env|key|pem)$"            # should print nothing
```

### If a secret is ever leaked

1. **Rotate the key immediately** with the provider.
2. Purge the file from history with [git filter-repo](https://github.com/newren/git-filter-repo) or [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/).
3. Force-push the cleaned history and notify any collaborators to re-clone.

---

## 📄 License

This repository is released under the **AI Workflow Experiments Community
License (2025)** — a permissive community license. **Anyone can use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
software** for any purpose, with or without attribution.

---

## 🔗 Quick Links

### Sub-projects

- [Mastra first test](./Mastra%20first%20test/README.md) — TypeScript multi‑agent team
  - [Usage guide](./Mastra%20first%20test/USAGE_GUIDE.md)
  - [Agno side‑by‑side experiment](./Mastra%20first%20test/agno/README.md)
- [Mastra for todo](./Mastra%20for%20todo/README.md) — Mastra‑powered todo app
  - [todo-app (Mastra project)](./Mastra%20for%20todo/todo-app/README.md)
- [hindsight docker](./hindsight%20docker/README.md) — Dockerised Hindsight service
- [agno for todo](./agno%20for%20todo/README.md) — Agno‑powered todo assistant

### Repo resources

- [License](./LICENSE) — AI Workflow Experiments Community License (2025)
- [`.gitignore`](./.gitignore) — monorepo ignore patterns
- [GitHub repository](https://github.com/jithin-raj-rv/AI-workflow-Experiments)

### External references

- [Mastra framework](https://mastra.ai)
- [Mastra Studio docs](https://mastra.ai/docs/studio/overview)
- [Agno framework](https://github.com/agno-agi/agno)
- [Supabase CLI docs](https://supabase.com/docs/guides/cli)
- [Docker docs](https://docs.docker.com/)
