from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Inicialização das extensões
db = SQLAlchemy()
app = Flask(__name__)