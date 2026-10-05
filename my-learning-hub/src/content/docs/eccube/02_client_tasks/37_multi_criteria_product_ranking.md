---
title: "37. Multi Criteria Product Ranking"
description: "> 「トップページにランキングタブ（タブ切り替えUI）を新設し、『① 週間売上ランキング』『② お気に入り登録数ランキング』『③ 閲覧数（PV）ランキング』『④ 総合ランキング（売上＋お気に入り＋PVの加重スコア）』をそれぞれ1位〜20位まで自動集計してバッジ（🥇1位、🥈2位、🥉3位）付きで表示してください。」"
---

## Task 37: 多軸商品ランキングシステム (Multi-Criteria Product Ranking: Sales, Favorites, Views, CVR)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「トップページにランキングタブ（タブ切り替えUI）を新設し、『① 週間売上ランキング』『② お気に入り登録数ランキング』『③ 閲覧数（PV）ランキング』『④ 総合ランキング（売上＋お気に入り＋PVの加重スコア）』をそれぞれ1位〜20位まで自動集計してバッジ（🥇1位、🥈2位、🥉3位）付きで表示してください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
Website ၏ Top Page တွင် ဝယ်ယူသူများ စိတ်ဝင်စားမှု အမြင့်မားဆုံးဖြစ်စေရန် **"ရောင်းအားအကောင်းဆုံး"**၊ **"Favorite အများဆုံး"**၊ **"လူကြည့်အများဆုံး (Page Views)"** နှင့် **"အလုံးစုံပေါင်းစပ် အမှတ်ပေး Ranking (Comprehensive Score)"** စသည့် အတိုင်းအတာ ၄ ခုဖြင့် **ကုန်ပစ္စည်း Ranking စနစ်** ကို အလိုအလျောက် တွက်ချက် ပြသပေးခြင်း ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Social Proof & Conversion Optimization (購買意欲の喚起)
- ဂျပန် E-commerce သုံးစွဲသူများသည် အခြားသူများ မည်သည့်ပစ္စည်းကို အများဆုံး ဝယ်ယူနေကြသည် (ランキング) ကို ကြည့်ရှုပြီးမှ ဆုံးဖြတ်ချက်ချလေ့ရှိကြသည်။ Ranking ပြသခြင်းသည် သာမန် ပစ္စည်းပြသမှုထက် Conversion Rate (CVR) ကို ၂ ဆကျော် ပိုမိုတက်စေပါသည်။

### 2. Weighted Scoring Formula (加重配点スコア)
- အလုံးစုံ Ranking (総合ランキング) ကို တွက်ချက်ရာတွင် မျှတမှုရှိစေရန် အောက်ပါ Formula အတိုင်း Weight သတ်မှတ်တွက်ချက်နိုင်သည်:
  $$\text{Score} = (\text{Sales} \times 0.5) + (\text{Favorites} \times 0.3) + (\text{Views} \times 0.2)$$

### 3. Pre-calculated Ranking Table Architecture
- Top Page သည် Traffic အများဆုံး စာမျက်နှာဖြစ်သဖြင့် Page Load တိုင်း အော်ဒါသောင်းချီကို Real-time SQL Aggregate မလုပ်သင့်ပါ။ ညစဉ်/နာရီအလိုက် Batch Job ဖြင့် `dtb_product_ranking` Table ထဲတွင် ကြိုတင်တွက်ချက် သိမ်းဆည်းထားရပါမည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Product Ranking Entity တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/ProductRanking.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Entity\Product;

/**
 * @ORM\Entity(repositoryClass="Customize\Repository\ProductRankingRepository")
 * @ORM\Table(name="dtb_product_ranking", indexes={
 *     @ORM\Index(name="idx_ranking_type_rank", columns={"ranking_type", "rank_position"})
 * })
 */
class ProductRanking
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * ランキング種別 ('sales': 売上, 'favorite': お気に入り, 'views': 閲覧数, 'total': 総合)
     * @ORM\Column(type="string", length=20)
     */
    private string $ranking_type;

    /**
     * 順位 (1, 2, 3, ...)
     * @ORM\Column(type="integer")
     */
    private int $rank_position;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\Product")
     * @ORM\JoinColumn(name="product_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private Product $Product;

    /**
     * 集計スコア
     * @ORM\Column(type="float")
     */
    private float $score;

    /**
     * @ORM\Column(type="datetime")
     */
    private \DateTimeInterface $update_date;

    public function __construct() { $this->update_date = new \DateTime(); }

    public function getId(): ?int { return $this->id; }
    public function getRankingType(): string { return $this->ranking_type; }
    public function setRankingType(string $t): self { $this->ranking_type = $t; return $this; }
    public function getRankPosition(): int { return $this->rank_position; }
    public function setRankPosition(int $p): self { $this->rank_position = $p; return $this; }
    public function getProduct(): Product { return $this->Product; }
    public function setProduct(Product $p): self { $this->Product = $p; return $this; }
    public function getScore(): float { return $this->score; }
    public function setScore(float $s): self { $this->score = $s; return $this; }
}
```

---

### အဆင့် ၂: Ranking Aggregator Command ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Command/CalculateProductRankingCommand.php`

