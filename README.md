# VisionTech v2 - AI-Powered E-Commerce Platform


A modern, full-stack e-commerce platform for electronics with integrated AI product recommendations powered by Google Gemini.

**🌐 Live Demo:** [https://vision-tech-v2.vercel.app](https://vision-tech-v2.vercel.app)  
**📊 Backend API:** [https://visiontech-v2-backend.onrender.com/health](https://visiontech-v2-backend.onrender.com/health)

---

## 📋 Table of Contents

- [Screenshots](#screenshots)
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## 📸 Screenshots

### Homepage
![Homepage Hero](docs/screenshots/homepage-hero.png)
*Hero carousel featuring latest products*

### Product Browsing
![Products Page](docs/screenshots/products-page.png)
*Advanced filtering and search functionality*

### AI Shopping Assistant
![Chatbot](docs/screenshots/chatbot-demo.png)
*Gemini AI-powered product recommendations*

### Shopping Cart
![Shopping Cart](docs/screenshots/cart-page.png)
*Persistent cart with real-time updates*

---

## 🎯 Overview

VisionTech v2 is a complete rebuild of an electronics e-commerce platform, designed from the ground up with a focus on understanding full-stack architecture, clean code practices, and modern deployment workflows. The project emphasizes:

- **Layered Backend Architecture**: Repository → Service → Routes pattern for maintainable code
- **AI-Powered Recommendations**: Gemini AI chatbot that only recommends products from the database
- **Production-Ready Deployment**: Automated CI/CD with comprehensive testing
- **Modern React Frontend**: Context API for state management, responsive design

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Bootstrap 5** - UI components and grid system
- **Axios** - HTTP client for API requests
- **React Context API** - Global state management (shopping cart)
- **Jest & React Testing Library** - Unit and component testing

### Backend
- **Flask 3.0** - Python web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Google Gemini API** - AI chatbot integration
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - Production WSGI server
- **Pytest** - Backend API testing

### DevOps & Deployment
- **GitHub Actions** - CI/CD automation
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

---

## ✨ Features

### Customer-Facing
- **Product Browsing**: Filter by category, search, price range
- **Shopping Cart**: Add/remove items, persistent storage via localStorage
- **Product Details**: Detailed product pages with specifications
- **AI Shopping Assistant**: Gemini-powered chatbot for product recommendations
- **Responsive Design**: Mobile-first, works across all devices

### Technical
- **RESTful API**: 10 endpoints covering all product operations
- **AI Integration**: Real-time Gemini API integration with conversation history
- **Database-Aware AI**: Chatbot only recommends products actually in stock
- **Automated Testing**: 15 backend tests + 4 frontend tests
- **CI/CD Pipeline**: Tests must pass before deployment
- **Production Monitoring**: Health check endpoint

---

## 🏗 Architecture

### Backend: Layered Architecture

```
User Request
    ↓
┌─────────────────┐
│  ROUTES Layer   │  - HTTP endpoints, request validation
│  (API Blueprint)│  - Returns JSON responses
└────────┬────────┘
         ↓
┌─────────────────┐
│  SERVICE Layer  │  - Business logic & validation
│                 │  - Error handling
└────────┬────────┘
         ↓
┌─────────────────┐
│ REPOSITORY Layer│  - Raw database operations
│                 │  - MongoDB queries
└────────┬────────┘
         ↓
    MongoDB Atlas
```

**Why this architecture?**
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Can test each layer independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features or swap database

### Frontend: Component-Based

```
App (Router)
  ├── Navbar (Global)
  ├── HomePage
  │     ├── HeroCarousel
  │     ├── FeaturedProducts
  │     ├── DealsSection
  │     └── ExperienceSection
  ├── ProductsPage
  │     ├── ProductSidebar (filters)
  │     └── ProductCard (repeated)
  ├── ProductDetailPage
  └── CartPage
      └── CartContext (global state)
```

---

## 📁 Project Structure

```
VisionTech_REBUILD/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Flask app factory
│   │   ├── config.py                # Environment configurations
│   │   ├── repository.py            # Database operations
│   │   ├── services/
│   │   │   ├── product_service.py   # Product business logic
│   │   │   └── gemini_service.py    # AI chatbot service
│   │   └── api/
│   │       ├── products_routes.py   # Product API endpoints
│   │       └── chat_routes.py       # Chatbot API endpoints
│   ├── tests/
│   │   ├── conftest.py              # Test configuration
│   │   └── test_product_routes.py   # API endpoint tests
│   ├── requirements.txt             # Python dependencies
│   ├── run.py                       # Development server
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── images/                  # Product images
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   └── CartPage.js
│   │   ├── components/
│   │   │   ├── layout/Navbar.js
│   │   │   ├── product/ProductCard.js
│   │   │   └── chatbot/Chatbot.js
│   │   ├── context/
│   │   │   └── CartContext.js       # Global cart state
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   └── App.js                   # Main app component
│   ├── package.json                 # Node dependencies
│   └── vercel.json                  # Vercel deployment config
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions pipeline
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12+
- **MongoDB Atlas** account (free tier)
- **Google Gemini API** key

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/BhaveshNank/VisionTech-v2.git
cd VisionTech-v2
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=5001
EOF

# Seed database with sample products
python seed_database.py

# Run development server
python run.py
```

Backend runs on: `http://localhost:5001`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5001/api
EOF

# Run development server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🧪 Testing

### Backend Tests

**Run all tests:**
```bash
cd backend
pytest tests/ -v
```

**Run with coverage:**
```bash
pytest --cov=app tests/
```

**Test Coverage:**
- ✅ All product API endpoints (6 tests)
- ✅ All chatbot endpoints (5 tests)
- ✅ Error handling and validation (3 tests)
- ✅ Health check endpoint (1 test)

**Total: 15 tests**

### Frontend Tests

**Run all tests:**
```bash
cd frontend
npm test
```

**Test Coverage:**
- ✅ CartContext - add/remove items (2 tests)
- ✅ ProductCard component rendering (2 tests)

**Total: 4 tests**

### Key Testing Difference

**Backend Tests:**
- Make **real HTTP requests** to actual API endpoints
- Connect to **real MongoDB Atlas** database
- Test the **full stack**: Routes → Services → Repository → Database
- Use production-like environment

**Frontend Tests:**
- **Isolated component tests** - no real backend
- Use **mock data** instead of API calls
- Render components **in memory** (no browser)
- Fast execution, no network dependencies

This approach ensures backend reliability while keeping frontend tests fast and independent.

---

## 🔄 CI/CD Pipeline

### Workflow Overview

```
Developer pushes to main
         ↓
GitHub Actions triggered
         ↓
┌────────────────────────────┐
│   Run Backend Tests        │
│   - Install Python deps    │
│   - Lint with flake8       │
│   - Run pytest (15 tests)  │
└────────────┬───────────────┘
         ↓ (must pass)
┌────────────────────────────┐
│   Run Frontend Tests       │
│   - Install Node deps      │
│   - Run Jest (4 tests)     │
│   - Build production       │
└────────────┬───────────────┘
         ↓ (must pass)
┌────────────────────────────┐
│   Deploy (only if pass)    │
│   - Trigger Render hook    │
│   - Trigger Vercel hook    │
└────────────────────────────┘
         ↓
   Live Deployment
```

### Pipeline Features

- ✅ **Quality Gate**: Deployment blocked if any test fails
- ✅ **Automated**: No manual deployment steps
- ✅ **Fast**: Parallel test execution (~1-2 minutes)
- ✅ **Real Database**: Tests run against MongoDB Atlas
- ✅ **Branch Protection**: Only `main` branch deploys to production

### Configuration

The pipeline is defined in `.github/workflows/ci-cd.yml`:

```yaml
on:
  push:
    branches: [main]  # Only deploy from main
  pull_request:
    branches: [main]  # Run tests on PRs

jobs:
  backend-tests:  # Must pass
  frontend-tests: # Must pass
  deploy:         # Only runs if both above pass
```

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:5001/api`
- **Production:** `https://visiontech-v2-backend.onrender.com/api`

### Product Endpoints

#### Get All Products
```http
GET /api/products/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "phone",
      "products": [...]
    }
  ],
  "total_products": 33,
  "total_categories": 5
}
```

#### Search Products
```http
GET /api/products/search?q={query}
```

**Example:** `/api/products/search?q=iPhone`

**Response:**
```json
{
  "success": true,
  "results": [...],
  "count": 1,
  "search_term": "iPhone"
}
```

#### Filter Products
```http
GET /api/products/filter?category={cat}&min={price}&max={price}
```

**Example:** `/api/products/filter?category=phone&min=500&max=1500`

**Response:**
```json
{
  "success": true,
  "products": [...],
  "count": 17,
  "price_range": {
    "min": 500.0,
    "max": 1500.0
  }
}
```

### Chat Endpoints

#### Send Message to AI
```http
POST /api/chat/
Content-Type: application/json

{
  "message": "I need a gaming laptop under $2000"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on your budget, I recommend..."
}
```

#### Reset Conversation
```http
POST /api/chat/reset
```

#### Get Conversation History
```http
GET /api/chat/history
```

**Response:**
```json
{
  "success": true,
  "history": [
    {"role": "user", "message": "Hello"},
    {"role": "assistant", "message": "Hi! How can I help?"}
  ]
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "environment": "production",
  "database_connected": true
}
```

---

## 🌐 Deployment

### Production Architecture

```
User Browser
     ↓
Frontend (Vercel)
     ↓ HTTPS
Backend (Render) ← MongoDB Atlas
     ↓
Gemini API (Google)
```

### Deployment Process

**Automated via GitHub Actions:**

1. **Push to `main` branch**
2. **Tests run automatically**
3. **If all pass:**
   - Render deploys backend
   - Vercel deploys frontend
4. **If any fail:**
   - Deployment blocked
   - Developer notified

**Manual Deployment (if needed):**

**Backend (Render):**
- Dashboard → Manual Deploy

**Frontend (Vercel):**
- Dashboard → Redeploy

### Platform Configuration

**Render (Backend):**
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
- Auto-Deploy: After CI checks pass

**Vercel (Frontend):**
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Ignored Build Step: `exit 0` (deploy via hook only)

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/visiontech

# AI Service
GEMINI_API_KEY=your_gemini_api_key

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
PORT=5001

# CORS (production)
CORS_ORIGINS=https://vision-tech-v2.vercel.app
```

### Frontend (.env)

```bash
# API Configuration
REACT_APP_API_URL=https://visiontech-v2-backend.onrender.com/api
```

### GitHub Secrets (for CI/CD)

Required secrets in GitHub repository settings:

- `MONGODB_URI` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `RENDER_DEPLOY_HOOK` - Render deployment webhook URL
- `VERCEL_DEPLOY_HOOK` - Vercel deployment webhook URL

---

## 📊 Project Stats

- **Backend Routes:** 10 endpoints
- **Backend Tests:** 15 (14 passing, 1 skipped)
- **Frontend Components:** 11 reusable components
- **Frontend Tests:** 4 (all passing)
- **Total Products:** 33 across 5 categories
- **Test Coverage:** ~40% (backend), expanding
- **Deployment Time:** ~3-5 minutes (with tests)

---

## 🎓 Learning Objectives Achieved

This project demonstrates understanding of:

✅ **Full-Stack Development**: Complete frontend and backend integration  
✅ **Layered Architecture**: Repository, Service, Routes pattern  
✅ **State Management**: React Context API for global state  
✅ **RESTful API Design**: Proper HTTP methods, status codes, responses  
✅ **Database Design**: MongoDB schema and queries  
✅ **AI Integration**: Real-time API integration with conversation state  
✅ **Automated Testing**: Unit, integration, and component tests  
✅ **CI/CD Pipelines**: GitHub Actions with quality gates  
✅ **Production Deployment**: Multi-platform deployment strategy  
✅ **Environment Management**: Dev/test/prod configurations

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Bhavesh Nankani**
- Portfolio: [vscode-portfolio-rho.vercel.app](http://vscode-portfolio-rho.vercel.app)
- GitHub: [@BhaveshNank](https://github.com/BhaveshNank)
- Linkedin: [linkedin.com/in/bhavesh-nankani/](https://www.linkedin.com/in/bhavesh-nankani/)


---

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB Atlas for database hosting
- Vercel and Render for deployment platforms
- Bootstrap for UI components