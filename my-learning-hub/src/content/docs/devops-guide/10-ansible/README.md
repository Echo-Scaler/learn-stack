---
title: "Module 10: Configuration Management with Ansible"
description: "Ansible Agentless Architecture, SSH-based automation, Playbooks, Roles, Handlers, Jinja2 Templates, and Vault Security (မြန်မာဘာသာ)"
---

> **Agentless Automation၊ Playbooks၊ Jinja2 Templates၊ Roles နှင့် Ansible Vault ဖြင့် Server ရာပေါင်းများစွာကို တစ်ပြိုင်နက် စီမံခန့်ခွဲခြင်း**

---

## 📌 ၁။ မော်ဂျူး မိတ်ဆက်နှင့် သင်ယူမှု ရည်ရွယ်ချက် (Module Overview & Objectives)

ဆာဗာ (၁) လုံး (၂) လုံးကို SSH ဖြင့် ဝင်ရောက်ပြီး ဆော့ဖ်ဝဲလ်များ သွင်းယူခြင်း၊ Configuration ပြင်ဆင်ခြင်းကို လက်ဖြင့် လုပ်ဆောင်နိုင်သော်လည်း၊ Production ပတ်ဝန်းကျင်တွင် ဆာဗာ အလုံး ၂၀၊ ၅၀ သို့မဟုတ် ၁၀၀ ကျော် ရှိလာပါက manual လိုက်လုပ်ခြင်းသည် အချိန်ကုန်ပြီး လူကြောင့်ဖြစ်သော အမှားများ (human errors)၊ ဆာဗာအချင်းချင်း config မတူညီဘဲ ကွဲပြားသွားခြင်း (Configuration Drift) ဖြစ်ပေါ်စေပါသည်။

ဤ Module 10 တွင် Infrastructure automation တွင် အသုံးအများဆုံး open-source tool ဖြစ်သည့် **Ansible** ၏ အခြေခံမှသည် production-grade architecture အထိ လက်တွေ့ အသုံးချနည်းများကို စနစ်တကျ သင်ကြားပေးမည် ဖြစ်ပါသည်။

### 🎯 ဤမော်ဂျူး ပြီးဆုံးပါက တတ်မြောက်မည့် စွမ်းရည်များ:
1. **Push vs Pull / Agentless Concept**: Ansible သည် အဘယ်ကြောင့် Target Node များတွင် Agent သွင်းရန် မလိုဘဲ SSH ဖြင့် အလုပ်လုပ်သည်ကို နားလည်ခြင်း။
2. **Idempotency Mastery**: Task တစ်ခုကို အကြိမ်ကြိမ် run စေကာမူ state မပြောင်းလဲဘဲ လိုအပ်မှသာ change ဖြစ်စေသော စည်းမျဉ်းကို ကျွမ်းကျင်စွာ အသုံးချတတ်ခြင်း။
3. **Ad-hoc Commands**: Server များစွာသို့ single-line command များဖြင့် ချက်ချင်း command run ခြင်း၊ package သွင်းခြင်း၊ service status စစ်ဆေးခြင်း။
4. **Ansible Playbooks & YAML**: Declarative YAML ဖြင့် multi-server provisioning tasks များကို ရေးသားခြင်း။
5. **Jinja2 Templates & Dynamic Variables**: Environment (Dev, Staging, Prod) အလိုက် ကွဲပြားသော dynamic config ဖိုင်များ ဖန်တီးခြင်း။
6. **Handlers & Conditional Logic**: Configuration ပြောင်းလဲမှသာ Nginx/Apache ကို reload လုပ်စေမည့် Handlers တည်ဆောက်ခြင်း။
7. **Ansible Roles**: Reusable, modular structure ဖြင့် production codebase တည်ဆောက်ခြင်း။
8. **Ansible Vault Security**: Database passwords, API keys များကို AES-256 ဖြင့် encrypt လုပ်ကာ Git repository တွင် လုံခြုံစွာ သိမ်းဆည်းခြင်း။

