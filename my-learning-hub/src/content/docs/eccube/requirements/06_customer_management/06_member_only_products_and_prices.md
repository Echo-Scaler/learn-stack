---
title: "06. Member Only Products And Prices"
description: "> Client Requirements:"
---

## 06 - Member-Only Products & Prices (အသင်းဝင် သီးသန့် ပစ္စည်းများနှင့် စျေးနှုန်းများ)

> **Client Requirements**:
> 1. **Member-only products (会員限定商品)**: အချို့သော အထူးထုတ်ကုန်များ (ဥပမာ- Fan Club သီးသန့် အင်္ကျီများ သို့မဟုတ် B2B လက်ကားပစ္စည်းများ) ကို အသင်းဝင်ဖြစ်ပြီး Login ဝင်ထားသူများသာ ကြည့်ရှုဝယ်ယူခွင့် ပေးလိုခြင်း။ Login မဝင်ရသေးသော ဧည့်သည်များကို "ログインして購入 (Login to buy)" ဟု ပြသပေးရမည်။
> 2. **Member-only prices (会員限定価格 / 卸価格)**: ပုံမှန် ဧည့်သည်များအတွက် စျေးနှုန်းမှာ ¥10,000 ဖြစ်ပြီး၊ အသင်းဝင် Login ဝင်လိုက်သည်နှင့် အထူးသက်သာသော အသင်းဝင်စျေး ¥8,000 သို့ အလိုအလျောက် ပြောင်းလဲ ပြသပေးရမည်။

---

## 🏛️ EC-CUBE Implementation Architecture

ဤ Requirement ကို အကောင်အထည်ဖော်ရန် အောက်ပါ ဗိသုကာ ၃ မျိုးကို ပေါင်းစပ် အသုံးပြုပါသည်:

```mermaid
graph TD
    A[Customer visits Product Detail Page] --> B{Is Product Member-Only? 会員限定?}
    B -- No --> C[Display Normal Price & Allow Purchase]
    B -- Yes --> D{Is User Logged In? is_granted('ROLE_USER')}
    D -- No (Guest) --> E[Hide Add-to-Cart & Show 'Login to View Price/Buy' Message]
    D -- Yes (Member) --> F{Does Member Price Exist?}
    F -- Yes --> G[Show Special Member Price & Apply in Cart via PurchaseFlow]
    F -- No --> H[Allow Purchase at Regular Price]
```

---

## 🗄️ Database Entity Extension

ပထမဦးစွာ `Product` နှင့် `ProductClass` Entity များတွင် Member သီးသန့် သတ်မှတ်ချက် Column များကို Plugin မှတဆင့် ထည့်သွင်းပါသည်:

```php
// Plugin/MemberProduct/Entity/ProductTrait.php
namespace Plugin\MemberProduct\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

#[EntityExtension('Eccube\Entity\Product')]
trait ProductTrait
{
    /**
     * အသင်းဝင် သီးသန့် ကုန်ပစ္စည်း ဟုတ်/မဟုတ်
     */
    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private $is_member_only = false;

    public function isMemberOnly(): bool
    {
        return (bool) $this->is_member_only;
    }

    public function setIsMemberOnly(bool $is_member_only): self
    {
        $this->is_member_only = $is_member_only;
        return $this;
    }
}
```

```php
// Plugin/MemberProduct/Entity/ProductClassTrait.php
#[EntityExtension('Eccube\Entity\ProductClass')]
trait ProductClassTrait
{
    /**
     * အသင်းဝင်များအတွက် သီးသန့် စျေးနှုန်း (Member Price)
     */
    #[ORM\Column(type: 'decimal', precision: 12, scale: 2, nullable: true)]
    private $member_price;

    public function getMemberPrice(): ?string
    {
        return $this->member_price;
    }

    public function setMemberPrice(?string $member_price): self
    {
        $this->member_price = $member_price;
        return $this;
    }
}
```

---

## 🛡️ Cart & PurchaseFlow တွင် Member စျေးနှုန်း အလိုအလျောက် သတ်မှတ်ခြင်း

ဝယ်ယူသူက Login ဝင်ထားပါက `PurchaseFlow` ၏ Processor တွင် ပုံမှန်စျေးနှုန်း အစား **Member Price** ဖြင့် အစားထိုး တွက်ချက်ပေးပါသည်:

```php
namespace Plugin\MemberProduct\Service\PurchaseFlow\Processor;

use Eccube\Service\PurchaseFlow\ItemInterface;
use Eccube\Service\PurchaseFlow\ItemProcessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;

class MemberPriceProcessor implements ItemProcessor
{
    public function process(ItemInterface $item, PurchaseContext $context): void
    {
        $Order = $context->getOrder();
        $Customer = $Order->getCustomer();

        // Login ဝင်ထားသော Customer ရှိပါက
        if ($Customer && $item->isProduct()) {
            $ProductClass = $item->getProductClass();

            // အသင်းဝင် သီးသန့် စျေးနှုန်း သတ်မှတ်ထားပါက
            if ($ProductClass->getMemberPrice() !== null) {
                // အော်ဒါထဲရှိ စျေးနှုန်းကို အသင်းဝင်စျေးဖြင့် အစားထိုးခြင်း
                $item->setPrice($ProductClass->getMemberPrice());
            }
        }
    }
}
```

---

## 🎨 Twig Template တွင် UI ခွဲခြား ဖော်ပြပုံ

Product Detail စာမျက်နှာတွင် Login အခြေအနေအပေါ် မူတည်၍ ခလုတ်နှင့် စျေးနှုန်းကို ခွဲခြားပြသပါသည်:

```twig
{# Resource/template/default/Product/detail.twig #}

<div class="product-price-section mb-3">
    {% if Product.isMemberOnly and not is_granted('ROLE_USER') %}
        {# အသင်းဝင် သီးသန့်ပစ္စည်း ဖြစ်ပြီး Login မဝင်ရသေးပါက #}
        <div class="alert alert-warning">
            <i class="fa fa-lock"></i> この商品は会員限定商品です。<br>
            価格の確認およびご購入には<a href="{{ url('mypage_login') }}" class="alert-link">ログイン</a>が必要です。
        </div>

        {# Add to Cart ခလုတ် အစား Login ခလုတ် ပြသခြင်း #}
        <a href="{{ url('mypage_login') }}" class="btn btn-outline-primary btn-lg w-100">
            ログインして購入する (Login to Buy)
        </a>
    {% else %}
        {# Login ဝင်ထားပါက သို့မဟုတ် ပုံမှန် ပစ္စည်းဖြစ်ပါက #}
        <div class="product-price">
            {% if is_granted('ROLE_USER') and Product.ProductClasses[0].memberPrice %}
                {# အသင်းဝင် အထူးစျေး ပြသခြင်း #}
                <span class="badge badge-danger">会員限定価格 (Member Special Price)</span>
                <h3 class="text-danger font-weight-bold">
                    {{ Product.ProductClasses[0].memberPrice|number_format }} 円 <small>(税込)</small>
                </h3>
                <p class="text-muted"><del>通常価格: {{ Product.price02IncTaxMin|number_format }} 円</del></p>
            {% else %}
                {# ပုံမှန် ရောင်းစျေး ပြသခြင်း #}
                <h3 class="font-weight-bold">
                    {{ Product.price02IncTaxMin|number_format }} 円 <small>(税込)</small>
                </h3>
            {% endif %}
        </div>

        {# ပုံမှန် Add to Cart ခလုတ် #}
        <button type="submit" class="btn btn-primary btn-lg w-100">
            カートに入れる (Add to Cart)
        </button>
    {% endif %}
</div>
```

---

## 🏢 B2B Wholesale EC (クローズドサイト - Closed E-Commerce) သဘောတရား

အထူးသဖြင့် B2B (Business-to-Business) လက်ကား စနစ်များတွင် Website တစ်ခုလုံးကို ပြင်ပလူများ မမြင်နိုင်စေဘဲ **Admin က အတည်ပြုပေးထားသော ဖောက်သည် ကုမ္ပဏီများသာ** Login ဝင်ပြီး စျေးနှုန်းများကို မြင်တွေ့ဝယ်ယူနိုင်သော **クローズドサイト (Closed Site)** ပုံစံဖြင့် အသုံးပြုကြပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **会員限定商品 (Kaiin Gentei Shouhin)**: Member-Only Product
- **会員限定価格 (Kaiin Gentei Kakaku)**: Member-Only Price
- **卸価格 (Oroshi Kakaku)**: Wholesale / B2B Price
- **クローズドサイト (Kuroozudo Saito)**: Closed / Members-only Website
- **ログイン後表示 (Roguin-go Hyouji)**: Price displayed after Login
