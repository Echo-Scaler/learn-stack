---
title: Ansible Fundamentals, Inventory & Playbooks
description: Ansible Architecture, Inventory & Hosts, Playbooks, Tasks, Variables, Handlers နှင့် Jinja2 Templates
---

## ၁။ Ansible Architecture & Inventory

Ansible သည် Server များပေါ်တွင် Agent သွင်းစရာမလိုဘဲ **SSH** ဖြင့် Server ရာနှင့်ချီကို တစ်ပြိုင်နက် Configure လုပ်နိုင်သော Agentless Tool ဖြစ်သည်။

```ini
# inventory.ini
[webservers]
web1.example.com ansible_host=10.0.1.10
web2.example.com ansible_host=10.0.2.10

[dbservers]
db1.example.com ansible_host=10.0.21.5
```

---

## ၂။ Complete Nginx Playbook (`playbook.yml`)

```yaml
---
- name: Configure Production Web Servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx Web Server
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Deploy Custom Virtual Host Config
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Restart Nginx

  handlers:
    - name: Restart Nginx
      systemd:
        name: nginx
        state: restarted
```
