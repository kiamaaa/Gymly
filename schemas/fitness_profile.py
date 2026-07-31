from extensions import ma
from models import FitnessProfile


class FitnessProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = FitnessProfile
        load_instance = True
        include_fk = True