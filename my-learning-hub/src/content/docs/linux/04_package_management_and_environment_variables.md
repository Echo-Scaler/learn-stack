---
title: Phase 1 Lesson 4 — Package Management & Environment Variables
description: Ubuntu Package Management (apt update, upgrade, install, purge), /etc/apt/sources.list, Environment Variables, $PATH သဘောတရားနှင့် ~/.bashrc (မြန်မာဘာသာ)
---

# 📦 Phase 1 — Lesson 4: Package Management & Environment Variables

Linux Server ပေါ်တွင် Software များ (ဥပမာ- Nginx, MySQL, Python, Git, Docker) ကို ထည့်သွင်းခြင်း၊ Update ပြုလုပ်ခြင်းနှင့် အမှိုက်များ ရှင်းလင်းခြင်းကို **Package Manager (`apt`)** ဖြင့် စီမံခန့်ခွဲရပါသည်။ ထို့အပြင် Application များ အလုပ်လုပ်ရာတွင် အသုံးပြုသော **Environment Variables (ပတ်ဝန်းကျင် ကိန်းရှင်များ)** နှင့် **`$PATH`** အလုပ်လုပ်ပုံကို နားလည်ထားရန် အရေးကြီးပါသည်။

---

## 💡 ၁။ Package Management Internals (`apt update` vs `apt upgrade`)

Ubuntu တွင် အသုံးများဆုံး အမှားတစ်ခုမှာ `apt update` နှင့် `apt upgrade` ကို အတူတူဟု ထင်မှတ်မှားခြင်း ဖြစ်ပါသည်။

```
Official Canonical Repositories (Cloud/Internet)
                      │
                      ▼ [ sudo apt update ]
Local Package Index Cache (/var/lib/apt/lists/)
                      │
                      ▼ [ sudo apt upgrade ]
Installed System Binaries & Packages (Disk)
```

1. **`sudo apt update`**:
   * မည်သည့် Software ကိုမှ **အသစ်မသွင်းပါ၊ Update မလုပ်ပါ**။
   * Remote Repository များမှ နောက်ဆုံးထွက် Package ဗားရှင်းစာရင်း (Index / Metadata) ကို ဒေါင်းလုဒ်ဆွဲပြီး Local Cache စာရင်းထဲသို့ ကူးယူဖြည့်တင်းပေးရုံသာ ဖြစ်ပါသည်။
2. **`sudo apt upgrade -y`**:
   * Local Index Cache စာရင်းနှင့် လက်ရှိစက်ပေါ်ရှိ ဗားရှင်းကို နှိုင်းယှဉ်ပြီး အသစ်ထွက်ရှိနေသော Package များကို အမှန်တကယ် ဒေါင်းလုဒ်ဆွဲကာ Install/Upgrade ပြုလုပ်ပေးပါသည်။

---

## ⌨️ ၂။ Important `apt` Commands & Breakdown

```bash
# ၁။ Package စာရင်း အသစ်ပြန်လည်ဆွဲယူခြင်း
sudo apt update

# ၂။ စက်ပေါ်ရှိ Software အားလုံးကို နောက်ဆုံးဗားရှင်းသို့ မြှင့်တင်ခြင်း
sudo apt upgrade -y

# ၃။ လိုအပ်သော Software တစ်ခုကို ရှာဖွေခြင်း
apt search nginx

# ၄။ Software အချက်အလက်နှင့် ဗားရှင်း ကြည့်ရှုခြင်း
apt show nginx

# ၅။ Software အသစ် ထည့်သွင်းခြင်း
sudo apt install -y htop curl tree

# ၆။ Software ကို ဖျက်ပစ်ခြင်း (Configuration ဖိုင်များ ကျန်ရှိနေမည်)
sudo apt remove nginx

# ၇။ Configuration ဖိုင်များပါ အကြွင်းမဲ့ အမြစ်ပြတ် ဖျက်ပစ်ခြင်း
sudo apt purge nginx

# ၈။ မလိုအပ်တော့သော မူလ dependencies အဟောင်းများကို ရှင်းထုတ်ခြင်း
sudo apt autoremove -y
```

---

## 🌐 ၃။ Environment Variables & `$PATH` Deep Dive

### Environment Variable ဆိုတာ ဘာလဲ?
Operating System နှင့် Application များ အချင်းချင်း အချက်အလက်များ (ဥပမာ- Database Host, API Key, Port, Language) မျှဝေသိရှိနိုင်ရန် RAM ပေါ်တွင် သိမ်းဆည်းထားသော **Key-Value Data Pairs** ဖြစ်ပါသည်။

