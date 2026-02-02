"""
Repository Test Script
======================
Simple script to test if ProductRepository works correctly.

Usage:
    python test_repository.py
"""

from app.repository import ProductRepository
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("=" * 60)
print("TESTING PRODUCT REPOSITORY")
print("=" * 60)

# Connect to MongoDB
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/visiontech_db')
client = MongoClient(mongo_uri)
db_name = mongo_uri.split('/')[-1].split('?')[0]
db = client[db_name]

# Create repository instance
repo = ProductRepository(db)

# TEST 1: Get all categories
print("\n📦 TEST 1: Get all categories")
categories = repo.get_all_categories()
print(f"✅ Found {len(categories)} categories")
for cat in categories:
    print(f"   - {cat['category']}: {len(cat['products'])} products")

# TEST 2: Get phones
print("\n📱 TEST 2: Get products in 'phone' category")
phones = repo.get_products_by_category("phone")
if phones:
    print(f"✅ Found {len(phones['products'])} phones:")
    for phone in phones['products']:
        print(f"   - {phone['name']} (${phone['price']})")
else:
    print("❌ No phones found")

# TEST 3: Search for specific product
print("\n🔍 TEST 3: Find 'iPhone 16 Pro Max'")
iphone = repo.get_product_by_name("iPhone 16 Pro Max", "phone")
if iphone:
    print(f"✅ Found: {iphone['name']}")
    print(f"   Brand: {iphone['brand']}")
    print(f"   Price: ${iphone['price']}")
else:
    print("❌ iPhone not found")

# TEST 4: Search by keyword
print("\n🔎 TEST 4: Search for 'Apple'")
apple_products = repo.search_products("Apple")
print(f"✅ Found {len(apple_products)} Apple products:")
for product in apple_products:
    print(f"   - {product['name']} ({product['category']})")

# TEST 5: Price range
print("\n💰 TEST 5: Products between $500-$1000")
affordable = repo.get_products_by_price_range(500, 1000)
print(f"✅ Found {len(affordable)} products:")
for product in affordable:
    print(f"   - {product['name']} (${product['price']})")

# TEST 6: Count products
print("\n📊 TEST 6: Product statistics")
stats = repo.count_products()
print(f"✅ Total products: {stats['total']}")
print("   By category:")
for category, count in stats['by_category'].items():
    print(f"   - {category}: {count}")

print("\n" + "=" * 60)
print("✅ ALL TESTS COMPLETED!")
print("=" * 60)

# Close connection
client.close()