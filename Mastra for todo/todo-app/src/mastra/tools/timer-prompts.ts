import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addTimerPromptTool = createTool({
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
  execute: async ({ prompt, scheduledTime, recurringType = 'never', weekdays = [], response = '', sent = false }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data: any = {
      user_id: userId,
      prompt,
      scheduled_time: scheduledTime,
      recurring_type: recurringType,
      weekdays,
      response,
      sent,
    };

    try {
      const { error } = await supabase.from('timer_prompts').insert(data);
      if (error) throw error;
      return `Successfully added timer prompt: '${prompt}'.`;
    } catch (e: any) {
      return `Error adding timer prompt: ${e.message}`;
    }
  },
});

export const deleteTimerPromptTool = createTool({
  id: 'delete_timer_prompt',
  description: 'Deletes a timer prompt by its UUID.',
  inputSchema: z.object({
    promptId: z.string().describe('UUID of the timer prompt to delete.'),
  }),
  execute: async ({ promptId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('timer_prompts').delete().eq('id', promptId);
      if (error) throw error;
      return `Successfully deleted timer prompt: ${promptId}.`;
    } catch (e: any) {
      return `Error deleting timer prompt: ${e.message}`;
    }
  },
});

export const modifyTimerPromptTool = createTool({
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
  execute: async ({ promptId, prompt, scheduledTime, recurringType, weekdays, response, sent }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const data: any = {};
    if (prompt !== undefined) data.prompt = prompt;
    if (scheduledTime !== undefined) data.scheduled_time = scheduledTime;
    if (recurringType !== undefined) data.recurring_type = recurringType;
    if (weekdays !== undefined) data.weekdays = weekdays;
    if (response !== undefined) data.response = response;
    if (sent !== undefined) data.sent = sent;
    if (Object.keys(data).length === 0) return 'No modifications provided.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('timer_prompts').update(data).eq('id', promptId);
      if (error) throw error;
      return `Successfully modified timer prompt: ${promptId}.`;
    } catch (e: any) {
      return `Error modifying timer prompt: ${e.message}`;
    }
  },
});