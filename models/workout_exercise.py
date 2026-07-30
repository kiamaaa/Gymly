from extensions import db

class WorkoutExercise(db.Model):

    __tablename__ = "workout_exercises"

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight_used = db.Column(db.Float, nullable=False)
    time_taken = db.Column(db.Integer)       # in seconds
    calories_burned = db.Column(db.Integer)

    workout = db.relationship('Workout', back_populates='workout_exercises')
    exercise = db.relationship('Exercise', back_populates='workout_exercises')

    def __repr__(self):
        return f"<WorkoutExercise workout_id={self.workout_id} exercise_id={self.exercise_id}>"