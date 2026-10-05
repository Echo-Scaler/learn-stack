---
title: "AWS SAA-C03 Practice Exam — Set 06"
description: "Note: ဤ Set တွင် Q501–Q700 (200 မေးခွန်း) ပါဝင်သောကြောင့် 3 domains ကို cover ဖြစ်သည်"
---

## AWS SAA-C03 Practice Exam — Set 06
# Serverless, High Availability & Monitoring | Q501–Q700
## Combining: Serverless (Lambda, API GW, SQS, SNS) + HA/DR + Monitoring (CloudWatch, CloudTrail)

---

> **Note:** ဤ Set တွင် Q501–Q700 (200 မေးခွန်း) ပါဝင်သောကြောင့် 3 domains ကို cover ဖြစ်သည်
> - **Q501–Q600**: Serverless & Event-Driven Architecture
> - **Q601–Q700**: High Availability, Disaster Recovery & Monitoring

---

# SECTION A: Serverless & Event-Driven (Q501–Q600)

---

## Q501
**A company builds a REST API. They want to expose it without managing servers. The API should scale automatically and they pay only when the API is invoked. Which combination achieves this?**

- **A)** EC2 with Nginx reverse proxy + Auto Scaling
- **B)** Amazon API Gateway + AWS Lambda
- **C)** ALB + ECS Fargate
- **D)** EC2 + Elastic Beanstalk

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) EC2 + Nginx + ASG → ❌ မှားသည်**
> Server management required ဖြစ်ပြီး "without managing servers" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) API Gateway + Lambda → ✅ မှန်သည်**
> **Serverless REST API:**
> - **API Gateway**: HTTP endpoint, auth, throttling, caching, CORS — NO servers
> - **Lambda**: Business logic execution — NO servers
> - **Pay-per-request**: Zero traffic = zero cost
> - **Auto-scaling**: Handles 0 to millions of RPS automatically
> "serverless" + "pay per invocation" + "auto-scale" = API GW + Lambda

**C) ALB + ECS Fargate → ❌ မှားသည်**
> Fargate = serverless containers ဖြစ်သော်လည်း always-running tasks = always-paying ဖြစ်ပြီး "pay only when invoked" မဟုတ်ပါ

**D) EC2 + Elastic Beanstalk → ❌ မှားသည်**
> Beanstalk = EC2-based (manages servers for you but underlying EC2 always running) = not "pay only when invoked"

---

## Q502
**A company processes order events asynchronously. Orders are placed in an SQS queue. Lambda processes each message. If processing fails, the message should be retried up to 3 times. After 3 failures, the failed message should be preserved for analysis. What should they configure?**

- **A)** Increase Lambda timeout
- **B)** Configure SQS Dead Letter Queue (DLQ) + SQS maxReceiveCount=3
- **C)** Enable SQS FIFO queue
- **D)** Enable Lambda reserved concurrency

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Increase Lambda timeout → ❌ မှားသည်**
> Timeout = single execution duration ဖြစ်ပြီး retry + failed message preservation mechanism မဟုတ်ပါ

**B) SQS DLQ + maxReceiveCount=3 → ✅ မှန်သည်**
> **SQS Retry + DLQ Pattern:**
> - `maxReceiveCount = 3`: If message received (fail) 3 times → automatically moved to DLQ
> - **DLQ**: Separate queue stores failed messages for analysis/debugging
> - Lambda failure → message becomes visible again → retry
> - After 3rd failure → DLQ → preserved for investigation

**C) FIFO queue → ❌ မှားသည်**
> FIFO = ordering + exactly-once processing ဖြစ်ပြီး retry + DLQ mechanism ကို address မဖြစ်ပါ

**D) Reserved concurrency → ❌ မှားသည်**
> Reserved concurrency = Lambda concurrency limit ဖြစ်ပြီး message retry/DLQ logic မဟုတ်ပါ

---

## Q503
**An e-commerce application uses SNS to publish "order_placed" events. Multiple downstream services need to process each order: inventory service, email service, and analytics service. All should receive EVERY event. What pattern should they implement?**

- **A)** Single SQS queue — all services share one queue
- **B)** SNS topic → Fan-out to 3 separate SQS queues (one per service)
- **C)** Lambda directly processing events
- **D)** EventBridge routing rules

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Single shared SQS queue → ❌ မှားသည်**
> Single queue = one consumer processes message → other services miss ဖြစ်မည်ဖြစ်ပြီး "ALL should receive EVERY event" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) SNS Fan-out → 3 SQS queues → ✅ မှန်သည်**
> **SNS Fan-out Pattern (Pub/Sub):**
> ```
> SNS Topic (order_placed)
>   ├── SQS Queue 1 → Inventory Lambda
>   ├── SQS Queue 2 → Email Lambda
>   └── SQS Queue 3 → Analytics Lambda
> ```
> SNS message → **all subscribers receive simultaneously** → each SQS = independent processing
> Decoupled, scalable, each service independent

**C) Lambda direct → ❌ မှားသည်**
> Single Lambda = not fan-out ဖြစ်ပြီး multiple services to all receive requires fan-out pattern

**D) EventBridge → ❌ မှားသည်**
> EventBridge = also valid approach ဖြစ်ပြီး SNS Fan-out = simpler for this specific pattern

---

## Q504
**A company uses SQS to decouple applications. They need to ensure that a single message is processed EXACTLY ONCE and message order is preserved. Which SQS queue type should they use?**

- **A)** SQS Standard Queue (best-effort ordering, at-least-once delivery)
- **B)** SQS FIFO Queue (First-In-First-Out, exactly-once, ordered)
- **C)** SQS Long Polling queue
- **D)** SQS Extended Client Library

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) SQS Standard → ❌ မှားသည်**
> Standard: at-least-once delivery (duplicates possible) + best-effort ordering (not guaranteed) → "exactly-once" + "ordered" requirements ကို မဖြည့်ဆည်းနိုင်ပါ

**B) SQS FIFO → ✅ မှန်သည်**
> **FIFO Queue guarantees:**
> - **Exactly-once processing** (deduplication ID)
> - **Ordered delivery** (First-In-First-Out within message group)
> - 3,000 messages/second (with batching), 300 without
> - `.fifo` suffix required in queue name
> **"exactly-once"** + **"order preserved"** → FIFO

**C) Long Polling → ❌ မှားသည်**
> Long Polling = reduce empty poll API calls (reduces cost) ဖြစ်ပြီး ordering/exactly-once delivery mechanism မဟုတ်ပါ

**D) Extended Client Library → ❌ မှားသည်**
> Extended Client = messages > 256 KB (stored in S3) ဖြစ်ပြီး ordering/exactly-once mechanism မဟုတ်ပါ

---

## Q505
**A Lambda function takes 2 minutes to process a complex report. API Gateway has a 29-second timeout. A user triggers this via API. What is the BEST architecture for this use case?**

- **A)** Increase Lambda timeout to 15 minutes
- **B)** API Gateway → Lambda (enqueues job to SQS) → return 202 Accepted → separate Lambda processes from SQS → notify user via SQS/SNS/WebSocket when done
- **C)** Use ALB instead of API Gateway (no timeout)
- **D)** Increase API Gateway timeout

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Increase Lambda timeout → ❌ မှားသည်**
> Lambda max = 15 minutes ဖြစ်ပြီး **API Gateway max timeout = 29 seconds** — API Gateway timeout ကို change မဖြစ်ပါ (hard limit)

**B) Async job pattern → ✅ မှန်သည်**
> **Long-Running Task Pattern:**
> 1. POST /report → Lambda (sync) → enqueue job to SQS → return `202 Accepted` + job ID
> 2. Worker Lambda (triggered by SQS) → process 2-minute report
> 3. Notify user: SNS email / WebSocket / poll status endpoint
> API Gateway = immediate response (< 29s), actual work = async

**C) ALB instead → ❌ မှားသည်**
> ALB timeout = configurable ဖြစ်ပြီး Lambda still max 15 minutes ဖြစ်ပြီး async approach ကသာ correct solution

**D) Increase API Gateway timeout → ❌ မှားသည်**
> API Gateway max timeout = **29 seconds** (hard limit, cannot increase)

---

## Q506
**A company needs to run code whenever an EC2 instance state changes (e.g., from `running` to `stopped`). The code sends a Slack notification. What is the MOST event-driven, serverless approach?**

- **A)** CloudWatch polling every minute checking instance state
- **B)** Amazon EventBridge rule (EC2 state change event) → Lambda function → sends Slack message
- **C)** CloudTrail log analysis with Athena
- **D)** AWS Config rule + SNS notification

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) CloudWatch polling → ❌ မှားသည်**
> Polling every minute = **not event-driven**, delayed notifications (up to 60 seconds) ဖြစ်ပြီး unnecessary API calls

