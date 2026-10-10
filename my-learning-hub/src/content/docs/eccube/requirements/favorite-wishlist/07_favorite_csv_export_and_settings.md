---
title: "07. Favorite Csv Export And Settings"
description: "EC-CUBE ၏ Standard CSV Engine ကို အသုံးချ၍ CSV Type အသစ်တစ်ခု ဖန်တီးခြင်း၊ Admin ရှိ CSV 設定 (CSV Settings) တွင် စိတ်ကြိုက် Column များ ထိန်းချုပ်နိုင်အောင် ချိတ"
---

## 07. Favorite CSV Export & CSV Settings (お気に入りCSV出力と設定)

EC-CUBE ၏ Standard CSV Engine ကို အသုံးချ၍ **CSV Type အသစ်တစ်ခု ဖန်တီးခြင်း**၊ Admin ရှိ **CSV 設定 (CSV Settings)** တွင် စိတ်ကြိုက် Column များ ထိန်းချုပ်နိုင်အောင် ချိတ်ဆက်ခြင်းနှင့် **Favorite List စာမျက်နှာမှ CSV Download ထုတ်ယူခြင်း** ဖြစ်ပါသည်။

---

## 🏛️ EC-CUBE ၏ CSV Architecture (CSV အလုပ်လုပ်ပုံ စနစ်)

EC-CUBE တွင် CSV ထုတ်ယူခြင်း စနစ်ကို Database ဇယား ၂ ခုဖြင့် မောင်းနှင်ထားပါသည်:

```
[mtb_csv_type (CSV အမျိုးအစား မာစတာ)]
   ├── ID 1: 商品CSV (Product)
   ├── ID 2: 会員CSV (Customer)
   ├── ID 3: 注文CSV (Order)
   ├── ID 4: 配送CSV (Shipping)
   ├── ID 5: カテゴリCSV (Category)
   └── ID 10: お気に入りCSV (Favorite) ── [NEW CUSTOM CSV TYPE]
              │
              ▼
[dtb_csv (CSV Column ထုတ်ယူမည့် အကွက်များ သတ်မှတ်ချက်)]
   ├── csv_type_id: 10, disp_name: "顧客ID", field_name: "Customer.id"
   ├── csv_type_id: 10, disp_name: "顧客名", field_name: "Customer.name01"
   ├── csv_type_id: 10, disp_name: "商品ID", field_name: "Product.id"
   ├── csv_type_id: 10, disp_name: "商品名", field_name: "Product.name"
   └── csv_type_id: 10, disp_name: "登録日時", field_name: "create_date"
              │
              ▼
[Admin: 設定 > 店舗設定 > CSV設定]
   ဆိုင်ရှင်က Drag & Drop ဖြင့် ကော်လံ အစီအစဉ် ပြောင်းလဲနိုင်သည် / ဖွင့်ပိတ်နိုင်သည် ✅
```

---

## 🛠️ အဆင့် ၁။ CSV Type အသစ် မှတ်ပုံတင်ခြင်း (`mtb_csv_type`)

Doctrine Migration ဖြင့် `mtb_csv_type` တွင် Favorite CSV Type (ID: 10) ကို ထည့်သွင်းပါသည်:

```php
namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260921AddFavoriteCsvType extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // 1. mtb_csv_type ထဲသို့ ID: 10 ဖြင့် ထည့်သွင်းခြင်း
        $this->addSql("
            INSERT INTO mtb_csv_type (id, name, rank, discriminator_type)
            VALUES (10, 'お気に入りCSV', 10, 'csvtype')
            ON DUPLICATE KEY UPDATE name = 'お気に入りCSV'
        ");

        // 2. dtb_csv ထဲသို့ default columns များ ထည့်သွင်းပေးခြင်း
        $columns = [
            ['disp_name' => 'お気に入りID', 'field_name' => 'id', 'sort_no' => 1],
            ['disp_name' => '顧客ID', 'field_name' => 'Customer.id', 'sort_no' => 2],
            ['disp_name' => '顧客氏名', 'field_name' => 'Customer.name01', 'sort_no' => 3],
            ['disp_name' => '顧客メールアドレス', 'field_name' => 'Customer.email', 'sort_no' => 4],
            ['disp_name' => '商品ID', 'field_name' => 'Product.id', 'sort_no' => 5],
            ['disp_name' => '商品名', 'field_name' => 'Product.name', 'sort_no' => 6],
            ['disp_name' => '商品コード', 'field_name' => 'Product.code_min', 'sort_no' => 7],
            ['disp_name' => '販売価格(税込)', 'field_name' => 'Product.price02_inc_tax_min', 'sort_no' => 8],
            ['disp_name' => 'お気に入り登録日時', 'field_name' => 'create_date', 'sort_no' => 9],
        ];

        foreach ($columns as $col) {
            $this->addSql("
                INSERT INTO dtb_csv (csv_type_id, entity_name, field_name, disp_name, sort_no, enabled, create_date, update_date, discriminator_type)
                VALUES (10, 'Eccube\\\\Entity\\\\CustomerFavoriteProduct', '{$col['field_name']}', '{$col['disp_name']}', {$col['sort_no']}, 1, NOW(), NOW(), 'csv')
            ");
        }
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM dtb_csv WHERE csv_type_id = 10");
        $this->addSql("DELETE FROM mtb_csv_type WHERE id = 10");
    }
}
```

