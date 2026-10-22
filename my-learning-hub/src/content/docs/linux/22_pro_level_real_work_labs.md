---
title: "22. Pro Level Real-Work Labs (P1-P10)"
description: "Linux Pro / Senior SRE level လက်တွေ့ လေ့ကျင့်ခန်း ၁၀ ခု - strace, tcpdump, kernel tuning, LVM, WireGuard VPN, Ansible, Prometheus, DR, HA၊ Step-by-step ဗမာလို"
---

> ⚫ **Pro Level (Senior DevOps / SRE)** - "ပြဿနာကို ဖြေရှင်းသူ" မှ **"ပြဿနာမဖြစ်အောင် Design လုပ်သူ"** သို့။
> ကြိုတင်လိုအပ်ချက်: [Mid Labs (M1-M8)](/linux/20_mid_level_real_work_labs/) နှင့် [Advanced Labs (A1-A10)](/linux/21_advanced_level_real_work_labs/) ပြီးထားရမည်။

## 🧭 Pro Level ဆိုတာ ဘာလဲ?

| Level | စဉ်းစားပုံ | ဥပမာ |
| :--- | :--- | :--- |
| 🟡 Mid | Server **တစ်လုံး** ကို စီမံ | Service run၊ backup |
| 🔴 Advanced | ပြဿနာကို **Root cause ရှာ** | OOM၊ Performance |
| ⚫ **Pro** | **Fleet (Server အများ)** ကို Design၊ Automate၊ ပျက်လည်းမရပ်စေ | Ansible၊ HA၊ DR၊ Observability |

| Lab | ခေါင်းစဉ် | Pro ကျွမ်းကျင်မှု |
| :-: | :--- | :--- |
| P1 | strace / perf / lsof ဖြင့် Black-box debug | Deep Debugging |
| P2 | tcpdump နှင့် TCP အတွင်းသား | Network Forensics |
| P3 | High-traffic Kernel Tuning (sysctl) | Performance Engineering |
| P4 | LVM Online Resize & Filesystem Recovery | Storage |
| P5 | WireGuard VPN + NAT Gateway | Network Architecture |
| P6 | SSH Bastion + Ansible Automation | Config Management |
| P7 | Prometheus + Grafana + Alertmanager | Observability |
| P8 | systemd Sandboxing & Least Privilege | Security Engineering |
| P9 | Disaster Recovery (restic, RPO/RTO) | Resilience |
| P10 | High Availability (keepalived + Nginx) | HA Architecture |

> ⚠️ Lab အားလုံးကို **Practice VM အနည်းဆုံး ၂-၃ လုံး** (Multipass) ပေါ်တွင်သာ လုပ်ပါ။
> ```bash
> for n in pro1 pro2 pro3; do multipass launch 22.04 --name $n --memory 2G --disk 10G; done
> multipass list     # IP များ မှတ်ထား
> ```

---

## ⚫ Lab P1 - strace / perf / lsof ဖြင့် Black-box Debug

**📋 Scenario:** App က `Error: failed to start` ဟုသာ ပြပြီး Log မရှိ၊ Source code မရှိ။ ဘာကြောင့်လဲ?

### strace - Process က Kernel ကို ဘာတောင်းနေလဲ
```bash
sudo apt install -y strace linux-tools-generic lsof ltrace

# Program စတင်စဉ် ဖိုင်ဖွင့်ခြင်းများကိုသာ ကြည့်
strace -f -e trace=openat,connect,execve myprogram 2>&1 | head -50

# "ENOENT" (ဖိုင်မရှိ) နှင့် "EACCES" (Permission) များကိုသာ ရှာ
strace -f -e trace=file myprogram 2>&1 | grep -E "ENOENT|EACCES"
```

### စမ်းသပ်ဖန်တီး
```bash
cat > /tmp/broken.sh <<'EOF'
#!/bin/bash
source /etc/myapp/config.env      # ဤဖိုင် မရှိ
echo "started"
EOF
chmod +x /tmp/broken.sh
strace -f -e trace=file /tmp/broken.sh 2>&1 | grep ENOENT
# openat(AT_FDCWD, "/etc/myapp/config.env", O_RDONLY) = -1 ENOENT  <- အဖြေ!
```

### Running process ကို Attach လုပ်ခြင်း
```bash
sudo strace -p $(pgrep -f myapp | head -1) -c          # Syscall အရေအတွက်/အချိန် ဇယား (Ctrl+C)
sudo strace -p PID -T -e trace=network                 # Network call ၏ အချိန်
sudo strace -p PID -e trace=write -s 200               # ဘာရေးနေသလဲ
```

### lsof - ဖိုင်/Port/Connection
```bash
sudo lsof -p PID                  # Process ဖွင့်ထားသည်အားလုံး
sudo lsof -i :8000                # Port ကို ဘယ်သူသုံး
sudo lsof -u www-data | head
sudo lsof +L1                     # ဖျက်ပြီးသော်လည်း ဖွင့်ထား (Disk space)
sudo lsof -iTCP -sTCP:ESTABLISHED -n -P | head
ls -l /proc/PID/fd | wc -l        # File descriptor အရေအတွက်
```

### perf - CPU ကို ဘယ် function စားနေလဲ
```bash
sudo perf top                                  # Live
sudo perf record -F 99 -g -p PID -- sleep 30
sudo perf report --stdio | head -40
```

### CPU Flame Graph (အမြင်ရှင်းရန်)
```bash
git clone --depth 1 https://github.com/brendangregg/FlameGraph /tmp/fg
sudo perf script | /tmp/fg/stackcollapse-perf.pl | /tmp/fg/flamegraph.pl > /tmp/flame.svg
# Browser ဖြင့် ဖွင့် - အကျယ်ဆုံး bar = CPU စားဆုံး function
```

### ✅ စစ်ဆေးရန်
Source မရှိသော Program တစ်ခုကို `strace` ဖြင့် "ဘယ်ဖိုင်ကို ရှာမတွေ့လို့ ပျက်သည်" ဆိုသည်ကို ၂ မိနစ်အတွင်း ပြောနိုင်ရမည်။

