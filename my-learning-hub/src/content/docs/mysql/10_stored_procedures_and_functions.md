---
title: "10. Stored Procedures and Functions"
description: "1. [Stored Procedure ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-stored-procedure-ဆိုတာဘာလဲ)"
---

## 🐬 သင်ခန်းစာ (၁၀) - Stored Procedures နှင့် User-Defined Functions
### (Lesson 10: Database Programming, DELIMITER, IN/OUT Parameters & Control Flow)

---

## 📌 မာတိကာ (Contents)
1. [Stored Procedure ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-stored-procedure-ဆိုတာဘာလဲ)
2. [`DELIMITER //` အယူအဆ (အဘယ်ကြောင့် Delimiter ပြောင်းရသလဲ?)](#၂-delimiter-အယူအဆ)
3. [Parameters အမျိုးအစား ၃ မျိုး (`IN`, `OUT`, `INOUT`)](#၃-parameters-အမျိုးအစား-၃-မျိုး)
4. [Control Flow များ ရေးသားခြင်း (`IF`, `CASE`, `WHILE` Loops)](#၄-control-flow-များ)
5. [Stored Procedure vs Custom Stored Function ကွာခြားချက်](#၅-stored-procedure-vs-stored-function)
6. [လက်တွေ့ Production Order Processing Procedure ရေးဆွဲခြင်း နမူနာ](#၆-လက်တွေ့-order-processing-procedure)
7. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၇-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Stored Procedure ဆိုတာဘာလဲ?

**Stored Procedure** ဆိုသည်မှာ Database Server ပေါ်တွင် သိမ်းဆည်းထားပြီး Pre-compiled (ကြိုတင် စစ်ဆေးပြီးသား) ပြုလုပ်ထားသော SQL Code ပရိုဂရမ် အစုအဝေး ဖြစ်ပါသည်။

### ဘာကြောင့် သုံးရသလဲ? (အကျိုးကျေးဇူးများ):
1. **Network Bandwidth ချွေတာခြင်း**: Application ဘက်မှ SQL Query ရှည်ကြီး ၁၀ ခုကို ဆက်တိုက် ပို့မည့်အစား `CALL ProcessOrder(1, 100);` ဟု command တစ်ချက်တည်း ပို့လိုက်ရုံဖြင့် Database Server ထဲတွင် အလုပ်အားလုံး ပြီးဆုံးသွားခြင်း။
2. **Centralized Business Logic**: PHP, Python, Java, Mobile App အသီးသီးမှ တူညီသော စည်းကမ်းချက် (ဥပမာ- အခွန်တွက်ချက်ခြင်း) ကို Procedure တစ်ခုတည်း ခေါ်သုံးနိုင်ခြင်း။
3. **လုံခြုံရေး**: သာမန် User များကို Table ပေါ်တွင် တိုက်ရိုက် UPDATE လုပ်ခွင့် မပေးဘဲ Stored Procedure မှတစ်ဆင့်သာ ထိန်းချုပ်ပြင်ဆင်စေခြင်း။

---

## ၂။ `DELIMITER //` အယူအဆ

MySQL တွင် စာကြောင်းတစ်ကြောင်း ပြီးဆုံးတိုင်း Semi-colon (`;`) ဖြင့် အဆုံးသတ်သည်။

Stored Procedure တစ်ခုအတွင်းတွင် `;` ပေါင်းများစွာ ပါဝင်နေသဖြင့် MySQL က Procedure အလယ်ခေါင်တွင် Query ပြီးဆုံးသွားပြီဟု မထင်စေရန် **Delimiter ကို ယာယီအားဖြင့် `//` သို့မဟုတ် `$$` သို့ ပြောင်းလဲပေးရပါသည်**:

```sql
DELIMITER //

CREATE PROCEDURE HelloWorld()
BEGIN
    SELECT 'Hello from MySQL Stored Procedure!' AS message;
END //

DELIMITER ; -- မူလ semi-colon အတိုင်း ပြန်ပြောင်းသည်
```

### Procedure ကို ခေါ်ဆိုခြင်း:
```sql
CALL HelloWorld();
```

---

## ၃။ Parameters အမျိုးအစား ၃ မျိုး

* **`IN`**: Procedure ထဲသို့ အပြင်မှ တန်ဖိုး ထည့်သွင်းပေးလိုက်ခြင်း (Default)။
* **`OUT`**: Procedure က ပြန်လည် ထုတ်ပေးလိုက်သော ရလဒ် တန်ဖိုး။
* **`INOUT`**: အပြင်မှ တန်ဖိုး လက်ခံပြီး ပြုပြင်ကာ ပြန်ထုတ်ပေးခြင်း။

```sql
DELIMITER //

CREATE PROCEDURE GetCustomerTotalSpent (
    IN p_user_id BIGINT,
    OUT p_total DECIMAL(12, 2)
)
BEGIN
    SELECT COALESCE(SUM(total_amount), 0.00)
    INTO p_total
    FROM orders
    WHERE user_id = p_user_id AND status = 'paid';
END //

DELIMITER ;

-- အသုံးပြုပုံ:
CALL GetCustomerTotalSpent(1, @spent_money);
SELECT @spent_money;
```

---

## ၄။ Control Flow များ

```sql
DELIMITER //

CREATE PROCEDURE CheckStockLevel (
    IN p_product_id BIGINT,
    OUT p_message VARCHAR(50)
)
BEGIN
    DECLARE v_stock INT;

    -- ပစ္စည်းလက်ကျန် စစ်ဆေးခြင်း
    SELECT stock_quantity INTO v_stock FROM products WHERE id = p_product_id;

    -- IF ... ELSEIF ... ELSE Logic
    IF v_stock IS NULL THEN
        SET p_message = 'Product Not Found';
    ELSEIF v_stock > 10 THEN
        SET p_message = 'In Stock (Sufficient)';
    ELSEIF v_stock > 0 THEN
        SET p_message = 'Low Stock (Warning)';
    ELSE
        SET p_message = 'Out of Stock (Urgent)';
    END IF;
END //

DELIMITER ;
```

---

## ၅။ Stored Procedure vs Stored Function

| သွင်ပြင်လက္ခဏာ | Stored Procedure | Stored Function |
| :--- | :--- | :--- |
| **ခေါ်ဆိုပုံ** | `CALL procedure_name()` ဖြင့် သီးခြားခေါ်သည် | `SELECT function_name()` ထဲတွင် ထည့်ခေါ်နိုင်သည် |
| **Return Value** | တန်ဖိုး တိုက်ရိုက် မပြန်ပါ (OUT parameter သုံးရသည်) | **တန်ဖိုး တစ်ခုတည်းကို `RETURN` ဖြင့် မဖြစ်မနေ ပြန်ပေးရသည်** |
| **Data ပြင်ဆင်ခွင့်** | `INSERT`, `UPDATE`, `DELETE` လုပ်ဆောင်နိုင်သည် | Data ဖတ်ရှုတွက်ချက်ရန်သာ အဓိက ဖြစ်သည် |

### Stored Function နမူနာ:
```sql
DELIMITER //

CREATE FUNCTION CalculateDiscount (p_price DECIMAL(10,2), p_rate INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN p_price - (p_price * (p_rate / 100));
END //

DELIMITER ;

-- SELECT Statement ထဲတွင် တိုက်ရိုက် ခေါ်သုံးနိုင်သည်:
SELECT title, price, CalculateDiscount(price, 15) AS discounted_price FROM products;
```

---

## ၆။ လက်တွေ့ Production Order Processing Procedure

```sql
DELIMITER //

CREATE PROCEDURE PlaceOrder (
    IN p_user_id BIGINT,
    IN p_product_id BIGINT,
    IN p_qty INT,
    OUT p_order_id BIGINT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(10, 2);

    -- Product ဈေးနှုန်းနှင့် Stock ဆွဲယူခြင်း
    SELECT stock_quantity, price INTO v_stock, v_price 
    FROM products WHERE id = p_product_id;

    -- Stock လုံလောက်မှု ရှိ/မရှိ စစ်ဆေးခြင်း
    IF v_stock >= p_qty THEN
        -- ၁။ Order Header ဖန်တီးခြင်း
        INSERT INTO orders (user_id, total_amount, status)
        VALUES (p_user_id, (v_price * p_qty), 'paid');
        
        SET p_order_id = LAST_INSERT_ID();

        -- ၂။ Order Items ထည့်သွင်းခြင်း
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (p_order_id, p_product_id, p_qty, v_price);

        -- ၃။ Stock အလိုအလျောက် နုတ်ယူခြင်း
        UPDATE products 
        SET stock_quantity = stock_quantity - p_qty 
        WHERE id = p_product_id;

        SET p_status = 'SUCCESS';
    ELSE
        SET p_order_id = NULL;
        SET p_status = 'FAILED_INSUFFICIENT_STOCK';
    END IF;
END //

DELIMITER ;
```

---

## ၇။ လုပ်ငန်းခွင်သုံး Summary Checklist

| လုပ်ဆောင်ချက် | စစ်ဆေးရန် စည်းမျဉ်း | အတည်ပြုချက် |
| :--- | :--- | :---: |
| **Delimiter Change** | Procedure မရေးမီ `DELIMITER //` ပြောင်းပြီး အဆုံးတွင် `DELIMITER ;` ပြန်ထားသလား? | [ ] |
| **Function Deterministic** | Custom Function ရေးသည့်အခါ `DETERMINISTIC` ထည့်သွင်းထားသလား? | [ ] |
| **Data Integrity** | အရေးကြီးသော ငွေကြေး/Stock လုပ်ငန်းများအတွက် Transaction (`START TRANSACTION`) နှင့် တွဲဖက်ထားသလား? | [ ] |

နောက်သင်ခန်းစာ [11_triggers_and_event_scheduler.md](/mysql/11_triggers_and_event_scheduler/) တွင် Data အပြောင်းအလဲဖြစ်တိုင်း အလိုအလျောက် သတိပေးအလုပ်လုပ်သည့် Database Triggers များနှင့် Event Scheduler အကြောင်းကို လေ့လာပါမည်။
