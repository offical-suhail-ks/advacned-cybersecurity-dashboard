# CyberSecurity Dashboard - Complete Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Frontend Integration](#frontend-integration)
6. [Security Features](#security-features)
7. [Advanced Usage](#advanced-usage)

---

## System Overview

### What is This?

A **production-grade cybersecurity operations platform** that provides:
- Real-time threat monitoring and detection
- Web application security scanning
- Malware analysis
- AI-powered anomaly detection
- Automated incident response (SOAR)
- Threat intelligence management
- Security information and event management (SIEM)

### Technology Stack

**Backend:**
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **Elasticsearch** - Log storage and search
- **Redis** - Caching and task queue
- **Celery** - Background task processing
- **OWASP ZAP** - Web application scanner
- **Scikit-learn** - Machine learning (Isolation Forest)

**Deployment:**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│                   (Port 5173 / 3000)                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (Port 8000)                │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │   SIEM   │   Web    │ Malware  │   SOAR   │  │
│  │  Router  │  Router  │  Scanner │ Analyzer │  Router  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────┬────────┬────────┬────────┬────────┬───────────────┘
         │        │        │        │        │
         ▼        ▼        ▼        ▼        ▼
    ┌────────┐ ┌─────────┐ ┌─────┐ ┌──────────┐ ┌──────────┐
    │Postgres│ │Elastic  │ │Redis│ │OWASP ZAP │ │  Celery  │
    │  DB    │ │ search  │ │     │ │(Port 8080│ │  Worker  │
    │(5432)  │ │ (9200)  │ │(6379│ │          │ │          │
    └────────┘ └─────────┘ └─────┘ └──────────┘ └──────────┘
```

### Data Flow

1. **Authentication**: User logs in → JWT token issued
2. **Log Ingestion**: Logs sent to API → Stored in Elasticsearch → Analyzed by detection engine
3. **Web Scanning**: Scan request → ZAP performs scan → Results stored in PostgreSQL
4. **Malware Analysis**: File uploaded → Analyzed → VirusTotal lookup → Results stored
5. **Anomaly Detection**: ML model analyzes logs → Flags anomalies → Creates alerts
6. **SOAR**: Alert triggered → Playbook executed → Automated actions performed

---

## Features

### 1. Authentication & Authorization

**JWT-Based Authentication:**
- Access tokens (30 minutes expiry)
- Refresh tokens (7 days expiry)
- Secure password hashing (bcrypt)

**Role-Based Access Control (RBAC):**
- **Admin**: Full system access
- **Manager**: Manage users, view all data, create playbooks
- **Analyst**: View data, create incidents, run scans

**Endpoints:**
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/users` - List all users (admin only)

### 2. SIEM (Security Information and Event Management)

**Log Ingestion:**
- Single log ingestion
- Bulk log ingestion (up to 10,000 logs)
- Automatic indexing in Elasticsearch
- Real-time detection rule evaluation

**Log Search:**
- Full-text search across all log fields
- Filter by date range, IP address, severity, event type
- Aggregations and statistics
- Timeline visualization data

**Detection Engine:**
- **Regex Rules**: Pattern matching (e.g., SQL injection detection)
- **Threshold Rules**: Count-based detection (e.g., 5 failed logins in 10 minutes)
- **Correlation Rules**: Multi-event correlation (e.g., port scan + brute force)
- **ML Rules**: Anomaly detection integration

**Alert Management:**
- Automatic alert generation
- Alert status tracking (open, in_progress, resolved, false_positive)
- Alert assignment to users
- MITRE ATT&CK technique mapping

**Endpoints:**
- `POST /api/siem/logs/ingest` - Ingest single log
- `POST /api/siem/logs/ingest/bulk` - Bulk ingest logs
- `POST /api/siem/logs/search` - Search logs
- `GET /api/siem/logs/stats` - Get log statistics
- `GET /api/siem/alerts` - Get alerts
- `PATCH /api/siem/alerts/{id}` - Update alert

### 3. Web Application Scanning

**OWASP ZAP Integration:**
- Active scanning (sends attack payloads)
- Passive scanning (observational only)
- Spider/crawler for URL discovery
- Vulnerability detection

**Scan Types:**
- **Passive**: Safe, non-intrusive scanning
- **Active**: Aggressive testing with attack payloads

**Vulnerability Detection:**
- SQL Injection
- Cross-Site Scripting (XSS)
- Security misconfigurations
- Missing security headers
- Authentication issues
- And 100+ other OWASP vulnerabilities

**Risk Scoring:**
```
Risk Score = (Asset Criticality / 10) × (CVSS Score / 10) × Exploitability × 100
```

**Endpoints:**
- `POST /api/web-scan/start` - Start web scan
- `GET /api/web-scan/status/{scan_id}` - Get scan status
- `GET /api/web-scan/results/{scan_id}` - Get scan results

### 4. Malware Analysis

**File Analysis:**
- Hash generation (SHA256, MD5, SHA1)
- Shannon entropy calculation (detects encryption/packing)
- File type detection (magic bytes)
- PE file static analysis (Windows executables)

**PE File Analysis:**
- Section analysis (detects packers like UPX)
- Import table analysis (suspicious API calls)
- Resource analysis
- Entropy per section

**VirusTotal Integration:**
- Automatic hash lookup
- Malware family identification
- Detection ratio (e.g., 45/70 engines detected)

**Heuristic Detection:**
- High entropy detection (> 7.5 = suspicious)
- Suspicious API imports (VirtualAlloc, CreateRemoteThread, etc.)
- Packer detection
- Suspicious section names

**Endpoints:**
- `POST /api/malware/upload` - Upload file for analysis
- `GET /api/malware/scans` - List malware scans
- `GET /api/malware/scans/{scan_id}` - Get scan details
- `DELETE /api/malware/scans/{scan_id}` - Delete scan

### 5. AI-Powered Anomaly Detection

**Machine Learning Model:**
- **Algorithm**: Isolation Forest
- **Features**: Request count, unique IPs, error rate, failed logins, avg status code
- **Training**: Automatic on historical data (last 30 days)
- **Detection**: Real-time anomaly scoring

**Anomaly Types Detected:**
- Unusual traffic patterns
- Suspicious login activity
- Data exfiltration attempts
- DDoS attacks
- Port scanning
- Brute force attacks

**Endpoints:**
- `POST /api/anomaly/detect` - Run anomaly detection
- `POST /api/anomaly/train` - Trigger model training
- `GET /api/anomaly/model/info` - Get model information
- `GET /api/anomaly/stats` - Get anomaly statistics

### 6. Threat Intelligence

**IOC (Indicators of Compromise) Management:**
- IP addresses
- Domain names
- File hashes
- URLs
- Email addresses

**IOC Attributes:**
- Threat type (malware, phishing, C2, ransomware, etc.)
- Severity level
- Confidence score (0-100)
- Source (threat feed, manual entry)
- First/last seen timestamps
- Tags for categorization

**CVE Database:**
- NVD API integration
- CVE search by ID or description
- Filter by severity and exploit availability
- CVSS score and vector

**IP Reputation:**
- Check IP against IOC database
- Integration ready for external feeds (AbuseIPDB, VirusTotal, etc.)

**Endpoints:**
- `POST /api/threat-intel/ioc` - Add IOC
- `GET /api/threat-intel/ioc` - List IOCs
- `GET /api/threat-intel/ioc/check/{value}` - Check if value is IOC
- `GET /api/threat-intel/cve/search` - Search CVEs
- `GET /api/threat-intel/cve/{cve_id}` - Get CVE details
- `GET /api/threat-intel/ip-reputation/{ip}` - Check IP reputation

### 7. SOAR (Security Orchestration, Automation and Response)

**Playbook System:**
- IF-THEN logic
- Trigger conditions (alert severity, IOC type, etc.)
- Automated actions
- Priority-based execution

**Available Actions:**
- **Block IP**: Firewall integration (simulated)
- **Send Email**: SMTP email alerts
- **Create Incident**: Automatic incident creation
- **Quarantine File**: File isolation
- **Disable User**: Account suspension
- **Log Event**: Audit logging

**Incident Management:**
- Incident creation and tracking
- Status workflow (new → in_progress → resolved → closed)
- Assignment to users
- Timeline tracking
- Remediation steps documentation

**Endpoints:**
- `POST /api/soar/playbooks` - Create playbook
- `GET /api/soar/playbooks` - List playbooks
- `GET /api/soar/playbooks/{id}` - Get playbook details
- `PATCH /api/soar/playbooks/{id}/toggle` - Enable/disable playbook
- `POST /api/soar/playbooks/{id}/execute` - Manually execute playbook
- `POST /api/soar/incidents` - Create incident
- `GET /api/soar/incidents` - List incidents
- `GET /api/soar/incidents/{id}` - Get incident details
- `PATCH /api/soar/incidents/{id}` - Update incident

### 8. Dashboard & Analytics

**Real-Time Statistics:**
- Total alerts (by severity)
- Active threats
- Vulnerabilities (by severity)
- Recent scans
- System health

**Alert Analytics:**
- Alert timeline (hourly/daily)
- Top alert types
- Alert distribution by severity
- MITRE ATT&CK technique distribution

**Threat Analytics:**
- Top threat sources (IPs)
- Threat type distribution
- Geographic distribution (if GeoIP enabled)

**Vulnerability Analytics:**
- Vulnerability trends
- Asset risk scores
- Top vulnerable assets
- Remediation status

**Endpoints:**
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/alerts/timeline` - Get alert timeline
- `GET /api/dashboard/threats/top-sources` - Get top threat sources
- `GET /api/dashboard/vulnerabilities/by-severity` - Get vulnerability distribution

---

## API Reference

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Authenticated Request
```http
GET /api/dashboard/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### SIEM

#### Ingest Log
```http
POST /api/siem/logs/ingest
Authorization: Bearer {token}
Content-Type: application/json

{
  "timestamp": "2024-02-17T08:30:00Z",
  "source_ip": "192.168.1.100",
  "destination_ip": "10.0.0.5",
  "severity": "high",
  "event_type": "failed_login",
  "message": "Failed login attempt for user admin",
  "user_agent": "Mozilla/5.0...",
  "method": "POST",
  "url": "/login",
  "status_code": 401,
  "tags": ["authentication", "failure"]
}
```

#### Search Logs
```http
POST /api/siem/logs/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "start_date": "2024-02-17T00:00:00Z",
  "end_date": "2024-02-17T23:59:59Z",
  "source_ip": "192.168.1.100",
  "severity": ["high", "critical"],
  "search_query": "failed login",
  "limit": 100
}
```

### Web Scanning

#### Start Scan
```http
POST /api/web-scan/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "target_url": "https://example.com",
  "scan_type": "passive"
}
```

**Response:**
```json
{
  "scan_id": "SCAN-ABC123DEF456",
  "target_url": "https://example.com",
  "status": "started",
  "started_at": "2024-02-17T08:30:00Z",
  "vulnerabilities_found": 0
}
```

#### Get Results
```http
GET /api/web-scan/results/SCAN-ABC123DEF456
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "SQL Injection",
    "description": "SQL injection vulnerability found in login form",
    "severity": "critical",
    "cvss_score": 9.8,
    "risk_score": 85.5,
    "remediation": "Use parameterized queries",
    "cve_id": "CVE-2023-1234",
    "scan_id": "SCAN-ABC123DEF456"
  }
]
```

### Malware Analysis

#### Upload File
```http
POST /api/malware/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary file data]
```

**Response:**
```json
{
  "scan_id": "MAL-XYZ789ABC123",
  "filename": "suspicious.exe",
  "file_size": 1048576,
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "status": "analyzing"
}
```

### Threat Intelligence

#### Add IOC
```http
POST /api/threat-intel/ioc
Authorization: Bearer {token}
Content-Type: application/json

{
  "ioc_type": "ip",
  "ioc_value": "192.168.1.100",
  "threat_type": "malware",
  "severity": "high",
  "confidence": 85,
  "source": "Internal Analysis",
  "description": "C2 server detected",
  "tags": ["c2", "malware", "botnet"]
}
```

#### Check IP Reputation
```http
GET /api/threat-intel/ip-reputation/192.168.1.100
Authorization: Bearer {token}
```

**Response:**
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
      "description": "C2 server detected"
    }
  ]
}
```

### SOAR

#### Create Playbook
```http
POST /api/soar/playbooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Block Malicious IP",
  "description": "Automatically block IPs flagged as malicious",
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
      "recipients": ["soc@company.com"],
      "subject": "Critical Alert: Malicious IP Blocked"
    },
    {
      "type": "create_incident",
      "severity": "high"
    }
  ],
  "priority": 10
}
```

#### Create Incident
```http
POST /api/soar/incidents
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Suspected Data Breach",
  "description": "Unusual data exfiltration detected",
  "severity": "critical",
  "category": "data_breach",
  "source": "SIEM Alert",
  "affected_assets": ["web-server-01", "database-01"],
  "indicators": {
    "source_ip": "192.168.1.100",
    "data_volume": "10GB",
    "duration": "2 hours"
  }
}
```

---

## Frontend Integration

### Setup

**Install Axios:**
```bash
npm install axios
```

**Create API Client:**
```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', data.access_token);
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return axios(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Authentication

**Login Component:**
```javascript
// src/components/Login.jsx
import { useState } from 'react';
import apiClient from '../api/client';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Login;
```

### Dashboard

**Dashboard Component:**
```javascript
// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Alerts</h3>
        <p className="stat-value">{stats.total_alerts}</p>
      </div>
      <div className="stat-card">
        <h3>Critical Alerts</h3>
        <p className="stat-value critical">{stats.critical_alerts}</p>
      </div>
      <div className="stat-card">
        <h3>Active Threats</h3>
        <p className="stat-value">{stats.active_threats}</p>
      </div>
      <div className="stat-card">
        <h3>Vulnerabilities</h3>
        <p className="stat-value">{stats.total_vulnerabilities}</p>
      </div>
    </div>
  );
}

export default Dashboard;
```

### Web Scanner

**Scanner Component:**
```javascript
// src/components/WebScanner.jsx
import { useState } from 'react';
import apiClient from '../api/client';

function WebScanner() {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('passive');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const startScan = async () => {
    setScanning(true);
    try {
      const { data } = await apiClient.post('/web-scan/start', {
        target_url: targetUrl,
        scan_type: scanType,
      });
      
      // Poll for results
      setTimeout(async () => {
        const { data: vulnerabilities } = await apiClient.get(
          `/web-scan/results/${data.scan_id}`
        );
        setResults(vulnerabilities);
        setScanning(false);
      }, 30000); // Wait 30 seconds for scan to complete
    } catch (error) {
      console.error('Scan failed:', error);
      setScanning(false);
    }
  };

  return (
    <div className="web-scanner">
      <h2>Web Application Scanner</h2>
      <input
        type="url"
        placeholder="https://example.com"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
      />
      <select value={scanType} onChange={(e) => setScanType(e.target.value)}>
        <option value="passive">Passive Scan</option>
        <option value="active">Active Scan</option>
      </select>
      <button onClick={startScan} disabled={scanning || !targetUrl}>
        {scanning ? 'Scanning...' : 'Start Scan'}
      </button>

      {results && (
        <div className="results">
          <h3>Found {results.length} vulnerabilities</h3>
          {results.map((vuln) => (
            <div key={vuln.id} className={`vuln-card ${vuln.severity}`}>
              <h4>{vuln.title}</h4>
              <p>Severity: {vuln.severity}</p>
              <p>CVSS: {vuln.cvss_score}</p>
              <p>Risk Score: {vuln.risk_score}</p>
              <p>{vuln.description}</p>
              <p><strong>Remediation:</strong> {vuln.remediation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WebScanner;
```

### Real-Time Updates (WebSocket)

**WebSocket Hook:**
```javascript
// src/hooks/useWebSocket.js
import { useEffect, useState } from 'react';

function useWebSocket(url) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    return () => ws.close();
  }, [url]);

  return { data, connected };
}

export default useWebSocket;
```

**Usage:**
```javascript
// src/components/AlertFeed.jsx
import useWebSocket from '../hooks/useWebSocket';

function AlertFeed() {
  const { data: alert, connected } = useWebSocket('ws://localhost:8000/ws/alerts');

  return (
    <div className="alert-feed">
      <h3>Live Alerts {connected && <span className="status-dot"></span>}</h3>
      {alert && (
        <div className={`alert ${alert.severity}`}>
          <h4>{alert.title}</h4>
          <p>{alert.description}</p>
          <small>{new Date(alert.timestamp).toLocaleString()}</small>
        </div>
      )}
    </div>
  );
}

export default AlertFeed;
```

---

## Security Features

### Input Validation
- **Pydantic schemas** validate all request data
- **File upload restrictions**: Size limits, allowed extensions
- **URL validation**: Prevents SSRF attacks
- **SQL injection prevention**: SQLAlchemy ORM with parameterized queries

### Authentication Security
- **Password hashing**: bcrypt with salt
- **Token expiration**: Access tokens expire in 30 minutes
- **Refresh token rotation**: New refresh token on each use
- **Rate limiting**: 60 requests per minute per IP

### Security Headers
```python
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### CORS Configuration
- Whitelist-based origin validation
- Credentials support for authenticated requests
- Configurable via environment variables

### Data Protection
- **Encryption at rest**: Database encryption (configure PostgreSQL)
- **Encryption in transit**: HTTPS/TLS (configure reverse proxy)
- **Secrets management**: Environment variables, never hardcoded
- **File quarantine**: Malware samples isolated in secure directory

---

## Advanced Usage

### Custom Detection Rules

**Create Regex Rule:**
```python
# Detect SQL injection attempts
{
  "name": "SQL Injection Detection",
  "description": "Detects SQL injection patterns in logs",
  "rule_type": "regex",
  "rule_logic": {
    "field": "message",
    "pattern": "(?i)(union|select|insert|update|delete).*from",
    "description": "SQL Injection attempt"
  },
  "severity": "critical",
  "mitre_technique": "T1190"
}
```

**Create Threshold Rule:**
```python
# Detect brute force attacks
{
  "name": "Brute Force Detection",
  "description": "Detects multiple failed login attempts",
  "rule_type": "threshold",
  "rule_logic": {
    "field": "source_ip",
    "event_type": "failed_login",
    "threshold": 5,
    "timeframe_minutes": 10
  },
  "severity": "high",
  "mitre_technique": "T1110"
}
```

**Create Correlation Rule:**
```python
# Detect reconnaissance followed by exploitation
{
  "name": "Recon + Exploit Detection",
  "description": "Detects port scan followed by brute force",
  "rule_type": "correlation",
  "rule_logic": {
    "events": [
      {"event_type": "port_scan", "timeframe_minutes": 5},
      {"event_type": "brute_force", "timeframe_minutes": 10}
    ],
    "same_source": true
  },
  "severity": "critical",
  "mitre_technique": "T1595"
}
```

### Custom SOAR Playbooks

**Auto-Block Malicious IPs:**
```python
{
  "name": "Auto-Block Malicious IP",
  "description": "Automatically block IPs with critical alerts",
  "trigger_conditions": {
    "alert_severity": "critical",
    "source_ip": {"operator": "!=", "value": null}
  },
  "actions": [
    {
      "type": "block_ip",
      "target": "firewall"
    },
    {
      "type": "send_email",
      "recipients": ["soc@company.com"],
      "subject": "CRITICAL: IP Blocked"
    },
    {
      "type": "create_incident",
      "severity": "high"
    },
    {
      "type": "log_event",
      "message": "Malicious IP automatically blocked"
    }
  ],
  "priority": 10
}
```

**Malware Response:**
```python
{
  "name": "Malware Response",
  "description": "Respond to malware detection",
  "trigger_conditions": {
    "is_malicious": true,
    "virustotal_score": {"operator": ">=", "value": "10/70"}
  },
  "actions": [
    {
      "type": "quarantine_file",
      "file_path": "{{file_path}}"
    },
    {
      "type": "disable_user",
      "username": "{{uploaded_by}}"
    },
    {
      "type": "send_email",
      "recipients": ["security@company.com"],
      "subject": "MALWARE DETECTED"
    },
    {
      "type": "create_incident",
      "severity": "critical",
      "category": "malware"
    }
  ],
  "priority": 10
}
```

### Celery Background Tasks

**Custom Task Example:**
```python
# app/services/tasks/custom_tasks.py
from app.core.celery_app import celery_app

@celery_app.task
def scan_all_assets():
    """Scan all assets for vulnerabilities"""
    # Your logic here
    pass

@celery_app.task
def update_threat_feeds():
    """Update threat intelligence feeds"""
    # Your logic here
    pass
```

**Schedule Tasks:**
```python
# app/core/celery_app.py
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    'scan-assets-daily': {
        'task': 'app.services.tasks.custom_tasks.scan_all_assets',
        'schedule': crontab(hour=2, minute=0),  # 2 AM daily
    },
    'update-threat-feeds-hourly': {
        'task': 'app.services.tasks.custom_tasks.update_threat_feeds',
        'schedule': crontab(minute=0),  # Every hour
    },
}
```

### Database Queries

**Custom Queries:**
```python
from sqlalchemy import select, func
from app.models.models import Alert, Vulnerability

