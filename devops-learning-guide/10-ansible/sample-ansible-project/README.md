# 📦 Sample Ansible Production Project

This sample project demonstrates a production-grade modular Ansible setup using Roles, Jinja2 Templates, and Handlers to configure an Nginx Web Server cluster.

## 📂 Project Structure
```text
sample-ansible-project/
├── ansible.cfg
├── inventory.ini
├── site.yml
└── roles/
    └── webserver/
        ├── tasks/main.yml
        ├── handlers/main.yml
        ├── templates/nginx.conf.j2
        └── vars/main.yml
```

## 🚀 How to Run

1. Edit `inventory.ini` with your target server IP addresses.
2. Ensure your SSH public key is added to the target nodes (`ssh-copy-id`).
3. Verify connection:
   ```bash
   ansible all -m ping
   ```
4. Perform a dry-run:
   ```bash
   ansible-playbook site.yml --check
   ```
5. Deploy:
   ```bash
   ansible-playbook site.yml
   ```
