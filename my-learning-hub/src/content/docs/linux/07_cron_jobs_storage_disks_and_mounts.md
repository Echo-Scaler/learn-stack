---
title: Phase 2 Lesson 7 — Cron Jobs, Storage Disks, Mounts & fstab
description: Linux Cron Scheduled Tasks, Crontab syntax (* * * * *), Block Devices (lsblk), Filesystem Format (ext4), Mounts နှင့် /etc/fstab အမြဲတမ်း ချိတ်ဆက်ခြင်း (မြန်မာဘာသာ)
---

# ⏰ Phase 2 — Lesson 7: Cron Jobs, Storage Disks, Mounts & fstab

Server တစ်ခုတွင် နေ့စဉ် Database Backup အလိုအလျောက် ရယူခြင်း၊ Log ဖိုင်များ ရှင်းလင်းခြင်း စသည့် အလုပ်များကို **Cron Daemon** ဖြင့် အချိန်ကိုက် စေခိုင်းရပါသည်။ ထို့အပြင် Cloud Server ပေါ်တွင် Hard Disk (SSD/EBS) အသစ်တစ်ခု ထပ်မံတပ်ဆင်ပါက ထို Disk ကို စနစ်ထဲသို့ **Format ရိုက်ခြင်း၊ Mount ပြုလုပ်ခြင်းနှင့် `/etc/fstab` ဖြင့် အမြဲတမ်း ချိတ်ဆက်ခြင်း** တို့ကို SysAdmin တိုင်း ကျွမ်းကျင်စွာ လုပ်ဆောင်နိုင်ရပါမည်။

---

## 💡 ၁။ Cron Scheduled Tasks (အချိန်ကိုက် အလိုအလျောက် စေခိုင်းခြင်း)

Cron သည် Linux Background တွင် အမြဲလည်ပတ်နေပြီး မိနစ်တိုင်း အချိန်ကို စစ်ဆေးကာ သတ်မှတ်ထားသော Script များကို အလိုအလျောက် run ပေးသည့် Scheduler ဖြစ်ပါသည်။

### Cron Syntax အကွက် ၅ ကွက် နားလည်ခြင်း

```
┌───────────── Minute (မိနစ်: 0 - 59)
│ ┌─────────── Hour (နာရီ: 0 - 23)
│ │ ┌───────── Day of Month (လ၏ရက်: 1 - 31)
│ │ │ ┌─────── Month (လ: 1 - 12)
│ │ │ │ ┌───── Day of Week (ရက်သတ္တပတ်၏နေ့: 0 - 6, 0 = Sunday)
│ │ │ │ │
* * * * *  /path/to/script.sh
```

### လက်တွေ့ အသုံးများသော Cron နမူနာများ

| Cron Expression | အဓိပ္ပာယ် | Real-world Use Case |
| :--- | :--- | :--- |
| `0 2 * * *` | နေ့စဉ် ညဉ့်နက် ၂:၀၀ နာရီတိတိတွင် run ပါ | Database Backup ရယူခြင်း |
| `*/5 * * * *` | ၅ မိနစ်ခြားတိုင်း တစ်ကြိမ် run ပါ | Server Health Check & Monitoring |
| `0 0 1 * *` | လဆန်း ၁ ရက်နေ့ သန်းခေါင်ယံတိုင်း run ပါ | လစဉ် ဘေလ်ရှင်းတမ်းနှင့် Report များ ထုတ်ခြင်း |
| `0 9 * * 1` | အပတ်စဉ် တနင်္လာနေ့ မနက် ၉:၀၀ နာရီတွင် run ပါ | အပတ်စဉ် အကျဉ်းချုပ် အီးမေးလ် ပေးပို့ခြင်း |

### Crontab Commands များ
```bash
# လက်ရှိ User ၏ Cron စာရင်းကို ပြင်ဆင်ရန် (Edit)
crontab -e

# လက်ရှိ Cron စာရင်းကို ကြည့်ရှုရန် (List)
crontab -l

# Production Backup Crontab နမူနာ (Log ဖိုင်ထဲသို့ Output လမ်းကြောင်းလွှဲခြင်း)
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```
* `>> /var/log/backup.log 2>&1`: Script ၏ ပုံမှန် Output ရော Error Messages များကိုပါ log ဖိုင်ထဲသို့ သိမ်းဆည်းစေခြင်း ဖြစ်သည်။

---

## 💽 ၂။ Storage Disks, Partitions & Mounts (Hard Disk အသစ် ချိတ်ဆက်ခြင်း)

Linux တွင် External SSD သို့မဟုတ် AWS EBS Volume အသစ်တစ်ခု တပ်ဆင်လိုက်ပါက Drive Letter (`D:`) အဖြစ် အလိုအလျောက် ပေါ်မလာပါ။ အောက်ပါ အဆင့် ၃ ဆင့်ဖြင့် Directory တစ်ခုအဖြစ် **Mount** ပြုလုပ်ပေးရပါမည် -

