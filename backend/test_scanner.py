#!/usr/bin/env python3
"""
Test script for web scanner functionality
"""
import requests
import json
import time

# Configuration
API_BASE_URL = "http://localhost:8000/api"
USERNAME = "admin"
PASSWORD = "admin123"

def login():
    """Login and get access token"""
    print("🔐 Logging in...")
    response = requests.post(
        f"{API_BASE_URL}/auth/login",
        headers={"Content-Type": "application/json"},
        json={"username": USERNAME, "password": PASSWORD}
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful")
        return data["access_token"]
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def start_scan(token, target_url, scan_type="passive"):
    """Start a web scan"""
    print(f"\n🔍 Starting {scan_type} scan for: {target_url}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "target_url": target_url,
        "scan_type": scan_type
    }
    
    response = requests.post(
        f"{API_BASE_URL}/web-scan/start",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 202:
        data = response.json()
        scan_id = data["scan_id"]
        print(f"✅ Scan started successfully")
        print(f"   Scan ID: {scan_id}")
        print(f"   Status: {data['status']}")
        return scan_id
    else:
        print(f"❌ Scan failed: {response.text}")
        return None

def get_scan_results(token, scan_id):
    """Get scan results"""
    print(f"\n📊 Fetching results for scan: {scan_id}")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # Wait a bit for scan to complete
    print("⏳ Waiting for scan to complete (30 seconds)...")
    time.sleep(30)
    
    response = requests.get(
        f"{API_BASE_URL}/web-scan/results/{scan_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        vulnerabilities = response.json()
        print(f"✅ Found {len(vulnerabilities)} vulnerabilities")
        
        if vulnerabilities:
            print("\n📋 Vulnerability Summary:")
            for vuln in vulnerabilities:
                print(f"\n  🔴 {vuln['title']}")
                print(f"     Severity: {vuln['severity']}")
                print(f"     CVSS Score: {vuln['cvss_score']}")
                print(f"     Risk Score: {vuln['risk_score']}")
                if vuln.get('description'):
                    desc = vuln['description'][:100] + "..." if len(vuln['description']) > 100 else vuln['description']
                    print(f"     Description: {desc}")
        else:
            print("\n✅ No vulnerabilities found (or scan still in progress)")
        
        return vulnerabilities
    else:
        print(f"❌ Failed to get results: {response.text}")
        return None

def main():
    """Main test function"""
    print("=" * 60)
    print("🛡️  Web Scanner Test Script")
    print("=" * 60)
    
    # Login
    token = login()
    if not token:
        return
    
    # Test with a safe target (example.com is safe to scan)
    target_url = "http://example.com"
    
    # Start scan
    scan_id = start_scan(token, target_url, scan_type="passive")
    if not scan_id:
        return
    
    # Get results
    results = get_scan_results(token, scan_id)
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
