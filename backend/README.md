# CyberSecurity Dashboard Backend

Production-grade backend API for a comprehensive cybersecurity dashboard built with FastAPI, PostgreSQL, Elasticsearch, and Celery.

## 🚀 Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Analyst)
- Token refresh mechanism
- Secure password hashing with bcrypt

### 2. SIEM (Security Information and Event Management)
- Real-time log ingestion (single and bulk)
- Elasticsearch-powered log search with advanced filters
- Rule-based detection engine (regex, threshold, correlation)
- Automated alert generation
- MITRE ATT&CK mapping support

### 3. Web Application Scanning
- OWASP ZAP integration
- Active and passive scanning
- Vulnerability detection and risk scoring
- Risk formula: `Risk = Asset_Criticality × CVSS × Exploitability`

### 4. Malware Analysis
- Secure file upload with validation
- SHA256/MD5/SHA1 hash generation
- Shannon entropy calculation
- PE file static analysis
- VirusTotal API integration
- Heuristic-based detection

### 5. AI-Powered Anomaly Detection
- Isolation Forest machine learning model
- Automated model training on historical data
- Real-time anomaly detection in logs
- Configurable sensitivity thresholds

### 6. Threat Intelligence
- IOC (Indicators of Compromise) database
- IP reputation checking
- CVE database with NVD API integration
- Automated threat feed updates

### 7. SOAR (Security Orchestration, Automation and Response)
- Playbook system with IF-THEN logic
- Automated actions:
  - Block IP addresses
  - Send email alerts
  - Create incidents
  - Quarantine files
  - Disable user accounts
- Incident management workflow

### 8. Dashboard & Analytics
- Real-time statistics
- Alert timelines
- Threat distribution
- Vulnerability metrics
- Asset risk analysis

## 📋 Prerequisites

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
- Elasticsearch 8.11
- OWASP ZAP (optional, for web scanning)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Create environment file

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:
- Database credentials
- JWT secret key
- API keys (VirusTotal, NVD, ZAP)
- SMTP settings for email alerts

### 3. Start services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis
- Elasticsearch
- FastAPI backend
- Celery worker
- Celery beat scheduler
- OWASP ZAP (optional)

### 4. Initialize the database

The database tables will be created automatically on first run.

### 5. Create an admin user

```bash
docker-compose exec backend python -c "
from app.core.database import AsyncSessionLocal
from app.models.models import User, UserRole
from app.core.security import get_password_hash
import asyncio

async def create_admin():
    async with AsyncSessionLocal() as db:
        admin = User(
            email='admin@example.com',
            username='admin',
            hashed_password=get_password_hash('admin123'),
            full_name='System Administrator',
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        await db.commit()
        print('Admin user created!')

asyncio.run(create_admin())
"
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔌 Connecting to React Frontend

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App default)

Update `CORS_ORIGINS` in `.env` if your frontend runs on a different port.

### API Base URL

In your React frontend, set the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Authentication Flow

1. **Login**:
```javascript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { access_token, refresh_token } = await response.json();
localStorage.setItem('access_token', access_token);
```

2. **Authenticated Requests**:
```javascript
const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

3. **Token Refresh**:
```javascript
const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});
```

## 📊 Example API Requests

### Ingest Security Log

```bash
curl -X POST http://localhost:8000/api/siem/logs/ingest \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_ip": "192.168.1.100",
    "destination_ip": "10.0.0.5",
    "severity": "high",
    "event_type": "failed_login",
    "message": "Multiple failed login attempts detected"
  }'
```

### Start Web Scan

```bash
curl -X POST http://localhost:8000/api/web-scan/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://example.com",
    "scan_type": "active"
  }'
```

### Upload File for Malware Analysis

```bash
curl -X POST http://localhost:8000/api/malware/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@suspicious_file.exe"
```

### Check IP Reputation

```bash
curl -X GET http://localhost:8000/api/threat-intel/ip-reputation/192.168.1.100 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Dashboard Statistics

```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Development

### Run without Docker

```bash
# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL, Redis, and Elasticsearch separately

# Run migrations (if using Alembic)
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload

# Start Celery worker (in another terminal)
celery -A app.core.celery_app worker --loglevel=info

# Start Celery beat (in another terminal)
celery -A app.core.celery_app beat --loglevel=info
```

## 🧪 Testing

```bash
pytest
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py        # Database connection
│   │   ├── security.py        # JWT & password hashing
│   │   ├── elasticsearch.py   # Elasticsearch client
│   │   └── celery_app.py      # Celery configuration
│   ├── models/
│   │   └── models.py          # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py         # Pydantic schemas
│   ├── routers/
│   │   ├── auth.py            # Authentication routes
│   │   ├── siem.py            # SIEM routes
│   │   ├── web_scan.py        # Web scanning routes
│   │   ├── malware.py         # Malware analysis routes
│   │   ├── threat_intel.py    # Threat intelligence routes
│   │   ├── anomaly.py         # Anomaly detection routes
│   │   ├── soar.py            # SOAR routes
│   │   └── dashboard.py       # Dashboard routes
│   ├── services/
│   │   ├── detection_engine.py    # SIEM detection engine
│   │   ├── web_scanner.py         # OWASP ZAP integration
│   │   ├── malware_analyzer.py    # Malware analysis
│   │   ├── anomaly_detector.py    # ML anomaly detection
│   │   ├── playbook_engine.py     # SOAR playbook execution
│   │   └── tasks/
│   │       ├── analysis_tasks.py      # Background analysis tasks
│   │       ├── threat_intel_tasks.py  # Threat intel updates
│   │       └── scan_tasks.py          # Scanning tasks
│   ├── dependencies/
│   │   └── auth.py            # Authentication dependencies
│   └── utils/                 # Utility functions
├── alembic/                   # Database migrations
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Docker image
├── requirements.txt           # Python dependencies
└── .env.example              # Environment variables template
```

## 🔐 Security Best Practices

- ✅ Input validation on all endpoints
- ✅ File size and type restrictions
- ✅ Rate limiting
- ✅ Secure headers (HSTS, X-Frame-Options, etc.)
- ✅ Password hashing with bcrypt
- ✅ JWT token expiration
- ✅ Role-based access control
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ No hardcoded secrets

## 📈 Performance

- Async/await for non-blocking I/O
- Connection pooling for database
- Background task processing with Celery
- Elasticsearch for fast log search
- Redis for caching and task queue

## 🐛 Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database credentials

### Elasticsearch connection error
- Ensure Elasticsearch is running on port 9200
- Check `ELASTICSEARCH_HOST` in `.env`
- Disable SSL verification if needed

### Celery tasks not running
- Ensure Redis is running
- Check `CELERY_BROKER_URL` in `.env`
- Verify Celery worker is running

### OWASP ZAP connection error
- Ensure ZAP is running on port 8080
- Check `ZAP_PROXY_URL` and `ZAP_API_KEY` in `.env`

## 📝 License

This project is for educational purposes as part of a final-year cybersecurity project.

## 👥 Support

For issues or questions, please create an issue in the repository.
