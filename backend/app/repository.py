"""
Repository Module
=================
Contains repository classes for database operations.

Repository Pattern:
- Abstracts database operations into reusable methods
- Separates database logic from business logic
- Makes code testable and maintainable

Classes:
    ProductRepository: Handles all product-related database operations
"""

from typing import List, Dict, Optional
from bson import ObjectId


class ProductRepository:
    """
    Product Repository
    ==================
    Handles all database operations for products.
    
    This class is the ONLY place where we directly interact with MongoDB
    for product data. All other parts of the app use this repository.
    
    Attributes:
        collection: MongoDB collection for products
    """
    
    def __init__(self, db):
        """
        Initialize repository with database connection
        
        Args:
            db: MongoDB database instance (from app.db)
        """
        # Get the 'products' collection from database
        # This is where all our product data lives
        self.collection = db['products']
    
    def _add_product_ids(self, categories: List[Dict]) -> List[Dict]:
        """
        Helper method to add unique IDs to products
        
        Since products are nested in category documents and don't have
        their own _id fields, we generate consistent IDs for them.
        
        ID Format: {category}-{index}
        Example: "phone-0", "phone-1", "laptop-0"
        
        Args:
            categories: List of category documents
        
        Returns:
            Same list with _id added to each product
        """
        for category in categories:
            category_name = category.get('category', '')
            products = category.get('products', [])
            
            for idx, product in enumerate(products):
                # Generate unique ID: category-index
                product['_id'] = f"{category_name}-{idx}"
                # Also ensure category is set
                if 'category' not in product:
                    product['category'] = category_name
        
        return categories
    
    def get_all_categories(self) -> List[Dict]:
        """
        Get all product categories
        
        Returns:
            List of category documents, each containing:
            - category name
            - array of products in that category (with _id added)
        
        Example:
            [
                {"category": "phone", "products": [...]},
                {"category": "laptop", "products": [...]}
            ]
        """
        try:
            # find() with no filter {} = get ALL documents
            # Convert cursor to list
            categories = list(self.collection.find({}))
            
            # Remove MongoDB's category document _id (not needed in API responses)
            for category in categories:
                if '_id' in category:
                    del category['_id']
            
            # Add unique IDs to products
            categories = self._add_product_ids(categories)
            
            return categories
            
        except Exception as e:
            print(f"❌ Error fetching categories: {str(e)}")
            return []
    
    def get_products_by_category(self, category_name: str) -> Optional[Dict]:
        """
        Get all products in a specific category
        
        Args:
            category_name: Name of category (e.g., "phone", "laptop")
        
        Returns:
            Category document with products (with _id added), or None if not found
        
        Example:
            {
                "category": "phone",
                "products": [
                    {"_id": "phone-0", "name": "iPhone 16 Pro Max", "price": 1199, ...},
                    {"_id": "phone-1", "name": "Samsung S24 Ultra", "price": 1299, ...}
                ]
            }
        """
        try:
            # find_one() returns first matching document
            # Case-insensitive search using regex
            category_doc = self.collection.find_one({
                "category": {"$regex": f"^{category_name}$", "$options": "i"}
            })
            
            if category_doc:
                # Remove MongoDB _id
                if '_id' in category_doc:
                    del category_doc['_id']
                
                # Add product IDs
                self._add_product_ids([category_doc])
                
                return category_doc
            
            return None
            
        except Exception as e:
            print(f"❌ Error fetching category '{category_name}': {str(e)}")
            return None
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """
        Get a single product by its generated ID
        
        Args:
            product_id: Product ID (format: "category-index", e.g., "phone-0")
        
        Returns:
            Product document or None if not found
        
        Logic:
            Product IDs are in format: {category}-{index}
            Example: "phone-0" means first product in phone category
        """
        try:
            # Parse the product ID
            # Format: "category-index"
            if '-' not in product_id:
                print(f"❌ Invalid product ID format: {product_id}")
                return None
            
            # Split ID into category and index
            parts = product_id.rsplit('-', 1)  # rsplit to handle categories with hyphens
            category_name = parts[0]
            
            try:
                product_index = int(parts[1])
            except ValueError:
                print(f"❌ Invalid product index in ID: {product_id}")
                return None
            
            # Get the category
            category_doc = self.collection.find_one({
                "category": {"$regex": f"^{category_name}$", "$options": "i"}
            })
            
            if not category_doc:
                print(f"❌ Category not found: {category_name}")
                return None
            
            products = category_doc.get('products', [])
            
            # Check if index is valid
            if product_index < 0 or product_index >= len(products):
                print(f"❌ Product index out of range: {product_index}")
                return None
            
            # Get the product
            product = products[product_index]
            
            # Add the ID and category
            product['_id'] = product_id
            product['category'] = category_doc.get('category', category_name)
            
            return product
            
        except Exception as e:
            print(f"❌ Error fetching product by ID '{product_id}': {str(e)}")
            return None
    
    def get_product_by_name(self, product_name: str, category_name: str = None) -> Optional[Dict]:
        """
        Find a specific product by its name
        
        Args:
            product_name: Name of the product to find
            category_name: Optional category to narrow search
        
        Returns:
            Product document or None if not found
        
        Logic:
            MongoDB stores products inside category documents:
            {category: "phone", products: [{name: "iPhone"}, {name: "Samsung"}]}
            
            We need to:
            1. Find the category document
            2. Search through its products array
            3. Return the matching product
        """
        try:
            # Build search filter
            search_filter = {}
            
            if category_name:
                # Search in specific category
                search_filter["category"] = {"$regex": f"^{category_name}$", "$options": "i"}
            
            # Search for product within the products array
            # $elemMatch finds array elements matching conditions
            search_filter["products"] = {
                "$elemMatch": {
                    "name": {"$regex": f"^{product_name}$", "$options": "i"}
                }
            }
            
            # Find category containing this product
            category_doc = self.collection.find_one(search_filter)
            
            if category_doc and 'products' in category_doc:
                # Search through products array to find exact match
                category_name = category_doc.get('category', '')
                for idx, product in enumerate(category_doc['products']):
                    if product['name'].lower() == product_name.lower():
                        # Add category info and ID to product
                        product['category'] = category_name
                        product['_id'] = f"{category_name}-{idx}"
                        return product
            
            return None
            
        except Exception as e:
            print(f"❌ Error finding product '{product_name}': {str(e)}")
            return None
    
    def search_products(self, search_term: str) -> List[Dict]:
        """
        Search for products by name or brand across all categories
        
        Args:
            search_term: Search string (e.g., "apple", "gaming")
        
        Returns:
            List of matching products
        
        Logic:
            1. Search across ALL categories
            2. Look in product names and brands
            3. Return all matches
        """
        try:
            matching_products = []
            
            # Get all categories
            categories = self.collection.find({})
            
            # Search through each category's products
            for category_doc in categories:
                category_name = category_doc.get('category', '')
                products = category_doc.get('products', [])
                
                for idx, product in enumerate(products):
                    # Check if search term appears in name or brand
                    name = product.get('name', '').lower()
                    brand = product.get('brand', '').lower()
                    search_lower = search_term.lower()
                    
                    if search_lower in name or search_lower in brand:
                        # Add category info and ID
                        product['category'] = category_name
                        product['_id'] = f"{category_name}-{idx}"
                        matching_products.append(product)
            
            return matching_products
            
        except Exception as e:
            print(f"❌ Error searching products: {str(e)}")
            return []
    
    def get_products_by_price_range(self, min_price: float, max_price: float, category_name: str = None) -> List[Dict]:
        """
        Get products within a price range
        
        Args:
            min_price: Minimum price
            max_price: Maximum price
            category_name: Optional category filter
        
        Returns:
            List of products within price range
        """
        try:
            matching_products = []
            
            # Build category filter
            if category_name:
                categories = self.collection.find({
                    "category": {"$regex": f"^{category_name}$", "$options": "i"}
                })
            else:
                categories = self.collection.find({})
            
            # Filter products by price
            for category_doc in categories:
                category = category_doc.get('category', '')
                products = category_doc.get('products', [])
                
                for idx, product in enumerate(products):
                    price = product.get('price', 0)
                    if min_price <= price <= max_price:
                        product['category'] = category
                        product['_id'] = f"{category}-{idx}"
                        matching_products.append(product)
            
            return matching_products
            
        except Exception as e:
            print(f"❌ Error filtering by price: {str(e)}")
            return []
    
    def count_products(self) -> Dict[str, int]:
        """
        Count total products and products per category
        
        Returns:
            Dictionary with counts
            {
                "total": 10,
                "by_category": {
                    "phone": 3,
                    "laptop": 5,
                    "tv": 2
                }
            }
        """
        try:
            categories = self.collection.find({})
            
            total = 0
            by_category = {}
            
            for category_doc in categories:
                category_name = category_doc.get('category', 'unknown')
                product_count = len(category_doc.get('products', []))
                
                by_category[category_name] = product_count
                total += product_count
            
            return {
                "total": total,
                "by_category": by_category
            }
            
        except Exception as e:
            print(f"❌ Error counting products: {str(e)}")
            return {"total": 0, "by_category": {}}