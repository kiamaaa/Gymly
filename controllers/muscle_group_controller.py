from models.muscle_group import MuscleGroup
from extensions import db


class MuscleGroupController:

    @classmethod
    def get_all(cls, page=1, per_page=10):
        return MuscleGroup.query.paginate(page=page, per_page=per_page, error_out=False)

    @classmethod
    def get_by_id(cls, id):
        return MuscleGroup.query.filter_by(id=id).first()

    @classmethod
    def create(cls, data):
        mg = MuscleGroup(name=data["name"])
        db.session.add(mg)
        db.session.commit()
        return mg

    @classmethod
    def update(cls, id, data):
        mg = cls.get_by_id(id)
        if mg:
            mg.name = data.get("name", mg.name)
            db.session.commit()
        return mg

    @classmethod
    def delete(cls, id):
        mg = cls.get_by_id(id)
        if mg:
            db.session.delete(mg)
            db.session.commit()
            return True
        return False