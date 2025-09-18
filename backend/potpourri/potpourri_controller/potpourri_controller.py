from flask import Blueprint, jsonify, request
from potpourri.potpourri_services.potpourri_services import PotpourriService
from typing import Dict, Any

potpourri_bp = Blueprint('potpourri_bp', __name__)


@potpourri_bp.route('/', methods=['POST'])
def create_potpourri():
    """Create a new potpourri"""
    try:
        data: Dict[str, Any] = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        potpourri = PotpourriService.create_potpourri(data)
        return jsonify({
            'message': 'Potpourri criado com sucesso',
            'potpourri': potpourri.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/', methods=['GET'])
def get_all_potpourri():
    """Get all potpourri with pagination"""
    try:
        page: int = request.args.get('page', 1, type=int)
        per_page: int = request.args.get('per_page', 10, type=int)
        search: str = request.args.get('search', '')
        
        if search:
            paginated_potpourri = PotpourriService.search_potpourri_by_name(search, page, per_page)
        else:
            paginated_potpourri = PotpourriService.get_all_potpourri(page, per_page)
        
        potpourri_list = [potpourri.to_dict() for potpourri in paginated_potpourri.items]
        
        return jsonify({
            'potpourri': potpourri_list,
            'pagination': {
                'page': paginated_potpourri.page,
                'pages': paginated_potpourri.pages,
                'per_page': paginated_potpourri.per_page,
                'total': paginated_potpourri.total,
                'has_next': paginated_potpourri.has_next,
                'has_prev': paginated_potpourri.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/<int:potpourri_id>', methods=['GET'])
def get_potpourri_by_id(potpourri_id: int):
    """Get potpourri by ID"""
    try:
        potpourri = PotpourriService.get_potpourri_by_id(potpourri_id)
        return jsonify({
            'potpourri': potpourri.to_dict()
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/<int:potpourri_id>', methods=['PUT'])
def update_potpourri(potpourri_id: int):
    """Update potpourri by ID"""
    try:
        data: Dict[str, Any] = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        potpourri = PotpourriService.update_potpourri(potpourri_id, data)
        return jsonify({
            'message': 'Potpourri atualizado com sucesso',
            'potpourri': potpourri.to_dict()
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/<int:potpourri_id>', methods=['DELETE'])
def delete_potpourri(potpourri_id: int):
    """Delete potpourri by ID"""
    try:
        PotpourriService.delete_potpourri(potpourri_id)
        return jsonify({
            'message': 'Potpourri deletado com sucesso'
        })
        
    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/search', methods=['GET'])
def search_potpourri():
    """Search potpourri by name"""
    try:
        search_term: str = request.args.get('q', '')
        page: int = request.args.get('page', 1, type=int)
        per_page: int = request.args.get('per_page', 10, type=int)
        
        if not search_term:
            return jsonify({'message': 'Termo de busca é obrigatório'}), 400
        
        paginated_potpourri = PotpourriService.search_potpourri_by_name(search_term, page, per_page)
        potpourri_list = [potpourri.to_dict() for potpourri in paginated_potpourri.items]
        
        return jsonify({
            'potpourri': potpourri_list,
            'search_term': search_term,
            'pagination': {
                'page': paginated_potpourri.page,
                'pages': paginated_potpourri.pages,
                'per_page': paginated_potpourri.per_page,
                'total': paginated_potpourri.total,
                'has_next': paginated_potpourri.has_next,
                'has_prev': paginated_potpourri.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/create-with-musics', methods=['POST'])
def create_potpourri_with_musics():
    """Create potpourri with multiple musicas in bulk"""
    try:
        data: Dict[str, Any] = request.get_json()
        
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
        
        result = PotpourriService.create_potpourri_and_include_musics(data)
        return jsonify({
            'message': 'Potpourri criado com músicas com sucesso',
            'data': result
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@potpourri_bp.route('/<int:potpourri_id>/replace-musics', methods=['PUT'])
def update_potpourri_replace_musics(potpourri_id: int):
    """Replace all musics of a potpourri with the provided list (optionally update name)"""
    try:
        data: Dict[str, Any] = request.get_json()

        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400

        result = PotpourriService.update_potpourri_and_replace_musics(potpourri_id, data)
        return jsonify({
            'message': 'Potpourri atualizado e músicas substituídas com sucesso',
            'data': result
        })

    except Exception as e:
        if "não encontrado" in str(e):
            return jsonify({'message': str(e)}), 404
        return jsonify({'message': str(e)}), 500
