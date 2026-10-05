---
title: "AWS SAA-C03 Practice Exam — Set 04"
description: "A company stores user-uploaded images in S3. Images are frequently accessed for the first 30 days, rarely accessed for the next 60 days, and then almost never a"
---

## AWS SAA-C03 Practice Exam — Set 04
# Storage & S3 | Q301–Q400
## Domain 1 (Security 30%) + Domain 3 (Performance 24%) + Domain 4 (Cost 20%)

---

## Q301
**A company stores user-uploaded images in S3. Images are frequently accessed for the first 30 days, rarely accessed for the next 60 days, and then almost never accessed afterward. They want automatic cost optimization. Which S3 feature should they configure?**

- **A)** S3 Versioning with deletion
- **B)** S3 Lifecycle Policy: Transition to S3-Standard-IA after 30 days → Glacier after 90 days
- **C)** S3 Intelligent-Tiering (no lifecycle needed)
- **D)** Manual move objects to Glacier

---
**✅ Correct Answer: B or C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Versioning + deletion → ❌ မှားသည်**
> Versioning = change history preserve ဖြစ်ပြီး storage cost optimization tool မဟုတ်ပါ

**B) S3 Lifecycle Policy → ✅ မှန်သည်**
> **Predictable access pattern + known timeline = Lifecycle Policy optimal:**
> - Day 0-30: S3 Standard (frequent access) → full price
> - Day 30-90: S3 Standard-IA (infrequent access) → 40% cheaper
> - Day 90+: S3 Glacier Flexible Retrieval → 95% cheaper
> **Cost predictable, rules clear** — B is BEST when access pattern is KNOWN

**C) S3 Intelligent-Tiering → ✅ (Also valid)**
> Auto-tiering based on actual access patterns (no lifecycle rules needed). Good when access pattern UNKNOWN or variable. Monitoring fee: $0.0025/1000 objects/month.
> "known pattern" ဆိုရင် B ကသာ cost-optimal

**D) Manual move → ❌ မှားသည်**
> Manual = operational overhead ဖြစ်ပြီး "automatic" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**💡 Real Exam Tip:**
- **Known access pattern** → **S3 Lifecycle Rules**
- **Unknown/unpredictable access** → **S3 Intelligent-Tiering**

---

## Q302
**A company needs to store large amounts of archival data that is rarely retrieved. When retrieved, data can take up to 12 hours. They need the LOWEST STORAGE COST. Which S3 storage class should they choose?**

- **A)** S3 Standard
- **B)** S3 Standard-IA (Infrequent Access)
- **C)** S3 Glacier Flexible Retrieval (formerly Glacier)
- **D)** S3 Glacier Deep Archive

---
**✅ Correct Answer: D**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) S3 Standard → ❌ မှားသည်**
> Highest storage cost ($0.023/GB) ဖြစ်ပြီး frequently accessed data ကိုသာ appropriate — archival "lowest cost" ကို မဖြည့်ဆည်းနိုင်ပါ

**B) S3 Standard-IA → ❌ မှားသည်**
> $0.0125/GB ဖြစ်ပြီး Standard ထက် cheap ဖြစ်သော်လည်း Deep Archive ထက် expensive — "lowest storage cost" မဟုတ်ပါ

**C) S3 Glacier Flexible Retrieval → ❌ မှားသည်**
> $0.004/GB ဖြစ်ပြီး retrieval 1-12 hours (Flexible) — Deep Archive ထက် expensive

**D) S3 Glacier Deep Archive → ✅ မှန်သည်**
> **$0.00099/GB** = cheapest S3 storage class
> Retrieval: 12-48 hours
> "rarely retrieved" + "12-hour retrieval OK" + "lowest cost" = **Deep Archive perfect match**
> Minimum storage duration: 180 days

**💡 S3 Storage Class Cost (Approx):**
| Class | Cost/GB/month | Retrieval Time |
|-------|-------------|---------------|
| Standard | $0.023 | Immediate |
| Standard-IA | $0.0125 | Immediate |
| Glacier Instant | $0.004 | Milliseconds |
| Glacier Flexible | $0.0036 | 1-12 hours |
| **Deep Archive** | **$0.00099** | **12-48 hours** |

---

## Q303
**A company is concerned that developers might accidentally delete important files in an S3 bucket. They want to be able to recover deleted files for up to 30 days. What is the SIMPLEST solution?**

- **A)** Create daily backups to another S3 bucket
- **B)** Enable S3 Versioning — deleted objects become "delete markers" and previous versions are preserved
- **C)** Enable S3 Object Lock Governance mode
- **D)** Enable S3 Cross-Region Replication

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Daily backups → ❌ မှားသည်**
> Daily backup = up to 24 hours data loss window + storage cost doubles ဖြစ်ပြီး "simplest" မဟုတ်ပါ

**B) S3 Versioning → ✅ မှန်သည်**
> **S3 Versioning:**
> - Enable: Bucket → Properties → Versioning
> - Delete object → "Delete marker" created → previous version preserved
> - Recover: Delete the delete marker → previous version restored
> - **Simplest, built-in, one-click enable**
> Add lifecycle rule to delete old versions after 30 days = cost control

