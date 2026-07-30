from extensions import db

class MuscleGroup(db.Model):

    __tablename__ = 'muscle_group'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    exercises = db.relationship('Exercise', back_populates='muscle_group')

    def __repr__(self):
        return f"<MuscleGroup {self.name}>"