```
Physical Block Disk (/dev/sdb)
           │
           ▼ [ fdisk /dev/sdb ]
Partition Block (/dev/sdb1)
           │
           ▼ [ mkfs.ext4 /dev/sdb1 ]
Formatted Filesystem (ext4)
           │
           ▼ [ mount /dev/sdb1 /mnt/data ]
Directory Mount Point (/mnt/data) ◄─── Developer က ဤနေရာ၌ ဖိုင်များ စတင်သိမ်းနိုင်ပြီ!
```

### အဆင့် ၁ — Disk အသစ်ကို စစ်ဆေးခြင်း (`lsblk`)

```bash
lsblk
```
* Output တွင် `/dev/sdb` (100GB) ဟု မသုံးရသေးသော Raw Disk ကို တွေ့ရပါမည်။

### အဆင့် ၂ — Filesystem Format ရိုက်ခြင်း (`mkfs.ext4`)

```bash
# /dev/sdb1 partition ကို Linux ext4 filesystem ဖြင့် format ရိုက်ပါ
sudo mkfs.ext4 /dev/sdb1
```

### အဆင့် ၃ — Directory တစ်ခုသို့ Mount ချိတ်ဆက်ခြင်း

```bash
# Mount လုပ်မည့် folder အလွတ် ဆောက်ပါ
sudo mkdir -p /mnt/storage

# Disk ကို ထို folder သို့ ချိတ်ဆက်ပါ
sudo mount /dev/sdb1 /mnt/storage
```
* ယခုအခါ `/mnt/storage` ထဲသို့ ရေးသားသမျှ ဖိုင်များသည် ထို 100GB Disk အသစ်ပေါ်သို့ ရောက်ရှိသွားပါပြီ။

---

## 🔒 ၃။ `/etc/fstab` ဖြင့် Reboot ချပြီးတိုင်း Auto-Mount ဖြစ်စေရန် သတ်မှတ်ခြင်း

အထက်ပါ `mount` command သည် စက်ကို Restart ချလိုက်ပါက ပြုတ်ထွက်သွားပါမည်။ စက်ပြန်ပွင့်လာတိုင်း အမြဲတမ်း အလိုအလျောက် ချိတ်ဆက်နေစေရန် `/etc/fstab` (Filesystem Table) တွင် ထည့်သွင်းရပါမည်။

```bash
# ၁။ Disk ၏ တိကျသော UUID ကို ရယူပါ
sudo blkid /dev/sdb1
# Output: UUID="e4d29f8a-..." TYPE="ext4"

# ၂။ /etc/fstab ဖိုင်ထဲတွင် စာကြောင်းအသစ် ထည့်ပါ
# UUID=e4d29f8a-...  /mnt/storage  ext4  defaults  0  2
```

### 🚨 Senior Safety Rule — `sudo mount -a`
`/etc/fstab` ဖိုင်ကို ပြင်ဆင်ပြီးပါက စက်ကို **ချက်ချင်း Restart မချပါနှင့်**! စာလုံးပေါင်းမှားယွင်းခဲ့ပါက Linux သည် Emergency Mode သို့ ရောက်သွားပြီး Boot မတက်တော့ပါ။ အမြဲတမ်း စစ်ဆေးပါ:
```bash
sudo mount -a
```
*အကယ်၍ Error မပြဘဲ ပြီးဆုံးသွားပါက Syntax မှန်ကန်သဖြင့် စိတ်ချစွာ စက် reboot ချနိုင်ပါပြီ။*

---

## 🏋️ ၄။ Hands-on Practice

1. `crontab -e` ကို ရိုက်ပြီး Nano editor ကို ရွေးချယ်ပါ။
2. စာကြောင်းထည့်ပါ: `* * * * * date >> /tmp/cron_test.log` (မိနစ်တိုင်း ရက်စွဲသိမ်းရန်)။
3. ၁ မိနစ် စောင့်ပြီး `cat /tmp/cron_test.log` ဖြင့် cron အလုပ်လုပ်ပုံကို စစ်ဆေးပါ။
4. `crontab -e` ပြန်ဖွင့်ပြီး ထိုစာကြောင်းကို ဖျက်ပစ်ပါ။
5. `lsblk` ရိုက်ပြီး လက်ရှိ VM စက်ပေါ်ရှိ Disks နှင့် Partitions များကို စစ်ဆေးပါ။

---

## 🧠 ၅။ Knowledge Check

1. **မေးခွန်း ၁**: နေ့စဉ် ညနေ ၆:၃၀ နာရီတိတိတွင် Script တစ်ခု run လိုပါက Cron expression မည်သို့ ရေးရမည်နည်း?
2. **မေးခွန်း ၂**: Hard Disk တစ်ခုကို Format မရိုက်မီ `lsblk` တွင် တွေ့ရသော်လည်း `df -h` တွင် အဘယ်ကြောင့် ရှာမတွေ့နိုင်သနည်း?
3. **မေးခွန်း ၃**: `/etc/fstab` တွင် ထည့်သွင်းပြီးနောက် စက် Restart မချမီ မည်သည့် command ဖြင့် syntax စစ်ဆေးရမည်နည်း?
