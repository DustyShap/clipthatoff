import os
from flask import Flask, render_template, request
from flask_uploads import UploadSet, configure_uploads, AUDIO
from models import db


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    audio = UploadSet('audio', AUDIO)
    app.config['UPLOADED_AUDIO_DEST'] = os.environ['UPLOAD_PATH']
    configure_uploads(app, audio)
    db.init_app(app)
    return app


def main():
    db.create_all()


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        main()
