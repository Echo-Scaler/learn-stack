---
title: "09. File Storage and Uploads"
description: "1. [Laravel Filesystem Abstraction ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-laravel-filesystem-abstraction-ဆိုတာဘာလဲ)"
---

## 📁 သင်ခန်းစာ (၉) - File Storage နှင့် File Uploads စနစ်
### (Lesson 9: Laravel Filesystem, Public Disks, Storage Symlink & Cloud S3)

---

## 📌 မာတိကာ (Contents)
1. [Laravel Filesystem Abstraction ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-laravel-filesystem-abstraction-ဆိုတာဘာလဲ)
2. [Storage Disks အမျိုးအစားများ (`local`, `public`, `s3`)](#၂-storage-disks-အမျိုးအစားများ)
3. [`php artisan storage:link` ဘာကြောင့် run ရသလဲ? အားသာချက်များ](#၃-php-artisan-storagelink-ဘာကြောင့်-run-ရသလဲ)
4. [File Uploads ပြုလုပ်ခြင်းနှင့် လုံခြုံရေး Validation စစ်ဆေးခြင်း](#၄-file-uploads-ပြုလုပ်ခြင်းနှင့်-လုံခြုံရေး-validation)
5. [ဖိုင်များ ဖတ်ယူခြင်း၊ ပြသခြင်းနှင့် ဖျက်ပစ်ခြင်း](#၅-ဖိုင်များ-ဖတ်ယူခြင်း-ပြသခြင်းနှင့်-ဖျက်ပစ်ခြင်း)
6. [Profile Avatar ပြင်ဆင်ခြင်း လက်တွေ့ Code နမူနာ (Old File Auto Delete)](#၆-profile-avatar-ပြင်ဆင်ခြင်း-လက်တွေ့-code-နမူနာ)

---

## ၁။ Laravel Filesystem Abstraction ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
Laravel သည် **Flysystem** PHP Library ကို အသုံးပြုထားသောကြောင့် File စီမံခန့်ခွဲမှု (ဖိုင်သိမ်းခြင်း၊ ဖတ်ခြင်း၊ ဖျက်ခြင်း) ကို Disk အမျိုးအစား မည်သို့ပင်ဖြစ်စေ ကုဒ်တစ်မျိုးတည်းဖြင့် လွယ်ကူစွာ လုပ်ဆောင်နိုင်စေသော စနစ်ဖြစ်သည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
Pure PHP တွင် Local Hard Drive ပေါ်သို့ ဖိုင်သိမ်းရန် `move_uploaded_file()` ရေးရပြီး နောက်ပိုင်းတွင် AWS S3 Cloud သို့ ပြောင်းလိုပါက ကုဒ်များအားလုံးကို အသစ်ပြန်ရေးရသည်။ Laravel Filesystem သုံးထားပါက `.env` ဖိုင်မှ Driver အမည် ပြောင်းရုံဖြင့် အလိုအလျောက် အဆင်ပြေစေသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Write Once, Store Anywhere**: ကုဒ်မပြောင်းဘဲ Local, Public, FTP, Amazon S3 သို့ ဖိုင်များ သိမ်းနိုင်သည်။
* **Stream Performance**: ကြီးမားသောဖိုင်များကို Server RAM မတက်စေဘဲ Stream ပုံစံဖြင့် ကိုင်တွယ်နိုင်သည်။

---

## ၂။ Storage Disks အမျိုးအစားများ

* **`local` Disk** (`storage/app/private`): ပြင်ပ Browser မှ တိုက်ရိုက် ကြည့်ခွင့်မပေးလိုသော လျှို့ဝှက်ဖိုင်များ (Invoices, စာချုပ်များ) သိမ်းရန်။
* **`public` Disk** (`storage/app/public`): အများပြည်သူ ကြည့်ရှုနိုင်သော ဖိုင်များ (Avatars, Product ပုံများ) သိမ်းရန်။
* **`s3` Disk** (Amazon S3): Server Disk ပြည့်မသွားစေရန် Cloud ပေါ် သိမ်းရန်။

---

## ၃။ `php artisan storage:link` ဘာကြောင့် run ရသလဲ?

### (က) ဘာကြောင့် မဖြစ်မနေ run ရသလဲ?
Web Server ၏ Document Root သည် `public/` directory သာ ဖြစ်သောကြောင့် `storage/` directory ထဲရှိ ဖိုင်များကို Browser က တိုက်ရိုက် မလှမ်းနိုင်ပါ။

### (ခ) အားသာချက်:
`storage/app/public` folder ကို `public/storage` အဖြစ် ချိတ်ဆက်ပေးသော **Symbolic Link (Shortcut)** ဖန်တီးပေးပြီး Browser မှ ပုံများကို တိုက်ရိုက် ကြည့်ရှုခွင့် ရရှိစေသည်။

```bash
php artisan storage:link
```

---

## ၄။ File Uploads ပြုလုပ်ခြင်းနှင့် လုံခြုံရေး Validation

### ⚠️ ဘာကြောင့် Validation တင်းကြပ်စွာ စစ်ရသလဲ?
Hacker များက PHP Shell Script ကို ပုံအယောင်ဆောင် တင်ပြီး Server ကို အပိုင်စီးခြင်းမှ ကာကွယ်ရန် ဖြစ်သည်။

```php
$request->validate([
    'avatar' => [
        'required',
        'file',
        'image',                           // File MIME Type အစစ် ဟုတ်/မဟုတ် စစ်သည်
        'mimes:jpeg,png,jpg,webp',         // Extension ကန့်သတ်ခြင်း
        'max:2048',                        // 2MB (2048 KB) ထက် မကျော်ရ
    ],
]);
```

---

## ၅။ ဖိုင်များ ဖတ်ယူခြင်း၊ ပြသခြင်းနှင့် ဖျက်ပစ်ခြင်း

```php
use Illuminate\Support\Facades\Storage;

// ၁။ ဖိုင်ကို အလိုအလျောက် Unique Hash အမည်ပေး၍ သိမ်းခြင်း
$path = $request->file('avatar')->store('avatars', 'public');

// ၂။ ဖိုင် ရှိမရှိ စစ်ဆေးခြင်း
if (Storage::disk('public')->exists($path)) {
    // ဖိုင် တည်ရှိသည်
}

// ၃။ ဖိုင်ကို ပြန်ဖျက်ခြင်း
Storage::disk('public')->delete($path);

// ၄။ Public URL ရယူခြင်း
$url = Storage::url($path); // /storage/avatars/xyz.jpg
```

---

## ၆။ Profile Avatar ပြင်ဆင်ခြင်း လက်တွေ့ Code နမူနာ

ပုံအသစ် တင်တိုင်း ပုံဟောင်းကို Server ပေါ်မှ auto ဖျက်ပေးမည့် စနစ်:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // ၁။ ပုံဟောင်း ရှိပါက Server ပေါ်မှ အရင်ဖျက်ပစ်မည် (Disk မပြည့်စေရန်)
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // ၂။ ပုံအသစ်ကို public storage သို့ သိမ်းမည်
            $path = $request->file('avatar')->store('avatars', 'public');

            // ၃။ Database ထဲတွင် Path အသစ်ကို update လုပ်မည်
            $user->update(['avatar' => $path]);
        }

        return back()->with('success', 'Profile ပုံ ပြောင်းလဲပြီးပါပြီ!');
    }
}
```
