import os
import requests
from flask import Flask, session, render_template, url_for, redirect, request, jsonify, abort
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import requests


app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="DustyShapiro",
    password="<Dbottoms2!",
    hostname="DustyShapiro.mysql.pythonanywhere-services.com",
    databasename="DustyShapiro$drops",
)
engine = create_engine(SQLALCHEMY_DATABASE_URI)
db = scoped_session(sessionmaker(bind=engine))

@app.route("/", methods=['POST', 'GET'])
def index():
    query = db.execute("SELECT * FROM drops LIMIT 10").fetchall()
    return query[0].filename


if __name__ == '__main__':
    app.run()
