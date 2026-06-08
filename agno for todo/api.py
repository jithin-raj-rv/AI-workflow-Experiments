import os
import json
import base64
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client

from agents import create_system_orchestrator

# Load environment variables
load_dotenv()

# Base Supabase details
url: str = os.getenv("SUPABASE_URL", "")
anon_key: str = os.getenv("SUPABASE_KEY", "")

# Initialize FastAPI app
app = FastAPI(title="Agno Agent API")

# Define request models
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    prompt: str
    auth_token: Optional[str] = None
    chatHistory: Optional[List[Dict[str, Any]]] = None
    
class ChatResponse(BaseModel):
    response: str

def decode_jwt_payload(token: str) -> dict:
    """Decodes the JWT payload without verifying the signature."""
    try:
        # Pad base64 string if necessary
        parts = token.split('.')
        if len(parts) < 2:
            return {}
        payload = parts[1]
        payload += '=' * (-len(payload) % 4)
        return json.loads(base64.b64decode(payload).decode('utf-8'))
    except Exception:
        return {}

def get_user_supabase_client(auth_token: Optional[str]) -> Client:
    """Creates a Supabase client scoped to the user if a token is provided."""
    if not url or not anon_key:
        raise HTTPException(status_code=500, detail="Supabase credentials not found in environment.")
    
    client = create_client(url, anon_key)
    
    if auth_token:
        clean_token = auth_token.replace("Bearer ", "").strip()
        client.postgrest.auth(clean_token)
        
    return client

def create_scoped_agent(supabase_client: Client, auth_token: Optional[str]):
    """Creates the Agno agent with tools bound to the specific Supabase client."""
    
    # Extract user_id from token
    user_id = None
    if auth_token:
        clean_token = auth_token.replace("Bearer ", "").strip()
        payload = decode_jwt_payload(clean_token)
        user_id = payload.get("sub")

    user_id_str = str(user_id) if user_id else "unknown"

    # Return the new Agent Team instance with memory capabilities
    return create_system_orchestrator(supabase_client, user_id_str)

@app.post("/", response_model=ChatResponse)
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        supabase_client = get_user_supabase_client(request.auth_token)
        agent = create_scoped_agent(supabase_client, request.auth_token)
        
        # If chatHistory is provided, combine it with the prompt from supabase...... from app.....
        if request.chatHistory:
            input_data = request.chatHistory.copy()
            input_data.append({"role": "user", "content": request.prompt})
        else:
            input_data = request.prompt
            
        run_response = agent.run(input_data)
        response_text = run_response.content if hasattr(run_response, "content") else str(run_response)
        
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Agno Agent API is running."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting API Server on http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
