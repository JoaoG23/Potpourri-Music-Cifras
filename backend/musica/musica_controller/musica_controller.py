from flask import Blueprint, jsonify, request
from musica.musica_services.musica_services import MusicaService

musica_bp = Blueprint('musica_bp', __name__)


@musica_bp.route('/', methods=['POST'])
def create_musica():
    """Create a new musica"""
    try:
        data = request.get_json()
    
        musica = MusicaService.create_musica(data)
        return jsonify({
            'message': 'Música criada com sucesso',
            'musica': musica.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@musica_bp.route('/', methods=['GET'])
def get_all_musicas():
    """Get all musicas with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        
        if search:
            paginated_musicas = MusicaService.search_musicas_by_name(search, page, per_page)
        else:
            paginated_musicas = MusicaService.get_all_musicas(page, per_page)
        
        musicas = [musica.to_dict() for musica in paginated_musicas.items]
        
        return jsonify({
            'musicas': musicas,
            'pagination': {
                'page': paginated_musicas.page,
                'pages': paginated_musicas.pages,
                'per_page': paginated_musicas.per_page,
                'total': paginated_musicas.total,
                'has_next': paginated_musicas.has_next,
                'has_prev': paginated_musicas.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@musica_bp.route('/<int:musica_id>', methods=['GET'])
def get_musica_by_id(musica_id):
    """Get musica by ID"""
    try:
        musica = MusicaService.get_musica_by_id(musica_id)
        return jsonify({
            'musica': musica.to_dict()
        })
        
    except Exception as e:
        if "não encontrada" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500

@musica_bp.route('/<int:musica_id>', methods=['PUT'])
def update_musica(musica_id):
    """Update musica by ID"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        musica = MusicaService.update_musica(musica_id, data)
        return jsonify({
            'message': 'Música atualizada com sucesso',
            'musica': musica.to_dict()
        })
        
    except Exception as e:
        if "não encontrada" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500

@musica_bp.route('/<int:musica_id>', methods=['DELETE'])
def delete_musica(musica_id):
    """Delete musica by ID"""
    try:
        MusicaService.delete_musica(musica_id)
        return jsonify({
            'message': 'Música deletada com sucesso'
        })
        
    except Exception as e:
        if "não encontrada" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500

@musica_bp.route('/search', methods=['GET'])
def search_musicas():
    """Search musicas by name or artist"""
    try:
        search_term = request.args.get('q', '')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        if not search_term:
            return jsonify({'message': 'Termo de busca é obrigatório'}), 400
        
        paginated_musicas = MusicaService.search_musicas_by_name(search_term, page, per_page)
        musicas = [musica.to_dict() for musica in paginated_musicas.items]
        
        return jsonify({
            'musicas': musicas,
            'search_term': search_term,
            'pagination': {
                'page': paginated_musicas.page,
                'pages': paginated_musicas.pages,
                'per_page': paginated_musicas.per_page,
                'total': paginated_musicas.total,
                'has_next': paginated_musicas.has_next,
                'has_prev': paginated_musicas.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

