---
title: "31. Invoice Management Pdf"
description: "> 「BtoB取引や企業の経理処理に対応するため、注文詳細画面およびマイページの購入履歴から『適格請求書（インボイス制度対応の請求書PDF）』を発行・ダウンロードできるようにしてください。請求書番号、発行日、支払期日、取引先情報、登録番号（T+13桁）、10%・8%の税率別消費税額、振込先口座情報を正確に印字してくださ"
---

## Task 31: 注文から請求書を発行できるようにしてください (Invoice Management & PDF Generation)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「BtoB取引や企業の経理処理に対応するため、注文詳細画面およびマイページの購入履歴から『適格請求書（インボイス制度対応の請求書PDF）』を発行・ダウンロードできるようにしてください。請求書番号、発行日、支払期日、取引先情報、登録番号（T+13桁）、10%・8%の税率別消費税額、振込先口座情報を正確に印字してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
BtoB ရောင်းဝယ်မှုများနှင့် ကုမ္ပဏီများအတွက် အော်ဒါစာမျက်နှာနှင့် ဝယ်ယူသူ၏ Mypage မှတစ်ဆင့် ဂျပန်နိုင်ငံ၏ **Qualified Invoice System (インボイス制度 - Invoice System)** နှင့် ကိုက်ညီသော **တရားဝင် ဘေလ်တောင်းခံလွှာ PDF (Invoice PDF)** ကို အလိုအလျောက် ထုတ်ပေးနိုင်သည့် စနစ် တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Japan Qualified Invoice System (インボイス制度 2023年10月施行)
- ဂျပန်နိုင်ငံတွင် ၂၀၂၃ ခုနှစ် အောက်တိုဘာလမှစတင်၍ အခွန်နုတ်ယူခွင့် (仕入税額控除) ရရှိရန်အတွက် ကုမ္ပဏီများသည် အောက်ပါအချက်များ မဖြစ်မနေ ပါဝင်သော တရားဝင် Invoice (適格請求書) ကို တောင်းဆိုကြသည်:
  - ဆိုင်၏ တရားဝင် အခွန်မှတ်ပုံတင်အမှတ် (登録番号: 例 T1234567890123)
  - သတ်မှတ် 10% ပစ္စည်းများနှင့် လျှော့ပေါ့အခွန် 8% ပစ္စည်းများ၏ သီးခြား ခွဲခြားထားသော ငွေပမာဏနှင့် အခွန်ပမာဏ (税率ごとの合計金額および消費税額)
  - အော်ဒါအမှတ်၊ ထုတ်ပေးသည့်ရက်စွဲ၊ ငွေပေးချေရမည့် သတ်မှတ်ရက် (Due Date)

### 2. TCPDF / Dompdf Wrapper Service Architecture
- PDF ထုတ်လုပ်ခြင်း Logic များကို Controller ထဲတွင် တိုက်ရိုက်မရေးဘဲ `InvoicePdfService` အဖြစ် သီးသန့်တည်ဆောက်ခြင်းဖြင့် Admin Panel မှသာမက Customer Mypage နှင့် Automated Email ပူးတွဲဖိုင် (Attachment) အဖြစ်ပါ တစ်ပြိုင်နက် ပြန်လည်အသုံးပြုနိုင်ပါသည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Invoice Entity Trait ဖြင့် သီးသန့် Invoice Number နှင့် ရက်စွဲများ သိမ်းဆည်းခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/OrderInvoiceTrait.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Annotation\EntityExtension;

/**
 * @EntityExtension("Eccube\Entity\Order")
 */
trait OrderInvoiceTrait
{
    /**
     * 請求書番号 (例: INV-2026-000123)
     * @ORM\Column(name="invoice_number", type="string", length=50, nullable=true)
     */
    private ?string $invoice_number = null;

    /**
     * 請求書発行日時
     * @ORM\Column(name="invoice_issued_date", type="datetime", nullable=true)
     */
    private ?\DateTimeInterface $invoice_issued_date = null;

    /**
     * お支払い期日 (Due Date)
     * @ORM\Column(name="payment_due_date", type="date", nullable=true)
     */
    private ?\DateTimeInterface $payment_due_date = null;

    public function getInvoiceNumber(): ?string
    {
        return $this->invoice_number;
    }

    public function setInvoiceNumber(?string $invoice_number): self
    {
        $this->invoice_number = $invoice_number;
        return $this;
    }

    public function getInvoiceIssuedDate(): ?\DateTimeInterface
    {
        return $this->invoice_issued_date;
    }

    public function setInvoiceIssuedDate(?\DateTimeInterface $invoice_issued_date): self
    {
        $this->invoice_issued_date = $invoice_issued_date;
        return $this;
    }

    public function getPaymentDueDate(): ?\DateTimeInterface
    {
        return $this->payment_due_date;
    }