### 🧠 ဘာကြောင့်လဲ
Log မရှိ/အသုံးမဝင်သည့်အခါ **Syscall သည် ညာမပြော**။ `strace` ၊ `lsof` ၊ `/proc` သည် Pro တစ်ယောက်၏ နောက်ဆုံးလက်နက်။ ⚠️ Production တွင် `strace` သည် Process ကိုနှေးစေသဖြင့် `-c` သို့ `perf` ကို ဦးစားပေးပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Nginx ကို `chmod 000 /etc/nginx/nginx.conf` ဖြင့်ပျက်စေပြီး `strace` ဖြင့် အကြောင်းရင်းရှာပါ။ ပြင်ပြီး ပြန်ကောင်းစေပါ။

---

## ⚫ Lab P2 - tcpdump နှင့် TCP အတွင်းသား (Network Forensics)

**📋 Scenario:** "တစ်ခါတလေ Request Timeout ဖြစ်တယ်" ဟု ပြောသည်။ `ping` ကောင်း၊ Port ဖွင့်ပါသည်။ ဘာဖြစ်နေလဲ?

### tcpdump အခြေခံ
```bash
sudo apt install -y tcpdump tshark
sudo tcpdump -D                              # Interface စာရင်း
sudo tcpdump -i any -nn port 80 -c 20        # -nn = DNS/port name မဖြေရှင်း
sudo tcpdump -i eth0 -nn host 10.0.0.5 and port 443
sudo tcpdump -i any -nn 'tcp[tcpflags] & (tcp-syn) != 0'      # SYN packets
sudo tcpdump -i any -nn 'tcp[tcpflags] & (tcp-rst) != 0'      # RST (ပြတ်တောက်)
```

### Packet ကို ဖိုင်သို့သိမ်းပြီး Wireshark တွင်ဖတ်
```bash
sudo tcpdump -i any -nn -s0 port 80 -w /tmp/web.pcap -G 60 -W 1
tshark -r /tmp/web.pcap -q -z io,stat,1
tshark -r /tmp/web.pcap -Y "http.response.code >= 500"
tshark -r /tmp/web.pcap -q -z follow,tcp,ascii,0 | head -30
```

### TCP 3-way handshake ကို မျက်မြင်ကြည့်
```bash
# Terminal 1
sudo tcpdump -i any -nn port 8000
# Terminal 2
python3 -m http.server 8000 &
curl localhost:8000
```
```
Client -> Server : [S]    SYN
Server -> Client : [S.]   SYN-ACK
Client -> Server : [.]    ACK        <- Connection ထူထောင်ပြီး
Client -> Server : [P.]   HTTP GET
Server -> Client : [F.]   FIN        <- ပိတ်
```

### Connection State စစ်ခြင်း
```bash
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn
ss -tan state time-wait | wc -l
ss -tan state syn-recv | wc -l          # များလျှင် SYN flood?
ss -ti dst 10.0.0.5                     # RTT, retransmit, cwnd
netstat -s | grep -iE "retrans|overflow|drop"
```

### Packet Loss / Latency Simulation (tc netem)
```bash
sudo tc qdisc add dev eth0 root netem delay 200ms loss 5%
ping -c 10 8.8.8.8                       # latency + loss မြင်ရ
curl -w "%{time_total}\n" -o /dev/null -s http://example.com
sudo tc qdisc del dev eth0 root          # ပြန်ဖယ်
```

### Troubleshooting Cheat-sheet
| tcpdump တွင်မြင်ရသည် | အဓိပ္ပါယ် |
| :--- | :--- |
| SYN ထပ်ခါထပ်ခါ၊ SYN-ACK မရ | Firewall drop / Server ကျ |
| SYN -> RST | Port ပိတ် (Connection refused) |
| Retransmission များ | Packet loss / Network ညံ့ |
| Window size 0 | Receiver နှေး (App မဖတ်နိုင်) |
| TLS Alert after ClientHello | Cert/Protocol မကိုက် |

### ✅ စစ်ဆေးရန်
`tc netem` ဖြင့် loss 5% ထည့်ပြီး `ss -ti` တွင် retransmit တက်လာသည်ကို သက်သေပြပါ။

### 🧠 ဘာကြောင့်လဲ
"App ပြဿနာလား Network ပြဿနာလား" ခွဲရန် **Packet သည် အဆုံးအဖြတ်ပေး**ပါသည်။ Cloud Support Ticket တွင်လည်း pcap ပေးနိုင်လျှင် ဖြေရှင်းမှု မြန်သည်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `iptables -A INPUT -p tcp --dport 8000 -j DROP` နှင့် `-j REJECT` ၏ tcpdump ရလဒ်ကွာခြားချက်ကို မှတ်တမ်းတင်ပါ (Timeout vs Refused)။

---

## ⚫ Lab P3 - High-traffic Kernel Tuning (sysctl)

**📋 Scenario:** Black Friday Campaign ကြောင့် Traffic ၁၀ ဆတက်မည်။ `Too many open files`, `connection reset`, `SYN drops` မဖြစ်အောင် ကြိုပြင်ဆင်ရမည်။

### အဆင့် ၁ - အရင် Baseline တိုင်း
```bash
sudo apt install -y wrk apache2-utils
# Target (Nginx) တစ်လုံးထားပြီး
wrk -t4 -c400 -d30s http://TARGET_IP/
ab -n 20000 -c 500 http://TARGET_IP/
# Requests/sec နှင့် Errors ကို မှတ်ထား
```

### အဆင့် ၂ - ဘယ် Limit ပြည့်နေလဲ ရှာ
```bash
cat /proc/sys/fs/file-max
ulimit -n
cat /proc/sys/net/core/somaxconn
cat /proc/sys/net/ipv4/tcp_max_syn_backlog
cat /proc/sys/net/ipv4/ip_local_port_range
nstat -az | grep -iE "ListenOverflows|ListenDrops|TCPTimeouts"
```

### အဆင့် ၃ - Tuning
`/etc/sysctl.d/99-highload.conf`
```
# Connection queue
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 8192
net.core.netdev_max_backlog = 16384

# Ephemeral ports (Client/Proxy အတွက်)
net.ipv4.ip_local_port_range = 10240 65535

# TIME_WAIT ကိုင်တွယ်
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1

# Keepalive
net.ipv4.tcp_keepalive_time = 300

# File handles
fs.file-max = 2097152

# SYN flood ကာကွယ်
net.ipv4.tcp_syncookies = 1

# Buffer
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
```
```bash
sudo sysctl --system
sudo sysctl net.core.somaxconn
```

