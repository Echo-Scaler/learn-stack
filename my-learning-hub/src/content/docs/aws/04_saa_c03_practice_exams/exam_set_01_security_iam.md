---
title: "AWS SAA-C03 Practice Exam — Set 01"
description: "ဖတ်နည်းညွှန်ကြားချက်:"
---

## AWS SAA-C03 Practice Exam — Set 01
# Security & IAM | Q001–Q100
## Domain 1: Design Secure Architectures (30%)

---

> **ဖတ်နည်းညွှန်ကြားချက်:**
> - မေးခွန်းများ = **English** (Real Exam ပုံစံ)
> - ရွေးချယ်ခွင့် A, B, C, D = **English**
> - မှန်သော Answer + ရှင်းလင်းချက် A–D တိုင်း = **မြန်မာဘာသာ**
> - ကိုယ်တိုင် ဦးစွာ ဖြေပြီးမှ Answer စစ်ပါ

---

## Q001
**A company stores sensitive customer data in an S3 bucket. They want to ensure that all objects uploaded to the bucket must be encrypted at rest, and any upload attempt without encryption should be automatically rejected. Which S3 bucket policy condition should they use to enforce this requirement?**

- **A)** `aws:SecureTransport`
- **B)** `s3:x-amz-server-side-encryption`
- **C)** `aws:RequestedRegion`
- **D)** `s3:prefix`

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက် (Answer တိုင်းကို ရှင်းရှင်းပြောပြမည်)

**A) `aws:SecureTransport` → ❌ မှားသည်**
> ဤ condition key သည် request သည် HTTPS (TLS) ဖြင့် ပေးပို့ကြောင်းကို စစ်ဆေးသည်။ Data **in transit** encryption ကို enforce ဖြစ်ပြီး **at rest** encryption ကို enforce မဖြစ်ပါ။ မေးခွန်းက "encrypted at rest" ကို မေးသောကြောင့် ဤ option မမှန်ပါ။

**B) `s3:x-amz-server-side-encryption` → ✅ မှန်သည်**
> Upload request တွင် ဤ header မပါလျှင် bucket policy Deny ဖြစ်ပြီး upload ပြုလုပ်၍ မရပါ။ SSE-S3, SSE-KMS, SSE-C တစ်ခုခုကို specify ဖြစ်မှသာ S3 object upload ဖြစ်သည်ဟု enforce ပြုလုပ်နိုင်သည်။ ဤသည် **at rest encryption enforcement** ၏ standard method ဖြစ်သည်။

**C) `aws:RequestedRegion` → ❌ မှားသည်**
> ဤ condition key သည် request ကို မည်သည့် AWS Region သို့ ပေးပို့သည်ကို စစ်ဆေးသည်။ Encryption နှင့် လုံး၀ ဆက်နွှယ်မှု မရှိပါ။ Region restriction ကိုသာ ပြုလုပ်နိုင်သည်။

**D) `s3:prefix` → ❌ မှားသည်**
> ဤ condition key သည် S3 object ၏ path (folder) prefix ကို စစ်ဆေးသည်။ "employees/" ဆိုသည့် folder ကိုသာ access ဖြစ်ရသည် ဟူသည့် access control ကိုသာ ပြုလုပ်နိုင်ပြီး encryption နှင့် ဆက်နွှယ်မှု မရှိပါ။

**💡 Real Exam Tip:**
"encrypted at rest" + "rejected if no encryption" ဆိုသော keyword များ → **S3 Bucket Policy + `Deny` + `s3:x-amz-server-side-encryption`**

---

## Q002
**A developer accidentally committed AWS access keys to a public GitHub repository. The keys belong to an IAM user with administrative access. What is the MOST critical immediate action that should be taken?**

- **A)** Delete the GitHub repository immediately to prevent further exposure
- **B)** Rotate (deactivate old and create new) the compromised access keys immediately
- **C)** Enable MFA on the IAM user account as quickly as possible
- **D)** Contact AWS Support to notify them of the incident

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Delete the GitHub repository → ❌ မှားသည်**
> Repository ကို ဖျက်သည့်တိုင် ဖိုင်ကို ဦးစွာ public repository တွင် commit လုပ်ထားသောကြောင့် **bots/scripts များ ချက်ချင်း scrape လုပ်ပြီးဖြစ်မည်**။ GitHub history, cache, web archive တို့တွင် ကျန်နေနိုင်သည်။ Repository ဖျက်ခြင်းသည် ပထမဆုံး action မဟုတ်ပါ — keys ကို ဦးစွာ revoke ဖြစ်မှ safe ဖြစ်သည်။

**B) Rotate the compromised access keys immediately → ✅ မှန်သည်**
> ချက်ချင်း **Access Key ကို Deactivate/Delete** ပြုလုပ်ပြီး **New Key ဖန်တီး** ရမည်။ Compromised key ကို revoke ဖြစ်ပြီးမှ attacker သည် ဆက်လက် access မဖြစ်တော့ပါ။ IAM → Security Credentials → Deactivate → Delete → Create new key ဆိုသော flow ဖြင့် ချက်ချင်း implement ဖြစ်ရမည်။ ဤသည် **"immediately"** keyword နှင့် ကိုက်ညီသည့် တစ်ခုတည်းသော correct action ဖြစ်သည်။

**C) Enable MFA on the IAM user → ❌ မှားသည်**
> MFA ကောင်းသော security practice ဖြစ်သော်လည်း **already exposed access keys** ကို revoke ဖြစ်မှသာ MFA ၏ value ရှိသည်။ Access keys ဖြင့် access ဖြစ်ရာတွင် MFA မလိုအပ်သောကြောင့် MFA enable ဖြင့် active keys ကို protect မဖြစ်ပါ။

**D) Contact AWS Support → ❌ မှားသည်**
> AWS Support ကို ဆက်သွယ်ခြင်းသည် မလိုအပ်ပါ။ Account owner ကိုယ်တိုင် Keys ကို revoke ဖြစ်နိုင်သည်။ Post-incident investigation တွင် contact ဖြစ်နိုင်သော်လည်း **"most critical immediate action"** မဟုတ်ပါ။

**💡 Real Exam Tip:**
**"immediately"** keyword ပါလျှင် → **Rotate/Deactivate/Revoke compromised credentials FIRST** ဟူသော pattern ကို မှတ်ပါ

---

## Q003
**A company has EC2 instances that need to read objects from an S3 bucket. The security team requires that no AWS credentials should be stored on the EC2 instances. Which solution meets this requirement with the LEAST operational overhead?**

- **A)** Create an IAM user, generate access keys, and store them in environment variables on the EC2 instance
- **B)** Create an IAM role with S3 read permissions and attach it to the EC2 instance as an instance profile
- **C)** Store the access keys in AWS Secrets Manager and retrieve them in the application code at runtime
- **D)** Create an IAM user and embed the credentials in the application's configuration file

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM user credentials in environment variables → ❌ မှားသည်**
> Environment variable တွင် credentials သိမ်းဆည်းခြင်းသည် **insecure** ဖြစ်သည်။ Instance ကို access ရသူတိုင်း (SSH, SSM) credentials ကို ဖတ်နိုင်မည်။ "no credentials stored on EC2" requirement ကို ဖြည့်ဆည်းမဖြစ်ပါ။

**B) IAM Role attached as Instance Profile → ✅ မှန်သည်**
> **IAM Role** ကို EC2 instance profile ဖြစ်သည့် way ဖြင့် attach ပြုလုပ်ပြီး EC2 metadata service (169.254.169.254) မှ **temporary credentials** ကို automatic ရယူသည်။ Hard-coded credentials မလိုပါ။ Credentials expiry/rotation ကို AWS ကသာ handle ဖြစ်သည်။ **"least operational overhead"** + **"no credentials stored"** ဆိုသော ၂ ချက်လုံးကို ဖြည့်ဆည်းသည်။

**C) AWS Secrets Manager → ❌ မှားသည်**
> Secrets Manager မှ credentials ရယူရာတွင် application ကို Secrets Manager ကို call ဖြစ်ရမည်၊ ၎င်းအတွက် IAM permissions လိုသည်။ B ထက် more complex ဖြစ်ပြီး operational overhead ပိုများသည်။ B သည် simpler ဖြစ်သောကြောင့် **"LEAST operational overhead"** ဆိုသော requirement နှင့် B ကသာ ကိုက်ညီသည်။

**D) Credentials in config file → ❌ မှားသည်**
> Config file တွင် credentials embedded ဖြင့် သိမ်းဆည်းခြင်းသည် **worst security practice** ဖြစ်ပြီး "no credentials stored" requirement ကို ဖြည့်ဆည်းမဖြစ်ပါ။ Code repository တွင် expose ဖြစ်ပါက သာ ကောင်းသည်မဟုတ်ပါ။

**💡 Real Exam Tip:**
**"without storing credentials"** + EC2 → **IAM Role (Instance Profile)** — ဤ combination သည် exam တွင် အကြိမ်ကြိမ် ထွက်သော pattern ဖြစ်သည်

---

## Q004
**A large enterprise has 50 AWS accounts managed under AWS Organizations. The security team wants to centrally enforce a policy that prevents any account from creating EC2 instances outside of the `ap-northeast-1` and `us-east-1` regions. Which approach BEST meets this requirement?**

- **A)** Create an IAM Deny policy in each of the 50 accounts manually
- **B)** Enable AWS Config in all accounts and create a rule to detect instances outside approved regions
- **C)** Create a Service Control Policy (SCP) at the AWS Organizations root level with `aws:RequestedRegion` condition
- **D)** Use AWS CloudTrail to monitor and alert when instances are launched in unapproved regions

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM Deny policy in each account → ❌ မှားသည်**
> 50 accounts တစ်ခုချင်း IAM policy ပြောင်းရမည် = **operational overhead ကြီးမားသည်**။ ထို့အပြင် account admin သည် ၎င်း IAM Deny policy ကို ဖျက်နိုင်သောကြောင့် bypass ဖြစ်နိုင်သည်။ Centralized enforcement မဟုတ်ပါ။

**B) AWS Config Rule → ❌ မှားသည်**
> AWS Config သည် **detect only** ဖြစ်သည်။ Non-compliant instances ကို detect ပြုလုပ်သော်လည်း **prevent (ကာကွယ်) မဖြစ်ပါ**။ User များ instances launch ပြုလုပ်ပြီးမှ alert ရမည်ဖြစ်ပြီး **proactive prevention မဟုတ်**ပါ။

**C) SCP at organization root → ✅ မှန်သည်**
> **Service Control Policy (SCP)** ကို organization root/OU level တွင် apply ဖြစ်ပြီး **all 50 accounts ကို automatic enforce** ဖြစ်သည်။ `aws:RequestedRegion` condition ဖြင့် approved regions ကိုသာ allow ပြုလုပ်နိုင်သည်။ **Root user ပင် bypass မဖြစ်နိုင်**ပါ (SCP > IAM policy evaluation order)။ **Centralized + preventative** control ဖြစ်သည်။

**D) CloudTrail monitor + alert → ❌ မှားသည်**
> CloudTrail + alert = **detect after the fact (ဖြစ်ပြီးမှ သိ)**ပါသည်။ Instance already launched ဖြစ်ပြီးမှ notification ရမည်ဖြစ်ပြီး prevention မဟုတ်ပါ။ **"prevent from creating"** ဆိုသော requirement ကို မဖြည့်ဆည်းနိုင်ပါ။

**💡 Real Exam Tip:**
- **"multiple accounts"** + **"centrally prevent"** + **"all accounts"** → **SCP (Service Control Policy)**
- SCP = Maximum permission boundary, IAM policies ဆောင်ရွက်ပိုင်ခွင့်ကို override လုပ်သည်

---

## Q005
**A company wants to require MFA authentication specifically when users attempt to perform destructive actions like `ec2:TerminateInstances` and `s3:DeleteBucket`. Regular read-only operations should not require MFA. How should this be implemented?**

- **A)** Enable MFA on the root AWS account only
- **B)** Configure AWS Config to check MFA status before allowing API calls
- **C)** Attach an IAM policy with a `Condition` block that uses `aws:MultiFactorAuthPresent: true` for specific destructive actions
- **D)** Use AWS CloudTrail to audit MFA usage and send alerts when non-MFA actions occur

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Enable MFA on root account → ❌ မှားသည်**
> Root user ၏ MFA သည် root user actions ကိုသာ ကာကွယ်သည်။ IAM users/roles ၏ actions ကို control မဖြစ်ပါ။ **Specific API operations** ကို MFA require ဖြစ်ရသည့် requirement ကို မဖြည့်ဆည်းနိုင်ပါ။

**B) AWS Config check MFA → ❌ မှားသည်**
> AWS Config သည် resource configuration compliance ကို track ဖြစ်ပြီး **API call execution ကို real-time control မဖြစ်ပါ**။ MFA status ကို check ပြုလုပ်ပြီး API calls ကို block မဖြစ်ပါ — ၎င်းသည် Config ၏ function မဟုတ်ပါ။

**C) IAM Policy with MFA Condition → ✅ မှန်သည်**
> IAM Policy ၏ `Condition` block တွင် `aws:MultiFactorAuthPresent: true` ကို ထည့်ပြီး specific actions ကိုသာ apply ဖြစ်ရမည်ဆိုသော requirement ကို **အတိအကျ ဖြည့်ဆည်း**သည်။ MFA မပါဘဲ login လုပ်ထားသောအခါ ဤ actions ကို `Deny` ဖြစ်သည်။ Read-only actions ကို condition ချိတ်ဆက်ထားသောကြောင့် MFA မလိုဘဲ ဆောင်ရွက်နိုင်သည်။
```json
{
  "Effect": "Deny",
  "Action": ["ec2:TerminateInstances", "s3:DeleteBucket"],
  "Resource": "*",
  "Condition": {
    "Bool": {"aws:MultiFactorAuthPresent": "false"}
  }
}
```

**D) CloudTrail audit + alerts → ❌ မှားသည်**
> CloudTrail + alerts = **ဖြစ်ပြီးမှ detect/notify** ပါသည်။ Termination/deletion ဖြစ်ပြီးမှ alert ရမည်ဖြစ်ပြီး **prevent မဖြစ်ပါ**။ "Require MFA" ဆိုသော active enforcement မဟုတ်ပါ။

**💡 Real Exam Tip:**
**"require MFA for specific actions"** → **IAM Deny Policy** + **`aws:MultiFactorAuthPresent: false` condition** pattern ကို မှတ်ထားပါ

---

## Q006
**A financial company needs a dedicated private network connection from their on-premises data center to AWS. They require consistent network performance with low latency, high bandwidth (10 Gbps), and the connection must NOT use the public internet. Which service should they choose?**

- **A)** AWS Site-to-Site VPN over the internet
- **B)** AWS Direct Connect with a dedicated hosted connection
- **C)** AWS Transit Gateway with VPN attachment
- **D)** VPC Peering with on-premises network

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS Site-to-Site VPN → ❌ မှားသည်**
> Site-to-Site VPN သည် **public internet ကို ဖြတ်ပြီး IPSec encrypted tunnel** ဖြင့် connect ဖြစ်သည်။ Internet ကို use ပြုသောကြောင့် **"must NOT use public internet"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ။ Bandwidth မှာ max ~1.25 Gbps သာ ရပြီး 10 Gbps ကို support မဖြစ်ပါ။

**B) AWS Direct Connect → ✅ မှန်သည်**
> **AWS Direct Connect** သည် on-premises မှ AWS သို့ **dedicated private fiber optic connection** ဖြစ်ပြီး public internet ကို လုံး၀ use ဖြစ်မသည်။ **1 Gbps, 10 Gbps, 100 Gbps** connection options ရှိပြီး consistent network performance (low latency, high throughput) ကို provide ဖြစ်သည်။ Financial applications ကဲ့သို့ network-sensitive workloads အတွက် appropriate ဖြစ်သည်။

**C) Transit Gateway with VPN → ❌ မှားသည်**
> Transit Gateway + VPN attachment = **VPN ကို TGW မှ terminate ဖြစ်**ပြုလုပ်သည်၊ သို့သော် **underlying connection = internet through VPN** ဖြစ်ဆဲ ဖြစ်သည်။ "NOT use public internet" requirement ကို မဖြည့်ဆည်းနိုင်ပါ။

**D) VPC Peering with on-premises → ❌ မှားသည်**
> VPC Peering သည် **AWS VPCs ကြား** (VPC-to-VPC) connectivity ကိုသာ enable ဖြစ်သည်။ On-premises network ကို AWS VPC နှင့် peer ဖြစ်ရသည်ဆိုသည် **feature မရှိပါ**၊ ထိုကဲ့သို့ option AWS ၌ ရှိမသည်ဖြစ်သောကြောင့် မှားသည်။

**💡 Real Exam Tip:**
- **"dedicated"** + **"private"** + **"NOT internet"** + **"on-premises to AWS"** → **AWS Direct Connect**
- Direct Connect vs VPN: DX = expensive/fast/reliable, VPN = cheap/internet-dependent/lower bandwidth

---

## Q007
**An application on EC2 in a private subnet needs to access DynamoDB. The company's security policy strictly prohibits any traffic from traversing the public internet. The solution must be cost-effective. What is the BEST solution?**

- **A)** Set up a NAT Gateway in a public subnet and configure the route table
- **B)** Create a VPC Gateway Endpoint for DynamoDB
- **C)** Create a VPC Interface Endpoint (PrivateLink) for DynamoDB
- **D)** Attach an Internet Gateway to the private subnet

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) NAT Gateway → ❌ မှားသည်**
> NAT Gateway သည် private subnet ၏ **outbound internet traffic ကို route ဖြစ်**သည်, ဆိုလိုသည်မှာ **DynamoDB ကို internet ဖြတ်ပြီး access ဖြစ်ရမည်**ဖြစ်သည်။ "must NOT traverse public internet" requirement ကို ဖြည့်ဆည်းမဖြစ်ပါ။ ထို့အပြင် NAT Gateway charge ($0.045/hour + data processing) = costly ဖြစ်သည်။

**B) VPC Gateway Endpoint for DynamoDB → ✅ မှန်သည်**
> **VPC Gateway Endpoint** သည် DynamoDB (နှင့် S3) ကို **FREE** ဖြင့် private AWS network ကို ဖြတ်ပြီး access ဖြစ်ရသည်။ Internet ကို လုံး၀ မဖြတ်ပါ။ Route table ကို update ဖြစ်ရပြီး (`pl-XXXXXXXXX → vpce-XXXXXXXX`) traffic ကို endpoint ကို ဖြတ်ပြီး DynamoDB ကို ရောက်သည်။ **Cost-effective** (free) + **internet မဖြတ်** ဆိုသော ၂ ချက်လုံး ဖြည့်ဆည်းသည်။

**C) VPC Interface Endpoint (PrivateLink) → ❌ မှားသည်**
> Interface Endpoint (PrivateLink) ကို DynamoDB အတွက် use ဖြစ်ရပါသည်၊ သို့သော် **hourly charge ($0.01/hour per AZ) + data processing charge** ကျသည်။ Gateway Endpoint (free) ရှိပြီးဖြစ်သောကြောင့် **"cost-effective"** ဆိုသော requirement နှင့် B ကသာ ကိုက်ညီသည်။

