---
title: "04. File Upload Validation And Session Security"
description: "ဆာဗာတစ်ခုလုံးကို Hacker က ထိန်းချုပ်ခွင့်ရသွားစေနိုင်သော Malicious File Upload (Web Shell) အန္တရာယ်နှင့် Session Security (Cookie လုံခြုံရေး) ကာကွယ်နည်းများ ဖြစ"
---

## 04. File Upload & Session Security (ファイル検証とセッション管理)

ဆာဗာတစ်ခုလုံးကို Hacker က ထိန်းချုပ်ခွင့်ရသွားစေနိုင်သော **Malicious File Upload (Web Shell)** အန္တရာယ်နှင့် **Session Security (Cookie လုံခြုံရေး)** ကာကွယ်နည်းများ ဖြစ်ပါသည်။

---

## 💣 File Upload တိုက်ခိုက်မှု အန္တရာယ် (Remote Code Execution)

အသုံးပြုသူများအား ဓာတ်ပုံ သို့မဟုတ် PDF ဖိုင် တင်ခွင့်ပြုရာတွင် စနစ်တကျ စိစစ်ခြင်းမရှိပါက:
1. Hacker သည် PHP ကုဒ်များ ပါဝင်သော ဖိုင် (`shell.php` သို့မဟုတ် `avatar.php.jpg`) ကို Upload တင်လိုက်သည်။
2. ထို့နောက် Browser မှတစ်ဆင့် `https://your-store.com/upload/save_image/shell.php` သို့ လှမ်းဖွင့်လိုက်သည့်အခါ ဆာဗာသည် ထို PHP Script ကို Run ပေးလိုက်သည်။
3. ရလဒ်အနေဖြင့် Hacker သည် ဆာဗာ၏ `.env` ဖိုင်၊ Database Password များနှင့် ဖောက်သည် ဒေတာအားလုံးကို အလွယ်တကူ ခိုးယူဖျက်ဆီးသွားနိုင်ပါသည်။

---

## 🛡️ File Upload လုံခြုံရေး အလွှာ ၄ ခု (Multi-Layer Defense)

### ၁။ Extension သာမက MIME Type & Magic Bytes စစ်ဆေးခြင်း:
Client ဘက်မှ ပို့လိုက်သော `$_FILES['file']['type']` သည် Hacker ဘက်မှ လိမ်လည်သတ်မှတ်နိုင်သဖြင့် **လုံးဝ မယုံကြည်ရပါ**။ ဆာဗာဘက်မှ ဖိုင်၏ အတွင်းပိုင်း **Magic Bytes** ကို စစ်ဆေးရပါသည်:

```php
namespace Customize\Validator;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileSecurityValidator
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    public function validateImage(UploadedFile $file): string
    {
        // ၁။ File အရွယ်အစား စစ်ဆေးခြင်း (အမြင့်ဆုံး 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new \InvalidArgumentException('File size exceeds 5MB limit.');
        }

        // ၂။ ဆာဗာ၏ finfo ဖြင့် စစ်မှန်သော Mime Type (Magic Bytes) ကို စစ်ဆေးခြင်း
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $realMimeType = $finfo->file($file->getPathname());

        if (!array_key_exists($realMimeType, self::ALLOWED_MIME_TYPES)) {
            throw new \InvalidArgumentException('Invalid file type. Only JPG, PNG, and WebP are allowed.');
        }

        return self::ALLOWED_MIME_TYPES[$realMimeType];
    }
}
```

---

### ၂။ မူရင်း ဖိုင်အမည်ကို အသုံးမပြုဘဲ Random Hash နာမည် အသစ်ပြောင်းလဲခြင်း:
User ပေးလိုက်သော နာမည် (`../../shell.php` စသည်) ကို လုံးဝ မသုံးရပါ။ Cryptographically Secure Random String ဖြင့် အမည်ပြောင်းလဲရပါသည်:

```php
// ✅ လုံခြုံသော ဖိုင်အမည်သစ် သတ်မှတ်ခြင်း (ဥပမာ: 4a8b7f2e1c9d0a.webp)
$newFilename = bin2hex(random_bytes(16)) . '.' . $extension;
$file->move($uploadDirectory, $newFilename);
```

---

### ၃။ Upload Folder အတွင်း PHP Execution ကို ပိတ်ပင်ခြင်း (Web Server Hardening):
အရေးကြီးဆုံး အကာအကွယ်မှာ Upload သိမ်းဆည်းသည့် ဖိုင်တွဲအတွင်း မည်သည့် `.php` ဖိုင်မျှ Run ခွင့်မရှိစေရန် Nginx / Apache တွင် ပိတ်ထားခြင်း ဖြစ်သည်:

#### Nginx Configuration:
```nginx
# html/upload ဖိုင်တွဲအတွင်း php script များ run ခွင့် လုံးဝ ပိတ်ခြင်း
location ^~ /html/upload/ {
    location ~ \.(php|phtml|phar)$ {
        deny all;
        return 404;
    }
}
```

---

## 🍪 Session Security & Cookie Protection

Hacker များက အသုံးပြုသူ၏ Session Cookie ကို ခိုးယူခြင်း (**Session Hijacking**) သို့မဟုတ် မတရား သွင်းယူခြင်း (**Session Fixation**) မှ ကာကွယ်ရန်:

### Symfony ၏ Session Regeneration:
Login အောင်မြင်သည့်အခါတိုင်း Symfony သည် မူလ Session ID အဟောင်းကို စွန့်ပစ်ပြီး ID အသစ်တစ်ခု ချက်ချင်း ပြောင်းလဲထုတ်ပေးပါသည် (`$session->migrate(true)`)။

---

### မဖြစ်မနေ ထည့်သွင်းရမည့် Cookie လုံခြုံရေး Flags:
`config/packages/framework.yaml` တွင် အောက်ပါအတိုင်း သတ်မှတ်ထားရပါသည်:

```yaml
framework:
    session:
        cookie_httponly: true # 1. JavaScript ဖြင့် document.cookie ဖတ်ခွင့် ပိတ်ခြင်း (XSS Cookie Theft ကာကွယ်သည်)
        cookie_secure: auto   # 2. HTTPS ချိတ်ဆက်မှုမှသာ Cookie ပို့ဆောင်ခွင့်ပြုခြင်း
        cookie_samesite: lax  # 3. ပြင်ပဆိုက်မှ ခိုးယူခေါ်ဆိုမှုများတွင် Cookie မပါသွားစေရန် ကာကွယ်ခြင်း (CSRF)
        gc_maxlifetime: 3600  # 4. အသုံးမပြုဘဲ ၁ နာရီ ကြာပါက Session အလိုအလျောက် သက်တမ်းကုန်စေခြင်း
```

ဤနည်းစနစ်များဖြင့် သင်၏ EC-CUBE စနစ်သည် ဖိုင်တင်သွင်းမှုနှင့် အသုံးပြုသူ Session များအတွက် အမြင့်မားဆုံး လုံခြုံမှုကို ရရှိစေမည် ဖြစ်ပါသည်။
