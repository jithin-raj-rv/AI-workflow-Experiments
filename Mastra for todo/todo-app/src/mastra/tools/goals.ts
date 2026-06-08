import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addGoalTool = createTool({
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
  execute: async ({ title, description = '', targetDate, isCompleted = 0, isImportant = false, isUrgent = false }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data: any = {
      user_id: userId,
      title,
      description,
      is_completed: isCompleted,
      importance: isImportant ? 'IMPORTANT' : 'NOT IMPORTANT',
      urgency: isUrgent ? 'URGENT' : 'NOT URGENT',
    };
    if (targetDate) data.target_date = targetDate;

    try {
      const { data: insertedData, error } = await supabase.from('goals').insert(data).select('id').single();
      if (error) throw error;
      return JSON.stringify({ id: insertedData.id, message: `Successfully added goal: '${title}'.` });
    } catch (e: any) {
      return JSON.stringify({ id: null, message: `Error adding goal: ${e.message}` });
    }
  },
});

export const deleteGoalTool = createTool({
  id: 'delete_goal',
  description: 'Deletes a goal by its UUID.',
  inputSchema: z.object({
    goalId: z.string().describe('UUID of the goal to delete.'),
  }),
  execute: async ({ goalId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (error) throw error;
      return `Successfully deleted goal: ${goalId}.`;
    } catch (e: any) {
      return `Error deleting goal: ${e.message}`;
    }
  },
});

export const modifyGoalTool = createTool({
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
  execute: async ({ goalId, title, description, targetDate, isCompleted, isImportant, isUrgent }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (targetDate !== undefined) data.target_date = targetDate;
    if (isCompleted !== undefined) data.is_completed = isCompleted;
    if (isImportant !== undefined) data.importance = isImportant ? 'IMPORTANT' : 'NOT IMPORTANT';
    if (isUrgent !== undefined) data.urgency = isUrgent ? 'URGENT' : 'NOT URGENT';
    if (Object.keys(data).length === 0) return 'No modifications provided.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('goals').update(data).eq('id', goalId);
      if (error) throw error;
      return `Successfully modified goal: ${goalId}.`;
    } catch (e: any) {
      return `Error modifying goal: ${e.message}`;
    }
  },
});