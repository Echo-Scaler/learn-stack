---
title: "AWS SAA-C03 Practice Exam — Set 02: Networking & VPC"
description: "မေးခွန်းများ English ဖြင့်၊ ရှင်းလင်းချက်များ မြန်မာဘာသာဖြင့်ဖြစ်သည်"
---

## AWS SAA-C03 Practice Exam — Set 02: Networking & VPC
## Questions Q101–Q200 | Domain 1 (30%) + Domain 3 (24%)

> မေးခွန်းများ English ဖြင့်၊ ရှင်းလင်းချက်များ မြန်မာဘာသာဖြင့်ဖြစ်သည်

---

## Q101
**A company has a VPC with CIDR 10.0.0.0/16. They need to create subnets for web servers (public), application servers (private), and databases (private). How many subnets at minimum should they create for high availability across 2 Availability Zones?**

A) 2 subnets
B) 4 subnets
C) 6 subnets
D) 3 subnets

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
High Availability ဖြစ်ရန် AZ တစ်ခုစီတွင် 3-tier (public, private app, private DB) ခွဲထားရမည်:
```
AZ-1a:                    AZ-1c:
- Public Subnet (Web)     - Public Subnet (Web)
- Private Subnet (App)    - Private Subnet (App)
- Private Subnet (DB)     - Private Subnet (DB)
```
= 3 subnets × 2 AZs = **6 subnets minimum**

**Real Exam Tip:** "high availability" + N-tier app + 2 AZs → N × 2 subnets

---

## Q102
**A company's application in a VPC needs to communicate with another company's application in a different VPC (different AWS account). Both VPCs have non-overlapping CIDR ranges. The connection should be private and not go through the internet. What is the SIMPLEST solution?**

A) AWS Direct Connect
B) Site-to-Site VPN
C) VPC Peering
D) AWS Transit Gateway

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**VPC Peering** သည် same/different accounts ၊ same/different regions ရှိ VPCs ကြား private connection ဖြစ်ပြီး:
- CIDR overlap မဖြစ်ရ (prerequisite)
- Transitive routing မရ (A-B, B-C peered ဆိုလည်း A-C မရ)
- Simple setup (no gateway needed)

**A မှားသည်** — Direct Connect = on-premises to AWS
**C မှန်သည်** — VPC Peering = simplest for 2 VPC connection
**D မှားသည်** — Transit Gateway = many VPCs (overkill for 2)

---

## Q103
**A company has 15 VPCs and needs full mesh connectivity between all of them. They also need to connect to on-premises via Direct Connect. What is the MOST scalable solution?**

A) VPC Peering (create 105 peering connections)
B) AWS Transit Gateway
C) Multiple Direct Connect connections
D) VPN CloudHub

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
15 VPCs full mesh = n(n-1)/2 = 15×14/2 = **105 peering connections** (manage ခက်)

**AWS Transit Gateway** = hub-and-spoke model:
- VPC 15 ခု → TGW ကို attach လုပ်ရုံ (15 attachments)
- TGW = routing hub (transitive routing support)
- Direct Connect Gateway + TGW = on-premises connectivity ပါ

**Real Exam Tip:** "many VPCs" + "scalable" + "on-premises" → **Transit Gateway**

---

## Q104
**An EC2 instance in a private subnet needs to reach the internet for software updates. The instance should NOT be reachable from the internet. Which configuration achieves this?**

A) Attach an Internet Gateway to the private subnet
B) Place a NAT Gateway in a public subnet and update the private subnet route table
C) Use a NAT Instance
D) Configure a VPN connection

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**NAT Gateway Setup:**
1. Public Subnet တွင် **NAT Gateway** create (Elastic IP assign)
2. Internet Gateway ကို VPC attach
3. Private Subnet route table: `0.0.0.0/0 → NAT Gateway`
4. Public Subnet route table: `0.0.0.0/0 → Internet Gateway`

NAT Gateway = outbound internet OK, inbound blocked ✓

**NAT Gateway vs NAT Instance:**
| | NAT Gateway | NAT Instance |
|-|-------------|-------------|
| Managed | AWS | Customer |
| HA | Automatic (AZ) | Manual |
| Bandwidth | Up to 45 Gbps | Instance type limit |
| Cost | Higher | Lower |

---

## Q105
**A company uses AWS Direct Connect with a 1Gbps connection. They want to add redundancy to avoid single point of failure. What is the BEST approach?**

A) Add more EC2 instances
B) Configure a second Direct Connect connection from a different Direct Connect location
C) Enable Direct Connect auto-failover
D) Use S3 Transfer Acceleration

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Direct Connect Redundancy** ကို achieve ရန်:
- **Second DX connection** from different DX location (most resilient)
- Or: Primary DX + **Backup VPN** (cost-effective, lower bandwidth failover)

AWS recommends: Two Direct Connect connections from two different DX locations for maximum resiliency

---

## Q106
**A company has web servers in a public subnet and application servers in a private subnet. The application servers need to call external APIs on the internet. They currently use a NAT Gateway. The company wants to reduce costs. What should they consider?**

A) Remove NAT Gateway and use public IPs
B) Replace NAT Gateway with a NAT Instance (t3.small)
C) Use VPC Endpoints for AWS services and evaluate if external API calls can be reduced
D) Move application servers to public subnet

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
Cost optimization approach:
1. AWS Services (S3, DynamoDB, etc.) → **Gateway Endpoints (Free)** → NAT Gateway traffic ကို reduce
2. External APIs → Check if can be cached/reduced
3. NAT Instance = cheaper than NAT GW (but management overhead)

**Real Exam Tip:** "reduce NAT Gateway costs" → First consider **VPC Endpoints** for AWS services

---

## Q107
**A company's application runs in VPC A and needs to access an S3 bucket. They want traffic to remain within the AWS network and avoid data transfer charges through a NAT Gateway. What should they configure?**

A) S3 Transfer Acceleration
B) VPC Gateway Endpoint for S3
C) VPC Interface Endpoint for S3
D) Direct Connect

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**S3 VPC Gateway Endpoint:**
- Free (no hourly/data transfer charge)
- Routes S3 traffic through AWS network (not internet)
- Update route table + bucket policy
- Eliminates NAT Gateway data processing fees for S3

**Gateway Endpoint vs Interface Endpoint for S3:**
- Gateway Endpoint: Free, simpler, routing table change
- Interface Endpoint: $0.01/GB + hourly, but works from on-premises via DX/VPN

