---
title: Phase 6 Lesson 15 — Bash Scripting, Pipes & Text Processing
description: Bash Automation, set -euo pipefail, Pipes (|), Redirection, Exit Codes, grep, sed, awk, cut, sort, xargs နှင့် Production Server Health Check Script (မြန်မာဘာသာ)
---

# 📜 Phase 6 — Lesson 15: Bash Scripting, Pipes & Text Processing

Junior Developer တစ်ဦးသည် အလုပ်တစ်ခုကို အကြိမ်ကြိမ် ကိုယ်တိုင် manual ရိုက်နှိပ်လုပ်ဆောင်နေချိန်တွင် Senior Linux Engineer တစ်ဦးသည် ထိုအလုပ်ကို **Bash Script (Shell Scripting)** ဖြင့် တစ်ခါတည်း အလိုအလျောက် ရေးသားခိုင်းစေထားလေ့ရှိပါသည်။

ဤအခန်းတွင် Robust Bash Scripting စံနှုန်းများ၊ Pipes (`|`)၊ Redirection (`>`, `>>`)၊ **grep, sed, awk** စာသားခွဲခြမ်းစိတ်ဖြာရေး ကိရိယာများနှင့် Production Health Check Script ရေးသားနည်းတို့ကို လေ့လာသွားပါမည်။

---

## 💡 ၁။ Production-Grade Bash Header (`set -euo pipefail`)

Bash Script ရေးသားရာတွင် စာကြောင်းအမှားတစ်ခုခု ကြုံရပါက script ဆက်လက် run နေပြီး ဘေးဆိုးမဖြစ်ပေါ်စေရန် Script ထိပ်ဆုံးတွင် အမြဲတမ်း ဤ header ကို ထည့်သွင်းရပါမည်:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

### အဓိပ္ပာယ် ရှင်းလင်းချက်:
* **`-e` (Exit on error)**: မည်သည့် command မဆို error တက်ပါက (Exit code non-zero) script ကို ချက်ချင်း ရပ်တန့်ပါ။
* **`-u` (Unset variables)**: သတ်မှတ်မထားသော variable ကို ခေါ်သုံးမိပါက error ပြပြီး ရပ်ပါ။
* **`-o pipefail`**: Pipe (`cmd1 | cmd2`) ထဲတွင် ရှေ့ command က ကျရှုံးခဲ့ပါက pipeline တစ်ခုလုံး ကျရှုံးသည်ဟု သတ်မှတ်ပါ။

---

## 🔀 ၂။ Pipes (`|`) နှင့် Redirection (`>`, `>>`, `2>&1`)

* **Standard Streams**:
  * `stdin` (0): Keyboard input
  * `stdout` (1): ပုံမှန် output စာသား
  * `stderr` (2): Error output စာသား
* **Redirection သင်္ကေတများ**:
  * `>` : ဖိုင်အဟောင်းကို အစားထိုး၍ output သိမ်းဆည်းခြင်း (Overwrite)
  * `>>` : ဖိုင်အဆုံးတွင် စာကြောင်းအသစ် ထပ်ဖြည့်သိမ်းဆည်းခြင်း (Append)
  * `2>&1`: Error စာသားများကိုပါ ပုံမှန် Output စာသားလမ်းကြောင်းထဲသို့ ပေါင်းထည့်ခြင်း
  * `> /dev/null 2>&1`: Output ရော Error ရော မည်သည့်စာသားမှ မပြလိုဘဲ အသံတိတ် စွန့်ပစ်ခြင်း (Silent mode)
* **Pipe (`|`)**: ရှေ့ command ၏ Output ကို နောက် command ၏ Input အဖြစ် တိုက်ရိုက် လွှဲပြောင်းပေးပို့ခြင်း။

---

## 🔪 ၃။ Text Processing Power Tools (grep, sed, awk, cut, sort)

Linux တွင် Log ဖိုင်များနှင့် System metrics များကို ခွဲခြမ်းစိတ်ဖြာရန် အောက်ပါ ၅ မျိုးကို တွဲဖက် အသုံးပြုပါသည်:

```bash
# ၁။ grep: သတ်မှတ်စကားလုံး ပါဝင်သော စာကြောင်းများကိုသာ ရွေးထုတ်ခြင်း
grep -i "error" /var/log/nginx/error.log

# ၂။ awk: စာကြောင်းတစ်ကြောင်းရှိ သီးသန့် ကော်လံ (Column) ကို ထုတ်ယူခြင်း ($1 = column 1)
ps aux | awk '{print $1, $2, $3}'

# ၃။ sed: စာသားများကို ရှာဖွေပြီး အစားထိုးလဲလှယ်ခြင်း (Stream Editor)
sed 's/localhost/127.0.0.1/g' config.json

# ၄။ cut & sort & uniq: ထပ်ခါတလဲလဲ အကြိမ်ရေ ရေတွက်ခြင်း
# Web Access Log မှ အများဆုံး ဝင်ရောက်သော IP Top 5 ကို ရှာဖွေနည်း
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -5
```

---

## 🛠️ ၄။ Production Server Health Check Script (လက်တွေ့ Project)

အောက်ပါ script သည် CPU, Memory, Disk နှင့် Nginx အခြေအနေများကို စစ်ဆေးပေးပြီး ပြဿနာရှိပါက Alert ပေးပို့ပါမည်:

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "   PRODUCTION SERVER HEALTH CHECK"
echo "   Date: $(date)"
echo "=========================================="

# ၁။ CPU Load Average စစ်ဆေးခြင်း
CPU_LOAD=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | tr -d ' ')
echo "[+] CPU Load (1 min): $CPU_LOAD"

# ၂။ Memory Usage စစ်ဆေးခြင်း
RAM_USED_PCT=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
echo "[+] RAM Usage: ${RAM_USED_PCT}%"
if (( $(echo "$RAM_USED_PCT > 85.0" | bc -l) )); then
    echo "    ⚠️ WARNING: High Memory Usage!"
fi

# ၃။ Root Disk Usage စစ်ဆေးခြင်း
DISK_USED_PCT=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
echo "[+] Root Disk Usage: ${DISK_USED_PCT}%"
if [ "$DISK_USED_PCT" -gt 85 ]; then
    echo "    🚨 CRITICAL: Disk space running out!"
fi

# ၄။ Nginx Service အခြေအနေ စစ်ဆေးခြင်း
if systemctl is-active --quiet nginx; then
    echo "[+] Nginx Service: RUNNING"
else
    echo "    🚨 CRITICAL: Nginx is DOWN! Restarting..."
    sudo systemctl restart nginx
fi

echo "=========================================="
echo "   Health check completed successfully."
echo "=========================================="
```

---

## 🏋️ ၅။ Hands-on Practice

1. `nano health_check.sh` ဖြင့် အထက်ပါ script ကို ဖန်တီးပါ။
2. `chmod +x health_check.sh` ဖြင့် execute permission ပေးပါ။
3. `./health_check.sh` ကို run ပြီး စနစ်၏ CPU, RAM, Disk အခြေအနေများကို စစ်ဆေးကြည့်ပါ။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: Bash Script ထိပ်ဆုံးတွင် `set -euo pipefail` ထည့်သွင်းခြင်း၏ အကျိုးကျေးဇူးမှာ အဘယ်နည်း?
2. **မေးခွန်း ၂**: Command တစ်ခု၏ output ကို `>> /var/log/app.log 2>&1` ဟု ပေးလိုက်ပါက ဘာလုပ်ဆောင်ပေးသနည်း?
3. **မေးခွန်း ၃**: Log ဖိုင်တစ်ခုအတွင်းမှ Error စာကြောင်းများကို ရှာဖွေပြီး ပထမဆုံး စာလုံး ၃ လုံးကိုသာ ထုတ်ယူလိုပါက မည်သည့် command ၂ ခုကို Pipe (`|`) ဆက်ရမည်နည်း?
