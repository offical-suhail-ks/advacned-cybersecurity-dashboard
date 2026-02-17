# 📚 API Reference Guide

Complete API endpoint reference for the CyberSecurity Dashboard Backend.

**Base URL**: `http://localhost:8000/api`

---

## 🔐 Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

**Header Format:**
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe",
  "role": "analyst"
}
```

**Roles:** `admin`, `manager`, `analyst`

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "role": "analyst",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### POST /auth/login
Login and receive JWT tokens.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### GET /auth/me
Get current user information.

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin",
  "is_active": true
}
```

---

## 2. Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics.

**Response:** `200 OK`
```json
{
  "total_alerts": 150,
  "critical_alerts": 12,
  "open_incidents": 5,
  "total_vulnerabilities": 87,
  "high_risk_assets": 23,
  "recent_scans": 15
}
```

### GET /dashboard/alerts/timeline
Get alerts timeline.

**Query Parameters:**
- `days` (int, default: 7) - Number of days

**Response:** `200 OK`
```json
{
  "timeline": [
    {
      "key": 1705276800000,
      "doc_count": 25,
      "by_severity": {
        "buckets": [
          {"key": "critical", "doc_count": 5},
          {"key": "high", "doc_count": 10}
        ]
      }
    }
  ]
}
```

### GET /dashboard/threats/top
Get top threats.

**Query Parameters:**
- `limit` (int, default: 10)

**Response:** `200 OK`
```json
{
  "top_techniques": [
    {"technique": "T1190", "count": 45},
    {"technique": "T1110", "count": 32}
  ],
  "top_sources": [
    {"ip": "192.168.1.100", "count": 28}
  ]
}
```

---

## 3. SIEM Endpoints

### POST /siem/logs/ingest
Ingest a single security log.

**Request Body:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "source_ip": "192.168.1.100",
  "destination_ip": "10.0.0.5",
  "severity": "high",
  "event_type": "failed_login",
  "message": "Failed login attempt",
  "user_agent": "Mozilla/5.0...",
  "method": "POST",
  "url": "/login",
  "status_code": 401,
  "tags": ["authentication", "security"]
}
```

**Severity Levels:** `critical`, `high`, `medium`, `low`, `info`

**Response:** `201 Created`
```json
{
  "message": "Log ingested successfully",
  "log_id": "abc123",
  "alerts_generated": 1
}
```

### POST /siem/logs/ingest/bulk
Bulk ingest multiple logs.

**Request Body:**
```json
[
  {
    "source_ip": "192.168.1.100",
    "severity": "medium",
    "event_type": "login",
    "message": "User logged in"
  },
  {
    "source_ip": "192.168.1.101",
    "severity": "high",
    "event_type": "failed_login",
    "message": "Failed login"
  }
]
```

**Response:** `201 Created`
```json
{
  "message": "Bulk ingestion completed",
  "success_count": 2,
  "failed_count": 0
}
```

### POST /siem/logs/search
Search logs with filters.

**Request Body:**
```json
{
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-15T23:59:59Z",
  "source_ip": "192.168.1.100",
  "severity": ["critical", "high"],
  "event_type": "failed_login",
  "search_query": "authentication",
  "limit": 100
}
```

**Response:** `200 OK`
```json
[
  {
    "id": "abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "source_ip": "192.168.1.100",
    "severity": "high",
    "event_type": "failed_login",
    "message": "Failed login attempt"
  }
]
```

### GET /siem/alerts
Get security alerts.

**Query Parameters:**
- `severity` (string) - Filter by severity
- `status` (string) - Filter by status
- `limit` (int, default: 100)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "alert_id": "ALT-ABC123",
    "title": "Brute Force Attack Detected",
    "severity": "high",
    "status": "open",
    "source_ip": "192.168.1.100",
    "mitre_technique": "T1110",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### PATCH /siem/alerts/{alert_id}
Update an alert.

**Request Body:**
```json
{
  "status": "resolved",
  "assigned_to": 1,
  "false_positive": false
}
```

**Alert Statuses:** `open`, `in_progress`, `resolved`, `false_positive`

---

## 4. Web Scanning Endpoints

### POST /web-scan/start
Start a web application scan.

**Request Body:**
```json
{
  "target_url": "https://example.com",
  "scan_type": "active"
}
```

**Scan Types:** `active`, `passive`

**Response:** `202 Accepted`
```json
{
  "scan_id": "SCAN-ABC123",
  "target_url": "https://example.com",
  "status": "started",
  "started_at": "2024-01-15T10:30:00Z",
  "vulnerabilities_found": 0
}
```

### GET /web-scan/status/{scan_id}
Get scan status.

**Response:** `200 OK`
```json
{
  "scan_id": "SCAN-ABC123",
  "status": "in_progress",
  "progress": 75,
  "message": "Scanning for vulnerabilities..."
}
```

### GET /web-scan/results/{scan_id}
Get scan results.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "asset_id": 1,
    "title": "SQL Injection",
    "severity": "high",
    "cvss_score": 8.5,
    "risk_score": 68.0,
    "status": "open",
    "discovered_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## 5. Malware Analysis Endpoints

### POST /malware/upload
Upload file for analysis.

**Request:**
```
Content-Type: multipart/form-data

