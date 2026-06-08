import asyncio
from agents import agent

def main():
    print("Agent is ready! Type 'exit' to quit.")
    
    # Simple CLI loop for the agent
    while True:
        try:
            user_input = input("\nYou: ")
        except (KeyboardInterrupt, EOFError):
            break

        if user_input.lower() in ['exit', 'quit']:
            break

        print("\nAgent: ", end="", flush=True)
        response = agent.run(user_input)
        response_text = response.content if hasattr(response, "content") else str(response)
        print(response_text)
    
    # Clean up client sessions explicitly
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            pass
        else:
            # Run an empty coroutine to let aiohttp clean up
            loop.run_until_complete(asyncio.sleep(0.1))
    except Exception:
        pass

if __name__ == "__main__":
    main()