**B) EventBridge + Lambda → ✅ မှန်သည်**
> **EventBridge Event-Driven Architecture:**
> - EC2 state change → EventBridge rule matches `"source": "aws.ec2", "detail-type": "EC2 Instance State-change Notification"`
> - EventBridge → Lambda (real-time, < seconds)
> - Lambda → Slack API call
> **Near-real-time, event-driven, no polling, serverless**

**C) CloudTrail + Athena → ❌ မှားသည်**
> CloudTrail = API call logs, Athena = batch query → not real-time event-driven

**D) Config rule + SNS → ❌ မှားသည်**
> Config + SNS = notification possible ဖြစ်ပြီး but Config = configuration compliance, not EC2 runtime state changes. EventBridge ကသာ appropriate.

---

## Q507
**A company has an SQS queue receiving 1 million messages per day. Lambda processes messages from the queue. They notice Lambda is hitting concurrency limits. What should they do?**

- **A)** Increase SQS message retention period
- **B)** Configure Lambda event source mapping with a reserved concurrency limit + increase it; or use SQS Batch size to process multiple messages per Lambda invocation
- **C)** Switch to SNS
- **D)** Use DynamoDB instead of SQS

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Increase message retention → ❌ မှားသည်**
> Retention = how long messages stay in queue ဖြစ်ပြီး concurrency limits ကို address မဖြစ်ပါ

**B) Reserved concurrency increase + SQS batch size → ✅ မှန်သည်**
> **SQS → Lambda Optimization:**
> - **Batch size**: Process 1-10,000 messages per Lambda invocation (process more per Lambda = fewer concurrent Lambdas needed)
> - **Reserved concurrency**: Increase Lambda concurrent executions
> - Both together = efficient throughput without hitting limits

**C) Switch to SNS → ❌ မှားသည်**
> SNS = pub/sub ဖြစ်ပြီး SQS message queue use case ကို replace မဖြစ်ပါ

**D) DynamoDB instead → ❌ မှားသည်**
> DynamoDB = database ဖြစ်ပြီး message queue replacement မဟုတ်ပါ

---

## Q508
**A company uses Lambda functions. They want Lambda to access resources in a private VPC (RDS, ElastiCache). What must they configure?**

- **A)** Attach an Elastic IP to Lambda
- **B)** Configure VPC settings in Lambda: specify VPC ID, subnets, and security group
- **C)** Create a VPC Peering between Lambda's VPC and the resource VPC
- **D)** Lambda cannot access VPC resources

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Elastic IP on Lambda → ❌ မှားသည်**
> Lambda = EIP ကို attach မဖြစ်ပါ — Lambda ENI (Elastic Network Interface) ကို VPC subnet တွင် create ဖြစ်ပြုသည်

**B) VPC configuration in Lambda → ✅ မှန်သည်**
> **Lambda VPC Integration:**
> - Lambda function settings → VPC → select VPC, subnets, security group
> - Lambda = ENI created in specified subnets → accesses VPC resources (RDS, ElastiCache)
> - **Limitation**: Lambda in VPC = internet access requires NAT Gateway
> - Lambda SG ↔ RDS SG: allow traffic on RDS port

**C) VPC Peering for Lambda → ❌ မှားသည်**
> Lambda in your VPC = same VPC resources directly accessible ဖြစ်ပြီး peering = different VPCs ကြား ဖြစ်ပြီး single VPC Lambda = peering မလိုပါ

**D) Cannot access VPC resources → ❌ မှားသည်**
> Lambda CAN access VPC resources (B option explains how)

---

## Q509
**A company runs multiple microservices. Each service publishes events. Different services need to subscribe to different event types. They want centralized event routing with content-based filtering. Which service is BEST?**

- **A)** SQS FIFO for all events
- **B)** SNS with topic filtering
- **C)** Amazon EventBridge with event buses and rules
- **D)** SQS Standard for all events

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) SQS FIFO → ❌ မှားသည်**
> SQS = point-to-point queue ဖြစ်ပြီး "centralized event routing with filtering" = pub/sub pattern ကို address မဖြစ်ပါ

**B) SNS topic filtering → ❌ မှားသည်**
> SNS = pub/sub with basic attribute filtering ဖြစ်ပြီး complex content-based routing + multiple event types across many services = EventBridge ကသာ better suited

**C) Amazon EventBridge → ✅ မှန်သည်**
> **EventBridge = AWS event routing hub:**
> - Content-based rules (filter by any JSON field)
> - Multiple event buses (custom, partner SaaS)
> - Archive and replay events
> - Schema Registry (event type documentation)
> - Integration with 200+ AWS services + SaaS partners
> **"centralized routing + content-based filtering"** → EventBridge

**D) SQS Standard → ❌ မှားသည်**
> Same as A — point-to-point, not pub/sub routing

---

## Q510
**A Lambda function is triggered by API Gateway. The function must access an external API with rate limiting (max 100 calls/second). 1000 concurrent Lambda invocations could exceed the rate limit. What is the BEST solution?**

- **A)** Increase Lambda timeout to slow down execution
- **B)** Use SQS queue between API Gateway and Lambda; Lambda processes at controlled rate using reserved concurrency limit
- **C)** Add ElastiCache to cache responses
- **D)** Use CloudFront to cache responses

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Increase Lambda timeout → ❌ မှားသည်**
> Longer timeout ≠ rate limit control ဖြစ်ပြီး concurrent executions ကို reduce မဖြစ်ပါ

**B) SQS + Lambda reserved concurrency → ✅ မှန်သည်**
> **Rate Limiting Pattern:**
> - API Gateway → SQS queue (buffer excess)
> - Lambda (triggered by SQS) with **reserved concurrency = 100** (max 100 concurrent)
> - External API = max 100 Lambda × 1 call/Lambda = 100 RPS (within limit)
> - Messages queue in SQS during bursts (no requests lost)
> **SQS = buffer, Lambda concurrency = rate controller**

**C) ElastiCache caching → ❌ မహারသည်**
> Caching = reduce calls for repeated requests ဖြစ်ပြီး rate limiting for external API bursts ကို address မဖြစ်ပါ

**D) CloudFront caching → ❌ မှားသည်**
> CloudFront = CDN (static content) ဖြစ်ပြီး rate limiting for Lambda-to-external-API calls ကို control မဖြစ်ပါ

---

## Q511–Q600 (Serverless Rapid Fire)

---

## Q511
**What is Lambda "Provisioned Concurrency" and when should it be used?**

- **A)** Maximum concurrent executions allowed
- **B)** Pre-initialized execution environments to eliminate cold starts — for latency-sensitive applications
- **C)** Number of requests Lambda can handle per second
- **D)** Lambda memory allocation

**✅ B**

မြန်မာ: Provisioned Concurrency = N execution environments = pre-initialized → user requests = ZERO cold start. Use for: APIs requiring < 100ms consistent latency.

---

## Q512
**A company uses SQS. They want to send the same message to multiple consumers without each consumer receiving a duplicate of another's processed messages. What is WRONG about this scenario?**

- **A)** SQS supports fan-out to multiple consumers
- **B)** SQS Standard = one message → one consumer only. For fan-out → use SNS Fan-out to multiple SQS queues
- **C)** SQS FIFO supports multiple consumers
- **D)** Use SQS Dead Letter Queue for fan-out

**✅ B**

မြန်မာ: SQS = point-to-point (one consumer per message). Fan-out to multiple consumers = SNS topic → multiple SQS subscriptions pattern required.

---

## Q513
**What is SQS "Visibility Timeout"?**

- **A)** Time a message stays in queue before expiring
- **B)** Time a message is hidden from other consumers while being processed (default 30 seconds)
- **C)** Time before DLQ transfer
- **D)** Time SQS holds messages in memory

**✅ B**

မြန်မာ: Visibility Timeout = message being processed ဖြစ်ပြုသောအခါ → hidden from other consumers → processing complete → delete message. Processing > timeout → message visible again → retry.

---

## Q514
**A company uses Step Functions. What is AWS Step Functions used for?**

- **A)** Database query orchestration
- **B)** Orchestrate multiple Lambda functions and AWS services in a workflow with error handling, retries, and parallel execution
- **C)** EC2 Auto Scaling orchestration
- **D)** Load balancing orchestration

**✅ B**

မြန်မာ: Step Functions = visual workflow engine. Lambda function chain → state machine → retry on failure → parallel branches → wait → condition → human approval. Complex workflows without complex code.

---

## Q515
**A company needs to process 10 million SQS messages per hour. What SQS feature reduces API call costs during low-traffic periods?**