**C) Object Lock Governance → ❌ မှားသည်**
> Object Lock = prevent deletion (compliance) ဖြစ်ပြီး "recover after accidental deletion" မဟုတ်ပါ — Object Lock = stricter than required

**D) Cross-Region Replication → ❌ မှားသည်**
> CRR = disaster recovery (another region) ဖြစ်ပြီး deleted object ကို replicate ဖြစ်ပြုသောကြောင့် deletion ကို CRR ကသာ propagate ဖြစ်မည် (Versioning + CRR = both needed)

---

## Q304
**A company wants to access S3 objects only through their application, never directly via S3 URLs. All traffic should go through their domain. What should they configure?**

- **A)** S3 Static Website with CloudFront
- **B)** CloudFront with Origin Access Control (OAC) on a private S3 bucket
- **C)** S3 Transfer Acceleration
- **D)** S3 Presigned URLs for all objects

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) S3 Static Website + CloudFront → ❌ မှားသည်**
> S3 Website URL = still public (direct access possible) ဖြစ်ပြီး direct access ကို block မဖြစ်ပါ

**B) CloudFront OAC + private S3 → ✅ မှန်သည်**
> **CloudFront OAC (Origin Access Control) Pattern:**
> 1. S3 bucket: Block Public Access (enabled)
> 2. CloudFront: Create OAC → associate with distribution
> 3. S3 Bucket Policy: Allow only CloudFront service principal (OAC)
> 4. Result: Direct S3 URL → 403 Forbidden. Only via CloudFront domain → accessible

**C) Transfer Acceleration → ❌ မှားသည်**
> Transfer Acceleration = upload speed optimization ဖြစ်ပြီး access restriction tool မဟုတ်ပါ

**D) Presigned URLs → ❌ မှားသည်**
> Presigned URLs = time-limited access ဖြစ်ပြီး "all traffic through application domain" requirement ကို address မဖြစ်ပါ

---

## Q305
**A company uploads 100 TB of data to S3 per month. They need to move this data from their on-premises data center to AWS S3. Uploading over the internet would take months. What is the FASTEST solution?**

- **A)** AWS Direct Connect (1 Gbps link)
- **B)** AWS Snowball Edge (Storage Optimized)
- **C)** S3 Transfer Acceleration
- **D)** AWS Site-to-Site VPN

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Direct Connect → ❌ မှားသည်**
> 1 Gbps DX link ≈ 100 TB = ~222 hours (9+ days) + DX setup weeks + bandwidth shared with other traffic

**B) AWS Snowball Edge → ✅ မှန်သည်**
> **Snowball Edge Storage Optimized:**
> - 80 TB usable per device
> - Multiple devices for 100 TB
> - Ship to Amazon → AWS uploads to S3
> - Total time: ~1 week (order + ship + upload)
> **Large datasets (> 10 TB) = Snowball**

**C) S3 Transfer Acceleration → ❌ မှားသည်**
> Transfer Acceleration speeds up internet uploads (CloudFront edge) but still internet-dependent ဖြစ်ပြီး 100 TB internet upload = still slow

**D) Site-to-Site VPN → ❌ မှားသည်**
> VPN = internet tunnel, bandwidth limited by internet connection speed

**💡 Data Migration Decision:**
```
< 10 GB → Internet upload
10 GB - 10 TB → S3 Transfer Acceleration
> 10 TB → Snowball / Snowmobile (> 10 PB)
```

---

## Q306
**A company needs to replicate S3 objects from us-east-1 to ap-northeast-1 for disaster recovery. New objects should be replicated automatically within 15 minutes (SLA required). Which feature meets this requirement?**

- **A)** S3 Cross-Region Replication (CRR) with default settings
- **B)** S3 Cross-Region Replication with S3 Replication Time Control (S3 RTC)
- **C)** S3 Same-Region Replication (SRR)
- **D)** S3 Batch Operations daily copy

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) CRR default → ❌ မှားသည်**
> Standard CRR = eventual consistency (no SLA) ဖြစ်ပြီး replication time = unpredictable (seconds to hours) — "within 15 minutes SLA" ကို guarantee မဖြစ်ပါ

**B) CRR + S3 RTC → ✅ မှန်သည်**
> **S3 Replication Time Control (RTC):**
> - **99.99% of objects replicated within 15 minutes** (SLA guarantee)
> - Replication metrics + notifications via CloudWatch
> - Slightly higher cost than standard CRR
> **"15-minute SLA"** keyword = **S3 RTC**

**C) Same-Region Replication → ❌ မှားသည်**
> SRR = same region (different account/bucket) ဖြစ်ပြီး cross-region DR requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**D) Batch Operations daily → ❌ မှားသည်**
> Daily = "15 minutes SLA" requirement ကို completely miss ဖြစ်မည်

---

## Q307
**A company has a static website hosted on S3. Users in Asia report slow loading times. The company wants to improve performance globally. What should they implement?**