**D) Internet Gateway to private subnet → ❌ မှားသည်**
> Internet Gateway ကို VPC နှင့် attach ဖြစ်ပြီး route table ကို IGW ထားရမည်ဖြစ်သောကြောင့် **internet accessible ဖြစ်သွားမည်**ဖြစ်သည်။ Private subnet ၌ IGW route = effectively public subnet ဖြစ်သွားသည်ဟု ဆိုလိုသောကြောင့် "private" ဆိုသည် definition ဆန့်ကျင်ဖက်ဖြစ်သည်။

**💡 Real Exam Tip:**
- **S3 / DynamoDB + "not internet"** → **VPC Gateway Endpoint (FREE)**
- Other AWS services (SSM, KMS, SQS, etc.) → Interface Endpoint (PrivateLink, paid)
- Gateway Endpoint = Route Table change only. Interface Endpoint = ENI in subnet

---

## Q008
**A company needs to maintain a complete audit trail of all API calls made within their AWS account. They need to know WHO made a call, WHEN, from WHICH IP address, and WHAT resources were affected. Which AWS service provides this capability?**

- **A)** Amazon CloudWatch Metrics and Dashboards
- **B)** AWS Config with configuration history
- **C)** AWS CloudTrail with CloudTrail Lake
- **D)** Amazon GuardDuty threat intelligence

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Amazon CloudWatch → ❌ မှားသည်**
> CloudWatch သည် **application/infrastructure metrics** (CPU, memory, request count) နှင့် **logs** ကို monitor ဖြစ်သည်။ **API call history** (who called what) ကို log မဖြစ်ပါ — ၎င်းသည် CloudTrail ၏ responsibility ဖြစ်သည်။ "WHO made the call" ကို CloudWatch မဖြေဆိုနိုင်ပါ။

**B) AWS Config → ❌ မှားသည်**
> AWS Config သည် **resource configurations** (EC2 instance type, Security Group rules, S3 bucket settings) ၏ **changes over time** ကို track ဖြစ်သည်။ **"WHO changed what"** ကို resource level ဖြင့် ဖြေဆိုနိုင်သော်လည်း complete **API call audit trail** (IP address, user agent, etc.) မဟုတ်ပါ — ၎င်းသည် CloudTrail ၏ function ဖြစ်သည်။

**C) AWS CloudTrail → ✅ မှန်သည်**
> **AWS CloudTrail** သည် AWS account တွင် ပြုလုပ်သော **management events** (API calls) တိုင်းကို log ထားသည်：
> - **WHO**: User identity (IAM user, role, root)
> - **WHEN**: Timestamp
> - **FROM WHERE**: Source IP address, user agent
> - **WHAT**: API action ပြုလုပ်ခဲ့သော resource
> - **HOW**: AWS Console, CLI, SDK
> CloudTrail Lake ဖြင့် logs ကို query နိုင်ပြီး tamper-evident log file validation ပါသည်။

**D) Amazon GuardDuty → ❌ မှားသည်**
> GuardDuty သည် CloudTrail, VPC Flow Logs, DNS logs ကို input ဖြင့် **threat detection** (malicious activity) ကို provide ဖြစ်သည်။ GuardDuty ကိုယ်တိုင် API call audit trail ကို generate မဖြစ်ပါ — ၎င်း CloudTrail data ကို consume ဖြစ်ပြီး threat findings generate ဖြစ်သည်။

**💡 Real Exam Tip:**
- **"API calls"** + **"who, when, what, where"** + **"audit trail"** → **AWS CloudTrail**
- CloudTrail vs Config: **"What API was called?"** = CloudTrail | **"What changed in resource config?"** = Config

---

## Q009
**A company recently discovered that their S3 bucket containing sensitive PII (Personally Identifiable Information) data was inadvertently made public. They want to implement an automated solution to detect future S3 misconfiguration and identify sensitive data exposure across all buckets. Which service should they primarily use?**

- **A)** AWS Shield Advanced for data protection
- **B)** Amazon Macie for automated sensitive data discovery and security assessment
- **C)** AWS WAF to block unauthorized S3 access
- **D)** Amazon GuardDuty for infrastructure threat detection

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS Shield Advanced → ❌ မှားသည်**
> AWS Shield Advanced သည် **DDoS (Distributed Denial of Service) attacks** ကို protect ဖြစ်သည်။ S3 data sensitivity detection, PII discovery, public access misconfiguration detection နှင့် **လုံး၀ ဆက်နွှယ်မှု မရှိပါ**။

**B) Amazon Macie → ✅ မှန်သည်**
> **Amazon Macie** သည် **Machine Learning** ကို အသုံးပြုပြီး S3 buckets ကို scan ဆောင်ရွက်ကာ:
> - **PII** (names, SSNs, credit cards, emails) ကို automatically detect
> - **Public buckets, unencrypted buckets, shared buckets** ကို identify ဆောင်ရွက်ပြီး **security findings** generate
> - Sensitive data ရှိသော buckets ကို dashboard တွင် highlight ပြပြီး alert ပေးသည်
> ဤ requirement ("detect sensitive data" + "S3 misconfiguration") ကို **perfectly fit** ဖြစ်သည်။

**C) AWS WAF → ❌ မှားသည်**
> AWS WAF (Web Application Firewall) သည် **HTTP/HTTPS request-level filtering** (SQL injection, XSS blocking) ကို ဆောင်ရွက်သည်။ S3 data content scanning, PII detection, bucket misconfiguration detection နှင့် **ဆက်နွှယ်မှု မရှိပါ**။

**D) Amazon GuardDuty → ❌ မှားသည်**
> GuardDuty သည် **threat detection** (malicious access patterns, cryptocurrency mining, unauthorized API calls) ကို ဆောင်ရွက်သည်။ S3 Data Protection feature ရှိသော်လည်း **PII content discovery** (Macie function) + **misconfiguration detection** ကို GuardDuty ၏ primary purpose မဟုတ်ပါ။ S3 unusual access ကို detect ဖြစ်သော်လည်း Macie ကသာ content-level analysis ဖြစ်သည်။

**💡 Real Exam Tip:**
- **"PII in S3"** + **"sensitive data discovery"** + **"detect public bucket"** → **Amazon Macie**
- Security service အမျိုးအစားများ: Macie=Data Security, GuardDuty=Threat Detection, Inspector=Vulnerability, Security Hub=Aggregator

---

## Q010
**A company needs to store database passwords, API keys, and TLS certificates securely. The passwords must be automatically rotated every 30 days for their RDS MySQL database, and the application should always retrieve the current valid password. Which AWS service BEST meets these requirements?**

- **A)** AWS Systems Manager Parameter Store (Standard tier)
- **B)** AWS Secrets Manager with built-in RDS rotation
- **C)** AWS Key Management Service (KMS)
- **D)** Store in an encrypted S3 bucket with server-side encryption

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS SSM Parameter Store (Standard) → ❌ မှားသည်**
> Parameter Store (Standard tier) တွင် **automatic rotation feature မပါ**ပါ။ SecureString ဖြင့် encrypt ဖြစ်သော်လည်း application ကိုယ်တိုင် rotation logic ကို implement ဖြစ်ရမည်ဖြစ်ပြီး **"automatically rotated every 30 days"** requirement ကို native ဖြင့် မဖြည့်ဆည်းနိုင်ပါ။ Advanced tier တွင် rotation ဖြင့် Lambda ချိတ်ဆက်နိုင်သော်လည်း Secrets Manager ကဲ့သို့ built-in မဟုတ်ပါ။

**B) AWS Secrets Manager → ✅ မှန်သည်**
> **AWS Secrets Manager** သည်:
> - Database passwords ကို securely store ဖြစ်ပြီး **RDS MySQL automatic rotation Lambda function** (built-in) ပါသည်
> - **30-day, 60-day, custom** rotation schedule configure ဖြစ်ရသည်
> - Rotation ဖြစ်ပြီးနောက် application code ကို change မလိုဘဲ **always current credentials** ကို `GetSecretValue` API ဖြင့် ရယူနိုင်
> - Cost: $0.40/secret/month + API calls

**C) AWS KMS → ❌ မှားသည်**
> AWS KMS (Key Management Service) သည် **encryption keys** ကို manage ဖြစ်ပြီး data ကို encrypt/decrypt ဖြစ်ရသည်။ Application passwords, API keys ကို **store/rotate ဖြစ်ရသည်** ဆိုသည် KMS ၏ function မဟုတ်ပါ — Secrets Manager ကဲ့သို့ secret storage/retrieval API မပါပါ။

**D) S3 with SSE → ❌ မှားသည်**
> S3 သည် object storage ဖြစ်ပြီး **secret management tool မဟုတ်ပါ**။ Automatic rotation, access auditing, version management, rotation notifications ကဲ့သို့ secrets management features မပါပါ။ ဤ approach တွင် "who accessed the secret, when" ကို granularly track မဖြစ်ပါ။

**💡 Real Exam Tip:**
- **"automatic rotation"** + **"database password"** + **"RDS"** → **AWS Secrets Manager**
- Secrets Manager ($0.40/secret/month) vs Parameter Store (free standard, $0.05/10k API calls advanced)
- **"automatic rotation"** keyword = Secrets Manager ၏ unique selling point

---

## Q011
**A company wants to proactively identify software vulnerabilities (CVEs) in their EC2 instances and Docker images stored in Amazon ECR before deploying to production. The solution should work continuously and automatically. Which service should they use?**

- **A)** AWS Shield Advanced vulnerability scanning
- **B)** Amazon Inspector automated vulnerability management
- **C)** Amazon GuardDuty malware protection
- **D)** AWS Trusted Advisor security checks

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS Shield Advanced → ❌ မှားသည်**
> Shield Advanced သည် **DDoS protection** ကိုသာ ဆောင်ရွက်သည်။ Software vulnerabilities, CVEs, container image scanning နှင့် **လုံး၀ ဆက်နွှယ်မှု မရှိပါ**။ Vulnerability assessment ကို provide မဖြစ်ပါ။

**B) Amazon Inspector → ✅ မှန်သည်**
> **Amazon Inspector** သည် **automated vulnerability management service** ဖြစ်ပြီး:
> - **EC2 instances**: OS-level CVEs, network reachability assessment
> - **ECR container images**: Docker image ထဲရှိ software vulnerabilities
> - **Lambda functions**: Function code vulnerabilities
> AWS SSM Agent ရှိသော instances ကို **continuously and automatically scan** ဆောင်ရွက်ပြီး **CVSS score** ဖြင့် severity ranking ပေးသည်

**C) Amazon GuardDuty → ❌ မှားသည်**
> GuardDuty သည် **runtime threat detection** (active malicious activity, unauthorized access, suspicious API calls) ကို detect ဖြစ်သည်။ **Vulnerability scanning** (software CVEs, patch levels) ကို ဆောင်ရွက်မဖြစ်ပါ — ၎င်းသည် Inspector ၏ domain ဖြစ်သည်။

**D) AWS Trusted Advisor → ❌ မှားသည်**
> Trusted Advisor သည် **Cost, Performance, Security, Fault Tolerance, Service Limits** ကို high-level check ဆောင်ရွက်သည်။ Specific CVE vulnerability scanning, CVSS scoring, container image security analysis ကဲ့သို့ detailed vulnerability management မဟုတ်ပါ — ၎င်းသည် Inspector ၏ specialty ဖြစ်သည်။

**💡 Real Exam Tip:**
- **"vulnerability assessment"** + **"CVE"** + **"EC2 or ECR containers"** → **Amazon Inspector**
- Security Service Comparison Table:
  | Service | Primary Purpose |
  |---------|----------------|
  | Inspector | Software Vulnerability scanning |
  | GuardDuty | Runtime threat detection |
  | Macie | S3 sensitive data discovery |
  | Security Hub | Security findings aggregation |

---

## Q012
**A company hosts a web application behind an Application Load Balancer. They want to protect the application from common web attacks including SQL injection, cross-site scripting (XSS), and malicious bots. The solution should be able to block specific IP addresses and set rate limits. Which service should they deploy?**

- **A)** AWS Shield Standard (free tier) for all attack types
- **B)** AWS Network Firewall for Layer 7 protection
- **C)** AWS WAF (Web Application Firewall) with managed rule groups
- **D)** VPC Security Groups with custom rules

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS Shield Standard → ❌ မှားသည်**
> Shield Standard (free) သည် **Layer 3/4 DDoS** (volumetric, SYN floods) ကိုသာ protect ဖြစ်သည်။ **SQL injection, XSS** ကဲ့သို့ **Layer 7 (Application layer) attacks** ကို detect/block မဖြစ်ပါ — ၎င်းသည် HTTP content ကို inspect မဖြစ်ပါ။

**B) AWS Network Firewall → ❌ မှားသည်**
> AWS Network Firewall သည် **Layer 3/4** (IP, port, protocol) filtering + **Layer 7** Suricata IPS rules ကို support ဖြစ်သော်လည်း **Web application-specific protections** (SQL injection patterns, XSS, managed rule groups) ကို WAF ကဲ့သို့ comprehensive ဖြင့် မပံ့ပိုးနိုင်ပါ။ VPC level firewall ဖြစ်ပြီး CloudFront/ALB ကဲ့သို့ directly attach မဖြစ်ပါ။

**C) AWS WAF with Managed Rule Groups → ✅ မှန်သည်**
> **AWS WAF** သည် **Layer 7 (HTTP/HTTPS) Web Application Firewall** ဖြစ်ပြီး:
> - **SQL injection blocking** (managed rule groups)
> - **XSS blocking** (managed rule groups)
> - **Bot Control** managed rule group
> - **IP Set blocking** (specific IPs)
> - **Rate-based rules** (throttling per IP)
> ALB, CloudFront, API Gateway, AppSync တို့ တွင် **directly attach** ဖြစ်ရနိုင်သည်

**D) VPC Security Groups → ❌ မှားသည်**
> Security Groups သည် **Layer 4** (IP address, port, protocol) ကိုသာ control ဖြစ်သည်။ **HTTP request content** (SQL injection strings, XSS payloads) ကို **inspect မဖြစ်ပါ**ဘဲ Layer 7 application attacks ကို detect/block မဖြစ်ပါ — ၎င်းသည် IP/port level filtering သာ ဖြစ်သည်။

**💡 Real Exam Tip:**
- **"SQL injection"** OR **"XSS"** OR **"Layer 7 attacks"** + **"rate limiting"** → **AWS WAF**
- WAF ကို deploy ဖြစ်ရသော locations: **CloudFront, ALB, API Gateway, AppSync**

---

## Q013
**An IAM user is a member of two IAM groups. Group-A has an attached policy with `Allow` on `s3:GetObject`. Group-B has an attached policy with an explicit `Deny` on `s3:GetObject`. Additionally, the user has an inline policy with `Allow` on `s3:GetObject`. What is the EFFECTIVE permission for this user on `s3:GetObject`?**

- **A)** Allow — because multiple Allow policies override a single Deny
- **B)** Deny — because explicit Deny always takes precedence over Allow regardless of source
- **C)** Allow — because inline policies have higher priority than group policies
- **D)** It depends on which group policy was evaluated first by IAM

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Multiple Allows override single Deny → ❌ မှားသည်**
> ဤ statement သည် **လုံး၀ မမှန်ပါ**။ AWS IAM တွင် Allow ၏ အရေအတွက် မည်မျှ ပါပါ **explicit Deny တစ်ခုတည်းက override လုပ်သည်**ဟု fixed rule ရှိသည်။ "multiple Allows win over Deny" ဆိုသော logic AWS ထဲတွင် မရှိပါ။

**B) Explicit Deny always takes precedence → ✅ မှန်သည်**
> **IAM Policy Evaluation Logic (MOST IMPORTANT RULE):**
> 1. **Explicit DENY** → **Always Deny** (ဘာ Allow ရှိသည်ဖြစ်ဖြစ်)
> 2. Explicit Allow → Allow
> 3. No matching rule → **Implicit Deny**
>
> Group-B ၏ Explicit Deny ကြောင့် Group-A Allow + Inline Allow ကို **override ဖြစ်ပြီး DENY** ဖြစ်သည်

**C) Inline policies have higher priority → ❌ မှားသည်**
> IAM တွင် **Inline vs Managed policies ကြား priority မရှိပါ**။ Inline, AWS Managed, Customer Managed policies တို့ evaluation logic တူညီသည်။ **Explicit Deny = always wins** ဆိုသော rule ကို policy source (inline/managed/group) ကို ကြည့်မဖြစ်ပါ။

**D) Order of evaluation matters → ❌ မှားသည်**
> IAM policy evaluation order ရှိသော်လည်း (SCPs → resource policies → identity policies → etc.) **Explicit Deny ကို order မသက်ဆိုင်ဘဲ** final result ကို override ဖြစ်သည်ဟု rule ရှိသည်။ "Which policy evaluated first" သည် result ကို မပြောင်းနိုင်ပါ — Explicit Deny is absolute.

**💡 Real Exam Tip:**
IAM Policy Evaluation = **Deny > Allow > Implicit Deny**
- **"Explicit Deny always wins"** — ဤ rule ကို SAA exam တွင် အမြဲ apply ဖြစ်ရမည်
- SCP Deny > Permission Boundary > Deny > Allow (Full evaluation chain)

---

## Q014
**A company wants to use their own encryption keys to encrypt data stored in AWS services (S3, RDS, EBS), but they want AWS to manage the cryptographic operations and key storage. They need full control over key rotation policy and key usage auditing. Which KMS key type should they use?**

- **A)** AWS Owned Keys (free, AWS fully manages)
- **B)** AWS Managed Keys (aws/s3, aws/rds — AWS manages automatically)
- **C)** Customer Managed Keys (CMK — customer creates and controls)
- **D)** AWS CloudHSM hardware keys

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS Owned Keys → ❌ မှားသည်**
> AWS Owned Keys သည် AWS internal use ကိုသာ ဖြစ်ပြီး **customer မမြင်ရ၊ control မဖြစ်ရ**ပါ။ "Full control over rotation policy and auditing" ဆိုသော requirement ကို မဖြည့်ဆည်းနိုင်ပါ။ AWS account ၏ console ထဲတွင်ပင် ဤ keys ကို မတွေ့ရပါ။

**B) AWS Managed Keys → ❌ မှားသည်**
> AWS Managed Keys (aws/s3, aws/rds) သည် AWS ကသာ create/manage ဖြစ်ပြီး **customer control မရ**ပါ။ Rotation = AWS ကသာ handle (3 years), Key Policy = customer မပြောင်းနိုင်ပါ။ "Full control" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — သို့သော် free ဖြစ်သောကြောင့် simple use cases ကိုသာ appropriate ဖြစ်သည်။

**C) Customer Managed Keys (CMK) → ✅ မှန်သည်**
> **CMK** သည် customer ကိုယ်တိုင် create ဖြစ်ပြီး:
> - **Full key policy control** (who can use/manage the key)
> - **Rotation control** (optional annual automatic rotation, or manual)
> - **Usage auditing** via CloudTrail (every Encrypt/Decrypt logged)
> - **Cross-account sharing** (key policy ဖြင့်)
> - Cost: $1/month per key + $0.03/10,000 API calls
> AWS KMS infrastructure တွင် store ဖြစ်ပြီး AWS ကသာ cryptographic operations ဆောင်ရွက်သောကြောင့် requirement နှင့် **perfectly aligned** ဖြစ်သည်

**D) CloudHSM → ❌ မှားသည်**
> CloudHSM တွင် **customer ကိုယ်တိုင် keys manage ဖြစ်ရပြီး AWS access မဖြစ်ပါ**။ "AWS manages cryptographic operations" ဆိုသော requirement ကို မဖြည့်ဆည်းနိုင်ပါ (CloudHSM = customer-fully-controlled hardware)။ FIPS 140-2 Level 3 compliance လိုသော regulated industries ကိုသာ use ဖြစ်ရသည်။

