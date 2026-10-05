---
title: "AWS SAA-C03 Practice Exam — Set 03"
description: "ဖတ်နည်း: မေးခွန်း (English) → ရွေးချယ်ခွင့် A-D ကို ဦးစွာ ဖြေပါ → Answer + မြန်မာ ရှင်းချက် စစ်ဆေးပါ"
---

## AWS SAA-C03 Practice Exam — Set 03
# Compute, EC2 & Auto Scaling | Q201–Q300
## Domain 3: High-Performing Architectures (24%) + Domain 4: Cost-Optimized (20%)

---

> **ဖတ်နည်း:** မေးခွန်း (English) → ရွေးချယ်ခွင့် A-D ကို ဦးစွာ ဖြေပါ → Answer + မြန်မာ ရှင်းချက် စစ်ဆေးပါ

---

## Q201
**A company runs a web application on EC2 instances. Traffic is unpredictable — very high during business hours and near-zero at night. They want to optimize cost while maintaining performance. Which EC2 purchasing option BEST suits this need?**

- **A)** Reserved Instances (1-year, All Upfront) for all instances
- **B)** On-Demand Instances only for flexibility
- **C)** A combination of Reserved Instances for baseline traffic + Auto Scaling with On-Demand or Spot for peak demand
- **D)** Dedicated Hosts for the entire fleet

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) All Reserved Instances → ❌ မှားသည်**
> Reserved Instances = predictable, constant workload ကိုသာ optimal ဖြစ်သည်။ "Near-zero at night" ဆိုသောကြောင့် night-time RI costs ကို pay ဖြစ်ရပြီး **waste ဖြစ်မည်**ဖြစ်ပြီး "optimize cost" ကို မဖြည့်ဆည်းနိုင်ပါ

**B) On-Demand only → ❌ မှားသည်**
> On-Demand = highest per-hour rate ဖြစ်ပြီး predictable baseline traffic ကို RI ဖြင့် cover ဖြစ်ပါက cost ကို reduce ဖြစ်ရနိုင်သောကြောင့် On-Demand-only = **optimal မဟုတ်**ပါ

**C) Reserved (baseline) + On-Demand/Spot (peak) → ✅ မှန်သည်**
> **Cloud Cost Optimization Best Practice:**
> - **Reserved Instances (1-3 year)**: Predictable minimum traffic → 72% discount vs On-Demand
> - **Auto Scaling + On-Demand**: Normal peak traffic → pay only when needed
> - **Spot Instances**: Non-critical peak → 90% discount (interruptible)
> ဤ tiered approach = **minimum waste + maximum savings**

**D) Dedicated Hosts → ❌ မှားသည်**
> Dedicated Hosts = physical server isolation (compliance, BYOL) ကိုသာ use ဖြစ်ပြီး **most expensive** option ဖြစ်ပြီး variable workload cost optimization ကို address မဖြစ်ပါ

**💡 Real Exam Tip:**
| Traffic Pattern | Recommended Option |
|----------------|-------------------|
| Constant 24/7 | Reserved Instances |
| Unpredictable spikes | On-Demand / Spot |
| Baseline + variable peak | **RI + Auto Scaling** |
| Fault-tolerant batch | Spot Instances |

---

## Q202
**An e-commerce company is running a Flash Sale event. Traffic is expected to spike 10x normal load for 2 hours. The sale runs on a stateless web application. What is the MOST cost-effective approach to handle this spike?**

- **A)** Pre-purchase 10x Reserved Instances permanently
- **B)** Use Auto Scaling with Spot Instances for additional capacity during the spike, with fallback to On-Demand
- **C)** Deploy a larger instance type (scale up) permanently
- **D)** Use On-Demand Instances manually launched before the event

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) 10x Reserved Instances → ❌ မှားသည်**
> 2-hour event ကြောင့် 1-year RI purchase = **massive waste** ဖြစ်ပြီး event ပြီးနောက် underutilized instances ကိုပဲ pay ဖြစ်ရမည်ဖြစ်ပြီး "most cost-effective" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Auto Scaling + Spot with On-Demand fallback → ✅ မှန်သည်**
> **"Spot Fleet" or ASG with mixed instance policy:**
> - Spot Instances = 90% cheaper than On-Demand
> - Stateless app = Spot interruption = no data loss (replaceable)
> - If Spot unavailable → On-Demand fallback (mixed policy)
> **2-hour event + stateless = Spot optimal** ဖြစ်ပြီး spike ပြီးနောက် Auto Scaling down ဖြစ်ပြီး cost stop ဖြစ်မည်

**C) Larger instance permanently → ❌ မှားသည်**
> Scale-up = 2 hours event ကြောင့် permanent large instance = year-round cost ဖြစ်ပြီး **worst cost approach** ဖြစ်ပြီး "permanently" = cost optimization ဆန့်ကျင်ဖြစ်သည်

**D) Manual On-Demand launch → ❌ မှားသည်**
> On-Demand = Spot ထက် expensive ဖြစ်ပြီး manual launch = operational burden ဖြစ်ပြီး Auto Scaling ကဲ့သို့ dynamic ဖြင့် scale-in/out မဖြစ်ပါ

**💡 Real Exam Tip:**
**"stateless"** + **"spike"** + **"cost-effective"** → **Spot Instances + Auto Scaling**
Stateless = Spot termination OK (no session/data loss)

---

## Q203
**A company runs a data processing job that takes 4 hours and must complete within a tight deadline. The job processes customer financial data and CANNOT be interrupted once started. Which EC2 purchasing option is BEST?**

- **A)** Spot Instances — cheapest option
- **B)** On-Demand Instances — no interruption risk
- **C)** Reserved Instances — best discount
- **D)** Spot Instances with Spot Block (defined duration)

---
**✅ Correct Answer: B (or D)**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Regular Spot Instances → ❌ မှားသည်**
> Spot Instances = **interrupted with 2-minute notice** when AWS needs capacity ဖြစ်ပြီး "CANNOT be interrupted" requirement ကို directly violate ဖြစ်မည်ဖြစ်ပြီး financial data = interrupted processing = data corruption risk

**B) On-Demand Instances → ✅ မှန်သည်**
> On-Demand = **no interruption guarantee** ဖြစ်ပြီး job duration ကြာသည့်တိုင် terminate မဖြစ်ပါ (AWS ကြောင့်)ဖြစ်ပြီး "cannot be interrupted" + "financial data" requirements ကို address ဖြစ်သည်

**C) Reserved Instances → ❌ မှားသည်**
> RI = billing discount ဖြစ်ပြီး **instance type/availability guarantee** ကို provide မဖြစ်ပါ — RI တိုင်း On-Demand ကဲ့သို့ capacity ရနိုင်ပြီး SAA ၌ RI = cost ကိုသာ affect ဖြစ်ပြီး interruption protection မဟုတ်ပါ

**D) Spot Blocks (Defined Duration) → ✅ (Partially Correct)**
> Spot Blocks = 1-6 hours block ဖြင့် reserve ဖြစ်ပြီး interruption မဖြစ်ပါ — **Note: Spot Blocks is DEPRECATED (2021)**ဖြစ်ပြီး exam မေးဦးနိုင်သောကြောင့် D ကို B ထက် recommended မဖြစ်ပါ

**💡 Real Exam Tip:**
**"CANNOT be interrupted"** + **"deadline"** + **"critical"** → **On-Demand Instances**
Spot = Fault-tolerant batch only | On-Demand = time-critical, uninterruptible

---

## Q204
**A company needs to run highly optimized batch processing jobs that need access to GPU hardware. They want the LOWEST POSSIBLE COST. The jobs can be restarted if interrupted. Which approach is MOST cost-effective?**

- **A)** Reserved GPU instances (3-year, All Upfront)
- **B)** On-Demand GPU instances
- **C)** Spot GPU instances (p3 or g4dn) with checkpointing enabled
- **D)** Dedicated GPU Hosts

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) 3-year Reserved GPU → ❌ မှားသည်**
> Batch jobs = not 24/7 ဖြစ်ပြီး 3-year RI for intermittent batch = **wasted capacity**ဖြစ်ပြီး GPU instances RI = very expensive

**B) On-Demand GPU → ❌ မှားသည်**
> GPU (p3.2xlarge) On-Demand = ~$3/hour ဖြစ်ပြီး Spot ကဲ့သို့ 90% cheaper မဟုတ်ပါ — "lowest possible cost" ကို မဖြည့်ဆည်းနိုင်ပါ

