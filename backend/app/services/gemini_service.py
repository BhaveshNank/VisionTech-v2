"""
Gemini AI Service
=================
Handles all interactions with Google's Gemini AI model.

Purpose:
- Send prompts to Gemini
- Receive AI responses
- Manage conversation context
- Format responses for our app

This service acts as a wrapper around Google's Gemini API.
"""

import google.generativeai as genai
import os
from typing import Dict, List, Optional
import json


class GeminiService:
    """
    Gemini AI Service
    
    Manages communication with Google's Gemini AI model.
    Handles conversation history, prompt formatting, and response parsing.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize Gemini Service
        
        Args:
            api_key (str): Gemini API key (from environment if not provided)
        """
        # Get API key from parameter or environment
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini with API key
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        # gemini-2.5-flash = Fast, efficient model (good for chat)
        # gemini-2.5-pro = More powerful but slower (use if needed)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Conversation history (stores messages)
        self.conversation_history: List[Dict] = []
        
        print("✅ Gemini AI Service initialized")
    
    
    def send_message(self, user_message: str, context: Dict = None) -> Dict:
        """
        Send a message to Gemini and get response
        
        Args:
            user_message (str): The user's message
            context (Dict): Optional context (product data, user info, etc.)
        
        Returns:
            Dict: {
                "success": bool,
                "response": str (AI's response),
                "error": str (if failed)
            }
        """
        try:
            # Build the prompt with context
            prompt = self._build_prompt(user_message, context)
            
            # Send to Gemini
            response = self.model.generate_content(prompt)
            
            # Extract text from response
            ai_response = response.text
            
            # Store in conversation history
            self.conversation_history.append({
                "role": "user",
                "message": user_message
            })
            self.conversation_history.append({
                "role": "assistant",
                "message": ai_response
            })
            
            return {
                "success": True,
                "response": ai_response
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Gemini API error: {str(e)}"
            }
    
    
    def _build_prompt(self, user_message: str, context: Dict = None) -> str:
        """
        Build a prompt for Gemini with system instructions and context
        
        Args:
            user_message (str): User's message
            context (Dict): Additional context (products, previous messages, etc.)
        
        Returns:
            str: Formatted prompt for Gemini
        """
        # Check if we have product context
        has_products = context and 'available_products' in context
        
        if has_products:
            # STRICT system prompt when products are available
            system_prompt = """You are Mark, an AI shopping assistant for VisionTech, an electronics e-commerce store.

    ⚠️ CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
    1. ONLY recommend products from the "Available Products" list provided in the context below
    2. NEVER recommend products from your general knowledge (no Samsung, Apple, Google, OnePlus, Xiaomi, Realme, etc. unless they appear in our product list)
    3. Use the EXACT product names and prices from our database
    4. ALL products in our database are ALWAYS IN STOCK - never say a product is out of stock or unavailable
    5. If we don't have what the customer wants in our catalog, say: "We don't currently have that exact product, but here are similar items from our VisionTech catalog"

    📝 FORMATTING RULES:
    1. Format product recommendations as clean numbered lists:
    1. Product Name - $Price
        Brief explanation of why it fits their needs (1-2 sentences max)
    
    2. Product Name - $Price
        Brief explanation (1-2 sentences max)

    2. DO NOT use asterisks (**) for bold or any markdown formatting - just plain text
    3. Keep explanations concise - focus on key features that match their request
    4. After listing products, ask ONE follow-up question to refine their choice

    🛒 WHEN CUSTOMER MAKES A CHOICE:
    When a customer says they want a specific product (e.g., "I'll go with the iPhone"), respond enthusiastically and guide them:

    "Excellent choice! The [Product Name] is a fantastic option for [their use case]. 

    To proceed:
    - Click the 'Add' button on the product card below to add it to your cart
    - Or click 'View' to see full specifications and details

    Would you like help with anything else, or are you ready to explore more products?"

    NEVER say the product is out of stock - all products are available!

    EXAMPLE FORMAT FOR RECOMMENDATIONS:
    "Here are some great options for gaming:

    1. iPhone 16 Pro Max - $1299
    Powerful A18 Pro chip delivers excellent gaming performance with smooth graphics on the Super Retina display.

    2. Samsung Galaxy S25 Ultra - $1149
    Snapdragon 8 Gen 3 processor handles demanding games easily, with a high refresh rate display for responsive gameplay.

    Do any of these catch your eye, or would you like options in a different price range?"

    Be friendly, helpful, and enthusiastic. All products are in stock and ready to order!
    """
        else:
            # General system prompt when no products
            system_prompt = """You are Mark, an AI shopping assistant for VisionTech, an electronics e-commerce store.

    Ask customers about:
    - What type of device they need (Phone, Laptop, TV, etc.)
    - Their budget
    - What they'll use it for

    Be friendly and helpful!
    """
        
        # Build full prompt
        full_prompt = system_prompt + "\n\n"
        
        # Add product context if provided
        if context and 'available_products' in context:
            products_data = context['available_products']
            
            if products_data.get('success') and products_data.get('data'):
                full_prompt += "📦 AVAILABLE PRODUCTS IN OUR DATABASE:\n"
                full_prompt += "=" * 50 + "\n"
                full_prompt += "⚠️ ALL PRODUCTS BELOW ARE IN STOCK AND AVAILABLE TO ORDER\n"
                full_prompt += "=" * 50 + "\n\n"
                
                for product in products_data['data']:
                    full_prompt += f"• {product['name']}\n"
                    full_prompt += f"  Category: {product.get('category', 'N/A')}\n"
                    full_prompt += f"  Price: ${product['price']}\n"
                    full_prompt += f"  Status: IN STOCK ✓\n"  # Always show as in stock
                    
                    # Add first 2 specs if available
                    if product.get('specifications'):
                        specs = product['specifications'][:2]
                        full_prompt += f"  Features: {', '.join(specs)}\n"
                    
                    full_prompt += "\n"
                
                full_prompt += "=" * 50 + "\n"
                full_prompt += "⚠️ REMEMBER: Only recommend products from the list above!\n"
                full_prompt += "⚠️ ALL PRODUCTS ARE IN STOCK - Never say out of stock!\n\n"
        
        # Add conversation history (last 5 messages for context)
        if self.conversation_history:
            full_prompt += "Previous conversation:\n"
            for msg in self.conversation_history[-5:]:
                role = "User" if msg["role"] == "user" else "Assistant"
                full_prompt += f"{role}: {msg['message']}\n"
            full_prompt += "\n"
        
        # Add current user message
        full_prompt += f"User: {user_message}\n"
        full_prompt += "Assistant:"
        
        return full_prompt
    
    
    def reset_conversation(self):
        """
        Clear conversation history
        
        Used when user wants to start a new conversation.
        """
        self.conversation_history = []
        return {
            "success": True,
            "message": "Conversation history cleared"
        }
    
    
    def get_conversation_history(self) -> List[Dict]:
        """
        Get the conversation history
        
        Returns:
            List[Dict]: List of messages with role and content
        """
        return self.conversation_history