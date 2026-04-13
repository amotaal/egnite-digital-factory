# Egnite Digital Factory — Deployment Guide

## Local Development

```bash
pnpm install
pnpm seed       # Creates 9 starter documents from the recipe library
pnpm dev        # Starts dev server at http://localhost:3000
```

**Default credentials:**
| Username | Password       | Role   |
|----------|---------------|--------|
| admin    | egnite2024    | Admin  |
| editor   | creative2024  | Editor |

> **Important:** Change these passwords in `lib/auth.ts` before deploying to production.

---

## Coolify Deployment (Ubuntu VPS)

### 1. Repository Setup
Push this repository to GitHub (or any Git provider). Coolify will clone it.

### 2. Create Application in Coolify
- **Build Pack:** Dockerfile
- **Port:** 3000
- **Dockerfile path:** `./Dockerfile`

### 3. Environment Variables
Set in Coolify's environment variables panel:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATA_DIR=/app/data
```

### 4. Persistent Storage (Critical!)
In Coolify, add two **File Storage** / **Volume** mounts:

| Source (host path)           | Target (container path)  | Purpose                    |
|------------------------------|--------------------------|----------------------------|
| `/data/egnite/documents`     | `/app/data/documents`    | Saved JSON documents       |
| `/data/egnite/uploads`       | `/app/public/uploads`    | Uploaded food images       |

> These ensure documents and images survive container restarts and redeployments.

### 5. Initial Seed
After the first deployment, SSH into the server and run:

```bash
docker exec <container_name> node -e "
  const { execSync } = require('child_process');
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' });
"
```

Or alternatively, use the Coolify terminal to run the seed script.

### 6. Reverse Proxy
Coolify handles Traefik/Nginx reverse proxy automatically. Point your domain to the application.

---

## docker-compose (Local or Self-hosted)

```yaml
version: "3.8"
services:
  egnite-factory:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATA_DIR=/app/data
    volumes:
      - ./data:/app/data
      - ./public/uploads:/app/public/uploads
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
docker-compose exec egnite-factory npx tsx scripts/seed.ts
```

---

## Changing Credentials

Edit `lib/auth.ts` and update the `USERS` array:

```typescript
const USERS = [
  { id: "1", username: "admin", password: "YOUR_SECURE_PASSWORD", ... },
  { id: "2", username: "editor", password: "YOUR_SECURE_PASSWORD", ... },
];
```

Redeploy after changing credentials.

---

## Backup

The entire application state is in two directories:
- `data/documents/` — JSON files (one per document)
- `public/uploads/` — uploaded images

Back these up regularly to avoid data loss.

```bash
# Quick backup
tar -czf egnite-backup-$(date +%Y%m%d).tar.gz data/ public/uploads/
```
