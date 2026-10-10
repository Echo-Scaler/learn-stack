---
title: "10. Csv Import Export"
description: "> အဆင့်: Intermediate | EC-Cube Version: 4.2+"
---

## 10 - CSV Import/Export Customize လုပ်နည်း

> **အဆင့်**: Intermediate | **EC-Cube Version**: 4.2+

EC-Cube ၏ CSV Import/Export feature ကို ကိုယ်ပိုင် column များ ထည့်ကာ Customize ပြုလုပ်နည်း။

---

## 🎯 ရည်ရွယ်ချက်

- Product CSV Export တွင် ကိုယ်ပိုင် column ထည့်တတ်ရန်
- Customer CSV ကို ကိုယ်ပိုင် format ဖြင့် export တတ်ရန်
- CSV Import validation ကိုယ်ပိုင် logic ဖြင့် ထည့်တတ်ရန်

---

## 📌 EC-Cube CSV Architecture

```
Admin → データ管理 → CSV出力  →  CsvExportController
Admin → データ管理 → CSV読み込み  →  ProductCsvImportController
```

---

## 📝 အဆင့်ဆင့် လုပ်ဆောင်ခြင်း

### အဆင့် 1 - Custom Product CSV Export Controller

`app/Plugin/MyPlugin/Controller/Admin/ProductCsvController.php`

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class ProductCsvController extends AbstractController
{
    public function __construct(
        private readonly ProductRepository $productRepository
    ) {}

    /**
     * ကိုယ်ပိုင် Product CSV ကို Download ပြုလုပ်ပါ
     * 
     * @Route("/%eccube_admin_route%/my-plugin/csv/product", name="my_plugin_admin_csv_product")
     */
    public function exportProductCsv(Request $request): StreamedResponse
    {
        // Streamed Response ဖြင့် Memory-efficient ဖြစ်သော CSV download
        $response = new StreamedResponse(function () {
            
            $handle = fopen('php://output', 'w');

            // BOM ထည့်ပါ (Excel ဖြင့် ဖွင့်သောအခါ UTF-8 encoding မှန်ကန်ရန်)
            fwrite($handle, "\xEF\xBB\xBF");

            // === Header Row ===
            fputcsv($handle, [
                '商品ID',
                '商品コード',
                '商品名',
                '通常価格',
                '販売価格',
                '在庫数',
                'カテゴリ',
                'YouTube URL',       // Custom field
                '重量(kg)',           // Custom field
                '公開ステータス',
                '作成日',
                '更新日',
            ]);

            // === Data Rows ===
            $products = $this->productRepository->createQueryBuilder('p')
                ->leftJoin('p.ProductClasses', 'pc')
                ->leftJoin('p.ProductCategories', 'pcat')
                ->leftJoin('pcat.Category', 'cat')
                ->getQuery()
                ->getResult();

            foreach ($products as $product) {
                // Category names ကို comma-separated string ဖြင့် ပြုလုပ်ပါ
                $categories = implode(
                    ', ',
                    $product->getProductCategories()->map(
                        fn($pc) => $pc->getCategory()->getName()
                    )->toArray()
                );

                // ProductClass (variant) ၏ တစ်ခုကို ယူပါ (simplified)
                $mainClass = $product->getProductClasses()->first();

                fputcsv($handle, [
                    $product->getId(),
                    $mainClass ? $mainClass->getCode() : '',
                    $product->getName(),
                    $mainClass ? $mainClass->getPrice01IncTax() : '',
                    $mainClass ? $mainClass->getPrice02IncTax() : '',
                    $mainClass ? $mainClass->getStock() : '',
                    $categories,
                    $product->getPlgYoutubeUrl() ?? '',      // Custom Trait field
                    $product->getPlgWeightKg() ?? '',        // Custom Trait field
                    $product->getStatus()->getId() === 1 ? '公開' : '非公開',
                    $product->getCreateDate()->format('Y-m-d H:i:s'),
                    $product->getUpdateDate()->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        });

        // Response Headers ကို set ပြုလုပ်ပါ
        $filename = 'products_' . date('Ymd_His') . '.csv';
        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', "attachment; filename=\"{$filename}\"");

        return $response;
    }

    /**
     * Customer CSV Export
     * 
     * @Route("/%eccube_admin_route%/my-plugin/csv/customer", name="my_plugin_admin_csv_customer")
     */
    public function exportCustomerCsv(): StreamedResponse
    {
        $response = new StreamedResponse(function () {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF"); // BOM

            // Header
            fputcsv($handle, [
                'ID', 'お名前', 'メール', '電話番号',
                '都道府県', '会社名',          // Custom
                '登録日', '最終ログイン',
                '注文回数', '累計購入金額',
            ]);

            // Data
            $customers = $this->entityManager
                ->getRepository(\Eccube\Entity\Customer::class)
                ->findAll();

            foreach ($customers as $customer) {
                $orderCount = $customer->getOrders()->count();
                $totalSpent = array_sum(
                    $customer->getOrders()
                        ->map(fn($o) => $o->getPaymentTotal())
                        ->toArray()
                );

                fputcsv($handle, [
                    $customer->getId(),
                    $customer->getName01() . ' ' . $customer->getName02(),
                    $customer->getEmail(),
                    $customer->getPhoneNumber(),
                    $customer->getPref() ? $customer->getPref()->getName() : '',
                    $customer->getPlgCompanyName() ?? '',  // Custom Trait
                    $customer->getCreateDate()->format('Y-m-d'),
                    $customer->getLoginDate() ? $customer->getLoginDate()->format('Y-m-d H:i') : '-',
                    $orderCount,
                    number_format($totalSpent),
                ]);
            }

            fclose($handle);
        });

        $filename = 'customers_' . date('Ymd_His') . '.csv';
        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', "attachment; filename=\"{$filename}\"");

        return $response;
    }
}
```

---

### အဆင့် 2 - CSV Import (Product) Controller

`app/Plugin/MyPlugin/Controller/Admin/ProductCsvImportController.php`

```php
<?php

namespace Plugin\MyPlugin\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\ProductRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductCsvImportController extends AbstractController
{
    public function __construct(
        private readonly ProductRepository $productRepository,
    ) {}

    /**
     * @Route("/%eccube_admin_route%/my-plugin/csv/import", name="my_plugin_admin_csv_import", methods={"GET", "POST"})
     * @Template("@MyPlugin/admin/csv_import.twig")
     */
    public function import(Request $request): array|\Symfony\Component\HttpFoundation\RedirectResponse
    {
        $errors = [];
        $successCount = 0;

        if ($request->isMethod('POST')) {
            /** @var UploadedFile $file */
            $file = $request->files->get('csv_file');

            if (!$file || $file->getClientOriginalExtension() !== 'csv') {
                $errors[] = 'CSVファイルを選択してください';
            } else {
                // CSV ကို Parse ပြုလုပ်ပါ
                $handle = fopen($file->getPathname(), 'r');

                // BOM ဖယ်ရှားပါ
                $bom = fread($handle, 3);
                if ($bom !== "\xEF\xBB\xBF") {
                    rewind($handle);
                }

                $rowIndex = 0;
                while (($row = fgetcsv($handle)) !== false) {
                    $rowIndex++;

                    // Header row ကို skip ပါ
                    if ($rowIndex === 1) {
                        continue;
                    }

                    // Validation
                    if (empty($row[0])) {
                        $errors[] = "行 {$rowIndex}: 商品IDが空です";
                        continue;
                    }

                    $product = $this->productRepository->find((int) $row[0]);
                    if (!$product) {
                        $errors[] = "行 {$rowIndex}: 商品ID {$row[0]} が見つかりません";
                        continue;
                    }

                    // Custom fields を更新
                    if (isset($row[6])) {
                        $product->setPlgYoutubeUrl($row[6] ?: null);
                    }
                    if (isset($row[7])) {
                        $product->setPlgWeightKg($row[7] ?: null);
                    }

                    $successCount++;
                }

                fclose($handle);
                $this->entityManager->flush();

                if (empty($errors)) {
                    $this->addSuccess("{$successCount}件の商品を更新しました", 'admin');
                    return $this->redirectToRoute('my_plugin_admin_csv_import');
                }
            }
        }

        return [
            'errors'       => $errors,
            'successCount' => $successCount,
        ];
    }
}
```

---

### အဆင့် 3 - CSV Import Template

`app/Plugin/MyPlugin/Resource/template/admin/csv_import.twig`

```twig
{% extends 'admin_layout.twig' %}

{% block title %}CSV取り込み{% endblock %}

{% block main %}
<div class="c-contentsArea__cols">
    <div class="c-contentsArea__primaryCol">
        
        <div class="card mb-4">
            <div class="card-header">
                <span>商品 CSV 取り込み</span>
            </div>
            <div class="card-body">
                
                {# Errors #}
                {% if errors is not empty %}
                <div class="alert alert-danger">
                    <ul>
                        {% for error in errors %}
                        <li>{{ error }}</li>
                        {% endfor %}
                    </ul>
                </div>
                {% endif %}

                {# Upload Form #}
                <form method="post" enctype="multipart/form-data">
                    <input type="hidden" name="_token" value="{{ csrf_token('my_plugin_csv_import') }}">
                    
                    <div class="form-group">
                        <label>CSVファイル</label>
                        <input type="file" name="csv_file" accept=".csv" class="form-control">
                        <small class="form-text text-muted">
                            文字コード: UTF-8 / 1行目はヘッダー行
                        </small>
                    </div>
                    
                    <button type="submit" class="btn btn-ec-conversion">
                        <i class="fa fa-upload"></i> 取り込む
                    </button>
                    
                    <a href="{{ url('my_plugin_admin_csv_product') }}" class="btn btn-outline-secondary ml-2">
                        <i class="fa fa-download"></i> テンプレートダウンロード
                    </a>
                </form>
                
            </div>
        </div>

        {# CSV Format Guide #}
        <div class="card">
            <div class="card-header">CSV フォーマット</div>
            <div class="card-body">
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th>列</th>
                            <th>項目名</th>
                            <th>必須</th>
                            <th>説明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>A</td><td>商品ID</td><td>✅</td><td>既存商品のIDを指定</td></tr>
                        <tr><td>B</td><td>商品コード</td><td>-</td><td>更新対象外</td></tr>
                        <tr><td>C</td><td>商品名</td><td>-</td><td>更新対象外</td></tr>
                        <tr><td>G</td><td>YouTube URL</td><td>-</td><td>YouTube の動画 URL</td></tr>
                        <tr><td>H</td><td>重量 (kg)</td><td>-</td><td>小数点3桁まで</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </div>
</div>
{% endblock %}
```

---

### အဆင့် 4 - Order CSV Export (Custom)

Order data ကို ကိုယ်ပိုင် format ဖြင့် export ပြုလုပ်ပါ:

```php
/**
 * @Route("/%eccube_admin_route%/my-plugin/csv/order", name="my_plugin_admin_csv_order")
 */
public function exportOrderCsv(): StreamedResponse
{
    $response = new StreamedResponse(function () {
        $handle = fopen('php://output', 'w');
        fwrite($handle, "\xEF\xBB\xBF");

        fputcsv($handle, [
            '注文番号', '注文日時', 'お名前', 'メール',
            '郵便番号', '住所', '電話番号',
            '支払方法', '商品合計', '送料', '合計金額',
            'ステータス', '配送希望日',  // Custom
        ]);

        $orders = $this->orderRepository->findAll();

        foreach ($orders as $order) {
            $deliveryDate = '';
            $shippings = $order->getShippings();
            if (!$shippings->isEmpty()) {
                $plgDate = $shippings->first()->getPlgDeliveryDate();
                $deliveryDate = $plgDate ? $plgDate->format('Y-m-d') : '';
            }

            fputcsv($handle, [
                $order->getNo(),
                $order->getOrderDate()->format('Y-m-d H:i:s'),
                $order->getName01() . ' ' . $order->getName02(),
                $order->getEmail(),
                $order->getPostalCode(),
                $order->getPref()->getName() . $order->getAddr01() . $order->getAddr02(),
                $order->getPhoneNumber(),
                $order->getPayment()->getMethod(),
                $order->getSubtotal(),
                $order->getDeliveryFeeTotal(),
                $order->getPaymentTotal(),
                $order->getOrderStatus()->getName(),
                $deliveryDate,
            ]);
        }

        fclose($handle);
    });

    $filename = 'orders_' . date('Ymd_His') . '.csv';
    $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
    $response->headers->set('Content-Disposition', "attachment; filename=\"{$filename}\"");

    return $response;
}
```

---

## ✅ စစ်ဆေးမှုများ

- [ ] CSV download link ကို Admin menu တွင် ထည့်ပြီးကြောင်း
- [ ] BOM ပါ UTF-8 CSV ဖြစ်ကြောင်း (Excel ဖြင့် စစ်ဆေးပါ)
- [ ] Import validation errors မှန်ကန်ကြောင်း
- [ ] Large data set ဖြင့် Memory error မဖြစ်ကြောင်း

---

> ➡️ **နောက်တစ်ဆင့်**: [11 - Service Class](/eccube/requirements/customization-list/11_service_class/)
