import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { createClient } from '@supabase/supabase-js';
import { getDatabaseTools } from '../tools/database';
import { createDatabaseTools } from '../tools/databaseTools';
import { Memory } from '@mastra/memory';
import { z } from 'zod';

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// For now, we assume a default user ID (could be passed dynamically)
const DEFAULT_USER_ID = 'default-user';

// Get database tools
const dbTools = getDatabaseTools(supabaseClient, DEFAULT_USER_ID);
const mastraTools = createDatabaseTools(dbTools);

// Simplified model configuration using OpenRouter SDK pattern
const defaultModel = 'openrouter/openai/gpt-oss-120b:free';

// Todo Agent
export const todoAgent = new Agent({
  id: 'todo-agent',
  name: 'Todo Agent',
  instructions: [
    "Manage the user's tasks using the provided to-do tools.",
    "Use query_user_data('todos') to fetch existing records before modifying or deleting them if you need to find task IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_todo: mastraTools.addTodo,
    delete_todo: mastraTools.deleteTodo,
    modify_todo: mastraTools.modifyTodo,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});

// Goal Agent
export const goalAgent = new Agent({
  id: 'goal-agent',
  name: 'Goal Agent',
  instructions: [
    "Manage the user's goals, 'To Achieve' items, and systems as interconnected parts of a unified goal ecosystem.",
    "CRITICAL DISTINCTION: GOALS are identity-based or broad visions, while 'To Achieve' items are SMART goals (specific outcomes with deadlines).",
    "When users provide input, separate their identity/vision (the Goal) from the specific milestones (the To Achieve items).",
    "  - GOALS: Identity-based, continuous, or overarching vision (e.g., 'I am a healthy person', 'I am a successful writer'). Created via add_goal.",
    "  - TO ACHIEVE: SMART goals (Specific, Measurable, Attainable, Relevant, Timebound). These are specific milestones to support the Goal. Created via add_to_achieve_tool.",
    "  - SYSTEMS: Tracking mechanisms, measurement processes, recurring habits (e.g., 'measure body fat monthly', 'track daily steps'). Created via add_system_tool.",
    "TRANSFORMATIONS from raw input:",
    "  - 'I want to get fit' → Goal: 'I am a healthy and fit person' | To Achieve: 'I will lose 10 pounds and achieve visible six-pack abs by December 31st'",
    "  - 'I want to grow my business' → Goal: 'I run a highly successful business' | To Achieve: 'I will increase monthly revenue from $5,000 to $6,000 by November 30th'",
    "Always create broad Goals as identity statements, and specific To Achieve items as SMART goals.",
    "Use query_user_data('goals') to fetch existing records before modifying or deleting them if you need to find goal IDs.",
    "Use query_user_data('to_achieves') to fetch existing 'To Achieve' tools before modifying or deleting them if you need to find tool IDs.",
    "Use query_user_data('systems') to fetch existing systems before modifying or deleting them if you need to find system IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_goal: mastraTools.addGoal,
    delete_goal: mastraTools.deleteGoal,
    modify_goal: mastraTools.modifyGoal,
    add_to_achieve_tool: mastraTools.addToAchieveTool,
    delete_to_achieve_tool: mastraTools.deleteToAchieveTool,
    modify_to_achieve_tool: mastraTools.modifyToAchieveTool,
    add_system_tool: mastraTools.addSystemTool,
    delete_system_tool: mastraTools.deleteSystemTool,
    modify_system_tool: mastraTools.modifySystemTool,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});

// Web Agent (requires DuckDuckGo tools) - placeholder
export const webAgent = new Agent({
  id: 'web-agent',
  name: 'Web Agent',
  instructions: "Use DuckDuckGo to answer questions requiring external knowledge or current events.",
  model: defaultModel,
  tools: {}, // TODO: integrate DuckDuckGoTools
  memory: new Memory(),
});

// Timer Prompt Agent
export const timerPromptAgent = new Agent({
  id: 'timer-prompt-agent',
  name: 'Timer Prompt Agent',
  instructions: [
    "Manage the user's timer prompts to automatically process prompts at a specified time in the future.",
    "Use timer prompts to perform future actions, such as analyzing user information, or executing a task automatically by sending a prompt to the AI when the time arrives.",
    "Use query_user_data('timer_prompts') to fetch existing records before modifying or deleting them if you need to find timer prompt IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_timer_prompt: mastraTools.addTimerPrompt,
    delete_timer_prompt: mastraTools.deleteTimerPrompt,
    modify_timer_prompt: mastraTools.modifyTimerPrompt,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});

// Feedback Agent
export const feedbackAgent = new Agent({
  id: 'feedback-agent',
  name: 'Feedback Agent',
  instructions: [
    "Manage the user's feedback using the provided tools.",
    "Use query_user_data('user_feedback') to fetch existing records before modifying or deleting them if you need to find feedback IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_feedback: mastraTools.addFeedback,
    delete_feedback: mastraTools.deleteFeedback,
    modify_feedback: mastraTools.modifyFeedback,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});

// System Tools Agent
export const systemToolsAgent = new Agent({
  id: 'system-tools-agent',
  name: 'System Tools Agent',
  instructions: [
    "Manage the user's system tools using the provided tools.",
    "Use query_user_data('goals') to fetch id from existing goals, in order to put in goal id field.",
    "Use query_user_data('systems') to fetch existing records before modifying or deleting them if you need to find system tool IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_system_tool: mastraTools.addSystemTool,
    delete_system_tool: mastraTools.deleteSystemTool,
    modify_system_tool: mastraTools.modifySystemTool,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});

// Reminder Agent
export const reminderAgent = new Agent({
  id: 'reminder-agent',
  name: 'Reminder Agent',
  instructions: [
    "Manage the user's reminders using the provided tools.",
    "Use query_user_data('reminders') to fetch existing records before modifying or deleting them if you need to find reminder IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    add_reminder: mastraTools.addReminder,
    delete_reminder: mastraTools.deleteReminder,
    modify_reminder: mastraTools.modifyReminder,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory(),
});




async function runAgentPrompt(agent: Agent, prompt: string) {
  const result = await agent.generate(prompt);
  return typeof result === 'string' ? result : result.text ?? JSON.stringify(result);
}

const delegateTaskTool = createTool({
  id: 'delegate_task',
  description: 'Delegates specific tasks to specialized sub-agents.',
  inputSchema: z.object({
    agentName: z.enum([
      'todoAgent',
      'goalAgent',
      'webAgent',
      'timerPromptAgent',
      'feedbackAgent',
      'systemToolsAgent',
      'reminderAgent',
    ]),
    prompt: z.string(),
  }),
  execute: async (inputData) => {
    const { agentName, prompt } = inputData;
    const map: Record<string, Agent> = {
      todoAgent,
      goalAgent,
      webAgent,
      timerPromptAgent,
      feedbackAgent,
      systemToolsAgent,
      reminderAgent,
    };
    const selectedAgent = map[agentName];
    if (!selectedAgent) {
      throw new Error(`Unknown sub-agent: ${agentName}`);
    }
    return await runAgentPrompt(selectedAgent, prompt);
  },
});

export const coordinatorAgent = new Agent({
  id: 'coordinator-agent',
  name: 'Coordinator Agent',
  instructions: [
    "You are the coordinator of a suite of specialized agents.",
    "Interpret the user's request and delegate to the correct child agent using the delegate_task tool.",
    "RULES:",
    "1. Do not perform tasks yourself. Always delegate.",
    "2. When the user asks for multiple actions, invoke the delegate_task tool multiple times in a sequence.",
    "3. Use query_user_data before deleting or modifying records when you need to resolve IDs.",
  ].join('\n'),
  model: defaultModel,
  tools: {
    delegate_task: delegateTaskTool,
    query_user_data: mastraTools.queryUserData,
  },
  memory: new Memory({
    options: {
      observationalMemory: {
        model: defaultModel,
      },
    },
  }),
});


// Export all agents
export const agents = {
  todoAgent,
  goalAgent,
  webAgent,
  timerPromptAgent,
  feedbackAgent,
  systemToolsAgent,
  reminderAgent,
  coordinatorAgent,
};