    public function setPaymentDueDate(?\DateTimeInterface $payment_due_date): self
    {
        $this->payment_due_date = $payment_due_date;
        return $this;
    }
}
```

---

### အဆင့် ၂: Invoice PDF Generation Service တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/InvoicePdfService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Order;
use Eccube\Repository\BaseInfoRepository;
use Twig\Environment;

class InvoicePdfService
{
    private Environment $twig;
    private BaseInfoRepository $baseInfoRepository;
    private string $invoiceQualifiedNumber = 'T1234567890123'; // 適格請求書発行事業者登録番号

    public function __construct(
        Environment $twig,
        BaseInfoRepository $baseInfoRepository
    ) {
        $this->twig = $twig;
        $this->baseInfoRepository = $baseInfoRepository;
    }

    /**
     * 注文情報から適格請求書HTMLを生成し、PDFバイナリとして出力する
     *
     * @param Order $order
     * @return string PDF Binary string
     */
    public function generateInvoicePdf(Order $order): string
    {
        $baseInfo = $this->baseInfoRepository->get();

        // 10% と 8% の税率別集計 (Tax Breakdown Calculation)
        $tax10Subtotal = 0;
        $tax10Tax = 0;
        $tax8Subtotal = 0;
        $tax8Tax = 0;

        foreach ($order->getOrderItems() as $item) {
            $taxRate = (int) $item->getTaxRate();
            $itemTotal = (int) $item->getPrice(); // 税抜または税込
            $taxAmount = (int) $item->getTax();

            if ($taxRate === 10) {
                $tax10Subtotal += $itemTotal;
                $tax10Tax += $taxAmount;
            } elseif ($taxRate === 8) {
                $tax8Subtotal += $itemTotal;
                $tax8Tax += $taxAmount;
            }
        }

        // HTML Template ကို Render ပြုလုပ်ခြင်း
        $html = $this->twig->render('@Customize/pdf/invoice.twig', [
            'Order' => $order,
            'BaseInfo' => $baseInfo,
            'qualified_no' => $this->invoiceQualifiedNumber,
            'tax10Subtotal' => $tax10Subtotal,
            'tax10Tax' => $tax10Tax,
            'tax8Subtotal' => $tax8Subtotal,
            'tax8Tax' => $tax8Tax,
            'issue_date' => new \DateTime(),
        ]);

        // Dompdf သို့မဟုတ် TCPDF ဖြင့် PDF Convert ပြုလုပ်ခြင်း
        // ဥပမာ Dompdf:
        $dompdf = new \Dompdf\Dompdf(['enable_remote' => true, 'defaultFont' => 'ipaexg']);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }
}
```

---

### အဆင့် ၃: Invoice Download Controller ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Controller/InvoiceDownloadController.php`

```php
<?php

namespace Customize\Controller;

use Customize\Service\InvoicePdfService;
use Eccube\Controller\AbstractController;
use Eccube\Entity\Customer;
use Eccube\Repository\OrderRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class InvoiceDownloadController extends AbstractController
{
    private InvoicePdfService $pdfService;
    private OrderRepository $orderRepository;
    private Security $security;

    public function __construct(
        InvoicePdfService $pdfService,
        OrderRepository $orderRepository,
        Security $security
    ) {
        $this->pdfService = $pdfService;
        $this->orderRepository = $orderRepository;
        $this->security = $security;
    }

    /**
     * @Route("/mypage/order/invoice/{id}", name="mypage_order_invoice_download", methods={"GET"})
     */
    public function download(int $id): Response
    {
        $user = $this->security->getUser();
        $order = $this->orderRepository->find($id);

        if (!$order) {
            throw $this->createNotFoundException('注文が見つかりません。');
        }

        // လုံခြုံရေး: မိမိ၏ အော်ဒါဟုတ်မှသာ ဒေါင်းလုဒ်ဆွဲခွင့်ပြုခြင်း
        if (!$user instanceof Customer || $order->getCustomer()->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException('閲覧権限がありません。');
        }

        $pdfBinary = $this->pdfService->generateInvoicePdf($order);

        $filename = sprintf('Invoice_%s_%s.pdf', $order->getOrderNo(), date('Ymd'));

        return new Response($pdfBinary, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('inline; filename="%s"', $filename),
        ]);
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Japanese Font Rendering (文字化け防止):**  
   PDF တွင် ဂျပန်စာလုံးများ ကျိုးပေါက်ခြင်း သို့မဟုတ် မပေါ်ခြင်း (□□□) မဖြစ်စေရန် `IPAexGothic` သို့မဟုတ် `NotoSansJP` TrueType Font (`.ttf`) ကို PDF Generator တွင် ထည့်သွင်းသတ်မှတ်ပေးရပါမည်။
2. **Sequential Invoice Numbering (一意な連番採番):**  
   Invoice နံပါတ်သည် ပျောက်ဆုံးခြင်း၊ ထပ်နေခြင်း မရှိစေရန် Database Sequence သို့မဟုတ် Dedicated Numbering Table ဖြင့် တစ်ခုချင်းစီ စနစ်တကျ Auto-increment ပြုလုပ်ပေးသင့်ပါသည်။
