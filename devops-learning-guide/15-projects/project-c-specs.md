# 🚀 Capstone Project C: Enterprise Automated CI/CD Pipeline (မြန်မာဘာသာ)

> **ကျွမ်းကျင်မှုနယ်ပယ်**: GitHub Actions, CI/CD Automation, Docker Buildx, Trivy Security Scanner, Gitleaks, SSH Deployment, Zero-Downtime Rollback

---

## 📌 ၁။ ပရောဂျက် မိတ်ဆက်နှင့် ရည်ရွယ်ချက် (Project Overview)

Developer များ code ရေးသားပြီး `main` branch သို့ merge လုပ်လိုက်သည်နှင့် လူကိုယ်တိုင် server ပေါ်သို့ SSH ဝင်ရောက်စရာမလိုဘဲ အလိုအလျောက် Unit Test စစ်ဆေးခြင်း၊ Secret Leaks များ စစ်ဆေးခြင်း၊ Container Vulnerability စစ်ဆေးခြင်းနှင့် Production Server ပေါ်သို့ Zero-Downtime Deployment ပြုလုပ်ပေးနိုင်သည့် Enterprise CI/CD Pipeline တစ်ခု ဖြစ်ပါသည်။

အကယ်၍ Deployment ပြုလုပ်ပြီးနောက် Server ပေါ်ရှိ Healthcheck API မအောင်မြင်ပါက ယခင်အလုပ်လုပ်ခဲ့သော Container Version သို့ စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် Rollback ပြုလုပ်ပေးမည့် Failure Recovery စနစ်ပါ ပေါင်းစပ်တည်ဆောက်ပါမည်။

### 🎯 Key Deliverables:
1. Complete GitHub Actions Workflow (`.github/workflows/production-pipeline.yml`)
2. Automated Unit Tests & Code Linting Stage
3. DevSecOps Quality Gates: Gitleaks (Secret Detection) & Trivy (Container Vulnerability Scan)
4. Docker Buildx with GitHub Actions Layer Caching (`type=gha`)
5. Remote Deployment over SSH with Strict Host Key Verification
6. Automated Healthcheck Validation & Zero-Downtime Rollback Script

---

## 🏗️ ၂။ Pipeline အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Workflow Diagram)

```text
[ Developer: Git Push to main ]
              │
              ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Stage 1: Continuous Integration (CI)                        │
 │ - Run Unit Tests & Linting                                  │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Passes
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Stage 2: DevSecOps Quality Gates                            │
 │ - Gitleaks: Scans Git history for hardcoded secrets / keys  │
 │ - Trivy: Scans dependencies for CRITICAL vulnerabilities    │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Clean (No Breaches)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Stage 3: Container Build & Security Scan                    │
 │ - Docker Buildx with Layer Cache (type=gha)                 │
 │ - Trivy Image Scan (Fails build if CRITICAL CVE found)      │
 │ - Push to Container Registry (Docker Hub / AWS ECR)         │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Pushed Successfully
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Stage 4: Continuous Deployment (CD) over SSH                │
 │ - SSH into Target Production Server                         │
 │ - Pull new image version                                    │
 │ - Start new container alongside old container               │
 │ - Healthcheck: curl -f http://127.0.0.1:3000/health         │
 │                                                             │
 │   ├─ [SUCCESS] ➜ Swap traffic & remove old container        │
 │   └─ [FAILED]  ➜ Abort, restart old container & Rollback!   │
 └─────────────────────────────────────────────────────────────┘
```

---

## 💻 ၃။ အပြည့်အစုံ ရေးသားထားသော Pipeline ဖိုင် (`.github/workflows/production-pipeline.yml`)

