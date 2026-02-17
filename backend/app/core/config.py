"""
Core configuration settings for the CyberSecurity Dashboard API
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "CyberSecurity Dashboard API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PASSWORD: str = ""
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Elasticsearch
    ELASTICSEARCH_HOST: str = "localhost"
    ELASTICSEARCH_PORT: int = 9200
    ELASTICSEARCH_SCHEME: str = "http"
    ELASTICSEARCH_USER: str = "elastic"
    ELASTICSEARCH_PASSWORD: str = ""
    ELASTICSEARCH_INDEX_PREFIX: str = "cybersec"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 50
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_FILE_EXTENSIONS: str = ".exe,.dll,.pdf,.doc,.docx,.zip,.rar"
    
    # External APIs
    ZAP_API_KEY: str = ""
    ZAP_PROXY_URL: str = "http://localhost:8080"
    VIRUSTOTAL_API_KEY: str = ""
    NVD_API_KEY: str = ""
    
    # Email (SOAR)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    # Security
    SECURITY_HEADERS_ENABLED: bool = True
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    
    # AI/ML
    ANOMALY_DETECTION_THRESHOLD: float = 0.1
    MODEL_TRAINING_INTERVAL_HOURS: int = 24
    
    # Threat Intelligence
    THREAT_INTEL_UPDATE_INTERVAL_HOURS: int = 6
    
    # MITRE ATT&CK
    MITRE_ATTACK_VERSION: str = "v13"
    
    # Backup
    BACKUP_ENABLED: bool = True
    BACKUP_INTERVAL_HOURS: int = 24
    BACKUP_RETENTION_DAYS: int = 30
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def allowed_extensions_list(self) -> List[str]:
        """Parse allowed file extensions from comma-separated string"""
        return [ext.strip() for ext in self.ALLOWED_FILE_EXTENSIONS.split(",")]
    
    @property
    def max_file_size_bytes(self) -> int:
        """Convert max file size from MB to bytes"""
        return self.MAX_FILE_SIZE_MB * 1024 * 1024
    
    @property
    def elasticsearch_url(self) -> str:
        """Construct Elasticsearch URL"""
        auth = ""
        if self.ELASTICSEARCH_USER and self.ELASTICSEARCH_PASSWORD:
            auth = f"{self.ELASTICSEARCH_USER}:{self.ELASTICSEARCH_PASSWORD}@"
        return f"{self.ELASTICSEARCH_SCHEME}://{auth}{self.ELASTICSEARCH_HOST}:{self.ELASTICSEARCH_PORT}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
