from datetime import datetime
from models.progress_log import ProgressLog
from extensions import db


class ProgressLogController:

    @classmethod
    def get_all_for_user(cls, user_id, page=1, per_page=10):
        return (
            ProgressLog.query.filter_by(user_id=user_id)
            .order_by(ProgressLog.date.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

    @classmethod
    def create(cls, user_id, data):
        log = ProgressLog(
            user_id=user_id,
            date=datetime.strptime(data["date"], "%Y-%m-%d").date(),
            body_weight=data["body_weight"],
            body_fat_pct=data.get("body_fat_pct"),
            notes=data.get("notes"),
        )
        db.session.add(log)
        db.session.commit()
        return log

    @classmethod
    def delete(cls, id, user_id):
        log = ProgressLog.query.filter_by(id=id, user_id=user_id).first()
        if log:
            db.session.delete(log)
            db.session.commit()
            return True
        return False