"""
Celery tasks for background processing - Analysis tasks
"""
from app.core.celery_app import celery_app
from app.services.anomaly_detector import AnomalyDetector
import asyncio


@celery_app.task(name="app.services.tasks.analysis_tasks.train_anomaly_detection_model")
def train_anomaly_detection_model():
    """
    Train the anomaly detection model on historical data
    
    This task runs periodically (configured in celery_app.py)
    """
    print("[TASK] Starting anomaly detection model training...")
    
    # Run async function in sync context
    from app.core.database import AsyncSessionLocal
    
    async def _train():
        async with AsyncSessionLocal() as db:
            detector = AnomalyDetector(db)
            await detector.train_model()
    
    asyncio.run(_train())
    
    print("[TASK] Anomaly detection model training completed")
    return {"status": "completed"}


@celery_app.task(name="app.services.tasks.analysis_tasks.analyze_malware_file")
def analyze_malware_file(scan_id: str, file_path: str):
    """
    Analyze a malware file in the background
    
    Args:
        scan_id: Scan identifier
        file_path: Path to file to analyze
    """
    print(f"[TASK] Analyzing malware file: {scan_id}")
    
    from app.core.database import AsyncSessionLocal
    from app.services.malware_analyzer import MalwareAnalyzer
    
    async def _analyze():
        async with AsyncSessionLocal() as db:
            analyzer = MalwareAnalyzer(db)
            await analyzer.analyze_file(scan_id, file_path)
    
    asyncio.run(_analyze())
    
    print(f"[TASK] Malware analysis completed: {scan_id}")
    return {"status": "completed", "scan_id": scan_id}


@celery_app.task(name="app.services.tasks.analysis_tasks.perform_web_scan")
def perform_web_scan(scan_id: str, target_url: str, scan_type: str, asset_id: int):
    """
    Perform web application scan in the background
    
    Args:
        scan_id: Scan identifier
        target_url: Target URL
        scan_type: Type of scan (active/passive)
        asset_id: Asset ID
    """
    print(f"[TASK] Starting web scan: {scan_id} - {target_url}")
    
    from app.core.database import AsyncSessionLocal
    from app.services.web_scanner import WebScanner
    
    async def _scan():
        async with AsyncSessionLocal() as db:
            scanner = WebScanner(db)
            await scanner.perform_scan(scan_id, target_url, scan_type, asset_id)
    
    asyncio.run(_scan())
    
    print(f"[TASK] Web scan completed: {scan_id}")
    return {"status": "completed", "scan_id": scan_id}
