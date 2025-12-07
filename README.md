# 📝 Todo App - Cloud-Native Full Stack Application

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)]()
[![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)]()
[![Backend](https://img.shields.io/badge/backend-Node.js-339933)]()
[![Cloud](https://img.shields.io/badge/cloud-Google%20Cloud%20Run-4285F4)]()

Aplikasi Todo List modern dengan arsitektur cloud-native, dibangun menggunakan React frontend, Node.js backend, dan deployed di Google Cloud Run.

## 🌐 Live Demo

- **Frontend**: [https://todo-frontend-745287198631.asia-southeast1.run.app](https://todo-frontend-745287198631.asia-southeast1.run.app)
- **Backend API**: [https://todo-backend-745287198631.asia-southeast1.run.app](https://todo-backend-745287198631.asia-southeast1.run.app)

## ✨ Features

- ✅ **Create** - Tambah todo baru dengan mudah
- ✅ **Read** - Lihat semua todos dalam antarmuka yang clean
- ✅ **Update** - Toggle status completed dengan checkbox
- ✅ **Delete** - Hapus todo yang tidak diperlukan
- ✅ **Responsive Design** - Bekerja sempurna di desktop dan mobile
- ✅ **Real-time Updates** - Perubahan langsung tersimpan ke database
- ✅ **Cloud-Native** - Deployed di Google Cloud Run dengan auto-scaling

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────┐
│ User Browser │
└────────────────────┬────────────────────────────────────┘
│ HTTPS
▼
┌─────────────────────────────────────────────────────────┐
│ Frontend (React + Nginx) │
│ Google Cloud Run - asia-southeast1 │
│ Port: 8080 │
└────────────────────┬────────────────────────────────────┘
│ REST API
▼
┌─────────────────────────────────────────────────────────┐
│ Backend (Node.js + Express) │
│ Google Cloud Run - asia-southeast1 │
│ Port: 8080 │
└────────────────────┬────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Database (SQLite) │
│ Embedded in Backend Container │
└─────────────────────────────────────────────────────────┘

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Create React App
- **Styling**: CSS3 with modern features
- **HTTP Client**: Fetch API
- **Web Server**: Nginx (production)

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js 4
- **Database**: SQLite3
- **Middleware**: CORS, Body Parser

### Infrastructure
- **Container Platform**: Docker
- **Cloud Provider**: Google Cloud Platform
- **Compute Service**: Cloud Run
- **Container Registry**: Google Container Registry
- **Region**: asia-southeast1 (Singapore)

### DevOps
- **Containerization**: Docker Multi-stage builds
- **Orchestration**: Docker Compose (local dev)
- **CI/CD**: Google Cloud Build (optional)
- **Version Control**: Git + GitHub

## 📁 Project Structure
todo-app-cloud/
├── backend/ # Backend service
│ ├── server.js # Express server & API routes
│ ├── package.json # Backend dependencies
│ ├── Dockerfile # Production Dockerfile
│ ├── Dockerfile.cloudrun # Cloud Run optimized Dockerfile
│ ├── .dockerignore # Docker ignore patterns
│ └── .gcloudignore # Google Cloud ignore patterns
│
├── frontend/ # Frontend service
│ ├── public/ # Static files
│ │ └── index.html # HTML template
│ ├── src/ # React source code
│ │ ├── App.js # Main React component
│ │ ├── App.css # Application styles
│ │ └── index.js # React entry point
│ ├── package.json # Frontend dependencies
│ ├── Dockerfile # Production Dockerfile
│ ├── Dockerfile.cloudrun # Cloud Run optimized Dockerfile
│ ├── nginx.conf # Nginx configuration
│ ├── nginx.cloudrun.conf # Cloud Run Nginx config
│ ├── .env.production # Production environment vars
│ ├── .dockerignore # Docker ignore patterns
│ └── .gcloudignore # Google Cloud ignore patterns
│
├── docker-compose.yaml # Production compose file
├── docker-compose.dev.yaml # Development compose file
├── cloudbuild.yaml # Google Cloud Build config
├── .gitignore # Git ignore patterns
├── README.md # Project documentation (this file)
├── ARCHITECTURE.md # Architecture documentation
├── DOCKER.md # Docker usage guide
└── DEPLOY-GUIDE.md # Deployment guide

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Docker Desktop (optional, for containerized development)

### Option 1: Run with Node.js

#### 1. Clone Repository
```powershell
git clone https://github.com/GhiffariIs/todo-app-cloud.git
cd todo-app-cloud
```

#### 2. Setup Backend
```poweshell
cd backend
npm install
npm start
```

Backend akan berjalan di http://localhost:5000

#### 3. Setup Frontend (terminal baru)
```powershell
cd frontend
npm install
npm start
```

Frontend akan berjalan di http://localhost:3000

### Option 2: Run with Docker Compose
Development Mode (with hot reload)
```powershell
docker-compose -f docker-compose.dev.yaml up -d
```

Production Mode
```powershell
docker-compose up -d
```

Access:

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 🐳 Docker Implementation

### Docker Architecture

Project ini menggunakan **Docker multi-stage builds** untuk optimasi:

#### Frontend Dockerfile Strategy
```dockerfile
# Stage 1: Build (Node.js 18-alpine)
- Install dependencies (npm ci)
- Build React app (npm run build)
- Output: /app/build folder

# Stage 2: Production (Nginx alpine)
- Copy built files from stage 1
- Configure Nginx for SPA routing
- Dynamic port configuration for Cloud Run
- Result: ~50MB image (vs 1GB+ with full Node.js)
```

#### Backend Dockerfile Strategy
```dockerfile
# Single-stage (Node.js 18-alpine)
- Production dependencies only (npm ci --only=production)
- Copy application code
- Environment variables: PORT, DB_PATH
- Health check endpoint: /health
- Result: ~200MB image
```

### Docker Compose

**Development Mode** (`docker-compose.dev.yaml`):
- Hot reload enabled
- Source code mounted as volumes
- Port mapping: 3000 (frontend), 5000 (backend)

**Production Mode** (`docker-compose.yaml`):
- Optimized builds
- No volume mounts
- Database persistence via Docker volumes

### Key Docker Files

| File | Purpose |
|------|----------|
| `Dockerfile` | Standard production build |
| `Dockerfile.cloudrun` | Cloud Run optimized (dynamic PORT) |
| `.dockerignore` | Exclude node_modules, .git, etc |
| `.gcloudignore` | Exclude files from Cloud Build |

---

## 🚢 Deployment to Google Cloud Run

### Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed and configured
- Docker installed (for local build)

### Quick Deploy

#### 1. Login and Setup
```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### 2. Deploy Backend

**Method 1: Direct from source (may fail with Buildpacks)**
```powershell
cd backend
gcloud run deploy todo-backend \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated
```

**Method 2: Build locally then push (Recommended)**
```powershell
cd backend

# Build Docker image locally
docker build -t gcr.io/YOUR_PROJECT_ID/todo-backend:v1 -f Dockerfile .

# Configure Docker auth
gcloud auth configure-docker

# Push image to GCR
docker push gcr.io/YOUR_PROJECT_ID/todo-backend:v1

# Deploy from image
gcloud run deploy todo-backend \
  --image gcr.io/YOUR_PROJECT_ID/todo-backend:v1 \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --platform managed
```

**Important Notes:**
- Pastikan `Dockerfile` tidak di-exclude di `.gcloudignore`
- SQLite dependencies memerlukan native compilation
- Port 8080 adalah default Cloud Run (jangan hardcode)

#### 3. Set Backend ke Public

Setelah deploy, set IAM policy (butuh permission):
```powershell
gcloud run services add-iam-policy-binding todo-backend \
  --region=asia-southeast1 \
  --member=allUsers \
  --role=roles/run.invoker
```

Atau via Cloud Console:
1. Buka https://console.cloud.google.com/run
2. Klik service `todo-backend`
3. Tab **PERMISSIONS** → **GRANT ACCESS**
4. Principal: `allUsers`, Role: `Cloud Run Invoker`

#### 4. Update Frontend Environment

Edit `frontend/.env.production` dengan backend URL:
```env
REACT_APP_API_URL=https://todo-backend-YOUR_PROJECT_NUMBER.asia-southeast1.run.app/api
```

#### 5. Deploy Frontend

```powershell
cd frontend

# Build image locally (untuk avoid buildpack issues)
docker build -t gcr.io/YOUR_PROJECT_ID/todo-frontend:v1 -f Dockerfile.cloudrun .

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/todo-frontend:v1

# Deploy to Cloud Run
gcloud run deploy todo-frontend \
  --image gcr.io/YOUR_PROJECT_ID/todo-frontend:v1 \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --platform managed
```

#### 6. Set Frontend ke Public

Sama seperti backend, set IAM policy atau via console.

#### 7. Test Deployment

```powershell
# Test backend health
curl https://todo-backend-YOUR_PROJECT_NUMBER.asia-southeast1.run.app/health

# Test backend API
curl https://todo-backend-YOUR_PROJECT_NUMBER.asia-southeast1.run.app/api/todos

# Test frontend (buka di browser)
https://todo-frontend-YOUR_PROJECT_NUMBER.asia-southeast1.run.app
```

### Troubleshooting Deployment

**Build Failed Error:**
- Check `.gcloudignore` tidak exclude `Dockerfile`
- Gunakan method build locally jika Cloud Build gagal
- Pastikan dependencies di `package.json` lengkap

**Permission Denied Error:**
- Minta admin project untuk grant `roles/run.admin`
- Atau set IAM policy via Cloud Console

**CORS Error di Frontend:**
- Verify `REACT_APP_API_URL` di `.env.production` benar
- Check CORS configuration di backend `server.js`

**Untuk detail lengkap, lihat [`DEPLOY-GUIDE.md`](DEPLOY-GUIDE.md )**

## 📚 API Documentation
Base URL
```powershell
Production: https://todo-backend-745287198631.asia-southeast1.run.app/api
Local: http://localhost:5000/api
```

### Get All Todos
```powershell
GET /api/todos
```

response:
```powershell
[
  {
    "id": 1,
    "title": "Learn React",
    "completed": 0,
    "created_at": "2025-12-07T10:30:00.000Z"
  }
]
```

### Create Todo
```powershell
POST /api/todos
Content-Type: application/json

{
  "title": "New todo item"
}
```

### Delete Todo
```powershell
DELETE /api/todos/:id
```

### Health Check
```powershell
GET /health
```

## 🧪 Testing
Test Backend API
```powershell
# Health check
curl https://todo-backend-745287198631.asia-southeast1.run.app/health

# Get todos
curl https://todo-backend-745287198631.asia-southeast1.run.app/api/todos

# Create todo
curl -X POST https://todo-backend-745287198631.asia-southeast1.run.app/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo"}'
```

Test Frontend
1. Buka browser
2. Akses: https://todo-frontend-745287198631.asia-southeast1.run.app
3. Test fitur: add, toggle, delete todos

## 🔒 Security Considerations
- ✅ HTTPS enforced (automatic on Cloud Run)
- ✅ CORS configured for frontend domain
- ✅ Input validation on API endpoints
- ✅ Environment variables for sensitive config
- ⚠️ No authentication implemented (public demo)
- ⚠️ SQLite not suitable for production (see recommendations)

## ⚠️ Known Limitations
Database Persistence
SQLite di Cloud Run bersifat ephemeral (temporary):

- Data hilang saat container restart
- Tidak cocok untuk production workload
- Cocok untuk demo dan development
Production Recommendations
Untuk production, gunakan salah satu:

- Cloud SQL (PostgreSQL/MySQL) - Managed relational database
- Firestore - NoSQL serverless database
- MongoDB Atlas - Cloud MongoDB service

## 💰 Cost Estimation
### Cloud Run Free Tier:

- 2 million requests/month
- 360,000 GB-seconds memory
- 180,000 vCPU-seconds

### Estimated Cost for This App:

- Traffic < 10,000 requests/month: FREE
- With Cloud SQL (db-f1-micro): ~$10/month
- Total: $0-10/month

## 📊 Monitoring
View Logs
```powershell
# Backend logs
gcloud run logs read todo-backend --limit 50 --region asia-southeast1

# Frontend logs
gcloud run logs read todo-frontend --limit 50 --region asia-southeast1
```
View Metrics
Access Cloud Console:

- https://console.cloud.google.com/run

## 🤝 Contributing
1. Fork repository
2. Create feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add some AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open Pull Request

## 📖 Additional Documentation
- ARCHITECTURE.md - Detailed architecture and design decisions
- DOCKER.md - Docker setup and commands
- DEPLOY-GUIDE.md - Step-by-step deployment guide
- DEPLOYMENT-CHECKLIST.md - Pre-deployment checklist

## 🐛 Troubleshooting
Frontend can't connect to backend
- Check CORS configuration in backend
- Verify API URL in .env.production
- Check Cloud Run service is public

Database data lost
- Expected behavior with SQLite on Cloud Run
- Migrate to Cloud SQL for persistence

Build failed on Cloud Run
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Check build logs in Cloud Console

## 📝 License
This project is open source and available under the MIT License.

## 🙏 Acknowledgments
- React team for amazing framework
- Express.js for simple backend framework
- Google Cloud for reliable infrastructure
- Community for continuous support