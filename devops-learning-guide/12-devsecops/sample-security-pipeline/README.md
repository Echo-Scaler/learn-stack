# 📦 Sample DevSecOps Security Pipeline

This sample demonstrates a production CI/CD security gate implementation combining Gitleaks secret scanning, Trivy container vulnerability scanning, and Dockerfile hardening.

## 📂 Files Included
```text
sample-security-pipeline/
├── security-scan.yml         # GitHub Actions Workflow with Gitleaks & Trivy
├── Dockerfile.hardened       # Production Multi-Stage, Non-Root Hardened Dockerfile
└── README.md
```

## 🚀 How to Use

1. Copy `security-scan.yml` to your repository at `.github/workflows/security-scan.yml`.
2. Adopt `Dockerfile.hardened` patterns (multi-stage build, minimal Alpine base, `USER appuser` non-root execution).
3. Any pull request introducing secrets or CRITICAL container vulnerabilities will be automatically blocked by GitHub Actions.
