# 📖 Quick Reference Guide - URL Shortener with Analytics

## 🎯 APP SUMMARY

**Application:** Trimly - URL Shortener with Analytics  
**Status:** Development Complete ✅ | Deployment Ready 🚀  
**Stack:** React 19 + Express.js + Supabase PostgreSQL

---

## ⚡ CORE FEATURES AT A GLANCE

### **✅ Implemented Features**

| Feature | Location | API Endpoint | Status |
|---------|----------|--------------|--------|
| User Registration | `/register` | `POST /api/auth/register` | ✅ |
| User Login | `/login` | `POST /api/auth/login` | ✅ |
| Shorten URLs | Dashboard | `POST /api/url/shorten` | ✅ |
| Custom Aliases | Dashboard | `POST /api/url/shorten` | ✅ |
| URL Expiration | Dashboard | `POST /api/url/shorten` | ✅ |
| Click Tracking | Redirect | `GET /:shortId` | ✅ |
| View Dashboard | `/dashboard` | `GET /api/url/` | ✅ |
| View Analytics | `/analytics/:shortId` | `GET /api/url/:shortId` | ✅ |
| Delete URL | Dashboard | `DELETE /api/url/:shortId` | ✅ |
| QR Code Gen | Analytics | Client-side (qrcode.react) | ✅ |
| Dark/Light Mode | Global | CSS Variables | ✅ |
| Responsive Design | All Pages | CSS Grid/Flexbox | ✅ |

---

## 📁 PROJECT STRUCTURE

```
URL-Shortener-with-Analytics/
│
├── backend/                          # Express.js Backend
│   ├── index.js                      # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── routes/
│   │   ├── auth.js                   # Auth endpoints
│   │   ├── url.js                    # URL management endpoints
│   │   └── index.js                  # Redirect endpoint
│   │
│   ├── middleware/
│   │   └── auth.js                   # JWT verification
│   │
│   ├── models/
│   │   ├── User.js                   # User model (Mongoose)
│   │   └── Url.js                    # URL model (Mongoose)
│   │
│   └── utils/
│       └── supabase.js               # Supabase client
│
├── frontend/                         # React + Vite Frontend
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── index.html                    # HTML entry point
│   ├── .env                          # Frontend environment
│   │
│   ├── src/
│   │   ├── main.jsx                  # React entry
│   │   ├── App.jsx                   # Root component
│   │   ├── App.css                   # Global styles
│   │   ├── index.css                 # Global CSS
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Sign up page
│   │   │   ├── Dashboard.jsx         # URL management
│   │   │   └── Analytics.jsx         # URL analytics
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation
│   │   │   └── ProtectedRoute.jsx    # Auth guard
│   │   │
│   │   └── context/
│   │       └── AuthContext.jsx       # Auth state
│   │
│   └── public/                       # Static files
│
├── package.json                      # Root package.json
└── APP_BUILD_WORKFLOW.md             # This document!

```

---

## 🔑 KEY TECHNOLOGIES

### **Frontend**
- React 19
- Vite (build tool)
- React Router v7
- Axios (HTTP client)
- Recharts (charting)
- qrcode.react (QR codes)
- react-hot-toast (notifications)
- React Hook Form (forms)
- Lucide React (icons)

### **Backend**
- Express.js v5
- Node.js
- JWT (authentication)
- bcryptjs (password hashing)
- nanoid (ID generation)
- cors (cross-origin)
- morgan (logging)

### **Database & Services**
- Supabase PostgreSQL
- Supabase Authentication (ready)
- Supabase Real-time (ready)

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────┐
│              USER ACTION FLOWS                       │
└─────────────────────────────────────────────────────┘

FLOW 1: USER REGISTRATION
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│ Register     │  ──→ │ POST /api/   │  ──→ │ Store in       │
│ Form         │      │ auth/        │      │ Supabase       │
│              │      │ register     │      │ Hash Password  │
│              │      │              │      │                │
│              │  ←── │ Return JWT   │  ←── │ Generate Token │
│              │      │ & User Info  │      │ (7 days)       │
└──────────────┘      └──────────────┘      └────────────────┘
      │
      └── Save token in localStorage
      └── Redirect to Dashboard

FLOW 2: SHORTEN A URL
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│ Enter URL    │  ──→ │ POST /api/   │  ──→ │ Generate       │
│ + Optional   │      │ url/shorten  │      │ Short ID or    │
│ Custom Alias │      │ (with JWT)   │      │ Validate Alias │
│              │      │              │      │                │
│              │  ←── │ Return       │  ←── │ Store in DB    │
│              │      │ Short URL    │      │ Link to User   │
│              │      │ Details      │      │                │
└──────────────┘      └──────────────┘      └────────────────┘
      │
      └── Display short link
      └── Show copy/QR options

FLOW 3: CLICK ON SHORTENED URL
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│ User clicks  │  ──→ │ GET /:       │  ──→ │ Increment      │
│ short link   │      │ shortId      │      │ Click Counter  │
│              │      │              │      │                │
│              │      │              │      │ Log Click Data │
│              │  ←── │ Redirect     │  ←── │ (IP, User-     │
│              │      │ to Original  │      │ Agent, etc.)   │
└──────────────┘      └──────────────┘      └────────────────┘
      │
      └── Browser shows original URL

FLOW 4: VIEW ANALYTICS
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│ Click "View  │  ──→ │ GET /api/    │  ──→ │ Fetch URL      │
│ Analytics"   │      │ url/:        │      │ Details +      │
│              │      │ shortId      │      │ All Click Data │
│              │      │              │      │                │
│              │  ←── │ Return JSON  │  ←── │ Process for    │
│              │      │ with Stats   │      │ Visualization  │
│              │      │              │      │                │
│ Display      │      │              │      │                │
│ Charts &     │      │              │      │                │
│ Click Table  │      │              │      │                │
└──────────────┘      └──────────────┘      └────────────────┘
```

---

## 🚀 QUICK START COMMANDS

### **Initial Setup**
```bash
# Clone and install
git clone <repo-url>
cd URL-Shortener-with-Analytics
npm install

# Setup backend
cd backend
npm install
# Create .env file with Supabase credentials
npm run dev

# In another terminal, setup frontend
cd frontend
npm install
# Create .env file if needed
npm run dev
```

### **Development Commands**

**Backend:**
```bash
cd backend
npm run dev          # Start with auto-reload (nodemon)
npm start            # Production mode
npm test             # Run tests (when added)
```

**Frontend:**
```bash
cd frontend
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run lint         # Check code quality
npm run preview      # Preview production build
```

**Root Level:**
```bash
npm install          # Install all dependencies
npm run build        # Build React frontend
npm start            # Start Express backend
```

---

## 🔐 AUTHENTICATION FLOW

```
Browser                    Backend                   Database
   │                          │                         │
   ├─ Submit Login ─────────→ │                         │
   │                          │                         │
   │                          ├─ Hash provided password │
   │                          │                         │
   │                          ├─ Compare with DB hash   │
   │                          │                         │
   │                          ├─────────────────────→ Check
   │                          │                         │
   │                          │ ←───────────────────  User OK
   │                          │                         │
   │                          ├─ Generate JWT token    │
   │                          │   (exp: now + 7 days)  │
   │                          │                         │
   │ ← JWT Token + User Info ─┤                         │
   │                          │                         │
   ├─ Store token in          │                         │
   │  localStorage            │                         │
   │                          │                         │
   ├─ Add to every request ──→ │ Verify JWT             │
   │  (Authorization header)  │  Extract user ID       │
   │                          │                         │
   │                          ├─ Allow/Deny request   │
```

---

## 🔗 API ENDPOINTS QUICK REFERENCE

### **Authentication**
```
POST   /api/auth/register      # Create new account
POST   /api/auth/login         # Login & get JWT
```

### **URL Management**
```
POST   /api/url/shorten        # Create shortened URL
GET    /api/url/               # List all user URLs
GET    /api/url/:shortId       # Get URL details
DELETE /api/url/:shortId       # Delete a URL
```

### **Redirect**
```
GET    /:shortId               # Redirect to original URL
                               # (public, no auth needed)
```

---

## 💾 DATABASE SCHEMA QUICK VIEW

### **users table**
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
password (VARCHAR, hashed)
created_at (TIMESTAMP)
is_active (BOOLEAN)
```

### **urls table**
```sql
id (UUID, PK)
user_id (UUID, FK)
short_id (VARCHAR, UNIQUE)
original_url (TEXT)
clicks (INTEGER)
created_at (TIMESTAMP)
expires_at (TIMESTAMP, nullable)
```

### **clicks table** (Detailed analytics)
```sql
id (UUID, PK)
url_id (UUID, FK)
ip_address (VARCHAR)
user_agent (TEXT)
referrer (VARCHAR)
clicked_at (TIMESTAMP)
```

---

## 🛠️ ENVIRONMENT VARIABLES REQUIRED

### **Backend (.env)**
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=xxxxx

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### **Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🎯 DEVELOPMENT CHECKLIST

### **Before Going to Production**
- [ ] All features tested locally
- [ ] Environment variables set correctly
- [ ] Database migrations complete
- [ ] Backend error handling implemented
- [ ] Frontend form validation working
- [ ] Responsive design verified
- [ ] Security audit performed
- [ ] Rate limiting considered
- [ ] Logging & monitoring setup
- [ ] Backup strategy documented

### **Deployment Checklist**
- [ ] Frontend build passes (`npm run build`)
- [ ] Backend tests pass (when added)
- [ ] All API endpoints tested
- [ ] Database indexed properly
- [ ] SSL certificates ready
- [ ] Monitoring tools configured
- [ ] Error tracking setup (Sentry/etc)
- [ ] Analytics implemented

---

## 📈 ANALYTICS METRICS TRACKED

Each time a shortened URL is clicked:
- ✅ Click count incremented
- ✅ Timestamp recorded
- ✅ IP address captured
- ✅ User agent logged
- ✅ Referrer stored (if available)

**Displayed in Dashboard:**
- Total clicks per URL
- Click timeline (Recharts)
- Recent clicks table
- URL creation date
- Expiration status

---

## 🚨 COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| JWT expired | Token older than 7 days | User must log in again |
| CORS error | Backend not allowing frontend origin | Check `cors` config in index.js |
| 404 on short URL | URL expired or not found | Check `expires_at` in database |
| Click not incrementing | Request not reaching backend | Check redirect URL format |
| Alias already taken | Custom alias used elsewhere | Choose different alias |

---

## 📚 DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| `APP_BUILD_WORKFLOW.md` | Complete build workflow & planning |
| `deployment_guide.md` | Deployment instructions |
| `package.json` | Dependencies & scripts |
| `README.md` | Project overview |

---

## 🔄 DEVELOPMENT WORKFLOW

### **Daily Development**
1. Pull latest code
2. `npm install` (if dependencies changed)
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm run dev`
5. Test features locally
6. Commit changes

### **Before Commit**
```bash
# Backend
cd backend
npm test          # Run tests

# Frontend
cd frontend
npm run lint      # Check code quality
npm run build     # Verify production build
```

### **Deployment**
```bash
# Build everything
npm run build

# Test production build locally
npm start

# Push to GitHub
git push origin main

# Platform auto-deploys from main branch
```

---

## 🎓 LEARNING RESOURCES

### **For This Project**
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [JWT Guide](https://jwt.io/introduction)
- [Vite Guide](https://vitejs.dev/guide/)

### **Related Topics**
- URL shortening algorithms
- Analytics & tracking
- Full-stack web development
- RESTful API design
- Database design & optimization

---

## 👥 TEAM & SUPPORT

**Developer:** Nandha Kumar  
**GitHub:** https://github.com/Nandha-kumar07  
**Portfolio:** Check GitHub profile  

---

## 📅 PROJECT TIMELINE

| Phase | Status | Completion | Target Date |
|-------|--------|-----------|------------|
| Planning & Design | ✅ | 100% | May 1, 2026 |
| Backend Development | ✅ | 100% | May 10, 2026 |
| Frontend Development | ✅ | 100% | May 15, 2026 |
| Integration & Testing | ✅ | 100% | May 18, 2026 |
| Deployment Prep | ✅ | 100% | May 20, 2026 |
| Production Deployment | ⏳ | 0% | May 25, 2026 |
| Post-launch Monitoring | ⏳ | 0% | June 2026+ |

---

**Last Updated:** May 20, 2026  
**Maintained by:** Nandha Kumar  

