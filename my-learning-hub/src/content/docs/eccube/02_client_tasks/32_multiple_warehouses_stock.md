---
title: "32. Multiple Warehouses Stock"
description: "> 「全国複数箇所にある物流倉庫（例: 関東倉庫、関西倉庫、実店舗倉庫）ごとに商品在庫を個別管理できるようにしてください。商品Aの在庫が『関東倉庫: 50点、関西倉庫: 30点、店舗: 20点』のように分かれており、注文が入った際は配送先住所（都道府県）や在庫状況から最適な倉庫を自動判定して在庫を引き当て（予約）、出荷"
---

## Task 32: 倉庫ごとに在庫を管理してください (Multi-Warehouse Stock Management & Order Routing)

## 📌 Client Requirement (တောင်းဆိုချက်)
> 「全国複数箇所にある物流倉庫（例: 関東倉庫、関西倉庫、実店舗倉庫）ごとに商品在庫を個別管理できるようにしてください。商品Aの在庫が『関東倉庫: 50点、関西倉庫: 30点、店舗: 20点』のように分かれており、注文が入った際は配送先住所（都道府県）や在庫状況から最適な倉庫を自動判定して在庫を引き当て（予約）、出荷指示を出せるようにしてください。」

**မြန်မာလို ရှင်းလင်းချက်:**  
ဂိုဒေါင်တစ်ခုတည်း မဟုတ်ဘဲ **ဂိုဒေါင်ပေါင်းများစွာ (Multiple Warehouses: Warehouse A, B, C)** အလိုက် ကုန်ပစ္စည်းစတော့များကို ခွဲခြားသိမ်းဆည်းပြီး၊ အော်ဒါဝင်လာသည့်အခါ ဝယ်ယူသူ၏ လိပ်စာနှင့် အနီးဆုံး သို့မဟုတ် လက်ကျန်ရှိသော ဂိုဒေါင်ကို **အလိုအလျောက် ရွေးချယ်တွက်ချက်၍ စတော့နုတ်ယူခြင်း (Order Routing & Stock Allocation)** ဖြစ်သည်။

---

## 💡 Why Use This Feature / Architecture? (အဘယ်ကြောင့် ဤနည်းလမ်းကို သုံးရသနည်း)

### 1. Multi-hub Logistics & Shipping Cost Optimization (送料・配送日数の削減)
- တိုကျိုမှ မှာယူသော ဝယ်ယူသူအား တိုကျိုအနီး ကန်တိုဂိုဒေါင်မှ ပို့ဆောင်ခြင်းဖြင့် ပို့ဆောင်ခ သက်သာပြီး နောက်တစ်နေ့ မနက်တွင် ပစ္စည်းရောက်ရှိစေနိုင်သည်။
- စတော့တစ်ခုတည်း စုပေါင်းထားပါက မည်သည့်ဂိုဒေါင်မှ ပစ္စည်းထုတ်ရမည်ကို ဝန်ထမ်းများက လက်ဖြင့် စစ်ဆေးနေရသဖြင့် လုပ်ငန်းကြန့်ကြာစေပါသည်။

### 2. Relational Schema Architecture (`Warehouse` & `WarehouseStock`)
- Core Entity `dtb_product_class` ကို တိုက်ရိုက် ပြင်မည့်အစား `Warehouse` Entity နှင့် `WarehouseStock` Entity အသစ် ၂ ခု တည်ဆောက်ပြီး OneToMany ဖြင့် ချိတ်ဆက်ခြင်းသည် စနစ်တကျ Scalable ဖြစ်သော Enterprise Architecture ဖြစ်သည်။

---

## 🛠️ Step-by-Step Implementation Guide

### အဆင့် ၁: Warehouse နှင့် WarehouseStock Entity တည်ဆောက်ခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Entity/Warehouse.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity(repositoryClass="Customize\Repository\WarehouseRepository")
 * @ORM\Table(name="dtb_warehouse")
 */
class Warehouse
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * 倉庫名 (例: 関東メイン倉庫, 関西ロジセンター)
     * @ORM\Column(type="string", length=255)
     */
    private string $name;

    /**
     * 対象エリア (カンマ区切り都道府県コード: 例 "11,12,13,14")
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $covered_pref_codes = null;

    /**
     * 優先度 (Priority)
     * @ORM\Column(type="integer", options={"default": 1})
     */
    private int $priority = 1;

    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getCoveredPrefCodes(): ?string { return $this->covered_pref_codes; }
    public function setCoveredPrefCodes(?string $codes): self { $this->covered_pref_codes = $codes; return $this; }
    public function getPriority(): int { return $this->priority; }
    public function setPriority(int $p): self { $this->priority = $p; return $this; }
}
```

ဖိုင်တည်နေရာ: `app/Customize/Entity/WarehouseStock.php`

```php
<?php

namespace Customize\Entity;

use Doctrine\ORM\Mapping as ORM;
use Eccube\Entity\ProductClass;

/**
 * @ORM\Entity(repositoryClass="Customize\Repository\WarehouseStockRepository")
 * @ORM\Table(name="dtb_warehouse_stock")
 */