---

## Q108
**A company is setting up a new VPC. They need to understand the default components created automatically. Which of the following is NOT automatically created with a new VPC?**

A) Default Security Group
B) Default Network ACL
C) Main Route Table
D) Internet Gateway

**✅ Correct Answer: D**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
VPC create ဖြစ်သောအခါ automatically create ဖြစ်သည်:
- ✅ Default Security Group
- ✅ Default Network ACL (allow all)
- ✅ Main Route Table (local route only)
- ✅ Default DHCP options set
- ❌ **Internet Gateway** → manually attach လုပ်ရမည် (NOT automatic)
- ❌ Subnets → manually create ရမည်

---

## Q109
**A company needs to allow traffic on port 443 (HTTPS) to their EC2 instances from anywhere on the internet. Where should this rule be configured?**

A) Network ACL (inbound allow) only
B) Security Group (inbound allow) only
C) Both Security Group (inbound allow) and Network ACL (inbound allow)
D) Route Table

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Security Group** = stateful (inbound allow → return traffic automatic)
**Network ACL** = stateless (inbound AND outbound rules both needed):
- Inbound: Allow 443 from 0.0.0.0/0
- Outbound: Allow ephemeral ports (1024-65535) to 0.0.0.0/0 (return traffic)

Security Group rule ဖြင့် port 443 allow → SG stateful ဖြစ်ပြီး SG ကသာ allow ရပြီ။ NACL ကိုပါ configure ဖြစ်ရသည် (ဒုတိယ layer ဖြစ်သောကြောင့်)

---

## Q110
**A company has a VPC with CIDR 10.0.0.0/16. They want to create a subnet with 256 IP addresses. What subnet mask should they use?**

A) /16
B) /24
C) /28
D) /20

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
/24 subnet = 2^8 = 256 total IPs, AWS reserves 5 IPs → **251 usable**
- /28 = 16 IPs (small)
- /24 = 256 IPs ✓
- /20 = 4096 IPs (large)
- /16 = 65536 IPs (entire VPC)

**AWS Reserved IPs in each subnet:**
- .0 = Network address
- .1 = VPC Router
- .2 = DNS
- .3 = Future use
- .255 = Broadcast

---

## Q111
**A company wants to connect their on-premises Active Directory to AWS for authentication. They want to extend their existing AD without replacing it. Which AWS Directory Service option should they use?**

A) AWS Managed Microsoft AD (Enterprise Edition)
B) AD Connector
C) Simple AD
D) Amazon Cognito

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**AD Connector** = Proxy service that forwards authentication requests to on-premises AD. Existing AD ကို extend/replace မလုပ်ဘဲ AWS services ကို corporate AD credentials ဖြင့် access ဖြစ်ရသည်။
- **AWS Managed Microsoft AD** = full managed AD in AWS (separate from on-premises)
- **AD Connector** = proxy to existing on-premises AD (no data replication)
- **Simple AD** = standalone Samba-based (small, Linux)

**Real Exam Tip:** "extend existing on-premises AD" → **AD Connector**

---

## Q112
**A company is deploying a web application. They need to distribute incoming traffic across multiple EC2 instances and ensure that users are always directed to the same server during their session. Which Load Balancer feature should they enable?**

A) Cross-Zone Load Balancing
B) Sticky Sessions (Session Affinity)
C) Connection Draining
D) Health Checks

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Sticky Sessions (Session Affinity):**
- ALB/CLB feature
- Cookie ဖြင့် user ကို specific backend instance ချိတ်ဆက်သည်
- Same user → always same server → session data consistent ဖြစ်သည်
- Downside: Uneven load distribution

**Real Exam Tip:** "same server during session" + "session affinity" → **Sticky Sessions**

---

## Q113
**A company wants to route traffic to different backend services based on the URL path. `/api` requests should go to API servers, and `/static` requests should go to S3. Which load balancer type supports this?**

A) Network Load Balancer (NLB)
B) Classic Load Balancer (CLB)
C) Application Load Balancer (ALB)
D) Gateway Load Balancer (GWLB)

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**ALB (Application Load Balancer)** = Layer 7 load balancer:
- **Path-based routing**: `/api` → Target Group A, `/static` → Target Group B
- **Host-based routing**: `api.example.com` → different backend
- **HTTP header routing**: custom logic
- **Lambda targets**: S3 ကို redirect ဖြင့် route နိုင်

**Load Balancer Types:**
| Type | Layer | Use Case |
|------|-------|----------|
| ALB | L7 (HTTP/HTTPS) | Web apps, microservices |
| NLB | L4 (TCP/UDP) | Ultra-low latency, static IP |
| GWLB | L3 | 3rd-party appliances |

---

## Q114
**A company needs a load balancer that can handle millions of requests per second with ultra-low latency. The application uses TCP connections. Which load balancer should they use?**

A) Application Load Balancer
B) Network Load Balancer
C) Classic Load Balancer
D) Gateway Load Balancer

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**NLB (Network Load Balancer)** = Layer 4:
- Millions of requests/second
- Ultra-low latency (<1ms)
- Static IP per AZ (Elastic IP support)
- TCP, UDP, TLS termination
- Use case: Gaming, financial apps, real-time apps

**Real Exam Tip:** "millions RPS" + "ultra-low latency" + "TCP/UDP" → **NLB**

---

## Q115
**A company's application needs a static IP address for their load balancer. Users will whitelist this IP. Which AWS load balancer provides this capability?**

A) Application Load Balancer
B) Network Load Balancer (with Elastic IP)
C) Classic Load Balancer
D) ALB with Elastic IP

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**NLB** သည် AZ တစ်ခုစီတွင် static IP (Elastic IP assign ဖြစ်နိုင်) ရသည်။
ALB = dynamic DNS name only (IP changes)
NLB = static IP per AZ (or Elastic IP assignment)

**Real Exam Tip:** "static IP" + load balancer → **NLB**

---

## Q116
**A company wants to inspect all traffic entering their AWS environment through a firewall appliance from a third-party vendor (e.g., Palo Alto). Which load balancer enables transparent traffic inspection?**

A) Application Load Balancer
B) Network Load Balancer
C) Gateway Load Balancer
D) Classic Load Balancer

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Gateway Load Balancer (GWLB)**:
- Layer 3 (IP packet level)
- Third-party virtual appliances (firewalls, IDS/IPS, deep packet inspection)
- GENEVE protocol ဖြင့် traffic encapsulate → appliance → decapsulate → forward
- Transparent inspection (original source/dest IPs preserved)

