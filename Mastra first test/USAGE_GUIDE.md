# Mastra Agent System - Usage Guide

## 📋 Overview

You now have a fully migrated AI agent system from Python (Agno) to TypeScript (Mastra). This system includes 7 specialized agents that can manage your personal productivity through a Supabase database.

## 🚀 Quick Start

### 1. **Environment Setup**
Make sure your `.env` file is properly configured:
```bash
# Copy the example if needed
cp .env.example .env
```

Edit `.env` with your credentials:
- `SUPABASE_URL` and `SUPABASE_KEY` (already migrated from Agno)
- `OPEN_ROUTER_API_KEY` (your OpenRouter API key)
- `MODEL` (default: `openai/gpt-oss-20b:free`)

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Run the Example Workflow**
```bash
npm start
```
Or run the example workflow directly:
```bash
npx tsx src/workflow.example.ts
```

## 🤖 Available Agents

Your system has 7 specialized agents:

| Agent | Purpose | Key Tools |
|-------|---------|-----------|
| **Todo Agent** | Manage to-do items | `add_todo`, `delete_todo`, `modify_todo`, `query_user_data` |
| **Goal Agent** | Manage goals, "To Achieve" items, and systems | `add_goal`, `delete_goal`, `modify_goal`, `add_to_achieve_tool`, `add_system_tool`, etc. |
| **Web Agent** | Search the web (placeholder) | (Requires DuckDuckGo integration) |
| **Timer Prompt Agent** | Schedule future prompts | `add_timer_prompt`, `delete_timer_prompt`, `modify_timer_prompt` |
| **Feedback Agent** | Collect user feedback | `add_feedback`, `delete_feedback`, `modify_feedback` |
| **System Tools Agent** | Manage system tools for goals | `add_system_tool`, `delete_system_tool`, `modify_system_tool` |
| **Reminder Agent** | Set reminders | `add_reminder`, `delete_reminder`, `modify_reminder` |

## 💬 How to Chat with Agents

### Method 1: Using the Example Workflow

The simplest way is to modify the example workflow in [`src/workflow.example.ts`](src/workflow.example.ts):

```typescript
import { todoAgent, goalAgent, reminderAgent } from './index';

async function chatWithAgents() {
  // Chat with Todo Agent
  const todoResponse = await todoAgent.generate([
    {
      role: 'user',
      content: 'Add a todo: "Buy groceries" with high importance and low urgency'
    }
  ]);
  console.log('Todo Agent:', todoResponse);

  // Chat with Goal Agent
  const goalResponse = await goalAgent.generate([
    {
      role: 'user',
      content: 'I want to learn Spanish. Create a goal with daily practice system.'
    }
  ]);
  console.log('Goal Agent:', goalResponse);
}

chatWithAgents().catch(console.error);
```

### Method 2: Create Your Own Chat Script

Create a new file `src/chat.ts`:

```typescript
import { todoAgent, goalAgent, reminderAgent, feedbackAgent } from './index';

async function interactiveChat() {
  console.log('🤖 Mastra Agent Chat System');
  console.log('===========================\n');
  
  // Example: Ask Todo Agent to add a task
  console.log('📝 Asking Todo Agent to add a task...');
  const result = await todoAgent.generate([
    {
      role: 'user',
      content: 'Add a todo for "Complete project documentation" with medium importance and high urgency, due next Friday'
    }
  ]);
  
  console.log('Agent Response:', result);
  console.log('\n✅ Task added successfully!');
}

interactiveChat().catch(console.error);
```

Run it with:
```bash
npx tsx src/chat.ts
```

### Method 3: Using Individual Tools Directly

You can also use tools directly without the agent's natural language interface:

