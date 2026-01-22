from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import base64
import uuid
import json
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

# System prompt for Claude
SYSTEM_PROMPT = """Tu es Nexus, un assistant d'automatisation desktop intelligent et expert en analyse d'interface utilisateur.

Quand l'utilisateur te donne une capture d'écran et une instruction:

1. ANALYSE l'écran en détail:
   - Identifie tous les éléments visibles (boutons, menus, icônes, fenêtres, texte)
   - Comprends le contexte (quelle application, quel état)
   - Repère les éléments pertinents pour l'action demandée

2. SUGGÈRE des actions précises:
   - Donne les coordonnées X,Y exactes où cliquer (estimation basée sur l'image)
   - Explique clairement ce que l'utilisateur doit faire
   - Si plusieurs étapes sont nécessaires, liste-les dans l'ordre

3. RÉPONDS en JSON avec ce format exact:
{
    "coordinates": {"x": NUMBER, "y": NUMBER} ou null si pas de clic nécessaire,
    "command": "commande clavier ou système" ou null,
    "explanation": "Explication détaillée en français de ce que tu vois et de l'action à effectuer",
    "steps": ["étape 1", "étape 2", ...] pour les actions complexes,
    "confidence": nombre entre 0 et 100
}

IMPORTANT:
- Les coordonnées doivent être relatives à l'image (0,0 = coin haut gauche)
- Sois précis dans tes explications
- Si tu ne vois pas l'élément demandé, dis-le clairement
- Adapte tes suggestions au contexte visible"""


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
    Note: Real capture happens in browser via Screen Capture API.
    """
    return {
        "success": True,
        "message": "Use browser Screen Capture API for real screenshots",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/desktop/action")
async def execute_desktop_action(request: DesktopActionRequest):
    """
    Execute a desktop action (informational only).
    Note: Real control requires native desktop agent.
    """
    return {
        "success": True,
        "action": request.type,
        "payload": request.payload,
        "message": "Action logged. Note: Browser cannot control desktop directly.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.post("/api/ai/analyze")
async def analyze_screen(request: AnalyzeRequest):
    """
    Analyze screenshot with Claude AI.
    """
    session_id = str(uuid.uuid4())
    
    # Check if we have a screenshot
    has_screenshot = request.screenshot and len(request.screenshot) > 100
    
    # Check if LLM is available
    if not LLM_AVAILABLE or not EMERGENT_LLM_KEY:
        return {
            "success": False,
            "response": "Service IA non disponible. Vérifiez la configuration.",
            "analysis": {
                "coordinates": None,
                "command": None,
                "explanation": "LLM not configured",
                "confidence": 0
            }
        }
    
    try:
        # Create chat instance
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=SYSTEM_PROMPT
        ).with_model("anthropic", "claude-sonnet-4-20250514")
        
        # Build message
        if has_screenshot:
            message_text = f"""L'utilisateur demande: "{request.userIntent}"

Analyse cette capture d'écran et donne-moi:
1. Ce que tu vois sur l'écran
2. Les coordonnées précises où cliquer pour accomplir la tâche
3. Les étapes à suivre

Réponds en JSON."""
            
            # Create message with image
            user_message = UserMessage(
                text=message_text,
                file_contents=[ImageContent(image_base64=request.screenshot)]
            )
        else:
            message_text = f"""L'utilisateur demande: "{request.userIntent}"

Note: Aucune capture d'écran fournie. Donne des instructions générales pour accomplir cette tâche sur un ordinateur.

Réponds en JSON."""
            user_message = UserMessage(text=message_text)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        # Parse JSON from response
        analysis = None
        try:
            # Find JSON in response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                analysis = json.loads(json_str)
        except json.JSONDecodeError:
            pass
        
        # Build response
        if analysis:
            explanation = analysis.get("explanation", "")
            steps = analysis.get("steps", [])
            
            # Format nice response
            response_text = explanation
            if steps:
                response_text += "\n\n**Étapes à suivre:**\n"
                for i, step in enumerate(steps, 1):
                    response_text += f"{i}. {step}\n"
            
            if analysis.get("coordinates"):
                coords = analysis["coordinates"]
                response_text += f"\n\n📍 **Point de clic suggéré:** ({coords.get('x', 0)}, {coords.get('y', 0)})"
            
            return {
                "success": True,
                "response": response_text,
                "analysis": {
                    "coordinates": analysis.get("coordinates"),
                    "command": analysis.get("command"),
                    "explanation": explanation,
                    "steps": steps,
                    "confidence": analysis.get("confidence", 70)
                }
            }
        else:
            # Return raw response if JSON parsing failed
            return {
                "success": True,
                "response": response,
                "analysis": {
                    "coordinates": None,
                    "command": None,
                    "explanation": response,
                    "confidence": 50
                }
            }
        
    except Exception as e:
        print(f"AI Analysis error: {e}")
        import traceback
        traceback.print_exc()
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
        "status": "running",
        "description": "AI Desktop Automation Backend",
        "features": {
            "screen_analysis": "Claude AI analyzes screenshots and suggests actions",
            "real_capture": "Use browser Screen Capture API",
            "desktop_control": "Requires native agent (not possible from browser)"
        },
        "endpoints": [
            "GET /api/health",
            "POST /api/desktop/screenshot",
            "POST /api/desktop/action", 
            "POST /api/ai/analyze"
        ]
    }