# Get top 10 most vulnerable assets
async def get_top_vulnerable_assets(db):
    query = (
        select(
            Vulnerability.asset_id,
            func.count(Vulnerability.id).label('vuln_count'),
            func.avg(Vulnerability.risk_score).label('avg_risk')
        )
        .where(Vulnerability.status == 'open')
        .group_by(Vulnerability.asset_id)
        .order_by(func.count(Vulnerability.id).desc())
        .limit(10)
    )
    result = await db.execute(query)
    return result.all()
```

### Elasticsearch Queries

**Custom Search:**
```python
from app.core.elasticsearch import get_elasticsearch

async def search_advanced_threats():
    es = get_elasticsearch()
    
    query = {
        "bool": {
            "must": [
                {"range": {"timestamp": {"gte": "now-24h"}}},
                {"terms": {"severity": ["high", "critical"]}}
            ],
            "should": [
                {"match": {"message": "exploit"}},
                {"match": {"message": "malware"}},
                {"match": {"message": "ransomware"}}
            ],
            "minimum_should_match": 1
        }
    }
    
    result = await es.search(
        index="cybersec_logs",
        query=query,
        size=100
    )
    
    return result['hits']['hits']
```

---

## Production Deployment

### Environment Variables (Production)

```bash
# Generate strong secret key
SECRET_KEY=$(openssl rand -hex 32)