- **A)** Move S3 bucket to ap-northeast-1 region
- **B)** Enable CloudFront distribution with S3 as origin
- **C)** Enable S3 Transfer Acceleration
- **D)** Use Route 53 Latency Routing to different S3 buckets

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Move S3 to Tokyo → ❌ မှားသည်**
> Single region = only Tokyo users benefit ဖြစ်ပြီး US/EU users ကို slow ဖြစ်မည် — global solution မဟုတ်ပါ

**B) CloudFront distribution → ✅ မှန်သည်**
> **CloudFront + S3:**
> - 400+ edge locations globally
> - Static content cached at nearest edge to user
> - Asia users → Tokyo edge (not wait for us-east-1)
> - Dramatically improved latency for ALL global users

**C) Transfer Acceleration → ❌ မှားသည်**
> Transfer Acceleration = UPLOAD speed improvement ဖြစ်ပြီး DOWNLOAD (website loading) speed improvement မဟုတ်ပါ — wrong direction

**D) Route 53 + multiple S3 buckets → ❌ မှားသည်**
> Multiple buckets = sync complexity ဖြစ်ပြီး B ထက် complex ဖြစ်ပြီး CloudFront ကဲ့သို့ edge caching benefit မရပါ

---

## Q308
**A company needs to allow partners to upload files directly to S3 without going through their application servers. Partners should only be able to upload specific file types and to a specific prefix. Which solution achieves this securely?**

- **A)** Create IAM users for each partner
- **B)** Generate S3 Pre-signed POST (pre-signed URL for upload) with conditions on content type and key prefix
- **C)** Make the S3 bucket public with write access
- **D)** Share the company's AWS access keys with partners

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM users per partner → ❌ မှားသည်**
> Many partners = many IAM users = credential management burden ဖြစ်ပြီး IAM user limit ကိုပါ hit ဖြစ်နိုင်သောကြောင့် scalable မဟုတ်ပါ

**B) S3 Pre-signed POST → ✅ မှန်သည်**
> **Pre-signed POST URL:**
> - Server generates time-limited URL + policy
> - Policy conditions: `Content-Type: image/*`, `key: uploads/partner-name/*`, `content-length-range`
> - Partner = no AWS credentials needed → upload directly to S3 via POST
> **Secure, no credential sharing, conditions enforced**

**C) Public bucket → ❌ မှားသည်**
> Anyone can upload anything = security catastrophe

**D) Share AWS access keys → ❌ မှားသည်**
> Sharing credentials = security risk, no conditions enforcement

---

## Q309
**A company needs to analyze their S3 access logs to find the top 10 most downloaded files. The logs are stored in S3. They want the SIMPLEST query solution without loading data to a separate database. Which service should they use?**

- **A)** Load logs to RDS and run SQL queries
- **B)** Use Amazon Athena to query S3 access logs directly using SQL
- **C)** Download logs and use Excel
- **D)** Use AWS Glue to ETL logs to Redshift

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Load to RDS → ❌ မှားသည်**
> ETL to RDS = complex + expensive ဖြစ်ပြီး "simplest" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Amazon Athena → ✅ မှန်သည်**
> **Amazon Athena:**
> - Serverless SQL query engine for S3 data
> - No data loading needed (query in-place)
> - Pay per query ($5/TB scanned)
> - Setup: Create table → Run SQL → Get results
> **"Query S3 directly with SQL"** = Athena signature feature

**C) Excel → ❌ မှားသည်**
> 100s GB of logs ကို Excel = impossible ဖြစ်ပြီး scalable မဟုတ်ပါ

**D) Glue + Redshift → ❌ မှားသည်**
> ETL pipeline = over-engineered ဖြစ်ပြီး "simplest" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

---

## Q310
**A company's application uploads a 5 GB file to S3. The upload fails midway. They want to retry without uploading the entire file again. Which S3 feature enables this?**

- **A)** S3 Transfer Acceleration
- **B)** S3 Multipart Upload
- **C)** S3 Byte-Range Fetch
- **D)** S3 Select

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Transfer Acceleration → ❌ မှားသည်**
> Speed improvement ဖြစ်ပြီး resume failed upload mechanism မဟုတ်ပါ

**B) S3 Multipart Upload → ✅ မှန်သည်**
> **S3 Multipart Upload:**
> - Large file = multiple parts (5 MB minimum each)
> - Each part = independently uploaded + retry possible
> - Failed part = only that part retry (not entire file)
> - All parts complete → combine → single object
> **Recommended for files > 100 MB, REQUIRED for > 5 GB**

**C) Byte-Range Fetch → ❌ မှားသည်**
> Byte-Range Fetch = parallel DOWNLOAD of parts ฝั่ง download (opposite direction)

**D) S3 Select → ❌ မှားသည်**
> S3 Select = query/filter object content (CSV, JSON) without downloading entire object

---

## Q311–Q400 (Rapid Fire Storage Questions)

---

## Q311
**Which S3 storage class is designed for data accessed approximately once per month, with instant retrieval?**