---

## 🧠 ၂။ အခြေခံ သဘောတရားများ (Core Concepts & Theory)

### ၂.၁ Configuration Management ဆိုသည်မှာ အဘယ်နည်း?
Configuration Management (CM) ဆိုသည်မှာ ဆာဗာများပေါ်ရှိ Software များ၊ Packages များ၊ Config Files များနှင့် User Permissions များကို Code အဖြစ် ရေးသားပြီး (Infrastructure as Code ၏ အစိတ်အပိုင်း) အလိုအလျောက် တည်ဆောက် ထိန်းသိမ်းပေးသော နည်းပညာ ဖြစ်ပါသည်။

### ၂.၂ Push vs Pull Model နှိုင်းယှဉ်ချက်

```text
[Push Model (Ansible)]
Control Node (Mac/Linux) ──── SSH (Port 22) ────► Server A (No Agent Needed)
                         ──── SSH (Port 22) ────► Server B (No Agent Needed)
                         ──── SSH (Port 22) ────► Server C (No Agent Needed)

[Pull Model (Puppet / Chef)]
Server A (Agent Installed) ──── HTTP/S (Poll) ───► Puppet/Chef Master
Server B (Agent Installed) ──── HTTP/S (Poll) ───► Puppet/Chef Master
```

| အချက်အလက် | Ansible (Push Model) | Puppet / Chef (Pull Model) |
|---|---|---|
| **Architecture** | Agentless (SSH / WinRM) | Agent-based (Target node တိုင်းတွင် Daemon agent run ရသည်) |
| **Setup Overhead** | Control Node တစ်ခုတည်းတွင် Ansible သွင်းရုံသာဖြစ်သည် | Target node အားလုံးတွင် Agent သွင်းရပြီး Master server ထိန်းရသည် |
| **Language** | Human-readable YAML | Ruby DSL / Custom DSL |
| **Network Traffic** | Control Node မှ လိုအပ်ချိန်မှ Push လုပ်သည် | Target node များမှ Master ဆီသို့ ပုံမှန် polling ပြုလုပ်သည် |
| **Learning Curve** | အလွန်လွယ်ကူပြီး မြန်ဆန်သည် | နက်နဲပြီး Configuration ရှုပ်ထွေးသည် |

### ၂.၃ Idempotency (တစ်သမတ်တည်း ဖြစ်စေသော သဘောတရား)
Ansible ၏ အရေးအကြီးဆုံး သဘောတရားမှာ **Idempotency** ဖြစ်ပါသည်။
- သင်၏ Playbook ကို ပထမဆုံးအကြိမ် run လျှင် Nginx ကို သွင်းပေးပြီး `changed: [host]` ပြမည်။
- ဒုတိယအကြိမ် ထပ် run ပါက Nginx ရှိပြီးသားဖြစ်၍ ပြန်မသွင်းဘဲ ကျော်သွားကာ `ok: [host]` ဟု ပြပါမည်။
- စနစ်သည် မူလသတ်မှတ်ထားသော Target State သို့ မရောက်မချင်းသာ ပြုပြင်ပြီး၊ ရောက်ရှိနေပါက မလိုအပ်သော လုပ်ဆောင်ချက်များကို ထပ်မံမလုပ်ဆောင်ပါ။

---

## 🏗️ ၃။ Ansible ၏ အဓိက အစိတ်အပိုင်း ၆ ရပ် (Architecture Components)

