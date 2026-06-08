import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addSystemTool = createTool({
  id: 'add_system_tool',
  description: 'Adds a new system tool to a goal.',
  inputSchema: z.object({
    goalId: z.string().describe('UUID of the goal this system tool belongs to.'),
    title: z.string().describe('System tool title.'),
    description: z.string().optional().describe('System tool description.'),
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
      system_name: title,
      is_completed: false,
      priority_order: orderIndex,
    };

    try {
      const { error } = await supabase.from('systems').insert(data);
      if (error) throw error;
      return `Successfully added system tool: '${title}'.`;
    } catch (e: any) {
      return `Error adding system tool: ${e.message}`;
    }
  },
});

export const deleteSystemTool = createTool({
  id: 'delete_system_tool',
  description: 'Deletes a system tool by its UUID.',
  inputSchema: z.object({
    stepId: z.string().describe('UUID of the system tool to delete.'),
  }),
  execute: async ({ stepId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('systems').delete().eq('id', stepId);
      if (error) throw error;
      return `Successfully deleted system tool: ${stepId}.`;
    } catch (e: any) {
      return `Error deleting system tool: ${e.message}`;
    }
  },
});

export const modifySystemTool = createTool({
  id: 'modify_system_tool',
  description: 'Modifies a system tool by its UUID.',
  inputSchema: z.object({
    stepId: z.string().describe('UUID of the system tool to modify.'),
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
    if (title !== undefined) data.system_name = title;
    if (isCompleted !== undefined) data.is_completed = isCompleted;
    if (orderIndex !== undefined) data.priority_order = orderIndex;
    if (Object.keys(data).length === 0) return 'No modifications provided.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('systems').update(data).eq('id', stepId);
      if (error) throw error;
      return `Successfully modified system tool: ${stepId}.`;
    } catch (e: any) {
      return `Error modifying system tool: ${e.message}`;
    }
  },
});