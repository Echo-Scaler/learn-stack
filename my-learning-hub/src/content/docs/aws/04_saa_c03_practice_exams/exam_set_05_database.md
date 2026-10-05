---
title: "AWS SAA-C03 Practice Exam — Set 05"
description: "A company runs a MySQL database on EC2. They want to migrate to a managed AWS database service that handles backups, patching, Multi-AZ failover automatically,"
---

## AWS SAA-C03 Practice Exam — Set 05
# Databases: RDS, Aurora & DynamoDB | Q401–Q500
## Domain 1 (Security 30%) + Domain 2 (Resiliency 26%) + Domain 3 (Performance 24%)

---

## Q401
**A company runs a MySQL database on EC2. They want to migrate to a managed AWS database service that handles backups, patching, Multi-AZ failover automatically, and supports MySQL. Which service should they choose?**

- **A)** Amazon DynamoDB
- **B)** Amazon RDS for MySQL
- **C)** Amazon Redshift
- **D)** Amazon ElastiCache for Redis

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) DynamoDB → ❌ မှားသည်**
> DynamoDB = NoSQL (key-value/document) ဖြစ်ပြီး MySQL = relational SQL database ဖြစ်ပြီး migration path မဟုတ်ပါ

**B) Amazon RDS for MySQL → ✅ မှန်သည်**
> **Amazon RDS Benefits:**
> - Automated backups (up to 35 days retention)
> - Automated patching (maintenance window)
> - Multi-AZ failover (synchronous standby in another AZ)
> - MySQL compatible (direct migration)
> - Read Replicas for read scaling
> **"managed MySQL"** ကိုမေးလျှင် → **RDS for MySQL**

**C) Amazon Redshift → ❌ မှားသည်**
> Redshift = OLAP data warehouse (analytics, BI) ဖြစ်ပြီး OLTP operational MySQL replacement မဟုတ်ပါ

**D) ElastiCache → ❌ မှားသည်**
> ElastiCache = in-memory caching (Redis/Memcached) ဖြစ်ပြီး persistent relational database မဟုတ်ပါ

---

## Q402
**A company's RDS MySQL instance experiences read performance issues due to high SELECT query load from a reporting application. Writes are only from the main application. What is the BEST solution to improve read performance?**

- **A)** Scale up to a larger RDS instance (vertical scaling)
- **B)** Create an RDS Read Replica and direct reporting queries to it
- **C)** Enable Multi-AZ deployment
- **D)** Add more EBS IOPS to the RDS instance

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Scale up → ❌ မှားသည်**
> Larger instance = expensive ဖြစ်ပြီး writes ကိုပါ scale ဖြစ်ပြုသောကြောင့် over-provisioned ဖြစ်မည်ဖြစ်ပြီး "read performance" problem specifically ကို address မဖြစ်ပါ

**B) RDS Read Replica → ✅ မှန်သည်**
> **RDS Read Replica:**
> - Asynchronous replication from primary
> - Reporting app → Read Replica endpoint (read-only)
> - Primary = writes only → not overloaded
> - Up to 15 replicas (Aurora), 5 replicas (MySQL/PostgreSQL)
> - **"offload reads"** = exact purpose of Read Replicas

**C) Multi-AZ → ❌ မှားသည်**
> Multi-AZ = HA/failover purpose ဖြစ်ပြီး **standby instance reads ကို serve မဖြစ်ပါ** (standby = non-readable) — read performance improvement tool မဟုတ်ပါ

**D) More EBS IOPS → ❌ မှားသည်**
> IOPS increase = write/storage performance improve ဖြစ်ပြီး **read query load distribution** ကို address မဖြစ်ပါ

**💡 Real Exam Tip:**
- **Multi-AZ**: HA/Failover (synchronous, standby NOT readable)
- **Read Replica**: Read scaling (asynchronous, replica IS readable)

---

## Q403
**An RDS MySQL database in Multi-AZ configuration experiences a primary instance failure. What happens automatically?**

- **A)** AWS notifies the team and manually fails over within 30 minutes
- **B)** DNS CNAME automatically switches to the standby instance within 1-2 minutes; applications reconnect using the same endpoint
- **C)** Read Replicas are automatically promoted
- **D)** A new primary is launched in the same AZ within 10 minutes

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Manual failover in 30 min → ❌ မှားသည်**
> Multi-AZ = **automatic** failover (no human intervention) ဖြစ်ပြီး "manual" မဟုတ်ပါ

**B) DNS CNAME switches in 1-2 minutes → ✅ မှန်သည်**
> **Multi-AZ Failover Sequence:**
> 1. Primary fails
> 2. RDS detects failure (health check)
> 3. **DNS CNAME** updates to point to standby
> 4. Standby promoted to primary (same endpoint, different AZ)
> 5. Application reconnects using same endpoint (no connection string change)
> **Typical RTO: 1-2 minutes** (sometimes up to 120 seconds)

**C) Read Replicas promoted → ❌ မှားသည်**
> Read Replicas = **manual** promotion required ဖြစ်ပြီး Multi-AZ standby = automatic promotion ဖြစ်သောကြောင့် different features ဖြစ်သည်

