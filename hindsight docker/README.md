# Hindsight Docker

Dockerised deployment configuration for the **Hindsight** service.

> ⚠️ **Security Notice:** This repository **does not** track any environment files, API keys, Docker secrets, or certificates. The pre-existing `variables.env` and `install.env` files are **git-ignored** for safety. See the [Security](#security) section below.

## Project Structure

```
hindsight docker/
├── hindsight/                       # Hindsight application source / config
├── docker install variables.env     # ⚠️ git-ignored — environment variables
├── terminal command docker install.env  # ⚠️ git-ignored — install commands
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

> The two `.env` files in this folder contain deployment-specific values. **They are not tracked by Git** — recreate them locally after cloning (see [Setup](#setup)).

## Prerequisites

- [Docker](https://www.docker.com/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2+) — *optional*, only if you use compose
- A shell environment that can run the install commands

## Setup

1. Recreate the local environment files (these are excluded from Git):
   ```bash
   # Adjust the contents to match your local deployment
   touch "docker install variables.env"
   touch "terminal command docker install.env"
   ```
   Fill in any required environment variables such as API keys, database URLs, etc.

2. (Optional) Provide a template for collaborators:
   ```bash
   cp "docker install variables.env"       "docker install variables.env.example"
   cp "terminal command docker install.env" "terminal command docker install.env.example"
   ```
   Then commit the `.example` variants so others know the expected shape.

## Running the Container

> Replace the command below with the contents of your local `terminal command docker install.env`, or run it directly in your shell.

```bash
# Example — adjust to your actual command
docker run --rm \
  --env-file "docker install variables.env" \
  -p 8080:8080 \
  hindsight:latest
```

### Useful Docker commands

```bash
# List running containers
docker ps

# View logs
docker logs -f <container_id>

# Stop & remove
docker stop <container_id>
```

## Configuration

All runtime configuration is supplied via the `docker install variables.env` file. Typical variables include:

| Variable       | Description                |
|----------------|----------------------------|
| `API_KEY`      | Service API key            |
| `DATABASE_URL` | Connection string          |
| `PORT`         | Port the service listens on |

> Adjust this table to match the real variables used by Hindsight.

## Security

🔒 **Never commit sensitive credentials.** The following are already excluded via `.gitignore`:

- `.env`, `.env.*`, `*.env`
- `*.key`, `*.pem`
- `secrets.json`, `credentials.json`
- `docker-compose.override.yml`, `*.override.env`
- Local `hindsight/` build artefacts, virtual envs, and OS junk

Before pushing:
```bash
git status                 # ensure no env / key files are staged
git ls-files | grep -E "\.(env|key|pem)$"   # should return nothing tracked
```

If a secret is ever leaked, **rotate it immediately** and use `git filter-repo` (or BFG Repo-Cleaner) to purge the file from history.

## Next Steps

1. Recreate the git-ignored `.env` files locally
2. Populate them with your deployment values
3. Run the Docker install / run command
4. Verify the service is reachable on the configured port
