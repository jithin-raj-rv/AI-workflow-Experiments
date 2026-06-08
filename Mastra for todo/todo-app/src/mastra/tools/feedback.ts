import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addFeedbackTool = createTool({
  id: 'add_feedback',
  description: 'Adds new user feedback.',
  inputSchema: z.object({
    feedback: z.string().describe('Feedback text.'),
  }),
  execute: async ({ feedback }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data = { user_id: userId, feedback };

    try {
      const { error } = await supabase.from('user_feedback').insert(data);
      if (error) throw error;
      return 'Successfully added feedback.';
    } catch (e: any) {
      return `Error adding feedback: ${e.message}`;
    }
  },
});

export const deleteFeedbackTool = createTool({
  id: 'delete_feedback',
  description: 'Deletes user feedback by its UUID.',
  inputSchema: z.object({
    feedbackId: z.string().describe('UUID of the feedback to delete.'),
  }),
  execute: async ({ feedbackId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('user_feedback').delete().eq('id', feedbackId);
      if (error) throw error;
      return `Successfully deleted feedback: ${feedbackId}.`;
    } catch (e: any) {
      return `Error deleting feedback: ${e.message}`;
    }
  },
});

export const modifyFeedbackTool = createTool({
  id: 'modify_feedback',
  description: 'Modifies user feedback by its UUID.',
  inputSchema: z.object({
    feedbackId: z.string().describe('UUID of the feedback to modify.'),
    feedback: z.string().describe('New feedback text.'),
  }),
  execute: async ({ feedbackId, feedback }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('user_feedback').update({ feedback }).eq('id', feedbackId);
      if (error) throw error;
      return `Successfully modified feedback: ${feedbackId}.`;
    } catch (e: any) {
      return `Error modifying feedback: ${e.message}`;
    }
  },
});