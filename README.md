# AI Workflow Experiments

A collection of hands-on projects I built **to learn how to design and ship AI workflows**. Each sub-folder is an independent experiment with its own toolchain, dependencies, and documentation, focused on a different part of the AI agent stack.

> ⚠️ **Security Notice:** This repository **does not** track any `.env` files, API keys, service-role tokens, certificates, or other secrets. Every sub-project has its own `.gitignore` that excludes these files. See the [Security](#security) section below for details.

---

## 📚 Learning Projects

These are the three projects I built while learning AI workflow patterns — each one tackles a different problem area:

| # | Project | Stack | What I learned |
|---|---------|-------|----------------|
| 1️⃣ | [Mastra AI Agent Team](./Mastra%20first%20test/README.md) | TypeScript, Node.js | Multi-agent orchestration with [Mastra](https://mastra.ai) — agents, tools, and a coordinator pattern. |
| 2️⃣ | [Hindsight Docker](./hindsight%20docker/README.md) | Docker | Containerised deployment of the Hindsight service and environment-based configuration. |
| 3️⃣ | [Agno for Todo](./agno%20for%20todo/README.md) | Python, Supabase (optional) | AI-assisted task management with [Agno](https://github.com/agno-agi/agno), Riverpod-style state, and a CLI/API. |

> 💡 **Why this repo exists:** I wanted a single place to keep every AI workflow experiment, compare approaches side-by-side, and have a reference for future projects. The code is intentionally kept simple and self-contained so the focus stays on the *workflow* rather than production polish.

---

## 📂 Repository Layout

```
AI workflow Experiments/
├── Mastra first test/      # 1️⃣ Mastra multi-agent team (TypeScript)
├── hindsight docker/       # 2️⃣ Hindsight Docker deployment
├── agno for todo/          # 3️⃣ Agno-powered todo assistant (Python)
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

### 2️⃣ [Hindsight Docker](./hindsight%20docker/README.md)
Dockerised deployment configuration for the Hindsight service. Provides reproducible container builds and environment-based configuration.

- **Stack:** Docker
- **Use case:** Containerised service deployment
- **Quick start:** Populate the local `.env` files, then run the install command from `terminal command docker install.env`

### 3️⃣ [Agno for Todo](./agno%20for%20todo/README.md)
An [Agno](https://github.com/agno-agi/agno)-based AI agent project that powers a todo / task-management assistant, with an optional Supabase backend.

- **Stack:** Python 3.10+, Supabase (optional)
- **Use case:** AI-assisted todo / task management
- **Quick start:** `cd "agno for todo" && python -m venv .venv && pip install -r requirements.txt && python cli.py`

---

## 🛠️ Getting Started

### Prerequisites

Different sub-projects have different prerequisites. At a glance:

| Sub-project       | Required tools                                 |
|-------------------|------------------------------------------------|
| Mastra            | Node.js LTS, npm (or pnpm/yarn)                |
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

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-change`.
3. Make your changes **only inside one sub-project** unless the change is cross-cutting.
4. Run `git status` and `git diff --cached` to make sure **no `.env` or key files** are staged.
5. Commit with a clear message and open a pull request.

When adding a new sub-project, also create a dedicated `.gitignore` and `README.md` in its folder.

---

## 📄 License

TBD — add an explicit license file (e.g., `LICENSE`) before publishing publicly.

---

## 🔗 Quick Links

- [Mastra first test/README.md](./Mastra%20first%20test/README.md)
- [hindsight docker/README.md](./hindsight%20docker/README.md)
- [agno for todo/README.md](./agno%20for%20todo/README.md)
