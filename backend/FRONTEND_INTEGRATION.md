# API Integration Guide for React Frontend

## Authentication

### 1. Login
```javascript
const login = async (username, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }
  throw new Error('Login failed');
};
```

### 2. Register
```javascript
const register = async (userData) => {
  const response = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      username: userData.username,
      password: userData.password,
      full_name: userData.fullName,
      role: 'analyst'
    })
  });
  
  return response.json();
};
```

### 3. Get Current User
```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## Dashboard Statistics

```javascript
const getDashboardStats = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};

// Response format:
{
  "total_alerts": 150,
  "critical_alerts": 12,
  "open_incidents": 5,
  "total_vulnerabilities": 87,
  "high_risk_assets": 23,
  "recent_scans": 15
}
```

## SIEM - Logs & Alerts

### Ingest Log
```javascript
const ingestLog = async (logData) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/siem/logs/ingest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source_ip: logData.sourceIp,
      destination_ip: logData.destinationIp,
      severity: logData.severity, // 'critical', 'high', 'medium', 'low', 'info'
      event_type: logData.eventType,
      message: logData.message
    })
  });
  
  return response.json();
};
```

### Search Logs
```javascript
const searchLogs = async (filters) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/siem/logs/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start_date: filters.startDate,
      end_date: filters.endDate,
      source_ip: filters.sourceIp,
      severity: filters.severity, // array: ['critical', 'high']
      search_query: filters.query,
      limit: 100
    })
  });
  
  return response.json();
};
```

### Get Alerts
```javascript
const getAlerts = async (severity = null, status = null) => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (status) params.append('status', status);
  
  const response = await fetch(
    `http://localhost:8000/api/siem/alerts?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

## Web Scanning

### Start Scan
```javascript
const startWebScan = async (targetUrl, scanType = 'active') => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/web-scan/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      target_url: targetUrl,
      scan_type: scanType // 'active' or 'passive'
    })
  });
  
  return response.json();
};
```

### Get Scan Results
```javascript
const getScanResults = async (scanId) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(
    `http://localhost:8000/api/web-scan/results/${scanId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

## Malware Analysis

### Upload File
```javascript
const uploadFileForAnalysis = async (file) => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/api/malware/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};
```

### Get Scan Results
```javascript
const getMalwareScan = async (scanId) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(
    `http://localhost:8000/api/malware/scans/${scanId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};

// Response format:
{
  "scan_id": "MAL-ABC123",
  "filename": "suspicious.exe",
  "sha256": "abc123...",
  "entropy": 7.8,
  "is_malicious": true,
  "virustotal_score": "45/70",
  "static_analysis": { ... }
}
```

## Threat Intelligence

### Check IP Reputation
```javascript
const checkIPReputation = async (ipAddress) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(
    `http://localhost:8000/api/threat-intel/ip-reputation/${ipAddress}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

### Search CVEs
```javascript
const searchCVEs = async (query, severity = null) => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (severity) params.append('severity', severity);
  
  const response = await fetch(
    `http://localhost:8000/api/threat-intel/cve/search?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

## Anomaly Detection

### Detect Anomalies
```javascript
const detectAnomalies = async (startDate, endDate, threshold = 0.1) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/anomaly/detect', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      threshold: threshold
    })
  });
  
  return response.json();
};
```

## SOAR - Incidents

### Create Incident
```javascript
const createIncident = async (incidentData) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:8000/api/soar/incidents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: incidentData.title,
      description: incidentData.description,
      severity: incidentData.severity, // 'critical', 'high', 'medium', 'low'
      category: incidentData.category
    })
  });
  
  return response.json();
};
```

### Get Incidents
```javascript
const getIncidents = async (status = null) => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  
  const response = await fetch(
    `http://localhost:8000/api/soar/incidents?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

## React Hook Example

```javascript
import { useState, useEffect } from 'react';

const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return { stats, loading, error };
};

// Usage in component:
const Dashboard = () => {
  const { stats, loading, error } = useDashboardStats();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Alerts: {stats.total_alerts}</p>
      <p>Critical Alerts: {stats.critical_alerts}</p>
      {/* ... */}
    </div>
  );
};
```

## WebSocket for Real-time Alerts (Future Enhancement)

```javascript
const connectWebSocket = () => {
  const token = localStorage.getItem('access_token');
  const ws = new WebSocket(`ws://localhost:8000/api/ws/alerts?token=${token}`);
  
  ws.onmessage = (event) => {
    const alert = JSON.parse(event.data);
    console.log('New alert:', alert);
    // Update UI with new alert
  };
  
  return ws;
};
```

## Error Handling

```javascript
const apiCall = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('access_token', data.access_token);
        // Retry original request
        return apiCall(url, options);
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```
