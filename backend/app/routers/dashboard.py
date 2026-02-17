"""
Dashboard routes - Statistics and overview data
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.elasticsearch import get_elasticsearch
from app.core.config import settings
from app.models.models import User, Alert, Incident, Vulnerability, Asset, MalwareScan, SeverityLevel, AlertStatus, IncidentStatus
from app.schemas.schemas import DashboardStats
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard statistics
    
    Returns:
    - Total alerts
    - Critical alerts
    - Open incidents
    - Total vulnerabilities
    - High-risk assets
    - Recent scans
    """
    # Total alerts
    total_alerts_result = await db.execute(
        select(func.count(Alert.id))
    )
    total_alerts = total_alerts_result.scalar() or 0
    
    # Critical alerts
    critical_alerts_result = await db.execute(
        select(func.count(Alert.id)).where(
            Alert.severity == SeverityLevel.CRITICAL,
            Alert.status == AlertStatus.OPEN
        )
    )
    critical_alerts = critical_alerts_result.scalar() or 0
    
    # Open incidents
    open_incidents_result = await db.execute(
        select(func.count(Incident.id)).where(
            Incident.status.in_([IncidentStatus.NEW, IncidentStatus.INVESTIGATING])
        )
    )
    open_incidents = open_incidents_result.scalar() or 0
    
    # Total vulnerabilities
    total_vulns_result = await db.execute(
        select(func.count(Vulnerability.id)).where(
            Vulnerability.status == "open"
        )
    )
    total_vulnerabilities = total_vulns_result.scalar() or 0
    
    # High-risk assets (criticality >= 8)
    high_risk_assets_result = await db.execute(
        select(func.count(Asset.id)).where(
            Asset.criticality >= 8,
            Asset.is_active == True
        )
    )
    high_risk_assets = high_risk_assets_result.scalar() or 0
    
    # Recent scans (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_scans_result = await db.execute(
        select(func.count(MalwareScan.id)).where(
            MalwareScan.created_at >= seven_days_ago
        )
    )
    recent_scans = recent_scans_result.scalar() or 0
    
    return DashboardStats(
        total_alerts=total_alerts,
        critical_alerts=critical_alerts,
        open_incidents=open_incidents,
        total_vulnerabilities=total_vulnerabilities,
        high_risk_assets=high_risk_assets,
        recent_scans=recent_scans
    )


@router.get("/alerts/timeline")
async def get_alerts_timeline(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get alerts timeline for the last N days
    
    Returns daily alert counts by severity
    """
    es = get_elasticsearch()
    index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_alerts"
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    try:
        result = await es.search(
            index=index_name,
            size=0,
            query={
                "range": {
                    "timestamp": {
                        "gte": start_date.isoformat()
                    }
                }
            },
            aggs={
                "alerts_over_time": {
                    "date_histogram": {
                        "field": "timestamp",
                        "calendar_interval": "day"
                    },
                    "aggs": {
                        "by_severity": {
                            "terms": {
                                "field": "severity"
                            }
                        }
                    }
                }
            }
        )
        
        return {
            "timeline": result['aggregations']['alerts_over_time']['buckets']
        }
    except Exception:
        return {"timeline": []}


@router.get("/threats/top")
async def get_top_threats(
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get top threats by frequency
    
    Returns most common threat types and sources
    """
    from sqlalchemy import desc
    
    # Top alert types
    alert_types_result = await db.execute(
        select(
            Alert.mitre_technique,
            func.count(Alert.id).label('count')
        )
        .where(Alert.mitre_technique.isnot(None))
        .group_by(Alert.mitre_technique)
        .order_by(desc('count'))
        .limit(limit)
    )
    
    top_techniques = [
        {"technique": row[0], "count": row[1]}
        for row in alert_types_result.all()
    ]
    
    # Top source IPs
    source_ips_result = await db.execute(
        select(
            Alert.source_ip,
            func.count(Alert.id).label('count')
        )
        .where(Alert.source_ip.isnot(None))
        .group_by(Alert.source_ip)
        .order_by(desc('count'))
        .limit(limit)
    )
    
    top_sources = [
        {"ip": row[0], "count": row[1]}
        for row in source_ips_result.all()
    ]
    
    return {
        "top_techniques": top_techniques,
        "top_sources": top_sources
    }


@router.get("/vulnerabilities/by-severity")
async def get_vulnerabilities_by_severity(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get vulnerability distribution by severity
    """
    result = await db.execute(
        select(
            Vulnerability.severity,
            func.count(Vulnerability.id).label('count')
        )
        .where(Vulnerability.status == "open")
        .group_by(Vulnerability.severity)
    )
    
    distribution = {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0,
        "info": 0
    }
    
    for row in result.all():
        severity = row[0].value if row[0] else "info"
        distribution[severity] = row[1]
    
    return distribution


@router.get("/assets/risk-distribution")
async def get_asset_risk_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get asset distribution by risk level (criticality)
    """
    result = await db.execute(
        select(
            Asset.criticality,
            func.count(Asset.id).label('count')
        )
        .where(Asset.is_active == True)
        .group_by(Asset.criticality)
    )
    
    distribution = []
    for row in result.all():
        distribution.append({
            "criticality": row[0],
            "count": row[1]
        })
    
    return {"distribution": distribution}


@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get recent security activity
    
    Returns recent alerts, incidents, and scans
    """
    from sqlalchemy import desc
    
    # Recent alerts
    alerts_result = await db.execute(
        select(Alert)
        .order_by(desc(Alert.created_at))
        .limit(limit)
    )
    recent_alerts = alerts_result.scalars().all()
    
    # Recent incidents
    incidents_result = await db.execute(
        select(Incident)
        .order_by(desc(Incident.created_at))
        .limit(limit)
    )
    recent_incidents = incidents_result.scalars().all()
    
    # Recent scans
    scans_result = await db.execute(
        select(MalwareScan)
        .order_by(desc(MalwareScan.created_at))
        .limit(limit)
    )
    recent_scans = scans_result.scalars().all()
    
    return {
        "alerts": [
            {
                "id": a.id,
                "alert_id": a.alert_id,
                "title": a.title,
                "severity": a.severity.value,
                "created_at": a.created_at.isoformat()
            }
            for a in recent_alerts
        ],
        "incidents": [
            {
                "id": i.id,
                "incident_id": i.incident_id,
                "title": i.title,
                "severity": i.severity.value,
                "status": i.status.value,
                "created_at": i.created_at.isoformat()
            }
            for i in recent_incidents
        ],
        "scans": [
            {
                "id": s.id,
                "scan_id": s.scan_id,
                "filename": s.filename,
                "is_malicious": s.is_malicious,
                "created_at": s.created_at.isoformat()
            }
            for s in recent_scans
        ]
    }
