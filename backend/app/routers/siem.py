"""
SIEM routes - Log ingestion, search, and alert generation
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from datetime import datetime
import uuid
from app.core.database import get_db
from app.core.elasticsearch import get_elasticsearch
from app.core.config import settings
from app.models.models import User, Log, Alert, DetectionRule, SeverityLevel, AlertStatus
from app.schemas.schemas import LogIngest, LogSearch, LogResponse, AlertResponse
from app.dependencies.auth import get_current_user
from app.services.detection_engine import DetectionEngine

router = APIRouter(prefix="/siem", tags=["SIEM"])


@router.post("/logs/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_log(
    log_data: LogIngest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ingest security log into Elasticsearch and trigger detection rules
    
    - **timestamp**: Log timestamp (defaults to now)
    - **source_ip**: Source IP address
    - **destination_ip**: Destination IP address
    - **severity**: Log severity level
    - **event_type**: Type of event
    - **message**: Log message
    """
    es = get_elasticsearch()
    
    # Set timestamp if not provided
    if log_data.timestamp is None:
        log_data.timestamp = datetime.utcnow()
    
    # Prepare log document for Elasticsearch
    log_doc = {
        "timestamp": log_data.timestamp.isoformat(),
        "source_ip": log_data.source_ip,
        "destination_ip": log_data.destination_ip,
        "severity": log_data.severity.value,
        "event_type": log_data.event_type,
        "message": log_data.message,
        "user_agent": log_data.user_agent,
        "method": log_data.method,
        "url": log_data.url,
        "status_code": log_data.status_code,
        "tags": log_data.tags or [],
        "raw_log": log_data.raw_log or log_data.message
    }
    
    # Index log in Elasticsearch
    index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
    result = await es.index(index=index_name, document=log_doc)
    es_id = result['_id']
    
    # Store metadata in PostgreSQL
    db_log = Log(
        elasticsearch_id=es_id,
        timestamp=log_data.timestamp,
        source_ip=log_data.source_ip,
        destination_ip=log_data.destination_ip,
        severity=log_data.severity,
        event_type=log_data.event_type,
        message=log_data.message
    )
    db.add(db_log)
    await db.commit()
    
    # Run detection engine
    detection_engine = DetectionEngine(db, es)
    alerts = await detection_engine.analyze_log(log_doc)
    
    return {
        "message": "Log ingested successfully",
        "log_id": es_id,
        "alerts_generated": len(alerts)
    }