- **A)** SQS Short Polling
- **B)** SQS Long Polling (WaitTimeSeconds=20)
- **C)** SQS FIFO
- **D)** SQS Dead Letter Queue

**✅ B**

မြန်မာ: Long Polling = wait up to 20 seconds for messages before returning empty response → reduces empty ReceiveMessage API calls → lower cost. Short Polling = immediate return (more API calls = more cost).

---

## Q516
**What is Lambda "Destination" vs DLQ (Dead Letter Queue)?**

- **A)** They are identical
- **B)** Lambda Destination = route success OR failure to SQS/SNS/EventBridge/Lambda. DLQ = only for failed async invocations to SQS/SNS
- **C)** DLQ supports more services
- **D)** Destination only for synchronous invocations

**✅ B**

မြန်မာ:
- **Lambda Destination**: success → one target, failure → another target. More flexible.
- **DLQ**: only failed async events → SQS or SNS
- Destination = newer, recommended over DLQ

---

## Q517
**A company uses EventBridge to route events. They need to replay all events from the past 7 days to re-process after a bug fix. What EventBridge feature enables this?**

- **A)** EventBridge Pipes
- **B)** EventBridge Archive and Replay
- **C)** EventBridge Cross-Account
- **D)** EventBridge Schema Registry

**✅ B**

မြန်မာ: EventBridge Archive = store all events for specified period → Replay = re-send archived events to bus → re-trigger rules → re-process with fixed code.

---

## Q518
**What is the maximum message size for SQS (without S3 extended client)?**

- **A)** 64 KB
- **B)** 256 KB
- **C)** 1 MB
- **D)** 10 MB

**✅ B — 256 KB** (use SQS Extended Client Library for larger messages via S3)

---

## Q519
**A company's Lambda function processes S3 events but fails when the payload is too large. What should they do?**

- **A)** Increase Lambda memory
- **B)** S3 event notification sends only metadata (key, bucket, size) to Lambda → Lambda reads actual file from S3
- **C)** Increase SQS message size
- **D)** Use EventBridge instead

**✅ B**

မြန်မာ: S3 event → Lambda payload = metadata only (not file content). Lambda reads actual file from S3 using SDK. Never sends file data directly in event.

---

## Q520
**A company uses SNS for notifications. They need to send email, SMS, and HTTP webhook from the same event. How does SNS support this?**

- **A)** SNS supports only one subscriber type per topic
- **B)** SNS supports multiple protocol subscribers: Email, SMS, HTTPS endpoint, SQS, Lambda, Kinesis Firehose — all on same topic
- **C)** Need separate SNS topics per subscriber type
- **D)** Use EventBridge for multi-protocol notifications

**✅ B**

မြန်မာ: Single SNS topic → multiple subscriptions (any combination of Email, SMS, HTTP/S, SQS, Lambda). Single publish → all subscribers receive simultaneously.

---

## Q521
**What is AWS Lambda "SnapStart" used for?**

- **A)** Snap EC2 instances for Lambda
- **B)** Cache Lambda execution environment snapshot (especially for Java) to dramatically reduce cold start time
- **C)** Snapshot Lambda code to S3
- **D)** Auto-scale Lambda snapshots

**✅ B**

မြန်မာ: Lambda SnapStart (Java): Lambda publishes → execution environment initialized → **snapshot taken** → subsequent cold starts = restore from snapshot → up to 10x faster startup

---

## Q522
**A company needs Kinesis Data Streams for real-time data ingestion. What is the difference from SQS?**

- **A)** Kinesis and SQS are identical
- **B)** Kinesis: real-time streaming, multiple consumers, replay data (up to 7 days), ordered per shard. SQS: queuing, message deleted after processing, one consumer per message
- **C)** SQS supports real-time analytics; Kinesis does not
- **D)** Kinesis is for batch processing only

**✅ B**

မြန်မာ:
- **SQS**: Message queue (consume + delete). One consumer, decoupling.
- **Kinesis**: Streaming (multiple consumers read same data, replay). Analytics, real-time.
"Multiple consumers read same data" → Kinesis. "Single consumer, decouple" → SQS

---

## Q523
**What is AWS AppSync primarily used for?**

- **A)** REST API management
- **B)** GraphQL API management with real-time subscriptions and offline data sync
- **C)** Database synchronization
- **D)** Application load balancing

**✅ B**

မြန်မာ: AppSync = managed GraphQL. Real-time subscriptions (WebSocket), offline data sync (mobile apps), multiple data sources (DynamoDB, Lambda, RDS, HTTP).

---

## Q524
**A company uses Lambda. They need to pass configuration values (database connection string, feature flags) without hardcoding. What is the BEST approach?**

- **A)** Hardcode in Lambda code
- **B)** Use Lambda Environment Variables (encrypted at rest with KMS)
- **C)** Store in S3 and download at startup
- **D)** Use Lambda layers

**✅ B**

မြန်မာ: Lambda Environment Variables = key-value pairs configured per function version. KMS encryption at rest. Access via `os.environ['KEY']`. Simple, built-in.

---

## Q525
**A company uses SQS FIFO with multiple consumers. They want to process messages from different customer accounts in parallel but maintain ordering per account. What DynamoDB feature... wait - what SQS FIFO feature helps?**

- **A)** MessageGroupId = different per customer
- **B)** MessageDeduplicationId = different per message
- **C)** Queue visibility timeout
- **D)** FIFO Content-Based Deduplication

**✅ A**

မြန်မာ: **MessageGroupId** = within same group → ordered. Different groups = processed in parallel. CustomerID = MessageGroupId → each customer's messages ordered + customers processed in parallel.

---

## Q526
**A company runs Lambda to process DynamoDB Streams. A Lambda function failed midway. What happens to the DynamoDB stream records?**

- **A)** They are deleted and lost
- **B)** Lambda retries from the same sequence position in the stream until success or record expiry (24 hours)
- **C)** Records go to DLQ immediately
- **D)** Lambda continues with next batch, skipping failed batch

**✅ B**

မြန်မာ: DynamoDB Streams → Lambda: failure → retry same batch → retry until success OR record expires (24 hours) OR bisect batch option. Stream records = ordered + blocking on failure by default.

---

## Q527
**What is Lambda "Layer" used for?**

- **A)** Networking layer configuration
- **B)** Share common libraries, dependencies, and custom runtimes across multiple Lambda functions
- **C)** Lambda concurrency management layer
- **D)** Security layer for Lambda

**✅ B**

မြန်မာ: Lambda Layers = ZIP archive with libraries/dependencies → multiple functions share → smaller deployment package + shared version management. Up to 5 layers per function.

---

## Q528
**A company's SQS queue has messages that occasionally exceed the 256 KB limit. What is the BEST solution?**

- **A)** Split messages into smaller parts
- **B)** Use SQS Extended Client Library: store large message payload in S3, SQS stores S3 reference
- **C)** Use SNS instead
- **D)** Increase SQS message size (not possible)

**✅ B**

မြန်မာ: SQS Extended Client (Java/Python): large payload → S3 storage → SQS message = S3 pointer → consumer = retrieve S3 + process. Max payload: 2 GB in S3.

---

## Q529
**A company wants to route EventBridge events to different destinations based on event content (e.g., "order.country == US" → US Lambda, "order.country == JP" → Japan Lambda). What EventBridge feature enables this?**

- **A)** EventBridge Pipes
- **B)** EventBridge Rules with Event Pattern filtering
- **C)** EventBridge Scheduler
- **D)** EventBridge Archive

**✅ B**

မြန်မာ: EventBridge Rule = event pattern (JSON) + target. Multiple rules on same bus → different content patterns → different targets. Content-based routing without code.

---

## Q530
**A company uses Lambda to process images. Each image processing takes 5 seconds. At peak, 500 images arrive simultaneously. Lambda has 100 concurrent execution limit. What happens to the remaining 400?**

- **A)** They are dropped immediately
- **B)** They are throttled (429 error) if synchronous. If async (SQS trigger) → queued in SQS until Lambda capacity available
- **C)** Lambda automatically scales to 500
- **D)** They wait for 30 minutes

**✅ B**

မြန်မာ:
- Synchronous (API Gateway) → 429 Throttling to caller
- Asynchronous (SQS) → messages stay in SQS queue → Lambda processes when capacity available → no requests lost

---

## Q531–Q600 (Quick Serverless Review)

---

**Q531:** Lambda maximum memory? **✅ 10,240 MB (10 GB)**

**Q532:** Lambda maximum concurrent executions per region (default)? **✅ 1,000 (soft limit, can increase)**

