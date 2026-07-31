from extensions import ma
from models import Exercise


class ExerciseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Exercise
        load_instance = True
        include_fk = True

    muscle_group = ma.Nested('MuscleGroupSchema', only=('id', 'name'))