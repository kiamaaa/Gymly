from models.user import User
from extensions import db


class UserController:

    @classmethod
    def get_by_email(cls, email):
        return User.query.filter_by(email=email).first()

    @classmethod
    def register(cls, data):
        existing = User.query.filter(
            (User.username == data["username"]) | (User.email == data["email"])
        ).first()
        if existing:
            return None

        user = User(username=data["username"], email=data["email"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, email, password):
        user = cls.get_by_email(email)
        if user and user.check_password(password):
            return user
        return None