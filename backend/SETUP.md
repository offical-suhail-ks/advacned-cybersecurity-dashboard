# CyberSecurity Dashboard - Complete Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Required Software
- **Windows 10/11** or **Linux** or **macOS**
- **Docker Desktop** (latest version)
- **Docker Compose** (included with Docker Desktop)
- **Python 3.11+** (for local development only)
- **Git** (for cloning repository)

### Hardware Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 10GB free space
- **CPU**: 4 cores recommended

### Network Requirements
- **Ports**: 5432, 6379, 8000, 8080, 9200 must be available
- **Internet**: Required for downloading Docker images and API integrations

---

## Installation Steps

### Step 1: Install Docker Desktop

#### Windows:
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Run the installer
3. Restart your computer
4. Open Docker Desktop and wait for it to start
5. Verify installation:
   ```cmd
   docker --version
   docker-compose --version
   ```

#### Linux:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Navigate to Backend Directory

```bash
cd C:\Users\pc\Desktop\advacned-cyber\backend
```

### Step 3: Configure Environment Variables

The `.env` file is already configured with working defaults. **No changes needed** unless you want to customize:

**Important Settings (Already Configured):**
- `DATABASE_URL`: PostgreSQL connection
- `SECRET_KEY`: JWT secret (change in production)
- `ZAP_API_KEY`: OWASP ZAP API key
- `ZAP_PROXY_URL`: ZAP container URL
- `VIRUSTOTAL_API_KEY`: VirusTotal API (optional)

**Optional API Keys (For Enhanced Features):**
- `VIRUSTOTAL_API_KEY`: Get from https://www.virustotal.com/gui/my-apikey
- `NVD_API_KEY`: Get from https://nvd.nist.gov/developers/request-an-api-key
- `SMTP_*`: Configure for email alerts

### Step 4: Start All Services

```bash
docker-compose up -d
```

This command will:
- Download all required Docker images (first time only, ~5-10 minutes)
- Start PostgreSQL database
- Start Redis cache
- Start Elasticsearch
- Start FastAPI backend
- Start Celery worker (background tasks)
- Start Celery beat (scheduler)
- Start OWASP ZAP (web scanner)

**Wait 2-3 minutes** for all services to fully initialize.

### Step 5: Verify Services are Running

```bash
docker-compose ps
```

**Expected Output:**
```
NAME                     STATUS
cybersec_backend         Up
cybersec_celery_beat     Up
cybersec_celery_worker   Up
cybersec_elasticsearch   Up (healthy)
cybersec_postgres        Up (healthy)
cybersec_redis           Up (healthy)
cybersec_zap             Up
```

All services should show "Up" status.

### Step 6: Initialize Database and Create Users

```bash
docker-compose exec backend python setup.py
```

This creates:
- **Admin User**: `admin` / `admin123`
- **Manager User**: `manager` / `manager123`
- **Analyst User**: `analyst` / `analyst123`
- Sample detection rules
- Database tables and indexes

**⚠️ IMPORTANT**: Change these passwords in production!

### Step 7: Verify Installation

Test the API:
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":1708167234.567}
```

---

## Configuration

### Database Configuration

**Default Settings (Already Configured):**
```
Host: localhost
Port: 5432
Database: cybersec_db
Username: postgres
Password: postgres123
```

**To change database credentials:**
1. Edit `.env` file
2. Update `DATABASE_URL`
3. Update `docker-compose.yml` (postgres service)
4. Restart: `docker-compose down -v && docker-compose up -d`

### OWASP ZAP Configuration

**Default Settings (Already Configured):**
```
API Key: zap-api-key-12345
URL: http://zap:8080
```

**To change ZAP API key:**
1. Edit `.env`: Update `ZAP_API_KEY`
2. Edit `docker-compose.yml`: Update ZAP command line
3. Restart: `docker-compose restart backend zap`

### External API Integration

#### VirusTotal (Malware Analysis)
1. Sign up at https://www.virustotal.com
2. Get API key from https://www.virustotal.com/gui/my-apikey
3. Edit `.env`: `VIRUSTOTAL_API_KEY=your_actual_key`
4. Restart: `docker-compose restart backend`

#### NVD (CVE Database)
1. Request API key at https://nvd.nist.gov/developers/request-an-api-key
2. Edit `.env`: `NVD_API_KEY=your_actual_key`
3. Restart: `docker-compose restart backend`

### Email Alerts (SOAR)

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Edit `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=your-email@gmail.com
   ```
4. Restart: `docker-compose restart backend`

---

## Running the Application

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove All Data (Complete Reset)
```bash
docker-compose down -v
```

### View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f elasticsearch
docker-compose logs -f zap
```

