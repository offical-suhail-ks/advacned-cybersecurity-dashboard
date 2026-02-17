"""
Celery configuration for background tasks
"""
from celery import Celery
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "cybersec_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.services.tasks.scan_tasks",
        "app.services.tasks.analysis_tasks",
        "app.services.tasks.threat_intel_tasks",
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max
    task_soft_time_limit=3000,  # 50 minutes soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks schedule
celery_app.conf.beat_schedule = {
    "train-anomaly-model": {
        "task": "app.services.tasks.analysis_tasks.train_anomaly_detection_model",
        "schedule": settings.MODEL_TRAINING_INTERVAL_HOURS * 3600,
    },
    "update-threat-intel": {
        "task": "app.services.tasks.threat_intel_tasks.update_threat_intelligence",
        "schedule": settings.THREAT_INTEL_UPDATE_INTERVAL_HOURS * 3600,
    },
    "update-cve-database": {
        "task": "app.services.tasks.threat_intel_tasks.update_cve_database",
        "schedule": 86400,  # Daily
    },
}
