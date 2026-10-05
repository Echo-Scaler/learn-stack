---
title: "05. Top Client Tasks And Troubleshooting"
description: "ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော EventSubscriber လုပ်ငန်းစဉ်များနှင့်၊ Event အလုပ်မလုပ်သည့်အခါ ပြဿနာရှာဖွေ ဖြေ"
---

## 05. Top Client Tasks & Troubleshooting (လက်တွေ့ ပြင်ဆင်နည်းများနှင့် ပြဿနာဖြေရှင်းခြင်း)

ဂျပန် EC-CUBE Project များတွင် Client (ဆိုင်ရှင်များ) အများဆုံး တောင်းဆိုလေ့ရှိသော EventSubscriber လုပ်ငန်းစဉ်များနှင့်၊ Event အလုပ်မလုပ်သည့်အခါ ပြဿနာရှာဖွေ ဖြေရှင်းနည်းများ ဖြစ်ပါသည်။

---

## 📌 Client Task 1: အော်ဒါတက်သည့်အခါ Slack / Chatwork သို့ ချက်ချင်း အသိပေးစာ ပို့ခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「注文が入った瞬間に、受注メールとは別に社内の Slack（受注通知チャンネル）へリアルタイムで通知を飛ばしてほしい。注文番号、顧客名、購入合計金額を含めてください。」
> (အော်ဒါတက်သည်နှင့် အီးမေးလ်အပြင် ကုမ္ပဏီတွင်း Slack Channel သို့ အော်ဒါနံပါတ်၊ ဖောက်သည်အမည်၊ စုစုပေါင်းငွေပမာဏ ပါဝင်သော အသိပေးစာကို အချိန်နှင့်တပြေးညီ အလိုအလျောက် ပို့ပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
`app/Customize/EventSubscriber/SlackOrderNotificationSubscriber.php`

```php
namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

class SlackOrderNotificationSubscriber implements EventSubscriberInterface
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $slackWebhookUrl;

    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger, string $slackWebhookUrl)
    {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->slackWebhookUrl = $slackWebhookUrl;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // အော်ဒါ အတည်ပြုစာ ပို့ဆောင်သည့် Event ကို နားစွင့်ခြင်း
            EccubeEvents::MAIL_ORDER => 'onOrderComplete',
        ];
    }

    public function onOrderComplete(EventArgs $event): void
    {
        $order = $event->getArgument('Order');
        if (!$order) {
            return;
        }

        $message = sprintf(
            "🎉 *【新規注文が入りました！】*\n• 注文番号: #%s\n• ご注文者: %s %s 様\n• 合計金額: ¥%s\n• 支払方法: %s",
            $order->getOrderNo(),
            $order->getName01(),
            $order->getName02(),
            number_format($order->getPaymentTotal()),
            $order->getPaymentMethod()
        );

        try {
            $this->httpClient->request('POST', $this->slackWebhookUrl, [
                'json' => ['text' => $message],
                'timeout' => 3.0,
            ]);
        } catch (\Exception $e) {
            // Slack ဆာဗာ ဒေါင်းနေပါကလည်း အော်ဒါကို မထိခိုက်စေဘဲ Log သာ မှတ်သားခြင်း
            $this->logger->error('Slack order notification failed: ' . $e->getMessage());
        }
    }
}
```

---

## 📌 Client Task 2: အကောင့်အသစ်ဖွင့်ချိန်တွင် Welcome Point (500pt) အလိုအလျောက် ပေးအပ်ခြင်း

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「新規会員登録が完了した顧客に対して、初回購入を促すために自動的に『500ポイント』をプレゼント付与してください。」
> (ဖောက်သည် အကောင့်အသစ် ဖွင့်ပြီးဆုံးချိန်တွင် ဝယ်ယူမှု အားပေးရန်အတွက် အလိုအလျောက် Welcome Point 500pt ထည့်သွင်းပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
`app/Customize/EventSubscriber/CustomerWelcomePointSubscriber.php`

```php
namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Doctrine\ORM\EntityManagerInterface;

class CustomerWelcomePointSubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // အကောင့်ဖွင့် အတည်ပြုစာ ပို့ဆောင်ချိန် Event
            EccubeEvents::MAIL_ENTRY => 'onCustomerEntry',
        ];
    }

    public function onCustomerEntry(EventArgs $event): void
    {
        $customer = $event->getArgument('Customer');
        if (!$customer) {
            return;
        }

        // လက်ရှိ Point ထဲသို့ 500pt ပေါင်းထည့်ပေးခြင်း
        $currentPoint = $customer->getPoint() ?? 0;
        $customer->setPoint($currentPoint + 500);

        $this->entityManager->persist($customer);
        $this->entityManager->flush();
    }
}
```

---

## 📌 Client Task 3: အထူးလျှော့ဈေး ပစ္စည်းကို ၁ ကြိမ်လျှင် ၁ ခုသာ ဝယ်ခွင့် ကန့်သတ်ခြင်း (Cart Interception)

### 💬 Client Requirement (တောင်းဆိုချက်):
> 「セール限定商品（商品ID: 99）は、転売防止のため1回のご注文で『1個まで』しかカートに入れられないように制限してください。2個以上入れようとした場合はエラーメッセージを表示してください。」
> (Sale အထူးပစ္စည်း ID: 99 ကို ပြန်လည်ရောင်းချမှု ကာကွယ်ရန် ၁ အော်ဒါလျှင် ၁ ခုသာ Cart ထဲ ထည့်ခွင့်ပြုပါ။ ၂ ခုနှင့်အထက် ထည့်ပါက Error စာသား ပြသပြီး တားဆီးပေးပါ။)

### 🛠️ လက်တွေ့ ဖြေရှင်းနည်း:
`app/Customize/EventSubscriber/CartItemLimitSubscriber.php`

```php
namespace Customize\EventSubscriber;

use Eccube\Event\EccubeEvents;
use Eccube\Event\EventArgs;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Eccube\Exception\CartException;

class CartItemLimitSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            // Cart ထဲ ပစ္စည်း စတင်ထည့်သွင်းသည့် Event ကို နားစွင့်ခြင်း
            EccubeEvents::FRONT_CART_ADD_INITIALIZE => 'onCartAdd',
        ];
    }

    public function onCartAdd(EventArgs $event): void
    {
        $productClass = $event->getArgument('ProductClass');
        $quantity = $event->getArgument('quantity');

        if (!$productClass || !$productClass->getProduct()) {
            return;
        }

        // ကုန်ပစ္စည်း ID: 99 စစ်ဆေးခြင်း
        if ($productClass->getProduct()->getId() === 99) {
            if ($quantity > 1) {
                // CartException ပစ်လိုက်ခြင်းဖြင့် Cart ထဲ မထည့်ဘဲ မျက်နှာပြင်တွင် Error ပြသစေခြင်း
                throw new CartException('この限定商品は、お一人様1点限りのご購入とさせていただいております。(ဤပစ္စည်းကို ၁ ခုသာ ဝယ်ယူနိုင်ပါသည်)');
            }
        }
    }
}
```

---

## 🔍 Troubleshooting Checklist: EventSubscriber အလုပ်မလုပ်ပါက စစ်ဆေးရမည့် အချက် ၅ ချက်

Subscriber ရေးပြီးသော်လည်း Event လုံးဝ မခေါ်ဘဲ အလုပ်မလုပ်ဖြစ်နေပါက အောက်ပါအတိုင်း စစ်ဆေးပါ:

### ၁။ Cache မရှင်းရသေးခြင်း (နံပါတ် ၁ အဖြစ်အများဆုံး အမှား):
Subscriber အသစ် ရေးသားပြီးပါက Symfony Service Container က ချက်ချင်း မသိရှိသေးပါ။ အမြဲတမ်း Cache အရင် ရှင်းပေးရပါမည်:
```bash
bin/console cache:clear
```

### ၂။ Event အမည် စာလုံးပေါင်း မှားယွင်းနေခြင်း (Typo):
`EccubeEvents::MAIL_ORDER` အစား စာလုံးပေါင်း မှားယွင်းနေခြင်း ရှိမရှိ စစ်ဆေးပါ။ Symfony Console ဖြင့် Event များအားလုံးကို စစ်ဆေးနိုင်ပါသည်:
```bash
bin/console debug:event-dispatcher eccube.event.mail.order
```
*(အထက်ပါ command ကို run လိုက်ပါက သင့် Subscriber စာရင်းထဲ ဝင်/မဝင် တွေ့မြင်ရပါမည်)*

### ၃။ File Path နှင့် Namespace လမ်းကြောင်း မှားနေခြင်း:
ဖိုင်သည် `app/Customize/EventSubscriber/` ဖိုင်တွဲအောက်တွင် တည်ရှိရမည်ဖြစ်ပြီး၊ Namespace မှာ `Customize\EventSubscriber;` ဖြစ်ရပါမည်။

### ၄။ ရှေ့ရှိ အခြား Plugin တစ်ခုက `stopPropagation()` ဖြင့် ဖြတ်ချလိုက်ခြင်း:
အကယ်၍ သင့်စနစ်တွင် အခြား Plugin တစ်ခုခု တပ်ဆင်ထားပြီး ထို Plugin ၏ Subscriber က အရင် Run ကာ Event ကို ရပ်တန့်လိုက်ပါက သင့် Subscriber ထံ မရောက်ရှိနိုင်တော့ပါ။ Priority ကို အမြင့်ဆုံး သတ်မှတ်ကြည့်ပါ:
```php
EccubeEvents::MAIL_ORDER => ['onOrderComplete', 999], // Priority အမြင့်ဆုံး ပေးခြင်း
```

### ၅။ Argument Null Check မလုပ်ထားခြင်း:
`$event->getArgument('Order')` မတွေ့ဘဲ `Call to a member function getOrderNo() on null` ဖြစ်ကာ မျက်နှာပြင်တွင် အသံတိတ် ပျက်ကျနေခြင်း ရှိမရှိ `var/log/prod/site.log` တွင် စစ်ဆေးပါ။