### App/Service Limits
`/etc/systemd/system/nginx.service.d/limits.conf`
```
[Service]
LimitNOFILE=200000
```
`/etc/nginx/nginx.conf`
```
worker_processes auto;
worker_rlimit_nofile 100000;
events { worker_connections 20000; multi_accept on; }
```
```bash
sudo systemctl daemon-reload && sudo systemctl restart nginx
cat /proc/$(pgrep -o nginx)/limits | grep "open files"
```

### အဆင့် ၄ - ပြန်တိုင်း၊ နှိုင်းယှဉ်
```bash
wrk -t4 -c400 -d30s http://TARGET_IP/
```

### ✅ စစ်ဆေးရန်
| Metric | Before | After |
| :--- | :-: | :-: |
| Requests/sec | ? | ? |
| Errors (non-2xx / socket) | ? | ? |
| ListenOverflows | ? | ? |

### 🧠 ဘာကြောင့်လဲ
> **"Measure -> Change ONE thing -> Measure"**။ အင်တာနက်ပေါ်က sysctl ကို ကူးထည့်ရုံဖြင့်မရ - ကိုယ့် Bottleneck ကို ရှာပြီးမှ ပြင်ပါ။ Tuning ကို Git ထဲ (Config as code) သိမ်းထားပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `tcp_tw_reuse` ပြောင်းခြင်းမပြုလုပ်ဘဲ နှင့် ပြုလုပ်ပြီး `ss -tan state time-wait | wc -l` ကို နှိုင်းယှဉ်ပါ။

---

## ⚫ Lab P4 - LVM Online Resize & Filesystem Recovery

**📋 Scenario:** `/var/lib/mysql` partition 90% ပြည့်နေပြီ။ **Downtime မရှိဘဲ** Disk ကြီးရမည်။

### Lab ပြင်ဆင် (Loop device ဖြင့် - Disk အစစ်မလို)
```bash
sudo apt install -y lvm2
sudo dd if=/dev/zero of=/tmp/disk1.img bs=1M count=500
sudo dd if=/dev/zero of=/tmp/disk2.img bs=1M count=500
D1=$(sudo losetup --find --show /tmp/disk1.img)
D2=$(sudo losetup --find --show /tmp/disk2.img)
echo $D1 $D2
```

### LVM ဆောက်
```bash
sudo pvcreate $D1
sudo vgcreate vg_data $D1
sudo lvcreate -L 300M -n lv_db vg_data
sudo mkfs.ext4 /dev/vg_data/lv_db
sudo mkdir -p /mnt/db && sudo mount /dev/vg_data/lv_db /mnt/db
df -h /mnt/db
sudo pvs; sudo vgs; sudo lvs
```
```
 Physical Disk (PV) -> Volume Group (VG) -> Logical Volume (LV) -> Filesystem
   /dev/loop0              vg_data              lv_db               /mnt/db
```

### Data ရေးပြီး Online တိုး
```bash
sudo dd if=/dev/urandom of=/mnt/db/data.bin bs=1M count=200
# Disk အသစ်ထည့်
sudo pvcreate $D2
sudo vgextend vg_data $D2
sudo lvextend -L +400M /dev/vg_data/lv_db
sudo resize2fs /dev/vg_data/lv_db        # (XFS ဆိုလျှင်: xfs_growfs /mnt/db)
df -h /mnt/db                            # Unmount မလုပ်ဘဲ ကြီးသွား!
# (-r flag ဖြင့် lvextend + resize တစ်ခါတည်း: lvextend -r -L +400M ...)
```

### Snapshot ဖြင့် Backup
```bash
sudo lvcreate -s -L 100M -n snap_db /dev/vg_data/lv_db
sudo mkdir -p /mnt/snap && sudo mount -o ro /dev/vg_data/snap_db /mnt/snap
ls /mnt/snap                              # အချိန်တစ်ခု၏ အခြေအနေ
sudo umount /mnt/snap && sudo lvremove -f /dev/vg_data/snap_db
```

### Filesystem ပျက်စီးမှု Recovery
```bash
sudo umount /mnt/db
sudo fsck.ext4 -fn /dev/vg_data/lv_db      # -n = စစ်ကြည့်သာ (မပြင်)
sudo fsck.ext4 -fy /dev/vg_data/lv_db      # ပြင်
sudo mount /dev/vg_data/lv_db /mnt/db
```

### /etc/fstab ဖြင့် Boot တွင်အလိုအလျောက် Mount
```bash
echo "UUID=$(sudo blkid -s UUID -o value /dev/vg_data/lv_db) /mnt/db ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
sudo mount -a          # Error မရှိမှ Reboot လုပ်ပါ
```

### Cleanup
```bash
sudo umount /mnt/db; sudo lvremove -f vg_data; sudo vgremove vg_data
sudo pvremove $D1 $D2; sudo losetup -d $D1 $D2; sudo rm /tmp/disk*.img
sudo sed -i '/mnt\/db/d' /etc/fstab
```

### ✅ စစ်ဆေးရန်
Data.bin ၏ `md5sum` ကို Resize မတိုင်မီ/ပြီးနောက် နှိုင်းယှဉ်၍ Data မပျက်ကြောင်း သက်သေပြပါ။

### 🧠 ဘာကြောင့်လဲ
LVM မသုံးထားသော Server တွင် Disk ကြီးရန် Downtime လိုသည်။ ⚠️ `fstab` မှားလျှင် Server Boot မတက်နိုင် - `nofail` နှင့် `mount -a` စမ်းခြင်းသည် Pro အလေ့အထ။ Cloud တွင် EBS Volume တိုးပြီး `growpart` + `resize2fs` လုပ်သည်လည်း ဤနည်းတူ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** `mdadm` ဖြင့် RAID1 Loop devices ၂ ခုဆောက်ပြီး တစ်ခုကို `--fail` ပြုလုပ်ကာ Data ဆက်ရှိကြောင်း ပြပါ။

