---
title: "06. Joins and Relations"
description: "1. [Relational Database Relationships ၃ မျိုး (1:1, 1:N, N:M)](#၁-relational-database-relationships-၃-မျိုး)"
---

## 🐬 သင်ခန်းစာ (၆) - Relational Queries နှင့် SQL JOINs ကျွမ်းကျင်မှု
### (Lesson 6: E-R Relationships, INNER, LEFT, RIGHT, CROSS, SELF JOINs & Anti-Joins)

---

## 📌 မာတိကာ (Contents)
1. [Relational Database Relationships ၃ မျိုး (1:1, 1:N, N:M)](#၁-relational-database-relationships-၃-မျိုး)
2. [SQL JOINs အလုပ်လုပ်ပုံ Venn Diagrams](#၂-sql-joins-အလုပ်လုပ်ပုံ-diagrams)
3. [`INNER JOIN` (နှစ်ဖက်စလုံး ကိုက်ညီသော ဒေတာများကိုသာ ရယူခြင်း)](#၃-inner-join)
4. [`LEFT JOIN` (ဘယ်ဘက် ဇယားရှိ ဒေတာအားလုံးကို ရယူခြင်း)](#၄-left-join)
5. [Anti-Join Pattern: အော်ဒါတစ်ခါမျှ မမှာဖူးသော ဖောက်သည်များကို ရှာဖွေခြင်း](#၅-anti-join-pattern)
6. [`SELF JOIN` (ဇယားတစ်ခုတည်း အချင်းချင်း ပြန်လည်ချိတ်ဆက်ခြင်း)](#၆-self-join)
7. [Multi-Table JOINs (ဇယား ၄ ခု တစ်ပြိုင်နက် ချိတ်ဆက်မေးမြန်းခြင်း)](#၇-multi-table-joins)
8. [လုပ်ငန်းခွင်သုံး Summary Checklist](#၈-လုပ်ငန်းခွင်သုံး-summary-checklist)

---

## ၁။ Relational Database Relationships ၃ မျိုး

1. **One-to-One (1:1)**:
   * ဥပမာ - User တစ်ဦးတွင် User Profile တစ်ခုတည်းသာ ရှိခြင်း။
2. **One-to-Many (1:N)**:
   * ဥပမာ - User တစ်ဦးသည် Orders ပေါင်းများစွာ တင်နိုင်ခြင်း၊ Category တစ်ခုတွင် Products ပေါင်းများစွာ ပါဝင်ခြင်း (အသုံးအများဆုံး ပုံစံ)။
3. **Many-to-Many (N:M)**:
   * ဥပမာ - ကျောင်းသားတစ်ဦးသည် ဘာသာရပ်များစွာ တက်နိုင်သလို ဘာသာရပ်တစ်ခုတွင်လည်း ကျောင်းသားများစွာ တက်ရောက်နိုင်ခြင်း။ (ဤစနစ်အတွက် အလယ်တွင် **Pivot / Junction Table** ဇယားတစ်ခု ခံထားရသည် - ဥပမာ `order_items` ဇယား)။

---

## ၂။ SQL JOINs အလုပ်လုပ်ပုံ Diagrams

```
1. INNER JOIN (တူညီသော အပိုင်းသာ ယူသည်)
┌───────────┐       ┌───────────┐
│  Table A  │  ∩∩∩  │  Table B  │
│           │ ∩∩ ∩∩ │           │
└───────────┘       └───────────┘

2. LEFT JOIN (Table A အကုန် + Table B မှ တူညီသည့်အပိုင်း)
┌───────────┐       ┌───────────┐
│███████████│  ███  │  Table B  │
│██ Table A █│ ██ ██│           │
└───────────┘       └───────────┘

3. ANTI-JOIN (Table A ထဲတွင်ရှိပြီး Table B ထဲ လုံးဝ မပါဝင်သူများ)
┌───────────┐       ┌───────────┐
│███████████│       │  Table B  │
│██ Table A │  (X)  │           │
└───────────┘       └───────────┘
```

---

## ၃။ `INNER JOIN`

ဇယား ၂ ခုစလုံးတွင် Foreign Key ချိတ်ဆက်မှု **ကိုက်ညီသော Row များကိုသာ** ရွေးထုတ်ပေးပါသည်:

```sql
-- Product အမည်နှင့် ၎င်းပိုင်ဆိုင်သော Category အမည်ကို တွဲဖက်ပြသခြင်း
SELECT 
    p.id AS product_id,
    p.title AS product_name,
    p.price,
    c.name AS category_name
FROM products AS p
INNER JOIN categories AS c ON p.category_id = c.id;
```
*(အကယ်၍ Category မရှိသော Product သို့မဟုတ် Product မရှိသော Category ပါဝင်နေပါက ရလဒ်တွင် ပါလာမည် မဟုတ်ပါ)*

---

## ၄။ `LEFT JOIN` (LEFT OUTER JOIN)

ဘယ်ဘက်ဇယား (FROM တွင် ရေးထားသော ဇယား) ရှိ ဒေတာအားလုံးကို အကုန်ယူမည်ဖြစ်ပြီး၊ ညာဘက်ဇယားတွင် ကိုက်ညီသော ဒေတာမရှိပါက `NULL` အဖြစ် ပြသပေးမည်:

```sql
-- Category အားလုံးကို ပြပါ (ပစ္စည်းမရှိသေးသော Category အလွတ်များပါ ပါဝင်လာမည်)
SELECT 
    c.name AS category_name,
    p.title AS product_name
FROM categories AS c
LEFT JOIN products AS p ON c.id = p.category_id;
```

---

## ၅။ Anti-Join Pattern (မပါဝင်သူများကို ရှာဖွေခြင်း)

လုပ်ငန်းခွင်တွင် မကြာခဏ အသုံးပြုရသော Query ဖြစ်သည်:
> *"ကုမ္ပဏီတွင် အကောင့်ဖွင့်ထားသော်လည်း ယနေ့အထိ **အော်ဒါတစ်ခါမျှ မမှာဖူးသေးသော** ဖောက်သည်များကို ရှာဖွေပြီး Promotion Email ပို့ချင်သည်။"*

```sql
SELECT 
    u.id, 
    u.name, 
    u.email
FROM users AS u
LEFT JOIN orders AS o ON u.id = o.user_id
WHERE o.id IS NULL; -- အော်ဒါ လုံးဝ မရှိသူများသာ စစ်ထုတ်ခြင်း
```

---

## ၆။ `SELF JOIN` (ဇယားတစ်ခုတည်း အချင်းချင်း ပြန်ချိတ်ခြင်း)

ဝန်ထမ်း (Employee) ဇယားတွင် ဝန်ထမ်းတစ်ဦးချင်းစီ၏ မန်နေဂျာ (Manager) သည်လည်း ထိုဇယားထဲရှိ အခြား ဝန်ထမ်းတစ်ဦးသာ ဖြစ်နေသည့်အခါ:

```sql
SELECT 
    emp.name AS employee_name,
    mgr.name AS manager_name
FROM employees AS emp
LEFT JOIN employees AS mgr ON emp.manager_id = mgr.id;
```

---

## ၇။ Multi-Table JOINs (ဇယား ၄ ခု ပေါင်းစပ်ခြင်း)

E-Commerce စနစ်တွင် "မည်သည့် ဖောက်သည်က မည်သည့် အော်ဒါတွင် မည်သည့် ပစ္စည်းများကို ဝယ်ယူခဲ့သနည်း" ကို ဇယား ၄ ခု ဆက်စပ်ပြီး ဆွဲထုတ်ပုံ:

```sql
SELECT 
    u.name AS customer_name,
    o.id AS order_id,
    o.order_date,
    p.title AS product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM users AS u
INNER JOIN orders AS o ON u.id = o.user_id
INNER JOIN order_items AS oi ON o.id = oi.order_id
INNER JOIN products AS p ON oi.product_id = p.id
WHERE o.status = 'paid'
ORDER BY o.order_date DESC;
```

---

## ၈။ လုပ်ငန်းခွင်သုံး Summary Checklist

| အခြေအနေ (Goal) | အသုံးပြုသင့်သော JOIN |
| :--- | :--- |
| **နှစ်ဖက်စလုံး Data တကယ်ရှိမှ လိုချင်ပါက** | `INNER JOIN` |
| **မိဘ Data အကုန်လိုချင်ပြီး သားသမီး Data မရှိလျှင် NULL ပြလိုပါက** | `LEFT JOIN` |
| **ဆက်စပ် Data လုံးဝ မရှိသူများကို ရှာရန် (Missing Data)** | `LEFT JOIN ... WHERE right.id IS NULL` |
| **Index စစ်ဆေးမှု** | JOIN ပြုလုပ်သော Foreign Key columns များတွင် Index သေချာ တပ်ဆင်ထားရမည် |

နောက်သင်ခန်းစာ [07_subqueries_and_common_table_expressions_ctes.md](/mysql/07_subqueries_and_common_table_expressions_ctes/) တွင် Complex SQL Logic များကို ရှင်းလင်းစွာ ရေးဆွဲနိုင်သည့် Subqueries များနှင့် CTEs (`WITH ... AS`) အကြောင်းကို ဆက်လက်လေ့လာပါမည်။