**Use case:** Deploy Palo Alto, Fortinet firewalls as virtual appliances in AWS

---

## Q117
**A company uses Route 53 for DNS. They want to distribute traffic between two regions (us-east-1 and ap-northeast-1) based on the user's geographic location. Users in Asia should be directed to ap-northeast-1. Which Route 53 routing policy should they use?**

A) Weighted Routing
B) Latency-Based Routing
C) Geolocation Routing
D) Failover Routing

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Geolocation Routing** = user ၏ geographic location (country/continent) အပေါ် အခြေခံပြီး DNS response ပြောင်းပေးသည်:
- Asia/Pacific users → ap-northeast-1
- US users → us-east-1
- Default record → any unmatched

**vs Latency Routing:**
- Latency = actual network latency measurement (actual performance)
- Geolocation = geographic mapping (compliance, localization)

---

## Q118
**A company has two environments: primary (us-east-1) and disaster recovery (us-west-2). Route 53 should direct all traffic to primary unless it's unhealthy. Which routing policy should they use?**

A) Weighted Routing (50/50)
B) Failover Routing with Health Checks
C) Geolocation Routing
D) Multivalue Answer Routing

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Route 53 Failover Routing:**
- Primary record + Secondary (DR) record
- Health Check on Primary
- Primary unhealthy → Route 53 automatic failover to Secondary
- RTO (Recovery Time Objective) = DNS TTL time

**Real Exam Tip:** "primary + DR" + "automatic failover" → **Failover Routing + Health Check**

---

## Q119
**A company wants to gradually migrate traffic from their old web server to new web server. They want to send 10% to new server initially, then gradually increase. Which Route 53 routing policy enables this?**

A) Failover Routing
B) Latency Routing
C) Weighted Routing
D) Simple Routing

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Route 53 Weighted Routing:**
- Old server: weight 90, New server: weight 10 → 90%/10% split
- Gradually increase new server weight
- Blue/Green deployment, A/B testing, canary deployment

**Weighted Routing Formula:** Weight of record / Total weight of all records = Traffic %

---

## Q120
**An application has users worldwide. They need the lowest latency DNS responses. Which Route 53 routing policy directs users to the endpoint that provides the best performance?**

A) Geolocation Routing
B) Latency-Based Routing
C) Weighted Routing
D) Geoproximity Routing

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Latency-Based Routing** = AWS ၏ latency data ကို အသုံးပြုပြီး user မှ fastest endpoint ကို route ပေးသည်:
- Tokyo user → ap-northeast-1 (lowest latency)
- London user → eu-west-1 (lowest latency)
- Actual measurement-based (not just geography)

---

## Q121
**A company deployed an application behind an ALB. They want to configure the ALB to accept only HTTPS traffic and redirect all HTTP requests to HTTPS. How should they configure this?**

A) Create two listeners: HTTP (redirect to HTTPS) and HTTPS (forward to target group)
B) Delete the HTTP listener
C) Configure Security Groups to block port 80
D) Enable SSL offloading

**✅ Correct Answer: A**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**ALB HTTP → HTTPS Redirect:**
1. ALB Listener port 80 (HTTP) → **Redirect to 443** (HTTPS)
2. ALB Listener port 443 (HTTPS) → **Forward to Target Group**
3. SSL Certificate on ALB (ACM Certificate)

User HTTP request → ALB redirects → HTTPS → ALB → Backend servers (HTTP internally)

---

## Q122
**A company uses CloudFront to distribute content globally. They want to restrict access so only CloudFront can access the origin S3 bucket, not direct S3 URL. What should they configure?**

A) S3 bucket policy with VPC restriction
B) CloudFront Origin Access Control (OAC) / Origin Access Identity (OAI)
C) S3 Transfer Acceleration
D) CloudFront signed URLs

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**CloudFront OAC (Origin Access Control)** (newer) or **OAI (Origin Access Identity)** (older):
1. CloudFront distribution တွင် OAC configure
2. S3 Bucket Policy: CloudFront service principal ကိုသာ allow
3. S3 bucket = private (public access blocked)
4. Users → CloudFront URL ကိုသာ access ဖြစ်ရ (direct S3 URL blocked)

---

## Q123
**A company wants to block traffic from specific countries for their CloudFront distribution. Which feature should they use?**

A) CloudFront Origin Access Control
B) CloudFront Geographic Restrictions (Geo-restriction)
C) AWS WAF with country matching rules
D) Route 53 Geolocation Routing

**✅ Correct Answer: B (or C)**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**CloudFront Geographic Restrictions:**
- Whitelist: only specified countries allow
- Blacklist: specified countries block
- Built-in feature, no additional cost

**AWS WAF with country matching** = more granular (specific URLs, paths)

**Real Exam Tip:** Simple country-based blocking → **CloudFront Geo-restriction**
Complex rules → **WAF with geo-match condition**

---

## Q124
**A company's global application serves both static content (images, CSS) and dynamic API responses. They want to cache static content at edge locations while dynamic API responses should always go to origin. What should they configure in CloudFront?**

A) Single behavior for all paths
B) Create separate CloudFront behaviors: one for static content (cache enabled) and one for `/api/*` (cache disabled/TTL=0)
C) Use two separate CloudFront distributions
D) Enable Lambda@Edge for all requests

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**CloudFront Behaviors (Cache Policies):**
- Default behavior (`*`): Static content → Cache enabled (TTL: 86400s)
- `/api/*` behavior: Dynamic content → TTL=0 (no cache) + forward all headers/cookies
- Path pattern matching allows per-path caching policies

---

## Q125
**A company runs a TCP-based application on ECS. They need a load balancer that preserves the client's source IP address. Which load balancer should they use?**

A) Application Load Balancer
B) Network Load Balancer
C) Classic Load Balancer
D) Gateway Load Balancer

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**NLB** = source IP preservation by default (no SNAT for TCP):
- Client IP reaches the backend server directly
- ALB = X-Forwarded-For header ဖြင့် client IP pass (Layer 7)
- NLB = actual source IP preserved (Layer 4)

**Real Exam Tip:** "preserve client source IP" + TCP → **NLB**

---

## Q126
**A company needs to implement a multi-region active-active architecture. Users should be routed to the nearest healthy region. Which Route 53 routing policy supports this?**