---

## ⚫ Lab P5 - WireGuard VPN + NAT Gateway

**📋 Scenario:** Database Server သည် Private Network တွင်သာရှိရမည်။ Developer များသည် VPN ဖြင့်သာ ဝင်ခွင့်ရှိရမည်။

```
 Laptop (10.8.0.2) ==WireGuard==> VPN Server (10.8.0.1, Public IP) ---> Private DB (10.0.1.10)
```

### VM pro1 = VPN Server
```bash
sudo apt install -y wireguard
wg genkey | sudo tee /etc/wireguard/server.key | wg pubkey | sudo tee /etc/wireguard/server.pub
sudo chmod 600 /etc/wireguard/server.key
```
`/etc/wireguard/wg0.conf`
```
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <server.key ၏ တန်ဖိုး>
PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Client 1
PublicKey = <client.pub>
AllowedIPs = 10.8.0.2/32
```

### IP Forwarding ဖွင့်
```bash
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-forward.conf
sudo sysctl --system
sudo ufw allow 51820/udp
sudo systemctl enable --now wg-quick@wg0
sudo wg show
```

### VM pro2 = Client
```bash
sudo apt install -y wireguard
wg genkey | tee client.key | wg pubkey > client.pub
```
`/etc/wireguard/wg0.conf`
```
[Interface]
Address = 10.8.0.2/24
PrivateKey = <client.key>

[Peer]
PublicKey = <server.pub>
Endpoint = PRO1_IP:51820
AllowedIPs = 10.8.0.0/24, 10.0.1.0/24     # VPN + Private subnet သာ (Split tunnel)
PersistentKeepalive = 25
```
```bash
sudo wg-quick up wg0
ping -c 3 10.8.0.1
sudo wg show           # latest handshake ပေါ်ရမည်
```

### NAT ကို နားလည်ရန်
```bash
sudo iptables -t nat -L POSTROUTING -n -v
sudo conntrack -L | head          # apt install conntrack
```
```
 Client(10.8.0.2) -> [VPN Server MASQUERADE: src ကို eth0 IP ပြောင်း] -> Private DB
 DB ၏ ပြန်ဖြေ -> VPN Server ကိုသာ ပြန် (Conntrack table အရ Client ထံ ပြန်လွှဲ)
```

### ✅ စစ်ဆေးရန်
```bash
# VPN ဖွင့်ထား: DB ကို ping/ssh ရ
# VPN ပိတ် (sudo wg-quick down wg0): ရမည်မဟုတ်
sudo tcpdump -i wg0 -nn      # VPN အတွင်း Traffic မြင်ရ (Lab P2 နည်း)
```

### 🧠 ဘာကြောင့်လဲ
Bastion/VPN ဖြင့် **Attack surface ကိုလျှော့ချ**သည် (SSH/DB ကို Internet သို့မဖော်)။ AWS တွင် VPC, NAT Gateway, Site-to-Site VPN တို့၏ အခြေခံမှာ ဤအယူအဆများ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Peer အသစ်ထပ်ထည့်ပြီး `wg set wg0 peer ... remove` ဖြင့် User တစ်ဦး၏ Access ကို ချက်ချင်းရုပ်သိမ်းပါ။ DB ကို `AllowedIPs` ဖြင့်သာ ကန့်သတ်ပါ။

---

## ⚫ Lab P6 - SSH Bastion + Ansible Automation

**📋 Scenario:** Server ၃၀ လုံးတွင် User ထည့်၊ Package တင်၊ Config ပြောင်းရမည်။ တစ်လုံးချင်း SSH ဝင်လုပ်မနေနိုင်ပါ။

### ၁) SSH ProxyJump (Bastion မှတစ်ဆင့်)
`~/.ssh/config`
```
Host bastion
    HostName BASTION_PUBLIC_IP
    User ubuntu
    IdentityFile ~/.ssh/lab_key

Host app-*
    User ubuntu
    ProxyJump bastion
    IdentityFile ~/.ssh/lab_key

Host app-1
    HostName 10.0.1.11
Host app-2
    HostName 10.0.1.12
```
```bash
ssh app-1                       # Bastion မှတစ်ဆင့် တစ်ခါတည်း
scp file.txt app-1:/tmp/
```

### ၂) Ansible Install နှင့် Inventory
```bash
sudo apt install -y ansible
mkdir -p ~/ansible-lab && cd ~/ansible-lab
```
`inventory.ini`
```ini
[web]
app-1
app-2

[db]
db-1 ansible_host=10.0.1.20

[all:vars]
ansible_user=ubuntu
ansible_python_interpreter=/usr/bin/python3
```
```bash
ansible all -i inventory.ini -m ping
ansible web -i inventory.ini -a "uptime"
ansible web -i inventory.ini -b -m apt -a "name=htop state=present update_cache=yes"
```

### ၃) Playbook (Idempotent ဖြစ်ရမည်)
`site.yml`
```yaml
---
- name: Baseline for all servers
  hosts: all
  become: true
  vars:
    deploy_user: deploy
    admin_pubkey: "{{ lookup('file', '~/.ssh/lab_key.pub') }}"

  tasks:
    - name: Install base packages
      apt:
        name: [ufw, fail2ban, htop, curl, unattended-upgrades]
        state: present
        update_cache: true

    - name: Create deploy user
      user:
        name: "{{ deploy_user }}"
        shell: /bin/bash
        groups: sudo
        append: true

    - name: Authorize SSH key
      authorized_key:
        user: "{{ deploy_user }}"
        key: "{{ admin_pubkey }}"

    - name: Harden SSH
      copy:
        dest: /etc/ssh/sshd_config.d/99-hardening.conf
        content: |
          PasswordAuthentication no
          PermitRootLogin no
          MaxAuthTries 3
        validate: "sshd -t -f %s"        # Syntax မှားလျှင် မသုံး (Lock out မဖြစ်)
      notify: reload ssh

    - name: UFW default deny
      ufw: { state: enabled, policy: deny, direction: incoming }

    - name: Allow SSH
      ufw: { rule: allow, port: "22", proto: tcp }

    - name: Fail2ban running
      service: { name: fail2ban, state: started, enabled: true }

  handlers:
    - name: reload ssh
      service: { name: ssh, state: reloaded }

- name: Web servers
  hosts: web
  become: true
  tasks:
    - name: Nginx installed
      apt: { name: nginx, state: present }

    - name: Allow HTTP/HTTPS
      ufw: { rule: allow, port: "{{ item }}", proto: tcp }
      loop: ["80", "443"]

    - name: Deploy index page
      copy:
        content: "Served by {{ inventory_hostname }}\n"
        dest: /var/www/html/index.html
```
```bash
ansible-playbook -i inventory.ini site.yml --syntax-check
ansible-playbook -i inventory.ini site.yml --check --diff     # Dry-run
ansible-playbook -i inventory.ini site.yml                    # အစစ်
ansible-playbook -i inventory.ini site.yml                    # ထပ်run -> changed=0 ဖြစ်ရမည်
```

