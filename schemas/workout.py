from extensions import ma
from models import Workout


class WorkoutSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Workout
        load_instance = True
        include_fk = True

    workout_exercises = ma.Nested('WorkoutExerciseSchema', many=True, exclude=('workout',))