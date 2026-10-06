---
title: "17. Authentication & Authorization (RBAC, JWT & Security)"
description: "Authentication vs Authorization ကွာခြားချက်၊ Session vs JWT၊ Argon2id Password Hashing၊ RBAC Role-Based Access Control နှင့် Production Guard စနစ်များ"
---

# Authentication & Authorization (လုပ်ငန်းခွင်သုံး လုံခြုံရေး ဗိသုကာ)

Web Application များတွင် လုံခြုံရေး (Security) ၏ အဓိက ကျောရိုးမှာ **Authentication (စစ်မှန်ကြောင်း အတည်ပြုခြင်း)** နှင့် **Authorization (လုပ်ပိုင်ခွင့် ခွင့်ပြုချက် စစ်ဆေးခြင်း)** ဖြစ်ပါသည်။ ဤအခန်းတွင် ခေတ်မီ PHP Production စနစ်များတွင် အသုံးပြုသော လုံခြုံရေး စံနှုန်းများကို အသေးစိတ် လေ့လာပါမည်။

---

## ၁။ Authentication vs Authorization ကွာခြားချက်

| မေးခွန်း | အဓိပ္ပာယ် | ဥပမာ (Example) | နည်းပညာများ |
| :--- | :--- | :--- | :--- |
| **Authentication (AuthN)**<br/>*"Who are you?" (သင် ဘယ်သူလဲ?)* | အသုံးပြုသူသည် ၎င်းပြောဆိုသော သူအစစ်အမှန် ဟုတ်/မဟုတ် စစ်ဆေးခြင်း | Username/Password ရိုက်ထည့်ခြင်း၊ OTP ကုဒ် ရိုက်ထည့်ခြင်း | Password Hashing (`Argon2id`), Session Cookies, JWT, 2FA (TOTP) |
| **Authorization (AuthZ)**<br/>*"What can you do?" (သင် ဘာလုပ်ပိုင်ခွင့်ရှိသလဲ?)* | အတည်ပြုပြီးသော အသုံးပြုသူသည် ဤ Feature/Data ကို ကြည့်ရှု/ပြင်ဆင်ခွင့် ရှိ/မရှိ စစ်ဆေးခြင်း | Admin ကသာ User ကို ဖျက်ခွင့်ရှိသည်၊ Editor က ပို့စ်ကို ရေးခွင့်သာရှိသည် | RBAC (Role-Based), ABAC (Attribute-Based), Gates, Policies |

---

## ၂။ Modern Password Hashing: Argon2id vs Bcrypt

PHP တွင် စကားဝှက်များကို `md5()` သို့မဟုတ် `sha1()` ဖြင့် လုံးဝ (လုံးဝ) မသိမ်းဆည်းရပါ။ ၎င်းတို့သည် Rainbow Table တိုက်ခိုက်မှုများဖြင့် စက္ကန့်ပိုင်းအတွင်း Crack ခံရနိုင်ပါသည်။

ခေတ်မီ စံနှုန်းမှာ **`PASSWORD_ARGON2ID`** (သို့မဟုတ် `PASSWORD_BCRYPT`) ဖြစ်သည်:

```php
<?php
// ၁။ စကားဝှက်ကို Hash ပြုလုပ်ပြီး Database တွင် သိမ်းဆည်းခြင်း
$plainPassword = 'UserSuperSecret@2026';

// Argon2id သည် GPU/ASIC Hardware Brute-Force တိုက်ခိုက်မှုများကို ကာကွယ်ပေးနိုင်သည်
$hashedPassword = password_hash($plainPassword, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536, // 64MB RAM
    'time_cost'   => 4,     // 4 Iterations
    'threads'     => 1      // 1 Thread
]);

// Database သို့ သိမ်းမည့် String: $argon2id$v=19$m=65536,t=4,p=1$...
echo $hashedPassword . "\n";

// ၂။ Login ဝင်ရောက်ချိန်တွင် စကားဝှက် စစ်ဆေးခြင်း (Constant-Time Safe)
$inputPassword = 'UserSuperSecret@2026';

if (password_verify($inputPassword, $hashedPassword)) {
    // စကားဝှက် မှန်ကန်သည်!
    
    // ၃။ အကယ်၍ Server ၏ Hash Algorithm/Cost ပြောင်းလဲသွားပါက Auto-Rehash ပြုလုပ်ခြင်း
    if (password_needs_rehash($hashedPassword, PASSWORD_ARGON2ID)) {
        $newHash = password_hash($inputPassword, PASSWORD_ARGON2ID);
        // Database တွင် UPDATE users SET password = $newHash ပြုလုပ်သည်
    }
} else {
    // စကားဝှက် မှားယွင်းသည်
}
```

