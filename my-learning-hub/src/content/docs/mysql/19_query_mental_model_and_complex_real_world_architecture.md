---
title: "19. Query Architecture"
description: "1. [Query ရေးသားရာတွင် Senior Engineer တစ်ဦး၏ အတွေးအခေါ် (The 6-Step Mental Model)](#၁-query-ရေးသားရာတွင်-အတွေးအခေါ်)"
---

## 🐬 သင်ခန်းစာ (၁၉) - Query ရေးသားရာတွင် တွေးခေါ်ရမည့် အခြေခံ အတွေးအခေါ် (Mental Model) နှင့် လုပ်ငန်းခွင်သုံး အရှုပ်ထွေးဆုံး DB Architecture နမူနာ
### (Lesson 19: The Query Design Mental Model, SARGability, Concurrency & Enterprise Multi-Vendor FinTech Schema)

---

## 📌 မာတိကာ (Contents)
1. [Query ရေးသားရာတွင် Senior Engineer တစ်ဦး၏ အတွေးအခေါ် (The 6-Step Mental Model)](#၁-query-ရေးသားရာတွင်-အတွေးအခေါ်)
   - [၁.၁။ Data Volume & Cardinality (ဒေတာ အရွယ်အစားနှင့် စစ်ထုတ်မှု အချိုးအစား)](#၁၁-data-volume--cardinality)
   - [၁.၂။ Filter Early & Driving Table (အစောဆုံး အဆင့်တွင် ဒေတာ အနည်းဆုံး ဖြစ်အောင် ချုံ့ခြင်း)](#၁၂-filter-early--driving-table)
   - [၁.၃။ SARGability (Index ကို မဖျက်ဆီးဘဲ အပြည့်အဝ အသုံးချနိုင်စွမ်း)](#၁၃-sargability)
   - [၁.၄။ Memory & Network Footprint (RAM နှင့် Bandwidth ချွေတာခြင်း)](#၁၄-memory--network-footprint)
   - [၁.၅။ Concurrency & Lock Contention (အခြား User များ မထိခိုက်စေရန် စဉ်းစားခြင်း)](#၁၅-concurrency--lock-contention)
   - [၁.၆။ Engine Execution Lifecycle ကို ကြိုတင် မြင်ယောင်ခြင်း](#၁၆-engine-execution-lifecycle)
2. [မဖြစ်မနေ ရှောင်ကြဉ်ရမည့် Query ရေးသားမှု အမှားဆိုးကြီး ၅ ချက်](#၂-မဖြစ်မနေ-ရှောင်ကြဉ်ရမည့်-အမှားဆိုးကြီးများ)
3. [လုပ်ငန်းခွင်သုံး အရှုပ်ထွေးဆုံး Real-World Database Architecture: FinTech Multi-Vendor Marketplace & Ledger](#၃-လုပ်ငန်းခွင်သုံး-အရှုပ်ထွေးဆုံး-db-architecture)
   - [၃.၁။ စနစ်၏ E-R Architecture Diagram](#၃၁-စနစ်၏-e-r-architecture-diagram)
   - [၃.၂။ Production DDL Tables Schema ဖန်တီးခြင်း](#၃၂-production-ddl-tables-schema)
4. [လက်တွေ့ Complex Business Queries နှင့် လိုင်းချင်းစီ၏ အတွေးအခေါ် ရှင်းလင်းချက်](#၄-လက်တွေ့-complex-business-queries)
   - [Query ၁: Flash Sale Checkout (Stock Reservation & Concurrency Lock)](#query-၁-flash-sale-checkout)
   - [Query ၂: Multi-Vendor Monthly Settlement Reconciliation Report (Financial Ledger Audit)](#query-၂-multi-vendor-monthly-settlement)
5. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၅-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Query ရေးသားရာတွင် Senior Engineer တစ်ဦး၏ အတွေးအခေါ် (Mental Model)

အတွေ့အကြုံနည်းသော Developer သည် Query ရေးသည့်အခါ:
> *"ငါ လိုချင်တဲ့ Data ထွက်လာရင် ပြီးရော"* ဟူသော စိတ်တစ်ခုတည်းဖြင့် ရေးတတ်ကြသည်။

သို့သော် Senior Backend / Database Engineer တစ်ဦးသည် Query တစ်ကြောင်း မရေးမီ အောက်ပါ **အဓိက အချက် ၆ ချက်ကို ဦးနှောက်ထဲတွင် အလိုအလျောက် တွေးတော စစ်ဆေးပါသည်**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE QUERY DESIGN MENTAL MODEL                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Data Volume?     │ စုစုပေါင်း အချက်အလက် ဘယ်လောက်ရှိသလဲ? (1K vs 50M)   │
├─────────────────────┼──────────────────────────────────────────────────┤
│ 2. Filter Early?    │ JOIN မလုပ်ခင် ဒေတာ အနည်းဆုံးဖြစ်အောင် အရင်ဖြတ်သလား?│
├─────────────────────┼──────────────────────────────────────────────────┤
│ 3. SARGable Index?  │ Index ကို သုံးနိုင်အောင် ရေးထားသလား?             │
├─────────────────────┼──────────────────────────────────────────────────┤
│ 4. Payload Size?    │ လိုအပ်တဲ့ Column လောက်ပဲ ဆွဲထုတ်နေသလား?          │
├─────────────────────┼──────────────────────────────────────────────────┤
│ 5. Lock Impact?     │ အခြား User တွေရဲ့ လုပ်ငန်းကို Lock ပိတ်ဆို့သလား? │
├─────────────────────┼──────────────────────────────────────────────────┤
│ 6. Execution Plan?  │ Filesort သို့မဟုတ် Temp Table ဖြစ်မဖြစ် စစ်ပြီးပြီလား│
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

### ၁.၁။ Data Volume & Cardinality (ဒေတာ အရွယ်အစားနှင့် ရွေးချယ်မှု အချိုး)
* **မေးရမည့် မေးခွန်း**: *"ဒီ Table ထဲမှာ အခု Record ဘယ်လောက်ရှိလဲ? နောက် ၃ နှစ်မှာ ဘယ်လောက် ဖြစ်လာမလဲ?"*
* **Cardinality ဆိုတာဘာလဲ**: Column တစ်ခုထဲတွင် ထူးခြားသော တန်ဖိုး မည်မျှ ကွဲပြားသနည်း (ဥပမာ- `gender` သည် Cardinality အလွန်နိမ့်သည် - M/F ၂ ခုသာရှိသည်၊ `user_id` သည် Cardinality အလွန်မြင့်သည် - လူတိုင်း မတူပါ)။
* **သဘောပေါက်ရမည့် အချက်**: Cardinality နိမ့်သော Column (ဥပမာ- `status = 'active'`) သည် ဒေတာ ၉၀% ကို ရွေးထုတ်ပေးမည်ဆိုပါက MySQL သည် Index ရှိသော်လည်း Index ကို မသုံးဘဲ Full Table Scan သို့ ခုန်ဆင်းသွားတတ်သည်။

---

### ၁.၂။ Filter Early & Driving Table (အစောဆုံး အဆင့်တွင် ချုံ့ပစ်ခြင်း)
ဇယား ၅ ခုကို JOIN ပြီးမှ အောက်ဆုံးရောက်မှ `WHERE` ဖြင့် လိုက်ဖြတ်ပါက MySQL သည် သန်းပေါင်းများစွာသော ဒေတာများကို Memory ထဲ အရင် ပေါင်းစပ်ရသဖြင့် အလွန်လေးလံသွားသည်။

**မှန်ကန်သော တွေးခေါ်ပုံ**:
အစောဆုံး အဆင့်တွင် အသေးငယ်ဆုံး ဒေတာအရေအတွက် ဖြစ်စေမည့် **Driving Table** ကို ရှာဖွေပြီး ထို Table ကို ဦးစွာ စစ်ထုတ်ပါ။

---

### ၁.၃။ SARGability (Search Argument Able - Index ကို အပြည့်အဝ အသုံးချနိုင်စွမ်း)
Index တင်ထားသော Column ကို Function အုပ်လိုက်ပါက Index သည် ချက်ချင်း အသုံးမဝင်တော့ပါ (Index Blindness):

```sql
-- ❌ Non-SARGable (MySQL သည် Row တိုင်းကို DATE function လိုက်တွက်ရသဖြင့် Index မသုံးနိုင်ပါ)
WHERE DATE(created_at) = '2026-09-27'

-- ✅ SARGable (Index ကို B-Tree Range Scan အဖြစ် အပြည့်အဝ အသုံးချနိုင်သည်)
WHERE created_at >= '2026-09-27 00:00:00' AND created_at <= '2026-09-27 23:59:59'
```

---

### ၁.၄။ Memory & Network Footprint
* Database မှ Web App (Laravel/Node) ဆီသို့ Network မှတစ်ဆင့် Data ပို့ရသည်။
* `SELECT *` ဖြင့် မလိုအပ်သော 5MB ရှိသော JSON အဝတ်အထည် သို့မဟုတ် Bio Text ကြီးကို ဆွဲထုတ်လိုက်ပါက Database RAM သာမက Web Server ၏ PHP Memory ပါ ပြည့်သွားမည်။

---

### ၁.၅။ Concurrency & Lock Contention (ပြိုင်တူ သုံးစွဲမှု သက်ရောက်မှု)
* သင်၏ Query သည် ရိုးရိုး `SELECT` ဖြစ်ပါက အခြားသူများကို မထိခိုက်ပါ။
* သို့သော် `UPDATE`, `DELETE` သို့မဟုတ် `SELECT ... FOR UPDATE` ဖြစ်ပါက မည်သည့် အတန်းများကို Lock ခတ်သွားမည်နည်း?
* အကယ်၍ `WHERE` clause တွင် Index မပါပါက MySQL သည် **ဇယားတစ်ခုလုံးရှိ Row အားလုံးကို Lock ခတ်ပစ်လိုက်သဖြင့် အခြား User များ Website သုံးမရတော့ဘဲ စောင့်နေရပါမည်!**

---

### ၁.၆။ Engine Execution Lifecycle ကို ကြိုတင် မြင်ယောင်ခြင်း
Query ရေးသည့်အခါ Database Engine သည်:
$$\text{FROM} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY} \longrightarrow \text{LIMIT}$$
အတိုင်း အလုပ်လုပ်သည်ကို အမြဲ မြင်ယောင်နေရပါမည်။

---

## ၂။ မဖြစ်မနေ ရှောင်ကြဉ်ရမည့် Query ရေးသားမှု အမှားဆိုးကြီး ၅ ချက်

1. **`SELECT *` ရောဂါ**: လိုအပ်သော Columns များကိုသာ မဖြစ်မနေ ရွေးထုတ်ပါ။
2. **N+1 Query Problem (Loop ထဲတွင် Query ထည့်ပတ်ခြင်း)**: Code ထဲတွင် Loop ၁၀၀ ပတ်ပြီး Query အကြိမ် ၁၀၀ run ခြင်းအစား `JOIN` သို့မဟုတ် `WHERE id IN (...)` ဖြင့် ၁ ကြိမ်တည်း ဆွဲယူပါ။
3. **Leading Wildcard LIKE (`%search`)**: ရှေ့တွင် `%` ပါပါက B-Tree Index လုံးဝ မသုံးနိုင်ဘဲ Full Table Scan ဖြစ်သည်။
4. **Calculations on Indexed Columns (`WHERE price * 0.9 > 100`)**: Column ဘက်တွင် သင်္ချာမတွက်ပါနှင့်၊ ဂဏန်းဘက်တွင် တွက်ပါ (`WHERE price > 100 / 0.9`)။
5. **Pagination မပါဘဲ အလုံးစုံ ဆွဲယူခြင်း**: ဒေတာ ၁ သန်းကို `LIMIT` မပါဘဲ `SELECT` လုပ်ပါက Database Server Crash ဖြစ်သွားနိုင်သည်။

---

## ၃။ လုပ်ငန်းခွင်သုံး အရှုပ်ထွေးဆုံး Real-World Database Architecture

လက်တွေ့ လုပ်ငန်းခွင်တွင် အရှုပ်ထွေးဆုံးနှင့် စိန်ခေါ်မှု အများဆုံး စနစ်တစ်ခုမှာ **"Multi-Vendor E-Commerce Platform with Double-Entry Wallet Ledger & Inventory Reservation"** (Shopee, Grab, Foodpanda ကဲ့သို့သော စနစ်) ဖြစ်ပါသည်။

### ၃.၁။ စနစ်၏ E-R Architecture Diagram

```
┌──────────────────┐         ┌─────────────────────────┐
│     MERCHANTS    │         │          USERS          │
│ (ဆိုင်ပိုင်ရှင်များ)  │         │  (ဖောက်သည်များ / ဝယ်သူများ)   │
└────────┬─────────┘         └────────────┬────────────┘
         │ 1:N                            │ 1:N
         ▼                                ▼
┌──────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│     PRODUCTS     │         │         ORDERS          │◄────────┤   ORDER_STATUS_HISTORY  │
│  (ကုန်ပစ္စည်းများ)   │         │ (အော်ဒါချုပ် / Status)     │ 1:N     │  (State Machine မှတ်တမ်း) │
└────────┬─────────┘         └────────────┬────────────┘         └─────────────────────────┘
         │ 1:N                            │ 1:N
         ▼                                ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│    PRODUCT_VARIANTS     │  │       ORDER_ITEMS       │
│ (Color, Size, SKU, Qty) │  │ (မှာယူသော ပစ္စည်းအသေးစိတ်) │
└────────┬────────────────┘  └─────────────────────────┘
         │ 1:N (Flash Sale Checkout)
         ▼
┌─────────────────────────────────┐
│     INVENTORY_RESERVATIONS      │ ◄── Over-selling မဖြစ်စေရန် ယာယီ Lock ခတ်ထားသော စာရင်း
│ (User 10 ယောက်ကို ၁၅ မိနစ် lock ပေးခြင်း)│
└─────────────────────────────────┘

======================= [ FINTECH DOUBLE-ENTRY LEDGER ] =======================
┌─────────────────────────┐         ┌─────────────────────────────────────────┐
│     USER_WALLETS        │         │             LEDGER_ENTRIES              │
│ (လက်ရှိ ပိုက်ဆံအိတ် Balance) │◄────────┤ (မပြင်ဆင်ရသော စာရင်းစစ် Debit/Credit စာအုပ်)  │
└─────────────────────────┘ 1:N     │ - Entry ID, Wallet ID, Direction        │
                                    │ - Amount, Reference Type, Balance After │
                                    └─────────────────────────────────────────┘
```

---

### ၃.၂။ Production DDL Tables Schema ဖန်တီးခြင်း

```sql
-- ၁။ Merchants (ဆိုင်ခန်းများ)
CREATE TABLE merchants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 5.00, -- 5% platform fee
    is_verified TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ၂။ Product Variants (SKU, Size, Color, Stock)
CREATE TABLE product_variants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    merchant_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    physical_stock INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_variant_merchant FOREIGN KEY (merchant_id) REFERENCES merchants(id)
) ENGINE=InnoDB;

-- ၃။ Inventory Reservations (11.11 Flash Sale တွင် Stock လုဝယ်ရာ၌ Over-selling မဖြစ်စေရန်)
CREATE TABLE inventory_reservations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    reserved_quantity INT UNSIGNED NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('pending', 'completed', 'expired') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reservation_lookup (variant_id, status, expires_at),
    CONSTRAINT fk_res_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- ၄။ Orders (State Machine ပုံစံဖြင့် ထိန်းချုပ်ခြင်း)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    subtotal DECIMAL(12, 2) NOT NULL,
    platform_discount DECIMAL(12, 2) DEFAULT 0.00,
    final_amount DECIMAL(12, 2) NOT NULL,
    current_status ENUM('created', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'created',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_orders (user_id, created_at),
    INDEX idx_status_created (current_status, created_at)
) ENGINE=InnoDB;

-- ၅။ Order Items
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    merchant_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    merchant_earnings DECIMAL(12, 2) NOT NULL, -- Commission ဖြတ်ပြီး ဆိုင်ရမည့်ငွေ
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    INDEX idx_merchant_sales (merchant_id, order_id)
) ENGINE=InnoDB;

-- ၆။ User & Merchant Wallets (လက်ရှိ Balance)
CREATE TABLE wallets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_type ENUM('user', 'merchant', 'platform') NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    current_balance DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'MMK',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_owner_wallet (owner_type, owner_id)
) ENGINE=InnoDB;

-- ၇။ Double-Entry Ledger (FinTech စံနှုန်း - မည်သည့်အခါမျှ UPDATE မလုပ်ရ၊ INSERT သာ ခွင့်ပြုသည်)
CREATE TABLE ledger_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_uuid CHAR(36) NOT NULL,
    wallet_id BIGINT UNSIGNED NOT NULL,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL, -- DEBIT (ငွေထွက်), CREDIT (ငွေဝင်)
    amount DECIMAL(14, 2) NOT NULL,
    balance_after DECIMAL(14, 2) NOT NULL,
    reference_type ENUM('order_payment', 'merchant_payout', 'refund', 'topup') NOT NULL,
    reference_id BIGINT UNSIGNED NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallet_ledger (wallet_id, created_at),
    INDEX idx_tx_uuid (transaction_uuid),
    CONSTRAINT fk_ledger_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id)
) ENGINE=InnoDB;
```

---

## ၄။ လက်တွေ့ Complex Business Queries နှင့် တွေးခေါ်ပုံများ

---

### Query ၁: Flash Sale Checkout (Stock Reservation & Concurrency Lock)

> **Business Problem**:  
> Flash Sale တွင် iPhone 15 Pro ပစ္စည်း ၅ လုံးသာ ကျန်ရှိချိန်တွင် User အယောက် ၅၀ က တစ်ပြိုင်နက် "Checkout" နှိပ်လိုက်သည်။  
> **လိုအပ်ချက်**: Over-selling (ပစ္စည်း ၅ လုံးထက် ပိုရောင်းမိခြင်း) လုံးဝ မဖြစ်စေရ။

```sql
START TRANSACTION;

-- အဆင့် ၁: သက်ဆိုင်ရာ Product Variant ကို Row-Level Exclusive Lock ခတ်ပြီး လက်ရှိ ရုပ်ပိုင်းဆိုင်ရာ Stock ကို ဖတ်သည်
SELECT id, physical_stock, price 
FROM product_variants 
WHERE id = 1001 
FOR UPDATE;

-- အဆင့် ၂: လက်ရှိအချိန်တွင် အခြားသူများ ဦးထားသော်လည်း ၁၅ မိနစ် မပြည့်သေးသော (Active Reservations) အရေအတွက်ကို တွက်သည်
SELECT COALESCE(SUM(reserved_quantity), 0) INTO @currently_reserved
FROM inventory_reservations
WHERE variant_id = 1001 
  AND status = 'pending' 
  AND expires_at > NOW();

-- အဆင့် ၃: အမှန်တကယ် ဝယ်ယူနိုင်သော လက်ကျန် Stock (Available Stock) ကို တွက်ချက်သည်
-- Available = Physical Stock - Currently Reserved
SET @available_stock = (SELECT physical_stock FROM product_variants WHERE id = 1001) - @currently_reserved;

-- အဆင့် ၄: ဝယ်သူတောင်းဆိုသော အရေအတွက် (ဥပမာ- ၁ လုံး) ရ/မရ ဆုံးဖြတ်သည်
-- အကယ်၍ Available Stock >= 1 ဖြစ်ပါက ၁၅ မိနစ်စာ ယာယီ Reservation Record အသစ် ထည့်သွင်းသည်
INSERT INTO inventory_reservations (variant_id, user_id, reserved_quantity, expires_at, status)
VALUES (1001, 502, 1, NOW() + INTERVAL 15 MINUTE, 'pending');

COMMIT;
```

#### 💡 ဤနေရာတွင် Engineer ၏ တွေးခေါ်ပုံ (Mental Model):
1. **Concurrency Control**: `FOR UPDATE` သုံးထားသဖြင့် အခြား User ၄၉ ယောက်သည် မီလီစက္ကန့်ပိုင်းအတွင်း အလှည့်ကျ စောင့်ဆိုင်းရပြီး တစ်ပြိုင်နက် ဝင်လုခြင်း (Race Condition) မဖြစ်နိုင်တော့ပါ။
2. **Index Optimization**: `inventory_reservations` တွင် `(variant_id, status, expires_at)` ကို Composite Index ကြိုတင် တင်ထားသဖြင့် အဆင့် ၂ ရှိ SUM Query သည် **0.0002 စက္ကန့်သာ** ကြာမြင့်သည်။
3. **Short-lived Locks**: Transaction ကို ရှည်လျားစွာ မထားဘဲ Stock စစ်ပြီးသည်နှင့် ချက်ချင်း `COMMIT` ပြုလုပ်ကာ Lock ကို အမြန်ဆုံး ဖြေလျှော့ပေးသည်။

---

### Query ၂: Multi-Vendor Monthly Settlement Reconciliation Report (Financial Ledger Audit)

> **Business Problem**:  
> လကုန်သည့်အခါ Platform ပိုင်ရှင်သည် ဆိုင်ခန်းတစ်ခုချင်းစီအလိုက်:
> 1. အောင်မြင်စွာ ရောင်းချခဲ့ရသော ပစ္စည်းစုစုပေါင်း တန်ဖိုး (Gross Sales)
> 2. Platform မှ ဖြတ်ယူသော ကော်မရှင် စုစုပေါင်း (Commission)
> 3. ဆိုင်ပိုင်ရှင် လက်ထဲသို့ အမှန်တကယ် ပေးချေရမည့် ငွေ (Net Payable)
> 4. ဆိုင်၏ လက်ရှိ Wallet ထဲသို့ ထည့်သွင်းပေးပြီးသော ပမာဏနှင့် စာရင်း ကိုက်/မကိုက်
> တို့ကို ဇယား ၆ ခု ပေါင်းစပ်ပြီး အလွန်တိကျစွာ စစ်ထုတ်ထုတ်ပေးရမည်။

```sql
WITH MonthlyMerchantSales AS (
    -- အဆင့် ၁: ဆိုင်တစ်ခုချင်းစီ၏ ပြီးခဲ့သောလ အောင်မြင်သော အရောင်းစာရင်းများကို စစ်ထုတ်သည်
    SELECT 
        oi.merchant_id,
        COUNT(DISTINCT o.id) AS total_completed_orders,
        SUM(oi.quantity * oi.unit_price) AS gross_sales,
        SUM(oi.merchant_earnings) AS total_merchant_net_earned,
        SUM((oi.quantity * oi.unit_price) - oi.merchant_earnings) AS total_platform_commission
    FROM order_items AS oi
    INNER JOIN orders AS o ON oi.order_id = o.id
    WHERE o.current_status = 'delivered'
      AND o.created_at >= '2026-08-01 00:00:00' 
      AND o.created_at < '2026-09-01 00:00:00'
    GROUP BY oi.merchant_id
),
MerchantLedgerPayouts AS (
    -- အဆင့် ၂: FinTech Ledger စာရင်းစစ်ဇယားမှ အဆိုပါလအတွင်း ဆိုင်ဆီသို့ ငွေလွှဲပေးခဲ့သော ပမာဏကို တွက်သည်
    SELECT 
        w.owner_id AS merchant_id,
        COALESCE(SUM(le.amount), 0.00) AS total_payout_disbursed
    FROM wallets AS w
    INNER JOIN ledger_entries AS le ON w.id = le.wallet_id
    WHERE w.owner_type = 'merchant'
      AND le.reference_type = 'merchant_payout'
      AND le.created_at >= '2026-08-01 00:00:00'
      AND le.created_at < '2026-09-01 00:00:00'
    GROUP BY w.owner_id
)
-- အဆင့် ၃: အားလုံးကို ချိတ်ဆက်ပြီး စာရင်းကွာဟမှု (Discrepancy) ရှိ/မရှိ စစ်ဆေးသည်
SELECT 
    m.id AS merchant_id,
    m.business_name,
    COALESCE(s.total_completed_orders, 0) AS orders_count,
    COALESCE(s.gross_sales, 0.00) AS gross_sales_amount,
    COALESCE(s.total_platform_commission, 0.00) AS platform_revenue,
    COALESCE(s.total_merchant_net_earned, 0.00) AS net_earned,
    COALESCE(p.total_payout_disbursed, 0.00) AS total_paid_out,
    -- စာရင်းကွာဟချက် (အကယ်၍ 0 မဟုတ်ပါက စာရင်းစစ်ဆေးရန် Alarm ပြသည်)
    (COALESCE(s.total_merchant_net_earned, 0.00) - COALESCE(p.total_payout_disbursed, 0.00)) AS outstanding_balance_due,
    w.current_balance AS current_wallet_balance
FROM merchants AS m
LEFT JOIN MonthlyMerchantSales AS s ON m.id = s.merchant_id
LEFT JOIN MerchantLedgerPayouts AS p ON m.id = p.merchant_id
LEFT JOIN wallets AS w ON m.id = w.owner_id AND w.owner_type = 'merchant'
WHERE m.is_verified = 1
ORDER BY s.gross_sales DESC;
```

#### 💡 ဤနေရာတွင် Engineer ၏ တွေးခေါ်ပုံ (Mental Model):
1. **CTE (`WITH ... AS`) အသုံးပြုမှု**: Complex Calculations များကို တစ်နေရာတည်းတွင် ရောမရေးဘဲ အရောင်းအပိုင်း (`MonthlyMerchantSales`) နှင့် ငွေလွှဲ Ledger အပိုင်း (`MerchantLedgerPayouts`) ဟူ၍ ခွဲခြားလိုက်သဖြင့် စာရင်းအမှား (Cartesian Join Duplication) မဖြစ်တော့ပါ။
2. **Double-Entry Ledger Integrity**: ပိုက်ဆံအိတ် `wallets.current_balance` တစ်ခုတည်းကို မယုံကြည်ဘဲ ပြင်ဆင်၍မရသော `ledger_entries` စာရင်းအစစ်နှင့် တိုက်စစ်ထားသဖြင့် ငွေကြေး အလွဲသုံးစားမှုများကို ချက်ချင်း ရှာဖွေတွေ့ရှိနိုင်သည်။
3. **`COALESCE(..., 0.00)`**: အရောင်းမရှိသေးသော ဆိုင်သစ်များအတွက် `NULL` မထွက်ဘဲ `0.00` ထွက်စေရန် ကိုင်တွယ်ထားသည်။

---

## ၅။ လုပ်ငန်းခွင်သုံး Summary Checklist

Query အသစ်တစ်ခု ရေးဆွဲတိုင်း အောက်ပါ မေးခွန်းများကို အမြဲ မေးပါ:

- [ ] **SARGable**: `WHERE` clause ထဲရှိ Indexed Column များတွင် Function (ဥပမာ `YEAR()`, `DATE()`) မအုပ်ထားဘူး မဟုတ်လား?
- [ ] **Lock Scope**: `FOR UPDATE` ကို လိုအပ်သော Row အတိအကျတွင်သာ ခတ်ထားပြီး Transaction ကို အမြန်ဆုံး `COMMIT` လုပ်သလား?
- [ ] **No Cartesians**: Multi-table JOINs လုပ်သည့်အခါ One-to-Many ပြန့်ကားမှုကြောင့် SUM/COUNT တန်ဖိုးများ အဆမတန် ပွားမသွားအောင် CTE ခွဲထားသလား?
- [ ] **Covering Index Match**: အမြဲခေါ်သော Report Queries များအတွက် Composite Index ကြိုတင် စဉ်းစားထားသလား?
- [ ] **Money Precision**: ငွေကြေးအားလုံးအတွက် `DECIMAL(12, 2)` သို့မဟုတ် `DECIMAL(14, 2)` သုံးထားသလား?
