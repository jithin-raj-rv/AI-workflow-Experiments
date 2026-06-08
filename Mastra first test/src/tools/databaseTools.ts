import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { DatabaseTools } from './database';

/**
 * Convert database tools into Mastra Tool objects.
 */
export function createDatabaseTools(dbTools: DatabaseTools) {
  const tools = {
    addTodo: createTool({
      id: 'add_todo',
      description: 'Adds a new to-do item for the user.',
      inputSchema: z.object({
        taskName: z.string().describe('Task title. NEVER leave blank.'),
        importance: z.enum(['IMPORTANT', 'NOT IMPORTANT']).optional().default('NOT IMPORTANT').describe('How valuable is this task?'),
        urgency: z.enum(['URGENT', 'NOT URGENT']).optional().default('NOT URGENT').describe('How time-sensitive is this task?'),
        description: z.string().optional().describe('Optional task description.'),
        dueDate: z.string().optional().describe('Due date in ISO format.'),
        isCompleted: z.boolean().optional().describe('Whether the task is completed.'),
      }),
      execute: async ({ taskName, importance = 'NOT IMPORTANT', urgency = 'NOT URGENT', description = '', dueDate, isCompleted = false }) => {
        return await dbTools.addTodo(taskName, importance, urgency, description, dueDate, isCompleted);
      },
    }),

    deleteTodo: createTool({
      id: 'delete_todo',
      description: 'Deletes a to-do item by its UUID.',
      inputSchema: z.object({
        taskId: z.string().describe('UUID of the todo to delete.'),
      }),
      execute: async ({ taskId }) => {
        return await dbTools.deleteTodo(taskId);
      },
    }),

    modifyTodo: createTool({
      id: 'modify_todo',
      description: 'Modifies a to-do item by its UUID. Only provide fields that need to be updated.',
      inputSchema: z.object({
        taskId: z.string().describe('UUID of the todo to modify.'),
        taskName: z.string().optional().describe('New task title.'),
        importance: z.enum(['IMPORTANT', 'NOT IMPORTANT']).optional(),
        urgency: z.enum(['URGENT', 'NOT URGENT']).optional(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        isCompleted: z.boolean().optional(),
      }),
      execute: async ({ taskId, ...updates }) => {
        return await dbTools.modifyTodo(taskId, updates);
      },
    }),

    addGoal: createTool({
      id: 'add_goal',
      description: 'Adds a new goal for the user.',
      inputSchema: z.object({
        title: z.string().describe('Goal title.'),
        description: z.string().optional().describe('Goal description.'),
        targetDate: z.string().optional().describe('Target date in ISO format.'),
        isCompleted: z.number().optional().describe('Completion status (0 = not started, 1 = completed).'),
        isImportant: z.boolean().optional().describe('Whether the goal is important.'),
        isUrgent: z.boolean().optional().describe('Whether the goal is urgent.'),
      }),
      execute: async ({ title, description = '', targetDate, isCompleted = 0, isImportant = false, isUrgent = false }) => {
        return await dbTools.addGoal(title, description, targetDate, isCompleted, isImportant, isUrgent);
      },
    }),

    deleteGoal: createTool({
      id: 'delete_goal',
      description: 'Deletes a goal by its UUID.',
      inputSchema: z.object({
        goalId: z.string().describe('UUID of the goal to delete.'),
      }),
      execute: async ({ goalId }) => {
        return await dbTools.deleteGoal(goalId);
      },
    }),

    modifyGoal: createTool({
      id: 'modify_goal',
      description: 'Modifies a goal by its UUID.',
      inputSchema: z.object({
        goalId: z.string().describe('UUID of the goal to modify.'),
        title: z.string().optional(),
        description: z.string().optional(),
        targetDate: z.string().optional(),
        isCompleted: z.number().optional(),
        isImportant: z.boolean().optional(),
        isUrgent: z.boolean().optional(),
      }),
      execute: async ({ goalId, ...updates }) => {
        return await dbTools.modifyGoal(goalId, updates);
      },
    }),

    addTimerPrompt: createTool({
      id: 'add_timer_prompt',
      description: 'Adds a new timer prompt for the user.',
      inputSchema: z.object({
        prompt: z.string().describe('The prompt to be sent at the scheduled time.'),
        scheduledTime: z.string().describe('Scheduled time in ISO format.'),
        recurringType: z.string().optional().describe('Recurring type: never, daily, weekly, monthly.'),
        weekdays: z.array(z.string()).optional().describe('Weekdays for recurring prompts (e.g., ["Monday", "Wednesday"]).'),
        response: z.string().optional().describe('Response to the prompt.'),
        sent: z.boolean().optional().describe('Whether the prompt has been sent.'),
      }),
      execute: async ({ prompt, scheduledTime, recurringType = 'never', weekdays, response = '', sent = false }) => {
        return await dbTools.addTimerPrompt(prompt, scheduledTime, recurringType, weekdays, response, sent);
      },
    }),

    deleteTimerPrompt: createTool({
      id: 'delete_timer_prompt',
      description: 'Deletes a timer prompt by its UUID.',
      inputSchema: z.object({
        promptId: z.string().describe('UUID of the timer prompt to delete.'),
      }),
      execute: async ({ promptId }) => {
        return await dbTools.deleteTimerPrompt(promptId);
      },
    }),

    modifyTimerPrompt: createTool({
      id: 'modify_timer_prompt',
      description: 'Modifies a timer prompt by its UUID.',
      inputSchema: z.object({
        promptId: z.string().describe('UUID of the timer prompt to modify.'),
        prompt: z.string().optional(),
        scheduledTime: z.string().optional(),
        recurringType: z.string().optional(),
        weekdays: z.array(z.string()).optional(),
        response: z.string().optional(),
        sent: z.boolean().optional(),
      }),
      execute: async ({ promptId, ...updates }) => {
        return await dbTools.modifyTimerPrompt(promptId, updates);
      },
    }),

    addFeedback: createTool({
      id: 'add_feedback',
      description: 'Adds new user feedback.',
      inputSchema: z.object({
        feedback: z.string().describe('Feedback text.'),
      }),
      execute: async ({ feedback }) => {
        return await dbTools.addFeedback(feedback);
      },
    }),

    deleteFeedback: createTool({
      id: 'delete_feedback',
      description: 'Deletes user feedback by its UUID.',
      inputSchema: z.object({
        feedbackId: z.string().describe('UUID of the feedback to delete.'),
      }),
      execute: async ({ feedbackId }) => {
        return await dbTools.deleteFeedback(feedbackId);
      },
    }),

    modifyFeedback: createTool({
      id: 'modify_feedback',
      description: 'Modifies user feedback by its UUID.',
      inputSchema: z.object({
        feedbackId: z.string().describe('UUID of the feedback to modify.'),
        feedback: z.string().describe('New feedback text.'),
      }),
      execute: async ({ feedbackId, feedback }) => {
        return await dbTools.modifyFeedback(feedbackId, feedback);
      },
    }),

    addSystemTool: createTool({
      id: 'add_system_tool',
      description: 'Adds a new system tool to a goal.',
      inputSchema: z.object({
        goalId: z.string().describe('UUID of the goal this system tool belongs to.'),
        title: z.string().describe('System tool title.'),
        description: z.string().optional().describe('System tool description.'),
        orderIndex: z.number().optional().describe('Order index for sorting.'),
      }),
      execute: async ({ goalId, title, description = '', orderIndex = 0 }) => {
        return await dbTools.addSystemTool(goalId, title, description, orderIndex);
      },
    }),

    deleteSystemTool: createTool({
      id: 'delete_system_tool',
      description: 'Deletes a system tool by its UUID.',
      inputSchema: z.object({
        stepId: z.string().describe('UUID of the system tool to delete.'),
      }),
      execute: async ({ stepId }) => {
        return await dbTools.deleteSystemTool(stepId);
      },
    }),

    modifySystemTool: createTool({
      id: 'modify_system_tool',
      description: 'Modifies a system tool by its UUID.',
      inputSchema: z.object({
        stepId: z.string().describe('UUID of the system tool to modify.'),
        title: z.string().optional(),
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
        orderIndex: z.number().optional(),
      }),
      execute: async ({ stepId, ...updates }) => {
        return await dbTools.modifySystemTool(stepId, updates);
      },
    }),

    addToAchieveTool: createTool({
      id: 'add_to_achieve_tool',
      description: 'Adds a new "To Achieve" tool to a goal.',
      inputSchema: z.object({
        goalId: z.string().describe('UUID of the goal this "To Achieve" tool belongs to.'),
        title: z.string().describe('"To Achieve" tool title.'),
        description: z.string().optional().describe('"To Achieve" tool description.'),
        orderIndex: z.number().optional().describe('Order index for sorting.'),
      }),
      execute: async ({ goalId, title, description = '', orderIndex = 0 }) => {
        return await dbTools.addToAchieveTool(goalId, title, description, orderIndex);
      },
    }),

    deleteToAchieveTool: createTool({
      id: 'delete_to_achieve_tool',
      description: 'Deletes a "To Achieve" tool by its UUID.',
      inputSchema: z.object({
        stepId: z.string().describe('UUID of the "To Achieve" tool to delete.'),
      }),
      execute: async ({ stepId }) => {
        return await dbTools.deleteToAchieveTool(stepId);
      },
    }),

    modifyToAchieveTool: createTool({
      id: 'modify_to_achieve_tool',
      description: 'Modifies a "To Achieve" tool by its UUID.',
      inputSchema: z.object({
        stepId: z.string().describe('UUID of the "To Achieve" tool to modify.'),
        title: z.string().optional(),
        description: z.string().optional(),
        isCompleted: z.boolean().optional(),
        orderIndex: z.number().optional(),
      }),
      execute: async ({ stepId, ...updates }) => {
        return await dbTools.modifyToAchieveTool(stepId, updates);
      },
    }),

    addReminder: createTool({
      id: 'add_reminder',
      description: 'Adds a new reminder.',
      inputSchema: z.object({
        title: z.string().describe('Reminder title.'),
        scheduledDate: z.string().describe('Scheduled date/time in ISO format.'),
        body: z.string().optional().describe('Reminder body text.'),
        reminderType: z.string().optional().describe('Reminder type: basic, question, multiple_choice.'),
        options: z.array(z.string()).optional().describe('Options for multiple-choice reminders.'),
        expectedAnswer: z.string().optional().describe('Expected answer for question-type reminders.'),
        aiPrompt: z.string().optional().describe('AI prompt for generating reminder content.'),
      }),
      execute: async ({ title, scheduledDate, body = '', reminderType = 'basic', options, expectedAnswer = '', aiPrompt = '' }) => {
        return await dbTools.addReminder(title, scheduledDate, body, reminderType, options, expectedAnswer, aiPrompt);
      },
    }),

    deleteReminder: createTool({
      id: 'delete_reminder',
      description: 'Deletes a reminder by its UUID.',
      inputSchema: z.object({
        reminderId: z.string().describe('UUID of the reminder to delete.'),
      }),
      execute: async ({ reminderId }) => {
        return await dbTools.deleteReminder(reminderId);
      },
    }),

    modifyReminder: createTool({
      id: 'modify_reminder',
      description: 'Modifies a reminder by its UUID.',
      inputSchema: z.object({
        reminderId: z.string().describe('UUID of the reminder to modify.'),
        title: z.string().optional(),
        body: z.string().optional(),
        scheduledDate: z.string().optional(),
        reminderType: z.string().optional(),
        options: z.array(z.string()).optional(),
        expectedAnswer: z.string().optional(),
        aiPrompt: z.string().optional(),
      }),
      execute: async ({ reminderId, ...updates }) => {
        return await dbTools.modifyReminder(reminderId, updates);
      },
    }),

    queryUserData: createTool({
      id: 'query_user_data',
      description: 'Fetches all records for a specific table (e.g., todos, goals) to let you read current data.',
      inputSchema: z.object({
        tableName: z.string().describe('Name of the table to query (e.g., todos, goals, timer_prompts).'),
      }),
      execute: async ({ tableName }) => {
        return await dbTools.queryUserData(tableName);
      },
    }),
  };

  return tools;
}

export type DatabaseMastraTools = ReturnType<typeof createDatabaseTools>;