---
title: "01. Add Product"
description: "> Client Requirement: Admin Dashboard ကနေ ကုန်ပစ္စည်းအသစ်တွေကို နာမည်၊ စျေးနှုန်း၊ စတော့၊ ဓာတ်ပုံ၊ Category တွေ ထည့်သွင်းပြီး Website ပေါ်မှာ ရောင်းချနိုင်အောင"
---

## 01 - Add Product (ကုန်ပစ္စည်း အသစ်ထည့်သွင်းခြင်း)

> **Client Requirement**: "Admin Dashboard ကနေ ကုန်ပစ္စည်းအသစ်တွေကို နာမည်၊ စျေးနှုန်း၊ စတော့၊ ဓာတ်ပုံ၊ Category တွေ ထည့်သွင်းပြီး Website ပေါ်မှာ ရောင်းချနိုင်အောင် လုပ်ဆောင်ပေးပါ။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. ကုန်ပစ္စည်းအသစ် ထည့်သွင်းသည့်အခါ အခြေခံ အချက်အလက်များ (နာမည်၊ စျေးနှုန်း၊ ပုံ၊ Category) ကို လွယ်ကူစွာ ဖြည့်သွင်းလိုခြင်း။
2. အချို့သော Client များသည် **ကုန်ပစ္စည်း Code (SKU) ကို Auto-generate** ပြုလုပ်ပေးရန် တောင်းဆိုကြခြင်း။
3. ကုန်ပစ္စည်းအသစ် ထည့်ပြီးသည်နှင့် ချက်ချင်း မရောင်းသေးဘဲ **Draft (非公開 - Unpublished)** အဖြစ် သိမ်းဆည်းလိုခြင်း။
4. Custom Fields (ဥပမာ- ထုတ်လုပ်သည့် နိုင်ငံ၊ ကုန်ပစ္စည်း အလေးချိန်၊ သက်တမ်းကုန်ဆုံးရက်) များကိုပါ ထည့်သွင်းလိုခြင်း။

---

## 🏛️ EC-CUBE Implementation Architecture

EC-CUBE တွင် ကုန်ပစ္စည်း အသစ်ထည့်သွင်းခြင်း (商品登録) လုပ်ငန်းစဉ်ကို အောက်ပါ Architecture ဖြင့် ဖွဲ့စည်းထားပါသည်:

```
[Browser / Admin UI]
       │
       ▼ (HTTP POST /%eccube_admin_route%/product/product/new)
[ProductEditController::edit()]
       │
       ├─► [ProductType (Symfony Form)] ─── Form Validation (Assert\NotBlank, etc.)
       │
       ├─► [Product Entity & ProductClass Entity] ─── Data Binding & Mapping
       │
       ├─► [ProductImage Entity] ─── Temporary file to permanent storage
       │
       └─► [EntityManagerInterface (Doctrine)]
              │
              ├── BEGIN TRANSACTION
              ├── INSERT INTO dtb_product
              ├── INSERT INTO dtb_product_class (Default class created)
              ├── INSERT INTO dtb_product_stock (Stock initialized)
              ├── INSERT INTO dtb_product_image
              ├── INSERT INTO dtb_product_category
              └── COMMIT TRANSACTION
```

### သက်ဆိုင်ရာ အဓိက ဖိုင်များ:
- **Admin Controller**: `src/Eccube/Controller/Admin/Product/ProductEditController.php`
- **Form Type**: `src/Eccube/Form/Type/Admin/ProductType.php`
- **Main Entity**: `src/Eccube/Entity/Product.php`
- **Variation/Class Entity**: `src/Eccube/Entity/ProductClass.php`
- **Stock Entity**: `src/Eccube/Entity/ProductStock.php`
- **Admin Twig Template**: `src/Eccube/Resource/template/admin/Product/product.twig`

---

## 🗄️ Database Tables & Architecture (Behind the Scenes)

ကုန်ပစ္စည်း ၁ ခု အသစ်ထည့်သွင်းလိုက်ချိန်တွင် Database ဇယားများစွာ၌ အောက်ပါအတိုင်း ဆက်စပ်ပြီး Data ဝင်ရောက်သွားပါသည်:

| Table နာမည် | သိမ်းဆည်းသည့် အချက်အလက် | အဓိက Fields များ |
|:---|:---|:---|
| `dtb_product` | ကုန်ပစ္စည်း အခြေခံ အချက်အလက် | `id`, `name`, `status_id` (公開/非公開), `description_detail`, `free_area` |
| `dtb_product_class` | စျေးနှုန်းနှင့် SKU အချက်အလက် | `id`, `product_id`, `code`, `price01`, `price02`, `stock_unlimited`, `sale_type_id` |
| `dtb_product_stock` | အမှန်တကယ် လက်ကျန် အရေအတွက် | `id`, `product_class_id`, `stock` |
| `dtb_product_image` | ဓာတ်ပုံဖိုင် အမည်များ | `id`, `product_id`, `file_name`, `sort_no` |
| `dtb_product_category`| ရွေးချယ်ထားသော Category များ | `product_id`, `category_id` |

> ⚠️ **အရေးကြီးသော ဗဟုသုတ (EC-CUBE Specific)**:
> EC-CUBE တွင် ကုန်ပစ္စည်းတစ်ခု၌ Color/Size ကဲ့သို့သော Variation (規格) မရှိစေကာမူ **`dtb_product_class` ထဲတွင် Default ProductClass တစ်ခု အမြဲတမ်း ဆောက်ပေးရပါသည်**။ ထို Default Class ထဲတွင် `class_category_id1` နှင့် `class_category_id2` သည် `NULL` ဖြစ်နေမည်ဖြစ်ပြီး၊ စျေးနှုန်း (`price02`) နှင့် စတော့ (`stock`) တို့ကို ထိုနေရာတွင် သိမ်းဆည်းပါသည်။