### ✅ စစ်ဆေးရန်
**ဒုတိယအကြိမ် Run တွင် `changed=0`** ဖြစ်ရမည် (Idempotent)။ လက်ဖြင့် `ufw disable` လုပ်ပြီး Playbook ပြန် Run ကာ ပြန်ပြင်ပေးသည်ကို ကြည့်ပါ (**Drift correction**)။

### 🧠 ဘာကြောင့်လဲ
Pro တွင် **"Server ကို SSH ဝင်ပြီး လက်ဖြင့်မပြင်"**။ Code (Git) ကသာ အမှန်တရား (Infrastructure as Code)။ Server အသစ်ထည့်လျှင် Inventory တွင်ထည့်ပြီး Playbook Run ရုံသာ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Role (`ansible-galaxy init nginx_role`) သို့ ခွဲပါ။ `ansible-vault` ဖြင့် Password များကို Encrypt လုပ်ပါ။ GitHub Actions မှ Playbook Run ပါ။

---

## ⚫ Lab P7 - Prometheus + Grafana + Alertmanager (Observability)

**📋 Scenario:** Customer မတိုင်ကြားမီ **ကိုယ်ကိုယ်တိုင် အရင်သိရမည်**။ Metric၊ Dashboard၊ Alert လိုသည်။

### Docker Compose ဖြင့် Monitoring Stack
`monitoring/docker-compose.yml`
```yaml
services:
  prometheus:
    image: prom/prometheus:v2.54.1
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alerts.yml:/etc/prometheus/alerts.yml:ro
      - promdata:/prometheus
    ports: ["9090:9090"]
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.27.0
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    ports: ["9093:9093"]
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.2.0
    ports: ["3000:3000"]
    volumes: [grafdata:/var/lib/grafana]
    restart: unless-stopped

volumes: { promdata: {}, grafdata: {} }
```

### Monitor လုပ်မည့် Server တိုင်းတွင် node_exporter
```bash
sudo apt install -y prometheus-node-exporter
systemctl status prometheus-node-exporter
curl -s localhost:9100/metrics | head          # Metric များ
```

`prometheus.yml`
```yaml
global:
  scrape_interval: 15s
rule_files: ["/etc/prometheus/alerts.yml"]
alerting:
  alertmanagers:
    - static_configs: [{ targets: ["alertmanager:9093"] }]
scrape_configs:
  - job_name: nodes
    static_configs:
      - targets: ["PRO1_IP:9100", "PRO2_IP:9100", "PRO3_IP:9100"]
```

`alerts.yml`
```yaml
groups:
  - name: server
    rules:
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels: { severity: critical }
        annotations:
          summary: "{{ $labels.instance }} is DOWN"

      - alert: DiskAlmostFull
        expr: (1 - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"} / node_filesystem_size_bytes) * 100 > 85
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "Disk {{ $value | printf \"%.0f\" }}% on {{ $labels.instance }}"

      - alert: HighMemory
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 90
        for: 5m
        labels: { severity: warning }

      - alert: HighCPU
        expr: 100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 10m
        labels: { severity: warning }

      - alert: DiskWillFillIn4h
        expr: predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[1h], 4*3600) < 0
        for: 10m
        labels: { severity: critical }
```

`alertmanager.yml` (Discord/Slack webhook)
```yaml
route:
  receiver: team
  group_by: [alertname, instance]
  group_wait: 30s
  repeat_interval: 4h
receivers:
  - name: team
    webhook_configs:
      - url: "https://YOUR-WEBHOOK-ENDPOINT"
```

```bash
docker compose up -d
# Prometheus: http://localhost:9090/targets  (UP ဖြစ်ရမည်)
# Grafana:    http://localhost:3000 (admin/admin)
#   Add data source -> Prometheus -> http://prometheus:9090
#   Import dashboard ID 1860 (Node Exporter Full)
```

### Alert စမ်းသပ်
```bash
sudo systemctl stop prometheus-node-exporter     # 1 မိနစ်ကြာလျှင် InstanceDown ပေါ်
stress-ng --cpu 4 --timeout 700s                 # HighCPU
```

### Useful PromQL
```
rate(node_network_receive_bytes_total[5m]) * 8          # bits/sec
node_load1 / count without(cpu, mode)(node_cpu_seconds_total{mode="idle"})
node_filesystem_avail_bytes{mountpoint="/"} / 1024^3    # GB ကျန်
```

### ✅ စစ်ဆေးရန်
Targets အားလုံး UP၊ Dashboard တွင် Graph မြင်ရ၊ Node exporter ရပ်လျှင် Alert Webhook ရောက်ကြောင်း ပြပါ။

### 🧠 ဘာကြောင့်လဲ
**Symptom-based Alert** (User ထိခိုက်မှုကို) နှင့် **Predictive Alert** (`predict_linear`) သည် Pro အဆင့်။ Alert များလွန်းလျှင် လူက လျစ်လျူရှုသည် (Alert fatigue) - Actionable ဖြစ်မှသာ Alert လုပ်ပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Nginx Exporter သို့ Blackbox Exporter ထည့်ပြီး Website HTTP probe + SSL သက်တမ်း Alert ရေးပါ။ Loki (Log) ကို ထပ်ထည့်ပါ။

---