---

## ၃။ Stateful Sessions vs Stateless JWT (Tokens)

```
[Stateful Session Flow]
Client ──(Login)──► Server ──► Generate Session ID ──► Save in Redis/File
Client ◄──(Cookie: PHPSESSID)──┘
Next Request ──► Send Cookie ──► Server looks up Redis ──► Identified!

[Stateless JWT Flow]
Client ──(Login)──► Server ──► Sign JSON with Secret Key
Client ◄──(Bearer eyJhbGci...)──┘
Next Request ──► Send Token ──► Server verifies signature locally (No DB/Redis lookup!)
```

### Pure PHP JWT Generator & Verifier (HMAC-SHA256)
ပြင်ပ Library မလိုဘဲ Native PHP ဖြင့် လုံခြုံသော JWT Token ထုတ်ပေးခြင်း:

```php
<?php
class JwtService
{
    private const SECRET_KEY = 'YOUR_SUPER_SECURE_256BIT_SECRET_KEY_HERE!';

    public static function generate(array $payload, int $ttlSeconds = 3600): string
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttlSeconds;
        $payloadEncoded = json_encode($payload);

        $base64Header = self::base64UrlEncode($header);
        $base64Payload = self::base64UrlEncode($payloadEncoded);

        // HMAC-SHA256 Signature ဖန်တီးခြင်း
        $signature = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", self::SECRET_KEY, true);
        $base64Signature = self::base64UrlEncode($signature);

        return "{$base64Header}.{$base64Payload}.{$base64Signature}";
    }

    public static function verify(string $jwt): ?array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64Header, $base64Payload, $base64Signature] = $parts;

        // Signature ကို ပြန်လည်တွက်ချက်၍ စစ်ဆေးသည်
        $expectedSignature = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", self::SECRET_KEY, true);
        $expectedBase64Signature = self::base64UrlEncode($expectedSignature);

        // Timing Attack မဖြစ်စေရန် hash_equals ဖြင့် စစ်ဆေးသည်
        if (!hash_equals($expectedBase64Signature, $base64Signature)) {
            return null; // Token ကို ဖောက်ဖျက်ပြင်ဆင်ထားသည်!
        }

        $payload = json_decode(self::base64UrlDecode($base64Payload), true);

        // သက်တမ်းကုန်ဆုံးမှု (Expiration) စစ်ဆေးခြင်း
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token သက်တမ်း ကုန်သွားပြီ!
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
```

---

## ၄။ RBAC (Role-Based Access Control) Database Schema

Production စနစ်များတွင် အသုံးပြုသူများ၏ လုပ်ပိုင်ခွင့်ကို စီမံရန် Relational Database တွင် အောက်ပါအတိုင်း ဇယားများ ဖွဲ့စည်းပါသည်:

```sql
-- ၁။ Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ၂။ Roles Table (SuperAdmin, Admin, Editor, Member)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'super_admin', 'editor'
    name VARCHAR(100) NOT NULL
);

-- ၃။ Permissions Table (Atomic Actions)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'post.create', 'post.delete', 'user.ban'
    description VARCHAR(255)
);

-- ၄။ Role_Permissions Pivot Table (Many-to-Many)
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ၅။ User_Roles Pivot Table (Many-to-Many)
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

---

## ၅။ Production Authorization Gate & Policy Manager

```php
<?php
class AuthorizationGuard
{
    private array $userPermissions = [];

