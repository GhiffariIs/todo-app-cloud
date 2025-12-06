# Docker Setup - Todo App

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### Production Mode
```powershell
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v