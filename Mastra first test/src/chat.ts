import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { mastra } from './mastra/index';

// Change this variable to test a different agent (e.g., 'coordinatorAgent')
const currentAgentName = 'coordinatorAgent'; 

async function simpleChat() {
  // IMPORTANT: Ensure 'coordinatorAgent' was created with `memory: new Memory()` in your index.ts
  const currentAgent = mastra.getAgent(currentAgentName);
  const rl = readline.createInterface({ input, output });
  
  console.log(`Chat started with ${currentAgentName}! Type "exit" to quit.\n`);

  // 1. Define identifiers for this storage session. 
  // (Using a fixed thread ID here means if you restart the script, it remembers the conversation!)
  const resourceId = 'cli-user-1';
  const threadId = 'my-persistent-cli-thread'; 

  while (true) {
    const message = await rl.question('You: ');

    if (message.toLowerCase() === 'exit') {
      break;
    }

    if (!message.trim()) continue;

    try {
      // 2. Pass the message string directly, and attach the memory context.
      // Mastra will pull the history from Supabase, append the new message, send it to the LLM, and save the response.
      const result = await currentAgent.generate(message, {
        memory: {
          resource: resourceId,
          thread: threadId,
        }
      });
      
      const response = typeof result === 'string' ? result : result.text;
      console.log('Agent:', response);
      console.log('-------------------');

    } catch (error) {
      console.error('Error:', error);
    }
  }

  rl.close();
}

simpleChat();