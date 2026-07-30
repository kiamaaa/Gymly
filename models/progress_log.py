from extensions import db

class ProgressLog(db.Model):

    __tablename__ = "progress_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    body_weight = db.Column(db.Float, nullable=False)
    body_fat_pct = db.Column(db.Float)
    notes = db.Column(db.String(255))

    user = db.relationship('User', back_populates='progress_logs')

    def __repr__(self):
        return f"<ProgressLog user_id={self.user_id} date={self.date}>"