---
title: "34. Erp Crm Integration"
description: "> 「基幹ERPシステムおよびコールセンターCRMとEC-CUBEを連携してください。コールセンターのオペレーターが電話やメールでお問い合わせを受けた際、顧客管理画面から『過去の注文一覧』『問い合わせ履歴』『電話対応メモ』『顧客属性』を一元的に閲覧でき、対応履歴（対応日時、担当者名、受付チャネル、対応内容、ステータス）"
---

## Task 34: 基幹システム・CRM連携と顧客対応履歴管理 (ERP/CRM Integration & Customer Support History)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「基幹ERPシステムおよびコールセンターCRMとEC-CUBEを連携してください。コールセンターのオペレーターが電話やメールでお問い合わせを受けた際、顧客管理画面から『過去の注文一覧』『問い合わせ履歴』『電話対応メモ』『顧客属性』を一元的に閲覧でき、対応履歴（対応日時、担当者名、受付チャネル、対応内容、ステータス）を新規登録・更新できるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ပြင်ပ ERP/CRM (ဥပမာ - Salesforce, kintone, SAP) နှင့် EC-CUBE အကြား Customer Data များကို ချိတ်ဆက်ပြီး၊ Call Center အော်ပရေတာများ အလွယ်တကူ ကိုင်တွယ်နိုင်ရန် **"ဝယ်ယူသူ ဝန်ဆောင်မှု မှတ်တမ်းနှင့် ဖုန်းခေါ်ဆိုမှု Memo စီမံခန့်ခွဲသည့်စနစ် (Customer Support & Response History Management)"** ကို တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Unified Customer 360-degree View (顧客情報の一元管理)
- ဖုန်းဆက်လာသော ဝယ်ယူသူ၏ ဖုန်းနံပါတ် သို့မဟုတ် နာမည်ဖြင့် ရှာလိုက်သည်နှင့် ဝယ်ယူခဲ့ဖူးသော အော်ဒါများ၊ ယခင်က တင်ထားသော တိုင်ကြားချက်များ၊ ပို့ဆောင်ထားသော အီးမေးလ်များကို မျက်နှာပြင်တစ်ခုတည်းတွင် အပြည့်အစုံ ကြည့်ရှုနိုင်သဖြင့် Customer Support (CS) စွမ်းဆောင်ရည်ကို အဆပေါင်းများစွာ မြှင့်တင်ပေးသည်။

### 2. Entity Relationship Model (`CustomerResponseHistory`)
- `Customer` Entity နှင့် OneToMany ချိတ်ဆက်ထားသော `CustomerResponseHistory` Table အသစ် ထည့်သွင်းခြင်းဖြင့် ဝယ်ယူသူတစ်ဦးချင်းစီ၏ နောက်ကြောင်းမှတ်တမ်း (Audit Trail) ကို အချိန်နှင့် တပြေးညီ တိကျစွာ မှတ်တမ်းတင်နိုင်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: CustomerResponseHistory Entity တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/CustomerResponseHistory.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Entity\Customer;
use Eccube\Entity\Member;

/**
 * @ORM\Entity(repositoryClass="Customize\Repository\CustomerResponseHistoryRepository")
 * @ORM\Table(name="dtb_customer_response_history")
 */
class CustomerResponseHistory
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Customer")
     * @ORM\JoinColumn(name="customer_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private Customer $Customer;

    /**
     * 対応した管理者（オペレーター）
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Member")
     * @ORM\JoinColumn(name="member_id", referencedColumnName="id", nullable=true)
     */
    private ?Member $Creator = null;

    /**
     * 受付チャネル (1: 電話, 2: メール, 3: 問い合わせフォーム, 4: LINE/チャット)
     * @ORM\Column(type="smallint")
     */
    private int $channel = 1;

    /**
     * 対応種別 (例: 注文キャンセル希望, 配送先変更, クレーム, 商品に関する質問)
     * @ORM\Column(type="string", length=100)
     */
    private string $category;

    /**
     * 詳細メモ・対応内容
     * @ORM\Column(type="text")
     */
    private string $memo;

    /**
     * 対応ステータス (1: 対応中, 2: 保留, 3: 完了)
     * @ORM\Column(type="smallint", options={"default": 3})
     */
    private int $status = 3;

    /**
     * @ORM\Column(type="datetime")
     */
    private \DateTimeInterface $create_date;

    public function __construct()
    {
        $this->create_date = new \DateTime();
    }

    // Getters & Setters
    public function getId(): ?int { return $this->id; }
    public function getCustomer(): Customer { return $this->Customer; }
    public function setCustomer(Customer $c): self { $this->Customer = $c; return $this; }
    public function getCreator(): ?Member { return $this->Creator; }
    public function setCreator(?Member $m): self { $this->Creator = $m; return $this; }
    public function getChannel(): int { return $this->channel; }
    public function setChannel(int $c): self { $this->channel = $c; return $this; }
    public function getCategory(): string { return $this->category; }
    public function setCategory(string $cat): self { $this->category = $cat; return $this; }
    public function getMemo(): string { return $this->memo; }
    public function setMemo(string $memo): self { $this->memo = $memo; return $this; }
    public function getStatus(): int { return $this->status; }
    public function setStatus(int $s): self { $this->status = $s; return $this; }
    public function getCreateDate(): \DateTimeInterface { return $this->create_date; }
}
```

---

### အဆင့် ၂: Admin တွင် Memo ရေးသားသိမ်းဆည်းသည့် Controller Action
ဖိုင်တည်နေရာ: `app/Customize/Controller/Admin/CustomerSupportMemoController.php`

```php
<?php

