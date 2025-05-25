# backend/utils/logger.py
import logging
import os
from logging.handlers import RotatingFileHandler

# Cria pasta de logs (../logs em relação a este arquivo)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LOG_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

# Formatos de saída
system_fmt = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
chat_fmt   = logging.Formatter("%(asctime)s - %(message)s")

# Handler para logs do sistema
system_handler = RotatingFileHandler(
    filename=os.path.join(LOG_DIR, 'system.log'),
    maxBytes=5*1024*1024,
    backupCount=3,
    encoding='utf-8'
)
system_handler.setLevel(logging.INFO)
system_handler.setFormatter(system_fmt)

# Handler para logs de chat (troca de mensagens)
chat_handler = RotatingFileHandler(
    filename=os.path.join(LOG_DIR, 'chat.log'),
    maxBytes=5*1024*1024,
    backupCount=3,
    encoding='utf-8'
)
chat_handler.setLevel(logging.INFO)
chat_handler.setFormatter(chat_fmt)

# Logger principal do sistema
logger = logging.getLogger("chatbot_system")
logger.setLevel(logging.INFO)
logger.addHandler(system_handler)

# Logger específico para chat
chat_logger = logging.getLogger("chatbot_chat")
chat_logger.setLevel(logging.INFO)
chat_logger.addHandler(chat_handler)
