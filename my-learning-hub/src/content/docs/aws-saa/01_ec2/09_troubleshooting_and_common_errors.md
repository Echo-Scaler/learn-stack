---
title: "၉။ Troubleshooting & Common Errors"
description: "လုပ်ငန်းခွင်တွင် နေ့စဉ်ကြုံတွေ့ရတတ်သော EC2 Error များနှင့် စနစ်တကျ ပြဿနာဖြေရှင်းနည်း (SSH, HTTP 502/503, Status Checks, Disk Full)"
---

# ၉။ Troubleshooting & Common Errors

EC2 စီမံခန့်ခွဲရာတွင် အင်ဂျင်နီယာများ အများဆုံး ရင်ဆိုင်ရလေ့ရှိသော Error များ၊ အကြောင်းအရင်းများနှင့် စနစ်တကျ ဖြေရှင်းနည်း (Runbook) လမ်းညွှန်:

---

## ၁။ SSH Connection ပြဿနာများ (Troubleshooting Matrix)

```
                       [ ssh -i key.pem user@ip ]
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
[ Connection Timed Out ]                             [ Connection Refused ]
         │                                                   │
• Security Group တွင် Port 22 မဖွင့်ထားခြင်း                • OS အတွင်း SSH Daemon (sshd) ပျက်နေခြင်း
• Route Table တွင် IGW မရှိခြင်း (Private Subnet)   • OS အတွင်းပိုင်း Firewall (UFW/iptables) က ပိတ်ထားခြင်း
• Network ACL Inbound/Outbound ပိတ်နေခြင်း
```

| Error မက်ဆေ့ခ်ျ | ဖြစ်နိုင်ခြေရှိသော အကြောင်းအရင်း | ဖြေရှင်းနည်း |
| :--- | :--- | :--- |
| **`Connection timed out`** | Security Group Inbound တွင် မိမိ IP မှ Port 22 မဖွင့်ထားခြင်း သို့မဟုတ် Subnet သည် Private Subnet ဖြစ်နေခြင်း | Security Group Inbound Rule စစ်ဆေးပါ။ Public Subnet ရှိ Route Table တွင် `0.0.0.0/0 -> igw-xxx` ရှိမရှိ စစ်ဆေးပါ |
| **`Connection refused`** | Packet သည် Instance ဆီ ရောက်သော်လည်း Linux OS အတွင်း `sshd` process မ run နေခြင်း | EC2 Instance Connect သို့မဟုတ် Session Manager ဖြင့် ဝင်၍ `sudo systemctl status sshd` စစ်ဆေးပါ |
| **`Permission denied (publickey)`** | User အမည် မှားယွင်းခြင်း သို့မဟုတ် Key Pair မှားယွင်းခြင်း | OS အလိုက် User အမည် မှန်ကန်အောင် သုံးပါ:<br>• Amazon Linux: `ec2-user`<br>• Ubuntu: `ubuntu`<br>• CentOS: `centos`<br>• Debian: `admin` |
| **`Unprotected Private Key File`** | Local စက်ရှိ `.pem` key ဖိုင်၏ Permission အလွန်ပွပွန်းနေခြင်း | Key ဖိုင်အား Read-only သတ်မှတ်ပါ:<br>`chmod 400 my-key.pem` |

---

## ၂။ HTTP Status Codes အမှားများ (403, 502, 503)

### HTTP 403 Forbidden:
- **အကြောင်းအရင်း:** Web Server (Nginx/Apache) က ဖိုင်ကို ဖတ်ခွင့် (Read Permission) မရှိခြင်း သို့မဟုတ် Directory Listing ပိတ်ထားပြီး `index.html` မရှိခြင်း။
- **ဖြေရှင်းချက်:** `chmod 755 /var/www/html` နှင့် SELinux Context (`restorecon -Rv /var/www/html`) စစ်ဆေးပါ။

### HTTP 502 Bad Gateway:
- **အကြောင်းအရင်း:** Nginx (Reverse Proxy) သည် အလုပ်လုပ်နေသော်လည်း ၎င်းနောက်ကွယ်ရှိ Application Server (PHP-FPM, Node.js, Python Gunicorn, Java Spring Boot) သည် ရပ်တန့်နေခြင်း (Down) သို့မဟုတ် Socket/Port ချိတ်ဆက်မရခြင်း။
- **ဖြေရှင်းချက်:** `sudo systemctl status php-fpm` (သို့မဟုတ် Node app) စစ်ဆေးပြီး Upstream Port မှန်မမှန် `netstat -tulnp` ဖြင့် စစ်ဆေးပါ။

### HTTP 503 Service Unavailable:
- **အကြောင်းအရင်း:** Application Load Balancer (ALB) ၏ Target Group တွင် ကျန်းမာသော Target (Healthy Instance) တစ်ခုမျှ မရှိခြင်း။
- **ဖြေရှင်းချက်:** ALB Target Health Check Path (ဥပမာ- `/healthz` သို့မဟုတ် `/`) ကို စစ်ဆေးပါ။ EC2 Security Group သည် ALB Security Group ထံမှ Inbound Traffic ကို ခွင့်ပြုထားခြင်း ရှိမရှိ စစ်ဆေးပါ။

