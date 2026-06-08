import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addTodoTool = createTool({
  id: 'add_todo',
  description:
    'Adds a new to-do item for the user. Returns success or error message.',
  inputSchema: z.object({
    taskName: z.string().describe('Task title. NEVER leave blank.'),
    importance: z
      .enum(['IMPORTANT', 'NOT IMPORTANT'])
      .optional()
      .default('NOT IMPORTANT')
      .describe('How valuable is this task?'),
    urgency: z
      .enum(['URGENT', 'NOT URGENT'])
      .optional()
      .default('NOT URGENT')
      .describe('How time-sensitive is this task?'),
    description: z.string().optional().describe('Optional task description.'),
    dueDate: z.string().optional().describe('Due date in ISO format.'),
    isCompleted: z.boolean().optional().default(false).describe('Whether the task is completed.'),
  }),
  execute: async ({ taskName, importance = 'NOT IMPORTANT', urgency = 'NOT URGENT', description = '', dueDate, isCompleted = false }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data: any = {
      user_id: userId,
      task_name: taskName,
      importance,
      urgency,
      description,
      is_completed: isCompleted,
    };
    if (dueDate) data.due_date = dueDate;

    try {
      const { error } = await supabase.from('todos').insert(data);
      if (error) throw error;
      return `Successfully added todo: '${taskName}'.`;
    } catch (e: any) {
      return `Error adding todo: ${e.message}`;
    }
  },
});

export const deleteTodoTool = createTool({
  id: 'delete_todo',
  description: 'Deletes a to-do item by its UUID.',
  inputSchema: z.object({
    taskId: z.string().describe('UUID of the todo to delete.'),
  }),
  execute: async ({ taskId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('todos').delete().eq('id', taskId);
      if (error) throw error;
      return `Successfully deleted todo: ${taskId}.`;
    } catch (e: any) {
      return `Error deleting todo: ${e.message}`;
    }
  },
});

export const modifyTodoTool = createTool({
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
  execute: async ({ taskId, taskName, importance, urgency, description, dueDate, isCompleted }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const data: any = {};
    if (taskName !== undefined) data.task_name = taskName;
    if (importance !== undefined) data.importance = importance;
    if (urgency !== undefined) data.urgency = urgency;
    if (description !== undefined) data.description = description;
    if (dueDate !== undefined) data.due_date = dueDate;
    if (isCompleted !== undefined) data.is_completed = isCompleted;
    if (Object.keys(data).length === 0) return 'No modifications provided.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('todos').update(data).eq('id', taskId);
      if (error) throw error;
      return `Successfully modified todo: ${taskId}.`;
    } catch (e: any) {
      return `Error modifying todo: ${e.message}`;
    }
  },
});