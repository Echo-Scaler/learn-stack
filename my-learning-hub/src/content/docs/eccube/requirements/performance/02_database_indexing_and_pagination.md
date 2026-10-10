---
title: "02. Database Indexing And Pagination"
description: "အချက်အလက် အရေအတွက် သိန်းချီ များပြားလာချိန်တွင် Database Search နှေးကွေးသွားခြင်းကို ကာကွယ်ပေးမည့် Index Design နှင့် Deep Pagination Optimization ဖြစ်ပါသည်။"
---

## 02. Database Indexing & Pagination (インデックス設計とページネーション)

အချက်အလက် အရေအတွက် သိန်းချီ များပြားလာချိန်တွင် Database Search နှေးကွေးသွားခြင်းကို ကာကွယ်ပေးမည့် **Index Design** နှင့် **Deep Pagination Optimization** ဖြစ်ပါသည်။

---

## 📖 Database Index ဆိုတာ အဘယ်နည်း?

စာအုပ်တစ်အုပ်တွင် မိမိလိုချင်သော အကြောင်းအရာကို ရှာဖွေရာတွင် ပထမဆုံးစာမျက်နှာမှ နောက်ဆုံးစာမျက်နှာအထိ တစ်မျက်နှာချင်း လှန်ဖတ်ခြင်းကို **Full Table Scan (全表走査)** ဟု ခေါ်သည်။ စာအုပ်နောက်ကျောရှိ မာတိကာ/အညွှန်း (Index) ကို ကြည့်၍ ချက်ချင်း သက်ဆိုင်ရာ စာမျက်နှာသို့ သွားရောက်ရှာဖွေခြင်းကို **Index Scan** ဟု ခေါ်ပါသည်။

Database တွင် Index မရှိပါက Record ပေါင်း ၅ သိန်းရှိသော `dtb_order` ဇယားထဲမှ အော်ဒါတစ်ခုကို ရှာရန် တန်းပေါင်း ၅ သိန်းလုံးကို စစ်ဆေးရသဖြင့် စက္ကန့်ပေါင်းများစွာ ကြာမြင့်သွားစေပါသည်။

---

## 🔬 MySQL `EXPLAIN` ဖြင့် စစ်ဆေးခြင်း

မည်သည့် Query က နှေးကွေးနေသနည်းကို သိရှိရန် SQL ရှေ့တွင် `EXPLAIN` တပ်၍ စစ်ဆေးရပါသည်:

```sql
EXPLAIN SELECT * FROM dtb_order WHERE order_date >= '2026-01-01' AND order_status_id = 1;
```

### ❌ Index မရှိချိန် ရလဒ် (ဆိုးရွားသော အခြေအနေ):
```
+----+-------------+-----------+------+---------------+------+---------+------+--------+-------------+
| id | select_type | table     | type | possible_keys | key  | key_len | ref  | rows   | Extra       |
+----+-------------+-----------+------+---------------+------+---------+------+--------+-------------+
|  1 | SIMPLE      | dtb_order | ALL  | NULL          | NULL | NULL    | NULL | 520000 | Using where |
+----+-------------+-----------+------+---------------+------+---------+------+--------+-------------+
```
- `type: ALL` (Full Table Scan ဖြစ်နေသည်)။
- `rows: 520,000` (တန်းပေါင်း ၅ သိန်းကျော် အားလုံးကို ရှာဖွေနေရသဖြင့် အလွန်နှေးကွေးသည် - ကြာချိန်: **3.42 စက္ကန့်**)။

---

## 🧱 Composite Index (複合インデックス တည်ဆောက်ခြင်း)

အခြေအနေ ၂ ခု သို့မဟုတ် ထို့ထက်ပို၍ တွဲဖက် ရှာဖွေလေ့ရှိသော Column များကို **Composite Index (ပေါင်းစပ် အညွှန်း)** ပြုလုပ်ပေးရပါသည်:

### Doctrine Migration ဖြင့် Index တပ်ဆင်ပုံ:
```php
namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260921IndexOptimization extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // dtb_order တွင် order_status_id နှင့် order_date ပေါင်းစပ် index တပ်ဆင်ခြင်း
        $this->addSql('CREATE INDEX idx_order_status_date ON dtb_order (order_status_id, order_date)');
        
        // dtb_product တွင် status နှင့် create_date ပေါင်းစပ် index တပ်ဆင်ခြင်း
        $this->addSql('CREATE INDEX idx_product_status_date ON dtb_product (status, create_date)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_order_status_date ON dtb_order');
        $this->addSql('DROP INDEX idx_product_status_date ON dtb_product');
    }
}
```

