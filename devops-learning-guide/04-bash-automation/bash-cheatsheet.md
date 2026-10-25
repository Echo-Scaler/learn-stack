# 📜 Production Bash Scripting Cheatsheet for DevOps

> **Robust, Production-Grade Bash Scripting Syntax, Parameter Expansions, Loops & Traps Reference**

---

## 🛡️ ၁။ The Ultimate Strict Mode Template (စံပြ Script အစပျိုးပုံ)

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Script Directory ကို Absolute Path အနေဖြင့် ရှာဖွေခြင်း
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cleanup Trap: Script ရပ်တန့်တိုင်း ယာယီဖိုင်များကို အလိုအလျောက် ရှင်းလင်းခြင်း
cleanup() {
    local exit_code=$?
    # rm -rf "$TEMP_DIR" 2>/dev/null || true
    exit "$exit_code"
}
trap cleanup EXIT INT TERM
```

---

## 🔧 ၂။ Parameter Expansions (Advanced Variable Operations)

| Syntax | ရှင်းလင်းချက် | ဥပမာ |
|---|---|---|
| `${VAR:-default}` | `VAR` သည် ဗလာဖြစ်ပါက `"default"` ကို အသုံးပြုသည်။ | `PORT="${PORT:-8080}"` |
| `${VAR:=default}` | `VAR` သည် ဗလာဖြစ်ပါက `"default"` သတ်မှတ်ပြီး variable ထဲ တန်းထည့်သည်။ | `: "${ENVIRONMENT:=production}"` |
| `${VAR:?error_msg}` | `VAR` မရှိပါက `error_msg` ကို stderr သို့ပြပြီး script ကို ချက်ချင်း ပိတ်ချသည်။ | `DB_HOST="${DB_HOST:?Database host must be set}"` |
| `${VAR:+alternate}` | `VAR` တန်ဖိုး ရှိနေမှသာ `"alternate"` ကို သုံးသည်။ | `DEBUG_FLAG="${DEBUG:+--verbose}"` |
| `${#VAR}` | စာသား၏ အလျား (Length of string) ကို ရေတွက်သည်။ | `len=${#PASSWORD}` |
| `${VAR#pattern}` | ထိပ်ဆုံးမှ pattern ကို အတိုဆုံး ဖြတ်ထုတ်သည် (Trim prefix) | `file="data.tar.gz"; echo ${file#*.}` ➜ `tar.gz` |
| `${VAR##pattern}` | ထိပ်ဆုံးမှ pattern ကို အရှည်ဆုံး ဖြတ်ထုတ်သည် | `file="data.tar.gz"; echo ${file##*.}` ➜ `gz` |
| `${VAR%pattern}` | အမြီးဘက်မှ pattern ကို အတိုဆုံး ဖြတ်ထုတ်သည် (Trim suffix) | `path="/var/log/app.log"; echo ${path%.log}` ➜ `/var/log/app` |
| `${VAR//search/replace}` | စာသားအားလုံးကို ရှာဖွေ အစားထိုးသည်။ | `text="apple,orange,apple"; echo ${text//apple/banana}` |

---

## ⚖️ ၃။ Test Operators in `[[ ... ]]` (အခြေအနေ စစ်ဆေးခြင်းများ)

### File Tests:
- `[[ -f "$FILE" ]]` : Regular file အမှန်တကယ် တည်ရှိပါက True။
- `[[ -d "$DIR" ]]` : Directory အမှန်တကယ် တည်ရှိပါက True။
- `[[ -s "$FILE" ]]` : ဖိုင်ရှိပြီး 0 byte ထက် ကြီးမားပါက (ဖိုင်အလွတ် မဟုတ်ပါက) True။
- `[[ -r "$FILE" ]]` / `[[ -w "$FILE" ]]` / `[[ -x "$FILE" ]]` : Read, Write, Execute permission ရှိပါက True။

### String Tests:
- `[[ -z "$STR" ]]` : String တန်ဖိုး ဗလာ (Empty) ဖြစ်ပါက True။
- `[[ -n "$STR" ]]` : String တန်ဖိုး ဗလာ မဟုတ်ပါက (Non-empty) True။
- `[[ "$STR1" == "$STR2" ]]` : String နှစ်ခု ထပ်တူညီပါက True။
- `[[ "$STR" =~ ^[0-9]+$ ]]` : Regex Pattern (ကိန်းဂဏန်းစစ်စစ် ဖြစ်ခြင်း) ကိုက်ညီပါက True။

### Integer Tests:
- `[[ "$A" -eq "$B" ]]` : Equal (`==`)
- `[[ "$A" -ne "$B" ]]` : Not Equal (`!=`)
- `[[ "$A" -gt "$B" ]]` : Greater Than (`>`)
- `[[ "$A" -ge "$B" ]]` : Greater Than or Equal (`>=`)
- `[[ "$A" -lt "$B" ]]` : Less Than (`<`)
- `[[ "$A" -le "$B" ]]` : Less Than or Equal (`<=`)

---

## 🔁 ၄။ Loops & Reading Files Efficiently

### ၁။ ဖိုင်တစ်ခုကို Line-by-Line အန္တရာယ်ကင်းစွာ ဖတ်ရှုခြင်း:
```bash
while IFS= read -r line || [[ -n "$line" ]]; do
    echo "Processing line: $line"
done < "/path/to/servers.txt"
```

### ၂။ Arrays နှင့် Loop ပတ်ခြင်း:
```bash
readonly SERVICES=("nginx" "postgresql" "redis-server")

for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "$service"; then
        echo "$service is healthy"
    else
        echo "ALERT: $service is down!" >&2
    fi
done
```

---

## 📨 ၅။ Telegram / Slack Webhook Alert Function

```bash
send_slack_alert() {
    local message="$1"
    local webhook_url="${SLACK_WEBHOOK_URL:-}"

    if [[ -z "$webhook_url" ]]; then
        echo "No Slack Webhook configured. Skipping alert." >&2
        return 0
    fi

    curl -s -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 [DevOps Alert] : ${message}\"}" \
        "$webhook_url" > /dev/null
}
```
