from flask import Blueprint, request, jsonify
from extensions import db
from models import Exercise
from schemas import ExerciseSchema
from flask_jwt_extended import jwt_required
from controllers.decorators import admin_required

exercises_bp = Blueprint('exercises', __name__, url_prefix='/api/exercises')

exercise_schema = ExerciseSchema()
exercises_schema = ExerciseSchema(many=True)


@exercises_bp.route('', methods=['GET'])
@jwt_required()
def list_exercises():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    muscle_group_id = request.args.get('muscle_group_id', type=int)

    query = Exercise.query
    if muscle_group_id:
        query = query.filter_by(muscle_group_id=muscle_group_id)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "data": exercises_schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages
    }), 200


@exercises_bp.route('', methods=['POST'])
@admin_required
def create_exercise():
    data = request.get_json()
    exercise = Exercise(
        name=data.get('name'),
        description=data.get('description'),
        equipment=data.get('equipment'),
        muscle_group_id=data.get('muscle_group_id')
    )
    db.session.add(exercise)
    db.session.commit()
    return jsonify(exercise_schema.dump(exercise)), 201


@exercises_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    return jsonify(exercise_schema.dump(exercise)), 200


@exercises_bp.route('/<int:id>', methods=['PATCH'])
@admin_required
def update_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    data = request.get_json()
    for field in ['name', 'description', 'equipment', 'muscle_group_id']:
        if field in data:
            setattr(exercise, field, data[field])
    db.session.commit()
    return jsonify(exercise_schema.dump(exercise)), 200


@exercises_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    db.session.delete(exercise)
    db.session.commit()
    return '', 204