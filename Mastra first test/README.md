# Mastra AI Agent Team

A multi-agent system built with [Mastra](https://mastra.ai) for collaborative AI workflows.

> ⚠️ **Security Notice:** This repository **does not** track any `.env` files, API keys, or other secrets. Never commit sensitive credentials. See the [Security](#security) section below.

## Project Structure

```
Mastra first test/
├── src/                   # Source code
│   ├── index.ts           # Main entry point with agent definitions
│   └── config.ts          # Agent team configuration
├── agno/                  # Sub-project: Agno agents
├── package.json           # Project dependencies
├── package-lock.json      # Locked dependency tree
├── tsconfig.json          # TypeScript configuration
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── USAGE_GUIDE.md         # Detailed usage instructions
```

## Agents

### Research Agent
- **Role**: Gathers and synthesizes information
- **Capabilities**: Web search, information retrieval, summarization

### Analytics Agent
- **Role**: Analyzes data and provides insights
- **Capabilities**: Data analysis, pattern recognition, reporting

### Coordinator Agent
- **Role**: Coordinates between agents and manages workflows
- **Capabilities**: Task delegation, workflow management, communication

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (or pnpm / yarn)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables — create a local `.env` file (this file is **git-ignored**):
   ```env
   OPEN_ROUTER_API_KEY=your_open_router_api_key_here
   MODEL=openai/gpt-4
   OPEN_ROUTER_API_BASE=https://openrouter.ai/api/v1
   ```
   You can get an Open Router API key from [Open Router](https://openrouter.ai).

   Alternatively, copy the template:
   ```bash
   cp .env.example .env   # then fill in your values
   ```

## Usage

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

## Supported Models

Open Router supports many models. Set the `MODEL` environment variable to switch providers:

- **OpenAI**: `openai/gpt-4`, `openai/gpt-3.5-turbo`
- **Anthropic**: `anthropic/claude-3-opus`, `anthropic/claude-3-sonnet`
- **Google**: `google/gemini-pro`
- **Meta**: `meta-llama/llama-2-70b`
- And many more — see the [Open Router model list](https://openrouter.ai/docs/models).

## Adding Custom Agents

To add a new agent, modify `src/index.ts`:

```typescript
const customAgent = new Agent({
  name: 'Custom Agent',
  instructions: 'Your custom instructions here',
  model: 'gpt-4',
});
```

## Configuration

Edit `src/config.ts` to customize:
- Agent capabilities
- Communication protocols
- Team behaviour and workflows

## Security

🔒 **Never commit sensitive credentials.** The following are already excluded via `.gitignore`:

- `.env`, `.env.*`, `*.env`
- `*.key`, `*.pem`
- `secrets.json`, `credentials.json`

Before pushing, double-check:
```bash
git status           # verify no .env or key files are staged
git diff --cached    # inspect staged changes
```

If you ever accidentally commit a secret, **rotate the key immediately** and use `git filter-repo` (or BFG) to purge it from history.

## Next Steps

1. Configure your API keys (in a local, git-ignored `.env`)
2. Define specific tasks for your agent team
3. Implement inter-agent communication patterns
4. Add custom tools and integrations
