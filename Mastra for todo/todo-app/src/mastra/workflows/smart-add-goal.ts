import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { checkClient, getAuthenticatedClient } from '../supabase/supabase-client';
import { getUserIdFromToken } from '../supabase/supabase-utils';

const systemSchema = z.object({
  title: z.string().describe('Title of the system step.'),
  description: z.string().optional().describe('Optional description of the system step.'),
  orderIndex: z.number().optional().describe('Order index for sorting.'),
});

const toAchieveSchema = z.object({
  title: z.string().describe('Title of the "to achieve" milestone.'),
  description: z.string().optional().describe('Optional description.'),
  orderIndex: z.number().optional().describe('Order index for sorting.'),
});

const goalInputSchema = z.object({
  title: z.string().describe('Goal title.'),
  description: z.string().optional().describe('Goal description.'),
  targetDate: z.string().optional().describe('Target date in ISO format.'),
  isImportant: z.boolean().optional().describe('Whether the goal is important.'),
  isUrgent: z.boolean().optional().describe('Whether the goal is urgent.'),
  systems: z.array(systemSchema).optional().describe('System steps to attach to the goal.'),
  toAchieves: z.array(toAchieveSchema).optional().describe('To-achieve milestones to attach to the goal.'),
  existingGoalId: z.string().optional().describe('If provided, modifies this existing goal instead of creating a new one.'),
  token: z.string().optional().describe('Supabase JWT token for authenticated requests.'),
});

// Shared context that flows through all steps
const contextSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  targetDate: z.string().optional(),
  isImportant: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  systems: z.array(systemSchema).default([]),
  toAchieves: z.array(toAchieveSchema).default([]),
  existingGoalId: z.string().optional(),
  isDuplicate: z.boolean().default(false),
  duplicateGoalTitle: z.string().optional(),
  token: z.string().optional(),
  userId: z.string().optional(),
});

const checkForDuplicates = createStep({
  id: 'check-for-duplicates',
  description: 'Passes through the duplicate check result from the AI agent.',
  inputSchema: goalInputSchema,
  outputSchema: contextSchema,
  execute: async ({ inputData }) => {
    if (!inputData) throw new Error('Input data not found');

    const { title, description = '', targetDate, isImportant = false, isUrgent = false, systems = [], toAchieves = [], existingGoalId, token } = inputData;

    let userId: string | undefined;
    if (token) {
      try { userId = getUserIdFromToken(token); } catch { /* token invalid */ }
    }

    if (existingGoalId) {
      return {
        title,
        description,
        targetDate,
        isImportant,
        isUrgent,
        systems,
        toAchieves,
        existingGoalId,
        isDuplicate: true,
        duplicateGoalTitle: title,
        token,
        userId,
      };
    }

    return {
      title,
      description,
      targetDate,
      isImportant,
      isUrgent,
      systems,
      toAchieves,
      isDuplicate: false,
      token,
      userId,
    };
  },
});

const executeGoalAction = createStep({
  id: 'execute-goal-action',
  description: 'Creates a new goal or modifies an existing one using authenticated Supabase client.',
  inputSchema: contextSchema,
  outputSchema: contextSchema.extend({
    goalId: z.string(),
    action: z.enum(['created', 'modified']),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) throw new Error('Input data not found');

    const { title, description, targetDate, isImportant, isUrgent, systems, toAchieves, existingGoalId, isDuplicate, token, userId } = inputData;

    checkClient();
    if (!token) throw new Error('Authentication token required. Please sign in first.');
    const supabase = getAuthenticatedClient(token);

    if (isDuplicate && existingGoalId) {
      // Modify existing goal
      const updateData: Record<string, any> = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (targetDate) updateData.target_date = targetDate;
      if (isImportant !== undefined) updateData.importance = isImportant ? 'IMPORTANT' : 'NOT IMPORTANT';
      if (isUrgent !== undefined) updateData.urgency = isUrgent ? 'URGENT' : 'NOT URGENT';

      const { error } = await supabase.from('goals').update(updateData).eq('id', existingGoalId);
      if (error) throw new Error(`Failed to modify goal: ${error.message}`);

      return {
        ...inputData,
        goalId: existingGoalId,
        action: 'modified' as const,
      };
    } else {
      // Create new goal
      const insertData: Record<string, any> = {
        user_id: userId,
        title,
        description: description || '',
        is_completed: 0,
        importance: isImportant ? 'IMPORTANT' : 'NOT IMPORTANT',
        urgency: isUrgent ? 'URGENT' : 'NOT URGENT',
      };
      if (targetDate) insertData.target_date = targetDate;

      const { data: inserted, error } = await supabase
        .from('goals')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw new Error(`Failed to create goal: ${error.message}`);

      return {
        ...inputData,
        goalId: inserted.id,
        action: 'created' as const,
      };
    }
  },
});

