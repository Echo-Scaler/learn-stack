# ⚡ DevOps 30-Day Starter Plan (ရက် ၃၀ အခြေခံအုတ်မြစ် အထူးလေ့လာမှု စီမံချက်)

> **ရည်မှန်းချက်**: DevOps ၏ အရေးအကြီးဆုံး အခြေခံအုတ်မြစ် (၅) ခု ဖြစ်သော **Linux Administration**, **Networking**, **Git Mastery**, **Bash Automation** နှင့် **Docker Containers** တို့ကို ရက်ပေါင်း ၃၀ အတွင်း လက်တွေ့ကျွမ်းကျင်စေရန်။

> [!IMPORTANT]
> **သတိပြုရန် အချက် (Honest Reality Check)**:
> မည်သူမျှ DevOps ပညာရပ်တစ်ခုလုံး (Kubernetes, AWS Cloud, Terraform, Monitoring အားလုံး) ကို ရက်ပေါင်း ၃၀ ဖြင့် အပြီးတိုင် ကျွမ်းကျင်သူ (Master) မဖြစ်နိုင်ပါ။ ဤ 30-Day Plan သည် လှေကားထစ်၏ ခိုင်မာသော ပထမဆုံး အုတ်မြစ်ဖြစ်ပြီး၊ သင့်အား Terminal တွင် ယုံကြည်မှုအပြည့်ဖြင့် အလုပ်လုပ်နိုင်စေရန်နှင့် နောက်ဆက်တွဲ Cloud/CI-CD များကို လျင်မြန်စွာ ဆက်လက်သင်ယူနိုင်စေရန် ရည်ရွယ်ပါသည်။

---

## 📅 အချိန်ခွဲဝေမှု (Time Commitment)
- **တနင်္လာ မှ သောကြာ**: တစ်နေ့လျှင် ၁.၅ နာရီ မှ ၂ နာရီ (Hands-on CLI Practice)
- **စနေ၊ တနင်္ဂနွေ**: တစ်နေ့လျှင် ၂.၅ နာရီ (Review + Mini Labs / Exercises)
- **စုစုပေါင်း လေ့လာချိန်**: တစ်ပတ်လျှင် ၁၀–၁၂ နာရီ (တစ်လလျှင် နာရီ ၅၀ ခန့်)

---

## 🗓️ တစ်ပတ်ချင်းစီ အသေးစိတ် ဇယား (Week-by-Week Breakdown)

### 🗓️ WEEK 1: Linux Operating System & Server Fundamentals
**ပန်းတိုင်**: GUI မပါသော Linux Server တစ်လုံးတွင် Terminal ဖြင့် လွတ်လပ်စွာ သွားလာ၊ ဖိုင်များနှင့် User Permissions များကို စီမံနိုင်စေရန်။

- **Day 1**: DevOps ဆိုတာဘာလဲ၊ DevOps vs SysAdmin vs SRE မိတ်ဆက်၊ Local Ubuntu Lab Setup (Multipass / UTM / Docker Ubuntu)။
- **Day 2**: Linux Filesystem Hierarchy (`/`, `/home`, `/etc`, `/var`, `/opt`, `/tmp`) နှင့် Directory Navigation (`pwd`, `cd`, `ls -la`, `tree`)။
- **Day 3**: File Management & Text Viewers (`touch`, `mkdir -p`, `cp`, `mv`, `rm -rf`, `cat`, `less`, `head`, `tail -f`)။
- **Day 4**: Linux I/O Streams, Pipes and Redirection (`stdin [0]`, `stdout [1]`, `stderr [2]`, `|`, `>`, `>>`, `2>&1`, `/dev/null`)။
- **Day 5**: Text Processing Power Tools (`grep -rn`, `find /var/log -name "*.log"`, `cut`, `sort`, `uniq -c`, `awk '{print $1}'`)။
- **Day 6**: Linux Users, Groups, File Permissions (`chmod 755`, `chown -R user:group`, Octal vs Symbolic, `sudoers`, `visudo`)။
- **Day 7 (Weekly Checkpoint 1)**: 
  - 🎯 **Hands-on Lab**: Dummy server folder တစ်ခုတွင် web group ဆောက်ပြီး app directory အား permission သတ်မှတ်ခြင်း။ Command ၅၀ လေ့ကျင့်ခန်း ဖြေဆိုခြင်း။

---

### 🗓️ WEEK 2: Linux Administration & Networking Fundamentals
**ပန်းတိုင်**: Server Services များကို systemd ဖြင့် ထိန်းကျောင်းနိုင်ခြင်း၊ Logs စစ်ဆေးနိုင်ခြင်းနှင့် Network Flow ကို နားလည် စုံစမ်းနိုင်ခြင်း။

- **Day 8**: Linux Process Management (`ps aux`, `top`, `htop`, `kill -9`, `pkill`, PID, System Load Average အဓိပ္ပာယ်)။
- **Day 9**: Services and Daemons with `systemd` (`systemctl status|start|stop|restart|enable|disable nginx`, Service unit file ရေးသားပုံ)။
- **Day 10**: Log Management with `journalctl` (`journalctl -u nginx.service -f`, `/var/log/syslog`, Log Rotation concept)။
- **Day 11**: Networking Basics: IPv4, Subnetting (`/24`), Private vs Public IP, Routing Table (`ip route`, Default Gateway)။
- **Day 12**: DNS (Domain Name System): Domain Resolution Flow, `dig`, `nslookup`, `/etc/hosts` file overrides။
- **Day 13**: Ports, Protocols and Tools: TCP vs UDP, `ss -tulpn`, `curl -Iv`, `ping`, Firewall (`ufw allow 80,443/tcp`)။
- **Day 14 (Weekly Checkpoint 2)**: 
  - 🎯 **Hands-on Lab**: Nginx web server ကို port 8080 တွင် run ပြီး `curl` ဖြင့် စမ်းသပ်ခြင်း၊ firewall block လုပ်ခြင်းနှင့် service crash ဖြစ်ပါက logs ကြည့်၍ troubleshoot လုပ်ခြင်း။

