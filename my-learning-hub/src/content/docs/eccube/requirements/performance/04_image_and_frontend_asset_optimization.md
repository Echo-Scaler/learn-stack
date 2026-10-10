---
title: "04. Image And Frontend Asset Optimization"
description: "E-Commerce ဆိုက်များတွင် ဒေတာပမာဏ (Page Weight) ၏ ၇၀% ကျော်သည် ကုန်ပစ္စည်း ဓာတ်ပုံများ ဖြစ်ကြသည်။ ဆိုင်ရှင်များက မူရင်း 5MB သို့မဟုတ် 10MB အရွယ်အစားရှိသော ဓာတ်ပ"
---

## 04. Image & Frontend Asset Optimization (画像最適化と高速化)

E-Commerce ဆိုက်များတွင် ဒေတာပမာဏ (Page Weight) ၏ ၇၀% ကျော်သည် ကုန်ပစ္စည်း ဓာတ်ပုံများ ဖြစ်ကြသည်။ ဆိုင်ရှင်များက မူရင်း 5MB သို့မဟုတ် 10MB အရွယ်အစားရှိသော ဓာတ်ပုံကြီးများကို တင်လိုက်သည့်အခါ ဖုန်းဖြင့် ဝင်ရောက်ကြည့်ရှုသူများအတွက် ဆိုက်အလွန် လေးလံသွားတတ်ပါသည်။

---

## 🖼️ WebP ပုံစံသို့ ပြောင်းလဲခြင်း (Next-Gen Image Format)

WebP သည် Google မှ ဖန်တီးထားသော ခေတ်မီ ရုပ်ပုံဖော်မတ်ဖြစ်ပြီး သမားရိုးကျ JPEG သို့မဟုတ် PNG များထက် **၆၀% မှ ၈၀% အထိ ဖိုင်အရွယ်အစား သေးငယ်သည်**။ အရည်အသွေး (Quality) မှာလည်း မူရင်းအတိုင်း ကြည်လင်ပြတ်သားစွာ ကျန်ရှိနေပါသည်။

### `<picture>` Tag ဖြင့် WebP ကို Browser Support အလိုက် ပြသခြင်း:
အကယ်၍ Browser အဟောင်းများတွင် WebP မပံ့ပိုးပါက မူရင်း JPG ကို အလိုအလျောက် အစားထိုးပြသပေးရန် Twig Template တွင် ရေးသားနည်း:

```twig
<picture>
    {# WebP ကို ပံ့ပိုးသော Browser များအတွက် WebP ပြသမည် #}
    <source srcset="{{ asset(Product.ProductImage[0].file_name ~ '.webp', 'save_image') }}" type="image/webp">
    
    {# မပံ့ပိုးသော Browser များအတွက် မူရင်း JPG/PNG ပြသမည် #}
    <img src="{{ asset(Product.ProductImage[0].file_name, 'save_image') }}" 
         alt="{{ Product.name }}" 
         loading="lazy" 
         width="300" 
         height="300" 
         class="ec-product-img">
</picture>
```

---

## ⏳ Native Lazy Loading (လိုအပ်မှ ပုံရိပ်များကို ဆွဲတင်ခြင်း)

စာမျက်နှာတစ်ခုတွင် ပစ္စည်းအခု ၅၀ ရှိပါက အပေါ်ဆုံး မျက်နှာပြင်တွင် မမြင်ရသေးသော အောက်ဘက်ရှိ ဓာတ်ပုံ ၄၀ ကျော်ကို စတင်ဖွင့်ချိန်တွင် ဒေါင်းလုဒ် မဆွဲစေဘဲ၊ User က Scroll ဆွဲချလာမှသာ ပုံများကို ဆွဲတင်စေရန် `loading="lazy"` attribute ကို ထည့်သွင်းရပါသည်:

