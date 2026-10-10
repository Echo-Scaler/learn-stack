---
title: "08. Stock Management"
description: "> Client Requirement: ကုန်ပစ္စည်းများ၏ လက်ကျန်အရေအတွက် (Stock) ကို တိကျစွာ စီမံနိုင်ရမည်။ Customer က ဝယ်ယူလိုက်ပါက စတော့ အလိုအလျောက် လျော့သွားရမည်ဖြစ်ပြီး၊ ပစ္"
---

## 08 - Stock Management (လက်ကျန်ပစ္စည်း စီမံခန့်ခွဲမှု)

> **Client Requirement**: "ကုန်ပစ္စည်းများ၏ လက်ကျန်အရေအတွက် (Stock) ကို တိကျစွာ စီမံနိုင်ရမည်။ Customer က ဝယ်ယူလိုက်ပါက စတော့ အလိုအလျောက် လျော့သွားရမည်ဖြစ်ပြီး၊ ပစ္စည်းပြတ်သွားပါက Website တွင် 'SOLD OUT (在庫切れ)' ပြသကာ ဝယ်ယူ၍မရအောင် Add to Cart ခလုတ်ကို ပိတ်ထားရမည်။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. **在庫無制限 (Unlimited Stock)**: Digital Goods (ဥပမာ- PDF/Download ပစ္စည်းများ) သို့မဟုတ် အကန့်အသတ်မရှိ ထုတ်လုပ်နိုင်သော ပစ္စည်းများအတွက် စတော့မကုန်စေရန် အမှန်ခြစ်ထားနိုင်ခြင်း။
2. **Auto Stock Deduction (စတော့ အလိုအလျောက် နှုတ်ခြင်း)**: Order အောင်မြင်စွာ တင်လိုက်သည်နှင့် စတော့ အရေအတွက်ကို Database တွင် ချက်ချင်း အနုတ်ပြပေးခြင်း။
3. **Order Cancelation Stock Restoration**: အော်ဒါ ဖျက်သိမ်းလိုက်ပါက နှုတ်ယူထားသော စတော့ကို အလိုအလျောက် ပြန်လည် ပေါင်းထည့်ပေးခြင်း။
4. **Low Stock Warning (သတိပေးချက် ပြသခြင်း)**: စတော့ ၅ ခုအောက် လျော့နည်းသွားပါက Customer အား ဝယ်ယူရန် ဆွဲဆောင်သည့်အနေဖြင့် "残りわずか (ပစ္စည်း အနည်းငယ်သာ ကျန်ပါတော့သည်)" ဟု ပြသပေးရန်။

---

## 🏛️ EC-CUBE Implementation Architecture: `dtb_product_stock`

EC-CUBE တွင် Beginner များ အထူးသတိပြုရမည့် အချက်မှာ **လက်ကျန် စတော့အရေအတွက် (`stock`) သည် `dtb_product_class` ထဲတွင် တိုက်ရိုက်မရှိဘဲ သီးခြား ဇယားဖြစ်သော `dtb_product_stock` ထဲတွင် ရှိခြင်း** ဖြစ်ပါသည်။

```
[dtb_product_class]
├── id: 50
├── stock_unlimited: 0 (အကန့်အသတ်ရှိသည်)
└── ProductStock (One-to-One Relationship)
         │
         ▼
[dtb_product_stock]
├── id: 50
├── product_class_id: 50
└── stock: 12 (လက်ကျန် ၁၂ ခု)
```

### အဘယ်ကြောင့် `dtb_product_stock` ကို သီးခြား ဇယား ခွဲထားသနည်း?
> 💡 **High Concurrency & Database Locking**:  
> ပစ္စည်းတစ်ခုတည်းကို လူပေါင်းများစွာ တစ်ပြိုင်နက်တည်း ဝယ်ယူသည့်အခါ (Flash Sales ကဲ့သို့ အခြေအနေ) Database တွင် Deadlock မဖြစ်စေရန်နှင့် Performance ကောင်းမွန်စေရန် `dtb_product_stock` ဇယားပေါ်တွင်သာ Row-level Lock ပြုလုပ်ပြီး စတော့ကို နုတ်ယူနိုင်ရန် ဗိသုကာအရ သီးခြား ခွဲထုတ်ထားခြင်း ဖြစ်ပါသည်။

---

## 🗄️ Database Schema & Relationships

### ၁။ `dtb_product_class`
- `stock_unlimited` (Smallint): `1` ဖြစ်ပါက စတော့ အကန့်အသတ်မရှိ (ဝယ်ယူ၍ အမြဲရသည်)၊ `0` ဖြစ်ပါက စတော့အရေအတွက်အတိုင်းသာ ရောင်းမည်။