**💡 Real Exam Tip:**
| Key Type | Created By | Cost | Customer Control |
|----------|-----------|------|-----------------|
| AWS Owned | AWS | Free | None |
| AWS Managed | AWS | Free | Minimal |
| **Customer Managed** | **Customer** | **$1/month** | **Full** |
| CloudHSM | Customer | High | Complete hardware |

---

## Q015
**A company in Account A wants to grant access to their S3 bucket for an application running in Account B. The solution should not require creating IAM users or sharing credentials between accounts. What is the MOST secure approach?**

- **A)** Make the S3 bucket publicly accessible and share the bucket URL
- **B)** Create an IAM user in Account A and share the access key with the Account B team
- **C)** Add a bucket policy in Account A granting access to Account B's IAM role ARN, and create a policy in Account B allowing `sts:AssumeRole`
- **D)** Generate a pre-signed URL in Account A and share it with Account B

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Make bucket publicly accessible → ❌ မှားသည်**
> Public bucket = **မည်သူမဆို access ဖြစ်နိုင်**သောကြောင့် "MOST secure" requirement ကို လုံး၀ မဖြည့်ဆည်းနိုင်ပါ။ Sensitive data ကို public expose ဖြစ်ပြုလုပ်ခြင်းသည် security violation ဖြစ်သည်။

**B) IAM user + shared credentials → ❌ မှားသည်**
> IAM user credentials (access key + secret) ကို team ကြား share ဖြစ်ပြုလုပ်ခြင်းသည် **security bad practice** ဖြစ်သည်: Key expire/rotate ဖြစ်ပါက coordination လိုသည်၊ leaked key = both accounts compromised ဖြစ်မည်, "without sharing credentials" requirement ကို ဖြည့်ဆည်းမဖြစ်ပါ။

**C) S3 Bucket Policy cross-account + IAM Role → ✅ မှန်သည်**
> **Cross-Account S3 Access (Standard Pattern):**
> 1. **Account A**: S3 Bucket Policy → Account B's IAM Role ARN ကို `s3:GetObject` allow ပြုလုပ်
> 2. **Account B**: IAM Role ကို Account A S3 bucket ကို access ဖြစ်ရသည့် permissions ပေး
> 3. Application = Role ကို assume ပြုလုပ်ပြီး **temporary credentials** ဖြင့် S3 access ဖြစ်ရသည်
> Credential sharing မလိုဘဲ secure, auditable, revocable access ဖြစ်သည်

**D) Pre-signed URL → ❌ မှားသည်**
> Pre-signed URLs သည် **time-limited, single operation** access ဖြစ်ပြီး **ongoing application access** အတွက် မသင့်တော်ပါ။ Expiry ဖြစ်ပြီးနောက် renewal လိုပြီး application-level integration ၌ managing URLs = operational overhead ဖြစ်သည်။ Long-term access requirement နှင့် မကိုက်ညီပါ။

**💡 Real Exam Tip:**
**Cross-account resource access = Resource-based Policy (Bucket Policy) + IAM Role**
- S3, KMS, SQS, SNS, Lambda = resource-based policies ရှိသောကြောင့် cross-account access ဖြစ်နိုင်
- EC2, RDS = resource-based policy မရှိ၊ VPC Peering + IAM role needed

---

## Q016
**A company enabled Amazon GuardDuty in their AWS account. GuardDuty detected a finding: `UnauthorizedAccess:EC2/SSHBruteForce`. The security team wants to automatically isolate the affected EC2 instance when this type of finding is triggered. Which automation approach is BEST?**

- **A)** Manually check GuardDuty every hour and take action if needed
- **B)** Configure GuardDuty to automatically terminate the EC2 instance
- **C)** Create an Amazon EventBridge rule triggered by GuardDuty findings that invokes a Lambda function to modify the instance's Security Group
- **D)** Enable AWS Config auto-remediation for GuardDuty findings

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Manual check every hour → ❌ မှားသည်**
> Manual check = **slow response time**, SSH brute force attack detection ဖြင့် hour delay ဖြင့် attacker gain access ဖြစ်နိုင်မည်။ "Automatically isolate" requirement ကို manual approach ဖြင့် မဖြည့်ဆည်းနိုင်ပါ — automation လိုအပ်သည်။

**B) GuardDuty auto-terminate EC2 → ❌ မှားသည်**
> GuardDuty **finding ကိုသာ generate ဖြစ်**သည်၊ **actions (terminate, isolate) ကို directly ဆောင်ရွက်မဖြစ်ပါ**ဘဲ built-in remediation feature မပါပါ။ GuardDuty + EventBridge + Lambda = automation pattern ဖြစ်သည်ဆိုသော AWS recommended flow ကို B option တွင် မပါပါ။

**C) EventBridge + Lambda → ✅ မှန်သည်**
> **GuardDuty Automated Response Architecture:**
> 1. GuardDuty → Finding generate (`SSHBruteForce`)
> 2. **EventBridge Rule** → GuardDuty finding event pattern ဖြင့် trigger
> 3. **Lambda function** → affected instance ၏ Security Group ကို "isolate" SG (all deny) သို့ replace
> ဤ pattern = AWS ၏ recommended automated incident response approach ဖြစ်သည်

**D) AWS Config auto-remediation → ❌ မှားသည်**
> AWS Config auto-remediation သည် **Config Rules** (resource configuration compliance) ကို target ဖြစ်သည်။ GuardDuty findings ကို Config rules ဖြင့် trigger မဖြစ်ပါ — Config Rule = configuration change, GuardDuty finding = security event (different systems)

**💡 Real Exam Tip:**
**GuardDuty + EventBridge + Lambda** = AWS security automation standard pattern
- GuardDuty = Detect → EventBridge = Route → Lambda/SSM = Respond

---

## Q017
**An organization needs to enforce that ALL IAM users in their AWS account must have MFA enabled before they can perform any actions (other than setting up MFA themselves). Which implementation approach correctly achieves this?**

- **A)** Enable MFA in the IAM console settings to require MFA for all users globally
- **B)** Attach a policy to all users or a group that `Deny`s all actions when `aws:MultiFactorAuthPresent` is `false`, with an exception allowing MFA setup actions
- **C)** Use AWS Config to audit users without MFA and send SNS notifications
- **D)** Create an SCP to require MFA at the AWS Organizations level

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Enable MFA in IAM console settings → ❌ မှားသည်**
> IAM console ထဲတွင် "global MFA requirement" toggle setting မရှိပါ။ Individual users ကိုသာ MFA enable ဖြစ်ရပြီး **MFA မပါဘဲ login ဖြစ်သောအခါ actions ကို block ဖြစ်ရသည်** — ဤ behavior ကို **policy ဖြင့်သာ enforce** ဖြစ်ရမည်ဖြစ်ပြီး console toggle မဟုတ်ပါ။

**B) Deny policy with MFA condition → ✅ မှန်သည်**
> **Standard MFA Enforcement Policy Pattern:**
> ```json
> {
>   "Effect": "Deny",
>   "NotAction": [
>     "iam:CreateVirtualMFADevice",
>     "iam:EnableMFADevice",
>     "iam:GetUser",
>     "sts:GetSessionToken"
>   ],
>   "Resource": "*",
>   "Condition": {
>     "BoolIfExists": {"aws:MultiFactorAuthPresent": "false"}
>   }
> }
> ```
> MFA မပါဘဲ login လုပ်သောအခါ MFA setup actions ကိုသာ allow ဖြစ်ပြီး အခြား actions အားလုံးကို Deny ဖြစ်သည်

**C) AWS Config + SNS notifications → ❌ မှားသည်**
> Config + SNS = **detect and notify** ဖြစ်ပြီး **"actions ကို prevent" မဖြစ်ပါ**ဘဲ MFA မပါသော user ကို actions block မဖြစ်ပါ — passive monitoring approach ဖြစ်သည်

**D) SCP for MFA requirement → ❌ မှားသည်**
> SCP ဖြင့် MFA requirement enforce ဖြစ်ရပါသည်၊ သို့သော် SCP scope တွင် member accounts ကိုသာ apply ဖြစ်ပြီး **single account IAM users** ကို enforce ဖြစ်ရာတွင် SCP မသုံး (Organizations structure လိုသည်)။ Single account scenario ၌ **IAM policy (B) ကသာ appropriate** ဖြစ်သည်

**💡 Real Exam Tip:**
**MFA Enforcement = IAM Deny Policy + `aws:MultiFactorAuthPresent: false` condition**
Key: `BoolIfExists` ကို use ဖြစ်ပြီး (key absent ဖြစ်ပါကလည်း cover ဖြစ်ရသည်)

---

## Q018
**A company uses Microsoft Azure Active Directory (Azure AD) as their identity provider with SAML 2.0 protocol. They want employees to use their existing Azure AD credentials to access multiple AWS accounts without creating separate IAM users in each account. Which solution meets these requirements?**

- **A)** Create an IAM user for each employee in every AWS account they need
- **B)** Configure AWS IAM Identity Center (SSO) with Azure AD as the external identity provider
- **C)** Set up Amazon Cognito User Pools with Azure AD federation
- **D)** Use AWS Directory Service for Microsoft Active Directory (Managed Microsoft AD)

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM user per account per employee → ❌ မှားသည်**
> Employees × Accounts = Hundreds/Thousands of IAM users = **unmanageable** ဖြစ်သည်။ Employee leave ဖြစ်ပါက every account မှ delete ဖြစ်ရမည်ဖြစ်ပြီး password sync, MFA per-user = **operational nightmare** ဖြစ်သည်။ "Without creating separate IAM users" requirement ကို မဖြည့်ဆည်းနိုင်ပါ။

**B) IAM Identity Center with Azure AD → ✅ မှန်သည်**
> **AWS IAM Identity Center (formerly AWS SSO)**:
> - **SAML 2.0 / OIDC** ဖြင့် Azure AD ကို external IdP ဖြစ်သည်
> - Employee = Azure AD credentials ဖြင့် sign in → **permission sets** ဖြင့် multiple AWS accounts access
> - **No IAM users** in individual accounts
> - Centralized permission management from one console
> - **Multi-account SSO** = AWS Organizations integration
> ဤ solution = "no separate IAM users" + "multiple AWS accounts" + "SAML 2.0" ကို all address ဖြစ်သည်

**C) Amazon Cognito → ❌ မှားသည်**
> Cognito သည် **mobile/web application external users** (customers) ကို authenticate ဖြစ်ရသည်၊ **corporate employees ၏ AWS console/CLI access** ကို manage ဖြစ်ရသည် မဟုတ်ပါ (different use case)

**D) AWS Managed Microsoft AD → ❌ မှားသည်**
> Managed Microsoft AD သည် AWS cloud တွင် **Active Directory** ကို run ဖြစ်ပြီး on-premises AD နှင့် **trust relationship** ချိတ်ဆက်ဖြစ်ရသည်။ Azure AD (cloud-based) ကို IAM Identity Center ကဲ့သို့ directly SAML federation မဖြစ်ပါ — different architecture ဖြစ်သည်

**💡 Real Exam Tip:**
- **"corporate employees"** + **"SAML 2.0"** + **"multiple accounts"** + **"no IAM users"** → **IAM Identity Center (SSO)**
- Cognito = **external app users** (customers), IAM Identity Center = **internal employees**

---

## Q019
**A company has EC2 instances in private subnets that need to download operating system patches and software updates from the internet. At the same time, these instances must NOT be directly reachable from the internet. What should be configured in the VPC?**

- **A)** Attach an Internet Gateway directly to the private subnet's route table
- **B)** Deploy a NAT Gateway in a public subnet and add a route `0.0.0.0/0 → NAT Gateway` in the private subnet's route table
- **C)** Set up VPC Peering with an internet-connected VPC
- **D)** Assign Elastic IP addresses to each private instance

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Internet Gateway on private subnet → ❌ မှားသည်**
> Internet Gateway ကို VPC level တွင် attach ဖြစ်ပြီး specific subnet route table ကို add ဖြစ်ရမည်ဖြစ်သည်၊ "Private subnet route" တွင် IGW route ထည့်ပါက **effectively public subnet** ဖြစ်သွားမည်ဖြစ်ပြီး instances = internet-reachable ဖြစ်သွားမည်ဖြစ်သည်။ "NOT directly reachable from internet" requirement ကို ဖြည့်ဆည်းမဖြစ်ပါ။

**B) NAT Gateway in public subnet → ✅ မှန်သည်**
> **NAT Gateway Architecture:**
> ```
> Private EC2 → [Private Route Table: 0.0.0.0/0 → NAT GW] → NAT Gateway (Public Subnet)
>                                                              → [Public Route Table: 0.0.0.0/0 → IGW]
>                                                              → Internet Gateway → Internet
> ```
> NAT = **Outbound traffic only** (internet download OK) + **Inbound blocked** (internet cannot reach private EC2) ဆိုသော ၂ ချက်လုံး requirement fulfill ဖြစ်သည်

**C) VPC Peering with internet VPC → ❌ မှားသည်**
> VPC Peering သည် **VPC-to-VPC private connectivity** ဖြစ်ပြီး internet access route ကို provide မဖြစ်ပါ — **transitive routing မရ** (VPC A → VPC B → Internet မဖြစ်ပါ ဆိုသောကြောင့် internet download မဖြစ်ပါ)

**D) Elastic IP on private instances → ❌ မှားသည်**
> Elastic IP ကို **public subnet instance** ကိုသာ assign ဖြစ်ပြီး internet-accessible ဖြစ်မည်ဖြစ်သောကြောင့် **"NOT reachable from internet"** requirement ကို တိုက်ရိုက် ဆန့်ကျင်ဖြစ်မည်ဖြစ်သည်

**💡 Real Exam Tip:**
**"Private instances need internet (outbound only)"** → **NAT Gateway in public subnet**
**NAT Gateway** = Managed, HA per AZ, no patching needed (vs NAT Instance = self-managed)

---

## Q020
**A company uses AWS Organizations. Their security team needs to ensure that developers in member accounts cannot disable AWS CloudTrail logging under any circumstances, even if they have administrator access to their account. Which control achieves this?**

- **A)** IAM policy in each account denying `cloudtrail:StopLogging`
- **B)** Create an SCP at the organization root with a `Deny` on `cloudtrail:StopLogging` and `cloudtrail:DeleteTrail`
- **C)** Enable CloudTrail log file validation to detect tampering
- **D)** Configure AWS Config rule `cloud-trail-enabled` with auto-remediation

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM Deny policy per account → ❌ မှားသည်**
> Per-account IAM policy = admin ကိုယ်တိုင် ၎င်း IAM policy ကို **delete/modify ဖြစ်နိုင်**ဖြစ်သောကြောင့် bypass ဖြစ်နိုင်သည်။ "Even if they have administrator access" ကို address မဖြစ်ပါ — account admin = IAM policy manage ဖြစ်ရနိုင်ဆိုသည် bypass ဖြစ်နိုင်ဆိုလိုသည်

**B) SCP at organization root → ✅ မှန်သည်**
> **SCP (Service Control Policy) at Root Level:**
> ```json
> {
>   "Effect": "Deny",
>   "Action": ["cloudtrail:StopLogging", "cloudtrail:DeleteTrail"],
>   "Resource": "*"
> }
> ```
> SCP ကို **member account admin (root user ပင်) override မဖြစ်နိုင်**ပါ — SCP = maximum permission ceiling ဖြစ်ပြီး IAM policies ကို override သည်။ **Organization-level unbypassable control** ဖြစ်သည်

**C) Log file validation → ❌ မှားသည်**
> Log file validation သည် existing logs ၏ **tamper detection** (logs modified after creation) ကိုသာ ဆောင်ရွက်သည်။ CloudTrail ကို **disable/stop ဖြစ်ခြင်းကို prevent မဖြစ်ပါ** — ဤသည် prevention မဟုတ်ဘဲ detection tool ဖြစ်သည်

**D) Config rule + auto-remediation → ❌ မှားသည်**
> Config rule + remediation = CloudTrail disable → detect → re-enable ဆိုသော flow ဖြစ်သောကြောင့် **CloudTrail disabled ဖြစ်သည့် window** ကြာ (seconds to minutes) ဖြစ်မည်ဖြစ်ပြီး "under any circumstances" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — reactive ဖြစ်ပြီး preventive မဟုတ်ပါ

**💡 Real Exam Tip:**
**"prevent"** + **"even admin cannot"** + **"all accounts"** → **SCP at Organization Root**
SCP = Guardrail (preventive) vs Config = Detective control

---

## Q021
**A healthcare company stores patient records in Amazon S3. They must ensure data is encrypted both during transmission AND when stored at rest, to comply with HIPAA regulations. Which combination of configurations achieves BOTH requirements?**

- **A)** Enable S3 Versioning and configure Server-Side Encryption (SSE-S3)
- **B)** Configure an S3 bucket policy that denies requests where `aws:SecureTransport` is `false`, AND enable default S3 encryption (SSE-KMS)
- **C)** Enable S3 Transfer Acceleration and configure cross-region replication with encryption
- **D)** Use S3 Intelligent-Tiering with encryption enabled on individual objects

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Versioning + SSE-S3 → ❌ မှားသည်**
> SSE-S3 = encryption **at rest** ✓ ဖြည့်ဆည်းသည်
> Versioning = file version history သိမ်းဆည်းသည် (encryption in transit မဟုတ်) ✗
> **"In transit encryption"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Bucket Policy (SecureTransport deny) + SSE-KMS → ✅ မှန်သည်**
> **Two-pronged approach:**
> - **In Transit**: `aws:SecureTransport: false` → Deny (HTTP requests block, HTTPS only = TLS encrypted in transit) ✓
> - **At Rest**: Default encryption SSE-KMS = all objects encrypted at rest ✓
> HIPAA compliance ကို address ဖြစ်သော **both requirements** ကို cover ဖြစ်သည်

**C) Transfer Acceleration + Cross-region replication → ❌ မှားသည်**
> Transfer Acceleration = upload speed improvement (encryption မဟုတ်)
> Cross-region replication = data copy (encryption မပါ separate ဖြင့် configure ဖြစ်ရမည်)
> **Both requirements** ကို address မဖြစ်ပါ

**D) Intelligent-Tiering + per-object encryption → ❌ မှားသည်**
> Intelligent-Tiering = cost optimization storage class
> Per-object encryption = at rest ကိုသာ address ဖြစ်ပြီး in transit ကို address မဖြစ်ပါ

**💡 Real Exam Tip:**
- **"in transit"** = `aws:SecureTransport` condition (Deny HTTP, Allow HTTPS only)
- **"at rest"** = S3 Default Encryption (SSE-S3, SSE-KMS, SSE-C)
- HIPAA requires both → **B is the only option addressing both**

---

## Q022
**A company exposes REST APIs through Amazon API Gateway backed by Lambda functions. They are concerned about API abuse, DDoS attacks, and SQL injection attempts in API payloads. What is the MOST comprehensive defense strategy?**

- **A)** Configure only AWS Shield Standard (free tier) on API Gateway
- **B)** Deploy AWS WAF with managed rule groups attached to API Gateway, configure API Gateway throttling, and enable AWS Shield Advanced
- **C)** Use Network ACLs and Security Groups to filter API traffic
- **D)** Set Lambda concurrency limits to handle traffic spikes

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Shield Standard only → ❌ မှားသည်**
> Shield Standard (free) = L3/L4 DDoS basic protection သာ ဖြစ်ပြီး **SQL injection, API abuse, application-layer attacks** ကို protect မဖြစ်ပါ — single layer ဖြင့် "most comprehensive" ကို မဖြည့်ဆည်းနိုင်ပါ

