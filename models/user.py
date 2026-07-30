from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")

    fitness_profile = db.relationship('FitnessProfile', back_populates='user', uselist=False)
    workouts = db.relationship('Workout', back_populates='user', cascade='all, delete-orphan')
    progress_logs = db.relationship('ProgressLog', back_populates='user', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"