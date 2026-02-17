"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.models import UserRole, SeverityLevel, AlertStatus, IncidentStatus


# ============================================================================
# AUTH SCHEMAS
# ============================================================================

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.ANALYST


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[int] = None
    type: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# ============================================================================
# ASSET SCHEMAS
# ============================================================================

class AssetBase(BaseModel):
    name: str
    asset_type: Optional[str] = None
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    os: Optional[str] = None
    criticality: int = Field(default=5, ge=1, le=10)
    owner: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    asset_metadata: Optional[Dict[str, Any]] = None


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    name: Optional[str] = None
    asset_type: Optional[str] = None
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    os: Optional[str] = None
    criticality: Optional[int] = Field(None, ge=1, le=10)
    owner: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    asset_metadata: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class AssetResponse(AssetBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# VULNERABILITY SCHEMAS
# ============================================================================

class VulnerabilityBase(BaseModel):
    asset_id: int
    cve_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    cvss_score: Optional[float] = Field(None, ge=0, le=10)
    cvss_vector: Optional[str] = None
    exploitability: float = Field(default=0.5, ge=0, le=1)


class VulnerabilityCreate(VulnerabilityBase):
    pass


class VulnerabilityResponse(VulnerabilityBase):
    id: int
    risk_score: Optional[float] = None
    status: str
    discovered_at: datetime
    patched_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# LOG SCHEMAS
# ============================================================================

class LogIngest(BaseModel):
    timestamp: Optional[datetime] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    severity: SeverityLevel = SeverityLevel.INFO
    event_type: str
    message: str
    user_agent: Optional[str] = None
    method: Optional[str] = None
    url: Optional[str] = None
    status_code: Optional[int] = None
    tags: Optional[List[str]] = None
    raw_log: Optional[str] = None


class LogSearch(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    severity: Optional[List[SeverityLevel]] = None
    event_type: Optional[str] = None
    search_query: Optional[str] = None
    limit: int = Field(default=100, le=1000)


class LogResponse(BaseModel):
    id: str
    timestamp: datetime
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    severity: str
    event_type: str
    message: str
    
    class Config:
        from_attributes = True


# ============================================================================
# ALERT SCHEMAS
# ============================================================================

class AlertCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    rule_id: Optional[str] = None
    mitre_technique: Optional[str] = None


class AlertUpdate(BaseModel):
    status: Optional[AlertStatus] = None
    assigned_to: Optional[int] = None
    false_positive: Optional[bool] = None


class AlertResponse(BaseModel):
    id: int
    alert_id: str
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    status: AlertStatus
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    rule_id: Optional[str] = None
    mitre_technique: Optional[str] = None
    false_positive: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# INCIDENT SCHEMAS
# ============================================================================

class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    category: Optional[str] = None
    source: Optional[str] = None
    affected_assets: Optional[List[int]] = None
    indicators: Optional[Dict[str, Any]] = None


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    status: Optional[IncidentStatus] = None
    assigned_to: Optional[int] = None
    remediation_steps: Optional[str] = None
    timeline: Optional[Dict[str, Any]] = None


class IncidentResponse(BaseModel):
    id: int
    incident_id: str
    title: str
    description: Optional[str] = None
    severity: SeverityLevel
    status: IncidentStatus
    category: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============================================================================
# MALWARE SCAN SCHEMAS
# ============================================================================

class MalwareScanResponse(BaseModel):
    id: int
    scan_id: str
    filename: str
    file_size: Optional[int] = None
    sha256: Optional[str] = None
    md5: Optional[str] = None
    sha1: Optional[str] = None
    file_type: Optional[str] = None
    entropy: Optional[float] = None
    is_malicious: Optional[bool] = None
    malware_family: Optional[str] = None
    virustotal_score: Optional[str] = None
    virustotal_link: Optional[str] = None
    static_analysis: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# THREAT INTEL SCHEMAS
# ============================================================================

class ThreatIntelCreate(BaseModel):
    ioc_type: str
    ioc_value: str
    threat_type: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    confidence: Optional[int] = Field(None, ge=0, le=100)
    source: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None


class ThreatIntelResponse(BaseModel):
    id: int
    ioc_type: str
    ioc_value: str
    threat_type: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    confidence: Optional[int] = None
    source: Optional[str] = None
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# CVE SCHEMAS
# ============================================================================

class CVEResponse(BaseModel):
    id: int
    cve_id: str
    description: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    cvss_v3_score: Optional[float] = None
    cvss_v3_vector: Optional[str] = None
    published_date: Optional[datetime] = None
    exploit_available: bool
    patch_available: bool
    
    class Config:
        from_attributes = True


# ============================================================================
# PLAYBOOK SCHEMAS
# ============================================================================

class PlaybookCreate(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    priority: int = Field(default=5, ge=1, le=10)


class PlaybookResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    trigger_conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    is_active: bool
    priority: int
    execution_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# WEB SCAN SCHEMAS
# ============================================================================

class WebScanRequest(BaseModel):
    target_url: str
    scan_type: str = Field(default="active", pattern="^(active|passive)$")
    
    @validator('target_url')
    def validate_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v


class WebScanResponse(BaseModel):
    scan_id: str
    target_url: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    vulnerabilities_found: int = 0


# ============================================================================
# ANOMALY DETECTION SCHEMAS
# ============================================================================

class AnomalyDetectionRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    threshold: float = Field(default=0.1, ge=0, le=1)


class AnomalyResponse(BaseModel):
    timestamp: datetime
    anomaly_score: float
    features: Dict[str, Any]
    is_anomaly: bool


# ============================================================================
# STATISTICS SCHEMAS
# ============================================================================

class DashboardStats(BaseModel):
    total_alerts: int
    critical_alerts: int
    open_incidents: int
    total_vulnerabilities: int
    high_risk_assets: int
    recent_scans: int