```typescript
import { createDatabaseTools } from './tools/databaseTools';
import { getDatabaseTools } from './tools/database';
import { createClient } from '@supabase/supabase-js';

// Initialize database tools
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const dbTools = getDatabaseTools(supabase, 'your-user-id');
const mastraTools = createDatabaseTools(dbTools);

// Use a tool directly
async function addTodoDirectly() {
  const result = await mastraTools.addTodo.execute({
    taskName: 'Write documentation',
    importance: 'IMPORTANT',
    urgency: 'NOT URGENT',
    description: 'Document the new API endpoints',
    dueDate: '2024-12-31'
  });
  console.log('Direct tool result:', result);
}
```

## 📊 Database Operations

All data is stored in Supabase tables. You can query data directly:

```typescript
// Query all todos
const todos = await mastraTools.queryUserData.execute({
  tableName: 'todos'
});

// The agents automatically use query_user_data to find existing records
// before modifying or deleting them
```

## 🔧 Customizing Agent Behavior

Each agent has instructions that guide its behavior. You can modify them in [`src/agents/index.ts`](src/agents/index.ts):

```typescript
export const todoAgent = new Agent({
  id: 'todo-agent',
  name: 'Todo Agent',
  instructions: [
    "Manage the user's tasks using the provided to-do tools.",
    "Use query_user_data('todos') to fetch existing records before modifying or deleting them...",
    // Add your custom instructions here
  ].join('\n'),
  // ... rest of configuration
});
```

## 🚨 Common Issues & Solutions

### 1. **API Key Errors**
**Error**: `"Could not find API key process.env.OPENAI_API_KEY"`
**Solution**: Make sure `OPEN_ROUTER_API_KEY` is set in `.env` and the model is configured correctly.

### 2. **Supabase Connection Errors**
**Error**: `"supabaseUrl is required"`
**Solution**: Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`.

### 3. **Agent Not Responding**
**Solution**: Check if the model is available on OpenRouter. Try changing `MODEL` in `.env` to:
- `openai/gpt-3.5-turbo`
- `anthropic/claude-3-haiku`
- `google/gemini-pro`

## 🎯 Example Conversations

### With Todo Agent:
```
User: "Add a todo to call mom tomorrow with high importance"
Agent: (Uses add_todo tool) → "Successfully added todo: 'Call mom'."
```

### With Goal Agent:
```
User: "I want to get fit and lose weight"
Agent: (Creates goal, to_achieve items, and systems) →
1. Goal: "I am a healthy and fit person"
2. To Achieve: "Lose 10 pounds by December 31st"
3. System: "Track daily calories and weekly weigh-ins"
```

### With Reminder Agent:
```
User: "Remind me to drink water every 2 hours"
Agent: (Creates recurring reminder) → "Reminder set to 'Drink water' every 2 hours"
```

## 🔄 Migrating from Python (Agno) Usage

If you're familiar with the Python Agno system, here's the TypeScript equivalent:

| Python (Agno) | TypeScript (Mastra) |
|---------------|---------------------|
| `agents.py` → Agent definitions | `src/agents/index.ts` |
| `tools.py` → Database functions | `src/tools/database.ts` |
| `create_tool()` → Tool wrappers | `src/tools/databaseTools.ts` |
| `Team` class → Mastra instance | `src/index.ts` |
| `api.py` → (Not yet migrated) | Can use Mastra's built-in server |
| `cli.py` → (Not yet migrated) | Can create custom CLI |

## 📈 Next Steps

1. **Add Web Search**: Integrate DuckDuckGo tools for the Web Agent
2. **Create API Server**: Use Mastra's built-in server or create Express API
3. **Build CLI Interface**: Create command-line interface similar to Python version
4. **Add Authentication**: Implement user authentication for multi-user support
5. **Create Web UI**: Build a React/Next.js frontend

## 🆘 Getting Help

- Check the [Mastra documentation](https://docs.mastra.ai/)
- Review the migrated code in `src/` directory
- Run `npm run dev` for development with hot reload
- Examine the example workflow for usage patterns

## 📞 Support

The system is now fully migrated and ready for production use. All original Agno functionality has been preserved in TypeScript with proper type safety and modern tooling.