---

## 📝 အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Step-by-Step Flow)

### အဆင့် ၁: Admin က Menu ဖွင့်လှစ်ခြင်း
Admin အနေဖြင့် **商品管理 (Product Management) ➔ 商品登録 (Add Product)** သို့ သွားရောက်သည့်အခါ Route `admin_product_product_new` ကို ခေါ်ယူပါသည်။

```php
// ProductEditController.php
#[Route('/%eccube_admin_route%/product/product/new', name: 'admin_product_product_new')]
#[Route('/%eccube_admin_route%/product/product/{id}/edit', requirements: ['id' => '\d+'], name: 'admin_product_product_edit')]
public function edit(Request $request, $id = null)
{
    if (is_null($id)) {
        // အသစ်ထည့်ခြင်းဖြစ်ပါက Entity အသစ်တည်ဆောက်ခြင်း
        $Product = new Product();
        $this->productRepository->save($Product); // Default setting များ ချိန်ညှိခြင်း
    } else {
        $Product = $this->productRepository->find($id);
    }
    
    // Symfony Form တည်ဆောက်ခြင်း
    $builder = $this->formFactory->createBuilder(ProductType::class, $Product);
    $form = $builder->getForm();
    $form->handleRequest($request);
    
    if ($form->isSubmitted() && $form->isValid()) {
        // Form Validation အောင်မြင်ပါက DB တွင် သိမ်းဆည်းမည်
        $this->entityManager->persist($Product);
        $this->entityManager->flush();
        
        $this->addSuccess('admin.common.save_complete', 'admin');
        return $this->redirectToRoute('admin_product_product_edit', ['id' => $Product->getId()]);
    }

    return [
        'form' => $form->createView(),
        'Product' => $Product,
    ];
}
```

### အဆင့် ၂: Form Validation စစ်ဆေးခြင်း
`ProductType.php` တွင် သတ်မှတ်ထားသော Rule များကို စစ်ဆေးပါသည်:
- ကုန်ပစ္စည်း အမည် (`name`): NotBlank (မဖြစ်မနေ ဖြည့်ရမည်)
- ရောင်းစျေး (`price02`): Positive Number (သုညထက် ကြီးသော ကိန်းဂဏန်း ဖြစ်ရမည်)
- လက်ကျန် (`stock`): Stock unlimited မဟုတ်ပါက အရေအတွက် ထည့်ရမည်။

### အဆင့် ၃: Default ProductClass နှင့် Stock တည်ဆောက်ခြင်း
စတင်ထည့်သွင်းချိန်တွင် ကုန်ပစ္စည်းသည် Variation မပါသေးသော Single Product ဖြစ်သည့်အတွက်:
1. `ProductClass` အသစ်တစ်ခု ဆောက်သည်။
2. `ProductClass->setPrice02($formPrice)` သတ်မှတ်သည်။
3. `ProductClass->setStockUnlimited($isUnlimited)` စစ်ဆေးသည်။
4. ကန့်သတ်ထားသော စတော့ဖြစ်ပါက `ProductStock` Entity ကို ဆောက်ပြီး `dtb_product_stock` ထဲ ထည့်သွင်းသည်။

### အဆင့် ၄: Doctrine Transaction & Flush
Database ထဲသို့ `EntityManager->flush()` ဖြင့် Data အားလုံးကို Transaction တစ်ခုတည်းဖြင့် ရေးသွင်းသည်။ အမှားတစ်ခုခု ဖြစ်ပေါ်ပါက Rollback ပြုလုပ်ပြီး Error message ပြသသည်။

---

## 💻 Client Customization ဥပမာ (Form Extension ဖြင့် အသစ်ထည့်သွင်းခြင်း)

ဥပမာ- Client က ကုန်ပစ္စည်း အသစ်ထည့်ရာတွင် **ထုတ်လုပ်သည့် နိုင်ငံ (Made In)** field တစ်ခု ထပ်ထည့်ပေးရန် တောင်းဆိုလာပါက:

### ၁။ Form Extension ရေးသားခြင်း (`ProductTypeExtension.php`)
```php
namespace Plugin\ProductCustomField\Form\Extension;

use Eccube\Form\Type\Admin\ProductType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;

class ProductTypeExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [ProductType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('country_of_origin', TextType::class, [
            'label' => 'ထုတ်လုပ်သည့် နိုင်ငံ (Country of Origin)',
            'required' => false,
            'eccube_form_options' => [
                'auto_render' => true, // Twig တွင် auto render ပြုလုပ်ပေးခြင်း
            ],
            'constraints' => [
                new Length(['max' => 100]),
            ],
        ]);
    }
}
```

---

## 💡 Beginner Tips & သတိထားရမည့် အချက်များ

1. **Auto Save Draft မရှိခြင်း**: EC-CUBE Admin သည် အသစ်ထည့်သွင်းနေစဉ် Form ကို Save မနှိပ်ဘဲ Page refresh လုပ်မိပါက ရိုက်ထားသမျှ ပျက်သွားနိုင်ပါသည်။
2. **Category မဖြစ်မနေ ထည့်ရန် လိုအပ်ခြင်း**: Client တော်တော်များများသည် Category မရွေးဘဲ Save လုပ်မိတတ်သဖြင့် Form Customization တွင် Category ကို `NotBlank` constraint ထည့်ပေးလေ့ရှိကြသည်။
3. **Status စစ်ဆေးခြင်း**: အသစ်ထည့်ပြီးနောက် User ဘက် (Front Store) တွင် မပေါ်ပါက ကုန်ပစ္စည်း Status သည် **公開 (Published)** ဖြစ်မဖြစ် အရင်စစ်ဆေးရပါမည်။
