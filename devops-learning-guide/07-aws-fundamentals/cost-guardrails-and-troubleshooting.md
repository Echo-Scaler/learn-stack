# 🛡️ AWS Cost Guardrails & Cloud Troubleshooting Guide

> **AWS Free Tier ကုန်ကျစရိတ် မတက်စေရန် ကာကွယ်ရေး စည်းမျဉ်းများ၊ Billing Alarms တပ်ဆင်နည်း၊ Lab Cleanup စာရင်းနှင့် Common Cloud Incidents ဖြေရှင်းနည်း**

---

## 💰 ၁။ AWS Free Tier Traps & Cost Prevention Checklist

AWS Free Tier အသုံးပြုရာတွင် မမျှော်လင့်ဘဲ ဒေါ်လာရာချီ ဘေလ်မတက်စေရန် အောက်ပါ **"Deadly Cost Traps" (၅) ခု** ကို မဖြစ်မနေ ရှောင်ကြဉ်ရပါမည်:

1. **Trap 1: NAT Gateway Left Running ($32/month)**
   - NAT Gateway သည် တစ်နာရီလျှင် ~$0.045 ကျသင့်ပြီး Free tier တွင် **လုံးဝ မပါဝင်ပါ**။
   - **စည်းမျဉ်း**: Lab စမ်းသပ်ပြီးသည်နှင့် VPC Console ➜ NAT Gateways သို့ သွား၍ **Delete NAT Gateway** ချက်ချင်း လုပ်ပါ။ ၎င်းနှင့် တွဲထားသော Elastic IP (EIP) ကိုလည်း **Release** ပြုလုပ်ပါ။
2. **Trap 2: Unattached Elastic IPs ($3.60/month per IP)**
   - Elastic IP (Static Public IP) ကို EC2 နှင့် ချိတ်မထားဘဲ အလွတ် ထားရှိပါက AWS မှ ပိုက်ဆံ ကောက်ခံပါသည်။
3. **Trap 3: Abandoned EBS Volumes ($0.10/GB/month)**
   - EC2 instance ကို Terminate လုပ်သော်လည်း Root disk မဟုတ်သော Additional EBS volume များ ကျန်ရှိနေတတ်သည်။
4. **Trap 4: Multi-AZ RDS Instances**
   - Free Tier တွင် **Single-AZ db.t3.micro / db.t4g.micro** သာ အခမဲ့ ဖြစ်သည်။ Multi-AZ checkmark ကို ရွေးမိပါက ပိုက်ဆံ စတင် ဖြတ်တောက်ပါသည်။
5. **Trap 5: Application Load Balancer (ALB)**
   - ALB သည် နာရီအလိုက် ကုန်ကျစရိတ် ရှိသဖြင့် Lab စမ်းသပ်ပြီးပါက အမြဲ Delete ပြုလုပ်ရပါမည်။

---

## ⏰ ၂။ Step-by-Step Lab Teardown Checklist (စမ်းသပ်ပြီးတိုင်း ရှင်းလင်းရန် စာရင်း)

Lab တစ်ခု စမ်းသပ်ပြီးဆုံးတိုင်း အောက်ပါ အစဉ်အတိုင်း Resource များကို Delete/Terminate လုပ်ပါ:

- [ ] **Step 1**: Application Load Balancer (ALB) ကို Delete လုပ်ပါ။
- [ ] **Step 2**: EC2 Instances များကို **Terminate** ပြုလုပ်ပါ (Stop မဟုတ်ပါ၊ Terminate လုပ်မှ disk ပါ ပျက်ပါမည်)။
- [ ] **Step 3**: RDS Database ကို Delete ပြုလုပ်ပါ (Final Snapshot မလိုပါက "No snapshot" ရွေးပါ)။
- [ ] **Step 4**: NAT Gateways များကို Delete ပြုလုပ်ပါ။
- [ ] **Step 5**: Elastic IPs (EIPs) များကို **Release** ပြုလုပ်ပါ။
- [ ] **Step 6**: S3 Buckets ထဲရှိ စမ်းသပ်ဖိုင်များကို Empty လုပ်ပြီး Bucket ကို Delete လုပ်ပါ။

---

## 🚨 ၃။ Common Cloud Incidents & Troubleshooting

### Scenario 1: Cannot Connect to EC2 via SSH (`Connection Timed Out`)
- **စုံစမ်းစစ်ဆေးနည်း**:
  1. EC2 Instance တွင် Public IP ရှိမရှိ စစ်ဆေးပါ။
  2. Instance ချိတ်ထားသော **Security Group Inbound Rules** တွင် Port 22 ကို သင်၏ My IP (သို့မဟုတ် `0.0.0.0/0`) ဖြင့် ဖွင့်ထားခြင်း ရှိမရှိ စစ်ပါ။
  3. Instance တည်ရှိသော Subnet ၏ **Route Table** တွင် `0.0.0.0/0 ➜ igw-xxxx` (Internet Gateway) လမ်းကြောင်း ပါမပါ စစ်ပါ။

### Scenario 2: EC2 in Private Subnet Cannot Download Packages (`apt update` fails)
- **စုံစမ်းစစ်ဆေးနည်း**:
  1. Private Subnet ရှိ Server များသည် အပြင်သို့ ထွက်ရန် **NAT Gateway** လိုအပ်ပါသည်။
  2. Public Subnet တွင် NAT Gateway ရှိမရှိ စစ်ပါ။
  3. Private Subnet ၏ Route Table တွင် `0.0.0.0/0 ➜ nat-xxxx` လမ်းကြောင်း ချိတ်ဆက်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။

### Scenario 3: S3 Bucket Upload Fails with `403 Access Denied`
- **စုံစမ်းစစ်ဆေးနည်း**:
  1. EC2 မှ တင်ခြင်းဖြစ်ပါက EC2 တွင် `AmazonS3FullAccess` (သို့မဟုတ် တိကျသော bucket policy) ပါဝင်သော **IAM Role (Instance Profile)** ချိတ်ထားခြင်း ရှိမရှိ စစ်ပါ။
  2. Bucket Policy တွင် `Deny` rule တစ်ခုခု ရှိနေခြင်း ရှိမရှိ စစ်ဆေးပါ။
