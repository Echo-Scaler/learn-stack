---
title: "AWS WAF — Complete Master Architectural Guide"
description: "AWS WAF (Web Application Firewall) — Protects web applications from common web exploits ကို မြန်မာလို အခြေခံမှ စတင်၍ Web ACLs, Managed Rules, Rate-limiting, SQLi, XSS နှင့် SAA-C03 Guide"
---

# AWS WAF (Web Application Firewall)
### Layer 7 Web Application Protection Against Exploits, Bots & DDoS Attacks

AWS WAF သည် ဝဘ်ဆိုက်များနှင့် API များကို အင်တာနက်ပေါ်ရှိ အဖြစ်များဆုံးသော ဆိုက်ဘာတိုက်ခိုက်မှုများ (OWASP Top 10: SQL Injection, Cross-Site Scripting - XSS) နှင့် မသမာသော Botnet တိုက်ခိုက်မှုများမှ အချိန်နှင့်တပြေးညီ စစ်ထုတ်ကာကွယ်ပေးသော **Layer 7 Application Firewall Service** ဖြစ်ပါသည်။

---

## 1. What is it? (အဓိပ္ပာယ်နှင့် ဘာကြောင့်လိုအပ်သလဲ)

သမားရိုးကျ Network Firewall (Security Group သို့မဟုတ် NACL) များသည် IP Address နှင့် Port နံပါတ် (Layer 3/4) ကိုသာ စစ်ဆေးနိုင်ပြီး၊ HTTP Request Body သို့မဟုတ် URL Parameter အတွင်း ထည့်သွင်းပေးပို့လာသော မသမာသည့် SQL Code (`' OR '1'='1`) သို့မဟုတ် JavaScript Script Tag (`<script>`) များကို စစ်ထုတ်နိုင်စွမ်း မရှိပါ။

**AWS WAF ၏ အဓိက ရည်ရွယ်ချက်:**  
HTTP/HTTPS (Layer 7) Traffic များကို အသေးစိတ် စစ်ဆေးပြီး (Deep Packet Inspection) Application Server ဆီသို့ မရောက်မီ ကြားခံအဆင့်တွင်ပင် အန္တရာယ်ရှိသော Request များကို ချက်ချင်း Block လုပ်ပစ်ရန် ဖြစ်သည်။

### AWS WAF ချိတ်ဆက်နိုင်သော Target Services ၅ မျိုး:
1. **Amazon CloudFront** (Global Edge အဆင့်တွင် စစ်ထုတ်ခြင်း)
2. **Application Load Balancer (ALB)** (Regional Web Tier တွင် စစ်ထုတ်ခြင်း)
3. **Amazon API Gateway** (REST / HTTP APIs)
4. **AWS AppSync** (GraphQL APIs)
5. **Amazon Cognito User Pools** (Login Brute Force တိုက်ခိုက်မှုများကို ကာကွယ်ခြင်း)

---

## 2. Key Components (Component တစ်ခုချင်းစီ၏ အသုံးဝင်ပုံ)

| Component | နာမည် | အဓိက အသုံးဝင်ပုံ |
| :--- | :--- | :--- |
| **Web ACL (Access Control List)** | Security Rules Container | ဝဘ်ဆိုက်တစ်ခု သို့မဟုတ် ALB တစ်ခုအတွက် ကာကွယ်မည့် Rules များ စုစည်းရာ Container ဖြစ်သည်။ |
| **Rules & Rule Groups** | Inspection Criteria | Request တစ်ခုသည် မသမာမှု ဟုတ်/မဟုတ် စစ်ဆေးသော စည်းကမ်းချက်များ (Priority Number အလိုက် အစဉ်လိုက် အလုပ်လုပ်သည်)။ |
| **AWS Managed Rules (AMR)** | Pre-configured Protection | AWS လုံခြုံရေး အဖွဲ့မှ ပြုစုထားသော အသင့်သုံး Rules များ (ဥပမာ- **Core Rule Set - CRS**, **SQL Database Rule**, **Known Bad Inputs**)။ |
| **Rate-Based Rules** | Anti-DDoS Rate Limiting | သီးခြား IP တစ်ခုမှ ၅ မိနစ်အတွင်း သတ်မှတ်ထားသော Requests ပမာဏ (ဥပမာ- 1,000 requests) ထက် ကျော်လွန်ပါက ထို IP ကို အလိုအလျောက် ယာယီ Block လုပ်ခြင်း။ |
| **Rule Actions** | Response Behavior | **ALLOW** (ခွင့်ပြုမည်), **BLOCK** (403 Forbidden ဖြင့် ပိတ်မည်), **COUNT** (စမ်းသပ်စစ်ဆေးရန်အတွက် ရေတွက်ရုံသာ မှတ်တမ်းတင်မည်), **CAPTCHA** (လူ ဟုတ်/မဟုတ် စစ်ဆေးမည်)။ |

---

## 3. Architecture (Diagram & Inspection Flow)