**B) WAF + API Gateway throttling + Shield Advanced → ✅ မှန်သည်**
> **Multi-layer defense (Defense in Depth):**
> - **AWS WAF** → SQL injection, XSS, bot attacks (L7) block
> - **API Gateway throttling** → Per-client/API rate limiting (abuse prevention)
> - **AWS Shield Advanced** → Enhanced L3/L4 DDoS protection + 24/7 DRT team + cost protection
> ဤ combination = **"MOST comprehensive"** ကို address ဖြစ်သည်

**C) NACLs + Security Groups → ❌ မှားသည်**
> NACL/SG = L3/L4 (IP, port) filtering သာ ဖြစ်ပြီး **API payload content** (SQL injection strings) ကို inspect မဖြစ်ပါ — application layer attacks ကို detect/block မဖြစ်ပါ

**D) Lambda concurrency limits → ❌ မှားသည်**
> Concurrency limits = resource management / cost control ဖြစ်ပြီး **security protection** မဟုတ်ပါ — attacks ကို block မဖြစ်ဘဲ Lambda ကို throttle ဖြစ်ရုံသာ ဖြစ်သည်

**💡 Real Exam Tip:**
API protection layers: **WAF (L7) + Throttling (rate) + Shield (DDoS)** = comprehensive
တစ်ခုတည်းသော option ကို မရွေးဘဲ **combined approach** ကို SAA exam တွင် prefer ဖြစ်သည်

---

## Q023
**A company uses AWS KMS Customer Managed Keys (CMK) to encrypt S3 data. They want to ensure the key material is automatically refreshed annually without disrupting access to existing encrypted data and without changing the Key ID or ARN. What should they configure?**

- **A)** Delete the current CMK and create a new one annually
- **B)** Enable automatic key rotation on the CMK in KMS
- **C)** Switch to an AWS Managed Key which rotates automatically more frequently
- **D)** Manually re-encrypt all S3 data with a new key every year

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Delete and recreate CMK annually → ❌ မှားသည်**
> CMK ကို delete ပြုလုပ်ပါက ၎င်း key ဖြင့် encrypt ထားသော **all data ကို decrypt မဖြစ်တော့ပါ** — permanent data loss ဖြစ်မည်ဖြစ်ပြီး "dangerous" action ဖြစ်သည်။ Key ID/ARN ပြောင်းသောကြောင့် application code update လည်း လိုမည်

**B) Enable automatic key rotation → ✅ မှန်သည်**
> **CMK Automatic Key Rotation:**
> - Enable: KMS → Customer Managed Keys → Key Rotation tab → Enable
> - Rotation interval: Every **365 days** (annually)
> - **Key ID/ARN ပြောင်းမသွားပါ** (application changes မလို)
> - Old key material = retained (existing data decrypt ဆက်ဖြစ်ရသည်)
> - New data = new key material ဖြင့် encrypt
> ဤ feature သည် requirement **တိုက်ရိုက်** ဖြည့်ဆည်းသည်

**C) Switch to AWS Managed Key → ❌ မှားသည်**
> AWS Managed Keys rotate every **3 years** (not annually) ဖြစ်ပြီး **customer control မဖြစ်ပါ**ဘဲ rotation schedule ကို customize မဖြစ်ပါ — "annually" requirement ကို exactly မဖြည့်ဆည်းနိုင်ပါ

**D) Manually re-encrypt all data annually → ❌ မှားသည်**
> All S3 objects ကို manually re-encrypt = **enormous operational burden** ဖြစ်ပြီး operation ကြာ "least operational overhead" ကို ဆန့်ကျင်ဖြစ်သည်။ Auto rotation ကဲ့သို့ seamless ဖြစ်ရမည် ဆိုသောကြောင့် B ကသာ correct ဖြစ်သည်

**💡 Real Exam Tip:**
**CMK Rotation = Key ID မပြောင်း, Key Material သာ ပြောင်း**
Rotation enables: Old ciphertext → Old key material decrypt (still works)
New data → New key material encrypt

---

## Q024
**A financial institution must comply with PCI-DSS regulations requiring that encryption keys be managed in dedicated hardware that is under their SOLE control, with NO possibility of AWS personnel accessing the keys. Which service meets this requirement?**

- **A)** AWS KMS with Customer Managed Keys (CMK)
- **B)** AWS CloudHSM with customer-managed cluster
- **C)** AWS Secrets Manager with KMS encryption
- **D)** S3 Server-Side Encryption with Customer-Provided Keys (SSE-C)

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS KMS CMK → ❌ မှားသည်**
> KMS CMK သည် **AWS shared, multi-tenant infrastructure** ပေါ်တွင် run ဖြစ်ပြီး AWS personnel = theoretically access ဖြစ်ရနိုင်သော infrastructure ကို operate ဖြစ်ပြုသည်ဖြစ်သောကြောင့် **"NO possibility of AWS accessing keys"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ (FIPS 140-2 Level 2)

**B) AWS CloudHSM → ✅ မှန်သည်**
> **AWS CloudHSM:**
> - **Single-tenant, dedicated hardware** HSM
> - Customer = sole administrator (AWS cannot access keys)
> - **FIPS 140-2 Level 3** compliance (highest level)
> - Customer creates/manages all keys, AWS manages only hardware
> - PCI-DSS, HIPAA Level 3, government regulations = appropriate
> "SOLE control" + "NO AWS access" + "dedicated hardware" = CloudHSM ကသာ ဖြည့်ဆည်းသည်

**C) Secrets Manager with KMS → ❌ မှားသည်**
> Secrets Manager = secret storage/rotation service ဖြစ်ပြီး KMS encrypt ကို use ဖြစ်ပြုသည်ဖြစ်သောကြောင့် **"dedicated hardware under sole control"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**D) SSE-C (Customer-Provided Keys) → ❌ မှားသည်**
> SSE-C = Customer provides key per request, AWS performs encryption ဖြစ်ပြီး AWS ကို key transmit ဖြစ်ရမည်ဖြစ်သောကြောင့် **"NO possibility of AWS accessing"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**💡 Real Exam Tip:**
| | KMS CMK | CloudHSM |
|--|---------|---------|
| Hardware | Shared (multi-tenant) | Dedicated (single-tenant) |
| AWS key access | Theoretically possible | **Impossible** |
| FIPS Level | 140-2 L2 | **140-2 L3** |
| Cost | Low ($1/key/month) | High (~$1.60/hour) |
| **PCI-DSS Exclusive** | No | **Yes** |

---

## Q025
**A company stores sensitive audit logs in S3 for 7 years to comply with financial regulations. They must ensure that logs cannot be deleted or modified during this period — not even by the AWS account root user or administrators. Which S3 feature should they implement?**

- **A)** Enable S3 Versioning to preserve previous versions
- **B)** Configure an S3 bucket policy to `Deny` the `s3:DeleteObject` action
- **C)** Enable S3 Object Lock in `Compliance` mode with a 7-year retention period
- **D)** Enable MFA Delete on the S3 bucket

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) S3 Versioning → ❌ မှားသည်**
> Versioning = previous versions ကို preserve ဖြစ်ပြီး delete marker ကို add ဖြစ်ရသည်ဆိုသောကြောင့် **permanently delete** ဆက်ဖြစ်နိုင်သည် (delete marker + version delete)။ Root user = still can delete ဆိုသောကြောင့် "not even root user" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Bucket Policy Deny delete → ❌ မှားသည်**
> Bucket Policy ကို **Admin/Root ကိုယ်တိုင် modify/remove ဖြစ်နိုင်**ဖြစ်သောကြောင့် "not even root user can delete" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — root = override bucket policy ဖြစ်ရနိုင်သည်

**C) S3 Object Lock - Compliance Mode → ✅ မှန်သည်**
> **S3 Object Lock Modes:**
> - **Compliance Mode**: Retention period ကြာ **root user ပင် delete/override မဖြစ်နိုင်**ပါ (WORM - Write Once Read Many)
> - **Governance Mode**: Special permissions (`s3:BypassGovernanceRetention`) ရှိသူ override ဖြစ်ရနိုင်
> 7-year retention = **Compliance mode** ကသာ regulatory requirement fulfill ဖြစ်သည်

**D) MFA Delete → ❌ မှားသည်**
> MFA Delete = delete operations ကို MFA token require ဖြစ်ပြုသော်လည်း MFA ရှိသူ = ဆက်လက် delete ဖြစ်ရနိုင်သည်ဖြစ်ပြီး **absolute immutability မဟုတ်ပါ**ဘဲ "not even root user" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**💡 Real Exam Tip:**
**"cannot be deleted by anyone including root"** + **"regulatory compliance"** + **"years"** → **S3 Object Lock Compliance Mode**
- Compliance = absolute immutability
- Governance = bypass-able with special permission

---

## Q026
**An IAM role in Account A (development account) needs to access an S3 bucket in Account B (production account). The development team should not have permanent access — only temporary credentials should be used. Which configuration achieves this cross-account access?**

- **A)** Create an IAM user in Account B and give the credentials to the development team in Account A
- **B)** In Account B: Create a role with a trust policy allowing Account A. In Account A: Create a policy allowing the principal to call `sts:AssumeRole` targeting the Account B role ARN
- **C)** Set up VPC Peering between Account A and Account B VPCs
- **D)** Use AWS Organizations to merge Account A and Account B into one account

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM user in Account B + credential sharing → ❌ မှားသည်**
> Credentials sharing = **security risk** ဖြစ်ပြီး "temporary credentials only" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — IAM user credentials = long-lived (permanent) ဖြစ်သည်ဖြစ်ပြီး credential rotation management လည်း complex ဖြစ်မည်

**B) Cross-account role assumption → ✅ မှန်သည်**
> **Cross-Account Access Pattern:**
> **Account B (Production):**
> ```json
> Trust Policy: {"Principal": {"AWS": "arn:aws:iam::AccountA-ID:root"}}
> Permissions: s3:GetObject, s3:PutObject on target bucket
> ```
> **Account A (Development):**
> ```json
> Allow: {"sts:AssumeRole", "Resource": "arn:aws:iam::AccountB-ID:role/..."}
> ```
> Application → `sts:AssumeRole` → **temporary credentials (max 12 hours)** → S3 access
> Credential sharing မလိုဘဲ temporary, auditable access ဖြစ်သည်

**C) VPC Peering → ❌ မှားသည်**
> VPC Peering = **network connectivity** ဖြစ်ပြီး **IAM access control (who can access S3)** မဟုတ်ပါ — S3 access ကို network path ဖြင့် control မဖြစ်ပါ

**D) Merge accounts → ❌ မှားသည်**
> AWS accounts ကို merge ဖြစ်ပြုသည် ဆိုသည် **feature မရှိပါ** — account separation (dev/prod) = best practice ဖြစ်ပြီး ၎င်းကို destroy ဖြစ်ပြုသင့်မသည်

**💡 Real Exam Tip:**
**Cross-account access = Trust Policy (Account B role) + AssumeRole permission (Account A)**
Temporary credentials → audit trail in CloudTrail (who assumed role, when, from where)

---

## Q027
**A company needs to track configuration changes to their AWS resources over time and automatically check whether resources comply with their security policies. For example, they want to detect if an S3 bucket becomes publicly accessible or if a Security Group allows unrestricted SSH access. Which service provides these capabilities?**

- **A)** AWS CloudTrail for API call monitoring
- **B)** AWS Config with managed Config Rules
- **C)** Amazon CloudWatch Events for resource monitoring
- **D)** AWS Trusted Advisor for best practice checks

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) AWS CloudTrail → ❌ မှားသည်**
> CloudTrail = **"Who made what API call?"** ကို log ဖြစ်သည်ဆိုသောကြောင့် S3 bucket public ဖြစ်ရောက်ကြောင်း API call ကို ဖော်ပြနိုင်သော်လည်း **"Is the S3 bucket currently public?"** ဆိုသော compliance state ကို continuously evaluate မဖြစ်ပါ — CloudTrail = event log, Config = state compliance

**B) AWS Config with Config Rules → ✅ မှန်သည်**
> **AWS Config:**
> - **Configuration History**: Every resource change ကို timeline ဖြင့် track
> - **Config Rules**: Compliance evaluation (managed rules like `s3-bucket-public-read-prohibited`, `restricted-ssh`)
> - **Non-compliant notification**: SNS, EventBridge ဖြင့် alert
> - **Auto-remediation**: SSM Automation ဖြင့် automatically fix
> S3 public bucket detect + Security Group SSH check = perfect use case

**C) CloudWatch Events → ❌ မှားသည်**
> CloudWatch Events (EventBridge) = **event routing** ဖြစ်ပြီး resource configuration compliance tracking မဟုတ်ပါ — ၎င်းသည် events ကို route ဖြစ်သောကြောင့် Config Rules notification ကို EventBridge ဖြင့် route ဖြစ်ရသော်လည်း compliance evaluation ကို CloudWatch ကသာ မဖြစ်ပါ

**D) AWS Trusted Advisor → ❌ မှားသည်**
> Trusted Advisor = periodic (not continuous) checks ဖြစ်ပြီး Best Practice level assessment ကိုသာ ဆောင်ရွက်သည်ဖြစ်ပြီး **custom compliance rules, configuration history, change tracking** ကို Config ကဲ့သို့ detailed ဖြင့် မပြုလုပ်နိုင်ပါ

**💡 Real Exam Tip:**
| Question Pattern | Answer |
|----------------|--------|
| "Who made the API call?" | CloudTrail |
| "What changed in resource config?" | AWS Config |
| "Is the resource compliant?" | AWS Config Rules |
| "Security findings aggregation" | Security Hub |

---

## Q028
**A company's e-commerce website experiences bot attacks and credential stuffing attempts. Attackers use automated scripts to try thousands of username/password combinations on the login page. The application runs behind an ALB. Which solution BEST addresses this?**

- **A)** Increase EC2 instance size to handle the additional load from bot traffic
- **B)** Deploy AWS WAF with the Bot Control managed rule group and rate-based rules attached to the ALB
- **C)** Enable AWS Shield Advanced on the ALB
- **D)** Add more EC2 instances to the Auto Scaling group

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Increase EC2 instance size → ❌ မှားသည်**
> Larger instances = more capacity ဖြစ်ပြီး **bot traffic ကို block မဖြစ်ပါ** — bot attacks ဆက်ဖြစ်ဦးမည်ဖြစ်ပြီး cost ကပိုများမည်ဖြစ်ပြီး security ကိုမပြောင်းနိုင်ပါ — capacity solution ကိုသာ address ဖြစ်ပြီး security solution မဟုတ်ပါ

**B) AWS WAF + Bot Control + Rate-based rules → ✅ မှန်သည်**
> **WAF Bot Control** managed rule group:
> - Automated bots ကို identify ဆောင်ရွက်ပြီး **block/challenge (CAPTCHA)** ပြုလုပ်သည်
> - **Rate-based rules**: Same IP မှ N requests/minute ကျော်ပါက automatic block
> - **Credential stuffing prevention**: Login endpoint ကို rate limit ဆောင်ရွက်ပြီး attack ကို slow/stop
> ALB ကို directly attach ဖြစ်ပြီး application code changes မလိုပါ

**C) AWS Shield Advanced → ❌ မှားသည်**
> Shield Advanced = **L3/L4 volumetric DDoS** (bandwidth-based) protection ဖြစ်ပြီး **application-level bot/credential stuffing** attacks (L7) ကို specifically address မဖြစ်ပါ — Bot Control WAF rule ကသာ appropriate ဖြစ်သည်

**D) Add more EC2 instances → ❌ မှားသည်**
> A option နှင့် similar ဖြစ်ပြီး **capacity scaling = bot block မဖြစ်ပါ**ဘဲ attack ကို absorb ဖြစ်ရုံသာ ဖြစ်သောကြောင့် cost ကပိုများပြီး security ကို address မဖြစ်ပါ

**💡 Real Exam Tip:**
**"Bot attacks"** + **"credential stuffing"** + **"automated scripts"** → **AWS WAF + Bot Control managed rule group**

---

## Q029
**A company uses AWS Organizations with 30 member accounts. Due to data sovereignty regulations, ALL resources must be created only in `ap-northeast-1` (Tokyo) and `ap-southeast-1` (Singapore) regions. How should the company enforce this restriction across all accounts?**

- **A)** Create IAM policies with region conditions in each of the 30 accounts separately
- **B)** Create an SCP at the AWS Organizations root or OU level using `aws:RequestedRegion` condition to deny all actions outside the two approved regions
- **C)** Configure VPC endpoints in only the approved regions
- **D)** Enable AWS Config rules to detect resources in unapproved regions

---
**✅ Correct Answer: B**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) IAM policies per account → ❌ မှားသည်**
> 30 accounts × policy management = **operational overhead** ဖြစ်ပြီး each account admin = policy ကို modify/delete ဖြစ်ရနိုင်သောကြောင့် bypass ဖြစ်နိုင်သည်ဖြစ်ပြီး centralized enforcement မဟုတ်ပါ

**B) SCP with `aws:RequestedRegion` → ✅ မှန်သည်**
> **Region Restriction SCP Pattern:**
> ```json
> {
>   "Effect": "Deny",
>   "Action": "*",
>   "Resource": "*",
>   "Condition": {
>     "StringNotEquals": {
>       "aws:RequestedRegion": ["ap-northeast-1", "ap-southeast-1"]
>     }
>   }
> }
> ```
> Organization root ကို apply ဖြစ်ပြီး **all 30 accounts automatically enforce** ဖြစ်ပြီး new accounts ပါ automatic include ဖြစ်မည်

**C) VPC endpoints in approved regions → ❌ မှားသည်**
> VPC Endpoints = **private connectivity** feature ဖြစ်ပြီး **prevent resource creation in other regions** မဟုတ်ပါ — ၎င်းသည် routing/access pattern ကိုသာ control ဖြစ်ပြီး region restriction မဟုတ်ပါ

**D) Config rules detect unapproved regions → ❌ မှားသည်**
> Config = **detect (ဖြစ်ပြီးမှ)**ပါသည်ဖြစ်ပြီး resources already created ဖြစ်ပြီးမှ notify ဖြစ်မည်ဖြစ်ပြီး **"data sovereignty" (ဖြစ်ခြင်းကို prevent ဖြစ်ရမည်)** compliance ကို SCP ကဲ့သို့ preventive ဖြင့် မဖြည့်ဆည်းနိုင်ပါ

**💡 Real Exam Tip:**
**"data sovereignty"** + **"all accounts"** + **"region restriction"** → **SCP + `aws:RequestedRegion`**
Pattern: `StringNotEquals` → deny all regions NOT in the approved list

---

## Q030
**A company wants to implement defense-in-depth security for their web application VPC. The architect wants multiple security layers at different levels. Which combination represents the MOST comprehensive defense-in-depth strategy?**

- **A)** Security Groups on each EC2 instance with strict rules
- **B)** Network ACLs on subnets with explicit deny rules
- **C)** Security Groups (instance-level, stateful) + Network ACLs (subnet-level, stateless) + AWS WAF (application-level) + AWS Shield (DDoS protection)
- **D)** AWS WAF only, as it provides the most advanced protection

---
**✅ Correct Answer: C**

