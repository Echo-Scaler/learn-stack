---
title: "🚀 GitHub Actions CI/CD Cheatsheet & Syntax Reference"
description: "🚀 GitHub Actions CI/CD Cheatsheet & Syntax Reference"
---


> **Workflows, Event Triggers, Contexts, Expressions, Secret Masking & Matrix Builds Reference**

---

## 🏗️ ၁။ Core Workflow Structure (YAML ဖွဲ့စည်းပုံ အကျဉ်းချုပ်)

```yaml
name: Workflow Title

on:               # မည်သည့် Event ဖြစ်ပွားချိန်တွင် အလုပ်လုပ်မည်နည်း (Triggers)
  push:
    branches: [ main ]

permissions:      # GITHUB_TOKEN အခွင့်အရေး ကန့်သတ်ချက် (Least Privilege)
  contents: read

env:              # Global Environment Variables
  NODE_ENV: production

jobs:             # တစ်ပြိုင်နက် သို့မဟုတ် အစဉ်လိုက် run မည့် အလုပ်များ
  build-and-test:
    runs-on: ubuntu-latest  # Runner OS Environment
    steps:                  # အဆင့်ဆင့် လုပ်ဆောင်ချက်များ
      - name: Step 1
        uses: actions/checkout@v4
      - name: Step 2
        run: echo "Hello World"
```

---

## ⚡ ၂။ Event Triggers (မည်သည့်အခါ Run စေမည်နည်း)

| Trigger Syntax | ရှင်းလင်းချက် |
|---|---|
| `on: push: branches: [ main ]` | `main` branch သို့ code push တင်တိုင်း run သည်။ |
| `on: pull_request: types: [ opened, synchronize ]` | Pull Request အသစ်ဖွင့်ချိန် သို့မဟုတ် PR ထဲသို့ code အသစ်ထပ်ထည့်ချိန် run သည်။ |
| `on: workflow_dispatch:` | GitHub Web UI ပေါ်ရှိ **Run workflow** ခလုတ်ကို လူကိုယ်တိုင် နှိပ်မှသာ run သည်။ |
| `on: schedule: - cron: '0 2 * * *'` | နေ့စဉ် ညဉ့် ၂ နာရီတွင် အလိုအလျောက် run သည်။ |
| `on: release: types: [ published ]` | GitHub တွင် Release Tag အသစ် ထုတ်ဝေချိန်တွင် run သည်။ |
| `on: workflow_run: workflows: ["CI"] types: [completed]` | အခြား Workflow တစ်ခု (ဥပမာ CI Test) အောင်မြင်စွာ ပြီးဆုံးပြီးမှ နောက်ဆက်တွဲ run သည်။ |

---

## 🧩 ၃။ Contexts & Dynamic Expressions (`${{ ... }}`)

| Context Expression | တန်ဖိုးနှင့် ရှင်းလင်းချက် |
|---|---|
| `${{ github.sha }}` | လက်ရှိ Commit ၏ 40-character SHA hash (ဥပမာ- `c2a5e...`)။ |
| `${{ github.ref_name }}` | လက်ရှိ Branch အမည် သို့မဟုတ် Tag အမည် (ဥပမာ- `main` သို့မဟုတ် `v1.2.0`)။ |
| `${{ github.actor }}` | Workflow ကို စတင်စေခဲ့သော GitHub Username။ |
| `${{ github.repository }}` | `owner/repo-name` စာသား (ဥပမာ- `company/payment-api`)။ |
| `${{ secrets.MY_SECRET }}` | Repository Settings တွင် ထည့်ထားသော Encrypted Secret တန်ဖိုး။ |
| `${{ runner.os }}` | Runner OS အမည် (`Linux`, `Windows`, သို့မဟုတ် `macOS`)။ |

---

## 🚦 ၄။ Conditionals & Job Dependencies

### ၁။ Conditionals (`if:`):
```yaml
# main branch ပေါ်တွင်သာ run စေရန်
if: github.ref == 'refs/heads/main'

# ယခင် step ကျရှုံးသွားမှသာ run စေရန် (Failure Notification ပို့ခြင်း)
if: failure()

# အောင်မြင်သည်ဖြစ်စေ ကျရှုံးသည်ဖြစ်စေ အမြဲ run စေရန် (Cleanup)
if: always()
```

### ၂။ Job Dependencies (`needs:`):
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: test   # test job အောင်မြင်မှသာ deploy job စတင်မည်
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

---

## 🗃️ ၅။ Matrix Builds (အမျိုးမျိုးသော Version များဖြင့် ပြိုင်တူ စမ်းသပ်ခြင်း)

```yaml
jobs:
  multi-test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

---

## 📦 ၆။ Artifacts Upload & Download

Job တစ်ခုတွင် build ထုတ်လိုက်သော files (ဥပမာ- `.zip`, `.tar.gz`, `dist/`) များကို နောက် Job တစ်ခုသို့ လက်ဆင့်ကမ်းခြင်း:

```yaml
# Upload Artifact
- name: Upload Build Artifact
  uses: actions/upload-artifact@v4
  with:
    name: production-build
    path: dist/
    retention-days: 7

# Download Artifact (နောက် job တွင်)
- name: Download Build Artifact
  uses: actions/download-artifact@v4
  with:
    name: production-build
    path: ./dist
```