**C) Spot GPU + checkpointing → ✅ မှန်သည်**
> **GPU Spot Instances:**
> - p3.2xlarge Spot = ~$0.30/hour (vs $3 On-Demand = 90% savings)
> - "Can be restarted if interrupted" = Spot interruption = acceptable
> - **Checkpointing**: Job progress ကို S3/EFS တွင် save → interrupt ဖြစ်ပါက resume ဖြစ်ပြုနိုင်
> Fault-tolerant batch + GPU = **Spot ၏ optimal use case**

**D) Dedicated GPU Hosts → ❌ မှားသည်**
> Dedicated Hosts = most expensive (host-level pricing) ဖြစ်ပြီး "lowest possible cost" ကို completely ဆန့်ကျင်ဖြစ်သည်

---

## Q205
**A company has an Auto Scaling group with a desired capacity of 4 instances. Their scaling policy says: scale out by 2 when CPU > 80%, scale in when CPU < 30%. Currently CPU is 85%. How many instances will there be after scaling out?**

- **A)** 5 instances
- **B)** 6 instances
- **C)** 8 instances
- **D)** 4 instances (no change)

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) 5 instances → ❌ မှားသည်**
> Scaling policy = "add 2 when CPU > 80%" ဆိုသောကြောင့် 4 + 1 = 5 မဟုတ်ဘဲ 4 + 2 = 6 ဖြစ်မည်

**B) 6 instances → ✅ မှန်သည်**
> - Current: 4 instances, CPU: 85% (> 80% threshold)
> - Step Scaling Policy: "Add 2 instances"
> - After scale out: 4 + 2 = **6 instances**

**C) 8 instances → ❌ မှားသည်**
> Policy = add 2 (not double) ဖြစ်ပြီး 4 × 2 = 8 မဟုတ်ဘဲ 4 + 2 = 6 ဖြစ်မည်

**D) No change → ❌ မှားသည်**
> CPU 85% > 80% threshold → scaling action trigger ဖြစ်မည်ဖြစ်ပြီး no change မဟုတ်ပါ

**💡 Auto Scaling Concepts:**
- **Simple Scaling**: Single step, cooldown period
- **Step Scaling**: Multiple steps based on alarm magnitude (recommended)
- **Target Tracking**: Maintain metric at target value (simplest)
- **Predictive Scaling**: ML-based future scaling

---

## Q206
**An Auto Scaling group needs to maintain exactly 5 instances at all times, regardless of load. What configuration achieves this?**

- **A)** Set Min=5, Max=5, Desired=5
- **B)** Set Min=1, Max=10, Desired=5 with Target Tracking policy
- **C)** Set Min=5, Max=10, Desired=5 with no scaling policy
- **D)** Set Min=0, Max=5, Desired=5 with schedule

---
**✅ Correct Answer: A**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Min=5, Max=5, Desired=5 → ✅ မှန်သည်**
> Min = Max = Desired = 5 ဆိုပါက ASG = always exactly 5 instances maintain ဖြစ်မည်ဖြစ်ပြီး instance fail ဖြစ်ပါက automatically replace ဖြစ်မည်ဖြစ်ပြီး **"fixed count with auto-recovery"** pattern ဖြစ်သည်

**B) Min=1, Max=10, Target Tracking → ❌ မှားသည်**
> Target Tracking = load ကို base ပြုလုပ်ပြီး scale in/out ဖြစ်မည်ဖြစ်ပြီး **exactly 5** ကို guarantee မဖြစ်ပါ

**C) Min=5, Max=10, no policy → ❌ မှားသည်**
> Max=10 ကြောင့် system ASG API ဖြင့် scale-out ဖြစ်ရနိုင်ပြီး exactly 5 ကို guarantee မဖြစ်ပါ

**D) Min=0, Scheduled → ❌ မှားသည်**
> Min=0 → instance fail ဖြစ်ပါက 0 သို့ scale down ဖြစ်ရနိုင်ပြီး exactly 5 guarantee မဖြစ်ပါ

---

## Q207
**A company is running a stateful application on EC2. When Auto Scaling terminates instances, in-progress user sessions are lost. How should they solve this problem?**

- **A)** Disable Auto Scaling to prevent termination
- **B)** Store session data in a centralized external store (ElastiCache Redis or DynamoDB) and make the application stateless
- **C)** Use Reserved Instances so instances are never terminated
- **D)** Enable instance protection on all instances permanently

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Disable Auto Scaling → ❌ မှားသည်**
> Auto Scaling = HA + cost optimization ကို provide ဖြစ်ပြီး disable ဖြစ်ပြုရင် elasticity benefits ပျောက်မည်ဖြစ်ပြီး "solve the session problem" မဟုတ်ဘဲ avoid ဖြစ်ပြုရုံသာဖြစ်သောကြောင့် correct approach မဟုတ်ပါ

**B) External session store → ✅ မှန်သည်**
> **Make Application Stateless:**
> - Session data → **ElastiCache Redis** (fast, in-memory) or **DynamoDB** (durable)
> - Any instance = session read ဖြစ်ရပြီး **instance termination = no session loss**
> - ALB Sticky Sessions ကိုပါ remove ဖြစ်ပြုနိုင်ပြီး → better load distribution
> ဤ approach = Cloud-native best practice ဖြစ်သည်

**C) Reserved Instances → ❌ မှားသည်**
> RI = billing model ဖြစ်ပြီး **ASG termination behavior ကို prevent မဖြစ်ပါ** — RI instance ကို ASG termination policy ဖြင့် terminate ဖြစ်ရသေးသည်

**D) Instance protection permanently → ❌ မှားသည်**
> Instance protection = scale-in termination ကသာ prevent ဖြစ်ပြီး **all instances protect = ASG scale-in မဖြစ်တော့** = cost savings ဆုံးရှုံးမည်

**💡 Real Exam Tip:**
**"stateless"** = Auto Scaling ၏ prerequisite ဖြစ်ပြီး session data = external store (ElastiCache/DynamoDB)

---

## Q208
**A company runs a microservices application on EC2. They need to ensure that when a new AMI (Amazon Machine Image) is released, all instances in the Auto Scaling group are updated with zero downtime. What is the BEST approach?**

- **A)** Terminate all instances and launch new ones with the new AMI
- **B)** Update the Launch Template with the new AMI, then use ASG Instance Refresh with minimum healthy percentage set
- **C)** Manually replace each instance one by one
- **D)** Create a new ASG with the new AMI and switch traffic via DNS

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Terminate all → ❌ မှားသည်**
> All terminate = **downtime ဖြစ်မည်** ဖြစ်ပြီး "zero downtime" requirement ကို directly violate ဖြစ်မည်

**B) Launch Template update + Instance Refresh → ✅ မှန်သည်**
> **ASG Instance Refresh:**
> 1. Launch Template ကို new AMI ဖြင့် update
> 2. ASG → Start Instance Refresh
> 3. `MinHealthyPercentage = 90%` → ASG = 10% ကိုသာ တစ်ကြိမ်ချင်း replace ဖြစ်မည်
> 4. New instances healthy → continue replacing → zero downtime rolling update

**C) Manual one by one → ❌ မှားသည်**
> Manual = error-prone + slow ဖြစ်ပြီး "automated zero downtime" approach မဟုတ်ပါ

**D) New ASG + DNS switch → ❌ မှားသည်**
> Blue-green deployment = valid ဖြစ်သော်လည်း **"BEST approach"** ကြောင့် Instance Refresh (simpler, built-in) ကသာ correct ဖြစ်သည်

---

## Q209
**A company wants EC2 instances in an Auto Scaling group to automatically register with a load balancer when launched and deregister when terminated. What should they configure?**

- **A)** Configure health checks on each EC2 instance manually
- **B)** Attach the ALB Target Group to the Auto Scaling group during ASG configuration
- **C)** Use CloudWatch alarms to trigger instance registration
- **D)** Manually register instances with the load balancer after launch

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Manual health checks → ❌ မှားသည်**
> Manual = "automatically" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Attach Target Group to ASG → ✅ မှန်သည်**
> ASG + Target Group integration:
> - New instance launch → **automatically register** with Target Group → receive traffic
> - Instance terminate → **automatically deregister** → connection draining → stop traffic
> - Health check failure → ASG = unhealthy → terminate + replace
> **Fully automatic, no manual steps required**

**C) CloudWatch alarms → ❌ မှားသည်**
> CloudWatch = scaling trigger ဖြစ်ပြီး load balancer registration/deregistration management မဟုတ်ပါ

**D) Manual register → ❌ မှားသည်**
> Manual = "automatically" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

---

## Q210
**A company's EC2 instances experience high CPU usage every day from 9 AM to 5 PM (business hours). The ASG currently scales based on CPU metric. They want to proactively have instances ready BEFORE the load increases. Which scaling policy should they implement?**

