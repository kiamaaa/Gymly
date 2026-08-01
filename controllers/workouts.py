from datetime import datetime
from flask import Blueprint, request, jsonify
from extensions import db
from models import Workout, WorkoutExercise
from schemas import WorkoutSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

workouts_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')

workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)


@workouts_bp.route('', methods=['GET'])
@jwt_required()
def list_workouts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    pagination = (
        Workout.query.filter_by(user_id=user_id)
        .order_by(Workout.date.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "data": workouts_schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages
    }), 200


@workouts_bp.route('', methods=['POST'])
@jwt_required()
def create_workout():
    user_id = get_jwt_identity()
    data = request.get_json()

    workout = Workout(
        user_id=user_id,
        name=data.get('name'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date(),
        total_duration=data.get('total_duration')
    )
    db.session.add(workout)
    db.session.flush()  # so workout.id is available before commit

    for ex in data.get('exercises', []):
        db.session.add(WorkoutExercise(
            workout_id=workout.id,
            exercise_id=ex.get('exercise_id'),
            sets=ex.get('sets'),
            reps=ex.get('reps'),
            weight_used=ex.get('weight_used'),
            time_taken=ex.get('time_taken'),
            calories_burned=ex.get('calories_burned')
        ))

    db.session.commit()
    return jsonify(workout_schema.dump(workout)), 201


@workouts_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    return jsonify(workout_schema.dump(workout)), 200


@workouts_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    data = request.get_json()
    workout.name = data.get('name', workout.name)
    if data.get('date'):
        workout.date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    workout.total_duration = data.get('total_duration', workout.total_duration)
    db.session.commit()
    return jsonify(workout_schema.dump(workout)), 200


@workouts_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    db.session.delete(workout)
    db.session.commit()
    return '', 204