**Q533:** What is SQS message retention period default and maximum? **✅ Default: 4 days. Maximum: 14 days**

**Q534:** API Gateway maximum timeout? **✅ 29 seconds (hard limit)**

**Q535:** What is Lambda "Throttling"? **✅ 429 TooManyRequests** when concurrent executions exceed limit

**Q536:** SNS supports which protocol for mobile push notifications? **✅ APNS (Apple), FCM/GCM (Android), ADM (Amazon) via SNS Mobile Push**

**Q537:** Can Lambda functions run in VPC? What are the trade-offs? **✅ Yes** — VPC = access private resources but cold starts slightly longer (ENI creation)

**Q538:** SQS "Long Polling" maximum wait time? **✅ 20 seconds** (WaitTimeSeconds=20)

**Q539:** What is EventBridge "Scheduler"? **✅ Create time-based schedules** (cron or rate) to trigger targets. Replaces CloudWatch Events scheduled rules with more features.

**Q540:** Lambda function can have maximum how many environment variables? **✅ 4 KB total size** for all environment variables combined

**Q541:** What happens when Lambda's reserved concurrency is set to 0? **✅ Lambda is throttled completely (no invocations allowed)** — useful for emergency stops

**Q542:** SQS FIFO maximum throughput? **✅ 3,000 messages/second with batching**, 300 without

**Q543:** What is "SQS Delay Queue"? **✅ Delay message delivery** for 0-15 minutes (default = 0 seconds)

**Q544:** Lambda "Alias" is used for? **✅ Point to specific Lambda version** — enables blue/green deployment, canary releases with traffic shifting

**Q545:** What is SNS "Message Filtering"? **✅ Subscription filter policies** — subscriber only receives messages matching their filter (reduces unwanted messages)

**Q546:** EventBridge vs CloudWatch Events — key difference? **✅ EventBridge = superset** — includes CW Events + SaaS partners + custom event buses + schema registry + archive/replay

**Q547:** Can Lambda process Kinesis streams? **✅ Yes** — Lambda event source mapping with Kinesis Data Streams (polling based)

**Q548:** What is AWS Lambda "Power Tuning"? **✅ Open-source tool** to find optimal memory configuration for cost vs performance trade-off

**Q549:** SQS message that cannot be processed after maxReceiveCount goes to? **✅ Dead Letter Queue (DLQ)**

**Q550:** Lambda execution role permissions are? **✅ Permissions for what Lambda can DO** (call DynamoDB, write to S3, etc.) — separate from who can invoke Lambda (resource-based policy)

**Q551:** What does Lambda "Reserved Concurrency" guarantee? **✅ Minimum N concurrent executions reserved for this function** (throttles other functions if needed)

**Q552:** SNS topic subscription confirmation for HTTPS endpoints? **✅ AWS sends confirmation URL to endpoint** → endpoint must GET the URL to activate subscription

**Q553:** Can Lambda functions call other Lambda functions? **✅ Yes** — synchronous (InvokeFunction) or async (Event type) or Step Functions for orchestration

**Q554:** What is SQS "Content-Based Deduplication" for FIFO? **✅ SHA-256 hash of message body** used as deduplication ID (no need to provide MessageDeduplicationId manually)

**Q555:** Lambda + SQS integration: when does Lambda scale out? **✅ Automatically when messages accumulate** — Lambda scales 60 executions/minute until queue drains or concurrency limit hit

**Q556:** What service sends SMS messages in AWS? **✅ Amazon SNS** (Simple Notification Service) with SMS protocol subscriptions

**Q557:** Can EventBridge trigger Step Functions? **✅ Yes** — EventBridge rule → Start Step Functions execution target

**Q558:** Lambda "Async Invocation" retry behavior? **✅ Retries 2 times automatically** (total 3 attempts) before sending to DLQ/Destination

**Q559:** What does "Lambda@Edge" do? **✅ Run Lambda at CloudFront edge locations** — customize HTTP requests/responses at the CDN layer (latency, geolocation-based routing, A/B testing)

**Q560:** How is SQS charged? **✅ Per API request** — 1 million free requests/month, then $0.40/million

**Q561:** What is AWS Batch vs Lambda for large compute jobs? **✅ AWS Batch** = long-running batch jobs on EC2/Fargate, no 15-minute limit. Lambda = short event-driven functions.

**Q562:** Can SNS send to Lambda cross-account? **✅ Yes** — SNS subscription + Lambda resource-based policy allowing cross-account

**Q563:** EventBridge "Event Bus" types? **✅ Default bus (AWS events), Custom buses (your app events), Partner buses (SaaS integrations)**

**Q564:** Lambda function URL — what is it? **✅ HTTPS endpoint directly for Lambda** without API Gateway. Simple use case, no auth (by default) or IAM auth.

**Q565:** SQS Batch operations — what can you batch? **✅ SendMessage, DeleteMessage, ChangeMessageVisibility** (up to 10 messages per batch API call)

**Q566:** What does Kinesis Data Firehose do? **✅ Load streaming data to S3, Redshift, OpenSearch, Splunk** — fully managed, no consumers to code

**Q567:** Lambda "Event Source Mapping" — what is it? **✅ Lambda polls SQS/Kinesis/DynamoDB Streams** and invokes function with batch of records

**Q568:** What is the purpose of Lambda "Execution Role"? **✅ IAM role Lambda assumes** to call other AWS services (S3, DynamoDB, CloudWatch Logs, etc.)

**Q569:** Maximum SQS FIFO message group IDs? **✅ No limit** — scale as needed (throughput scales per message group)

**Q570:** API Gateway types — REST vs HTTP API key difference? **✅ HTTP API: faster, cheaper, newer. REST API: more features (usage plans, WAF, API keys).** HTTP API = recommended for most new APIs.

**Q571:** What is "Lambda Concurrency" measured in? **✅ Number of simultaneous executions** (not requests/second)

**Q572:** SQS "ApproximateNumberOfMessagesNotVisible" — what does it represent? **✅ Messages being processed** (in visibility timeout, not visible to other consumers)

**Q573:** How does Lambda "Version" differ from "Alias"? **✅ Version = immutable code snapshot. Alias = mutable pointer to version (can shift traffic between versions).**

**Q574:** What happens to undelivered SNS email notifications? **✅ SNS retries for HTTP endpoints; email = best effort delivery, no retry guarantee**

**Q575:** Lambda execution environment "warm" vs "cold"? **✅ Cold = new environment initialized (slow). Warm = reuse existing environment (fast). Provisioned Concurrency = always warm.**

**Q576:** Can SQS FIFO queues use Lambda event source mapping? **✅ Yes** — Lambda supports FIFO queue as event source (maintains ordering per MessageGroupId)

**Q577:** What is Kinesis Data Streams "Shard"? **✅ Unit of capacity** — 1 shard = 1 MB/s write, 2 MB/s read, up to 1000 records/second

**Q578:** Can Step Functions call third-party APIs? **✅ Yes** — via HTTP Tasks (direct API calls), Lambda, or SDK integrations

**Q579:** What is EventBridge "Pipes"? **✅ Connect event sources to targets** with optional filtering and enrichment between (point-to-point integration without custom Lambda)

**Q580:** Lambda's default timeout? **✅ 3 seconds** (max 15 minutes, configurable)

**Q581:** What is SQS "ApproximateAgeOfOldestMessage" metric used for? **✅ Detect message processing lag** — if age increasing = consumers falling behind

**Q582:** Can Lambda access SSM Parameter Store without VPC? **✅ Yes** — SSM is a public endpoint; Lambda outside VPC can access directly

**Q583:** What is "Fanout + SQS" pattern used for? **✅ Distribute one event to multiple independent processing queues** (inventory, billing, notification all get same order event)

**Q584:** Lambda maximum deployment package size (zipped)? **✅ 50 MB** (zipped, direct upload). 250 MB unzipped. Use S3 for larger packages.

**Q585:** What AWS service orchestrates scheduled batch jobs on Fargate? **✅ AWS Batch with Fargate** compute environment + job scheduler

**Q586:** Can Lambda access Secrets Manager without VPC? **✅ Yes** — Secrets Manager public endpoint accessible from Lambda (internet or VPC Interface Endpoint)

**Q587:** EventBridge supports events from which SaaS partners? **✅ Salesforce, Zendesk, GitHub, Datadog, PagerDuty** (and many more via partner event buses)

**Q588:** What SQS setting determines how long an invisible message remains invisible? **✅ Visibility Timeout** (default 30s, max 12 hours)

**Q589:** Lambda automatically creates which CloudWatch Log Group? **✅ /aws/lambda/function-name** — all Lambda logs go here