**D) New primary in same AZ → ❌ မှားသည်**
> Standby = **different AZ** ဖြစ်ပြီး (that's the HA design) — same AZ = same failure domain

---

## Q404
**A company wants to migrate from MySQL to a fully managed relational database that automatically scales storage, provides 6-way replication across 3 AZs, and is MySQL-compatible. Which service offers these capabilities?**

- **A)** RDS MySQL with Multi-AZ
- **B)** Amazon Aurora MySQL-compatible edition
- **C)** Amazon DynamoDB
- **D)** RDS MySQL with Read Replicas

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) RDS MySQL Multi-AZ → ❌ မှားသည်**
> RDS MySQL Multi-AZ = 2 copies (primary + standby) ဖြစ်ပြီး storage auto-scale limited ဖြစ်ပြီး "6-way replication across 3 AZs" မဟုတ်ပါ

**B) Amazon Aurora MySQL → ✅ မှန်သည်**
> **Amazon Aurora MySQL advantages over RDS MySQL:**
> - **6 copies of data across 3 AZs** (2 per AZ)
> - Storage auto-scales: 10 GB → **128 TB** automatically
> - Up to **15 read replicas** (vs 5 for MySQL)
> - **5x faster** than standard MySQL
> - Automatic failover < 30 seconds
> MySQL-compatible = minimal code changes
> **"6-way replication + auto-scaling"** = Aurora signature

**C) DynamoDB → ❌ မှားသည်**
> NoSQL, not MySQL-compatible, not relational

**D) RDS MySQL + Read Replicas → ❌ မှားသည်**
> Read Replicas = separate instances ဖြစ်ပြီး "6-way replication" distributed storage system မဟုတ်ပါ

---

## Q405
**A company needs a database that can handle 1 million requests per second with single-digit millisecond latency for session management data (key-value). The schema is flexible and may change frequently. Which database should they choose?**

- **A)** Amazon RDS for MySQL
- **B)** Amazon Aurora PostgreSQL
- **C)** Amazon DynamoDB
- **D)** Amazon ElastiCache for Redis

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်**

**A) RDS MySQL → ❌ မှားသည်**
> RDS = relational, fixed schema ဖြစ်ပြီး "schema changes frequently" + "1 million RPS" + "single-digit ms" = RDS struggles ဖြစ်မည်ဖြစ်ပြီး NoSQL appropriate

**B) Aurora PostgreSQL → ❌ မှားသည်**
> Aurora = excellent performance ဖြစ်ပြီး relational (fixed schema) ဖြစ်ပြီး "schema flexible" + "1M RPS" = DynamoDB ကသာ appropriate

**C) Amazon DynamoDB → ✅ မှန်သည်**
> **DynamoDB capabilities:**
> - **Unlimited scale** (10 trillion items, millions of RPS)
> - **Single-digit millisecond latency** at scale
> - **Flexible schema** (different attributes per item)
> - Key-value + document model = session data perfect fit
> - Serverless, auto-scaling
> **"millions RPS + ms latency + flexible schema"** → DynamoDB

**D) ElastiCache Redis → ❌ မှားသည်**
> Redis = in-memory, sub-millisecond ဖြစ်ပြီး persistence = limited (memory-based) ဖြစ်ပြီး "session management" ကို Redis ဖြင့်ပါ ဖြစ်ရနိုင်သော်လည်း **DynamoDB** = more appropriate for exam context (durable, more features)

---

## Q406
**A company uses DynamoDB for their e-commerce platform. They notice hot partitions causing throttling errors. Most reads are for a few popular products. What is the BEST solution?**

- **A)** Switch to RDS for better query performance
- **B)** Enable DynamoDB DAX (DynamoDB Accelerator) in-memory cache
- **C)** Increase RCU/WCU significantly
- **D)** Add more DynamoDB tables

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Switch to RDS → ❌ မှားသည်**
> RDS = inappropriate for this scale (millions RPS) ဖြစ်ပြီး hot partition problem ≠ relational DB solution

**B) DynamoDB DAX → ✅ မှန်သည်**
> **DynamoDB Accelerator (DAX):**
> - **In-memory cache** for DynamoDB (microsecond latency vs ms)
> - Caches popular items → hot partition load dramatically reduced
> - Drop-in replacement (same DynamoDB API)
> - Eventual consistency reads only
> **"hot partitions"** + **"popular items"** → **DAX** = perfect solution

**C) Increase RCU/WCU → ❌ မှားသည်**
> More capacity = helps but expensive ဖြစ်ပြီး fundamental hot partition problem ကို address မဖြစ်ပါ — popular items ဆက်မှ same partition ကို hit ဖြစ်မည်

**D) More tables → ❌ မှားသည်**
> More tables = application complexity ဖြစ်ပြီး caching solution မဟုတ်ပါ

---

## Q407
**A company uses Aurora with 5 read replicas. They want automatic failover to a read replica if the primary writer fails. How quickly does Aurora promote a read replica to primary?**

- **A)** 15-30 minutes (like standard RDS failover)
- **B)** Less than 30 seconds (Aurora native failover)
- **C)** Instant (no failover needed, Aurora is always available)
- **D)** Depends on the application reconnect time

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) 15-30 minutes → ❌ မှားသည်**
> RDS MySQL Multi-AZ failover = 1-2 minutes ဖြစ်ပြီး Aurora = much faster (< 30 seconds)