namespace Customize\Controller\Admin;

use Customize\Entity\CustomerResponseHistory;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Controller\AbstractController;
use Eccube\Repository\CustomerRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/%eccube_admin_route%/customer/support-history")
 * @IsGranted("ROLE_ADMIN")
 */
class CustomerSupportMemoController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private CustomerRepository $customerRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        CustomerRepository $customerRepository
    ) {
        $this->entityManager = $entityManager;
        $this->customerRepository = $customerRepository;
    }

    /**
     * @Route("/add/{id}", name="admin_customer_support_memo_add", methods={"POST"})
     */
    public function addMemo(int $id, Request $request): Response
    {
        $this->isTokenValid($request->get('_token'));

        $customer = $this->customerRepository->find($id);
        if (!$customer) {
            throw $this->createNotFoundException('顧客が見つかりません。');
        }

        $memoText = trim($request->get('memo', ''));
        $category = trim($request->get('category', '一般'));
        $channel = (int) $request->get('channel', 1);

        if (!empty($memoText)) {
            $history = new CustomerResponseHistory();
            $history->setCustomer($customer);
            $history->setCreator($this->getUser());
            $history->setChannel($channel);
            $history->setCategory($category);
            $history->setMemo($memoText);

            $this->entityManager->persist($history);
            $this->entityManager->flush();

            $this->addSuccess('顧客対応メモを正常に登録しました。');
        }

        return $this->redirectToRoute('admin_customer_edit', ['id' => $id]);
    }
}
```

---

### အဆင့် ၃: Admin Customer Edit UI (Twig) တွင် Memo Box ပြသခြင်း
ဖိုင်တည်နေရာ: `app/template/admin/Customer/edit.twig`

```twig
{# 顧客対応履歴・メモセクション #}
<div class="card rounded border-0 mb-4 mt-4">
    <div class="card-header font-weight-bold d-flex justify-content-between">
        <span><i class="fas fa-headset mr-2"></i> コールセンター・CS対応履歴</span>
        <button type="button" class="btn btn-sm btn-primary" data-toggle="collapse" data-target="#newMemoBox">
            + 対応メモを追加
        </button>
    </div>
    <div class="card-body">
        {# 新規登録フォーム #}
        <div class="collapse mb-4" id="newMemoBox">
            <form method="post" action="{{ url('admin_customer_support_memo_add', {'id': Customer.id}) }}">
                <input type="hidden" name="_token" value="{{ csrf_token('') }}">
                <div class="form-row">
                    <div class="col-md-4 mb-2">
                        <label class="small font-weight-bold">受付チャネル</label>
                        <select name="channel" class="form-control form-control-sm">
                            <option value="1">📞 お電話</option>
                            <option value="2">✉️ メール</option>
                            <option value="3">📝 お問い合わせフォーム</option>
                        </select>
                    </div>
                    <div class="col-md-8 mb-2">
                        <label class="small font-weight-bold">対応種別</label>
                        <input type="text" name="category" class="form-control form-control-sm" placeholder="例: 注文キャンセル希望、住所変更など">
                    </div>
                </div>
                <div class="form-group">
                    <label class="small font-weight-bold">対応内容メモ</label>
                    <textarea name="memo" class="form-control" rows="3" placeholder="お客様とのお話し合いの内容を記入してください..." required></textarea>
                </div>
                <button type="submit" class="btn btn-sm btn-success">メモを保存する</button>
            </form>
            <hr>
        </div>

        {# 過去の対応履歴一覧 #}
        <div class="timeline">
            {# Repository မှ ဆွဲယူထားသော $supportHistories ကို loop ပတ်ပြသခြင်း #}
            <p class="text-muted small">直近の対応履歴が表示されます。</p>
        </div>
    </div>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Privacy & Access Control (個人情報保護):**  
   ဖုန်းနံပါတ်၊ Credit Card ဆိုင်ရာ စကားပြောဆိုမှုများကို မှတ်တမ်းတင်ရာတွင် Card Number အပြည့်အစုံကို လုံးဝ မရေးသားရအောင် (Masking လုပ်ရန်) Call Center ဝန်ထမ်းများအား လေ့ကျင့်ပေးထားရပါမည်။
2. **kintone / Salesforce REST Sync:**  
   ဤဖိုင်တွင် Save နှိပ်လိုက်ချိန်၌ EventSubscriber ဖြင့် ပြင်ပ CRM API (kintone REST API) သို့ Background POST လှမ်းပို့ပေးခြင်းဖြင့် ပြီးပြည့်စုံသော Cloud CRM Integration ဖြစ်လာပါမည်။