### ✅ Index တပ်ဆင်ပြီးနောက် `EXPLAIN` ရလဒ်:
```
+----+-------------+-----------+------+-----------------------+-----------------------+---------+-------+------+-------------+
| id | select_type | table     | type | possible_keys         | key                   | key_len | ref   | rows | Extra       |
+----+-------------+-----------+------+-----------------------+-----------------------+---------+-------+------+-------------+
|  1 | SIMPLE      | dtb_order | ref  | idx_order_status_date | idx_order_status_date | 5       | const |   42 | Using where |
+----+-------------+-----------+------+-----------------------+-----------------------+---------+-------+------+-------------+
```
- `type: ref` (Index ကို အသုံးပြုနေပြီ)။
- `rows: 42` (တန်းပေါင်း ၄၂ ခုသာ ရှာဖွေရတော့သည် - ကြာချိန်: **0.008 စက္ကန့် - အဆပေါင်း ၄၀၀ ကျော် ပိုမြန်သွားသည်!**)။

---

## 📑 Deep Pagination ပြဿနာနှင့် ဖြေရှင်းနည်း

### ပြဿနာ: `OFFSET` များပြားလာချိန် နှေးကွေးခြင်း
စာမျက်နှာ ၁ တွင် `LIMIT 20 OFFSET 0` သည် လျင်မြန်သော်လည်း၊ စာမျက်နှာ ၅,၀၀၀ သို့ ရောက်သွားချိန်တွင် `LIMIT 20 OFFSET 100000` ဖြစ်သွားသည်။
MySQL သည် ပထမဆုံး Record ပေါင်း ၁၀၀,၀၀၀ ကို ဖတ်ရှုပြီးမှ စွန့်ပစ်ရသဖြင့် စက္ကန့်ပေါင်းများစွာ ကြာမြင့်သွားစေပါသည်။

### 💡 ဖြေရှင်းနည်း ၁: စာမျက်နှာ ကန့်သတ်ခြင်း (Max Page Limit)
Google နှင့် Amazon တို့ကဲ့သို့ ရှာဖွေမှု စာမျက်နှာကို အများဆုံး စာမျက်နှာ ၁၀၀ (သို့မဟုတ် Record ၂,၀၀၀) အထိသာ ဖွင့်ခွင့်ပေးပြီး၊ ကျန်ရှိသည်များကို Search Filter (Category, Price, Tag) ဖြင့်သာ စစ်ထုတ်ခိုင်းစေခြင်း။

---

### 💡 ဖြေရှင်းနည်း ၂: Keyset / Cursor Pagination (ID ဖြင့် ရှာဖွေခြင်း)
API များ သို့မဟုတ် Infinite Scroll များတွင် `OFFSET` ကို မသုံးဘဲ ယခင်စာမျက်နှာ၏ နောက်ဆုံး ID ကို အသုံးပြု၍ ရှာဖွေခြင်း:

```php
// ❌ နှေးကွေးသော OFFSET နည်းလမ်း:
// SELECT * FROM dtb_order ORDER BY id DESC LIMIT 20 OFFSET 100000; (ကြာချိန်: 4.2s)

// ✅ အလွန် လျင်မြန်သော Keyset နည်းလမ်း:
// SELECT * FROM dtb_order WHERE id < 900000 ORDER BY id DESC LIMIT 20; (ကြာချိန်: 0.005s)
public function getNextOrdersPage(?int $lastSeenId, int $limit = 20): array
{
    $qb = $this->createQueryBuilder('o')
        ->orderBy('o.id', 'DESC')
        ->setMaxResults($limit);

    if ($lastSeenId !== null) {
        $qb->where('o.id < :lastId')
           ->setParameter('lastId', $lastSeenId);
    }

    return $qb->getQuery()->getResult();
}
```

---

### 💡 ဖြေရှင်းနည်း ၃: Doctrine Paginator `setDistinct(false)`
EC-CUBE ၏ KnpPaginator သို့မဟုတ် Doctrine Paginator ကို သုံးရာတွင် `OneToMany` Join မပါဝင်ပါက `distinct` ကို `false` ထားပေးခြင်းဖြင့် MySQL ၏ နှေးကွေးသော `COUNT(DISTINCT ...)` Query ကို ရှောင်ရှားနိုင်ပြီး ၂ ဆ ပိုမိုမြန်ဆန်စေပါသည်:

```php
$paginator = new \Doctrine\ORM\Tools\Pagination\Paginator($query, $fetchJoinCollection = true);
$paginator->setUseOutputWalkers(false); // Subquery count များကို ပိတ်ပြီး အမြန်နှုန်း မြှင့်တင်ခြင်း
```