```text
┌─────────────────────────────────────────────────────────────┐
│                       CONTROL NODE                          │
│  (သင်၏ Mac / Linux Terminal / Bastion Host)                 │
│                                                             │
│   ├── ansible.cfg        (Ansible Configuration Settings)   │
│   ├── inventory.ini      (ဆာဗာများ၏ IP List & Groups)      │
│   ├── site.yml           (Master Playbook)                  │
│   └── roles/             (Reusable Automation Modules)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ SSH (Key-based Authentication)
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Web Server 01   │   │ Web Server 02   │   │ Database 01     │
│ (Ubuntu 24.04)  │   │ (Ubuntu 24.04)  │   │ (Ubuntu 24.04)  │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

1. **Control Node**: Ansible တပ်ဆင်ထားသော စက် (macOS, Linux or WSL2)။ *မှတ်ချက်: Windows ကို Control Node အဖြစ် အသုံးမပြုနိုင်ပါ (WSL ဖြင့်သာ ရသည်)*။
2. **Managed Nodes**: Ansible ဖြင့် ထိန်းချုပ်မည့် Target Servers များ (Linux/Ubuntu/Debian/RHEL/CentOS)။ Target node တွင် Python နှင့် SSH သာ ရှိရန် လိုအပ်ပါသည်။
3. **Inventory (`hosts` or `inventory.ini`)**: Target server များ၏ IP လိပ်စာများ၊ Hostname များနှင့် Group ခွဲခြားမှုများကို သတ်မှတ်သည့်ဖိုင်။
4. **Modules**: Ansible မှ target server ပေါ်သို့ ပို့ဆောင် run စေသော built-in units များ (ဥပမာ- `apt`, `yum`, `copy`, `service`, `systemd`, `template`, `file`)။
5. **Playbooks & Tasks**: YAML format ဖြင့် ရေးသားထားသော အလိုအလျောက် ညွှန်ကြားချက်အဆင့်ဆင့်။
6. **Roles**: Tasks, Handlers, Files, Templates, Variables များကို စနစ်တကျ ပြန်လည်အသုံးချနိုင်စေရန် ခွဲခြမ်းထားသော Directory ဖွဲ့စည်းပုံ။

---

## 🛠️ ၄။ ကြိုတင်လိုအပ်ချက်နှင့် ထည့်သွင်းခြင်း (Prerequisites & Installation)

### ၄.၁ Control Node ပေါ်တွင် Ansible သွင်းယူခြင်း

#### macOS (Homebrew သို့မဟုတ် Pipx):
```bash
# Method A: Homebrew
brew install ansible

# Method B: pipx (Official Recommended)
brew install pipx
pipx ensurepath
pipx install --include-deps ansible

# ဗားရှင်း စစ်ဆေးခြင်း
ansible --version
```

#### Ubuntu / Debian (Control Node):
```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install -y ansible
```

### ၄.၂ SSH Key-based Authentication ပြင်ဆင်ခြင်း
Ansible သည် SSH Key ဖြင့် အလုပ်လုပ်ပါသည် (Password ရိုက်ရန် မလိုစေရပါ):

```bash
# 1. SSH Key မရှိသေးပါက Control Node တွင် ထုတ်ယူပါ
ssh-keygen -t ed25519 -C "ansible-control-node" -f ~/.ssh/id_ed25519 -N ""

# 2. Public Key ကို Managed Target Server သို့ ကူးယူပါ
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@<TARGET_SERVER_IP>

# 3. Password မတောင်းဘဲ တိုက်ရိုက် ဝင်ရောက်နိုင်မှု စမ်းသပ်ပါ
ssh ubuntu@<TARGET_SERVER_IP> "uptime"
```

---

## 🧪 ၅။ လက်တွေ့ လေ့ကျင့်ခန်း ၁: Inventory နှင့် Ad-hoc Commands (Hands-on Lab 1)

### ၅.၁ Inventory File (`inventory.ini`) ဖန်တီးခြင်း
```ini
# inventory.ini

[webservers]
web1 ansible_host=192.168.1.101
web2 ansible_host=192.168.1.102