### `$PATH` ဆိုတာ ဘာလဲ?
Terminal တွင် `ls` သို့မဟုတ် `python3` ဟု ရိုက်လိုက်သောအခါ Shell သည် ထို command ၏ executable binary ဖိုင်ကို ရှာဖွေရမည့် **Directory စာရင်းများ** ဖြစ်ပါသည်။

```bash
echo $PATH
# Output: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```
* Shell သည် ဘယ်ဘက်မှ စတင်၍ ညာဘက်သို့ အစဉ်လိုက် လိုက်ရှာပါသည်။ ရှာမတွေ့ပါက `command not found` ဟု တက်လာခြင်း ဖြစ်သည်။

### Command တစ်ခု မည်သည့်နေရာတွင် ရှိသည်ကို စစ်ဆေးနည်း:
```bash
which nginx
# Output: /usr/sbin/nginx
```

---

## ⚙️ ၄။ Persistent Environment Variables သတ်မှတ်နည်း

Terminal ပိတ်လိုက်သော်လည်း ပျောက်ကွယ်မသွားဘဲ အမြဲတည်ရှိနေစေရန် အောက်ပါအတိုင်း သတ်မှတ်ရပါမည် -

### က။ User တစ်ဦးတည်းအတွက် သတ်မှတ်လိုပါက (`~/.bashrc`)

```bash
# ~/.bashrc ဖိုင်အဆုံးတွင် ထည့်သွင်းပါ
echo 'export APP_ENV=production' >> ~/.bashrc
echo 'export PATH=$PATH:/opt/mycustomapp/bin' >> ~/.bashrc

# ပြင်ဆင်ချက်ကို ချက်ချင်း အသက်ဝင်စေရန်
source ~/.bashrc
```

### ခ။ System တစ်ခုလုံးရှိ User အားလုံးအတွက် သတ်မှတ်လိုပါက (`/etc/environment`)

```bash
# /etc/environment ဖိုင်ထဲတွင် ထည့်သွင်းပါ
sudo nano /etc/environment
# APP_ENV="production"
# DB_HOST="127.0.0.1"
```

### 💡 အသုံးဝင်သော Terminal Aliases သတ်မှတ်ခြင်း

နေ့စဉ် ရှည်လျားသော command များကို အတိုကောက် ခေါ်ဆိုနိုင်ရန် `~/.bashrc` တွင် ထည့်သွင်းပါ:
```bash
alias ll='ls -la'
alias update='sudo apt update && sudo apt upgrade -y'
```

---

## 🏋️ ၅။ Hands-on Practice

1. Ubuntu VM တွင် `sudo apt update` ပြုလုပ်ပါ။
2. `sudo apt install -y htop neofetch` ဖြင့် software ၂ ခုကို သွင်းပါ။
3. `neofetch` ဟု ရိုက်ပြီး Linux system status ကို လှပစွာ ကြည့်ရှုပါ။
4. `export MY_NAME="Kyaw Wai Yan"` ဖြင့် temporary variable တစ်ခု သတ်မှတ်ပြီး `echo $MY_NAME` စစ်ဆေးပါ။
5. `printenv | grep MY_NAME` ဖြင့် စစ်ဆေးပါ။
6. Terminal window အသစ်တစ်ခု ဖွင့်ပါက ထို variable ကျန်/မကျန် လေ့လာပါ။ (ပျောက်သွားပါမည်။ အမြဲတည်စေရန် `~/.bashrc` တွင် ထည့်ရမည်)။

---

## 🧠 ၆။ Knowledge Check

1. **မေးခွန်း ၁**: `sudo apt update` ပြုလုပ်ပြီးနောက် `sudo apt upgrade` ကို မ run ဘဲ ထားခဲ့ပါက စက်ပေါ်ရှိ Software များ အသစ်ဖြစ်သွားမည်လား? အဘယ်ကြောင့်နည်း?
2. **မေးခွန်း ၂**: `apt remove` နှင့် `apt purge` ၏ အဓိကကွာခြားချက်မှာ အဘယ်နည်း?
3. **မေးခွန်း ၃**: Script တစ်ခုကို Terminal မည်သည့်နေရာမှမဆို script အမည်သက်သက်ဖြင့် run နိုင်စေရန် မည်သည့် Environment Variable ထဲသို့ ထို script ရှိရာ directory လမ်းကြောင်းကို ထည့်သွင်းပေးရမည်နည်း?