**B) Less than 30 seconds → ✅ မှန်သည်**
> **Aurora Failover:**
> - Shared distributed storage → promoted replica = already has all data
> - No data sync needed (vs RDS standby)
> - **Aurora Tier 0 replica** = promoted first
> - Typical failover: **< 30 seconds** (some cases < 10 seconds)
> **Aurora = much faster failover than standard RDS**

**C) Instant → ❌ မှားသည်**
> Not instant — DNS propagation + reconnection takes some time (but < 30 seconds)

**D) Only app reconnect time → ❌ မှားသည်**
> Failover time = Aurora promotion time + DNS propagation + app reconnect (all combined)

---

## Q408
**A company runs a DynamoDB table with millions of records. They need to run analytics queries (aggregations, GROUP BY, JOINs) on this data that DynamoDB doesn't natively support. What is the BEST solution?**

- **A)** Run complex SQL queries directly on DynamoDB
- **B)** Export DynamoDB table to S3 → Query with Amazon Athena
- **C)** Replicate to RDS and run SQL queries
- **D)** Use DynamoDB PartiQL for complex analytics

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) SQL queries on DynamoDB → ❌ မှားသည်**
> DynamoDB ≠ full SQL (only simple key access, PartiQL for basic queries) ဖြစ်ပြီး GROUP BY, JOINs = not natively supported

**B) DynamoDB → S3 Export → Athena → ✅ မှန်သည်**
> **DynamoDB + Athena Analytics Pattern:**
> 1. DynamoDB → **Export to S3** (DynamoDB Streams or point-in-time export)
> 2. Amazon Athena → SQL query on S3 data
> 3. Full SQL (aggregations, JOINs, GROUP BY)
> Production DynamoDB = unaffected, analytics = separate S3 data

**C) Replicate to RDS → ❌ မှားသည်**
> Constant sync = complex ဖြစ်ပြီး S3+Athena ကသာ simpler + cheaper

**D) DynamoDB PartiQL → ❌ မှားသည်**
> PartiQL = SQL-compatible syntax for DynamoDB ဖြစ်ပြီး complex analytics (GROUP BY across all items) = not efficient (full table scan)

---

## Q409
**A company needs ACID-compliant transactions across multiple DynamoDB tables in a single atomic operation. Which DynamoDB feature supports this?**

- **A)** DynamoDB Batch Write
- **B)** DynamoDB Streams
- **C)** DynamoDB Transactions (TransactWriteItems / TransactGetItems)
- **D)** DynamoDB Global Tables

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Batch Write → ❌ မှားသည်**
> Batch Write = up to 25 items write ဖြစ်ပြီး **atomic (all-or-nothing) transaction guarantee မဟုတ်ပါ** — individual items may succeed or fail independently

**B) DynamoDB Streams → ❌ မှားသည်**
> Streams = change data capture (CDC) feature ဖြစ်ပြီး transaction support tool မဟုတ်ပါ

**C) DynamoDB Transactions → ✅ မှန်သည်**
> **DynamoDB ACID Transactions:**
> - `TransactWriteItems`: Up to 100 items/tables, all-or-nothing
> - `TransactGetItems`: Consistent read of multiple items atomically
> - **ACID**: Atomicity, Consistency, Isolation, Durability
> - Use case: Transfer money (debit account A + credit account B = atomic)

**D) Global Tables → ❌ မှားသည်**
> Global Tables = multi-region replication ဖြစ်ပြီး multi-table atomic transactions tool မဟုတ်ပါ

---

## Q410
**A company wants DynamoDB data to be automatically replicated across 3 AWS regions (us-east-1, eu-west-1, ap-northeast-1) for global users with low latency. Which feature provides this?**

- **A)** DynamoDB Cross-Region Read Replicas
- **B)** DynamoDB Global Tables
- **C)** AWS DMS cross-region replication
- **D)** S3 cross-region replication of DynamoDB exports

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) DynamoDB Cross-Region Read Replicas → ❌ မှားသည်**
> DynamoDB = read replicas concept ကမရှိပါ — ၎င်းသည် RDS feature ဖြစ်သည်

**B) DynamoDB Global Tables → ✅ မှန်သည်**
> **DynamoDB Global Tables:**
> - Fully managed, multi-region, multi-active
> - All regions = read AND write
> - Automatic replication (seconds lag)
> - Local users → local region table → low latency
> - Conflict resolution: Last-Writer-Wins
> **"global users"** + **"multi-region"** + **"DynamoDB"** → **Global Tables**

**C) AWS DMS → ❌ မှားသည်**
> DMS = migration tool + ongoing replication ဖြစ်ပြီး Global Tables ကဲ့သို့ multi-active managed solution မဟုတ်ပါ

**D) S3 replication of exports → ❌ မှားသည်**
> Indirect + eventual consistency = far from real-time DynamoDB global access

---

## Q411–Q500 (Rapid Fire Database Questions)

---

## Q411
**A company needs database connection pooling to reduce RDS connection limits and improve scalability for a serverless Lambda application. Which service helps?**

- **A)** ElastiCache Redis
- **B)** Amazon RDS Proxy
- **C)** Route 53 latency routing
- **D)** DynamoDB DAX