**Q590:** What is "Kinesis Enhanced Fan-Out"? **✅ Dedicated 2 MB/s per shard per consumer** (vs shared 2 MB/s for all consumers). Better for multiple consumers needing full throughput.

**Q591:** Can SQS queues be shared between AWS accounts? **✅ Yes** — SQS resource-based policy allows cross-account access

**Q592:** Lambda "Concurrency Burst Limit"? **✅ 3,000 additional concurrent executions per minute** (region-specific rate of scaling)

**Q593:** What does "SQS Short Polling" vs "Long Polling" affect regarding empty responses? **✅ Short Polling: many empty responses (cost). Long Polling: waits for messages (fewer API calls = lower cost)**

**Q594:** Can EventBridge events be delivered to cross-account targets? **✅ Yes** — EventBridge cross-account event delivery via event bus resource policies

**Q595:** Lambda function can access the internet without VPC? **✅ Yes** — Lambda not in VPC = internet access (via AWS managed network). VPC Lambda = needs NAT Gateway.

**Q596:** What is "Step Functions Express Workflow" vs "Standard Workflow"? **✅ Express**: high-volume, short-duration, at-least-once execution, less history. **Standard**: long-running, exactly-once, full history.

**Q597:** Can SNS topic send to SQS queue in different account? **✅ Yes** — with SQS queue policy allowing SNS cross-account access

**Q598:** Lambda pricing model? **✅ Per request + per duration (memory × GB-seconds)** — free tier: 1M requests + 400,000 GB-seconds per month

**Q599:** SQS Standard Queue maximum number of in-flight messages? **✅ 120,000** (FIFO: 20,000)

**Q600:** Which Lambda trigger initiates processing when a file is uploaded to S3? **✅ S3 Event Notification → Lambda** (s3:ObjectCreated events)

---

# SECTION B: High Availability, DR & Monitoring (Q601–Q700)

---

## Q601
**A company needs a disaster recovery strategy for their web application. The application is hosted in us-east-1. They want to minimize both RTO (Recovery Time Objective) and RPO (Recovery Point Objective) but are willing to spend more. Which DR strategy provides the LOWEST RTO and RPO?**

- **A)** Backup and Restore
- **B)** Pilot Light
- **C)** Warm Standby
- **D)** Multi-Site Active-Active

---
**✅ Correct Answer: D**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Backup and Restore → ❌ မှားသည်**
> Cheapest ဖြစ်ပြီး **Highest RTO/RPO** (restore from backup = hours/days) — "minimize RTO/RPO" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Pilot Light → ❌ မှားသည်**
> Core components running (DB), rest off → scale up on disaster (RTO: 10s minutes-hours)

**C) Warm Standby → ❌ မှားသည်**
> Scaled-down version running → scale up on disaster (RTO: minutes) — better than Pilot Light but not minimum

**D) Multi-Site Active-Active → ✅ မှန်သည်**
> **Both regions fully operational simultaneously:**
> - Traffic split between regions (Route 53 weighted/latency)
> - RTO: **near-zero** (traffic routes away immediately)
> - RPO: **near-zero** (active DB sync)
> Most expensive ဖြစ်သော်လည်း **lowest RTO/RPO** guarantee

**💡 DR Strategy Comparison:**
| Strategy | RTO | RPO | Cost |
|----------|-----|-----|------|
| Backup & Restore | Hours | Hours | Lowest |
| Pilot Light | 10min+ | Minutes | Low |
| Warm Standby | Minutes | Seconds | Medium |
| **Multi-Site Active** | **Seconds** | **Seconds** | **Highest** |

---

## Q602
**A company's architecture requires a Recovery Point Objective (RPO) of 1 hour. What does RPO measure?**

- **A)** How long it takes to recover the system after failure
- **B)** The maximum acceptable amount of data loss measured in time (the age of data that must be recovered)
- **C)** The number of replicas needed
- **D)** The cost of recovery

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Recovery time → ❌ မှားသည်**
> Recovery time = RTO (Recovery Time Objective) — different metric

**B) Maximum data loss in time → ✅ မှန်သည်**
> **RPO = Recovery Point Objective:**
> - 1 hour RPO = "we can lose up to 1 hour of data in worst case"
> - System restored to state from max 1 hour ago
> - Implementation: Backup frequency ≥ every 1 hour (or replication)

**C) Number of replicas → ❌ မှားသည်**
> Replicas = implementation detail, not what RPO measures

**D) Recovery cost → ❌ မှားသည်**
> Cost = separate consideration, not RPO definition

**💡 RPO vs RTO:**
- **RPO**: How much DATA can we lose? (backup frequency)
- **RTO**: How long can we be DOWN? (recovery speed)

---

## Q603
**A company uses Amazon CloudWatch. They want to receive an email alert whenever CPU utilization on any EC2 instance exceeds 80% for 5 consecutive minutes. What should they configure?**

- **A)** CloudWatch Dashboard with email integration
- **B)** CloudWatch Alarm on EC2 CPUUtilization metric → SNS topic → email subscription
- **C)** CloudTrail with SNS notification
- **D)** AWS Config rule for CPU monitoring

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) CloudWatch Dashboard → ❌ မှားသည်**
> Dashboard = visualization ဖြစ်ပြီး automated alerts မဟုတ်ပါ

**B) CloudWatch Alarm → SNS → Email → ✅ မှန်သည်**
> **CloudWatch Alarm Configuration:**
> - Metric: `AWS/EC2` → `CPUUtilization`
> - Condition: `> 80%`
> - Period: 300 seconds (5 minutes)
> - Evaluation periods: 1 (1 consecutive period = 5 min)
> - Action: SNS topic → email subscription
> **Standard monitoring + alerting pattern**

**C) CloudTrail + SNS → ❌ မှားသည်**
> CloudTrail = API calls log ဖြစ်ပြီး CPU metric monitoring tool မဟုတ်ပါ

**D) AWS Config for CPU → ❌ မှားသည်**
> Config = resource configuration compliance ဖြစ်ပြီး real-time CPU monitoring tool မဟုတ်ပါ

---

## Q604
**A company uses Route 53 for DNS. They want traffic automatically routed to a secondary region when the primary region fails. Which Route 53 routing policy achieves this?**

- **A)** Latency-based routing
- **B)** Weighted routing (50/50 between regions)
- **C)** Failover routing (primary + secondary with health checks)
- **D)** Simple routing

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Latency-based → ❌ မှားသည်**
> Latency routing = closest/fastest region ကို route ဖြစ်ပြုပြီး automatic failover (primary fails → secondary) ဆိုသောကြောင့် failover specific behavior မဟုတ်ပါ

**B) Weighted (50/50) → ❌ မှားသည်**
> Weighted = distribute by percentage ဖြစ်ပြီး failover (primary fails = all to secondary) မဟုတ်ပါ

**C) Failover routing → ✅ မှန်သည်**
> **Route 53 Failover Routing:**
> - PRIMARY record: Health check → if unhealthy → failover
> - SECONDARY record: Receives all traffic when primary fails
> - Health check frequency: 30 seconds or 10 seconds
> - Failover time: ~30-120 seconds (DNS TTL + health check)

**D) Simple routing → ❌ မှားသည်**
> Simple = single IP/value, no health checks, no failover behavior

---

## Q605
**A company operates a web application on ALB + EC2 Auto Scaling. What does the ALB health check do when an EC2 instance fails the check?**

- **A)** ALB terminates the instance immediately
- **B)** ALB stops routing traffic to the unhealthy instance; if ASG is configured with ELB health checks, ASG also terminates and replaces the instance
- **C)** ALB redirects all traffic to another region
- **D)** ALB sends an SNS notification only

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) ALB terminates → ❌ မှားသည်**
> ALB = traffic routing ဖြစ်ပြီး instance lifecycle management (termination) = ASG's responsibility

**B) ALB removes + ASG replaces → ✅ မှန်သည်**
> **ALB + ASG Health Check Integration:**
> 1. ALB: Stops routing to unhealthy instance
> 2. ASG (with ELB health check type): Detects unhealthy → Terminates → Launches replacement
> 3. New instance → registers with ALB → receives traffic
> **Self-healing architecture**

**C) Redirect to another region → ❌ မှားသည်**
> ALB = single region ဖြစ်ပြီး cross-region failover = Route 53 (not ALB)

**D) SNS notification only → ❌ မှားသည်**
> ALB action = stop routing (not just notify). ASG handles replacement.

---

## Q606
**A company wants to monitor their EC2 application memory usage. CloudWatch default metrics don't include memory. What is the CORRECT solution?**

