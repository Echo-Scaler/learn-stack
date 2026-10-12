---
title: Cost Allocation Tags, Idle Resource Cleanup & Nightly Shutdown
description: Cost Allocation Tags, Unused Resources (Unattached EIP, Old Snapshots), Automated Non-Production Shutdown
---

## ၁။ Cost Allocation Tags & Idle Resource Cleanup

- **Tags:** Resource တိုင်းတွင် `Environment = Production / Staging`, `Owner = TeamA` ဟု Tag ကပ်၍ စစ်ဆေးခြင်း။
- **Idle Cleanup:** မသုံးတော့သော Unattached Elastic IPs, Old EBS Snapshots, Unused Load Balancers များကို ပုံမှန် ရှင်းထုတ်ခြင်း။
