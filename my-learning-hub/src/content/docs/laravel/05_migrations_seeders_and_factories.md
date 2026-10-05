---
title: "05. Migrations and Seeders"
description: "1. [Database Migration ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-database-migration-ဆိုတာဘာလဲ)"
---

## 🗄️ သင်ခန်းစာ (၅) - Database Migrations, Seeders နှင့် Factories
### (Lesson 5: Database Schema Design, Migrations, Seeders & Faker Factories)

---

## 📌 မာတိကာ (Contents)
1. [Database Migration ဆိုတာဘာလဲ? ဘာကြောင့် သုံးရသလဲ?](#၁-database-migration-ဆိုတာဘာလဲ)
2. [Migration ဖိုင်တစ်ခု၏ ဖွဲ့စည်းပုံ (`up` နှင့် `down`)](#၂-migration-ဖိုင်တစ်ခု၏-ဖွဲ့စည်းပုံ)
3. [Column Types များနှင့် Modifiers များ](#၃-column-types-များနှင့်-modifiers-များ)
4. [Foreign Key Relationships နှင့် Cascading Rules (ဘာကြောင့် သုံးရသလဲ?)](#၄-foreign-key-relationships-နှင့်-cascading-rules)
5. [ရှိပြီးသား Table တွင် Column အသစ် ထပ်တိုးခြင်း (Safe Migration)](#၅-ရှိပြီးသား-table-တွင်-column-အသစ်-ထပ်တိုးခြင်း)
6. [Seeders နှင့် Model Factories (Faker ဖြင့် Dummy Data သွင်းခြင်း)](#၆-seeders-နှင့်-model-factories)
7. [မကြာခဏသုံးရသော Artisan Database Commands](#၇-မကြာခဏသုံးရသော-artisan-database-commands)

---

## ၁။ Database Migration ဆိုတာဘာလဲ?

### (က) ဒါက ဘာလဲ? (What is it?)
**Database Migration** ဆိုသည်မှာ Database GUI (phpMyAdmin/DBeaver) ထဲတွင် Table များကို လက်ဖြင့် ဆောက်မည့်အစား **PHP ကုဒ်များဖြင့် Version Control ပြုလုပ်ကာ Database Schema ကို တည်ဆောက်ပြင်ဆင်သော စနစ်** ဖြစ်ပါသည်။

### (ခ) ဘာကြောင့် မဖြစ်မနေ အသုံးပြုရသလဲ? (Why use this feature in real work?)
အဖွဲ့သား (၅) ယောက်ဖြင့် Project ရေးသားသည့်အခါ Developer A က Table အသစ် သို့မဟုတ် Column အသစ် လက်ဖြင့် ထည့်လိုက်ပါက အခြား Developer ၄ ယောက်ထံတွင် ထို Column မရှိသဖြင့် Error များ တက်လာသည်။ Migration သုံးထားပါက `php artisan migrate` ဟု ရိုက်လိုက်ရုံဖြင့် အဖွဲ့သားအားလုံးထံတွင် Database structure အတူတူ ချက်ချင်း ဖြစ်သွားသည်။

### (ဂ) အသုံးပြုခြင်း၏ အားသာချက်များ (Advantages):
* **Database Agnostic**: MySQL, PostgreSQL, SQLite, SQL Server စသည့် မည်သည့် Database စနစ်မဆို Code မပြောင်းဘဲ ချိတ်ဆက်နိုင်သည်။
* **Rollback Capability**: အမှားတစ်ခုခုပါသွားပါက နောက်ဆုံး ပြုလုပ်ခဲ့သော အပြောင်းအလဲကို `migrate:rollback` ဖြင့် စက္ကန့်ပိုင်းအတွင်း ပြန်ဖျက်နိုင်သည်။
* **Automated CI/CD**: Live Server ပေါ်သို့ Code တင်တိုင်း Database Schema ပြောင်းလဲမှုများကို command တစ်ကြောင်းတည်းဖြင့် auto update လုပ်ပေးနိုင်သည်။

---

## ၂။ Migration ဖိုင်တစ်ခု၏ ဖွဲ့စည်းပုံ

```bash
php artisan make:migration create_categories_table
```

Migration ဖိုင်တွင် အဓိက Method (၂) ခု ပါဝင်သည်:
1. `up()`: Table အသစ် ဆောက်ခြင်း သို့မဟုတ် Column များ ထပ်ထည့်ခြင်း။
2. `down()`: `up()` တွင် လုပ်ခဲ့သမျှကို ပြောင်းပြန် ပြန်ဖျက်ပစ်ခြင်း (Rollback)။

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();                     // Auto-increment Primary Key (BIGINT)
            $table->string('name', 100);      // VARCHAR(100)
            $table->string('slug')->unique(); // Unique Index ပါဝင်သည်
            $table->text('description')->nullable(); // NULL တန်ဖိုး ခွင့်ပြုသည်
            $table->boolean('is_active')->default(true); // Default 1
            $table->timestamps();             // created_at & updated_at columns
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

---

## ၃။ Column Types များနှင့် Modifiers များ

| Column Method | SQL Data Type | မည်သည့်အခါတွင် သုံးသလဲ |
| :--- | :--- | :--- |
| `$table->string('title', 255)` | `VARCHAR(255)` | အမည်၊ ခေါင်းစဉ် စသည့် စာတိုများ |
| `$table->text('body')` | `TEXT` | ဆောင်းပါး၊ မှတ်ချက် စသည့် စာရှည်များ |
| `$table->integer('stock')` | `INT` | ကိန်းပြည့် ဂဏန်းများ |
| `$table->decimal('price', 12, 2)` | `DECIMAL(12,2)` | ငွေကြေး ပမာဏ (ဒဿမ တိကျမှု လိုအပ်သောအခါ) |
| `$table->boolean('is_published')` | `TINYINT(1)` | True / False Toggle သတ်မှတ်ချက်များ |
| `$table->json('settings')` | `JSON` | Dynamic Settings/Attributes သိမ်းဆည်းရန် |
| `$table->softDeletes()` | `TIMESTAMP` | `deleted_at` (အပြီးမပျက်ဘဲ သိမ်းရန်) |

---

## ၄။ Foreign Key Relationships နှင့် Cascading Rules

### (က) ဘာကြောင့် သုံးရသလဲ?
Table (၂) ခုအကြား Data Integrity (ဒေတာ ခိုင်မာမှု) ရှိစေရန်နှင့် မိဘ Table မှ Data ပျက်သွားပါက သားသမီး Data များ Database ထဲတွင် အမှိုက်အဖြစ် ကျန်မနေစေရန် (Orphaned records မဖြစ်စေရန်) သုံးသည်။

### (ခ) အားသာချက် (Cascade Delete):
Category တစ်ခုကို ဖျက်လိုက်ပါက ၎င်းအောက်ရှိ Products များကို တစ်ခုချင်း လိုက်ဖျက်စရာမလိုဘဲ Database က auto cascade ဖျက်ပေးသည်။

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    
    // categories table ၏ id နှင့် ချိတ်ဆက်ခြင်း
    $table->foreignId('category_id')
          ->constrained('categories')
          ->cascadeOnDelete();

    $table->string('title');
    $table->decimal('price', 10, 2);
    $table->timestamps();
});
```

---

## ၅။ ရှိပြီးသား Table တွင် Column အသစ် ထပ်တိုးခြင်း (Safe Migration)

### (က) ဘာကြောင့် သီးသန့် Migration ဆောက်ရသလဲ?
Production ရှိပြီးသား ဒေတာများ မပျက်စီးစေရန် Table ကို အသစ်ပြန်မဖျက်ဘဲ `Schema::table()` ဖြင့် Column အသစ် ထပ်ထည့်ရသည်။

```bash
php artisan make:migration add_phone_to_users_table --table=users
```

```php
return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
};
```

---

## ၆။ Seeders နှင့် Model Factories

### (က) ဒါက ဘာလဲ? ဘာကြောင့် သုံးရသလဲ?
စနစ်တစ်ခုကို စမ်းသပ်ရန် UI Form မှနေ၍ Product ၁၀၀/၁၀၀၀ ကို လက်ဖြင့် ထိုင်ဖြည့်နေရပါက ရက်ပေါင်းများစွာ အချိန်ကုန်မည်။ **Factory & Faker** ဖြင့် စက္ကန့်ပိုင်းအတွင်း ဒေတာ အစစ်နီးပါး Fake Data ပေါင်း သောင်းချီ ထည့်သွင်းနိုင်သည်။

```bash
php artisan make:factory ProductFactory --model=Product
```

```php
// database/factories/ProductFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);
        return [
            'category_id' => 1,
            'title'       => ucfirst($name),
            'slug'        => Str::slug($name),
            'price'       => fake()->numberBetween(5000, 100000),
            'description' => fake()->paragraph(),
            'is_active'   => fake()->boolean(80),
        ];
    }
}
```

```php
// database/seeders/DatabaseSeeder.php
public function run(): void
{
    // Fake Products အခု ၅၀ ထည့်သွင်းမည်
    \App\Models\Product::factory(50)->create();
}
```

---

## ၇။ မကြာခဏသုံးရသော Artisan Database Commands

| Command | ဘာကြောင့် သုံးရသလဲ (Why use it) |
| :--- | :--- |
| `php artisan migrate` | ရေးထားသော migration ဖိုင်များကို execute လုပ်ရန် |
| `php artisan migrate:status` | မည်သည့် migration များ ပြီးဆုံးပြီး မည်သည့်အရာများ ကျန်ရှိနေသေးကြောင်း စစ်ဆေးရန် |
| `php artisan migrate:rollback` | နောက်ဆုံး run ခဲ့သော migration batch ကို အမှားပြင် ပြန်ဖျက်ရန် |
| `php artisan migrate:fresh --seed` | Table အားလုံး ပြန်ဆောက်ပြီး Fake Data ပါ တစ်ခါတည်း သွင်းရန် |