A) Simple Routing
B) Failover Routing
C) Latency-Based Routing + Health Checks
D) Weighted Routing (50/50)

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Active-Active Multi-Region:**
- Latency-Based Routing → nearest region route
- Health Checks → unhealthy region ကို automatically remove
- All regions active simultaneously
- Users get best performance + automatic failover

vs Active-Passive (Failover) = primary active, secondary standby

---

## Q127
**A company has an internal corporate application that should only be accessible from within their VPC. Which type of load balancer endpoint should they use?**

A) Internet-facing ALB
B) Internal ALB
C) Public NLB
D) Gateway Load Balancer

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Internal Load Balancer** = private IP addresses only → VPC ထဲမှသာ accessible:
- DNS name resolves to private IPs
- Internet ကနေ access မဖြစ်
- Corporate internal apps, microservices ကြား communication

**Internet-facing** = public + private IPs → internet-accessible

---

## Q128
**A company uses Route 53 health checks to monitor their endpoints. Their primary endpoint becomes unhealthy. Route 53 automatically fails over to secondary. What is the approximate time for DNS failover to propagate?**

A) Immediately (0 seconds)
B) Based on DNS TTL (Time to Live) value set on the record
C) Always 60 seconds
D) 24 hours

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
Route 53 failover speed = **DNS TTL** ပေါ် မူတည်သည်:
- TTL 60s → ~60 seconds failover
- TTL 300s → ~300 seconds (5 min) failover
- For critical apps: use low TTL (60s or less)
- Trade-off: Low TTL = faster failover but more DNS queries (cost)

---

## Q129
**A company needs their VPC to resolve DNS names for their on-premises servers (e.g., db.corp.internal). They use Route 53 Resolver. What should they configure?**

A) Route 53 Public Hosted Zone
B) Route 53 Resolver Inbound/Outbound Endpoints with forwarding rules
C) VPC DHCP Options with custom DNS
D) Route 53 Private Hosted Zone

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Route 53 Resolver Hybrid DNS:**
- **Outbound Endpoint**: VPC DNS queries → on-premises DNS (resolve on-prem names)
- **Inbound Endpoint**: On-prem DNS queries → AWS Route 53 (resolve AWS names)
- **Forwarding Rules**: `.corp.internal` → on-prem DNS server IP

ဤ architecture ဖြင့် hybrid network တွင် both-direction DNS resolution ဖြစ်သည်

---

## Q130
**A company wants to accelerate the transfer of large files from users worldwide to their S3 bucket in us-east-1. Which feature should they use?**

A) S3 Cross-Region Replication
B) S3 Transfer Acceleration
C) CloudFront with S3 origin
D) AWS Global Accelerator

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**S3 Transfer Acceleration:**
- CloudFront edge locations ကို upload path ဖြစ်သည်
- User → nearest CloudFront edge → AWS backbone network → S3
- Globally distributed users မှ large file uploads ကို speed up ဖြစ်သည်
- Cost: additional per-GB charge (only if faster than standard)

**Real Exam Tip:** "large file uploads" + "global users" + "S3" → **S3 Transfer Acceleration**

---

## Q131
**A company deploys an application across multiple AWS regions. They want to improve global performance and provide automatic failover with static Anycast IP addresses. Which service should they use?**

A) Route 53 Latency Routing
B) CloudFront
C) AWS Global Accelerator
D) Elastic Load Balancing

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**AWS Global Accelerator:**
- **2 static Anycast IP addresses** (worldwide anycast routing)
- Routes traffic through AWS backbone (not internet)
- Health checks + automatic failover
- For: TCP/UDP apps (not just HTTP), gaming, IoT, non-HTTP

**CloudFront vs Global Accelerator:**
| | CloudFront | Global Accelerator |
|---|------------|-------------------|
| Caching | Yes | No |
| Protocol | HTTP/HTTPS | TCP, UDP, HTTP |
| Static IP | No | Yes (2 Anycast IPs) |
| Use case | Content delivery | Performance + static IP |

---

## Q132
**A company's VPC CIDR is 10.0.0.0/16. They try to peer with another VPC with CIDR 10.0.0.0/24. Why would VPC peering fail?**

A) Different regions
B) CIDR overlap (10.0.0.0/24 is a subset of 10.0.0.0/16)
C) Different AWS accounts
D) Too many VPCs

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**VPC Peering CIDR Overlap Rule:**
10.0.0.0/24 ⊂ 10.0.0.0/16 → ၎င်းတို့ overlap ဖြစ်သောကြောင့် VPC Peering establish မဖြစ်နိုင်ပါ
Route table confusion ဖြစ်မည် (same IP range, two destinations)

**Solution:** One VPC ၏ CIDR ကို 10.1.0.0/16 ဟု ပြောင်းမှ peering ဖြစ်မည်

---

## Q133
**A company uses a Transit Gateway to connect multiple VPCs. They want to prevent VPC A from communicating with VPC B, while still allowing both to communicate with a shared services VPC. What should they configure?**

A) Separate route tables on Transit Gateway
B) VPC Peering between shared VPC and each VPC
C) Security Groups
D) Network ACLs

**✅ Correct Answer: A**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Transit Gateway Route Tables (Isolation):**
- VPC A + VPC B → separate TGW route table ( တစ်ခုနှင့်တစ်ခု route မပါ)
- Shared VPC → route table ကို VPC A + B ၏ routes ပါ

ဤ pattern = "Segregated Routing" or "Isolated VPCs with shared services"

---

## Q134
**A company wants to use AWS PrivateLink to expose their internal service to other VPCs without VPC peering. What components are needed?**

A) VPC Peering + Route Tables
B) NLB in service provider VPC + VPC Endpoint Service + Interface Endpoint in consumer VPC
C) Transit Gateway + Route Tables
D) Internet Gateway + NAT Gateway

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**AWS PrivateLink Architecture:**
1. **Provider VPC:** Service behind **NLB**
2. Provider creates **VPC Endpoint Service** (references NLB)
3. **Consumer VPC:** Creates **Interface Endpoint** pointing to provider's service
4. Consumer accesses service via private IP (no VPC peering, no routing changes)

**Benefits:** CIDR overlap OK, transitive routing not needed, scalable

---

## Q135
**A company needs to connect 100 branch offices to AWS VPC via VPN. They want to manage this centrally. Which service should they use?**

A) 100 separate Site-to-Site VPN connections
B) AWS Transit Gateway with Site-to-Site VPN attachments
C) AWS Direct Connect
D) VPC Peering

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Transit Gateway VPN Scale:**
- Each branch → TGW VPN attachment
- TGW = central hub
- Up to 5,000 VPN connections per TGW
- Centralized management + route propagation

