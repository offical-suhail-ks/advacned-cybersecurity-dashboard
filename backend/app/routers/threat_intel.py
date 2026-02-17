"""
Threat Intelligence routes - IOC management and CVE database
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.models import User, ThreatIntel, CVE
from app.schemas.schemas import ThreatIntelCreate, ThreatIntelResponse, CVEResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/threat-intel", tags=["Threat Intelligence"])


@router.post("/ioc", response_model=ThreatIntelResponse, status_code=status.HTTP_201_CREATED)
async def create_ioc(
    ioc_data: ThreatIntelCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a new Indicator of Compromise (IOC)
    
    - **ioc_type**: Type of IOC (ip, domain, hash, url, email)
    - **ioc_value**: The actual IOC value
    - **threat_type**: Type of threat (malware, phishing, c2, etc.)
    - **severity**: Severity level
    - **confidence**: Confidence score (0-100)
    """
    # Check if IOC already exists
    result = await db.execute(
        select(ThreatIntel).where(
            ThreatIntel.ioc_value == ioc_data.ioc_value,
            ThreatIntel.ioc_type == ioc_data.ioc_type
        )
    )
    existing_ioc = result.scalar_one_or_none()
    
    if existing_ioc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="IOC already exists"
        )
    
    # Create new IOC
    ioc = ThreatIntel(
        ioc_type=ioc_data.ioc_type,
        ioc_value=ioc_data.ioc_value,
        threat_type=ioc_data.threat_type,
        severity=ioc_data.severity,
        confidence=ioc_data.confidence,
        source=ioc_data.source,
        description=ioc_data.description,
        tags=ioc_data.tags,
        first_seen=datetime.utcnow(),
        last_seen=datetime.utcnow(),
        is_active=True
    )
    
    db.add(ioc)
    await db.commit()
    await db.refresh(ioc)
    
    return ioc


@router.get("/ioc", response_model=List[ThreatIntelResponse])
async def get_iocs(
    ioc_type: Optional[str] = None,
    threat_type: Optional[str] = None,
    is_active: bool = True,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of IOCs with optional filters
    
    - **ioc_type**: Filter by IOC type
    - **threat_type**: Filter by threat type
    - **is_active**: Filter by active status
    """
    from sqlalchemy import desc
    
    query = select(ThreatIntel).order_by(desc(ThreatIntel.created_at)).limit(limit)
    
    if ioc_type:
        query = query.where(ThreatIntel.ioc_type == ioc_type)
    
    if threat_type:
        query = query.where(ThreatIntel.threat_type == threat_type)
    
    query = query.where(ThreatIntel.is_active == is_active)
    
    result = await db.execute(query)
    iocs = result.scalars().all()
    
    return iocs


@router.get("/ioc/check/{value}")
async def check_ioc(
    value: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check if a value is a known IOC
    
    Searches across all IOC types
    """
    result = await db.execute(
        select(ThreatIntel).where(
            ThreatIntel.ioc_value == value,
            ThreatIntel.is_active == True
        )
    )
    ioc = result.scalar_one_or_none()
    
    if ioc:
        return {
            "is_threat": True,
            "ioc_type": ioc.ioc_type,
            "threat_type": ioc.threat_type,
            "severity": ioc.severity.value,
            "confidence": ioc.confidence,
            "description": ioc.description
        }
    else:
        return {
            "is_threat": False,
            "message": "No threat intelligence found for this value"
        }


@router.get("/cve/search", response_model=List[CVEResponse])
async def search_cves(
    query: Optional[str] = None,
    severity: Optional[str] = None,
    exploit_available: Optional[bool] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search CVE database
    
    - **query**: Search in CVE ID or description
    - **severity**: Filter by severity
    - **exploit_available**: Filter by exploit availability
    """
    from sqlalchemy import desc
    
    stmt = select(CVE).order_by(desc(CVE.published_date)).limit(limit)
    
    if query:
        stmt = stmt.where(
            or_(
                CVE.cve_id.ilike(f"%{query}%"),
                CVE.description.ilike(f"%{query}%")
            )
        )
    
    if severity:
        stmt = stmt.where(CVE.severity == severity)
    
    if exploit_available is not None:
        stmt = stmt.where(CVE.exploit_available == exploit_available)
    
    result = await db.execute(stmt)
    cves = result.scalars().all()
    
    return cves


@router.get("/cve/{cve_id}", response_model=CVEResponse)
async def get_cve(
    cve_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed CVE information
    """
    result = await db.execute(
        select(CVE).where(CVE.cve_id == cve_id)
    )
    cve = result.scalar_one_or_none()
    
    if not cve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CVE not found"
        )
    
    return cve


@router.get("/ip-reputation/{ip_address}")
async def check_ip_reputation(
    ip_address: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Check IP address reputation
    
    Checks against IOC database and external sources
    """
    # Check internal IOC database
    result = await db.execute(
        select(ThreatIntel).where(
            ThreatIntel.ioc_type == "ip",
            ThreatIntel.ioc_value == ip_address,
            ThreatIntel.is_active == True
        )
    )
    ioc = result.scalar_one_or_none()
    
    reputation = {
        "ip_address": ip_address,
        "is_malicious": False,
        "threat_type": None,
        "severity": None,
        "sources": []
    }
    
    if ioc:
        reputation["is_malicious"] = True
        reputation["threat_type"] = ioc.threat_type
        reputation["severity"] = ioc.severity.value
        reputation["sources"].append({
            "name": ioc.source or "Internal Database",
            "confidence": ioc.confidence,
            "description": ioc.description
        })
    
    # In production, integrate with external threat feeds:
    # - AbuseIPDB
    # - VirusTotal
    # - AlienVault OTX
    # - Shodan
    
    return reputation