**✅ B — RDS Proxy pools and manages connections between Lambda/applications and RDS, reducing connection overhead (Lambda = many short connections = DB connection exhaustion)**

မြန်မာ: RDS Proxy = Lambda functions (ephemeral, many connections) + RDS (limited connections) ကြား connection pool manage ဖြစ်ပြုသောကြောင့် "too many connections" error ကို prevent ဖြစ်ပြုသည်

---

## Q412
**What is the difference between RDS Multi-AZ and Aurora Multi-AZ (Global Database)?**

- **A)** They are identical features
- **B)** RDS Multi-AZ = 2 copies synchronous; Aurora = 6 copies across 3 AZs + Global DB option for cross-region
- **C)** Aurora Multi-AZ only exists for PostgreSQL
- **D)** RDS Multi-AZ allows read from standby

**✅ B**

မြန်မာ:
- RDS Multi-AZ: Primary + 1 Standby (synchronous), standby = not readable
- Aurora: 6 copies/3 AZs (always), **Aurora Global Database** = cross-region replication (< 1 second lag)

---

## Q413
**A company's RDS database has backup retention set to 7 days. They need to restore the database to a specific point-in-time 5 days ago. Is this possible?**

- **A)** No — only daily snapshots available
- **B)** Yes — Point-in-Time Recovery (PITR) uses transaction logs to restore to any second within the retention window
- **C)** Yes — but requires manual log replay
- **D)** Only to the nearest hour, not specific second

**✅ B**

မြန်မာ: RDS PITR = automated backups + binary/transaction logs → restore to any second within retention period. Very granular recovery (near zero RPO for recent data).

---

## Q414
**DynamoDB table uses "On-Demand" capacity mode vs "Provisioned" mode. When is On-Demand the BETTER choice?**

- **A)** When traffic is predictable and consistent
- **B)** When traffic is unpredictable, spiky, or for new applications with unknown load
- **C)** When you need the lowest possible cost
- **D)** When using DynamoDB DAX

**✅ B**

မြန်မာ:
- **Provisioned**: Known traffic → cost-effective (pre-plan RCU/WCU)
- **On-Demand**: Unknown/spiky traffic → pay per request, no capacity planning, more expensive per request but no waste

---

## Q415
**A company needs to run complex analytical queries on their relational data with petabytes of data. Which AWS database service is designed for this OLAP workload?**

- **A)** Amazon RDS MySQL
- **B)** Amazon DynamoDB
- **C)** Amazon Redshift
- **D)** Amazon ElastiCache

**✅ C**

မြန်မာ: Redshift = columnar data warehouse = OLAP (analytics, BI, complex aggregations). RDS/Aurora/DynamoDB = OLTP (operational, transactional). "Petabytes + analytics" → Redshift

---

## Q416
**A company uses RDS and wants to prevent production database from being accidentally deleted. What should they enable?**

- **A)** Enable RDS encryption
- **B)** Enable RDS deletion protection
- **C)** Enable Multi-AZ
- **D)** Create IAM Deny policy

**✅ B**

မြန်မာ: **RDS Deletion Protection** = enabled → delete attempt via console/API/CloudFormation → error "Cannot delete protected database". Must explicitly disable protection before deletion.

---

## Q417
**A company needs to encrypt an existing unencrypted RDS database. What is the CORRECT procedure?**

- **A)** Enable encryption directly on the running RDS instance
- **B)** Take a snapshot → Copy snapshot with encryption → Restore from encrypted snapshot → Update endpoint
- **C)** Enable encryption in RDS settings without downtime
- **D)** Use KMS to encrypt existing database files

**✅ B**

မြန်မာ: Cannot encrypt existing unencrypted RDS in-place. Correct process:
1. Take snapshot
2. Copy snapshot with KMS encryption
3. Restore new encrypted DB from snapshot
4. Update application endpoint

---

## Q418
**A company uses Aurora MySQL. They want to reduce database costs for a dev environment that only runs 8 hours/day. Which Aurora feature minimizes costs?**

- **A)** Aurora Read Replicas
- **B)** Aurora Serverless v2
- **C)** Aurora Reserved Instances
- **D)** Aurora Global Database

**✅ B**

မြန်မာ: **Aurora Serverless v2** = auto-scales from 0.5 ACU to hundreds. Dev environment (intermittent use) → scales to near 0 when idle → dramatic cost savings vs always-on cluster.

---

## Q419
**What is DynamoDB's "Partition Key" design best practice to avoid hot partitions?**

- **A)** Use the same partition key for all items
- **B)** Choose a high-cardinality attribute with uniform access distribution
- **C)** Use timestamp as partition key
- **D)** Use auto-increment integer as partition key

**✅ B**

မြန်မာ: Good partition key = high cardinality + uniform distribution = each partition gets equal traffic.
Bad examples: status (only 3 values = hot!), date (today = hot!), auto-increment (sequential = single partition hot!)

---

## Q420
**A company runs Amazon Aurora with 5 Aurora Replicas. They want the application to automatically distribute read requests across all replicas. What should they use?**

