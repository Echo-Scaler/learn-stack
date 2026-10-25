---
title: "🛠️ Bash Scripting & Cron Troubleshooting Guide"
description: "🛠️ Bash Scripting & Cron Troubleshooting Guide"
---


> **Bash Scripts များနှင့် Crontab Automations များတွင် အဖြစ်အများဆုံး အမှားများ (Gotchas)၊ အန္တရာယ်များနှင့် လက်တွေ့ ပြင်ဆင်နည်းများ**

---

## 🚨 Bug 1: `syntax error near unexpected token $'\r'` (CRLF vs LF)

### 症状 (Symptoms):
- Script ကို run သောအခါ အောက်ပါ Error တက်ခြင်း:
  ```text
  bash: ./deploy.sh: /usr/bin/env: bad interpreter: No such file or directory
  # သို့မဟုတ်
  bash: ./deploy.sh: line 2: $'\r': command not found
  ```

### 💡 Root Cause:
- Script ကို Windows OS (သို့မဟုတ် Git for Windows) တွင် edit လုပ်ခဲ့သဖြင့် Line Endings သည် Windows စတိုင် **CRLF (`\r\n`)** ဖြစ်သွားခြင်း။ Linux သည် **LF (`\n`)** သာ နားလည်သောကြောင့် Carriage Return (`\r`) ကို command တစ်ခုအဖြစ် မှားယွင်း ဖတ်ရှုခြင်း ဖြစ်သည်။

### 🛠️ ဖြေရှင်းနည်း:
```bash
# Ubuntu/Debian တွင် dos2unix တူးလ် သွင်း၍ ပြောင်းလဲခြင်း
sudo apt-get install -y dos2unix
dos2unix deploy.sh

# သို့မဟုတ် sed ဖြင့် \r ကို တိုက်ရိုက် ဖျက်ထုတ်ခြင်း
sed -i 's/\r$//' deploy.sh
```

---

## 🚨 Bug 2: Subshell Variable Loss in Pipes (Pipe အတွင်း Variable မကျန်ရှိခြင်း)

### 症状 (Symptoms):
အောက်ပါ code တွင် `count` တန်ဖိုးသည် loop ပြီးသွားသော်လည်း `0` သာ ဆက်လက် ပြနေခြင်း:
```bash
count=0
cat /etc/passwd | while read -r line; do
    count=$((count + 1))
done
echo "Total users: $count" # Output: Total users: 0 (အမှား!)
```

### 💡 Root Cause:
- Linux တွင် Pipe (`|`) ၏ ညာဘက်ခြမ်းသည် **Subshell (သီးခြား Child Process)** အနေဖြင့် ပြေးဆွဲသဖြင့် loop ပြီးဆုံးပါက ၎င်း၏ memory space သည် ပျက်စီးသွားပြီး မူလ Parent shell ရှိ `count` တန်ဖိုးသို့ ပြန်မရောက်နိုင်တော့ပါ။

### 🛠️ ဖြေရှင်းနည်း (Process Substitution သို့မဟုတ် Here-String သုံးခြင်း):
```bash
count=0
while read -r line; do
    count=$((count + 1))
done < /etc/passwd

echo "Total users: $count" # Output: Total users: 35 (မှန်ကန်သွားပါပြီ!)
```

---

## 🚨 Bug 3: Word Splitting & Globbing (Spaces ပါသော ဖိုင်အမည်များကြောင့် ပျက်စီးခြင်း)

### 症状 (Symptoms):
```bash
FILE="my production backup.tar.gz"
ls -lh $FILE # Error: ls: cannot access 'my': No such file
             # ls: cannot access 'production': No such file
```

### 💡 Root Cause:
- Variable ကို Double Quotes (`"$FILE"`) ဖြင့် မအုပ်မိသဖြင့် Bash မှ Space စာလုံးများကို Argument ခွဲထုတ်မှု (Word Splitting) အဖြစ် မှားယွင်း သတ်မှတ်လိုက်ခြင်း ဖြစ်သည်။

### 🛠️ ဖြေရှင်းနည်း:
- Bash တွင် Variables များ အသုံးပြုတိုင်း **အမြဲ Double Quotes ဖြင့် အုပ်ပါ**:
  ```bash
  ls -lh "$FILE"
  rm -f "$TARGET_FILE"
  ```

---

## 🚨 Bug 4: Silent Cron Failures (Terminal တွင် ရပြီး Cron တွင် မပြေးခြင်း)

### 症状 (Symptoms):
- Terminal ပေါ်တွင် `/opt/scripts/backup.sh` ရိုက်ထည့်ပါက အောင်မြင်စွာ အလုပ်လုပ်သော်လည်း Cron ထဲ ထည့်ထားပါက မည်သည့်အလုပ်မှ မလုပ်ဘဲ တိတ်ဆိတ်စွာ ပျက်နေခြင်း။

### 💡 Root Cause:
1. **Cron Environment မတူညီခြင်း**: Cron သည် User Login shell မဟုတ်သဖြင့် `$PATH` သည် အလွန်တိုတောင်းသည် (ဥပမာ- `/usr/bin:/bin` သာ ပါပြီး `/usr/local/bin` သို့မဟုတ် custom paths မပါပါ)။
2. **Current Working Directory လွဲနေခြင်း**: Cron သည် User ၏ Home folder ပေါ်တွင် default ပြေးသဖြင့် relative path (`./config.env`) များ မတွေ့ရှိတော့ခြင်း။

### 🛠️ ဖြေရှင်းနည်း:
1. Script အတွင်း Commands အားလုံးကို **Absolute Path** ဖြင့်သာ ရေးပါ (ဥပမာ- `/usr/bin/docker`, `/usr/bin/aws`, `/usr/bin/curl`)။
2. Script အစတွင် Directory ကို တိုက်ရိုက် ပြောင်းပါ:
   ```bash
   cd "$(dirname "$0")" || exit 1
   ```
3. Crontab ထိပ်ဆုံးတွင် `$PATH` ကို တိကျစွာ ကြေညာပေးပါ:
   ```text
   PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
   SHELL=/bin/bash

   0 2 * * * /opt/scripts/backup.sh >> /var/log/cron_backup.log 2>&1
   ```

---

## 🚨 Bug 5: `set -o pipefail` အောက်တွင် `grep` ကြောင့် Script ရပ်သွားခြင်း

### 症状 (Symptoms):
```bash
set -euo pipefail
# အောက်ပါ စာကြောင်းတွင် "NOT_FOUND" မတွေ့ပါက grep မှ exit code 1 ထုတ်ပေးသဖြင့် script တစ်ခုလုံး ရပ်တန့်သွားခြင်း
cat /var/log/app.log | grep "NOT_FOUND" | wc -l
```

### 💡 Root Cause:
- `grep` သည် ရှာဖွေသော စာသား မတွေ့ရှိပါက Exit Code `1` ကို ထုတ်ပေးပါသည်။ `pipefail` ရှိနေသဖြင့် Pipeline တစ်ခုလုံး ပျက်စီးသွားသည်ဟု ယူဆကာ script ရပ်တန့်သွားခြင်း ဖြစ်သည်။

### 🛠️ ဖြေရှင်းနည်း:
- မဖြစ်မနေ စစ်ဆေးလိုပါက `|| true` ဖြင့် safe ဖြစ်အောင် ထိန်းပါ:
  ```bash
  match_count=$(grep "NOT_FOUND" /var/log/app.log || true)
  ```