    public function __construct(
        private int $userId,
        private PDO $pdo
    ) {
        $this->loadPermissions();
    }

    private function loadPermissions(): void
    {
        // User ပိုင်ဆိုင်သော Role များမှတစ်ဆင့် ရရှိထားသော Permission အားလုံးကို တစ်ကြိမ်တည်း Query ဆွဲထုတ်သည်
        $stmt = $this->pdo->prepare("
            SELECT DISTINCT p.slug 
            FROM permissions p
            JOIN role_permissions rp ON rp.permission_id = p.id
            JOIN user_roles ur ON ur.role_id = rp.role_id
            WHERE ur.user_id = :user_id
        ");
        $stmt->execute(['user_id' => $this->userId]);
        $this->userPermissions = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Role စစ်ဆေးခြင်း
    public function hasPermission(string $permissionSlug): bool
    {
        // Super Admin ဖြစ်ပါက လုပ်ပိုင်ခွင့် အားလုံး အလိုအလျောက် ရရှိသည်
        if (in_array('*', $this->userPermissions, true) || in_array('all.access', $this->userPermissions, true)) {
            return true;
        }

        return in_array($permissionSlug, $this->userPermissions, true);
    }

    // ABAC (Attribute-Based Policy): ပို့စ်ပိုင်ရှင် ဟုတ်/မဟုတ် Context စစ်ဆေးခြင်း
    public function canEditPost(array $post): bool
    {
        // Admin ဖြစ်ပါက အကုန်ပြင်နိုင်သည်
        if ($this->hasPermission('post.edit.any')) {
            return true;
        }

        // မိမိကိုယ်တိုင်ရေးသော ပို့စ်ဖြစ်ပြီး Status က Published မဖြစ်သေးပါက ပြင်ခွင့်ရှိသည်
        return $this->hasPermission('post.edit.own') &&
               $post['author_id'] === $this->userId &&
               $post['status'] !== 'LOCKED';
    }
}

// Controller တွင် အသုံးချပုံ:
function deleteUserController(int $targetUserId, AuthorizationGuard $guard): void
{
    // Permission မရှိပါက 403 Forbidden ဖြင့် ချက်ချင်း ပယ်ချသည်
    if (!$guard->hasPermission('user.delete')) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => '403 Forbidden: You lack permission to delete users.'
        ]);
        exit;
    }

    // Process Deletion...
}
```

---

## ၆။ Session Security Hardening (PHP Production Best Practices)

Session အသုံးပြုသော Web App များအတွက် Session Hijacking နှင့် Session Fixation တိုက်ခိုက်မှုများကို ကာကွယ်ရန် `php.ini` တွင် အောက်ပါအတိုင်း ချိန်ညှိရပါမည်:

```ini
; Session ID ကို Cookie ဖြင့်သာ ခွင့်ပြုသည် (URL Parameter တွင် ပေါ်ခြင်းကို ပိတ်ပင်သည်)
session.use_only_cookies = 1
session.use_trans_sid = 0

; JavaScript မှ document.cookie ဖြင့် ခိုးယူခြင်းကို ကာကွယ်သည် (XSS Mitigation)
session.cookie_httponly = 1

; HTTPS Protocol ဖြင့်သာ Cookie ကို Browser သို့ ပေးပို့သည်
session.cookie_secure = 1

; CSRF Attack ကာကွယ်ရန် SameSite သတ်မှတ်ခြင်း
session.cookie_samesite = "Strict"
```

Login ဝင်ရောက်ပြီးသည့် ချက်ချင်းအချိန်တွင် **`session_regenerate_id(true);`** ကို မဖြစ်မနေ ခေါ်ယူပေးရပါမည်။ ၎င်းသည် User ၏ Session ID အဟောင်းကို ဖျက်ပစ်ပြီး အသစ်လဲလှယ်ပေးသဖြင့် Session Fixation တိုက်ခိုက်မှုကို အပြည့်အဝ တားဆီးပေးပါသည်။
