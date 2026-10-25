---
title: "Module 04: Bash Scripting & Automation for DevOps Engineers"
description: "Production Bash Scripting, Error Handling (set -euo pipefail), Cron Jobs, Idempotency, Server Health Checks & Automated Alerts"
---

> **ထပ်ခါတလဲလဲ ပြုလုပ်ရသော Server လုပ်ငန်းများကို အဆုံးသတ်ပြီး Production-Grade Bash Scripting ဖြင့် Automated Health Checks, Disaster Backups နှင့် Alerts စနစ်များ တည်ဆောက်ခြင်း**

---

## 📌 ၁။ Lesson Title (သင်ခန်းစာ ခေါင်းစဉ်)

### 🏷️ Topic: **Production Bash Scripting, Error Handling (set -euo pipefail), Cron Jobs, Idempotency & Automated Server Monitoring**
- **Track Level**: Core Automation (အလိုအလျောက် စီမံခန့်ခွဲမှု)
- **Target Audience**: DevOps Engineers, SysAdmins, Cloud Architects
- **Language**: မြန်မာဘာသာ အဓိကရှင်းလင်းချက် + Standard English Technical Terms

---

## 🎯 ၂။ Learning Objectives (သင်ယူမှု ရည်မှန်းချက်များ)

ဤသင်ခန်းစာကို ပြီးဆုံးပါက သင်သည် အောက်ပါ စွမ်းရည်များကို လက်တွေ့ ကျွမ်းကျင်စွာ အသုံးချနိုင်မည် ဖြစ်ပါသည် -

* [x] **Shebang & Safe Mode**: `#!/usr/bin/env bash` နှင့် `set -euo pipefail` ကို သုံး၍ အမှားမခံသော Robust Bash Scripts ရေးသားနိုင်ခြင်း။
* [x] **Variables & Quoting**: Bash variables, quotes (`""` vs `''`), command substitution (`$(...)`) နှင့် positional arguments (`$1`, `$#`, `$@`) များကို အမှားအယွင်းမရှိ သုံးစွဲနိုင်ခြင်း။
* [x] **Logic & Flow Control**: Conditions (`[[ ... ]]`), Loops (`for`, `while`), Functions နှင့် Return/Exit codes (`$?`) များကို စနစ်တကျ ရေးသားနိုင်ခြင်း။
* [x] **Idempotency**: Script တစ်ခုကို အကြိမ်ကြိမ် ပြေးဆွဲစေကာမူ မူလအခြေအနေ မပျက်စီးစေဘဲ တူညီသော ရလဒ်သာ ထွက်ပေါ်စေသော (Idempotent) scripts များ ရေးသားနိုင်ခြင်း။
* [x] **Structured Logging & Timestamps**: Log levels (`INFO`, `WARN`, `ERROR`) နှင့် ISO timestamps များဖြင့် Production audit logs များ ရေးသွင်းနိုင်ခြင်း။
* [x] **Crontab Task Scheduling**: Cron daemon ဖြင့် ညစဉ် automated backups များနှင့် မိနစ်ပိုင်း health checks များကို အချိန်ဇယားဆွဲ ပြေးဆွဲနိုင်ခြင်း။
* [x] **Alert Integration**: Webhook (Telegram/Slack/Discord) သို့ JSON payload ပို့ဆောင်၍ Server outage သတိပေးချက်များ အလိုအလျောက် ပေးပို့နိုင်ခြင်း။

---

## 📋 ၃။ Prerequisites (ကြိုတင် သိရှိထားရမည့် အချက်များ)