- **A)** S3 Standard
- **B)** S3 Standard-IA (Infrequent Access)
- **C)** S3 Glacier Instant Retrieval
- **D)** S3 Glacier Deep Archive

**✅ C**

မြန်မာ: Glacier Instant Retrieval = monthly access + milliseconds retrieval. Cheaper than Standard-IA but similar retrieval speed. For quarterly archives accessed occasionally.

---

## Q312
**A company uses S3 and wants to reduce data retrieval costs by only downloading specific columns from large CSV files. Which S3 feature enables this?**

- **A)** S3 Batch Operations
- **B)** Amazon Athena
- **C)** S3 Select
- **D)** S3 Inventory

**✅ C**

မြန်မာ: **S3 Select** = server-side SQL filtering (SELECT * FROM s3object WHERE column > value) → only relevant data download → reduced transfer costs, faster response

---

## Q313
**What is the minimum object size requirement for S3 Standard-IA storage class?**

- **A)** No minimum
- **B)** 1 KB
- **C)** 128 KB minimum (objects smaller than 128 KB charged as 128 KB)
- **D)** 1 MB

**✅ C**

မြန်မာ: S3-IA, S3-One Zone-IA, Glacier classes = 128 KB minimum billed size. Small objects (< 128 KB) → Standard class ကသာ cost-effective

---

## Q314
**A company has an EFS (Elastic File System) mounted on 100 EC2 instances. They need shared file storage that scales automatically. What is a KEY DIFFERENCE between EFS and EBS?**

- **A)** EBS can be shared across instances; EFS cannot
- **B)** EFS is multi-AZ accessible by multiple instances simultaneously; EBS is single-AZ, single-instance (except Multi-Attach io1/io2)
- **C)** EFS is faster than EBS in all cases
- **D)** EBS supports Linux and Windows; EFS supports Windows only

**✅ B**

မြန်မာ:
- EBS: Single AZ, single instance (mostly), block storage
- **EFS**: Multi-AZ, multi-instance simultaneously, NFS (Linux only), scales automatically

---

## Q315
**When should you use AWS Storage Gateway File Gateway?**

- **A)** To accelerate S3 uploads
- **B)** To allow on-premises applications to access S3 via NFS/SMB protocol with local caching
- **C)** To create EBS volume backups
- **D)** To sync files between S3 regions

**✅ B**

မြန်မာ: File Gateway = On-premises NFS/SMB client → File Gateway (local cache) → S3. On-premises apps = S3 ကို file share ကဲ့သို့ access ဖြစ်ရနိုင်သည်

---

## Q316
**A company has 1 PB of data to move to AWS. Internet upload would take years. What should they use?**

- **A)** AWS Snowball Edge (80 TB each)
- **B)** AWS Snowmobile (100 PB semi-truck)
- **C)** AWS Direct Connect + S3
- **D)** Multiple S3 Transfer Acceleration connections

**✅ A or B**

မြန်မာ:
- 1 PB = ~12-13 Snowball Edge devices (80TB each)
- Snowmobile (100 PB semi-truck) = overkill for 1 PB
- **Rule of thumb**: < 10 PB = Snowball, > 10 PB = Snowmobile

---

## Q317
**What is "S3 Object Ownership" and why is it important?**

- **A)** Determines who pays for S3 storage
- **B)** Controls whether bucket owner or object uploader owns objects (important for cross-account uploads and ACL management)
- **C)** Determines S3 storage class
- **D)** Controls S3 versioning

**✅ B**

မြန်မာ: Object Ownership setting:
- **Bucket owner enforced** (recommended): ACLs disabled, bucket owner owns all objects
- **Object writer**: Uploader owns (cross-account upload issues)
Best practice: "Bucket owner enforced" + disable ACLs → use bucket policies only

---

## Q318
**A company needs to share S3 data between two AWS accounts. Account A owns the bucket. Account B uploads objects. Account A cannot read Account B's objects. Why?**

- **A)** Cross-account S3 is not possible
- **B)** By default, object uploader (Account B) owns the object; Account A cannot read it without explicit permission
- **C)** Account B's IAM role doesn't have enough permissions
- **D)** S3 encryption prevents cross-account read

**✅ B**

မြန်မာ: Cross-account upload issue: uploader ကသာ default owner ဖြစ်ပြီး bucket owner (Account A) = access မဖြစ်ပါ
Fix: Enable "Bucket Owner Enforced" (ACLs disabled) → bucket owner owns all objects automatically

---

## Q319
**Which S3 feature helps identify underutilized storage classes and access patterns to optimize costs?**

- **A)** S3 Inventory
- **B)** S3 Storage Lens
- **C)** S3 Access Logs
- **D)** Amazon Macie

**✅ B**

မြန်မာ: **S3 Storage Lens** = organization-wide S3 analytics dashboard:
- Storage usage by account/region/bucket
- Access frequency per storage class
- Cost optimization recommendations
- Multi-account aggregation

---

## Q320
**A company needs to host a static website with a custom domain (www.company.com) on S3. They use Route 53. What must be configured?**

