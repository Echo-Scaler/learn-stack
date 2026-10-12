---
title: SSH Remote Login, Secure File Transfer & Linux Permissions
description: SSH Remote Access, scp နှင့် rsync ဖြင့် File Transfer ပြုလုပ်ခြင်း, sudo နှင့် Linux File Permissions
---

## ၁။ SSH — Remote Server လုံခြုံစွာ ဝင်ရောက်ခြင်း

```bash
# ၁။ Private Key ဖြင့် Server သို့ ဝင်ရောက်ခြင်း
ssh -i ~/.ssh/my-server-key.pem ubuntu@54.23.11.8

# ၂။ သီးခြား Port (ဥပမာ 2222) သို့ ဝင်ရောက်ခြင်း
ssh -p 2222 -i ~/.ssh/my-server-key.pem ubuntu@54.23.11.8
```

---

## ၂။ `scp` vs `rsync` — File Transfer ပြုလုပ်ခြင်း

```bash
# ၁။ SCP ဖြင့် Local မှ Remote သို့ File တစ်ခု ကူးယူခြင်း
scp -i ~/.ssh/my-key.pem ./app.zip ubuntu@54.23.11.8:/opt/app/

# ၂။ rsync ဖြင့် ပြောင်းလဲချက်များသာ စစ်ဆေး၍ ကူးယူခြင်း (Production Best Practice)
rsync -avz -e "ssh -i ~/.ssh/my-key.pem" ./build/ ubuntu@54.23.11.8:/var/www/html/
# -a : Archive mode (Perms, timestamps ထိန်းသိမ်းသည်)
# -v : Verbose (တိုးတက်မှု ပြသည်)
# -z : Compress (ဒေတာကျုံ့၍ ပို့သဖြင့် မြန်သည်)
```

---

## ၃။ sudo & Linux Permissions

```bash
# File Permission ပုံစံ: rwx (Read=4, Write=2, Execute=1)
# ဥပမာ 755: Owner=rwx(7), Group=r-x(5), Others=r-x(5)
sudo chmod 755 /var/www/html
sudo chown -R www-data:www-data /var/www/html
```