### Restart a Service
```bash
docker-compose restart backend
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build backend
```

---

## Testing

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

### Test 2: Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Save the `access_token` from response.**

### Test 3: Get Dashboard Stats
```bash
curl -X GET "http://localhost:8000/api/dashboard/stats" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test 4: Web Scanner (Using Test Script)
```bash
python test_scanner.py
```

### Test 5: Interactive API Documentation
Open in browser:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

---

## Troubleshooting

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Or change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001 instead
```

### Issue: "Cannot connect to Docker daemon"

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully start (green icon in system tray)
3. Try again

### Issue: "Database connection failed"

**Solution:**
```bash
# Check if postgres is running
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# If still failing, recreate
docker-compose down -v
docker-compose up -d
```

### Issue: "Elasticsearch not healthy"

**Solution:**
```bash
# Check Elasticsearch logs
docker-compose logs elasticsearch

# Increase memory (edit docker-compose.yml)
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"  # Increase from 512m

# Restart
docker-compose restart elasticsearch
```

### Issue: "ZAP not available"

**Solution:**
```bash
# Check ZAP status
docker-compose ps zap

# Check ZAP logs
docker-compose logs zap

# Restart ZAP
docker-compose restart zap

# Test ZAP connection
curl http://localhost:8080/JSON/core/view/version/?apikey=zap-api-key-12345
```

### Issue: "Celery worker not processing tasks"

**Solution:**
```bash
# Check worker logs
docker-compose logs celery_worker

# Check Redis connection
docker-compose ps redis

# Restart worker
docker-compose restart celery_worker celery_beat
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Rebuild backend container
docker-compose up -d --build backend

# Check if requirements.txt is complete
docker-compose exec backend pip list
```

### Issue: "Permission denied" errors (Linux)

**Solution:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: "Out of memory"

**Solution:**
1. Increase Docker Desktop memory:
   - Open Docker Desktop
   - Settings → Resources → Memory
   - Increase to at least 8GB
   - Apply & Restart

2. Or reduce service memory in `docker-compose.yml`

### Complete Reset (Nuclear Option)

If nothing works:
```bash
# Stop everything
docker-compose down -v

# Remove all containers and images
docker system prune -a --volumes

# Start fresh
docker-compose up -d

# Reinitialize
docker-compose exec backend python setup.py
```

---

## Default Credentials

### API Users
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Analyst**: `analyst` / `analyst123`

### Database
- **Username**: `postgres`
- **Password**: `postgres123`
- **Database**: `cybersec_db`

### OWASP ZAP
- **API Key**: `zap-api-key-12345`

### Elasticsearch
- **No authentication** (disabled for development)

**⚠️ SECURITY WARNING**: Change all default passwords before deploying to production!

---

## Quick Reference Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend

# Complete reset
docker-compose down -v && docker-compose up -d

# Initialize database
docker-compose exec backend python setup.py

# Run test script
python test_scanner.py

# Check service status
docker-compose ps

# Access backend shell
docker-compose exec backend bash
```

---

## Next Steps

1. ✅ **Test the API** using Swagger UI: http://localhost:8000/api/docs
2. ✅ **Run the test script**: `python test_scanner.py`
3. ✅ **Connect your React frontend** (see COMPLETE_GUIDE.md)
4. ✅ **Configure external APIs** (VirusTotal, NVD)
5. ✅ **Set up email alerts** (SMTP configuration)
6. ✅ **Change default passwords** (production deployment)

---

## Support

If you encounter issues not covered here:
1. Check Docker Desktop is running
2. Check all ports are available
3. Check logs: `docker-compose logs -f`
4. Try complete reset (see above)
5. Check system resources (RAM, disk space)

**System is ready when:**
- ✅ All containers show "Up" status
- ✅ Health check returns `{"status":"healthy"}`
- ✅ Login returns access token
- ✅ Swagger UI loads at http://localhost:8000/api/docs
