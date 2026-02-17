# 🚀 Quick Start Guide

## Prerequisites
- Docker Desktop installed
- Git (optional)

## Step 1: Navigate to Backend Directory
```bash
cd c:/Users/mrc03/Desktop/advacned-cyber/backend
```

## Step 2: Configure Environment
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and update these critical settings:
# - SECRET_KEY (generate a random 32+ character string)
# - DATABASE_URL (default is fine for Docker)
# - Add API keys if you have them:
#   - VIRUSTOTAL_API_KEY
#   - NVD_API_KEY
#   - ZAP_API_KEY
```

## Step 3: Start All Services
```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Elasticsearch (port 9200)
- FastAPI Backend (port 8000)
- Celery Worker
- Celery Beat
- OWASP ZAP (port 8080)

## Step 4: Wait for Services to Start
```bash
# Check if all services are running
docker-compose ps

# View logs if needed
docker-compose logs -f backend
```

## Step 5: Initialize Database & Create Users
```bash
# Run the setup script
docker-compose exec backend python setup.py
```

This creates:
- Admin user: `admin` / `admin123`
- Manager user: `manager` / `manager123`
- Analyst user: `analyst` / `analyst123`
- Sample detection rules

## Step 6: Access the API
Open your browser and go to:
- **API Documentation**: http://localhost:8000/api/docs
- **Alternative Docs**: http://localhost:8000/api/redoc
- **Health Check**: http://localhost:8000/health

## Step 7: Test the API

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Copy the `access_token` from the response.

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Step 8: Connect Your React Frontend

In your React app, set:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

See `FRONTEND_INTEGRATION.md` for detailed examples.

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f celery_worker
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "8001:8000"  # Change 8000 to 8001
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Elasticsearch Not Starting
Elasticsearch needs more memory. Edit `docker-compose.yml`:
```yaml
elasticsearch:
  environment:
    - "ES_JAVA_OPTS=-Xms256m -Xmx256m"  # Reduce memory
```

## Next Steps

1. ✅ Read `README.md` for full documentation
2. ✅ Check `FRONTEND_INTEGRATION.md` for React integration
3. ✅ Review `IMPLEMENTATION_SUMMARY.md` for feature overview
4. ✅ Explore API at http://localhost:8000/api/docs
5. ✅ Start building your frontend!

## Need Help?

- Check the logs: `docker-compose logs -f`
- Verify all services are running: `docker-compose ps`
- Restart services: `docker-compose restart`
- Read the full README.md

## Security Note

⚠️ **IMPORTANT**: The default passwords are for development only!

Change these in production:
- Update all user passwords
- Generate a strong SECRET_KEY
- Use proper SSL/TLS certificates
- Configure firewall rules
- Enable rate limiting
- Set up monitoring

---

**You're all set! Happy coding! 🎉**
