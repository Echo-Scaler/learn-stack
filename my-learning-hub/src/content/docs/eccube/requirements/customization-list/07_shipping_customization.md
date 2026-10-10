---
title: "07. Shipping Customization"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 07 - Shipping / Delivery Customize လုပ်နည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube ၏ Delivery (配送方法) system ကို ကိုယ်ပိုင် logic ဖြင့် Customize ပြုလုပ်နည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Delivery Method ကို Dynamic ပြောင်းလဲတတ်ရန်
- Free shipping ကို condition ဖြင့် apply တတ်ရန်
- Shipping fee calculation ကို ကိုယ်ပိုင် logic ဖြင့် override ပြုလုပ်တတ်ရန်
- Delivery date / time selection ထည့်တတ်ရန်

---

## 📌 EC-Cube Shipping Architecture

```
Delivery       → 配送方法 (Shipping method: ヤマト, 佐川 etc.)
DeliveryFee    → 配送料 (Shipping fee per prefecture)
DeliveryTime   → 配送時間帯 (Time slots: 午前中, 14-16時 etc.)
Shipping       → 出荷 (Actual shipment record in Order)
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Free Shipping Logic (Event ဖြင့်)

Order total ¥5,000 ကျော်လျှင် Free Shipping apply ပြုလုပ်ခြင်း:

`app/Plugin/MyPlugin/MyPluginEvent.php`

```php
<?php

namespace Plugin\MyPlugin;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Eccube\Entity\Order;
use Eccube\Entity\Shipping;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MyPluginEvent implements EventSubscriberInterface
{
    // Free shipping threshold
    private const FREE_SHIPPING_THRESHOLD = 5000;

    public static function getSubscribedEvents(): array
    {
        return [
            // Shopping cart / checkout ၌ shipping recalculate ဖြစ်သောအခါ
            EccubeEvents::FRONT_SHOPPING_INDEX_INITIALIZE => 'onShoppingInit',
        ];
    }

    public function onShoppingInit(EventArgs $event): void
    {
        /** @var Order $order */
        $order = $event->getArgument('Order');

        $subtotal = $order->getSubtotal();

        // ¥5,000 ကျော်လျှင် shipping fee ကို 0 ပြောင်းပါ
        if ($subtotal >= self::FREE_SHIPPING_THRESHOLD) {
            foreach ($order->getShippings() as $shipping) {
                /** @var Shipping $shipping */
                // Delivery fee ကို 0 သတ်မှတ်ပါ
                $order->setDeliveryFeeTotal(0);
            }

            // Order total ကို recalculate ပြုလုပ်ပါ
            $order->setPaymentTotal(
                $order->getSubtotal() + 0 // + tax etc.
            );
        }
    }
}
```

---

### အဆင့် 2 - Delivery Date Selection ထည့်ခြင်း

Customer က Delivery Date ကို ရွေးချယ်နိုင်ရန် Entity Extension ပြုလုပ်ပါ:

`app/Plugin/MyPlugin/Entity/ShippingTrait.php`

```php
<?php

namespace Plugin\MyPlugin\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Shipping")
 */
trait ShippingTrait
{
    /**
     * Customer ရွေးချယ်သော Delivery Date
     * 
     * @ORM\Column(name="plg_delivery_date", type="date", nullable=true)
     */
    private ?\DateTimeInterface $plg_delivery_date = null;

    /**
     * Customer ရွေးချယ်သော Delivery Time Slot
     * ဥပမာ: "午前中", "14:00-16:00", "18:00-20:00"
     * 
     * @ORM\Column(name="plg_delivery_time_slot", type="string", length=50, nullable=true)
     */
    private ?string $plg_delivery_time_slot = null;

    /**
     * Gift Wrapping option
     * 
     * @ORM\Column(name="plg_gift_wrapping", type="boolean", nullable=false, options={"default": false})
     */
    private bool $plg_gift_wrapping = false;

    public function getPlgDeliveryDate(): ?\DateTimeInterface
    {
        return $this->plg_delivery_date;
    }

    public function setPlgDeliveryDate(?\DateTimeInterface $date): static
    {
        $this->plg_delivery_date = $date;
        return $this;
    }

    public function getPlgDeliveryTimeSlot(): ?string
    {
        return $this->plg_delivery_time_slot;
    }

    public function setPlgDeliveryTimeSlot(?string $slot): static
    {
        $this->plg_delivery_time_slot = $slot;
        return $this;
    }

    public function isPlgGiftWrapping(): bool
    {
        return $this->plg_gift_wrapping;
    }

    public function setPlgGiftWrapping(bool $wrap): static
    {
        $this->plg_gift_wrapping = $wrap;
        return $this;
    }
}
```

---

### အဆင့် 3 - Checkout Form Extension

Shopping checkout form တွင် delivery date field ထည့်ပါ:

`app/Plugin/MyPlugin/Form/Extension/ShoppingShippingExtension.php`

```php
<?php