- **A)** Enable CloudWatch detailed monitoring for memory
- **B)** Install CloudWatch Agent on EC2; configure to collect memory metrics; publish to CloudWatch as custom metrics
- **C)** Use AWS Trusted Advisor for memory
- **D)** Enable Enhanced Networking for memory visibility

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Detailed monitoring → ❌ မှားသည်**
> Detailed monitoring = 1-minute granularity for standard metrics (CPU, Network, etc.) ဖြစ်ပြီး memory metric ကို ADD မဖြစ်ပါ

**B) CloudWatch Agent → ✅ မှန်သည်**
> **CloudWatch Agent custom metrics:**
> - Install CloudWatch Agent on EC2 (Systems Manager or manual)
> - Configure `cwagent.json` to collect: `mem_used_percent`, `mem_available`
> - Agent publishes to CloudWatch namespace `CWAgent/`
> - Set alarms on these custom metrics

**C) Trusted Advisor → ❌ မှားသည်**
> Trusted Advisor = periodic best practice checks ဖြစ်ပြီး real-time memory monitoring မဟုတ်ပါ

**D) Enhanced Networking → ❌ မှားသည်**
> Enhanced Networking = network performance ဖြစ်ပြီး memory visibility မဟုတ်ပါ

---

## Q607
**A company needs to detect when an IAM policy change causes a security group to allow unrestricted SSH access (port 22 from 0.0.0.0/0). The detection should be near-real-time. What approach should they use?**

- **A)** Daily manual security audit
- **B)** AWS Config Rule `restricted-ssh` → non-compliant finding → EventBridge → SNS notification
- **C)** CloudTrail log analysis once per week
- **D)** AWS Inspector scan once per day

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Daily manual audit → ❌ မှားသည်**
> Manual + daily = too slow for "near-real-time" requirement

**B) Config Rule + EventBridge + SNS → ✅ မှန်သည်**
> **Real-time Security Compliance:**
> 1. Security Group change → AWS Config evaluates `restricted-ssh` rule
> 2. Config rule → **NON_COMPLIANT** finding
> 3. **EventBridge** rule (Config compliance change event) → trigger
> 4. **SNS** → email/Slack notification
> Near-real-time (Config evaluates within seconds/minutes of resource change)

**C) Weekly CloudTrail analysis → ❌ မှားသည်**
> Weekly = too slow, not "near-real-time"

**D) Daily Inspector scan → ❌ မှားသည်**
> Inspector = vulnerability (CVE) scanning ဖြစ်ပြီး Security Group misconfiguration detection = Config's domain

---

## Q608
**A company uses CloudWatch Logs. They need to search for ERROR patterns across multiple log groups and create a notification. What should they configure?**

- **A)** Export all logs to S3 and use Athena
- **B)** Create CloudWatch Logs Metric Filter on error pattern → CloudWatch Metric → CloudWatch Alarm → SNS notification
- **C)** Enable CloudTrail for log search
- **D)** Use AWS Config for log monitoring

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) S3 + Athena → ❌ မှားသည်**
> Batch analysis ဖြစ်ပြီး "near-real-time notification" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Metric Filter → Alarm → SNS → ✅ မှန်သည်**
> **CloudWatch Error Detection Pattern:**
> 1. **Log Group** → `Metric Filter`: pattern `[level="ERROR"]` → increment custom metric
> 2. **CloudWatch Alarm**: Custom metric > 0 → ALARM state
> 3. **SNS Topic** → email/PagerDuty notification
> Real-time error detection from application logs

**C) CloudTrail for log search → ❌ မှားသည်**
> CloudTrail = API call logs ဖြစ်ပြီး application error log monitoring မဟုတ်ပါ

**D) Config for log monitoring → ❌ မှားသည်**
> Config = resource compliance ဖြစ်ပြီး application log analysis tool မဟုတ်ပါ

---

## Q609
**A company needs their application to handle the failure of an entire AWS Availability Zone without downtime. What architecture achieves this?**

- **A)** Deploy all resources in a single large AZ
- **B)** Multi-AZ deployment: ALB spanning multiple AZs + Auto Scaling group across 2+ AZs + Multi-AZ RDS
- **C)** Daily backups to another region
- **D)** Use Reserved Instances for guaranteed availability

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Single large AZ → ❌ မှားသည်**
> Single AZ = AZ failure = complete downtime ဖြစ်ပြီး "AZ failure without downtime" requirement ကို directly violate ဖြစ်မည်

**B) Multi-AZ across all tiers → ✅ မှန်သည်**
> **Multi-AZ Architecture:**
> - **ALB**: Distributes to healthy AZs automatically (AZ-1 fails → AZ-2 takes all traffic)
> - **ASG**: Instances in AZ-1 + AZ-2 (auto-rebalance)
> - **RDS Multi-AZ**: Primary in AZ-1 fails → standby in AZ-2 promoted (1-2 min)
> AZ failure = other AZ handles full load — **no downtime**

**C) Cross-region backups → ❌ မှားသည်**
> Backups = DR (hours to restore) ဖြစ်ပြီး "without downtime" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**D) Reserved Instances → ❌ မှားသည်**
> RI = billing model ဖြစ်ပြီး AZ failure protection mechanism မဟုတ်ပါ

---

## Q610
**A company uses CloudWatch and wants to create a comprehensive operational dashboard showing EC2 CPU, RDS connections, Lambda errors, and SQS queue depth across multiple regions. What should they use?**

- **A)** Separate CloudWatch dashboards per service
- **B)** CloudWatch cross-region, cross-account dashboard with widgets from multiple regions and accounts
- **C)** AWS Trusted Advisor consolidated view
- **D)** AWS Config Aggregator dashboard

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Separate dashboards → ❌ မှားသည်**
> Multiple dashboards = fragmented view ဖြစ်ပြီး "comprehensive" single dashboard requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) CloudWatch cross-region/cross-account dashboard → ✅ မှန်သည်**
> **CloudWatch Dashboard features:**
> - Widgets from any region, any account (with cross-account observability setup)
> - Metrics: EC2 CPU, RDS connections, Lambda errors, SQS queue depth — all in one view
> - Custom metrics, log insights, alarms
> - **Single pane of glass** operational view

**C) Trusted Advisor → ❌ မှားသည်**
> Trusted Advisor = recommendations ဖြစ်ပြီး real-time operational dashboard tool မဟုတ်ပါ

**D) Config Aggregator → ❌ မှားသည်**
> Config = resource compliance ဖြစ်ပြီး operational metrics dashboard မဟုတ်ပါ

---

## Q611–Q700 (HA, DR, Monitoring Rapid Fire)

---

**Q611:** What is the difference between RTO and RPO in disaster recovery?
**✅ B** — RTO = how long to recover (downtime), RPO = how much data loss acceptable

**Q612:** A company uses Route 53 with latency-based routing. Traffic is distributed between us-east-1 and ap-northeast-1. If us-east-1 fails, what happens?
**✅ B** — Route 53 health checks detect failure → all traffic routes to ap-northeast-1 (if health checks configured with latency routing)

**Q613:** CloudTrail logs are stored where by default?
**✅ A** — CloudTrail delivers logs to S3 bucket (encrypted). Optionally forward to CloudWatch Logs.

**Q614:** What is "CloudWatch Composite Alarm"?
**✅ C** — Single alarm combining multiple alarms with AND/OR logic. Alert only when MULTIPLE conditions simultaneously true (reduces alarm noise).

**Q615:** What does "CloudWatch Anomaly Detection" do?
**✅ B** — Uses ML to model normal metric behavior → creates dynamic threshold band → alerts when metric deviates from expected pattern

**Q616:** A company needs application traces to debug slow API calls across Lambda, API Gateway, DynamoDB. Which service provides distributed tracing?
**✅ B** — **AWS X-Ray** — distributed tracing, service map, latency analysis, error identification

**Q617:** What is "AWS Health Dashboard" (AWS Personal Health Dashboard)?
**✅ C** — Shows AWS events affecting YOUR specific account (maintenance, failures) vs Service Health Dashboard (all AWS customers)

**Q618:** CloudWatch Logs insights — what can you do with it?
**✅ B** — Query CloudWatch Logs with purpose-built query language (like SQL for logs). Find patterns, aggregates, visualize.

**Q619:** A company wants to implement "Chaos Engineering" in AWS. Which service intentionally injects faults?
**✅ C** — **AWS Fault Injection Simulator (FIS)** — controlled fault injection (EC2 termination, CPU stress, network delays) to test resilience

**Q620:** What is "Application Auto Scaling" vs "EC2 Auto Scaling"?
**✅ B** — EC2 ASG = EC2 instances. Application Auto Scaling = ECS tasks, DynamoDB throughput, Lambda provisioned concurrency, etc. (non-EC2 resources)

