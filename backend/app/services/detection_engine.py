"""
Detection engine for analyzing logs and generating alerts
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from elasticsearch import AsyncElasticsearch
from typing import List, Dict, Any
from datetime import datetime
import uuid
import re
from app.models.models import DetectionRule, Alert, SeverityLevel, AlertStatus
from app.core.config import settings


class DetectionEngine:
    """
    Rule-based detection engine for SIEM
    
    Analyzes logs against detection rules and generates alerts
    """
    
    def __init__(self, db: AsyncSession, es: AsyncElasticsearch):
        self.db = db
        self.es = es
    
    async def analyze_log(self, log_doc: Dict[str, Any]) -> List[Alert]:
        """
        Analyze a log against all active detection rules
        
        Args:
            log_doc: Log document to analyze
            
        Returns:
            List of generated alerts
        """
        # Fetch active detection rules
        result = await self.db.execute(
            select(DetectionRule).where(DetectionRule.is_active == True)
        )
        rules = result.scalars().all()
        
        alerts = []
        
        for rule in rules:
            if await self._check_rule(log_doc, rule):
                alert = await self._create_alert(log_doc, rule)
                alerts.append(alert)
        
        return alerts
    
    async def _check_rule(self, log_doc: Dict[str, Any], rule: DetectionRule) -> bool:
        """
        Check if a log matches a detection rule
        
        Args:
            log_doc: Log document
            rule: Detection rule
            
        Returns:
            True if rule matches, False otherwise
        """
        rule_logic = rule.rule_logic
        rule_type = rule.rule_type
        
        if rule_type == "regex":
            return self._check_regex_rule(log_doc, rule_logic)
        elif rule_type == "threshold":
            return await self._check_threshold_rule(log_doc, rule_logic)
        elif rule_type == "correlation":
            return await self._check_correlation_rule(log_doc, rule_logic)
        elif rule_type == "ml":
            return await self._check_ml_rule(log_doc, rule_logic)
        
        return False
    
    def _check_regex_rule(self, log_doc: Dict[str, Any], rule_logic: Dict[str, Any]) -> bool:
        """
        Check regex-based detection rule
        
        Rule logic format:
        {
            "field": "message",
            "pattern": "(?i)(union|select|insert|update|delete).*from",
            "description": "SQL Injection attempt"
        }
        """
        field = rule_logic.get("field", "message")
        pattern = rule_logic.get("pattern")
        
        if not pattern or field not in log_doc:
            return False
        
        field_value = str(log_doc[field])
        
        try:
            return bool(re.search(pattern, field_value, re.IGNORECASE))
        except re.error:
            return False
    
    async def _check_threshold_rule(self, log_doc: Dict[str, Any], rule_logic: Dict[str, Any]) -> bool:
        """
        Check threshold-based detection rule
        
        Rule logic format:
        {
            "field": "source_ip",
            "value": "192.168.1.100",
            "event_type": "failed_login",
            "threshold": 5,
            "timeframe_minutes": 10
        }
        """
        field = rule_logic.get("field")
        value = rule_logic.get("value")
        event_type = rule_logic.get("event_type")
        threshold = rule_logic.get("threshold", 5)
        timeframe = rule_logic.get("timeframe_minutes", 10)
        
        if not field or field not in log_doc:
            return False
        
        # Check if current log matches the criteria
        if log_doc.get(field) != value:
            return False
        
        if event_type and log_doc.get("event_type") != event_type:
            return False
        
        # Query Elasticsearch for similar events in timeframe
        from datetime import timedelta
        
        current_time = datetime.fromisoformat(log_doc["timestamp"])
        start_time = current_time - timedelta(minutes=timeframe)
        
        query = {
            "bool": {
                "must": [
                    {"term": {field: value}},
                    {"range": {"timestamp": {"gte": start_time.isoformat(), "lte": current_time.isoformat()}}}
                ]
            }
        }
        
        if event_type:
            query["bool"]["must"].append({"term": {"event_type": event_type}})
        
        index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
        result = await self.es.count(index=index_name, query=query)
        
        return result['count'] >= threshold
    
    async def _check_correlation_rule(self, log_doc: Dict[str, Any], rule_logic: Dict[str, Any]) -> bool:
        """
        Check correlation-based detection rule
        
        Rule logic format:
        {
            "events": [
                {"event_type": "port_scan", "timeframe_minutes": 5},
                {"event_type": "brute_force", "timeframe_minutes": 10}
            ],
            "same_source": true
        }
        """
        events = rule_logic.get("events", [])
        same_source = rule_logic.get("same_source", True)
        
        if not events:
            return False
        
        source_ip = log_doc.get("source_ip")
        if not source_ip and same_source:
            return False
        
        # Check if all events occurred
        current_time = datetime.fromisoformat(log_doc["timestamp"])
        
        for event in events:
            event_type = event.get("event_type")
            timeframe = event.get("timeframe_minutes", 60)
            
            from datetime import timedelta
            start_time = current_time - timedelta(minutes=timeframe)
            
            query = {
                "bool": {
                    "must": [
                        {"term": {"event_type": event_type}},
                        {"range": {"timestamp": {"gte": start_time.isoformat(), "lte": current_time.isoformat()}}}
                    ]
                }
            }
            
            if same_source:
                query["bool"]["must"].append({"term": {"source_ip": source_ip}})
            
            index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
            result = await self.es.count(index=index_name, query=query)
            
            if result['count'] == 0:
                return False
        
        return True
    
    async def _check_ml_rule(self, log_doc: Dict[str, Any], rule_logic: Dict[str, Any]) -> bool:
        """
        Check ML-based detection rule (placeholder for future implementation)
        
        This would integrate with the anomaly detection model
        """
        # TODO: Implement ML-based detection
        return False
    
    async def _create_alert(self, log_doc: Dict[str, Any], rule: DetectionRule) -> Alert:
        """
        Create an alert from a matched rule
        
        Args:
            log_doc: Log document that triggered the rule
            rule: Detection rule that was matched
            
        Returns:
            Created alert object
        """
        alert_id = f"ALT-{uuid.uuid4().hex[:12].upper()}"
        
        # Index alert in Elasticsearch
        alert_doc = {
            "timestamp": log_doc["timestamp"],
            "alert_id": alert_id,
            "severity": rule.severity.value,
            "title": rule.name,
            "description": rule.description,
            "source_ip": log_doc.get("source_ip"),
            "destination_ip": log_doc.get("destination_ip"),
            "rule_id": str(rule.id),
            "mitre_technique": rule.mitre_technique,
            "status": AlertStatus.OPEN.value,
            "false_positive": False
        }
        
        index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_alerts"
        es_result = await self.es.index(index=index_name, document=alert_doc)
        
        # Create alert in PostgreSQL
        alert = Alert(
            alert_id=alert_id,
            elasticsearch_id=es_result['_id'],
            title=rule.name,
            description=rule.description,
            severity=rule.severity,
            status=AlertStatus.OPEN,
            source_ip=log_doc.get("source_ip"),
            destination_ip=log_doc.get("destination_ip"),
            rule_id=str(rule.id),
            mitre_technique=rule.mitre_technique,
            false_positive=False
        )
        
        self.db.add(alert)
        
        # Update rule statistics
        rule.last_triggered = datetime.utcnow()
        rule.trigger_count += 1
        
        await self.db.commit()
        await self.db.refresh(alert)
        
        return alert