namespace Plugin\MyPlugin\Form\Extension;

use Eccube\Form\Type\Shopping\ShippingType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;

class ShoppingShippingExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [ShippingType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // Delivery Date Picker
        $builder->add('plg_delivery_date', DateType::class, [
            'label'    => 'お届け希望日',
            'required' => false,
            'widget'   => 'single_text',
            'html5'    => true,
            'attr'     => [
                'min' => (new \DateTime('+2 days'))->format('Y-m-d'), // 2日後から選択可
            ],
        ]);

        // Time Slot Selection
        $builder->add('plg_delivery_time_slot', ChoiceType::class, [
            'label'    => 'お届け希望時間帯',
            'required' => false,
            'choices'  => [
                '指定なし'        => '',
                '午前中'          => 'morning',
                '12:00〜14:00'    => '12-14',
                '14:00〜16:00'    => '14-16',
                '16:00〜18:00'    => '16-18',
                '18:00〜20:00'    => '18-20',
                '19:00〜21:00'    => '19-21',
            ],
        ]);

        // Gift Wrapping
        $builder->add('plg_gift_wrapping', CheckboxType::class, [
            'label'    => 'ギフト包装を希望する（+¥330）',
            'required' => false,
        ]);
    }
}
```

**services.yaml に登録**:

```yaml
services:
    Plugin\MyPlugin\Form\Extension\ShoppingShippingExtension:
        tags:
            - { name: form.type_extension }
```

---

### အဆင့် 4 - Gift Wrapping Fee ထည့်ခြင်း

Order total တွင် gift wrapping fee ထည့်ပါ:

```php
public function onShoppingConfirm(EventArgs $event): void
{
    /** @var Order $order */
    $order = $event->getArgument('Order');

    $giftFee = 0;

    foreach ($order->getShippings() as $shipping) {
        if ($shipping->isPlgGiftWrapping()) {
            $giftFee += 330; // ¥330 per shipping
        }
    }

    if ($giftFee > 0) {
        // Order ၏ charge/fee ကို update ပြုလုပ်ပါ
        $currentTotal = $order->getPaymentTotal();
        $order->setPaymentTotal($currentTotal + $giftFee);
    }
}
```

---

### အဆင့် 5 - Admin Order View တွင် Delivery Info ပြသခြင်း

`app/Plugin/MyPlugin/Resource/template/admin/order_delivery_info.twig`

```twig
{# Admin order detail page ၏ Shipping section ကို extend ပြုလုပ်ပါ #}
{% for Shipping in Order.Shippings %}
    {% if Shipping.plgDeliveryDate %}
    <div class="ec-labeldl">
        <div class="ec-labeldl__desc">お届け希望日</div>
        <div class="ec-labeldl__data">
            {{ Shipping.plgDeliveryDate|date('Y年m月d日') }}
        </div>
    </div>
    {% endif %}

    {% if Shipping.plgDeliveryTimeSlot %}
    <div class="ec-labeldl">
        <div class="ec-labeldl__desc">お届け希望時間帯</div>
        <div class="ec-labeldl__data">
            {{ Shipping.plgDeliveryTimeSlot }}
        </div>
    </div>
    {% endif %}

    {% if Shipping.plgGiftWrapping %}
    <div class="ec-labeldl">
        <div class="ec-labeldl__desc">ギフト包装</div>
        <div class="ec-labeldl__data">
            <span class="badge badge-primary">希望あり</span>
        </div>
    </div>
    {% endif %}
{% endfor %}
```

---

### အဆင့် 6 - Admin Panel တွင် Shipping Method ကို Configure ပြုလုပ်ခြင်း

```
Admin → 設定 → 基本設定 → 配送方法管理
```

**ဤနေရာတွင် Configure ပြုလုပ်နိုင်သည်**:
- **配送名称**: ヤマト運輸 / 佐川急便
- **配送料**: ¥800 (都道府県ごとに設定可能)
- **お届け日数**: 1〜3日
- **関連づける支払い方法**: クレジットカード, 代金引換 etc.

---

## 🔑 Delivery Fee Table (Prefecture-based)

```sql
-- 都道府県ごとの配送料を確認
SELECT p.name, df.fee 
FROM mtb_pref p
JOIN dtb_delivery_fee df ON p.id = df.pref_id
WHERE df.delivery_id = 1;  -- Delivery ID を変えてください
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] ShippingTrait の Migration を実行済み
- [ ] Form Extension が `services.yaml` に登録済み
- [ ] Checkout page に date picker が表示される
- [ ] Order 確認 page に選択内容が表示される
- [ ] Admin order detail に配送情報が表示される

---

> ➡️ **နောက်တစ်ဆင့်**: [08 - Mail Template](/eccube/requirements/customization-list/08_mail_template/)