# Use strong database password
DATABASE_URL=postgresql+asyncpg://postgres:STRONG_PASSWORD@db:5432/cybersec_db

# Enable production mode
DEBUG=False
ENVIRONMENT=production

# Configure HTTPS
CORS_ORIGINS=https://yourdomain.com

# Use real API keys
VIRUSTOTAL_API_KEY=your_real_key
NVD_API_KEY=your_real_key

# Configure email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Docker Production Build

```dockerfile
# Dockerfile.prod
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc g++ make pkg-config libmagic1 libfuzzy-dev curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/cybersec
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Monitoring

**Health Check Endpoint:**
```bash
curl http://localhost:8000/health
```

**Prometheus Metrics:**
```python
# Add to app/main.py
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

**Access metrics:**
```bash
curl http://localhost:8000/metrics
```

---

## Performance Optimization

### Database Indexing
```sql
-- Add indexes for common queries
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_source_ip ON logs(source_ip);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_vulnerabilities_asset_id ON vulnerabilities(asset_id);
```

### Caching
```python
# Use Redis for caching
from redis import asyncio as aioredis

redis = aioredis.from_url("redis://localhost:6379")

async def get_cached_stats():
    cached = await redis.get("dashboard:stats")
    if cached:
        return json.loads(cached)
    
    stats = await calculate_stats()
    await redis.setex("dashboard:stats", 300, json.dumps(stats))  # Cache 5 min
    return stats
```

### Connection Pooling
```python
# Already configured in app/core/database.py
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True
)
```

---

## Backup and Recovery

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres cybersec_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres cybersec_db < backup.sql
```

### Elasticsearch Backup
```bash
# Create snapshot repository
curl -X PUT "localhost:9200/_snapshot/backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backups"
  }
}'

# Create snapshot
curl -X PUT "localhost:9200/_snapshot/backup/snapshot_1"
```

---

## Support and Resources

### Documentation
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **Setup Guide**: SETUP.md

### Useful Commands
```bash
# View all logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Rebuild service
docker-compose up -d --build backend

# Access container shell
docker-compose exec backend bash

# Run Python script
docker-compose exec backend python script.py

# Database shell
docker-compose exec postgres psql -U postgres cybersec_db
```

### Common Issues
See SETUP.md for detailed troubleshooting guide.

---

**System Version**: 1.0.0  
**Last Updated**: February 17, 2024  
**Documentation**: Complete
