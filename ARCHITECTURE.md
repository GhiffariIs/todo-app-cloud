# 🏗️ Architecture & Design Decisions

## Table of Contents
- [System Architecture](#system-architecture)
- [Design Decisions](#design-decisions)
- [Technology Choices](#technology-choices)
- [Infrastructure Design](#infrastructure-design)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Future Improvements](#future-improvements)

---

## System Architecture

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Internet                                │
└───────────────────────────┬────────────────────────────────────┘
│
┌───────┴────────┐
│ Cloud CDN │ (Optional)
│ & Load │
│ Balancer │
└───────┬────────┘
│
┌───────────────────┼───────────────────┐
│ │ │
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Frontend │ │ Frontend │ │ Frontend │
│ Container │ │ Container │ │ Container │
│ (Nginx) │ │ (Nginx) │ │ (Nginx) │
│ │ │ │ │ │
│ React App │ │ React App │ │ React App │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
│ │ │
└───────────────────┼───────────────────┘
│ HTTPS REST API
│
┌──────────────────┼──────────────────┐
│ │ │
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Backend │ │ Backend │ │ Backend │
│ Container │ │ Container │ │ Container │
│ (Node.js) │ │ (Node.js) │ │ (Node.js) │
│ │ │ │ │ │
│ Express │ │ Express │ │ Express │
│ + SQLite │ │ + SQLite │ │ + SQLite │
└──────────────┘ └──────────────┘ └──────────────┘

Note: Cloud Run auto-scales based on traffic
```

### Component Architecture

#### 1. Frontend (React + Nginx)

```
┌─────────────────────────────────────────┐
│ Frontend Container │
│ │
│ ┌───────────────────────────────────┐ │
│ │ Nginx Web Server │ │
│ │ - Serve static files │ │
│ │ - SPA routing (try_files) │ │
│ │ - Gzip compression │ │
│ │ - Cache headers │ │
│ │ - Security headers │ │
│ └───────────────┬───────────────────┘ │
│ │ │
│ ┌───────────────▼───────────────────┐ │
│ │ React Application │ │
│ │ │ │
│ │ Components: │ │
│ │ ├─ App.js (Main Component) │ │
│ │ ├─ TodoList │ │
│ │ ├─ TodoItem │ │
│ │ └─ AddTodoForm │ │
│ │ │ │
│ │ State Management: │ │
│ │ ├─ useState (todos list) │ │
│ │ ├─ useState (input value) │ │
│ │ └─ useEffect (fetch on mount) │ │
│ │ │ │
│ │ API Client: │ │
│ │ └─ Fetch API (REST calls) │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### 2. Backend (Node.js + Express)

```
┌─────────────────────────────────────────┐
│ Backend Container │
│ │
│ ┌───────────────────────────────────┐ │
│ │ Express Server │ │
│ │ │ │
│ │ Middleware Stack: │ │
│ │ ├─ CORS (Cross-Origin) │ │
│ │ ├─ express.json() (Body Parser) │ │
│ │ └─ Error Handler │ │
│ └───────────────┬───────────────────┘ │
│ │ │
│ ┌───────────────▼───────────────────┐ │
│ │ API Routes │ │
│ │ │ │
│ │ GET /health │ │
│ │ GET /api/todos │ │
│ │ POST /api/todos │ │
│ │ PUT /api/todos/:id │ │
│ │ DELETE /api/todos/:id │ │
│ └───────────────┬───────────────────┘ │
│ │ │
│ ┌───────────────▼───────────────────┐ │
│ │ SQLite Database │ │
│ │ │ │
│ │ Table: todos │ │
│ │ ├─ id (INTEGER PRIMARY KEY) │ │
│ │ ├─ title (TEXT NOT NULL) │ │
│ │ ├─ completed (INTEGER 0/1) │ │
│ │ └─ created_at (DATETIME) │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Actual Deployment Architecture

```
Production Environment (Google Cloud Run)

┌─────────────────────────────────────────────────────────────┐
│                  Cloud Run Services                         │
│  Region: asia-southeast1 (Singapore)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Service: todo-frontend                            │
│  ├─ URL: https://todo-frontend-745287198631...run.app      │
│  ├─ Container: gcr.io/iam-lab-kelompok6/todo-frontend:v1   │
│  ├─ Memory: 256Mi                                           │
│  ├─ CPU: 1                                                  │
│  ├─ Min Instances: 0 (scale to zero)                        │
│  ├─ Max Instances: 10                                       │
│  └─ Port: 8080 (dynamic from Cloud Run)                     │
│                                                             │
│  Backend Service: todo-backend                              │
│  ├─ URL: https://todo-backend-745287198631...run.app       │
│  ├─ Built from: Dockerfile (Node.js 18-alpine)             │
│  ├─ Memory: 512Mi                                           │
│  ├─ CPU: 1                                                  │
│  ├─ Min Instances: 0                                        │
│  ├─ Max Instances: 10                                       │
│  ├─ Port: 8080 (from process.env.PORT)                     │
│  └─ Database: SQLite (ephemeral - /app/data/todos.db)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Container Registry (GCR)                        │
├─────────────────────────────────────────────────────────────┤
│  gcr.io/iam-lab-kelompok6/                                  │
│  ├─ todo-frontend:v1 (multi-stage build, ~50MB)            │
│  └─ todo-backend:latest (single-stage, ~200MB)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Decisions

### 1. **Architecture Pattern: Microservices**

**Decision**: Separate frontend and backend as independent services

**Rationale**:
- ✅ **Independent Scaling**: Frontend dan backend bisa scale terpisah
- ✅ **Technology Flexibility**: Bisa ganti tech stack per service
- ✅ **Deployment Independence**: Deploy frontend tanpa affect backend
- ✅ **Team Autonomy**: Team bisa work parallel
- ✅ **Cloud-Native**: Cocok dengan Cloud Run architecture

**Trade-offs**:
- ❌ **Increased Complexity**: Lebih banyak moving parts
- ❌ **Network Latency**: API calls over network
- ❌ **CORS Configuration**: Perlu handle cross-origin requests

### 2. **Frontend: Single Page Application (SPA)**

**Decision**: Build React SPA instead of Server-Side Rendering (SSR)

**Rationale**:
- ✅ **Better UX**: Smooth transitions, no page reloads
- ✅ **Simpler Deployment**: Static files + CDN
- ✅ **Reduced Backend Load**: Client-side rendering
- ✅ **Offline Capable**: Can add PWA features later

**Trade-offs**:
- ❌ **SEO Challenges**: Not critical for todo app
- ❌ **Initial Load**: Larger JavaScript bundle
- ❌ **JavaScript Required**: No graceful degradation

### 3. **Backend: RESTful API**

**Decision**: Use REST instead of GraphQL or gRPC

**Rationale**:
- ✅ **Simplicity**: Easy to implement and understand
- ✅ **Standard**: Well-known HTTP methods
- ✅ **Tooling**: Great browser/curl support
- ✅ **Caching**: HTTP caching strategies available

**Trade-offs**:
- ❌ **Over-fetching**: Fixed response structures
- ❌ **Multiple Requests**: No query batching like GraphQL

### 4. **Database: SQLite (Embedded)**

**Decision**: Use SQLite embedded database

**Rationale**:
- ✅ **Zero Configuration**: No separate DB server
- ✅ **Simplicity**: Single file database
- ✅ **Perfect for Demo**: Easy to setup and test
- ✅ **Cost**: No database hosting costs

**Trade-offs**:
- ❌ **Not Persistent on Cloud Run**: Data lost on restart
- ❌ **No Concurrency**: Single writer limitation
- ❌ **Not Production Ready**: Needs migration for production

**Production Alternative**: Cloud SQL PostgreSQL
```sql
-- Migration would be straightforward:
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Containerization: Docker Multi-Stage Build**

**Decision**: Use multi-stage builds for frontend

**Rationale**:
- ✅ **Smaller Images**: Build artifacts separated from source
- ✅ **Security**: No build tools in production image
- ✅ **Performance**: Faster pulls and deployments
- ✅ **Best Practice**: Industry standard approach

**Frontend Dockerfile Strategy**:
```dockerfile
# Stage 1: Build (Node.js 18-alpine)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Output: /app/build folder with optimized React app

# Stage 2: Production (Nginx alpine)
FROM nginx:alpine
COPY nginx.cloudrun.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# Dynamic port configuration for Cloud Run
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'PORT=${PORT:-8080}' >> /docker-entrypoint.sh && \
    echo 'sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]

# Result: ~50MB image (vs 1GB+ with full Node.js)
```

**Backend Dockerfile Strategy**:
```dockerfile
# Single-stage (Node.js 18-alpine)
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .
RUN mkdir -p /app/data

# Environment configuration
ENV PORT=8080
ENV DB_PATH=/app/data

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 8080; require('http').get('http://localhost:' + port + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]

# Result: ~200MB image
```

**Key Docker Configurations**:

| File | Purpose | Key Content |
|------|---------|-------------|
| `.dockerignore` | Exclude from build | `node_modules/`, `.git/`, `*.db` |
| `.gcloudignore` | Exclude from Cloud Build | Same as dockerignore, but **include Dockerfile** |
| `nginx.cloudrun.conf` | Nginx config | SPA routing, gzip, cache headers |

**Critical Learning**: `.gcloudignore` awalnya meng-exclude `Dockerfile`, menyebabkan build failures. Solution: Remove `Dockerfile` dari `.gcloudignore`.

### 6. Cloud Platform: Google Cloud Run
Decision: Deploy on Cloud Run instead of VMs or Kubernetes

Rationale:

✅ Serverless: No server management
✅ Auto-Scaling: 0 to N instances automatically
✅ Pay-per-Use: Only pay for actual requests
✅ Simple: One command deployment
✅ HTTPS: Automatic SSL certificates
Comparison:

Feature	Cloud Run	GKE	Compute Engine
Setup Time	5 min	1-2 hours	30 min
Scaling	Automatic	Manual/HPA	Manual
Cost	Pay-per-use	Always running	Always running
Complexity	Low	High	Medium
### 7. **API Communication: CORS-Enabled REST**

**Decision**: Enable CORS for cross-origin requests

**Rationale**:
- ✅ **Security**: Controlled access from frontend domain
- ✅ **Flexibility**: Frontend can be on different domain
- ✅ **Standard**: Browser security requirement

**Implementation**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://todo-frontend-745287198631.asia-southeast1.run.app' // Production
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));
```

### 8. **Environment Configuration**

**Decision**: Use environment variables for configuration

**Backend Environment Variables**:
```javascript
const PORT = process.env.PORT || 5000;  // Cloud Run sets this to 8080
const DB_PATH = process.env.DB_PATH || __dirname;  // Database location
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Frontend Environment Variables** (`.env.production`):
```env
REACT_APP_API_URL=https://todo-backend-745287198631.asia-southeast1.run.app/api
```

**Cloud Run automatically provides**:
- `PORT`: Container port (always 8080)
- `K_SERVICE`: Service name
- `K_REVISION`: Revision name
- `K_CONFIGURATION`: Configuration name

---

## Docker Implementation Details

### Build Process

#### Local Development Build
```powershell
# Backend
cd backend
npm install
npm start  # Runs on port 5000

# Frontend
cd frontend
npm install
npm start  # Runs on port 3000
```

#### Docker Compose Build
```powershell
# Development with hot reload
docker-compose -f docker-compose.dev.yaml up -d

# Production
docker-compose up -d
```

#### Cloud Run Build (Actual Process)

**Method 1: Cloud Build (Failed initially)**
```powershell
gcloud run deploy todo-backend --source .
# Issue: Buildpacks failed with SQLite native compilation
# Issue: .gcloudignore excluded Dockerfile
```

**Method 2: Local Build + Push (Successful)**
```powershell
# 1. Build locally
docker build -t gcr.io/iam-lab-kelompok6/todo-frontend:v1 -f Dockerfile.cloudrun .

# 2. Authenticate Docker
gcloud auth configure-docker

# 3. Push to GCR
docker push gcr.io/iam-lab-kelompok6/todo-frontend:v1

# 4. Deploy from image
gcloud run deploy todo-frontend \
  --image gcr.io/iam-lab-kelompok6/todo-frontend:v1 \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --platform managed
```

### Image Optimization

**Frontend Image Layers**:
```
TOTAL SIZE: ~50MB
├─ nginx:alpine base: 40MB
├─ React build artifacts: 5MB
├─ nginx config: <1MB
└─ entrypoint script: <1KB
```

**Backend Image Layers**:
```
TOTAL SIZE: ~200MB
├─ node:18-alpine base: 170MB
├─ Production dependencies: 25MB
├─ Application code: 5MB
└─ SQLite database file: 0MB (created at runtime)
```

**Optimization Techniques Applied**:
- ✅ Alpine Linux base images (minimal size)
- ✅ Multi-stage builds (frontend only)
- ✅ `.dockerignore` to exclude unnecessary files
- ✅ `npm ci --only=production` for minimal dependencies
- ✅ Layer caching optimization (COPY package.json first)

---

## Cloud Run Deployment Implementation

### Deployment Configuration

**Backend Service Configuration**:
```yaml
Service Name: todo-backend
Region: asia-southeast1
Image: Built from Dockerfile (not GCR image initially)
Memory: 512Mi (sufficient for Node.js + SQLite)
CPU: 1
Min Instances: 0 (scale to zero when idle)
Max Instances: 10
Port: 8080 (set via PORT env var)
Timeout: 300s (5 minutes for long requests)
Concurrency: 80 (requests per container)
```

**Frontend Service Configuration**:
```yaml
Service Name: todo-frontend
Region: asia-southeast1
Image: gcr.io/iam-lab-kelompok6/todo-frontend:v1
Memory: 256Mi (Nginx + static files)
CPU: 1
Min Instances: 0
Max Instances: 10
Port: 8080 (dynamic via entrypoint script)
Timeout: 60s
Concurrency: 80
```

### IAM & Security

**Permission Requirements**:
```
Developer Account Permissions:
- roles/run.developer (deploy services)
- roles/iam.serviceAccountUser (act as service account)
- roles/storage.admin (push to GCR)

Admin Actions Required:
- roles/run.admin (set IAM policies)
- Add allUsers as Cloud Run Invoker for public access
```

**Actual Commands Used**:
```powershell
# Failed (insufficient permissions)
gcloud run services add-iam-policy-binding todo-backend \
  --region=asia-southeast1 \
  --member=allUsers \
  --role=roles/run.invoker

# Solution: Admin set via Cloud Console
# Console → Cloud Run → Service → Permissions → Grant Access
# Principal: allUsers, Role: Cloud Run Invoker
```

### Deployment Workflow

**Actual Deployment Steps (Successfully Used)**:

1. **Prepare Backend**:
   ```powershell
   cd backend
   # Update .gcloudignore (remove Dockerfile from exclusions)
   # Ensure Dockerfile uses PORT env var
   # Ensure server.js listens on 0.0.0.0
   ```

2. **Deploy Backend**:
   ```powershell
   gcloud run deploy todo-backend \
     --source . \
     --region asia-southeast1 \
     --allow-unauthenticated
   # Result: https://todo-backend-745287198631.asia-southeast1.run.app
   ```

3. **Test Backend**:
   ```powershell
   curl https://todo-backend-745287198631.asia-southeast1.run.app/health
   # Expected: {"status":"OK","timestamp":"..."}
   ```

4. **Build Frontend Locally** (due to Cloud Build issues):
   ```powershell
   cd frontend
   # Update .env.production with backend URL
   docker build -t gcr.io/iam-lab-kelompok6/todo-frontend:v1 -f Dockerfile.cloudrun .
   gcloud auth configure-docker
   docker push gcr.io/iam-lab-kelompok6/todo-frontend:v1
   ```

5. **Deploy Frontend**:
   ```powershell
   gcloud run deploy todo-frontend \
     --image gcr.io/iam-lab-kelompok6/todo-frontend:v1 \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --platform managed
   # Result: https://todo-frontend-745287198631.asia-southeast1.run.app
   ```

6. **Set Public Access** (via admin):
   - Backend: Set allUsers as Cloud Run Invoker
   - Frontend: Set allUsers as Cloud Run Invoker

7. **Verify Deployment**:
   ```powershell
   # Backend API
   curl https://todo-backend-745287198631.asia-southeast1.run.app/api/todos
   
   # Frontend (open in browser)
   https://todo-frontend-745287198631.asia-southeast1.run.app
   ```