- **A)** Target Tracking Scaling — reactive approach
- **B)** Scheduled Scaling — pre-scale at 8:45 AM
- **C)** Simple Scaling — alarm-based reactive
- **D)** Step Scaling — reactive with multiple steps

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Target Tracking → ❌ မှားသည်**
> Target Tracking = current metric ကိုကြည့်ပြီး **reactive** ဖြစ်ပြုသောကြောင့် load increase ဖြစ်ပြီးမှ scale out = "proactively before load" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Scheduled Scaling → ✅ မှန်သည်**
> **Scheduled Scaling Action:**
> - At 8:45 AM (15 min before peak): Set Desired=10 (or Min=10)
> - At 5:15 PM (after hours): Set Desired=2 (scale down)
> - **Predictable, time-based** → proactive capacity ready before load arrives
> Cron expression: `45 8 * * MON-FRI`

**C) Simple Scaling → ❌ မှားသည်**
> Simple Scaling = CloudWatch alarm trigger + cooldown period ဖြစ်ပြီး **reactive** approach = scale out after CPU already high

**D) Step Scaling → ❌ မှားသည်**
> Step Scaling = better reactive scaling ဖြစ်သော်လည်း **reactive** approach = "proactively before" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**💡 Real Exam Tip:**
**"predictable pattern"** + **"proactive scale before"** → **Scheduled Scaling**

---

## Q211
**A company needs EC2 instances to be spread across multiple Availability Zones for high availability. They have a 4-instance Auto Scaling group. What is the DEFAULT placement behavior of ASG across AZs?**

- **A)** ASG places all instances in one AZ until it's full
- **B)** ASG automatically balances instances across specified AZs using the "Balance AZs" feature
- **C)** ASG places instances randomly without considering AZ distribution
- **D)** User must manually specify which AZ each instance goes to

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) One AZ first → ❌ မှားသည်**
> ASG = HA ကို design goal ဖြစ်ပြုပြီး single AZ prioritize ဖြစ်ပြုလျှင် AZ failure = all down ဖြစ်မည်ဖြစ်ပြီး default behavior မဟုတ်ပါ

**B) Balance across AZs → ✅ မှန်သည်**
> ASG = **AZ Rebalancing** feature ရှိပြီး configured AZs တွင် **evenly distribute** ဖြစ်ပြုသည်
> - 4 instances, 2 AZs → AZ-1: 2, AZ-2: 2
> - AZ imbalance ဖြစ်ပါက → rebalance action trigger (launch in underrepresented AZ, terminate in overrepresented)

**C) Random placement → ❌ မှားသည်**
> Random = not ASG behavior ဖြစ်ပြီး deliberate HA-oriented balancing ဖြစ်ပြုသည်

**D) Manual AZ specification → ❌ မှားသည်**
> User = ASG AZ configuration ကိုသာ specify ဖြစ်ရပြီး per-instance AZ ကို manually assign ဖြစ်ရမည်မဟုတ်ပါ — ASG = automatic distribution

---

## Q212
**A company uses EC2 instances with EBS volumes. They want to take point-in-time snapshots of production EBS volumes with minimal impact on production workload. Which approach is BEST?**

- **A)** Stop the production EC2 instance, take the snapshot, then restart
- **B)** Take EBS snapshots directly while the instance is running (snapshots are crash-consistent)
- **C)** Copy the EBS data to S3 manually
- **D)** Create a new EBS volume and copy data

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Stop instance → ❌ မှားသည်**
> Instance stop = **downtime** ဖြစ်ပြီး "minimal impact on production" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — production service interruption ဖြစ်မည်

**B) Snapshot while running → ✅ မှန်သည်**
> **EBS Snapshot characteristics:**
> - Running instance တွင်ပင် snapshot ယူနိုင်
> - **Crash-consistent** (OS restart ပြီးကဲ့သို့ consistent state)
> - Snapshot = incremental (changed blocks only)
> - **DLM (Data Lifecycle Manager)**: Automated snapshot schedules
> Production = zero downtime, minimal I/O impact

**C) Manual S3 copy → ❌ မှားသည်**
> AWS ၌ EBS data ကို S3 directly copy ဖြစ်ရမည်ဆိုသည် **direct mechanism မရှိပါ** — snapshot ကသာ built-in mechanism ဖြစ်သည်

**D) New volume + copy → ❌ မှားသည်**
> Volume copy = time-consuming + storage cost ဖြစ်ပြီး snapshot ကဲ့သို့ efficient မဟုတ်ပါ

---

## Q213
**A company runs a database workload that requires high I/O performance and low latency. They need 32,000 IOPS consistently. Which EBS volume type should they choose?**

- **A)** gp2 (General Purpose SSD)
- **B)** gp3 (General Purpose SSD v2)
- **C)** io1 or io2 (Provisioned IOPS SSD)
- **D)** st1 (Throughput Optimized HDD)

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) gp2 → ❌ မှားသည်**
> gp2 = **max 16,000 IOPS** (1 TB+ volume) ဖြစ်ပြီး 32,000 IOPS requirement ကို support မဖြစ်ပါ

**B) gp3 → ❌ မှားသည်**
> gp3 = **max 16,000 IOPS** (separately configurable) ဖြစ်ပြီး 32,000 IOPS ကို support မဖြစ်ပါ

**C) io1/io2 → ✅ မှန်သည်**
> **Provisioned IOPS SSD:**
> - io1: Max 64,000 IOPS per volume
> - io2/io2 Block Express: Max 256,000 IOPS
> - Guaranteed IOPS: customer-specified, consistent performance
> 32,000 IOPS = **within io1/io2 range**

**D) st1 → ❌ မှားသည်**
> st1 = **HDD** (magnetic) ဖြစ်ပြီး IOPS ကမ်မြင့်မားပါ — throughput-optimized (big data sequential reads), not IOPS-optimized

**💡 EBS Types:**
| Type | Use Case | Max IOPS |
|------|---------|---------|
| gp2/gp3 | General | 16,000 |
| **io1/io2** | **High IOPS DB** | **64,000-256,000** |
| st1 | Big data seq | Low |
| sc1 | Cold archive | Very Low |

---

## Q214
**An EC2 instance needs to process messages from an SQS queue. The company wants to scale EC2 instances based on the number of messages in the queue. Which metric and scaling approach should they use?**

- **A)** Auto Scaling with CPU Utilization metric
- **B)** Auto Scaling with custom metric using `ApproximateNumberOfMessagesVisible` from SQS via CloudWatch
- **C)** Manual scaling based on daily reports
- **D)** Auto Scaling with network I/O metric

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) CPU Utilization metric → ❌ မှားသည်**
> CPU = instance processing load ကိုကြည့်ပြုသောကြောင့် SQS queue ၌ messages accumulate ဖြစ်ပြီးမှသာ CPU rise ဖြစ်မည်ဖြစ်ပြီး **laggy response** ဖြစ်မည် — queue length-based scaling ကသာ optimal

**B) SQS `ApproximateNumberOfMessagesVisible` custom metric → ✅ မှန်သည်**
> **Queue-based Auto Scaling:**
> 1. SQS metric → CloudWatch custom metric
> 2. Target Tracking: "N messages per instance" (e.g., 100 msg/instance)
> 3. Queue depth rises → scale out ဖြစ်မည်
> 4. Queue drains → scale in ဖြစ်မည်
> Direct queue depth ကိုကြည့်ပြုသောကြောင့် **most responsive** approach ဖြစ်သည်

**C) Manual scaling → ❌ မှားသည်**
> Manual = "automatically scale" use case ကို address မဖြစ်ပါ

**D) Network I/O metric → ❌ မှားသည်**
> Network I/O = SQS message processing load ကို accurately reflect မဖြစ်ပါ

---

## Q215
**A web application runs on EC2 behind an ALB. Users sometimes see `503 Service Unavailable` errors. The ALB health checks show all instances as healthy. What might be causing this?**

- **A)** The IAM role on EC2 instances has expired
- **B)** ALB health check path is different from the actual application path, so instances show healthy but the application is actually failing
- **C)** The EBS volume on EC2 is full
- **D)** The VPC CIDR block has run out of IP addresses

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM role expired → ❌ မှားသည်**
> IAM role credentials = automatic rotation (STS) ဖြစ်ပြီး expired မဖြစ်ပါ — 503 error ၏ cause မဟုတ်ပါ

**B) Health check path mismatch → ✅ မှန်သည်**
> **Common Issue:**
> - ALB health check: `GET /health` → Returns 200 (simple static endpoint)
> - Actual application: `/api/v1/users` → Returns 503 (dependency failure)
> - ALB = instances healthy (health check passes) ဆိုပြီး real traffic = fails
> **Solution**: Health check path = comprehensive application health check endpoint