> [!TIP]
> ဤ Migration ကို Run ပြီးပါက EC-CUBE Admin ၏ **設定 (Settings) > 店舗設定 (Store Settings) > CSV設定 (CSV Settings)** တွင် "お気に入りCSV" ဟူသော ရွေးချယ်စရာ အသစ် ပေါ်လာမည်ဖြစ်ပြီး၊ ဆိုင်ရှင်သည် လိုအပ်သော ကော်လံများကို အဖွင့်အပိတ်နှင့် နေရာရွှေ့ပြောင်းခြင်းကို မျက်နှာပြင်မှ တိုက်ရိုက် ပြုလုပ်နိုင်သွားမည် ဖြစ်ပါသည်။

---

## 💻 အဆင့် ၂။ Admin Favorite CSV Export Controller တည်ဆောက်ခြင်း

Admin Dashboard မှ ကုန်ပစ္စည်း Favorite ပြုလုပ်ထားသော ဒေတာများကို CSV ဒေါင်းလုဒ် ဆွဲယူနိုင်သည့် Controller ဖြစ်ပါသည်:

`app/Customize/Controller/Admin/FavoriteCsvExportController.php`:

```php
namespace Customize\Controller\Admin;

use Eccube\Controller\AbstractController;
use Eccube\Repository\CsvRepository;
use Eccube\Repository\CustomerFavoriteProductRepository;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class FavoriteCsvExportController extends AbstractController
{
    private const CSV_TYPE_FAVORITE = 10;

    private CsvRepository $csvRepository;
    private CustomerFavoriteProductRepository $favRepository;

    public function __construct(
        CsvRepository $csvRepository,
        CustomerFavoriteProductRepository $favRepository
    ) {
        $this->csvRepository = $csvRepository;
        $this->favRepository = $favRepository;
    }

    /**
     * @Route("/%eccube_admin_route%/product/favorites/export/csv", name="admin_favorite_csv_export")
     * @IsGranted("ROLE_ADMIN")
     */
    public function export(): StreamedResponse
    {
        // ၁။ dtb_csv မှ ဆိုင်ရှင် ဖွင့်ထားသော (enabled = 1) ကော်လံများကို sort_no အတိုင်း ဆွဲထုတ်ခြင်း
        $csvConfigs = $this->csvRepository->findBy(
            ['CsvType' => self::CSV_TYPE_FAVORITE, 'enabled' => true],
            ['sort_no' => 'ASC']
        );

        $response = new StreamedResponse();
        $response->setCallback(function () use ($csvConfigs) {
            $handle = fopen('php://output', 'w');

            // Excel တွင် ဂျပန်စာလုံး မပျက်စီးစေရန် UTF-8 BOM ထည့်သွင်းခြင်း
            fputs($handle, "\xEF\xBB\xBF");

            // CSV Header ထုတ်ယူရေးသားခြင်း
            $headerRow = [];
            foreach ($csvConfigs as $config) {
                $headerRow[] = $config->getDispName();
            }
            fputcsv($handle, $headerRow);

            // ၂။ Favorite ဒေတာများကို Cursor ပုံစံဖြင့် ဆွဲထုတ်ခြင်း
            $qb = $this->favRepository->createQueryBuilder('cfp')
                ->innerJoin('cfp.Customer', 'c')
                ->innerJoin('cfp.Product', 'p')
                ->orderBy('cfp.create_date', 'DESC');

            $results = $qb->getQuery()->toIterable();

            foreach ($results as $fav) {
                $row = [];
                foreach ($csvConfigs as $config) {
                    $row[] = $this->getFieldValue($fav, $config->getFieldName());
                }
                fputcsv($handle, $row);
            }

            fclose($handle);
        });

        $filename = 'favorite_list_' . date('Ymd_His') . '.csv';
        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }

    private function getFieldValue($fav, string $fieldName): string
    {
        $product = $fav->getProduct();
        $customer = $fav->getCustomer();

        return match ($fieldName) {
            'Customer.id' => (string) $customer->getId(),
            'Customer.name01' => $customer->getName01() . ' ' . $customer->getName02(),
            'Customer.email' => $customer->getEmail(),
            'Product.id' => (string) $product->getId(),
            'Product.name' => $product->getName(),
            'Product.code_min' => (string) $product->getCodeMin(),
            'Product.price02_inc_tax_min' => (string) $product->getPrice02IncTaxMin(),
            'create_date' => $fav->getCreateDate()->format('Y-m-d H:i:s'),
            default => '',
        };
    }
}
```

