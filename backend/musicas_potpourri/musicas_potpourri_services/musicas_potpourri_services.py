from app import db
from musicas_potpourri.musicas_potpourri_model.musicas_potpourri_model import MusicasPotpourri
from potpourri.potpourri_model.potpourri_model import Potpourri
from musica.musica_model.musica_model import Musica
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from typing import Dict, Any, Optional

class MusicasPotpourriService:
    
    @staticmethod
    def _vaildate_data(data: Dict[str, Any]) -> None:
        if not data.get('potpourri_id'):
            raise Exception("ID do potpourri é obrigatório")
        if not data.get('musica_id'):
            raise Exception("ID da música é obrigatório")
        if not data.get('ordem_tocagem'):
            raise Exception("Ordem de tocagem é obrigatória")
    @staticmethod
    def create_musicas_potpourri(data: Dict[str, Any]) -> MusicasPotpourri:
        """Create a new musicas_potpourri relationship"""
        try:
            MusicasPotpourriService._vaildate_data(data)

            MusicasPotpourriService._vefify_if_exists_potpourri(data.get('potpourri_id'))
            MusicasPotpourriService._vefify_if_exists_music(data.get('musica_id'))
            
            
            musicas_potpourri = MusicasPotpourri(
                potpourri_id=data.get('potpourri_id'),
                musica_id=data.get('musica_id'),
                ordem_tocagem=data.get('ordem_tocagem')
            )
            
            db.session.add(musicas_potpourri)
            db.session.commit()
            return musicas_potpourri
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao criar relacionamento música-potpourri: {str(e)}")
    
    @staticmethod
    def get_all_musicas_potpourri(page: int = 1, per_page: int = 10) -> Any:
        """Get all musicas_potpourri with pagination"""
        try:
            paginated_musicas_potpourri = MusicasPotpourri.query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_musicas_potpourri
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar relacionamentos música-potpourri: {str(e)}")
    
    @staticmethod
    def get_musicas_potpourri_by_id(musicas_potpourri_id: int) -> MusicasPotpourri:
        """Get musicas_potpourri by ID"""
        try:
            musicas_potpourri = MusicasPotpourri.query.get(musicas_potpourri_id)
            if not musicas_potpourri:
                raise Exception("Relacionamento música-potpourri não encontrado")
            return musicas_potpourri
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar relacionamento música-potpourri: {str(e)}")
    
    @staticmethod
    def get_musicas_by_potpourri_id(potpourri_id: int, page: int = 1, per_page: int = 10) -> Any:
        """Get all musicas for a specific potpourri"""
        try:
            # Validate if potpourri exists
            potpourri = Potpourri.query.get(potpourri_id)
            if not potpourri:
                raise Exception("Potpourri não encontrado")
            
            paginated_musicas_potpourri = MusicasPotpourri.query.filter_by(
                potpourri_id=potpourri_id
            ).order_by(MusicasPotpourri.ordem_tocagem).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_musicas_potpourri
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar músicas do potpourri: {str(e)}")
    
    @staticmethod
    def _vefify_if_exists_music(musica_id: int) -> None:
        musica = Musica.query.get(musica_id)
        if not musica:
            raise Exception("Música não encontrada")
        
    @staticmethod
    def _vefify_if_exists_potpourri(potpourri_id: int) -> None:
        potpourri = Potpourri.query.get(potpourri_id)
        if not potpourri:
            raise Exception("Potpourri não encontrado")
        
    @staticmethod
    def _vefify_if_exists_relation_between_music_and_potpourri(musicas_potpourri_id: int) -> None:
        musicas_potpourri = MusicasPotpourri.query.get(musicas_potpourri_id)
        if not musicas_potpourri:
            raise Exception("Relacionamento música-potpourri não encontrado")
        
    @staticmethod
    def update_musicas_potpourri(musicas_potpourri_id: int, data: Dict[str, Any]) -> MusicasPotpourri:
        """Update musicas_potpourri by ID"""
        try:
            
            MusicasPotpourriService._vefify_if_exists_relation_between_music_and_potpourri(musicas_potpourri_id)
            MusicasPotpourriService._vefify_if_exists_music(data.get('musica_id'))
            MusicasPotpourriService._vefify_if_exists_potpourri(data.get('potpourri_id'))
            
            musicas_potpourri = MusicasPotpourri.query.get(musicas_potpourri_id)
            musicas_potpourri.potpourri_id = data['potpourri_id']
            musicas_potpourri.musica_id = data['musica_id']
            musicas_potpourri.ordem_tocagem = data['ordem_tocagem']

            
            db.session.commit()
            return musicas_potpourri
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao atualizar relacionamento música-potpourri: {str(e)}")
    
    @staticmethod
    def delete_musicas_potpourri(musicas_potpourri_id: int) -> bool:
        """Delete musicas_potpourri by ID"""
        try:
            MusicasPotpourriService._vefify_if_exists_relation_between_music_and_potpourri(musicas_potpourri_id)
            
            musicas_potpourri = MusicasPotpourri.query.get(musicas_potpourri_id)
            db.session.delete(musicas_potpourri)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao deletar relacionamento música-potpourri: {str(e)}")
    
    
