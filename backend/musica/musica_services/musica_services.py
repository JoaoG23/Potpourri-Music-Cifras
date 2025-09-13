from app import db
from musica.musica_model.musica_model import Musica
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from musica.musica_services.search_music_by_url.search_music_by_url import search_music_by_url
import re
from typing import Dict

class MusicaService:
    
    ### Criar regex para extrair o artista e o nome da música ex: Agua de Chuva No Mar - Beth Carvalho - Cifra Club
    @staticmethod
    def _extract_artist_and_name(title):
        # Regex corrigida: captura tudo até o primeiro " - " (nome da música), depois tudo até o segundo " - " (artista)
        regex = r'^(.+?) - (.+?) - (.+)$'
        match = re.search(regex, title)
        if match:
            return match.group(1).strip(), match.group(2).strip()  # nome da música, artista
        return None, None

    
    @staticmethod
    def create_musica(data):
        link_musica = data.get('link_musica')
        
        MusicaService._validate_exists_music_in_app(link_musica)
        
        search_music: Dict = search_music_by_url(link_musica)
        
        if not search_music:
            raise Exception("Cifra não encontrada")
        
        title_music: str = search_music.get('titulo')
        nome, artista = MusicaService._extract_artist_and_name(title_music)
        """Create a new musica"""
        try:
            musica = Musica(
                nome=nome,
                artista=artista,
                link_musica=data.get('link_musica'),
                cifra=search_music.get('cifra')
            )
            
            db.session.add(musica)
            db.session.commit()
            return musica
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao criar música: {str(e)}")
    
    @staticmethod
    def get_all_musicas(page=1, per_page=10):
        """Get all musicas with pagination"""
        try:
            paginated_musicas = Musica.query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_musicas
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar músicas: {str(e)}")
    
    @staticmethod
    def get_musica_by_id(musica_id):
        """Get musica by ID"""
        try:
            musica = Musica.query.get(musica_id)
            if not musica:
                raise Exception("Música não encontrada")
            return musica
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar música: {str(e)}")
    
    
    @staticmethod
    def search_musicas_by_name(search_term, page=1, per_page=10):
        """Search musicas by name"""
        try:
            paginated_musicas = Musica.query.filter(
                or_(
                    Musica.nome.ilike(f'%{search_term}%'),
                    Musica.artista.ilike(f'%{search_term}%')
                )
            ).paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            return paginated_musicas
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao buscar músicas: {str(e)}")
    
    @staticmethod
    def update_musica(musica_id, data):
        """Update musica by ID"""
        try:
            musica = Musica.query.get(musica_id)
            if not musica:
                raise Exception("Música não encontrada")
            
            # Update fields if provided
            musica.nome = data['nome']
            musica.artista = data['artista']
            musica.link_musica = data['link_musica']
            musica.cifra = data['cifra']
            musica.velocidade_rolamento = data['velocidade_rolamento']
            
            db.session.commit()
            return musica
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao atualizar música: {str(e)}")
    
    @staticmethod
    def delete_musica(musica_id):
        """Delete musica by ID"""
        try:
            musica = Musica.query.get(musica_id)
            if not musica:
                raise Exception("Música não encontrada")
            
            db.session.delete(musica)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f"Erro ao deletar música: {str(e)}")
    
    @staticmethod
    def get_musicas_count():
        """Get total count of musicas"""
        try:
            return Musica.query.count()
        except SQLAlchemyError as e:
            raise Exception(f"Erro ao contar músicas: {str(e)}")
    
    @staticmethod
    def _validate_exists_music_in_app(link_musica):
        musica = Musica.query.filter_by(link_musica=link_musica).first()
        if musica:
            raise Exception("Música já existe no banco de dados")
     