### မြန်မာဘာသာ ရှင်းလင်းချက်

**A) Security Groups only → ❌ မှားသည်**
> Single layer protection = defense-in-depth မဟုတ်ပါ ဖြစ်ပြီး L3/L4 instance-level protection သာ ဖြစ်ပြီး application layer attacks (SQL injection), DDoS, subnet-level controls မပါပါ

**B) Network ACLs only → ❌ မှားသည်**
> Single layer protection = defense-in-depth မဟုတ်ပါ ဖြစ်ပြီး stateless (both inbound/outbound explicit rules) + instance-level control မပါ + application layer protections မပါပါ

**C) SG + NACL + WAF + Shield → ✅ မှန်သည်**
> **Defense-in-Depth Layers:**
> | Layer | Control | Protects |
> |-------|---------|---------|
> | DDoS | AWS Shield | L3/L4 volumetric attacks |
> | Edge | AWS WAF | L7 app attacks (SQL, XSS) |
> | Subnet | Network ACL | Stateless subnet-level filtering |
> | Instance | Security Group | Stateful instance-level filtering |
>
> **Multiple independent layers** = attacker မှ ALL layers ကို bypass ဖြစ်မှသာ access ရနိုင်သောကြောင့် "comprehensive defense-in-depth" ဖြစ်သည်

**D) WAF only → ❌ မှားသည်**
> WAF = best for L7 ဖြစ်သော်လည်း **single layer** ဖြစ်ပြီး volumetric DDoS, network-level attacks ကို address မဖြစ်ပါ — "defense-in-depth" = multiple independent layers ကိုသာ ဆိုလိုသောကြောင့် single control မဟုတ်ပါ

**💡 Real Exam Tip:**
**"defense-in-depth"** → Multiple independent layers keyword
SG vs NACL:
| | Security Group | NACL |
|-|---------------|------|
| Level | Instance (ENI) | Subnet |
| State | **Stateful** | **Stateless** |
| Default action | Deny all inbound | Allow all |
| Rule types | Allow only | **Allow + Deny** |

---

## Q031–Q060 (Rapid Fire Security MCQs)

---

## Q031
**A company uses Amazon Cognito for their consumer mobile app. They want users to log in using their existing Google accounts. After authentication, users should receive temporary AWS credentials to directly access their personal S3 folder. Which Cognito components achieve this?**

- **A)** Cognito User Pool only, with built-in username/password authentication
- **B)** Cognito User Pool with Google as a social identity provider + Cognito Identity Pool to exchange tokens for AWS credentials
- **C)** IAM Identity Center configured with Google as IdP
- **D)** Amazon Cognito Sync for data synchronization

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Cognito User Pool only → ❌ မှားသည်**
> User Pool = Authentication (login + JWT tokens) ကိုသာ handle ဖြစ်ပြီး **AWS credentials (S3 access)** ကို issue မဖြစ်ပါ — S3 access ကိုအတွက် Identity Pool လိုသည်

**B) User Pool (Google login) + Identity Pool (AWS credentials) → ✅ မှန်သည်**
> **Cognito Two-Pool Pattern:**
> - **User Pool**: Google social IdP federation → user authenticate ဖြစ်ပြီး JWT token ရသည်
> - **Identity Pool**: JWT token → exchange → **temporary AWS credentials** (STS-based)
> - User = credentials ဖြင့် own S3 folder (`s3:prefix: users/${cognito-identity.amazonaws.com:sub}/*`) access
> ဤ two-pool combination = mobile app user + AWS resource access ၏ standard pattern

**C) IAM Identity Center → ❌ မှားသည်**
> IAM Identity Center = **enterprise employees / internal users** ကိုသာ designed ဖြစ်ပြီး consumer mobile app external users ကိုသာ မသင့်တော်ပါ

**D) Cognito Sync → ❌ မှားသည်**
> Cognito Sync (now AppSync) = device data synchronization ဖြစ်ပြီး authentication/authorization မဟုတ်ပါ

**💡 Real Exam Tip:**
**"consumer/mobile users"** + **"social login"** + **"AWS credentials"** → **Cognito User Pool + Identity Pool**

---

## Q032
**A company's EC2 instances in a private subnet need to access S3 and DynamoDB without internet connectivity. They want to minimize costs. Which VPC endpoint types should they use for each service?**

- **A)** Interface Endpoints (PrivateLink) for both S3 and DynamoDB — consistent approach
- **B)** Gateway Endpoints for both S3 and DynamoDB — free of charge
- **C)** Interface Endpoint for S3, Gateway Endpoint for DynamoDB
- **D)** NAT Gateway for both services — simple setup

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Interface Endpoints for both → ❌ မှားသည်**
> Interface Endpoints = **hourly charge per AZ + data processing fee** ကျသောကြောင့် S3 နှင့် DynamoDB ကြောင့် Gateway Endpoints (free) ရသော်လည်း Interface Endpoints ကို use ဖြစ်ပြုရင် **unnecessary cost** ဖြစ်မည်

**B) Gateway Endpoints for both → ✅ မှန်သည်**
> **S3 + DynamoDB = ONLY services with Gateway Endpoints (FREE):**
> - No hourly charge, no data processing fee
> - Route table entry သာ update ဖြစ်ရမည်
> - Internet မဖြတ်ဘဲ private AWS network ဖြင့် access
> **"minimize costs"** requirement ကို exactly ဖြည့်ဆည်းသည်

**C) Interface for S3, Gateway for DynamoDB → ❌ မှားသည်**
> S3 ကို Gateway Endpoint (free) ရပြီးဖြစ်သောကြောင့် Interface Endpoint ($) ကို use ဖြစ်ပြုရင် **unnecessary cost** ဖြစ်မည် — S3 ကိုလည်း Gateway Endpoint ကိုသာ use ဖြစ်ရမည်

**D) NAT Gateway for both → ❌ မှားသည်**
> NAT Gateway = internet ဖြတ်ပြီး **public AWS endpoints** ကို access ဖြစ်ပြုသောကြောင့် "without internet connectivity" requirement ကို မဖြည့်ဆည်းနိုင်ပါ + NAT Gateway = hourly + data transfer cost ကျသည်

**💡 Real Exam Tip:**
**FREE VPC Endpoints** = **S3 + DynamoDB = Gateway Endpoints only**
All other services → Interface Endpoints (PrivateLink) = hourly cost

---

## Q033
**A security team requires that all RDS database passwords be automatically rotated every 90 days. The application should seamlessly use the latest password without code changes. The solution should require minimal custom development. Which approach BEST meets these requirements?**

- **A)** Write a Lambda function that rotates the password every 90 days using AWS EventBridge scheduler
- **B)** Use AWS Secrets Manager with the built-in rotation schedule configured for RDS credentials
- **C)** Store passwords in Parameter Store SecureString and rotate manually every 90 days
- **D)** Update the RDS password manually and redeploy the application with the new value

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Custom Lambda + EventBridge → ❌ မှားသည်**
> Custom Lambda function develop ဖြစ်ရမည် = **"minimal custom development"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ — Secrets Manager ကဲ့သို့ built-in RDS rotation Lambda ပါပြီဖြစ်ပြီး re-develop မလိုပါ

**B) Secrets Manager + built-in RDS rotation → ✅ မှန်သည်**
> **Secrets Manager RDS rotation:**
> - Built-in rotation Lambda for: MySQL, PostgreSQL, Oracle, MariaDB, SQL Server
> - Set rotation schedule: every 90 days
> - App = `secretsmanager:GetSecretValue` API → always current password
> - RDS ဖြင့် seamlessly integrate ဖြစ်ပြီး **code changes မလိုပါ**
> **"minimal development"** + **"automatic 90-day rotation"** + **"seamless app access"** = all requirements met

**C) Parameter Store + manual rotation → ❌ မှားသည်**
> **Manual rotation** = human error risk + **"automatically rotated"** requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**D) Manual RDS password update + redeploy → ❌ မှားသည်**
> Manual + redeploy = **"automatically"** + **"without code changes"** requirements ကို မဖြည့်ဆည်းနိုင်ပါ

---

## Q034
**A company discovers through a security audit that several S3 buckets have `Block Public Access` disabled. They want to prevent ALL S3 buckets from being made public across their entire AWS account — current and future buckets — with a single configuration. What should they do?**

- **A)** Add a bucket policy to every S3 bucket denying public access
- **B)** Enable `Block Public Access` settings at the **AWS Account level** for S3
- **C)** Use AWS Config rule `s3-bucket-public-read-prohibited` with auto-remediation
- **D)** Set IAM policies to deny `s3:PutBucketPolicy` for all users

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Bucket policy per bucket → ❌ မှားသည်**
> Per-bucket = **new buckets** ကို automatically cover မဖြစ်ပါဘဲ existing + future buckets ကို single config ဖြင့် handle မဖြစ်နိုင်ပါ

**B) S3 Block Public Access at Account Level → ✅ မှန်သည်**
> **Account-level Block Public Access:**
> - S3 Console → Block Public Access settings for this account
> - All **current and future** buckets/objects ကို cover
> - Bucket/object level ACLs and bucket policies ဖြင့် public access ပြန်ဖွင့် မဖြစ်တော့ပါ
> - **Single configuration** ဖြင့် org-wide enforcement (account level)
> Requirement "single configuration" + "current and future" = **perfectly addressed**

**C) Config rule + auto-remediation → ❌ မှားသည်**
> Config = detect + remediate ဖြစ်ပြီး **window** ရှိမည်ဖြစ်ပြီး (bucket public ဖြစ်ပြီးမှ remediate) preventive မဟုတ်ပါ

**D) IAM deny s3:PutBucketPolicy → ❌ မှားသည်**
> Bucket policy ကို restrict ဖြစ်ပြုသော်လည်း ACL-based public access, console clicks ကို prevent မဖြစ်ပါ — account-level Block Public Access ကဲ့သို့ comprehensive မဟုတ်ပါ

---

## Q035
**A company uses AWS Config to monitor their resources. They want automatic remediation when Config detects that an S3 bucket has public read access enabled. The remediation should remove public access without manual intervention. What should they configure?**

- **A)** CloudWatch alarm triggered SNS to notify the team
- **B)** AWS Config Rule + Automatic Remediation action using an SSM Automation document (`AWS-DisableS3BucketPublicReadWrite`)
- **C)** GuardDuty finding + Lambda function
- **D)** Daily CloudTrail log analysis script

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) CloudWatch alarm + SNS → ❌ မှားသည်**
> Notify ဖြစ်ပြုသော်လည်း **automatic remediation မဟုတ်ပါ** — human intervention ဆက်ဆောင်ရွက်ရမည်ဖြစ်ပြီး "without manual intervention" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Config Rule + SSM Automation Auto-Remediation → ✅ မှန်သည်**
> **Config Auto-Remediation Flow:**
> 1. Config Rule: `s3-bucket-public-read-prohibited` → **Non-compliant** detect
> 2. Auto Remediation: `AWS-DisableS3BucketPublicReadWrite` SSM document → trigger
> 3. SSM Automation → S3 bucket public access ကို **automatically disable**
> No manual intervention required — fully automated compliance enforcement

**C) GuardDuty + Lambda → ❌ မှားသည်**
> GuardDuty = threat detection ဖြစ်ပြီး S3 ACL/policy misconfiguration detection = Config ၏ domain ဖြစ်သည်ဖြစ်ပြီး integration = more complex than Config native remediation

**D) Daily log analysis → ❌ မှားသည်**
> Daily = **real-time prevention မဟုတ်ပါ** — bucket public ဖြစ်ပြီး 24 hours ကြာနိုင်မည်

---

## Q036
**A security audit reveals that multiple Lambda functions share a single IAM execution role with broad permissions (`*:*`). What is the MOST appropriate remediation using the principle of least privilege?**

- **A)** Keep the shared role but add permission boundaries to limit it
- **B)** Create a separate, minimal IAM execution role for each Lambda function containing only the specific permissions that function requires
- **C)** Disable IAM authentication for Lambda and use resource-based policies instead
- **D)** Add explicit Deny statements to the shared role for services not needed

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Permission boundary on shared role → ❌ မှားသည်**
> Single role = ၎င်း role compromise ဖြစ်ပါက all functions ကို affect ဖြစ်မည်ဖြစ်ပြီး **per-function isolation** ကို မဖြစ်ပါ — Permission boundary = limit ဖြစ်ရပြီး per-function permissions ကို separate မဖြစ်ပါ

**B) Separate minimal IAM role per function → ✅ မှန်သည်**
> **Least Privilege for Lambda:**
> - Function-1 (reads DynamoDB) → Role-1: `dynamodb:GetItem, dynamodb:Query` only
> - Function-2 (sends SES email) → Role-2: `ses:SendEmail` only
> - Function-3 (writes S3) → Role-3: `s3:PutObject` on specific bucket only
> One function compromise = **blast radius limited** to that function's permissions only

**C) Disable IAM + use resource-based policies → ❌ မှားသည်**
> Lambda execution role = the function itself ၏ permissions ဖြစ်ပြီး disable မဖြစ်ပါ — resource policies = who can invoke Lambda, not what Lambda can do

**D) Explicit Deny on shared role → ❌ မှားသည်**
> Explicit Deny on shared role = every function affect ဖြစ်မည်ဖြစ်ပြီး **per-function isolation** ကို ဆက်ဆောင်ရွက်မဖြစ်ပါ — B ကသာ correct isolation

---

## Q037
**A company has a mobile application with millions of users. Users authenticate through a third-party SAML 2.0 identity provider. After authentication, users need temporary AWS credentials to upload photos to their personal S3 prefix. Which AWS service combination supports this mobile use case?**

- **A)** Create one IAM user per mobile app user
- **B)** AWS STS `AssumeRoleWithSAML` directly from mobile devices
- **C)** Amazon Cognito Identity Pools configured with SAML IdP federation, providing temporary credentials per user
- **D)** IAM Identity Center with SAML 2.0 integration

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) IAM user per mobile user → ❌ မှားသည်**
> Millions of users = millions of IAM users = **AWS soft limit (5000 users per account) exceed** + unmanageable + **"no IAM users"** design principle violation

**B) STS AssumeRoleWithSAML from mobile → ❌ မှားသည်**
> AssumeRoleWithSAML = server-side applications ကိုသာ designed ဖြစ်ပြီး mobile devices မှ directly call ဖြစ်ပြုရာတွင် SAML assertion handling = complex + Cognito ကဲ့သို့ mobile-optimized မဟုတ်ပါ

**C) Cognito Identity Pools + SAML → ✅ မှန်သည်**
> **Cognito Identity Pool SAML Federation:**
> - Mobile app → SAML IdP login → SAML assertion
> - Cognito Identity Pool → assertion exchange → **STS temporary credentials**
> - Credentials = scoped to user's own S3 prefix
> - **Millions of users** support ဖြစ်ပြီး no IAM users needed
> Mobile apps ကိုသာ designed ဖြစ်ပြီး AWS recommended pattern ဖြစ်သည်

**D) IAM Identity Center → ❌ မှားသည်**
> Identity Center = **enterprise employees** (internal workforce) ကိုသာ designed ဖြစ်ပြီး consumer mobile app millions of users ကို scale မဖြစ်နိုင်ပါ

---

## Q038
**A company's AWS account uses root user credentials occasionally. The security team wants to receive an immediate alert (within minutes) whenever the root user signs into the AWS Management Console. What is the MOST automated and reliable setup?**

- **A)** Review CloudTrail logs daily for root user activity
- **B)** Enable root user sign-in event in CloudTrail → send to CloudWatch Logs → create metric filter for root ConsoleLogin → CloudWatch Alarm → SNS email notification
- **C)** Enable GuardDuty and wait for root user findings
- **D)** Set up daily AWS Config rules to check for root user access

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Daily CloudTrail review → ❌ မှားသည်**
> Daily review = **"within minutes"** alert requirement ကို မဖြည့်ဆည်းနိုင်ပါ — manual + slow

**B) CloudTrail → CloudWatch Logs → Metric Filter → Alarm → SNS → ✅ မှန်သည်**
> **Root User Alert Architecture (AWS Best Practice):**
> 1. **CloudTrail** → `ConsoleLogin` event log (`userIdentity.type = Root`)
> 2. **CloudWatch Logs** → CloudTrail log group
> 3. **Metric Filter**: `{$.userIdentity.type = "Root" && $.eventName = "ConsoleLogin"}`
> 4. **CloudWatch Alarm** → metric > 0 threshold
> 5. **SNS Topic** → email/SMS immediate notification
> Real-time (minutes) + fully automated + AWS recommended pattern

**C) GuardDuty root findings → ❌ မှားသည်**
> GuardDuty = threat patterns detection ဖြစ်ပြီး root user login ကို immediately alert ဖြစ်ပြုရသည်ဟူသည် GuardDuty ၏ primary function မဟုတ်ပါ — B pattern ကသာ reliable alert ဖြစ်သည်

**D) Daily Config rules → ❌ မှားသည်**
> Daily = **real-time alert မဟုတ်ပါ** ဖြစ်ပြီး "within minutes" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

---

## Q039
**A company is building a 3-tier web application on AWS. The database tier (RDS) should only accept connections from the application tier (EC2 instances in an Auto Scaling group). As instances scale in and out, the database security group should automatically accommodate new instances without manual updates. What is the BEST security configuration?**

- **A)** Place RDS in a public subnet with security group allowing port 3306 from `0.0.0.0/0`
- **B)** Place RDS in a private subnet with security group allowing port 3306 only from the application tier's Security Group ID (not IP addresses)
- **C)** Enable RDS encryption and place in a public subnet
- **D)** Create a NACL rule on the RDS subnet allowing traffic from app EC2 IP addresses

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Public subnet + allow 0.0.0.0/0 → ❌ မှားသည်**
> Public subnet = internet accessible ဖြစ်ပြီး `0.0.0.0/0` = anyone can try to connect to database = **extremely insecure** ဖြစ်ပြီး database ကို expose ဖြစ်ပြုရင် regulatory violation ဖြစ်မည်

**B) Private subnet + allow from App SG ID → ✅ မှန်သည်**
> **Security Group Reference Pattern:**
> - RDS Security Group: Port 3306, Source = **App EC2 Security Group ID** (not IP)
> - Auto Scaling = new instances ကို ထို SG assign ဖြစ်ပြီး **automatically allowed** (IP မပြောင်းလဲဘဲ)
> - Private subnet = internet inaccessible
> **"automatically accommodate"** + **"most secure"** = SG reference pattern ကသာ

**C) RDS encryption + public subnet → ❌ မှားသည်**
> Encryption = at rest security ဖြစ်ပြီး **network access control မဟုတ်ပါ** — public subnet = internet accessible ဆိုသောကြောင့် network exposure ကို address မဖြစ်ပါ

**D) NACL with EC2 IP addresses → ❌ မှားသည်**
> Auto Scaling instances = **IP addresses change** ဖြစ်သောကြောင့် NACL IP-based rules = **constantly need update** = operational burden ဖြစ်ပြီး SG reference ကဲ့သို့ dynamic မဟုတ်ပါ

---

## Q040
**A company is implementing the AWS Well-Architected Framework Security Pillar. They want to use the "least privilege" principle for all human users accessing the AWS console. Which THREE practices should they implement? (Select TWO in this question)**

- **A)** Grant `AdministratorAccess` to all developers for flexibility
- **B)** Use IAM roles with time-limited sessions instead of long-lived IAM user credentials
- **C)** Implement attribute-based access control (ABAC) using IAM tags to scope permissions
- **D)** Share a single admin IAM user across the entire team

