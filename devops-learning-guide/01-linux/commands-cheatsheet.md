# 📋 Linux Fundamentals Command Cheatsheet for DevOps

> **Production Server စီမံခန့်ခွဲမှုတွင် မဖြစ်မနေ သုံးစွဲရသော မရှိမဖြစ် Commands များ စုစည်းမှု**

---

## 🗂️ ၁။ Directory Navigation & File Operations

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `pwd` | Print Working Directory | `pwd` | လက်ရှိ ရောက်ရှိနေသော absolute path ကို ပြသသည်။ |
| `ls -la` | List all files with details | `ls -lh /var/log` | Hidden files များ အပါအဝင် ဖိုင်အရွယ်အစား (human readable format) ဖြင့် အသေးစိတ် ပြသည်။ |
| `cd` | Change directory | `cd /etc/nginx && cd -` | Directory ပြောင်းသည်။ `cd -` သည် ယခင် directory သို့ ချက်ချင်း ပြန်လှည့်သည်။ |
| `mkdir -p` | Make directory with parents | `mkdir -p /opt/app/logs` | Parent folders မရှိသေးပါက တစ်ပြိုင်နက် ဖန်တီးပေးသည်။ |
| `cp -r` | Copy recursively | `cp -r /src/data /backup/` | Folder တစ်ခုလုံးနှင့် ၎င်းအောက်ရှိ ဖိုင်အားလုံးကို ကူးယူသည်။ |
| `mv` | Move or rename file | `mv app.conf app.conf.bak` | ဖိုင်ရွှေ့ပြောင်းခြင်း သို့မဟုတ် အမည်ပြောင်းလဲခြင်း။ |
| `rm -rf` | Remove recursively and force | `rm -rf /tmp/test-dir` | Folder နှင့် ဖိုင်များကို အတည်ပြုချက် မတောင်းဘဲ အတင်း ဖျက်ပစ်သည် (**သတိဖြင့်သုံးရန်** - root အောက်တွင် မသုံးရ)။ |
| `touch` | Create empty file | `touch .env` | ဖိုင်အလွတ် ဖန်တီးခြင်း သို့မဟုတ် file timestamp update ပြုလုပ်ခြင်း။ |

---

## 📄 ၂။ File Viewing & Reading

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `cat` | Concatenate and print file | `cat /etc/os-release` | ဖိုင်အတွင်းရှိ စာကြောင်းအားလုံးကို terminal ပေါ် တန်းပြသည်။ |
| `less` | Interactive file viewer | `less /var/log/syslog` | ဖိုင်ကြီးများကို စာမျက်နှာအလိုက် ကြည့်ရှုခြင်း (`q` ဖြင့် ထွက်သည်၊ `/keyword` ဖြင့် ရှာဖွေနိုင်သည်)။ |
| `head -n` | View first N lines | `head -n 20 app.log` | ဖိုင်၏ ထိပ်ဆုံး စာကြောင်း ၂၀ ကို ပြသသည်။ |
| `tail -n` | View last N lines | `tail -n 50 app.log` | ဖိုင်၏ အောက်ဆုံး စာကြောင်း ၅၀ ကို ပြသသည်။ |
| `tail -f` | Follow live file changes | `tail -f /var/log/nginx/access.log` | Log ဖိုင်ထဲသို့ စာသားအသစ်များ ဝင်လာတိုင်း real-time စောင့်ကြည့်ပြသသည်။ |

---

## 🔍 ၃။ Text Processing & Searching (grep, find, awk, sed)

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `grep` | Search text patterns | `grep -rnI "DB_PASSWORD" /var/www/` | Binary ဖိုင်များချန်လှပ်၍ line number ဖြင့် recursive ရှာဖွေသည်။ |
| `grep -v` | Invert match (exclude) | `grep -v "^#" config.conf` | `#` ဖြင့် စသော comment စာကြောင်းများကို ဖယ်ထုတ်ပြီး ပြသသည်။ |
| `find` | Search files by criteria | `find /var/log -type f -mtime +30` | လွန်ခဲ့သော ၃၀ ရက်ကျော်က ဖိုင်ဟောင်းများကို ရှာဖွေသည်။ |
| `find -exec` | Execute command on found files | `find /tmp -name "*.tmp" -exec rm -f {} \;` | တွေ့ရှိသော `.tmp` ဖိုင်အားလုံးကို တစ်ခါတည်း ဖျက်ပစ်သည်။ |
| `awk` | Pattern scanning & column extraction | `awk -F':' '{print $1, $3}' /etc/passwd` | Delimiter `:` ဖြင့် user name နှင့် UID column ကို ခွဲထုတ်သည်။ |
| `sed` | Stream editor (Search & Replace) | `sed -i 's/PORT=3000/PORT=8080/g' .env` | `.env` ဖိုင်ထဲရှိ port ကို 3000 မှ 8080 သို့ တိုက်ရိုက် အစားထိုးသည်။ |
| `cut` | Remove sections from lines | `cut -d',' -f1,3 users.csv` | Comma ဖြင့် ပထမနှင့် တတိယ column ကို ဖြတ်ထုတ်သည်။ |
| `sort & uniq` | Sort lines and count unique | `cut -d' ' -f1 access.log \| sort \| uniq -c \| sort -nr` | Web log ထဲမှ Request အများဆုံး လာသော IP address များကို ရေတွက်ပြသသည်။ |

