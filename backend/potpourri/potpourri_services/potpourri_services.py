from app import db
from potpourri.potpourri_model.potpourri_model import Potpourri
from musicas_potpourri.musicas_potpourri_model.musicas_potpourri_model import MusicasPotpourri
from musicas_potpourri.musicas_potpourri_services.musicas_potpourri_services import MusicasPotpourriService
from musica.musica_model.musica_model import Musica
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from typing import Dict, Any, Optional, List

class PotpourriService:
    
    @staticmethod
    def create_potpourri(data: Dict[str, Any]) -> Potpourri:
        """Create a new potpourri"""
        try:
            if not data.get('nome_potpourri'):
                raise Exception("Nome do potpourri é obrigatório")
            
            potpourri = Potpourri(
                nome_potpourri=data.get('nome_potpourri')
            )
            
            db.session.add(potpourri)
            db.session.commit()
            return potpourri
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao criar potpourri: {str(e)}")
    
    @staticmethod
    def get_all_potpourri(page: int = 1, per_page: int = 10) -> Any:
        """Get all potpourri with pagination"""
        try:
            paginated_potpourri = Potpourri.query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_potpourri
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar potpourri: {str(e)}")
    
    @staticmethod
    def get_potpourri_by_id(potpourri_id: int) -> Potpourri:
        """Get potpourri by ID"""
        try:
            potpourri = Potpourri.query.get(potpourri_id)
            if not potpourri:
                raise Exception("Potpourri não encontrado")
            return potpourri
        
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar potpourri: {str(e)}")
    
    @staticmethod
    def search_potpourri_by_name(search_term: str, page: int = 1, per_page: int = 10) -> Any:
        """Search potpourri by name"""
        try:
            paginated_potpourri = Potpourri.query.filter(
                Potpourri.nome_potpourri.ilike(f'%{search_term}%')
            ).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_potpourri
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar potpourri: {str(e)}")
    
    @staticmethod
    def update_potpourri(potpourri_id: int, data: Dict[str, Any]) -> Potpourri:
        """Update potpourri by ID"""
        try:
            potpourri = Potpourri.query.get(potpourri_id)
            if not potpourri:
                raise Exception("Potpourri não encontrado")
            
            if data.get('nome_potpourri'):
                potpourri.nome_potpourri = data['nome_potpourri']
            
            db.session.commit()
            return potpourri
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao atualizar potpourri: {str(e)}")
    
    @staticmethod
    def delete_potpourri(potpourri_id: int) -> bool:
        """Delete potpourri by ID"""
        try:
            potpourri = Potpourri.query.get(potpourri_id)
            if not potpourri:
                raise Exception("Potpourri não encontrado")
            
            db.session.delete(potpourri)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao deletar potpourri: {str(e)}")
    
    
    @staticmethod
    def _validate_potpourri_data(data: Dict[str, Any]) -> None:
        if not data.get('nome_potpourri'):
            raise Exception("Nome do potpourri é obrigatório")
        if not data.get('musicas_potpourri'):
            raise Exception("Lista de músicas é obrigatória")
        if not isinstance(data.get('musicas_potpourri'), list):
            raise Exception("musicas_potpourri deve ser uma lista")
        if len(data['musicas_potpourri']) == 0:
            raise Exception("Lista de músicas não pode estar vazia")

    @staticmethod
    def _validate_musicas_potpourri_data(potpourri_data: Dict[str, Any]) -> None:
        for i, musica_data in enumerate(potpourri_data['musicas_potpourri']):
            if not isinstance(musica_data, dict):
                raise Exception(f"Item {i+1} da lista deve ser um objeto")

            if not musica_data.get('musica_id'):
                raise Exception(f"musica_id é obrigatório para a música {i+1}")

            if not musica_data.get('ordem_tocagem'):
                raise Exception(f"ordem_tocagem é obrigatória para a música {i+1}")


    @staticmethod
    def create_potpourri_and_include_musics(potpourri_data: Dict[str, Any]) -> Dict[str, Any]:
 
        try:
            # Validate required fields
            PotpourriService._validate_potpourri_data(potpourri_data)
            PotpourriService._validate_musicas_potpourri_data(potpourri_data)
   
            ordens = [m['ordem_tocagem'] for m in potpourri_data['musicas_potpourri']]
            if len(ordens) != len(set(ordens)):
                raise Exception("Ordens de tocagem devem ser únicas")
            
            # Create potpourri
            potpourri = Potpourri(nome_potpourri=potpourri_data['nome_potpourri'])
            db.session.add(potpourri)
            db.session.flush()  # To get the ID without committing
            
            # Create musicas_potpourri relationships using existing service
            musicas_potpourri_list: List[MusicasPotpourri] = []
            for musica_data in potpourri_data['musicas_potpourri']:
                # Prepare data for existing create_musicas_potpourri function
                musica_potpourri_data = {
                    'potpourri_id': potpourri.id,
                    'musica_id': musica_data['musica_id'],
                    'ordem_tocagem': musica_data['ordem_tocagem']
                }
                
                # Use existing service function
                musicas_potpourri = MusicasPotpourriService.create_musicas_potpourri(musica_potpourri_data)
                musicas_potpourri_list.append(musicas_potpourri)
            
            return {
                'potpourri': potpourri.to_dict(),
                'musicas_potpourri': [mp.to_dict() for mp in musicas_potpourri_list],
                'total_musicas': len(musicas_potpourri_list)
            }
            
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao criar potpourri com músicas: {str(e)}")
