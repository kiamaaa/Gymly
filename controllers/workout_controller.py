from datetime import datetime, timedelta
from sqlalchemy import func
from models.workout import Workout
from models.workout_exercise import WorkoutExercise
from models.exercise import Exercise
from models.muscle_group import MuscleGroup
from models.fitness_profile import FitnessProfile
from extensions import db


class WorkoutController:

    @classmethod
    def get_all_for_user(cls, user_id, page=1, per_page=10):
        return (
            Workout.query.filter_by(user_id=user_id)
            .order_by(Workout.date.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

    @classmethod
    def get_by_id(cls, id, user_id):
        return Workout.query.filter_by(id=id, user_id=user_id).first()

    @classmethod
    def create(cls, user_id, data):
        workout = Workout(
            user_id=user_id,
            name=data["name"],
            date=datetime.strptime(data["date"], "%Y-%m-%d").date(),
            total_duration=data.get("total_duration"),
        )
        db.session.add(workout)
        db.session.flush()

        for ex in data.get("exercises", []):
            db.session.add(WorkoutExercise(
                workout_id=workout.id,
                exercise_id=ex["exercise_id"],
                sets=ex["sets"],
                reps=ex["reps"],
                weight_used=ex["weight_used"],
                time_taken=ex.get("time_taken"),
                calories_burned=ex.get("calories_burned"),
            ))

        db.session.commit()
        return workout

    @classmethod
    def update(cls, id, user_id, data):
        workout = cls.get_by_id(id, user_id)
        if not workout:
            return None
        

        workout.name = data.get("name", workout.name)
        if data.get("date"):
            workout.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        workout.total_duration = data.get("total_duration", workout.total_duration)
        
        
        if "exercises" in data and data["exercises"]:
            for ex_data in data["exercises"]:
                
                existing = WorkoutExercise.query.filter_by(
                    workout_id=workout.id,
                    exercise_id=ex_data["exercise_id"]
                ).first()
                
                if existing:
                    
                    existing.sets = ex_data.get("sets", existing.sets)
                    existing.reps = ex_data.get("reps", existing.reps)
                    existing.weight_used = ex_data.get("weight_used", existing.weight_used)
                    existing.time_taken = ex_data.get("time_taken", existing.time_taken)
                    existing.calories_burned = ex_data.get("calories_burned", existing.calories_burned)
                else:
                    
                    db.session.add(WorkoutExercise(
                        workout_id=workout.id,
                        exercise_id=ex_data["exercise_id"],
                        sets=ex_data["sets"],
                        reps=ex_data["reps"],
                        weight_used=ex_data["weight_used"],
                        time_taken=ex_data.get("time_taken"),
                        calories_burned=ex_data.get("calories_burned"),
                    ))
        
        db.session.commit()
        return workout

    @classmethod
    def delete(cls, id, user_id):
        workout = cls.get_by_id(id, user_id)
        if workout:
            db.session.delete(workout)
            db.session.commit()
            return True
        return False

    @classmethod
    def get_exercise_progress(cls, user_id, exercise_id):
        rows = (
            db.session.query(Workout.date, WorkoutExercise.weight_used, WorkoutExercise.reps, WorkoutExercise.sets)
            .join(WorkoutExercise, WorkoutExercise.workout_id == Workout.id)
            .filter(Workout.user_id == user_id, WorkoutExercise.exercise_id == exercise_id)
            .order_by(Workout.date.asc())
            .all()
        )
        return [
            {"date": r.date.isoformat(), "weight_used": r.weight_used, "reps": r.reps, "sets": r.sets}
            for r in rows
        ]

    @classmethod
    def get_weekly_stats(cls, user_id):
        since = datetime.utcnow().date() - timedelta(days=7)
        result = (
            db.session.query(
                func.sum(WorkoutExercise.calories_burned).label("total_calories"),
                func.sum(WorkoutExercise.time_taken).label("total_time"),
            )
            .join(Workout, WorkoutExercise.workout_id == Workout.id)
            .filter(Workout.user_id == user_id, Workout.date >= since)
            .first()
        )
        return {
            "total_calories_burned": result.total_calories or 0,
            "total_time_seconds": result.total_time or 0,
        }

    @classmethod
    def get_recommendations(cls, user_id, days=7):
        since = datetime.utcnow().date() - timedelta(days=days)
        trained_group_ids = (
            db.session.query(Exercise.muscle_group_id)
            .join(WorkoutExercise, WorkoutExercise.exercise_id == Exercise.id)
            .join(Workout, WorkoutExercise.workout_id == Workout.id)
            .filter(Workout.user_id == user_id, Workout.date >= since)
            .distinct()
        )
        untrained = MuscleGroup.query.filter(~MuscleGroup.id.in_(trained_group_ids)).all()
        return [{"id": mg.id, "name": mg.name} for mg in untrained]

    @classmethod
    def get_rank(cls, user_id):
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

        return {"total_volume": total_volume, "rank": tier}