```html
<!-- Native Lazy Loading (JavaScript Library မလိုဘဲ Browser မှ တိုက်ရိုက်လုပ်ဆောင်သည်) -->
<img src="product.jpg" loading="lazy" width="300" height="300" alt="Product Name">
```

> [!IMPORTANT]
> ပုံရိပ်များတွင် `width` နှင့် `height` ကို အမြဲတမ်း တိကျစွာ ထည့်သွင်းပေးရပါမည်။ သို့မှသာ ပုံပေါ်မလာမီ စာမျက်နှာ ခုန်လှုပ်သွားခြင်း (**CLS - Cumulative Layout Shift**) ကို ကာကွယ်နိုင်ပြီး Google SEO ရမှတ် (Core Web Vitals) မြင့်တက်လာပါမည်။

---

## 🛠️ Admin တွင် ဓာတ်ပုံတင်ချိန်၌ အလိုအလျောက် အရွယ်အစား ချုံ့ပေးခြင်း (Thumbnail Resizing)

Admin မှ 4000x3000px အရွယ်အစားရှိသော ဓာတ်ပုံကြီး တင်လိုက်သည့်အခါ PHP ၏ GD / Imagick ဖြင့် စတိုးဆိုင်တွင် အသုံးပြုမည့် အရွယ်အစား ၃ မျိုးသို့ အလိုအလျောက် ချုံ့ပေးသော Service နမူနာ:

```php
namespace Customize\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageOptimizationService
{
    private string $imageDir;

    public function __construct(string $imageDir)
    {
        $this->imageDir = $imageDir;
    }

    /**
     * Upload လုပ်လိုက်သော ဓာတ်ပုံကို WebP သို့ ပြောင်းလဲပြီး Thumbnail အရွယ်အစား ၃ မျိုး ထုတ်လုပ်ပေးခြင်း
     */
    public function optimizeAndSave(UploadedFile $file, string $filename): void
    {
        $sourcePath = $file->getPathname();
        $sourceImage = imagecreatefromstring(file_get_contents($sourcePath));
        if (!$sourceImage) {
            return;
        }

        // မူရင်း အရွယ်အစားကို အမြင့်ဆုံး 1200px အထိသာ ကန့်သတ်ခြင်း
        $this->resizeAndSaveWebp($sourceImage, $this->imageDir . '/' . $filename . '.webp', 1200);

        // ကုန်ပစ္စည်း စာရင်းအတွက် 400px Thumbnail ထုတ်လုပ်ခြင်း
        $this->resizeAndSaveWebp($sourceImage, $this->imageDir . '/thumb_' . $filename . '.webp', 400);

        imagedestroy($sourceImage);
    }

    private function resizeAndSaveWebp($image, string $targetPath, int $maxWidth): void
    {
        $origWidth = imagesx($image);
        $origHeight = imagesy($image);

        if ($origWidth > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int) ($origHeight * ($maxWidth / $origWidth));
        } else {
            $newWidth = $origWidth;
            $newHeight = $origHeight;
        }

        $resized = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

        // WebP ဖော်မတ်ဖြင့် Quality 80% ဖြင့် သိမ်းဆည်းခြင်း (အရွယ်အစား အလွန်သေးငယ်သည်)
        imagewebp($resized, $targetPath, 80);
        imagedestroy($resized);
    }
}
```

---

## ⚡ Web Server (Nginx) Caching & Gzip Compression

Web Server configuration တွင် CSS, JS နှင့် Image များအတွက် Browser Cache သတ်မှတ်ပေးခြင်းဖြင့် ဒုတိယအကြိမ် ဝင်ရောက်သူများအတွက် စာမျက်နှာသည် **မျက်စိတစ်မှိတ်အတွင်း (Instant Load)** ပွင့်လာစေပါသည်:

```nginx
# Nginx Configuration (/etc/nginx/conf.d/eccube.conf)
location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, no-transform, immutable";
    access_log off;
    
    # Gzip Compression ဖွင့်လှစ်ခြင်း
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```
