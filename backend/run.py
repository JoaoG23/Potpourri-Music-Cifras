from app import app     
import os
from dotenv import load_dotenv
load_dotenv()

FLAG_ENV = os.getenv("FLAG_ENV", "dev")

if __name__ == '__main__':
    print("Ambiente iniciado: ", FLAG_ENV)  
    print("Iniciando o servidor... Potpourri Music API")
    app.run( host='0.0.0.0', port=5000, debug=True)