class WarehouseStock
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\ManyToOne(targetEntity="Customize\Entity\Warehouse")
     * @ORM\JoinColumn(name="warehouse_id", referencedColumnName="id", nullable=false)
     */
    private Warehouse $Warehouse;

    /**
     * @ORM\ManyToOne(targetEntity="Eccube\Entity\ProductClass")
     * @ORM\JoinColumn(name="product_class_id", referencedColumnName="id", nullable=false)
     */
    private ProductClass $ProductClass;

    /**
     * 倉庫ごとの在庫数
     * @ORM\Column(type="integer", options={"default": 0})
     */
    private int $stock = 0;

    public function getId(): ?int { return $this->id; }
    public function getWarehouse(): Warehouse { return $this->Warehouse; }
    public function setWarehouse(Warehouse $w): self { $this->Warehouse = $w; return $this; }
    public function getProductClass(): ProductClass { return $this->ProductClass; }
    public function setProductClass(ProductClass $pc): self { $this->ProductClass = $pc; return $this; }
    public function getStock(): int { return $this->stock; }
    public function setStock(int $s): self { $this->stock = $s; return $this; }
}
```

---

### အဆင့် ၂: Warehouse Allocation (Routing) Service ရေးသားခြင်း
ဖိုင်တည်နေရာ: `app/Customize/Service/WarehouseAllocationService.php`

```php
<?php

namespace Customize\Service;

use Customize\Entity\Warehouse;
use Customize\Entity\WarehouseStock;
use Customize\Repository\WarehouseRepository;
use Customize\Repository\WarehouseStockRepository;
use Doctrine\ORM\EntityManagerInterface;
use Eccube\Entity\Order;
use Eccube\Entity\ProductClass;

class WarehouseAllocationService
{
    private EntityManagerInterface $entityManager;
    private WarehouseRepository $warehouseRepository;
    private WarehouseStockRepository $stockRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        WarehouseRepository $warehouseRepository,
        WarehouseStockRepository $stockRepository
    ) {
        $this->entityManager = $entityManager;
        $this->warehouseRepository = $warehouseRepository;
        $this->stockRepository = $stockRepository;
    }

    /**
     * 注文の配送先と在庫数から最適な倉庫を決定し、在庫を引き当てる
     *
     * @param Order $order
     * @return array [ 'allocated' => bool, 'details' => array ]
     */
    public function allocateOrderStock(Order $order): array
    {
        $shipping = $order->getShippings()->first();
        $prefId = $shipping ? (string) $shipping->getPref()->getId() : null;

        $allocationLog = [];

        foreach ($order->getOrderItems() as $item) {
            if (!$item->isProduct()) {
                continue;
            }

            $productClass = $item->getProductClass();
            $requiredQuantity = $item->getQuantity();

            // သက်ဆိုင်ရာ ProductClass အတွက် စတော့ရှိသော ဂိုဒေါင်များကို ရှာဖွေခြင်း
            $availableStocks = $this->stockRepository->createQueryBuilder('ws')
                ->innerJoin('ws.Warehouse', 'w')
                ->where('ws.ProductClass = :pc')
                ->andWhere('ws.stock >= :qty')
                ->setParameter('pc', $productClass)
                ->setParameter('qty', $requiredQuantity)
                ->orderBy('w.priority', 'ASC')
                ->getQuery()
                ->getResult();

            if (empty($availableStocks)) {
                throw new \Exception(sprintf('商品「%s」の在庫を引当可能な倉庫が存在しません。', $item->getProductName()));
            }

            // အနီးဆုံး နေရာဒေသနှင့် ကိုက်ညီသော ဂိုဒေါင်ကို ရွေးချယ်ခြင်း
            /** @var WarehouseStock $chosenStock */
            $chosenStock = $availableStocks[0];
            foreach ($availableStocks as $ws) {
                $prefCodes = explode(',', $ws->getWarehouse()->getCoveredPrefCodes() ?? '');
                if (in_array($prefId, $prefCodes, true)) {
                    $chosenStock = $ws;
                    break;
                }
            }

            // ဂိုဒေါင်မှ စတော့ နုတ်ယူခြင်း
            $chosenStock->setStock($chosenStock->getStock() - $requiredQuantity);
            $this->entityManager->persist($chosenStock);

            $allocationLog[] = [
                'product' => $item->getProductName(),
                'warehouse' => $chosenStock->getWarehouse()->getName(),
                'qty' => $requiredQuantity,
            ];
        }

        $this->entityManager->flush();

        return ['allocated' => true, 'details' => $allocationLog];
    }
}
```

---

## ⚠️ Key Pitfalls & Tips (ဂျပန် Client Project များတွင် သတိပြုရန်)

1. **Split Shipment (分納・分割出荷への考慮):**  
   ပစ္စည်း A သည် ကန်တိုဂိုဒေါင်တွင်သာ ရှိပြီး ပစ္စည်း B သည် ကန်ဆိုင်းဂိုဒေါင်တွင်သာ ရှိပါက အော်ဒါ ၁ ခုတည်းကို ပါဆယ် ၂ ထုပ်ခွဲ၍ ပို့ဆောင်ရပါမည် (複数配送・分納)။ ဤကိစ္စတွင် ပို့ဆောင်ခ ၂ ဆ ဖြစ်လာနိုင်သဖြင့် Client Business Rule အား ကြိုတင် အတည်ပြုရပါမည်။
2. **Syncing Overall Stock:**  
   EC-CUBE Core ၏ `dtb_product_class.stock` သည် ဂိုဒေါင်အားလုံးရှိ လက်ကျန်စတော့များ၏ ပေါင်းလဒ် (`SUM(warehouse_stocks)`) ဖြစ်နေစေရန် Event Listener ဖြင့် အမြဲ Sync လုပ်ထားရပါမည်။
