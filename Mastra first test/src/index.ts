import 'dotenv/config';
import { mastra } from './mastra/index';

// Main team initialization
async function main() {
  console.log('Mastra Agent Team initialized with the following agents:');
  console.log('- Todo Agent');
  console.log('- Goal Agent');
  console.log('- Web Agent');
  console.log('- Timer Prompt Agent');
  console.log('- Feedback Agent');
  console.log('- System Tools Agent');
  console.log('- Reminder Agent');

  // The mastra instance is now configured with storage and agents
  // You can access it via the imported `mastra` variable

  // Start your team workflow here
  // For example, you could start a CLI or API server.
  // The original Agno project had an API server (api.py) and CLI (cli.py).
  // You can integrate similar functionality using Mastra's built-in server or custom Express.
}

main().catch(console.error);
