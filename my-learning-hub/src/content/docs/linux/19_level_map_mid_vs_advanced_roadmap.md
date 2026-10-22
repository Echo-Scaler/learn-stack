---
title: "19. Linux Level Map - Mid Level vs Advanced Level"
description: "Linux သင်ခန်းစာများကို Mid Level နှင့် Advanced Level ခွဲခြားထားသော လမ်းညွှန်၊ Cloud/DevOps အတွက် Linux ကျွမ်းကျင်မှု Checklist"
---

## 🎯 ဘာကြောင့် Linux ကို ပိုင်နိုင်ရမလဲ?

**Cloud (AWS, GCP, Azure) ၏ ကျောရိုးသည် Linux ဖြစ်သည်။** EC2, Docker, Kubernetes, CI/CD Runner အားလုံး Linux ပေါ်တွင် Run သည်။ Server ပြဿနာတက်လျှင် GUI မရှိ၊ **Terminal တစ်ခုတည်း** ဖြင့် ဖြေရှင်းရသည်။

အောက်ပါ ၆ ခုကို လက်တွေ့ လေ့ကျင့်ရမည်-

| # | ကျွမ်းကျင်ရမည့်အရာ | ဘာကြောင့်လိုလဲ |
| :-: | :--- | :--- |
| 1 | **Files** | Config, Log, App code အားလုံးသည် File |
| 2 | **Permissions** | `Permission denied` သည် နေ့စဉ်ကြုံရသော error |
| 3 | **SSH** | Server ကို ဝင်ရောက်စီမံသော တစ်ခုတည်းသော လမ်းကြောင်း |
| 4 | **Services** | App/Nginx/DB ကို systemd ဖြင့် စီမံ |
| 5 | **Logs** | ပြဿနာ၏ အဖြေသည် Log ထဲတွင် အမြဲရှိသည် |
| 6 | **Network Troubleshooting** | "Site မဝင်နိုင်ဘူး" ကို အဆင့်ဆင့် ရှာနိုင်ရမည် |

---

## 🗺️ Level ခွဲခြားမှု

```
 🟢 Beginner     ->   🟡 MID LEVEL        ->   🔴 ADVANCED LEVEL
 (Lesson 01-05)       (Lesson 06-12,           (Lesson 13-18 +
 Command, Navigate    Lab M1-M8)                Lab A1-A10)
 Permission, apt      Service, Cron, SSH,       Performance, Security,
                      Firewall, Backup          Incident, Automation, HA
```

### 🟢 Beginner (အခြေခံ) - ကျွမ်းပြီးမှ Mid သို့

| Lesson | အကြောင်းအရာ |
| :--- | :--- |
| [01](/linux/01_phase1_lesson1_linux_intro_and_mac_lab/) | Linux Intro & Lab |
| [02](/linux/02_filesystem_hierarchy_and_navigation/) | Filesystem & Navigation |
| [03](/linux/03_file_permissions_ownership_and_sudo/) | Permissions, Ownership, sudo |
| [04](/linux/04_package_management_and_environment_variables/) | Packages & Environment Variables |
| [05](/linux/05_process_management_and_system_resources/) | Process & Resources |

### 🟡 Mid Level (အလယ်အလတ်) - Server တစ်လုံး စီမံနိုင်သူ

| Lesson | အကြောင်းအရာ | Real-work လက်တွေ့ |
| :--- | :--- | :--- |
| [06](/linux/06_systemd_services_and_journalctl_logging/) | systemd & journalctl | App ကို Service အဖြစ် Run |
| [07](/linux/07_cron_jobs_storage_disks_and_mounts/) | Cron, Disk, Mount | Auto backup, Disk ပြည့်ပြဿနာ |
| [08](/linux/08_network_fundamentals_and_dns/) | Network & DNS | Connectivity စစ်ခြင်း |
| [09](/linux/09_ssh_hardening_and_network_tooling/) | SSH Hardening | Key login, Password ပိတ် |
| [10](/linux/10_firewalls_ufw_nftables_and_tls/) | Firewall & TLS | Port ဖွင့်/ပိတ် |
| [11](/linux/11_ubuntu_server_provisioning_and_remote_ops/) | Server Provisioning | Server အသစ် Setup |
| [12](/linux/12_security_hardening_logrotate_and_backups/) | Hardening, Logrotate, Backup | Log မပြည့်စေ၊ Backup |
| ⭐ [**20**](/linux/20_mid_level_real_work_labs/) | **Mid Level Real-Work Labs (M1-M8)** | **လေ့ကျင့်ခန်း ၈ ခု** |

**Mid Level ပြီးလျှင် လုပ်နိုင်ရမည့်အရာ:**
- [ ] Ubuntu Server အသစ်တစ်လုံးကို Key-based SSH ဖြင့် Setup လုပ်နိုင်
- [ ] App တစ်ခုကို systemd service အဖြစ် Run နိုင်၊ crash ဖြစ်လျှင် auto restart
- [ ] Permission error ကို ကိုယ်တိုင်ရှာ၍ ပြင်နိုင်
- [ ] Cron ဖြင့် Backup Schedule လုပ်နိုင်
- [ ] "Site ဝင်မရ" ကို DNS -> Port -> Firewall အစဉ်ဖြင့် စစ်နိုင်

