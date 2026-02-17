"""
Elasticsearch client configuration
"""
from elasticsearch import AsyncElasticsearch
from app.core.config import settings
from typing import Optional

# Global Elasticsearch client
_es_client: Optional[AsyncElasticsearch] = None


def get_elasticsearch() -> AsyncElasticsearch:
    """Get Elasticsearch client instance"""
    global _es_client
    
    if _es_client is None:
        _es_client = AsyncElasticsearch(
            hosts=[settings.elasticsearch_url],
            verify_certs=False,
            ssl_show_warn=False,
        )
    
    return _es_client


async def close_elasticsearch():
    """Close Elasticsearch connection"""
    global _es_client
    if _es_client:
        await _es_client.close()
        _es_client = None


async def init_elasticsearch_indices():
    """Initialize Elasticsearch indices with mappings"""
    es = get_elasticsearch()
    
    # Logs index mapping
    logs_index = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
    if not await es.indices.exists(index=logs_index):
        await es.indices.create(
            index=logs_index,
            body={
                "mappings": {
                    "properties": {
                        "timestamp": {"type": "date"},
                        "source_ip": {"type": "ip"},
                        "destination_ip": {"type": "ip"},
                        "severity": {"type": "keyword"},
                        "event_type": {"type": "keyword"},
                        "message": {"type": "text"},
                        "user_agent": {"type": "text"},
                        "method": {"type": "keyword"},
                        "url": {"type": "text"},
                        "status_code": {"type": "integer"},
                        "mitre_technique": {"type": "keyword"},
                        "tags": {"type": "keyword"},
                        "raw_log": {"type": "text"}
                    }
                }
            }
        )
    
    # Alerts index mapping
    alerts_index = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_alerts"
    if not await es.indices.exists(index=alerts_index):
        await es.indices.create(
            index=alerts_index,
            body={
                "mappings": {
                    "properties": {
                        "timestamp": {"type": "date"},
                        "alert_id": {"type": "keyword"},
                        "severity": {"type": "keyword"},
                        "title": {"type": "text"},
                        "description": {"type": "text"},
                        "source_ip": {"type": "ip"},
                        "destination_ip": {"type": "ip"},
                        "rule_id": {"type": "keyword"},
                        "mitre_technique": {"type": "keyword"},
                        "status": {"type": "keyword"},
                        "assigned_to": {"type": "keyword"},
                        "false_positive": {"type": "boolean"}
                    }
                }
            }
        )