## ⚫ Lab P8 - systemd Sandboxing & Least Privilege

**📋 Scenario:** Web App Hack ခံရလျှင်လည်း Attacker က `/etc`, `/home`, Network အားလုံးကို မထိနိုင်စေရ။

### လက်ရှိ Service ၏ လုံခြုံမှု Score
```bash
systemd-analyze security hello.service
# Overall exposure level: 9.6 UNSAFE   <- Lab M4 မှ service
```

### Hardened Unit
`sudo systemctl edit hello` (Override)
```
[Service]
# Filesystem
ProtectSystem=strict           # / ကို Read-only
ProtectHome=true               # /home မမြင်
PrivateTmp=true                # သီးခြား /tmp
ReadWritePaths=/var/lib/hello  # ရေးခွင့်ရှိသည့်နေရာသာ
StateDirectory=hello

# Privilege
NoNewPrivileges=true
CapabilityBoundingSet=
AmbientCapabilities=
PrivateDevices=true

# Kernel
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictNamespaces=true
LockPersonality=true
RestrictRealtime=true
RestrictSUIDSGID=true
MemoryDenyWriteExecute=true

# Network
RestrictAddressFamilies=AF_INET AF_INET6
IPAddressDeny=any
IPAddressAllow=localhost 10.0.0.0/8

# Syscall filter
SystemCallFilter=@system-service
SystemCallFilter=~@privileged @resource
SystemCallArchitectures=native

# Resource
MemoryMax=300M
TasksMax=100
```
```bash
sudo systemctl daemon-reload && sudo systemctl restart hello
systemd-analyze security hello.service     # Score ကျသွားမည် (e.g. 2.x OK)
curl localhost:8000
```

### Attacker တစ်ဦး၏ အမြင်ကို စမ်းသပ်
```bash
# Service အတွင်း Command Run စမ်း (ExecStartPre မှာ ခဏထည့်စမ်း၍ ရလဒ်ကြည့်)
sudo systemd-run --pty -p User=hello -p ProtectSystem=strict -p ProtectHome=true \
  -p PrivateTmp=true bash
# အတွင်းမှာ -
touch /etc/evil            # Read-only file system
ls /home                   # empty
```

### sudo ကိုလည်း Least Privilege
`sudo visudo -f /etc/sudoers.d/deploy`
```
# deploy user သည် hello service ကိုသာ restart လုပ်ခွင့်ရှိ
deploy ALL=(root) NOPASSWD: /bin/systemctl restart hello, /bin/systemctl status hello
```
```bash
sudo -l -U deploy
sudo -u deploy sudo systemctl restart hello     # ရ
sudo -u deploy sudo systemctl stop nginx        # Denied
```

### Linux Capabilities
```bash
getcap -r /usr/bin 2>/dev/null
# Root မဟုတ်ဘဲ Port 80 ဖွင့်ခွင့်သာ ပေး
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/python3.10
# Service တွင်: AmbientCapabilities=CAP_NET_BIND_SERVICE
```

### ✅ စစ်ဆေးရန်
`systemd-analyze security` Score ကို 9.x မှ **4 အောက်** သို့ ချနိုင်ပြီး App ဆက်အလုပ်လုပ်ရမည်။

### 🧠 ဘာကြောင့်လဲ
Prevention ထက် **Blast radius ကိုလျှော့ချ**ခြင်းသည် Pro စိတ်ကူး။ Docker (`--read-only`, `--cap-drop ALL`, `--security-opt no-new-privileges`) တွင်လည်း တူညီသော အယူအဆ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Nginx service ကို Score 3 အောက်ရောက်အောင် Harden လုပ်ပါ (အလုပ်မပျက်စေရ)။ SELinux/AppArmor (`aa-status`) Profile တစ်ခုကို Enforce လုပ်ကြည့်ပါ။

---

## ⚫ Lab P9 - Disaster Recovery (restic, RPO / RTO)

**📋 Scenario:** Server ကို တစ်စက်မျှ မကျန်ဘဲ ဖျက်ပစ်ခံရသည် (Ransomware / `rm -rf /` / Cloud Region ပျက်)။ **RPO ၁ နာရီ၊ RTO ၃၀ မိနစ်** ဖြင့် ပြန်ရမည်။

| Term | အဓိပ္ပါယ် | ဤ Scenario |
| :--- | :--- | :--- |
| **RPO** (Recovery Point Objective) | Data ဘယ်အချိန်ကထိ ဆုံးရှုံးခွင့်ရှိ | ၁ နာရီ -> Backup ၁ နာရီတစ်ခါ |
| **RTO** (Recovery Time Objective) | ဘယ်လောက်ကြာမှ ပြန်ကောင်းရမည် | ၃၀ မိနစ် -> Restore ကို လေ့ကျင့်ထား |

### restic ဖြင့် Encrypted, Deduplicated Backup
```bash
sudo apt install -y restic
export RESTIC_REPOSITORY=/backup/restic-repo          # အမှန်တကယ်တွင် S3/SFTP (Server ပြင်ပ!)
export RESTIC_PASSWORD_FILE=/root/.restic-pass
echo "VeryStrongPassphrase" | sudo tee /root/.restic-pass && sudo chmod 600 /root/.restic-pass

sudo -E restic init
sudo -E restic backup /srv/project /etc /var/www --exclude-caches
sudo -E restic snapshots
sudo -E restic stats
```
S3 / Remote ဖြင့်-
```bash
export AWS_ACCESS_KEY_ID=...; export AWS_SECRET_ACCESS_KEY=...
export RESTIC_REPOSITORY=s3:s3.amazonaws.com/my-backup-bucket
# သို့မဟုတ် SFTP
export RESTIC_REPOSITORY=sftp:backup@10.0.1.50:/backups/web1
```

### Database Backup (Consistent)
```bash
# MySQL (Lock မလိုဘဲ)
mysqldump --single-transaction --routines --triggers appdb | gzip > /var/backups/db_$(date +%F_%H).sql.gz
# PostgreSQL
pg_dump -Fc appdb > /var/backups/appdb_$(date +%F_%H).dump
sudo -E restic backup /var/backups
```