**AWS VPN CloudHub** = older approach (max: cost effective, limited)
**TGW** = modern recommended (scalable)

---

## Q136
**A company has a VPC with public and private subnets. They launch an EC2 instance in the public subnet but the instance cannot access the internet. What is likely missing?**

A) Security Group outbound rule
B) Internet Gateway not attached to VPC, or route table missing `0.0.0.0/0 → IGW`
C) NAT Gateway
D) Elastic IP

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
Public Subnet Internet Access Checklist:
1. ✅ IGW attached to VPC
2. ✅ Route table: `0.0.0.0/0 → IGW`
3. ✅ Public IP or Elastic IP on instance
4. ✅ Security Group: outbound allow
5. ✅ NACL: inbound/outbound allow

IGW missing or route missing → no internet ✗

---

## Q137
**A company is experiencing intermittent connectivity issues with their NLB. Backend EC2 instances are healthy. What could be causing this?**

A) NLB health check interval too long
B) Cross-zone load balancing is disabled, causing uneven distribution
C) ALB should be used instead
D) Security Groups on NLB blocking traffic

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Cross-Zone Load Balancing:**
- Disabled: Each AZ's NLB node distributes to instances in SAME AZ only
- If AZ-1 has 2 instances, AZ-2 has 8 instances: AZ-1 instances get 50% traffic each (overloaded!)
- Enabled: All NLB nodes distribute evenly across ALL instances in all AZs

**ALB**: Cross-zone enabled by default (free)
**NLB**: Disabled by default (cross-zone charges apply)

---

## Q138
**A company has a microservices application. Service A (in VPC A) needs to call Service B (in VPC B). They don't want to use VPC Peering or Transit Gateway. What option maintains service isolation?**

A) Direct Connect
B) AWS PrivateLink (Interface Endpoint)
C) Internet Gateway
D) VPN

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**PrivateLink** = Services expose via NLB → Endpoint Service → consumers connect via Interface Endpoint:
- No full VPC access (only specific service)
- CIDR overlap tolerated
- Provider/Consumer isolation maintained
- No route table changes needed

---

## Q139
**A company uses CloudFront. They want certain content to be accessible only to authenticated users with time-limited access. How should they implement this?**

A) CloudFront Geo-restriction
B) CloudFront Signed URLs or Signed Cookies
C) CloudFront Origin Access Control
D) AWS WAF on CloudFront

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**CloudFront Signed URLs / Signed Cookies:**
- **Signed URL**: Single file per URL, time-limited
- **Signed Cookie**: Multiple files, same policy (premium content)
- Requires CloudFront key pair + signing code
- Expires after specified time → unauthorized access blocked

**Use case:** Video streaming, software downloads, paid content

---

## Q140
**A company wants to implement a hub-and-spoke VPC architecture where spoke VPCs cannot communicate with each other directly. What is the BEST solution?**

A) VPC Peering (spoke to spoke)
B) Transit Gateway with separate route tables (isolated spoke VPCs)
C) Internet Gateway routing
D) VPN connections between spokes

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**TGW Hub-and-Spoke Isolation:**
```
Spoke VPC A ─┐
Spoke VPC B ─┼─→ Transit Gateway ─→ Hub VPC (Shared Services)
Spoke VPC C ─┘
              (Spoke-to-spoke routes NOT in route table)
```
Each spoke has route to hub only, not to other spokes.

---

## Q141
**An application load balancer has multiple target groups. The company wants to implement blue-green deployments by switching traffic between old and new versions. Which ALB feature enables this?**

A) ALB Sticky Sessions
B) ALB Weighted Target Groups
C) ALB Multi-AZ
D) ALB Path-based routing

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**ALB Weighted Target Groups:**
- Blue (old): weight 100, Green (new): weight 0 → Start
- Blue: weight 90, Green: weight 10 → Canary
- Blue: weight 0, Green: weight 100 → Full cutover
- Rollback: Green weight ← Blue weight

---

## Q142
**A company has a private hosted zone in Route 53 for `internal.company.com`. EC2 instances in a VPC need to resolve these DNS names. What must be configured?**

A) VPC must have DNS hostnames AND DNS resolution enabled, and the private hosted zone must be associated with the VPC
B) Only DNS hostnames enabled
C) Only DNS resolution enabled
D) Set custom DHCP options

**✅ Correct Answer: A**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
Route 53 Private Hosted Zone prerequisites:
1. VPC → **enableDnsHostnames** = true
2. VPC → **enableDnsSupport** = true
3. Private Hosted Zone → **Associate** with VPC

မည်သည့်တစ်ခုမျှ missing ဖြစ်လျှင် private DNS resolution မဖြစ်ပါ

---

## Q143
**A company uses CloudFront with an ALB as origin. They want to ensure that requests to the ALB can only come from CloudFront, not directly from the internet. How should they implement this?**

A) Put ALB in private subnet
B) Configure ALB Security Group to allow traffic only from CloudFront IP ranges, and use a custom HTTP header verified at origin
C) Use VPC Endpoint for CloudFront
D) Enable ALB authentication

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**CloudFront → ALB Protection:**
1. CloudFront adds **custom HTTP header** (secret value)
2. ALB Security Group: allow from **CloudFront IP ranges** (managed prefix list: `com.amazonaws.global.cloudfront.origin-facing`)
3. ALB listener rule: Verify custom header matches → else return 403

ဤ double validation ဖြင့် direct ALB access ကို prevent ဖြစ်သည်

---

## Q144
**A company needs to provide internet access to EC2 instances running in a private subnet. They are concerned about cost. NAT Gateway costs $0.045/hour + data processing. What is a cost-effective alternative for dev environments?**

A) Elastic IP on each instance
B) NAT Instance (using EC2 with NAT AMI)
C) VPC Endpoint
D) Transit Gateway

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**NAT Instance** (EC2-based):
- Uses EC2 instance (t3.nano = ~$3/month vs NAT GW ~$32/month)
- Disable Source/Destination Check on NAT EC2
- Route table: `0.0.0.0/0 → NAT Instance`
- Not HA (manually configure failover), not scalable
- **Dev/test environments** = acceptable tradeoff

---

## Q145
**A company's application in VPC needs to access third-party API hosted in another company's VPC. The other company exposes it via AWS PrivateLink. What does your company need to create?**