- **A)** EC2 instance for web hosting
- **B)** S3 bucket name must match the domain name; enable static website hosting; create Route 53 Alias record pointing to S3 website endpoint
- **C)** CloudFront is mandatory for S3 static websites
- **D)** S3 bucket must be encrypted for website hosting

**✅ B**

မြန်မာ: S3 Static Website + Custom Domain requirements:
1. Bucket name = domain name (e.g., `www.company.com`)
2. Enable Static Website Hosting in bucket properties
3. Make objects public (or CloudFront + OAC)
4. Route 53: Alias record → S3 website endpoint (not S3 REST endpoint)

---

## Q321
**What is the maximum single PUT object size in S3?**

- **A)** 5 GB (must use multipart above 5 GB)
- **B)** 100 GB
- **C)** 1 TB
- **D)** No limit

**✅ A**

မြန်မာ: S3 PUT (single request) = max 5 GB. For > 5 GB = MUST use Multipart Upload. Recommended for > 100 MB.

---

## Q322
**A company wants to ensure S3 replication includes existing objects, not just new objects added after replication is configured. What should they use?**

- **A)** Configure replication and wait for backfill
- **B)** Use S3 Batch Operations with S3 Batch Replication to replicate existing objects
- **C)** Copy objects manually using AWS CLI
- **D)** Re-upload all objects to trigger replication

**✅ B**

မြန်မာ: S3 Replication (CRR/SRR) = new objects only (after config). Existing objects = **S3 Batch Operations + Batch Replication** ကိုသာ use ဖြစ်ရမည်

---

## Q323
**An application reads a small portion of a large S3 object (e.g., specific bytes from a 10 GB file). What S3 feature reduces data transfer costs?**

- **A)** S3 Select (for structured data like CSV)
- **B)** S3 Byte-Range Fetch (range GET requests)
- **C)** S3 Multipart Download
- **D)** S3 Transfer Acceleration

**✅ B**

မြန်မာ: **Byte-Range Fetch**: `Range: bytes=0-1023` → only those bytes download → cost and time savings. Also enables parallel downloads of different ranges.

---

## Q324
**A company wants to automatically delete S3 objects after 7 years to comply with data retention policies. What should they configure?**

- **A)** Manual deletion script on a schedule
- **B)** S3 Lifecycle Policy with Expiration action after 2555 days
- **C)** S3 Object Lock with 7-year retention
- **D)** S3 Versioning with delete markers

**✅ B**

မြန်မာ: **S3 Lifecycle Expiration:**
- Current version expiration after N days
- Noncurrent version expiration (old versions)
- Delete markers expiration
7 years = 7 × 365 = 2555 days LifecycleRule expiration

---

## Q325
**A company uses EFS for shared storage. Their application runs in us-east-1 (2 AZs). They want the MOST cost-effective EFS solution for dev/test environments with occasional access.**

- **A)** EFS Standard (Multi-AZ)
- **B)** EFS One Zone (Single AZ)
- **C)** EFS Standard-IA with One Zone
- **D)** EFS Provisioned Throughput

**✅ B or C**

မြန်မာ:
- **EFS One Zone**: Single AZ → 47% cheaper than Standard Multi-AZ
- **EFS One Zone-IA**: + Infrequent Access → even cheaper
- Dev/test = HA မဟုတ်ဘဲ cost priority → **One Zone-IA**

---

## Q326
**What happens to S3 replication when you delete an object in the source bucket (with versioning enabled)?**

- **A)** The object is immediately deleted in the destination
- **B)** By default, delete markers are NOT replicated; destination bucket still has the object
- **C)** Both source and destination delete simultaneously
- **D)** The object moves to Glacier in destination

**✅ B**

မြန်မာ: CRR default: delete markers = NOT replicated ဖြစ်ပြီး destination = object ရှိဆဲ ဖြစ်ပြုမည်
Enable "Delete marker replication" option = delete markers ကိုပါ replicate ဖြစ်ပြုနိုင်

---

## Q327
**A company stores medical images in S3. Legal requires these images be kept for 10 years and must be tamper-proof. Which combination of S3 features should they use?**

- **A)** S3 Versioning + lifecycle
- **B)** S3 Object Lock (Compliance mode, 10-year retention) + S3 Glacier Deep Archive (cost savings)
- **C)** S3 Cross-Region Replication + encryption
- **D)** S3 Transfer Acceleration + MFA

**✅ B**

မြန်မာ:
- Object Lock Compliance = tamper-proof (10 years, root cannot delete)
- Glacier Deep Archive = cheapest storage for 10-year archive
Both combined = compliant + cost-effective

---

## Q328
**What is the difference between S3 SSE-S3, SSE-KMS, and SSE-C encryption?**

- **A)** All three are identical in security
- **B)** SSE-S3: AWS manages keys (AES-256); SSE-KMS: Customer manages keys via KMS (audit trail, key rotation control); SSE-C: Customer provides key per request (AWS performs encryption, doesn't store key)
- **C)** SSE-C is the most common choice
- **D)** SSE-KMS is free while others cost money

