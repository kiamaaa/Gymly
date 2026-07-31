from extensions import ma
from models import WorkoutExercise


class WorkoutExerciseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkoutExercise
        load_instance = True
        include_fk = True

    exercise = ma.Nested('ExerciseSchema', only=('id', 'name', 'equipment'))