A) VPC Peering
B) VPC Interface Endpoint pointing to the provider's Endpoint Service
C) Transit Gateway
D) Site-to-Site VPN

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
PrivateLink consumer side setup:
1. Provider ၏ **Endpoint Service name** ကို obtain ပါ
2. Your VPC တွင် **Interface Endpoint** create ပါ
3. Endpoint = private IP in your subnet
4. DNS name via endpoint → provider service reach ဖြစ်သည်

---

## Q146
**A company uses Route 53 and wants to return multiple IP addresses for the same DNS name for simple load balancing without a load balancer. Which routing policy achieves this?**

A) Weighted Routing
B) Multivalue Answer Routing
C) Simple Routing
D) Latency Routing

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Route 53 Multivalue Answer:**
- Multiple A records (IP addresses) for same domain
- Health check integration (unhealthy IPs removed from response)
- Returns up to 8 healthy records
- Client-side load balancing (DNS-based)

vs Simple Routing = can have multiple values BUT no health checks

---

## Q147
**An organization is designing network security for their 3-tier web application. Which is the CORRECT placement for security controls?**

A) All servers in public subnet with Security Groups only
B) Web (public subnet), App (private), DB (private), with Security Groups at each tier referencing previous tier's SG
C) All servers in private subnet with NAT Gateway
D) Use only NACLs for security

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**3-Tier Architecture Security Best Practice:**
```
Internet → ALB (public) → Web SG: allow 80/443 from internet
Web SG → App SG: allow app port from Web-SG only
App SG → DB SG: allow 3306 from App-SG only
DB SG: no direct internet access (private subnet)
```
Each tier ၏ SG ကို previous tier ၏ SG ကို reference ဖြင့် ဆက်ချိတ်သည်

---

## Q148
**A company wants to monitor all traffic flowing through their VPC for security analysis. They capture this data in S3 for analysis. What should they enable?**

A) AWS CloudTrail
B) VPC Flow Logs
C) ALB Access Logs
D) CloudWatch Metrics

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**VPC Flow Logs** captures:
- Source/Destination IP, Port, Protocol
- Bytes/Packets
- Accept/Reject decisions
- Time window

Send to: CloudWatch Logs or S3
**Does NOT capture:** Packet content (payload)
**Analyze with:** Amazon Athena (S3 logs), CloudWatch Logs Insights

---

## Q149
**An application requires low latency access to data for users in multiple regions. The company wants to use DynamoDB Global Tables. What network configuration is needed?**

A) VPC Peering between regions
B) No special network configuration (DynamoDB is a fully managed service accessible via public endpoints or VPC Interface Endpoints)
C) Direct Connect between regions
D) Transit Gateway

**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
DynamoDB = fully managed, regional service:
- Public endpoint via HTTPS
- VPC Interface Endpoint (optional, for private access)
- DynamoDB Global Tables = multi-region replication (automatic)
- No VPC peering between regions needed

---

## Q150
**A company has 200 EC2 instances across 5 VPCs in the same region. They need a centralized DNS solution where all instances can resolve each other's names. What is the MOST efficient solution?**

A) Public Route 53 hosted zone
B) Separate private hosted zone per VPC with cross-VPC associations
C) Central private hosted zone associated with all VPCs via Route 53 Resolver
D) Custom DNS server on EC2

**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**
**Centralized DNS with Route 53:**
1. Central **Private Hosted Zone** create
2. All 5 VPCs ကို PHZ ကို **associate** ပြုလုပ်
3. All instances → same DNS namespace ဖြင့် resolve ဖြစ်

Route 53 Resolver Outbound Endpoints + Forwarding Rules for cross-VPC custom DNS

---

## Q151–Q200 (Rapid Fire Networking Questions)

### Q151
**What is the maximum number of VPCs you can create per AWS region per account by default?**
**✅ Answer: 5** (can request increase via AWS Support)

---

### Q152
**Can VPC peering connections be used transitively? (A-B peered, B-C peered → can A reach C?)**
**✅ Answer: NO** — VPC Peering is NOT transitive. Use Transit Gateway for transitive routing.

---

### Q153
**What is the difference between an Availability Zone and an AWS Region?**
**✅ Answer:**
- Region = geographic area (e.g., ap-northeast-1 = Tokyo)
- AZ = isolated data centers within a Region (e.g., ap-northeast-1a, 1b, 1c)
- Each AZ = separate power, cooling, networking
- Minimum 2 AZs per Region (usually 3)

---

### Q154
**A Security Group has no inbound rules. What traffic is allowed inbound?**
**✅ Answer: NO traffic** — Default Security Group with no inbound rules = deny all inbound (implicit deny)

---

### Q155
**What is the difference between Security Groups and Network ACLs?**
**✅ Answer:**
| | Security Group | Network ACL |
|-|---------------|-------------|
| Level | Instance | Subnet |
| Stateful | Yes | No |
| Rules | Allow only | Allow + Deny |
| Evaluation | All rules | In order (numbered) |
| Default | Deny all in / Allow all out | Allow all |

---

### Q156
**A company needs to allow SSH access to EC2 instances only from their office IP (203.0.113.10). Where should this rule be configured?**
**✅ Answer:** Security Group Inbound Rule: Port 22, Source: 203.0.113.10/32

---

### Q157
**What is Egress-Only Internet Gateway and when is it used?**
**✅ Answer:** Egress-Only IGW = IPv6 equivalent of NAT Gateway. Allows IPv6 EC2 instances in private subnets to initiate outbound IPv6 traffic to internet, while preventing inbound IPv6 connections.

---

### Q158
**What does the "default VPC" in AWS contain?**
**✅ Answer:** Default VPC (172.31.0.0/16): Internet Gateway attached, public subnets in each AZ, default Security Group, default NACL, main route table with IGW route. Ready-to-use for basic testing.

---

### Q159
**A company's Route 53 health check marks an endpoint as unhealthy. What HTTP status code indicates a healthy endpoint?**
**✅ Answer: 2xx (200, 201, etc.)** — Health check: endpoint must respond within timeout with 2xx/3xx status code

---

### Q160
**What is the purpose of Amazon Route 53 Resolver?**
**✅ Answer:** Route 53 Resolver = DNS resolver for VPCs (169.254.169.253 or VPC Base +2). Inbound Resolver: on-premises → AWS DNS. Outbound Resolver: AWS → on-premises DNS. Enables hybrid DNS resolution.

---

