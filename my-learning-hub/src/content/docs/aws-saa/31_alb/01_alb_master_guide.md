---
title: "Application Load Balancer (ALB) — Complete Master Architectural Guide"
description: "Amazon ALB (Application Load Balancer) — Layer 7 load balancing for HTTP, HTTPS, gRPC, and WebSocket ကို မြန်မာလို အခြေခံမှ စတင်၍ Target Groups, Listener Rules, SNI နှင့် SAA-C03 Guide"
---

# 1. ALB — Application Load Balancer
### Layer 7 Content-Based Routing, Microservices & WebSocket Load Balancing

Amazon Application Load Balancer (ALB) သည် Open Systems Interconnection (OSI) model ၏ **Application Layer (Layer 7)** တွင် အလုပ်လုပ်ပြီး HTTP, HTTPS, gRPC နှင့် WebSocket traffic များကို စစ်ဆေးကာ အသိဉာဏ်ရှိစွာ ခွဲဝေပို့ဆောင်ပေးသော **AWS Managed Load Balancer** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

ခေတ်မီ Web Applications နှင့် Microservices Architecture များတွင် Service တစ်ခုစီအတွက် သီးခြား Load Balancer များ လိုက်လံတပ်ဆင်ပါက ကုန်ကျစရိတ် အလွန်ကြီးမားပြီး Architecture ရှုပ်ထွေးလာသည်။

**Application Load Balancer (ALB) ၏ အဓိက ရည်ရွယ်ချက်:**  
Single Load Balancer တစ်ခုတည်းဖြင့် HTTP Request ၏ URL Path (ဥပမာ- `/api/orders` သို့မဟုတ် `/images/*`)၊ Host Header (ဥပမာ- `app.example.com` သို့မဟုတ် `shop.example.com`)၊ HTTP Headers သို့မဟုတ် Query Strings များကို စစ်ဆေးပြီး သက်ဆိုင်ရာ Backend Target Group များ (EC2, ECS Containers, Lambda) ဆီသို့ တိကျစွာ ခွဲဝေပို့ဆောင်ပေးရန် ဖြစ်သည်။

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Listeners** | Connection Port Receiver | Protocol (HTTP:80, HTTPS:443) နှင့် Port ကို နားထောင်၍ Traffic လက်ခံသော Process ဖြစ်သည်။ |
| **Listener Rules** | Traffic Routing Rules | Request ကို စစ်ဆေးသော စည်းကမ်းချက်များ (Priority အလိုက် စစ်ဆေးသည်)။ Path-based, Host-based, HTTP Header, HTTP Method, Query Parameter, Source IP CIDR အလိုက် ရေးနိုင်သည်။ |
| **Target Groups** | Backend Destination Pools | Traffic လက်ခံမည့် Targets အစုအဝေး ဖြစ်သည်။ Target အမျိုးအစား ၄ မျိုး ရှိသည်: **Instances (EC2)**, **IP Addresses (Private IPs, On-premises)**, **Lambda Functions**, **ALB (Chained ALB)**။ |
| **Health Checks** | Endpoint Health Monitoring | Target တစ်ခုချင်းစီ၏ HTTP Endpoint (ဥပမာ- `GET /healthz`) သို့ စက္ကန့်တိုင်း Ping ပို့၍ Healthy/Unhealthy စစ်ဆေးသည်။ |
| **SNI (Server Name Indication)** | Multi-Domain SSL | Single ALB Listener တစ်ခုတည်းတွင် မတူညီသော Domain များ (ဥပမာ- `a.com`, `b.com`) အတွက် SSL Certificates ပေါင်းများစွာကို တပြိုင်နက် ချိတ်ဆက်ပေးသည်။ |
| **Sticky Sessions (Session Affinity)** | User Session Binding | Cookie အသုံးပြု၍ User တစ်ဦးတည်းထံမှ လာသော Requests များကို တူညီသော Target EC2 ထံသို့သာ အမြဲတမ်း ပို့ဆောင်ပေးသည်။ |

---

## 3. Architecture (Diagram & Path-Based Routing Flow)

ALB ၏ Layer 7 Advanced Content-Based Routing Flow:

