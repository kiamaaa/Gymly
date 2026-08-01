def register_blueprints(app):
    from controllers.auth import auth_bp
    from controllers.muscle_groups import muscle_groups_bp
    from controllers.exercises import exercises_bp
    from controllers.workouts import workouts_bp
    from controllers.progress_logs import progress_logs_bp
    from controllers.fitness_profiles import fitness_profiles_bp
    from controllers.stats import stats_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(muscle_groups_bp)
    app.register_blueprint(exercises_bp)
    app.register_blueprint(workouts_bp)
    app.register_blueprint(progress_logs_bp)
    app.register_blueprint(fitness_profiles_bp)
    app.register_blueprint(stats_bp)