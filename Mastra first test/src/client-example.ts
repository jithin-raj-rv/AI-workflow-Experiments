/**
 * Mastra Client Integration Example
 * 
 * This file demonstrates how to integrate with the Mastra API server
 * from a client application (React, Next.js, mobile, etc.)
 * 
 * Key points:
 * 1. User logs in via Supabase
 * 2. Client receives JWT token from Supabase
 * 3. Client sends requests to Mastra with the JWT in the Authorization header
 * 4. Mastra validates the token and processes the request
 * 5. Response is returned to the client with user context preserved
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Mastra API endpoint
const MASTRA_API_URL = process.env.MASTRA_API_URL || 'http://localhost:4111';

/**
 * Main Mastra Client Class
 * Handles authentication and communication with Mastra API
 */
export class MastraClient {
  private token: string | null = null;
  private userId: string | null = null;

  /**
   * Authenticate user with Supabase and get JWT token
   */
  async authenticate(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Authentication failed:', error.message);
        return false;
      }

      // Store the JWT token
      this.token = data.session?.access_token || null;
      this.userId = data.user?.id || null;

      console.log('✅ Authenticated with Supabase');
      console.log('   User ID:', this.userId);
      console.log('   Token expires at:', data.session?.expires_at);

      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  /**
   * Get the current session token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Get the current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<Agent[]> {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const response = await fetch(`${MASTRA_API_URL}/api/agents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to list agents: ${error.message}`);
    }

    const data = await response.json();
    return data.agents;
  }

  /**
   * Get details about a specific agent
   */
  async getAgent(agentId: string): Promise<AgentDetails> {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const response = await fetch(
      `${MASTRA_API_URL}/api/agents/${agentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get agent: ${error.message}`);
    }

    const data = await response.json();
    return data.agent;
  }

  /**
   * Send a message to an agent and get a response
   */
  async chat(
    agentId: string,
    message: string,
    options?: {
      resourceId?: string;
      threadId?: string;
    }
  ): Promise<ChatResponse> {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const response = await fetch(
      `${MASTRA_API_URL}/api/agents/${agentId}/generate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [message],
          memory: {
            resource: options?.resourceId || this.userId,
            thread: options?.threadId,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Chat failed: ${error.message}`);
    }

    const data = await response.json();
    return {
      response: data.response,
      thread: data.memory.thread,
      timestamp: data.timestamp,
    };
  }

  /**
   * Logout and clear the token
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.token = null;
    this.userId = null;
    console.log('✅ Logged out');
  }
}

/**
 * Type definitions
 */
interface Agent {
  id: string;
  name: string;
  description: string;
}

interface AgentDetails extends Agent {
  model: string;
  tools: string[];
}

interface ChatResponse {
  response: string;
  thread: string;
  timestamp: string;
}

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 */

/**
 * Example 1: Basic Authentication and Chat
 */
async function example1_basicChat() {
  console.log('\n=== Example 1: Basic Chat ===\n');

  const client = new MastraClient();

  try {
    // 1. Authenticate
    const authenticated = await client.authenticate(
      'user@example.com',
      'password'
    );

    if (!authenticated) {
      console.error('Failed to authenticate');
      return;
    }

    // 2. List available agents
    const agents = await client.listAgents();
    console.log('Available agents:', agents.map((a) => a.id).join(', '));

    // 3. Send a message to the todo agent
    const response = await client.chat(
      'todoAgent',
      'Add a new task: Learn TypeScript'
    );

    console.log('Agent response:', response.response);
    console.log('Thread ID:', response.thread);

    // 4. Send another message in the same thread
    const response2 = await client.chat(
      'todoAgent',
      'What tasks do I have?',
      { threadId: response.thread }
    );

    console.log('Agent response:', response2.response);

    // 5. Logout
    await client.logout();
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: Multi-Agent Conversation
 */
async function example2_multiAgentConversation() {
  console.log('\n=== Example 2: Multi-Agent Conversation ===\n');

  const client = new MastraClient();

  try {
    await client.authenticate('user@example.com', 'password');

    // Talk to different agents in sequence
    const todoResponse = await client.chat(
      'todoAgent',
      'Create a task: Complete project'
    );
    console.log('Todo Agent:', todoResponse.response);

    const goalResponse = await client.chat(
      'goalAgent',
      'Set a goal: Finish my project by end of month'
    );
    console.log('Goal Agent:', goalResponse.response);

    const coordinatorResponse = await client.chat(
      'coordinatorAgent',
      'Summarize my tasks and goals'
    );
    console.log('Coordinator Agent:', coordinatorResponse.response);

    await client.logout();
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 3: Agent Details and Tools
 */
async function example3_agentDetails() {
  console.log('\n=== Example 3: Agent Details ===\n');

  const client = new MastraClient();

  try {
    await client.authenticate('user@example.com', 'password');

    // Get details about the todo agent
    const agent = await client.getAgent('todoAgent');

    console.log(`Agent: ${agent.name}`);
    console.log(`Model: ${agent.model}`);
    console.log(`Available tools:`);
    agent.tools.forEach((tool) => console.log(`  - ${tool}`));

    await client.logout();
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 4: React Hook Implementation (TypeScript with proper React imports)
 * 
 * This is how you would use the MastraClient in a React component
 * Note: In actual React code, import React at the top:
 * import React from 'react';
 */
export function useMastraChat() {
  // Note: In actual React code, use React.useState
  // Here we're just showing the structure
  const chatState = {
    client: new MastraClient(),
    isAuthenticated: false,
    messages: [] as Array<{ role: 'user' | 'agent'; content: string }>,
    loading: false,
    threadId: undefined as string | undefined,
  };

  const login = async (email: string, password: string) => {
    const success = await chatState.client.authenticate(email, password);
    chatState.isAuthenticated = success;
    return success;
  };

  const sendMessage = async (agentId: string, message: string) => {
    if (!chatState.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    chatState.loading = true;
    chatState.messages.push({ role: 'user', content: message });

    try {
      const response = await chatState.client.chat(agentId, message, {
        threadId: chatState.threadId,
      });

      chatState.messages.push({ role: 'agent', content: response.response });
      chatState.threadId = response.thread;
    } finally {
      chatState.loading = false;
    }
  };

  const logout = async () => {
    await chatState.client.logout();
    chatState.isAuthenticated = false;
    chatState.messages = [];
    chatState.threadId = undefined;
  };

  return {
    isAuthenticated: chatState.isAuthenticated,
    messages: chatState.messages,
    loading: chatState.loading,
    login,
    sendMessage,
    logout,
  };
}

/**
 * ============================================================================
 * EXPORT
 * ============================================================================
 */

export default MastraClient;

/**
 * Running the examples:
 * 
 * For Node.js:
 * npx ts-node client-example.ts
 * 
 * For React:
 * Import MastraClient and use the useMastraChat hook in your components
 * Make sure to import React in your actual React files
 * 
 * Example React component (add this to your React application):
 * 
 * import React from 'react';
 * import { useMastraChat } from './client-example';
 * 
 * export function ChatInterface() {
 *   const { isAuthenticated, messages, loading, login, sendMessage, logout } = useMastraChat();
 *   
 *   const handleSendMessage = async (message: string) => {
 *     await sendMessage('coordinatorAgent', message);
 *   };
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm onLogin={login} />;
 *   }
 *   
 *   return (
 *     <div>
 *       <ChatMessages messages={messages} loading={loading} />
 *       <ChatInput onSendMessage={handleSendMessage} />
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */
