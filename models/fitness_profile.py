from extensions import db

class FitnessProfile(db.Model):

    __tablename__ = "fitness_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    goal = db.Column(db.String(50), nullable=False)
    starting_weight = db.Column(db.Float, nullable=False)
    target_weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.String(50), nullable=False)
    current_rank = db.Column(db.String(50), nullable=False, default="Bronze")

    user = db.relationship('User', back_populates='fitness_profile')

    def __repr__(self):
        return f"<FitnessProfile user_id={self.user_id} goal={self.goal}>"