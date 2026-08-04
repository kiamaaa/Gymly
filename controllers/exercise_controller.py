from models.exercise import Exercise
from extensions import db


class ExerciseController:

    @classmethod
    def get_all(cls, page=1, per_page=10, muscle_group_id=None):
        query = Exercise.query
        if muscle_group_id:
            query = query.filter_by(muscle_group_id=muscle_group_id)
        return query.paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def get_by_id(cls, id):
        return Exercise.query.filter_by(id=id).first()

    @classmethod
    def create(cls, data):
        exercise = Exercise(
            name=data["name"],
            description=data.get("description"),
            equipment=data.get("equipment"),
            muscle_group_id=data["muscle_group_id"],
        )
        db.session.add(exercise)
        db.session.commit()
        return exercise

    @classmethod
    def update(cls, id, data):
        exercise = cls.get_by_id(id)
        if exercise:
            exercise.name = data.get("name", exercise.name)
            exercise.description = data.get("description", exercise.description)
            exercise.equipment = data.get("equipment", exercise.equipment)
            exercise.muscle_group_id = data.get("muscle_group_id", exercise.muscle_group_id)
            db.session.commit()
        return exercise

    @classmethod
    def delete(cls, id):
        exercise = cls.get_by_id(id)
        if exercise:
            db.session.delete(exercise)
            db.session.commit()
            return True
        return False