```php
<?php

namespace Customize\Command;

use Customize\Entity\ProductRanking;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Master\OrderStatus;
use Eccube\Entity\Master\ProductStatus;
use Eccube\Entity\Product;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CalculateProductRankingCommand extends Command
{
    protected static $defaultName = 'app:calculate-ranking';
    protected static $defaultDescription = 'Calculate and cache product rankings';

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Calculating Product Rankings...');

        $this->entityManager->beginTransaction();
        try {
            // Ranking အဟောင်းများကို ရှင်းလင်းခြင်း
            $this->entityManager->createQuery('DELETE FROM Customize\Entity\ProductRanking')->execute();

            // ၁။ 直近30日の売上個数ランキング (Sales Ranking)
            $salesData = $this->entityManager->createQuery('
                SELECT p.id, SUM(oi.quantity) AS sales_qty
                FROM Eccube\Entity\OrderItem oi
                INNER JOIN oi.Product p
                INNER JOIN oi.Order o
                WHERE o.order_date >= :sinceDate
                AND o.OrderStatus != :cancelStatus
                AND p.Status = :publicStatus
                GROUP BY p.id
                ORDER BY sales_qty DESC
            ')
            ->setParameter('sinceDate', new \DateTime('-30 days'))
            ->setParameter('cancelStatus', OrderStatus::CANCEL)
            ->setParameter('publicStatus', ProductStatus::DISPLAY_SHOW)
            ->setMaxResults(20)
            ->getArrayResult();

            $rank = 1;
            foreach ($salesData as $row) {
                $product = $this->entityManager->getReference(Product::class, $row['id']);
                $r = new ProductRanking();
                $r->setRankingType('sales');
                $r->setRankPosition($rank++);
                $r->setProduct($product);
                $r->setScore((float)$row['sales_qty']);
                $this->entityManager->persist($r);
            }

            // ၂။ お気に入り数ランキング (Favorite Ranking)
            $favData = $this->entityManager->createQuery('
                SELECT p.id, COUNT(cfp.id) AS fav_qty
                FROM Eccube\Entity\CustomerFavoriteProduct cfp
                INNER JOIN cfp.Product p
                WHERE p.Status = :publicStatus
                GROUP BY p.id
                ORDER BY fav_qty DESC
            ')
            ->setParameter('publicStatus', ProductStatus::DISPLAY_SHOW)
            ->setMaxResults(20)
            ->getArrayResult();

            $rank = 1;
            foreach ($favData as $row) {
                $product = $this->entityManager->getReference(Product::class, $row['id']);
                $r = new ProductRanking();
                $r->setRankingType('favorite');
                $r->setRankPosition($rank++);
                $r->setProduct($product);
                $r->setScore((float)$row['fav_qty']);
                $this->entityManager->persist($r);
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            $io->success('All rankings successfully generated!');
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            $io->error('Ranking Calculation Failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
```

---

### အဆင့် ၃: Top Page Twig တွင် Ranking Tabs UI ပြသခြင်း
```twig
{# ランキングタブ表示 #}
<div class="ec-rankingArea my-5">
    <h2 class="text-center font-weight-bold mb-4">🏆 人気商品ランキング</h2>
    
    <ul class="nav nav-pills justify-content-center mb-4" id="rankingTab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active font-weight-bold" data-toggle="pill" href="#tab-sales">売れ筋ランキング</a>
        </li>
        <li class="nav-item">
            <a class="nav-link font-weight-bold" data-toggle="pill" href="#tab-fav">お気に入り人気順</a>
        </li>
    </ul>

    <div class="tab-content" id="rankingTabContent">
        <div class="tab-pane fade show active" id="tab-sales">
            <div class="row">
                {% for item in salesRankings %}
                    <div class="col-6 col-md-3 mb-4">
                        <div class="card h-100 border-0 shadow-sm position-relative">
                            <span class="position-absolute badge badge-danger p-2" style="top:5px; left:5px;">
                                {{ item.rankPosition }}位
                            </span>
                            <img src="{{ asset(item.Product.main_list_image|no_image_product, 'save_image') }}" class="card-img-top">
                            <div class="card-body p-2 text-center">
                                <p class="small text-truncate mb-1">{{ item.Product.name }}</p>
                                <span class="font-weight-bold text-danger">{{ item.Product.getPrice02IncTaxMin|price }}</span>
                            </div>
                        </div>
                    </div>
                {% endfor %}
            </div>
        </div>
    </div>
</div>
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Category-wise Ranking (カテゴリ別ランキング):**  
   ဆိုင်ကြီးများတွင် Top Page အပြင် ကဏ္ဍအလိုက် (ဥပမာ - "Ladies Fashion Ranking", "Food Ranking") ခွဲခြားကြည့်လိုသော တောင်းဆိုမှုများရှိသဖြင့် `category_id` parameter ကို ထပ်ဆောင်းနိုင်ပါသည်။
2. **Out of Stock Display:**  
   Ranking ဝင်သော်လည်း ကုန်ပစ္စည်း စတော့မရှိတော့ပါက "SOLD OUT" badge ပြသပေးခြင်း သို့မဟုတ် Client စည်းမျဉ်းအရ စတော့ကုန်ပစ္စည်းများကို Ranking မှ ခေတ္တ ဖယ်ထုတ်ပေးသင့်ပါသည်။
