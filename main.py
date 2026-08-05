import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

from extensions import db, migrate, jwt, ma, cors

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(app, origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "https://gymly-rho.vercel.app",
        "https://gymly.vercel.app",
        "https://gymly-bryemhosj-idk-e262.vercel.app",
        "https://gymly-client.vercel.app",
        "https://gymly-34du.vercel.app",
        "https://gymly-34du-git-main-idk-e262.vercel.app",
        "https://gymly-34du-b5oa2ed9l-idk-e262.vercel.app"
    ])

    import models
    from routes import register_routes
    register_routes(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)