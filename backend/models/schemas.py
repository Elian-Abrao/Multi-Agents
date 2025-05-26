from pydantic import BaseModel
from fastapi import WebSocket
from utils.logger import logger

class ChatRequest(BaseModel):
    user: str
    message: str

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