@router.post("/logs/ingest/bulk", status_code=status.HTTP_201_CREATED)
async def ingest_logs_bulk(
    logs: List[LogIngest],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bulk ingest multiple logs at once
    
    Accepts array of log objects
    """
    es = get_elasticsearch()
    index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
    
    # Prepare bulk operations
    bulk_ops = []
    for log_data in logs:
        if log_data.timestamp is None:
            log_data.timestamp = datetime.utcnow()
        
        log_doc = {
            "timestamp": log_data.timestamp.isoformat(),
            "source_ip": log_data.source_ip,
            "destination_ip": log_data.destination_ip,
            "severity": log_data.severity.value,
            "event_type": log_data.event_type,
            "message": log_data.message,
            "user_agent": log_data.user_agent,
            "method": log_data.method,
            "url": log_data.url,
            "status_code": log_data.status_code,
            "tags": log_data.tags or [],
            "raw_log": log_data.raw_log or log_data.message
        }
        
        bulk_ops.append({"index": {"_index": index_name}})
        bulk_ops.append(log_doc)
    
    # Bulk index
    from elasticsearch.helpers import async_bulk
    success, failed = await async_bulk(es, bulk_ops)
    
    return {
        "message": "Bulk ingestion completed",
        "success_count": success,
        "failed_count": failed
    }


@router.post("/logs/search", response_model=List[LogResponse])
async def search_logs(
    search_params: LogSearch,
    current_user: User = Depends(get_current_user)
):
    """
    Search logs in Elasticsearch with filters
    
    - **start_date**: Start date for search
    - **end_date**: End date for search
    - **source_ip**: Filter by source IP
    - **destination_ip**: Filter by destination IP
    - **severity**: Filter by severity levels
    - **event_type**: Filter by event type
    - **search_query**: Full-text search query
    - **limit**: Maximum results to return (max 1000)
    """
    es = get_elasticsearch()
    index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
    
    # Build Elasticsearch query
    must_conditions = []
    
    # Date range
    if search_params.start_date or search_params.end_date:
        date_range = {}
        if search_params.start_date:
            date_range["gte"] = search_params.start_date.isoformat()
        if search_params.end_date:
            date_range["lte"] = search_params.end_date.isoformat()
        must_conditions.append({"range": {"timestamp": date_range}})
    
    # IP filters
    if search_params.source_ip:
        must_conditions.append({"term": {"source_ip": search_params.source_ip}})
    
    if search_params.destination_ip:
        must_conditions.append({"term": {"destination_ip": search_params.destination_ip}})
    
    # Severity filter
    if search_params.severity:
        severity_values = [s.value for s in search_params.severity]
        must_conditions.append({"terms": {"severity": severity_values}})
    
    # Event type filter
    if search_params.event_type:
        must_conditions.append({"match": {"event_type": search_params.event_type}})
    
    # Full-text search
    if search_params.search_query:
        must_conditions.append({
            "multi_match": {
                "query": search_params.search_query,
                "fields": ["message", "raw_log", "url"]
            }
        })
    
    # Construct query
    query = {
        "bool": {
            "must": must_conditions if must_conditions else [{"match_all": {}}]
        }
    }
    
    # Execute search
    result = await es.search(
        index=index_name,
        query=query,
        size=search_params.limit,
        sort=[{"timestamp": {"order": "desc"}}]
    )
    
    # Format results
    logs = []
    for hit in result['hits']['hits']:
        source = hit['_source']
        logs.append(LogResponse(
            id=hit['_id'],
            timestamp=datetime.fromisoformat(source['timestamp']),
            source_ip=source.get('source_ip'),
            destination_ip=source.get('destination_ip'),
            severity=source['severity'],
            event_type=source['event_type'],
            message=source['message']
        ))
    
    return logs


@router.get("/logs/stats")
async def get_log_statistics(
    current_user: User = Depends(get_current_user)
):
    """
    Get log statistics and aggregations
    
    Returns counts by severity, event type, and timeline
    """
    es = get_elasticsearch()
    index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
    
    # Aggregation query
    result = await es.search(
        index=index_name,
        size=0,
        aggs={
            "by_severity": {
                "terms": {"field": "severity"}
            },
            "by_event_type": {
                "terms": {"field": "event_type", "size": 20}
            },
            "timeline": {
                "date_histogram": {
                    "field": "timestamp",
                    "calendar_interval": "hour"
                }
            }
        }
    )
    
    return {
        "total_logs": result['hits']['total']['value'],
        "by_severity": result['aggregations']['by_severity']['buckets'],
        "by_event_type": result['aggregations']['by_event_type']['buckets'],
        "timeline": result['aggregations']['timeline']['buckets']
    }


@router.get("/alerts", response_model=List[AlertResponse])
async def get_alerts(
    severity: str = None,
    status: str = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get security alerts with optional filters
    
    - **severity**: Filter by severity (critical, high, medium, low)
    - **status**: Filter by status (open, in_progress, resolved, false_positive)
    - **limit**: Maximum results to return
    """
    from sqlalchemy import select, desc
    
    query = select(Alert).order_by(desc(Alert.created_at)).limit(limit)
    
    if severity:
        query = query.where(Alert.severity == severity)
    
    if status:
        query = query.where(Alert.status == status)
    
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    return alerts


@router.patch("/alerts/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: int,
    status: AlertStatus = None,
    assigned_to: int = None,
    false_positive: bool = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update alert status, assignment, or mark as false positive
    """
    from sqlalchemy import select
    
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if status:
        alert.status = status
        if status == AlertStatus.RESOLVED:
            alert.resolved_at = datetime.utcnow()
    
    if assigned_to is not None:
        alert.assigned_to = assigned_to
    
    if false_positive is not None:
        alert.false_positive = false_positive
        if false_positive:
            alert.status = AlertStatus.FALSE_POSITIVE
    
    await db.commit()
    await db.refresh(alert)
    
    return alert