---

### 🗓️ WEEK 3: Git Collaboration & Bash Automation
**ပန်းတိုင်**: Team Git Flow ကို ပိုင်နိုင်ပြီး Server တွင် ထပ်ခါတလဲလဲလုပ်ရသော အလုပ်များကို Bash Script ဖြင့် အလိုအလျောက် ခိုင်းစေနိုင်ခြင်း။

- **Day 15**: Git Architecture (Working Tree, Index, Repository, Commits, Branches)။
- **Day 16**: Git Flow & Branching: Merge vs Rebase, Conflict Resolution လက်တွေ့ ဖြေရှင်းခြင်း။
- **Day 17**: Safe Git Habits: `.gitignore`, Git Tags (`v1.0.0`), `git reflog` ဖြင့် ပျောက်သွားသော commit များကို ပြန်ရှာခြင်း။
- **Day 18**: Bash Scripting Essentials: Shebang (`#!/usr/bin/env bash`), `set -euo pipefail`, Variables, Arguments (`$1`, `$#`, `$?`)။
- **Day 19**: Bash Logic: Conditions (`if [ -f "$FILE" ]`), Loops (`for host in $HOSTS; do ... done`), Functions။
- **Day 20**: Task Scheduling with Cron (`crontab -e`, `* * * * *`, Log Output Redirection)။
- **Day 21 (Weekly Checkpoint 3)**: 
  - 🎯 **Hands-on Lab (Project A)**: Server Health Monitor Bash Script ရေးသားပြီး Disk 80% ကျော်ပါက သတိပေးချက် ထုတ်ပေးကာ Cron ဖြင့် ၁၀ မိနစ်တစ်ကြိမ် အလိုအလျောက် ပြေးဆွဲခြင်း။

---

### 🗓️ WEEK 4: Docker Containers & Multi-Service Applications
**ပန်းတိုင်**: Docker ဖြင့် Application များကို Containerize လုပ်နိုင်ပြီး Docker Compose ဖြင့် Fullstack App တစ်ခုကို ပြေးဆွဲနိုင်ခြင်း။

- **Day 22**: Docker Concepts: VMs vs Containers, Image vs Container, Docker Engine Architecture။
- **Day 23**: Docker CLI Mastery: `docker run`, `docker ps -a`, `docker exec -it`, `docker logs -f`, `docker stop`, `docker rm`။
- **Day 24**: Writing Dockerfiles: `FROM`, `WORKDIR`, `COPY`, `RUN`, `ENV`, `EXPOSE`, `CMD` vs `ENTRYPOINT`။
- **Day 25**: Multi-stage Builds: Image Size Optimization (Node.js/Go app image ကို 1GB မှ 50MB သို့ လျှော့ချခြင်း)။
- **Day 26**: Docker Storage (Named Volumes vs Bind Mounts) နှင့် Persistent Data စီမံခြင်း။
- **Day 27**: Docker Networking (Bridge Networks, DNS resolution between containers)။
- **Day 28**: Docker Compose: `docker-compose.yml` ဖြင့် Web App + MySQL + Nginx Stack ကို စီမံခြင်း။
- **Day 29**: Container Debugging: `docker inspect`, `docker stats`, Container Crash Loop ဖြေရှင်းခြင်း။
- **Day 30 (Capstone Milestone & Retrospective)**: 
  - 🎯 **Hands-on Lab (Project B)**: Web App + Database + Nginx Reverse Proxy Multi-container Stack ကို Docker Compose ဖြင့် တည်ဆောက်ပြီး GitHub တွင် Documentation ရေးသား၍ Portfolio အဖြစ် တင်ခြင်း။

---

## 🏆 ရက် ၃၀ အပြီး ရရှိမည့် တိုင်းတာနိုင်သော ရလဒ်များ (Measurable Outcomes)
1. ✅ Linux Terminal ပေါ်တွင် ကြောက်ရွံ့ခြင်းမရှိဘဲ Server Administration ကို ကျွမ်းကျင်စွာ ဆောင်ရွက်နိုင်ခြင်း။
2. ✅ Web Server နှင့် Port များ၏ Network Flow ကို `curl`၊ `ss`၊ `dig` တို့ဖြင့် troubleshoot လုပ်နိုင်ခြင်း။
3. ✅ Bash Script ဖြင့် Backup နှင့် Server Monitoring ကို အလိုအလျောက် ပြုလုပ်နိုင်ခြင်း။
4. ✅ Dockerfile နှင့် Docker Compose ဖြင့် Production-style Container Stack တည်ဆောက်နိုင်ခြင်း။
5. ✅ ရက် ၉၀ Plan (AWS Cloud, Terraform, CI/CD, Kubernetes) သို့ ယုံကြည်မှုအပြည့်ဖြင့် ဆက်လက်တက်လှမ်းနိုင်ခြင်း။