---

## 🛍️ အဆင့် ၃။ Mypage Favorite စာမျက်နှာတွင် CSV Download ခလုတ် ထည့်သွင်းခြင်း

ဖောက်သည်များသည် မိမိ Favorite မှတ်ထားသော ပစ္စည်းစာရင်းကို စာရင်းဇယား CSV ဖိုင်ဖြင့် ဒေါင်းလုဒ်ဆွဲယူလိုကြသည် (အထူးသဖြင့် B2B စတိုးများ သို့မဟုတ် ကုမ္ပဏီသုံး ပစ္စည်းဝယ်ယူရာတွင် အထက်လူကြီးထံ တင်ပြရန် အလွန် အသုံးဝင်ပါသည်)။

### Mypage Controller:
`app/Customize/Controller/Mypage/FavoriteMypageCsvController.php`:

```php
namespace Customize\Controller\Mypage;

use Eccube\Controller\AbstractController;
use Eccube\Repository\CustomerFavoriteProductRepository;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class FavoriteMypageCsvController extends AbstractController
{
    /**
     * @Route("/mypage/favorite/export", name="mypage_favorite_csv_export")
     * @IsGranted("ROLE_USER")
     */
    public function export(CustomerFavoriteProductRepository $favRepo): StreamedResponse
    {
        $customer = $this->getUser();
        $favorites = $favRepo->findBy(['Customer' => $customer], ['create_date' => 'DESC']);

        $response = new StreamedResponse();
        $response->setCallback(function () use ($favorites) {
            $handle = fopen('php://output', 'w');
            fputs($handle, "\xEF\xBB\xBF"); // UTF-8 BOM

            // Customer အတွက် ရိုးရှင်းသော Header
            fputcsv($handle, ['商品コード', '商品名', '販売価格(税込)', 'お気に入り登録日', '商品URL']);

            foreach ($favorites as $fav) {
                $product = $fav->getProduct();
                fputcsv($handle, [
                    $product->getCodeMin(),
                    $product->getName(),
                    $product->getPrice02IncTaxMin(),
                    $fav->getCreateDate()->format('Y/m/d'),
                    'https://your-store.com/products/detail/' . $product->getId(),
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="my_wishlist.csv"');

        return $response;
    }
}
```

---

### Twig Template တွင် ခလုတ်ထည့်သွင်းခြင်း:
`template/default/Mypage/favorite.twig`:

```twig
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>お気に入り一覧 (Wishlist)</h2>
    
    {# CSV Export ခလုတ် #}
    <a href="{{ url('mypage_favorite_csv_export') }}" class="btn btn-outline-success">
        <i class="fa fa-download"></i> お気に入りリストをCSV出力
    </a>
</div>
```

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **CSV設定 (CSV Settei)**: CSV Column Export Configuration
- **CSV種別 (CSV Shubetsu)**: CSV Type (e.g. 商品CSV, 注文CSV, お気に入りCSV)
- **文字化け防止 (Mojibake Boushi)**: Preventing Garbled Japanese Text in Excel (UTF-8 BOM / Shift-JIS)
- **ストリーム配信 (StreamedResponse)**: Streamed CSV Download without Memory Exhaustion
