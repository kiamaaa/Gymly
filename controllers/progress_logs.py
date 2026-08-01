from datetime import datetime
from flask import Blueprint, request, jsonify
from extensions import db
from models import ProgressLog
from schemas import ProgressLogSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

progress_logs_bp = Blueprint('progress_logs', __name__, url_prefix='/api/progress-logs')

log_schema = ProgressLogSchema()
logs_schema = ProgressLogSchema(many=True)


@progress_logs_bp.route('', methods=['GET'])
@jwt_required()
def list_logs():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    pagination = (
        ProgressLog.query.filter_by(user_id=user_id)
        .order_by(ProgressLog.date.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "data": logs_schema.dump(pagination.items),
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages
    }), 200


@progress_logs_bp.route('', methods=['POST'])
@jwt_required()
def create_log():
    user_id = get_jwt_identity()
    data = request.get_json()
    log = ProgressLog(
        user_id=user_id,
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date(),
        body_weight=data.get('body_weight'),
        body_fat_pct=data.get('body_fat_pct'),
        notes=data.get('notes')
    )
    db.session.add(log)
    db.session.commit()
    return jsonify(log_schema.dump(log)), 201


@progress_logs_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_log(id):
    user_id = get_jwt_identity()
    log = ProgressLog.query.filter_by(id=id, user_id=user_id).first_or_404()
    db.session.delete(log)
    db.session.commit()
    return '', 204