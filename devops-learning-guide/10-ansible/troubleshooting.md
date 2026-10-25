# 🛠️ Ansible Production Troubleshooting Guide (မြန်မာဘာသာ)

> **လုပ်ငန်းခွင်တွင် အဖြစ်များဆုံး Ansible အမှား ၇ ခု၊ Root Causes များနှင့် Copy-Paste ပြုလုပ်နိုင်သော ဖြေရှင်းနည်းများ**

---

## 🚨 ပြဿနာ ၁: SSH Connection Failed / Permission Denied (publickey)

### လက္ခဏာ (Symptom):
```text
web1 | UNREACHABLE! => {
    "changed": false,
    "msg": "Failed to connect to the host via ssh: Permission denied (publickey).",
    "unreachable": true
}
```

### ဖြေရှင်းနည်း (Fix):
```bash
# SSH Public Key ကို Target Node သို့ ကူးထည့်ပါ
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@<TARGET_IP>
```

---

## 🚨 ပြဿနာ ၂: Sudo Password Required / Missing `--become`

### ဖြေရှင်းနည်း (Fix):
```bash
ansible-playbook site.yml -K
```

---

## 🚨 ပြဿနာ ၃: Jinja2 Template Variable Undefined Error

### ဖြေရှင်းနည်း (Fix):
Template ထဲတွင် default value ထည့်သွင်းပေးပါ: `listen {{ nginx_port | default(80) }};`

---

## 🚨 ပြဿနာ ၄: Handlers Not Firing

Task နာမည်နှင့် Handler နာမည် စာလုံးပေါင်း တူညီရပါမည်။ Task ပြောင်းလဲမှု (`changed: true`) ဖြစ်မှသာ Handler အလုပ်လုပ်ပါသည်။

---

## 🚨 ပြဿနာ ၅: Task is Not Idempotent (Always Showing Changed)

`shell` / `command` အစား built-in module သုံးပါ သို့မဟုတ် `args: creates: /path/to/file` ထည့်ပါ။

---

## 🚨 ပြဿနာ ၆: Python Interpreter Not Found on Target Node

Inventory တွင်:
```ini
[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

---

## 🚨 ပြဿနာ ၇: Ansible Vault Decryption Failed

```bash
ansible-playbook site.yml --ask-vault-pass
```