**C) EBS full → ❌ မှားသည်**
> EBS full = application crash ဖြစ်မည်ဆိုသောကြောင့် ALB health check ပါ fail ဖြစ်မည်ဖြစ်ပြီး "instances show healthy" statement ကို contradiction ဖြစ်မည်

**D) VPC CIDR exhaustion → ❌ မှားသည်**
> CIDR exhaustion = new instances launch မဖြစ်ပါ ဆိုသောကြောင့် existing running instances health ကို affect မဖြစ်ပါ

---

## Q216
**A company needs to run a legacy application that requires a specific software license tied to the underlying physical server's MAC address. Which EC2 option supports this requirement?**

- **A)** Reserved Instances
- **B)** Spot Instances
- **C)** Dedicated Hosts
- **D)** Placement Groups

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Reserved Instances → ❌ မှားသည်**
> RI = billing discount ဖြစ်ပြီး physical server ကိုသာ use မဖြစ်ပါ — MAC address = physical NIC ဖြင့် tied ဖြစ်ပြီး shared infrastructure ကို change ဖြစ်ရနိုင်သောကြောင့် MAC consistency မဖြစ်ပါ

**B) Spot Instances → ❌ မှားသည်**
> Spot = interrupted + different physical server ကိုနိုင်ပြီး MAC address change ဖြစ်မည်ဖြစ်ပြီး license violation ဖြစ်မည်

**C) Dedicated Hosts → ✅ မှန်သည်**
> **Dedicated Hosts:**
> - Customer ၏ **own physical server** (dedicated hardware)
> - **BYOL (Bring Your Own License)** = MAC/socket/core-based licenses support
> - Same physical server = consistent MAC address
> - Compliance: PCI-DSS, HIPAA requiring physical isolation
> Software License (Oracle, Windows, etc.) MAC-based = **Dedicated Hosts ကသာ** support ဖြစ်သည်

**D) Placement Groups → ❌ မှားသည်**
> Placement Groups = instance physical proximity/spread control ဖြစ်ပြီး same physical server = guarantee မဖြစ်ပါ ဖြစ်ပြီး MAC address consistency မရပါ

---

## Q217
**An application needs EC2 instances in the same AZ with extremely low network latency between instances (for HPC - High Performance Computing). Which placement group type achieves this?**

- **A)** Spread Placement Group
- **B)** Partition Placement Group
- **C)** Cluster Placement Group
- **D)** Default placement (no placement group)

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Spread Placement Group → ❌ မှားသည်**
> Spread = instances ကို **different hardware** ပေါ်တွင် spread ဖြစ်ပြုသောကြောင့် hardware failure isolation ကိုသာ address ဖြစ်ပြီး **low latency** ကို priority မဟုတ်ပါ — HPC မဟုတ်ဘဲ fault tolerance ကိုသာ

**B) Partition Placement Group → ❌ မှားသည်**
> Partition = multiple partitions (separate hardware racks) ဖြစ်ပြီး distributed workloads (HDFS, Cassandra) ကိုသာ used ဖြစ်ပြီး **ultra-low latency** networking မဟုတ်ပါ

**C) Cluster Placement Group → ✅ မှန်သည်**
> **Cluster Placement Group:**
> - Instances = **same AZ, physically close**
> - **10 Gbps** network bandwidth (vs standard 5 Gbps)
> - **Low latency** inter-instance communication
> - HPC, MPI, tightly-coupled distributed computing
> "extremely low network latency" + "HPC" = **Cluster Placement Group**

**D) Default placement → ❌ မှားသည်**
> Default = random placement across hardware ဖြစ်ပြီး **optimized for latency မဟုတ်**ပါ

**💡 Placement Group Summary:**
| Type | Purpose | AZ |
|------|---------|-----|
| **Cluster** | **Low latency, high bandwidth** | **Single AZ** |
| Spread | HA, hardware isolation | Multi-AZ |
| Partition | Large distributed systems | Multi-AZ |

---

## Q218
**A company wants to deploy EC2 instances where each instance must be on separate physical hardware. A hardware failure should affect at most one instance. Which placement group achieves this?**

- **A)** Cluster Placement Group
- **B)** Partition Placement Group
- **C)** Spread Placement Group
- **D)** No placement group needed

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Cluster → ❌ မှားသည်**
> Cluster = instances ကို CLOSE together ဖြစ်ပြုသောကြောင့် hardware failure = multiple instances affect ဖြစ်ရနိုင်ပြီး **fault isolation** မဟုတ်ပါ

**B) Partition → ❌ မှားသည်**
> Partition = group of instances share same partition (rack) ဖြစ်ပြီး within partition = shared hardware failure risk ဖြစ်ပြီး "at most ONE instance affected" မဟုတ်ပါ

**C) Spread → ✅ မှန်သည်**
> **Spread Placement Group:**
> - Each instance = **separate physical hardware rack**
> - Hardware failure = **only ONE instance affected**
> - Max: **7 instances per AZ** per placement group
> - Use: Critical instances requiring maximum isolation

**D) No placement group → ❌ မှားသည်**
> Default = random placement, no hardware isolation guarantee

---

## Q219
**A company wants to move from a manual deployment process to automated deployments using User Data scripts on EC2. The User Data script installs software packages at launch. What is a limitation of EC2 User Data?**

- **A)** User Data runs every time the instance reboots
- **B)** User Data runs only on the FIRST BOOT by default (not on subsequent starts/reboots)
- **C)** User Data scripts cannot include shell commands
- **D)** User Data is limited to 4 KB of data

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Runs on every reboot → ❌ မှားသည်**
> Default behavior = first boot only ဖြစ်ပြီး every reboot မဟုတ်ပါ — `cloud-init` configuration ကို modify ဖြစ်မှ multi-run ဖြစ်ရနိုင်သည်

**B) First boot only → ✅ မှန်သည်**
> User Data:
> - **Default**: First instance launch only (once)
> - If you want re-run: Use `cloud-init` configuration with `cloud_final_modules` set
> - RL: install packages once at launch = appropriate

**C) Cannot include shell commands → ❌ မှားသည်**
> User Data = bash script support ဖြစ်ပြီး `#!/bin/bash` header ဖြင့် shell commands run ဖြစ်ရသည်

**D) Limited to 4 KB → ❌ မှားသည်**
> User Data = **16 KB** limit ဖြစ်ပြီး (4 KB = IAM policy limit, different service)

---

## Q220
**A company needs to run a large ML training job on a GPU-optimized EC2 instance. The job takes 8 hours and uses a single GPU. They want the LOWEST COST for this type of recurring workload that runs once per week. Which purchasing option is BEST?**

- **A)** On-Demand GPU instance each week
- **B)** Reserved GPU Instance (1-year, All Upfront)
- **C)** Spot GPU Instance for each run (with checkpointing)
- **D)** Savings Plans (Compute Savings Plan)

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) On-Demand weekly → ❌ မှားသည်**
> On-Demand GPU = expensive ဖြစ်ပြီး 8 hours/week = 32 hours/month only ဖြစ်ပြီး Spot ထက် significantly higher cost

**B) 1-year Reserved GPU → ❌ မှားသည်**
> 8 hours/week = 416 hours/year ဖြစ်ပြီး RI = 8760 hours/year pay ဖြစ်ပြုဆိုသောကြောင့် **95% wasted reservation** ဖြစ်မည်

**C) Spot GPU + checkpointing → ✅ မှန်သည်**
> - Once/week ML training = **fault-tolerant batch** pattern
> - Spot GPU = ~90% discount
> - Checkpointing = S3 ၌ progress save → interrupt ဖြစ်ပါက resume
> **8 hours/week recurring batch = perfect Spot use case**

**D) Compute Savings Plans → ❌ မှားသည်**
> Savings Plans = **hourly commitment** ဖြစ်ပြီး 8 hours/week only use ဖြစ်ပါက commitment hours ကို **waste** ဖြစ်မည်

---

## Q221–Q300 (Rapid Fire Compute Questions)

---

## Q221
**What is the difference between vertical scaling (scale up) and horizontal scaling (scale out)?**

- **A)** Vertical = more instances, Horizontal = larger instances
- **B)** Vertical = larger instance size (e.g., t3.micro → m5.xlarge), Horizontal = more instances of same size
- **C)** Both mean the same in AWS
- **D)** Vertical = AWS managed, Horizontal = customer managed

**✅ B**

