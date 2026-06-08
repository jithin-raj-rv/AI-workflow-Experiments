import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addToAchieveTool = createTool({
  id: 'add_to_achieve_tool',
  description: 'Adds a new "To Achieve" tool to a goal.',
  inputSchema: z.object({
    goalId: z.string().describe('UUID of the goal this "To Achieve" tool belongs to.'),
    title: z.string().describe('"To Achieve" tool title.'),
    description: z.string().optional().describe('"To Achieve" tool description.'),
    orderIndex: z.number().optional().describe('Order index for sorting.'),
  }),
  execute: async ({ goalId, title, description = '', orderIndex = 0 }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data: any = {
      user_id: userId,
      goal_id: goalId,
      title,
      is_completed: false,
      priority_order: orderIndex,
    };

    try {
      const { error } = await supabase.from('to_achieves').insert(data);
      if (error) throw error;
      return `Successfully added To Achieve tool: '${title}'.`;
    } catch (e: any) {
      return `Error adding To Achieve tool: ${e.message}`;
    }
  },
});

export const deleteToAchieveTool = createTool({
  id: 'delete_to_achieve_tool',
  description: 'Deletes a "To Achieve" tool by its UUID.',
  inputSchema: z.object({
    stepId: z.string().describe('UUID of the "To Achieve" tool to delete.'),
  }),
  execute: async ({ stepId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('to_achieves').delete().eq('id', stepId);
      if (error) throw error;
      return `Successfully deleted To Achieve tool: ${stepId}.`;
    } catch (e: any) {
      return `Error deleting To Achieve tool: ${e.message}`;
    }
  },
});

export const modifyToAchieveTool = createTool({
  id: 'modify_to_achieve_tool',
  description: 'Modifies a "To Achieve" tool by its UUID.',
  inputSchema: z.object({
    stepId: z.string().describe('UUID of the "To Achieve" tool to modify.'),
    title: z.string().optional(),
    description: z.string().optional(),
    isCompleted: z.boolean().optional(),
    orderIndex: z.number().optional(),
  }),
  execute: async ({ stepId, title, description, isCompleted, orderIndex }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (isCompleted !== undefined) data.is_completed = isCompleted;
    if (orderIndex !== undefined) data.priority_order = orderIndex;
    if (Object.keys(data).length === 0) return 'No modifications provided.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('to_achieves').update(data).eq('id', stepId);
      if (error) throw error;
      return `Successfully modified To Achieve tool: ${stepId}.`;
    } catch (e: any) {
      return `Error modifying To Achieve tool: ${e.message}`;
    }
  },
});