**Q621:** A company needs 99.99% availability. What does this mean in terms of downtime?
**✅ C** — 99.99% = Four 9s = **52.6 minutes downtime/year** (99.999% = 5.26 minutes/year)

**Q622:** Which Route 53 routing policy routes traffic based on user's geographic location?
**✅ B** — **Geolocation routing** — based on DNS resolver location. Route EU users to EU servers, US users to US servers.

**Q623:** What is "Route 53 Traffic Flow"?
**✅ C** — Visual editor for complex routing policies combining multiple routing types (weighted + failover + geolocation) using traffic flow rules

**Q624:** A CloudWatch Alarm is in "INSUFFICIENT_DATA" state. What does this mean?
**✅ B** — Not enough data to evaluate the condition (new alarm, no metrics published, metric stopped reporting)

**Q625:** What is "AWS CloudWatch Container Insights"?
**✅ A** — Collects, aggregates metrics from ECS, EKS, Kubernetes. CPU, memory, disk, network per container.

**Q626:** Which service provides deep operational visibility into Kubernetes (EKS) workloads?
**✅ B** — CloudWatch Container Insights + AWS Distro for OpenTelemetry + Managed Prometheus + Managed Grafana

**Q627:** A company wants to test that their Multi-AZ RDS automatically fails over. How?
**✅ C** — RDS Console → Reboot with failover (or AWS CLI `reboot-db-instance --force-failover-db` → simulates AZ failure)

**Q628:** What is "AWS Systems Manager (SSM) OpsCenter"?
**✅ B** — Centralized place to view and manage operational issues (OpsItems). Aggregates findings from Config, CloudTrail, CloudWatch alarms.

**Q629:** A company uses CloudWatch. They want to retain logs for 7 years for compliance. What should they configure?
**✅ C** — **CloudWatch Logs retention policy** (default = Never expire). Set to 2,555 days (7 years). Or export to S3 with lifecycle rules for long-term archival.

**Q630:** What is Route 53 "Geoproximity routing"?
**✅ A** — Route traffic based on geographic location of resources and users with adjustable "bias" to shift more/less traffic to regions

**Q631:** What does "AWS Trusted Advisor" check in the Security category?
**✅ B** — S3 public buckets, unrestricted security groups, root user MFA, IAM password policy, exposed access keys

**Q632:** A company needs centralized log aggregation from 50 AWS accounts. What is the recommended approach?
**✅ C** — CloudWatch cross-account observability → central monitoring account + source accounts publish logs/metrics + central dashboard

**Q633:** What is "CloudWatch Evidently"?
**✅ B** — A/B testing and feature flags service. Gradually roll out features, test variants, measure impact with statistical significance.

**Q634:** What is "AWS Resilience Hub"?
**✅ A** — Assess, validate, and track application resilience. Defines RTO/RPO targets + validates architecture + recommends improvements

**Q635:** A company uses ELB. They want health checks to test actual application functionality, not just HTTP 200. What should they configure?
**✅ C** — Health check path = application-specific endpoint that exercises actual functionality (DB check, dependency check). Returns 200 only when fully healthy.

**Q636:** What is the maximum CloudWatch metric resolution?
**✅ B** — **1 second** (High Resolution custom metrics). Standard = 1 minute.

**Q637:** What is "AWS X-Ray Service Map"?
**✅ A** — Visual representation of distributed application components and their connections. Shows latency, error rates, trace flow.

**Q638:** A company's Elastic Load Balancer drops connections when EC2 instances are terminated. What feature prevents this?
**✅ B** — **Connection Draining (ELB) / Deregistration Delay (ALB/NLB)** — gracefully completes in-flight requests before deregistering

**Q639:** What is "CloudWatch Logs Subscriptions"?
**✅ C** — Stream CloudWatch Logs in real-time to Kinesis, Firehose, Lambda for processing. Enables real-time log analysis pipelines.

**Q640:** What Route 53 routing policy is used for BLUE/GREEN deployments?
**✅ B** — **Weighted routing** — 90%→blue, 10%→green. Gradually shift: 80/20, 50/50, 0/100.

**Q641:** What is "Global Accelerator" vs CloudFront?
**✅ C** — Global Accelerator: Layer 4 (TCP/UDP), static IP, anycast routing. CloudFront: Layer 7 (HTTP/S), CDN caching. Both use AWS global network. Different use cases.

**Q642:** A company uses ALB and needs to add SSL/TLS termination. Where should the certificate be?
**✅ A** — ACM (AWS Certificate Manager) certificate → ALB listener (HTTPS:443). Free for public certs, auto-renewed.

**Q643:** What is CloudWatch "Metric Math"?
**✅ B** — Perform mathematical operations on metrics to create new calculated metrics without storing them (e.g., success rate = success/(success+error) × 100)

**Q644:** A company needs to capture all API calls made to AWS services for a forensic investigation. Which tool has the most comprehensive record?
**✅ A** — **AWS CloudTrail** — logs every management API call (who, what, when, from where)

**Q645:** What is "AWS Config Conformance Pack"?
**✅ C** — Collection of Config rules deployed together as a package (e.g., HIPAA, PCI-DSS pack). Simplifies compliance standard implementation.

**Q646:** What is "Cross-AZ" vs "Cross-Region" failover difference?
**✅ B** — Cross-AZ: same region, different AZ (seconds/minutes failover). Cross-Region: different geographic region (minutes to hours, more complex)

