# backend/testes/test_api.py
import asyncio
import logging
import json
from tqdm import tqdm
import websockets

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("test_api")

WS_URL_TEMPLATE = "ws://localhost:8000/chat/ws/{user}"

async def testar_mensagens(test_cases: list[dict]) -> None:
    """
    Conecta a cada usuário via WebSocket, envia a mensagem e
    valida tanto o broadcast da mensagem original quanto a
    possível resposta automática do bot.
    """
    logger.info("🚀 Iniciando testes WebSocket de chat...")
    for case in test_cases:
        user = case["user"]
        msg  = case["message"]
        url = WS_URL_TEMPLATE.format(user=user)

        try:
            # Abre conexão
            async with websockets.connect(url) as ws:
                logger.info(f"🔌 Conectado como {user}")
                
                payload = {"user": user, "message": msg}
                text = json.dumps(payload)
                logger.info(f"📤 {user} envia: «{msg}»")
                await ws.send(text)

                # 1) Recebe broadcast da própria mensagem
                raw = await ws.recv()
                data = json.loads(raw)
                logger.info(f"✅ Broadcast original: {data}")

                # 2) Tenta ler uma resposta automática (timeout curto)
                try:
                    raw2 = await asyncio.wait_for(ws.recv(), timeout=2)
                    bot_data = json.loads(raw2)
                    logger.info(f"🤖 Resposta automática: {bot_data}")
                except asyncio.TimeoutError:
                    logger.info(f"🤖 Nenhuma resposta automática para {user}")

        except Exception as e:
            logger.error(f"❌ Erro no caso {case}: {e}")
            
        # Pequeno delay para não bombardear o servidor
        await asyncio.sleep(0.2)

    logger.info("🎉 Testes concluídos!")

if __name__ == "__main__":
    casos = [
        {"user": "[BOT1]", "message": "Qual o status do robô?"},
        {"user": "[BOT2]", "message": "O robo esta em execucao atualmente, na pagina 7/10"},
        {"user": "[SYSTEM]", "message": "Aguardando conclusao..."},
    ]
    asyncio.run(testar_mensagens(casos))
