---
title: Phase 4 Lesson 11 — Ubuntu Server Provisioning & Remote Ops
description: Production Ubuntu Server စတင်တည်ဆောက်ခြင်း Checklist, Hostname, Timezone (timedatectl), NTP Clock Sync, SSH Bastion Host Architecture နှင့် Remote Ops (မြန်မာဘာသာ)
---

# 🚀 Phase 4 — Lesson 11: Ubuntu Server Provisioning & Remote Ops

Cloud Provider တစ်ခု (AWS, GCP, DigitalOcean, Hetzner) ပေါ်တွင် Ubuntu Server အသစ်တစ်လုံး Spin up လုပ်ပြီးပါက Application များကို ချက်ချင်း install မလုပ်သင့်သေးပါ။ Senior Server Engineer တစ်ဦးသည် စနစ်ခိုင်မာလုံခြုံစေရန် **Day-1 Provisioning Checklist** ကို ဦးစွာ စနစ်တကျ လုပ်ဆောင်လေ့ရှိပါသည်။

ဤအခန်းတွင် Production Ubuntu Server အသစ်တစ်လုံး၏ မရှိမဖြစ် **Day-1 Checklist**, **Timezone & NTP Sync**, **Dedicated Non-root Sudo User** နှင့် **SSH Bastion Host Architecture** တို့ကို လေ့လာသွားပါမည်။

---

## 📋 ၁။ Production Ubuntu Server Day-1 Checklist

```
[Day-1 Server Provisioning Checklist]
  ├─ 1. Package Index Update & Initial OS Upgrades
  ├─ 2. Set Meaningful Hostname (e.g. prod-api-01)
  ├─ 3. Set Proper Timezone & Enable NTP Clock Sync
  ├─ 4. Create Dedicated Non-Root Admin User with Sudo
  ├─ 5. Deploy SSH Public Keys (~/.ssh/authorized_keys)
  ├─ 6. Harden SSH Configuration (/etc/ssh/sshd_config)
  └─ 7. Configure and Enable UFW Firewall
```

---

## ⚙️ ၂။ Provisioning အဆင့်ဆင့် လုပ်ဆောင်နည်း

### အဆင့် ၁ — Hostname သတ်မှတ်ခြင်း
Server နာမည်ကို `ubuntu` ဟု မထားဘဲ အခန်းကဏ္ဍအလိုက် နာမည်ပေးပါ:
```bash
sudo hostnamectl set-hostname prod-api-01
# /etc/hosts ဖိုင်တွင်ပါ ထည့်သွင်းပါ
sudo sed -i 's/127.0.1.1.*/127.0.1.1 prod-api-01/' /etc/hosts
```

### အဆင့် ၂ — Timezone နှင့် NTP Clock Synchronization
Server ပေါ်ရှိ Database Logs များနှင့် Application Timestamps များ မှန်ကန်စေရန် Timezone နှင့် Clock Sync ကို သတ်မှတ်ရပါမည်:
```bash
# Timezone စစ်ဆေးခြင်း
timedatectl

# Timezone အား UTC သို့ သတ်မှတ်ခြင်း (Production Server တိုင်း UTC သုံးရပါမည်)
sudo timedatectl set-timezone UTC

# NTP Network Time Synchronization ဖွင့်ခြင်း
sudo timedatectl set-ntp on
```

### အဆင့် ၃ — Dedicated Admin User ဖန်တီးခြင်းနှင့် SSH Key ချိတ်ဆက်ခြင်း
```bash
# ၁။ Admin user အသစ်ဆောက်ပါ
sudo useradd -m -s /bin/bash sysadmin

# ၂။ Sudo အုပ်စုထဲ ထည့်ပါ
sudo usermod -aG sudo sysadmin

# ၃။ SSH Directory နှင့် Authorized Keys ဖိုင် ပြင်ဆင်ပါ
sudo mkdir -p /home/sysadmin/.ssh
sudo chmod 700 /home/sysadmin/.ssh

# သင်၏ Mac SSH Public Key ကို ထည့်ပါ
echo "ssh-ed25519 AAAAC3... your_key" | sudo tee /home/sysadmin/.ssh/authorized_keys
sudo chmod 600 /home/sysadmin/.ssh/authorized_keys
sudo chown -R sysadmin:sysadmin /home/sysadmin/.ssh
```

---

## 🏰 ၃။ SSH Bastion Host (Jump Box) Architecture

Enterprise Cloud စနစ်များတွင် Database နှင့် Backend Application Servers များကို Public Internet မှ တိုက်ရိုက် မမြင်နိုင်သော **Private Subnet** ထဲတွင်သာ ထားရှိပါသည်။

ထိုအခါ ထို Private Servers များထဲသို့ လုံခြုံစွာ ဝင်ရောက်နိုင်ရန် **Bastion Host (Jump Server)** ကို ကြားခံအဖြစ် အသုံးပြုပါသည် -

```
Developer Mac (Home/Office)
       │
       ▼ [ SSH on Public IP: Port 2222 ]
Bastion Host (DMZ / Public Subnet - Hardened & Monitored)
       │
       ▼ [ Internal VPC Private Network ]
Private Application Server / Database (Private IP: 10.0.1.50)
```

### Mac `~/.ssh/config` ဖြင့် တစ်ချက်နှိပ် ဝင်ရောက်နိုင်ရန် ပြင်ဆင်နည်း:
Mac စက်ပေါ်ရှိ `~/.ssh/config` တွင် အောက်ပါအတိုင်း ထည့်သွင်းထားပါက Bastion မှတစ်ဆင့် အလိုအလျောက် ခုန်ကူးဝင်ရောက်နိုင်ပါသည်:

```ini
Host bastion
    HostName 203.0.113.10
    User sysadmin
    IdentityFile ~/.ssh/id_ed25519

Host prod-db
    HostName 10.0.1.50
    User sysadmin
    ProxyJump bastion
    IdentityFile ~/.ssh/id_ed25519
```
*အသုံးပြုပုံ*: `ssh prod-db` ဟု ရိုက်လိုက်ရုံဖြင့် Mac မှ Bastion သို့ ဝင်ပြီး Private DB Server သို့ အလိုအလျောက် ရောက်ရှိသွားပါမည်။

---

## 🏋️ ၄။ Hands-on Practice

1. Ubuntu VM တွင် `timedatectl` ရိုက်ပြီး Local Time, Universal Time နှင့် NTP Status ကို စစ်ဆေးပါ။
2. `sudo timedatectl set-timezone UTC` ပြုလုပ်ပြီး ပြောင်းလဲသွားပုံကို ကြည့်ပါ။
3. `hostnamectl` ဖြင့် လက်ရှိ Hostname ကို စစ်ဆေးပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: Production Server များတွင် Timezone ကို Local Time (ဥပမာ- Asia/Yangon) မထားဘဲ UTC အဘယ်ကြောင့် သတ်မှတ်ကြသနည်း?
2. **မေးခွန်း ၂**: Enterprise Cloud Architecture တွင် Database Server များကို Public IP မပေးဘဲ Bastion Host ၏ နောက်ကွယ် Private Subnet တွင် အဘယ်ကြောင့် ထားရှိရသနည်း?
3. **မေးခွန်း ၃**: SSH Authorized Keys ဖိုင် (`~/.ssh/authorized_keys`) ၏ File Permission သည် အဘယ်ကြောင့် `chmod 600` သာ ဖြစ်ရမည်နည်း?
