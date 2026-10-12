---
title: Bash Scripting, Environment Variables & Cron Automation
description: Cloud-Init User Data Scripting, Linux Shell Commands, Env Vars နှင့် Automated Cron Tasks
---

## ၁။ Cloud-Init User Data Bash Scripting

EC2 Server စတင် Boot တက်လာချိန်တွင် Nginx နှင့် Tools များကို အလိုအလျောက် သွင်းပေးသည့် Bash Script:

```bash
#!/usr/bin/env bash
set -euo pipefail

# System update
apt-get update -y
apt-get install -y nginx curl jq

# Set environment
echo "APP_ENV=production" >> /etc/environment

# Automated Cron Job for backup/cleanup
echo "0 3 * * * root find /var/log/nginx -name '*.gz' -mtime +14 -delete" > /etc/cron.d/nginx-log-cleanup

systemctl enable nginx
systemctl start nginx
```
