"""
Products API Routes
===================
REST API endpoints for product operations.

Blueprint: products_bp
Base URL: /api/products

Endpoints:
    GET  /api/products              - Get all products
    GET  /api/products/<category>   - Get products by category
    GET  /api/products/search       - Search products
    GET  /api/products/filter       - Filter by price
    GET  /api/products/stats        - Get statistics
"""

from flask import Blueprint, jsonify, request, current_app
from ..services.product_service import ProductService
from ..repository import ProductRepository

# Create blueprint
# Blueprint is like a mini-app that can be registered with the main app
products_bp = Blueprint('products', __name__, url_prefix='/api/products')


def get_product_service():
    """
    Helper function to create ProductService instance
    
    Why a function?
    - Creates service on-demand
    - Uses current app's database connection
    - Clean dependency injection
    """
    # Get database from current Flask app
    db = current_app.db
    
    # Create repository with database
    repo = ProductRepository(db)
    
    # Create service with repository
    service = ProductService(repo)
    
    return service


# ============================================
# ENDPOINT 1: Get All Products
# ============================================

@products_bp.route('/', methods=['GET'])
def get_all_products():
    """
    Get all products from all categories
    
    URL: GET /api/products/
    
    Response:
        {
            "success": true,
            "data": [...],
            "total_products": 7,
            "total_categories": 3
        }
    """
    try:
        # Get service instance
        service = get_product_service()
        
        # Call service method
        result = service.get_all_products()
        
        # Return JSON response
        # Status code: 200 if success, 400 if failure
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        # Catch any unexpected errors
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500


# ============================================
# ENDPOINT 2: Get Products by Category
# ============================================

@products_bp.route('/<category>', methods=['GET'])
def get_products_by_category(category):
    """
    Get all products in a specific category
    
    URL: GET /api/products/<category>
    Example: GET /api/products/phone
    
    URL Parameters:
        category (str): Category name (phone, laptop, tv)
    
    Response:
        {
            "success": true,
            "category": "phone",
            "products": [...],
            "count": 3
        }
    """
    try:
        service = get_product_service()
        
        # Service handles validation and logic
        result = service.get_products_by_category(category)
        
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT 3: Search Products
# ============================================

@products_bp.route('/search', methods=['GET'])
def search_products():
    """
    Search for products by keyword
    
    URL: GET /api/products/search?q=apple&category=phone
    
    Query Parameters:
        q (str): Search term (required, min 2 characters)
        category (str): Optional category filter
    
    Response:
        {
            "success": true,
            "results": [...],
            "count": 5,
            "search_term": "apple"
        }
    """
    try:
        # Extract query parameters
        search_term = request.args.get('q', '')
        category = request.args.get('category', None)
        
        service = get_product_service()
        
        # Service validates search_term length
        result = service.search_products(search_term, category)
        
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT 4: Filter by Price
# ============================================

@products_bp.route('/filter', methods=['GET'])
def filter_products():
    """
    Filter products by price range
    
    URL: GET /api/products/filter?min=500&max=1000&category=phone
    
    Query Parameters:
        min (float): Minimum price (optional)
        max (float): Maximum price (optional)
        category (str): Category filter (optional)
    
    Response:
        {
            "success": true,
            "products": [...],
            "count": 2,
            "price_range": {"min": 500, "max": 1000}
        }
    """
    try:
        # Extract query parameters
        min_price = request.args.get('min', None)
        max_price = request.args.get('max', None)
        category = request.args.get('category', None)
        
        service = get_product_service()
        
        # Service handles price validation and conversion
        result = service.filter_by_price(min_price, max_price, category)
        
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT 5: Get Product Details
# ============================================

@products_bp.route('/detail/<product_name>', methods=['GET'])
def get_product_detail(product_name):
    """
    Get detailed information about a specific product
    
    URL: GET /api/products/detail/<product_name>
    Example: GET /api/products/detail/iPhone%2016%20Pro%20Max
    
    URL Parameters:
        product_name (str): Name of the product
    
    Query Parameters:
        category (str): Optional category hint
    
    Response:
        {
            "success": true,
            "product": {...}
        }
    """
    try:
        # Optional category hint from query params
        category = request.args.get('category', None)
        
        service = get_product_service()
        result = service.get_product_details(product_name, category)
        
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT 6: Get Statistics
# ============================================

@products_bp.route('/stats', methods=['GET'])
def get_statistics():
    """
    Get product statistics
    
    URL: GET /api/products/stats
    
    Response:
        {
            "success": true,
            "stats": {
                "total_products": 7,
                "by_category": {...},
                "price_range": {...}
            }
        }
    """
    try:
        service = get_product_service()
        result = service.get_statistics()
        
        status_code = 200 if result['success'] else 500
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# ENDPOINT 7: Get Product by ID
# ============================================

@products_bp.route('/detail/id/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    """
    Get product by ID
    
    URL: GET /api/products/detail/id/<product_id>
    Example: GET /api/products/detail/id/507f1f77bcf86cd799439011
    
    URL Parameters:
        product_id (str): MongoDB ObjectId as string
    
    Response:
        {
            "success": true,
            "data": {...product...}
        }
    """
    try:
        service = get_product_service()
        result = service.get_product_by_id(product_id)
        
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================
# Error Handlers for this Blueprint
# ============================================

@products_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors within products blueprint"""
    return jsonify({
        "success": False,
        "error": "Resource not found"
    }), 404


@products_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors within products blueprint"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500