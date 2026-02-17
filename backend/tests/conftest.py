"""
Test configuration and fixtures
"""
import pytest
import sys
import os

# ✅ Set environment variables BEFORE importing app
# This ensures create_app() reads the correct MongoDB URI
os.environ.setdefault('MONGODB_URI', os.environ.get('MONGODB_URI', ''))
os.environ.setdefault('GEMINI_API_KEY', os.environ.get('GEMINI_API_KEY', ''))
os.environ.setdefault('FLASK_ENV', 'testing')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app

@pytest.fixture
def app():
    """Create test app instance"""
    app = create_app()
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()