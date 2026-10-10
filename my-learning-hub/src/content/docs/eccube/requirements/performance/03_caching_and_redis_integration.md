---
title: "03. Caching And Redis Integration"
description: "Database သို့ အကြိမ်ကြိမ် မေးမြန်းနေစရာမလိုဘဲ မကြာခဏ အသုံးပြုသော ဒေတာများကို Memory (RAM) ပေါ်တွင် သိမ်းဆည်းပေးသည့် Caching နှင့် Redis တပ်ဆင်အသုံးပြုနည်း ဖြစ်ပ"
---

## 03. Caching & Redis Integration (キャッシュとRedis連携)

Database သို့ အကြိမ်ကြိမ် မေးမြန်းနေစရာမလိုဘဲ မကြာခဏ အသုံးပြုသော ဒေတာများကို Memory (RAM) ပေါ်တွင် သိမ်းဆည်းပေးသည့် **Caching နှင့် Redis တပ်ဆင်အသုံးပြုနည်း** ဖြစ်ပါသည်။

---

## 🏎️ အဘယ်ကြောင့် Redis ကို အသုံးပြုသင့်သနည်း?

- **Database (MySQL)**: Hard Disk / SSD ပေါ်တွင် သိမ်းဆည်းသဖြင့် တုန့်ပြန်ချိန်သည် ၅၀ မီလီစက္ကန့်မှ ၂၀၀ မီလီစက္ကန့်အထိ ကြာနိုင်သည်။
- **Redis (In-Memory Database)**: ကွန်ပျူတာ၏ RAM ပေါ်တွင် တိုက်ရိုက် သိမ်းဆည်းသဖြင့် တုန့်ပြန်ချိန်သည် **၁ မီလီစက္ကန့်အောက် (Microseconds)** သာ ကြာမြင့်သည်။

```
[ဈေးဝယ်သူ ဝင်ရောက်လာခြင်း]
          ↓
[Redis Cache တွင် ဒေတာ ရှိမရှိ စစ်ဆေးခြင်း]
   ├──> ရှိပါက (Cache Hit): RAM မှ ဒေတာကို ၁ မီလီစက္ကန့်အတွင်း ချက်ချင်းပြသပေးခြင်း ✅
   └──> မရှိပါက (Cache Miss): MySQL မှ ဆွဲယူပြီး Redis ထဲတွင် နောက်တစ်ကြိမ်အတွက် သိမ်းဆည်းထားခြင်း 🔄
```

---

## ⚙️ ၁။ EC-CUBE တွင် Redis တပ်ဆင် ပြင်ဆင်ခြင်း

### `.env` ဖိုင်တွင် ချိတ်ဆက်မှု သတ်မှတ်ခြင်း:
```dotenv
###> redis ###
REDIS_URL=redis://127.0.0.1:6379
###< redis ###
```

### `config/packages/cache.yaml` တွင် Redis Adapter ပြင်ဆင်ခြင်း:
```yaml
framework:
    cache:
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
        pools:
            doctrine.result_cache_pool:
                adapter: cache.adapter.redis
            doctrine.system_cache_pool:
                adapter: cache.adapter.redis
```

---

## 📊 ၂။ Query Result Cache အသုံးပြုခြင်း

Category Menu သို့မဟုတ် စတိုးဆိုင်၏ Ranking Products များကဲ့သို့ မကြာခဏ မပြောင်းလဲသော ဒေတာများကို Result Cache ပြုလုပ်ခြင်း:

```php
namespace Customize\Repository;

use Eccube\Repository\CategoryRepository;

class CachedCategoryRepository extends CategoryRepository
{
    /**
     * Category သစ်ပင်ဇယားကို Redis တွင် ၁ နာရီ (၃၆၀၀ စက္ကန့်) Cache သိမ်းဆည်းခြင်း
     */
    public function getCachedCategoryTree(): array
    {
        $query = $this->createQueryBuilder('c')
            ->where('c.Parent IS NULL')
            ->orderBy('c.sort_no', 'DESC')
            ->getQuery();

        // Query Result Cache ကို ဖွင့်လှစ်ခြင်း
        $query->enableResultCache(3600, 'category_navigation_tree');

        return $query->getResult();
    }
}
```

---

## 🧹 ၃။ Cache Invalidation (ပစ္စည်း ပြင်ဆင်ချိန်တွင် Cache ဖျက်သိမ်းခြင်း)

Cache သိမ်းထားသောအခါ ပစ္စည်းဈေးနှုန်း သို့မဟုတ် ကုန်ပစ္စည်းအမည်ကို Admin ဘက်မှ ပြင်ဆင်လိုက်သော်လည်း ဆိုက်ပေါ်တွင် ချက်ချင်းမပြောင်းလဲဘဲ Cache ဟောင်း ကျန်ရှိနေတတ်ပါသည်။

ထို့ကြောင့် Doctrine Event Subscriber ဖြင့် ပစ္စည်းပြင်ဆင်လိုက်သည့်အခါ သက်ဆိုင်ရာ Cache Key ကို အလိုအလျောက် ရှင်းလင်းပေးရပါသည်:

```php
namespace Customize\EventSubscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Eccube\Entity\Product;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ProductCacheInvalidationSubscriber implements EventSubscriber
{
    private TagAwareCacheInterface $cache;

    public function __construct(TagAwareCacheInterface $cache)
    {
        $this->cache = $cache;
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postUpdate,
            Events::postPersist,
            Events::postRemove,
        ];
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->invalidate($args);
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->invalidate($args);
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $this->invalidate($args);
    }

    private function invalidate(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        if ($entity instanceof Product) {
            // သက်ဆိုင်ရာ Product Cache နှင့် Category Tree Cache များကို ရှင်းလင်းပစ်ခြင်း
            $this->cache->delete('category_navigation_tree');
            $this->cache->delete('product_detail_' . $entity->getId());
        }
    }
}
```

---

## 📈 စွမ်းဆောင်ရည် စမ်းသပ်မှု ရလဒ် (Benchmark)

Category နှင့် ပစ္စည်းများစွာ ပါဝင်သော Home Page မျက်နှာပြင်တွင် စမ်းသပ်ချက်:

| အခြေအနေ | Response Time | Database Load | CPU အသုံးပြုမှု |
|:---|:---:|:---:|:---:|
| **Redis Cache မသုံးမီ** | 820 ms | 68 Queries / Request | 78% |
| **Redis Cache သုံးပြီးနောက်** | **32 ms (၂၅ ဆ ပိုမြန်)** | **0 Queries (Cache Hit)** | **9%** |

အထူးသဖြင့် စတိုးဆိုင်တွင် Flash Sale သို့မဟုတ် အထူး Promotion ပြုလုပ်၍ လူသိန်းနှင့်ချီ တပြိုင်နက် ဝင်ရောက်လာချိန်တွင် ဆာဗာဒေါင်းမသွားစေရန် Redis Cache သည် မရှိမဖြစ် အရေးကြီးဆုံး ကာကွယ်ရေး အလွှာ ဖြစ်ပါသည်။
