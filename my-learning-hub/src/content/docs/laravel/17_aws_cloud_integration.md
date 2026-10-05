---
title: "17. AWS Cloud Integration"
description: "1. [Enterprise Laravel တွင် AWS Cloud ကို ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?](#၁-aws-cloud-ကို-ဘာကြောင့်-မဖြစ်မနေ-သုံးရသလဲ)"
---

## ☁️ သင်ခန်းစာ (၁၇) - AWS Cloud Features အသုံးချခြင်း (S3, SES, SQS & CloudFront)
### (Lesson 17: Enterprise AWS Integration, S3 Secure Uploads, Pre-Signed URLs, SES Mail & SQS Queues)

---

## 📌 မာတိကာ (Contents)
1. [Enterprise Laravel တွင် AWS Cloud ကို ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?](#၁-aws-cloud-ကို-ဘာကြောင့်-မဖြစ်မနေ-သုံးရသလဲ)
2. [AWS IAM Setup, Permissions နှင့် `.env` အပြည့်အစုံ](#၂-aws-iam-setup-permissions-နှင့်-env)
3. [AWS S3 File Storage ချိတ်ဆက်ခြင်းနှင့် အခြေခံ File Operations](#၃-aws-s3-file-storage-ချိတ်ဆက်ခြင်း)
4. [Public Assets vs Private Documents သိမ်းဆည်းခြင်း](#၄-public-assets-vs-private-documents)
5. [လုံခြုံစိတ်ချရသော Pre-Signed Download URLs (သက်တမ်းကန့်သတ် လင့်ခ်များ)](#၅-pre-signed-download-urls)
6. [Direct-to-S3 Upload (Server Memory မကုန်ဘဲ Browser မှ S3 သို့ တိုက်ရိုက်တင်ခြင်း)](#၆-direct-to-s3-upload)
7. [AWS SES (Simple Email Service) ဖြင့် သန်းချီသော အီးမေးလ်များ ပို့ဆောင်ခြင်း](#၇-aws-ses-ဖြင့်-အီးမေးလ်များ-ပို့ဆောင်ခြင်း)
   - [SES Sandbox vs Production Access](#၇၁-ses-sandbox-vs-production-access)
   - [DKIM, SPF & DMARC ဖြင့် Spam Folder မရောက်အောင် ပြုလုပ်ခြင်း](#၇၂-dkim-spf--dmarc)
   - [Bounce & Complaint Handling (SNS Webhook)](#၇၃-bounce--complaint-handling)
8. [AWS SQS (Simple Queue Service) ဖြင့် Distributed Cloud Queues](#၈-aws-sqs-ဖြင့်-cloud-queue)
   - [Long Polling ဖြင့် ကုန်ကျစရိတ် ချွေတာခြင်း](#၈၁-long-polling-ဖြင့်-စရိတ်ချွေတာခြင်း)
   - [Dead Letter Queue (DLQ) ဖြင့် Fail ဖြစ်သော Jobs များ ထိန်းသိမ်းခြင်း](#၈၂-dead-letter-queue-dlq)
9. [AWS CloudFront (CDN) ဖြင့် ကမ္ဘာအနှံ့ ပုံများကို အမြန်ဆုံး ဖြန့်ဝေခြင်း](#၉-aws-cloudfront-cdn)
10. [End-to-End Real-World Case Study (E-Commerce Workflow)](#၁၀-end-to-end-real-world-case-study)

---

## ၁။ AWS Cloud ကို ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**AWS (Amazon Web Services)** သည် ကမ္ဘာ့အကြီးမားဆုံး Cloud Computing Platform ဖြစ်ပြီး Storage, Email, Message Queue နှင့် Content Delivery တို့အတွက် Enterprise-grade အခြေခံအဆောက်အအုံကို ပေးစွမ်းသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature?)
Local Server (VPS/Droplet) တစ်ခုတည်းတွင် ဖိုင်များ၊ ဒေတာဘေ့စ်များနှင့် Queue များကို အတူတကွ သိမ်းဆည်းထားပါက အောက်ပါ ဆိုးကျိုးများ ကြုံတွေ့ရမည်:
* **Server Hard Disk ပြည့်သွားခြင်း**: သုံးစွဲသူများ တင်လိုက်သော ပုံများ၊ ဗီဒီယိုများကြောင့် Server Disk ပြည့်ကာ Website တစ်ခုလုံး ရပ်တန့်သွားနိုင်သည်။
* **Multi-Server Sync မရခြင်း**: Server ၂ လုံး (Server A, Server B) ခွဲသုံးသည့်အခါ Server A ပေါ် တင်ထားသောပုံကို Server B မှ မမြင်ရခြင်း။
* **Server ပျက်စီးပါက Data ပျောက်ဆုံးခြင်း**: Server OS ပျက်စီးသွားပါက User Upload လုပ်ထားသော ဖိုင်များ အားလုံး ပြန်မရတော့ဘဲ ဆုံးရှုံးသွားနိုင်သည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Unlimited Scalability**: Storage ပမာဏ သို့မဟုတ် Bandwidth ပြည့်သွားမည်ကို စိုးရိမ်စရာမလိုပါ။
* **99.999999999% (11 9's) Data Durability**: ဖိုင်များ ပျောက်ဆုံးနိုင်ခြေ သုညနီးပါး ဖြစ်သည်။
* **Cost Efficiency**: အသုံးပြုသလောက်သာ ပေးချေရသောစနစ် (Pay-as-you-go) ဖြစ်သည်။

---

## ၂။ AWS IAM Setup, Permissions နှင့် `.env`

### (က) IAM ဆိုတာဘာလဲ?
AWS အကောင့်၏ Root Password ကို အသုံးမပြုဘဲ သတ်မှတ်ထားသော ဝန်ဆောင်မှုများကိုသာ သုံးစွဲခွင့်ပေးသည့် **Identity and Access Management** စနစ်ဖြစ်သည်။

### (ခ) လိုအပ်သော Packages နှင့် `.env`:
```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
composer require aws/aws-sdk-php
```

```ini
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=ap-southeast-1 # Singapore Region (မြန်မာနှင့် အနီးဆုံး)
AWS_BUCKET=myanmar-ecommerce-production
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=https://cdn.myanmarthemeshop.com
```

---

## ၃။ AWS S3 File Storage ချိတ်ဆက်ခြင်း

### (က) ဘာကြောင့် S3 သုံးရသလဲ?
Website Code များနှင့် ဖောက်သည်များ တင်လိုက်သော ပုံ/ဖိုင်များကို သီးခြားခွဲထုတ်လိုက်ခြင်းဖြင့် Server ပြောင်းလဲရွှေ့ပြောင်းခြင်းနှင့် Code Deployment များကို စက္ကန့်ပိုင်းအတွင်း ပြုလုပ်နိုင်စေသည်။

### (ခ) အသုံးများသော S3 Functions များ:
```php
namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class S3StorageService
{
    // ၁။ ဖိုင်တင်ခြင်း (Store)
    public function uploadFile(UploadedFile $file, string $folder = 'uploads'): string
    {
        return $file->store($folder, 's3');
    }

    // ၂။ ဖိုင် ရှိမရှိ စစ်ဆေးခြင်း (Exists)
    public function checkExists(string $path): bool
    {
        return Storage::disk('s3')->exists($path);
    }

    // ၃။ Server RAM မတက်စေဘဲ Download ဆွဲယူခြင်း (Stream Download)
    public function downloadFile(string $path, string $downloadName)
    {
        return Storage::disk('s3')->download($path, $downloadName);
    }

    // ၄။ ဖိုင်ဖျက်ခြင်း (Delete)
    public function deleteFile(string $path): bool
    {
        return Storage::disk('s3')->delete($path);
    }

    // ၅။ ဖိုင် နေရာရွှေ့ခြင်း (Move)
    public function moveFile(string $from, string $to): bool
    {
        return Storage::disk('s3')->move($from, $to);
    }
}
```

---

## ၄။ Public Assets vs Private Documents

### (က) Public Media (ပစ္စည်းပုံများ၊ Profile ပုံများ)
* **ဘာကြောင့် သုံးရသလဲ**: ကမ္ဘာပေါ်ရှိ မည်သည့် အသုံးပြုသူမဆို Browser မှ ပုံများကို တိုက်ရိုက် ကြည့်ရှုနိုင်စေရန်။

```php
public function storeProductImage(Request $request)
{
    $request->validate(['image' => 'required|image|max:5120']);

    // 'public' visibility ဖြင့် S3 Bucket ထဲ သိမ်းခြင်း
    $path = $request->file('image')->storePublicly('products', 's3');

    // CDN / Public URL ရယူခြင်း
    $publicUrl = Storage::disk('s3')->url($path);

    Product::create([
        'title'     => $request->title,
        'image_url' => $publicUrl,
        's3_path'   => $path,
    ]);

    return back()->with('success', 'ပုံ အောင်မြင်စွာ တင်ပြီးပါပြီ!');
}
```

### (ခ) Private Documents (မှတ်ပုံတင်၊ လျှို့ဝှက် စာချုပ်၊ ဘဏ်စာရင်း)
* **ဘာကြောင့် သုံးရသလဲ**: ပုံမှန် URL သိရုံဖြင့် အပြင်လူများ ဝင်ရောက် မကြည့်ရှုနိုင်စေရန် လုံခြုံရေးအရ Private အဖြစ် သိမ်းဆည်းခြင်း။

```php
// Private Object အဖြစ် သိမ်းခြင်း (Public ဖွင့်မထားပါ)
$privatePath = $request->file('nrc_file')->store('confidential/nrc', 's3');
```

---

## ၅။ လုံခြုံစိတ်ချရသော Pre-Signed Download URLs

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?
Private အဖြစ် သိမ်းထားသော လျှို့ဝှက် စာချုပ်ဖိုင် သို့မဟုတ် ဆေးမှတ်တမ်းကို Login ဝင်ထားသော တရားဝင် User အား **မိနစ် ၂၀ သာ ကြည့်ရှုခွင့်ပေးပြီး နောက်ပိုင်း သက်တမ်းကုန်စေမည့် လျှို့ဝှက် Link ထုတ်ပေးရန်** သုံးသည်။

### (ခ) အားသာချက်:
ဖိုင်ကို အများပြည်သူသို့ Public ဖွင့်စရာမလိုသလို၊ Server Memory ထဲ Download ဆွဲယူပြီးမှ ပြန်ပို့စရာမလိုဘဲ AWS S3 က တိုက်ရိုက် လုံခြုံစွာ Download ပေးသည်။

```php
use Illuminate\Support\Facades\Storage;

public function viewDocument(UserDocument $document)
{
    // ပိုင်ရှင်ကိုယ်တိုင် ဟုတ်/မဟုတ် Authorization စစ်ဆေးခြင်း
    $this->authorize('view', $document);

    // ၁၅ မိနစ် သက်တမ်းသာရှိသော AWS Pre-Signed Temporary URL ထုတ်ပေးခြင်း
    $temporaryDownloadUrl = Storage::disk('s3')->temporaryUrl(
        $document->s3_path,
        now()->addMinutes(15),
        [
            'ResponseContentDisposition' => 'attachment; filename="' . $document->original_filename . '"',
        ]
    );

    return redirect()->away($temporaryDownloadUrl);
}
```

---

## ၆။ Direct-to-S3 Upload (Browser မှ S3 သို့ တိုက်ရိုက်တင်ခြင်း)

### (က) ဘာကြောင့် မဖြစ်မနေ သုံးရသလဲ?
အသုံးပြုသူက 500MB ဗီဒီယိုဖိုင် တင်လိုက်ပါက ဖိုင်သည် Laravel Server RAM ပေါ်သို့ အရင်ရောက်လာပြီးမှ S3 သို့ ထပ်ပို့ရသည်။ လူ ၁၀ ယောက် ပြိုင်တူ တင်ပါက Server RAM ပြည့်ပြီး Server Hang သွားမည်။

### (ခ) အားသာချက်:
Laravel က **Pre-Signed Upload URL** ထုတ်ပေးလိုက်ပြီး Browser က ထို Link ဖြင့် AWS S3 ပေါ်သို့ တိုက်ရိုက် တင်လိုက်ခြင်းဖြင့် **Laravel Server ဝန် လုံးဝ မပိတော့ပါ**။

```
[Browser / Client] ──(1) Upload Link တောင်းသည်──► [Laravel Backend]
        │                                                │
        │ ◄──(2) Pre-Signed S3 PUT URL ပြန်ပေးသည်────────┘
        │
        └───(3) 500MB Video ကို တိုက်ရိုက် Upload တင်သည်──► [AWS S3 Bucket]
```

#### Laravel Backend Code:
```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

public function generatePresignedUploadUrl(Request $request)
{
    $request->validate(['extension' => 'required|string']);

    $filename = 'videos/' . Str::uuid() . '.' . $request->extension;

    $client = Storage::disk('s3')->getClient();
    $command = $client->getCommand('PutObject', [
        'Bucket' => config('filesystems.disks.s3.bucket'),
        'Key'    => $filename,
        'ACL'    => 'private',
    ]);

    // မိနစ် ၃၀ သက်တမ်းရှိ Upload URL ထုတ်ပေးခြင်း
    $signedRequest = $client->createPresignedRequest($command, '+30 minutes');

    return response()->json([
        'upload_url' => (string) $signedRequest->getUri(),
        'file_key'   => $filename,
    ]);
}
```

#### Frontend (JavaScript) Code:
```javascript
async function uploadBigFileToS3(file) {
    const ext = file.name.split('.').pop();
    const res = await axios.post('/api/s3/presigned-url', { extension: ext });
    const { upload_url, file_key } = res.data;

    // AWS S3 သို့ တိုက်ရိုက် PUT Request ဖြင့် တင်ခြင်း (Laravel Server ကို မထိခိုက်ပါ)
    await axios.put(upload_url, file, {
        headers: { 'Content-Type': file.type }
    });

    await axios.post('/api/videos/save', { key: file_key });
    alert('ဗီဒီယို တင်ခြင်း အောင်မြင်ပါသည်!');
}
```

---

## ၇။ AWS SES (Simple Email Service) ဖြင့် သန်းချီသော အီးမေးလ်များ ပို့ဆောင်ခြင်း

### (က) ဘာကြောင့် သုံးရသလဲ?
Gmail သို့မဟုတ် Shared Hosting တွင် တစ်ရက်လျှင် အီးမေးလ် အစောင် ၅၀၀ အထက် ပို့ခွင့်မပြုပါ။ **Amazon SES** သည် အီးမေးလ် အစောင်ရေ ၁ သောင်း ပို့လျှင် ၁ ဒေါ်လာခန့်သာ ကျသင့်သဖြင့် အလွန်သက်သာပြီး သန်းချီသော ဖောက်သည်များထံ ပို့နိုင်သည်။

### ၇.၁။ SES Sandbox vs Production Access:
* **Sandbox Mode**: တစ်ရက်လျှင် အီးမေးလ် ၂၀၀ သာ ပို့နိုင်ပြီး Verify လုပ်ထားသော Email များထံသာ စမ်းသပ်ပို့နိုင်သည်။
* **Production Access**: AWS Console တွင် "Request Production Access" လျှောက်ထားပါက အကန့်အသတ်မရှိ ပို့နိုင်သွားမည်။

### ၇.၂။ DKIM, SPF & DMARC (Spam Folder မရောက်အောင် ကာကွယ်ခြင်း):
Email များ Spam Box ထဲ မရောက်စေရန် DNS တွင် DKIM CNAME (၃) ခု နှင့် SPF TXT Record `v=spf1 include:amazonses.com ~all` ကို ထည့်သွင်းပေးရပါမည်။

### ၇.၃။ Bounce & Complaint Handling (SNS Webhook):
ဖောက်သည်၏ Email မှားယွင်းနေ၍ ပြန်ကန်ထွက်ခြင်း (Bounce) များပါက AWS SES အပိတ်ခံရနိုင်သဖြင့် SNS Webhook ဖြင့် Database ထဲတွင် ထို email အား auto inactive ပြုလုပ်ပေးရသည်:

```php
public function handleSesWebhook(Request $request)
{
    $data = json_decode($request->getContent(), true);

    if (isset($data['notificationType']) && $data['notificationType'] === 'Bounce') {
        $bouncedEmail = $data['bounce']['bouncedRecipients'][0]['emailAddress'];
        User::where('email', $bouncedEmail)->update(['is_email_valid' => false]);
    }

    return response()->json(['status' => 'handled']);
}
```

---

## ၈။ AWS SQS (Simple Queue Service) ဖြင့် Cloud Queue

### (က) ဘာကြောင့် သုံးရသလဲ?
Database Queue သည် အလုပ်များလာသောအခါ Database Lock ကျတတ်သည်။ **AWS SQS** သည် Cloud ပေါ်တွင် သီးသန့် အလုပ်လုပ်သော Distributed Queue ဖြစ်ပြီး Server ပြုတ်ကျသွားလျှင်ပင် Job များ ပျောက်ဆုံးမသွားပါ။

### ၈.၁။ Long Polling ဖြင့် စရိတ်ချွေတာခြင်း:
`config/queue.php` တွင် `wait_time_seconds: 20` ထားခြင်းဖြင့် Worker က မလိုအပ်ဘဲ ခဏခဏ မေးမြန်းခြင်းကို လျှော့ချကာ AWS Bill ၉၀% ချွေတာပေးသည်။

### ၈.၂။ Dead Letter Queue (DLQ):
Error တက်၍ မပြီးပြတ်နိုင်သော Job များကို သီးသန့် အမှိုက်ပုံး Queue (DLQ) ထဲသို့ အလိုအလျောက် ရွှေ့ပေးသဖြင့် အခြား Queue များ ပိတ်ဆို့မသွားစေပါ။

---

## ၉။ AWS CloudFront (CDN)

### (က) ဘာကြောင့် သုံးရသလဲ?
S3 Bucket သည် Singapore တွင် ရှိပါက အမေရိက သို့မဟုတ် ဥရောပမှ ကြည့်သူများအတွက် ပုံပေါ်ရန် နှေးကွေးသည်။ **CloudFront CDN** က ကမ္ဘာတစ်ဝှမ်းရှိ Edge Locations များတွင် ပုံများကို Cache လုပ်ပေးထားသဖြင့် မည်သည့်နိုင်ငံမှ ဝင်ကြည့်သည်ဖြစ်စေ စက္ကန့်ပိုင်းအတွင်း ဖွင့်လှစ်ပြသပေးသည်။

```ini
AWS_URL=https://cdn.myanmarthemeshop.com
```

---

## ၁၀။ End-to-End Real-World Case Study

Customer က ပစ္စည်းဝယ်ယူပြီး ငွေလွှဲပြေစာ တင်လိုက်သည့် လုပ်ငန်းစဉ်:
```php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Jobs\ProcessOrderAnalyticsJob;
use App\Notifications\OrderInvoiceNotification;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function submitPaymentSlip(Request $request, Order $order)
    {
        $request->validate(['payment_slip' => 'required|image|max:5120']);

        // ၁။ ပြေစာပုံကို S3 Private Bucket ထဲ သိမ်းခြင်း
        $s3Path = $request->file('payment_slip')->store('payment-slips', 's3');
        $order->update(['payment_slip_path' => $s3Path, 'status' => 'under_review']);

        // ၂။ AWS SES မှတစ်ဆင့် Invoice Email ပို့ဆောင်ခြင်း
        $request->user()->notify(new OrderInvoiceNotification($order));

        // ၃။ AWS SQS ထဲသို့ စာရင်းအင်းတွက်ချက်မှု Job ပစ်ထည့်ခြင်း
        ProcessOrderAnalyticsJob::dispatch($order)->onConnection('sqs');

        return redirect()->route('orders.show', $order->id)
                         ->with('success', 'ပြေစာ တင်ခြင်း အောင်မြင်ပါသည်။');
    }
}
```
