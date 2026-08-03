from extensions import db

class Exercise(db.Model):

    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    equipment = db.Column(db.String(100))
    muscle_group_id = db.Column(db.Integer, db.ForeignKey('muscle_group.id'), nullable=False)

    muscle_group = db.relationship('MuscleGroup', back_populates='exercises')
    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercises')

    def __repr__(self):
        return f"<Exercise {self.name}>"