const manageSubItems = createStep({
  id: 'manage-sub-items',
  description: 'Adds systems and to-achieves to the goal, skipping duplicates if modifying.',
  inputSchema: contextSchema.extend({
    goalId: z.string(),
    action: z.enum(['created', 'modified']),
  }),
  outputSchema: z.object({
    goalId: z.string(),
    action: z.enum(['created', 'modified']),
    message: z.string(),
    systemsAdded: z.number(),
    toAchievesAdded: z.number(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) throw new Error('Input data not found');

    const { goalId, action, title, systems, toAchieves, isDuplicate, token, userId } = inputData;

    if (!token) throw new Error('Authentication token required. Please sign in first.');
    const supabase = getAuthenticatedClient(token);

    let systemsAdded = 0;
    let toAchievesAdded = 0;

    // If modifying, fetch existing sub-items to avoid duplicates
    const existingSystems: any[] = [];
    const existingToAchieves: any[] = [];

    if (isDuplicate) {
      const [sysRes, taRes] = await Promise.all([
        supabase.from('systems').select('system_name').eq('goal_id', goalId),
        supabase.from('to_achieves').select('title').eq('goal_id', goalId),
      ]);
      if (sysRes.data) existingSystems.push(...sysRes.data);
      if (taRes.data) existingToAchieves.push(...taRes.data);
    }

    // Insert systems that don't already exist
    const existingSysNames = new Set(existingSystems.map((s: any) => s.system_name?.toLowerCase().trim()));
    for (const sys of systems) {
      if (!existingSysNames.has(sys.title.toLowerCase().trim())) {
        const { error } = await supabase.from('systems').insert({
          user_id: userId,
          goal_id: goalId,
          system_name: sys.title,
          is_completed: false,
          priority_order: sys.orderIndex ?? systemsAdded,
        });
        if (!error) systemsAdded++;
      }
    }

    // Insert to-achieves that don't already exist
    const existingTANames = new Set(existingToAchieves.map((t: any) => t.title?.toLowerCase().trim()));
    for (const ta of toAchieves) {
      if (!existingTANames.has(ta.title.toLowerCase().trim())) {
        const { error } = await supabase.from('to_achieves').insert({
          user_id: userId,
          goal_id: goalId,
          title: ta.title,
          is_completed: false,
          priority_order: ta.orderIndex ?? toAchievesAdded,
        });
        if (!error) toAchievesAdded++;
      }
    }

    const actionLabel = action === 'created' ? 'created' : 'updated';
    let message = `Goal '${title}' ${actionLabel} successfully (ID: ${goalId}).`;
    if (systemsAdded > 0) message += ` ${systemsAdded} system(s) added.`;
    if (toAchievesAdded > 0) message += ` ${toAchievesAdded} to-achieve(s) added.`;

    return { goalId, action, message, systemsAdded, toAchievesAdded };
  },
});

const smartAddGoalWorkflow = createWorkflow({
  id: 'smart-add-goal',
  inputSchema: goalInputSchema,
  outputSchema: z.object({
    goalId: z.string(),
    action: z.enum(['created', 'modified']),
    message: z.string(),
    systemsAdded: z.number(),
    toAchievesAdded: z.number(),
  }),
})
  .then(checkForDuplicates)
  .then(executeGoalAction)
  .then(manageSubItems);

smartAddGoalWorkflow.commit();

export { smartAddGoalWorkflow };