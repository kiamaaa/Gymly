from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

from controllers.muscle_group_controller import MuscleGroupController
from controllers.exercise_controller import ExerciseController
from controllers.user_controller import UserController
from controllers.fitness_profile_controller import FitnessProfileController
from controllers.workout_controller import WorkoutController
from controllers.progress_log_controller import ProgressLogController

from schemas import (
    MuscleGroupSchema, ExerciseSchema, WorkoutSchema, ProgressLogSchema, FitnessProfileSchema
)
from models.user import User

muscle_group_schema = MuscleGroupSchema()
muscle_groups_schema = MuscleGroupSchema(many=True)
exercise_schema = ExerciseSchema()
exercises_schema = ExerciseSchema(many=True)
workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)
progress_log_schema = ProgressLogSchema()
progress_logs_schema = ProgressLogSchema(many=True)
fitness_profile_schema = FitnessProfileSchema()


def paginated_response(pagination, schema):
    return {
        "data": schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages,
    }


def is_admin():
    user = User.query.get(get_jwt_identity())
    return user is not None and user.role == "admin"


def register_routes(app):

    
    @app.route("/api/register", methods=["POST"])
    def register():
        data = request.get_json()
        user = UserController.register(data)
        if not user:
            return jsonify({"error": "username or email already taken"}), 409
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "role": user.role}}), 201

    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.get_json()
        user = UserController.authenticate(data.get("email"), data.get("password"))
        if not user:
            return jsonify({"error": "invalid email or password"}), 401
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "role": user.role}}), 200

    
    @app.route("/api/muscle-groups", methods=["GET"])
    @jwt_required()
    def list_muscle_groups():
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        pagination = MuscleGroupController.get_all(page, per_page)
        return jsonify(paginated_response(pagination, muscle_groups_schema)), 200

    @app.route("/api/muscle-groups", methods=["POST"])
    @jwt_required()
    def create_muscle_group():
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        mg = MuscleGroupController.create(request.get_json())
        return jsonify(muscle_group_schema.dump(mg)), 201

    @app.route("/api/muscle-groups/<int:id>", methods=["PATCH"])
    @jwt_required()
    def update_muscle_group(id):
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        mg = MuscleGroupController.update(id, request.get_json())
        if not mg:
            return jsonify({"error": "not found"}), 404
        return jsonify(muscle_group_schema.dump(mg)), 200

    @app.route("/api/muscle-groups/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_muscle_group(id):
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        if not MuscleGroupController.delete(id):
            return jsonify({"error": "not found"}), 404
        return "", 204

    
    @app.route("/api/exercises", methods=["GET"])
    @jwt_required()
    def list_exercises():
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        muscle_group_id = request.args.get("muscle_group_id", type=int)
        pagination = ExerciseController.get_all(page, per_page, muscle_group_id)
        return jsonify(paginated_response(pagination, exercises_schema)), 200

    @app.route("/api/exercises", methods=["POST"])
    @jwt_required()
    def create_exercise():
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        exercise = ExerciseController.create(request.get_json())
        return jsonify(exercise_schema.dump(exercise)), 201

    @app.route("/api/exercises/<int:id>", methods=["GET"])
    @jwt_required()
    def get_exercise(id):
        exercise = ExerciseController.get_by_id(id)
        if not exercise:
            return jsonify({"error": "not found"}), 404
        return jsonify(exercise_schema.dump(exercise)), 200

    @app.route("/api/exercises/<int:id>", methods=["PATCH"])
    @jwt_required()
    def update_exercise(id):
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        exercise = ExerciseController.update(id, request.get_json())
        if not exercise:
            return jsonify({"error": "not found"}), 404
        return jsonify(exercise_schema.dump(exercise)), 200

    @app.route("/api/exercises/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_exercise(id):
        if not is_admin():
            return jsonify({"error": "admins only"}), 403
        if not ExerciseController.delete(id):
            return jsonify({"error": "not found"}), 404
        return "", 204

    
    @app.route("/api/profile", methods=["GET"])
    @jwt_required()
    def get_profile():
        profile = FitnessProfileController.get_by_user(get_jwt_identity())
        if not profile:
            return jsonify({"error": "no profile yet"}), 404
        return jsonify(fitness_profile_schema.dump(profile)), 200

    @app.route("/api/profile", methods=["POST"])
    @jwt_required()
    def create_profile():
        profile = FitnessProfileController.create(get_jwt_identity(), request.get_json())
        return jsonify(fitness_profile_schema.dump(profile)), 201

    @app.route("/api/profile", methods=["PATCH"])
    @jwt_required()
    def update_profile():
        profile = FitnessProfileController.update(get_jwt_identity(), request.get_json())
        return jsonify(fitness_profile_schema.dump(profile)), 200

    
    @app.route("/api/workouts", methods=["GET"])
    @jwt_required()
    def list_workouts():
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        pagination = WorkoutController.get_all_for_user(get_jwt_identity(), page, per_page)
        return jsonify(paginated_response(pagination, workouts_schema)), 200

    @app.route("/api/workouts", methods=["POST"])
    @jwt_required()
    def create_workout():
        workout = WorkoutController.create(get_jwt_identity(), request.get_json())
        return jsonify(workout_schema.dump(workout)), 201

    @app.route("/api/workouts/<int:id>", methods=["GET"])
    @jwt_required()
    def get_workout(id):
        workout = WorkoutController.get_by_id(id, get_jwt_identity())
        if not workout:
            return jsonify({"error": "not found"}), 404
        return jsonify(workout_schema.dump(workout)), 200

    @app.route("/api/workouts/<int:id>", methods=["PATCH"])
    @jwt_required()
    def update_workout(id):
        workout = WorkoutController.update(id, get_jwt_identity(), request.get_json())
        if not workout:
            return jsonify({"error": "not found"}), 404
        return jsonify(workout_schema.dump(workout)), 200

    @app.route("/api/workouts/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_workout(id):
        if not WorkoutController.delete(id, get_jwt_identity()):
            return jsonify({"error": "not found"}), 404
        return "", 204


    @app.route("/api/progress-logs", methods=["GET"])
    @jwt_required()
    def list_progress_logs():
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        pagination = ProgressLogController.get_all_for_user(get_jwt_identity(), page, per_page)
        return jsonify(paginated_response(pagination, progress_logs_schema)), 200

    @app.route("/api/progress-logs", methods=["POST"])
    @jwt_required()
    def create_progress_log():
        log = ProgressLogController.create(get_jwt_identity(), request.get_json())
        return jsonify(progress_log_schema.dump(log)), 201

    @app.route("/api/progress-logs/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_progress_log(id):
        if not ProgressLogController.delete(id, get_jwt_identity()):
            return jsonify({"error": "not found"}), 404
        return "", 204

    
    @app.route("/api/exercises/<int:exercise_id>/progress", methods=["GET"])
    @jwt_required()
    def exercise_progress(exercise_id):
        data = WorkoutController.get_exercise_progress(get_jwt_identity(), exercise_id)
        return jsonify(data), 200

    @app.route("/api/stats/weekly", methods=["GET"])
    @jwt_required()
    def weekly_stats():
        data = WorkoutController.get_weekly_stats(get_jwt_identity())
        return jsonify(data), 200

    @app.route("/api/recommendations", methods=["GET"])
    @jwt_required()
    def recommendations():
        data = WorkoutController.get_recommendations(get_jwt_identity())
        return jsonify(data), 200

    @app.route("/api/rank", methods=["GET"])
    @jwt_required()
    def rank():
        data = WorkoutController.get_rank(get_jwt_identity())
        return jsonify(data), 200