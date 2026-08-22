module.exports = {
  apps : [{
    name   : "potpourri-music-cifras-backend",
    script : "run.py",
    interpreter: "pipenv",
    interpreter_args: "run python",
    env: {
      ENVIRONMENT: "production",
      FLAG_ENV: "prod",
      PORT: 3004,
      PIPENV_DONT_LOAD_ENV: "1",
      PYTHONPATH: "."
    },
    env_production: {
      ENVIRONMENT: "production",
      FLAG_ENV: "prod",
      PORT: 3004,
      PIPENV_DONT_LOAD_ENV: "1",
      PYTHONPATH: "."
    },
    env_development: {
      ENVIRONMENT: "development", 
      FLAG_ENV: "dev",
      PORT: 5000,
      PIPENV_DONT_LOAD_ENV: "1",
      PYTHONPATH: "."
    },
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    max_restarts: 10,
    min_uptime: "10s",
    restart_delay: 4000
  }]
}
