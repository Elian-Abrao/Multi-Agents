# backend/routers/chat.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import process_message
from utils.logger import logger, chat_logger

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    user: str
    message: str

@router.post("/")
async def chat_endpoint(body: ChatRequest):
    # log do sistema
    logger.info(f"🚀 Recebida requisição de chat de {body.user}")

    # log da mensagem
    chat_logger.info(f"📩 {body.user}: “{body.message}”")

    # processamento
    response = process_message(body.user, body.message)

    # log da resposta
    chat_logger.info(f"📤 Bot → {body.user}: “{response}”")
    logger.info("✅ Resposta processada com sucesso")

    return {"user": body.user, "response": response}
