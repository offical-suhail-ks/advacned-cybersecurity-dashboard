"""
Celery tasks for threat intelligence updates
"""
from app.core.celery_app import celery_app
import asyncio
import aiohttp
from datetime import datetime
from app.core.config import settings


@celery_app.task(name="app.services.tasks.threat_intel_tasks.update_threat_intelligence")
def update_threat_intelligence():
    """
    Update threat intelligence feeds
    
    Fetches latest IOCs from external sources
    This task runs periodically (configured in celery_app.py)
    """
    print("[TASK] Updating threat intelligence feeds...")
    
    async def _update():
        from app.core.database import AsyncSessionLocal
        from app.models.models import ThreatIntel, SeverityLevel
        
        async with AsyncSessionLocal() as db:
            # In production, integrate with threat feeds:
            # - AlienVault OTX
            # - MISP
            # - Abuse.ch
            # - PhishTank
            # - etc.
            
            # Example: Fetch from a threat feed API
            # This is a placeholder - implement actual feed integration
            
            print("[TASK] Threat intelligence feeds updated")
    
    asyncio.run(_update())
    
    return {"status": "completed"}


@celery_app.task(name="app.services.tasks.threat_intel_tasks.update_cve_database")
def update_cve_database():
    """
    Update CVE database from NVD API
    
    Fetches latest CVEs and updates the database
    """
    print("[TASK] Updating CVE database from NVD...")
    
    async def _update():
        from app.core.database import AsyncSessionLocal
        from app.models.models import CVE, SeverityLevel
        
        if not settings.NVD_API_KEY:
            print("[TASK] NVD API key not configured, skipping CVE update")
            return
        
        async with AsyncSessionLocal() as db:
            try:
                # Fetch recent CVEs from NVD API
                url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
                headers = {
                    "apiKey": settings.NVD_API_KEY
                }
                
                # Get CVEs from last 7 days
                from datetime import timedelta
                end_date = datetime.utcnow()
                start_date = end_date - timedelta(days=7)
                
                params = {
                    "pubStartDate": start_date.strftime("%Y-%m-%dT%H:%M:%S.000"),
                    "pubEndDate": end_date.strftime("%Y-%m-%dT%H:%M:%S.000")
                }
                
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers, params=params) as response:
                        if response.status == 200:
                            data = await response.json()
                            vulnerabilities = data.get('vulnerabilities', [])
                            
                            count = 0
                            for vuln in vulnerabilities:
                                cve_data = vuln.get('cve', {})
                                cve_id = cve_data.get('id')
                                
                                if not cve_id:
                                    continue
                                
                                # Check if CVE already exists
                                from sqlalchemy import select
                                result = await db.execute(
                                    select(CVE).where(CVE.cve_id == cve_id)
                                )
                                existing_cve = result.scalar_one_or_none()
                                
                                if existing_cve:
                                    continue
                                
                                # Extract CVE details
                                descriptions = cve_data.get('descriptions', [])
                                description = descriptions[0].get('value', '') if descriptions else ''
                                
                                metrics = cve_data.get('metrics', {})
                                cvss_v3 = metrics.get('cvssMetricV31', [{}])[0].get('cvssData', {}) if 'cvssMetricV31' in metrics else {}
                                cvss_v2 = metrics.get('cvssMetricV2', [{}])[0].get('cvssData', {}) if 'cvssMetricV2' in metrics else {}
                                
                                cvss_v3_score = cvss_v3.get('baseScore')
                                cvss_v2_score = cvss_v2.get('baseScore')
                                
                                # Determine severity
                                severity = SeverityLevel.MEDIUM
                                if cvss_v3_score:
                                    if cvss_v3_score >= 9.0:
                                        severity = SeverityLevel.CRITICAL
                                    elif cvss_v3_score >= 7.0:
                                        severity = SeverityLevel.HIGH
                                    elif cvss_v3_score >= 4.0:
                                        severity = SeverityLevel.MEDIUM
                                    else:
                                        severity = SeverityLevel.LOW
                                
                                # Create CVE record
                                cve = CVE(
                                    cve_id=cve_id,
                                    description=description,
                                    severity=severity,
                                    cvss_v3_score=cvss_v3_score,
                                    cvss_v3_vector=cvss_v3.get('vectorString'),
                                    cvss_v2_score=cvss_v2_score,
                                    cvss_v2_vector=cvss_v2.get('vectorString'),
                                    published_date=datetime.fromisoformat(cve_data.get('published', '').replace('Z', '+00:00')) if cve_data.get('published') else None,
                                    modified_date=datetime.fromisoformat(cve_data.get('lastModified', '').replace('Z', '+00:00')) if cve_data.get('lastModified') else None,
                                    references=cve_data.get('references', []),
                                    exploit_available=False,  # Would need to check exploit-db
                                    patch_available=False
                                )
                                
                                db.add(cve)
                                count += 1
                            
                            await db.commit()
                            print(f"[TASK] Added {count} new CVEs to database")
                        else:
                            print(f"[TASK] NVD API error: {response.status}")
            
            except Exception as e:
                print(f"[TASK] Error updating CVE database: {str(e)}")
    
    asyncio.run(_update())
    
    return {"status": "completed"}


@celery_app.task(name="app.services.tasks.threat_intel_tasks.enrich_ioc")
def enrich_ioc(ioc_value: str, ioc_type: str):
    """
    Enrich an IOC with additional threat intelligence
    
    Args:
        ioc_value: IOC value
        ioc_type: IOC type (ip, domain, hash, etc.)
    """
    print(f"[TASK] Enriching IOC: {ioc_type} - {ioc_value}")
    
    # In production, query multiple threat intelligence sources:
    # - VirusTotal
    # - AlienVault OTX
    # - AbuseIPDB
    # - Shodan
    # - etc.
    
    return {
        "status": "completed",
        "ioc_value": ioc_value,
        "ioc_type": ioc_type
    }