**✅ B**

မြန်မာ: S3 Encryption:
| Type | Key Manager | AWS Stores Key | Audit |
|------|------------|---------------|-------|
| SSE-S3 | AWS | Yes | No |
| SSE-KMS | Customer+AWS | Yes (encrypted) | **Yes (CloudTrail)** |
| SSE-C | Customer | **No** | Limited |

---

## Q329
**A company uses S3 with server-side encryption (SSE-KMS). They notice high KMS API costs. What can they do to reduce KMS charges while maintaining encryption?**

- **A)** Switch to SSE-S3 (no KMS API charges)
- **B)** Use S3 Bucket Keys to reduce the number of KMS API calls by ~99%
- **C)** Disable encryption
- **D)** Use SSE-C instead

**✅ B**

မြန်မာ: **S3 Bucket Keys:**
- Each request = KMS decrypt call → expensive at scale
- Bucket Key = S3 generates short-lived key from KMS → uses it locally for many objects
- **Reduces KMS API calls by ~99%** → dramatically lower KMS costs
- Enable: Bucket → Properties → Default encryption → Enable Bucket Key

---

## Q330
**An application needs to store and quickly retrieve small objects (< 1KB) with extremely low latency. S3 adds too much overhead for these tiny objects. Which service is BETTER suited?**

- **A)** S3 with Transfer Acceleration
- **B)** Amazon DynamoDB (for key-value style small objects)
- **C)** S3 with Intelligent-Tiering
- **D)** EFS with max throughput

**✅ B**

မြန်မာ: Small objects + low latency + key-value pattern → DynamoDB (single-digit milliseconds)
S3 = better for larger objects (> 1KB), per-operation overhead too high for tiny objects

---

## Q331–Q400 (Final Storage Rapid Fire)

---

**Q331:** What is the maximum individual S3 object size?
**✅ B — 5 TB** (using multipart upload for > 5 GB)

---

**Q332:** S3 One Zone-IA provides data availability in how many AZs?
**✅ A — 1 AZ** (vs Standard = 3+ AZs). Risk: AZ failure = data lost

---

**Q333:** A company needs to process every new object uploaded to S3 via Lambda. What should they configure?
**✅ C — S3 Event Notifications → Lambda** (trigger on `s3:ObjectCreated:*`)

---

**Q334:** What is S3 Inventory used for?
**✅ B — Generate weekly/daily CSV/ORC/Parquet reports of all objects** (metadata, size, encryption status, replication status) for compliance/audit

---

**Q335:** Which S3 feature enables running analytics (queries, ML models) directly on S3 data without moving it?
**✅ A — Amazon S3 Select + Athena + SageMaker in-place** (data lake pattern)

---

**Q336:** A company's S3 bucket receives 10,000 PUT requests per second. They experience throttling. What should they do?
**✅ C — S3 automatically handles high RPS** with no prefix optimization needed (since 2018). If still throttling → use exponential backoff + different prefixes per shard.

---

**Q337:** What is the purpose of S3 Access Points?
**✅ B — Simplify access management** for shared datasets. Each access point = own DNS, own IAM policy, own VPC restriction. Different teams = different access points with their permissions.

---

**Q338:** Can S3 lifecycle rules transition objects directly from Standard to Glacier Deep Archive?
**✅ A — Yes** — S3 lifecycle can skip intermediate storage classes and go directly to any lower-cost tier

---

**Q339:** A company wants to replicate S3 objects from multiple source buckets to a single destination bucket. Is this possible?
**✅ B — Yes** — Many-to-one replication: Multiple source buckets → single destination (using different prefixes to avoid conflicts)

---

**Q340:** What is "S3 Object Lambda"?
**✅ C — Allows Lambda functions to transform S3 objects on-the-fly when retrieved** (resize images, add watermarks, filter data) without storing multiple versions

---

**Q341:** Which tool helps move large amounts of data between S3 and on-premises storage systems using dedicated hardware?
**✅ A — AWS Snowball / Snowball Edge** (physical device sent to customer, data loaded, shipped back)

---

**Q342:** What is the durability of S3 Standard storage class?
**✅ B — 99.999999999% (11 9s)** — designed to sustain concurrent loss of data in two facilities

---

**Q343:** A company wants to use S3 as a data lake. Which services integrate directly with S3 for analytics?
**✅ C — Amazon Athena (SQL), Amazon Redshift Spectrum, AWS Glue, Amazon EMR, QuickSight** — all query S3 directly

---

**Q344:** What is "S3 Event Bridge" notification vs "S3 Event Notification"?
**✅ B — EventBridge: more destinations, filtering, event archiving, replay. S3 Event Notification: simpler, direct to SQS/SNS/Lambda only.** EventBridge = recommended for new implementations.

---

**Q345:** A company's S3 CRR replication is failing for some objects. What is the MOST likely cause?
**✅ B — Objects encrypted with SSE-C** (customer key) cannot be replicated since AWS doesn't have the key. Solution: Use SSE-KMS instead.

---

