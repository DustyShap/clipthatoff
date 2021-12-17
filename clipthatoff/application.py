import boto3
import csv
import datetime
import os
import pusher
import requests
from flask import (Flask, session,
                   render_template, url_for, redirect, request, jsonify)
from flask_session import Session
from flask_uploads import UploadSet, configure_uploads, AUDIO
from sqlalchemy import create_engine, desc
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
from pytz import timezone

from clipthatoff.models import Drop, db, AdminUser, ClickStat, SearchStat
from clipthatoff.create import create_app




application = app = Flask(__name__)

app = create_app()
audio = UploadSet('audio', AUDIO)
app.config['UPLOADED_AUDIO_DEST'] = os.environ['UPLOAD_PATH']
configure_uploads(app, audio)
app.app_context().push()
s3 = boto3.client('s3')
TIMEZONE = timezone('America/Chicago')


pusher_client = pusher.Pusher(
    app_id=os.getenv('PUSHER_APP_ID'),
    key=os.getenv('PUSHER_KEY'),
    secret=os.getenv('PUSHER_SECRET'),
    cluster='us2',
    ssl=True
)

pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})



@app.route('/')
@app.route('/<search_term>')
def home(search_term=None, speaker=None):
    return render_template("index.html", search_term=search_term
            if search_term and len(search_term) >=3
            else None)


@app.route('/upload_login', methods=['GET', 'POST'])
def upload_login():
    if request.method == 'GET':
        return redirect(url_for('home'))
    password_attempt = request.form['upload_password']
    password = db.session.query(AdminUser.password).first()
    return jsonify({'password_correct': (password_attempt==password[0])})


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    filename = audio.save(request.files['audio'])
    # s3.upload_fileobj(dl_file, 'upload-testing', dl_file.filename)
    file_upload = Drop(
                filename=filename,
                speaker=request.form['speaker'].lower().strip(),
                tags=request.form['tags'].lower(),
                transcription=request.form['transcription'].lower().replace("'",""))
    database_add(file_upload)

    return jsonify({'file': filename})


@app.route('/process', methods=['POST', 'GET'])
def process():
    search_term = request.form['tags'].lower().strip()
    # This is either the name of the speaker or search_drops
    chosen = request.form['chosen'].lower()

    if chosen == 'search_drops':
        search_method = 'search_value'
        drops = Drop.query.filter(
                Drop.speaker.isnot(None),
                Drop.tags.ilike("%"+search_term+"%")
        ).all()

    elif chosen == 'last_fifty':
        search_method = 'last_fifty'
        drops = db.session.query(Drop).order_by(desc(Drop.id)).limit(50)

    else:  # if a name was clicked
        search_method = 'name'
        drops = Drop.query.filter(
                Drop.speaker == chosen
        ).all()

    return process_drop_results(drops, search_method)

@app.route("/click_stat", methods=["POST"])
def click_stat():
    filename = request.form['filename']
    cell_clicked = request.form['cell_clicked']
    print(filename)
    if filename and cell_clicked:
        drop_id = Drop.id_lookup(filename)
        click = ClickStat(
        drop_id=drop_id,
        filename=filename,
        clicked_from_cell = False if cell_clicked == 'false' else True,
        click_time=datetime.datetime.now(TIMEZONE).strftime("%m-%d-%Y %H:%M:%S")
        )
        if drop_id:
            database_add(click)
            return ('', 201)
    return ('', 404)

@app.route("/search_stat", methods=["POST"])
def search_stat():
    search_string = request.form['search_string']
    search = SearchStat(
        search_string=search_string,
        search_time=datetime.datetime.now(TIMEZONE).strftime("%m-%d-%Y %I:%M:%S")
    )
    database_add(search)
    return ('', 201)


@app.route('/robots.txt')
def robots_dot_txt():
	return "User-agent: *\nDisallow: /"


def database_add(element):
    db.session.add(element)
    db.session.commit()


def process_drop_results(drops, search_method):
    return jsonify({"drops": [drop.as_dict() for drop in drops], "search_method": search_method})
