"""
Database Seeding Script
=======================
This script loads product data from products.json into MongoDB.

Purpose:
- Populate database with initial product data
- Reset database to clean state during development
- Easy way to add new products

Usage:
    python seed_database.py
"""

import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def seed_database():
    """
    Main seeding function
    
    Steps:
    1. Connect to MongoDB
    2. Read products.json
    3. Clear existing data (fresh start)
    4. Insert new data
    5. Verify insertion
    """
    
    print("=" * 60)
    print("DATABASE SEEDING STARTED")
    print("=" * 60)
    
    # ============================================
    # STEP 1: Connect to MongoDB
    # ============================================
    try:
        # Get MongoDB URI from environment variables
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/visiontech_db')
        print(f"\n📡 Connecting to MongoDB...")
        print(f"   URI: {mongo_uri}")
        
        # Create MongoDB client
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected successfully!")
        
        # Get database name from URI
        # From: mongodb://localhost:27017/visiontech_db
        # Extract: visiontech_db
        db_name = mongo_uri.split('/')[-1].split('?')[0]
        db = client[db_name]
        
        # Get products collection
        # If collection doesn't exist, MongoDB creates it automatically
        collection = db['products']
        
        print(f"✅ Using database: {db_name}")
        print(f"✅ Using collection: products")
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        print("💡 Make sure MongoDB is running!")
        return
    
    # ============================================
    # STEP 2: Read products.json
    # ============================================
    try:
        # Get path to products.json
        # __file__ = current script path
        # os.path.dirname(__file__) = backend/ folder
        # os.path.join(..., 'data', 'products.json') = backend/data/products.json
        json_path = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
        
        print(f"\n📂 Reading products from: {json_path}")
        
        # Open and read JSON file
        with open(json_path, 'r') as file:
            products_data = json.load(file)
        
        print(f"✅ Loaded {len(products_data)} categories from JSON")
        
        # Count total products across all categories
        total_products = sum(len(category['products']) for category in products_data)
        print(f"✅ Total products to insert: {total_products}")
        
    except FileNotFoundError:
        print(f"❌ products.json not found at: {json_path}")
        print("💡 Make sure you created products.json in backend/data/")
        return
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in products.json")
        print("💡 Check your JSON syntax!")
        return
    except Exception as e:
        print(f"❌ Error reading products.json: {str(e)}")
        return
    
    # ============================================
    # STEP 3: Clear Existing Data
    # ============================================
    try:
        print(f"\n🗑️  Clearing existing data...")
        
        # Delete all documents in collection
        # This gives us a fresh start every time we seed
        result = collection.delete_many({})
        print(f"✅ Deleted {result.deleted_count} existing documents")
        
    except Exception as e:
        print(f"❌ Error clearing data: {str(e)}")
        return
    
    # ============================================
    # STEP 4: Insert New Data
    # ============================================
    try:
        print(f"\n📥 Inserting new data...")
        
        # Insert all category documents
        # insert_many() takes a list of documents
        result = collection.insert_many(products_data)
        
        print(f"✅ Inserted {len(result.inserted_ids)} categories")
        
    except Exception as e:
        print(f"❌ Error inserting data: {str(e)}")
        return
    
    # ============================================
    # STEP 5: Verify Insertion
    # ============================================
    try:
        print(f"\n🔍 Verifying data...")
        
        # Count documents in collection
        doc_count = collection.count_documents({})
        print(f"✅ Total documents in collection: {doc_count}")
        
        # Show summary of each category
        print(f"\n📊 Category Summary:")
        for category_doc in collection.find():
            category_name = category_doc['category']
            product_count = len(category_doc['products'])
            print(f"   - {category_name.capitalize()}: {product_count} products")
        
    except Exception as e:
        print(f"❌ Error verifying data: {str(e)}")
        return
    
    # ============================================
    # Success!
    # ============================================
    print("\n" + "=" * 60)
    print("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print(f"\n💡 You can now use the database in your Flask app!")
    
    # Close MongoDB connection
    client.close()


if __name__ == '__main__':
    """
    This block only runs when you execute: python seed_database.py
    Does NOT run when importing this module
    """
    seed_database()