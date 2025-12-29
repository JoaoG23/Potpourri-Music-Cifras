from datetime import datetime
from app import db

class Musica(db.Model):
    __tablename__ = 'musicas'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(255), nullable=True)
    artista = db.Column(db.String(255), nullable=True)
    link_musica = db.Column(db.String(500), nullable=False)
    cifra = db.Column(db.Text, nullable=True)
    velocidade_rolamento = db.Column(db.Float, nullable=True, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Musica {self.nome}>'
    
    def to_dict(self, include_cifra=True):
        """Convert model to dictionary for JSON serialization"""
        data = {
            'id': self.id,
            'nome': self.nome,
            'artista': self.artista,
            'link_musica': self.link_musica,
            'velocidade_rolamento': self.velocidade_rolamento,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_cifra:
            data['cifra'] = self.cifra
        return data