AWS WAF ၏ Layer 7 Deep Packet Inspection Flow:

```
                            [ Incoming HTTP/HTTPS Traffic ]
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│ AWS WAF (Web ACL Evaluation Layer)                                     │
│                                                                        │
│  ┌─────────────────────────────────┐                                   │
│  │ Rule 1: IP Rate-based Rule      │ ──Exceeded?──► [ ❌ 403 Forbidden ]
│  │ (Max 1000 req / 5 min per IP)   │                                   │
│  └────────────────┬────────────────┘                                   │
│                   │ Pass                                               │
│                   ▼                                                    │
│  ┌─────────────────────────────────┐                                   │
│  │ Rule 2: SQL Injection (SQLi)    │ ──Matched?───► [ ❌ 403 Forbidden ]
│  │ (Deep check Query Strings/Body) │                                   │
│  └────────────────┬────────────────┘                                   │
│                   │ Pass                                               │
│                   ▼                                                    │
│  ┌─────────────────────────────────┐                                   │
│  │ Rule 3: Cross-Site Script (XSS) │ ──Matched?───► [ ❌ 403 Forbidden ]
│  │ (Deep check Headers/Cookies)    │                                   │
│  └────────────────┬────────────────┘                                   │
│                   │ Pass                                               │
│                   ▼                                                    │
│  ┌─────────────────────────────────┐                                   │
│  │ Default Web ACL Action: ALLOW   │                                   │
│  └────────────────┬────────────────┘                                   │
└───────────────────┼────────────────────────────────────────────────────┘
                    │ (Clean Safe Traffic)
                    ▼
     [ Application Load Balancer / Amazon CloudFront / API Gateway ]
                    │
                    ▼
       [ Backend EC2 / Lambda Application Servers ]
```

---

## 4. How it works (အဆင့်လိုက် ရှင်းပြချက်)

1. **Request Interception:** Client ထံမှ Request ရောက်လာသည်နှင့် Target Resource (ALB သို့မဟုတ် CloudFront) မတိုင်မီ WAF Web ACL မှ အရင်ဆုံး ကြားဖြတ် ဖမ်းယူစစ်ဆေးသည်။
2. **Rule Priority Evaluation:** Rule Number အငယ်မှ အကြီးသို့ အစဉ်လိုက် စစ်ဆေးသည်။ မသမာသော SQL Code သို့မဟုတ် Script ပါရှိနေပါက နောက်ကွယ်ရှိ Server သို့ ဒေတာ မရောက်စေဘဲ **HTTP 403 Forbidden** ကို ချက်ချင်း ပြန်ပို့လိုက်သည်။
3. **Bot Control & CAPTCHA:** အလိုအလျောက် ဒေတာဆွဲယူနေသော Web Scrapers များနှင့် Brute-force Bots များကို သံသယရှိပါက **Silent Challenge** သို့မဟုတ် **CAPTCHA ပဟေဠိ** ပြသပြီး စစ်ထုတ်သည်။

---

## 5. Use Cases (လက်တွေ့မှာ ဘယ်အချိန်သုံးသလဲ)

- **SQL Injection (SQLi) & XSS Prevention:** Web Form Input များမှတစ်ဆင့် Database အချက်အလက်များ ခိုးယူခံရခြင်းမှ ကာကွယ်ခြင်း။
- **HTTP Flood DDoS Defense:** ရုတ်တရက် သန်းနှင့်ချီသော အတုအယောင် Requests များဖြင့် Web Server ပျက်ကျအောင် တိုက်ခိုက်မှုများကို Rate-based rules ဖြင့် IP အလိုက် ပိတ်ပင်ခြင်း။
- **Geo-Blocking:** ဝန်ဆောင်မှု မပေးသော နိုင်ငံများထံမှ Web Traffic များကို တစ်ကမ္ဘာလုံး အတိုင်းအတာဖြင့် ကြိုတင် ပိတ်ပင်ထားခြင်း။

---

## 6. Advantages, Disadvantages & Limitations

### အားသာချက်များ (Advantages):
- Application Code ကို တစ်ကြောင်းမျှ ပြင်ဆင်ရန် မလိုဘဲ ဝဘ်ဆိုက်တစ်ခုလုံးကို ချက်ချင်း အကာအကွယ်ပေးနိုင်သည်။
- AWS Managed Rules ကြောင့် Security Patch များကို ကိုယ်တိုင် လိုက်လံ Update လုပ်ရန် မလိုပါ။
- CloudFront နှင့် တွဲဖက်သုံးပါက တိုက်ခိုက်မှုများကို AWS Edge အဆင့်တွင်ပင် ချေမှုန်းနိုင်ခြင်း။

### အားနည်းချက်များနှင့် ကန့်သတ်ချက်များ (Disadvantages & Limitations):
- Web ACL တစ်ခုလျှင် အများဆုံး သုံးနိုင်သော စွမ်းရည် (WCU - Web ACL Capacity Units) ကန့်သတ်ချက် (1,500 WCU) ရှိသည်။

