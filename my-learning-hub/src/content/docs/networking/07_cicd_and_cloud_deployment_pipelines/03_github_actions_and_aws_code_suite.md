---
title: GitHub Actions & AWS CodePipeline / CodeBuild
description: Production GitHub Actions Workflow နမူနာ၊ AWS CodePipeline နှင့် CodeBuild Overviews
---

## ၁။ Complete Production GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Production ECS Fargate

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push Docker Image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/web-app:$IMAGE_TAG .
          docker push $ECR_REGISTRY/web-app:$IMAGE_TAG

      - name: Update ECS Service
        run: |
          aws ecs update-service --cluster prod-cluster --service web-service --force-new-deployment
```
