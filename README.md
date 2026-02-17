# 🛡️ Advanced Cybersecurity Operations Platform

A **production-grade, full-stack cybersecurity dashboard** combining real-time threat monitoring, AI-powered anomaly detection, web application scanning, malware analysis, and automated incident response.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Educational-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This platform is a comprehensive cybersecurity operations center (SOC) that provides:

- **Real-time SIEM** - Security Information and Event Management with Elasticsearch
- **Web Application Scanner** - OWASP ZAP integration for vulnerability detection
- **Malware Analysis** - Static analysis, entropy calculation, VirusTotal integration
- **AI Anomaly Detection** - Machine learning-based threat detection (Isolation Forest)
- **Threat Intelligence** - IOC database, IP reputation, CVE tracking
- **SOAR** - Security Orchestration, Automation and Response with playbooks
- **Interactive Dashboard** - Modern React UI with real-time updates

**Perfect for:**
- Security Operations Centers (SOC)
- Penetration Testing Teams
- Security Researchers
- Educational Institutions
- Cybersecurity Training

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Manager, Analyst)
- Secure password hashing with bcrypt
- Session management

### 📊 SIEM (Security Information and Event Management)
- Real-time log ingestion (single & bulk)
- Elasticsearch-powered search with advanced filters
- Rule-based detection engine:
  - Regex pattern matching
  - Threshold-based detection
  - Event correlation
  - ML-based anomaly detection
- Automated alert generation
- MITRE ATT&CK mapping

### 🌐 Web Application Scanning
- OWASP ZAP integration
- Active & passive scanning modes
- Detects 100+ vulnerability types:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Security misconfigurations
  - Missing security headers
  - Authentication issues
- Risk scoring algorithm
- Scan history and reporting

### 🦠 Malware Analysis
- File upload with validation
- Multi-hash generation (SHA256, MD5, SHA1)
- Shannon entropy calculation
- PE file static analysis:
  - Section analysis
  - Import table inspection
  - Packer detection
  - Resource analysis
- VirusTotal API integration
- Heuristic-based detection

### 🤖 AI-Powered Anomaly Detection
- Isolation Forest machine learning model
- Automated training on historical data
- Real-time anomaly scoring
- Detects:
  - Unusual traffic patterns
  - Suspicious login activity
  - Data exfiltration attempts
  - DDoS attacks
  - Port scanning
  - Brute force attacks

### 🔍 Threat Intelligence
- IOC (Indicators of Compromise) management
- IP reputation checking
- CVE database with NVD integration
- Threat feed updates
- Malware family tracking

### ⚡ SOAR (Security Orchestration, Automation and Response)
- Playbook system with IF-THEN logic
- Automated actions:
  - Block IP addresses
  - Send email alerts
  - Create incidents
  - Quarantine files
  - Disable user accounts
- Incident management workflow
- Priority-based execution

### 📈 Dashboard & Analytics
- Real-time statistics
- Alert timelines
- Threat distribution
- Vulnerability metrics
- Asset risk analysis
- Interactive charts (Recharts)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Dashboard │   SIEM   │  Scanner │ Malware  │   SOAR   │  │
│  │          │  Logs    │  Results │ Analysis │ Playbooks│  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │   SIEM   │   Web    │ Malware  │   SOAR   │  │
│  │  Router  │  Router  │  Scanner │ Analyzer │  Router  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Detection │   Web    │ Malware  │ Anomaly  │ Playbook │  │
│  │  Engine  │ Scanner  │ Analyzer │ Detector │  Engine  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────┬────────┬────────┬────────┬────────┬───────────────┘
         │        │        │        │        │
         ▼        ▼        ▼        ▼        ▼
    ┌────────┐ ┌─────────┐ ┌─────┐ ┌──────────┐ ┌──────────┐
    │Postgres│ │Elastic  │ │Redis│ │OWASP ZAP │ │  Celery  │
    │  DB    │ │ search  │ │     │ │          │ │  Worker  │
    └────────┘ └─────────┘ └─────┘ └──────────┘ └──────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library (40+ components)
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL 16** - Relational database
- **Elasticsearch 8** - Log storage & search
- **Redis 7** - Caching & task queue
- **Celery** - Background task processing
- **OWASP ZAP** - Web application scanner
- **Scikit-learn** - Machine learning
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **JWT** - Authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

---

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (latest version)
- **Node.js 20+** (for frontend development)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd advacned-cyber
```

#### 2. Start Backend Services
```bash
cd backend
docker-compose up -d
```

Wait 2-3 minutes for all services to initialize.

#### 3. Initialize Database
```bash
docker-compose exec backend python setup.py
```

This creates default users:
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Analyst**: `analyst` / `analyst123`

#### 4. Start Frontend
```bash
cd ..
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

#### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

### Verify Installation

**Test Backend:**
```bash
curl http://localhost:8000/health
```

**Test Login:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📁 Project Structure

