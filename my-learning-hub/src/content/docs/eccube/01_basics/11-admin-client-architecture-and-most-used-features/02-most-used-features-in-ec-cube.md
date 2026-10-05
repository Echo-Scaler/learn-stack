---
title: "02. Most Used Features In Ec Cube"
description: "> EC-CUBE 4.x Most Used Production Features & EventSubscriber Master Guide"
---

## Module 11 - အခန်း ၂: EC-CUBE တွင် အသုံးအများဆုံး စနစ်များနှင့် EventSubscriber အသေးစိတ် ရှင်းလင်းချက်

> **EC-CUBE 4.x Most Used Production Features & EventSubscriber Master Guide**  
> လက်တွေ့ ဂျပန် E-Commerce ပရောဂျက်များတွင် EC-CUBE Developer များ နေ့စဉ် အသုံးအများဆုံးဖြစ်သော Core Features များ၊ Hook Points များနှင့် အထူးသဖြင့် နံပါတ် (၁) အသုံးအများဆုံးဖြစ်သော **EventSubscriber** အကြောင်းကို မြန်မာဘာသာဖြင့် အသေးစိတ် ရေးသားဖော်ပြထားပါသည်။

---

## မာတိကာ (Table of Contents)

1. [EC-CUBE တွင် အသုံးအများဆုံး Features (၇) မျိုး ခြုံငုံသုံးသပ်ချက်](#၁-ec-cube-တွင်-အသုံးအများဆုံး-features-၇-မျိုး-ခြုံငုံသုံးသပ်ချက်)
2. [နံပါတ် (၁) အသုံးအများဆုံး Feature: EventSubscriber (Hook Points)](#၂-နံပါတ်-၁-အသုံးအများဆုံး-feature-eventsubscriber-hook-points)
   - [EventSubscriber ဆိုတာဘာလဲ၊ အဘယ်ကြောင့် မဖြစ်မနေ သုံးရသလဲ](#က-eventsubscriber-ဆိုတာဘာလဲ-အဘယ်ကြောင့်-မဖြစ်မနေ-သုံးရသလဲ)
   - [အဓိက Event အမျိုးအစား (၃) မျိုး](#ခ-အဓိက-event-အမျိုးအစား-၃-မျိုး)
   - [TemplateEvent ဖြင့် Template မပြင်ဘဲ HTML အပိုင်းအစ လှမ်းထည့်ခြင်း (Snippet Injection)](#ဂ-templateevent-ဖြင့်-template-မပြင်ဘဲ-html-အပိုင်းအစ-လှမ်းထည့်ခြင်း-snippet-injection)
   - [လက်တွေ့ ကုဒ်နမူနာ (၁) - အော်ဒါအောင်မြင်စွာ တင်ပြီးချိန်တွင် အမှတ်ပေးခြင်းနှင့် LINE အကြောင်းကြားစာပို့ခြင်း](#ဃ-လက်တွေ့-ကုဒ်နမူနာ-၁---အော်ဒါအောင်မြင်စွာ-တင်ပြီးချိန်တွင်-အမှတ်ပေးခြင်းနှင့်-line-အကြောင်းကြားစာပို့ခြင်း)
3. [နံပါတ် (၂) အသုံးအများဆုံး Feature: Form Extension (Core Form ထဲ Field တိုးခြင်း)](#၃-နံပါတ်-၂-အသုံးအများဆုံး-feature-form-extension-core-form-ထဲ-field-တိုးခြင်း)
4. [နံပါတ် (၃) အသုံးအများဆုံး Feature: Entity Extension (Trait ဖြင့် Column တိုးခြင်း)](#၄-နံပါတ်-၃-အသုံးအများဆုံး-feature-entity-extension-trait-ဖြင့်-column-တိုးခြင်း)
5. [နံပါတ် (၄) အသုံးအများဆုံး Feature: PurchaseFlow (အော်ဒါတွက်ချက်မှုနှင့် ဝယ်ယူမှု စည်းမျဉ်းများ)](#၅-နံပါတ်-၄-အသုံးအများဆုံး-feature-purchaseflow-အော်ဒါတွက်ချက်မှုနှင့်-ဝယ်ယူမှု-စည်းမျဉ်းများ)
6. [နံပါတ် (၅) အသုံးအများဆုံး Feature: Query Customizer (ရှာဖွေမှု Query များကို ချဲ့ထွင်ခြင်း)](#၆-နံပါတ်-၅-အသုံးအများဆုံး-feature-query-customizer-ရှာဖွေမှု-query-များကို-ချဲ့ထွင်ခြင်း)
7. [နံပါတ် (၆) အသုံးအများဆုံး Feature: Console Command (Batch & Cron Jobs)](#၇-နံပါတ်-၆-အသုံးအများဆုံး-feature-console-command-batch--cron-jobs)
8. [နံပါတ် (၇) အသုံးအများဆုံး Feature: Service Decorator Pattern (Core Logic အစားထိုးခြင်း)](#၈-နံပါတ်-၇-အသုံးအများဆုံး-feature-service-decorator-pattern-core-logic-အစားထိုးခြင်း)

---

## ၁။ EC-CUBE တွင် အသုံးအများဆုံး Features (၇) မျိုး ခြုံငုံသုံးသပ်ချက်

လက်တွေ့ ပရောဂျက်များတွင် Developer များ အချိန်အများဆုံး ပေးရပြီး မဖြစ်မနေ အသုံးပြုရသော Architecture Mechanism (၇) မျိုးမှာ အောက်ပါအတိုင်း ဖြစ်သည်-

| အဆင့် | Feature အမည် | ဂျပန်အသုံးအနှုန်း | အဓိက အသုံးပြုသည့်နေရာ |
| :---: | :--- | :--- | :--- |
| **1** | **EventSubscriber** | イベントサブスクライバ | Core Code မထိဘဲ စနစ်၏ အရေးကြီး Process များကို ကြားဖြတ် ဖမ်းယူခြင်း (Hook Point)။ |
| **2** | **Form Extension** | フォーム拡張 | Core Form များ (Customer, Order, Product) ထဲတွင် Input field အသစ် ထည့်သွင်းခြင်း။ |
| **3** | **Entity Extension (Trait)** | エンティティ拡張 | Core Database Table များထဲသို့ ကော်လံအသစ် ထည့်သွင်းခြင်း။ |
| **4** | **PurchaseFlow Processor** | 購入フロー / 購買プロセス | Discount လျှော့စျေးတွက်ခြင်း၊ Points နုတ်ခြင်း၊ အခွန်တွက်ခြင်းနှင့် ကုန်ပစ္စည်းစစ်ဆေးခြင်း။ |
| **5** | **Query Customizer** | クエリカスタマイザー | Product List ရှာဖွေမှု၊ Admin Order ရှာဖွေမှု Query များကို မူလ Query မပြင်ဘဲ Filter အသစ် ထပ်တိုးခြင်း။ |
| **6** | **Console Command** | コマンド / バッチ処理 | ညဉ့်နက်ပိုင်း Cron Job များ (Auto cancel unpaid orders, CSV Sync, Inventory Sync)။ |
| **7** | **Service Decorator** | デコレーター | Core Service တစ်ခုလုံး၏ Logic ကို အစားထိုး ပြင်ဆင်ခြင်း။ |

---

## ၂။ နံပါတ် (၁) အသုံးအများဆုံး Feature: EventSubscriber (Hook Points)

### က။ EventSubscriber ဆိုတာဘာလဲ၊ အဘယ်ကြောင့် မဖြစ်မနေ သုံးရသလဲ?

EC-CUBE တွင် User တစ်ဦးက အော်ဒါတင်လိုက်သည့်အခါ သို့မဟုတ် Member တစ်ဦး Register လုပ်သည့်အခါ စနစ်အတွင်းတွင် အဆင့်ပေါင်းများစွာ ဖြစ်ပျက်သွားပါသည်။

အကယ်၍ Developer က "အော်ဒါတင်ပြီးချိန်တွင် LINE Notification ပို့ချင်သည်" ဆိုပါက Core Controller ဖြစ်သော `ShoppingController` ထဲသို့ သွားရောက် ရေးသားစရာ **လုံးဝ မလိုပါ**။

စနစ်က "ငါ အော်ဒါတင်ပြီးသွားပြီနော်" ဟု Event (အချက်ပေးခေါင်းလောင်း) တစ်ခု ထုတ်လွှင့်လိုက်သည် (`Dispatch`)။ ထိုအချိန်တွင် မိမိ၏ `EventSubscriber` က အသင့်စောင့်နားထောင်နေပြီး (`Listen`)၊ ထို Event လာသည်နှင့် မိမိရေးထားသော ကုဒ်ကို လှမ်းအလုပ်လုပ်စေခြင်း ဖြစ်သည်။

> 💡 **အားသာချက်**: Core File များကို လုံးဝ မပြင်ရသဖြင့် EC-CUBE Version အသစ်သို့ Upgrade လုပ်သည့်အခါ မည်သည့် Error မှ မတက်ဘဲ စိတ်ချလက်ချ အသုံးပြုနိုင်ပါသည်။

---

### ခ။ အဓိက Event အမျိုးအစား (၃) မျိုး

1. **Business Controller Events**:
   - `eccube.event.front.shopping.confirm.complete` (အော်ဒါအောင်မြင်စွာ အတည်ပြုပြီးချိန်)
   - `eccube.event.front.entry.complete` (အသင်းဝင် အကောင့် အောင်မြင်စွာ ဖွင့်ပြီးချိန်)
   - `eccube.event.admin.product.edit.complete` (Admin က ကုန်ပစ္စည်း ပြင်ပြီးချိန်)

2. **Template Hook Events (UI Events)**:
   - `EccubeEvents::FRONT_SHOPPING_CONFIRM_INITIALIZE` (Shopping စာမျက်နှာ မပြမီ)
   - `EccubeEvents::ADMIN_ORDER_EDIT_INDEX_INITIALIZE` (Admin အော်ဒါပြင်မျက်နှာပြင် မပြမီ)

3. **Symfony Kernel Events**:
   - `KernelEvents::REQUEST` (Request စတင်ဝင်ရောက်လာချိန်)
   - `KernelEvents::RESPONSE` (Browser သို့ HTML ပြန်မပို့မီ)
   - `KernelEvents::EXCEPTION` (စနစ်တွင် Error တက်သွားချိန်)

---

### ဂ။ TemplateEvent ဖြင့် Template မပြင်ဘဲ HTML အပိုင်းအစ လှမ်းထည့်ခြင်း (Snippet Injection)

Template တစ်ခုလုံးကို Override ပြုလုပ်စရာမလိုဘဲ Core Page ပေါ်သို့ HTML / Twig Code အပိုင်းအစ လှမ်းထည့်ပေးနိုင်သော အစွမ်းထက်သည့် နည်းလမ်းဖြစ်သည်-

```php
use Eccube\Event\TemplateEvent;

public function onShoppingConfirm(TemplateEvent $event)
{
    // Core Template ကို မထိဘဲ HTML Snippet လှမ်းထည့်ခြင်း
    $event->addSnippet('@Customize/default/Snippet/delivery_alert.twig');
    
    // Template ဆီသို့ Variable အသစ် လှမ်းပို့ပေးခြင်း
    $event->setParameter('custom_message', 'ကျေးဇူးပြု၍ ပို့ဆောင်မည့်လိပ်စာကို သေချာစစ်ဆေးပါ');
}
```

---

### ဃ။ လက်တွေ့ ကုဒ်နမူနာ (၁) - အော်ဒါအောင်မြင်စွာ တင်ပြီးချိန်တွင် အမှတ်ပေးခြင်းနှင့် LINE အကြောင်းကြားစာပို့ခြင်း

📁 **File: `app/Customize/EventSubscriber/OrderCompleteSubscriber.php`**

```php
<?php

namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Psr\Log\LoggerInterface;

class OrderCompleteSubscriber implements EventSubscriberInterface
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * မည်သည့် Event များကို စောင့်နားထောင်မည်ဖြစ်ကြောင်း ကြေညာခြင်း
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // အော်ဒါ အောင်မြင်စွာ တင်ပြီးဆုံးချိန်တွင် ခေါ်မည့် Event
            'eccube.event.front.shopping.confirm.complete' => 'onOrderComplete',
        ];
    }

    /**
     * အော်ဒါပြီးဆုံးချိန်တွင် အလုပ်လုပ်မည့် Function
     */
    public function onOrderComplete(EventArgs $event): void
    {
        // Event ထဲမှ Order Object ကို ဆွဲထုတ်ခြင်း
        /** @var \Eccube\Entity\Order $Order */
        $Order = $event->getArgument('Order');

        if (!$Order) {
            return;
        }

        $orderId = $Order->getId();
        $totalPrice = $Order->getTotal();
        $customer = $Order->getCustomer();

        $this->logger->info("အော်ဒါ အမှတ် #{$orderId} အောင်မြင်စွာ တင်ပြီးပါပြီ။ စုစုပေါင်း: {$totalPrice} ကျပ်");

        // ၁။ Login ဝင်ထားသော Member ဖြစ်ပါက Points ထည့်ပေးခြင်း
        if ($customer) {
            $this->addCustomerRewardPoints($customer, $totalPrice);
        }

        // ၂။ ဆိုင်ရှင်ထံသို့ LINE သို့မဟုတ် Telegram Notification ပို့ခြင်း
        $this->sendNotificationToShopOwner($Order);
    }

    private function addCustomerRewardPoints($customer, $totalPrice): void
    {
        // ၁၀၀ ကျပ်လျှင် ၁ မှတ် တွက်ချက်ခြင်း ဥပမာ
        $points = (int) ($totalPrice / 100);
        // Point သိမ်းဆည်းသည့် Logic ...
    }

    private function sendNotificationToShopOwner($Order): void
    {
        // External Webhook / LINE Messaging API ခေါ်ယူသည့် Logic ...
    }
}
```

---

## ၃။ နံပါတ် (၂) အသုံးအများဆုံး Feature: Form Extension (Core Form ထဲ Field တိုးခြင်း)

EC-CUBE Core ၏ Form များ (ဥပမာ - `EntryType` အသင်းဝင်ဖောင်၊ `OrderType` အော်ဒါဖောင်) ကို မထိခိုက်ဘဲ Input Field အသစ် ထည့်သွင်းလိုပါက **Form Extension** ကို သုံးသည်။

📁 **File: `app/Customize/Form/Extension/OrderTypeExtension.php`**

```php
<?php

namespace Customize\Form\Extension;

use Eccube\Form\Type\Admin\OrderType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class OrderTypeExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        // Admin အော်ဒါပြင်သည့် ဖောင်ကို ချဲ့ထွင်မည်
        return [OrderType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // Admin များသာ မြင်ရမည့် "ပို့ဆောင်ရေး ခြေရာခံ Tracking Number" Field အသစ်ထည့်ခြင်း
        $builder->add('tracking_number', TextType::class, [
            'label' => 'ပို့ဆောင်ရေး ခြေရာခံအမှတ် (Tracking Number)',
            'required' => false,
            'eccube_form_options' => [
                'auto_render' => true,
            ],
        ]);
    }
}
```

---

## ၄။ နံပါတ် (၃) အသုံးအများဆုံး Feature: Entity Extension (Trait ဖြင့် Column တိုးခြင်း)

Core Database Table (ဥပမာ: `dtb_order`, `dtb_customer`, `dtb_product`) ထဲသို့ ကော်လံအသစ် တိုးလိုပါက Trait ကို ရေးရပါမည်။

📁 **File: `app/Customize/Entity/OrderTrait.php`**

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Order")
 */
trait OrderTrait
{
    /**
     * @ORM\Column(name="tracking_number", type="string", length=100, nullable=true)
     */
    private $tracking_number;

    public function getTrackingNumber(): ?string
    {
        return $this->tracking_number;
    }

    public function setTrackingNumber(?string $tracking_number): self
    {
        $this->tracking_number = $tracking_number;
        return $this;
    }
}
```

---

## ၅။ နံပါတ် (၄) အသုံးအများဆုံး Feature: PurchaseFlow (အော်ဒါတွက်ချက်မှုနှင့် ဝယ်ယူမှု စည်းမျဉ်းများ)

EC-CUBE 4 တွင် ဈေးဝယ်ခြင်းလုပ်ငန်းစဉ် (Cart ထည့်ခြင်း၊ အခွန်တွက်ခြင်း၊ ပို့ဆောင်ခတွက်ခြင်း၊ Discount နုတ်ခြင်း) အားလုံးကို **PurchaseFlow System** က စီမံခန့်ခွဲပါသည်။

ဥပမာ - **"ဝယ်ယူသည့် တန်ဖိုး ၅၀,၀၀၀ ကျပ်ကျော်ပါက အထူး လျှော့စျေး (Discount) ၅,၀၀၀ ကျပ် နုတ်ပေးခြင်း"** ကို PurchaseProcessor ဖြင့် ရေးသားပုံ-

📁 **File: `app/Customize/Service/PurchaseFlow/Processor/SpecialDiscountProcessor.php`**

```php
<?php

namespace Customize\Service\PurchaseFlow\Processor;

use Eccube\Entity\ItemHolderInterface;
use Eccube\Entity\Order;
use Eccube\Service\PurchaseFlow\Processor\DiscountProcessor;
use Eccube\Service\PurchaseFlow\PurchaseContext;

class SpecialDiscountProcessor extends DiscountProcessor
{
    public function process(ItemHolderInterface $itemHolder, PurchaseContext $context): void
    {
        if (!$itemHolder instanceof Order) {
            return;
        }

        // ကုန်ပစ္စည်းစုစုပေါင်း တန်ဖိုးကို စစ်ဆေးခြင်း
        $subTotal = $itemHolder->getSubtotal();

        if ($subTotal >= 50000) {
            // လျှော့စျေး ၅၀၀၀ ကျပ် သတ်မှတ်ခြင်း
            $itemHolder->setDiscount(5000);
        }
    }
}
```

---

## ၆။ နံပါတ် (၅) အသုံးအများဆုံး Feature: Query Customizer (ရှာဖွေမှု Query များကို ချဲ့ထွင်ခြင်း)

Admin Panel တွင် ကုန်ပစ္စည်း သို့မဟုတ် အော်ဒါများကို ရှာဖွေရာတွင် Custom Field ဖြင့် စစ်ထုတ်လိုပါက မူလ Core Query ကို မပြင်ဘဲ **QueryCustomizer** ကို သုံးသည်။

📁 **File: `app/Customize/Repository/QueryCustomizer/OrderSearchCustomizer.php`**

```php
<?php

namespace Customize\Repository\QueryCustomizer;

use Doctrine\ORM\QueryBuilder;
use Eccube\Repository\QueryCustomizer\QueryCustomizer;

class OrderSearchCustomizer implements QueryCustomizer
{
    public function build(QueryBuilder $builder, array $params = [], array $queryKey = []): void
    {
        // အကယ်၍ Tracking Number ဖြင့် ရှာဖွေထားပါက Query တွင် WHERE အပိုထပ်တိုးပေးခြင်း
        if (!empty($params['tracking_number'])) {
            $builder
                ->andWhere('o.tracking_number LIKE :tracking_number')
                ->setParameter('tracking_number', '%' . $params['tracking_number'] . '%');
        }
    }

    public function getQueryKey(): string
    {
        return 'Eccube\Repository\OrderRepository\getQueryBuilderBySearchDataAdmin';
    }
}
```

---

## ၇။ နံပါတ် (၆) အသုံးအများဆုံး Feature: Console Command (Batch & Cron Jobs)

Terminal မှတစ်ဆင့် အလိုအလျောက် Run သော Batch Program များ (ဥပမာ - ရက်ကျော် ငွေမသွေသော အော်ဒါများကို Auto Cancel လုပ်ခြင်း) ကို ဖန်တီးပုံ-

📁 **File: `app/Customize/Command/AutoCancelOrderCommand.php`**

```php
<?php

namespace Customize\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AutoCancelOrderCommand extends Command
{
    protected static $defaultName = 'customize:order:auto-cancel';

    protected function configure()
    {
        $this->setDescription('၇ ရက်ကျော် ငွေမပေးချေရသေးသော အော်ဒါများကို အလိုအလျောက် ပယ်ဖျက်ပေးသည့် Batch Job');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Order Auto-Cancel Batch စတင် အလုပ်လုပ်နေပါသည်...');

        // Database မှ ရက်ကျော်သော အော်ဒါများကို ဆွဲထုတ်၍ Cancel လုပ်သည့် Logic ...

        $io->success('သတ်မှတ်ရက်ကျော် အော်ဒါများကို အောင်မြင်စွာ ပယ်ဖျက်ပြီးပါပြီ။');
        return Command::SUCCESS;
    }
}
```

Terminal တွင် Run ရန်:
```bash
bin/console customize:order:auto-cancel
```

---

## ၈။ နံပါတ် (၇) အသုံးအများဆုံး Feature: Service Decorator Pattern (Core Logic အစားထိုးခြင်း)

Core Service (ဥပမာ `MailService`, `CartService`) ၏ မူလလုပ်ဆောင်ချက်တစ်ခုလုံးကို အစားထိုးရန် သို့မဟုတ် Logic ထပ်ဆောင်းရန် အသုံးပြုသည်။

📁 **File: `app/Customize/Service/DecoratedMailService.php`**

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;
use Eccube\Service\MailService;

class DecoratedMailService
{
    private $inner;

    public function __construct(MailService $inner)
    {
        $this->inner = $inner;
    }

    public function sendOrderMail(Order $Order)
    {
        // မူလ အော်ဒါ Email မပို့မီ PDF Invoice ပြုလုပ်၍ ပူးတွဲထည့်သွင်းသည့် Logic အပိုရေးသားခြင်း
        
        // ထို့နောက် မူလ MailService ကို လှမ်းပို့စေခြင်း
        return $this->inner->sendOrderMail($Order);
    }

    public function __call($method, $args)
    {
        return call_user_func_array([$this->inner, $method], $args);
    }
}
```

---

## ၉။ အနှစ်ချုပ် လမ်းညွှန်ချက် (Developer Summary)

- **UI ပြင်လိုသော်လည်း Template မကော်ပီချင်ပါက** 👉 `EventSubscriber` ၏ `TemplateEvent (addSnippet)` ကို သုံးပါ။
- **အော်ဒါတင်ခြင်း၊ အသင်းဝင်ခြင်း စသည်တို့ကို ကြားဖြတ်လိုပါက** 👉 `EventSubscriber` ကို သုံးပါ။
- **Form ထဲ Field အသစ် ထည့်လိုပါက** 👉 `FormExtension` ကို သုံးပါ။
- **Table ထဲ Column အသစ် ထည့်လိုပါက** 👉 `Entity Trait` ကို သုံးပါ။
- **အော်ဒါ လျှော့စျေးနှင့် စည်းမျဉ်း တွက်ချက်လိုပါက** 👉 `PurchaseFlow Processor` ကို သုံးပါ။
- **ရှာဖွေမှု အပိုထည့်လိုပါက** 👉 `QueryCustomizer` ကို သုံးပါ။
- **အလိုအလျောက် အချိန်မှန် အလုပ်လုပ်ခိုင်းလိုပါက** 👉 `Console Command (CLI)` ကို သုံးပါ။
