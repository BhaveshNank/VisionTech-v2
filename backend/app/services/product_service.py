"""
Product Service Module
======================
Contains business logic for product operations.

Service Layer Responsibilities:
- Input validation
- Business rule enforcement
- Data transformation
- Coordination between repositories
- Error handling

This layer sits between routes (API) and repositories (database).
"""

from typing import List, Dict, Optional
from ..repository import ProductRepository


class ProductService:
    """
    Product Service
    ===============
    Handles all business logic related to products.
    
    This is where business rules live:
    - How to filter products
    - How to format responses
    - What validations to apply
    - How to handle edge cases
    
    Attributes:
        repo: ProductRepository instance for database access
    """
    
    def __init__(self, repository: ProductRepository):
        """
        Initialize service with repository
        
        Args:
            repository: ProductRepository instance
        
        Why dependency injection?
        - Easy to swap repository (e.g., for testing)
        - Loose coupling (service doesn't create its own repo)
        - Professional pattern
        """
        self.repo = repository
    
    
    def get_all_products(self) -> Dict[str, any]:
        """
        Get all products organized by category
        
        Returns:
            {
                "success": True/False,
                "data": [...categories...],
                "total_products": 10,
                "total_categories": 3
            }
        
        Business Logic:
        - Fetch all categories from repository
        - Count products and categories
        - Format into consistent response structure
        """
        try:
            # Get data from repository
            categories = self.repo.get_all_categories()
            
            # Business logic: Calculate totals
            total_products = sum(
                len(category.get('products', [])) 
                for category in categories
            )
            total_categories = len(categories)
            
            # Format response
            return {
                "success": True,
                "data": categories,
                "total_products": total_products,
                "total_categories": total_categories
            }
            
        except Exception as e:
            # Error handling: Return consistent error format
            return {
                "success": False,
                "error": str(e),
                "data": []
            }
    
    
    def get_products_by_category(self, category_name: str) -> Dict[str, any]:
        """
        Get all products in a specific category
        
        Args:
            category_name: Name of category
        
        Returns:
            {
                "success": True/False,
                "category": "phone",
                "products": [...],
                "count": 3
            }
        
        Business Logic:
        - Validate category name
        - Fetch from repository
        - Handle case when category doesn't exist
        """
        try:
            # Input validation: Check if category name is provided
            if not category_name or not category_name.strip():
                return {
                    "success": False,
                    "error": "Category name is required",
                    "products": []
                }
            
            # Clean input: Remove extra spaces, convert to lowercase
            category_name = category_name.strip().lower()
            
            # Get from repository
            category_data = self.repo.get_products_by_category(category_name)
            
            # Handle not found case
            if not category_data:
                return {
                    "success": False,
                    "error": f"Category '{category_name}' not found",
                    "products": []
                }
            
            # Success response
            products = category_data.get('products', [])
            return {
                "success": True,
                "category": category_data.get('category'),
                "products": products,
                "count": len(products)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "products": []
            }
    
    
    def search_products(self, search_term: str, category: Optional[str] = None) -> Dict[str, any]:
        """
        Search for products by keyword
        
        Args:
            search_term: Keyword to search for
            category: Optional category to filter by
        
        Returns:
            {
                "success": True,
                "results": [...],
                "count": 5,
                "search_term": "apple"
            }
        
        Business Logic:
        - Validate search term (minimum length)
        - Search across products
        - Filter by category if specified
        - Sort results by relevance
        """
        try:
            # Validation: Require minimum search length
            if not search_term or len(search_term.strip()) < 2:
                return {
                    "success": False,
                    "error": "Search term must be at least 2 characters",
                    "results": []
                }
            
            # Clean input
            search_term = search_term.strip()
            
            # Get results from repository
            results = self.repo.search_products(search_term)
            
            # Business logic: Filter by category if specified
            if category:
                category = category.strip().lower()
                results = [
                    product for product in results
                    if product.get('category', '').lower() == category
                ]
            
            # Sort by relevance (exact name matches first)
            search_lower = search_term.lower()
            results.sort(
                key=lambda p: (
                    0 if search_lower == p.get('name', '').lower() else 1,
                    p.get('name', '')
                )
            )
            
            return {
                "success": True,
                "results": results,
                "count": len(results),
                "search_term": search_term
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "results": []
            }
    
    
    def filter_by_price(
        self, 
        min_price: Optional[float] = None, 
        max_price: Optional[float] = None,
        category: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Filter products by price range
        
        Args:
            min_price: Minimum price (optional)
            max_price: Maximum price (optional)
            category: Category filter (optional)
        
        Returns:
            {
                "success": True,
                "products": [...],
                "count": 3,
                "price_range": {"min": 500, "max": 1000}
            }
        
        Business Logic:
        - Validate price inputs
        - Set defaults if not provided
        - Ensure min < max
        - Filter products in range
        """
        try:
            # Validation: Convert and validate prices
            if min_price is not None:
                try:
                    min_price = float(min_price)
                    if min_price < 0:
                        return {
                            "success": False,
                            "error": "Minimum price cannot be negative",
                            "products": []
                        }
                except (ValueError, TypeError):
                    return {
                        "success": False,
                        "error": "Invalid minimum price",
                        "products": []
                    }
            else:
                min_price = 0  # Default: no minimum
            
            if max_price is not None:
                try:
                    max_price = float(max_price)
                    if max_price < 0:
                        return {
                            "success": False,
                            "error": "Maximum price cannot be negative",
                            "products": []
                        }
                except (ValueError, TypeError):
                    return {
                        "success": False,
                        "error": "Invalid maximum price",
                        "products": []
                    }
            else:
                max_price = float('inf')  # Default: no maximum
            
            # Business rule: min must be less than max
            if min_price > max_price:
                return {
                    "success": False,
                    "error": "Minimum price cannot be greater than maximum price",
                    "products": []
                }
            
            # Get filtered products from repository
            products = self.repo.get_products_by_price_range(
                min_price, 
                max_price,
                category
            )
            
            return {
                "success": True,
                "products": products,
                "count": len(products),
                "price_range": {
                    "min": min_price,
                    "max": max_price if max_price != float('inf') else None
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "products": []
            }
    
    
    def get_product_details(self, product_name: str, category: Optional[str] = None) -> Dict[str, any]:
        """
        Get detailed information about a specific product
        
        Args:
            product_name: Name of the product
            category: Optional category hint
        
        Returns:
            {
                "success": True,
                "product": {...product details...}
            }
        """
        try:
            # Validation
            if not product_name or not product_name.strip():
                return {
                    "success": False,
                    "error": "Product name is required"
                }
            
            product_name = product_name.strip()
            
            # Get from repository
            product = self.repo.get_product_by_name(product_name, category)
            
            if not product:
                return {
                    "success": False,
                    "error": f"Product '{product_name}' not found"
                }
            
            return {
                "success": True,
                "product": product
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
        
    def get_product_by_id(self, product_id: str) -> Dict[str, any]:
        """
        Get product by ID
        
        Args:
            product_id: Product ID (format: "category-index")
        
        Returns:
            {
                "success": True,
                "data": {...product...}
            }
        """
        try:
            # Validation
            if not product_id or not product_id.strip():
                return {
                    "success": False,
                    "error": "Product ID is required"
                }
            
            product_id = product_id.strip()
            
            # Get product from repository
            product = self.repo.get_product_by_id(product_id)
            
            if not product:
                return {
                    "success": False,
                    "error": f"Product with ID '{product_id}' not found"
                }
            
            return {
                "success": True,
                "data": product
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_statistics(self) -> Dict[str, any]:
        """
        Get product statistics
        
        Returns:
            {
                "success": True,
                "stats": {
                    "total_products": 10,
                    "by_category": {...},
                    "price_range": {...}
                }
            }
        
        Business Logic:
        - Count products
        - Calculate price ranges
        - Organize by category
        """
        try:
            # Get counts from repository
            counts = self.repo.count_products()
            
            # Calculate price statistics
            all_categories = self.repo.get_all_categories()
            all_prices = []
            
            for category in all_categories:
                for product in category.get('products', []):
                    price = product.get('price', 0)
                    all_prices.append(price)
            
            # Calculate price range
            price_stats = {
                "min": min(all_prices) if all_prices else 0,
                "max": max(all_prices) if all_prices else 0,
                "average": sum(all_prices) / len(all_prices) if all_prices else 0
            }
            
            return {
                "success": True,
                "stats": {
                    "total_products": counts.get('total', 0),
                    "by_category": counts.get('by_category', {}),
                    "price_range": price_stats
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }