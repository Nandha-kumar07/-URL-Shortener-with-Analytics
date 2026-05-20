# 🔗 Trimly — URL Shortener with Analytics

> A full-stack, production-grade URL shortening service with real-time click analytics, QR code generation, link expiration, and a stunning glassmorphism UI — deployed live on AWS EC2.

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![AWS EC2](https://img.shields.io/badge/AWS-EC2-orange?style=for-the-badge&logo=amazon-aws)
![License](https://img.shields.io/badge/License-ISC-lightgrey?style=for-the-badge)

**🌐 Live Demo:** [http://13.204.81.142](http://13.204.81.142)  
**🎬 YouTube Demo:** [https://youtu.be/2QJ7A7Ojm_U?si=lltnioezqNwG1Egc](https://youtu.be/2QJ7A7Ojm_U?si=lltnioezqNwG1Egc)

</div>

---

## 📋 Table of Contents

- [Planning the App](#-planning-the-app)
- [Features](#-features)
- [Architecture Diagram](#-architecture-diagram)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Setup Instructions](#-setup-instructions)
- [AWS EC2 Deployment](#-aws-ec2-deployment)
- [Assumptions Made](#-assumptions-made)
- [Sample Output](#-sample-output)
- [AI Planning Document](#-ai-planning-document)

---

## 🎯 Planning the App

### Problem Statement
Long URLs are hard to share, track, and manage. Existing solutions are either paid, lack analytics, or don't provide custom branding. The goal was to build a free, self-hostable, full-stack URL shortener that also gives deep insight into link performance.

### Planning Phases

| Phase | Goal | Status |
|-------|------|--------|
| 1 | Define core features and user stories | ✅ Done |
| 2 | Design database schema (Supabase/PostgreSQL) | ✅ Done |
| 3 | Build REST API with Node.js + Express | ✅ Done |
| 4 | Build React frontend with glassmorphism UI | ✅ Done |
| 5 | Implement auth (JWT), analytics, QR codes | ✅ Done |
| 6 | Deploy on AWS EC2 (single-server, full-stack) | ✅ Done |

### User Stories
- **As a user**, I can register/log in with email and password.
- **As a user**, I can shorten any valid URL with one click.
- **As a user**, I can set a custom alias (e.g., `trimly/my-campaign`).
- **As a user**, I can set an expiry date on a link so it auto-deactivates.
- **As a user**, I can view click statistics and visit history for every link I create.
- **As a user**, I can generate and scan a QR code for any short link.
- **As a user**, I can copy, open, or delete my short links from a dashboard.

---

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** — Stateless, secure tokens stored in `localStorage`.
- **User Registration** with email + password (bcryptjs hashing, salt rounds = 10).
- **User Login** with credential validation.
- **Protected Routes** — Dashboard and analytics are accessible only to logged-in users.
- **Persistent Sessions** — Tokens are validated on page refresh via `/api/auth/me`.

### 🔗 URL Shortening
- **Instant URL shortening** — Converts any valid URL into an 8-character nanoid short code.
- **Custom Alias** — Users can define their own memorable slug (e.g., `trimly/sale2026`).
- **Alias conflict detection** — Prevents duplicate short IDs.
- **URL format validation** — Both client-side (regex) and server-side (`new URL()`) checks.

### ⏰ Link Expiration
- **Optional expiry date** — Users can pick a date after which the link becomes inactive.
- **Server-side expiry enforcement** — On redirect, the backend checks `expires_at` and returns HTTP 410 Gone with a styled error page if expired.
- **Expiry display** — Dashboard shows the expiry date on each card in red.

### 📊 Analytics
- **Total click counter** — Tracks lifetime clicks per URL.
- **Visit history log** — Records every redirect with timestamp, IP address, and User-Agent.
- **Last 7 days line chart** — Visual click trend using Recharts, grouped by day.
- **Recent visits table** — Displays up to 50 of the latest visits with date, IP, and browser info.

### 📱 QR Code Generation
- **Auto-generated QR codes** — Every short URL gets an auto-rendered QR code on its analytics page.
- **Scannable & downloadable** — Rendered on an HTML canvas via `qrcode.react`.

### 🎨 UI/UX
- **Midnight Ocean glassmorphism theme** — Dark deep-navy background with frosted-glass cards.
- **Fully responsive** — Works seamlessly on mobile, tablet, and desktop.
- **Toast notifications** — Real-time success/error feedback via `react-hot-toast`.
- **Loading states** — Animated spinners during async operations.
- **One-click copy** — Copies the full short URL to clipboard with a single button.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       AWS EC2 Instance                       │
│                  (Ubuntu, t2.micro / t3.small)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Node.js / Express Server (Port 5000)     │   │
│  │                                                       │   │
│  │   ┌─────────────┐   ┌──────────────┐                │   │
│  │   │  Static      │   │  REST API    │                │   │
│  │   │  File Server │   │  Routes      │                │   │
│  │   │  /dist       │   │              │                │   │
│  │   └──────┬───────┘   └──────┬───────┘               │   │
│  │          │                  │                        │   │
│  │          │         ┌────────▼──────────┐             │   │
│  │          │         │  /api/auth        │             │   │
│  │          │         │  /api/url         │             │   │
│  │          │         │  /:shortId        │             │   │
│  │          │         └────────┬──────────┘             │   │
│  └──────────┼──────────────────┼────────────────────────┘   │
│             │                  │                             │
└─────────────┼──────────────────┼─────────────────────────────┘
              │                  │
              ▼                  ▼
   ┌──────────────────┐   ┌──────────────────────────┐
   │   React (Vite)   │   │   Supabase (PostgreSQL)  │
   │   Built to /dist │   │                          │
   │                  │   │  ┌──────┐  ┌──────────┐ │
   │  Pages:          │   │  │users │  │  urls    │ │
   │  - Home          │   │  └──────┘  └──────────┘ │
   │  - Login         │   │           ┌──────────┐  │
   │  - Register      │   │           │  visits  │  │
   │  - Dashboard     │   │           └──────────┘  │
   │  - Analytics     │   └──────────────────────────┘
   └──────────────────┘

   Browser ──HTTP──▶ EC2:80 (port 5000 via pm2)
                   └──▶ Static React App
                   └──▶ API calls → Supabase
                   └──▶ /:shortId → redirect
```

### Data Flow

```
User clicks short link
        │
        ▼
Express GET /:shortId
        │
        ├─ Lookup in Supabase urls table
        ├─ Check expires_at
        ├─ Increment clicks counter
        ├─ Insert row in visits table (IP, UserAgent, timestamp)
        └─ HTTP 302 Redirect → originalUrl
```

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | HTTP server & routing |
| `@supabase/supabase-js` | ^2.106.0 | PostgreSQL database client |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT auth tokens |
| `express-validator` | ^7.3.2 | Request body validation |
| `nanoid` | ^5.1.11 | Unique short ID generation |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `morgan` | ^1.10.1 | HTTP request logging |
| `dotenv` | ^17.4.2 | Environment variable management |
| `ws` | ^8.18.0 | WebSocket polyfill for Supabase |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.6 | UI framework |
| `react-router-dom` | ^7.15.1 | Client-side routing |
| `axios` | ^1.16.1 | HTTP client |
| `react-hook-form` | ^7.76.0 | Form state & validation |
| `recharts` | ^3.8.1 | Click analytics charts |
| `qrcode.react` | ^4.2.0 | QR code canvas rendering |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `lucide-react` | ^1.16.0 | Icon library |
| `date-fns` | ^4.2.0 | Date formatting & calculation |
| `vite` | ^8.0.12 | Build tool & dev server |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **AWS EC2** | Production server hosting (Ubuntu) |
| **Supabase** | Managed PostgreSQL database |
| **PM2** | Node.js process manager (keep-alive) |

---

## 📁 Project Structure

```
📦 -URL-Shortener-with-Analytics/
├── 📂 backend/
│   ├── 📂 middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── 📂 models/               # (Legacy, Supabase handles schema)
│   ├── 📂 routes/
│   │   ├── auth.js              # POST /register, POST /login, GET /me
│   │   ├── url.js               # POST /shorten, GET /, GET /:id/analytics, DELETE /:id
│   │   └── index.js             # GET /:shortId → redirect handler
│   ├── 📂 utils/
│   │   └── supabase.js          # Supabase client singleton
│   ├── .env                     # Backend environment variables (not committed)
│   ├── index.js                 # Express app entry point
│   └── package.json
│
├── 📂 frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   └── ProtectedRoute.jsx # Auth guard wrapper
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx  # Global auth state (login, logout, register)
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Register.jsx     # Register form
│   │   │   ├── Dashboard.jsx    # URL management & shortener form
│   │   │   └── Analytics.jsx    # Per-URL analytics, chart, QR code
│   │   ├── App.jsx              # Root component with routes
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Global Midnight Ocean theme
│   ├── .env                     # Frontend environment variables (not committed)
│   ├── vite.config.js           # Vite config with API proxy
│   └── package.json
│
├── .gitignore
├── deployment_guide.md
└── README.md                    # ← You are here
```

---

## 🗄️ Database Schema

The database is hosted on **Supabase (PostgreSQL)**. Three tables are used:

### `users`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, auto-generated |
| `email` | `text` | Unique, lowercase |
| `password` | `text` | bcrypt hashed |
| `created_at` | `timestamptz` | Auto-set by Supabase |

### `urls`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `users.id` |
| `original_url` | `text` | The full destination URL |
| `short_id` | `text` | Unique 8-char or custom alias |
| `clicks` | `int8` | Lifetime click counter, default 0 |
| `created_at` | `timestamptz` | Auto-set |
| `expires_at` | `timestamptz` | Nullable — link expiry date |

### `visits`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `url_id` | `uuid` | Foreign key → `urls.id` |
| `timestamp` | `timestamptz` | Visit time |
| `ip` | `text` | Visitor IP (from headers) |
| `user_agent` | `text` | Browser/device string |

---

## 📡 API Reference

**Base URL:** `http://13.204.81.142/api`  
**Auth header:** `x-auth-token: <JWT>`

### Auth Routes

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | `{ email, password }` | Register new user, returns JWT |
| `POST` | `/auth/login` | `{ email, password }` | Login, returns JWT |
| `GET` | `/auth/me` | — | Get current user (auth required) |

### URL Routes

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/url/shorten` | `{ originalUrl, customAlias?, expiresAt? }` | Create short URL |
| `GET` | `/url` | — | Get all URLs for logged-in user |
| `GET` | `/url/:shortId/analytics` | — | Get click stats + visit history |
| `DELETE` | `/url/:shortId` | — | Delete a short URL and its visits |

### Redirect Route

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/:shortId` | Logs visit, checks expiry, redirects to original URL |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js `>= 18.x`
- npm `>= 9.x`
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Nandha-kumar07/-URL-Shortener-with-Analytics.git
cd -URL-Shortener-with-Analytics
```

### 2. Set Up Supabase Database

Log into [supabase.com](https://supabase.com), create a new project, then run the following SQL in the **SQL Editor**:

```sql
-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- URLs table
CREATE TABLE urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  original_url text NOT NULL,
  short_id text UNIQUE NOT NULL,
  clicks bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Visits table
CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid REFERENCES urls(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  ip text,
  user_agent text
);
```

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env   # or create manually
```

Edit `backend/.env`:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Use the **Service Role Key** (not anon key) from Supabase → Settings → API.

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Configure Frontend Environment

```bash
cd ../frontend
```

Create `frontend/.env`:

```env
VITE_API_URL=/api
VITE_BACKEND_URL=http://localhost:5000
```

> In development, Vite proxies `/api` to `localhost:5000` via `vite.config.js`.

### 6. Install Frontend Dependencies

```bash
npm install
```

### 7. Run Locally (Development)

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 8. Build for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

The Express server automatically serves `frontend/dist` in production.

---

## ☁️ AWS EC2 Deployment

The application is deployed as a **single-server full-stack setup** on AWS EC2.

### Instance Details
- **AMI:** Ubuntu 22.04 LTS
- **Type:** t2.micro (Free Tier) / t3.small
- **Security Group Ports:** 22 (SSH), 80 (HTTP), 5000 (Node.js)
- **Live URL:** [http://13.204.81.142](http://13.204.81.142)

### Deployment Steps

```bash
# 1. SSH into EC2
ssh -i "Nandha.pem" ubuntu@13.204.81.142

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone repo
git clone https://github.com/Nandha-kumar07/-URL-Shortener-with-Analytics.git
cd -URL-Shortener-with-Analytics

# 5. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 6. Build frontend
npm run build

# 7. Set environment variables in backend/.env

# 8. Start with PM2
cd ../backend
pm2 start index.js --name "trimly"
pm2 save
pm2 startup

# 9. Allow port 80 (optional iptables redirect)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 5000
```

---

## 📐 Assumptions Made

1. **Single-server deployment** — Both the React frontend (served as static files) and Node.js backend run on the same EC2 instance on port 5000. No Nginx reverse proxy is used; port 80 is redirected to 5000 via `iptables`.

2. **Supabase as the database** — PostgreSQL is managed externally by Supabase (free tier). Row-Level Security (RLS) is **disabled** since the backend uses the Service Role key and handles authorization in Express middleware.

3. **No email verification** — User registration is instant with email + password only. Email OTP or verification flows were out of scope for this version.

4. **Analytics are session-independent** — Every HTTP redirect to `/:shortId` is counted as a click, regardless of whether it's a repeat visit from the same IP. No deduplication or session cookie logic is applied.

5. **IP address tracking** — Visitor IPs are captured from `x-forwarded-for` headers or `req.socket.remoteAddress`. Behind AWS, this may sometimes show the EC2 internal IP or proxy address rather than the exact client IP.

6. **No HTTPS / SSL** — The deployment runs on plain HTTP (port 80/5000). For production hardening, an SSL certificate via Certbot + Nginx would be recommended.

7. **JWT stored in localStorage** — This is standard for SPAs but is noted as a known XSS trade-off vs. `httpOnly` cookies. Acceptable for a hackathon context.

8. **Custom aliases are case-sensitive** — `My-Link` and `my-link` are treated as two different aliases.

9. **Visit history capped at 100** — The analytics API returns the latest 100 visits per URL to prevent oversized payloads.

10. **nanoid ESM module** — Since the backend uses `"type": "commonjs"`, `nanoid` (ESM-only in v5) is dynamically imported using `import()` to maintain compatibility.

---

## 📸 Sample Output

### Server Logs (PM2 / Morgan)
```
Supabase connected successfully!
Server running on port 5000
POST /api/auth/register 200 142ms
POST /api/auth/login 200 98ms
POST /api/url/shorten 200 201ms
GET /api/url 200 87ms
GET /abc12345 302 54ms  ← Redirect happened
GET /api/url/abc12345/analytics 200 113ms
DELETE /api/url/abc12345 200 145ms
```

### DB Entry — `urls` table (Supabase)
```json
{
  "id": "f3a2bc10-...",
  "user_id": "e1d9fa01-...",
  "original_url": "https://example.com/very/long/path?query=value",
  "short_id": "abc12345",
  "clicks": 14,
  "created_at": "2026-05-19T10:23:00Z",
  "expires_at": "2026-06-01T00:00:00Z"
}
```

### DB Entry — `visits` table (Supabase)
```json
{
  "id": "99b4e1c2-...",
  "url_id": "f3a2bc10-...",
  "timestamp": "2026-05-19T14:35:22Z",
  "ip": "103.45.21.7",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

---

## 🤖 AI Planning Document

### AI Tools Used
- **Antigravity (Google DeepMind)** — Primary code generation assistant used for scaffolding the full-stack architecture, debugging, Supabase migration from MongoDB, UI design, and deployment configuration.
- **AI-assisted planning** followed a structured workflow:

### AI Workflow Steps

#### Step 1: Define & Plan
Prompted the AI with the full problem statement, desired features, and tech constraints. The AI produced a feature list, folder structure, and database schema before writing any code.

#### Step 2: Backend Scaffolding
AI generated:
- Express server with CORS, morgan, dotenv
- Auth routes (register/login/me) with bcryptjs + JWT
- URL routes (shorten, list, analytics, delete)
- Redirect handler with expiry checking and visit logging
- Supabase singleton client with WebSocket polyfill

#### Step 3: Frontend Scaffolding
AI generated:
- Vite + React 19 project structure
- `AuthContext` for global auth state with axios interceptors
- `ProtectedRoute` component
- `Dashboard` with `react-hook-form` form, URL cards with copy/delete/open actions
- `Analytics` page with Recharts line graph, QR canvas, and visit table
- `Midnight Ocean` glassmorphism CSS design system in `index.css`

#### Step 4: Debugging & Migration
- AI helped migrate the data layer from MongoDB/Mongoose to Supabase/PostgreSQL
- Fixed nanoid ESM/CommonJS interop issue
- Resolved axios baseURL configuration for dev vs. production environments

#### Step 5: Deployment
AI generated the full EC2 deployment guide including PM2 startup, iptables port forwarding, and environment variable configuration.

### Prompts Used (Key Examples)
- *"Build a full-stack URL shortener with JWT auth, Supabase as the DB, and a React frontend with analytics charts and QR code generation."*
- *"Migrate this MongoDB schema to Supabase PostgreSQL and update all routes to use @supabase/supabase-js."*
- *"Design a dark glassmorphism CSS theme called Midnight Ocean for the URL shortener app."*
- *"Fix the nanoid ESM import error in a CommonJS Node.js backend."*
- *"Write the PM2 + iptables deployment instructions for a single-server AWS EC2 setup."*

---

## 🎬 Demo Video

📹 **YouTube:** [https://youtu.be/2QJ7A7Ojm_U?si=lltnioezqNwG1Egc](https://youtu.be/2QJ7A7Ojm_U?si=lltnioezqNwG1Egc)

The video demonstrates:
- User registration and login
- Shortening a URL with a custom alias and expiry date
- Viewing the dashboard with all active links
- Visiting a short URL and seeing the click counter increment
- Viewing the analytics page with the 7-day chart, QR code, and visit history
- Deleting a short URL

---

## 👤 Author

**Nandha Kumar**  
🔗 [GitHub](https://github.com/Nandha-kumar07) | 💼 [LinkedIn](https://www.linkedin.com/in/nandha-kumar-9427b428a)

---

> This project is a part of a hackathon run by https://katomaran.com
