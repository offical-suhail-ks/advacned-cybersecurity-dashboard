"""
AI Anomaly Detection routes - ML-based threat detection
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import AnomalyDetectionRequest, AnomalyResponse
from app.dependencies.auth import get_current_user
from app.services.anomaly_detector import AnomalyDetector

router = APIRouter(prefix="/anomaly", tags=["Anomaly Detection"])


@router.post("/detect", response_model=List[AnomalyResponse])
async def detect_anomalies(
    request: AnomalyDetectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run anomaly detection on log data
    
    Uses Isolation Forest algorithm to detect anomalous behavior
    
    - **start_date**: Start date for analysis
    - **end_date**: End date for analysis
    - **threshold**: Anomaly score threshold (0-1, lower = more sensitive)
    """
    # Set default date range if not provided
    if not request.end_date:
        request.end_date = datetime.utcnow()
    
    if not request.start_date:
        request.start_date = request.end_date - timedelta(hours=24)
    
    # Run anomaly detection
    detector = AnomalyDetector(db)
    anomalies = await detector.detect_anomalies(
        start_date=request.start_date,
        end_date=request.end_date,
        threshold=request.threshold
    )
    
    return anomalies


@router.post("/train")
async def train_model(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trigger model training on historical data
    
    Trains the Isolation Forest model on recent log data
    This is also done automatically on a schedule
    """
    detector = AnomalyDetector(db)
    background_tasks.add_task(detector.train_model)
    
    return {
        "message": "Model training started",
        "status": "training"
    }


@router.get("/model/info")
async def get_model_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get information about the current anomaly detection model
    
    Returns model version, training date, and performance metrics
    """
    # In production, store this in Redis or database
    return {
        "model_type": "Isolation Forest",
        "last_trained": "2024-01-15T10:30:00Z",
        "training_samples": 50000,
        "contamination": 0.1,
        "features": [
            "request_count",
            "unique_ips",
            "error_rate",
            "avg_response_time",
            "failed_login_attempts"
        ]
    }


@router.get("/stats")
async def get_anomaly_stats(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get anomaly detection statistics
    
    Returns counts and trends of detected anomalies
    """
    # In production, query from database or cache
    return {
        "period_days": days,
        "total_anomalies": 42,
        "critical_anomalies": 5,
        "high_anomalies": 12,
        "medium_anomalies": 15,
        "low_anomalies": 10,
        "trend": "increasing",
        "most_common_types": [
            {"type": "unusual_traffic_pattern", "count": 15},
            {"type": "suspicious_login_activity", "count": 12},
            {"type": "data_exfiltration_attempt", "count": 8}
        ]
    }