1. [Module 01: Linux Fundamentals](file:///Users/kyawwaiyan/Documents/my-Home-tech/all-in-one/devops-learning-guide/01-linux/README.md) — I/O streams (`stdout`, `stderr`, `2>&1`, `|`), pipes, `chmod +x` commands များ တတ်မြောက်ထားခြင်း။
2. Terminal text editor (`nano` သို့မဟုတ် `vim`) သို့မဟုတ် VS Code ကို အသုံးပြုတတ်ခြင်း။

---

## 📖 ၄။ Key English Terms with Burmese Explanations (အဓိက နည်းပညာ ဝေါဟာရများ)

| English Term | မြန်မာဘာသာ ပြန်ဆိုရှင်းလင်းချက် | Why it matters in real DevOps work | Practical Example |
|---|---|---|---|
| **Shebang (`#!`)** | Script ဖိုင်၏ ထိပ်ဆုံးတွင် ထည့်သွင်းရသော စာကြောင်းဖြစ်ပြီး OS အား မည်သည့် interpreter ဖြင့် run ရမည်ကို ညွှန်ပြသည် | System ပေါ်တွင် bash, python သို့မဟုတ် sh မှန်ကန်စွာ ရွေးချယ် run စေရန် မရှိမဖြစ် လိုအပ်သည်။ | `#!/usr/bin/env bash` |
| **`set -euo pipefail`** | Bash ၏ အန္တရာယ်ကင်း Unofficial Strict Mode (Error ဖြစ်လျှင် script ချက်ချင်း ရပ်တန့်စေသည်) | Error တစ်ခု တက်နေသော်လည်း script က ဆက်ပြေးပြီး ဆာဗာတစ်ခုလုံး ဖျက်ပစ်မိခြင်း (Disaster) မှ ကာကွယ်ပေးသည်။ | Script တိုင်း၏ ထိပ်ဆုံးတွင် ထည့်သွင်းခြင်း။ |
| **Idempotency** | Script သို့မဟုတ် Command တစ်ခုကို အကြိမ်ရေ မည်မျှပင် ထပ်ခါတလဲလဲ run စေကာမူ မူလ အကောင်းဆုံး ရလဒ်သာ ရရှိစေပြီး ပျက်စီးမသွားစေခြင်း | Server provisioning နှင့် automated deployment များတွင် မရှိမဖြစ် လိုက်နာရမည့် ရွှေရောင် စည်းမျဉ်း ဖြစ်သည်။ | Folder ရှိပြီးသားဖြစ်ပါက error မတက်စေသော `mkdir -p /path` |
| **Exit Code (`$?`)** | Command တစ်ခု ပြီးဆုံးသွားသောအခါ OS သို့ ပြန်လည် ပေးပို့သော ဂဏန်းအချက်ပြ (`0` = Success, `1-255` = Error) | CI/CD pipeline နှင့် Automation scripts များသည် command အောင်မြင်မှု ရှိမရှိကို exit code ဖြင့် ဆုံးဖြတ်သည်။ | `if [ $? -eq 0 ]; then echo "OK"; fi` |
| **Cron & Crontab** | Linux တွင် သတ်မှတ်ထားသော အချိန်ကာလ (နာရီ၊ ရက်၊ မိနစ်) အလိုက် Scripts များကို နောက်ကွယ်မှ အလိုအလျောက် run ပေးသော Time-based Job Scheduler | ညစဉ် Database Backup များ၊ Log Rotate များ၊ Disk cleanup များကို လူမပါဘဲ အလိုအလျောက် ခိုင်းစေရန် သုံးသည်။ | `0 2 * * * /opt/scripts/backup.sh` |
| **Webhook** | Event တစ်ခု ဖြစ်ပွားချိန်တွင် အခြား Service တစ်ခု (Slack / Telegram / Discord) ဆီသို့ HTTP POST ဖြင့် Real-time alert ပို့ဆောင်ပေးသော နည်းပညာ | Server Disk ပြည့်သွားပါက သို့မဟုတ် Service crash ဖြစ်ပါက အင်ဂျင်နီယာများ၏ ဖုန်းသို့ ချက်ချင်း Alert ရောက်ရှိစေသည်။ | `curl -X POST -H 'Content-Type: application/json' -d '{"text":"Alert!"}' $WEBHOOK_URL` |

---

## 💡 ၅။ Concept Explanation (အခြေခံ သဘောတရား ရှင်းလင်းချက်)

### ၅.၁ အဘယ်ကြောင့် `set -euo pipefail` ကို အမြဲ ထည့်သွင်းရသနည်း?

Bash ၏ မူလသဘာဝ (Default behavior) သည် အလွန် အန္တရာယ်များပါသည်:
- စာကြောင်းတစ်ခုတွင် Error တက်သော်လည်း နောက်စာကြောင်းများကို ဆက်လက် run ပါသည်။
- မသတ်မှတ်ရသေးသော Variable (Unbound variable) ကို ဗလာအဖြစ် သဘောထားပြီး run ပါသည်။

```bash
# ⚠️ အလွန် ဆိုးရွားသော Default Bash အမှား ဥပမာ:
TARGET_DIR="" # မှားယွင်းစွာ ဗလာဖြစ်နေခြင်း
rm -rf "$TARGET_DIR/*" # အကယ်၍ default bash ဖြစ်ပါက `rm -rf /*` ဖြစ်သွားပြီး ဆာဗာတစ်ခုလုံး ပျက်စီးသွားမည်!
```

အဆိုပါ ဘေးအန္တရာယ်ကို ကာကွယ်ရန် `set -euo pipefail` ကို သုံးပါသည်:
- **`-e` (errexit)**: Command တစ်ခုခု Error (Non-zero exit code) တက်သည်နှင့် Script ကို ချက်ချင်း အလိုအလျောက် ပိတ်ချသည်။
- **`-u` (nounset)**: မသတ်မှတ်ရသေးသော Variable ကို သုံးမိပါက Error ပြပြီး ချက်ချင်း ရပ်သည်။
- **`-o pipefail`**: Pipe line (`cmd1 | cmd2 | cmd3`) တွင် အလယ်မှ command တစ်ခု ကျရှုံးပါက pipeline တစ်ခုလုံးကို error အဖြစ် သတ်မှတ်သည်။

---

### ၅.၂ Quoting Rules (Quotes သုံးစွဲမှု စည်းမျဉ်းများ)

```bash
NAME="Production"

# 1. Double Quotes ("..."): Variables များကို တန်ဖိုးအစားထိုးပေးသည် (Interpolation)
echo "Server environment: $NAME" # Output: Server environment: Production

# 2. Single Quotes ('...'): စာသားအတိုင်း တိုက်ရိုက်ယူသည် (Literal string, No interpolation)
echo 'Server environment: $NAME' # Output: Server environment: $NAME

# 3. Command Substitution ($(command)): Command ရလဒ်ကို Variable ထဲ ထည့်ခြင်း
CURRENT_DATE=$(date +%Y-%m-%d)
```

---

## 🏗️ ၆။ Production-Grade Script Structure (လုပ်ငန်းခွင်သုံး စံပြ စနစ်)

```text
┌────────────────────────────────────────────────────────┐
│ 1. Shebang & Safe Flags: `#!/usr/bin/env bash`         │
│                          `set -euo pipefail`           │
├────────────────────────────────────────────────────────┤
│ 2. Constants & Environment Defaults:                   │
│    readonly APP_NAME="payment-api"                     │
│    readonly LOG_FILE="/var/log/${APP_NAME}.log"        │
├────────────────────────────────────────────────────────┤
│ 3. Helper Functions: `log_info()`, `log_error()`,      │
│                      `send_alert()`, `cleanup()`       │
├────────────────────────────────────────────────────────┤
│ 4. Trap Signals: `trap cleanup EXIT INT TERM`          │
├────────────────────────────────────────────────────────┤
│ 5. Input Validation & Pre-flight Checks (Root/Space)   │
├────────────────────────────────────────────────────────┤
│ 6. Core Business Logic Execution                       │
└────────────────────────────────────────────────────────┘
```

---

## 💻 ၇။ Full Production Script Example: Automated Server Health Monitor & Alert

အောက်ပါ script သည် CPU, Memory, Disk Space နှင့် Service အခြေအနေများကို စစ်ဆေးပြီး Threshold ကျော်ပါက သတိပေးချက် ထုတ်ပေးသော စံပြ Script ဖြစ်ပါသည်:

```bash
#!/usr/bin/env bash
# ==============================================================================
# Script Name : server_health_monitor.sh
# Description : Production Server Health Check with Logging and Alert Support
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# Configuration & Constants
# ------------------------------------------------------------------------------
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="/tmp/server_health.log"
readonly DISK_THRESHOLD_PERCENT=85
readonly MEMORY_THRESHOLD_PERCENT=90
readonly MONITORED_SERVICE="dummy-app.service"

# ------------------------------------------------------------------------------
# Logging Helper Functions
# ------------------------------------------------------------------------------
log_info() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] [INFO]  $*" | tee -a "$LOG_FILE"
}

log_warn() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] [WARN]  $*" | tee -a "$LOG_FILE" >&2
}

log_error() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] [ERROR] $*" | tee -a "$LOG_FILE" >&2
}

# ------------------------------------------------------------------------------
# Health Check Functions
# ------------------------------------------------------------------------------
check_disk_usage() {
    log_info "Checking root filesystem disk usage..."
    local usage
    usage=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

    if [[ "$usage" -ge "$DISK_THRESHOLD_PERCENT" ]]; then
        log_warn "HIGH DISK USAGE ALERT: Current usage is ${usage}% (Threshold: ${DISK_THRESHOLD_PERCENT}%)"
    else
        log_info "Disk usage is normal: ${usage}%"
    fi
}

check_memory_usage() {
    log_info "Checking system RAM usage..."
    local mem_usage
    mem_usage=$(free | awk '/Mem:/ {printf "%.0f", ($3/$2)*100}')

    if [[ "$mem_usage" -ge "$MEMORY_THRESHOLD_PERCENT" ]]; then
        log_warn "HIGH RAM USAGE ALERT: Current memory is ${mem_usage}% (Threshold: ${MEMORY_THRESHOLD_PERCENT}%)"
    else
        log_info "Memory usage is healthy: ${mem_usage}%"
    fi
}

check_service_status() {
    log_info "Checking status of ${MONITORED_SERVICE}..."
    if systemctl is-active --quiet "$MONITORED_SERVICE" 2>/dev/null; then
        log_info "Service ${MONITORED_SERVICE} is running normally."
    else
        log_error "CRITICAL: Service ${MONITORED_SERVICE} is DOWN or INACTIVE!"
    fi
}

# ------------------------------------------------------------------------------
# Main Function
# ------------------------------------------------------------------------------
main() {
    log_info "=== Starting Server Health Audit ==="
    check_disk_usage
    check_memory_usage
    check_service_status
    log_info "=== Server Health Audit Completed Successfully ==="
}

# Script စတင် ပြေးဆွဲခြင်း
main "$@"
```

---

## ⏰ ၈။ Cron Job Automation (အလိုအလျောက် အချိန်ဇယားဆွဲခြင်း)

အထက်ပါ Health check script ကို **၁၀ မိနစ်တစ်ကြိမ်** အလိုအလျောက် ပြေးဆွဲစေရန် `crontab -e` တွင် ထည့်သွင်းပုံ:

```bash
# Crontab ဖွင့်ခြင်း
crontab -e
```

Crontab တွင် အောက်ပါ စာကြောင်းကို ထည့်ပါ:
```text
# ၁၀ မိနစ်တစ်ကြိမ် ပုံမှန် စစ်ဆေးပြီး Output ကို log file သို့ ထည့်သွင်းခြင်း
*/10 * * * * /bin/bash /opt/scripts/server_health_monitor.sh >> /var/log/cron_health.log 2>&1
```

> **Cron Troubleshooting Tip:**  
> Cron သည် Minimal Environment (`$PATH` အကန့်အသတ်) ဖြင့် ပြေးဆွဲသဖြင့် Script အတွင်း Commands များကို Absolute Path (ဥပမာ- `/usr/bin/curl`, `/bin/systemctl`) ဖြင့် ညွှန်းပေးခြင်းသည် အကောင်းဆုံး ဖြစ်ပါသည်။

---

## ⚠️ ၉။ Common Errors & Troubleshooting (အဖြစ်များသော အမှားများနှင့် ဖြေရှင်းနည်း)

| အမှားအယွင်း (Error) | အကြောင်းရင်း (Root Cause) | စနစ်တကျ ဖြေရှင်းနည်း (Resolution) |
|---|---|---|
| **`command not found: $'\r'`** | Windows OS ပေါ်တွင် script ရေးသားခဲ့သဖြင့် CRLF (`\r\n`) line endings များ ပါဝင်နေခြင်း | `dos2unix script.sh` run ပါ သို့မဟုတ် VS Code တွင် `CRLF` မှ `LF` သို့ ပြောင်းပါ။ |
| **`unbound variable`** | `set -u` ကြောင့် variable တန်ဖိုး မသတ်မှတ်ရသေးဘဲ ခေါ်ယူမိခြင်း | Default value သတ်မှတ်ပါ: `${VARIABLE:-default_value}` |
| **Cron Script Not Executing** | Execution permission မရှိခြင်း သို့မဟုတ် `$PATH` မပြည့်စုံခြင်း | `chmod +x script.sh` ပေးပါ။ Script ထဲတွင် အပြည့်အစုံ path များ သုံးပါ။ |
| **Integer expression expected** | `if [ "$val" -gt 10 ]` စစ်ဆေးရာတွင် `$val` တန်ဖိုးသည် ကိန်းဂဏန်းမဟုတ်ဘဲ စာသား သို့မဟုတ် ဗလာ ဖြစ်နေခြင်း | Input ကို validate လုပ်ပါ: `if [[ "$val" =~ ^[0-9]+$ ]]; then ...` |

---

## 🏋️ ၁၀။ Hands-on Lab Exercise (လက်တွေ့ လေ့ကျင့်ခန်း)

**Exercise: Automated Database Backup & Retention Script**
1. `/opt/backup_lab` directory ဆောက်ပါ။
2. Dummy database dump ဖိုင်များ ဖန်တီးပါ (ဥပမာ- `touch /tmp/db_$(date +%s).sql`)။
3. အဆိုပါ SQL ဖိုင်များကို `tar -czvf` ဖြင့် `.tar.gz` ချုံ့ပြီး `/opt/backup_lab/` ထဲသို့ ရက်စွဲအလိုက် သိမ်းဆည်းသော Bash script တစ်ခု ရေးပါ။
4. **Retention Policy**: ၇ ရက်ထက် ကျော်လွန်သော backup ဖိုင်ဟောင်းများကို `find -mtime +7 -exec rm -f {} \;` ဖြင့် အလိုအလျောက် ရှင်းထုတ်ပေးသော logic ထည့်သွင်းပါ။
5. Script ကို manual run ၍ စစ်ဆေးပါ။

---

## ❓ ၁၁။ Knowledge Check (နားလည်မှု စစ်ဆေးခြင်း မေးခွန်းများ)

1. Bash script တွင် `set -e` နှင့် `set -o pipefail` မည်သို့ ကွာခြားသနည်း?
2. `${VARIABLE:-"default"}` ၏ အဓိပ္ပာယ်မှာ အဘယ်နည်း?
3. `trap 'rm -f "$TEMP_FILE"' EXIT` ၏ လုပ်ဆောင်ချက်မှာ အဘယ်နည်း?

<details>
<summary>🔍 အဖြေများကို ကြည့်ရှုရန် နှိပ်ပါ</summary>

1. `set -e` သည် ရိုးရိုး command တစ်ခု error တက်လျှင် script ကို ရပ်သည်။ သို့သော် `cmd1 | cmd2` ကဲ့သို့ pipe ဖြစ်နေပါက `cmd1` error တက်သော်လည်း `cmd2` အောင်မြင်လျှင် script မရပ်ပါ။ `set -o pipefail` ပေါင်းထည့်မှသာ pipe အတွင်း မည်သည့်နေရာတွင်မဆို error တက်ပါက ချက်ချင်း ရပ်တန့်မည် ဖြစ်သည်။
2. အကယ်၍ `VARIABLE` တွင် တန်ဖိုး မရှိသေးပါက (Unset or Empty) ဖြစ်ပါက `"default"` ဟူသော တန်ဖိုးကို အစားထိုး အသုံးပြုစေသည့် Parameter Expansion ဖြစ်သည်။
3. Script သည် ပုံမှန် ပြီးဆုံးသွားသည်ဖြစ်စေ၊ အလယ်တွင် Error တက်၍ ရပ်တန့်သွားသည်ဖြစ်စေ (EXIT signal ရတိုင်း) ယာယီဖိုင် `$TEMP_FILE` ကို အလိုအလျောက် ဖျက်ထုတ်ပေးသော cleanup handler ဖြစ်သည်။
</details>

---

## 💼 ၁၂။ Real DevOps Interview Questions & Sample Answers (အင်တာဗျူး မေးခွန်းနှင့် ဖြေဆိုပုံများ)

**Q1: Production တွင် Bash Script တစ်ခုကို 'Idempotent' ဖြစ်အောင် သင် မည်သို့ ဒီဇိုင်းဆွဲ ရေးသားမည်နည်း?**
> **Sample Answer**:
> "Idempotent script ဆိုသည်မှာ အကြိမ်ကြိမ် run သော်လည်း side-effect မရှိဘဲ target state အတိုင်းသာ ရောက်ရှိစေခြင်း ဖြစ်သည်။ လက်တွေ့တွင်: (၁) Folder ဆောက်ပါက `mkdir -p` ကို သုံးပါမည်။ (၂) User အသစ်ဆောက်ပါက `id -u <user>` ဖြင့် ရှိပြီးသားလား အရင်စစ်ဆေးပါမည်။ (၃) Configuration ဖိုင်ထဲသို့ စာကြောင်း ထည့်သွင်းပါက တိုက်ရိုက် `echo "text" >> file` မလုပ်ဘဲ `grep -q "text" file` ဖြင့် မရှိမှသာ append လုပ်ပါမည်။ (၄) Service restart ချပါက reload လုပ်ရုံဖြင့် လုံလောက်မှု ရှိမရှိ စစ်ဆေးပါမည်။ ဤနည်းဖြင့် Automation ပြေးဆွဲရာတွင် စနစ်ပျက်စီးမှုကို ကာကွယ်ပါမည်။"

---

## 📚 ၁၃။ References to Official Documentation (တရားဝင် လေ့လာစရာ လင့်ခ်များ)
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck: Static Analysis Tool for Shell Scripts](https://www.shellcheck.net/)
