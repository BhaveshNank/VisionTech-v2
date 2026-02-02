"""
Application Entry Point
=======================
This is the main entry point for the Flask application.

Why separate run.py from app creation?
- App Factory Pattern: create_app() can be called multiple times
- Testing: Can create test instances with different configs
- Flexibility: Easy to switch between development/production
- Clean: Entry point is simple and focused

Usage:
    python run.py (runs development server)
"""

from app import create_app
import os
# Create the Flask application instance
# get_config() will read FLASK_ENV from .env and load appropriate config

app = create_app()

if __name__ == '__main__':
    """
    Run the development server
    
    Only runs when you execute: python run.py
    Does NOT run when importing app for testing or production servers
    
    Debug mode features (from config.py):
    - Auto-reload on code changes
    - Detailed error messages
    - Interactive debugger
    """
    
    # Get host and port from config
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 5001)
    debug = app.config.get('DEBUG', True)
    
    print(f"""
    ╔══════════════════════════════════════════════════╗
    ║          VISION TECH - Backend Server            ║
    ╚══════════════════════════════════════════════════╝
    
    🚀 Server starting...
    📍 Running on: http://{host}:{port}
    🔧 Debug mode: {debug}
    🗄️  Database: {app.config.get('MONGODB_URI', 'Not configured')}
    
    Press CTRL+C to stop the server
    """)
    
    # Start the Flask development server
    app.run(
        host=host,
        port=port,
        debug=debug
    )