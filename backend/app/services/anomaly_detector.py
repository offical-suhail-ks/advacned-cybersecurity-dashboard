"""
Anomaly detector service - ML-based anomaly detection using Isolation Forest
"""
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from datetime import datetime, timedelta
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os
from app.core.elasticsearch import get_elasticsearch
from app.core.config import settings
from app.schemas.schemas import AnomalyResponse


class AnomalyDetector:
    """
    ML-based anomaly detector using Isolation Forest algorithm
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.es = get_elasticsearch()
        self.model_path = "./models/anomaly_model.pkl"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load trained model from disk"""
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            # Create default model
            self.model = IsolationForest(
                contamination=settings.ANOMALY_DETECTION_THRESHOLD,
                random_state=42,
                n_estimators=100
            )
    
    def _save_model(self):
        """Save trained model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
    
    async def detect_anomalies(
        self,
        start_date: datetime,
        end_date: datetime,
        threshold: float = 0.1
    ) -> List[AnomalyResponse]:
        """
        Detect anomalies in log data
        
        Args:
            start_date: Start date for analysis
            end_date: End date for analysis
            threshold: Anomaly score threshold
            
        Returns:
            List of detected anomalies
        """
        # Fetch logs from Elasticsearch
        logs = await self._fetch_logs(start_date, end_date)
        
        if not logs:
            return []
        
        # Extract features
        features_data = self._extract_features(logs)
        
        if len(features_data) == 0:
            return []
        
        # Prepare feature matrix
        feature_matrix = np.array([list(f['features'].values()) for f in features_data])
        
        # Predict anomalies
        predictions = self.model.predict(feature_matrix)
        scores = self.model.score_samples(feature_matrix)
        
        # Normalize scores to 0-1 range (more negative = more anomalous)
        normalized_scores = 1 - (scores - scores.min()) / (scores.max() - scores.min() + 1e-10)
        
        # Filter anomalies
        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, normalized_scores)):
            if pred == -1 and score >= (1 - threshold):  # -1 indicates anomaly
                anomalies.append(AnomalyResponse(
                    timestamp=features_data[i]['timestamp'],
                    anomaly_score=float(score),
                    features=features_data[i]['features'],
                    is_anomaly=True
                ))
        
        return anomalies
    
    async def train_model(self):
        """
        Train the anomaly detection model on historical data
        """
        # Fetch training data (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        logs = await self._fetch_logs(start_date, end_date)
        
        if len(logs) < 100:
            print("Not enough data for training")
            return
        
        # Extract features
        features_data = self._extract_features(logs)
        
        if len(features_data) == 0:
            return
        
        # Prepare feature matrix
        feature_matrix = np.array([list(f['features'].values()) for f in features_data])
        
        # Train model
        self.model = IsolationForest(
            contamination=settings.ANOMALY_DETECTION_THRESHOLD,
            random_state=42,
            n_estimators=100,
            max_samples='auto',
            n_jobs=-1
        )
        
        self.model.fit(feature_matrix)
        
        # Save model
        self._save_model()
        
        print(f"Model trained on {len(feature_matrix)} samples")
    
    async def _fetch_logs(self, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """Fetch logs from Elasticsearch"""
        index_name = f"{settings.ELASTICSEARCH_INDEX_PREFIX}_logs"
        
        query = {
            "bool": {
                "must": [
                    {
                        "range": {
                            "timestamp": {
                                "gte": start_date.isoformat(),
                                "lte": end_date.isoformat()
                            }
                        }
                    }
                ]
            }
        }
        
        try:
            result = await self.es.search(
                index=index_name,
                query=query,
                size=10000,
                sort=[{"timestamp": {"order": "asc"}}]
            )
            
            return [hit['_source'] for hit in result['hits']['hits']]
        
        except Exception as e:
            print(f"Error fetching logs: {str(e)}")
            return []
    
    def _extract_features(self, logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract features from logs for ML model
        
        Features:
        - Request count per hour
        - Unique source IPs
        - Error rate
        - Failed login attempts
        - Average status code
        """
        # Group logs by hour
        hourly_data = {}
        
        for log in logs:
            timestamp = datetime.fromisoformat(log['timestamp'])
            hour_key = timestamp.replace(minute=0, second=0, microsecond=0)
            
            if hour_key not in hourly_data:
                hourly_data[hour_key] = {
                    'timestamp': hour_key,
                    'request_count': 0,
                    'unique_ips': set(),
                    'error_count': 0,
                    'failed_logins': 0,
                    'status_codes': []
                }
            
            hourly_data[hour_key]['request_count'] += 1
            
            if log.get('source_ip'):
                hourly_data[hour_key]['unique_ips'].add(log['source_ip'])
            
            if log.get('status_code', 200) >= 400:
                hourly_data[hour_key]['error_count'] += 1
            
            if log.get('event_type') == 'failed_login':
                hourly_data[hour_key]['failed_logins'] += 1
            
            if log.get('status_code'):
                hourly_data[hour_key]['status_codes'].append(log['status_code'])
        
        # Convert to feature vectors
        features_data = []
        
        for hour_key, data in hourly_data.items():
            features = {
                'request_count': data['request_count'],
                'unique_ips': len(data['unique_ips']),
                'error_rate': data['error_count'] / max(data['request_count'], 1),
                'failed_logins': data['failed_logins'],
                'avg_status_code': np.mean(data['status_codes']) if data['status_codes'] else 200
            }
            
            features_data.append({
                'timestamp': data['timestamp'],
                'features': features
            })
        
        return features_data
