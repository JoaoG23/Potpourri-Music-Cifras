from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

from extensions import app, db

# Disable automatic slash redirects to prevent CORS issues
app.url_map.strict_slashes = False

CORS(app, resources={r"/*": {"origins": "*"}})


# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'postgresql://admin:admin@localhost:5432/potpourri_music'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Import models after db initialization
# from musica.musica_model.musica_model import Musica

# Import and register blueprints
from musica.musica_controller.musica_controller import musica_bp
from potpourri.potpourri_controller.potpourri_controller import potpourri_bp
from musicas_potpourri.musicas_potpourri_controller.musicas_potpourri_controller import musicas_potpourri_bp

app.register_blueprint(musica_bp, url_prefix='/api/musicas')
app.register_blueprint(potpourri_bp, url_prefix='/api/potpourri')
app.register_blueprint(musicas_potpourri_bp, url_prefix='/api/musicas-potpourri')

@app.route('/')
def index():
    return {'message': 'Potpourri Music API', 'status': 'running'}

with app.app_context():
    db.create_all()

