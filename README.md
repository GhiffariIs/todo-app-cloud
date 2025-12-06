# 📝 Todo App - Cloud Computing Project

Aplikasi Todo List fullstack yang di-containerize menggunakan Docker dan di-deploy ke Google Cloud Platform (GCP) Cloud Run.

## 🏗️ Architecture
┌─────────────┐       ┌─────────────┐        ┌──────────────┐
│   Frontend  │────▶ │   Backend   │ ────▶  │ PostgreSQL   │
│   (React)   │       │  (Node.js)  │        │ Database     │
│  Port 3000  │       │  Port 8080  │        │ Port 5432    │
└─────────────┘       └─────────────┘        └──────────────┘

### Tech Stack

- **Frontend**: React 18, Axios, CSS3
- **Backend**: Node.js, Express.js, PostgreSQL driver
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Cloud Platform**: Google Cloud Platform (GCP)
- **Deployment**: Cloud Run
- **CI/CD**: Cloud Build

## 📋 Prerequisites

### Local Development
- Docker Desktop
- Node.js 18+ (optional, untuk development tanpa Docker)
- Git

### GCP Deployment
- Google Cloud Account
- gcloud CLI installed
- Project ID di GCP
- Cloud SQL instance (PostgreSQL)

## 🚀 Quick Start - Local Development

### 1. Clone Repository

```powershell
git clone https://github.com/GhiffariIs/todo-app-cloud.git
cd todo-app-cloud