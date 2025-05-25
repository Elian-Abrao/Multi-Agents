# from apscheduler.schedulers.background import BackgroundScheduler
# from utils.logger import logger

# scheduler = BackgroundScheduler()

# def start_scheduler():
#     logger.info("⏰ Iniciando agendador de tarefas...")
#     scheduler.start()

# def schedule_daily_greeting(hour=9, minute=0):
#     scheduler.add_job(lambda: logger.info("☀️ Bom dia!"), 'cron', hour=hour, minute=minute)
#     logger.info(f"✅ Agendada saudação diária às {hour:02d}:{minute:02d}")