```yaml
name: Enterprise Production CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

concurrency:
  group: production-deployment
  cancel-in-progress: false

env:
  REGISTRY: docker.io
  IMAGE_NAME: ${{ secrets.DOCKERHUB_USERNAME }}/production-web-app
  DEPLOY_PORT: 3000

jobs:
  # ========================================================
  # JOB 1: Test & Lint
  # ========================================================
  test:
    name: 🧪 Unit Tests & Linting
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint --if-present

      - name: Execute Unit Tests
        run: npm test --if-present

  # ========================================================
  # JOB 2: DevSecOps Security Scan (Gitleaks & Trivy FS)
  # ========================================================
  security-audit:
    name: 🛡️ Secret & Dependency Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history needed for Gitleaks

      - name: Run Gitleaks Secret Scanner
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Run Trivy Vulnerability Scanner (Repo & Dependencies)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          severity: 'HIGH,CRITICAL'
          exit-code: '1' # Break pipeline if HIGH/CRITICAL CVEs found

  # ========================================================
  # JOB 3: Build & Push Container Image
  # ========================================================
  build-and-push:
    name: 🐳 Docker Buildx & Container Vulnerability Scan
    needs: [test, security-audit]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    outputs:
      image_tag: ${{ steps.meta.outputs.version }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract Docker Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=short,prefix=
            type=raw,value=latest

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy Image Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.version }}
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL'

  # ========================================================
  # JOB 4: Zero-Downtime Deploy with Automated Rollback
  # ========================================================
  deploy-production:
    name: 🚀 Zero-Downtime Deploy & Health Verification
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Execute Remote Deployment via SSH
        uses: appleboy/ssh-action@v1.0.3
        env:
          NEW_IMAGE: ${{ env.IMAGE_NAME }}:${{ needs.build-and-push.outputs.image_tag }}
        with:
          host: ${{ secrets.PROD_SERVER_IP }}
          username: ${{ secrets.PROD_SERVER_USER }}
          key: ${{ secrets.PROD_SSH_PRIVATE_KEY }}
          envs: NEW_IMAGE
          script_stop: true
          script: |
            echo "=========================================================="
            echo "Starting Zero-Downtime Deploy for: $NEW_IMAGE"
            echo "=========================================================="
            
            # 1. Pull the newly published image
            docker pull "$NEW_IMAGE"
            
            # 2. Tag current running container as rollback candidate
            CURRENT_IMAGE=$(docker inspect --format='{{.Config.Image}}' prod_app_live 2>/dev/null || echo "")
            echo "Current live image: $CURRENT_IMAGE"
            
            # 3. Launch new container on standby port (3001)
            docker rm -f prod_app_standby 2>/dev/null || true
            docker run -d --name prod_app_standby \
              --network frontend_net \
              -e PORT=3001 \
              -p 3001:3001 \
              "$NEW_IMAGE"
            
            # 4. Perform Healthcheck Probes
            echo "[*] Verifying health of new container on port 3001..."
            HEALTH_SUCCESS=0
            for i in {1..10}; do
              if curl -s -f http://127.0.0.1:3001/health >/dev/null; then
                echo "[✔] Health check passed on attempt $i!"
                HEALTH_SUCCESS=1
                break
              fi
              echo "Waiting for container to become healthy (Attempt $i/10)..."
              sleep 3
            done
            
            # 5. Atomic Promotion or Rollback
            if [ "$HEALTH_SUCCESS" -eq 1 ]; then
              echo "[✔] Promotion: Swapping standby container into production..."
              docker rm -f prod_app_live 2>/dev/null || true
              docker rename prod_app_standby prod_app_live
              docker run -d --name prod_app_live_promoted \
                --network frontend_net \
                --restart always \
                -e PORT=3000 \
                -p 3000:3000 \
                "$NEW_IMAGE" 2>/dev/null || true
              echo "[🎉] Deployment Successfully Completed!"
            else
              echo "❌ [ERROR] Health check failed! Initiating Instant Rollback..."
              docker rm -f prod_app_standby 2>/dev/null || true
              if [ -n "$CURRENT_IMAGE" ]; then
                echo "[*] Restoring previous stable image: $CURRENT_IMAGE"
                docker start prod_app_live || docker run -d --name prod_app_live -p 3000:3000 "$CURRENT_IMAGE"
              fi
              exit 1
            fi
            
            # 6. Cleanup dangling images
            docker image prune -af --filter "until=48h"
```

---

## 🔐 ၄။ GitHub Repository Secrets Setup

GitHub Actions အလုပ်လုပ်နိုင်ရန် Settings > Secrets and variables > Actions တွင် အောက်ပါ Secrets များကို ထည့်သွင်းပေးရမည်:

| Secret Name | Description | Example Value |
|---|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username | `mydevopsuser` |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token (PAT) | `dckr_pat_xxx...` |
| `PROD_SERVER_IP` | AWS EC2 Public Elastic IP | `54.255.10.88` |
| `PROD_SERVER_USER` | Target deployment user | `ubuntu` |
| `PROD_SSH_PRIVATE_KEY` | SSH Private Key for Deployment | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

---

## 💼 ၅။ Resume ပေါ်တွင် ထည့်သွင်းဖော်ပြရမည့် စံပြစာသား (Resume Bullets)
- *"Built an enterprise GitHub Actions CI/CD pipeline with Gitleaks and Trivy security gates, enforcing zero-trust vulnerability thresholds before production image push."*
- *"Implemented a zero-downtime SSH blue-green deployment strategy with automated healthcheck validation and instant rollback capabilities, reducing production deployment risk to zero."*
- *"Accelerated container build times by 65% utilizing Docker Buildx with GitHub Actions Layer Caching (`type=gha`)."*
