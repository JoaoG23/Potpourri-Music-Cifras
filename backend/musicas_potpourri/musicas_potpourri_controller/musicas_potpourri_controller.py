from flask import Blueprint, jsonify, request
from musicas_potpourri.musicas_potpourri_services.musicas_potpourri_services import MusicasPotpourriService
from typing import Dict, Any

musicas_potpourri_bp = Blueprint('musicas_potpourri_bp', __name__)


@musicas_potpourri_bp.route('/', methods=['POST'])
def create_musicas_potpourri():
    """Create a new musicas_potpourri relationship"""
    try:
        data: Dict[str, Any] = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        musicas_potpourri = MusicasPotpourriService.create_musicas_potpourri(data)
        return jsonify({
            'message': 'Relacionamento música-potpourri criado com sucesso',
            'musicas_potpourri': musicas_potpourri.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@musicas_potpourri_bp.route('/', methods=['GET'])
def get_all_musicas_potpourri():
    """Get all musicas_potpourri with pagination"""
    try:
        page: int = request.args.get('page', 1, type=int)
        per_page: int = request.args.get('per_page', 10, type=int)
        
        paginated_musicas_potpourri = MusicasPotpourriService.get_all_musicas_potpourri(page, per_page)
        musicas_potpourri_list = [mp.to_dict() for mp in paginated_musicas_potpourri.items]
        
        return jsonify({
            'musicas_potpourri': musicas_potpourri_list,
            'pagination': {
                'page': paginated_musicas_potpourri.page,
                'pages': paginated_musicas_potpourri.pages,
                'per_page': paginated_musicas_potpourri.per_page,
                'total': paginated_musicas_potpourri.total,
                'has_next': paginated_musicas_potpourri.has_next,
                'has_prev': paginated_musicas_potpourri.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@musicas_potpourri_bp.route('/<int:musicas_potpourri_id>', methods=['GET'])
def get_musicas_potpourri_by_id(musicas_potpourri_id: int):
    """Get musicas_potpourri by ID"""
    try:
        musicas_potpourri = MusicasPotpourriService.get_musicas_potpourri_by_id(musicas_potpourri_id)
        return jsonify({
            'musicas_potpourri': musicas_potpourri.to_dict()
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@musicas_potpourri_bp.route('/by-potpourri/<int:potpourri_id>', methods=['GET'])
def get_musicas_by_potpourri_id(potpourri_id: int):
    """Get all musicas for a specific potpourri"""
    try:
        page: int = request.args.get('page', 1, type=int)
        per_page: int = request.args.get('per_page', 10, type=int)
        
        paginated_musicas_potpourri = MusicasPotpourriService.get_musicas_by_potpourri_id(
            potpourri_id, page, per_page
        )
        musicas_potpourri_list = [mp.to_dict() for mp in paginated_musicas_potpourri.items]
        
        return jsonify({
            'potpourri_id': potpourri_id,
            'musicas_potpourri': musicas_potpourri_list,
            'pagination': {
                'page': paginated_musicas_potpourri.page,
                'pages': paginated_musicas_potpourri.pages,
                'per_page': paginated_musicas_potpourri.per_page,
                'total': paginated_musicas_potpourri.total,
                'has_next': paginated_musicas_potpourri.has_next,
                'has_prev': paginated_musicas_potpourri.has_prev
            }
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@musicas_potpourri_bp.route('/<int:musicas_potpourri_id>', methods=['PUT'])
def update_musicas_potpourri(musicas_potpourri_id: int):
    """Update musicas_potpourri by ID"""
    try:
        data: Dict[str, Any] = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        musicas_potpourri = MusicasPotpourriService.update_musicas_potpourri(musicas_potpourri_id, data)
        return jsonify({
            'message': 'Relacionamento música-potpourri atualizado com sucesso',
            'musicas_potpourri': musicas_potpourri.to_dict()
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@musicas_potpourri_bp.route('/<int:musicas_potpourri_id>', methods=['DELETE'])
def delete_musicas_potpourri(musicas_potpourri_id: int):
    """Delete musicas_potpourri by ID"""
    try:
        MusicasPotpourriService.delete_musicas_potpourri(musicas_potpourri_id)
        return jsonify({
            'message': 'Relacionamento música-potpourri deletado com sucesso'
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500