### Retention Policy နှင့် Automation
```bash
sudo -E restic forget --keep-hourly 24 --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```
`/etc/systemd/system/restic-backup.service` + `.timer` (Lab A7 ပုံစံ)
```
[Service]
Type=oneshot
EnvironmentFile=/etc/restic.env
ExecStart=/opt/scripts/restic-backup.sh
```
```
[Timer]
OnCalendar=hourly
RandomizedDelaySec=300
Persistent=true
```

### 🔥 DR Drill (အရေးအကြီးဆုံး) - ဖျက်ပြီး ပြန်တည်ဆောက်
```bash
# ① ရည်ရွယ်ချက်ရှိရှိ ဖျက် (Lab VM တွင်သာ!)
sudo rm -rf /srv/project/*
# ② အချိန်စတင်တိုင်း
time (
  sudo -E restic restore latest --target / --include /srv/project
)
# ③ Integrity စစ်
sudo -E restic check
diff <(find /srv/project | sort) /tmp/before-list.txt
```

### VM အသစ်တွင် Zero မှ ပြန်တည်ဆောက်
```
 ① VM အသစ်ဖန်တီး (Terraform/Multipass)    ~3 min
 ② Ansible Playbook ဖြင့် Baseline (Lab P6)  ~5 min
 ③ restic restore (Data + Config)             ~10 min
 ④ DB restore -> Service start                ~5 min
 ⑤ Health check + DNS switch                  ~5 min
                                       စုစုပေါင်း ≈ 28 min  ✅ RTO ၃၀ မိနစ်အတွင်း
```

### DR Runbook တွင် ပါရမည်
- [ ] Restic password / Cloud credentials ကို **ဘယ်မှာ သိမ်းထားသလဲ** (Server ပေါ်တွင် မဟုတ်ရ!)
- [ ] ပြန်ရမည့် အစီအစဉ် အဆင့်ဆင့်
- [ ] ဆက်သွယ်ရမည့်သူများ
- [ ] နောက်ဆုံး DR Drill ရက်စွဲ နှင့် ကြာချိန်

### ✅ စစ်ဆေးရန်
RTO ကို **တကယ်တိုင်း၍** မှတ်တမ်းတင်ပါ (Estimated မဟုတ်ရ)။ Restore အပြီး App အလုပ်လုပ်ကြောင်း သက်သေပြပါ။

