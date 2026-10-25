# 🛑 AWS Production Architecture Teardown & Rollback Guide

> **Lab စမ်းသပ်မှု ပြီးဆုံးပါက ဘေလ်မတက်စေရန် အဆင့်ဆင့် ဖျက်သိမ်းရမည့် Teardown Protocol နှင့် Production Rollback လမ်းညွှန်**

---

## 🧹 ၁။ Step-by-Step Complete Teardown Protocol

အောက်ပါ အဆင့်အတိုင်း **တိတိကျကျ** ဖျက်သိမ်းပါ (မှားယွင်းသော အစဉ်လိုက် ဖျက်ပါက Dependency error တက်နိုင်ပါသည်):

```text
[ Step 1: Delete ALB ] ──► [ Step 2: Delete Target Groups ] ──► [ Step 3: Terminate EC2 ]
                                                                           │
                                                                           ▼
[ Step 6: Delete VPC ] ◄── [ Step 5: Delete Subnets/IGW ]   ◄── [ Step 4: Delete RDS DB ]
```

### AWS CLI ဖြင့် အမြန် ဖျက်သိမ်းနိုင်သော Commands များ:

#### အဆင့် ၁: Application Load Balancer ကို ဖျက်ပါ
```bash
# ALB ARN ကို ရှာဖွေပါ
ALB_ARN=$(aws elbv2 describe-load-balancers --names "production-alb" --query "LoadBalancers[0].LoadBalancerArn" --output text 2>/dev/null || true)

# ALB ကို Delete လုပ်ပါ
if [[ -n "$ALB_ARN" && "$ALB_ARN" != "None" ]]; then
    echo "Deleting ALB: $ALB_ARN"
    aws elbv2 delete-load-balancer --load-balancer-arn "$ALB_ARN"
fi
```

#### အဆင့် ၂: EC2 Instances များကို Terminate လုပ်ပါ
```bash
# Tag Name "production-web" ဖြင့် ရှာဖွေပြီး Terminate ပြုလုပ်ခြင်း
INSTANCE_IDS=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=production-web*" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].InstanceId" --output text)

if [[ -n "$INSTANCE_IDS" ]]; then
    echo "Terminating EC2 instances: $INSTANCE_IDS"
    aws ec2 terminate-instances --instance-ids $INSTANCE_IDS
fi
```

#### အဆင့် ၃: RDS PostgreSQL Database ကို ဖျက်ပါ
```bash
echo "Deleting RDS Database: production-postgres..."
aws rds delete-db-instance \
    --db-instance-identifier "production-postgres" \
    --skip-final-snapshot \
    --delete-automated-backups
```

#### အဆင့် ၄: NAT Gateway နှင့် Elastic IP ကို ဖျက်ပါ (ရှိခဲ့ပါက)
```bash
# NAT Gateway ID ရှာဖွေပြီး ဖျက်ခြင်း
NAT_ID=$(aws ec2 describe-nat-gateways --filter "Name=state,Values=available" --query "NatGateways[0].NatGatewayId" --output text 2>/dev/null || true)
if [[ -n "$NAT_ID" && "$NAT_ID" != "None" ]]; then
    aws ec2 delete-nat-gateway --nat-gateway-id "$NAT_ID"
fi
```

---

## 🔄 ၂။ Production Emergency Rollback Procedures

Production ပေါ်တွင် Deploy အသစ် တင်ပြီးနောက် Application ချို့ယွင်းသွားပါက ချက်ချင်း Rollback ချနိုင်သော နည်းလမ်း (၂) သွယ်:

### နည်းလမ်း ၁: ALB Target Group Traffic Switching (Instant Zero-Downtime Rollback)
- အကယ်၍ Blue-Green စနစ် သုံးထားပါက ALB Listener ၏ Default Rule ကို အဟောင်း (Blue Target Group) ဆီသို့ ၁ စက္ကန့်အတွင်း လွှဲပြောင်းပေးလိုက်ပါ။
```bash
aws elbv2 modify-listener \
    --listener-arn "<LISTENER_ARN>" \
    --default-actions Type=forward,TargetGroupArn="<KNOWN_GOOD_BLUE_TG_ARN>"
```

### နည်းလမ်း ၂: Docker Compose Rollback on EC2
- EC2 အတွင်းသို့ AWS Systems Manager (SSM) ဖြင့် ဝင်ရောက်ပြီး ယခင် image version သို့ ပြန်ဆုတ်ပါ:
```bash
cd /opt/webapps/ecommerce
# Image version အဟောင်းကို ပြန် run ခြင်း
docker compose up -d --no-deps --build web-previous
```
