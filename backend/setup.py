"""
Initial setup script - Create admin user and sample detection rules
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.models import User, UserRole, DetectionRule, SeverityLevel
from app.core.security import get_password_hash


async def create_admin_user():
    """Create default admin user"""
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        
        # Check if admin exists
        result = await db.execute(
            select(User).where(User.username == "admin")
        )
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            print("Admin user already exists")
            return
        
        # Create admin
        admin = User(
            email="admin@cybersec.local",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        
        db.add(admin)
        await db.commit()
        print("✓ Admin user created (username: admin, password: admin123)")


async def create_sample_users():
    """Create sample users for testing"""
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        
        users_data = [
            {
                "email": "analyst@cybersec.local",
                "username": "analyst",
                "password": "analyst123",
                "full_name": "Security Analyst",
                "role": UserRole.ANALYST
            },
            {
                "email": "manager@cybersec.local",
                "username": "manager",
                "password": "manager123",
                "full_name": "Security Manager",
                "role": UserRole.MANAGER
            }
        ]
        
        for user_data in users_data:
            result = await db.execute(
                select(User).where(User.username == user_data["username"])
            )
            existing_user = result.scalar_one_or_none()
            
            if not existing_user:
                user = User(
                    email=user_data["email"],
                    username=user_data["username"],
                    hashed_password=get_password_hash(user_data["password"]),
                    full_name=user_data["full_name"],
                    role=user_data["role"],
                    is_active=True,
                    is_verified=True
                )
                db.add(user)
                print(f"✓ Created user: {user_data['username']}")
        
        await db.commit()


async def create_detection_rules():
    """Create sample detection rules"""
    async with AsyncSessionLocal() as db:
        rules_data = [
            {
                "name": "SQL Injection Attempt",
                "description": "Detects potential SQL injection attempts in web requests",
                "rule_type": "regex",
                "rule_logic": {
                    "field": "message",
                    "pattern": "(?i)(union|select|insert|update|delete|drop).*from"
                },
                "severity": SeverityLevel.HIGH,
                "mitre_technique": "T1190"
            },
            {
                "name": "Brute Force Login Attempt",
                "description": "Detects multiple failed login attempts from same IP",
                "rule_type": "threshold",
                "rule_logic": {
                    "field": "source_ip",
                    "event_type": "failed_login",
                    "threshold": 5,
                    "timeframe_minutes": 10
                },
                "severity": SeverityLevel.MEDIUM,
                "mitre_technique": "T1110"
            },
            {
                "name": "Command Injection",
                "description": "Detects command injection attempts",
                "rule_type": "regex",
                "rule_logic": {
                    "field": "message",
                    "pattern": "(?i)(;|\\||&|`|\\$\\(|\\$\\{).*?(ls|cat|wget|curl|nc|bash|sh)"
                },
                "severity": SeverityLevel.CRITICAL,
                "mitre_technique": "T1059"
            },
            {
                "name": "XSS Attempt",
                "description": "Detects cross-site scripting attempts",
                "rule_type": "regex",
                "rule_logic": {
                    "field": "message",
                    "pattern": "(?i)<script|javascript:|onerror=|onload="
                },
                "severity": SeverityLevel.HIGH,
                "mitre_technique": "T1189"
            },
            {
                "name": "Port Scan Detection",
                "description": "Detects port scanning activity",
                "rule_type": "threshold",
                "rule_logic": {
                    "field": "source_ip",
                    "event_type": "connection_attempt",
                    "threshold": 20,
                    "timeframe_minutes": 5
                },
                "severity": SeverityLevel.MEDIUM,
                "mitre_technique": "T1046"
            }
        ]
        
        for rule_data in rules_data:
            rule = DetectionRule(
                name=rule_data["name"],
                description=rule_data["description"],
                rule_type=rule_data["rule_type"],
                rule_logic=rule_data["rule_logic"],
                severity=rule_data["severity"],
                mitre_technique=rule_data["mitre_technique"],
                is_active=True,
                trigger_count=0
            )
            db.add(rule)
            print(f"✓ Created detection rule: {rule_data['name']}")
        
        await db.commit()


async def main():
    """Run all setup tasks"""
    print("=" * 60)
    print("CyberSecurity Dashboard - Initial Setup")
    print("=" * 60)
    print()
    
    print("Creating users...")
    await create_admin_user()
    await create_sample_users()
    print()
    
    print("Creating detection rules...")
    await create_detection_rules()
    print()
    
    print("=" * 60)
    print("Setup completed successfully!")
    print("=" * 60)
    print()
    print("Default credentials:")
    print("  Admin:   username=admin,   password=admin123")
    print("  Manager: username=manager, password=manager123")
    print("  Analyst: username=analyst, password=analyst123")
    print()
    print("⚠️  IMPORTANT: Change these passwords in production!")
    print()


if __name__ == "__main__":
    asyncio.run(main())
