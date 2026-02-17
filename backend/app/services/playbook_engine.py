"""
Playbook execution engine for SOAR automation
"""
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.models.models import Playbook


class PlaybookEngine:
    """
    Executes SOAR playbooks based on trigger conditions
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def execute_playbook(self, playbook: Playbook, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a playbook with given context
        
        Args:
            playbook: Playbook to execute
            context: Context data for execution
            
        Returns:
            Execution results
        """
        # Check if trigger conditions are met
        if not self._check_conditions(playbook.trigger_conditions, context):
            return {
                "executed": False,
                "reason": "Trigger conditions not met"
            }
        
        # Execute actions
        results = []
        for action in playbook.actions:
            action_result = await self._execute_action(action, context)
            results.append(action_result)
        
        return {
            "executed": True,
            "playbook_id": playbook.id,
            "playbook_name": playbook.name,
            "actions_executed": len(results),
            "results": results
        }
    
    def _check_conditions(self, conditions: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """
        Check if trigger conditions are met
        
        Args:
            conditions: Trigger conditions
            context: Current context
            
        Returns:
            True if conditions are met
        """
        for key, expected_value in conditions.items():
            if key not in context:
                return False
            
            context_value = context[key]
            
            # Handle different comparison types
            if isinstance(expected_value, dict):
                # Complex condition (e.g., {"operator": ">=", "value": 5})
                operator = expected_value.get("operator", "==")
                value = expected_value.get("value")
                
                if operator == "==":
                    if context_value != value:
                        return False
                elif operator == "!=":
                    if context_value == value:
                        return False
                elif operator == ">":
                    if context_value <= value:
                        return False
                elif operator == ">=":
                    if context_value < value:
                        return False
                elif operator == "<":
                    if context_value >= value:
                        return False
                elif operator == "<=":
                    if context_value > value:
                        return False
                elif operator == "in":
                    if context_value not in value:
                        return False
            else:
                # Simple equality check
                if context_value != expected_value:
                    return False
        
        return True
    
    async def _execute_action(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a single action
        
        Args:
            action: Action to execute
            context: Context data
            
        Returns:
            Action result
        """
        action_type = action.get("type")
        
        if action_type == "block_ip":
            return await self._block_ip(action, context)
        elif action_type == "send_email":
            return await self._send_email(action, context)
        elif action_type == "create_incident":
            return await self._create_incident(action, context)
        elif action_type == "quarantine_file":
            return await self._quarantine_file(action, context)
        elif action_type == "disable_user":
            return await self._disable_user(action, context)
        elif action_type == "log_event":
            return await self._log_event(action, context)
        else:
            return {
                "action": action_type,
                "status": "error",
                "message": f"Unknown action type: {action_type}"
            }
    
    async def _block_ip(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Block IP address action (simulation)
        
        In production, this would integrate with firewall APIs
        """
        ip_address = context.get("source_ip") or action.get("ip_address")
        target = action.get("target", "firewall")
        
        # Simulate blocking IP
        print(f"[SOAR] Blocking IP {ip_address} on {target}")
        
        return {
            "action": "block_ip",
            "status": "success",
            "ip_address": ip_address,
            "target": target,
            "message": f"IP {ip_address} blocked on {target}"
        }
    
    async def _send_email(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send email alert action
        """
        recipients = action.get("recipients", [])
        subject = action.get("subject", "Security Alert")
        
        # Build email body from context
        body = self._build_email_body(context)
        
        try:
            # Send email
            if settings.SMTP_HOST and settings.SMTP_USER:
                self._send_smtp_email(recipients, subject, body)
                status = "success"
                message = f"Email sent to {len(recipients)} recipients"
            else:
                status = "skipped"
                message = "SMTP not configured"
        
        except Exception as e:
            status = "error"
            message = str(e)
        
        return {
            "action": "send_email",
            "status": status,
            "recipients": recipients,
            "message": message
        }
    
    def _send_smtp_email(self, recipients: List[str], subject: str, body: str):
        """Send email via SMTP"""
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_FROM
        msg['To'] = ', '.join(recipients)
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    
    def _build_email_body(self, context: Dict[str, Any]) -> str:
        """Build HTML email body from context"""
        return f"""
        <html>
        <body>
            <h2>Security Alert</h2>
            <p>A security event has been detected and automated response has been triggered.</p>
            <h3>Details:</h3>
            <ul>
                <li><strong>Alert Severity:</strong> {context.get('severity', 'N/A')}</li>
                <li><strong>Source IP:</strong> {context.get('source_ip', 'N/A')}</li>
                <li><strong>Event Type:</strong> {context.get('event_type', 'N/A')}</li>
                <li><strong>Timestamp:</strong> {context.get('timestamp', 'N/A')}</li>
            </ul>
            <p>Please review and take appropriate action if needed.</p>
        </body>
        </html>
        """
    
    async def _create_incident(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create incident action
        """
        from app.models.models import Incident, SeverityLevel, IncidentStatus
        import uuid
        
        incident_id = f"INC-{uuid.uuid4().hex[:12].upper()}"
        severity = action.get("severity", "medium")
        
        incident = Incident(
            incident_id=incident_id,
            title=f"Auto-generated: {context.get('event_type', 'Security Event')}",
            description=f"Automatically created by playbook. Context: {context}",
            severity=SeverityLevel(severity),
            status=IncidentStatus.NEW,
            category=context.get('category', 'automated'),
            source="SOAR Playbook",
            indicators=context
        )
        
        self.db.add(incident)
        await self.db.commit()
        
        return {
            "action": "create_incident",
            "status": "success",
            "incident_id": incident_id,
            "message": f"Incident {incident_id} created"
        }
    
    async def _quarantine_file(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Quarantine file action (simulation)
        """
        file_path = context.get("file_path") or action.get("file_path")
        
        print(f"[SOAR] Quarantining file: {file_path}")
        
        return {
            "action": "quarantine_file",
            "status": "success",
            "file_path": file_path,
            "message": f"File quarantined: {file_path}"
        }
    
    async def _disable_user(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Disable user account action (simulation)
        """
        username = context.get("username") or action.get("username")
        
        print(f"[SOAR] Disabling user: {username}")
        
        return {
            "action": "disable_user",
            "status": "success",
            "username": username,
            "message": f"User account disabled: {username}"
        }
    
    async def _log_event(self, action: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Log event action
        """
        message = action.get("message", "SOAR action executed")
        
        print(f"[SOAR] {message} - Context: {context}")
        
        return {
            "action": "log_event",
            "status": "success",
            "message": message
        }
