import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { PostgresStore } from '@mastra/pg';
import { MastraEditor } from '@mastra/editor'
import { todoAgent, goalAgent, webAgent, timerPromptAgent, feedbackAgent, systemToolsAgent, reminderAgent, coordinatorAgent } from '../agents/index';

const storage = new PostgresStore({
  id: 'supabase-storage',
  connectionString: process.env.SUPABASE_CONNECTION_STRING!, 
  schemaName: 'mastra_data', 
  ssl: { rejectUnauthorized: false }, 
});


export const simpleAgent = new Agent({
  id: 'simple-agent',
  name: 'simpleAgent',
  instructions: 'Say the words: Test successful!',
  model: 'openrouter/openai/gpt-oss-120b:free', 
  // Notice: no memory configuration here!
});



export const mastra = new Mastra({
  storage: storage,
  agents: {
    todoAgent,
    goalAgent,
    webAgent,
    timerPromptAgent,
    feedbackAgent,
    systemToolsAgent,
    reminderAgent,
    coordinatorAgent,
    simpleAgent,
  },
  editor: new MastraEditor(),

});

