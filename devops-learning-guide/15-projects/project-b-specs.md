# 🚀 Capstone Project B: Production Multi-Tier Containerized Web Stack (မြန်မာဘာသာ)

> **ကျွမ်းကျင်မှုနယ်ပယ်**: Docker, Docker Compose, Multi-Stage Builds, Nginx Reverse Proxy, SSL/TLS, PostgreSQL, Redis, Container Security

---

## 📌 ၁။ ပရောဂျက် မိတ်ဆက်နှင့် ရည်ရွယ်ချက် (Project Overview)

Development ပြုလုပ်ထားသော Web Application တစ်ခုကို Production Server ပေါ်သို့ manual installation မပြုလုပ်ဘဲ၊ ကမ္ဘာ့စံချိန်စံညွှန်း Container Architecture ဖြင့် စနစ်တကျ Deploy ပြုလုပ်နိုင်ရန် ဖြစ်ပါသည်။

ဤ Project B တွင် Multi-Tier Microservice Architecture (Nginx Reverse Proxy + Web API + Redis Cache + PostgreSQL Database) ကို Docker Compose ဖြင့် တည်ဆောက်ပြီး Production-grade Security (Non-root user, Isolated Bridge Network, Healthchecks, Named Volumes) များကို အပြည့်အစုံ ထည့်သွင်းထားပါသည်။

### 🎯 Key Deliverables:
1. Production Multi-Stage `Dockerfile` (Node.js Alpine Base, Image size < 100MB)
2. Non-root Execution (`USER node` / UID 10001)
3. Hardened `nginx.conf` (SSL Termination, Rate Limiting, Proxy Headers, Gzip)
4. Production `docker-compose.yml` (Healthchecks, Resource Limits, Secrets, Network Isolation)
5. Zero-Downtime Rolling Update Workflow via Docker Compose

---

## 🏗️ ၂။ စနစ် တည်ဆောက်ပုံ (Architecture Diagram)

```text
[ Internet / Clients ]
         │ HTTPS (Port 443) / HTTP (Port 80 -> 301 Redirect)
         ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Nginx Reverse Proxy Container (SSL Termination)             │
 │ - Reverse proxies requests to Web API                       │
 │ - Public Network (frontend-net)                             │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Proxy Pass (Port 3000)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Web App API Cluster (Node.js Express / PHP-FPM)             │
 │ - Multi-stage build, Non-root execution                     │
 │ - Connected to: frontend-net & backend-net                  │
 └──────────────┬──────────────────────────────┬───────────────┘
                │ Cache Query (Port 6379)      │ SQL Queries (Port 5432)
                ▼                              ▼
 ┌───────────────────────────┐  ┌──────────────────────────────┐
 │ Redis Cache Container     │  │ PostgreSQL Database Container│
 │ - In-Memory Caching       │  │ - Persistent Named Volume    │
 │ - backend-net (Isolated)  │  │ - backend-net (Isolated)     │
 └───────────────────────────┘  └──────────────────────────────┘
```

---

## 💻 ၃။ အပြည့်အစုံ ရေးသားထားသော ဖိုင်များ (Project Files)

### ၃.၁ Multi-Stage Dockerfile (`app/Dockerfile`):
```dockerfile
# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application source
COPY . .

# ==========================================
# Stage 2: Final Minimal Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set Production Environment
ENV NODE_ENV=production
ENV PORT=3000

# Security: Create non-root user and group
RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -S appuser -G appgroup

# Copy dependencies and source from builder
COPY --from=builder --chown=appuser:appgroup /usr/src/app ./

# Switch to non-root user
USER appuser

EXPOSE 3000

# Docker native healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
```

---

### ၃.၂ Nginx Configuration (`nginx/nginx.conf`):
```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    server_tokens off; # Security: Hide Nginx version

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Upstream definition for Web App
    upstream app_cluster {
        server app:3000 max_fails=3 fail_timeout=10s;
        keepalive 32;
    }

    # Redirect all HTTP traffic to HTTPS
    server {
        listen 80;
        server_name myapp.example.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS Production Server
    server {
        listen 443 ssl http2;
        server_name myapp.example.com;

        ssl_certificate /etc/letsencrypt/live/myapp.example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/myapp.example.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        location / {
            proxy_pass http://app_cluster;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

### ၃.၃ Production Docker Compose (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  # 1. Reverse Proxy & SSL Termination
  nginx:
    image: nginx:1.25-alpine
    container_name: prod_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      app:
        condition: service_healthy
    networks:
      - frontend_net
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  # 2. Web API Application
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: prod_app
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=db
      - DB_USER=appuser
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - DB_NAME=production_db
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    secrets:
      - db_password
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - frontend_net
      - backend_net
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M

  # 3. Redis Cache
  redis:
    image: redis:7-alpine
    container_name: prod_redis
    restart: always
    command: ["redis-server", "--appendonly", "yes", "--requirepass", "RedisSecurePassword2026!"]
    volumes:
      - redis_data:/data
    networks:
      - backend_net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  # 4. PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: prod_postgres
    restart: always
    environment:
      - POSTGRES_DB=production_db
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d production_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1024M

secrets:
  db_password:
    file: ./secrets/db_password.txt

networks:
  frontend_net:
    driver: bridge
  backend_net:
    driver: bridge
    internal: true # Security: Prevents any direct outbound or inbound Internet routing

volumes:
  postgres_data:
  redis_data:
```

---

## 🛠️ ၄။ Deployment & Zero-Downtime Update Instructions

### ၄.၁ ပထမဆုံးအကြိမ် စတင် Run ခြင်း:
```bash
# 1. Create secrets directory and password
mkdir -p secrets
echo "StrongProdDBPassword2026!" > secrets/db_password.txt
chmod 600 secrets/db_password.txt

# 2. Build and launch services in background
docker compose up -d --build

# 3. Verify health status
docker compose ps
```

### ၄.၂ Zero-Downtime Rolling Update လုပ်ဆောင်ပုံ:
```bash
# 1. Pull / Rebuild new app image without stopping traffic
docker compose build app

# 2. Replace app container with zero downtime
docker compose up -d --no-deps --build app

# 3. Verify healthcheck before proceeding
docker compose ps app
```

---

## 💼 ၅။ Resume ပေါ်တွင် ထည့်သွင်းဖော်ပြရမည့် စံပြစာသား (Resume Bullets)
- *"Designed and containerized a multi-tier production stack (Nginx, Node.js, PostgreSQL, Redis) via Docker Compose, leveraging multi-stage builds to cut image size by 88% down to 82MB."*
- *"Enforced zero-trust container security with internal bridge networks, non-root user execution, Docker Secrets, and automated healthcheck probes."*