### Q161
**What types of records can Route 53 Alias records point to? (3 examples)**
**✅ Answer:** 
1. CloudFront distributions
2. ELB (ALB/NLB/CLB) DNS names
3. S3 website endpoints
4. API Gateway
5. Another Route 53 record in same zone
**Note:** Alias records are free for queries (unlike CNAME)

---

### Q162
**A company hosts a website on S3. The domain is `www.example.com`. They want to use Route 53. Why must they use an Alias record instead of CNAME?**
**✅ Answer:** AWS restricts CNAME at zone apex (root domain). Alias records work at zone apex and are free. S3 website endpoint must use Alias record.

---

### Q163
**What is CloudFront Lambda@Edge used for?**
**✅ Answer:** Lambda@Edge = Run Lambda functions at CloudFront edge locations (globally). Use cases: URL rewrites, auth token validation, custom headers, A/B testing at edge, personalization, before/after request processing.

---

### Q164
**A company needs sub-second DNS failover. Route 53 health checks have a minimum interval of 10 seconds. How can they achieve faster failover?**
**✅ Answer:** Use "fast health check" interval (10s) + Route 53 Routing Policy with multiple healthy records. For application-level failover, use shorter TTL (10-30s). Also consider **Global Accelerator** (uses continuous probing, ~30-second failover).

---

### Q165
**What are the CIDR ranges reserved for private IP addresses (RFC 1918)?**
**✅ Answer:**
- 10.0.0.0/8 (10.x.x.x)
- 172.16.0.0/12 (172.16.x.x – 172.31.x.x)
- 192.168.0.0/16 (192.168.x.x)

---

### Q166
**A company's ALB shows 502 Bad Gateway errors. What are the common causes?**
**✅ Answer:**
1. Backend EC2 instances are unhealthy (health check fails)
2. Security Group on EC2 blocking ALB
3. Application crashed/not running
4. Wrong health check path configured

---

### Q167
**What is the difference between a Route 53 Public Hosted Zone and Private Hosted Zone?**
**✅ Answer:**
- **Public:** Resolves from internet (accessible by anyone)
- **Private:** Resolves only within associated VPCs (internal DNS)
Both can coexist (split-horizon DNS)

---

### Q168
**A company uses CloudFront. Users in Japan report slow performance. CloudFront edge location exists in Tokyo. What could be the issue?**
**✅ Answer:** Possible causes:
1. Content is not cached (high cache miss rate) → tune cache policy
2. Origin is slow → optimize origin performance
3. TTL too low → increase cache TTL for static content
4. Large file not compressed → enable CloudFront compression

---

### Q169
**A company needs to whitelist specific AWS IP ranges for their on-premises firewall to allow traffic from CloudFront. Where can they find this information?**
**✅ Answer:** `ip-ranges.json` from `https://ip-ranges.amazonaws.com/ip-ranges.json` — Contains all AWS IP ranges by service and region. Subscribe to SNS topic for updates when IP ranges change.

---

### Q170
**What is the maximum size of a VPC CIDR block?**
**✅ Answer: /16** (65,536 IPs). Minimum: /28 (16 IPs). You can add up to 4 additional secondary CIDR blocks.

---

### Q171
**A company has multiple AWS accounts and VPCs. They want centralized outbound internet access through a single NAT Gateway. What should they use?**
**✅ Answer:** AWS Transit Gateway + Centralized Inspection VPC with NAT Gateway. Route all spoke VPC outbound traffic through TGW → central VPC → NAT Gateway → Internet.

---

### Q172
**What does "connection draining" (deregistration delay) do in ELB?**
**✅ Answer:** Connection Draining = When an instance is deregistering (removed from target group), ELB continues to route existing in-flight requests to it until they complete (or timeout, default 300s). Prevents abrupt termination of active sessions.

---

### Q173
**A company has 10 EC2 instances behind an ALB. 5 are in AZ-1, 5 in AZ-2. Cross-zone load balancing is enabled. How is traffic distributed?**
**✅ Answer:** With cross-zone enabled: Each instance receives equal traffic = 10% each. Without cross-zone: Each AZ gets 50%, each instance within AZ gets 50%/5 = 10% too (in this balanced case). For unbalanced AZs, cross-zone significantly matters.

---

### Q174
**What is AWS Global Accelerator's "endpoint group"?**
**✅ Answer:** Endpoint group = associated with a specific AWS Region. Contains endpoints (ALB, NLB, EC2, Elastic IPs) in that region. Traffic dial = control traffic percentage to each region.

---

### Q175
**A company enables VPC Flow Logs. They see `REJECT` records for traffic from an IP. What does this indicate?**
**✅ Answer:** REJECT = Security Group or NACL blocked the traffic. Can be used to troubleshoot misconfigured security rules or identify port scanning/attack attempts.

---

### Q176
**What is the maximum number of security groups that can be associated with a single EC2 instance network interface?**
**✅ Answer: 5 security groups** per network interface (ENI) by default (can be increased)

---

### Q177
**A company needs to pass the client's original IP address to their backend EC2 instances when using an ALB. How does the backend receive this?**
**✅ Answer:** ALB adds `X-Forwarded-For` HTTP header containing the client's original IP address. Application reads this header to get actual client IP.

---

### Q178
**What is the purpose of the AWS Transit Gateway Network Manager?**
**✅ Answer:** TGW Network Manager = Centralized management and monitoring of global TGW networks and SD-WAN (Software-Defined WAN) connections. Visualize network topology, monitor connectivity, track network events.

---

### Q179
**A company needs to provide internet access to 1000 EC2 instances in private subnets across 3 AZs. What is the HIGH AVAILABILITY NAT configuration?**
**✅ Answer:** Create one NAT Gateway **per AZ** (3 NAT Gateways). Each AZ's private subnet routes to its own NAT GW. If one NAT GW fails, only that AZ is affected (not all AZs).

---

### Q180
**What is the difference between Direct Connect and Site-to-Site VPN?**
**✅ Answer:**
| | Direct Connect | Site-to-Site VPN |
|-|----------------|-----------------|
| Medium | Dedicated fiber | Internet (encrypted) |
| Bandwidth | 1/10 Gbps | Up to 1.25 Gbps |
| Latency | Consistent, low | Variable |
| Setup time | Weeks/months | Hours |
| Cost | Higher | Lower |
| Encryption | Not auto (need MACsec) | IPSec (auto) |

---

