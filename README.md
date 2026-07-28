# Gymly

A full-stack fitness progress tracker. Log workouts, track body measurements over time, get muscle-group recommendations, and earn a rank based on real training progress — built to support both muscle-gain and fat-loss goals.

## Problem Statement

Most people trying to build muscle, lose fat, or generally get fitter track their training inconsistently — scattered notes, memory, or a generic spreadsheet. Without a consistent record, it's hard to answer basic questions: Am I actually getting stronger? Am I progressing toward my target weight? Which muscle groups have I been neglecting? Most generic fitness apps also assume one goal direction (bulking or cutting, rarely both) and rarely surface progressive overload trends clearly.

## Solution

Gymly centralizes workout logging, body-measurement tracking, and progress visualization in one app that supports both muscle-gain and fat-loss goals from the same data model. Logging sets, reps, and weight per exercise — correlated with body measurements over time — surfaces concrete trends (progressive overload, weekly calories burned, untrained muscle groups) and distills them into a simple rank system.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), JavaScript, react-router-dom |
| Frontend data layer | fetch API, React hooks (useState, useEffect, custom hooks) |
| Backend | Flask |
| Database | SQLite, Flask-SQLAlchemy |
| Migrations | Flask-Migrate (Alembic) |
| Auth | Flask-JWT-Extended, Werkzeug password hashing |
| Serialization | Flask-Marshmallow, marshmallow-sqlalchemy |
| Seeding | seed.py, Faker |
| CORS | Flask-CORS |

## Project Structure

```
gymly_fit/
├── client/            # React frontend
├── controllers/        # Route handlers (API endpoints)
├── models/             # SQLAlchemy models (one file per model)
├── schemas/            # Marshmallow schemas for serialization
├── extensions.py       # Shared instances: db, migrate, jwt (avoids circular imports)
├── main.py             # App entry point / app factory
├── seed.py             # Seed script for sample data
├── requirements.txt
├── .env                # Local secrets (git-ignored)
└── .gitignore
```

## Data Model

Seven tables, covering all three relationship types:

| Type | Relationship | Notes |
|---|---|---|
| 1:1 | User ↔ FitnessProfile | Every user has exactly one profile holding goal-defining data |
| 1:many | User → Workout | A user logs many workout sessions |
| 1:many | User → ProgressLog | A user has many body-measurement entries over time |
| 1:many | MuscleGroup → Exercise | Each exercise belongs to exactly one primary muscle group |
| many:many | Workout ↔ Exercise | Via WorkoutExercise, which carries sets, reps, weight_used, time_taken, calories_burned |

The full ERD is maintained as a Mermaid diagram — see [`docs/erd.md`](docs/erd.md), viewable directly in VS Code or on GitHub.

## Setup

### Prerequisites
- Python 3.10+
- Node.js + npm

### Backend

```bash
cd gymly_fit
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```
SECRET_KEY=your-random-secret-here
JWT_SECRET_KEY=your-random-jwt-secret-here
DATABASE_URI=sqlite:///gymly.db
```

Run migrations:

```bash
flask db init
flask db migrate -m "initial migration"
flask db upgrade
```

Seed the database with sample data:

```bash
python seed.py
```

Run the server:

```bash
flask run
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

## API Routes

> Status: planned — update this table as each endpoint is implemented.

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Log in, receive a JWT | No |
| GET | `/api/profile` | Get the current user's fitness profile | Yes |
| PATCH | `/api/profile` | Update the current user's fitness profile | Yes |
| GET | `/api/workouts` | List workouts (paginated) | Yes |
| POST | `/api/workouts` | Create a workout | Yes |
| GET | `/api/workouts/<id>` | Get a single workout | Yes |
| PATCH | `/api/workouts/<id>` | Update a workout | Yes |
| DELETE | `/api/workouts/<id>` | Delete a workout | Yes |
| GET | `/api/exercises` | List exercises (paginated) | Yes |
| POST | `/api/exercises` | Create an exercise | Admin |
| GET | `/api/progress-logs` | List the current user's progress logs (paginated) | Yes |
| POST | `/api/progress-logs` | Log a new body measurement entry | Yes |
| GET | `/api/exercises/<id>/progress` | Progressive overload trend for one exercise | Yes |
| GET | `/api/stats/weekly` | Weekly totals: calories burned, time trained | Yes |
| GET | `/api/recommendations` | Muscle groups not trained recently | Yes |
| GET | `/api/rank` | Current computed rank tier | Yes |

## Seed Data

`seed.py` populates every table, including real many-to-many `WorkoutExercise` join rows — no empty join tables. Run `python seed.py` after migrations to get realistic sample data to develop and test against.

## Git Workflow

- `main` — always stable, updated only via merged pull requests.
- One feature branch per feature (e.g. `feature/models-migrations`, `feature/auth`, `feature/pagination`).
- Small, atomic, descriptive commits (e.g. `add User model with password hashing`).
- Each feature is opened as a pull request into `main` before merging.

## Deployment

> To be added once deployed.