---

## 7. Comparison: AWS WAF vs AWS Shield vs Security Group

| Feature | AWS WAF | AWS Shield Standard | Security Group |
| :--- | :--- | :--- | :--- |
| **OSI Layer** | **Layer 7 (Application)** | **Layer 3 & 4 (Network/Transport)** | Layer 3 & 4 |
| **Protection Focus** | **SQLi, XSS, HTTP Floods, Bots** | **SYN Floods, UDP Reflection DDoS** | IP & Port Firewall |
| **Cost** | Paid per Rule & Request | **100% Free (Built-in)** | Free |
| **Configuration** | စိတ်ကြိုက် Rules ရေးသားရသည် | Zero Configuration (Auto-enabled) | Allow Rules သတ်မှတ်ရသည် |

---

## 8. Hands-on Lab (AWS CLI ဖြင့် စမ်းသပ်ခန်း)

### AWS WAF Web ACL အသစ် ဆောက်လုပ်ခြင်း
```bash
aws wafv2 create-web-acl \
    --name "ProductionWebAcl" \
    --scope REGIONAL \
    --default-action Allow={} \
    --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=ProdWebAclMetric
```

---

## 9. Security, Monitoring, Troubleshooting & Cost

- **Security:** AWS Managed Rules (AWSManagedRulesCommonRuleSet), Block Action with Custom Response (JSON error message)။
- **Monitoring:** CloudWatch Metrics (`BlockedRequests`, `AllowedRequests`), **WAF Sampled Requests** (နောက်ဆုံး ၃ နာရီအတွင်း ပိတ်ပင်ခံရသော တကယ့် IP နှင့် Request header များကို Console တွင် တိုက်ရိုက် ကြည့်ရှုစစ်ဆေးနိုင်ခြင်း)။
- **Cost:** Web ACL တစ်ခုလျှင် $5.00/month + Rule တစ်ခုလျှင် $1.00/month + Request ၁ သန်းလျှင် $0.60။

---

## 10. AWS SAA-C03 Exam Notes, Scenario Questions & Quiz

### 🎯 SAA-C03 Core Exam Traps:
> [!IMPORTANT]
> 1. **SQL Injection & XSS Attack:** စာမေးပွဲတွင် Web Application သို့မဟုတ် API ကို SQL Injection သို့မဟုတ် Cross-Site Scripting မှ ကာကွယ်ရန် မေးပါက အမြဲတမ်း **AWS WAF** ကို ရွေးချယ်ပါ။
> 2. **WAF vs Shield:**  
>    - **AWS WAF:** Layer 7 Application Exploits & Rate-based HTTP flooding.  
>    - **AWS Shield:** Layer 3/4 Network DDoS attacks (SYN floods).  
>    - **AWS Shield Advanced:** 24/7 DDoS Response Team (SRT) နှင့် Financial DDoS cost protection ပါဝင်သည်။

### 📝 SAA-C03 Scenario Questions & Quiz

#### မေးခွန်း ၁
E-Commerce ဝဘ်ဆိုဒ်တစ်ခုသည် Application Load Balancer (ALB) ၏ နောက်ကွယ်ရှိ EC2 Instances များပေါ်တွင် အလုပ်လုပ်နေသည်။ လုံခြုံရေး စစ်ဆေးချက်အရ Hacker များသည် Search Box ထဲတွင် မသမာသော SQL ကုဒ်များ ရိုက်ထည့်၍ Database အချက်အလက်များကို ခိုးယူရန် ကြိုးပမ်းနေကြောင်း တွေ့ရှိရသည်။ Application Code ကို ပြန်လည်မပြင်ဆင်ဘဲ ဤ SQL Injection တိုက်ခိုက်မှုများကို အမြန်ဆုံး မည်သို့ တားဆီးသင့်သနည်း?

- A) EC2 Security Group တွင် Inbound Port 80 ကို ပိတ်မည်။
- B) ALB သို့ AWS WAF Web ACL ချိတ်ဆက်ပြီး AWS Managed Rules (SQL Database Rule Group) ကို ထည့်သွင်းမည်။
- C) Amazon GuardDuty ကို Enable လုပ်မည်။
- D) Subnet NACL တွင် Deny Rule ရေးမည်။

<details>
<summary><b>အဖြေနှင့် ရှင်းလင်းချက်ကို ကြည့်ရန် နှိပ်ပါ</b></summary>

**အဖြေမှန်: B**  
**ရှင်းလင်းချက်:** **AWS WAF** သည် Layer 7 Application Firewall ဖြစ်ပြီး Application Load Balancer (ALB) သို့ တိုက်ရိုက် ချိတ်ဆက်ကာ AWS Managed Rules for SQL Injection ဖြင့် မသမာသော SQL Query ပါဝင်သော Request များကို Code ပြင်ဆင်စရာမလိုဘဲ အလိုအလျောက် Block လုပ်ပေးနိုင်သောကြောင့် ဖြစ်ပါသည်။
</details>
