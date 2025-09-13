from datetime import datetime
from app import db

class MusicasPotpourri(db.Model):
    __tablename__ = 'musicas_potpourri'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    potpourri_id = db.Column(db.Integer, db.ForeignKey('potpourri.id'), nullable=False)
    musica_id = db.Column(db.Integer, db.ForeignKey('musicas.id'), nullable=False)
    ordem_tocagem = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<MusicasPotpourri potpourri_id={self.potpourri_id} musica_id={self.musica_id} ordem={self.ordem_tocagem}>'
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'potpourri_id': self.potpourri_id,
            'musica_id': self.musica_id,
            'ordem_tocagem': self.ordem_tocagem,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
