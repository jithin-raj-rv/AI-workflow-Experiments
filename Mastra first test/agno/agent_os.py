from agno.os import AgentOS
from agents import agent

# Create the Agent OS instance with our main orchestrator team
agent_os = AgentOS(teams=[agent])

# Get the underlying FastAPI app
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="agent_os:app", reload=True, port=7777)
