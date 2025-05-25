from utils.logger import logger

def process_message(user: str, message: str) -> str:
    logger.info(f"💡 Gerando resposta para {user}...")
    return f"Olá, {user}! Você disse: {message}"
