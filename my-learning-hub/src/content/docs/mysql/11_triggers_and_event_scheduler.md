---
title: "11. Triggers and Event Scheduler"
description: "1. [Database Trigger ဆိုတာဘာလဲ? (မီးလှန့်ခေါင်းလောင်း သဘောတရား)](#၁-database-trigger-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၁) - Triggers နှင့် MySQL Event Scheduler
### (Lesson 11: Database Triggers, NEW/OLD Keywords, Audit Trails & Scheduled Database Events)

---

## 📌 မာတိကာ (Contents)
1. [Database Trigger ဆိုတာဘာလဲ? (မီးလှန့်ခေါင်းလောင်း သဘောတရား)](#၁-database-trigger-ဆိုတာဘာလဲ)
2. [Trigger Timing နှင့် Events (BEFORE/AFTER INSERT/UPDATE/DELETE)](#၂-trigger-timing-နှင့်-events)
3. [`NEW` နှင့် `OLD` Keywords အသုံးပြုပုံ](#၃-new-နှင့်-old-keywords)
4. [လက်တွေ့ Production Audit Trail: ဈေးနှုန်းပြောင်းလဲမှု မှတ်တမ်းတင်သော Trigger](#၄-လက်တွေ့-production-audit-trail)
5. [`SIGNAL SQLSTATE` ဖြင့် စည်းကမ်းမညီသော ဒေတာများကို ပိတ်ပင်တားဆီးခြင်း](#၅-signal-sqlstate-ဖြင့်-တားဆီးခြင်း)
6. [MySQL Event Scheduler (Database အတွင်းရှိ Cron Job စနစ်)](#၆-mysql-event-scheduler)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Database Trigger ဆိုတာဘာလဲ?

**Database Trigger** ဆိုသည်မှာ သတ်မှတ်ထားသော ဇယားတစ်ခုပေါ်တွင် `INSERT`, `UPDATE` သို့မဟုတ် `DELETE` တစ်ခုခု ဖြစ်ပွားသွားသည့်အခါ မည်သူကမျှ လှမ်းခေါ်စရာမလိုဘဲ နောက်ကွယ်မှ **အလိုအလျောက် ချက်ချင်း အလုပ်လုပ်သွားသည့် (Auto-Executed)** SQL Block ဖြစ်ပါသည်။

### လုပ်ငန်းခွင်တွင် မည်သည့်နေရာ၌ သုံးသနည်း?
1. **Audit Logging (စာရင်းစစ် မှတ်တမ်းတင်ခြင်း)**: ဝန်ထမ်းတစ်ဦးက ဖောက်သည်၏ စာရင်း၊ ငွေကြေး သို့မဟုတ် ဈေးနှုန်းကို ပြောင်းလိုက်သည့်အခါ မူလတန်ဖိုးဟောင်း မည်မျှဖြစ်ပြီး တန်ဖိုးအသစ် မည်မျှသို့ မည်သူက ပြောင်းသွားသည်ကို ခြေရာခံခြင်း။
2. **Data Validation**: မမှန်ကန်သော အချက်အလက် ထည့်သွင်းမှုကို Database Level မှ တားဆီးခြင်း။

---

## ၂။ Trigger Timing နှင့် Events

Trigger တစ်ခုကို အောက်ပါ ပေါင်းစပ်မှု ၆ မျိုးဖြင့် ဖန်တီးနိုင်သည်:
* `BEFORE INSERT` / `AFTER INSERT`
* `BEFORE UPDATE` / `AFTER UPDATE`
* `BEFORE DELETE` / `AFTER DELETE`

---

## ③။ `NEW` နှင့် `OLD` Keywords

| Event | `OLD` ကော်လံ | `NEW` ကော်လံ |
| :--- | :--- | :--- |
| **`INSERT`** | မရှိပါ (ဒေတာဟောင်း မရှိသေးပါ) | **ရရှိသည်** (အသစ်ဝင်လာမည့် ဒေတာ) |
| **`UPDATE`** | **ရရှိသည်** (မပြင်ဆင်မီ မူလတန်ဖိုး) | **ရရှိသည်** (ပြင်ဆင်ပြီး ထွက်လာသော တန်ဖိုးသစ်) |
| **`DELETE`** | **ရရှိသည်** (ဖျက်လိုက်သော ဒေတာ) | မရှိပါ (ဒေတာအသစ် မရှိပါ) |

---

## ၄။ လက်တွေ့ Production Audit Trail (ဈေးနှုန်းပြောင်းလဲမှု ခြေရာခံခြင်း)

### အဆင့် ၁: Audit Log ဇယား ဖန်တီးခြင်း
```sql
CREATE TABLE price_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    old_price DECIMAL(10, 2) NOT NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100) DEFAULT (CURRENT_USER())
) ENGINE=InnoDB;
```

### အဆင့် ၂: Trigger ဖန်တီးခြင်း
```sql
DELIMITER //

CREATE TRIGGER trg_after_product_price_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- ဈေးနှုန်း အမှန်တကယ် ပြောင်းလဲမှသာ Log ရေးမည်
    IF OLD.price != NEW.price THEN
        INSERT INTO price_audit_logs (product_id, old_price, new_price)
        VALUES (OLD.id, OLD.price, NEW.price);
    END IF;
END //

DELIMITER ;
```

---

## ၅။ `SIGNAL SQLSTATE` ဖြင့် တားဆီးခြင်း

အကယ်၍ ဝန်ထမ်းတစ်ဦးက ပစ္စည်းဈေးနှုန်းကို အနှုတ်လက္ခဏာ (Negative value) သို့မဟုတ် သုည ရိုက်ထည့်မိပါက Trigger က Exception တက်စေပြီး လုပ်ငန်းစဉ်ကို ရပ်တန့်ပစ်နိုင်သည်:

```sql
DELIMITER //

CREATE TRIGGER trg_before_product_insert
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.price <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Product price must be greater than zero!';
    END IF;
END //

DELIMITER ;
```

---

## ၆။ MySQL Event Scheduler (Database Cron Jobs)

Linux တွင် Cron Job ရှိသကဲ့သို့ပင် MySQL တွင် သတ်မှတ်ထားသော အချိန်တိုင်း (ဥပမာ- နေ့စဉ် ညသန်းခေါင်တိုင်း) Database Tasks များကို အလိုအလျောက် run စေနိုင်ပါသည်:

### အဆင့် ၁: Event Scheduler ကို ဖွင့်လှစ်ခြင်း
```sql
SET GLOBAL event_scheduler = ON;
```

### အဆင့် ၂: သက်တမ်းကုန် Expired Sessions များကို နေ့စဉ် သန့်ရှင်းရေးလုပ်မည့် Event
```sql
DELIMITER //

CREATE EVENT evt_cleanup_expired_sessions
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 2 HOUR) -- မနက်ဖြန် မနက် ၂ နာရီတွင် စတင်မည်
DO
BEGIN
    -- ရက်ပေါင်း ၃၀ ကျော်သွားသော ဖျက်ပြီးသား အဟောင်းများကို ရှင်းလင်းခြင်း
    DELETE FROM user_sessions 
    WHERE last_activity < NOW() - INTERVAL 30 DAY;
END //

DELIMITER ;
```

### Events စာရင်း စစ်ဆေးခြင်း:
```sql
SHOW EVENTS;
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Audit Trails** | ငွေကြေး/အရေးကြီး အချက်အလက်များအတွက် `AFTER UPDATE` Trigger ဖြင့် Log သိမ်းသလား? | [ ] |
| **Trigger Performance** | Trigger ထဲတွင် လေးလံသော Query များ မရေးရန် သတိပြုမိသလား? (Trigger ကြောင့် Main INSERT/UPDATE နှေးသွားနိုင်သည်) | [ ] |
| **Event Scheduler** | `event_scheduler = ON` ဖွင့်ထားခြင်း ရှိ/မရှိ စစ်ဆေးပြီးပြီလား? | [ ] |

နောက်သင်ခန်းစာ [12_transactions_acid_and_concurrency.md](/mysql/12_transactions_acid_and_concurrency/) တွင် ဘဏ်လုပ်ငန်းသုံး ငွေလွှဲပြောင်းမှုများ မမှားယွင်းစေရန် အာမခံပေးသည့် ACID Transactions, Locking များနှင့် Deadlocks အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
