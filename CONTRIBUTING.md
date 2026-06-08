# Contributing

Thanks for your interest in **AI Workflow Experiments**! This monorepo hosts
three independent sub-projects that explore different agent frameworks and
deployment patterns. Each sub-project lives in its own folder and ships its
own README, dependencies, and `.gitignore`. Please keep the **single source of
truth** in mind when contributing.

## Repository layout

```
AI workflow Experiments/
├── Mastra first test/   # TypeScript multi-agent team
├── hindsight docker/    # Dockerised Hindsight deployment
├── agno for todo/       # Python Agno todo assistant
├── README.md            # Top-level overview
├── CONTRIBUTING.md      # This file
└── .gitignore           # Monorepo-wide ignore patterns
```

## Development workflow

1. **Fork & branch**
   ```bash
   git checkout -b feature/your-change
   ```
2. **Keep changes scoped** – unless the change is cross-cutting, edit files
   inside **one** sub-project so reviews stay small.
3. **Match existing conventions** – follow the README, code style, and
   `package.json` / `requirements.txt` of the sub-project you're editing.
4. **Never commit secrets.** The repo enforces a strict no-secrets policy
   (see [README.md § Security](./README.md#-security)). Verify locally:
   ```bash
   git status
   git ls-files | grep -E "\.(env|key|pem)$"   # should print nothing
   ```
5. **Run the sub-project's own checks** (lint, tests, build) before pushing.
6. **Commit & push**
   ```bash
   git add <scoped-paths>
   git commit -m "Mastra: improve coordinator prompt"   # or similar
   git push origin feature/your-change
   ```
7. **Open a pull request** that links the related issue and summarises the
   effect on the sub-project (and the monorepo, if applicable).

## Adding a new sub-project

1. Create a new top-level folder (e.g., `my-new-experiment/`).
2. Add a self-contained `README.md` and `.gitignore`.
3. Update the top-level `README.md` "Repository Layout" and
   "Sub-Projects" sections so the new project is discoverable.
4. Open a PR with the new folder plus the documentation updates only.

## Code of conduct

Be respectful, assume good intent, and keep discussions focused on the work.
Abusive or harassing behaviour is not tolerated.

## Questions?

Open an issue describing the problem, the expected behaviour, and the
sub-project it relates to.