[dbservers]
db1 ansible_host=192.168.1.103

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_ed25519
ansible_python_interpreter=/usr/bin/python3
```

### ၅.၂ Ansible Configuration (`ansible.cfg`) ဖန်တီးခြင်း
```ini
# ansible.cfg
[defaults]
inventory = ./inventory.ini
remote_user = ubuntu
private_key_file = ~/.ssh/id_ed25519
host_key_checking = False
retry_files_enabled = False
stdout_callback = yaml
```

### ၅.၃ အသုံးဝင်သော Ad-hoc Commands စမ်းသပ်ခြင်း

```bash
# ၁။ ဆာဗာအားလုံး ဆက်သွယ်မှု ရှိမရှိ စစ်ဆေးခြင်း (ping module)
ansible all -m ping

# မျှော်လင့်ထားသော ရလဒ်:
# web1 | SUCCESS => {
#     "changed": false,
#     "ping": "pong"
# }

# ၂။ ဆာဗာများ၏ Uptime နှင့် Disk space စစ်ဆေးခြင်း (command module)
ansible webservers -m command -a "uptime"
ansible all -m shell -a "df -h / | tail -1"

# ၃။ Package သွင်းခြင်း (root အခွင့်အရေး လိုအပ်သဖြင့် --become ထည့်ရသည်)
ansible webservers -m apt -a "name=curl state=present update_cache=yes" --become