မြန်မာ:
- Vertical (Scale Up) = instance size ကြီးသည် → single point of failure, downtime possible
- Horizontal (Scale Out) = instance count များသည် → HA, preferred in cloud

---

## Q222
**An EC2 instance has an Elastic IP address. The instance is stopped (not terminated). What happens to the Elastic IP?**

- **A)** The Elastic IP is automatically released
- **B)** The Elastic IP remains associated but charges apply (~$0.005/hour for unattached EIP)
- **C)** The Elastic IP is given to another instance automatically
- **D)** The Elastic IP is converted to a standard public IP

**✅ B**

မြန်မာ: EIP + stopped instance = EIP remains associated ဖြစ်ပြီး **charge ကျသည်** (running instance = free, stopped/unattached = $0.005/hour)

---

## Q223
**A company wants to run containers without managing EC2 infrastructure. Which ECS launch type eliminates server management?**

- **A)** ECS on EC2 launch type
- **B)** ECS Fargate launch type
- **C)** ECS Spot launch type
- **D)** ECS Reserved launch type

**✅ B — ECS Fargate = serverless containers, no EC2 management needed**

မြန်မာ: Fargate = EC2 instances provision/patch/scale မလိုဘဲ container tasks only define ဖြစ်ရသည်

---

## Q224
**What is EC2 Instance Store and when should it be used?**

- **A)** Persistent block storage similar to EBS
- **B)** Temporary block storage (ephemeral) physically attached to host — fast but data lost on stop/terminate
- **C)** Network-attached file storage
- **D)** S3-backed object storage

**✅ B**

မြန်မာ: Instance Store = physically attached ➝ extremely fast (NVMe) BUT data survives reboot ONLY, not stop/terminate. Use for: temp data, cache, scratch space

---

## Q225
**A company has EC2 instances that are frequently stopped and started. They want to preserve the RAM contents across stops to reduce application startup time. Which feature enables this?**

- **A)** EC2 Hibernate
- **B)** EC2 Snapshot
- **C)** EBS Persistence
- **D)** EC2 User Data caching

**✅ A — EC2 Hibernate saves RAM to EBS root volume, allowing instance to "resume" quickly**

မြန်မာ: Hibernate = RAM → EBS encrypted save → stop → start → RAM restored → application = warm start ဖြစ်ပြီး cold boot ထက် faster

---

## Q226
**What is the maximum number of EC2 instances in a Spread Placement Group per AZ?**

- **A)** No limit
- **B)** 7 instances per AZ
- **C)** 10 instances per AZ
- **D)** 5 instances per AZ

**✅ B — Maximum 7 instances per AZ in Spread Placement Group (each on separate rack)**

မြန်မာ: Spread PG = 7 per AZ limit ဖြစ်ပြီး critical instances (database primaries) ကိုသာ place ဖြစ်ရမည်

---

## Q227
**An Auto Scaling group has instances in AZ-1 (3 instances) and AZ-2 (1 instance). A scale-in event occurs, reducing desired count by 1. Which instance is terminated by DEFAULT termination policy?**

- **A)** The oldest instance
- **B)** An instance from AZ-1 (overrepresented AZ), then the oldest launch configuration
- **C)** A random instance
- **D)** The most expensive instance

**✅ B**

မြန်မာ: Default termination policy:
1. AZ ကို rebalance ဖြစ်ပြုပြီး most instances ရှိသော AZ မှ terminate (AZ-1)
2. Oldest launch template/config instance ကို terminate
3. Instance closest to billing hour → terminate

---

## Q228
**A company wants to use Spot Instances but prevent interruptions during a 2-hour processing window. What should they configure?**

- **A)** Spot Instance with interruption notice disabled
- **B)** Spot Fleet with capacity-optimized allocation strategy
- **C)** On-Demand instances for the critical window
- **D)** Spot Instance with 2-hour hibernation

**✅ C — For truly uninterruptible workloads, On-Demand is safer. Spot cannot guarantee no interruption.**

မြန်မာ: "Prevent interruptions" = Spot ဖြင့် guarantee မဖြစ်ပါ — On-Demand = only option for guaranteed non-interruption

---

## Q229
**What metric does EC2 Auto Scaling's Target Tracking Scaling use by default for web applications?**

- **A)** Memory utilization
- **B)** CPU Utilization or ALBRequestCountPerTarget
- **C)** Network I/O bytes
- **D)** Disk read/write IOPS

**✅ B**

မြန်မာ: Target Tracking built-in metrics:
- `ASGAverageCPUUtilization`
- `ALBRequestCountPerTarget`
- `ASGAverageNetworkIn/Out`
Custom metric (memory) = CloudWatch agent + custom metric ဖြင့် separately configure ဖြစ်ရမည်

---

## Q230
**A company uses an AMI-based deployment. They create a "golden AMI" (pre-baked AMI) with all software pre-installed. What is the MAIN benefit of this approach?**

- **A)** Reduces storage costs significantly
- **B)** Enables faster instance launch times (no need to install software at boot via User Data)
- **C)** Eliminates the need for Auto Scaling
- **D)** Automatically updates software

**✅ B**

မြန်မာ: Golden AMI = all dependencies baked-in → launch ဖြစ်သောအခါ User Data script run time မလိုဘဲ → faster boot → faster Auto Scaling response

---

## Q231
**A company's EC2 instances crash when memory is exhausted. CloudWatch default metrics don't show memory usage. How can they monitor memory on EC2?**

- **A)** Enable CloudWatch detailed monitoring
- **B)** Install CloudWatch Agent on EC2 instances to publish custom memory metrics
- **C)** Use AWS Trusted Advisor memory checks
- **D)** Enable Enhanced Networking on instances

**✅ B**

မြန်မာ: EC2 default CloudWatch metrics = CPU, Network, Disk (OS level, not RAM) ဖြစ်ပြီး Memory = CloudWatch Agent install → custom metric publish ဖြစ်ရမည်

---

## Q232
**What is the purpose of EC2 Launch Templates vs Launch Configurations?**

- **A)** They are identical with different names
- **B)** Launch Templates support versioning, mixed instance types, and more features; Launch Configurations are older and being deprecated
- **C)** Launch Configurations are newer and recommended
- **D)** Launch Templates are only for Fargate

**✅ B**

မြန်မာ:
- Launch Configuration = older, no versioning, single instance type
- **Launch Template** = versioned, mixed instances, Spot + On-Demand mix, T2/T3 Unlimited, metadata options → **AWS recommended**

---

## Q233
**A company wants to run a job that processes 1 million records overnight. The job is stateless and each record is independent. Which EC2 approach provides BEST cost efficiency?**

- **A)** 1 large On-Demand instance running all night
- **B)** Spot Fleet with many smaller instances processing records in parallel
- **C)** 10 Reserved Instances for 1 year
- **D)** Lambda functions for each record

**✅ B**

မြန်မာ: Spot Fleet = multiple Spot instances = cheap + parallel processing = 1M records overnight ကို efficiently complete + Spot interruption = remaining records = other instances continue

---

## Q234
**A company needs to ensure their EC2 instances can access the internet for package updates but must not be accessible from the internet. The instances are in a private subnet. The solution should be HIGHLY AVAILABLE across AZs. What should they deploy?**

- **A)** One NAT Gateway in one AZ
- **B)** One NAT Gateway per AZ (multiple NAT Gateways)
- **C)** NAT Instance (single)
- **D)** Internet Gateway in private subnet

**✅ B**

မြန်မာ: NAT Gateway HA best practice:
- Each AZ = own NAT Gateway
- Private subnet route table = route to same-AZ NAT GW
- AZ failure = only that AZ affected (other AZs = own NAT GW)
Single NAT GW = single point of failure for all AZs

---

## Q235
**An EC2 instance is showing high network I/O but the application is single-threaded. What would MOST help?**

- **A)** Enable Enhanced Networking (ENA) for higher bandwidth
- **B)** Add more EBS volumes
- **C)** Increase instance storage (Instance Store)
- **D)** Change to a GPU instance type

**✅ A**

မြန်မာ: Enhanced Networking (ENA = Elastic Network Adapter):
- Up to 100 Gbps network bandwidth
- Lower latency
- Higher PPS (packets per second)
Enable: SR-IOV (Single Root I/O Virtualization) hardware virtualization

---

## Q236
**A company needs to share an EBS volume between multiple EC2 instances simultaneously (like a shared block storage). Which feature enables this?**

- **A)** EBS Multi-Attach for io1/io2 volumes
- **B)** EBS snapshot sharing
- **C)** EFS (Elastic File System) — though this is NFS not block storage
- **D)** S3 for shared block storage

**✅ A**