---

## ၃။ Status Checks ပျက်စီးမှုများ (System vs Instance Status Check)

EC2 Console တွင် **2/2 checks passed** ဖြစ်ရမည့်အစား အမှားပြသနေပါက:

### System Status Check Failed (AWS Hardware ချွတ်ယွင်းမှု):
- **အကြောင်းအရင်း:** AWS Physical Host Server တွင် Network ပျက်ခြင်း၊ Hardware ချွတ်ယွင်းခြင်း သို့မဟုတ် Data Center မီးပြဿနာ ဖြစ်ပေါ်ခြင်း။
- **ဖြေရှင်းချက်:** Instance ကို **Stop** ပြုလုပ်ပြီး **Start** ပြန်လုပ်ပါ (AWS က အလိုအလျောက် အခြား ကျန်းမာသော Physical Host အသစ်သို့ ရွှေ့ပြောင်းပေးပါမည်)။

### Instance Status Check Failed (OS အတွင်းပိုင်း ပျက်စီးမှု):
- **အကြောင်းအရင်း:** OS Kernel Panic ဖြစ်ခြင်း၊ RAM အကုန်ပြည့်သွားခြင်း (OOM Killer)၊ File System ပျက်စီးခြင်း သို့မဟုတ် Network Driver ချွတ်ယွင်းခြင်း။
- **ဖြေရှင်းချက်:**
  1. EC2 Console တွင် **Actions → Monitor and troubleshoot → Get system log** ကို ကြည့်ရှု၍ Crash ဖြစ်ရသည့် Error ကို ဖတ်ပါ။
  2. Instance ကို **Reboot** လုပ်ကြည့်ပါ။
  3. မရပါက Root EBS Volume ကို Detach လုပ်၍ အခြား Rescue Instance တစ်ခုတွင် Secondary Volume အဖြစ် Attach ဆွဲကာ File System ပြင်ဆင်ပါ။

---

## ၄။ Disk Full (`No space left on device`) ဖြေရှင်းနည်း

Application များ Log အလွန်ထွက်၍ Disk ပြည့်သွားပါက Server သည် Boot မတက်နိုင်တော့ဘဲ ဝန်ဆောင်မှု ရပ်တန့်သွားတတ်ပါသည်။

### 💡 AWS Elastic Volumes နည်းပညာဖြင့် Downtime မရှိဘဲ နေရာချဲ့နည်း:
1. AWS Console သို့မဟုတ် CLI တွင် ချိတ်ဆက်ထားသော EBS Volume Size ကို တိုးမြှင့်ပါ (ဥပမာ- 20GB မှ 50GB သို့):
   ```bash
   aws ec2 modify-volume --volume-id vol-0123456789abcdef0 --size 50
   ```
2. OS အတွင်းသို့ SSH/SSM ဖြင့် ဝင်ရောက်ပြီး Partition ကို ချဲ့ပါ:
   ```bash
   # Partition နေရာ ချဲ့ခြင်း
   sudo growpart /dev/nvme0n1 1
   ```
3. File System ပေါ် မူတည်၍ နေရာချဲ့ပါ (Server Restart လုပ်စရာ လုံးဝ မလိုပါ):
   ```bash
   # XFS File System ဖြစ်ပါက:
   sudo xfs_growfs -d /

   # EXT4 File System ဖြစ်ပါက:
   sudo resize2fs /dev/nvme0n1p1
   ```

---

## ၅။ Burstable Performance (T-series) CPU Credit Exhaustion

`t3.micro`, `t4g.small` ကဲ့သို့ T-Series Instance များသည် ပုံမှန်အချိန်တွင် CPU Credit စုဆောင်းထားပြီး Traffic များလာချိန်တွင် Burst လုပ်ကြသည်။
- **ပြဿနာ:** Traffic အကြာကြီး တက်နေပါက **CPU Credits များ အားလုံး ကုန်ခမ်းသွားပြီး** Instance ၏ CPU ကို Baseline (ဥပမာ- 10% သို့မဟုတ် 20%) သို့ အတင်းအကျပ် ကန့်သတ်ချခံရသဖြင့် Server အလွန်လေးသွားသည်။
- **ဖြေရှင်းချက်:**
  1. `T3 Unlimited` Mode ကို ဖွင့်ထားပါ (Credit ကုန်သွားသော်လည်း အပိုစရိတ် အနည်းငယ်ပေး၍ Full Speed ဆက်သွားနိုင်သည်)။
  2. Production Steady-State Workload များအတွက် T-Series အစား Compute-Optimized ဖြစ်သော **`c6i` သို့မဟုတ် `m6i`** သို့ ပြောင်းလဲ Upgrade လုပ်ပါ။