---

## 🔒 ၄။ Users, Groups & Permissions

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `chmod` | Change file mode/permissions | `chmod 755 run.sh` | Owner: rwx (7), Group: r-x (5), Others: r-x (5) သတ်မှတ်သည်။ |
| `chmod 600` | Secure read/write only | `chmod 600 ~/.ssh/id_rsa` | Owner သာလျှင် ဖတ်/ရေး ခွင့်ပြုပြီး အခြားသူများအားလုံး ပိတ်ပင်သည်။ |
| `chown` | Change file owner and group | `chown -R www-data:www-data /var/www` | ဖိုင်ပိုင်ရှင် user နှင့် group ကို တစ်ပြိုင်နက် ပြောင်းလဲသည်။ |
| `useradd` | Create new system user | `useradd -r -s /bin/false deploy` | Login ဝင်၍မရသော Service user အသစ် ဖန်တီးသည်။ |
| `usermod -aG` | Append user to group | `usermod -aG docker ubuntu` | `ubuntu` user အား `docker` group သို့ ပေါင်းထည့်သည်။ |
| `visudo` | Edit sudoers safely | `sudo visudo` | Syntax error စစ်ဆေးပြီးမှ သိမ်းဆည်းသော safe sudo editor။ |

---

## ⚙️ ၅။ System Resources & Performance Monitoring

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `uptime` | System uptime & load average | `uptime` | Server ပွင့်နေသောကြာချိန်နှင့် 1, 5, 15 မိနစ် Load Average ကို ပြသည်။ |
| `top` | Dynamic process view | `top` | CPU/RAM အများဆုံး စားနေသော process များကို စောင့်ကြည့်သည်။ |
| `htop` | Colorful interactive viewer | `htop` | ပိုမိုလှပပြီး filter လုပ်ရလွယ်ကူသော process viewer။ |
| `free -h` | Display memory usage | `free -h -w` | Total, Used, Free RAM, Buffer/Cache နှင့် Swap ပမာဏကို ပြသည်။ |
| `df -h` | Disk space usage | `df -hT` | Filesystem အမျိုးအစားနှင့် partition အလိုက် နေရာလွတ် ပြသသည်။ |
| `du -sh` | Directory space usage | `du -sh /var/log` | သတ်မှတ်ထားသော folder ၏ စုစုပေါင်း အရွယ်အစားကို ပြသည်။ |
| `ps aux` | Snapshot of all processes | `ps aux \| grep nginx` | လက်ရှိ စနစ်အတွင်း ပြေးဆွဲနေသော process အားလုံးကို ပြသည်။ |
| `kill -15` | Graceful termination (SIGTERM) | `kill -15 1234` | Process အား အန္တရာယ်ကင်းစွာ ပိတ်သိမ်းရန် အချက်ပြသည်။ |
| `kill -9` | Force kill (SIGKILL) | `kill -9 1234` | တုံ့ပြန်မှု မရှိတော့သော process ကို ချက်ချင်း အတင်းသတ်ပစ်သည်။ |

---

