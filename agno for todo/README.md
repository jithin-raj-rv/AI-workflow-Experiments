# Agno for Todo

An [Agno](https://github.com/agno-agi/agno)-based AI agent project that powers a todo / task-management assistant, with an optional Supabase backend.

> ⚠️ **Security Notice:** This repository **does not** track any `.env` files, API keys, or service-role tokens. All secrets are excluded via `.gitignore`. See the [Security](#security) section below.

## Project Structure

```
agno for todo/
├── agents.py              # Agno agent definitions
├── agent_os.py            # AgentOS entry point / runtime
├── api.py                 # API layer exposing the agents
├── cli.py                 # CLI entry point
├── tools.py               # Custom tools for the agents
├── requirements.txt       # Python dependencies
├── supabase/              # Supabase config & edge functions
│   └── functions/         # Supabase Edge Functions
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Prerequisites

- [Python](https://www.python.org/) **3.10+**
- [pip](https://pip.pypa.io/)
- (Optional) [Supabase CLI](https://supabase.com/docs/guides/cli) — only if you want to run the local Supabase stack

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
   # LLM provider
   OPENAI_API_KEY=your_openai_api_key_here

   # Agno / AgentOS
   AGNO_API_KEY=your_agno_api_key_here

   # Supabase (if used)
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
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

## Supabase (Optional)

If you want to run the included Supabase Edge Functions:

```bash
# Install the Supabase CLI first
supabase start          # boots the local stack
supabase functions serve
```

The `supabase/` directory also contains deployment configuration.

## Security

🔒 **Never commit sensitive credentials.** The following are already excluded via `.gitignore`:

- `.env`, `.env.*`, `*.env`
- `*.key`, `*.pem`
- `secrets.json`, `credentials.json`
- `supabase/.env`, `supabase/.branches/`, `supabase/.temp/` (local stack state)
- Python `__pycache__/`, virtual envs, build artefacts, and OS junk

Before pushing:
```bash
git status                               # ensure no env / key files are staged
git ls-files | grep -E "\.(env|key|pem)$"  # should return nothing tracked
```

If you ever accidentally leak a secret, **rotate it immediately** and use `git filter-repo` (or BFG Repo-Cleaner) to purge it from history.

## Next Steps

1. Populate a local `.env` with your API keys
2. Run the CLI / API / AgentOS entry point that fits your workflow
3. (Optional) Start the local Supabase stack for the edge functions