**Q346:** What is the difference between EFS "Bursting" and "Provisioned" throughput modes?
**✅ C — Bursting**: Throughput scales with storage size (credit-based). **Provisioned**: You specify fixed throughput regardless of storage size (for consistent high-throughput needs)

---

**Q347:** When is S3 Glacier Instant Retrieval the BEST choice?
**✅ A — Long-lived archive data accessed once per quarter with millisecond retrieval requirement** (medical images, news media archives)

---

**Q348:** A company's S3 bucket needs to emit events when objects are created AND when objects are deleted. Both events should trigger different Lambda functions. What should they use?
**✅ B — S3 Event Notifications: s3:ObjectCreated:* → Lambda A; s3:ObjectRemoved:* → Lambda B** (or S3 EventBridge with routing rules)

---

**Q349:** What is FSx for Windows File Server used for?
**✅ B — Windows-compatible shared file storage using SMB protocol, Active Directory integration, DFS, NTFS** — for Windows workloads requiring Windows-native file sharing

---

**Q350:** What is FSx for Lustre used for?
**✅ C — High-performance parallel file system for HPC, ML training, video processing** — integrates with S3 (S3 data repository), sub-millisecond latency, hundreds of GB/s throughput

---

**Q351:** A company has 10 TB in S3 Standard. 80% of objects haven't been accessed in 6+ months. Without changing their access patterns, what should they do?
**✅ A — S3 Intelligent-Tiering** automatically moves objects to cheaper tiers. Or Lifecycle rules if access pattern is predictable.

---

**Q352:** What is the S3 "minimum storage duration" charge?
**✅ B — Objects deleted before minimum duration are still charged for the minimum:**
- Standard-IA: 30 days
- One Zone-IA: 30 days
- Glacier Instant: 90 days
- Glacier Flexible: 90 days
- Deep Archive: 180 days

---

**Q353:** Can you host dynamic websites (PHP, Node.js, Python) on S3 static website hosting?
**✅ D — NO** — S3 = static files only (HTML, CSS, JS). Dynamic = EC2, Lambda+API Gateway, Elastic Beanstalk, or ECS

---

**Q354:** A company needs to migrate an NFS file server to AWS while keeping on-premises access via NFS. Which service maintains NFS compatibility?
**✅ A — AWS Storage Gateway File Gateway (NFS mode)** — On-premises NFS client → File Gateway → S3

---

**Q355:** What does enabling "Requester Pays" on an S3 bucket do?
**✅ B — Data transfer and request costs are charged to the REQUESTER (downloader), not the bucket owner** — useful for large public datasets

---

**Q356:** A company uses S3. They need to know if any of their buckets have public access enabled. What is the QUICKEST way to check?
**✅ C — S3 Console → Account-level Block Public Access settings + S3 Storage Lens for organization-wide view** or IAM Access Analyzer (S3 public buckets)

---

**Q357:** What is the maximum S3 bucket policy size?
**✅ B — 20 KB** (IAM policy = 6-10 KB depending on type)

---

**Q358:** A company uses S3 with versioning. They want to automatically delete old versions to save storage costs. What should they configure?
**✅ A — S3 Lifecycle rule: Noncurrent version expiration** (delete non-current versions after N days)

---

**Q359:** Which EFS performance mode is recommended for HPC workloads with many parallel small operations?
**✅ A — Max I/O performance mode** (higher latency but massively parallel, for 10+ EC2 instances writing simultaneously)

---

**Q360:** What is Amazon S3 on Outposts?
**✅ C — S3 on AWS Outposts** = S3 APIs + experience for data that must stay on-premises (data sovereignty, local processing latency requirements)

---

**Q361–Q400 (Lightning Round)**

**Q361:** S3 CRR requires same or different AWS regions? **✅ Different regions** (same region = SRR)

**Q362:** Can S3 replicate unencrypted objects to encrypted destination? **✅ Yes** — configure SSE-KMS on destination

**Q363:** What S3 class has NO retrieval fee? **✅ Standard** (all IA/Glacier classes have per-GB retrieval fees)

**Q364:** EFS is compatible with which OS? **✅ Linux only (NFSv4.1/4.0)** — Windows = FSx for Windows

**Q365:** What AWS service transfers data between S3 and on-premises at speeds up to 1 Gbps over internet? **✅ AWS DataSync** (optimized data transfer, not Snowball)

**Q366:** S3 supports which types of event notifications? **✅ SQS, SNS, Lambda, EventBridge**

**Q367:** Can you change an EBS volume type after creation? **✅ Yes** — ElasticVolumes: change gp2→gp3, io1→io2, size, IOPS without stopping instance

**Q368:** What is the EFS "Access Points" feature? **✅ Named paths with specific POSIX user/group permissions** — different applications get different EFS root directories

**Q369:** Can S3 host a private static website accessible only within a VPC? **✅ Yes** — S3 static website + VPC endpoint + bucket policy restricting to vpc endpoint

**Q370:** What tool migrates NFS/SMB shares to EFS/FSx? **✅ AWS DataSync** — scheduled data transfer agent

