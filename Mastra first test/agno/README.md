# `Mastra first test/agno` — Agno orchestrator inside the Mastra playground

This sub-folder contains a **Python / Agno** experiment that lives next to the
TypeScript `Mastra first test` project. It mirrors the same
todo / goal / reminder domain but uses [Agno](https://github.com/agno-agi/agno)'s
multi-agent `Team` primitives instead of Mastra's.

It was kept inside the Mastra sub-folder as a side-by-side comparison while
learning how each framework models agents, tools, and orchestration.

> ⚠️ **Security Notice:** No `.env`, API keys, or service-role tokens are
> tracked here. All secrets are excluded via this folder's `.gitignore`.

## Project Structure

```
Mastra first test/agno/
├── agents.py              # Agno Agent / Team definitions
├── agent_os.py            # AgentOS entry point / runtime
├── api.py                 # API layer exposing the agents
├── cli.py                 # CLI entry point
├── tools.py               # Custom tools bound to a Supabase user
├── requirements.txt       # Python dependencies
├── supabase/              # Supabase edge function used by the agent
│   └── functions/
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Prerequisites

- [Python](https://www.python.org/) **3.10+**
- [pip](https://pip.pypa.io/)
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) — only if you
  want to run the local Supabase stack

## Installation

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS / Linux
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a local `.env` file (this file is **git-ignored**). Example:
   ```env
   # LLM provider (used by agno.models.openrouter)
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Supabase (if used)
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Test user identifier for the local agent
   TEST_USER_ID=local-test-user-id
   ```

## Usage

### CLI
```bash
python cli.py
```

### API server
```bash
python api.py
```

### AgentOS runtime
```bash
python agent_os.py
```

## What this experiment taught me

- How to define specialised `Agent` instances and combine them into a
  coordinating `Team` with Agno.
- How to bind per-user tools (Supabase-backed) to the team so each invocation
  operates on the correct user.
- The contrast between Agno's `Team` model and Mastra's agent / workflow model.

## License

Released under the project's [community license](../../LICENSE). Use it as you
wish — see the root `LICENSE` file for the full text.