---
**✅ Correct Answer: B and C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) AdministratorAccess for all developers → ❌ မှားသည်**
> Full admin = least privilege ကို လုံး၀ ဆန့်ကျင်ဖြစ်ပြီး developer ကိုသာ လိုအပ်သော permissions ကို give ဖြစ်ရမည် — "flexibility" ကိုကြောင့် security ကို trade-off မလုပ်ရပါ

**B) IAM roles with time-limited sessions → ✅ မှန်သည်**
> - Short-lived credentials = credential theft risk decrease
> - Session expiry = automatic revocation
> - Long-lived IAM user keys = rotation + leak risk ဖြစ်ပြီး avoid ဖြစ်ရမည်
> AWS Best Practice: **"Prefer IAM roles over IAM user long-term credentials"**

**C) ABAC using IAM tags → ✅ မှန်သည်**
> **Attribute-Based Access Control (ABAC):**
> - Tag resources (e.g., `Project: TeamA, Environment: Dev`)
> - IAM policy condition = `StringEquals: aws:ResourceTag/Project: ${aws:PrincipalTag/Project}`
> - Users = access their own project resources only
> Dynamic, scalable least-privilege without managing hundreds of policies

**D) Share single admin IAM user → ❌ မှားသည်**
> Shared credentials = no accountability (CloudTrail logs = "admin_user" ဖြစ်ပြီး WHO မသိ) + one person leaves = credential rotate ဖြစ်ရမည် + **very bad practice**

---

## Q041
**A web application is hosted on EC2 instances behind a CloudFront distribution. The security team wants to protect against both network-level DDoS attacks AND application-layer attacks. They also want 24/7 DDoS response support from AWS specialists. Which solution meets all requirements?**

- **A)** AWS WAF alone is sufficient for all attack types
- **B)** AWS Shield Standard (free) provides comprehensive protection automatically
- **C)** AWS Shield Advanced + AWS WAF + Amazon CloudFront
- **D)** Network ACLs + Security Groups for comprehensive protection

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) WAF alone → ❌ မှားသည်**
> WAF = L7 app attacks only ဖြစ်ပြီး **L3/L4 volumetric DDoS** (network layer) ကို address မဖြစ်ပါ + **"24/7 DRT team"** = Shield Advanced ၏ unique feature

**B) Shield Standard → ❌ မှားသည်**
> Free Shield Standard = basic L3/L4 only ဖြစ်ပြီး **"24/7 DRT support"** = Shield **Advanced** only ဖြစ်သောကြောင့် "24/7 specialists" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**C) Shield Advanced + WAF + CloudFront → ✅ မှန်သည်**
> **Comprehensive DDoS + App Protection:**
> - **CloudFront**: Edge caching, absorbs volumetric traffic, global distribution
> - **Shield Advanced**: Enhanced L3/L4 + **AWS DRT (DDoS Response Team) 24/7** + financial protection
> - **WAF**: L7 app attacks (SQL injection, XSS, custom rules)
> All three requirements addressed: DDoS + App layer + 24/7 support

**D) NACL + SG → ❌ မှားသည်**
> NACL/SG = basic L3/L4 only ဖြစ်ပြီး **DDoS mitigation** မဟုတ်ပါ + **24/7 DRT** မပါပါ

---

## Q042
**A company wants to ensure that all new EBS volumes attached to EC2 instances are automatically encrypted. They don't want to rely on developers remembering to enable encryption. What is the SIMPLEST enforcement mechanism?**

- **A)** Create an IAM policy denying `ec2:CreateVolume` when encryption is not specified
- **B)** Enable `EBS encryption by default` in the EC2 account settings for each region
- **C)** Create an AWS Config rule to detect unencrypted EBS volumes and send alerts
- **D)** Add a CloudFormation guard to enforce encryption in all templates

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) IAM policy deny unencrypted volumes → ❌ မှားသည်**
> ကောင်းသော approach ဖြစ်သော်လည်း **"SIMPLEST"** requirement ကို B ကသာ ကိုက်ညီသည် — IAM policy = create, test, attach, manage လိုသောကြောင့် B ထက် complex ဖြစ်သည်

**B) EBS encryption by default → ✅ မှန်သည်**
> **EC2 Console → Account Settings → EBS Encryption → Enable**
> - All new EBS volumes = automatically encrypted (account + region level)
> - Developer မည်သည်ကိုမျှ specify မလိုပါ
> - New snapshots, AMIs ပါ automatically encrypted
> **Simplest** = single console toggle, no policy management

**C) Config rule + alerts → ❌ မှားသည်**
> Config = **detect after creation** ဖြစ်ပြီး **prevent from creating unencrypted** volumes မဟုတ်ပါ — reactive ဖြစ်ပြီး preventive control မဟုတ်ပါ

**D) CloudFormation guard → ❌ မှားသည်**
> CloudFormation guard = IaC templates ကိုသာ cover ဖြစ်ပြီး **console/CLI/SDK** မှ create ဖြစ်သော volumes ကို prevent မဖြစ်ပါ

---

## Q043
**A company uses API Gateway to expose REST APIs for their mobile application. Users authenticate with Amazon Cognito User Pools. After login, users receive a JWT (JSON Web Token). How should they configure API Gateway to validate these JWT tokens on every API request?**

- **A)** Use API Gateway IAM Authorization (AWS Signature V4)
- **B)** Create a Lambda Authorizer function that validates JWT tokens manually
- **C)** Configure a Cognito User Pool Authorizer on the API Gateway
- **D)** Use API Gateway API Keys for authentication

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) IAM Authorization → ❌ မှားသည်**
> IAM Auth = AWS IAM users/roles (internal AWS services) ကိုသာ designed ဖြစ်ပြီး mobile app users (Cognito JWT tokens) ကို validate မဖြစ်ပါ — different use case

**B) Lambda Authorizer → ❌ မှားသည်**
> Lambda Authorizer = custom validation logic ဖြင့် JWT validate ဖြစ်ရပါသည်ဖြစ်သော်လည်း **custom Lambda code develop ဖြစ်ရမည်** = overhead ဖြစ်ပြီး Cognito Authorizer ကသာ built-in, no-code option ဖြစ်သောကြောင့် "BEST" မဟုတ်ပါ

**C) Cognito User Pool Authorizer → ✅ မှန်သည်**
> **API Gateway Cognito Authorizer:**
> - API Gateway → Authorizer → Cognito User Pool configure
> - Every request = Authorization header ၏ JWT token ကို **automatically validate** (signature, expiry)
> - No custom code needed
> - Invalid token → 401 Unauthorized (automatic)
> Cognito + API Gateway = **native integration**, least development effort

**D) API Keys → ❌ မှားသည်**
> API Keys = **identification** (usage plan tracking) ဖြစ်ပြီး **authentication/authorization မဟုတ်ပါ** — per-user authentication JWT validation ကို API Keys ဖြင့် မဖြစ်ပါ

---

## Q044
**A compliance regulation requires audit logs to be retained for exactly 7 years and must be immutable — they cannot be deleted, modified, or overwritten by any party, including AWS administrators and account root users. Which S3 configuration ensures this?**

- **A)** Enable S3 Versioning with MFA Delete enabled on the bucket
- **B)** Enable S3 Object Lock in `Compliance` mode with 7-year retention period, applied at the bucket level with default retention
- **C)** Create an S3 bucket policy with `Deny` on `s3:DeleteObject` and `s3:PutObject`
- **D)** Use S3 Glacier Deep Archive with lifecycle rules after 1 year

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Versioning + MFA Delete → ❌ မှားသည်**
> MFA Delete = delete operations ကို MFA require ဖြစ်ပြုသော်လည်း MFA ရှိသောသူ = ဆက်လက် delete ဖြစ်ရနိုင်ပြီး **absolute immutability** မဟုတ်ပါ — "not even root user" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**B) Object Lock Compliance mode → ✅ မှန်သည်**
> **S3 Object Lock Compliance Mode:**
> - Retention period = 7 years
> - **Root user ပင် override မဖြစ်နိုင်**ပါ
> - Retention period ကြာ = delete/modify/overwrite မဖြစ်ပါ (true WORM)
> - **SEC, FINRA, HIPAA** regulatory compliance ကို address
> Bucket-level default retention = all new objects auto-apply

**C) Bucket policy Deny → ❌ မှားသည်**
> Root user = bucket policy override ဖြစ်ရနိုင်သောကြောင့် "including root users" requirement ကို မဖြည့်ဆည်းနိုင်ပါ

**D) Glacier Deep Archive → ❌ မှားသည်**
> Archive storage class ဖြစ်ပြီး **immutability feature မပါပါ** — Glacier = cost-effective storage ဖြစ်ပြီး delete/modify ကို prevent မဖြစ်ပါ

---

## Q045
**An application deployed via AWS CodePipeline needs database credentials at deployment time. The security team strictly prohibits storing plaintext secrets in code repositories, environment variables, or configuration files. The credentials must be automatically rotated every 60 days. Which approach BEST meets all requirements?**

- **A)** Store credentials in GitHub Secrets and reference in CodePipeline
- **B)** Hardcode credentials in `appconfig.yaml` and store in S3
- **C)** Store credentials in AWS Secrets Manager with a 60-day rotation schedule; application retrieves credentials via API at startup
- **D)** Use AWS Systems Manager Parameter Store Standard with manual rotation every 60 days

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) GitHub Secrets → ❌ မှားသည်**
> GitHub Secrets = CI/CD pipeline variables ဖြစ်ပြီး **AWS Secrets Manager ကဲ့သို့ automatic rotation** မပါပါ — 60-day rotation requirement ကို manual ဖြင့် handle ဖြစ်ရမည်

**B) Hardcode in config file → ❌ မှားသည်**
> **Worst practice** ဖြစ်ပြီး "plaintext in files" = security team prohibition ကို directly violate ဖြစ်သည်ဖြစ်ပြီး code repo expose ဖြစ်ပါက compromise ဖြစ်မည်

**C) Secrets Manager + 60-day rotation → ✅ မှန်သည်**
> - No credentials in code/files/env vars ✓
> - **60-day automatic rotation** configure ✓
> - App = `secretsmanager:GetSecretValue` API → always current value ✓
> - Audit trail (CloudTrail logs every retrieval) ✓
> All three security requirements addressed

**D) Parameter Store Standard + manual rotation → ❌ မှားသည်**
> **Manual rotation** = human error risk + "automatic rotation" requirement ကို မဖြည့်ဆည်းနိုင်ပါ — Secrets Manager ကသာ native automatic rotation ပါသည်

---

## Q046
**A company's AWS account has been compromised. The attacker created new IAM users and modified existing resources. The incident response team has been activated. What is the FIRST priority action they should take?**

- **A)** Enable MFA for all existing IAM users immediately
- **B)** Immediately change the root user password and enable MFA on the root user, then begin investigation
- **C)** Delete all EC2 instances to stop any ongoing malicious activity
- **D)** Disable all IAM users to prevent further unauthorized access

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Enable MFA for IAM users → ❌ မှားသည်**
> IAM users = attacker ကိုယ်တိုင် create ဖြစ်ထားနိုင်သောကြောင့် attacker-created users ကို MFA enable ဖြစ်ပြုရင် attacker account ကိုပါ MFA protect ဖြစ်မည် — root secure ဦးစွာ ဆောင်ရွက်ဖြစ်ရမည်

**B) Root user password change + MFA → ✅ မှန်သည်**
> **Incident Response Priority:**
> 1. Root user = **highest privilege** ဖြစ်သောကြောင့် **secure root first**
> 2. Root password change + MFA = attacker ၏ potential root access block
> 3. Then: Investigate CloudTrail, remove attacker IAM users/roles, rotate all keys
> **"FIRST priority"** = secure the most powerful credential (root) first

**C) Delete all EC2 instances → ❌ မှားသည်**
> Evidence destruction ဖြစ်မည်ဖြစ်ပြီး **forensic investigation** ကို impede ဖြစ်မည်ဖြစ်ပြီး production services destroy ဖြစ်မည်ဖြစ်သောကြောင့် "first priority" မဟုတ်ပါ

**D) Disable all IAM users → ❌ မှားသည်**
> All IAM users disable = legitimate team members ပါ lockout ဖြစ်မည်ဖြစ်ပြီး investigation ကိုပါ impede ဖြစ်မည် — targeted approach (attacker accounts identify + disable) = appropriate

---

## Q047
**A company needs EC2 instances in a private subnet to access AWS Systems Manager (SSM) APIs to allow Session Manager connections. They want to avoid any internet connectivity or NAT Gateway. What is the MOST appropriate and cost-effective solution?**

- **A)** Set up a NAT Gateway in a public subnet for SSM access
- **B)** Create VPC Interface Endpoints for `ssm`, `ssmmessages`, and `ec2messages` services
- **C)** Create a VPC Gateway Endpoint for SSM
- **D)** Assign public IP addresses to the EC2 instances in the private subnet

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) NAT Gateway → ❌ မှားသည်**
> NAT Gateway = internet ဖြတ်ပြီး SSM public endpoints ကို access ဖြစ်ပြုသောကြောင့် "avoid internet connectivity" requirement ကို မဖြည့်ဆည်းနိုင်ပါ + hourly cost ကျသည်

**B) VPC Interface Endpoints for SSM → ✅ မှန်သည်**
> **SSM Endpoint Requirements (all 3 needed):**
> - `com.amazonaws.{region}.ssm` → SSM API endpoint
> - `com.amazonaws.{region}.ssmmessages` → Session Manager data channel
> - `com.amazonaws.{region}.ec2messages` → EC2 to SSM communication
> Internet မဖြတ်ဘဲ private AWS network ဖြင့် SSM access ဖြစ်သည်

**C) VPC Gateway Endpoint for SSM → ❌ မှားသည်**
> SSM ကို Gateway Endpoint **မရှိပါ** — Gateway Endpoints = S3 + DynamoDB only ဖြစ်ပြီး SSM ကို Interface Endpoint (PrivateLink) ကိုသာ use ဖြစ်ရမည်

**D) Public IPs on private instances → ❌ မှားသည်**
> Public IP = instances ကို internet-reachable ဖြစ်ပြုမည်ဖြစ်ပြီး "private subnet" + "no internet" design principle ကို violate ဖြစ်မည်

---

## Q048
**An IAM policy has both `Effect: Allow` and `Effect: Deny` for the same action `s3:DeleteObject` on the same resource. The Allow comes from an IAM group policy, and the Deny comes from an inline policy. What is the effective permission?**

- **A)** Allow, because group policies take precedence over inline policies
- **B)** Allow, because the Allow and Deny cancel each other out
- **C)** Deny, because explicit Deny always overrides Allow regardless of policy source
- **D)** Deny, because inline policies have higher priority than managed policies

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Group policies take precedence → ❌ မှားသည်**
> IAM evaluation တွင် **group policy vs inline policy priority မရှိပါ** — policy source (group/inline/managed) = evaluation result ကို မသက်ဆိုင်ပါ ဖြစ်ပြီး **Deny > Allow** ဆိုသော rule ကသာ apply ဖြစ်သည်

**B) Allow and Deny cancel out → ❌ မှားသည်**
> **"Cancel out" ဆိုသည် IAM concept မဟုတ်ပါ** — ၎င်းသည် Java null cancellation ကဲ့သို့ programming concept မဟုတ်ပါ — IAM = **Deny always wins**, period

**C) Explicit Deny always wins → ✅ မှန်သည်**
> **IAM Evaluation Logic (Absolute Rule):**
> - Explicit DENY = **always overrides any Allow** (policy source မကြည့်ဘဲ)
> - Inline Deny + Group Allow = **DENY** (result)
> - 10 Allow policies + 1 Deny policy = **DENY** (still)
> This is the single most important IAM rule to memorize for the exam

**D) Inline policies have higher priority → ❌ မှားသည်**
> ဤ statement = **မမှန်ပါ** — IAM ထဲတွင် inline vs managed/group priority မရှိပါ — **Deny > Allow** ဆိုသောကြောင့် C မှန်သော်လည်း "because inline has priority" ဆိုသော reason မမှန်ပါ

---

## Q049
**A containerized application runs on Amazon ECS Fargate. The containers need to call AWS DynamoDB and AWS S3. The security team wants each ECS task to have only the permissions it needs. What is the CORRECT mechanism for granting these permissions?**

- **A)** Store AWS access keys as environment variables in the ECS task definition
- **B)** Create an ECS Task Role (not Task Execution Role) with specific DynamoDB and S3 permissions, and reference it in the task definition
- **C)** Use the ECS Task Execution Role to grant all required application permissions
- **D)** Hard-code AWS credentials in the application container image

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) Access keys as environment variables → ❌ မှားသည်**
> Environment variables = ECS console/CLI ဖြင့် view ဖြစ်ရနိုင်သောကြောင့် **insecure** + long-lived credentials ဖြစ်ပြီး "least privilege per task" ကို address မဖြစ်ပါ

**B) ECS Task Role → ✅ မှန်သည်**
> **ECS IAM Role Types:**
> - **Task Execution Role**: ECS agent use ဖြစ်သည် (ECR pull, CloudWatch logs write)
> - **Task Role**: **Application code** use ဖြစ်သည် (DynamoDB, S3, etc.)
> Task Role = per-task minimal permissions ဖြင့် **credential-free application** development ဖြစ်ပြီး Fargate ဖြင့် automatically injected

**C) Task Execution Role for app permissions → ❌ မှားသည်**
> Task Execution Role = ECS infrastructure role ဖြစ်ပြီး application business logic permissions ကို **Task Role ဖြင့်သာ** handle ဖြစ်ရမည် — separation of concerns

**D) Hard-code credentials in image → ❌ မှားသည်**
> **Worst practice** ဖြစ်ပြီး container image = shared/pushed to ECR = credentials exposed ဖြစ်မည်ဖြစ်ပြီး **never store credentials in code/images**

---

## Q050
**A company uses multiple AWS security services: GuardDuty, Amazon Inspector, Amazon Macie, and AWS Config. The security team wants a single, unified view of all security findings with compliance status across their entire AWS organization. Which service provides this centralized visibility?**

- **A)** AWS CloudTrail Lake — aggregates all security logs
- **B)** Amazon CloudWatch — creates unified security dashboards
- **C)** AWS Security Hub — aggregates findings from multiple security services and provides compliance standards
- **D)** AWS Config Aggregator — aggregates resource compliance data

---
**✅ Correct Answer: C**

**မြန်မာဘာသာ ရှင်းလင်းချက်:**

**A) CloudTrail Lake → ❌ မှားသည်**
> CloudTrail Lake = API call logs centralization ဖြစ်ပြီး **GuardDuty findings, Inspector vulnerabilities** ကဲ့သို့ security findings aggregation မဟုတ်ပါ

**B) CloudWatch dashboards → ❌ မှားသည်**
> CloudWatch = metrics/logs monitoring ဖြစ်ပြီး **cross-service security findings aggregation + compliance standards** (CIS, PCI-DSS) evaluation = Security Hub ၏ function ဖြစ်သည်

**C) AWS Security Hub → ✅ မှန်သည်**
> **AWS Security Hub:**
> - GuardDuty, Inspector, Macie, Config, IAM Access Analyzer findings aggregate
> - **CSPM (Cloud Security Posture Management)**
> - Compliance standards: **CIS AWS Benchmarks, PCI-DSS, NIST**
> - Multi-account aggregation via Organizations
> - Single unified security dashboard = exactly what's needed

