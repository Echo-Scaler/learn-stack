---
title: "38. Verified Buyer Review System"
description: "> 「商品への口コミ・レビュー機能を追加してください。いたずら投稿や競合からの誹謗中傷を防ぐため、『実際にその商品を購入した会員のみ』が投稿できるように制限（購入者認証）してください。また、星評価（★1〜5）、レビュー画像の添付、管理者による事前承認制（承認後に公開）、『参考になった（Helpful votes）』ボタ"
---

## Task 38: 購入者限定レビュー・評価システム (Verified Buyer Review & Rating System)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「商品への口コミ・レビュー機能を追加してください。いたずら投稿や競合からの誹謗中傷を防ぐため、『実際にその商品を購入した会員のみ』が投稿できるように制限（購入者認証）してください。また、星評価（★1〜5）、レビュー画像の添付、管理者による事前承認制（承認後に公開）、『参考になった（Helpful votes）』ボタンを実装してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ကုန်ပစ္စည်း အဆင့်သတ်မှတ်ချက်နှင့် မှတ်ချက်စနစ် (Product Review & Rating System) တွင် စည်းကမ်းမဲ့ Spam များနှင့် အပြိုင်အဆိုင် တိုက်ခိုက်မှုများကို ကာကွယ်ရန် **"အမှန်တကယ် ဝယ်ယူဖူးသော Member သာ (Verified Buyer Only)"** Review ရေးသားခွင့်ပြုပြီး၊ ကြယ် ၅ ပွင့် အမှတ်ပေးခြင်း၊ ပုံတင်နိုင်ခြင်း၊ Admin က စစ်ဆေးအတည်ပြုပြီးမှ Website ပေါ်တင်ခွင့်ပြုခြင်း (Admin Moderation) စနစ် တည်ဆောက်ခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Review Authenticity & Social Proof (信憑性の高い口コミ)
- ဂျပန်နိုင်ငံတွင် ဝယ်ယူသူ ၈၀% ကျော်သည် Review ကို အခြေခံ၍ ဝယ်ယူကြသည်။ "購入者" (Verified Buyer) အမှတ်အသား ပါဝင်သော Review သည် ယုံကြည်စိတ်ချရမှုကို အမြင့်ဆုံး မြှင့်တင်ပေးသည်။

### 2. Pre-moderation Workflow (事前承認フロー)
- အဆိုးမြင် တိုက်ခိုက်မှုများ သို့မဟုတ် မဖွယ်မရာ စကားလုံးများ ပါဝင်သော Review များသည် Brand ပုံရိပ်ကို ထိခိုက်စေနိုင်သည်။ Database တွင် `status = 0 (審査中 / Pending)` ဖြင့် သိမ်းဆည်းပြီး Admin Panel မှ "承認 (Approve)" ပြုလုပ်ပြီးမှသာ `status = 1 (公開 / Published)` အဖြစ် Frontend တွင် ပြသရမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: ProductReview Entity တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductReview.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Entity\Customer;
use Eccube\Entity\Product;

/**
 * @ORM\Entity(repositoryClass="Customize\Repository\ProductReviewRepository")
 * @ORM\Table(name="dtb_product_review")
 */
class ProductReview
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Product")
     * @ORM\JoinColumn(name="product_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private Product $Product;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Customer")
     * @ORM\JoinColumn(name="customer_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private Customer $Customer;

    /**
     * 星評価 (1 〜 5)
     * @ORM\Column(type="smallint")
     */
    private int $rating = 5;

    /**
     * レビュータイトル
     * @ORM\Column(type="string", length=255)
     */
    private string $title;

    /**
     * レビュー本文
     * @ORM\Column(type="text")
     */
    private string $comment;

    /**
     * 投稿画像ファイル名
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $image_filename = null;

    /**
     * ステータス (0: 承認待ち/Pending, 1: 公開/Approved, 2: 否認/Rejected)
     * @ORM\Column(type="smallint", options={"default": 0})
     */
    private int $status = 0;

    /**
     * 参考になった（いいね）数
     * @ORM\Column(type="integer", options={"default": 0})
     */
    private int $helpful_count = 0;

    /**
     * @ORM\Column(type="datetime")
     */
    private \DateTimeInterface $create_date;

    public function __construct() { $this->create_date = new \DateTime(); }

    // Getters & Setters
    public function getId(): ?int { return $this->id; }
    public function getProduct(): Product { return $this->Product; }
    public function setProduct(Product $p): self { $this->Product = $p; return $this; }
    public function getCustomer(): Customer { return $this->Customer; }
    public function setCustomer(Customer $c): self { $this->Customer = $c; return $this; }
    public function getRating(): int { return $this->rating; }
    public function setRating(int $r): self { $this->rating = $r; return $this; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $t): self { $this->title = $t; return $this; }
    public function getComment(): string { return $this->comment; }
    public function setComment(string $c): self { $this->comment = $c; return $this; }
    public function getImageFilename(): ?string { return $this->image_filename; }
    public function setImageFilename(?string $img): self { $this->image_filename = $img; return $this; }
    public function getStatus(): int { return $this->status; }
    public function setStatus(int $s): self { $this->status = $s; return $this; }
    public function getHelpfulCount(): int { return $this->helpful_count; }
    public function setHelpfulCount(int $h): self { $this->helpful_count = $h; return $this; }
}
```

---

### အဆင့် ၂: ဝယ်ယူပြီးခြင်း ရှိ/မရှိ စစ်ဆေးသည့် Verification Service
ဖိုင်တည်နေရာ: `app/Customize/Service/ReviewVerificationService.php`

```php
<?php

