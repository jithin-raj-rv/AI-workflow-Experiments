import os
from supabase import Client
from agno.agent import Agent
from agno.team import Team
from agno.models.openrouter import OpenRouter
import os
from agno.tools.duckduckgo import DuckDuckGoTools
from tools import get_database_tools



def create_system_orchestrator(supabase_client: Client, user_id: str) -> Team:
    """Creates the main orchestrator team of agents with tools bound to a specific user."""
    
    # Get database tools
    db_tools = get_database_tools(supabase_client, user_id)
    

    # Todo Agent
    todo_agent = Agent(
        name="Todo Agent",
        role="Manage user to-do tasks securely.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_todo"], 
            db_tools["delete_todo"], 
            db_tools["modify_todo"]
        ],
        markdown=True,
        instructions=[
            "Manage the user's tasks using the provided to-do tools.",
            "Use query_user_data('todos') to fetch existing records before modifying or deleting them if you need to find task IDs."
        ]
    )

    # Goal Agent
    goal_agent = Agent(
        name="Goal Agent",
        role="Manage user goals and 'To Achieve' tools securely.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_goal"], 
            db_tools["delete_goal"], 
            db_tools["modify_goal"],
            db_tools["add_to_achieve_tool"], 
            db_tools["delete_to_achieve_tool"], 
            db_tools["modify_to_achieve_tool"],
            db_tools["add_system_tool"], 
            db_tools["delete_system_tool"], 
            db_tools["modify_system_tool"]
        ],
      
        markdown=True,
        instructions=[
            "Manage the user's goals, 'To Achieve' items, and systems as interconnected parts of a unified goal ecosystem.",
            "CRITICAL DISTINCTION: GOALS are identity-based or broad visions, while 'To Achieve' items are SMART goals (specific outcomes with deadlines).",
            "When users provide input, separate their identity/vision (the Goal) from the specific milestones (the To Achieve items).",
            "  - GOALS: Identity-based, continuous, or overarching vision (e.g., 'I am a healthy person', 'I am a successful writer'). Created via add_goal.",
            "  - TO ACHIEVE: SMART goals (Specific, Measurable, Attainable, Relevant, Timebound). These are specific milestones to support the Goal. Created via add_to_achieve_tool.",
            "  - SYSTEMS: Tracking mechanisms, measurement processes, recurring habits (e.g., 'measure body fat monthly', 'track daily steps'). Created via add_system_tool.",
            "TRANSFORMATIONS from raw input:",
            "  - 'I want to get fit' → Goal: 'I am a healthy and fit person' | To Achieve: 'I will lose 10 pounds and achieve visible six-pack abs by December 31st'",
            "  - 'I want to grow my business' → Goal: 'I run a highly successful business' | To Achieve: 'I will increase monthly revenue from $5,000 to $6,000 by November 30th'",
            "Always create broad Goals as identity statements, and specific To Achieve items as SMART goals.",
            "Use query_user_data('goals') to fetch existing records before modifying or deleting them if you need to find goal IDs.",
            "Use query_user_data('to_achieves') to fetch existing 'To Achieve' tools before modifying or deleting them if you need to find tool IDs.",
            "Use query_user_data('systems') to fetch existing systems before modifying or deleting them if you need to find system IDs."
        ]
    )

    # Web Agent
    web_agent = Agent(
        name="Web Agent",
        role="Search the web for information.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[DuckDuckGoTools()],
        markdown=True,
        instructions=[
            "Use DuckDuckGo to answer questions requiring external knowledge or current events."
        ]
    )

    # Timer Prompt Agent
    timer_prompt_agent = Agent(
        name="Timer Prompt Agent",
        role="Manage user timer prompts.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_timer_prompt"], 
            db_tools["delete_timer_prompt"], 
            db_tools["modify_timer_prompt"]
        ],
        markdown=True,
        instructions=[
            "Manage the user's timer prompts to automatically process prompts at a specified time in the future.",
            "Use timer prompts to perform future actions, such as analyzing user information, or executing a task automatically by sending a prompt to the AI when the time arrives.",
            "Use query_user_data('timer_prompts') to fetch existing records before modifying or deleting them if you need to find timer prompt IDs."
        ]
    )

    # Feedback Agent
    feedback_agent = Agent(
        name="Feedback Agent",
        role="Manage user feedback.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_feedback"], 
            db_tools["delete_feedback"], 
            db_tools["modify_feedback"]
        ],
        markdown=True,
        instructions=[
            "Manage the user's feedback using the provided tools.",
            "Use query_user_data('user_feedback') to fetch existing records before modifying or deleting them if you need to find feedback IDs."
        ]
    )


    # System Tools Agent
    system_tools_agent = Agent(
        name="System Tools Agent",
        role="Manage user system tools securely.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_system_tool"], 
            db_tools["delete_system_tool"], 
            db_tools["modify_system_tool"]
        ],
        markdown=True,
        instructions=[
            "Manage the user's system tools using the provided tools.",
            "Use query_user_data('goals') to fetch id from existing goals, inorder to put in goal id field."
            "Use query_user_data('systems') to fetch existing records before modifying or deleting them if you need to find system tool IDs."
        ]
    )


    # Reminder Agent
    reminder_agent = Agent(
        name="Reminder Agent",
        role="Manage user reminders securely.",
        model=OpenRouter(id="openai/gpt-oss-20b:free"),
        tools=[
            db_tools["query_user_data"], 
            db_tools["add_reminder"], 
            db_tools["delete_reminder"], 
            db_tools["modify_reminder"]
        ],
        markdown=True,
        instructions=[
            "Manage the user's reminders to send messages to the user in the future.",
            "Use reminders to constantly track the user's life and understand what is happening in their reality.",
            "Use reminders to remind the user about their active systems.",
            "Edit and personalize existing reminders using modify_reminder based on the latest feedback and reality from the user.",
            "Use query_user_data('reminders') to fetch existing records before modifying or deleting them if you need to find reminder IDs."
        ]
    )

    # Main Orchestrator Team
    agent_team = Team(
        name="System Orchestrator",
        model=OpenRouter(id="openai/gpt-oss-120b:free"),
        description="You are the central manager of a personal management system.",
        instructions=[
            "You lead a team of specialized agents: Memory Agent, Todo Agent, Goal Agent, Timer Prompt Agent, Feedback Agent, System Tools Agent, Reminder Agent, and Web Agent.",
            "Delegate tasks to the appropriate agent based on their specialized capabilities.",
            "Pass queries about user preferences to the Memory Agent.",
            "Pass task creation/management to the Todo Agent.",
            "Pass goal creation/management to the Goal Agent.",
            "Pass timer prompt creation/management to the Timer Prompt Agent when the user needs to schedule automated future actions, process prompts later, or analyze data automatically at a specific time.",
            "Pass feedback creation/management to the Feedback Agent.",
            "Pass system tool creation/management to the System Tools Agent.",
            "Pass reminder creation/management to the Reminder Agent to send future messages, track the user's reality constantly, remind them of active systems, and personalize future alerts based on user feedback.",
            "Pass general knowledge queries to the Web Agent.",
            "Summarize the final result from the team for the user nicely."
        ],
        members=[ todo_agent, goal_agent, timer_prompt_agent, feedback_agent, system_tools_agent, reminder_agent, web_agent],
    )
    
    return agent_team

# Expose a default agent instance for Agno OS Dashboard/Playground
from dotenv import load_dotenv
load_dotenv()

# Initialize a default test Supabase client
default_url: str = os.getenv("SUPABASE_URL", "")
default_key: str = os.getenv("SUPABASE_KEY", "")

default_supabase = None
if default_url and default_key:
    from supabase import create_client
    default_supabase = create_client(default_url, default_key)

TEST_USER_ID = os.getenv("TEST_USER_ID", "local-test-user-id")

# This agent variable can be picked up by Agno OS
agent = create_system_orchestrator(default_supabase, TEST_USER_ID)
