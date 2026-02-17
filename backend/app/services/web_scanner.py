"""
Web scanner service - OWASP ZAP integration
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import aiohttp
from typing import Dict, Any
from datetime import datetime
from app.core.config import settings
from app.models.models import Vulnerability, Asset, SeverityLevel


class WebScanner:
    """
    Web application scanner using OWASP ZAP
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.zap_url = settings.ZAP_PROXY_URL
        self.api_key = settings.ZAP_API_KEY
    
    async def perform_scan(
        self,
        scan_id: str,
        target_url: str,
        scan_type: str,
        asset_id: int
    ):
        """
        Perform web application scan using OWASP ZAP
        
        Args:
            scan_id: Unique scan identifier
            target_url: Target URL to scan
            scan_type: Type of scan (active or passive)
            asset_id: Asset ID in database
        """
        try:
            # Get asset
            result = await self.db.execute(
                select(Asset).where(Asset.id == asset_id)
            )
            asset = result.scalar_one_or_none()
            
            if not asset:
                print(f"[WebScanner] Asset {asset_id} not found")
                return
            
            print(f"[WebScanner] Starting {scan_type} scan for {target_url} (Scan ID: {scan_id})")
            
            # Check if ZAP is available
            if not await self._check_zap_connection():
                print(f"[WebScanner] ZAP is not available. Scan {scan_id} cannot proceed.")
                print(f"[WebScanner] Make sure ZAP container is running: docker-compose ps zap")
                return
            
            # Access the target URL through ZAP proxy
            print(f"[WebScanner] Spidering target: {target_url}")
            await self._spider_target(target_url)
            
            # Perform active or passive scan
            if scan_type == "active":
                print(f"[WebScanner] Running active scan on {target_url}")
                await self._active_scan(target_url)
            else:
                print(f"[WebScanner] Running passive scan on {target_url}")
                await self._passive_scan(target_url)
            
            # Retrieve alerts/vulnerabilities
            print(f"[WebScanner] Retrieving alerts for {target_url}")
            vulnerabilities = await self._get_alerts(target_url)
            
            print(f"[WebScanner] Found {len(vulnerabilities)} vulnerabilities for {target_url}")
            
            # Store vulnerabilities in database
            for vuln_data in vulnerabilities:
                risk_score = self._calculate_risk_score(
                    asset.criticality,
                    vuln_data['cvss_score'],
                    vuln_data['exploitability']
                )
                
                vulnerability = Vulnerability(
                    asset_id=asset_id,
                    cve_id=vuln_data.get('cve_id'),
                    title=vuln_data['title'],
                    description=vuln_data['description'],
                    severity=vuln_data['severity'],
                    cvss_score=vuln_data['cvss_score'],
                    cvss_vector=vuln_data.get('cvss_vector'),
                    exploitability=vuln_data['exploitability'],
                    risk_score=risk_score,
                    status="open",
                    scan_id=scan_id,
                    remediation=vuln_data.get('remediation'),
                    references=vuln_data.get('references', {})
                )
                
                self.db.add(vulnerability)
            
            await self.db.commit()
            print(f"[WebScanner] Scan {scan_id} completed successfully")
            
        except Exception as e:
            print(f"[WebScanner] Scan error for {scan_id}: {str(e)}")
            import traceback
            traceback.print_exc()
    
    async def _check_zap_connection(self) -> bool:
        """Check if ZAP is available and responding"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.zap_url}/JSON/core/view/version/"
                params = {"apikey": self.api_key}
                
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        data = await response.json()
                        print(f"[WebScanner] ZAP is available (version: {data.get('version', 'unknown')})")
                        return True
                    else:
                        print(f"[WebScanner] ZAP returned status {response.status}")
                        return False
        except Exception as e:
            print(f"[WebScanner] Cannot connect to ZAP: {str(e)}")
            return False
    
    async def _spider_target(self, target_url: str):
        """Spider the target to discover URLs"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.zap_url}/JSON/spider/action/scan/"
            params = {
                "apikey": self.api_key,
                "url": target_url,
                "maxChildren": 10,
                "recurse": "true"
            }
            
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    scan_id = data.get('scan')
                    
                    # Wait for spider to complete
                    await self._wait_for_spider(scan_id)
    
    async def _wait_for_spider(self, spider_scan_id: str):
        """Wait for spider scan to complete"""
        import asyncio
        
        async with aiohttp.ClientSession() as session:
            while True:
                url = f"{self.zap_url}/JSON/spider/view/status/"
                params = {
                    "apikey": self.api_key,
                    "scanId": spider_scan_id
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        status = int(data.get('status', 0))
                        
                        if status >= 100:
                            break
                
                await asyncio.sleep(2)
    
    async def _active_scan(self, target_url: str):
        """Perform active scan"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.zap_url}/JSON/ascan/action/scan/"
            params = {
                "apikey": self.api_key,
                "url": target_url,
                "recurse": "true",
                "inScopeOnly": "false"
            }
            
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    scan_id = data.get('scan')
                    
                    # Wait for scan to complete
                    await self._wait_for_active_scan(scan_id)
    
    async def _wait_for_active_scan(self, ascan_id: str):
        """Wait for active scan to complete"""
        import asyncio
        
        async with aiohttp.ClientSession() as session:
            while True:
                url = f"{self.zap_url}/JSON/ascan/view/status/"
                params = {
                    "apikey": self.api_key,
                    "scanId": ascan_id
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        status = int(data.get('status', 0))
                        
                        if status >= 100:
                            break
                
                await asyncio.sleep(5)
    
    async def _passive_scan(self, target_url: str):
        """Perform passive scan (just access the URL)"""
        import asyncio
        await asyncio.sleep(5)  # Wait for passive scanner to analyze
    
    async def _get_alerts(self, target_url: str) -> list:
        """Get alerts/vulnerabilities from ZAP"""
        vulnerabilities = []
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.zap_url}/JSON/core/view/alerts/"
                params = {
                    "apikey": self.api_key,
                    "baseurl": target_url
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        alerts = data.get('alerts', [])
                        
                        for alert in alerts:
                            severity = self._map_zap_risk(alert.get('risk', 'Low'))
                            cvss_score = self._estimate_cvss(alert.get('risk', 'Low'))
                            
                            vulnerabilities.append({
                                'title': alert.get('alert', 'Unknown Vulnerability'),
                                'description': alert.get('description', ''),
                                'severity': severity,
                                'cvss_score': cvss_score,
                                'cvss_vector': None,
                                'exploitability': self._estimate_exploitability(alert.get('risk', 'Low')),
                                'cve_id': alert.get('cweid'),
                                'remediation': alert.get('solution', ''),
                                'references': {
                                    'reference': alert.get('reference', ''),
                                    'url': alert.get('url', '')
                                }
                            })
        
        except Exception as e:
            print(f"Error getting alerts: {str(e)}")
        
        return vulnerabilities
    
    def _map_zap_risk(self, zap_risk: str) -> SeverityLevel:
        """Map ZAP risk level to severity"""
        mapping = {
            'Informational': SeverityLevel.INFO,
            'Low': SeverityLevel.LOW,
            'Medium': SeverityLevel.MEDIUM,
            'High': SeverityLevel.HIGH,
            'Critical': SeverityLevel.CRITICAL
        }
        return mapping.get(zap_risk, SeverityLevel.MEDIUM)
    
    def _estimate_cvss(self, zap_risk: str) -> float:
        """Estimate CVSS score from ZAP risk"""
        mapping = {
            'Informational': 0.0,
            'Low': 3.5,
            'Medium': 6.0,
            'High': 8.5,
            'Critical': 9.5
        }
        return mapping.get(zap_risk, 5.0)
    
    def _estimate_exploitability(self, zap_risk: str) -> float:
        """Estimate exploitability from ZAP risk"""
        mapping = {
            'Informational': 0.1,
            'Low': 0.3,
            'Medium': 0.5,
            'High': 0.8,
            'Critical': 0.95
        }
        return mapping.get(zap_risk, 0.5)
    
    def _calculate_risk_score(
        self,
        asset_criticality: int,
        cvss_score: float,
        exploitability: float
    ) -> float:
        """
        Calculate risk score using formula:
        Risk = Asset_Criticality × CVSS × Exploitability
        
        Normalized to 0-100 scale
        """
        # Normalize asset criticality to 0-1 scale (it's 1-10)
        normalized_criticality = asset_criticality / 10.0
        
        # Normalize CVSS to 0-1 scale (it's 0-10)
        normalized_cvss = cvss_score / 10.0
        
        # Calculate risk (already 0-1 scale for exploitability)
        risk = normalized_criticality * normalized_cvss * exploitability
        
        # Convert to 0-100 scale
        return round(risk * 100, 2)
