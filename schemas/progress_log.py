from extensions import ma
from models import ProgressLog


class ProgressLogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ProgressLog
        load_instance = True
        include_fk = True