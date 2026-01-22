from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import base64
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Nexus API", description="AI Desktop Automation Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get environment variables
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

# Import emergentintegrations for Claude
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    print("Warning: emergentintegrations not available")

# Pydantic models
class AnalyzeRequest(BaseModel):
    screenshot: Optional[str] = None
    userIntent: str

class DesktopActionRequest(BaseModel):
    type: str
    payload: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    coordinates: Optional[Dict[str, int]] = None
    command: Optional[str] = None
    explanation: str
    confidence: int

# Store chat sessions
chat_sessions: Dict[str, Any] = {}

def get_or_create_chat(session_id: str):
    """Get or create a chat session for the given session ID."""
    if not LLM_AVAILABLE or not EMERGENT_LLM_KEY:
        return None
    
    if session_id not in chat_sessions:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message="""Tu es Nexus, un assistant d'automatisation desktop intelligent. 
Tu analyses les captures d'écran et les demandes des utilisateurs pour:
1. Identifier les éléments d'interface pertinents
2. Suggérer des coordonnées où cliquer
3. Proposer des commandes système à exécuter
4. Expliquer tes actions de manière claire en français

Réponds toujours en JSON avec ce format:
{
    "coordinates": {"x": number, "y": number} ou null,
    "command": "commande système" ou null,
    "explanation": "explication en français",
    "confidence": nombre entre 0 et 100
}"""
        ).with_model("anthropic", "claude-sonnet-4-20250514")
        chat_sessions[session_id] = chat
    
    return chat_sessions[session_id]


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "llm_available": LLM_AVAILABLE,
        "llm_key_configured": bool(EMERGENT_LLM_KEY)
    }


@app.post("/api/desktop/screenshot")
async def capture_screenshot():
    """
    Capture screenshot endpoint.
    In a real implementation, this would capture the actual desktop.
    For now, returns a simulated response.
    """
    return {
        "success": True,
        "screenshot": None,  # Would be base64 encoded image
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "resolution": {"width": 1920, "height": 1080}
    }


@app.post("/api/desktop/action")
async def execute_desktop_action(request: DesktopActionRequest):
    """
    Execute a desktop action (move, click, type, command).
    In a real implementation, this would control the actual desktop.
    """
    action_type = request.type
    payload = request.payload or {}
    
    # Simulate action execution
    result = {
        "success": True,
        "action": action_type,
        "payload": payload,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    if action_type == "move":
        result["message"] = f"Curseur déplacé vers ({payload.get('x', 0)}, {payload.get('y', 0)})"
    elif action_type == "click":
        button = payload.get("button", "left")
        result["message"] = f"Clic {button} à ({payload.get('x', 0)}, {payload.get('y', 0)})"
    elif action_type == "type":
        result["message"] = f"Texte saisi: {payload.get('text', '')[:20]}..."
    elif action_type == "command":
        result["message"] = f"Commande exécutée: {payload.get('command', '')}"
    else:
        result["message"] = f"Action {action_type} exécutée"
    
    return result


@app.post("/api/ai/analyze")
async def analyze_screen(request: AnalyzeRequest):
    """
    Analyze screenshot and user intent using Claude AI.
    """
    session_id = str(uuid.uuid4())
    
    # Check if LLM is available
    if not LLM_AVAILABLE or not EMERGENT_LLM_KEY:
        # Return simulated response
        return {
            "success": True,
            "response": f"J'ai compris votre demande: '{request.userIntent}'. Dans un environnement réel, j'analyserais votre écran pour exécuter cette tâche.",
            "analysis": {
                "coordinates": {"x": 150, "y": 200} if "ouvr" in request.userIntent.lower() else None,
                "command": None,
                "explanation": f"Simulation de l'analyse pour: {request.userIntent}",
                "confidence": 75
            }
        }
    
    try:
        chat = get_or_create_chat(session_id)
        
        # Build the message
        message_text = f"L'utilisateur demande: {request.userIntent}\n\nAnalyse cette demande et réponds avec le JSON approprié."
        
        # If screenshot provided, include it
        if request.screenshot:
            user_message = UserMessage(
                text=message_text,
                file_contents=[ImageContent(image_base64=request.screenshot)]
            )
        else:
            user_message = UserMessage(text=message_text)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        # Try to parse JSON from response
        import json
        try:
            # Find JSON in response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                analysis = json.loads(response[json_start:json_end])
            else:
                analysis = {
                    "coordinates": None,
                    "command": None,
                    "explanation": response,
                    "confidence": 70
                }
        except json.JSONDecodeError:
            analysis = {
                "coordinates": None,
                "command": None,
                "explanation": response,
                "confidence": 70
            }
        
        return {
            "success": True,
            "response": analysis.get("explanation", response),
            "analysis": analysis
        }
        
    except Exception as e:
        print(f"AI Analysis error: {e}")
        return {
            "success": False,
            "response": f"Erreur lors de l'analyse: {str(e)}",
            "analysis": {
                "coordinates": None,
                "command": None,
                "explanation": str(e),
                "confidence": 0
            }
        }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Nexus API",
        "version": "1.0.0",
        "description": "AI Desktop Automation Backend",
        "endpoints": [
            "/api/health",
            "/api/desktop/screenshot",
            "/api/desktop/action",
            "/api/ai/analyze"
        ]
    }
