"""
Configuration Module
====================
This module contains all configuration classes for different environments.

Why separate configs?
- Development: Debug mode ON, detailed errors, auto-reload
- Production: Debug mode OFF, secure settings, optimized
- Testing: Isolated database, fast execution

I have used environment variables (.env file) to keep secrets secure.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
# This reads the .env file and makes variables available via os.getenv()
load_dotenv()


class Config:
    """
    Base Configuration Class
    ========================
    All other configs inherit from this.
    Contains settings common to ALL environments.
    """
    
    # Secret key for session encryption and security
    # CRITICAL: Must be random and secret in production
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # MongoDB connection string
    # Format: mongodb://host:port/database_name
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/visiontech_db')
    
    # Gemini AI API Key
    # Used for chatbot recommendations
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # JSON sort keys (for consistent API responses)
    JSON_SORT_KEYS = False
    
    # CORS settings (allow frontend to call backend)
    CORS_HEADERS = 'Content-Type'


class DevelopmentConfig(Config):
    """
    Development Configuration
    =========================
    Used when running on your local machine.
    
    Features:
    - Debug mode enabled (detailed error messages)
    - Auto-reload on code changes
    - Verbose logging
    """
    
    DEBUG = True
    TESTING = False
    
    # Detailed logging for debugging
    LOG_LEVEL = 'DEBUG'
    
    # Development server settings
    HOST = '0.0.0.0'  # Accept connections from any IP (for testing on devices)
    PORT = int(os.getenv('PORT', 5001))


class ProductionConfig(Config):
    """
    Production Configuration
    ========================
    Used when deployed (if you ever deploy).
    
    Features:
    - Debug mode disabled (no error details leaked)
    - Secure settings
    - Optimized performance
    """
    
    DEBUG = False
    TESTING = False
    
    # Minimal logging (only errors)
    LOG_LEVEL = 'ERROR'
    
    # Production must have a strong secret key
    # Will raise error if not set properly
    @property
    def SECRET_KEY(self):
        secret_key = os.getenv('SECRET_KEY')
        if not secret_key or secret_key == 'dev-secret-key-change-in-production':
            raise ValueError("SECRET_KEY must be set in production!")
        return secret_key


class TestingConfig(Config):
    """
    Testing Configuration
    =====================
    Used for automated tests (future feature).
    
    Features:
    - Separate test database
    - Fast execution
    - Isolated environment
    """
    
    DEBUG = True
    TESTING = True



# Configuration dictionary
# Easy way to select config by name
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """
    Get Configuration by Name
    =========================
    
    Usage:
        config = get_config('development')
        app.config.from_object(config)
    
    Args:
        config_name (str): Name of config ('development', 'production', 'testing')
    
    Returns:
        Config class for the specified environment
    """
    if config_name is None:
        # Use FLASK_ENV from environment variables, default to 'development'
        config_name = os.getenv('FLASK_ENV', 'development')
    
    return config.get(config_name, DevelopmentConfig)