**D) AWS Config Aggregator → ❌ မှားသည်**
> Config Aggregator = Config-specific findings across accounts ဖြစ်ပြီး **GuardDuty/Inspector/Macie findings** ကို include မဖြစ်ပါ — Security Hub ကဲ့သို့ comprehensive security aggregation မဟုတ်ပါ

**💡 Final Security Hub Tip:**
**"single unified view"** + **"multiple security services"** + **"compliance standards"** → **AWS Security Hub**

---

## Q051–Q100: Rapid Fire (Each with 4 Choices + Brief Burmese Explanation)

---

## Q051
**A company needs S3 bucket access restricted to only specific VPC. Which condition key restricts S3 access to traffic originating from a specific VPC?**

- **A)** `aws:SourceIp`
- **B)** `aws:SourceVpc`
- **C)** `aws:SourceVpce`
- **D)** `s3:prefix`

**✅ Correct Answer: B or C**

**မြန်မာဘာသာ:**
- **A) aws:SourceIp → ❌** → IP address မှ access ကို control (IP-based restriction)
- **B) aws:SourceVpc → ✅** → VPC ID ဖြင့် restrict (VPC မှ traffic အားလုံး ← most common answer)
- **C) aws:SourceVpce → ✅** → Specific VPC Endpoint ID ဖြင့် restrict (more specific)
- **D) s3:prefix → ❌** → S3 folder path control (VPC restriction မဟုတ်)

💡 **"specific VPC endpoint"** ဆိုပါက C, **"entire VPC"** ဆိုပါက B

---

## Q052
**A company wants to identify unused IAM permissions to reduce the attack surface. Which tool provides `Last Accessed` information per service?**

- **A)** AWS CloudTrail
- **B)** IAM Access Analyzer with Last Accessed feature
- **C)** Amazon GuardDuty
- **D)** AWS Config

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) CloudTrail → ❌** → API call logs ဖြစ်ပြီး per-permission last accessed analysis မဟုတ်
- **B) IAM Access Analyzer → ✅** → IAM user/role ၏ service/action last accessed date ကို ပြသည်
- **C) GuardDuty → ❌** → Threat detection ဖြစ်ပြီး IAM usage analysis မဟုတ်
- **D) Config → ❌** → Resource configuration compliance ဖြစ်ပြီး IAM permission usage မဟုတ်

---

## Q053
**EC2 instance metadata service (IMDS) is vulnerable to SSRF attacks. What configuration prevents credential theft via SSRF?**

- **A)** Remove IAM role from EC2 instance
- **B)** Enable IMDSv2 (require session-oriented token-based requests)
- **C)** Disable metadata service entirely
- **D)** Use VPC Endpoint for metadata service

---
**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Remove IAM role → ❌** → EC2 ၏ AWS service access ကို block ဖြစ်မည်
- **B) Enable IMDSv2 → ✅** → PUT request ဖြင့် session token ရယူမှသာ GET metadata ဖြစ်ရသောကြောင့် SSRF protection
- **C) Disable metadata → ❌** → Application ၏ IAM credential retrieval ပါ block ဖြစ်မည်
- **D) VPC Endpoint for metadata → ❌** → Metadata service = 169.254.169.254 link-local, VPC endpoint မဆိုင်

---

## Q054
**Which service automatically detects sensitive data such as credit card numbers and social security numbers in S3 buckets?**

- **A)** AWS GuardDuty
- **B)** AWS Inspector
- **C)** Amazon Macie
- **D)** AWS Config

**✅ Correct Answer: C**

**မြန်မာဘာသာ:**
- **A) GuardDuty → ❌** → Threat/malicious activity detection
- **B) Inspector → ❌** → Software vulnerability scanning
- **C) Macie → ✅** → S3 PII/sensitive data discovery using ML
- **D) Config → ❌** → Resource configuration compliance

---

## Q055
**A Lambda function must access a KMS-encrypted secret in Secrets Manager. What TWO IAM permissions are required on the Lambda execution role?**

- **A)** `lambda:InvokeFunction` and `kms:Encrypt`
- **B)** `secretsmanager:GetSecretValue` and `kms:Decrypt`
- **C)** `secretsmanager:DescribeSecret` and `kms:GenerateDataKey`
- **D)** `iam:PassRole` and `secretsmanager:GetSecretValue`

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) lambda:InvokeFunction + kms:Encrypt → ❌** → Secret ကို ဖတ်ရန် Invoke+Encrypt မဟုတ်
- **B) secretsmanager:GetSecretValue + kms:Decrypt → ✅** → Secret retrieve + KMS decrypt = correct pair
- **C) DescribeSecret + GenerateDataKey → ❌** → DescribeSecret = metadata only, GenerateDataKey = encrypting new data
- **D) iam:PassRole + GetSecretValue → ❌** → PassRole = role passing (different context)

---

## Q056
**A company needs centralized security logging from 20 AWS accounts. Where should logs be aggregated?**

- **A)** Enable CloudWatch Logs in each account separately
- **B)** Create a dedicated security/logging account with a centralized S3 bucket; all accounts deliver CloudTrail/VPC Flow Logs to it via resource policies
- **C)** Use CloudTrail in only one account for all accounts
- **D)** Store logs in RDS for security analysis

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Per-account CloudWatch → ❌** → Centralized မဟုတ်ဘဲ manage ခက်သည်
- **B) Dedicated logging account + S3 → ✅** → AWS recommended centralized logging architecture
- **C) Single account CloudTrail → ❌** → Other accounts ၏ API calls မကျသည်
- **D) RDS for logs → ❌** → S3 = appropriate for log storage, RDS = structured queries မဟုတ်

---

## Q057
**An external security auditor needs read-only access to an AWS account. Which AWS managed policy is MOST appropriate?**

- **A)** `AdministratorAccess`
- **B)** `PowerUserAccess`
- **C)** `ReadOnlyAccess`
- **D)** `SecurityAudit`

**✅ Correct Answer: C (or D)**

**မြန်မာဘာသာ:**
- **A) AdministratorAccess → ❌** → Full admin (auditor ကို excess ဖြစ်ပြီး dangerous)
- **B) PowerUserAccess → ❌** → Admin except IAM (still too much for auditor)
- **C) ReadOnlyAccess → ✅** → All services Describe/List/Get only (read-only perfect for auditor)
- **D) SecurityAudit → ✅** → Security-focused read-only (more targeted for security auditors)

💡 "General auditor" = ReadOnlyAccess | "Security auditor" = SecurityAudit

---

## Q058
**What is the difference between `aws:RequestedRegion` and `aws:SourceIp` IAM condition keys?**

- **A)** Both restrict geographic location in the same way
- **B)** `aws:RequestedRegion` controls which AWS region receives the API call; `aws:SourceIp` controls the requester's IP address
- **C)** `aws:SourceIp` is for S3 only
- **D)** `aws:RequestedRegion` is deprecated and should not be used

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Both same → ❌** → မတူညီပါ — region vs IP ဖြစ်သည်
- **B) Region vs IP → ✅** → RequestedRegion = API destination region, SourceIp = caller IP address
- **C) SourceIp for S3 only → ❌** → SourceIp = any service's request source IP
- **D) RequestedRegion deprecated → ❌** → Active, widely used condition key

---

## Q059
**A company discovered unauthorized IAM users created in their account. What is the correct SEQUENCE of incident response steps?**

- **A)** Delete all IAM users → Change root password → Notify AWS
- **B)** Immediately revoke all access keys → Change root password + enable MFA → Investigate CloudTrail → Remove unauthorized entities → Review and remediate
- **C)** Shut down all EC2 instances → Rebuild infrastructure → Change passwords
- **D)** Contact AWS support first → Wait for AWS to remediate

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Delete all users first → ❌** → Evidence destroy + legitimate users lockout ဖြစ်မည်
- **B) Revoke → Root secure → Investigate → Remediate → ✅** → Correct incident response sequence
- **C) Shutdown all EC2 → ❌** → Service disruption + forensics obstruction
- **D) Wait for AWS → ❌** → Account owner = primary responder, AWS = assist only

---

## Q060
**Which AWS service provides a hardware-based cryptographic module compliant with FIPS 140-2 Level 3, where AWS has NO access to the encryption keys?**

- **A)** AWS KMS with CMK
- **B)** AWS CloudHSM
- **C)** AWS Secrets Manager
- **D)** AWS Certificate Manager (ACM)

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) KMS CMK → ❌** → FIPS 140-2 Level 2, AWS ကနေ theoretically key access ဖြစ်ရနိုင်
- **B) CloudHSM → ✅** → FIPS 140-2 **Level 3**, dedicated hardware, AWS = NO key access
- **C) Secrets Manager → ❌** → Secret storage (KMS ပေါ်တွင် depend), hardware HSM မဟုတ်
- **D) ACM → ❌** → TLS certificate management service, not HSM

---

## Q061
**A company's S3 bucket must only be accessible via HTTPS, never HTTP. Which bucket policy condition enforces this?**

- **A)** `"Condition": {"Bool": {"aws:SecureTransport": "false"}}` with Effect: Deny
- **B)** `"Condition": {"Bool": {"s3:x-amz-server-side-encryption": "true"}}` with Effect: Allow
- **C)** `"Condition": {"StringEquals": {"s3:RequestObjectTag": "HTTPS"}}` with Effect: Allow
- **D)** `"Condition": {"Bool": {"aws:ViaAWSService": "true"}}` with Effect: Allow

**✅ Correct Answer: A**

**မြန်မာဘာသာ:**
- **A) SecureTransport false → Deny → ✅** → HTTP requests (SecureTransport=false) ကို Deny → HTTPS only enforce
- **B) SSE encryption condition → ❌** → At-rest encryption condition, in-transit မဟုတ်
- **C) Object tag condition → ❌** → Object metadata condition, transport protocol မဟုတ်
- **D) ViaAWSService condition → ❌** → AWS services ဖြင့် access ကို control, transport security မဟုတ်

---

## Q062
**Which type of IAM policy can be attached to multiple users, groups, and roles across multiple accounts?**

- **A)** Inline Policy
- **B)** Customer Managed Policy
- **C)** AWS Managed Policy
- **D)** Resource-Based Policy

**✅ Correct Answer: C**

**မြန်မာဘာသာ:**
- **A) Inline → ❌** → Embedded in single entity, reuse မဖြစ်
- **B) Customer Managed → ✅ (partial)** → Multiple entities ကို attach ဖြစ်ရပြီ — same account ထဲ
- **C) AWS Managed → ✅** → AWS ဖန်တီးပြီး multiple accounts ဖြင့် use ဖြစ်ရနိုင် (e.g., ReadOnlyAccess)
- **D) Resource-Based → ❌** → Resource ၌ attached ဖြစ်ပြီး (S3 bucket policy) identity မဟုတ်

💡 **"Multiple accounts"** → **AWS Managed Policies** (cross-account reuse)

---

## Q063
**An EC2 instance in a public subnet has a public IP and internet access. After adding a new NACL rule to deny all inbound traffic, can the instance still receive responses to its outbound requests?**

- **A)** Yes — Security Groups are stateful and allow return traffic
- **B)** No — NACL denies all inbound including return traffic (NACL is stateless)
- **C)** Yes — Route tables override NACL rules
- **D)** No — Security Groups become stateless when NACL denies inbound

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) SG stateful saves it → ❌** → NACL = subnet level ဖြစ်ပြီး SG ကို reach ဖြစ်ခြင်း မဟုတ်ဘဲ NACL ဦးစွာ evaluate
- **B) NACL stateless blocks return → ✅** → NACL Deny all inbound = return traffic ပါ block (NACL has no state)
- **C) Route tables override → ❌** → Route tables = routing (where to send), not filtering
- **D) SG becomes stateless → ❌** → SG ကတော့ stateful ဆဲဖြစ်ပြီး NACL independent

---

## Q064
**What is the maximum number of IAM roles that can be attached to a single EC2 instance?**

- **A)** 0 — EC2 doesn't support IAM roles
- **B)** 1 — Only one instance profile (containing one role) per instance
- **C)** 5 — Default limit
- **D)** Unlimited

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) 0 → ❌** → EC2 = IAM roles (instance profiles) support ဖြစ်သည်
- **B) 1 → ✅** → EC2 instance = maximum 1 instance profile (which contains 1 IAM role)
- **C) 5 → ❌** → 5 = Security Groups per ENI limit (different)
- **D) Unlimited → ❌** → Hard limit = 1 role per instance

---

## Q065
**A company wants GuardDuty findings to automatically create JIRA tickets. What is the correct architecture?**

- **A)** GuardDuty → CloudTrail → Lambda → JIRA
- **B)** GuardDuty → Amazon EventBridge → Lambda (calls JIRA API) → JIRA ticket created
- **C)** GuardDuty → SNS → SQS → JIRA
- **D)** GuardDuty → Config → Lambda → JIRA

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) CloudTrail in middle → ❌** → CloudTrail = log source, not event routing
- **B) GuardDuty → EventBridge → Lambda → JIRA → ✅** → AWS standard security automation pattern
- **C) GuardDuty → SNS → SQS → ❌** → Possible but Lambda (EventBridge) = more direct + better filtering
- **D) Config in middle → ❌** → Config = compliance, not GuardDuty finding routing

---

## Q066
**What does enabling `S3 Block Public Access` at the account level prevent?**

- **A)** Only prevents future buckets from being public
- **B)** Blocks ALL public access to ALL current and future buckets/objects, overriding any bucket policies or ACLs that grant public access
- **C)** Only applies to objects, not buckets
- **D)** Only prevents ACL-based public access, not policy-based

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Future only → ❌** → Account level = current AND future
- **B) Overrides all public access → ✅** → Account-level setting = override bucket policies + ACLs
- **C) Objects only → ❌** → Buckets + objects ကို cover
- **D) ACL only → ❌** → Both ACL-based AND policy-based public access ကို block

---

## Q067
**An application needs to list all S3 buckets and read objects from specific buckets. What is the correct IAM policy structure using least privilege?**

- **A)** `"Action": "*", "Resource": "*"` — simplest approach
- **B)** `"Action": "s3:ListAllMyBuckets", "Resource": "arn:aws:s3:::*"` AND separately `"Action": ["s3:GetObject", "s3:ListBucket"], "Resource": ["arn:aws:s3:::specific-bucket", "arn:aws:s3:::specific-bucket/*"]`
- **C)** `"Action": "s3:*", "Resource": "arn:aws:s3:::*"` — grants all S3 permissions
- **D)** `"Action": "s3:GetObject", "Resource": "*"` only

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Wildcard all → ❌** → Least privilege ကို completely violate
- **B) Specific actions + specific resources → ✅** → Exactly needed permissions only (list all = `arn:*`, read = specific bucket)
- **C) All S3 actions → ❌** → Over-privileged (delete, ACL change, etc. included)
- **D) GetObject only → ❌** → ListAllMyBuckets missing (S3 console ကို work ဖြစ်မည်မဟုတ်)

---

## Q068
**A company uses AWS Config. A Config Rule evaluates as `NON_COMPLIANT` for a resource. What happens next by default?**

- **A)** Config automatically deletes the non-compliant resource
- **B)** Config records the finding; an SNS notification is sent if configured; no automatic action unless auto-remediation is set up
- **C)** Config automatically fixes the resource
- **D)** Config blocks future changes to the resource

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Auto-delete → ❌** → Config ကိုယ်တိုင် resources ကို delete မဖြစ်ပါ
- **B) Record + notify (if configured) → ✅** → Default behavior: find + record + optional notify; Auto-remediation = additional setup
- **C) Auto-fix → ❌** → Auto-remediation = explicitly configure ဖြစ်ရမည် (not default)
- **D) Block changes → ❌** → Config = assessment only, access control မဟုတ်

---

## Q069
**Which AWS service helps you analyze which resources in your account are publicly accessible from the internet or shared with external accounts?**

- **A)** Amazon GuardDuty
- **B)** AWS IAM Access Analyzer
- **C)** Amazon Macie
- **D)** AWS Trusted Advisor

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) GuardDuty → ❌** → Runtime threat detection
- **B) IAM Access Analyzer → ✅** → Analyzes resource-based policies (S3, IAM roles, KMS, Lambda, SQS, Secrets Manager) to identify external access
- **C) Macie → ❌** → S3 sensitive data discovery
- **D) Trusted Advisor → ❌** → General best practice checks (not deep access analysis)

---

## Q070
**An SCP at the organization root denies `ec2:TerminateInstances`. An IAM administrator in a member account creates a policy that allows `ec2:TerminateInstances`. Can they terminate instances?**

- **A)** Yes — IAM admin has full permissions within the account
- **B)** No — SCP Deny is absolute and cannot be overridden by IAM policies within member accounts
- **C)** It depends on whether they have MFA enabled
- **D)** Yes — Administrators are exempt from SCPs

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) IAM admin can override SCP → ❌** → SCP > IAM policy ဆိုသော hierarchy ကြောင့် IAM admin ပင် SCP override မဖြစ်ပါ
- **B) SCP Deny absolute → ✅** → SCP = maximum permission ceiling. IAM Allow = SCP Deny ကို override မဖြစ်ပါ
- **C) MFA dependent → ❌** → SCP restriction = MFA status ကို မသက်ဆိုင်ပါ
- **D) Admins exempt from SCP → ❌** → **Root user ပင်** SCP ကို bypass မဖြစ်ပါ

---

## Q071
**A company wants to store their own encryption key material in AWS KMS rather than having AWS generate it. Which feature allows this?**

- **A)** AWS Managed Key rotation
- **B)** KMS CMK with custom key material import (External Key Material)
- **C)** CloudHSM with KMS custom key store
- **D)** SSE-S3 with customer-provided keys

**✅ Correct Answer: B or C**

**မြန်မာဘာသာ:**
- **A) AWS Managed rotation → ❌** → AWS-generated key material ဖြစ်ပြီး customer import မဟုတ်
- **B) CMK with external key material → ✅** → KMS console ဖြင့် key material ကို import (BYOK - Bring Your Own Key)
- **C) CloudHSM + KMS custom key store → ✅** → HSM-generated keys ကို KMS ဖြင့် use (highest security)
- **D) SSE-C → ❌** → S3 specific, KMS မဟုတ်

💡 **"BYOK (Bring Your Own Key)"** → KMS External Key Material import

---

## Q072
**A company uses ECS Fargate. They want to prevent the ECS task from accessing the EC2 instance metadata service (IMDS) to avoid credential confusion attacks. What should they do?**

- **A)** Remove the task IAM role
- **B)** The ECS task has no access to EC2 IMDS by default in Fargate (Fargate uses its own credential endpoint)
- **C)** Enable IMDSv2 for ECS tasks
- **D)** Block the 169.254.169.254 address in Security Groups

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Remove task role → ❌** → AWS credentials ကို block ဖြစ်မည်
- **B) Fargate ကိုယ်ပိုင် credential endpoint → ✅** → Fargate = EC2 IMDS ဖြင့် credential မဖြစ်ဘဲ own container credential endpoint use ဖြစ်သည်
- **C) IMDSv2 for ECS → ❌** → Fargate = IMDSv2 concept ကို EC2 IMDS ကဲ့သို့ apply မဖြစ်ပါ
- **D) Block 169.254.169.254 → ❌** → Fargate containers = host EC2 share မဖြစ်ပါ

---

## Q073
**Which GuardDuty finding indicates that an EC2 instance may be compromised and communicating with command-and-control (C2) infrastructure?**