- **A)** Custom DNS round-robin
- **B)** Aurora's cluster Reader Endpoint (automatically load-balances read requests across all replicas)
- **C)** Create an ALB in front of Aurora replicas
- **D)** Use Route 53 to route to individual replica endpoints

**✅ B**

မြန်မာ: Aurora Endpoints:
- **Cluster (Writer) Endpoint**: Primary only (writes)
- **Reader Endpoint**: Load-balanced across ALL replicas (auto-distributes reads)
- **Instance Endpoint**: Specific instance

---

## Q421
**What is "DynamoDB Streams" used for?**

- **A)** Streaming data FROM DynamoDB to Kinesis
- **B)** Change Data Capture (CDC) — triggers Lambda functions when items are created, updated, or deleted
- **C)** Streaming data into DynamoDB
- **D)** Backup streaming to S3

**✅ B**

မြန်မာ: DynamoDB Streams = ordered log of item changes (Create/Update/Delete) → trigger Lambda → real-time processing (audit trail, cross-region sync, event-driven)

---

## Q422
**A company needs cross-region disaster recovery for their Aurora database with RPO < 1 second and RTO < 1 minute. Which feature meets this?**

- **A)** Aurora Read Replicas in another region
- **B)** Aurora Global Database with secondary cluster in another region
- **C)** RDS Multi-AZ with cross-region read replicas
- **D)** DynamoDB Global Tables for Aurora

**✅ B**

မြန်မာ: **Aurora Global Database:**
- Primary region: full read/write
- Secondary regions: low-latency read replicas (< 1 second replication lag)
- Failover: Promote secondary → **< 1 minute RTO**
- RPO: < 1 second (replication lag)

---

## Q423
**A company has a legacy application using SQL Server. They want to migrate to AWS with minimal code changes. Which database should they choose?**

- **A)** Amazon RDS for SQL Server
- **B)** Amazon Aurora (rewrite to MySQL)
- **C)** Amazon DynamoDB
- **D)** Amazon Redshift

**✅ A**

မြန်မာ: RDS for SQL Server = Microsoft SQL Server managed on AWS. Minimal code changes (same SQL Server engine). Supports SQL Server 2012-2022, various editions.

---

## Q424
**A company uses ElastiCache Redis for session caching. They want sessions to persist even after a Redis cluster restart. Which Redis feature enables this?**

- **A)** Redis Cluster mode
- **B)** Redis persistence (AOF - Append Only File or RDB snapshots)
- **C)** Redis Read Replicas
- **D)** Redis AUTH

**✅ B**

မြန်မာ: Redis persistence options:
- **RDB**: Periodic snapshots (faster recovery, some data loss)
- **AOF**: Log every write (slower, less data loss)
Enable in ElastiCache configuration to persist data across restarts.

---

## Q425
**What is the difference between ElastiCache Redis and Memcached?**

- **A)** They are identical
- **B)** Redis: persistent, pub/sub, sorted sets, Multi-AZ, complex data; Memcached: simple, multi-threaded, no persistence, no replication
- **C)** Memcached supports more data types than Redis
- **D)** Redis is older and being deprecated

**✅ B**

မြန်မာ:
| Feature | Redis | Memcached |
|---------|-------|-----------|
| Persistence | Yes | No |
| Replication | Yes | No |
| Data types | Rich (strings, lists, sets, sorted sets, hashes) | Simple strings |
| Pub/Sub | Yes | No |
| Multi-AZ | Yes | No |
**SAA exam**: Redis = almost always the right choice unless "simple, no persistence, multi-threaded" specifically mentioned

---

## Q426
**A company's DynamoDB table has a Global Secondary Index (GSI) on the "category" attribute. A query needs to find all items in category="electronics" sorted by price. What DynamoDB components are needed?**

- **A)** Scan the entire table and filter
- **B)** GSI with category as partition key + price as sort key → Query with Begins_With or Between
- **C)** Create a separate table for categories
- **D)** Use DynamoDB Select with ORDER BY

**✅ B**

မြန်మာ: GSI design:
- Partition Key: category
- Sort Key: price
- Query: `KeyConditionExpression = "category = :cat"` → returns all electronics sorted by price (ascending/descending)

---

## Q427
**A company wants to implement in-memory caching layer between their application and RDS to improve read performance. Cache should expire entries after 1 hour. Which service should they use?**

- **A)** CloudFront caching
- **B)** ElastiCache Redis with TTL (Time-To-Live) configuration
- **C)** DynamoDB DAX
- **D)** S3 as a cache layer

**✅ B**

မြန်မာ: **ElastiCache Redis for RDS caching:**
- Application → check Redis first → hit: return cached (fast)
- Miss: query RDS → store in Redis with TTL=3600 (1 hour) → return
- 1-hour TTL = entries auto-expire (fresh data)

---

## Q428
**A company uses RDS. During maintenance windows, updates cause brief downtime. They want near-zero downtime during maintenance. Which approach helps?**

- **A)** Enable Multi-AZ — during maintenance, Multi-AZ performs failover: secondary updated first, then primary promoted
- **B)** Disable automated maintenance
- **C)** Use Read Replicas during maintenance
- **D)** Switch to DynamoDB

**✅ A**

