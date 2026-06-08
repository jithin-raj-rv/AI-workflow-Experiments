import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';
import { getUserIdFromToken } from '../supabase/supabase-utils';

export const addReminderTool = createTool({
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
  execute: async ({ title, scheduledDate, body = '', reminderType = 'basic', options = [], expectedAnswer = '', aiPrompt = '' }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const supabase = getAuthenticatedClient(token);
    const userId = getUserIdFromToken(token);
    const data: any = {
      user_id: userId,
      title,
      body,
      scheduled_date: scheduledDate,
      payload: title,
      reminder_type: reminderType,
      options: options.length ? JSON.stringify(options) : null,
      expected_answer: expectedAnswer,
      ai_prompt: aiPrompt,
    };

    try {
      const { error } = await supabase.from('reminders').insert(data);
      if (error) throw error;
      return `Successfully added reminder: '${title}'.`;
    } catch (e: any) {
      return `Error adding reminder: ${e.message}`;
    }
  },
});

export const deleteReminderTool = createTool({
  id: 'delete_reminder',
  description: 'Deletes a reminder by its UUID.',
  inputSchema: z.object({
    reminderId: z.string().describe('UUID of the reminder to delete.'),
  }),
  execute: async ({ reminderId }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('reminders').delete().eq('id', reminderId);
      if (error) throw error;
      return `Successfully deleted reminder: ${reminderId}.`;
    } catch (e: any) {
      return `Error deleting reminder: ${e.message}`;
    }
  },
});

export const modifyReminderTool = createTool({
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
  execute: async ({ reminderId, title, body, scheduledDate, reminderType, options, expectedAnswer, aiPrompt }, context) => {
    checkClient();
    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;
    if (!token) return 'Not authenticated. Please sign in first.';

    const data: any = {};
    if (title !== undefined) {
      data.title = title;
      data.payload = title;
    }
    if (body !== undefined) data.body = body;
    if (scheduledDate !== undefined) data.scheduled_date = scheduledDate;
    if (reminderType !== undefined) data.reminder_type = reminderType;
    if (options !== undefined) data.options = JSON.stringify(options);
    if (expectedAnswer !== undefined) data.expected_answer = expectedAnswer;
    if (aiPrompt !== undefined) data.ai_prompt = aiPrompt;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    data.updated_at = new Date().toISOString();

    try {
      const supabase = getAuthenticatedClient(token);
      const { error } = await supabase.from('reminders').update(data).eq('id', reminderId);
      if (error) throw error;
      return `Successfully modified reminder: ${reminderId}.`;
    } catch (e: any) {
      return `Error modifying reminder: ${e.message}`;
    }
  },
});