- **A)** `S3:BucketBlockPublicAccessDisabled`
- **B)** `UnauthorizedAccess:EC2/MaliciousIPCaller`
- **C)** `Policy:S3/AccountPublicAccessUnblocked`
- **D)** `Recon:EC2/PortProbeUnprotectedPort`

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) S3 public access → ❌** → S3 bucket configuration finding (C2 မဟုတ်)
- **B) MaliciousIPCaller → ✅** → EC2 = known malicious IP (C2 server) ကို communicate ဖြစ်ပြုသောကြောင့် compromise indicator
- **C) S3 account public access → ❌** → S3 policy finding
- **D) PortProbeUnprotectedPort → ❌** → Reconnaissance (port scanning detection), not C2 communication

---

## Q074
**An application on EC2 needs to call DynamoDB. The SysAdmin creates an IAM user with DynamoDB permissions and stores the access key on the EC2 instance. 6 months later, the team forgets the access key is there. What is the RISK?**

- **A)** No risk — IAM user access keys are safe indefinitely
- **B)** If the EC2 instance is compromised, the long-lived access key gives attackers permanent DynamoDB access until manually revoked
- **C)** Access keys automatically expire after 6 months
- **D)** The IAM user will be automatically deleted after 6 months of inactivity

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Safe indefinitely → ❌** → Long-lived keys = security risk (stale credentials)
- **B) Instance compromise = DynamoDB access → ✅** → IAM user keys = never expire (until manually rotated/deleted)
- **C) Auto-expire after 6 months → ❌** → IAM keys = DO NOT auto-expire (unless explicitly rotated)
- **D) IAM user auto-deleted → ❌** → IAM users = DO NOT auto-delete

💡 **Solution**: Use IAM Role (Instance Profile) = temporary credentials, auto-rotated

---

## Q075
**A company wants to enforce that all API calls to AWS from their CI/CD pipeline use the pipeline's IAM role, not individual developer credentials. What should they configure?**

- **A)** Create one shared IAM user for all CI/CD pipelines
- **B)** Configure CI/CD pipeline to assume a specific IAM role via `sts:AssumeRole` and use the resulting temporary credentials
- **C)** Embed individual developer credentials in CI/CD pipeline secrets
- **D)** Use root user credentials for CI/CD pipelines

**✅ Correct Answer: B**

**မြန်မာဘာသာ:**
- **A) Shared IAM user → ❌** → Shared credentials = no accountability + rotation risk
- **B) Pipeline assumes IAM role → ✅** → Pipeline role = specific permissions, temporary credentials, traceable
- **C) Developer credentials in CI/CD → ❌** → Individual credentials in automation = rotation nightmare + security risk
- **D) Root user for CI/CD → ❌** → **Never use root credentials for automation** — absolute worst practice

---

## Q076–Q100 (Final Rapid Fire — Key Concepts)

---

## Q076
**What is the purpose of IAM Permission Boundaries?**

- **A)** Grant permissions to IAM users
- **B)** Set the maximum permissions an IAM entity can have, even if their identity policies grant more
- **C)** Replace IAM policies entirely
- **D)** Control cross-account access

**✅ B — Maximum permission ceiling for individual IAM entities. Does NOT grant permissions itself.**

မြန်မာ: Permission Boundary = IAM user/role ၏ maximum cap ဖြစ်ပြီး IAM policy allow ထားသော်လည်း boundary မပါပါက access မဖြစ်ပါ

---

## Q077
**A company uses ACM (AWS Certificate Manager) for TLS certificates on their ALB. The certificate is about to expire. What happens?**

- **A)** ALB stops working immediately when certificate expires
- **B)** ACM automatically renews public certificates issued by ACM before they expire
- **C)** The developer must manually renew and re-import the certificate
- **D)** AWS sends an email but takes no automatic action

**✅ B — ACM auto-renews public certificates it issues (DNS/email validation).**

မြန်မာ: ACM issued certificates = automatically renewed ဖြစ်ပြီး expiry alert + auto-renewal ဖြစ်သောကြောင့် manual renewal မလိုပါ

---

## Q078
**Which condition key should be used in S3 bucket policies to require that objects be uploaded only with AES-256 server-side encryption (SSE-S3)?**

- **A)** `s3:x-amz-server-side-encryption: aws:kms`
- **B)** `s3:x-amz-server-side-encryption: AES256`
- **C)** `aws:SecureTransport: true`
- **D)** `s3:x-amz-storage-class: STANDARD`

**✅ B — `s3:x-amz-server-side-encryption: AES256` for SSE-S3 (vs `aws:kms` for SSE-KMS)**

မြန်မာ: SSE-S3 = AES256 value, SSE-KMS = aws:kms value — မှတ်ထားရမည်

---

## Q079
**A Lambda function is being invoked by an S3 event. Which policy type grants S3 permission to invoke Lambda?**

- **A)** Lambda execution role (identity-based policy)
- **B)** Lambda resource-based policy (function policy)
- **C)** S3 bucket policy
- **D)** IAM user policy

**✅ B — Resource-based policy on Lambda function allows S3 service to invoke it.**

မြန်မာ: Lambda ကို invoke ဖြစ်ရသည့် permission = Lambda resource-based policy (function policy) ဖြင့် configure ဖြစ်ရမည်

---

## Q080
**AWS KMS automatically logs all cryptographic API calls. In which service are these logs stored?**

- **A)** Amazon CloudWatch Metrics
- **B)** AWS CloudTrail
- **C)** Amazon Macie
- **D)** AWS Config

**✅ B — KMS API calls (Encrypt, Decrypt, GenerateDataKey, etc.) = logged in CloudTrail**

မြန်မာ: KMS audit = CloudTrail Event History တွင် "who decrypted what, when" ကို စစ်ဆေးနိုင်

---

## Q081
**A company needs to provide S3 access to an application running on-premises (not EC2). They cannot use IAM roles. What is the MOST secure long-term option?**

- **A)** Use root user credentials
- **B)** Create an IAM user with S3 permissions, generate long-term access keys, implement regular key rotation (90 days), store in Secrets Manager
- **C)** Make S3 bucket public
- **D)** Use pre-signed URLs only

**✅ B — For on-premises workloads, IAM user with carefully managed access keys + rotation is necessary (not ideal but required when roles not available)**

မြန်မာ: On-premises = IAM role မသုံးနိုင်ဘဲ IAM user access keys သာ option ဖြစ်သောကြောင့် rotation + Secrets Manager သိမ်ဆည်းခြင်း best practice ဖြစ်သည်

---

## Q082
**What does `aws:PrincipalOrgID` condition key in a resource-based policy do?**

- **A)** Restricts access to a specific IAM user
- **B)** Restricts access to identities belonging to a specific AWS Organization ID
- **C)** Allows access from any AWS account
- **D)** Restricts access based on geographic region

**✅ B — Allows access only from identities that are members of the specified AWS Organization**

မြန်မာ: Organization ID ဖြင့် resource access ကို restrict ဖြစ်ပြုရသောကြောင့် cross-account access ကို Organization boundary ဖြင့် control နိုင်

---

## Q083
**Which service helps you meet compliance requirements by providing pre-built compliance checks and generating audit-ready reports?**

- **A)** Amazon GuardDuty
- **B)** AWS Security Hub with compliance standards (CIS, PCI-DSS, NIST)
- **C)** Amazon Inspector
- **D)** AWS Config Rules only

**✅ B — Security Hub includes CIS AWS Foundations, PCI-DSS, and AWS Foundational Security Best Practices standards**

မြန်မာ: Compliance report generation = Security Hub ၏ Compliance Standards feature

---

## Q084
**A company uses S3 for backups. They want to protect against accidental deletion while still being able to recover deleted files. Which combination should they enable?**

- **A)** S3 Object Lock Compliance mode only
- **B)** S3 Versioning + MFA Delete enabled on the bucket
- **C)** S3 Replication to another account only
- **D)** S3 Intelligent-Tiering with lifecycle rules

**✅ B — Versioning preserves deleted file versions; MFA Delete adds extra protection requiring MFA to permanently delete versions**

မြန်မာ: Accidental delete protection = Versioning (undo delete) + MFA Delete (extra confirmation for permanent delete)

---

## Q085
**Which AWS service can be used to prevent data exfiltration by controlling which AWS account can be the destination for S3 replication?**

- **A)** S3 bucket lifecycle rules
- **B)** AWS Organizations SCP with `aws:ResourceOrgID` condition restricting S3 replication destinations
- **C)** S3 Transfer Acceleration settings
- **D)** CloudFront origin restrictions

**✅ B — SCP with ResourceOrgID ensures S3 replication can only go to buckets within the same Organization**

မြန်မာ: Data exfiltration prevention = SCP ဖြင့် Organization boundary ကို enforce ဖြစ်ပြုပြီး external accounts ကို replication block ဖြစ်ပြုသည်

---

## Q086
**A company wants to automatically detect and alert when any IAM policy is created that allows full admin access (`*:*`). Which approach achieves this with minimal setup?**

- **A)** Review IAM policies manually weekly
- **B)** AWS Config Rule `iam-policy-blacklisted-check` + EventBridge + SNS notification
- **C)** AWS CloudTrail + Athena query daily
- **D)** GuardDuty IAM behavior analysis

**✅ B — Config managed rule checks for overly permissive policies; EventBridge routes finding to SNS for immediate notification**

မြန်မာ: Config Rule ဖြင့် IAM policy compliance စစ်ဆေးပြီး EventBridge + SNS ဖြင့် automatic alert ပေးသည်

---

## Q087
**A company has a VPC with private subnets. They want EC2 instances to call AWS Systems Manager Parameter Store without internet access. What is needed?**

- **A)** NAT Gateway
- **B)** VPC Interface Endpoint for `ssm` and `ssm-parameter-store`
- **C)** VPC Gateway Endpoint for Parameter Store
- **D)** Internet Gateway

**✅ B — Parameter Store uses SSM Interface Endpoints (not Gateway Endpoints)**

မြန်မာ: Parameter Store = SSM Interface Endpoint (`com.amazonaws.region.ssm`) ကိုသာ use ဖြစ်ရပြီး Gateway Endpoint ကို S3/DynamoDB ကိုသာ use ဖြစ်ရသည်

---

## Q088
**What is the `aws:CalledVia` condition key used for?**

- **A)** Check the caller's IP address
- **B)** Check which AWS service made the API call on behalf of a principal (service-to-service calls)
- **C)** Check the authentication method used
- **D)** Check if MFA was used

**✅ B — `aws:CalledVia` identifies which intermediate AWS service called the API (e.g., CloudFormation calling S3)**

မြန်မာ: Service-to-service API calls ကို identify ဖြစ်ပြုပြီး "CloudFormation ကသာ S3 create ဖြစ်ရသည်" ဆိုသော restrictions ကို implement နိုင်

---

## Q089
**A company uses SCP to deny `cloudtrail:DeleteTrail`. A member account administrator attempts to run `aws cloudtrail delete-trail`. What response do they receive?**

- **A)** The command succeeds because they have admin access
- **B)** `AccessDeniedException` — SCP Deny prevents the action
- **C)** The trail is deleted but a Config rule detects and re-creates it
- **D)** A confirmation prompt is shown requiring approval

**✅ B — SCP explicit Deny returns AccessDeniedException regardless of IAM permissions**

မြန်မာ: SCP Deny → `AccessDeniedException` — account admin ပင် SCP Deny ကို bypass မဖြစ်ပါ

---

## Q090
**A company needs to ensure their KMS key can only be used by their specific application's EC2 instances (identified by their IAM role). Which KMS key policy condition achieves this?**

- **A)** `"Principal": {"AWS": "arn:aws:iam::account:role/AppRole"}`
- **B)** `"Condition": {"StringEquals": {"kms:ViaService": "ec2.amazonaws.com"}}`
- **C)** `"Condition": {"ArnLike": {"aws:PrincipalArn": "arn:aws:iam::account:role/AppRole"}}`
- **D)** `"Principal": {"AWS": "arn:aws:iam::account:root"}`

**✅ Correct Answer: A or C (A is more direct)**

မြန်မာ: Key Policy ၌ specific IAM role ကိုသာ Principal ထားခြင်းဖြင့် ထို role ကိုသာ key use ဖြစ်ရနိုင်သောကြောင့် application-specific key access control ဖြစ်သည်

---

## Q091
**Which mechanism allows an S3 bucket in Account A to be accessed by an EC2 instance in Account B using the EC2 instance's role?**

- **A)** S3 bucket policy in Account A that allows Account B's EC2 instance role ARN
- **B)** VPC Peering between accounts
- **C)** Create IAM user in Account A and give to Account B
- **D)** Make bucket public in Account A

**✅ A — Cross-account S3 access via resource-based (bucket) policy referencing Account B's role ARN**

မြန်မာ: S3 Bucket Policy (Account A) → Account B role ARN allow → EC2 (Account B) assumes role → S3 access ဖြစ်သည်

---

## Q092
**A security engineer notices that a Lambda function has `sts:AssumeRole` permission to assume any role (`*`). What is the risk?**

- **A)** No risk — Lambda functions cannot assume roles
- **B)** The Lambda function can assume any role in the account (privilege escalation), potentially gaining admin access
- **C)** The function will be blocked by KMS
- **D)** The Lambda function will be automatically terminated

**✅ B — Wildcard AssumeRole = privilege escalation risk (Lambda can assume admin role)**

မြန်မာ: `sts:AssumeRole` on `*` = Lambda ကို high-privilege role assume ဖြစ်ပြုနိုင်သောကြောင့် privilege escalation vulnerability ဖြစ်သည်

---

## Q093
**What is the recommended approach for storing database connection strings in a containerized ECS application?**

- **A)** Hard-code in the Docker image
- **B)** Pass as environment variables in plaintext in task definition
- **C)** Reference AWS Secrets Manager secret ARN in the task definition; ECS injects the secret as an environment variable at task launch
- **D)** Store in S3 and download at container startup

**✅ C — ECS native Secrets Manager integration: secrets injected at runtime, not stored in image/task definition**

မြန်မာ: ECS + Secrets Manager = task definition တွင် secret ARN reference သာပါပြီး ECS agent ကသာ runtime inject ဖြစ်သောကြောင့် application code တွင် secrets မပါပါ

---

## Q094
**A company wants to audit ALL changes to IAM policies and roles in their account. Which service provides a comprehensive, tamper-evident log?**

- **A)** AWS Config
- **B)** Amazon GuardDuty
- **C)** AWS CloudTrail with log file integrity validation enabled
- **D)** Amazon Macie

**✅ C — CloudTrail logs all IAM API calls; log integrity validation detects any tampering**

မြန်မာ: IAM change audit = CloudTrail (who created/modified/deleted IAM policy). Log integrity validation = SHA-256 hash ဖြင့် tamper detect

---

## Q095
**A company uses AWS WAF. They want to block all traffic except from their known good IP addresses (whitelist). What should they create?**

- **A)** WAF rate-based rule
- **B)** WAF IP Set with known good IPs + rule that `BLOCK` everything NOT in the IP Set
- **C)** WAF managed rule group
- **D)** WAF regex pattern

**✅ B — IP Set (allow list) + default rule to BLOCK = whitelist approach**

မြန်မာ: Whitelist approach = Allow known IPs → Block all others. IP Set ဖြင့် allowed IPs define ပြီး default action = BLOCK

---

## Q096
**Which KMS API call is used when a service (like S3) needs to encrypt a large file using envelope encryption?**

- **A)** `kms:Encrypt`
- **B)** `kms:GenerateDataKey`
- **C)** `kms:Decrypt`
- **D)** `kms:CreateKey`

**✅ B — GenerateDataKey returns plaintext + encrypted data key; service uses plaintext key to encrypt data, stores encrypted key alongside data**

မြန်မာ: Envelope Encryption = KMS မှ data key generate → data key ဖြင့် data encrypt → data key ကို KMS CMK ဖြင့် encrypt → store alongside data

---

## Q097
**A company's root user has both a password and MFA enabled. An attacker obtains the root user password. Can they access the account?**

- **A)** Yes — password alone is sufficient for root access
- **B)** No — MFA requires a second factor (TOTP code) that the attacker doesn't have
- **C)** Yes — root user cannot have MFA enabled
- **D)** It depends on whether CloudTrail is enabled

**✅ B — MFA-protected root user requires both password AND MFA code (TOTP)**

မြန်မာ: MFA = password ကို steal ရသော်လည်း TOTP code မပါဘဲ login မဖြစ်ပါဘဲ root user protection ၏ critical importance ဖြစ်သည်

---

## Q098
**A company wants to grant time-limited S3 access to an external vendor without creating IAM users or sharing credentials. The vendor needs to download specific files for 24 hours. Which approach is BEST?**

- **A)** Create a temporary IAM user
- **B)** Generate S3 pre-signed URLs with 24-hour expiration for specific objects
- **C)** Make the S3 bucket public for 24 hours
- **D)** Share the account access keys temporarily

**✅ B — Pre-signed URLs: time-limited access to specific objects without IAM user or credential sharing**

မြန်မာ: Pre-signed URL = specific object + specific expiry time → external user ကို credential မပေးဘဲ access ဖြစ်ပြုနိုင်

---

## Q099
**What is a "confused deputy" attack in the context of AWS cross-service access?**

- **A)** An IAM user impersonating a root user
- **B)** A situation where a service (acting as a "deputy") is tricked into performing actions on behalf of an unauthorized principal by using its elevated permissions
- **C)** An attacker bypassing MFA
- **D)** A DDoS attack on AWS services

**✅ B — Confused Deputy: Service A (trusted) is manipulated to perform actions using its permissions on behalf of malicious Actor B**

မြန်မာ: Confused Deputy = Service A ကို manipulate ပြုလုပ်ပြီး ၎င်း service ၏ permissions ကို abuse ဖြစ်ပြုသောကြောင့် `aws:SourceArn`, `aws:SourceAccount` conditions ဖြင့် mitigate ဖြစ်ရသည်

---

## Q100
**A company is designing a security strategy. They want to detect, alert, and automatically remediate security violations. Which THREE services work together for this complete security automation pipeline?**

- **A)** Route 53 + CloudFront + S3
- **B)** Amazon GuardDuty (detect) + Amazon EventBridge (alert/route) + AWS Lambda or SSM Automation (remediate)
- **C)** AWS Config (detect) + CloudTrail (alert) + EC2 (remediate)
- **D)** AWS Shield + WAF + ACM

**✅ B — GuardDuty→EventBridge→Lambda/SSM = complete automated security response pipeline**

မြန်မာ: Security Automation Pattern:
- **Detect**: GuardDuty (threats), Config (compliance), Macie (data)
- **Route**: EventBridge (event-driven)
- **Remediate**: Lambda (custom) or SSM Automation (pre-built)

---

> ## 🎯 Set 01 Complete! — Security & IAM (Q001–Q100)
>
> **Domain 1: Design Secure Architectures (30%) ✅**
>
> ---
> ### Score Tracker
> - Q001–Q050 (Detail): ___/50
> - Q051–Q100 (Rapid Fire): ___/50
> - **Total: ___/100**
>
> ---
> ### Weak Area Review Guide
> | Score Range | Action |
> |------------|--------|
> | 80-100 | Move to Set 02 |
> | 60-79 | Review missed questions + Phase 02 IAM module |
> | Below 60 | Re-read Phase 02 + Phase 03 VPC module first |
>
> ➡️ **Next:** [Exam Set 02 — Networking & VPC (Q101-Q200)](./Exam_Set_02_Networking_VPC.md)
