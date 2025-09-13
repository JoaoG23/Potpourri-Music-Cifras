from datetime import datetime
from app import db

class Potpourri(db.Model):
    __tablename__ = 'potpourri'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_potpourri = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Potpourri {self.nome_potpourri}>'
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'nome_potpourri': self.nome_potpourri,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
