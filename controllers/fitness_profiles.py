from flask import Blueprint, request, jsonify
from extensions import db
from models import FitnessProfile
from schemas import FitnessProfileSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

fitness_profiles_bp = Blueprint('fitness_profiles', __name__, url_prefix='/api/profile')

profile_schema = FitnessProfileSchema()


@fitness_profiles_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    profile = FitnessProfile.query.filter_by(user_id=user_id).first_or_404()
    return jsonify(profile_schema.dump(profile)), 200


@fitness_profiles_bp.route('', methods=['POST'])
@jwt_required()
def create_profile():
    user_id = get_jwt_identity()
    if FitnessProfile.query.filter_by(user_id=user_id).first():
        return jsonify({"error": "profile already exists"}), 409

    data = request.get_json()
    profile = FitnessProfile(
        user_id=user_id,
        goal=data.get('goal'),
        starting_weight=data.get('starting_weight'),
        target_weight=data.get('target_weight'),
        height=data.get('height'),
        activity_level=data.get('activity_level')
    )
    db.session.add(profile)
    db.session.commit()
    return jsonify(profile_schema.dump(profile)), 201


@fitness_profiles_bp.route('', methods=['PATCH'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    profile = FitnessProfile.query.filter_by(user_id=user_id).first_or_404()
    data = request.get_json()
    for field in ['goal', 'starting_weight', 'target_weight', 'height', 'activity_level']:
        if field in data:
            setattr(profile, field, data[field])
    db.session.commit()
    return jsonify(profile_schema.dump(profile)), 200