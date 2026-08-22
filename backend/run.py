import os
from dotenv import load_dotenv

# Carrega o .env correto de acordo com o ambiente
flag_env_temp = os.getenv("FLAG_ENV")
if flag_env_temp == "prod" or os.path.exists(".env.prod") and flag_env_temp != "dev":
    load_dotenv(".env.prod", override=True)
else:
    load_dotenv(".env", override=True)

FLAG_ENV = os.getenv("FLAG_ENV", "dev")
PORT = int(os.getenv("PORT", 3004 if FLAG_ENV == "prod" else 5000))

from app import app     

if __name__ == '__main__':
    print("Ambiente iniciado: ", FLAG_ENV)  
    print(f"Iniciando o servidor... Potpourri Music API na porta {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=(FLAG_ENV == "dev"))

