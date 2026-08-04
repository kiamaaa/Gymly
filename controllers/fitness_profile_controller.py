from models.fitness_profile import FitnessProfile
from extensions import db


class FitnessProfileController:

    @classmethod
    def get_by_user(cls, user_id):
        return FitnessProfile.query.filter_by(user_id=user_id).first()

    @classmethod
    def create(cls, user_id, data):
        profile = FitnessProfile(
            user_id=user_id,
            goal=data["goal"],
            starting_weight=data["starting_weight"],
            target_weight=data["target_weight"],
            height=data["height"],
            activity_level=data["activity_level"],
        )
        db.session.add(profile)
        db.session.commit()
        return profile

    @classmethod
    def update(cls, user_id, data):
        profile = cls.get_by_user(user_id)
        if profile:
            profile.goal = data.get("goal", profile.goal)
            profile.starting_weight = data.get("starting_weight", profile.starting_weight)
            profile.target_weight = data.get("target_weight", profile.target_weight)
            profile.height = data.get("height", profile.height)
            profile.activity_level = data.get("activity_level", profile.activity_level)
            db.session.commit()
        return profile