namespace Customize\Service;

use Eccube\Entity\Customer;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Product;
use Eccube\Repository\OrderRepository;

class ReviewVerificationService
{
    private OrderRepository $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * 該当会員が過去に対象商品を購入（かつ発送済み/完了）しているかを厳密判定する
     *
     * @param Customer $customer
     * @param Product $product
     * @return bool
     */
    public function isVerifiedBuyer(Customer $customer, Product $product): bool
    {
        $count = $this->orderRepository->createQueryBuilder('o')
            ->select('COUNT(o.id)')
            ->innerJoin('o.OrderItems', 'oi')
            ->where('o.Customer = :customer')
            ->andWhere('oi.Product = :product')
            ->andWhere('o.OrderStatus IN (:completedStatuses)')
            ->setParameter('customer', $customer)
            ->setParameter('product', $product)
            ->setParameter('completedStatuses', [OrderStatus::DELIVERED, OrderStatus::PAID])
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count > 0;
    }
}
```

---

### အဆင့် ၃: Review Submission Controller Action
ဖိုင်တည်နေရာ: `app/Customize/Controller/ProductReviewController.php`

```php
<?php

namespace Customize\Controller;

use Customize\Entity\ProductReview;
use Customize\Service\ReviewVerificationService;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Controller\AbstractController;
use Eccube\Entity\Customer;
use Eccube\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class ProductReviewController extends AbstractController
{
    private ReviewVerificationService $verificationService;
    private ProductRepository $productRepository;
    private EntityManagerInterface $entityManager;
    private Security $security;

    public function __construct(
        ReviewVerificationService $verificationService,
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        Security $security
    ) {
        $this->verificationService = $verificationService;
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @Route("/product/review/post/{id}", name="product_review_post", methods={"POST"})
     */
    public function postReview(int $id, Request $request): Response
    {
        $user = $this->security->getUser();
        if (!$user instanceof Customer) {
            $this->addError('レビューを投稿するにはログインが必要です。');
            return $this->redirectToRoute('mypage_login');
        }

        $product = $this->productRepository->find($id);
        if (!$product) {
            throw $this->createNotFoundException('商品が見つかりません。');
        }

        // 🌟 購入者認証チェック (Verified Buyer Check)
        if (!$this->verificationService->isVerifiedBuyer($user, $product)) {
            $this->addError('この商品のレビューは、実際にご購入いただいたお客様のみ投稿可能です。');
            return $this->redirectToRoute('product_detail', ['id' => $id]);
        }

        $title = trim($request->get('title', ''));
        $comment = trim($request->get('comment', ''));
        $rating = (int) $request->get('rating', 5);

        $review = new ProductReview();
        $review->setProduct($product);
        $review->setCustomer($user);
        $review->setTitle($title);
        $review->setComment($comment);
        $review->setRating($rating);
        $review->setStatus(0); // 承認待ち (Pending Admin Approval)

        $this->entityManager->persist($review);
        $this->entityManager->flush();

        $this->addSuccess('レビューを投稿いただきありがとうございました。管理者の承認後に掲載されます。');

        return $this->redirectToRoute('product_detail', ['id' => $id]);
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Anti-Defamation & Profanity Filtering (NGワードフィルター):**  
   မဖွယ်မရာ စကားလုံးများကို Auto-detect လုပ်နိုင်ရန် NG Words List ဖြင့် Check ပြုလုပ်ကာ သံသယဖြစ်ဖွယ် စာသားများပါက အလိုအလျောက် ပယ်ဖျက်နိုင်ပါသည်။
2. **Review Incentives (レビュー投稿でポイント付与):**  
   Review ရေးသားသူများကို 100 Points လက်ဆောင်ပေးလိုပါက Admin က Approve လုပ်သည့် Event (`ReviewApprovedEvent`) တွင် Task 24 ရှိ `CustomerPointRewardService` နှင့် ချိတ်ဆက်ပေးနိုင်ပါသည်။