### 🧠 ဘာကြောင့်လဲ
> **"Backup မရှိရင် Hope သာရှိ၊ Restore မစမ်းရင် Backup မရှိ"**။ **3-2-1 Rule** - Copy ၃ ခု၊ Media ၂ မျိုး၊ ၁ ခုကို Off-site။ Ransomware ကာကွယ်ရန် Backup ကို Server မှ **Delete လုပ်မရအောင်** (S3 Object Lock / Append-only) ထားပါ။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** Backup မအောင်မြင်လျှင် Alert ပို့သော (Healthchecks.io style dead-man's-switch) ထည့်ပါ။ Quarterly DR Drill ကို Calendar ထဲထည့်ပါ။

---

## ⚫ Lab P10 - High Availability (keepalived + Nginx Load Balancer)

**📋 Scenario:** Load Balancer တစ်လုံးကျလျှင် Website တစ်ခုလုံးကျနေသည် (**Single Point of Failure**)။ ကျလည်း ၃ စက္ကန့်အတွင်း အလိုအလျောက် Switch ဖြစ်ရမည်။

```
                    Virtual IP 10.0.1.100  (Floating)
                           |
          +----------------+----------------+
          |                                 |
   LB1 (MASTER)                       LB2 (BACKUP)
   Nginx + keepalived                 Nginx + keepalived
          |                                 |
          +----------------+----------------+
                           |
              +------------+------------+
              |                         |
          Web1 (Nginx)              Web2 (Nginx)
```

### Web1, Web2 (Backend)
```bash
sudo apt install -y nginx
echo "Hello from $(hostname)" | sudo tee /var/www/html/index.html
```

### LB1 နှင့် LB2 - Nginx Load Balancer
`/etc/nginx/conf.d/lb.conf`
```nginx
upstream web_pool {
    least_conn;
    server WEB1_IP:80 max_fails=2 fail_timeout=10s;
    server WEB2_IP:80 max_fails=2 fail_timeout=10s;
    keepalive 32;
}
server {
    listen 80;
    location / {
        proxy_pass http://web_pool;
        proxy_next_upstream error timeout http_502 http_503;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /lb-health { return 200 "ok\n"; }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
for i in $(seq 6); do curl -s localhost; done      # Web1/Web2 လှည့်ပြီး ပေါ်
```

### keepalived (VRRP) ဖြင့် Floating IP
```bash
sudo apt install -y keepalived
echo "net.ipv4.ip_nonlocal_bind=1" | sudo tee /etc/sysctl.d/99-vip.conf && sudo sysctl --system
```

`/etc/keepalived/check_nginx.sh`
```bash
#!/bin/bash
curl -sf -m 2 http://localhost/lb-health >/dev/null
```
```bash
sudo chmod +x /etc/keepalived/check_nginx.sh
```

**LB1** `/etc/keepalived/keepalived.conf`
```
vrrp_script chk_nginx {
    script "/etc/keepalived/check_nginx.sh"
    interval 2
    fall 2
    rise 2
}
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 110
    advert_int 1
    authentication { auth_type PASS; auth_pass S3cretPw }
    virtual_ipaddress { 10.0.1.100/24 }
    track_script { chk_nginx }
}
```
**LB2** - `state BACKUP` နှင့် `priority 100` သာ ကွာသည်။

```bash
sudo systemctl enable --now keepalived
ip a show eth0 | grep 10.0.1.100        # LB1 တွင် VIP ရှိ
curl http://10.0.1.100
```

### 🔥 Failover စမ်းသပ်
```bash
# Terminal A (Client) - ဆက်တိုက် Request
while true; do curl -s -m 1 -o /dev/null -w "%{http_code} " http://10.0.1.100; sleep 0.5; done

# Terminal B - LB1 တွင် Nginx ရပ်
sudo systemctl stop nginx
# -> Terminal A တွင် 1-3 ကြိမ်သာ failure ပြီး 200 ပြန်ထွက်
ip a show eth0 | grep 10.0.1.100        # LB2 သို့ VIP ရွှေ့သွား
sudo journalctl -u keepalived -f        # Transition log

# ပြန်စ -> LB1 priority မြင့်၍ VIP ပြန်ယူ (Preempt)
sudo systemctl start nginx
```

### Backend Failure စမ်းသပ်
```bash
# Web1 ရပ်ကြည့် -> LB က Web2 သို့သာ ပို့၊ User Error မမြင်
sudo systemctl stop nginx    # (Web1 တွင်)
for i in $(seq 10); do curl -s http://10.0.1.100; done
```

### Split-brain သတိ
VRRP packet များ မရောက်ဘဲ နှစ်ခုစလုံး MASTER ထင်သွားခြင်း - `tcpdump -i eth0 -nn vrrp` ဖြင့် စစ်၊ Firewall တွင် Protocol 112 ကိုဖွင့်ပါ။
```bash
sudo ufw allow in on eth0 to 224.0.0.18 proto vrrp   # သို့မဟုတ် sudo iptables -A INPUT -p vrrp -j ACCEPT
```

### ✅ စစ်ဆေးရန်
Failover အချိန်ကို တိုင်းတာ၍ မှတ်တမ်းတင် (Request failure အကြိမ်ရေ × 0.5s)။ ၃ စက္ကန့် အောက်ဖြစ်ရမည်။

### 🧠 ဘာကြောင့်လဲ
**Single Point of Failure ကို ဖယ်ရှားခြင်း** သည် HA ၏ အခြေခံ။ AWS တွင် ALB + Multi-AZ, Kubernetes တွင် Service + Replicas သည် ဤအယူအဆ၏ Managed ဗားရှင်းများ။ Health check သည် **App-level** (ပါရမည်) - Port ဖွင့်နေရုံနှင့် မလုံလောက်။

**🏋️ ကိုယ်တိုင်လုပ်ရန်:** HAProxy ဖြင့် အစားထိုး၍ Stats page (`:8404/stats`) ကြည့်ပါ။ Sticky session (`ip_hash`) ထည့်ကာ စမ်းပါ။ Backend ကို Rolling update (တစ်ခုချင်း drain) လုပ်ပြပါ။

---

## 🏆 Pro Capstone - "Production Platform from Zero" (၁ ရက်တာ Project)

VM ၆ လုံးဖြင့် အောက်ပါ Architecture ကို **Code (Ansible/Compose) သာဖြင့်** တည်ဆောက်ပါ-

```
                     Internet
                        |
              [ VIP ] LB1 <-> LB2   (P10)
                        |
              Web1 -- Web2 (App, systemd-hardened P8)
                        |
                   DB1 (LVM P4, restic backup P9)
 
  Bastion/WireGuard (P5, P6)        Monitoring VM (P7)
```

| # | Deliverable | Lab |
| :-: | :--- | :-: |
| 1 | Ansible repo တစ်ခုတည်းဖြင့် VM အားလုံး Baseline | P6 |
| 2 | Admin Access သည် WireGuard + Bastion မှသာ၊ Public SSH မရှိ | P5 |
| 3 | LB ၂ လုံး + VIP, Web ၂ လုံး | P10 |
| 4 | App Service အားလုံး Hardened (`systemd-analyze security` < 4) | P8 |
| 5 | DB သည် LVM ပေါ်၊ ၁ နာရီတစ်ခါ restic + Off-site | P4, P9 |
| 6 | Prometheus/Grafana/Alert (InstanceDown, Disk predict) | P7 |
| 7 | Kernel tuning + `wrk` ဖြင့် Before/After ရလဒ် | P3 |
| 8 | **Chaos Day:** ကျပန်း VM ၁ လုံးဖျက် -> Alert -> Recover (RTO တိုင်း) | P9, P10 |
| 9 | Architecture Diagram + Runbook + Postmortem ရေး | A9 |

**အောင်မြင်သည်ဟု သတ်မှတ်ချက်:**
- [ ] VM တစ်လုံးကို ဖျက်ပစ်လည်း Website မကျ (သို့) ၃ စက္ကန့်အတွင်း ပြန်ကောင်း
- [ ] ဖျက်ထားသော VM ကို `ansible-playbook` တစ်ကြောင်းဖြင့် ပြန်ဆောက်နိုင်
- [ ] Customer မတိုင်ကြားမီ Alert က အရင်ပြောပြ
- [ ] လုံခြုံရေး Score (Lynis / systemd-analyze) မြှင့်တင်ပြီး မှတ်တမ်းရှိ

---

## 🏁 Pro Level Checklist

| Lab | ကိုယ်တိုင် ပြန်လုပ်နိုင်ပြီလား? |
| :--- | :-: |
| P1 strace / perf / lsof debug | ⬜ |
| P2 tcpdump / TCP forensics | ⬜ |
| P3 Kernel tuning (before/after) | ⬜ |
| P4 LVM online resize + snapshot | ⬜ |
| P5 WireGuard VPN + NAT | ⬜ |
| P6 Ansible idempotent playbook | ⬜ |
| P7 Prometheus + Alertmanager | ⬜ |
| P8 systemd sandbox (score < 4) | ⬜ |
| P9 DR drill + RTO တိုင်း | ⬜ |
| P10 HA failover < 3s | ⬜ |

## 🎯 နောက်ဆက်တွဲ - Pro မှ Cloud/Platform Engineer

```
Linux Pro -> Terraform (IaC) -> Kubernetes -> AWS/GCP Solutions Architect
          -> CI/CD + GitOps    -> SRE (SLI/SLO/Error budget) -> Platform Engineering
```

| ဆက်လေ့လာရန် | လင့်ခ် |
| :--- | :--- |
| Docker & Docker Hub | [Docker Step-by-Step](/devops/01_docker_core/11-docker-and-docker-hub-step-by-step-for-devops/) |
| Kubernetes | [K8s Architecture](/devops/02_kubernetes_and_cloud/11_k8s_architecture_and_setup/) |
| Terraform + CI/CD | [AWS Level 9](/aws/02_beginner_to_advanced_real_work/09_level9_terraform_cicd_githubactions/) |
