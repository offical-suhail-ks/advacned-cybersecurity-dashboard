"""
Web penetration testing routes - OWASP ZAP integration
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from datetime import datetime
from app.core.database import get_db
from app.core.config import settings
from app.models.models import User, Vulnerability, Asset, SeverityLevel
from app.schemas.schemas import WebScanRequest, WebScanResponse, VulnerabilityResponse
from app.dependencies.auth import get_current_user
from app.services.web_scanner import WebScanner

router = APIRouter(prefix="/web-scan", tags=["Web Scanning"])


@router.post("/start", response_model=WebScanResponse, status_code=status.HTTP_202_ACCEPTED)
async def start_web_scan(
    scan_request: WebScanRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a web application security scan using OWASP ZAP
    
    - **target_url**: Target URL to scan (must start with http:// or https://)
    - **scan_type**: Type of scan (active or passive)
    
    Returns scan ID for tracking progress
    """
    # Generate scan ID
    scan_id = f"SCAN-{uuid.uuid4().hex[:12].upper()}"
    
    # Create or get asset for the target
    from urllib.parse import urlparse
    parsed_url = urlparse(scan_request.target_url)
    hostname = parsed_url.netloc
    
    result = await db.execute(
        select(Asset).where(Asset.hostname == hostname)
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        asset = Asset(
            name=f"Web App - {hostname}",
            asset_type="web_application",
            hostname=hostname,
            criticality=7,
            description=f"Auto-created from web scan"
        )
        db.add(asset)
        await db.commit()
        await db.refresh(asset)
    
    # Start scan in background
    scanner = WebScanner(db)
    background_tasks.add_task(
        scanner.perform_scan,
        scan_id=scan_id,
        target_url=scan_request.target_url,
        scan_type=scan_request.scan_type,
        asset_id=asset.id
    )
    
    return WebScanResponse(
        scan_id=scan_id,
        target_url=scan_request.target_url,
        status="started",
        started_at=datetime.utcnow(),
        vulnerabilities_found=0
    )


@router.get("/status/{scan_id}")
async def get_scan_status(
    scan_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get the status of a web scan
    
    Returns scan progress and current status
    """
    # In production, store scan status in Redis
    # For now, return a placeholder
    return {
        "scan_id": scan_id,
        "status": "in_progress",
        "progress": 75,
        "message": "Scanning for vulnerabilities..."
    }


@router.get("/results/{scan_id}", response_model=List[VulnerabilityResponse])
async def get_scan_results(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get vulnerabilities found in a web scan
    
    Returns list of vulnerabilities with risk scores
    """
    result = await db.execute(
        select(Vulnerability).where(Vulnerability.scan_id == scan_id)
    )
    vulnerabilities = result.scalars().all()
    
    return vulnerabilities


@router.delete("/cancel/{scan_id}")
async def cancel_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a running web scan
    """
    # In production, send cancellation signal to ZAP
    return {
        "message": f"Scan {scan_id} cancelled successfully"
    }