```
                            [ Public Internet Clients ]
                                         │
                                         ▼ (HTTPS Port 443 - Single Domain/IP)
┌────────────────────────────────────────┼────────────────────────────────────────┐
│ Application Load Balancer (Public Subnets across Multi-AZ)                     │
│  [ SSL Termination with SNI (Multiple ACM Certificates) ]                      │
│  [ AWS WAF (Layer 7 Attack Filtering) ]                                        │
│                                        │                                       │
│  ┌─────────────────────────────────────┴────────────────────────────────────┐  │
│  │ Listener Rules Engine (Priority-based Evaluation)                        │  │
│  │  • Rule 1: Path = "/api/v1/orders/*"  ──► Route to Target Group: Orders │  │
│  │  • Rule 2: Path = "/images/*"         ──► Route to Target Group: Assets │  │
│  │  • Rule 3: Host = "mobile.app.com"    ──► Route to Target Group: Mobile │  │
│  │  • Default Rule: Route to Target Group: Main Web                        │  │
│  └─────────────────────────────────────┬────────────────────────────────────┘  │
└────────────────────────────────────────┼────────────────────────────────────────┘
                                         │
       ┌─────────────────────────────────┼────────────────────────────────┐
       ▼ (Forward to Port 8080)          ▼ (Forward to Port 3000)         ▼ (Invoke)
┌───────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────┐
│ Target Group: Orders          │ │ Target Group: Assets         │ │ Target Group:│
│ (ECS Fargate Tasks)           │ │ (EC2 Auto Scaling Group)     │ │ Lambda Func  │
│ Dynamic Port: 32768 - 65535   │ │ Private IP: 10.0.12.x        │ │ Serverless   │
└───────────────────────────────┘ └──────────────────────────────┘ └──────────────┘
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Connection Intake:** Client ထံမှ HTTP/HTTPS Request ရောက်လာသည်နှင့် ALB Listener က လက်ခံပြီး SSL/TLS Decryption (SSL Termination) ကို ပြုလုပ်သည်။
2. **Rule Evaluation:** Request ၏ URL Path, Host Name သို့မဟုတ် Headers များကို စစ်ဆေးသည်။ Rule Match ဖြစ်ပါက သက်ဆိုင်ရာ Target Group ဆီသို့ လွှဲပြောင်းပေးသည်။
3. **Dynamic Port Mapping (ECS Integration):** ECS Docker Containers များအတွက် Host Port ကို Random သတ်မှတ်ထားသော်လည်း ALB သည် Target Group တွင် Dynamic Port များကို အလိုအလျောက် သိရှိပြီး Traffic ပို့ဆောင်ပေးနိုင်သည်။
4. **Health Check Management:** Target Group ထဲရှိ EC2 သို့မဟုတ် Container တစ်ခု Unhealthy ဖြစ်သွားပါက ထို Target ဆီသို့ Traffic မပို့တော့ဘဲ ကျန်ရှိသော Healthy Targets များဆီသို့သာ အလိုအလျောက် လမ်းလွှဲပေးသည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **Microservices Routing:** Single ALB ဖြင့် မတူညီသော Container Services ရာပေါင်းများစွာဆီသို့ Path အလိုက် လမ်းကြောင်းခွဲပေးခြင်း။
- **WebSocket & Real-time Web Applications:** Two-way real-time streaming connections (Chat apps, live dashboard) များကို ချောမွေ့စွာ ထိန်းသိမ်းပေးခြင်း။
- **SaaS Multi-Tenant Websites (SNI):** Domain Name ပေါင်း ၂၅ ခုအထိကို Single ALB တစ်ခုတည်းတွင် SSL Certificate သီးခြားစီ တင်၍ တွဲသုံးခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Advanced Layer 7 Content-Based Routing (Path, Host, Headers, Query params)။
- AWS WAF နှင့် တိုက်ရိုက် ချိတ်ဆက်နိုင်ခြင်း။
- ECS Docker Containers များအတွက် Dynamic Port Mapping ရရှိခြင်း။
- Redirect Actions (HTTP မှ HTTPS သို့ Code မလိုဘဲ အလိုအလျောက် Redirect လုပ်ခြင်း)။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- **No Static IP:** ALB သည် Public DNS Name သာ ရရှိပြီး Static Public IP မရရှိပါ။ (Static IP လိုအပ်ပါက NLB သို့မဟုတ် Global Accelerator ရှေ့တွင် ထားရမည်)။
- **Latency:** Layer 7 packet parsing ပြုလုပ်ရသဖြင့် NLB ထက် Latency အနည်းငယ် ပိုသည် (Milliseconds vs Microseconds)။

---

## 7. Comparison: ALB vs NLB vs GWLB vs CLB

| Feature | ALB (Application) | NLB (Network) | GWLB (Gateway) | CLB (Classic - Legacy) |
| :--- | :--- | :--- | :--- | :--- |
| **OSI Layer** | **Layer 7 (HTTP/HTTPS)** | **Layer 4 (TCP/UDP/TLS)** | **Layer 3 & 4 (IP/GENEVE)** | Layer 4 & 7 (Legacy) |
| **Performance** | Milliseconds | **Microseconds (Millions RPS)** | Microseconds | Milliseconds |
| **Static IP / EIP** | No (DNS Name Only) | **Yes (Elastic IP per AZ)** | No | No |
| **Routing Types** | **Path, Host, Header, Query** | Port & Protocol Only | 3rd Party Appliance Fleet | Basic Path Only |
| **Target Types** | EC2, IP, Lambda, ALB | EC2, IP, ALB | 3rd Party Firewalls | EC2 Classic Only |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### Step 1: Application Load Balancer ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-load-balancer \
    --name "my-production-alb" \
    --subnets "subnet-0123456789" "subnet-0987654321" \
    --security-groups "sg-0123456789" \
    --scheme "internet-facing" \
    --type "application" \
    --ip-address-type "ipv4"
```

