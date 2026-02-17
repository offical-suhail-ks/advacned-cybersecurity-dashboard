"""
Celery tasks for web scanning
"""
from app.core.celery_app import celery_app


@celery_app.task(name="app.services.tasks.scan_tasks.perform_web_scan")
def perform_web_scan(scan_id: str, target_url: str, scan_type: str, asset_id: int):
    """
    Perform web application security scan
    
    Args:
        scan_id: Scan identifier
        target_url: Target URL to scan
        scan_type: Type of scan (active/passive)
        asset_id: Asset ID
    """
    import asyncio
    from app.core.database import AsyncSessionLocal
    from app.services.web_scanner import WebScanner
    
    print(f"[TASK] Starting web scan: {scan_id}")
    
    async def _scan():
        async with AsyncSessionLocal() as db:
            scanner = WebScanner(db)
            await scanner.perform_scan(scan_id, target_url, scan_type, asset_id)
    
    asyncio.run(_scan())
    
    print(f"[TASK] Web scan completed: {scan_id}")
    return {"status": "completed", "scan_id": scan_id}