မြန်မာ: **EBS Multi-Attach** (io1/io2 only):
- Same EBS volume = multiple EC2 instances attach simultaneously (same AZ)
- Up to 16 instances
- Use case: Clustered applications (Oracle RAC, DBMS clustering)

---

## Q237
**Which EC2 instance family is optimized for memory-intensive workloads like in-memory databases (Redis, SAP HANA)?**

- **A)** C-family (Compute Optimized)
- **B)** R-family (Memory Optimized) — e.g., r5, r6g
- **C)** T-family (Burstable Performance)
- **D)** G-family (GPU Accelerated)

**✅ B**

မြန်မာ: EC2 Instance Families:
- T: Burstable (dev/test)
- M: General purpose
- **R/X: Memory optimized** (SAP HANA, Redis, databases)
- C: Compute optimized (CPU-intensive)
- G/P: GPU (ML, gaming)
- I/D: Storage optimized (NoSQL, data warehousing)

---

## Q238
**An application is experiencing cold start issues with Lambda — new Lambda instances take too long to initialize. What is the BEST approach to mitigate this?**

- **A)** Increase Lambda memory allocation
- **B)** Enable Lambda Provisioned Concurrency
- **C)** Use a larger EC2 instance instead
- **D)** Enable Lambda SnapStart

**✅ B or D**

မြန်မာ:
- **Provisioned Concurrency** = N Lambda execution environments = pre-initialized = zero cold start
- **SnapStart (Java)** = execution environment snapshot → fast init
- Memory increase = marginally faster, not zero cold start

---

## Q239
**A company needs to run a containerized workload on AWS. They want FULL CONTROL over the underlying EC2 infrastructure (custom OS, networking). Which service should they use?**

- **A)** AWS Fargate (serverless containers)
- **B)** Amazon ECS with EC2 launch type
- **C)** AWS Lambda
- **D)** AWS Batch (Fargate)

**✅ B**

မြန်မာ:
- ECS EC2 = Customer manages EC2 cluster → full control
- ECS Fargate = AWS manages servers → no control
- **"Full control over EC2"** → ECS EC2 launch type

---

## Q240
**A company has EC2 instances with 30% average CPU. They receive 90% of traffic during business hours (8 AM - 6 PM). What Auto Scaling policy combination provides the BEST performance and cost optimization?**

- **A)** Target Tracking at 70% CPU only
- **B)** Scheduled Scaling (scale up at 7:45 AM, scale down at 6:15 PM) + Target Tracking for dynamic scaling within business hours
- **C)** Simple Scaling with 1-instance steps
- **D)** Predictive Scaling only

**✅ B**

မြန်မာ: Combined approach:
- **Scheduled**: Pre-scale before peak hours (proactive)
- **Target Tracking**: Handle unexpected spikes during hours (reactive)
- Better than single policy alone

---

## Q241
**What is the purpose of the EC2 "Cooldown Period" in Auto Scaling?**

- **A)** Time to wait for instance to cool down after being terminated
- **B)** Time period after a scaling activity during which the ASG does not launch or terminate more instances (prevents rapid scale oscillation)
- **C)** Time until Reserved Instance commitment expires
- **D)** Time for health checks to complete before routing traffic

**✅ B**

မြန်မာ: Cooldown = scaling action ပြီးနောက် ASG = "wait" ဖြစ်ပြုသောကြောင့် metric stabilize ဖြစ်ရမည်ဖြစ်ပြီး unnecessary scaling (oscillation) ကို prevent ဖြစ်ပြုသည်

---

## Q242
**A company is running EC2 instances. They want to reduce their EC2 costs by up to 72% without any upfront commitment and with flexibility to change instance families. Which Savings Plan type should they choose?**

- **A)** EC2 Instance Savings Plans (specific instance family commitment)
- **B)** Compute Savings Plans (flexible — any instance family, region, OS)
- **C)** SageMaker Savings Plans
- **D)** Reserved Instances (Standard)

**✅ B**

မြန်မာ:
- **Compute Savings Plans**: Flexible (any instance family, size, OS, region) → 66% discount
- **EC2 Instance Savings Plans**: specific family/region → 72% discount but less flexible
- **"flexibility to change instance families"** → Compute Savings Plans

---

## Q243
**What is EC2 Instance Metadata Service (IMDS) used for?**

- **A)** Store application configuration files
- **B)** Provide running EC2 instances access to metadata about themselves (instance ID, IAM role credentials, public IP, user data, etc.) via 169.254.169.254
- **C)** Store persistent data
- **D)** Provide DNS resolution

**✅ B**

မြန်မာ: IMDS = `http://169.254.169.254/latest/meta-data/` → instance ID, IAM credentials, public IP, hostname, user data, etc. retrieve ဖြစ်ရသည်

---

## Q244
**A company wants to deploy EC2 instances across MULTIPLE AWS accounts while sharing a single AMI. What feature enables this?**

- **A)** Copy AMI to all accounts separately
- **B)** AMI sharing — share AMI with specific AWS account IDs or make it public
- **C)** AMI replication via S3
- **D)** Use Marketplace AMI instead

**✅ B**

မြန်မာ: AMI Sharing:
- AMI → Permissions → Add specific AWS Account IDs
- Shared AMI = other accounts can launch instances
- Cross-region share = AMI copy to other region first

---

## Q245
**An EC2 instance must process exactly one message from an SQS queue and then terminate. What service orchestrates this efficiently?**

- **A)** EC2 Auto Scaling with lifecycle hooks
- **B)** AWS Batch — manages job queuing and EC2/Fargate provisioning
- **C)** Lambda (if < 15 min processing time)
- **D)** ECS task with SQS trigger

**✅ B (or C depending on processing time)**

မြန်မာ:
- **AWS Batch**: Job queue + compute environment → each job = specific resources → terminate on completion
- **Lambda + SQS trigger**: If < 15 min → Lambda scales automatically → terminate on completion

---

## Q246
**Which EBS volume type provides the best price-to-performance ratio for general workloads and is the default for most EC2 instances?**

- **A)** io2 (Provisioned IOPS)
- **B)** gp3 (General Purpose SSD v3)
- **C)** st1 (Throughput HDD)
- **D)** sc1 (Cold HDD)

**✅ B**

မြန်မာ: **gp3** = AWS recommended default:
- 3,000 IOPS baseline (free, regardless of size)
- 125 MB/s throughput (free)
- Additional IOPS/throughput = independently purchasable
- 20% cheaper than gp2

---

## Q247
**What is the difference between EC2 "Stop" and EC2 "Terminate"?**

- **A)** Both are the same operation
- **B)** Stop = instance paused, EBS volume preserved, can restart; Terminate = instance and root EBS deleted permanently (unless delete on termination disabled)
- **C)** Stop = terminates EC2, Terminate = just stops temporarily
- **D)** Terminate preserves all EBS volumes automatically

**✅ B**

မြန်မာ:
- **Stop**: Instance halted, EBS preserved, EIP preserved, data preserved → restart possible
- **Terminate**: Instance + root EBS deleted (default), instance ID gone → irreversible
- Instance Store data: Lost on both Stop AND Terminate

---

## Q248
**A company wants to automatically replace unhealthy EC2 instances without human intervention. Which ASG feature provides this?**

- **A)** ASG lifecycle hooks
- **B)** ASG health checks (EC2 health check or ELB health check) + automatic replacement
- **C)** AWS Systems Manager Automation
- **D)** CloudWatch Alarm + SNS notification

**✅ B**

မြန်မာ: ASG Health Checks:
- EC2 health check: hardware/hypervisor level
- ELB health check: application level (more granular)
Unhealthy → ASG terminates + replaces → **self-healing** infrastructure

---

## Q249
**A company launches EC2 instances in a public subnet but they do NOT have a public IP. Can they access the internet?**

- **A)** Yes — public subnet automatically gives internet access
- **B)** No — without a public IP or Elastic IP, the instance has no internet access even in a public subnet
- **C)** Yes — via the VPC CIDR
- **D)** Yes — via S3 Gateway Endpoint

**✅ B**

မြန်မာ: Internet access requires:
1. Internet Gateway attached to VPC ✓ (public subnet)
2. Route to IGW in route table ✓ (public subnet)
3. **Public IP or Elastic IP** ✗ (missing) → No internet access

---

## Q250
**A company needs a managed Kubernetes service to run containerized applications. They don't want to manage the Kubernetes control plane. Which AWS service should they use?**

- **A)** Amazon ECS
- **B)** Amazon EKS (Elastic Kubernetes Service)
- **C)** AWS Fargate
- **D)** AWS Lambda

**✅ B**

