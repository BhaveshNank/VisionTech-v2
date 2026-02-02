"""
Chat API Routes
===============
REST API endpoints for AI chatbot functionality.

Blueprint: chat_bp
Base URL: /api/chat

Endpoints:
    POST /api/chat          - Send message to AI
    POST /api/chat/reset    - Clear conversation history
    GET  /api/chat/history  - Get conversation history
"""

from flask import Blueprint, jsonify, request, current_app
from app.services.gemini_service import GeminiService
from app.services.product_service import ProductService
from app.repository import ProductRepository
import os


# Create blueprint
chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

# Initialize Gemini service (one instance for all requests)
# Note: In production, you'd want session-based conversation history
gemini_service = GeminiService(api_key=os.getenv('GEMINI_API_KEY'))


def get_product_service():
    """Helper to create ProductService instance"""
    db = current_app.db
    repo = ProductRepository(db)
    return ProductService(repo)


# ============================================
# ENDPOINT 1: Send Message to AI
# ============================================

@chat_bp.route('/', methods=['POST'])
def chat():
    """
    Send message to AI chatbot
    
    Request Body:
        {
            "message": "I need a gaming laptop",
            "include_products": false  (optional)
        }
    
    Response:
        {
            "success": true,
            "response": "AI's response here",
            "products": []  (if include_products=true)
        }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        user_message = data['message'].strip()
        
        if not user_message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty"
            }), 400
        
        # Optional: include product data in context
        include_products = data.get('include_products', False)
        context = {}
        all_products_flat = []  # ✅ CHANGED: Renamed for clarity
        
        if include_products:
            # Get product data to give Gemini context
            product_service = get_product_service()
            all_products_response = product_service.get_all_products()
            
            if all_products_response['success'] and all_products_response.get('data'):
                categories = all_products_response['data']  # ✅ CHANGED: This is a list of category objects
                
                # ✅ NEW: Flatten categories into a single list of products
                for category in categories:
                    category_name = category.get('category', '')
                    products_in_category = category.get('products', [])
                    
                    for product in products_in_category:
                        # Add category name to each product
                        product['category'] = category_name
                        all_products_flat.append(product)
                
                current_app.logger.info(f"Loaded {len(all_products_flat)} total products")
                
                # ✅ CHANGED: Now format the flattened products for AI context
                if all_products_flat:
                    products_text = "\n".join([
                        f"- {p['name']} (Category: {p.get('category', 'N/A')}) - ${p['price']}"
                        for p in all_products_flat
                    ])
                    
                    # Pass products to Gemini in the expected format
                    context['available_products'] = {
                        'success': True,
                        'data': all_products_flat
                    }
        
        # Send message to Gemini
        result = gemini_service.send_message(user_message, context)
        
        if result['success']:
            response_text = result['response']
            
            # Extract products mentioned in response
            recommended_products = []
            
            if include_products and all_products_flat:  # ✅ CHANGED: Use flattened list
                response_lower = response_text.lower()
                
                for product in all_products_flat:  # ✅ CHANGED: Iterate over flattened list
                    # Check if product name appears in AI response
                    product_name = product.get('name', '')
                    if product_name and product_name.lower() in response_lower:
                        recommended_products.append({
                            '_id': str(product.get('_id', '')),
                            'name': product_name,
                            'price': product.get('price', 0),
                            'image': product.get('image', ''),
                            'category': product.get('category', ''),
                            'brand': product.get('brand', ''),
                            'stock': product.get('stock', 0),
                            'specifications': product.get('specifications', [])
                        })
                        
                        # Limit to 5 products
                        if len(recommended_products) >= 5:
                            break
            
            return jsonify({
                "success": True,
                "response": response_text,
                "products": recommended_products
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": result.get('error', 'Unknown error')
            }), 500
            
    except Exception as e:
        current_app.logger.error(f"Chat error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


# ============================================
# ENDPOINT 2: Reset Conversation
# ============================================

@chat_bp.route('/reset', methods=['POST'])
def reset_conversation():
    """
    Clear conversation history
    
    Response:
        {
            "success": true,
            "message": "Conversation reset"
        }
    """
    try:
        result = gemini_service.reset_conversation()
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# ENDPOINT 3: Get Conversation History
# ============================================

@chat_bp.route('/history', methods=['GET'])
def get_history():
    """
    Get conversation history
    
    Response:
        {
            "success": true,
            "history": [
                {"role": "user", "message": "..."},
                {"role": "assistant", "message": "..."}
            ]
        }
    """
    try:
        history = gemini_service.get_conversation_history()
        return jsonify({
            "success": True,
            "history": history
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500