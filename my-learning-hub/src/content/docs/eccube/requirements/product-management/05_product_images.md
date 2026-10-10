---
title: "05. Product Images"
description: "> Client Requirement: ကုန်ပစ္စည်းတစ်ခုချင်းစီအတွက် ပင်မဓာတ်ပုံ (Main Image) နှင့် အသေးစိတ်ပုံများ (Sub Images/Gallery Slider) ကို စိတ်ကြိုက် တင်နိုင်ရမည်။ ဓာတ်"
---

## 05 - Product Images (ကုန်ပစ္စည်း ဓာတ်ပုံများ စီမံခြင်း)

> **Client Requirement**: "ကုန်ပစ္စည်းတစ်ခုချင်းစီအတွက် ပင်မဓာတ်ပုံ (Main Image) နှင့် အသေးစိတ်ပုံများ (Sub Images/Gallery Slider) ကို စိတ်ကြိုက် တင်နိုင်ရမည်။ ဓာတ်ပုံများ၏ ရှေ့နောက် အစီအစဉ် (Sort Order) ကို Mouse ဖြင့် Drag & Drop ဆွဲရွှေ့နိုင်ရမည်။"

---

## 🎯 Client က အများဆုံး တောင်းဆိုလေ့ရှိသော အချက်များ

1. **ဓာတ်ပုံ အရေအတွက်**: ကုန်ပစ္စည်းတစ်ခုလျှင် အနည်းဆုံး ၅ ပုံမှ ၁၀ ပုံအထိ တင်နိုင်ရန်။
2. **အစီအစဉ် ပြောင်းလဲခြင်း**: ပထမဆုံးပုံ (Main Image) သည် ကုန်ပစ္စည်းစာရင်း (Product List) တွင် ပေါ်ရမည်ဖြစ်ပြီး ကျန်ပုံများကို Detail စာမျက်နှာတွင် Slider ဖြင့် ပြသလိုခြင်း။
3. **ဓာတ်ပုံဖျက်ခြင်းနှင့် အစားထိုးခြင်း**: မလိုချင်သော ပုံဟောင်းများကို ချက်ချင်း ဖျက်ပစ်နိုင်ခြင်း။
4. **ဖိုင်အရွယ်အစားနှင့် Format**: JPG, PNG အပြင် ခေတ်မီ WebP Format များကို လက်ခံနိုင်ပြီး ကြီးမားသော File Size များကို ကန့်သတ်ပေးရန်။

---

## 🏛️ EC-CUBE Implementation Architecture: Upload Flow

EC-CUBE တွင် ဓာတ်ပုံတင်ခြင်း လုပ်ငန်းစဉ်သည် **2-Step Upload Mechanism** (AJAX Temporary Upload ➔ Permanent Save) ဖြင့် အလုပ်လုပ်ပါသည်:

```
[Admin UI File Select]
         │
         ▼ 1. AJAX Request (အကြိုတင်ခြင်း)
[ProductEditController::imageAdd()]
         │
         ├── File Validation (MimeType, File Size)
         ├── Generate Random File Name (e.g. 09210045_65fc12a.jpg)
         └── Save into: /html/upload/temp_image/
         │
         ▼ 2. Browser UI တွင် Thumbnail Preview ပြသထားခြင်း
[Admin clicks "Save" (登録) Button]
         │
         ▼ 3. Final Form Submission
[ProductEditController::edit()]
         │
         ├── File ကို /html/upload/temp_image/ မှ
         │           /html/upload/save_image/ သို့ Move လုပ်ခြင်း
         │
         └── INSERT INTO dtb_product_image (product_id, file_name, sort_no)
```

### ဖိုင်တွဲ တည်ဆောက်ပုံ လမ်းကြောင်းများ:
- **Temporary Uploads**: `public/html/upload/temp_image/` (ယာယီပုံများ)
- **Permanent Storage**: `public/html/upload/save_image/` (တကယ့်အသုံးပြုသော ပုံများ)
- **Entity Class**: `src/Eccube/Entity/ProductImage.php`
- **Database Table**: `dtb_product_image`

---

## 🗄️ Database Schema (`dtb_product_image`)

```sql
CREATE TABLE dtb_product_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,               -- ကုန်ပစ္စည်း ID (FK)
    file_name VARCHAR(255) NOT NULL,       -- သိမ်းဆည်းထားသော ဖိုင်အမည် (e.g. 05211045_abc.jpg)
    sort_no INT NOT NULL,                  -- အစီအစဉ် (အငယ်ဆုံး နံပါတ်သည် Main Image ဖြစ်သည်)
    create_date DATETIME NOT NULL,
    discriminator_type VARCHAR(255) NOT NULL,
    CONSTRAINT FK_PRODUCT_IMAGE FOREIGN KEY (product_id) REFERENCES dtb_product (id) ON DELETE CASCADE
);
```

> 💡 **Main Image မည်သို့ သတ်မှတ်သနည်း?**  
> EC-CUBE တွင် Main Image ဟူ၍ သီးသန့် boolean field မရှိပါ။ `sort_no` နံပါတ် အငယ်ဆုံး (ပုံမှန်အားဖြင့် index `0` သို့မဟုတ် `1`) ပုံကို Main Image အဖြစ် အလိုအလျောက် သတ်မှတ်ပါသည်။

---