### 🔴 Advanced Level (အဆင့်မြင့်) - Production ကို တာဝန်ယူနိုင်သူ

| Lesson | အကြောင်းအရာ | Real-work လက်တွေ့ |
| :--- | :--- | :--- |
| [13](/linux/13_nginx_architecture_reverse_proxy_and_ssl/) | Nginx, Reverse Proxy, SSL | HTTPS Site တင်ခြင်း |
| [14](/linux/14_application_deployment_php_java_and_databases/) | App Deployment | Zero-downtime deploy |
| [15](/linux/15_bash_scripting_pipes_and_automation/) | Bash, grep/sed/awk | Automation Script |
| [16](/linux/16_docker_devops_containers_and_cloud_vm/) | Docker & Cloud VM | Container deploy |
| [17](/linux/17_monitoring_observability_and_incident_response/) | Monitoring & Incident | Alert, RCA |
| [18](/linux/18_enterprise_production_server_capstone_project/) | Capstone Project | Production Server အပြည့် |
| ⭐ [**21**](/linux/21_advanced_level_real_work_labs/) | **Advanced Real-Work Labs (A1-A10)** | **လေ့ကျင့်ခန်း ၁၀ ခု** |

**Advanced ပြီးလျှင် လုပ်နိုင်ရမည့်အရာ:**
- [ ] Server နှေးနေခြင်းကို CPU / RAM / Disk I/O / Network ခွဲပြီး Root Cause ရှာနိုင်
- [ ] Brute-force တိုက်ခိုက်မှုကို Log မှ တွေ့ပြီး Fail2ban ဖြင့် ပိတ်နိုင်
- [ ] Bash Script ဖြင့် Health check, Backup, Log analysis အလိုအလျောက်လုပ်နိုင်
- [ ] Nginx + HTTPS + Reverse proxy ကို ကိုယ်တိုင် ဆောက်နိုင်
- [ ] Incident ဖြစ်လျှင် အစီအစဉ်တကျ ဖြေရှင်းပြီး Postmortem ရေးနိုင်

### ⚫ Pro Level (Senior DevOps / SRE) - Fleet ကို Design၊ Automate၊ ပျက်လည်းမရပ်စေသူ

| Lab | အကြောင်းအရာ |
| :--- | :--- |
| ⭐ [**22**](/linux/22_pro_level_real_work_labs/) | **Pro Real-Work Labs (P1-P10):** strace/perf, tcpdump, Kernel tuning, LVM, WireGuard VPN, Ansible, Prometheus, systemd sandbox, Disaster Recovery, HA failover |

**Pro ပြီးလျှင် လုပ်နိုင်ရမည့်အရာ:**
- [ ] Log မရှိသော Black-box problem ကို strace/perf/tcpdump ဖြင့် ရှာနိုင်
- [ ] Server အများကို Ansible (IaC) ဖြင့် Idempotent စီမံနိုင်
- [ ] RPO/RTO သတ်မှတ်၍ DR Drill လုပ်ပြီး RTO ကို တိုင်းနိုင်
- [ ] Single Point of Failure ကို HA ဖြင့် ဖယ်ရှားနိုင်
- [ ] Prometheus Alert ဖြင့် Customer မတိုင်ကြားမီ အရင်သိနိုင်

---

## 🧪 လေ့ကျင့်ခန်း လုပ်ပုံ (Lab Environment)

Mac တွင် တိုက်ရိုက် မစမ်းဘဲ **Linux Container** ကို သုံးပါ (Server ကို မထိခိုက်ဘဲ လုံခြုံ)-

```bash
# Ubuntu Lab တစ်ခု (systemd မလိုသော Lab အတွက်)
docker run -it --rm --name lab ubuntu:22.04 bash
apt update && apt install -y sudo vim curl iproute2 net-tools procps iputils-ping dnsutils

# systemd, SSH လိုသော Lab အတွက် - Ubuntu VM (Multipass)
brew install --cask multipass
multipass launch 22.04 --name lab1 --memory 2G --disk 15G
multipass shell lab1
```

> ⚠️ Lab တိုင်းကို **Practice Server တွင်သာ** လုပ်ပါ။ Production Server တွင် `rm -rf`, `chmod -R`, Firewall ပြင်ခြင်းတို့ကို မစမ်းပါနှင့်။

## 📘 လေ့ကျင့်ခန်း ပုံစံ (Real-Work Format)

Lab တိုင်းတွင် ဤပုံစံအတိုင်း ရေးထားသည်-
1. **📋 Scenario** - အလုပ်ခွင်တွင် ကြုံရသော အခြေအနေ
2. **🎯 ရည်ရွယ်ချက်**
3. **🛠️ အဆင့်ဆင့် လုပ်ရန်** (Command + ရှင်းလင်းချက်)
4. **✅ စစ်ဆေးရန်** (အောင်မြင်ကြောင်း သက်သေ)
5. **🧠 ဘာကြောင့်လဲ** (Real-work မှာ ဘာကြောင့်အရေးကြီးလဲ)
