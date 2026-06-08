import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { queryUserDataTool } from '../tools/query-user-data';
import { addTodoTool, deleteTodoTool, modifyTodoTool } from '../tools/todos';
import { addGoalTool, deleteGoalTool, modifyGoalTool } from '../tools/goals';
import { addTimerPromptTool, deleteTimerPromptTool, modifyTimerPromptTool } from '../tools/timer-prompts';
import { addFeedbackTool, deleteFeedbackTool, modifyFeedbackTool } from '../tools/feedback';
import { addSystemTool, deleteSystemTool, modifySystemTool } from '../tools/systems';
import { addToAchieveTool, deleteToAchieveTool, modifyToAchieveTool } from '../tools/to-achieves';
import { addReminderTool, deleteReminderTool, modifyReminderTool } from '../tools/reminders';

export const testQueryAgent = new Agent({
  id: 'test-query-agent',
  name: 'Test Query Agent',
  instructions: `You are a test agent designed to manage user data across all database tables.

You have access to the following CRUD tools for each entity:

Todos: addTodoTool, deleteTodoTool, modifyTodoTool
Goals: addGoalTool, deleteGoalTool, modifyGoalTool
Timer Prompts: addTimerPromptTool, deleteTimerPromptTool, modifyTimerPromptTool
Feedback: addFeedbackTool, deleteFeedbackTool, modifyFeedbackTool
Systems: addSystemTool, deleteSystemTool, modifySystemTool
To Achieves: addToAchieveTool, deleteToAchieveTool, modifyToAchieveTool
Reminders: addReminderTool, deleteReminderTool, modifyReminderTool
Query: queryUserDataTool (fetch all records from any table)

When responding:
- Use the appropriate tool based on what the user wants to do (add, delete, modify, or query)
- For queryUserDataTool, just provide the table name — user authentication is handled automatically
- Present the results clearly, including the number of records found and their contents
- If an operation returns an error, display it to the user for debugging
- Keep responses concise but informative`,
  model: 'openrouter/openai/gpt-oss-20b:free',
  tools: {
    queryUserDataTool,
    addTodoTool,
    deleteTodoTool,
    modifyTodoTool,
    addGoalTool,
    deleteGoalTool,
    modifyGoalTool,
    addTimerPromptTool,
    deleteTimerPromptTool,
    modifyTimerPromptTool,
    addFeedbackTool,
    deleteFeedbackTool,
    modifyFeedbackTool,
    addSystemTool,
    deleteSystemTool,
    modifySystemTool,
    addToAchieveTool,
    deleteToAchieveTool,
    modifyToAchieveTool,
    addReminderTool,
    deleteReminderTool,
    modifyReminderTool,
  },
  memory: new Memory(),
});
