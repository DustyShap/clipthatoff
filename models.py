import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, desc


db = SQLAlchemy()

class Drop(db.Model):
    __tablename__ = 'drops'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    speaker = db.Column(db.String, nullable=False)
    tags = db.Column(db.String, nullable=False)
    transcription = db.Column(db.String, nullable=False)

    def as_dict(self):
        return {
        'filename': self.filename,
        'speaker': self.speaker,
        'transcription': self.transcription.upper()
        }

    def id_lookup(filename=None):
        drop = Drop.query.filter(
                Drop.filename == filename
        ).first()
        return drop.id if drop and drop.id else None



class AdminUser(db.Model):
    __tablename__ = 'admin_user'
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String, nullable=False)

class ClickStat(db.Model):
    __tablename__ = 'click_stats'
    id = db.Column(db.Integer, primary_key=True)
    drop_id = db.Column(db.Integer, db.ForeignKey('drops.id'), nullable=False)
    clicked_from_cell = db.Column(db.Boolean, nullable=False)
    filename = db.Column(db.String, nullable=False)
    click_time = db.Column(db.DateTime, nullable=False)

class SearchStat(db.Model):
    __tablename__ = 'search_stats'
    id = db.Column(db.Integer, primary_key=True)
    search_string = db.Column(db.String, nullable=False)
    search_time = db.Column(db.DateTime, nullable=False)