**Q371:** What is the S3 "consistency model" since Dec 2020? **✅ Strong read-after-write consistency** for all S3 operations (previously eventual)

**Q372:** Maximum EFS storage limit? **✅ No maximum** — auto-scales to petabytes

**Q373:** Can S3 lifecycle rules apply to specific object tags? **✅ Yes** — lifecycle rules can filter by prefix AND/OR object tags

**Q374:** What S3 class is designed for non-critical, reproducible data in a single AZ? **✅ S3 One Zone-IA** (20% cheaper than Standard-IA)

**Q375:** A company needs 100 GiB EBS volume with consistent 3000 IOPS. Best choice? **✅ gp3** — independently configure IOPS (up to 16000) regardless of volume size

**Q376:** S3 Transfer Acceleration uses which infrastructure to speed up uploads? **✅ CloudFront edge locations** as upload endpoints → AWS private network → S3

**Q377:** Can you increase an EBS volume size without stopping EC2? **✅ Yes** — ElasticVolumes allows live resize (then extend filesystem with OS command)

**Q378:** What is S3 "Batch Operations" used for? **✅ Perform bulk operations on S3 objects** (copy, tag, restore from Glacier, invoke Lambda, change ACLs) at massive scale

**Q379:** How many durability copies does S3 store internally? **✅ Multiple copies across multiple AZs** (at least 3 AZs for Standard/Standard-IA) — 11 9s durability

**Q380:** What service provides automated EBS snapshot lifecycle management? **✅ Amazon Data Lifecycle Manager (DLM)** — schedule, retain, copy cross-region

**Q381:** Can two EC2 instances in different AZs share the same EBS volume? **✅ No** (unless io1/io2 Multi-Attach, same AZ only)

**Q382:** S3 Replication requires which setting to be enabled on source bucket? **✅ Versioning** must be enabled on both source and destination

**Q383:** What is S3 "Requester Pays" primarily used for? **✅ Large public datasets** where data owners (AWS Marketplace data providers) don't want to pay for all the download costs

**Q384:** EFS throughput can scale up to? **✅ 10 GB/s** (Max I/O mode, multiple clients)

**Q385:** Which S3 class is billed minimum 30-day storage even if deleted earlier? **✅ Standard-IA and One Zone-IA** (30 days minimum)

**Q386:** What is "S3 Glacier Vault Lock" vs "Object Lock"? **✅ Vault Lock** = Glacier-specific WORM compliance. **Object Lock** = S3 native WORM (recommended)

**Q387:** Can you use S3 Lifecycle to automatically transition objects to S3 Glacier? **✅ Yes** — most common lifecycle pattern: Standard → Standard-IA → Glacier → Expiration

**Q388:** What is the typical use case for AWS Snowball Edge Compute Optimized? **✅ On-premises compute + storage** (edge locations, factory floor, ship) — run EC2 instances + ML models offline

**Q389:** What does "AWS DataSync" do that is different from Snowball? **✅ Online data transfer** (network-based, scheduled sync) vs Snowball = physical device offline transfer

**Q390:** What is the S3 "Intelligent-Tiering" monitoring fee? **✅ $0.0025 per 1,000 objects per month** (waived for objects < 128 KB)

**Q391:** When is EFS the WRONG choice? **✅ When Windows filesystem or SMB is needed** (use FSx for Windows), or when high IOPS random I/O needed (use EBS io2)

**Q392:** What does enabling "S3 Requester Pays" affect in S3 Pre-signed URLs? **✅ Pre-signed URL requests must include `x-amz-request-payer: requester` header**

**Q393:** S3 cross-region replication supports which regions for destination? **✅ Any AWS region** including GovCloud (with appropriate configuration)

**Q394:** Can you use S3 Lifecycle with Object Lock? **✅ Yes** — Lifecycle can extend retention period (not shorten) and expire objects after Object Lock expires

**Q395:** What is "S3 Batch Replication" vs standard CRR? **✅ Batch Replication = replicate existing objects** (CRR only handles new objects going forward)

**Q396:** What storage service provides the LOWEST latency for EC2 workloads? **✅ EC2 Instance Store (NVMe)** — physically attached, sub-ms, but ephemeral

**Q397:** EFS uses which NFS version? **✅ NFSv4.1 and NFSv4.0**

**Q398:** What is the maximum throughput for a single EBS gp3 volume? **✅ 1,000 MB/s** (independently configurable from IOPS)

**Q399:** Can S3 replicate objects between accounts (cross-account CRR)? **✅ Yes** — source configures replication to destination ARN; destination bucket policy must allow source account

**Q400:** Which S3 feature allows pre-populating data from S3 into an in-memory cache for faster access? **✅ Amazon ElastiCache** (application reads from cache first, miss → S3 fetch + cache)

---

> ## 🎯 Set 04 Complete! — Storage & S3 (Q301–Q400)
>
> **Score:** ___/100
>
> ➡️ **Next:** [Exam Set 05 — Databases (Q401-Q500)](./Exam_Set_05_Database.md)