### ၂။ `dtb_product_stock`
- `product_class_id` (FK): သက်ဆိုင်ရာ ProductClass ID
- `stock` (Integer): လက်ကျန် အရေအတွက်

---

## 📝 အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Step-by-Step Workflow)

### ၁။ Purchase Flow တွင် စတော့ စစ်ဆေးခြင်း (`StockValidator`)
Customer က Cart ထဲသို့ ပစ္စည်းထည့်သည့်အခါ သို့မဟုတ် Checkout ပြုလုပ်သည့်အခါ EC-CUBE ၏ `PurchaseFlow` မှ စတော့လုံလောက်မှု ရှိမရှိ စစ်ဆေးပါသည်:

```php
// Eccube\Service\PurchaseFlow\Processor\StockValidator.php
public function validate(ItemInterface $item, PurchaseContext $context)
{
    $ProductClass = $item->getProductClass();

    // အကယ်၍ စတော့ ကန့်သတ်ထားပြီး လက်ကျန်မရှိပါက Error ပေးခြင်း
    if (!$ProductClass->isStockUnlimited()) {
        $stock = $ProductClass->getStock();
        if ($stock < $item->getQuantity()) {
            // "ပစ္စည်း လက်ကျန် မလုံလောက်ပါ"
            $this->throwPurchaseFlowException('front.shopping.stock_error');
        }
    }
}
```

### ၂။ Order ပြီးဆုံးသည့်အခါ စတော့ အလိုအလျောက် နှုတ်ယူခြင်း
ဝယ်ယူမှု အောင်မြင်သွားပါက `StockReduceProcessor` က စတော့ကို နှုတ်ယူပါသည်:

```php
// Eccube\Service\PurchaseFlow\Processor\StockReduceProcessor.php
public function process(ItemInterface $item, PurchaseContext $context)
{
    $ProductClass = $item->getProductClass();

    if (!$ProductClass->isStockUnlimited()) {
        $ProductStock = $ProductClass->getProductStock();
        $currentStock = $ProductStock->getStock();
        $buyQuantity = $item->getQuantity();

        // လက်ကျန်မှ ဝယ်ယူသည့် အရေအတွက်ကို နှုတ်ခြင်း
        $ProductStock->setStock($currentStock - $buyQuantity);
    }
}
```

---

## 🎨 Twig Template တွင် Sold Out နှင့် Low Stock Badge ပြသပုံ

```twig
{# Resource/template/default/Product/detail.twig #}

{% set isOutOfStock = false %}

{# စတော့ မရှိတော့ပါက စစ်ဆေးခြင်း #}
{% if Product.hasProductClass == false %}
    {% set Class = Product.ProductClasses[0] %}
    {% if Class.stockUnlimited == false and Class.stock <= 0 %}
        {% set isOutOfStock = true %}
    {% endif %}
{% endif %}

<div class="product-stock-status mb-3">
    {% if isOutOfStock %}
        {# ပစ္စည်းပြတ်သွားပါက Sold Out ပြသခြင်း #}
        <div class="alert alert-danger font-weight-bold">
            <i class="fa fa-times-circle"></i> SOLD OUT (品切れ中)
        </div>
    {% else %}
        {# လက်ကျန် အနည်းငယ်သာ ရှိတော့ပါက သတိပေးချက် ပြသခြင်း #}
        {% if Product.hasProductClass == false and Class.stockUnlimited == false and Class.stock <= 5 %}
            <span class="badge badge-warning text-dark p-2">
                <i class="fa fa-fire"></i> 残りわずか (လက်ကျန် {{ Class.stock }} ခုသာ ကျန်ပါတော့သည်!)
            </span>
        {% else %}
            <span class="badge badge-success p-2">
                <i class="fa fa-check-circle"></i> 在庫あり (In Stock)
            </span>
        {% endif %}
    {% endif %}
</div>

{# ပစ္စည်းပြတ်ပါက Add to Cart ခလုတ်ကို Disable ပြုလုပ်ခြင်း #}
<button type="submit" class="btn btn-primary btn-lg w-100" {% if isOutOfStock %}disabled{% endif %}>
    {% if isOutOfStock %}
        SOLD OUT
    {% else %}
        カートに入れる (Add to Cart)
    {% endif %}
</button>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **在庫管理 (Zaiko Kanri)**: Stock / Inventory Management
- **在庫数 (Zaiko Suu)**: Stock Quantity
- **在庫無制限 (Zaiko Museigen)**: Unlimited Stock
- **在庫切れ / 品切れ (Zaiko Gire / Shinagire)**: Out of Stock / Sold Out
- **残りわずか (Nokori Wazuka)**: Only a few left in stock
- **カートに入れる (Kaato ni Ireru)**: Add to Cart
