"""
App Factory Module
==================
This module contains the Flask application factory.

The App Factory Pattern allows us to:
1. Create multiple app instances (testing, production, development)
2. Configure apps differently based on environment
3. Initialize extensions properly
4. Keep configuration separate from app logic

Function:
    create_app(config_name=None): Creates and configures Flask app
"""

from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from .config import get_config
import os


def create_app(config_name=None):
    """
    Application Factory Function
    =============================
    Creates and configures a Flask application instance.
    
    Args:
        config_name (str, optional): Name of config to use 
                                     ('development', 'production', 'testing')
                                     If None, reads from FLASK_ENV environment variable
    
    Returns:
        Flask: Configured Flask application instance
    
    Example:
        # Create development app
        app = create_app('development')
        
        # Create production app
        app = create_app('production')
        
        # Create app based on .env file
        app = create_app()  # Reads FLASK_ENV from .env
    """
    
    # ============================================
    # STEP 1: Create Flask App Instance
    # ============================================
    app = Flask(__name__)
    
    # ============================================
    # STEP 2: Load Configuration
    # ============================================
    # Get appropriate config class based on environment
    config = get_config(config_name)
    app.config.from_object(config)
    
    # ============================================
    # STEP 3: Initialize Extensions
    # ============================================
    
    # Configure CORS (Cross-Origin Resource Sharing)
    # Allows React frontend to communicate with Flask backend
    CORS(app, resources={
        r"/api/*": {
            "origins": [
            "https://vision-tech-v2-8ovwpc5wq-bhavesh-nankanis-projects.vercel.app",
            "http://localhost:3000"  # Keep for local development
        ], 
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # ============================================
    # STEP 4: Initialize Database Connection
    # ============================================
    try:
        # Get MongoDB URI from config
        mongo_uri = app.config.get('MONGODB_URI')
        
        if mongo_uri:
            # Create MongoDB client
            # serverSelectionTimeoutMS: Wait 5 seconds before timeout
            app.mongo_client = MongoClient(
                mongo_uri,
                serverSelectionTimeoutMS=5000
            )
            
            # Test the connection by pinging the database
            app.mongo_client.admin.command('ping')
            
            # Get database reference (database name from URI)
            # For mongodb://localhost:27017/visiontech_db
            # This extracts 'visiontech_db'
            db_name = mongo_uri.split('/')[-1].split('?')[0]
            app.db = app.mongo_client[db_name]
            
            print(f"✅ MongoDB connected successfully to: {db_name}")
            app.config['MONGODB_CONNECTED'] = True
            
        else:
            print("⚠️  No MongoDB URI configured")
            app.config['MONGODB_CONNECTED'] = False
            
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        print("⚠️  Application will run without database")
        app.config['MONGODB_CONNECTED'] = False
        app.mongo_client = None
        app.db = None
    
    # ============================================
    # STEP 5: Register Blueprints (Routes)
    # ============================================

    # Register Product blueprints
    from .api.products_routes import products_bp
    app.register_blueprint(products_bp)
    print("✅ Products API routes registered") 

    # Register chat routes 
    from .api.chat_routes import chat_bp
    app.register_blueprint(chat_bp)
    print("✅ Chat API routes registered")
    
    # ============================================
    # STEP 6: Register Error Handlers
    # ============================================
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 Not Found errors"""
        return {"error": "Resource not found", "status": 404}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 Internal Server errors"""
        return {
            "error": "Internal server error",
            "message": str(error),
            "status": 500
        }, 500
    
    # ============================================
    # STEP 7: Health Check Route (for testing)
    # ============================================
    
    @app.route('/health')
    def health_check():
        """
        Simple health check endpoint
        Returns server status and configuration info
        """
        return {
            "status": "healthy",
            "message": "Vision Tech Backend is running",
            "environment": app.config.get('FLASK_ENV', 'development'),
            "debug": app.config.get('DEBUG', False),
            "database_connected": app.config.get('MONGODB_CONNECTED', False)
        }
    
    # ============================================
    # Return configured app instance
    # ============================================
    return app