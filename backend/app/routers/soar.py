"""
SOAR (Security Orchestration, Automation and Response) routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.models import User, Playbook, Incident
from app.schemas.schemas import PlaybookCreate, PlaybookResponse, IncidentCreate, IncidentUpdate, IncidentResponse
from app.dependencies.auth import get_current_user, require_manager
from app.services.playbook_engine import PlaybookEngine

router = APIRouter(prefix="/soar", tags=["SOAR"])


# ============================================================================
# PLAYBOOK MANAGEMENT
# ============================================================================

@router.post("/playbooks", response_model=PlaybookResponse, status_code=status.HTTP_201_CREATED)
async def create_playbook(
    playbook_data: PlaybookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """
    Create a new SOAR playbook
    
    Playbook structure:
    - **trigger_conditions**: IF conditions (e.g., alert severity, IOC type)
    - **actions**: THEN actions (e.g., block IP, send email, create ticket)
    
    Example:
    ```json
    {
        "name": "Block Malicious IP",
        "trigger_conditions": {
            "alert_severity": "critical",
            "ioc_type": "ip"
        },
        "actions": [
            {"type": "block_ip", "target": "firewall"},
            {"type": "send_email", "recipients": ["soc@company.com"]},
            {"type": "create_incident", "severity": "high"}
        ]
    }
    ```
    """
    playbook = Playbook(
        name=playbook_data.name,
        description=playbook_data.description,
        trigger_conditions=playbook_data.trigger_conditions,
        actions=playbook_data.actions,
        priority=playbook_data.priority,
        is_active=True,
        created_by=current_user.id,
        execution_count=0
    )
    
    db.add(playbook)
    await db.commit()
    await db.refresh(playbook)
    
    return playbook


@router.get("/playbooks", response_model=List[PlaybookResponse])
async def get_playbooks(
    is_active: bool = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of SOAR playbooks
    """
    from sqlalchemy import desc
    
    query = select(Playbook).order_by(desc(Playbook.priority))
    
    if is_active is not None:
        query = query.where(Playbook.is_active == is_active)
    
    result = await db.execute(query)
    playbooks = result.scalars().all()
    
    return playbooks


@router.get("/playbooks/{playbook_id}", response_model=PlaybookResponse)
async def get_playbook(
    playbook_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get specific playbook details
    """
    result = await db.execute(
        select(Playbook).where(Playbook.id == playbook_id)
    )
    playbook = result.scalar_one_or_none()
    
    if not playbook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playbook not found"
        )
    
    return playbook


@router.patch("/playbooks/{playbook_id}/toggle")
async def toggle_playbook(
    playbook_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """
    Enable or disable a playbook
    """
    result = await db.execute(
        select(Playbook).where(Playbook.id == playbook_id)
    )
    playbook = result.scalar_one_or_none()
    
    if not playbook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playbook not found"
        )
    
    playbook.is_active = not playbook.is_active
    await db.commit()
    
    return {
        "playbook_id": playbook_id,
        "is_active": playbook.is_active
    }


@router.post("/playbooks/{playbook_id}/execute")
async def execute_playbook(
    playbook_id: int,
    context: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually execute a playbook with given context
    
    - **context**: Data to use for playbook execution
    """
    result = await db.execute(
        select(Playbook).where(Playbook.id == playbook_id)
    )
    playbook = result.scalar_one_or_none()
    
    if not playbook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playbook not found"
        )
    
    # Execute playbook
    engine = PlaybookEngine(db)
    execution_result = await engine.execute_playbook(playbook, context)
    
    # Update execution stats
    playbook.last_executed = datetime.utcnow()
    playbook.execution_count += 1
    await db.commit()
    
    return execution_result


# ============================================================================
# INCIDENT MANAGEMENT
# ============================================================================

@router.post("/incidents", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    incident_data: IncidentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new security incident
    
    - **title**: Incident title
    - **description**: Detailed description
    - **severity**: Severity level
    - **category**: Incident category (malware, phishing, data_breach, etc.)
    """
    import uuid
    
    incident_id = f"INC-{uuid.uuid4().hex[:12].upper()}"
    
    incident = Incident(
        incident_id=incident_id,
        title=incident_data.title,
        description=incident_data.description,
        severity=incident_data.severity,
        category=incident_data.category,
        source=incident_data.source,
        affected_assets=incident_data.affected_assets,
        indicators=incident_data.indicators,
        assigned_to=current_user.id
    )
    
    db.add(incident)
    await db.commit()
    await db.refresh(incident)
    
    return incident


@router.get("/incidents", response_model=List[IncidentResponse])
async def get_incidents(
    status: str = None,
    severity: str = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of security incidents
    """
    from sqlalchemy import desc
    
    query = select(Incident).order_by(desc(Incident.created_at)).limit(limit)
    
    if status:
        query = query.where(Incident.status == status)
    
    if severity:
        query = query.where(Incident.severity == severity)
    
    result = await db.execute(query)
    incidents = result.scalars().all()
    
    return incidents


@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get specific incident details
    """
    result = await db.execute(
        select(Incident).where(Incident.incident_id == incident_id)
    )
    incident = result.scalar_one_or_none()
    
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    
    return incident


@router.patch("/incidents/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: str,
    update_data: IncidentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update incident details
    """
    result = await db.execute(
        select(Incident).where(Incident.incident_id == incident_id)
    )
    incident = result.scalar_one_or_none()
    
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )
    
    # Update fields
    if update_data.title:
        incident.title = update_data.title
    if update_data.description:
        incident.description = update_data.description
    if update_data.severity:
        incident.severity = update_data.severity
    if update_data.status:
        incident.status = update_data.status
        if update_data.status.value == "closed":
            incident.closed_at = datetime.utcnow()
    if update_data.assigned_to is not None:
        incident.assigned_to = update_data.assigned_to
    if update_data.remediation_steps:
        incident.remediation_steps = update_data.remediation_steps
    if update_data.timeline:
        incident.timeline = update_data.timeline
    
    await db.commit()
    await db.refresh(incident)
    
    return incident
