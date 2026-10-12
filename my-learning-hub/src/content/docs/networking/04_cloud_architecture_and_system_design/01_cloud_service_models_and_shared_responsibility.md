---
title: Cloud Service Models (IaaS, PaaS, SaaS) & Shared Responsibility
description: IaaS, PaaS, SaaS နှိုင်းယှဉ်ချက်နှင့် AWS Shared Responsibility Model လုံခြုံရေး တာဝန်ခွဲဝေမှု
---

## ၁။ IaaS vs PaaS vs SaaS

- **IaaS (Infrastructure as a Service):** AWS EC2, VPC, EBS — သင်ကိုယ်တိုင် OS, Patching, Runtime, Application စီမံရသည်။
- **PaaS (Platform as a Service):** AWS Elastic Beanstalk, RDS — OS နှင့် DB Engine ကို Cloud Provider က စီမံပေးပြီး သင်က Application Code သာ တင်ရသည်။
- **SaaS (Software as a Service):** Google Workspace, Salesforce — အဆင်သင့် Software ကို End-user အနေဖြင့် သုံးစွဲရုံသာ ဖြစ်သည်။

---

## ၂။ Shared Responsibility Model

- **Security OF the Cloud (AWS တာဝန်):** Physical Facilities, Hardware, Network, Virtualization Hypervisor။
- **Security IN the Cloud (Customer တာဝန်):** OS Patches, IAM Permissions, Firewall Rules, Encryption, Application Code။
