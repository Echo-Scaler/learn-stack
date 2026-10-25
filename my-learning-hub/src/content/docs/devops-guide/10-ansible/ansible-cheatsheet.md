---
title: "Ansible Commands & Playbook Cheatsheet"
description: "Comprehensive quick reference for Ansible CLI, Ad-hoc commands, Core Modules, Jinja2, Handlers, and Vault"
---


> **လုပ်ငန်းခွင်သုံး Ansible Ad-hoc Commands၊ Playbook Directives၊ Core Modules နှင့် Vault Commands များ လက်စွဲ**

---

## ⚡ ၁။ အသုံးများသော CLI & Ad-hoc Commands

| Command | ရှင်းလင်းချက် |
|---|---|
| `ansible all -m ping` | Inventory ထဲရှိ host အားလုံး SSH ping စစ်ဆေးခြင်း |
| `ansible webservers -m command -a "uptime"` | Webservers group ပေါ်တွင် `uptime` command run ခြင်း |
| `ansible all -m shell -a "df -h /"` | Host အားလုံးတွင် shell pipeline သို့မဟုတ် shell syntax ဖြင့် run ခြင်း |
| `ansible webservers -m apt -a "name=nginx state=present" --become` | Sudo အခွင့်အရေးဖြင့် Nginx package သွင်းယူခြင်း |
| `ansible webservers -m service -a "name=nginx state=restarted" --become` | Nginx service ကို restart ပြုလုပ်ခြင်း |
| `ansible all -m copy -a "src=index.html dest=/var/www/html/ mode=0644" --become` | ဖိုင်ကို target nodes များဆီသို့ ဖြန့်ကြက်ကူးယူခြင်း |
| `ansible web1 -m setup` | Target host ၏ System facts အားလုံးကို ထုတ်ယူကြည့်ရှုခြင်း |
| `ansible web1 -m setup -a "filter=ansible_distribution*"` | OS distribution အချက်အလက်များကို filter လုပ်ကြည့်ခြင်း |

---

## 📖 ၂။ Playbook Run စေသော Commands

| Command | ရည်ရွယ်ချက် |
|---|---|
| `ansible-playbook site.yml` | Master Playbook ကို ပုံမှန် execute လုပ်ခြင်း |
| `ansible-playbook site.yml --syntax-check` | YAML syntax အမှားရှိမရှိ စစ်ဆေးခြင်း |
| `ansible-playbook site.yml --check` | Dry run (အမှန်တကယ် မပြောင်းလဲဘဲ test လုပ်ခြင်း) |
| `ansible-playbook site.yml --check --diff` | မည်သည့် file / line များ ပြောင်းလဲသွားမည်ကို diff ကြည့်ခြင်း |
| `ansible-playbook site.yml -l web1` | Host တစ်ခုတည်းကိုသာ ရွေးချယ် run ခြင်း (Limit) |
| `ansible-playbook site.yml -t nginx` | Tag တပ်ထားသော tasks များကိုသာ ရွေးချယ် run ခြင်း |
| `ansible-playbook site.yml --skip-tags "ssl"` | အချို့သော tags များကို ချန်လှပ်၍ run ခြင်း |
| `ansible-playbook site.yml -K` | Sudo password တောင်းခံပြီး run ခြင်း (`--ask-become-pass`) |
| `ansible-playbook site.yml --step` | Task တစ်ခုချင်းစီကို confirmation တောင်း၍ run ခြင်း |

---

## 📦 ၃။ Core Ansible Modules Quick Reference

### ၃.၁ `ansible.builtin.apt` (Package Management)
```yaml
- name: Install essential packages
  ansible.builtin.apt:
    name:
      - nginx
      - curl
      - git
      - ufw
    state: present
    update_cache: true
```

### ၃.၂ `ansible.builtin.service` / `systemd` (Service Management)
```yaml
- name: Ensure service is active and enabled
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
```

### ၃.၃ `ansible.builtin.template` (Jinja2 Dynamic Config)
```yaml
- name: Configure Nginx virtualhost
  ansible.builtin.template:
    src: templates/site.conf.j2
    dest: /etc/nginx/sites-available/app.conf
    owner: root
    group: root
    mode: '0644'
  notify: Reload Nginx
```

### ၃.၄ `ansible.builtin.file` (Directories, Permissions & Symlinks)
```yaml
- name: Create app directory
  ansible.builtin.file:
    path: /var/www/my-app
    state: directory
    owner: www-data
    group: www-data
    mode: '0755'

- name: Create symlink
  ansible.builtin.file:
    src: /etc/nginx/sites-available/app.conf
    dest: /etc/nginx/sites-enabled/app.conf
    state: link
```

### ၃.၅ `ansible.builtin.user` (User Creation & SSH Keys)
```yaml
- name: Create deployer user
  ansible.builtin.user:
    name: deployer
    shell: /bin/bash
    groups: sudo
    append: true

- name: Add authorized public key
  ansible.posix.authorized_key:
    user: deployer
    state: present
    key: "{{ lookup('file', '~/.ssh/id_ed25519.pub') }}"
```

---

## 🔐 ၄။ Ansible Vault Commands

| Command | လုပ်ဆောင်ချက် |
|---|---|
| `ansible-vault create vars/vault.yml` | လျှို့ဝှက် encrypted file အသစ်ဆောက်ခြင်း |
| `ansible-vault encrypt vars/secrets.yml` | ရှိပြီးသား plain YAML ကို encrypt လုပ်ခြင်း |
| `ansible-vault decrypt vars/secrets.yml` | Encrypted file ကို plain text ပြန်ပြောင်းခြင်း |
| `ansible-vault edit vars/vault.yml` | Encrypted file ကို decrypt မလုပ်ဘဲ တိုက်ရိုက်ပြင်ဆင်ခြင်း |
| `ansible-vault view vars/vault.yml` | Encrypted file ပါ အကြောင်းအရာကို terminal တွင် ဖတ်ရှုခြင်း |
| `ansible-vault rekey vars/vault.yml` | Encryption password အသစ်သို့ ပြောင်းလဲခြင်း |
| `ansible-playbook site.yml --ask-vault-pass` | Vault password မေး၍ playbook run ခြင်း |
| `ansible-playbook site.yml --vault-password-file ~/.vpass` | CI/CD password file ဖြင့် run ခြင်း |

---

## 🎭 ၅။ Jinja2 Syntax Patterns

```jinja2
{# Variable Interpolation #}
{{ server_name }}
{{ app_port | default(8080) }}

{# Conditionals #}
{% if environment == 'production' %}
debug = False
{% else %}
debug = True
{% endif %}

{# Loop through Group Hosts #}
{% for host in groups['webservers'] %}
server {{ hostvars[host]['ansible_default_ipv4']['address'] }}:3000;
{% endfor %}
```