### Step 2: Target Group ဆောက်လုပ်ခြင်း
```bash
aws elbv2 create-target-group \
    --name "tg-orders-api" \
    --protocol HTTP \
    --port 80 \
    --vpc-id "vpc-0123456789" \
    --target-type instance \
    --health-check-path "/health"
```

### Step 3: HTTPS မှ HTTP Redirect Rule ပါဝင်သော Listener တည်ဆောက်ခြင်း
```bash
aws elbv2 create-listener \
    --load-balancer-arn "arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/my-production-alb/50dc6c495c0c9188" \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** AWS WAF Integration, Security Groups on ALB (Port 80/443 Allow from 0.0.0.0/0), SSL/TLS Security Policies (TLS 1.3/1.2 only), Desync Mitigation Mode.
- **Monitoring:** CloudWatch Metrics (`RequestCount`, `TargetResponseTime`, `HTTPCode_Target_5XX_Count`, `UnHealthyHostCount`), S3 Access Logs (Request logging for auditing).
- **Troubleshooting:**
  - **HTTP 502 Bad Gateway:** Backend EC2 ထံမှ response မရခြင်း သို့မဟုတ် Web server crash ဖြစ်နေခြင်း။
  - **HTTP 504 Gateway Timeout:** Backend Server သည် ALB ၏ Idle Timeout (Default 60 seconds) အတွင်း တုံ့ပြန်မှု မပေးနိုင်ခြင်း။
- **Cost:** Load Balancer hour ($0.0225/hr) + LCU (Load Balancer Capacity Units - $0.008/LCU-hour)။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **Path-Based / Host-Based Routing:** မေးခွန်းတွင် `/images` သို့မဟုတ် `/orders` အလိုက် routing ခွဲရမည်ဆိုပါက အမြဲတမ်း **Application Load Balancer (ALB)** ကို ရွေးချယ်ပါ။
> 2. **Dynamic Port Mapping with ECS:** Single EC2 ပေါ်တွင် တူညီသော Docker Container ပေါင်းများစွာ (Random Ports) run ရန် ALB သာ ထောက်ပံ့ပေးနိုင်သည်။
> 3. **SNI (Server Name Indication):** Single ALB တွင် Domain အများအပြားအတွက် Multiple SSL Certificates တင်ရန် နည်းပညာမှာ SNI ဖြစ်သည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
E-Commerce ဝဘ်ဆိုဒ်တစ်ခုသည် မိုက်ခရိုဆာဗစ် ၂ ခုဖြင့် ဖွဲ့စည်းထားသည်။ အသုံးပြုသူသည် `example.com/checkout` ဟု ခေါ်ပါက Checkout Service သို့ လည်းကောင်း၊ `example.com/catalog` ဟု ခေါ်ပါက Catalog Service သို့ လည်းကောင်း ရောက်ရှိစေလိုသည်။ ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် အသင့်တော်ဆုံး Load Balancer မှာ အဘယ်နည်း?

- A) Network Load Balancer (NLB) ၂ ခု တည်ဆောက်မည်။
- B) Single Application Load Balancer (ALB) ဖြင့် Path-Based Routing Rules သတ်မှတ်မည်။
- C) Classic Load Balancer (CLB) ကို သုံးမည်။
- D) Route 53 Weighted Routing ကို သုံးမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **Application Load Balancer (ALB)** သည် URL Path-based routing (`/checkout`, `/catalog`) ကို Single Load Balancer တစ်ခုတည်းဖြင့် ထောက်ပံ့ပေးနိုင်သောကြောင့် ကုန်ကျစရိတ် အသက်သာဆုံးနှင့် အကောင်းဆုံး Solution ဖြစ်ပါသည်။
</details>
