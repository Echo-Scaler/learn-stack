---
title: "Ansible Production Troubleshooting Guide"
description: "Real-world Ansible failures, SSH issues, become errors, Jinja2 syntax mistakes, and their step-by-step fixes (မြန်မာဘာသာ)"
---


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

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Control Node ၏ Public Key (`id_ed25519.pub`) သည် Target Node ၏ `~/.ssh/authorized_keys` ထဲတွင် မရှိသေးခြင်း။
2. Inventory သို့မဟုတ် `ansible.cfg` ထဲတွင် user အမည် (`remote_user = ubuntu`) သို့မဟုတ် private key file path မှားယွင်းနေခြင်း။
3. Target Node ၏ `~/.ssh` permissions မှားယွင်းနေခြင်း (700 ဖြစ်ရမည်၊ `authorized_keys` သည် 600 ဖြစ်ရမည်)။

### ဖြေရှင်းနည်း (Fix):
```bash
# အဆင့် ၁: SSH Public Key ကို Target Node သို့ ကူးထည့်ပါ
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@<TARGET_IP>

# အဆင့် ၂: ansible.cfg တွင် private_key_file path ကို သေချာစစ်ဆေးပါ
# ansible.cfg
[defaults]
private_key_file = ~/.ssh/id_ed25519
remote_user = ubuntu

# အဆင့် ၃: SSH command ဖြင့် သီးသန့် အရင်စမ်းသပ်ပါ
ssh -i ~/.ssh/id_ed25519 -vvv ubuntu@<TARGET_IP>
```

---

## 🚨 ပြဿနာ ၂: Sudo Password Required / Missing `--become`

### လက္ခဏာ (Symptom):
```text
fatal: [web1]: FAILED! => {"changed": false, "msg": "Missing sudo password"}
# သို့မဟုတ်
fatal: [web1]: FAILED! => {"changed": false, "msg": "Failed to lock apt for exclusive access"}
```

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Target server တွင် `apt` သွင်းခြင်း သို့မဟုတ် `/etc/` အောက်ရှိ ဖိုင်များ ပြင်ဆင်ရာတွင် root privilege လိုအပ်သော်လည်း `become: true` ထည့်မထားခြင်း။
2. Sudo run ရန် password လိုအပ်နေပြီး Ansible run သည့်အခါ password မပေးထားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```bash
# နည်းလမ်း A: Command run သည့်အခါ -K ထည့်ပါ (Password ရိုက်ထည့်ရန်)
ansible-playbook site.yml -K

# နည်းလမ်း B: Target node တွင် passwordless sudo ခွင့်ပြုထားပါ
sudo visudo
# အောက်ပါအတိုင်း ထည့်ပါ:
# ubuntu ALL=(ALL) NOPASSWD:ALL
```

---

## 🚨 ပြဿနာ ၃: Jinja2 Template Variable Undefined Error

### လက္ခဏာ (Symptom):
```text
fatal: [web1]: FAILED! => {"msg": "'nginx_port' is undefined"}
```

### ဖြေရှင်းနည်း (Fix):
Template ထဲတွင် default value ထည့်သွင်းပေးပါ:
```jinja2
listen {{ nginx_port | default(80) }};
```

---

## 🚨 ပြဿနာ ၄: Handlers Not Firing

### လက္ခဏာ (Symptom):
Configuration file ပြောင်းသွားသော်လည်း Nginx reload/restart မဖြစ်ခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
1. Task နာမည်နှင့် Handler နာမည် စာလုံးပေါင်း မကိုက်ညီခြင်း (`notify: restart nginx` vs `name: Restart Nginx`)။
2. Task သည် change မဖြစ်ခြင်း (`changed: false`)။ Handler သည် task အမှန်တကယ် ပြောင်းလဲမှသာ (`changed: true`) trigger ဖြစ်ပါသည်။

### ဖြေရှင်းနည်း (Fix):
```yaml
tasks:
  - name: Copy nginx config
    ansible.builtin.template:
      src: templates/nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: Restart Nginx  # Case-sensitive ဖြစ်ပါသည်

handlers:
  - name: Restart Nginx
    ansible.builtin.service:
      name: nginx
      state: restarted
```

---

## 🚨 ပြဿနာ ၅: Task is Not Idempotent (Always Showing Changed)

### လက္ခဏာ (Symptom):
Playbook ကို အကြိမ်ကြိမ် run သော်လည်း task သည် `changed: [host]` အမြဲ ပြနေခြင်း။

### ဖြစ်ရသည့်အကြောင်းအရင်း (Root Cause):
`command` သို့မဟုတ် `shell` module ကို သုံးထားပြီး ပြောင်းလဲမှု စစ်ဆေးသည့် condition မထည့်ထားခြင်း။

### ဖြေရှင်းနည်း (Fix):
```yaml
# မမှန်ကန်သော ပုံစံ:
- name: Download file
  ansible.builtin.shell: curl -o /tmp/file.tar.gz https://example.com/file.tar.gz

# မှန်ကန်သော Idempotent ပုံစံ (creates parameter ထည့်ခြင်း):
- name: Download file idempotently
  ansible.builtin.shell: curl -o /tmp/file.tar.gz https://example.com/file.tar.gz
  args:
    creates: /tmp/file.tar.gz
```

---

## 🚨 ပြဿနာ ၆: Python Interpreter Not Found on Target Node

### လက္ခဏာ (Symptom):
```text
fatal: [web1]: FAILED! => {"ansible_facts": {}, "changed": false, "failed_modules": {"ansible.legacy.setup": {"failed": true, "msg": "/usr/bin/python: not found"}}}
```

### ဖြေရှင်းနည်း (Fix):
Inventory တွင် Python 3 interpreter path ကို သတ်မှတ်ပေးပါ:
```ini
[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

---

## 🚨 ပြဿနာ ၇: Ansible Vault Decryption Failed

### လက္ခဏာ (Symptom):
```text
fatal: [web1]: FAILED! => {"msg": "Decryption failed (no vault secrets found)"}
```

### ဖြေရှင်းနည်း (Fix):
```bash
# Password prompt ဖြင့် run ပါ:
ansible-playbook site.yml --ask-vault-pass

# သို့မဟုတ် vault password file ပေးပါ:
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```
