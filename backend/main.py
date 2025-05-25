from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.ws import router as ws_router
from routers.chat import router as chat_router  # seu REST de /chat
from utils.logger import logger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# inclui o REST
app.include_router(chat_router)
# inclui o WS
app.include_router(ws_router, prefix="/chat", tags=["chat"])


if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Iniciando servidor FastAPI...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