## 🚀 ၆။ Systemd & Service Management

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `systemctl start` | Start a service | `sudo systemctl start nginx` | Service ကို ချက်ချင်း စတင် ပြေးဆွဲသည်။ |
| `systemctl stop` | Stop a service | `sudo systemctl stop nginx` | Service ကို ရပ်တန့်သည်။ |
| `systemctl restart` | Restart a service | `sudo systemctl restart nginx` | Service ကို ပိတ်ပြီး ပြန်ဖွင့်သည်။ |
| `systemctl reload` | Reload configuration | `sudo systemctl reload nginx` | Traffic မပြတ်တောက်စေဘဲ config သစ်ကို reload လုပ်သည်။ |
| `systemctl enable` | Enable auto-start on boot | `sudo systemctl enable docker` | Server ပြန်တက်လာတိုင်း service အလိုအလျောက် ပွင့်စေသည်။ |
| `systemctl status` | Check service status | `systemctl status postgresql` | Service အခြေအနေ (active/dead/failed) နှင့် recent logs ကို ပြသည်။ |
| `systemctl daemon-reload` | Reload unit files | `sudo systemctl daemon-reload` | Unit file ပြင်ဆင်ပြီးတိုင်း systemd daemon အား အသိပေးရန် run ရသည်။ |
| `journalctl -u` | Inspect service logs | `journalctl -u nginx -f -n 100` | Nginx service ၏ နောက်ဆုံး log အကြောင်း ၁၀၀ ကို live စောင့်ကြည့်သည်။ |

---

## 🌐 ၇။ Networking & Connectivity Commands

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `ss -tulpn` | Listening sockets & ports | `sudo ss -tulpn` | TCP/UDP port များတွင် မည်သည့် process များ နားထောင်နေသည်ကို ပြသည်။ |
| `ip a` | IP addresses & interfaces | `ip addr show eth0` | Network interfaces များနှင့် သတ်မှတ်ထားသော IP များကို ပြသည်။ |
| `ip route` | Routing table | `ip route show` | Default gateway နှင့် routing rules များကို ပြသသည်။ |
| `curl -Iv` | Verbose HTTP/HTTPS request | `curl -Iv https://example.com` | HTTP request/response headers နှင့် SSL handshake ကို စစ်ဆေးသည်။ |
| `ping` | ICMP connectivity check | `ping -c 4 8.8.8.8` | Packet loss ရှိမရှိနှင့် Round-trip time ကို စစ်ဆေးသည်။ |
| `dig` | DNS lookup query | `dig +short example.com A` | Domain ၏ A record IP ကို တိုက်ရိုက် မေးမြန်းသည်။ |
| `traceroute` | Trace network path | `traceroute google.com` | Packet ဖြတ်သန်းသွားသော router hops များကို လမ်းကြောင်းလိုက် ပြသသည်။ |
| `ufw status` | Firewall rules status | `sudo ufw status verbose` | Ubuntu Firewall အခြေအနေနှင့် ဖွင့်ထားသော port များကို ပြသည်။ |

---

## 📦 ၈။ Archive & Compression

| Command | အဓိက အသုံးပြုပုံ | လက်တွေ့ ဥပမာ | ရှင်းလင်းချက် |
|---|---|---|---|
| `tar -czvf` | Create compressed tar.gz | `tar -czvf backup.tar.gz /var/www/app` | Folder တစ်ခုလုံးကို tarball အဖြစ် ချုံ့သိမ်းသည်။ |
| `tar -xzvf` | Extract compressed tar.gz | `tar -xzvf backup.tar.gz -C /opt/` | ချုံ့ထားသော tar.gz ဖိုင်ကို သတ်မှတ်ထားသော folder တွင် ဖြည်ထုတ်သည်။ |
| `zip -r` | Create zip archive | `zip -r app.zip ./dist` | Folder တစ်ခုလုံးကို `.zip` ဖိုင်အဖြစ် archive လုပ်သည်။ |
| `unzip` | Extract zip archive | `unzip app.zip -d /target/` | Zip ဖိုင်ကို ဖြည်ထုတ်သည်။ |

---

## ⏰ ၉။ Cron Scheduled Tasks

Crontab Format:
```text
* * * * * command_to_execute
│ │ │ │ │
│ │ │ │ └── Day of week (0 - 6) (0 is Sunday)
│ │ │ └──── Month (1 - 12)
│ │ └────── Day of month (1 - 31)
│ └──────── Hour (0 - 23)
└────────── Minute (0 - 59)
```

| Syntax | လက်တွေ့ အချိန်သတ်မှတ်ချက် |
|---|---|
| `0 2 * * * /scripts/backup.sh` | ညစဉ် နံနက် ၂:၀၀ နာရီတိတိတွင် run သည်။ |
| `*/15 * * * * /scripts/healthcheck.sh` | ၁၅ မိနစ် တစ်ကြိမ် ပုံမှန် run သည်။ |
| `0 0 * * 0 /scripts/weekly-clean.sh` | တနင်္ဂနွေနေ့တိုင်း ညသန်းခေါင်တွင် run သည်။ |
| `@reboot /scripts/on-boot.sh` | Server reboot တက်လာတိုင်း တစ်ကြိမ် run သည်။ |