```
advacned-cyber/
├── backend/                      # Backend API
│   ├── app/
│   │   ├── core/                # Core configurations
│   │   │   ├── config.py        # Settings & environment
│   │   │   ├── database.py      # Database connection
│   │   │   ├── security.py      # JWT & password hashing
│   │   │   ├── elasticsearch.py # Elasticsearch client
│   │   │   └── celery_app.py    # Celery configuration
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   ├── routers/             # API endpoints
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── siem.py          # SIEM
│   │   │   ├── web_scan.py      # Web scanning
│   │   │   ├── malware.py       # Malware analysis
│   │   │   ├── threat_intel.py  # Threat intelligence
│   │   │   ├── anomaly.py       # Anomaly detection
│   │   │   ├── soar.py          # SOAR
│   │   │   └── dashboard.py     # Dashboard
│   │   ├── services/            # Business logic
│   │   │   ├── detection_engine.py
│   │   │   ├── web_scanner.py
│   │   │   ├── malware_analyzer.py
│   │   │   ├── anomaly_detector.py
│   │   │   └── playbook_engine.py
│   │   └── dependencies/
│   │       └── auth.py          # Auth dependencies
│   ├── docker-compose.yml       # Docker services
│   ├── Dockerfile               # Backend image
│   ├── requirements.txt         # Python dependencies
│   ├── setup.py                 # Database initialization
│   ├── test_scanner.py          # Test script
│   ├── .env                     # Environment variables
│   ├── SETUP.md                 # Setup guide
│   └── COMPLETE_GUIDE.md        # Complete documentation
│
├── src/                         # Frontend source
│   ├── components/
│   │   └── ui/                  # shadcn/ui components (40+)
│   ├── sections/                # Page sections
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript types
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                      # Static assets
├── dist/                        # Production build
├── package.json                 # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 📚 Documentation

### Backend Documentation
- **[SETUP.md](backend/SETUP.md)** - Complete setup and installation guide
- **[COMPLETE_GUIDE.md](backend/COMPLETE_GUIDE.md)** - Comprehensive technical documentation
  - System overview & architecture
  - Feature descriptions
  - API reference with examples
  - Frontend integration guide
  - Security features
  - Advanced usage
  - Production deployment
  - Performance optimization

### Quick Links
- **API Documentation**: http://localhost:8000/api/docs (Swagger UI)
- **API Reference**: http://localhost:8000/api/redoc (ReDoc)

---

## 🖼️ Screenshots

### Dashboard
Real-time security metrics, alert timelines, and threat distribution.

### SIEM
Log search, filtering, and real-time alert monitoring.

### Web Scanner
Vulnerability scanning with OWASP ZAP integration.

### Malware Analysis
File upload, hash analysis, and VirusTotal integration.

### Threat Intelligence
IOC management, IP reputation, and CVE tracking.

### SOAR
Playbook creation and incident management.

---

## 🔒 Security

### Built-in Security Features
- ✅ JWT authentication with token expiration
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Security headers (HSTS, X-Frame-Options, CSP)
- ✅ File upload restrictions
- ✅ Environment variable management

### Default Credentials
**⚠️ CHANGE THESE IN PRODUCTION!**

- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Analyst**: `analyst` / `analyst123`

### Production Deployment
See [COMPLETE_GUIDE.md](backend/COMPLETE_GUIDE.md) for:
- Environment variable configuration
- HTTPS/TLS setup
- Database security
- API key management
- Nginx reverse proxy configuration

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
docker-compose exec backend python test_scanner.py
```

### Frontend Tests
```bash
npm run lint
npm run build
```

### Manual Testing
1. **Health Check**: `curl http://localhost:8000/health`
2. **Login**: Use Swagger UI at http://localhost:8000/api/docs
3. **Web Scan**: Test with `http://example.com`
4. **Dashboard**: Check real-time stats

---

## 🤝 Contributing

This is an educational project for final-year cybersecurity studies.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- **Backend**: Follow PEP 8 (Python)
- **Frontend**: Follow ESLint rules (TypeScript/React)

---

## 📝 License

This project is for **educational purposes** as part of a final-year cybersecurity project.

**Important Notes:**
- Only scan websites you own or have explicit permission to test
- Active scans send actual attack payloads
- Use responsibly and ethically
- Not for production use without proper security hardening

---

## 🙏 Acknowledgments

- **OWASP ZAP** - Web application scanner
- **VirusTotal** - Malware analysis API
- **NVD** - CVE database
- **shadcn/ui** - Component library
- **FastAPI** - Backend framework
- **React** - Frontend library

---

## 📞 Support

### Documentation
- [Setup Guide](backend/SETUP.md)
- [Complete Guide](backend/COMPLETE_GUIDE.md)
- [API Documentation](http://localhost:8000/api/docs)

### Troubleshooting
See [SETUP.md - Troubleshooting](backend/SETUP.md#troubleshooting) for common issues and solutions.

### Quick Commands
```bash
# Start everything
cd backend && docker-compose up -d
cd .. && npm run dev

# Stop everything
cd backend && docker-compose down

# View logs
cd backend && docker-compose logs -f

# Restart backend
cd backend && docker-compose restart backend

# Complete reset
cd backend && docker-compose down -v && docker-compose up -d
```

---

## 🎓 Educational Purpose

This project demonstrates:
- Full-stack development (React + FastAPI)
- Microservices architecture (Docker)
- Security operations center (SOC) workflows
- Real-time data processing (Elasticsearch)
- Machine learning integration (Scikit-learn)
- API design and documentation
- DevOps practices (Docker, CI/CD)
- Security best practices

**Perfect for learning:**
- Cybersecurity operations
- Full-stack development
- Cloud-native applications
- Security automation
- Threat detection and response

---

**Version**: 1.0.0  
**Last Updated**: February 17, 2026  
**Status**: Production Ready ✅

---

<div align="center">
  <strong>Built with ❤️ for Cybersecurity Education</strong>
</div>