**Q647:** A company's application serves global users. They want static content cached at edge locations and dynamic content forwarded to origin. Which service provides this?
**✅ A** — **Amazon CloudFront** — edge caching for static + proxy for dynamic (cache-control headers determine what's cached)

**Q648:** What is the maximum TTL for Route 53 DNS records?
**✅ C** — **172,800 seconds (48 hours)** maximum. Lower TTL = faster failover but more DNS queries.

**Q649:** A company uses CloudWatch Alarms. They want the alarm to not trigger during planned maintenance. What should they do?
**✅ B** — Temporarily **disable the alarm actions** or set to `OK` state during maintenance. Or use alarm suppression rules (CloudWatch Composite Alarms).

**Q650:** What is "AWS Service Health Dashboard" vs "Personal Health Dashboard"?
**✅ C** — Service Health: public status page for ALL AWS services. Personal Health (AWS Health): YOUR account's specific impacts and maintenance events.

**Q651:** What does "Route 53 Health Check" check?
**✅ B** — HTTP, HTTPS, TCP endpoint health. Returns healthy/unhealthy to Route 53 for failover routing decisions.

**Q652:** What is "Amazon CloudWatch Application Insights"?
**✅ A** — Automatically detects configuration problems in .NET and SQL Server applications on EC2. Provides dashboards and insights without manual setup.

**Q653:** A company needs their Lambda function to retry on failure with exponential backoff for async invocations. What feature provides this natively?
**✅ C** — Lambda async retry = 2 automatic retries with backoff. Customize via Lambda event invoke configuration (MaximumRetryAttempts, MaximumEventAgeInSeconds)

**Q654:** What is "AWS Backup" service?
**✅ B** — **Centralized backup management** for EC2, EBS, RDS, DynamoDB, EFS, Storage Gateway, S3. Backup plans, retention policies, cross-region/account copy.

**Q655:** What Route 53 routing policy distributes based on health AND geographic proximity?
**✅ C** — **Latency-based + failover combination** (or Geoproximity with bias). Route 53 can combine routing policies.

**Q656:** What is CloudWatch "Alarm State"?
**✅ A** — Three states: OK (metric within threshold), ALARM (metric breached threshold), INSUFFICIENT_DATA (not enough data)

**Q657:** A company uses multi-region architecture. How does Route 53 detect region failure for automatic failover?
**✅ B** — Route 53 Health Checks poll endpoint (HTTP/HTTPS/TCP). Healthy → route traffic. Unhealthy → route to failover.

**Q658:** What is "AWS Systems Manager Parameter Store" vs Secrets Manager?
**✅ C** — Parameter Store: free (standard), hierarchical config storage, no auto-rotation. Secrets Manager: paid ($0.40/secret), auto-rotation, better for secrets.

**Q659:** A company's CloudFront distribution is returning 504 errors for some requests. What is the most likely cause?
**✅ B** — Origin server timeout (EC2/ALB not responding within CloudFront timeout). Check: origin health, origin response time, security group allowing CloudFront IPs.

**Q660:** What is "Amazon EventBridge" connection to SaaS partners?
**✅ A** — EventBridge partner event sources (Salesforce, Zendesk, GitHub, etc.) → directly emit events to EventBridge without custom integration code

**Q661:** What is the difference between CloudWatch "Statistics" and "Percentiles"?
**✅ B** — Statistics: Average, Sum, Min, Max, SampleCount. Percentiles (p95, p99): show tail latency (95% of requests are below this value) — better for user experience monitoring.

**Q662:** What is "AWS Well-Architected Tool"?
**✅ C** — Review workloads against 6 pillars of Well-Architected Framework → identify risks → prioritize improvements → milestone tracking

**Q663:** A company wants notifications when EC2 Reserved Instances are expiring in 30 days. What service provides this?
**✅ B** — **AWS Budgets** or **AWS Personal Health Dashboard** — upcoming RI expiration notifications

**Q664:** What CloudWatch feature allows running SQL-like queries against logs?
**✅ A** — **CloudWatch Logs Insights** — purpose-built query language for log analysis

**Q665:** What is "Route 53 Resolver" used for?
**✅ C** — DNS resolution between VPC and on-premises networks (hybrid DNS). Forward/Inbound resolvers enable DNS query forwarding.

**Q666:** A company's Auto Scaling group isn't scaling despite high CPU. What might be the cause?
**✅ B** — Scaling activity cooldown period active, Maximum capacity reached, or scheduled maintenance suppressed scaling

**Q667:** What is "Amazon GuardDuty Threat Intelligence"?
**✅ A** — Uses curated threat feeds (AWS + CrowdStrike + Proofpoint) + ML to detect malicious activity patterns

**Q668:** What is "CloudWatch ServiceLens"?
**✅ C** — Integrates CloudWatch metrics, logs, X-Ray traces into single view for service health monitoring

**Q669:** When should you use "Pilot Light" DR strategy?
**✅ B** — Core infrastructure (database) running in DR region, rest deployed but stopped. Faster than backup/restore, cheaper than warm standby.

**Q670:** What is "AWS Fault Injection Simulator (FIS)" experiment template?
**✅ A** — Defines fault injection: target (specific EC2, RDS), action (CPU stress, terminate, throttle), stop condition (rollback if alarm triggers)

**Q671:** What CloudWatch metric does ALB expose for monitoring request errors?
**✅ C** — HTTPCode_Target_5XX_Count, HTTPCode_ELB_5XX_Count, RequestCount, TargetResponseTime

**Q672:** A company needs all changes to DynamoDB table captured and replayed in real-time. What service combination achieves this?
**✅ B** — DynamoDB Streams → Lambda (process changes) or Kinesis Data Streams for analysis

**Q673:** What is "Route 53 ALIAS record" and why use it vs CNAME?
**✅ B** — ALIAS: Points to AWS resources (ALB, CloudFront, S3), free queries, works at zone apex (example.com). CNAME: Generic, charged per query, NOT at zone apex.

**Q674:** What is "CloudWatch Contributor Insights"?
**✅ A** — Analyze log data to identify top contributors (e.g., top 10 IPs generating errors, top 10 slow API paths)

**Q675:** A company uses CloudFront. They want to block specific countries from accessing their content. What should they configure?
**✅ B** — **CloudFront Geographic Restrictions (Geo-blocking)** — allow or block specific countries

**Q676:** What is "AWS Site Recovery" (CloudEndure / AWS DRS)?
**✅ C** — **AWS Elastic Disaster Recovery** — continuous replication of on-premises/cloud servers to AWS for fast failover (minutes)

**Q677:** What does "Cross-Region Read Replica" of RDS provide for disaster recovery?
**✅ B** — Additional read capacity in another region + can be promoted to standalone DB for failover (RPO: seconds of lag, RTO: minutes for promotion)

**Q678:** What is "CloudWatch Metric Streams"?
**✅ A** — Continuously stream CloudWatch metrics to Kinesis Firehose → S3/Datadog/Splunk/New Relic for near-real-time export

**Q679:** A company uses Global Accelerator. What is the primary benefit for TCP applications?
**✅ C** — Static anycast IP addresses + AWS global network (instead of internet routing) → lower latency, more reliable connection, automatic failover

**Q680:** What CloudWatch feature helps debug Lambda functions during development?
**✅ B** — Lambda automatically sends logs to CloudWatch Logs (/aws/lambda/function-name). Console test → logs visible immediately.

**Q681:** What does "Route 53 Weighted Routing" with weight 0 for a record mean?
**✅ A** — Record with weight 0 = no traffic sent to that endpoint (pause traffic without removing record)

**Q682:** What is the difference between CloudTrail "Management Events" and "Data Events"?
**✅ C** — Management Events: control plane (IAM, EC2, S3 bucket creation). Data Events: data plane (S3 GetObject/PutObject, Lambda Invoke) — additional cost, not logged by default.

**Q683:** What is "AWS Config Recorder" and when is it needed?
**✅ B** — Config Recorder must be running to capture configuration changes. Stopped recorder = no change history. Enable before enabling Config rules.

**Q684:** A company needs a 99.999% (5 nines) SLA architecture. What does this imply?
**✅ C** — 5 nines = 5.26 minutes downtime/year. Requires: Multi-AZ + Multi-Region + Active-Active + automated failover

**Q685:** What is "Amazon Managed Grafana"?
**✅ B** — Managed Grafana workspace for visualization. Integrates with CloudWatch, Prometheus, OpenSearch, X-Ray as data sources.

**Q686:** What is "Amazon Managed Prometheus"?
**✅ A** — Managed Prometheus-compatible monitoring. Import metrics from EKS/Kubernetes → query with PromQL → visualize in Grafana

**Q687:** What does "AWS CloudWatch Alarm based on anomaly detection" do differently from threshold alarms?
**✅ C** — ML model learns normal patterns → dynamic threshold (changes by time of day, day of week) → alarm when metric deviates from learned pattern

**Q688:** What is "Route 53 Application Recovery Controller"?
**✅ B** — Monitors and manages application recovery across AWS regions. Readiness checks + routing control for safe failover.

**Q689:** A company uses AWS Config. Config Rule "required-tags" fails for new resources that don't have required tags. What action can they take automatically?
**✅ A** — Config Auto-Remediation with SSM Automation document to add missing tags

**Q690:** What is "Amazon Kinesis Data Streams" vs "Kinesis Data Firehose"?
**✅ C** — Kinesis Streams: custom consumer code, replayable. Kinesis Firehose: managed delivery to S3/Redshift/OpenSearch (no consumer code, near-real-time).

**Q691:** What is "CloudWatch Dashboard Sharing"?
**✅ B** — Share dashboards publicly or with specific email addresses. Useful for stakeholders who don't have AWS console access.

**Q692:** What is "AWS X-Ray Sampling"?
**✅ A** — Control percentage of requests traced (to manage cost and performance impact). Default: first request/second per host + 5% of remaining.

**Q693:** A company needs their application to maintain 100% availability during database maintenance. What architecture achieves this?
**✅ C** — Multi-AZ RDS (maintenance on standby first → failover → no downtime) + ElastiCache (cache reads during failover window)

**Q694:** What is "CloudTrail Lake"?
**✅ B** — Managed data lake for CloudTrail events. Query with SQL, retain 7 years, no need to manage S3 + Athena setup.

**Q695:** A company's ALB is showing high 502 errors. What is the typical cause?
**✅ C** — Target returned invalid HTTP response or target is unreachable (SG blocking, health check failing, application crash)

**Q696:** What is "AWS Resilience Hub" primary output?
**✅ A** — Resilience assessment with RTO/RPO estimates + resilience score + recommended improvements + compliance checks

**Q697:** What does "CloudFront Price Class" control?
**✅ B** — Which edge location regions serve your content. Price Class 100 = cheapest regions (N. America, Europe). Price Class All = all regions globally (more expensive).

**Q698:** A company wants to implement health checks at multiple layers: DNS, Load Balancer, Application, Database. What is this called?
**✅ C** — **Defense in Depth** (for availability) or **Multi-layer health checks** — catch failures at each tier

**Q699:** What is "AWS Systems Manager Maintenance Windows"?
**✅ B** — Schedule automated maintenance tasks (patching, backups) during predefined time windows. Minimize impact on production by controlling when maintenance runs.

**Q700:** A company needs to configure automatic cross-region snapshots for RDS. What should they use?
**✅ A** — **AWS Backup** cross-region backup plan OR RDS automated snapshot copy configuration to secondary region

---

> ## 🎯 Set 06 Complete! — Serverless, HA & Monitoring (Q501–Q700)
>
> **Score Section A (Serverless):** ___/100
> **Score Section B (HA & Monitoring):** ___/100
> **Total:** ___/200
>
> ➡️ **Next:** [Exam Set 07 — Cost, Networking & Mixed Final (Q701-Q1000+)](./Exam_Set_07_Cost_Network_Mixed.md)
