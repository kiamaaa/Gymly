from flask import Blueprint, request, jsonify
from extensions import db
from models import MuscleGroup
from schemas import MuscleGroupSchema
from flask_jwt_extended import jwt_required
from controllers.decorators import admin_required

muscle_groups_bp = Blueprint('muscle_groups', __name__, url_prefix='/api/muscle-groups')

muscle_group_schema = MuscleGroupSchema()
muscle_groups_schema = MuscleGroupSchema(many=True)


@muscle_groups_bp.route('', methods=['GET'])
@jwt_required()
def list_muscle_groups():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    pagination = MuscleGroup.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "data": muscle_groups_schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages
    }), 200


@muscle_groups_bp.route('', methods=['POST'])
@admin_required
def create_muscle_group():
    data = request.get_json()
    mg = MuscleGroup(name=data.get('name'))
    db.session.add(mg)
    db.session.commit()
    return jsonify(muscle_group_schema.dump(mg)), 201


@muscle_groups_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_muscle_group(id):
    mg = MuscleGroup.query.get_or_404(id)
    return jsonify(muscle_group_schema.dump(mg)), 200


@muscle_groups_bp.route('/<int:id>', methods=['PATCH'])
@admin_required
def update_muscle_group(id):
    mg = MuscleGroup.query.get_or_404(id)
    data = request.get_json()
    mg.name = data.get('name', mg.name)
    db.session.commit()
    return jsonify(muscle_group_schema.dump(mg)), 200


@muscle_groups_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_muscle_group(id):
    mg = MuscleGroup.query.get_or_404(id)
    db.session.delete(mg)
    db.session.commit()
    return '', 204