## 📝 အဆင့်ဆင့် အလုပ်လုပ်ပုံ (Step-by-Step Flow)

### အဆင့် ၁: AJAX Upload ပြုလုပ်ခြင်း (`imageAdd`)
Admin စာမျက်နှာတွင် ပုံဆွဲထည့်လိုက်သည်နှင့် Controller သို့ File ရောက်ရှိသွားပါသည်:

```php
// ProductEditController.php
public function imageAdd(Request $request)
{
    $images = $request->files->get('admin_product');
    $file = $images['images'][0];

    // လုံခြုံစိတ်ချရသော ဖိုင်အမည် အသစ် သတ်မှတ်ခြင်း
    $extension = $file->getClientOriginalExtension();
    $filename = date('mdHis').'_'.uniqid().'.'.$extension;

    // ယာယီ ဖိုင်တွဲထဲသို့ သိမ်းဆည်းခြင်း
    $file->move($this->eccubeConfig['eccube_temp_image_dir'], $filename);

    return $this->json(['filename' => $filename]);
}
```

### အဆင့် ၂: Form Submission တွင် ယာယီမှ အမြဲတမ်းသို့ ရွှေ့ခြင်း
Admin က "Save" နှိပ်လိုက်သောအခါ:

```php
// Form မှ ဖိုင်အမည်များ စာရင်းကို ယူခြင်း
$images = $form->get('images')->getData();

foreach ($images as $sortNo => $filename) {
    // ယာယီ ဖိုင်လမ်းကြောင်း
    $tempPath = $this->eccubeConfig['eccube_temp_image_dir'].'/'.$filename;
    // အမြဲတမ်း ဖိုင်လမ်းကြောင်း
    $savePath = $this->eccubeConfig['eccube_save_image_dir'].'/'.$filename;

    if (file_exists($tempPath)) {
        rename($tempPath, $savePath); // ဖိုင်ကို အပြီးသတ် ဖိုင်တွဲသို့ ရွှေ့ပြောင်းခြင်း
    }

    // ProductImage Entity အသစ် တည်ဆောက်ခြင်း
    $ProductImage = new ProductImage();
    $ProductImage->setFileName($filename);
    $ProductImage->setSortNo($sortNo);
    $ProductImage->setProduct($Product);

    $this->entityManager->persist($ProductImage);
}
```

---

## 🎨 Twig Template တွင် ဓာတ်ပုံများ ဖော်ပြပုံ

### ၁။ ကုန်ပစ္စည်း စာရင်းတွင် Main Image ပြသခြင်း (`Product/list.twig`)
```twig
{# ကုန်ပစ္စည်း၏ ပထမဆုံး ပုံကို ဆွဲထုတ်ပြသခြင်း #}
<div class="product-item__image">
    <a href="{{ url('product_detail', {'id': Product.id}) }}">
        {% if Product.ProductImage|length > 0 %}
            <img src="{{ asset(Product.ProductImage[0].file_name, 'save_image') }}" alt="{{ Product.name }}">
        {% else %}
            {# ပုံမရှိပါက No Image ပုံ ပုံသေ ပြသခြင်း #}
            <img src="{{ asset('assets/img/common/no_image_product.png') }}" alt="{{ Product.name }}">
        {% endif %}
    </a>
</div>
```

### ၂။ ကုန်ပစ္စည်း အသေးစိတ်တွင် Gallery Slider ပြသခြင်း (`Product/detail.twig`)
```twig
{# ပုံအားလုံးကို Carousel / Swiper ဖြင့် လှည့်ပြသခြင်း #}
<div class="swiper-wrapper">
    {% for ProductImage in Product.ProductImage %}
        <div class="swiper-slide">
            <img src="{{ asset(ProductImage.file_name, 'save_image') }}" alt="{{ Product.name }}">
        </div>
    {% endfor %}
</div>
```

---

## ⚡ Client တောင်းဆိုလေ့ရှိသော Customization: S3/Cloud Storage ချိတ်ဆက်ခြင်း

EC-CUBE Standard သည် Local Storage (`public/html/upload/save_image/`) ပေါ်တွင်သာ သိမ်းဆည်းလေ့ရှိသည်။ သို့သော် Auto-scaling သို့မဟုတ် Cloud Server (AWS, GCP) သုံးသော Client များအတွက်:
- **Flysystem Bundle** သို့မဟုတ် **AWS S3 Plugin** အသုံးပြု၍ ဖိုင်များကို Amazon S3 Bucket သို့ တိုက်ရိုက် Upload တင်စေရန် Customize ပြုလုပ်ပေးရပါသည်။

---

## 🇯🇵 သက်ဆိုင်ရာ ဂျပန် ဝေါဟာရများ

- **商品画像 (Shouhin Gazou)**: Product Image (ကုန်ပစ္စည်း ဓာတ်ပုံ)
- **メイン画像 (Mein Gazou)**: Main Image (ပင်မ ဓာတ်ပုံ)
- **サブ画像 (Sabu Gazou)**: Sub / Gallery Image (အသေးစိတ် နောက်ခံပုံများ)
- **並び順 (Narabi-jun)**: Sort Order (ဓာတ်ပုံများ ပြသသည့် အစီအစဉ်)
- **一時保存 (Ichiji Hozon)**: Temporary Storage (ယာယီ သိမ်းဆည်းခြင်း)
