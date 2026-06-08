import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * Factory function to generate database tools tied to a specific user and supabase client.
 * Returns an object with all CRUD operations for todos, goals, timer prompts, feedback, systems, to_achieves, reminders.
 */
export function getDatabaseTools(supabaseClient: SupabaseClient, userId: string) {
  // Helper to check client
  const checkClient = () => {
    if (!supabaseClient) throw new Error('Supabase client not initialized.');
  };

  const addTodo = async (
    taskName: string,
    importance: 'IMPORTANT' | 'NOT IMPORTANT',
    urgency: 'URGENT' | 'NOT URGENT',
    description: string = '',
    dueDate?: string,
    isCompleted: boolean = false
  ): Promise<string> => {
    checkClient();
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
      const { error } = await supabaseClient.from('todos').insert(data);
      if (error) throw error;
      return `Successfully added todo: '${taskName}'.`;
    } catch (e: any) {
      return `Error adding todo: ${e.message}`;
    }
  };

  const deleteTodo = async (taskId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('todos').delete().eq('id', taskId);
      if (error) throw error;
      return `Successfully deleted todo: ${taskId}.`;
    } catch (e: any) {
      return `Error deleting todo: ${e.message}`;
    }
  };

  const modifyTodo = async (
    taskId: string,
    updates: {
      taskName?: string;
      importance?: 'IMPORTANT' | 'NOT IMPORTANT';
      urgency?: 'URGENT' | 'NOT URGENT';
      description?: string;
      dueDate?: string;
      isCompleted?: boolean;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.taskName !== undefined) data.task_name = updates.taskName;
    if (updates.importance !== undefined) data.importance = updates.importance;
    if (updates.urgency !== undefined) data.urgency = updates.urgency;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.dueDate !== undefined) data.due_date = updates.dueDate;
    if (updates.isCompleted !== undefined) data.is_completed = updates.isCompleted;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    try {
      const { error } = await supabaseClient.from('todos').update(data).eq('id', taskId);
      if (error) throw error;
      return `Successfully modified todo: ${taskId}.`;
    } catch (e: any) {
      return `Error modifying todo: ${e.message}`;
    }
  };

  const addGoal = async (
    title: string,
    description: string = '',
    targetDate?: string,
    isCompleted: number = 0,
    isImportant: boolean = false,
    isUrgent: boolean = false
  ): Promise<string> => {
    checkClient();
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
      const { error } = await supabaseClient.from('goals').insert(data);
      if (error) throw error;
      return `Successfully added goal: '${title}'.`;
    } catch (e: any) {
      return `Error adding goal: ${e.message}`;
    }
  };

  const deleteGoal = async (goalId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('goals').delete().eq('id', goalId);
      if (error) throw error;
      return `Successfully deleted goal: ${goalId}.`;
    } catch (e: any) {
      return `Error deleting goal: ${e.message}`;
    }
  };

  const modifyGoal = async (
    goalId: string,
    updates: {
      title?: string;
      description?: string;
      targetDate?: string;
      isCompleted?: number;
      isImportant?: boolean;
      isUrgent?: boolean;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.targetDate !== undefined) data.target_date = updates.targetDate;
    if (updates.isCompleted !== undefined) data.is_completed = updates.isCompleted;
    if (updates.isImportant !== undefined) data.importance = updates.isImportant ? 'IMPORTANT' : 'NOT IMPORTANT';
    if (updates.isUrgent !== undefined) data.urgency = updates.isUrgent ? 'URGENT' : 'NOT URGENT';
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    try {
      const { error } = await supabaseClient.from('goals').update(data).eq('id', goalId);
      if (error) throw error;
      return `Successfully modified goal: ${goalId}.`;
    } catch (e: any) {
      return `Error modifying goal: ${e.message}`;
    }
  };

  const addTimerPrompt = async (
    prompt: string,
    scheduledTime: string,
    recurringType: string = 'never',
    weekdays: any[] = [],
    response: string = '',
    sent: boolean = false
  ): Promise<string> => {
    checkClient();
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
      const { error } = await supabaseClient.from('timer_prompts').insert(data);
      if (error) throw error;
      return `Successfully added timer prompt: '${prompt}'.`;
    } catch (e: any) {
      return `Error adding timer prompt: ${e.message}`;
    }
  };

  const deleteTimerPrompt = async (promptId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('timer_prompts').delete().eq('id', promptId);
      if (error) throw error;
      return `Successfully deleted timer prompt: ${promptId}.`;
    } catch (e: any) {
      return `Error deleting timer prompt: ${e.message}`;
    }
  };

  const modifyTimerPrompt = async (
    promptId: string,
    updates: {
      prompt?: string;
      scheduledTime?: string;
      recurringType?: string;
      weekdays?: any[];
      response?: string;
      sent?: boolean;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.prompt !== undefined) data.prompt = updates.prompt;
    if (updates.scheduledTime !== undefined) data.scheduled_time = updates.scheduledTime;
    if (updates.recurringType !== undefined) data.recurring_type = updates.recurringType;
    if (updates.weekdays !== undefined) data.weekdays = updates.weekdays;
    if (updates.response !== undefined) data.response = updates.response;
    if (updates.sent !== undefined) data.sent = updates.sent;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    try {
      const { error } = await supabaseClient.from('timer_prompts').update(data).eq('id', promptId);
      if (error) throw error;
      return `Successfully modified timer prompt: ${promptId}.`;
    } catch (e: any) {
      return `Error modifying timer prompt: ${e.message}`;
    }
  };

  const addFeedback = async (feedback: string): Promise<string> => {
    checkClient();
    const data = { user_id: userId, feedback };
    try {
      const { error } = await supabaseClient.from('user_feedback').insert(data);
      if (error) throw error;
      return 'Successfully added feedback.';
    } catch (e: any) {
      return `Error adding feedback: ${e.message}`;
    }
  };

  const deleteFeedback = async (feedbackId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('user_feedback').delete().eq('id', feedbackId);
      if (error) throw error;
      return `Successfully deleted feedback: ${feedbackId}.`;
    } catch (e: any) {
      return `Error deleting feedback: ${e.message}`;
    }
  };

  const modifyFeedback = async (feedbackId: string, newFeedback: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('user_feedback').update({ feedback: newFeedback }).eq('id', feedbackId);
      if (error) throw error;
      return `Successfully modified feedback: ${feedbackId}.`;
    } catch (e: any) {
      return `Error modifying feedback: ${e.message}`;
    }
  };

  const addSystemTool = async (
    goalId: string,
    title: string,
    description: string = '',
    orderIndex: number = 0
  ): Promise<string> => {
    checkClient();
    const data: any = {
      user_id: userId,
      goal_id: goalId,
      system_name: title,
      is_completed: false,
      priority_order: orderIndex,
    };
    try {
      const { error } = await supabaseClient.from('systems').insert(data);
      if (error) throw error;
      return `Successfully added system tool: '${title}'.`;
    } catch (e: any) {
      return `Error adding system tool: ${e.message}`;
    }
  };

  const deleteSystemTool = async (stepId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('systems').delete().eq('id', stepId);
      if (error) throw error;
      return `Successfully deleted system tool: ${stepId}.`;
    } catch (e: any) {
      return `Error deleting system tool: ${e.message}`;
    }
  };

  const modifySystemTool = async (
    stepId: string,
    updates: {
      title?: string;
      description?: string;
      isCompleted?: boolean;
      orderIndex?: number;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.title !== undefined) data.system_name = updates.title;
    if (updates.isCompleted !== undefined) data.is_completed = updates.isCompleted;
    if (updates.orderIndex !== undefined) data.priority_order = updates.orderIndex;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    try {
      const { error } = await supabaseClient.from('systems').update(data).eq('id', stepId);
      if (error) throw error;
      return `Successfully modified system tool: ${stepId}.`;
    } catch (e: any) {
      return `Error modifying system tool: ${e.message}`;
    }
  };

  const addToAchieveTool = async (
    goalId: string,
    title: string,
    description: string = '',
    orderIndex: number = 0
  ): Promise<string> => {
    checkClient();
    const data: any = {
      user_id: userId,
      goal_id: goalId,
      title,
      is_completed: false,
      priority_order: orderIndex,
    };
    try {
      const { error } = await supabaseClient.from('to_achieves').insert(data);
      if (error) throw error;
      return `Successfully added To Achieve tool: '${title}'.`;
    } catch (e: any) {
      return `Error adding To Achieve tool: ${e.message}`;
    }
  };

  const deleteToAchieveTool = async (stepId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('to_achieves').delete().eq('id', stepId);
      if (error) throw error;
      return `Successfully deleted To Achieve tool: ${stepId}.`;
    } catch (e: any) {
      return `Error deleting To Achieve tool: ${e.message}`;
    }
  };

  const modifyToAchieveTool = async (
    stepId: string,
    updates: {
      title?: string;
      description?: string;
      isCompleted?: boolean;
      orderIndex?: number;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.isCompleted !== undefined) data.is_completed = updates.isCompleted;
    if (updates.orderIndex !== undefined) data.priority_order = updates.orderIndex;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    try {
      const { error } = await supabaseClient.from('to_achieves').update(data).eq('id', stepId);
      if (error) throw error;
      return `Successfully modified To Achieve tool: ${stepId}.`;
    } catch (e: any) {
      return `Error modifying To Achieve tool: ${e.message}`;
    }
  };

  const addReminder = async (
    title: string,
    scheduledDate: string,
    body: string = '',
    reminderType: string = 'basic',
    options: any[] = [],
    expectedAnswer: string = '',
    aiPrompt: string = ''
  ): Promise<string> => {
    checkClient();
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
      const { error } = await supabaseClient.from('reminders').insert(data);
      if (error) throw error;
      return `Successfully added reminder: '${title}'.`;
    } catch (e: any) {
      return `Error adding reminder: ${e.message}`;
    }
  };

  const deleteReminder = async (reminderId: string): Promise<string> => {
    checkClient();
    try {
      const { error } = await supabaseClient.from('reminders').delete().eq('id', reminderId);
      if (error) throw error;
      return `Successfully deleted reminder: ${reminderId}.`;
    } catch (e: any) {
      return `Error deleting reminder: ${e.message}`;
    }
  };

  const modifyReminder = async (
    reminderId: string,
    updates: {
      title?: string;
      body?: string;
      scheduledDate?: string;
      reminderType?: string;
      options?: any[];
      expectedAnswer?: string;
      aiPrompt?: string;
    }
  ): Promise<string> => {
    checkClient();
    const data: any = {};
    if (updates.title !== undefined) {
      data.title = updates.title;
      data.payload = updates.title;
    }
    if (updates.body !== undefined) data.body = updates.body;
    if (updates.scheduledDate !== undefined) data.scheduled_date = updates.scheduledDate;
    if (updates.reminderType !== undefined) data.reminder_type = updates.reminderType;
    if (updates.options !== undefined) data.options = JSON.stringify(updates.options);
    if (updates.expectedAnswer !== undefined) data.expected_answer = updates.expectedAnswer;
    if (updates.aiPrompt !== undefined) data.ai_prompt = updates.aiPrompt;
    if (Object.keys(data).length === 0) return 'No modifications provided.';
    data.updated_at = new Date().toISOString();
    try {
      const { error } = await supabaseClient.from('reminders').update(data).eq('id', reminderId);
      if (error) throw error;
      return `Successfully modified reminder: ${reminderId}.`;
    } catch (e: any) {
      return `Error modifying reminder: ${e.message}`;
    }
  };

  const queryUserData = async (tableName: string): Promise<string> => {
    checkClient();
    try {
      const { data, error } = await supabaseClient.from(tableName).select('*').eq('user_id', userId);
      if (error) throw error;
      return `Records for ${tableName}: ${JSON.stringify(data)}`;
    } catch (e: any) {
      return `Error querying ${tableName}: ${e.message}`;
    }
  };

  return {
    addTodo,
    deleteTodo,
    modifyTodo,
    addGoal,
    deleteGoal,
    modifyGoal,
    addTimerPrompt,
    deleteTimerPrompt,
    modifyTimerPrompt,
    addFeedback,
    deleteFeedback,
    modifyFeedback,
    addSystemTool,
    deleteSystemTool,
    modifySystemTool,
    addToAchieveTool,
    deleteToAchieveTool,
    modifyToAchieveTool,
    addReminder,
    deleteReminder,
    modifyReminder,
    queryUserData,
  };
}

export type DatabaseTools = ReturnType<typeof getDatabaseTools>;