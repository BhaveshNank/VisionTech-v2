"""
Test configuration and fixtures
"""
import pytest
import sys
import os
from dotenv import load_dotenv

# This handles local development
# In CI, GitHub secrets override these values
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

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