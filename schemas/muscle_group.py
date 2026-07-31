from extensions import ma
from models import MuscleGroup


class MuscleGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MuscleGroup
        load_instance = True