file: <binary file>
```

**Response:** `202 Accepted`
```json
{
  "id": 1,
  "scan_id": "MAL-ABC123",
  "filename": "suspicious.exe",
  "file_size": 1024000,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### GET /malware/scans/{scan_id}
Get malware scan results.

**Response:** `200 OK`
```json
{
  "scan_id": "MAL-ABC123",
  "filename": "suspicious.exe",
  "sha256": "abc123...",
  "md5": "def456...",
  "sha1": "ghi789...",
  "file_type": "PE",
  "entropy": 7.8,
  "is_malicious": true,
  "malware_family": "Trojan.Generic",
  "virustotal_score": "45/70",
  "virustotal_link": "https://virustotal.com/...",
  "static_analysis": {
    "is_pe": true,
    "suspicious_sections": [".upx"],
    "suspicious_imports": ["VirtualAlloc", "WriteProcessMemory"],
    "is_packed": true
  }
}
```

### GET /malware/scans
List malware scans.

**Query Parameters:**
- `limit` (int, default: 50)

---

## 6. Threat Intelligence Endpoints

### POST /threat-intel/ioc
Create an IOC (Indicator of Compromise).

**Request Body:**
```json
{
  "ioc_type": "ip",
  "ioc_value": "192.168.1.100",
  "threat_type": "malware",
  "severity": "high",
  "confidence": 85,
  "source": "Internal Analysis",
  "description": "C2 server",
  "tags": ["c2", "malware"]
}
```

**IOC Types:** `ip`, `domain`, `hash`, `url`, `email`

**Response:** `201 Created`

### GET /threat-intel/ioc/check/{value}
Check if a value is a known IOC.

**Response:** `200 OK`
```json
{
  "is_threat": true,
  "ioc_type": "ip",
  "threat_type": "malware",
  "severity": "high",
  "confidence": 85,
  "description": "C2 server"
}
```

### GET /threat-intel/ip-reputation/{ip}
Check IP reputation.

**Response:** `200 OK`
```json
{
  "ip_address": "192.168.1.100",
  "is_malicious": true,
  "threat_type": "malware",
  "severity": "high",
  "sources": [
    {
      "name": "Internal Database",
      "confidence": 85,
      "description": "C2 server"
    }
  ]
}
```

### GET /threat-intel/cve/search
Search CVE database.

**Query Parameters:**
- `query` (string) - Search term
- `severity` (string) - Filter by severity
- `exploit_available` (bool)
- `limit` (int, default: 50)

**Response:** `200 OK`
```json
[
  {
    "cve_id": "CVE-2024-1234",
    "description": "Remote code execution...",
    "severity": "critical",
    "cvss_v3_score": 9.8,
    "published_date": "2024-01-15T00:00:00Z",
    "exploit_available": true,
    "patch_available": true
  }
]
```

---

## 7. Anomaly Detection Endpoints

### POST /anomaly/detect
Detect anomalies in logs.

**Request Body:**
```json
{
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-15T23:59:59Z",
  "threshold": 0.1
}
```

**Response:** `200 OK`
```json
[
  {
    "timestamp": "2024-01-15T10:00:00Z",
    "anomaly_score": 0.85,
    "is_anomaly": true,
    "features": {
      "request_count": 1500,
      "unique_ips": 250,
      "error_rate": 0.15,
      "failed_logins": 45
    }
  }
]
```

### POST /anomaly/train
Trigger model training.

**Response:** `200 OK`
```json
{
  "message": "Model training started",
  "status": "training"
}
```

---

## 8. SOAR Endpoints

### POST /soar/playbooks
Create a SOAR playbook.

**Request Body:**
```json
{
  "name": "Block Malicious IP",
  "description": "Automatically block IPs with critical alerts",
  "trigger_conditions": {
    "alert_severity": "critical",
    "ioc_type": "ip"
  },
  "actions": [
    {
      "type": "block_ip",
      "target": "firewall"
    },
    {
      "type": "send_email",
      "recipients": ["soc@company.com"]
    },
    {
      "type": "create_incident",
      "severity": "high"
    }
  ],
  "priority": 8
}
```

**Action Types:**
- `block_ip` - Block IP address
- `send_email` - Send email alert
- `create_incident` - Create security incident
- `quarantine_file` - Quarantine file
- `disable_user` - Disable user account
- `log_event` - Log event

**Response:** `201 Created`

### POST /soar/playbooks/{id}/execute
Execute a playbook manually.

**Request Body:**
```json
{
  "source_ip": "192.168.1.100",
  "severity": "critical",
  "event_type": "malware_detected"
}
```

**Response:** `200 OK`
```json
{
  "executed": true,
  "playbook_id": 1,
  "playbook_name": "Block Malicious IP",
  "actions_executed": 3,
  "results": [
    {
      "action": "block_ip",
      "status": "success",
      "message": "IP 192.168.1.100 blocked"
    }
  ]
}
```

### POST /soar/incidents
Create a security incident.

**Request Body:**
```json
{
  "title": "Malware Infection Detected",
  "description": "Trojan detected on workstation",
  "severity": "high",
  "category": "malware",
  "source": "EDR Alert",
  "affected_assets": [1, 2, 3],
  "indicators": {
    "file_hash": "abc123...",
    "ip_address": "192.168.1.100"
  }
}
```

**Incident Categories:** `malware`, `phishing`, `data_breach`, `unauthorized_access`, `dos`, `other`

**Response:** `201 Created`
```json
{
  "id": 1,
  "incident_id": "INC-ABC123",
  "title": "Malware Infection Detected",
  "severity": "high",
  "status": "new",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### PATCH /soar/incidents/{incident_id}
Update an incident.

**Request Body:**
```json
{
  "status": "investigating",
  "assigned_to": 1,
  "remediation_steps": "1. Isolated infected machine\n2. Running full scan"
}
```

**Incident Statuses:** `new`, `investigating`, `contained`, `eradicated`, `recovered`, `closed`

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Operation not permitted. Required roles: ['admin']"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Default: 60 requests per minute per IP address.

**Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705320000
```

---

## Pagination

For endpoints returning lists, use:
- `limit` - Maximum results (default varies by endpoint)
- `offset` - Skip N results (for future implementation)

---

## WebSocket (Future)

Real-time alerts will be available at:
```
ws://localhost:8000/api/ws/alerts?token=<access_token>
```

---

**For interactive API documentation, visit:**
- http://localhost:8000/api/docs (Swagger UI)
- http://localhost:8000/api/redoc (ReDoc)
