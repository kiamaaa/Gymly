from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from extensions import db
from models import WorkoutExercise, Workout, Exercise, MuscleGroup, FitnessProfile
from flask_jwt_extended import jwt_required, get_jwt_identity

stats_bp = Blueprint('stats', __name__, url_prefix='/api')


@stats_bp.route('/exercises/<int:exercise_id>/progress', methods=['GET'])
@jwt_required()
def exercise_progress(exercise_id):
    """Progressive overload trend: weight/reps/sets for one exercise, over time, for the current user."""
    user_id = get_jwt_identity()
    rows = (
        db.session.query(Workout.date, WorkoutExercise.weight_used, WorkoutExercise.reps, WorkoutExercise.sets)
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .filter(Workout.user_id == user_id, WorkoutExercise.exercise_id == exercise_id)
        .order_by(Workout.date.asc())
        .all()
    )
    return jsonify([
        {"date": r.date.isoformat(), "weight_used": r.weight_used, "reps": r.reps, "sets": r.sets}
        for r in rows
    ]), 200


@stats_bp.route('/stats/weekly', methods=['GET'])
@jwt_required()
def weekly_stats():
    """Aggregated totals (calories, time) over the last 7 days for the current user."""
    user_id = get_jwt_identity()
    since = datetime.utcnow().date() - timedelta(days=7)

    result = (
        db.session.query(
            func.sum(WorkoutExercise.calories_burned).label('total_calories'),
            func.sum(WorkoutExercise.time_taken).label('total_time')
        )
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .filter(Workout.user_id == user_id, Workout.date >= since)
        .first()
    )

    return jsonify({
        "total_calories_burned": result.total_calories or 0,
        "total_time_seconds": result.total_time or 0
    }), 200


@stats_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def recommendations():
    """Muscle groups the current user hasn't trained in the last N days (default 7)."""
    user_id = get_jwt_identity()
    days = request.args.get('days', 7, type=int)
    since = datetime.utcnow().date() - timedelta(days=days)

    trained_group_ids = (
        db.session.query(Exercise.muscle_group_id)
        .join(WorkoutExercise, WorkoutExercise.exercise_id == Exercise.id)
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .filter(Workout.user_id == user_id, Workout.date >= since)
        .distinct()
    )

    untrained = MuscleGroup.query.filter(~MuscleGroup.id.in_(trained_group_ids)).all()

    return jsonify([{"id": mg.id, "name": mg.name} for mg in untrained]), 200


@stats_bp.route('/rank', methods=['GET'])
@jwt_required()
def rank():
    """Total lifetime training volume (sets x reps x weight) mapped to a rank tier."""
    user_id = get_jwt_identity()

    total_volume = (
        db.session.query(
            func.sum(WorkoutExercise.sets * WorkoutExercise.reps * WorkoutExercise.weight_used)
        )
        .join(Workout, WorkoutExercise.workout_id == Workout.id)
        .filter(Workout.user_id == user_id)
        .scalar()
    ) or 0

    if total_volume < 5000:
        tier = "Bronze"
    elif total_volume < 20000:
        tier = "Silver"
    elif total_volume < 50000:
        tier = "Gold"
    else:
        tier = "Platinum"

    profile = FitnessProfile.query.filter_by(user_id=user_id).first()
    if profile:
        profile.current_rank = tier
        db.session.commit()

    return jsonify({"total_volume": total_volume, "rank": tier}), 200