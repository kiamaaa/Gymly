import os
from flask import Flask
from dotenv import load_dotenv

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
    cors.init_app(app)

    import models  

    from controllers import register_blueprints
    register_blueprints(app)

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)