from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from utils.logger import logger, chat_logger
from services.chat_service import process_message

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user: str, ws: WebSocket):
        await ws.accept()
        self.active_connections[user] = ws
        logger.info(f"🟢 {user} conectado")

    def disconnect(self, user: str):
        self.active_connections.pop(user, None)
        logger.info(f"🔴 {user} desconectado")

    async def broadcast(self, message: dict):
        for ws in self.active_connections.values():
            await ws.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{user}")
async def websocket_endpoint(websocket: WebSocket, user: str):
    await manager.connect(user, websocket)
    try:
        while True:
            msg = await websocket.receive_json()
            chat_logger.info(f"📩 {msg['user']}: «{msg['message']}»")

            auto = process_message(msg["user"], msg["message"])

            # Broadcast da mensagem original
            await manager.broadcast({"user": msg["user"], "message": msg["message"]})

            # Se houver resposta automática, faz broadcast também
            if auto:
                bot_msg = {"user": "Bot", "message": auto}
                chat_logger.info(f"📤 Bot → {bot_msg['message']}")
                await manager.broadcast(bot_msg)

    except WebSocketDisconnect:
        manager.disconnect(user)

    except Exception as e:
        logger.error(f"⚠️ Erro no WebSocket de {user}: {e}")
        manager.disconnect(user)