မြန်မာ:
- **EKS**: AWS managed Kubernetes (control plane managed, worker nodes = EC2 or Fargate)
- ECS: AWS container orchestration (not Kubernetes)
- "Managed Kubernetes" = **EKS**

---

## Q251–Q300 (Final Rapid Fire Compute)

---

## Q251
**What is the maximum execution timeout for AWS Lambda?**
- A) 5 minutes B) **15 minutes** C) 30 minutes D) 1 hour
**✅ B** — Lambda max timeout = 15 minutes. Longer = use ECS/EC2

---

## Q252
**Which EC2 feature allows an instance to be automatically placed on a new host after a hardware failure without manual intervention?**
- A) Elastic IP B) **Auto Recovery** C) Dedicated Host D) Placement Group
**✅ B** — EC2 Auto Recovery: `StatusCheckFailed_System` alarm → automatically recover instance (same ID, EIP, EBS)

---

## Q253
**A company's EBS-backed EC2 instance root volume shows "DeleteOnTermination=true". What happens when the instance is terminated?**
- A) Volume is stopped but preserved
- B) **Volume is automatically deleted when instance terminates**
- C) Volume is archived to S3
- D) Volume is detached but preserved

**✅ B** — Default behavior for root volume: DeleteOnTermination=true → deleted on terminate. Change this when launching to preserve.

---

## Q254
**What is the maximum number of IAM roles that can be attached to an ECS task?**
- A) 5 B) 2 (task role + execution role) C) **1 task role + 1 execution role = 2** D) Unlimited
**✅ C** — Each ECS task can have 1 Task Role (app permissions) + 1 Task Execution Role (ECS infrastructure) = 2 roles

---

## Q255
**A company wants to distribute traffic across multiple EC2 instances in multiple AZs for their TCP-based application requiring static IPs. Which load balancer should they use?**
- A) ALB B) **NLB with Elastic IPs per AZ** C) CLB D) GWLB
**✅ B** — NLB + Elastic IP = static IP per AZ + TCP support + millions RPS

---

## Q256
**Which service allows you to build custom AMIs automatically using code (Infrastructure as Code for AMI creation)?**
- A) AWS CloudFormation B) **EC2 Image Builder** C) AWS CodeBuild D) AWS Elastic Beanstalk
**✅ B** — EC2 Image Builder: automated pipeline to build, test, distribute AMIs. Scheduled AMI updates (patches, software)

---

## Q257
**An EC2 instance in an Auto Scaling group needs to perform cleanup tasks before termination. Which feature allows this?**
- A) CloudWatch Alarm B) Instance protection C) **ASG Lifecycle Hooks (terminating state)** D) SNS notification
**✅ C** — Lifecycle hooks: instance enters "Terminating:Wait" → perform cleanup (drain connections, save state) → complete lifecycle action → terminate

---

## Q258
**What is "Burstable Performance" in EC2 T-family instances?**
- A) Instances that can run indefinitely at maximum CPU
- B) **Instances that accumulate CPU credits during low CPU periods and spend them during spikes, providing occasional high CPU bursts**
- C) Instances with auto-scaling built in
- D) GPU-enhanced performance instances

**✅ B** — T3/T4g = credit-based CPU: earn credits at baseline, spend during bursts. T3 Unlimited = burst without credit limit (extra charge)

---

## Q259
**A company's application requires data transfer between EC2 instances with the highest possible bandwidth (100 Gbps) within the same region. What should they use?**
- A) Dedicated Hosts B) Direct Connect C) **Cluster Placement Group with ENA Express** D) VPC Peering
**✅ C** — Cluster PG + ENA Express = 100 Gbps instance-to-instance within AZ

---

## Q260
**What happens to EC2 instance data stored in Instance Store when the instance is stopped?**
- A) Data is preserved
- B) **Data is permanently lost — Instance Store is ephemeral**
- C) Data is saved to EBS automatically
- D) Data is backed up to S3

**✅ B** — Instance Store: data survives REBOOT, but NOT stop or terminate. Purely ephemeral.

---

## Q261
**A company uses ECS on EC2. The EC2 instances are running at 90% capacity. ECS cannot schedule new tasks. What should they configure?**
- A) Increase Lambda memory B) Add more ECS tasks C) **ECS Cluster Auto Scaling (CAS) to add EC2 instances using ASG** D) Restart ECS agent
**✅ C** — ECS Cluster Auto Scaling = ECS Cluster Capacity Provider + ASG → automatically adds EC2 capacity when tasks cannot be scheduled

---

## Q262
**What is an EC2 "Capacity Reservation"?**
- A) A billing commitment like Reserved Instances
- B) **Reserve EC2 capacity in a specific AZ for specific instance type without billing commitment (pay On-Demand rate)**
- C) Spot capacity reservation
- D) Dedicated Host reservation

**✅ B** — Capacity Reservation: guaranteed capacity availability in specific AZ. Use for disaster recovery or specific events. Pay On-Demand rate regardless of usage.

---

## Q263
**An application uses EC2 and EBS. The company wants to minimize RTO (Recovery Time Objective) after an EBS volume failure. What should they implement?**
- A) Daily snapshots only
- B) **Amazon Data Lifecycle Manager (DLM) for automated frequent snapshots + EBS Multi-Volume crash-consistent snapshots**
- C) EBS volume RAID configuration
- D) Instance Store for redundancy

**✅ B** — DLM automates snapshot creation (hourly possible), reducing data loss window (RPO) and enabling fast restore (RTO)

---

## Q264
**A company wants to deploy their web application using Elastic Beanstalk. What does Elastic Beanstalk manage for them automatically?**
- A) Application code development
- B) **EC2 provisioning, load balancing, Auto Scaling, health monitoring, deployment — while customer manages only the application code**
- C) Database design
- D) Network architecture design

**✅ B** — Elastic Beanstalk = PaaS: upload code → AWS provisions everything. Customer controls config but AWS manages infrastructure.

---

## Q265
**What is the maximum number of EBS volumes that can be attached to a single EC2 instance?**
- A) 10 B) 20 C) **27 (or more depending on instance type and NVMe attachments)** D) 5
**✅ C** — Modern instance types support up to 27 EBS volumes (including root). Varies by instance type. io1/io2 Multi-Attach = additional consideration.

---

## Q266–Q300 (Final Concepts)

Each question format: English Q → 4 choices → Answer + Brief Burmese explanation

---

## Q266
**When using ASG with multiple instance types (Mixed Instances Policy), what is the benefit?**
- A) **Higher Spot availability, lower cost, better distribution across instance pools**
- B) Increased security
- C) Faster deployment
- D) Automatic OS patching

**✅ A** — Mixed instances = multiple Spot pools → if one pool interrupted → switch to another → higher availability + cost savings

---

## Q267
**A company uses CloudWatch to monitor EC2. Which metric indicates the instance is approaching CPU throttling (T-family burstable)?**
- A) CPUUtilization > 100%
- B) **CPUCreditBalance approaching 0**
- C) NetworkIn spike
- D) StatusCheckFailed

**✅ B** — T-family: CPUCreditBalance = 0 → CPU capped at baseline % → performance degradation

---

## Q268
**What is "EC2 Fleet"?**
- A) Multiple EC2 instances sharing an IP
- B) **A service to launch and manage a fleet of EC2 instances across multiple instance types and purchase options (On-Demand, RI, Spot) simultaneously**
- C) A networking feature
- D) Same as Auto Scaling Group

**✅ B** — EC2 Fleet: define target capacity → AWS fulfills using mix of instance types/purchase options. More control than Spot Fleet.

---

## Q269
**A company has 10 EC2 instances. 7 should be running at all times (minimum), 3 are flexible. How should they structure their purchasing?**
- A) 10 Spot Instances
- B) **7 Reserved Instances (baseline) + 3 On-Demand or Spot (flexible capacity)**
- C) 10 On-Demand Instances
- D) 10 Dedicated Hosts

**✅ B** — RI for predictable baseline + On-Demand/Spot for variable = cost-optimal pattern

---

## Q270
**What is the purpose of "EC2 Instance Retirement" notification?**
- A) AWS wants to charge more
- B) **AWS scheduled maintenance requiring the underlying hardware to be replaced; instance must be stopped/started (not just rebooted) to migrate to new hardware**
- C) Instance license expired
- D) Auto Scaling is removing the instance

**✅ B** — Retirement = hardware degrading. AWS notifies you. Stop + Start → migrates to new hardware. Reboot alone doesn't migrate.

---