### Q181
**A company uses CloudFront. They want to restrict access to specific content only for Premium subscribers. The content URLs change frequently. Which is the BEST approach?**
**✅ Answer: Signed Cookies** — Because:
- Multiple files/URLs
- Policies apply to sets of content
- User doesn't need unique URL per file
(vs Signed URLs = per file, changes when URL changes)

---

### Q182
**What happens when you delete a VPC?**
**✅ Answer:** You CANNOT delete a VPC if it contains:
- EC2 instances
- RDS instances
- Internet Gateways
Must first terminate instances, delete subnets, detach and delete IGW, then delete VPC.

---

### Q183
**A company's Route 53 query logging is enabled. Where are the logs stored?**
**✅ Answer:** Route 53 query logs → **CloudWatch Logs** (Log Groups). Shows which DNS queries were made, from which resolver IP, and what responses were given.

---

### Q184
**A company wants to implement a "zero trust" network model for their AWS workloads. What is the key principle?**
**✅ Answer:** Zero Trust = "never trust, always verify":
- Micro-segmentation (SGs per service)
- Least privilege IAM
- Mutual TLS (mTLS) between services
- Strong identity verification for every request
- No implicit trust based on network location

---

### Q185
**What is the purpose of Elastic IP (EIP) in AWS?**
**✅ Answer:** Elastic IP = Static, public IPv4 address that you own until released:
- Persists even when instance is stopped
- Can be moved between instances
- Use case: Need consistent IP for DNS, whitelisting
- Cost: Free when associated to running instance; $0.005/hour if not in use

---

### Q186
**A company has an NLB in front of their application. Users report they see the NLB's IP, not their original IP, in server logs. How can they preserve the client IP?**
**✅ Answer:** Enable **Client IP Preservation** on the NLB Target Group. When enabled, the client's IP is passed directly to the target (works for TCP, not TLS termination mode).

---

### Q187
**What DNS record type is used for mail servers?**
**✅ Answer: MX (Mail Exchanger)** record — Points to mail server. Priority value determines which server is tried first (lower number = higher priority).

---

### Q188
**A company uses ALB. They want to redirect users to a maintenance page when performing updates. What is the easiest approach?**
**✅ Answer:** ALB Listener Rule: Add a rule that returns a **fixed response** (503 status + custom HTML message) or redirects to maintenance URL. No backend changes needed.

---

### Q189
**What is the maximum MTU for instances using Elastic Network Adapter (ENA) with Jumbo frames?**
**✅ Answer: 9001 bytes** (Jumbo frames). Standard MTU = 1500 bytes. Jumbo frames reduce overhead for large data transfers within VPC.

---

### Q190
**A company has both IPv4 and IPv6 enabled on their VPC. Their EC2 instances need to reach the internet via IPv6 only (no IPv4). What do they need?**
**✅ Answer:** 
- Dual-stack subnets (IPv4 + IPv6)
- Internet Gateway (supports both IPv4 and IPv6)
- Route: `::/0 → Internet Gateway` (IPv6 default route)
- EC2: Assign IPv6 address

---

### Q191
**What is the AWS recommended way to migrate from CLB (Classic Load Balancer) to ALB?**
**✅ Answer:** Use the **AWS Console migration wizard** (Load Balancers → Migrate to ALB). It creates ALB with equivalent listeners, rules, and target groups from your CLB configuration.

---

### Q192
**A company deploys microservices on ECS. Service discovery is needed. Which AWS service enables automatic DNS-based service discovery?**
**✅ Answer: AWS Cloud Map** (with Route 53 private hosted zone) — Service instances register themselves, Route 53 resolves service names to healthy instance IPs.

---

### Q193
**What is the difference between a VPC Endpoint Policy and a Bucket Policy when using S3 VPC Gateway Endpoint?**
**✅ Answer:**
- **VPC Endpoint Policy**: Controls which S3 buckets/actions are allowed FROM the endpoint (attached to endpoint)
- **Bucket Policy**: Controls who can access the bucket (attached to bucket)
Both can work together for defense-in-depth

---

### Q194
**A company needs their application traffic to traverse through a centralized security appliance before reaching the internet. What is the AWS recommended architecture?**
**✅ Answer:** AWS Network Firewall (or 3rd party via GWLB) in Inspection VPC + Transit Gateway to route all traffic through inspection point before reaching NAT Gateway and Internet Gateway.

---

### Q195
**What is the default behavior when a Network ACL rule is not matched?**
**✅ Answer:** Default NACL = **Allow all** (rule 100 and 200 with allow). Custom NACL = **Deny all** (only explicit allows work). Rule * (asterisk) = catch-all Deny at end.

---

### Q196
**A company uses Site-to-Site VPN. They want to add redundancy. What should they configure?**
**✅ Answer:** Each Site-to-Site VPN connection has **2 tunnels** for redundancy (one active, one standby). For full redundancy: two VPN connections to two different customer gateway devices.

---

### Q197
**An EC2 instance in a public subnet has a public IP but cannot reach the internet. Security Group allows outbound. Route table has `0.0.0.0/0 → IGW`. VPC has IGW attached. What else should be checked?**
**✅ Answer:** Check **Network ACL** outbound rules (NACL is stateless, outbound must be explicitly allowed, including ephemeral ports for return traffic).

---

### Q198
**What is the maximum number of rules allowed in a Security Group?**
**✅ Answer: 60 inbound + 60 outbound rules** (default, can request increase)

---

### Q199
**A company uses CloudFront with S3. They want to invalidate cached content when they push updates. What should they do?**
**✅ Answer:** CloudFront → Create Invalidation (`/*` for all, `/path/*` for specific). Cost: $0.005 per invalidation path after first 1000 free/month. Alternative: Use versioned file names (`styles.v2.css`) to avoid invalidation.

---

### Q200
**A company needs to connect their on-premises network to multiple VPCs in multiple AWS regions. What is the most scalable architecture?**

**✅ Answer:** 
1. **AWS Direct Connect Gateway** (connects to multiple VPCs/regions via one DX)
2. **Transit Gateway** in each region (connected to DX Gateway)
3. **TGW Peering** between regions

Architecture: On-premises → DX → DX Gateway → TGW (region A) ↔ TGW (region B)

---

> **🎉 Set 02 Complete! (Q101-Q200) — Networking & VPC**
> 
> **Score Tracker:** ___/100
> 
> ➡️ **Next:** [Exam Set 03 — Compute & EC2 (Q201-Q300)](./Exam_Set_03_Compute_EC2_ASG.md)