မြန်မာ: RDS Multi-AZ maintenance:
1. Secondary AZ instance patched first (no downtime)
2. Failover: secondary promoted to primary (brief 1-2 min)
3. Old primary patched
4. Available again
Near-zero downtime vs Single-AZ (patch while primary = full downtime)

---

## Q429
**A company needs to run a PostgreSQL database with millions of connections from microservices. RDS is being overwhelmed with connection attempts from Lambda functions. What is the BEST solution?**

- **A)** Increase RDS max_connections parameter
- **B)** Use Amazon RDS Proxy (manages connection pools)
- **C)** Switch to Aurora
- **D)** Increase Lambda timeout

**✅ B**

မြန်မာ: Lambda functions = very short-lived, create new DB connection per invocation → DB connection exhaustion.
RDS Proxy = connection pooling → Lambda connects to Proxy (fast) → Proxy reuses pooled connections → RDS sees fewer connections

---

## Q430
**A company needs a fully managed, highly available in-memory database for real-time leaderboards requiring sorted rankings. Which service and data structure is BEST?**

- **A)** ElastiCache Memcached with hash tables
- **B)** DynamoDB with GSI
- **C)** ElastiCache Redis with Sorted Sets (ZADD/ZRANGE)
- **D)** RDS MySQL with ORDER BY query

**✅ C**

မြန်မာ: **Redis Sorted Sets:**
- ZADD leaderboard 1500 "player1" → add player with score
- ZRANGE leaderboard 0 -1 WITHSCORES → get all ranked by score
- O(log N) operations → real-time leaderboards, rate limiting, ranking systems
**"leaderboard + real-time ranking"** → **Redis Sorted Sets**

---

## Q431–Q500 (Final Database Rapid Fire)

---

**Q431:** What is "Aurora Multi-Master"?
**✅ B** — Multiple writer nodes (all AZs = writer) → higher write availability. Use for applications requiring continuous write availability.

---

**Q432:** A company uses DynamoDB. They need to export ALL current data to S3 for ML training without impacting production. What should they use?
**✅ C** — **DynamoDB Point-in-Time Export to S3** (exports full table snapshot without consuming RCUs)

---

**Q433:** What is the maximum RDS automated backup retention period?
**✅ B** — **35 days** (0 = disable automated backups)

---

**Q434:** A company uses Aurora. Which Aurora feature automatically scales compute capacity based on load?
**✅ A** — **Aurora Serverless v2** — instantly scales up/down in fine-grained increments (0.5 ACU granularity)

---

**Q435:** How many Read Replicas does Aurora MySQL support?
**✅ C** — **Up to 15 Aurora Replicas** (vs 5 for standard RDS MySQL/PostgreSQL)

---

**Q436:** A company needs to run Cassandra-compatible workloads on AWS as a managed service. Which service should they choose?
**✅ B** — **Amazon Keyspaces (for Apache Cassandra)** — managed CQL-compatible service

---

