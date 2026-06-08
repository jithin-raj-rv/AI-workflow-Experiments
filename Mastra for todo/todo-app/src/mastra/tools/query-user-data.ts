import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { MASTRA_AUTH_TOKEN_KEY } from '@mastra/core/request-context';

/**
 * Mastra tool that fetches all records for one or more tables (e.g., todos, goals)
 * for the currently authenticated user.
 *
 * Authentication is automatic:
 * - The JWT token is extracted from the execution context (set by MastraAuthSupabase)
 * - An authenticated Supabase client is created with the user's token
 * - RLS policies on the table (using auth.uid()) filter results to the current user
 *
 * Queries are run in parallel. If a particular table query fails, the error message
 * is returned for that table instead of failing the whole operation.
 */
export const queryUserDataTool = createTool({
  id: 'query_user_data',
  description:
    'Fetches all records for one or more tables (e.g., todos, goals, timer_prompts) for the currently authenticated user. Accepts an array of table names and queries them all in parallel. Returns a JSON object keyed by table name with the results.',
  inputSchema: z.object({
    tableNames: z
      .array(z.string())
      .min(1)
      .describe('Array of table names to query (e.g., ["todos", "goals", "timer_prompts"]).'),
  }),
  execute: async ({ tableNames }, context) => {
    checkClient();

    const token = context?.requestContext?.get(MASTRA_AUTH_TOKEN_KEY) as string | undefined;

    if (!token) {
      return JSON.stringify({ error: 'Not authenticated. Please sign in first.' });
    }

    try {
      const supabase = getAuthenticatedClient(token);

      // Query all tables in parallel
      const results = await Promise.allSettled(
        tableNames.map(async (tableName) => {
          const { data, error } = await supabase.from(tableName).select('*');
          if (error) throw error;
          return data;
        })
      );

      // Build the response object, keyed by table name
      const response: Record<string, any> = {};
      for (let i = 0; i < tableNames.length; i++) {
        const tableName = tableNames[i];
        const result = results[i];
        if (result.status === 'fulfilled') {
          response[tableName] = result.value;
        } else {
          response[tableName] = `Error querying ${tableName}: ${result.reason?.message || result.reason}`;
        }
      }

      return JSON.stringify(response);
    } catch (e: any) {
      return JSON.stringify({ error: `Unexpected error: ${e.message}` });
    }
  },
});