## Q271
**A company stores application code in S3 and needs to deploy it to EC2 instances. Which service provides automated deployment to EC2?**
- A) AWS CloudFormation B) **AWS CodeDeploy** C) AWS CodeBuild D) AWS Elastic Beanstalk
**✅ B** — CodeDeploy = automated deployment to EC2, Lambda, ECS. Supports rolling, blue/green, canary deployments.

---

## Q272
**What is the difference between AMI and Snapshot in AWS?**
- A) They are the same thing
- B) **Snapshot = point-in-time backup of a single EBS volume; AMI = complete machine image including one or more snapshots + launch permissions + block device mapping**
- C) AMI is for S3, Snapshot is for EBS
- D) Snapshot is newer than AMI

**✅ B** — AMI = includes snapshots (one per volume) + configuration. Snapshot alone = cannot launch instance.

---

## Q273
**A company needs to patch all EC2 instances in their environment automatically on a schedule. Which service should they use?**
- A) AWS Config B) **AWS Systems Manager Patch Manager** C) AWS CodeDeploy D) CloudWatch Events
**✅ B** — SSM Patch Manager: define patch baseline → maintenance window → automatically patches EC2 instances (and on-premises servers via SSM Agent)

---

## Q274
**An application suddenly needs 1000 EC2 instances for 1 hour (one-time event). What is the MOST cost-effective approach?**
- A) 1000 Reserved Instances
- B) **1000 On-Demand Instances (or Spot if fault-tolerant) for exactly 1 hour**
- C) 1000 Dedicated Hosts
- D) Purchase EC2 Savings Plans

**✅ B** — One-time 1-hour = On-Demand (no commitment, no waste). If fault-tolerant = Spot for ~90% savings.

---

## Q275
**What is the "Launch Template version" used for in Auto Scaling?**
- A) Track billing changes
- B) **Enable rolling updates by creating new versions; ASG can use specific version or "$Latest" or "$Default"**
- C) Manage IAM versions
- D) Track CloudFormation changes

**✅ B** — Launch Template versioning: create new version (new AMI) → update ASG or use Instance Refresh → controlled rollout

---

## Q276
**A company uses Spot Instances. AWS sends a 2-minute interruption notice. What should their application do?**
- A) Ignore the notice
- B) **Gracefully save state/progress, complete in-flight transactions, then allow termination; use Instance Metadata Service to poll for interruption notice**
- C) Purchase On-Demand immediately
- D) Reboot the instance

**✅ B** — Spot interruption handling: poll IMDS `spot/termination-time` → detect notice → graceful shutdown → checkpoint to S3/DDB → let instance terminate

---

## Q277
**What does "Enhanced Networking" (ENA) provide on EC2 instances?**
- A) GPU acceleration
- B) **Higher bandwidth (up to 100 Gbps), lower latency, lower CPU usage for networking (SR-IOV based)**
- C) Dedicated IP addresses
- D) Automatic route table updates

**✅ B** — ENA (Elastic Network Adapter): SR-IOV = bypass hypervisor → better network performance. Required for HPC, high-traffic applications.

---

## Q278
**A company's EC2 application logs are being stored locally. If the instance terminates, logs are lost. What is the recommended solution?**
- A) Use larger EBS volumes B) Enable instance store C) **Use CloudWatch Logs Agent to stream logs in real-time to CloudWatch** D) Use EBS snapshots every hour
**✅ C** — CloudWatch Logs Agent (or CloudWatch Unified Agent): stream logs → CloudWatch Logs → persistent, searchable, never lost on instance termination

---

## Q279
**What is EC2 Spot Fleet?**
- A) A type of placement group
- B) **A collection of Spot Instances (and optionally On-Demand) meeting specified target capacity, with automatic diversification across instance types and AZs**
- C) EC2 for fleet management companies
- D) A monitoring service for EC2

**✅ B** — Spot Fleet: maintain target capacity using lowest-cost combination. Allocation strategies: lowestPrice, diversified, capacityOptimized

---

## Q280
**A company's Auto Scaling group keeps scaling out and in repeatedly (thrashing). How can they reduce this?**
- A) Disable scaling
- B) **Increase the cooldown period and use Target Tracking (smoother than Step Scaling) or adjust alarm thresholds**
- C) Use Reserved Instances
- D) Add more AZs

**✅ B** — Scale thrashing prevention:
- Target Tracking (smoothing algorithm built-in)
- Increase cooldown period
- Adjust CPU thresholds (wider band: scale out 80%, scale in 20%)

---

## Q281–Q300 (Lightning Round)

**Q281:** What is the default behavior of Auto Scaling when an ELB health check fails for an instance?
**✅ A** — Terminate and replace the unhealthy instance

**Q282:** Which EC2 instance type provides the best price-performance for ARM-based workloads?
**✅ B** — Graviton (M7g, C7g, R7g) — up to 40% better price-performance than x86

**Q283:** Can you change the instance type of a running EC2 instance without stopping it?
**✅ D** — NO — must STOP the instance first, then change instance type, then start. (Exception: some Elastic resize possible in newer instance types)

**Q284:** What is EC2 Hibernate primarily used for?
**✅ C** — Preserve in-memory state (RAM) across instance stop/start for faster application resume

**Q285:** A company needs to process images uploaded to S3. Processing takes 3 minutes per image. Which compute is BEST?
**✅ B** — Lambda (triggered by S3 event, up to 15 min, serverless, pay per invocation)

**Q286:** What minimum EBS volume size can be created?
**✅ A** — 1 GiB (gp2, gp3, io1, io2, sc1, st1 minimum sizes vary; gp2/gp3 minimum = 1 GiB)

**Q287:** What is the benefit of EC2 Compute Savings Plans over Standard Reserved Instances?
**✅ C** — Compute SP: flexible (any family, region, OS). RI: specific family/region. SP = more flexible, slightly less discount.

**Q288:** Can EBS volumes be encrypted after creation?
**✅ B** — Create snapshot → copy with encryption enabled → create new encrypted volume from snapshot. Cannot encrypt existing volume in-place.

**Q289:** A company runs stateless web app on 10 EC2 instances. 3 instances fail simultaneously. Traffic automatically redistributes to remaining 7 instances. What enables this?
**✅ A** — ALB health checks detect failures → remove from target group → redistribute to healthy instances

**Q290:** Which launch type for ECS charges per vCPU and memory used by tasks (not per EC2 instance)?
**✅ B** — ECS Fargate pricing = per vCPU + memory per second used

**Q291:** What is the maximum EBS volume size?
**✅ C** — 64 TiB (io1, io2, gp2, gp3, st1, sc1 all support up to 64 TiB)

**Q292:** A company's Lambda function needs more memory. How does increasing memory affect CPU?
**✅ B** — Increasing Lambda memory ALSO proportionally increases CPU allocation (directly correlated)

**Q293:** What is "EC2 Auto Scaling predictive scaling"?
**✅ A** — Uses ML to predict future load based on historical patterns and proactively scales ahead of demand

**Q294:** A company uses EC2 with an IAM role. The role permissions were recently changed. When do the new permissions take effect?
**✅ C** — Almost immediately (within seconds to minutes); IAM policy changes = near real-time (new API calls use new permissions)

**Q295:** What is the purpose of the "ASG Desired Capacity"?
**✅ B** — The number of instances ASG tries to maintain at all times (between Min and Max)

**Q296:** Which metric is used by Target Tracking to maintain a specific request rate per EC2 instance behind an ALB?
**✅ A** — `ALBRequestCountPerTarget` — maintains N requests per instance, scales to maintain the target

**Q297:** An EC2 instance continuously fails status checks. What should the auto-recovery configuration do?
**✅ B** — CloudWatch Alarm on `StatusCheckFailed_System` + EC2 Auto Recovery action → migrate to new hardware

**Q298:** What is the difference between "Stop" and "Hibernate" for EC2?
**✅ C** — Stop: RAM cleared, cold start on resume. Hibernate: RAM saved to EBS, warm start on resume.

**Q299:** A company needs to run a Windows .NET application on EC2. What instance family do they NOT need?
**✅ D** — G-family (GPU) — unless doing GPU-accelerated .NET, not needed for standard .NET application

**Q300:** What happens to an EC2 Spot Instance when the Spot price exceeds your max bid price?
**✅ B** — Instance receives 2-minute interruption notice, then AWS terminates, stops, or hibernates it (based on configuration)

---

> ## 🎯 Set 03 Complete! — Compute, EC2 & Auto Scaling (Q201–Q300)
>
> **Domain 3: High-Performing + Domain 4: Cost-Optimized ✅**
>
> **Score:** ___/100
>
> ➡️ **Next:** [Exam Set 04 — Storage & S3 (Q301-Q400)](./Exam_Set_04_Storage_S3.md)