# ၄။ System Service စစ်ဆေးခြင်း
ansible webservers -m systemd -a "name=ssh state=started"
```

---

## 📝 ၆။ လက်တွေ့ လေ့ကျင့်ခန်း ၂: ပထမဆုံး Ansible Playbook ရေးသားခြင်း (Hands-on Lab 2)

ဆာဗာများပေါ်တွင် **Nginx Web Server** ကို install လုပ်ပြီး custom HTML page တစ်ခု တင်ဆောင်ကာ service ကို start လုပ်မည့် `deploy-nginx.yml` playbook တစ်ခု ရေးဆွဲပါမည်။

### `deploy-nginx.yml`:
```yaml
---
- name: Deploy and Configure Nginx Web Servers
  hosts: webservers
  become: true  # sudo privilege အသုံးပြုမည်

  vars:
    web_port: 80
    app_environment: "Production"
    page_title: "Welcome to Automated DevOps Infrastructure"

  tasks:
    - name: Update apt repository cache
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

    - name: Install Nginx web server
      ansible.builtin.apt:
        name: nginx
        state: present

    - name: Ensure Nginx is running and enabled on boot
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

    - name: Deploy custom index.html landing page
      ansible.builtin.copy:
        dest: /var/www/html/index.html
        owner: www-data
        group: www-data
        mode: '0644'
        content: |
          <!DOCTYPE html>
          <html>
          <head>
            <title>{{ page_title }}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #1e293b; padding: 2rem 3rem; border-radius: 12px; border: 1px solid #334155; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
              h1 { color: #38bdf8; margin-bottom: 0.5rem; }
              p { color: #94a3b8; font-size: 1.1rem; }
              .badge { background: #0284c7; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">{{ app_environment }}</span>
              <h1>🚀 {{ page_title }}</h1>
              <p>Host: <strong>{{ ansible_hostname }}</strong> ({{ ansible_default_ipv4.address }})</p>
              <p>Managed automatically with <strong>Ansible</strong> by DevOps Engineer</p>
            </div>
          </body>
          </html>
```

### ၆.၁ Playbook စစ်ဆေးခြင်းနှင့် Run ခြင်း:

```bash
# Syntax အမှား ရှိမရှိ စစ်ဆေးခြင်း
ansible-playbook deploy-nginx.yml --syntax-check

# Dry Run ပြုလုပ်ခြင်း (အမှန်တကယ် မပြောင်းလဲဘဲ မည်သည့်အရာများ ပြောင်းမည်ကို စမ်းသပ်ခြင်း)
ansible-playbook deploy-nginx.yml --check

# အမှန်တကယ် Run ခြင်း
ansible-playbook deploy-nginx.yml
```

### ၆.၂ Output ကို လေ့လာခြင်း:
```text
PLAY [Deploy and Configure Nginx Web Servers] ************************************

TASK [Gathering Facts] **********************************************************
ok: [web1]
ok: [web2]

TASK [Update apt repository cache] **********************************************
ok: [web1]
ok: [web2]

TASK [Install Nginx web server] *************************************************
changed: [web1]
changed: [web2]

TASK [Ensure Nginx is running and enabled on boot] *******************************
ok: [web1]
ok: [web2]

TASK [Deploy custom index.html landing page] ************************************
changed: [web1]
changed: [web2]

PLAY RECAP **********************************************************************
web1                       : ok=5    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
web2                       : ok=5    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

---

## 🎨 ၇။ လက်တွေ့ လေ့ကျင့်ခန်း ၃: Jinja2 Templates နှင့် Handlers (Hands-on Lab 3)

Config ဖိုင်များ (ဥပမာ Nginx configuration) ပြင်ဆင်သည့်အခါ:
1. Dynamic Variables (Port နံပါတ်၊ Domain Name၊ Proxy Upstream IP များ) ကို အလိုအလျောက် ထည့်သွင်းပေးရန် **Jinja2 Templates (`.j2`)** ကို သုံးသည်။
2. Configuration ပြောင်းလဲသွားမှသာ Nginx service ကို restart သို့မဟုတ် reload လုပ်ဆောင်စေရန် **Handlers** ကို သုံးသည်။ Configuration မပြောင်းလဲပါက restart မလုပ်သဖြင့် Zero Downtime ဖြစ်စေပါသည်။

### ၇.၁ Jinja2 Template ဖိုင် (`templates/nginx-site.conf.j2`):
```nginx
# Managed by Ansible - Do not edit manually

upstream backend_app {
{% for host in groups['webservers'] %}
    server {{ hostvars[host]['ansible_default_ipv4']['address'] }}:{{ app_port | default(3000) }};
{% endfor %}
}

server {
    listen {{ http_port | default(80) }};
    server_name {{ domain_name | default('_') }};

    access_log /var/log/nginx/{{ domain_name }}.access.log;
    error_log /var/log/nginx/{{ domain_name }}.error.log;

    location / {
        proxy_pass http://backend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### ၇.၂ Template နှင့် Handler ပါဝင်သော Playbook:
```yaml
---
- name: Configure Nginx with Jinja2 Template & Handlers
  hosts: webservers
  become: true

  vars:
    domain_name: "app.example.com"
    http_port: 80
    app_port: 3000

  tasks:
    - name: Deploy Nginx virtual host template
      ansible.builtin.template:
        src: templates/nginx-site.conf.j2
        dest: /etc/nginx/sites-available/{{ domain_name }}.conf
        owner: root
        group: root
        mode: '0644'
      notify: Restart Nginx  # Config ပြောင်းလဲမှသာ Handler ကို လှမ်းခေါ်မည်

    - name: Enable site by creating symlink
      ansible.builtin.file:
        src: /etc/nginx/sites-available/{{ domain_name }}.conf
        dest: /etc/nginx/sites-enabled/{{ domain_name }}.conf
        state: link
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded

    - name: Restart Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

---

## 🏛️ ၈။ လက်တွေ့ လေ့ကျင့်ခန်း ၄: Ansible Roles ဖွဲ့စည်းပုံ (Hands-on Lab 4)

Playbook တစ်ခုတည်းတွင် tasks ရာပေါင်းများစွာ ရေးသားခြင်းသည် ပြန်လည်အသုံးမပြုနိုင်ဘဲ ရှုပ်ထွေးစေပါသည်။ Production တွင် **Ansible Roles** စနစ်ဖြင့် modular ပြုလုပ်ရပါသည်:

```text
my-ansible-repo/
├── ansible.cfg
├── inventory.ini
├── site.yml               # Master Playbook
└── roles/
    ├── common/            # Server Hardening, Timezone, UFW Firewall
    │   ├── tasks/main.yml
    │   └── handlers/main.yml
    ├── webserver/         # Nginx Setup, Virtualhost, SSL
    │   ├── tasks/main.yml
    │   ├── handlers/main.yml
    │   ├── templates/nginx.conf.j2
    │   └── vars/main.yml
    └── database/          # PostgreSQL / MySQL Setup
        ├── tasks/main.yml
        └── vars/main.yml
```

### ၈.၁ Role အသစ်တစ်ခု ဖန်တီးခြင်း:
```bash
ansible-galaxy init roles/webserver
```

### ၈.၂ Master Playbook (`site.yml`) တွင် Role များကို ခေါ်ယူခြင်း:
```yaml
---
- name: Provision All Production Infrastructure
  hosts: all
  become: true
  roles:
    - common

- name: Provision Web Server Tier
  hosts: webservers
  become: true
  roles:
    - webserver

- name: Provision Database Tier
  hosts: dbservers
  become: true
  roles:
    - database
```

---

## 🔐 ၉။ လက်တွေ့ လေ့ကျင့်ခန်း ၅: Ansible Vault ဖြင့် လျှို့ဝှက်ချက်များ ထိန်းသိမ်းခြင်း (Hands-on Lab 5)

Database Password၊ API Keys များကို Git repository ပေါ်သို့ plain text အဖြစ် push မတင်ရပါ။ Ansible တွင် **Ansible Vault** ပါဝင်ပြီး AES-256 ဖြင့် encrypt လုပ်ပေးနိုင်ပါသည်။

### ၉.၁ Vault Encrypted File ဖန်တီးခြင်း:
```bash
# လျှို့ဝှက်ဖိုင် အသစ် ဆောက်ပြီး password သတ်မှတ်ခြင်း
ansible-vault create group_vars/all/vault.yml

# ထည့်သွင်းရမည့် အချက်အလက်များ:
# db_password: "SuperSecretProductionPassword123!"
# api_secret_key: "ak_948204820492840294"
```

### ၉.၂ ရှိပြီးသား Plain text ဖိုင်ကို Encrypt လုပ်ခြင်း:
```bash
# Encrypt လုပ်ခြင်း
ansible-vault encrypt group_vars/all/secrets.yml

# Decrypt ပြန်ဖြည်ခြင်း (လိုအပ်ပါက)
ansible-vault decrypt group_vars/all/secrets.yml

# ဖိုင်ကို edit လုပ်ခြင်း
ansible-vault edit group_vars/all/secrets.yml

# ဖိုင်ပါ အကြောင်းအရာကို ကြည့်ရှုခြင်း
ansible-vault view group_vars/all/secrets.yml
```

### ၉.၃ Vault Encrypted ဖိုင်ဖြင့် Playbook run ခြင်း:
```bash
# နည်းလမ်း ၁: Terminal တွင် password ရိုက်ထည့်ပြီး run ခြင်း
ansible-playbook site.yml --ask-vault-pass

# နည်းလမ်း ၂: CI/CD Pipeline တွင် Password File အသုံးပြုပြီး run ခြင်း
echo "MyVaultPassword" > ~/.vault_pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

---

## 🛡️ ၁၀။ Production Best Practices & Security Checklist

1. ✅ **Never Hardcode Secrets**: Database passwords သို့မဟုတ် Private keys များကို plaintext မထားဘဲ `ansible-vault` ကို အမြဲသုံးပါ။
2. ✅ **Always Use `become: true` Sparingly**: Task တိုင်းတွင် root အခွင့်အရေး မသုံးဘဲ system packages သွင်းခြင်း၊ system config ပြင်ခြင်းများတွင်သာ သုံးပါ။
3. ✅ **Enforce Idempotency**: `shell` သို့မဟုတ် `command` module များအစား built-in module များ (`apt`, `copy`, `template`, `service`) ကိုသာ ဦးစားပေးသုံးပါ။ မဖြစ်မနေ shell သုံးရပါက `creates:` သို့မဟုတ် `removes:` parameter ဖြင့် idempotent ဖြစ်အောင် ပြုလုပ်ပါ။
4. ✅ **Use Tags for Selective Execution**: Playbook ကြီးများတွင် အချိန်မကုန်စေရန် `tags: [nginx, config, deploy]` သတ်မှတ်ပြီး `ansible-playbook site.yml --tags nginx` ဟု run ပါ။
5. ✅ **Use `--check` and `--diff`**: Production တွင် အပြောင်းအလဲ မလုပ်မီ `--check --diff` ဖြင့် မည်သည့်ဖိုင်များ မည်သို့ ပြောင်းလဲသွားမည်ကို အရင်ဆုံး verify လုပ်ပါ။
6. ✅ **Lint with `ansible-lint`**: `ansible-lint site.yml` ဖြင့် syntax နှင့် best practice အမှားများကို စစ်ဆေးပါ။

---

## 🔍 ၁၁။ စနစ်စစ်ဆေးခြင်းနှင့် အတည်ပြု အမိန့်များ (Verification Commands)

```bash
# ၁။ Inventory ဖွဲ့စည်းပုံကို Graph အနေဖြင့် စစ်ဆေးခြင်း
ansible-inventory --graph

# ၂။ Host တစ်ခုချင်းစီ၏ Variables အားလုံးကို ကြည့်ရှုခြင်း
ansible-inventory --host web1

# ၃။ Remote Host မှ System Facts (OS, Memory, IP) များကို စစ်ဆေးခြင်း
ansible web1 -m setup -a "filter=ansible_default_ipv4"
ansible web1 -m setup -a "filter=ansible_distribution*"

# ၄။ Playbook အတွင်း သတ်မှတ်ထားသော Tasks အားလုံးကို စာရင်းထုတ်ခြင်း
ansible-playbook site.yml --list-tasks

# ၅။ Playbook အလုပ်လုပ်မည့် Target Hosts များကို စစ်ဆေးခြင်း
ansible-playbook site.yml --list-hosts
```

---

## 🚨 ၁၂။ အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ (Troubleshooting Scenarios)

### ပြဿနာ ၁: `UNREACHABLE! => Failed to connect to the host via ssh: Permission denied (publickey)`
- **အကြောင်းရင်း**: Control node ၏ SSH Public Key ကို target node ၏ `~/.ssh/authorized_keys` တွင် မထည့်ရသေးခြင်း သို့မဟုတ် user name မှားယွင်းနေခြင်း။
- **ဖြေရှင်းနည်း**:
  ```bash
  # Target node ပေါ်သို့ ssh key ကို ကူးထည့်ပါ
  ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@<TARGET_IP>
  # သို့မဟုတ် ansible.cfg တွင် private key path ကို စစ်ဆေးပါ
  ```

### ပြဿနာ ၂: `Missing sudo password or 'become: yes' requires password`
- **အကြောင်းရင်း**: Target node ရှိ user သည် sudo run ရန် password လိုအပ်နေခြင်း။
- **ဖြေရှင်းနည်း**:
  - Command run လျှင် `-K` (`--ask-become-pass`) ထည့်သွင်းပါ:
    ```bash
    ansible-playbook site.yml -K
    ```
  - သို့မဟုတ် target node တွင် passwordless sudo ပေးပါ:
    ```bash
    echo "ubuntu ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ubuntu
    ```

### ပြဿနာ ၃: `Jinja2: 'dict object' has no attribute 'xyz'`
- **အကြောင်းရင်း**: Template သို့မဟုတ် task တွင် ရေးထားသော variable name သည် variables file တွင် သတ်မှတ်မထားခြင်း သို့မဟုတ် စာလုံးပေါင်း မှားယွင်းနေခြင်း။
- **ဖြေရှင်းနည်း**: Default value ထည့်သွင်းပေးပါ: `{{ my_variable | default('default_value') }}`။

---

## 💼 ၁၃။ အင်တာဗျူး အမေးအဖြေများ (Interview Questions & Model Answers)

### မေးခွန်း ၁: Terraform နှင့် Ansible ဘာကွာသလဲ? (What is the difference between Terraform and Ansible?)
**အဖြေ**: 
> "Terraform သည် **Infrastructure Provisioning (Orchestration)** tool ဖြစ်ပြီး Cloud Provider (AWS/GCP/Azure) ပေါ်တွင် VPC, Subnets, EC2, RDS, ALB ကဲ့သို့သော Infrastructure resources များကို တည်ဆောက်ရာတွင် အဓိက အသုံးပြုပါသည်။ 
> 
> အခြားတစ်ဖက်တွင် Ansible သည် **Configuration Management & Application Deployment** tool ဖြစ်ပြီး တည်ဆောက်ပြီးသား EC2 server များအတွင်းသို့ ဝင်ရောက်ကာ ဆော့ဖ်ဝဲလ်များ သွင်းယူခြင်း (Nginx, PHP, Docker), config files ပြင်ဆင်ခြင်း, users ဖန်တီးခြင်းနှင့် security patches သွင်းယူခြင်းတို့တွင် အဓိက သုံးပါသည်။ 
> 
> လုပ်ငန်းခွင်တွင် Terraform ဖြင့် ဆာဗာ ဆောက်ပြီး၊ ထိုဆာဗာများထဲသို့ Ansible ဖြင့် config သွင်းသော Hybrid workflow ကို အသုံးများပါသည်။"

### မေးခွန်း ၂: Ansible ၏ Idempotency ဆိုတာ ဘာလဲ? (What is Idempotency in Ansible?)
**အဖြေ**:
> "Idempotency ဆိုသည်မှာ operation တစ်ခုကို အကြိမ်ကြိမ် run စေကာမူ စနစ်၏ နောက်ဆုံးရလဒ် (Desired State) သည် မပြောင်းလဲဘဲ မူလအတိုင်း တည်ရှိနေခြင်း ဖြစ်ပါသည်။ 
> 
> ဥပမာ- Ansible ၏ `apt: name=nginx state=present` task ကို ပထမအကြိမ် run လျှင် Nginx ကို သွင်းပေးပြီး `changed` status ပြမည်။ ထို Playbook ကို ဒုတိယအကြိမ် ထပ်မံ run လျှင် Nginx သည် စနစ်ထဲတွင် ရှိပြီးသားဖြစ်၍ မည်သည့်အရာမျှ ထပ်မံမလုပ်ဆောင်ဘဲ `ok` status သာ ပြပါမည်။ ၎င်းသည် Bash script များထက် အဆပေါင်းများစွာ ပိုမိုစိတ်ချရစေပါသည်။"

---

## 📋 ၁၄။ မော်ဂျူး အကျဉ်းချုပ်နှင့် နောက်တစ်ဆင့် (Summary & Next Step)

ယခု Module 10 တွင် သင်သည်:
- Ansible ၏ Agentless Push Architecture နှင့် Idempotency ကို သဘောပေါက်ခဲ့သည်။
- Ad-hoc Commands များဖြင့် Server အမြောက်အများကို စက္ကန့်ပိုင်းအတွင်း စီမံခန့်ခွဲနိုင်ခဲ့သည်။
- Nginx Web Server ကို Playbook, Jinja2 Template နှင့် Handlers ဖြင့် အလိုအလျောက် တည်ဆောက်ခဲ့သည်။
- Production-ready Roles ဖွဲ့စည်းပုံနှင့် Ansible Vault လုံခြုံရေးကို လက်တွေ့ အသုံးချခဲ့သည်။

👉 **နောက်တစ်ဆင့်**: **[Module 11: Monitoring & Logging (Prometheus, Grafana & CloudWatch)](/devops-guide/11-monitoring-observability/readme/)** သို့ ဆက်လက် တက်လှမ်းပါမည်။
