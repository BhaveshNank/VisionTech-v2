"""
Service Layer Test Script
=========================
Tests ProductService to verify business logic works correctly.

Usage:
    python test_service.py
"""

from app.services.product_service import ProductService
from app.repository import ProductRepository
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("=" * 60)
print("TESTING PRODUCT SERVICE")
print("=" * 60)

# Setup: Connect to MongoDB and create service
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/visiontech_db')
client = MongoClient(mongo_uri)
db_name = mongo_uri.split('/')[-1].split('?')[0]
db = client[db_name]

# Create repository
repo = ProductRepository(db)

# Create service (with repository)
service = ProductService(repo)

# TEST 1: Get all products
print("\n📦 TEST 1: Get all products")
result = service.get_all_products()
if result['success']:
    print(f"✅ Success!")
    print(f"   Total products: {result['total_products']}")
    print(f"   Total categories: {result['total_categories']}")
else:
    print(f"❌ Failed: {result.get('error')}")

# TEST 2: Get products by category (valid)
print("\n📱 TEST 2: Get products in 'phone' category")
result = service.get_products_by_category("phone")
if result['success']:
    print(f"✅ Success!")
    print(f"   Category: {result['category']}")
    print(f"   Products found: {result['count']}")
    for product in result['products']:
        print(f"   - {product['name']} (${product['price']})")
else:
    print(f"❌ Failed: {result.get('error')}")

# TEST 3: Get products by category (invalid - empty string)
print("\n🚫 TEST 3: Get products with empty category (should fail)")
result = service.get_products_by_category("")
if result['success']:
    print(f"❌ Should have failed but succeeded!")
else:
    print(f"✅ Correctly rejected!")
    print(f"   Error message: {result['error']}")

# TEST 4: Get products by category (invalid - doesn't exist)
print("\n🚫 TEST 4: Get products from non-existent category")
result = service.get_products_by_category("unicorns")
if result['success']:
    print(f"❌ Should have failed but succeeded!")
else:
    print(f"✅ Correctly rejected!")
    print(f"   Error message: {result['error']}")

# TEST 5: Search products (valid)
print("\n🔍 TEST 5: Search for 'Apple' products")
result = service.search_products("Apple")
if result['success']:
    print(f"✅ Success!")
    print(f"   Found {result['count']} products:")
    for product in result['results']:
        print(f"   - {product['name']} ({product['category']})")
else:
    print(f"❌ Failed: {result.get('error')}")

# TEST 6: Search products (invalid - too short)
print("\n🚫 TEST 6: Search with single character (should fail)")
result = service.search_products("a")
if result['success']:
    print(f"❌ Should have failed but succeeded!")
else:
    print(f"✅ Correctly rejected!")
    print(f"   Error message: {result['error']}")

# TEST 7: Filter by price range (valid)
print("\n💰 TEST 7: Filter products between $500-$1000")
result = service.filter_by_price(min_price=500, max_price=1000)
if result['success']:
    print(f"✅ Success!")
    print(f"   Found {result['count']} products:")
    for product in result['products']:
        print(f"   - {product['name']} (${product['price']})")
else:
    print(f"❌ Failed: {result.get('error')}")

# TEST 8: Filter by price range (invalid - min > max)
print("\n🚫 TEST 8: Filter with min_price > max_price (should fail)")
result = service.filter_by_price(min_price=1000, max_price=500)
if result['success']:
    print(f"❌ Should have failed but succeeded!")
else:
    print(f"✅ Correctly rejected!")
    print(f"   Error message: {result['error']}")

# TEST 9: Filter by price range (invalid - negative price)
print("\n🚫 TEST 9: Filter with negative price (should fail)")
result = service.filter_by_price(min_price=-100, max_price=500)
if result['success']:
    print(f"❌ Should have failed but succeeded!")
else:
    print(f"✅ Correctly rejected!")
    print(f"   Error message: {result['error']}")

# TEST 10: Get product details
print("\n📄 TEST 10: Get details for 'iPhone 16 Pro Max'")
result = service.get_product_details("iPhone 16 Pro Max", "phone")
if result['success']:
    print(f"✅ Success!")
    product = result['product']
    print(f"   Name: {product['name']}")
    print(f"   Brand: {product['brand']}")
    print(f"   Price: ${product['price']}")
    print(f"   Category: {product['category']}")
else:
    print(f"❌ Failed: {result.get('error')}")

# TEST 11: Get statistics
print("\n📊 TEST 11: Get product statistics")
result = service.get_statistics()
if result['success']:
    print(f"✅ Success!")
    stats = result['stats']
    print(f"   Total products: {stats['total_products']}")
    print(f"   By category:")
    for category, count in stats['by_category'].items():
        print(f"     - {category}: {count}")
    print(f"   Price range:")
    print(f"     - Min: ${stats['price_range']['min']}")
    print(f"     - Max: ${stats['price_range']['max']}")
    print(f"     - Average: ${stats['price_range']['average']:.2f}")
else:
    print(f"❌ Failed: {result.get('error')}")

print("\n" + "=" * 60)
print("✅ ALL SERVICE TESTS COMPLETED!")
print("=" * 60)
print("\n💡 Notice how service handles validation and errors gracefully!")
print("💡 All responses have consistent format: {success, data/error}")

# Close connection
client.close()