**Q437:** What is "DynamoDB Time-to-Live (TTL)"?
**✅ A** — Automatically delete items after an expiry timestamp. Free operation (doesn't consume WCUs). Use for session data, audit logs, cache-like tables.

---

**Q438:** Can an RDS database be in multiple VPCs simultaneously?
**✅ D** — No. RDS = single VPC (specific subnet group). Cross-VPC access = VPC Peering or Transit Gateway.

---

**Q439:** A company wants analytics directly on their Aurora database without impacting production. Which feature enables this?
**✅ B** — **Aurora Parallel Query** — pushes query processing to storage layer, reduces impact on primary

---

**Q440:** What is DynamoDB "Adaptive Capacity"?
**✅ C** — Automatically shifts throughput to hot partitions (within table's provisioned capacity). Reduces throttling from uneven access patterns.

---

**Q441:** Which RDS feature allows you to stop an RDS instance to save costs when not in use?
**✅ A** — RDS Stop: can stop for up to 7 days (auto-starts after 7 days). Storage charges continue, compute stops.

---

**Q442:** A company's DynamoDB application occasionally needs to read items that were written milliseconds ago. Which consistency model should they use?
**✅ B** — **Strongly Consistent Reads** (GetItem with ConsistentRead=True) → reflects all successful writes

---

**Q443:** What is "Neptune" in AWS?
**✅ C** — **Amazon Neptune** — fully managed graph database (social networks, fraud detection, knowledge graphs). Supports Gremlin and SPARQL.

---

**Q444:** A company uses DynamoDB and needs to perform a full table scan with filtering. What is a concern?
**✅ B** — Full Scan = reads ALL items (all partitions) then filters → consumes full table RCUs → expensive + slow → use GSI or Query instead

---

**Q445:** Which ElastiCache node type allows in-transit and at-rest encryption?
**✅ C** — Redis 6.x+ supports both in-transit (TLS) and at-rest encryption (KMS). Memcached = limited encryption.

---

**Q446:** What is "Amazon QLDB"?
**✅ A** — **Amazon Quantum Ledger Database (QLDB)** — fully managed, cryptographically verifiable, immutable transaction ledger. Use: financial records, supply chain audit.

---

**Q447:** Can DynamoDB On-Demand tables handle sudden spikes (e.g., from 0 to 1M RPS)?
**✅ B** — On-Demand accommodates sudden spikes up to 2x previous peak. For brand-new tables, accommodates up to 4x previous peak. Beyond that = throttling still possible.

---

**Q448:** What is "RDS Enhanced Monitoring"?
**✅ C** — OS-level metrics (CPU, memory, disk, processes) from **within the RDS instance** at 1-60 second intervals. Different from CloudWatch which is hypervisor-level metrics.

---

**Q449:** A company needs a managed time-series database for IoT sensor data with automatic data lifecycle management. Which AWS service is designed for this?
**✅ B** — **Amazon Timestream** — purpose-built time-series database, automatic tiering from memory to magnetic, SQL-like queries

---

**Q450:** What is "DynamoDB Conditional Writes"?
**✅ A** — Write succeeds ONLY IF specified condition is true (optimistic locking). Example: `ConditionExpression = "attribute_exists(itemId)"` → prevents overwrite if item doesn't exist

---

**Q451:** Which Aurora feature allows individual API calls rather than SQL for database operations?
**✅ C** — **Aurora Data API** — HTTP endpoint for Aurora Serverless. No persistent database connection needed. Good for serverless applications.

---

**Q452:** A company uses RDS MySQL. They need to reduce Read Replica replication lag. What should they consider?
**✅ B** — Replication lag causes: heavy write load on primary, large transactions. Solutions: reduce write load, use larger replica instance, split read workload across multiple replicas

---

**Q453:** What is the difference between DynamoDB "BatchGetItem" and "TransactGetItems"?
**✅ C** — BatchGetItem: parallel individual reads (can partially succeed). TransactGetItems: all-or-nothing, ACID guarantee, consistent snapshot read

---

**Q454:** A company uses Redshift. They want to query data in S3 from Redshift without moving it. What feature enables this?
**✅ A** — **Redshift Spectrum** — query S3 data directly from Redshift using external tables. Data lake + warehouse hybrid.

---

**Q455:** What is the maximum DynamoDB item size?
**✅ B** — **400 KB per item** (all attribute names + values combined)

---

**Q456:** Can you enable encryption at rest on an existing DynamoDB table?
**✅ A** — Yes, unlike RDS. DynamoDB encryption can be changed while the table is live (no downtime).

---

**Q457:** A company uses Aurora with Auto Scaling for read replicas. What metric should they use to trigger Auto Scaling?
**✅ B** — **Aurora CPU Utilization** or **Aurora Replica Lag** → scale out when CPU > threshold or lag increases

---

**Q458:** What is "Amazon DocumentDB"?
**✅ C** — **MongoDB-compatible** managed document database (JSON documents). NOT actually MongoDB (different implementation but compatible API)

---

**Q459:** A company needs to migrate Oracle database to AWS. They want to avoid re-licensing. Which approach is BEST?
**✅ B** — RDS for Oracle (BYOL - Bring Your Own License) OR AWS SCT + DMS to convert to Aurora PostgreSQL (more savings, but requires code changes)

---

**Q460:** What is "RDS IAM Database Authentication"?
**✅ A** — Use IAM user/role authentication token instead of password. EC2 + IAM role → get 15-minute auth token → connect to RDS without password stored. MySQL and PostgreSQL only.

---

**Q461:** Can DynamoDB items in the same table have different attributes?
**✅ A** — Yes! DynamoDB = schemaless. Only partition key (and sort key if defined) are required. Other attributes = flexible per item.

---

**Q462:** What is "Aurora Backtrack"?
**✅ B** — Wind back Aurora cluster to any point in the past **without restoring from backup** (in-place rewind). Useful for recovering from accidental data corruption quickly.

---

**Q463:** A company's ElastiCache Memcached cluster scales to 20 nodes. Application stores 10 GB of session data. What is the benefit of this configuration?
**✅ C** — Memcached partitions data across nodes (distributed hash). 20 nodes = more memory + more throughput. Data = distributed (not replicated).

---

**Q464:** What is "Amazon MemoryDB for Redis"?
**✅ B** — Redis-compatible, **durable** in-memory database (primary database, not just cache). Multi-AZ, transactionally consistent. Use when Redis needs to be primary DB (not just cache layer)

---

**Q465:** When would you use DynamoDB "LSI (Local Secondary Index)" vs "GSI (Global Secondary Index)"?
**✅ C** — LSI: must be defined at creation, same partition key, different sort key, strongly consistent reads possible. GSI: created anytime, different partition key, eventually consistent only.

---

**Q466:** A company needs their RDS database accessible only from within their VPC, not from internet. What should they configure?
**✅ A** — Deploy RDS in **private subnet** (no internet gateway route) → not publicly accessible. Security Groups control access within VPC.

---

**Q467:** What is the purpose of "Aurora Read Endpoint Failover priority" (Tier 0, 1, 2...)?
**✅ B** — When primary fails, Aurora promotes the replica with lowest tier number first. Tier 0 = first promoted, Tier 15 = last. Set important replicas to Tier 0.

---

**Q468:** Can you use AWS Database Migration Service (DMS) for ongoing replication (not just one-time migration)?
**✅ A** — Yes! DMS supports both full load + CDC (Change Data Capture) for ongoing replication from source to target with minimal lag.

---

**Q469:** What is "DynamoDB Partition" in terms of capacity?
**✅ C** — Each partition: max 3,000 RCU + 1,000 WCU + 10 GB storage. DynamoDB auto-splits partitions as data/throughput grows.

---

**Q470:** A company uses ElastiCache Redis with Cluster Mode enabled. What is the benefit?
**✅ B** — Redis Cluster Mode: data partitioned across multiple shards (horizontal scaling beyond single-node memory limit). Each shard = primary + replicas. More scalable than non-cluster mode.

---

**Q471–Q500 (Lightning Database Round)**

**Q471:** Max Aurora storage limit? **✅ 128 TB** (auto-scales)

**Q472:** RDS backup retention default? **✅ 7 days**

**Q473:** Can you take manual snapshots of RDS? Are they affected by backup retention? **✅ Manual snapshots persist UNTIL manually deleted** (not subject to retention period)

**Q474:** What is DynamoDB "WCU"? **✅ Write Capacity Unit** — 1 WCU = 1 KB write per second (strongly consistent)

**Q475:** What is DynamoDB "RCU"? **✅ Read Capacity Unit** — 1 RCU = 4 KB strongly consistent read OR 2 eventually consistent reads per second

**Q476:** Does ElastiCache Redis support pub/sub messaging? **✅ Yes** — PUBLISH/SUBSCRIBE/PSUBSCRIBE commands

**Q477:** Can Aurora replicas be in different regions? **✅ Yes** — with Aurora Global Database

**Q478:** What is "RDS Storage Auto Scaling"? **✅ Automatically increases storage when free space is low** (up to maximum threshold you set)

**Q479:** DynamoDB uses what underlying storage infrastructure? **✅ AWS proprietary storage (SSD)** distributed across multiple servers

**Q480:** Can DynamoDB items be nested (maps, lists within items)? **✅ Yes** — up to 32 levels of nesting. Document-style attribute support.

**Q481:** What is Aurora Serverless v2 minimum capacity? **✅ 0.5 ACU** (Aurora Capacity Units) — scales from near-zero to hundreds

**Q482:** Which DynamoDB API retrieves a single item by primary key? **✅ GetItem** (most efficient, point lookup)

**Q483:** Which DynamoDB API retrieves multiple items by primary key? **✅ BatchGetItem** (up to 100 items or 16 MB)

**Q484:** What is "DynamoDB Accelerator (DAX)" latency? **✅ Microseconds** (vs milliseconds for DynamoDB direct)

**Q485:** Can you restore an RDS automated backup to a different region? **✅ No** (automated backups are region-specific). Manual snapshot = can copy cross-region, then restore.

**Q486:** What is DynamoDB "Scan vs Query" performance difference? **✅ Query = efficient (partition key lookup). Scan = full table read (inefficient, expensive). Avoid scans in production.**

**Q487:** Which Aurora version supports the Data API (HTTP endpoint)? **✅ Aurora Serverless v1 and v2**

**Q488:** Can DynamoDB automatically scale Read Capacity Units? **✅ Yes** — DynamoDB Auto Scaling adjusts provisioned capacity based on CloudWatch metrics

**Q489:** What is Amazon Redshift "Concurrency Scaling"? **✅ Automatically adds transient clusters to handle sudden increases in query demand** — pay per second of scaling

**Q490:** What is "Neptune Streams"? **✅ Ordered sequence of graph changes** (similar to DynamoDB Streams for graph database changes)

**Q491:** A company needs Redis with 99.99% availability SLA. What should they enable? **✅ ElastiCache Redis Multi-AZ with automatic failover** (primary + replica in different AZs)

**Q492:** What is "Redshift Serverless"? **✅ Run Redshift analytics without provisioning clusters** — automatic scaling, pay per RPU (Redshift Processing Unit) used

**Q493:** Can you create DynamoDB tables in a VPC with private access? **✅ Yes** — use VPC Gateway Endpoint for DynamoDB (free, no internet)

**Q494:** What is "RDS Proxy" main security benefit? **✅ Supports IAM authentication and Secrets Manager integration** — applications connect via Proxy using IAM auth

**Q495:** Maximum number of DynamoDB GSIs per table? **✅ 20 GSIs** per table (default, can request increase)

**Q496:** What is "Amazon OpenSearch Service" used for? **✅ Full-text search, log analytics, security analytics** (formerly Elasticsearch Service). Query JSON documents.

**Q497:** When does DynamoDB charge for reads vs writes? **✅ On-Demand: per request. Provisioned: hourly for reserved RCU/WCU regardless of usage.**

**Q498:** What is "Aurora I/O-Optimized" pricing? **✅ Higher instance price, NO I/O charges** — beneficial when I/O costs > 25% of total Aurora cost

**Q499:** Can you use AWS Schema Conversion Tool (SCT) with DMS? **✅ Yes** — SCT converts schema + stored procedures; DMS migrates data

**Q500:** What is the SLA uptime for DynamoDB? **✅ 99.99% availability** (Standard tables, Multi-AZ by default for all regions)

---

> ## 🎯 Set 05 Complete! — Databases (Q401–Q500)
>
> **Score:** ___/100
>
> ➡️ **Next:** [Exam Set 06 — Serverless, High Availability & Monitoring (Q501-Q700)](./Exam_Set_06_Serverless_HA_Monitoring.md)
