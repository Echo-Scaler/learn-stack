---
title: "16. Backup, Restore and DR"
description: "1. [Backup အမျိုးအစား ၂ မျိုး (Logical Backup vs Physical Backup)](#၁-backup-အမျိုးအစား-၂-မျိုး)"
---

## 🐬 သင်ခန်းစာ (၁၆) - Backup၊ Restore နှင့် Point-in-Time Disaster Recovery
### (Lesson 16: Logical vs Physical Backups, Production mysqldump, Binlog & Point-in-Time Recovery)

---

## 📌 မာတိကာ (Contents)
1. [Backup အမျိုးအစား ၂ မျိုး (Logical Backup vs Physical Backup)](#၁-backup-အမျိုးအစား-၂-မျိုး)
2. [Production `mysqldump` အရေးကြီးသော Flags များ (`--single-transaction`)](#၂-production-mysqldump-flags)
3. [Backup ပြုလုပ်ခြင်းနှင့် ပြန်လည် Restore လုပ်ခြင်း Commands](#၃-backup-နှင့်-restore-commands)
4. [Binary Logs (Binlog) ဆိုတာဘာလဲ? အဘယ်ကြောင့် မရှိမဖြစ် လိုအပ်သနည်း?](#၄-binary-logs-binlog-ဆိုတာဘာလဲ)
5. [Point-in-Time Recovery (PITR) လက်တွေ့ သရုပ်ပြချက် (မတော်တဆ ဇယားဖျက်မိသော ဘေးမှ ကယ်တင်ခြင်း)](#၅-point-in-time-recovery-လက်တွေ့)
6. [AWS S3 သို့ အလိုအလျောက် Backup ပို့ပေးမည့် Bash Script](#၆-aws-s3-သို့-အလိုအလျောက်-backup-ပို့သည့်-script)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Backup အမျိုးအစား ၂ မျိုး

1. **Logical Backup (SQL Dump)**:
   * ဒေတာများကို `CREATE TABLE`, `INSERT INTO` စသည့် SQL စာသားများအဖြစ် ထုတ်ယူခြင်း (ဥပမာ- `mysqldump`)။
   * **အားသာချက်**: လူဖတ်ရလွယ်ခြင်း၊ မတူညီသော MySQL Version များသို့ အလွယ်တကူ ရွှေ့ပြောင်းနိုင်ခြင်း။
2. **Physical Backup (Raw Data Copy)**:
   * Disk ပေါ်ရှိ တကယ့် Binary `.ibd` ဖိုင်များကို တိုက်ရိုက် ကူးယူခြင်း (ဥပမာ- **Percona XtraBackup**)။
   * **အားသာချက်**: Terabyte ပေါင်းများစွာရှိသော ဧရာမ Database များကို မိနစ်ပိုင်းဖြင့် Backup & Restore လုပ်နိုင်ခြင်း။

---

## ၂။ Production `mysqldump` အရေးကြီးသော Flags များ

အစပြုသူ အများစုသည် `mysqldump -u root -p my_db > backup.sql` ဟု ရိုးရိုး ရိုက်လေ့ရှိသည်။  
ဤသို့ ရိုက်လိုက်ပါက **ဇယားအားလုံး Lock ကျသွားပြီး Website တစ်ခုလုံး ရပ်တန့် (Downtime) သွားနိုင်သည်!**

### Production စံချိန်မီ Command:
```bash
mysqldump -u root -p \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --events \
  --default-character-set=utf8mb4 \
  --databases shop_db | gzip > shop_db_backup_$(date +%F).sql.gz
```

### အရေးကြီး Flags ရှင်းလင်းချက်:
* **`--single-transaction`**: **အရေးအကြီးဆုံး flag ဖြစ်သည်**။ InnoDB ၏ MVCC Snapshot ကို အသုံးပြုသဖြင့် **ဇယားများကို Lock မခတ်ဘဲ** Website ပုံမှန် လည်ပတ်နေစဉ်မှာပင် Consistent Backup ရရှိစေသည်။
* **`--quick`**: ဒေတာများကို RAM ထဲ အလုံးအရင်း မဆွဲဘဲ Row တစ်ကြောင်းချင်း Stream လုပ်သဖြင့် Server RAM ပြည့်ပြီး Crash မဖြစ်အောင် ကာကွယ်ပေးသည်။
* **`--routines --triggers --events`**: စာရင်းဇယားများသာမက Stored Procedures, Triggers များနှင့် Events များကိုပါ တစ်ပါတည်း Backup ပါသွားစေသည်။
* **`| gzip`**: `.sql` ဖိုင်ကြီးကို အရွယ်အစား ၈၀% ခန့် သေးငယ်သွားအောင် ချက်ချင်း Compress ချုံ့ပေးသည်။

---

## ၃။ Backup နှင့် Restore Commands

### (က) Backup ဆွဲယူခြင်း:
```bash
# Database တစ်ခုတည်းကို Backup ဆွဲခြင်း
mysqldump -u root -p --single-transaction --quick shop_db | gzip > shop_db.sql.gz

# Server ပေါ်ရှိ Database အားလုံးကို Backup ဆွဲခြင်း
mysqldump -u root -p --single-transaction --quick --all-databases | gzip > all_dbs.sql.gz
```

### (ခ) ပြန်လည် Restore လုပ်ခြင်း:
```bash
# Compressed ဖိုင်ကို Database အသစ်ထဲသို့ တိုက်ရိုက် ပြန်ဖြည်ထည့်ခြင်း
gunzip < shop_db.sql.gz | mysql -u root -p shop_db
```

---

## ၄။ Binary Logs (Binlog) ဆိုတာဘာလဲ?

`mysqldump` သည် ၂၄ နာရီလျှင် တစ်ကြိမ် (ညသန်းခေါင် ၁၂ နာရီတွင်) သာ Backup လုပ်လေ့ရှိသည်။

**မေးခွန်း**: ညသန်းခေါင် ၁၂:၀၀ တွင် Backup လုပ်ထားပြီးနောက် နောက်တစ်နေ့ နေ့လယ် ၂:၃၀ တွင် Server ပျက်စီးသွားပါက မနက်ပိုင်း အော်ဒါ ဒေတာ ၁၄ နာရီစာ ဆုံးရှုံးသွားမည် မဟုတ်ပါလား?

အဖြေမှာ **Binary Log (Binlog)** ဖြစ်သည်။  
MySQL တွင် Binlog ဖွင့်ထားပါက Database ထဲသို့ ဝင်ရောက်လာသမျှ `INSERT`, `UPDATE`, `DELETE` လုပ်ငန်းစဉ်တိုင်းကို စက္ကန့်ပိုင်းနှင့်အမျှ သီးခြား မှတ်တမ်းတင်ထားပေးပါသည်။

---

## ၅။ Point-in-Time Recovery (PITR) လက်တွေ့

### အဖြစ်ဆိုး ဇာတ်လမ်း:
* မနက် 00:00 တွင် Full Backup ရှိသည်။
* နေ့လယ် 14:30:15 တွင် Junior Developer က `DROP TABLE orders;` မှားယွင်းစွာ ရိုက်မိသည်။

### ကယ်တင်နည်း အဆင့်ဆင့်:
1. **အဆင့် ၁**: ညသန်းခေါင်က ဆွဲထားသော Full Backup ကို စမ်းသပ် Server ထဲသို့ အရင် Restore လုပ်ပါ။ (14:30 အထိ ဒေတာ မပြည့်စုံသေးပါ)။
2. **အဆင့် ၂**: Binlog ထဲမှ ညသန်းခေါင် 00:00 မှ နေ့လယ် 14:30:14 (Error မတိုင်မီ ၁ စက္ကန့်အလိုအထိ) ဒေတာများကို ပြန်လည် ထုတ်ယူပါ:
   ```bash
   mysqlbinlog --stop-datetime="2026-09-27 14:30:14" \
     /var/lib/mysql/binlog.000015 | mysql -u root -p shop_db
   ```
3. **ရလဒ်**: မတော်တဆ ဖျက်မိသော အချိန်မတိုင်မီ စက္ကန့်ပိုင်းအထိ Data ၁၀၀% ပြည့်စုံစွာ အောင်မြင်စွာ ပြန်လည်ရရှိသွားမည် ဖြစ်ပါသည်။

---

## ၆။ AWS S3 သို့ အလိုအလျောက် Backup ပို့သည့် Bash Script

`backup_to_s3.sh`:

```bash
#!/bin/bash
set -e

DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_DIR="/tmp/backups"
DB_NAME="shop_db"
S3_BUCKET="s3://my-company-database-backups"

mkdir -p $BACKUP_DIR
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

echo "Starting Database Backup for $DB_NAME..."
mysqldump -u root -p"SuperSecret123" \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  $DB_NAME | gzip > $BACKUP_FILE

echo "Uploading to AWS S3..."
aws s3 cp $BACKUP_FILE $S3_BUCKET/

echo "Cleaning up local temp files..."
rm -f $BACKUP_FILE

echo "Backup completed successfully!"
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **No Locking Flag** | `mysqldump` တွင် `--single-transaction` အမြဲ သုံးထားသလား? | [ ] |
| **Binary Logging** | Point-in-time recovery အတွက် `log_bin = ON` ဖြစ်နေသလား? | [ ] |
| **Offsite Storage** | Backup ဖိုင်များကို Server ပေါ်တွင်သာ မထားဘဲ AWS S3 ကဲ့သို့ Cloud Storage သို့ ရွှေ့ပြောင်းထားသလား? | [ ] |
| **Restore Drill** | Backup ဖိုင်များသည် အမှန်တကယ် ပြန် Restore လုပ်၍ ရ/မရ လစဉ် စမ်းသပ်စစ်ဆေးသလား? | [ ] |

နောက်သင်ခန်းစာ [17_replication_high_availability_and_clustering.md](/mysql/17_replication_high_availability_and_clustering/) တွင် Database Server တစ်ခု ပျက်သွားသော်လည်း အရန် Server မှ ချက်ချင်း အစားထိုးနိုင်သည့် Master-Slave Replication အကြောင်းကို လေ့လာပါမည်။
