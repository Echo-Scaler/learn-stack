---
title: "Networking & Cloud Automation Roadmap & Master Guide (မြန်မာဘာသာ)"
description: "Computer Networking, Linux Operations, AWS VPC Architecture, Cloud Automation (Terraform & Ansible), CI/CD, IAM Security, Observability နှင့် Production Projects လမ်းညွှန်"
---

## 🌐 Networking & Cloud Automation Master Blueprint
### Enterprise Computer Networks, Linux Engineering & Cloud Infrastructure as Code (IaC)
**Target Audience:** Beginner to Senior DevOps / Cloud Platform Engineer & Infrastructure Architect  
**Language:** မြန်မာဘာသာ (Burmese) ဖြင့် အသေးစိတ်ရှင်းလင်းချက် + Official Industry Standards & English Technical Terminology

---

## 📑 မာတိကာ (Table of Contents)

- [၀။ ကာလအပိုင်းအခြားနှင့် သင်ယူမှု အဆင့်များ (Career Skill Matrix & Learning Order)](#၀-ကာလအပိုင်းအခြားနှင့်-သင်ယူမှု-အဆင့်များ-career-skill-matrix--learning-order)
- [၁။ ကွန်ရက်အခြေခံသဘောတရားများနှင့် Protocol များ (Core Networking & Protocols)](#၁-ကွန်ရက်အခြေခံသဘောတရားများနှင့်-protocol-များ-core-networking--protocols)
  - [၁.၁ Network ဆိုတာဘာလဲ & Client–Server Architecture](#၁၁-network-ဆိုတာဘာလဲ--clientserver-architecture)
  - [၁.၂ LAN, WAN နှင့် Internet](#၁၂-lan-wan-နှင့်-internet)
  - [၁.၃ OSI Model (7 Layers) vs TCP/IP Model](#၁၃-osi-model-7-layers-vs-tcpip-model)
  - [၁.၄ IP Address — IPv4, IPv6 & Public IP vs Private IP](#၁၄-ip-address--ipv4-ipv6--public-ip-vs-private-ip)
  - [၁.၅ Static IP vs Dynamic IP, MAC Address & Subnet Mask](#၁၅-static-ip-vs-dynamic-ip-mac-address--subnet-mask)
  - [၁.၆ CIDR Notation (/24, /16, /32) & Subnetting/IP Range Calculation](#၁၆-cidr-notation-24-16-32--subnettingip-range-calculation)
  - [၁.၇ Default Gateway, Routing & Route Tables](#၁၇-default-gateway-routing--route-tables)
  - [၁.၈ NAT (Network Address Translation)](#၁၈-nat-network-address-translation)
  - [၁.၉ TCP vs UDP, Ports & Protocols](#၁၉-tcp-vs-udp-ports--protocols)
  - [၁.၁၀ Bandwidth, Latency & Packet Loss](#၁၁၀-bandwidth-latency--packet-loss)
  - [၁.၁၁ Firewall Fundamentals & Security Filtering](#၁၁၁-firewall-fundamentals--security-filtering)
  - [၁.၁၂ DNS (Domain Name System) Deep Dive](#၁၁၂-dns-domain-name-system-deep-dive)
  - [၁.၁၃ HTTP vs HTTPS & TLS/SSL Certificates](#၁၁၃-http-vs-https--tlsssl-certificates)
  - [၁.၁၄ SSH — Secure Remote Login, FTP vs SFTP](#၁၁၄-ssh--secure-remote-login-ftp-vs-sftp)
  - [၁.၁၅ DHCP (DORA Process), ICMP & Ping, ARP](#၁၁၅-dhcp-dora-process-icmp--ping-arp)
  - [၁.၁၆ SMTP, IMAP, POP3 & WebSocket Networking](#၁၁၆-smtp-imap-pop3--websocket-networking)
  - [၁.၁၇ VPN — Virtual Private Network](#၁၁၇-vpn--virtual-private-network)
  - [၁.၁၈ Proxy vs Reverse Proxy & Load Balancing](#၁၁၈-proxy-vs-reverse-proxy--load-balancing)
  - [၁.၁၉ Connection Timeout, Retry, CORS Basics & REST API Networking](#၁၁၉-connection-timeout-retry-cors-basics--rest-api-networking)
  - [၁.၂၀ မဖြစ်မနေသိထားရမည့် Production Ports & Services Reference Table](#၁၂၀-မဖြစ်မနေသိထားရမည့်-production-ports--services-reference-table)
- [၂။ Linux Network Administration & Troubleshooting Commands](#၂-linux-network-administration--troubleshooting-commands)
  - [၂.၁ Linux Network Interface & Configuration](#၂၁-linux-network-interface--configuration)
  - [၂.၂ ip addr, ip route, ping & curl](#၂၂-ip-addr-ip-route-ping--curl)
  - [၂.၃ ss -tulpn, dig / nslookup, traceroute / tracepath](#၂၃-ss--tulpn-dig--nslookup-traceroute--tracepath)
  - [၂.၄ ssh, scp / rsync & sudo / Linux Permissions](#၂၄-ssh-scp--rsync--sudo--linux-permissions)
  - [၂.၅ systemctl, journalctl, iptables / nftables Basics & tcpdump](#၂၅-systemctl-journalctl-iptables--nftables-basics--tcpdump)
  - [၂.၆ Firewall Troubleshooting Runbook](#၂၆-firewall-troubleshooting-runbook)
- [၃။ AWS Cloud Networking & VPC Architecture (Deploying Applications)](#၃-aws-cloud-networking--vpc-architecture-deploying-applications)
  - [၃.၁ VPC, CIDR Blocks & Availability Zones](#၃၁-vpc-cidr-blocks--availability-zones)
  - [၃.၂ Public Subnet vs Private Subnet](#၃၂-public-subnet-vs-private-subnet)
  - [၃.၃ Internet Gateway (IGW) vs NAT Gateway](#၃၃-internet-gateway-igw-vs-nat-gateway)
  - [၃.၄ Route Tables & Elastic IP](#၃၄-route-tables--elastic-ip)
  - [၃.၅ အထူးနားလည်ရမည့်အချက်: Security Group (Stateful) vs NACL (Stateless)](#၃၅-အထူးနားလည်ရမည့်အချက်-security-group-stateful-vs-nacl-stateless)
  - [၃.၆ VPC Endpoints (Gateway vs Interface), VPC Peering & AWS Transit Gateway](#၃၆-vpc-endpoints-gateway-vs-interface-vpc-peering--aws-transit-gateway)
  - [၃.၇ Route 53, ALB vs NLB, CloudFront (CDN) & ACM](#၃၇-route-53-alb-vs-nlb-cloudfront-cdn--acm)
  - [၃.၈ AWS WAF Basics, VPC Flow Logs, Site-to-Site VPN & Direct Connect](#၃၈-aws-waf-basics-vpc-flow-logs-site-to-site-vpn--direct-connect)
- [၄။ Cloud Systems Architecture & Design Patterns](#၄-cloud-systems-architecture--design-patterns)
  - [၄.၁ IaaS, PaaS, SaaS & Shared Responsibility Model](#၄၁-iaas-paas-saas--shared-responsibility-model)
  - [၄.၂ Region vs Availability Zone, High Availability (HA) & Fault Tolerance](#၄၂-region-vs-availability-zone-high-availability-ha--fault-tolerance)
  - [၄.၃ Scalability vs Elasticity (Vertical vs Horizontal Scaling)](#၄၃-scalability-vs-elasticity-vertical-vs-horizontal-scaling)
  - [၄.၄ Single-Server Architecture vs Multi-Tier Architecture](#၄၄-single-server-architecture-vs-multi-tier-architecture)
  - [၄.၅ Web, Application & Database Layers](#၄၅-web-application--database-layers)
  - [၄.၆ Reverse Proxy & Load Balancer Architectures](#၄၆-reverse-proxy--load-balancer-architectures)
  - [၄.၇ Stateless vs Stateful Applications & Multi-AZ Deployment](#၄၇-stateless-vs-stateful-applications--multi-az-deployment)
  - [၄.၈ Disaster Recovery (DR), Backup & Restore, RTO / RPO](#၄၈-disaster-recovery-dr-backup--restore-rto--rpo)
  - [၄.၉ AWS Well-Architected Framework Basics](#၄၉-aws-well-architected-framework-basics)
- [၅။ Cloud Automation with Infrastructure as Code (IaC)](#၅-cloud-automation-with-infrastructure-as-code-iac)
  - [၅.၁ IaC Concepts, Manual vs Automated & Declarative vs Imperative](#၅၁-iac-concepts-manual-vs-automated--declarative-vs-imperative)
  - [၅.၂ YAML / JSON, Git & AWS CLI](#၅၂-yaml--json-git--aws-cli)
  - [၅.၃ AWS CloudFormation vs Terraform](#၅၃-aws-cloudformation-vs-terraform)
  - [၅.၄ Terraform Fundamentals (Providers, Resources, Data Sources, Variables, Outputs)](#၅၄-terraform-fundamentals-providers-resources-data-sources-variables-outputs)
  - [၅.၅ State File, Remote State & Modules](#၅၅-state-file-remote-state--modules)
  - [၅.၆ Terraform CLI: init, plan, apply, destroy](#၅၆-terraform-cli-init-plan-apply-destroy)
  - [၅.၇ CloudFormation Templates, Parameters, Outputs, Stack Updates & Rollbacks](#၅၇-cloudformation-templates-parameters-outputs-stack-updates--rollbacks)
  - [၅.၈ Drift Detection, Idempotency, Secrets & Reusable Environments](#၅၈-drift-detection-idempotency-secrets--reusable-environments)
- [၆။ Configuration Management & Server Automation](#၆-configuration-management--server-automation)
  - [၆.၁ Bash Scripting, Linux Shell Commands, Env Vars & Cron Jobs](#၆၁-bash-scripting-linux-shell-commands-env-vars--cron-jobs)
  - [၆.၂ Ansible Fundamentals (Inventory, Hosts, Playbooks, Tasks, Handlers, Templates)](#၆၂-ansible-fundamentals-inventory-hosts-playbooks-tasks-handlers-templates)
  - [၆.၃ SSH Key Authentication & Configuration Automation](#၆၃-ssh-key-authentication--configuration-automation)
  - [၆.၄ AWS Systems Manager (SSM) — Session Manager, Run Command, Patch Manager & Parameter Store](#၆၄-aws-systems-manager-ssm--session-manager-run-command-patch-manager--parameter-store)
- [၇။ CI/CD & Cloud Deployment Pipelines](#၇-cicd--cloud-deployment-pipelines)
  - [၇.၁ Git Branching, Pull Requests & CI vs CD](#၇၁-git-branching-pull-requests--ci-vs-cd)
  - [၇.၂ Build Automation, Automated Tests, Artifact Management & Docker ECR](#၇၂-build-automation-automated-tests-artifact-management--docker-ecr)
  - [၇.၃ Amazon ECS / Fargate Basics, GitHub Actions & AWS CodePipeline / CodeBuild](#၇၃-amazon-ecs--fargate-basics-github-actions--aws-codepipeline--codebuild)
  - [၇.၄ Deployment Environments, Environment Configuration & DB Migrations](#၇၄-deployment-environments-environment-configuration--db-migrations)
  - [၇.၅ Deployment Strategies: Rolling, Blue/Green, Rollback, Health Checks & Secrets](#၇၅-deployment-strategies-rolling-bluegreen-rollback-health-checks--secrets)
- [၈။ Cloud Security, IAM & Governance](#၈-cloud-security-iam--governance)
  - [၈.၁ IAM Users, Groups, Roles, Policies & Least Privilege](#၈၁-iam-users-groups-roles-policies--least-privilege)
  - [၈.၂ EC2 Instance Profiles, Temporary Credentials (STS) & MFA](#၈၂-ec2-instance-profiles-temporary-credentials-sts--mfa)
  - [၈.၃ AWS Secrets Manager, KMS, Encryption at Rest & in Transit](#၈၃-aws-secrets-manager-kms-encryption-at-rest--in-transit)
  - [၈.၄ Audit Logs (CloudTrail), AWS Config, Security Hub, WAF & Hardcoding Prevention](#၈၄-audit-logs-cloudtrail-aws-config-security-hub-waf--hardcoding-prevention)
- [၉။ Production Monitoring, Observability & Incident Response](#၉-production-monitoring-observability--incident-response)
  - [၉.၁ CloudWatch (Logs, Metrics, Alarms, SNS) & Health Checks](#၉၁-cloudwatch-logs-metrics-alarms-sns--health-checks)
  - [၉.၂ VPC Flow Logs, Log Retention & Automated Alerting](#၉၂-vpc-flow-logs-log-retention--automated-alerting)
  - [၉.၃ Auto Scaling, Automated Backup, EventBridge & Lambda Automation](#၉၃-auto-scaling-automated-backup-eventbridge--lambda-automation)
  - [၉.၄ Incident Response Procedures & Disaster Recovery Testing](#၉၄-incident-response-procedures--disaster-recovery-testing)
- [၁၀။ Cloud Cost Optimization (FinOps)](#၁၀-cloud-cost-optimization-finops)
  - [၁၀.၁ AWS Pricing Models, Savings Plans, Instance Types & S3 Classes](#၁၀၁-aws-pricing-models-savings-plans-instance-types--s3-classes)
  - [၁၀.၂ NAT Gateway Costs, Data Transfer, Budgets & Cost Explorer](#၁၀၂-nat-gateway-costs-data-transfer-budgets--cost-explorer)
  - [၁၀.၃ Cost Allocation Tags, Idle Resource Cleanup & Nightly Shutdown](#၁၀၃-cost-allocation-tags-idle-resource-cleanup--nightly-shutdown)
- [၁၁။ လက်တွေ့ Production Projects (Hands-on Projects)](#၁၁-လက်တွေ့-production-projects-hands-on-projects)
  - [Project 1 — AWS Production Network Setup](#project-1--aws-production-network-setup)
  - [Project 2 — Web Application Deployment](#project-2--web-application-deployment)
  - [Project 3 — Infrastructure Automation (IaC)](#project-3--infrastructure-automation-iac)
  - [Project 4 — CI/CD Automation Pipeline](#project-4--cicd-automation-pipeline)
- [📂 အခန်းအလိုက် သီးသန့် သင်ခန်းစာဖိုင်တွဲများ (Dedicated Module Directories)](#-အခန်းအလိုက်-သီးသန့်-သင်ခန်းစာဖိုင်တွဲများ-dedicated-module-directories)

---

## 📂 အခန်းအလိုက် သီးသန့် သင်ခန်းစာဖိုင်တွဲများ (Dedicated Module Directories)

| Module / Folder | သင်ခန်းစာ ခေါင်းစဉ် (Lessons) | သီးသန့် ဖတ်ရှုရန် Link |
| :--- | :--- | :--- |
| **01. Core Networking & Protocols** | 01. Network Fundamentals & Client-Server | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/01_network_fundamentals_and_architecture/) |
| | 02. OSI 7 Layers vs TCP/IP Models | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/02_osi_and_tcp_ip_models/) |
| | 03. IP Addressing, Subnet Mask & CIDR | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/03_ip_addressing_cidr_and_subnetting/) |
| | 04. Routing, Default Gateway & NAT | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/04_routing_default_gateway_and_nat/) |
| | 05. TCP vs UDP & Production Ports Table | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/05_tcp_udp_and_common_ports/) |
| | 06. DNS, HTTP vs HTTPS & TLS/SSL | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/06_dns_http_https_and_tls/) |
| | 07. SSH, SFTP, DHCP, ICMP, WebSocket | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/07_network_services_and_utilities/) |
| | 08. VPN, Proxies, Load Balancing, CORS | [ဖတ်ရှုရန်](/networking/01_core_networking_and_protocols/08_vpn_proxies_and_api_networking/) |
| **02. Linux Network & Sysadmin** | 01. Network Interfaces, ip addr & ip route | [ဖတ်ရှုရန်](/networking/02_linux_network_and_sysadmin/01_linux_network_interfaces_and_ip_commands/) |
| | 02. ping, curl, ss -tulpn, dig, traceroute | [ဖတ်ရှုရန်](/networking/02_linux_network_and_sysadmin/02_diagnostics_and_connectivity_tools/) |
| | 03. SSH Remote Login, scp, rsync, sudo | [ဖတ်ရှုရန်](/networking/02_linux_network_and_sysadmin/03_remote_access_and_permissions/) |
| | 04. systemctl, journalctl, iptables, tcpdump | [ဖတ်ရှုရန်](/networking/02_linux_network_and_sysadmin/04_services_logs_and_packet_analysis/) |
| | 05. Firewall Troubleshooting Runbook | [ဖတ်ရှုရန်](/networking/02_linux_network_and_sysadmin/05_firewall_troubleshooting_runbook/) |
| **03. AWS Cloud Networking & VPC** | 01. VPC, CIDR Blocks & Availability Zones | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/01_vpc_subnets_and_availability_zones/) |
| | 02. Gateways (IGW, NAT GW), Route Tables | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/02_gateways_and_routing/) |
| | 03. Security Groups vs NACLs Deep Dive | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/03_security_groups_vs_nacls/) |
| | 04. VPC Endpoints, Peering, Transit Gateway | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/04_vpc_endpoints_peering_and_transit_gateway/) |
| | 05. Route 53, ALB, NLB, CloudFront, ACM | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/05_route53_alb_nlb_cloudfront_and_acm/) |
| | 06. AWS WAF, VPC Flow Logs, VPN, Direct Connect | [ဖတ်ရှုရန်](/networking/03_aws_cloud_networking_and_vpc/06_security_monitoring_and_hybrid_connectivity/) |
| **04. Cloud Architecture & Design** | 01. Service Models (IaaS/PaaS/SaaS) & Shared Resp | [ဖတ်ရှုရန်](/networking/04_cloud_architecture_and_system_design/01_cloud_service_models_and_shared_responsibility/) |
| | 02. High Availability, Fault Tolerance & Scaling | [ဖတ်ရှုရန်](/networking/04_cloud_architecture_and_system_design/02_high_availability_and_scalability/) |
| | 03. Multi-Tier Architecture & Reverse Proxy | [ဖတ်ရှုရန်](/networking/04_cloud_architecture_and_system_design/03_tier_architecture_and_load_balancing/) |
| | 04. Stateless vs Stateful & Multi-AZ Deploy | [ဖတ်ရှုရန်](/networking/04_cloud_architecture_and_system_design/04_stateless_vs_stateful_and_multi_az/) |
| | 05. Disaster Recovery (DR, RPO/RTO), Well-Architected | [ဖတ်ရှုရန်](/networking/04_cloud_architecture_and_system_design/05_disaster_recovery_and_well_architected/) |
| **05. Cloud Automation (IaC Terraform)** | 01. IaC Concepts, Declarative vs Imperative | [ဖတ်ရှုရန်](/networking/05_cloud_automation_iac_terraform/01_iac_concepts_and_configuration/) |
| | 02. CloudFormation vs Terraform Fundamentals | [ဖတ်ရှုရန်](/networking/05_cloud_automation_iac_terraform/02_cloudformation_vs_terraform/) |
| | 03. Terraform State, Remote S3 & Modules | [ဖတ်ရှုရန်](/networking/05_cloud_automation_iac_terraform/03_terraform_state_and_modules/) |
| | 04. CloudFormation Templates & Stack Rollbacks | [ဖတ်ရှုရန်](/networking/05_cloud_automation_iac_terraform/04_cloudformation_templates_and_stacks/) |
| | 05. Drift Detection, Idempotency & Security | [ဖတ်ရှုရန်](/networking/05_cloud_automation_iac_terraform/05_drift_detection_idempotency_and_security/) |
| **06. Configuration Management** | 01. Bash Scripting & Cron Automation | [ဖတ်ရှုရန်](/networking/06_configuration_management_and_ansible/01_bash_scripting_and_cron_jobs/) |
| | 02. Ansible Fundamentals & Playbooks | [ဖတ်ရှုရန်](/networking/06_configuration_management_and_ansible/02_ansible_fundamentals_and_playbooks/) |
| | 03. Server Automation & Configuration Drift | [ဖတ်ရှုရန်](/networking/06_configuration_management_and_ansible/03_server_automation_and_configuration_drift/) |
| | 04. AWS Systems Manager (SSM Session Manager) | [ဖတ်ရှုရန်](/networking/06_configuration_management_and_ansible/04_aws_systems_manager_ssm/) |
| **07. CI/CD & Deployment Pipelines** | 01. Git Branching & CI/CD Fundamentals | [ဖတ်ရှုရန်](/networking/07_cicd_and_cloud_deployment_pipelines/01_git_workflows_and_ci_cd_concepts/) |
| | 02. Docker Image, Amazon ECR & ECS Fargate | [ဖတ်ရှုရန်](/networking/07_cicd_and_cloud_deployment_pipelines/02_docker_ecr_and_ecs_fargate/) |
| | 03. GitHub Actions & AWS CodePipeline | [ဖတ်ရှုရန်](/networking/07_cicd_and_cloud_deployment_pipelines/03_github_actions_and_aws_code_suite/) |
| | 04. Rolling, Blue/Green & Automated Rollback | [ဖတ်ရှုရန်](/networking/07_cicd_and_cloud_deployment_pipelines/04_deployment_strategies_and_rollbacks/) |
| **08. Cloud Security & IAM** | 01. IAM Users, Roles & Least Privilege Principle | [ဖတ်ရှုရန်](/networking/08_cloud_security_iam_and_governance/01_iam_core_and_least_privilege/) |
| | 02. Secrets Manager, KMS & Encryption | [ဖတ်ရှုရန်](/networking/08_cloud_security_iam_and_governance/02_secrets_kms_and_encryption/) |
| | 03. CloudTrail Auditing, AWS Config & WAF | [ဖတ်ရှုရန်](/networking/08_cloud_security_iam_and_governance/03_governance_auditing_and_waf/) |
| **09. Monitoring & Observability** | 01. CloudWatch Metrics, Logs & Health Checks | [ဖတ်ရှုရန်](/networking/09_monitoring_observability_and_incident_response/01_cloudwatch_and_health_checks/) |
| | 02. Automated Alerting, Retention & Auto Scaling | [ဖတ်ရှုရန်](/networking/09_monitoring_observability_and_incident_response/02_alerting_and_auto_scaling/) |
| | 03. Lambda Automation & Incident Runbook | [ဖတ်ရှုရန်](/networking/09_monitoring_observability_and_incident_response/03_automation_and_incident_response/) |
| **10. Cloud Cost Optimization** | 01. Pricing Models, Savings Plans & S3 Tiers | [ဖတ်ရှုရန်](/networking/10_cloud_cost_optimization_finops/01_aws_pricing_and_instance_types/) |
| | 02. NAT Costs, Data Transfer & AWS Budgets | [ဖတ်ရှုရန်](/networking/10_cloud_cost_optimization_finops/02_nat_costs_and_cost_explorer/) |
| | 03. Cost Allocation Tags & Idle Cleanup | [ဖတ်ရှုရန်](/networking/10_cloud_cost_optimization_finops/03_governance_and_resource_cleanup/) |
| **11. Hands-on Projects** | 01. Project 1: AWS Production Network Setup | [ဖတ်ရှုရန်](/networking/11_hands_on_production_projects/01_project1_aws_network_setup/) |
| | 02. Project 2: Web Application Deployment | [ဖတ်ရှုရန်](/networking/11_hands_on_production_projects/02_project2_web_application_deployment/) |
| | 03. Project 3: Infrastructure Automation (IaC) | [ဖတ်ရှုရန်](/networking/11_hands_on_production_projects/03_project3_infrastructure_automation/) |
| | 04. Project 4: End-to-End CI/CD Automation | [ဖတ်ရှုရန်](/networking/11_hands_on_production_projects/04_project4_cicd_automation/) |
| **12. Career Skill Matrix** | 01. Career Level Matrix & Skill Roadmap | [ဖတ်ရှုရန်](/networking/12_career_level_and_learning_matrix/01_level_matrix_and_study_guide/) |

---

## ၀။ ကာလအပိုင်းအခြားနှင့် သင်ယူမှု အဆင့်များ (Career Skill Matrix & Learning Order)

Cloud Engineer, DevOps Specialist သို့မဟုတ် Site Reliability Engineer (SRE) အဖြစ် လုပ်ငန်းခွင်ဝင်ရောက်ရန် အောက်ပါ ဦးစားပေး အဆင့် ၅ ဆင့်အတိုင်း လေ့လာသင့်သည်:

| Level | အဆင့်အမည် | အရင်ဆုံး လေ့လာရမည့်အရာ (Curriculum Priority) | ရည်မှန်းချက်နှင့် လုပ်ငန်းခွင်အခန်းကဏ္ဍ |
| :--- | :--- | :--- | :--- |
| **Level 1** | **Beginner** | **Networking Basics, Linux, IP Addressing, DNS, Ports, SSH** | Basic Networking နှင့် Linux Commands များကို ကျွမ်းကျင်စွာ ကိုင်တွယ်နိုင်ခြင်း |
| **Level 2** | **Junior** | **VPC, EC2, IAM, Security Groups, S3, RDS** | AWS Cloud Core Services များပေါ်တွင် 3-Tier Web System တည်ဆောက်နိုင်ခြင်း |
| **Level 3** | **Intermediate** | **Terraform / CloudFormation, Docker, CI/CD** | Infrastructure as Code (IaC) ဖြင့် အလိုအလျောက် တည်ဆောက်ပြီး Pipeline ဖြင့် Deploy လုပ်နိုင်ခြင်း |
| **Level 4** | **Advanced** | **Multi-AZ, Auto Scaling, Security Automation, DR** | High Availability, Zero Downtime နှင့် Enterprise Disaster Recovery ကို ရေးဆွဲနိုင်ခြင်း |
| **Level 5** | **Production** | **Monitoring, Incident Response, Cost Optimization (FinOps)** | Production Observability, Alerting, Security Compliance နှင့် Cloud ကုန်ကျစရိတ် ချွေတာနိုင်ခြင်း |

---

## ၁။ ကွန်ရက်အခြေခံသဘောတရားများနှင့် Protocol များ (Core Networking & Protocols)

### ၁.၁ Network ဆိုတာဘာလဲ & Client–Server Architecture

#### Network (ကွန်ရက်) ဆိုတာဘာလဲ?
**Computer Network** ဆိုသည်မှာ Devices များ (Servers, Workstations, Laptops, Mobile Devices, Routers) အချင်းချင်း ဝါယာကြိုး (Ethernet, Fiber Optic) သို့မဟုတ် ကြိုးမဲ့ (Wi-Fi, Cellular) နည်းပညာများဖြင့် ဆက်သွယ်ကာ **ဒေတာ (Data)** နှင့် **အရင်းအမြစ် (Resources)** များကို မျှဝေသုံးစွဲနိုင်ရန် ချိတ်ဆက်ထားသော စနစ်ဖြစ်သည်။

#### Client–Server Architecture (ကလိုင်းရန့်-ဆာဗာ ဖွဲ့စည်းပုံ)
Web Application အများစုသည် Client-Server ပုံစံဖြင့် အလုပ်လုပ်သည်:
- **Client (ကလိုင်းရန့်):** ဝန်ဆောင်မှု သို့မဟုတ် ဒေတာကို တောင်းဆိုသူ (Request ပြုလုပ်သူ) ဖြစ်သည်။ ဥပမာ - Browser (Chrome, Safari), Mobile App, Postman, `curl` CLI။
- **Server (ဆာဗာ):** Client ၏ တောင်းဆိုချက်ကို လက်ခံစစ်ဆေးပြီး ဝန်ဆောင်မှု သို့မဟုတ် ဒေတာ ပြန်လည်ပေးပို့သူ (Response ပေးသူ) ဖြစ်သည်။ ဥပမာ - Nginx, Apache, Node.js API, Spring Boot, PHP-FPM, MySQL Database။

```
+--------------------+                               +--------------------+
|  Client (Browser)  |  --- 1. HTTP Request (GET) --> |   Server (Nginx)   |
|  IP: 203.0.113.15  |  <-- 2. HTTP Response (200) -- |   IP: 198.51.100.4 |
+--------------------+                               +--------------------+
```

---

### ၁.၂ LAN, WAN နှင့် Internet

| အမျိုးအစား | အရှည်ကောက် | နယ်ပယ်အတိုင်းအတာ | ဥပမာ | အမြန်နှုန်း & Latency |
| :--- | :--- | :--- | :--- | :--- |
| **LAN** | Local Area Network | အဆောက်အအုံတစ်ခု၊ ရုံးခန်းတစ်ခု သို့မဟုတ် အိမ်တွင်း | Wi-Fi Router နှင့် ချိတ်ထားသော ကွန်ပျူတာများ၊ ရုံးတွင်း Switch | အလွန်မြန်သည် (1Gbps - 10Gbps, Latency < 1ms) |
| **WAN** | Wide Area Network | မြို့ကြီးများ၊ နိုင်ငံများ သို့မဟုတ် တိုက်ကြီးများကို ဖြတ်ကျော်ဆက်သွယ်ထားသော ကွန်ရက် | AWS Data Centers ကြား ချိတ်ဆက်ထားသော Fiber Backbone, ကုမ္ပဏီခွဲရုံးများ ချိတ်ဆက်ထားသော စနစ် | အကွာအဝေးကြောင့် Latency ရှိသည် (10ms - 200ms) |
| **Internet** | Inter-Network of Networks | တစ်ကမ္ဘာလုံးရှိ LAN နှင့် WAN များ အားလုံးကို TCP/IP ဖြင့် ချိတ်ဆက်ထားသည့် ကမ္ဘာ့ကွန်ရက်ကြီး | World Wide Web (WWW), Google, Cloud Platforms | ကမ္ဘာတစ်ဝှမ်း ချိတ်ဆက်မှု |

---

### ၁.၃ OSI Model (7 Layers) vs TCP/IP Model

ကွဲပြားသော Hardware နှင့် Software များ အချင်းချင်း ဒေတာဖလှယ်နိုင်ရန် နိုင်ငံတကာ စံနှုန်းများ သတ်မှတ်ထားသည်:

```
    OSI 7 LAYERS                             TCP/IP MODEL                 PDU (Protocol Data Unit)
+-----------------------+               +-----------------------+    
| 7. Application Layer  | ---\          |                       |    
| 6. Presentation Layer | ----+-------> |   Application Layer   |    Data / Payload
| 5. Session Layer      | ---/          | (HTTP, DNS, SSH, SSL) |    (Message Data)
+-----------------------+               +-----------------------+    
| 4. Transport Layer    | ------------> |    Transport Layer    |    Segments (TCP) / Datagrams (UDP)
| (TCP, UDP, Ports)     |               |       (TCP, UDP)      |    (Port Numbers)
+-----------------------+               +-----------------------+    
| 3. Network Layer      | ------------> |     Internet Layer    |    Packets
| (IP, ICMP, Routing)   |               |     (IPv4, IPv6)      |    (Source & Dest IP)
+-----------------------+               +-----------------------+    
| 2. Data Link Layer    | ---\          |                       |    Frames
| (MAC Address, Switch) | ----+-------> |  Network Access Layer |    (Source & Dest MAC)
| 1. Physical Layer     | ---/          |   (Ethernet, Wi-Fi)   |    Bits (01010101)
+-----------------------+               +-----------------------+    
```

#### Data Encapsulation & Decapsulation (ဒေတာထုပ်ပိုးမှုနှင့် ဖြည်ထုတ်မှု)
- **Sender ဘက်တွင် (Encapsulation):** Application Data တွင် Port Header (Layer 4) ကပ်သည် -> IP Header (Layer 3) ကပ်သည် -> MAC Header (Layer 2) ကပ်သည် -> လျှပ်စစ်လှိုင်း/အလင်းလှိုင်း Bits အဖြစ် ပို့သည်။
- **Receiver ဘက်တွင် (Decapsulation):** Bits -> Frame -> Packet -> Segment -> မူရင်း Application Data အဖြစ် အဆင့်ဆင့် ပြန်လည်ဖြည်ထုတ်သည်။

---

### ၁.၄ IP Address — IPv4, IPv6 & Public IP vs Private IP

#### IPv4 vs IPv6
- **IPv4 (Internet Protocol Version 4):** 32-bit Address ဖြစ်ပြီး အစက် ၃ စက်ဖြင့် ပိုင်းထားသော Octet ၄ ခု ပါဝင်သည် (ဥပမာ - `192.168.1.1`)။ IP အရေအတွက် စုစုပေါင်း ၄.၃ ဘီလီယံ (~$2^{32}$) သာရှိသဖြင့် ယခုအခါ ကုန်ခမ်းလုနီးပါး ဖြစ်နေသည်။
- **IPv6 (Internet Protocol Version 6):** 128-bit Address ဖြစ်ပြီး Hexadecimal ဂဏန်း ၈ တွဲဖြင့် ရေးသားသည် (ဥပမာ - `2001:0db8:85a3:0000:0000:8a2e:0370:7334`)။ မကုန်ခမ်းနိုင်သော IP အရေအတွက် (~$3.4 \times 10^{38}$) ပေးစွမ်းနိုင်သည်။

#### Public IP vs Private IP (RFC 1918)
- **Public IP:** Internet ပေါ်တွင် တစ်ကမ္ဘာလုံးဆိုင်ရာ သီးသန့်ဖြစ်ပြီး (Globally Unique)၊ ကမ္ဘာ့မည်သည့်နေရာမှမဆို တိုက်ရိုက်ဆက်သွယ်နိုင်သည်။ ISP သို့မဟုတ် Cloud Provider များထံမှ ငှားရမ်းရသည်။
- **Private IP:** မိမိ၏ Local Network (LAN) သို့မဟုတ် Cloud VPC အတွင်းတွင်သာ အသုံးပြုနိုင်ပြီး Internet ပေါ်မှ တိုက်ရိုက် မမြင်နိုင်ပါ။ အခမဲ့ စိတ်ကြိုက် သတ်မှတ်နိုင်သည်။

#### RFC 1918 Private IP Ranges (မဖြစ်မနေ ကျက်မှတ်ရမည့် Ranges)
1. **Class A:** `10.0.0.0` မှ `10.255.255.255` (CIDR: `10.0.0.0/8`) — Large Enterprise & AWS VPC တွင် အသုံးအများဆုံး။
2. **Class B:** `172.16.0.0` မှ `172.31.255.255` (CIDR: `172.16.0.0/12`) — Medium Networks & Docker Default Networks။
3. **Class C:** `192.168.0.0` မှ `192.168.255.255` (CIDR: `192.168.0.0/16`) — Home & Small Office Wi-Fi Routers။

---

### ၁.၅ Static IP vs Dynamic IP, MAC Address & Subnet Mask

#### Static IP vs Dynamic IP
- **Static IP:** အမြဲမပြောင်းလဲဘဲ သတ်မှတ်ထားသော IP ဖြစ်သည်။ Production Web Servers, Database Servers, Bastion Hosts များနှင့် DNS Records ချိတ်ဆက်ရာတွင် အသုံးပြုသည်။
- **Dynamic IP:** စက်ပိတ်ဖွင့်ချိန် သို့မဟုတ် ချိတ်ဆက်ချိန်တိုင်း DHCP Server မှ အသစ်ပြောင်းလဲထုတ်ပေးသော IP ဖြစ်သည်။ ရုံးသုံး ကွန်ပျူတာများ၊ မိုဘိုင်းဖုန်းများနှင့် Client စက်များတွင် သုံးသည်။

#### MAC Address (Media Access Control)
Hardware ထုတ်လုပ်သူက Network Interface Card (NIC) ပေါ်တွင် အပြီးအပိုင် ရိုက်နှိပ်ပေးထားသော Physical Address (Layer 2) ဖြစ်သည်။ 48-bit (ဥပမာ - `00:1A:2B:3C:4D:5E`) ဖွဲ့စည်းပုံရှိပြီး တူညီသော Local Network အတွင်း Frame ပို့ရန် အသုံးပြုသည်။

#### Subnet Mask
IP Address တစ်ခုတွင် မည်သည့်အပိုင်းသည် **Network ID** ဖြစ်ပြီး မည်သည့်အပိုင်းသည် **Host ID** (Device) ဖြစ်သည်ကို ခွဲခြားပေးသော 32-bit Mask ဖြစ်သည် (ဥပမာ - `255.255.255.0`)။

---

### ၁.၆ CIDR Notation (/24, /16, /32) & Subnetting/IP Range Calculation

**CIDR (Classless Inter-Domain Routing)** သည် ရှေးယခင် Class စနစ် (Class A, B, C) ၏ IP ဖြုန်းတီးမှုကို ဖြေရှင်းရန် Slash (`/`) ဖြင့် Network Bits အရေအတွက်ကို တိကျစွာ ဖော်ပြသည့် စနစ်ဖြစ်သည်။

#### အသုံးများသော CIDR Prefixes နှင့် ရရှိနိုင်သော IP အရေအတွက်
Total IPs = $2^{(32 - \text{Prefix})}$

| CIDR Prefix | Subnet Mask | စုစုပေါင်း IP အရေအတွက် | အသုံးချရာနေရာ |
| :--- | :--- | :--- | :--- |
| **/16** | `255.255.0.0` | $2^{16} = 65,536$ IPs | AWS VPC Default Network Size |
| **/24** | `255.255.255.0` | $2^8 = 256$ IPs | Production Subnets (Public / Private Subnet) |
| **/28** | `255.255.255.240` | $2^4 = 16$ IPs | Small Microservice Subnet သို့မဟုတ် DB Subnet |
| **/32** | `255.255.255.255` | $2^0 = 1$ IP | Specific Single Host IP (Security Group White-listing) |
| **/0** | `0.0.0.0` | ကမ္ဘာ့ IP အားလုံး ($4.3$ Billion) | "Anywhere / Internet" Route Table Target (`0.0.0.0/0`) |

> [!IMPORTANT]
> **AWS VPC တွင် Subnet တစ်ခုစီတိုင်း၌ IP ၅ ခုကို AWS က အမြဲ Reserve လုပ်ထားသည်:**
> ဥပမာ `10.0.1.0/24` (256 IPs) တွင် အမှန်တကယ် သုံးစွဲနိုင်သော IP သည် $256 - 5 = 251$ ဖြစ်သည်:
> 1. `10.0.1.0`: Network Address
> 2. `10.0.1.1`: AWS Default VPC Router
> 3. `10.0.1.2`: AWS DNS Server
> 4. `10.0.1.3`: AWS Future Use
> 5. `10.0.1.255`: Network Broadcast Address

---

### ၁.၇ Default Gateway, Routing & Route Tables

- **Default Gateway (မူလတံခါးပေါက်):** Local Network ထဲတွင် မရှိသော အပြင်ဘက် IP များ (ဥပမာ - Google `8.8.8.8`) သို့ Packet ပို့လိုသည့်အခါ Packet ကို လက်လွှဲပေးပို့ရမည့် Router ၏ IP ဖြစ်သည်။
- **Routing:** Packet တစ်ခုကို မူလနေရာ (Source) မှ ဦးတည်ရာနေရာ (Destination) သို့ ရောက်ရှိစေရန် အကောင်းဆုံး လမ်းကြောင်း ရွေးချယ်ပေးခြင်း ဖြစ်သည်။
- **Route Table:** Router သို့မဟုတ် Linux OS တွင် မည်သည့် IP Range သို့ သွားလိုပါက မည်သည့် Gateway / Interface ဆီ သွားရမည်ကို ညွှန်ကြားထားသော စာရင်းဇယား ဖြစ်သည်။

```
Destination        Gateway          Flags   Interface
192.168.1.0/24     0.0.0.0 (Direct) U       eth0
0.0.0.0/0          192.168.1.1      UG      eth0 (Default Gateway)
```

---

### ၁.၈ NAT (Network Address Translation)

**NAT** သည် Private IP အများအပြားကို Public IP တစ်ခုတည်းအဖြစ်သို့ ပြောင်းလဲကာ Internet သို့ ထွက်နိုင်အောင် ပြုလုပ်ပေးသော နည်းပညာဖြစ်သည်:
- **SNAT (Source NAT):** Private Subnet အတွင်းရှိ Server များသည် Package Update လုပ်ရန် Internet သို့ ထွက်သည့်အခါ Private IP ကို Public IP အဖြစ် ပြောင်းပေးသည်။ (AWS NAT Gateway ကဲ့သို့)
- **DNAT (Destination NAT / Port Forwarding):** အပြင် Internet မှ Public IP ဖြင့် ဝင်လာသော Traffic ကို အတွင်းရှိ Private Server IP သို့ ပြောင်းလဲပို့ဆောင်ပေးသည်။

```
[ Private Server: 10.0.1.50 ]
           │ (Internal Packet: Source=10.0.1.50)
           ▼
[ NAT Gateway: Public IP 54.23.11.8 ]
           │ (Translated Packet: Source=54.23.11.8)
           ▼
[ Internet / GitHub / Ubuntu Mirrors ]
```

---

### ၁.၉ TCP vs UDP, Ports & Protocols

| အချက်အလက် | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection** | Connection-Oriented (3-Way Handshake လုပ်သည်) | Connectionless (တိုက်ရိုက်ပစ်လွှတ်သည်) |
| **Reliability** | စိတ်ချရသည် (Packet ပျောက်ပါက ပြန်ပို့သည် - Retransmission) | စိတ်မချရပါ (Packet ပျောက်ပျက်မှုကို ဂရုမစိုက်ပါ) |
| **Ordering** | အစဉ်လိုက် တိကျစွာ ရောက်ရှိသည် | ရှေ့နောက်မညီဘဲ ရောက်ချင်သလို ရောက်နိုင်သည် |
| **Speed** | Header ကြီးပြီး အနည်းငယ် နှေးသည် (Heavy overhead) | အလွန်မြန်သည် (Low overhead, Lightweight) |
| **အသုံးပြုမှုများ** | HTTP/HTTPS (Web), SSH, Database, Email, File Transfer | Video Streaming, Online Gaming, VoIP (Voice), DNS, DHCP |

#### TCP 3-Way Handshake
1. **SYN (Synchronize):** Client က Server သို့ "ချိတ်ဆက်ပါရစေ" ဟု မေးသည်။
2. **SYN-ACK:** Server က "လက်ခံပါသည်၊ အဆင်သင့်ဖြစ်ပါပြီ" ဟု ပြန်ဖြေသည်။
3. **ACK (Acknowledge):** Client က "လက်ခံရရှိကြောင်း အတည်ပြုသည်" ဟု အကြောင်းပြန်ပြီး Data ပို့ဆောင်မှု စတင်သည်။

---

### ၁.၁၀ Bandwidth, Latency & Packet Loss

- **Bandwidth (လှိုင်းအကျယ် / ဒေတာစီးဆင်းနှုန်း):** တစ်စက္ကန့်အတွင်း ပို့ဆောင်နိုင်သော အများဆုံး ဒေတာ ပမာဏ (ဥပမာ - 100 Mbps, 10 Gbps)။
- **Latency (တုံ့ပြန်မှု ကြန့်ကြာချိန်):** Packet တစ်ခုသည် မူလစက်မှ ပန်းတိုင်စက်သို့ သွားရောက်ပြီး ပြန်လည်ရောက်ရှိရန် ကြာမြင့်ချိန် (RTT - Round Trip Time) ဖြစ်ပြီး မီလီစက္ကန့် (ms) ဖြင့် တိုင်းတာသည်။
- **Packet Loss (ဒေတာအထုပ် ပျောက်ဆုံးမှု):** Network ကျပ်တည်းခြင်း (Congestion) သို့မဟုတ် Cable ချို့ယွင်းခြင်းကြောင့် ပန်းတိုင်မရောက်မီ လမ်းတွင် ပျောက်ဆုံးသွားသော Packet ရာခိုင်နှုန်း (%)။

---

### ၁.၁၁ Firewall Fundamentals & Security Filtering

**Firewall** သည် သတ်မှတ်ထားသော Security Rules များ (IP Address, Port Number, Protocol) အပေါ် အခြေခံ၍ ဝင်လာသော (Inbound) နှင့် ထွက်သွားသော (Outbound) Network Traffic များကို ခွင့်ပြုခြင်း (ALLOW) သို့မဟုတ် တားဆီးခြင်း (BLOCK/DENY) ပြုလုပ်ပေးသည့် လုံခြုံရေး အတားအဆီး ဖြစ်သည်။
- **Network Firewall:** Network တစ်ခုလုံး၏ အဝင်အထွက်ကို ကာကွယ်ပေးသည် (AWS NACL, Palo Alto, Fortinet)။
- **Host-based Firewall:** Server တစ်ခုချင်းစီပေါ်တွင် လည်ပတ်နေသည် (Linux `iptables`, `nftables`, `ufw`, AWS Security Group)။

---

### ၁.၁၂ DNS (Domain Name System) Deep Dive

DNS သည် ကွန်ပျူတာ နားလည်သော IP (`142.250.190.46`) နှင့် လူသား နားလည်သော Domain (`google.com`) အကြား ဘာသာပြန်ပေးသော အင်တာနက် ဖုန်းစာအုပ်စနစ် ဖြစ်သည်။

```
Browser: "api.example.com ရဲ့ IP ဘယ်လောက်လဲ?"
   │
   ├──► 1. Local Cache / OS Resolver
   ├──► 2. Recursive Resolver (ISP DNS သို့မဟုတ် 8.8.8.8)
   │         │
   │         ├──► 3. Root Nameserver (.) -> ".com Server ဆီ သွားမေးပါ"
   │         ├──► 4. TLD Nameserver (.com) -> "AWS Route 53 ဆီ သွားပါ"
   │         └──► 5. Authoritative Nameserver -> "IP သည် 52.198.11.22 ဖြစ်သည်"
   │
   └──◄ 6. Client ထံသို့ IP ပြန်ပို့ပေးပြီး Request စတင်သည်။
```

#### အဓိက DNS Record Types
- **A Record:** Domain Name ကို IPv4 Address သို့ ညွှန်းခြင်း (`example.com -> 93.184.216.34`)
- **AAAA Record:** Domain Name ကို IPv6 Address သို့ ညွှန်းခြင်း
- **CNAME (Canonical Name):** Domain တစ်ခုကို အခြား Domain တစ်ခုသို့ အမည်တူ ညွှန်းခြင်း (`www.example.com -> example.com`)
- **MX Record:** Mail Server ၏ လိပ်စာကို ညွှန်းခြင်း
- **TXT Record:** စာသားဒေတာ ထည့်သွင်းခြင်း (Domain Verification, SPF, DKIM)

---

### ၁.၁၃ HTTP vs HTTPS & TLS/SSL Certificates

- **HTTP (Port 80):** Plain Text ဖြင့် ပို့ဆောင်သောကြောင့် အင်တာနက်ကြားခံတွင် Packet Sniffing လုပ်ကာ Password များနှင့် Credit Card အချက်အလက်များကို ခိုးယူ ဖတ်ရှုနိုင်သည်။
- **HTTPS (Port 443):** HTTP ဒေတာများကို **TLS (Transport Layer Security)** ဖြင့် ဝှက်စာစနစ် (Encryption) ပြုလုပ်ပြီးမှ ပို့ဆောင်သည်။
- **TLS/SSL Handshake:** Asymmetric Encryption (Public/Private Key) ဖြင့် လုံခြုံသော Session Key ကို ဖလှယ်ပြီးနောက်၊ Data များကို အမြန်နှုန်းမြင့်မားသော Symmetric Encryption (AES) ဖြင့် ပို့ဆောင်သည်။

---

### ၁.၁၄ SSH — Secure Remote Login, FTP vs SFTP

- **SSH (Secure Shell - Port 22):** Remote Linux Server များသို့ Command Line ဖြင့် လုံခြုံစွာ ဝင်ရောက်ထိန်းချုပ်နိုင်သည့် Encrypted Protocol ဖြစ်သည်။ Public/Private Key Pair ဖြင့် စကားဝှက်မလိုဘဲ အမြင့်မားဆုံး လုံခြုံရေးဖြင့် အသုံးပြုသည်။
- **FTP (Port 21):** စကားဝှက်နှင့် ဒေတာများကို Plain Text ဖြင့် ပို့သောကြောင့် ခေတ်ဟောင်းတွင်သာ သုံးပြီး ယခုခေတ်တွင် မသုံးသင့်တော့ပါ။
- **SFTP (SSH File Transfer Protocol - Port 22):** SSH ဥမင်လိုဏ်ခေါင်းအတွင်းမှတစ်ဆင့် ဖိုင်များကို လုံခြုံစွာ ကူးယူပို့ဆောင်ပေးသည့် စနစ်ဖြစ်သည်။

---

### ၁.၁၅ DHCP (DORA Process), ICMP & Ping, ARP

#### DHCP (DORA Process - Dynamic Host Configuration)
Device အသစ်တစ်ခု Network သို့ ချိတ်လာချိန်တွင် IP အလိုအလျောက် သတ်မှတ်ပေးပုံ:
1. **D - Discover:** Client က "IP လိုချင်ပါတယ်" ဟု Broadcast ကြေညာသည်။
2. **O - Offer:** DHCP Server က "ဤ IP `192.168.1.50` ကို ယူမလား" ဟု ကမ်းလှမ်းသည်။
3. **R - Request:** Client က "ဤ IP ကို ယူပါမည်" ဟု အတည်ပြု တောင်းဆိုသည်။
4. **A - Acknowledge:** DHCP Server က IP, Subnet Mask, Gateway, DNS များကို ချထားပေးပြီး မှတ်တမ်းတင်သည်။

#### ICMP & Ping
- **ICMP (Internet Control Message Protocol):** Network ပြဿနာများနှင့် Error များကို အကြောင်းကြားရန် အသုံးပြုသော Layer 3 Protocol ဖြစ်သည်။
- **ping:** ICMP Echo Request ပို့ပြီး Echo Reply ပြန်လာခြင်း ရှိမရှိဖြင့် Host အသက်ရှိမရှိ (Connectivity) စစ်ဆေးသည်။

#### ARP (Address Resolution Protocol)
Layer 3 IP Address မှ သက်ဆိုင်ရာ Physical Layer 2 MAC Address ကို ရှာဖွေပေးသော Protocol ဖြစ်သည်။

---

### ၁.၁၆ SMTP, IMAP, POP3 & WebSocket Networking

- **SMTP (Simple Mail Transfer Protocol - Port 25/587):** Email ပို့ဆောင်ရန် အသုံးပြုသည်။
- **IMAP (Port 993) vs POP3 (Port 995):** Email လက်ခံဖတ်ရှုရန် အသုံးပြုသည်။ IMAP သည် Server ပေါ်ရှိ Email များနှင့် စက်ပစ္စည်းအားလုံးကို Sync လုပ်ပေးပြီး၊ POP3 သည် Local စက်သို့ Download ဆွဲယူသွားသည်။
- **WebSocket (Port 80/443 - `ws://`, `wss://`):** HTTP ကဲ့သို့ Request/Response တစ်ခါချင်း မဟုတ်ဘဲ၊ TCP Connection တစ်ခုတည်းပေါ်တွင် Client နှင့် Server အပြန်အလှန် real-time ဒေတာ အဆက်မပြတ် ပို့ဆောင်နိုင်သော Full-Duplex ချိတ်ဆက်မှု ဖြစ်သည် (Chat Apps, Live Dashboard, Stock Ticker)။

---

### ၁.၁၇ VPN — Virtual Private Network

**VPN** သည် Public Internet ပေါ်တွင် Encrypted Tunnel (ဝှက်စာဥမင်) တည်ဆောက်ပြီး အဝေးရောက် ဝန်ထမ်းများ သို့မဟုတ် ရုံးခွဲများကို ရုံးတွင်း Private Network သို့ လုံခြုံစွာ ချိတ်ဆက်ပေးသော စနစ်ဖြစ်သည် (ဥပမာ - OpenVPN, WireGuard, AWS Site-to-Site VPN)။

---

### ၁.၁၈ Proxy vs Reverse Proxy & Load Balancing

#### Forward Proxy vs Reverse Proxy
```
[ Client ] ──► [ Forward Proxy ] ──► [ Internet ]
(Client ၏ အချက်အလက်ကို ဖုံးကွယ်ပေးပြီး Company အင်တာနက် သုံးစွဲမှုကို စစ်ဆေးကန့်သတ်သည်)

[ Internet ] ──► [ Reverse Proxy (Nginx) ] ──► [ Backend Servers (App 1, App 2) ]
(Backend Server များကို ကာကွယ်ပေးပြီး SSL Termination, Caching, Routing ပြုလုပ်ပေးသည်)
```

#### Load Balancing (ဝန်မျှဝေခြင်း)
အသုံးပြုသူ များပြားလာပါက Request များကို Backend Server အများအပြားထံ မျှဝေပို့ဆောင်ပေးခြင်း (Round Robin, Least Connections, IP Hash) ဖြစ်သည်။

---

### ၁.၁၉ Connection Timeout, Retry, CORS Basics & REST API Networking

- **Connection Timeout:** သတ်မှတ်ထားသော စက္ကန့်အတွင်း (ဥပမာ 5s) TCP Handshake မပြီးမြောက်ပါက ချိတ်ဆက်မှုကို ဖျက်သိမ်းခြင်း။
- **Retry with Exponential Backoff:** Network ချို့ယွင်းပါက ချက်ချင်းမတိုးဘဲ အချိန်ကို တဖြည်းဖြည်းတိုး၍ (1s, 2s, 4s, 8s) ပြန်လည် ကြိုးစားခြင်း။
- **CORS (Cross-Origin Resource Sharing):** Browser က လုံခြုံရေးအရ Domain မတူသော Backend API ဆီသို့ Request ပို့ခွင့်ကို HTTP Headers (`Access-Control-Allow-Origin`) ဖြင့် ကန့်သတ်ထိန်းချုပ်သည့် စည်းမျဉ်း။
- **REST API Networking:** HTTP Methods (GET, POST, PUT, DELETE) နှင့် Status Codes (200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, 502 Bad Gateway, 504 Gateway Timeout) ကို အခြေခံသော စနစ်။

---

### ၁.၂၀ မဖြစ်မနေသိထားရမည့် Production Ports & Services Reference Table

လုပ်ငန်းခွင်နှင့် Security Group များတွင် အမြဲတစေ သတ်မှတ်ရသော Default Standard Ports များ:

| Port Number | Protocol / Service Name | အဓိက အသုံးချမှု | Default Security Rule အကြံပြုချက် |
| :---: | :--- | :--- | :--- |
| **22** | **SSH (Secure Shell)** | Linux Remote Server ဝင်ရောက်စီမံခြင်း | Company VPN သို့မဟုတ် Bastion Host မှသာ ဖွင့်ပါ (Internet လုံးဝမဖွင့်ရ) |
| **53** | **DNS (Domain Name System)** | Domain အမည်မှ IP သို့ ပြောင်းလဲခြင်း (UDP/TCP) | VPC Internal DNS သို့မဟုတ် Route 53 |
| **80** | **HTTP** | Unencrypted Web Traffic | Port 443 HTTPS သို့ Redirect လုပ်ရန်သာ သုံးပါ |
| **443** | **HTTPS** | Encrypted Secure Web Traffic (TLS/SSL) | `0.0.0.0/0` (Anywhere) ဖွင့်ထားနိုင်သည် (Public ALB) |
| **3306** | **MySQL / MariaDB / Aurora** | Relational Database ချိတ်ဆက်မှု | Private DB Subnet အတွင်း Backend App SG မှသာ ဖွင့်ပါ |
| **5432** | **PostgreSQL** | Relational Database ချိတ်ဆက်မှု | Private Subnet အတွင်း Backend App SG မှသာ ဖွင့်ပါ |
| **6379** | **Redis (ElastiCache)** | In-Memory Cache & Session Store | Private Subnet အတွင်း App Server မှသာ ဖွင့်ပါ (No Password Sniffing) |
| **8080** | **Alternative HTTP / App** | Tomcat, Spring Boot, Node.js, Jenkins | Internal Traffic သို့မဟုတ် Reverse Proxy နောက်ကွယ်တွင် ထားပါ |
| **9000** | **PHP-FPM** | FastCGI Process Manager (PHP Execution) | Nginx Web Server မှသာ Localhost/Internal ချိတ်ခွင့်ပြုပါ |

---

## ၂။ Linux Network Administration & Troubleshooting Commands

### ၂.၁ Linux Network Interface & Configuration

Linux တွင် Network Interface များသည် Ethernet အတွက် `eth0`, `ens5` သို့မဟုတ် Wi-Fi အတွက် `wlan0`, Local Loopback အတွက် `lo` အဖြစ် ပေါ်လေ့ရှိသည်။

```bash
# Network Interfaces အားလုံး၏ အခြေအနေနှင့် Link Speed ကြည့်ခြင်း
ip link show
```

---

### ၂.၂ `ip addr`, `ip route`, `ping` & `curl`

```bash
# ၁။ Network Interfaces နှင့် IP Address များကို စစ်ဆေးခြင်း
ip addr show
# (အတိုကောက်: ip a)

# ၂။ Routing Table နှင့် Default Gateway စစ်ဆေးခြင်း
ip route show
# Output Example: default via 192.168.1.1 dev eth0 proto dhcp

# ၃။ Network Connectivity အသက်ရှိမရှိ ICMP ဖြင့် စစ်ဆေးခြင်း (4 packets သာ ပို့မည်)
ping -c 4 8.8.8.8

# ၄။ HTTP/HTTPS Endpoint ကို စမ်းသပ်ခြင်းနှင့် Response Header ကြည့်ခြင်း
curl -I https://api.example.com
curl -v https://api.example.com/health
```

---

### ၂.၃ `ss -tulpn`, `dig` / `nslookup`, `traceroute` / `tracepath`

```bash
# ၁။ Server ပေါ်တွင် နားထောင် (Listen) နေသော Port များနှင့် Process PID များကို စစ်ဆေးခြင်း
sudo ss -tulpn
# Options: -t (TCP), -u (UDP), -l (Listening), -p (Process), -n (Numeric Port)

# ၂။ DNS Resolution စစ်ဆေးခြင်း (DNS IP ရှာဖွေခြင်း)
dig api.example.com
nslookup api.example.com

# ၃။ Packet များ Destination သို့ သွားရာလမ်းတစ်လျှောက်ရှိ Hop (Router) များကို လိုက်လံစစ်ဆေးခြင်း
traceroute api.example.com
tracepath 8.8.8.8
```

---

### ၂.၄ `ssh`, `scp` / `rsync` & `sudo` / Linux Permissions

```bash
# ၁။ Private Key ဖြင့် Remote Linux Server သို့ ဝင်ရောက်ခြင်း
ssh -i ~/.ssh/my-key.pem ubuntu@54.23.11.8

# ၂။ File ကို Remote Server သို့ လုံခြုံစွာ ကူးယူခြင်း (SCP)
scp -i ~/.ssh/my-key.pem ./app.tar.gz ubuntu@54.23.11.8:/opt/app/

# ၃။ Directory တစ်ခုလုံးကို ပြောင်းလဲချက်များသာ Sync လုပ်၍ ကူးယူခြင်း (rsync)
rsync -avz -e "ssh -i ~/.ssh/my-key.pem" ./dist/ ubuntu@54.23.11.8:/var/www/html/

# ၄။ Root အခွင့်အာဏာဖြင့် Command အလုပ်လုပ်ခြင်း
sudo systemctl restart nginx
```

---

### ၂.၅ `systemctl`, `journalctl`, `iptables` / `nftables` Basics & `tcpdump`

```bash
# ၁။ Service အခြေအနေစစ်ဆေးခြင်းနှင့် Restart ပြုလုပ်ခြင်း
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# ၂။ Service ၏ Real-time Error Log များကို လိုက်လံကြည့်ရှုခြင်း
sudo journalctl -u nginx -f --no-pager

# ၃။ Linux Kernel Firewall (iptables / nftables) Rules များ စစ်ဆေးခြင်း
sudo iptables -L -n -v
sudo nft list ruleset

# ၄။ Network Interface eth0 ပေါ်မှ Port 80 သို့ ဝင်လာသော Packet များကို ဖမ်းယူစစ်ဆေးခြင်း (Packet Sniffing)
sudo tcpdump -i eth0 port 80 -n -X
```

---

### ၂.၆ Firewall Troubleshooting Runbook

လုပ်ငန်းခွင်တွင် Web Server သို့ ချိတ်မရပါက အောက်ပါအတိုင်း အဆင့်ဆင့် စုံစမ်းစစ်ဆေးပါ:
1. **Port Listen လုပ်နေသလား?** -> `sudo ss -tulpn | grep 80` (Service သေနေပါက `systemctl restart nginx`)
2. **Local Firewall ပိတ်ထားသလား?** -> `sudo ufw status` သို့မဟုတ် `sudo iptables -L`
3. **Cloud Security Group ပိတ်ထားသလား?** -> AWS Console တွင် Inbound Port 80/443 Allow လုပ်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။
4. **Route Table မှန်ကဲ့ရဲ့လား?** -> `ip route show` တွင် Default Gateway ရှိမရှိ စစ်ဆေးပါ။

---

## ၃။ AWS Cloud Networking & VPC Architecture (Deploying Applications)

AWS ပေါ်တွင် Enterprise Application တစ်ခုကို လုံခြုံစွာ တည်ဆောက်ပြီး Deploy လုပ်ရန် အောက်ပါ Networking အစိတ်အပိုင်းများကို စနစ်တကျ ရေးဆွဲရပါသည်:

```
+-----------------------------------------------------------------------------------------+
|                                AWS VPC (10.0.0.0/16)                                    |
|                                                                                         |
|  [ Availability Zone A (ap-northeast-1a) ]   [ Availability Zone C (ap-northeast-1c) ]  |
|                                                                                         |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Public Subnet A (10.0.1.0/24)         |   | Public Subnet C (10.0.2.0/24)         |  |
|  | - Internet Facing ALB                 |   | - Internet Facing ALB                 |  |
|  | - NAT Gateway A                       |   | - NAT Gateway C (High Availability)   |  |
|  +---------------------------------------+   +---------------------------------------+  |
|                     │                                           │                       |
|                     ▼                                           ▼                       |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Private App Subnet A (10.0.11.0/24)   |   | Private App Subnet C (10.0.12.0/24)   |  |
|  | - EC2 / ECS Fargate Tasks             |   | - EC2 / ECS Fargate Tasks             |  |
|  +---------------------------------------+   +---------------------------------------+  |
|                     │                                           │                       |
|                     ▼                                           ▼                       |
|  +---------------------------------------+   +---------------------------------------+  |
|  | Isolated DB Subnet A (10.0.21.0/24)   |   | Isolated DB Subnet C (10.0.22.0/24)   |  |
|  | - RDS MySQL Primary                   |   | - RDS MySQL Multi-AZ Standby          |  |
|  +---------------------------------------+   +---------------------------------------+  |
+-----------------------------------------------------------------------------------------+
       │ (Via Internet Gateway)                                       │ (Via NAT Gateway)
       ▼                                                              ▼
[ Public Internet Users ]                                      [ Outbound Software Updates ]
```

---

### ၃.၁ VPC, CIDR Blocks & Availability Zones

- **VPC (Virtual Private Cloud):** AWS Data Center ကြီးများအတွင်း မိမိကုမ္ပဏီ သီးသန့် အသုံးပြုနိုင်ရန် သီးခြားခွဲထုတ်ပေးထားသော Isolated Virtual Network ဖြစ်သည်။
- **CIDR Blocks:** VPC အတွက် သတ်မှတ်ပေးသော IP Range (ဥပမာ - `10.0.0.0/16` = 65,536 IPs)။
- **Availability Zones (AZ):** သီးခြားစီ တည်ရှိပြီး မီးလိုင်း၊ ရေလိုင်း၊ ကွန်ရက် သီးခြားစီရှိသော ရုပ်ပိုင်းဆိုင်ရာ Data Centers များ ဖြစ်သည် (ဥပမာ - Tokyo တွင် `ap-northeast-1a`, `ap-northeast-1c`, `ap-northeast-1d`)။

---

### ၃.၂ Public Subnet vs Private Subnet

- **Public Subnet:** **Internet Gateway (IGW)** သို့ Route ချိတ်ဆက်ထားသော Subnet ဖြစ်သည်။ အင်တာနက်မှ တိုက်ရိုက် ဝင်ရောက်နိုင်သော Application Load Balancer (ALB), NAT Gateway, Bastion Host များကို ထားရှိသည်။
- **Private Subnet:** IGW သို့ တိုက်ရိုက် Route မရှိသော Subnet ဖြစ်သည်။ အင်တာနက်မှ တိုက်ရိုက် မမြင်တွေ့စေလိုသော Backend App Servers, API Containers, Microservices များကို ထားရှိသည်။

---

### ၃.၃ Internet Gateway (IGW) vs NAT Gateway

- **Internet Gateway (IGW):** VPC နှင့် Internet အကြား နှစ်ဖက်စလုံး (Inbound & Outbound) တိုက်ရိုက် ချိတ်ဆက်ပေးသော Serverless Gateway ဖြစ်သည်။
- **NAT Gateway:** Private Subnet ထဲရှိ Server များသည် အပြင် Internet သို့ (Outbound Only) သွားရောက်၍ Package Update သို့မဟုတ် External API ခေါ်ဆိုနိုင်ပြီး၊ အပြင် Internet မှ Private Server များသို့ ပြန်လည် စတင်ဝင်ရောက်ခြင်းကို လုံးဝတားဆီးပေးသော တစ်ဖက်သတ် Gateway ဖြစ်သည်။

---

### ၃.၄ Route Tables & Elastic IP

- **Route Table (VPC):** Subnet တစ်ခုချင်းစီတွင် ဝင်လာသော Traffic များ မည်သည့်ဘက်သို့ သွားရမည်ကို ဆုံးဖြတ်ပေးသော စည်းမျဉ်းဇယား:
  - Public Subnet Route: `0.0.0.0/0 -> igw-xxxxxx`
  - Private Subnet Route: `0.0.0.0/0 -> nat-xxxxxx`
- **Elastic IP (EIP):** အမြဲတမ်း တည်ငြိမ်နေသော Static Public IPv4 Address ဖြစ်ပြီး NAT Gateway သို့မဟုတ် Bastion Host များတွင် ချိတ်တွဲအသုံးပြုသည်။

---

### ၃.၅ အထူးနားလည်ရမည့်အချက်: Security Group (Stateful) vs NACL (Stateless)

Cloud Interview များနှင့် လက်တွေ့လုပ်ငန်းခွင်တွင် အရေးအကြီးဆုံး မေးခွန်းဖြစ်သည်:

| အင်္ဂါရပ် | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operating Layer** | **Instance Level** (EC2, ALB, RDS တစ်ခုချင်းစီ၏ Virtual Firewall) | **Subnet Level** (Subnet နယ်နိမိတ်တစ်ခုလုံး၏ အဝင်အထွက် တံခါးစောင့်) |
| **State Nature** | **Stateful** (Inbound ခွင့်ပြုထားပါက Outbound သည် အလိုအလျောက် ပွင့်ပြီးသား ဖြစ်သည်) | **Stateless** (Inbound ခွင့်ပြုရုံမက Ephemeral Port များပါဝင်သော Outbound Rule ကိုပါ သီးသန့် ဖွင့်ပေးရသည်) |
| **Rule Type** | **ALLOW Rules သာ** ရေးသားနိုင်သည် (Default အားဖြင့် အကုန်ပိတ်ထားသည်) | **ALLOW နှင့် DENY Rules နှစ်မျိုးစလုံး** ရေးသားနိုင်သည် (Specific IP ကို Block လုပ်နိုင်သည်) |
| **Rule Evaluation** | Rules အားလုံးကို တစ်ပြိုင်နက် Evaluate လုပ်သည် | Rule အမှတ်စဉ် (ဥပမာ - 100, 200) အလိုက် အစဉ်လိုက် Evaluate လုပ်သည် |

> [!WARNING]
> **Public Subnet ထဲရှိတာနဲ့ Internet ကနေ တိုက်ရိုက်ဝင်လို့ရတာ ဘာကြောင့် မတူသလဲ?**  
> Subnet တစ်ခုသည် Public Subnet ဖြစ်နေရုံမျှဖြင့် ထို Subnet ထဲရှိ EC2 Server အားလုံး အင်တာနက်မှ တိုက်ရိုက်ဝင်ရောက်နိုင်သည် မဟုတ်ပါ။ အကြောင်းရင်းမှာ:
> 1. EC2 Instance တွင် **Public IP** ပိုင်ဆိုင်ထားရမည်။
> 2. VPC Route Table တွင် `0.0.0.0/0 -> IGW` ချိတ်ဆက်ထားရမည်။
> 3. Subnet ၏ **NACL** က Inbound Port ကို ခွင့်ပြုထားရမည်။
> 4. EC2 ၏ **Security Group** က အပြင် IP မှ ဝင်ရောက်ခွင့်ကို ALLOW ပေးထားရမည်။  
> ဤ ၄ ချက်စလုံး ပြည့်စုံမှသာ အင်တာနက်မှ တိုက်ရိုက်ဝင်ရောက်နိုင်မည် ဖြစ်သည်။

---

### ၃.၆ VPC Endpoints (Gateway vs Interface), VPC Peering & AWS Transit Gateway

- **VPC Endpoints (AWS PrivateLink):** Private Subnet ထဲမှ AWS S3 သို့မဟုတ် DynamoDB သို့ သွားရောက်သည့်အခါ NAT Gateway နှင့် Public Internet ကို မဖြတ်ဘဲ AWS Internal Network မှတစ်ဆင့် သီးသန့် ချိတ်ဆက်ပေးသော စနစ်ဖြစ်သည်။ (ကုန်ကျစရိတ် သက်သာပြီး လုံခြုံသည်)
  - **Gateway Endpoint:** S3 နှင့် DynamoDB အတွက် အခမဲ့ သုံးနိုင်သော Route Table Entry။
  - **Interface Endpoint:** CloudWatch, Secrets Manager, ECR စသည်တို့အတွက် Private IP (ENI) ဖန်တီးပေးသော စနစ်။
- **VPC Peering:** မတူညီသော VPC နှစ်ခုကြား Routing ချိတ်ဆက်ပေးခြင်း (No Single Point of Failure, Non-transitive)။
- **AWS Transit Gateway:** VPC ပေါင်းများစွာ (10+ VPCs) နှင့် On-premises Network များကို ဗဟို Hub တစ်ခုတည်းမှ ချိတ်ဆက်ပေးသော Cloud Router ကြီး ဖြစ်သည်။

---

### ၃.၇ Route 53, ALB vs NLB, CloudFront (CDN) & ACM

- **Amazon Route 53:** AWS ၏ 99.999% SLA ရှိသော Highly Available Managed DNS ဝန်ဆောင်မှု။
- **Application Load Balancer (ALB - Layer 7):** HTTP/HTTPS Headers, Path-based routing (`/api`, `/users`) စသည်တို့ကို နားလည်သော Load Balancer။
- **Network Load Balancer (NLB - Layer 4):** Ultra-high Performance, Extreme Low Latency နှင့် Static IP လိုအပ်သော TCP/UDP Traffic အတွက် သုံးသည်။
- **Amazon CloudFront:** ကမ္ဘာအနှံ့ရှိ Edge Locations များမှ Static Assets (Images, CSS, JS) များကို Cache လုပ်ပေးသော CDN ဝန်ဆောင်မှု။
- **AWS Certificate Manager (ACM):** အခမဲ့ SSL/TLS Certificates များ ထုတ်ပေးပြီး ALB သို့မဟုတ် CloudFront တွင် Auto-Renewal ဖြင့် ချိတ်တွဲပေးသော စနစ်။

---

### ၃.၈ AWS WAF Basics, VPC Flow Logs, Site-to-Site VPN & Direct Connect

- **AWS WAF (Web Application Firewall):** SQL Injection (SQLi), Cross-Site Scripting (XSS), Rate Limiting (DDoS mitigation) များကို Layer 7 တွင် ကာကွယ်ပေးသည်။
- **VPC Flow Logs:** Subnet သို့မဟုတ် Network Interface များသို့ ဝင်ထွက်လာသော IP Traffic (Source, Destination, Port, ACCEPT/REJECT) များကို စုံစမ်းစစ်ဆေးရန် CloudWatch/S3 သို့ မှတ်တမ်းတင်ပေးသည်။
- **AWS Site-to-Site VPN:** ရုံးတွင်း Data Center နှင့် AWS VPC ကြား IPsec VPN Tunnel ဖြင့် ချိတ်ဆက်ခြင်း။
- **AWS Direct Connect (DX):** Public Internet ကို လုံးဝမဖြတ်ဘဲ ရုံးတွင်း Data Center မှ AWS သို့ သီးသန့် Physical Fiber Cable ဖြင့် တိုက်ရိုက် ချိတ်ဆက်ခြင်း။

---

## ၄။ Cloud Systems Architecture & Design Patterns

### ၄.၁ IaaS, PaaS, SaaS & Shared Responsibility Model

```
+-------------------------------------------------------------+
| IaaS (Infrastructure as a Service): AWS EC2, VPC, EBS       |
| (သင်ကိုယ်တိုင် OS, Patching, Runtime, Application စီမံရသည်)       |
+-------------------------------------------------------------+
| PaaS (Platform as a Service): AWS Elastic Beanstalk, RDS    |
| (Cloud Provider က OS, Patching စီမံပေးပြီး သင်က Code သာ တင်သည်)  |
+-------------------------------------------------------------+
| SaaS (Software as a Service): Google Workspace, Salesforce  |
| (End-user အဖြစ် Software ကို အသင့် သုံးစွဲရုံသာ ဖြစ်သည်)             |
+-------------------------------------------------------------+
```

#### Shared Responsibility Model (တာဝန်ခွဲဝေမှုပုံစံ)
- **Security OF the Cloud (AWS တာဝန်):** Physical Data Centers, Hardware, Cables, Power, Facilities နှင့် Virtualization Hypervisor။
- **Security IN the Cloud (Customer တာဝန်):** OS Updates, Security Patching, IAM Permissions, Firewall/Security Groups, Data Encryption နှင့် Application Code။

---

### ၄.၂ Region vs Availability Zone, High Availability (HA) & Fault Tolerance

- **Region:** ကမ္ဘာ့ပထဝီဝင် နယ်မြေတစ်ခု (ဥပမာ - Tokyo, Singapore)။
- **Availability Zone (AZ):** Region တစ်ခုအတွင်း အနည်းဆုံး AZ ၃ ခုစီ ပါဝင်သည်။
- **High Availability (HA):** စနစ်တစ်ခုသည် Component တစ်ခု ပျက်စီးသွားသော်လည်း အနည်းငယ်သော စွမ်းဆောင်ရည် ကျဆင်းမှုဖြင့် အလုပ်ဆက်လက်လုပ်ဆောင်နိုင်ခြင်း (Multi-AZ Deployment)။
- **Fault Tolerance:** စနစ်အတွင်းရှိ Hardware သို့မဟုတ် Server တစ်ခု လုံးဝပျက်စီးသွားသော်လည်း သုံးစွဲသူဘက်တွင် Downtime လုံးဝမဖြစ်ပေါ်စေဘဲ ချက်ချင်း အလိုအလျောက် အစားထိုးနိုင်ခြင်း။

---

### ၄.၃ Scalability vs Elasticity (Vertical vs Horizontal Scaling)

- **Scalability:** ဝန်ပိလာပါက စနစ်ကို ကြီးထွားအောင် တိုးချဲ့နိုင်သော စွမ်းရည်။
- **Elasticity:** Traffic များလာပါက Auto တိုးပေးပြီး Traffic နည်းသွားပါက အလိုအလျောက် ပြန်လျှော့ချပေးသော စွမ်းရည် (Auto Scaling Group)။
- **Vertical Scaling (Scale-Up):** Server စက်တစ်လုံးတည်း၏ CPU/RAM ကို မြှင့်တင်ခြင်း (ဥပမာ `t3.medium` မှ `m5.2xlarge`) — Downtime ရှိနိုင်ပြီး အကန့်အသတ်ရှိသည်။
- **Horizontal Scaling (Scale-Out):** တူညီသော Server အသေးစားလေးများကို Load Balancer နောက်ကွယ်တွင် အလုံးရေ တိုးမြှင့်ခြင်း — Zero Downtime ဖြစ်ပြီး အကန့်အသတ်မရှိ တိုးချဲ့နိုင်သည်။

---

### ၄.၄ Single-Server Architecture vs Multi-Tier Architecture

```
[ Single-Server Architecture ]
+--------------------------------------------------+
| EC2 Server: Nginx + PHP/Node + MySQL Database     |
+--------------------------------------------------+
(Single Point of Failure ဖြစ်သည်၊ Traffic များပါက CPU ပိ၍ ကျသွားနိုင်သည်)

[ Multi-Tier Architecture (Enterprise Standard) ]
Tier 1 (Web Tier): Application Load Balancer (Public Subnet)
Tier 2 (App Tier): Auto Scaling Group of Stateless Web/API EC2 (Private Subnet)
Tier 3 (DB Tier): Multi-AZ Amazon RDS MySQL + Read Replicas (Isolated Subnet)
```

---

### ၄.၅ Web, Application & Database Layers

1. **Web Layer:** Reverse Proxy, SSL Termination နှင့် Static Assets Caching (ALB, Nginx, CloudFront)။
2. **Application Layer:** Business Logic များကို တွက်ချက်ဆောင်ရွက်သော Stateless Backend Containers/Servers (Node.js, Laravel, Spring Boot)။
3. **Database Layer:** Data Persistence နှင့် ACID Transaction များကို ထိန်းသိမ်းသော Relational/NoSQL စနစ် (Amazon RDS Multi-AZ, Aurora, DynamoDB)။

---

### ၄.၆ Reverse Proxy & Load Balancer Architectures

Backend Servers များ၏ တကယ့် Private IP များကို ဖုံးကွယ်ပြီး၊ Client များထံမှ SSL Handshake ကို ALB ပေါ်တွင် အဆုံးသတ်ပေးသည် (**SSL Offloading** / SSL Termination)။ Backend Servers များထံသို့ ရိုးရိုး HTTP ဖြင့် ကူးပြောင်းပေးသဖြင့် Backend Server ၏ CPU ဝန်ကို လျှော့ချပေးသည်။

---

### ၄.၇ Stateless vs Stateful Applications & Multi-AZ Deployment

- **Stateless Application:** User ၏ Session ဒေတာ သို့မဟုတ် File များကို Server ၏ Local Disk ပေါ်တွင် မသိမ်းဆည်းဘဲ External Cache (Redis) သို့မဟုတ် Object Storage (S3) တွင် သိမ်းဆည်းသော စနစ်ဖြစ်သည်။ မည်သည့် Server သေသွားပါကလည်း သုံးစွဲသူအပေါ် သက်ရောက်မှု မရှိဘဲ Auto Scaling လွတ်လပ်စွာ လုပ်နိုင်သည်။
- **Multi-AZ Deployment:** Server များနှင့် Database Standby များကို မတူညီသော Data Center (AZ-a နှင့် AZ-c) နှစ်ခုတွင် ခွဲထားသဖြင့် Data Center တစ်ခု မီးလောင်ပြာကျသွားသော်လည်း စနစ်သည် ဆက်လက် လည်ပတ်နေနိုင်သည်။

---

### ၄.၈ Disaster Recovery (DR), Backup & Restore, RTO / RPO

```
Disaster ဖြစ်ပွားချိန်
       │
◄──────┼──────────────────────►
       │                      │
   [ RPO ]                 [ RTO ]
(Recovery Point Objective) (Recovery Time Objective)
"ဒေတာ မည်မျှ ဆုံးရှုံးခံနိုင်သလဲ"   "စနစ်ကို မည်မျှကြာအောင် ပြန်လည်ပြင်ဆင်နိုင်သလဲ"
(ဥပမာ 1 နာရီစာ Backup)       (ဥပမာ 15 မိနစ်အတွင်း ပြန်တက်ရမည်)
```

#### DR Strategies (သက်သာရာမှ အကုန်အကျများရာသို့)
1. **Backup & Restore:** S3/Glacier သို့ နေ့စဉ် Backup သိမ်းပြီး ပျက်မှ အသစ်ပြန်တင်သည် (Hours/Days RTO)။
2. **Pilot Light:** Core Database သာ replicate လုပ်ထားပြီး Server များကို ပျက်မှ Auto တည်ဆောက်သည်။
3. **Warm Standby:** Production ၏ အသေးစား version လေးကို အခြား Region တွင် အမြဲ Run ထားသည်။
4. **Multi-Region Active-Active:** Region ၂ ခုစလုံးတွင် Traffic တစ်ဝက်စီ အပြည့်အဝ လက်ခံနေသည် (Zero Downtime)။

---

### ၄.၉ AWS Well-Architected Framework Basics

လုပ်ငန်းခွင် စံချိန်စံညွှန်း မဏ္ဍိုင်ကြီး ၆ ခု (6 Pillars):
1. **Operational Excellence:** Code ဖြင့် အလိုအလျောက် စီမံပြီး ကျရှုံးမှုများမှ သင်ခန်းစာယူခြင်း။
2. **Security:** Least privilege, Data encryption at rest & in transit, Audit logging။
3. **Reliability:** ကျရှုံးမှုမှ အလိုအလျောက် ပြန်လည်နာလန်ထူနိုင်ခြင်း (Auto recovery)။
4. **Performance Efficiency:** Serverless နှင့် Graviton processor ကဲ့သို့ သင့်လျော်သော Resources များ သုံးခြင်း။
5. **Cost Optimization:** အသုံးမလိုသော အရာများကို ဖျက်ပစ်ခြင်း၊ Right-sizing နှင့် Savings Plans သုံးခြင်း။
6. **Sustainability:** သဘာဝပတ်ဝန်းကျင်နှင့် ကာဗွန်ထုတ်လွှတ်မှု အနည်းဆုံးဖြစ်အောင် အရင်းအမြစ်များကို အကျိုးရှိရှိ သုံးခြင်း။

---

## ၅။ Cloud Automation with Infrastructure as Code (IaC)

> **Cloud Automation** ဆိုတာ Server, Network, Database စတာတွေကို AWS Console မှာ တစ်ခုချင်း Manual ကလစ်နှိပ်တည်ဆောက်မယ့်အစား Code နဲ့ ထပ်တလဲလဲ တည်ဆောက်၊ ပြင်ဆင်၊ ဖျက်သိမ်းနိုင်အောင် ပြုလုပ်ခြင်း ဖြစ်သည်။

---

### ၅.၁ IaC Concepts, Manual vs Automated & Declarative vs Imperative

| အချက်အလက် | Declarative (Terraform, CloudFormation) | Imperative (Bash Scripts, AWS CLI commands) |
| :--- | :--- | :--- |
| **ချဉ်းကပ်ပုံ** | **"ဘာလိုချင်သလဲ" (What you want)** ကို ကြေညာသည် | **"ဘယ်လိုလုပ်ရမလဲ" (How to do it)** ကို တစ်ဆင့်ချင်း ညွှန်ကြားသည် |
| **အလုပ်လုပ်ပုံ** | "VPC တစ်ခု၊ Subnet ၂ ခု ရှိရမည်" ဟု ရေးသားသည် | "VPC ဆောက်ပါ၊ ပြီးလျှင် Subnet ဆောက်ပါ၊ ပြီးလျှင် Route ချိတ်ပါ" |
| **Idempotency** | **အပြည့်အဝရှိသည်** (အကြိမ်ကြိမ် Run သော်လည်း အပိုမဆောက်ဘဲ အလိုရှိသော State အတိုင်း ထိန်းပေးသည်) | အကြိမ်ကြိမ် Run ပါက Duplicate Resources များ ဖြစ်ပေါ်လာနိုင်သည် |

---

### ၅.၂ YAML / JSON, Git & AWS CLI

- **YAML / JSON:** CloudFormation နှင့် Ansible အတွက် Configuration ရေးသားသော ပုံစံ။
- **Git & Version Control:** Infrastructure ပြင်ဆင်ချက်တိုင်းကို Git Commit ဖြင့် မှတ်တမ်းတင်ပြီး Pull Request (PR) ဖြင့် Code Review လုပ်သည်။
- **AWS CLI:** Terminal မှ AWS ကို ထိန်းချုပ်သော Command-Line Interface (`aws ec2 describe-instances`)။

---

### ၅.၃ AWS CloudFormation vs Terraform

> [!TIP]
> **အဓိက Tools:** AWS CloudFormation သို့မဟုတ် Terraform ကို အရင်တစ်ခု ကျွမ်းကျင်အောင် လေ့လာပါ။ နှစ်ခုစလုံးကို တစ်ပြိုင်နက် စတင်ဖို့ မလိုပါဘူး။ လုပ်ငန်းခွင် အများစုတွင် Multi-cloud သုံးနိုင်သော **Terraform** ကို ပိုမို ဦးစားပေး အသုံးပြုကြသည်။

---

### ၅.၄ Terraform Fundamentals (Providers, Resources, Data Sources, Variables, Outputs)

```hcl
# providers.tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# variables.tf
variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

# main.tf (Resources)
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "production-vpc"
    Environment = "production"
  }
}

# outputs.tf
output "vpc_id" {
  description = "The ID of the provisioned VPC"
  value       = aws_vpc.main.id
}
```

---

### ၅.၅ State File, Remote State & Modules

- **State File (`terraform.tfstate`):** သင်၏ Code နှင့် Cloud ပေါ်ရှိ တကယ့် Real Resources များကြား ချိတ်ဆက်ပေးသော မှတ်တမ်းဖိုင် ဖြစ်သည်။
- **Remote State:** Team အဖွဲ့လိုက် အလုပ်လုပ်ရာတွင် State ပျောက်ဆုံးခြင်းနှင့် တပြိုင်နက် ပြင်ဆင်မိခြင်း (Race Condition) မဖြစ်စေရန် State ဖိုင်ကို **Amazon S3** တွင် သိမ်းဆည်းပြီး **DynamoDB** ဖြင့် Lock ချုပ်ထားသော စနစ် ဖြစ်သည်။
- **Modules:** Subnet, ALB, ECS စသည့် Code များကို ပြန်လည်အသုံးပြုနိုင်အောင် (Reusable Code) သီးခြား Component အဖြစ် ထုပ်ပိုးထားခြင်း။

---

### ၅.၆ Terraform CLI: `init`, `plan`, `apply`, `destroy`

```bash
# ၁။ Provider Plugins များနှင့် Modules များကို စတင် Download ဆွဲယူခြင်း
terraform init

# ၂။ မည်သည့် Resources များ တည်ဆောက်/ဖျက်ပစ်မည်ကို အစမ်းတွက်ချက် စစ်ဆေးခြင်း (Dry Run)
terraform plan

# ၃။ Cloud ပေါ်တွင် တကယ့် Infrastructure အမှန်တကယ် စတင်တည်ဆောက်ခြင်း
terraform apply -auto-approve

# ၄။ တည်ဆောက်ထားသော Resources အားလုံးကို Cloud ပေါ်မှ အပြီးအပိုင် ဖျက်သိမ်းခြင်း
terraform destroy -auto-approve
```

---

### ၅.၇ CloudFormation Templates, Parameters, Outputs, Stack Updates & Rollbacks

AWS ၏ Native IaC Tool ဖြစ်ပြီး YAML/JSON ဖြင့် Stack တည်ဆောက်သည်။
- **Rollback:** Stack Update လုပ်ရာတွင် တစ်ခုခု Error ဖြစ်ပါက မူလ အခြေအနေသို့ အလိုအလျောက် ပြန်လှည့်ပေးသည် (Automatic Rollback)။
- **Change Sets:** မဆောက်မီ ဘာတွေ ပြောင်းလဲသွားမည်ကို Preview ကြည့်ရှုခြင်း။

---

### ၅.၈ Drift Detection, Idempotency, Secrets & Reusable Environments

- **Drift Detection:** Cloud Console UI မှ လက်ဖြင့် ခိုးပြင်ထားသော အချက်အလက်များကို Code နှင့် ပြန်လည် နှိုင်းယှဉ်ရှာဖွေခြင်း။
- **Idempotency:** Code ကို အကြိမ် ၁၀၀ Run လျှင်လည်း ရလဒ်သည် တူညီနေခြင်း။
- **Secrets in State:** State ဖိုင်ထဲတွင် Database Password များ Plain Text အဖြစ် မပါသွားစေရန် AWS Secrets Manager သို့မဟုတ် SSM Parameter Store သုံးခြင်း။
- **Reusable Environments:** Terraform Workspaces သို့မဟုတ် Directory structure ခွဲကာ Dev, Staging, Production ပတ်ဝန်းကျင်များကို Code တစ်ခုတည်းဖြင့် ထပ်တူပွား တည်ဆောက်နိုင်ခြင်း။

---

## ၆။ Configuration Management & Server Automation

### ၆.၁ Bash Scripting, Linux Shell Commands, Env Vars & Cron Jobs

Server Provision လုပ်ရာတွင် Server အသစ် စတက်လာသည်နှင့် အလိုအလျောက် Package သွင်းပေးသည့် **User Data (Cloud-Init)**:

```bash
#!/usr/bin/env bash
# EC2 User Data Automation Script
set -euo pipefail

# System Update & Install Nginx
apt-get update -y
apt-get install -y nginx curl git

# Set Environment Variables
echo "APP_ENV=production" >> /etc/environment

# Automated Cron Job for Log Cleanup
echo "0 2 * * * root find /var/log/app -name '*.log' -mtime +7 -delete" > /etc/cron.d/log-cleanup

# Start & Enable Nginx
systemctl start nginx
systemctl enable nginx
```

---

### ၆.၂ Ansible Fundamentals (Inventory, Hosts, Playbooks, Tasks, Handlers, Templates)

Ansible သည် Server များပေါ်တွင် Agent သွင်းစရာမလိုဘဲ **SSH** ဖြင့် Server ရာနှင့်ချီကို တစ်ပြိုင်နက် Configuration ပြုလုပ်ပေးသည့် Agentless Automation Tool ဖြစ်သည်:

```yaml
# playbook.yml - Nginx Automation Playbook
---
- name: Configure Web Application Servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install Nginx Web Server
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Deploy Custom Nginx VirtualHost Configuration
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Restart Nginx

  handlers:
    - name: Restart Nginx
      systemd:
        name: nginx
        state: restarted
```

---

### ၆.၃ SSH Key Authentication & Configuration Automation

SSH Key-based Authentication ကို အသုံးပြု၍ Password မလိုဘဲ Server များသို့ Ansible မှ Automated Deployment လုပ်ဆောင်နိုင်ပြီး၊ Configuration Drift (လက်ဖြင့်လိုက်ပြင်မှုကြောင့် Server များ ကွဲလွဲသွားခြင်း) ကို ကာကွယ်ပေးသည်။

---

### ၆.၄ AWS Systems Manager (SSM) — Session Manager, Run Command, Patch Manager & Parameter Store

- **Session Manager:** EC2 ပေါ်တွင် **Port 22 SSH ကို လုံးဝ ပိတ်ထားနိုင်ပြီး**၊ AWS Console သို့မဟုတ် CLI မှတစ်ဆင့် IAM Role ဖြင့် လုံခြုံစွာ Terminal ဝင်ရောက်နိုင်သော Enterprise နည်းပညာ (No Bastion Host, No Public IP required)။
- **Run Command:** Server အလုံး ၁၀၀ ပေါ်သို့ Script တစ်ခုကို Console/CLI မှ တစ်ပြိုင်နက် လှမ်း Run နိုင်ခြင်း။
- **Patch Manager:** Linux OS Security Patches များကို အလိုအလျောက် Schedule ဆွဲ၍ Update လုပ်ပေးခြင်း။
- **Parameter Store:** Database URLs, App Configs များကို Encrypted Key-Value အဖြစ် ဗဟိုမှ သိမ်းဆည်းပေးခြင်း။

---

## ၇။ CI/CD & Cloud Deployment Pipelines

### ၇.၁ Git Branching, Pull Requests & CI vs CD

- **Git Flow:** Feature Branch -> Pull Request -> Review & Tests -> Merge to `main` -> Auto Deploy to Production။
- **CI (Continuous Integration):** Developer များ Code Push လုပ်တိုင်း Build လုပ်ခြင်း၊ Lint စစ်ခြင်းနှင့် Automated Unit Tests များ အလိုအလျောက် စစ်ဆေးခြင်း။
- **CD (Continuous Delivery / Deployment):** Tests အောင်မြင်ပါက Staging သို့မဟုတ် Production သို့ လူမလိုဘဲ အလိုအလျောက် Deploy လုပ်ဆောင်ခြင်း။

---

### ၇.၂ Build Automation, Automated Tests, Artifact Management & Docker ECR

```
[ Developer Git Push ]
         │
         ▼
[ GitHub Actions / CodeBuild ]
  ├─ 1. Run Automated Tests (PHPUnit / Jest)
  ├─ 2. Build Docker Container Image
  ├─ 3. Scan Vulnerabilities (Trivy)
  └─ 4. Push Image to Amazon ECR (Private Registry)
         │
         ▼
[ Deploy to Amazon ECS Fargate ]
```

---

### ၇.၃ Amazon ECS / Fargate Basics, GitHub Actions & AWS CodePipeline / CodeBuild

- **Amazon ECS with Fargate:** Server (EC2) များကိုယ်တိုင် Update/Patch လုပ်စရာမလိုဘဲ Serverless အနေဖြင့် Docker Container များကို သီးသန့် Run ပေးသော စနစ်။
- **GitHub Actions Workflow နမူနာ (`.github/workflows/deploy.yml`):**

```yaml
name: Deploy to Production ECS

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, Tag, and Push Docker Image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/my-app:$IMAGE_TAG .
          docker push $ECR_REGISTRY/my-app:$IMAGE_TAG

      - name: Deploy Amazon ECS Task Definition
        run: |
          aws ecs update-service --cluster prod-cluster --service web-app --force-new-deployment
```

---

### ၇.၄ Deployment Environments, Environment Configuration & DB Migrations

- Environment ခွဲခြားမှု: **Development -> Staging (Pre-release) -> Production**။
- **Database Migration:** Zero Downtime ဖြစ်စေရန် Deployment Pipeline အတွင်း Container အသစ် မတက်မီ Backward-compatible Migration (ဥပမာ `php artisan migrate --force`) ကို သီးသန့် Step ဖြင့် အရင် Run ရမည်။

---

### ၇.၅ Deployment Strategies: Rolling, Blue/Green, Rollback, Health Checks & Secrets

#### Rolling vs Blue/Green Deployment
- **Rolling Deployment:** Server အဟောင်းများကို တစ်လုံးချင်း ဖျက်ပြီး အသစ်တစ်လုံးချင်း အစားထိုးလဲလှယ်ခြင်း (Resource သက်သာသည်)။
- **Blue/Green Deployment:** Green Environment အသစ်တစ်ခုလုံးကို သီးသန့် တည်ဆောက်ပြီး စမ်းသပ်ကာ အဆင်ပြေမှ Load Balancer ဖြင့် Traffic ချက်ချင်း ပြောင်းပေးခြင်း (Zero Downtime, ချက်ချင်း Rollback လုပ်နိုင်သည်)။
- **Automated Rollback:** Deploy လုပ်ပြီးနောက် ALB Health Check မအောင်မြင်ပါက မူလ Version သို့ အလိုအလျောက် ပြန်ဆုတ်ပေးခြင်း။
- **Secrets Management in CI/CD:** GitHub Secrets သို့မဟုတ် AWS Secrets Manager မှတဆင့် Token များကို ထိန်းသိမ်းပြီး Code ထဲတွင် လုံးဝ Hardcode မရေးရပါ။

---

## ၈။ Cloud Security, IAM & Governance

### ၈.၁ IAM Users, Groups, Roles, Policies & Least Privilege

- **IAM User:** လူပုဂ္ဂိုလ်တစ်ဦးချင်းစီအတွက် Account (Console Login)။
- **IAM Role:** EC2, Lambda, GitHub Actions ကဲ့သို့သော ဝန်ဆောင်မှုများကို ခေတ္တ အခွင့်အာဏာ အပ်နှင်းခြင်း (No permanent passwords)။
- **Principle of Least Privilege (အနည်းဆုံး အခွင့်အာဏာ ပေးအပ်ခြင်း မူ):** လူတစ်ဦး သို့မဟုတ် Service တစ်ခုကို ၎င်း၏ အလုပ်တာဝန်အတွက် မရှိမဖြစ် လိုအပ်သော ခွင့်ပြုချက်မှလွဲ၍ ပိုလျှံသော အခွင့်အာဏာ (ဥပမာ `AdministratorAccess`) ကို လုံးဝ မပေးရပါ။

---

### ၈.၂ EC2 Instance Profiles, Temporary Credentials (STS) & MFA

- **EC2 Instance Profile:** EC2 Server ပေါ်တွင် AWS Access Key/Secret Key များကို `.env` သို့မဟုတ် file တွင် မသိမ်းဆည်းဘဲ IAM Role ချိတ်ပေးခြင်းဖြင့် **AWS STS** မှ Temporary Credentials များကို အလိုအလျောက် ရယူသုံးစွဲစေခြင်း။
- **MFA (Multi-Factor Authentication):** Console အကောင့်တိုင်းတွင် ဖုန်း Google Authenticator ကဲ့သို့ OTP မဖြစ်မနေ ထည့်ခိုင်းခြင်း။

---

### ၈.၃ AWS Secrets Manager, KMS, Encryption at Rest & in Transit

- **AWS KMS (Key Management Service):** Database Disk (EBS), S3 Bucket များကို Envelope Encryption ဖြင့် ဝှက်စာပြုလုပ်ပေးခြင်း (**Encryption at Rest**)။
- **Encryption in Transit:** Data သွားလာသမျှကို TLS 1.3 / HTTPS ဖြင့်သာ ပို့ဆောင်ခြင်း။
- **AWS Secrets Manager:** Database Password များကို အလိုအလျောက် ရက်ပေါင်း ၃၀ သို့မဟုတ် ၆၀ တိုင်း လျှို့ဝှက်စွာ ပြောင်းလဲပေးခြင်း (**Secret Rotation**)။

---

### ၈.၄ Audit Logs (CloudTrail), AWS Config, Security Hub, WAF & Hardcoding Prevention

- **AWS CloudTrail:** AWS Account အတွင်း မည်သူက ဘယ်အချိန်တွင် ဘယ် IP မှ မည်သည့် Resource ကို ဖျက်/ပြင်သွားသည်ကို မှတ်တမ်းတင်ပေးသော Audit Trail စနစ်။
- **AWS Config:** Security Compliance မပြည့်မီသော Resources များကို အချိန်နှင့်တပြေးညီ စောင့်ကြည့်အကြောင်းကြားခြင်း (ဥပမာ S3 Bucket Public ပွင့်သွားခြင်း)။
- **Security Group Rule Automation:** `0.0.0.0/0` သို့ Port 22 ပွင့်သွားပါက AWS Config Rule က ချက်ချင်း Detect လုပ်ပြီး Lambda ဖြင့် Auto-remediate ပိတ်ပစ်ခြင်း။

---

## ၉။ Production Monitoring, Observability & Incident Response

### ၉.၁ CloudWatch (Logs, Metrics, Alarms, SNS) & Health Checks

- **CloudWatch Metrics:** EC2 CPUUtilization, ALB RequestCount, RDS FreeStorageSpace စသည်တို့ကို စောင့်ကြည့်ခြင်း။
- **CloudWatch Alarms:** CPU 80% ကျော်ပါက သို့မဟုတ် HTTP 5xx Error များလာပါက **Amazon SNS** မှတစ်ဆင့် DevOps Team ၏ Slack သို့မဟုတ် PagerDuty သို့ ချက်ချင်း Alert ပို့ခြင်း။
- **ALB Health Checks:** Backend Server များထံသို့ `/health` endpoint ဖြင့် အမြဲစစ်ဆေးပြီး အဖြေမပြန်သော Unhealthy Server များကို Traffic မပို့ဘဲ ဖယ်ထုတ်ထားခြင်း။

---

### ၉.၂ VPC Flow Logs, Log Retention & Automated Alerting

- **VPC Flow Logs:** Network ပေါ်မှ Port Scanning သို့မဟုတ် Denial-of-Service တိုက်ခိုက်မှုများကို ဖမ်းယူစစ်ဆေးခြင်း။
- **Log Retention Policy:** CloudWatch Logs များကို Never Expire မထားဘဲ ၃၀ ရက် သို့မဟုတ် ၉၀ ရက် သတ်မှတ်ကာ ကုန်ကျစရိတ် ချွေတာခြင်း။

---

### ၉.၃ Auto Scaling, Automated Backup, EventBridge & Lambda Automation

- **Auto Scaling Policy:** Traffic မြင့်တက်လာပါက EC2 အသစ်များကို အလိုအလျောက် မွေးထုတ်ပေးပြီး၊ Traffic ကျသွားပါက ပြန်လည်ရှင်းထုတ်ပေးခြင်း။
- **EventBridge & Lambda Automation:** ညဘက် ရုံးပိတ်ချိန်တွင် Staging EC2 များကို အလိုအလျောက် Stop လုပ်ပြီး မနက်ပိုင်းတွင် ပြန် Start လုပ်ပေးသော Serverless Automation။

---

### ၉.၄ Incident Response Procedures & Disaster Recovery Testing

1. **Detect (သိရှိခြင်း):** CloudWatch Alarm မှ Slack သို့ Alert တက်လာခြင်း။
2. **Triage (အကဲဖြတ်ခြင်း):** Production Downtime လား၊ Performance နှေးကွေးမှုလား ခွဲခြားသတ်မှတ်ခြင်း။
3. **Mitigate (ထိန်းသိမ်းသက်သာစေခြင်း):** Backup သို့မဟုတ် Version အဟောင်းသို့ Rollback ချက်ချင်း ပြုလုပ်ခြင်း။
4. **Post-Mortem (သုံးသပ်ခြင်း):** အနာဂတ်တွင် ထပ်မဖြစ်စေရန် Root Cause Analysis (RCA) ပြုလုပ်ပြီး Runbook ရေးဆွဲခြင်း။

---

## ၁၀။ Cloud Cost Optimization (FinOps)

### ၁၀.၁ AWS Pricing Models, Savings Plans, Instance Types & S3 Classes

- **On-Demand:** စိတ်ကြိုက် သုံးစွဲပြီး အချိန်မရွေး ပိတ်နိုင်သည် (ဈေးအကြီးဆုံး)။
- **Compute Savings Plans / Reserved Instances (RI):** ၁ နှစ် သို့မဟုတ် ၃ နှစ် အသုံးပြုမည်ဟု ကတိပြုပါက **72% အထိ လျှော့စျေးရရှိသည်** (Production Servers အတွက် မဖြစ်မနေ သုံးသင့်သည်)။
- **Graviton Processors (ARM-based - ဥပမာ `t4g`, `c7g`):** သမားရိုးကျ x86 ထက် ဈေးနှုန်း ၂၀% သက်သာပြီး စွမ်းဆောင်ရည် ၄၀% ပိုမိုမြင့်မားသည်။
- **S3 Storage Classes:** ရက်ပေါင်း ၃၀ ကျော်သော Data များကို S3 Standard မှ Standard-IA သို့လည်းကောင်း၊ ရက် ၉၀ ကျော်ပါက S3 Glacier သို့လည်းကောင်း Lifecycle Rules ဖြင့် ပြောင်းရွှေ့သိမ်းဆည်းခြင်း။

---

### ၁၀.၂ NAT Gateway Costs, Data Transfer, Budgets & Cost Explorer

- **NAT Gateway ကုန်ကျစရိတ် လျှော့ချခြင်း:** AWS NAT Gateway သည် တစ်နာရီလျှင် ပုံသေကြေးအပြင် Data Transfer ကြေး ကောက်ခံသဖြင့် S3 သို့ သွားသော Data များကို **VPC Gateway Endpoint (အခမဲ့)** ဖြင့် လမ်းကြောင်းလွှဲပေးရမည်။
- **AWS Budgets:** လစဉ် Cloud ကုန်ကျစရိတ် $500 သတ်မှတ်ထားပြီး 80% ($400) ရောက်ပါက အီးမေးလ်ဖြင့် ကြိုတင် Alert ပေးရန် သတ်မှတ်ခြင်း။
- **AWS Cost Explorer:** နေ့စဉ်နှင့် လစဉ် မည်သည့် Service က ပိုက်ဆံအများဆုံး စားနေသည်ကို Chart များဖြင့် ခွဲခြမ်းစိတ်ဖြာခြင်း။

---

### ၁၀.၃ Cost Allocation Tags, Idle Resource Cleanup & Nightly Shutdown

- **Cost Allocation Tags:** Resource တိုင်းတွင် `Environment = Production / Staging`, `Project = Marketing` ဟု Tag ကပ်ထားခြင်းဖြင့် ဘယ်ဌာနက ပိုက်ဆံဘယ်လောက် သုံးသည်ကို စစ်ဆေးနိုင်ခြင်း။
- **Idle Resources ဖယ်ရှားခြင်း:** မသုံးတော့ဘဲ မေ့ကျန်နေသော Unattached Elastic IPs, Old EBS Snapshots, Unused Load Balancers များကို ပုံမှန် ရှင်းထုတ်ခြင်း။

---

## ၁၁။ လက်တွေ့ Production Projects (Hands-on Projects)

### Project 1 — AWS Production Network Setup
1. VPC တစ်ခု (`10.0.0.0/16`) တည်ဆောက်ပါ။
2. Public Subnet ၂ ခုနှင့် Private Subnet ၂ ခုကို Availability Zone ၂ ခု (AZ-a, AZ-c) ခွဲ၍ တည်ဆောက်ပါ။
3. Internet Gateway တပ်ဆင်ပြီး Public Route Table ချိတ်ဆက်ပါ။
4. Public Subnet တွင် NAT Gateway ထားရှိပြီး Private Route Table ချိတ်ဆက်ပါ။
5. EC2 Instance တစ်ခုကို Private Subnet ထဲတွင် ထားရှိပြီး **AWS Systems Manager (Session Manager)** ဖြင့် Port 22 မဖွင့်ဘဲ ဝင်ရောက်စမ်းသပ်ပါ။

---

### Project 2 — Web Application Deployment
1. Private Subnet ထဲရှိ EC2 ပေါ်တွင် Nginx Web Server နှင့် Backend App (PHP/Node) တင်ပါ။
2. Public Subnet တွင် Internet-Facing Application Load Balancer (ALB) တည်ဆောက်ပြီး EC2 သို့ ချိတ်ဆက်ပါ။
3. Private DB Subnet တွင် Multi-AZ Amazon RDS MySQL ချိတ်ဆက်ပါ။
4. Static Media Upload များအတွက် Amazon S3 Bucket ဖန်တီးပြီး IAM Role ဖြင့် ချိတ်ဆက်ပါ။
5. Route 53 Domain နှင့် AWS ACM SSL Certificate ချိတ်တွဲကာ HTTPS (Port 443) ဖြင့် ဝင်ရောက်စမ်းသပ်ပါ။

---

### Project 3 — Infrastructure Automation (IaC)
1. Terraform ကို အသုံးပြု၍ အထက်ပါ VPC, Subnets, Route Tables, Security Groups များကို Code အဖြစ် ရေးသားပါ။
2. `terraform.tfstate` ကို Amazon S3 Remote State နှင့် DynamoDB Lock ဖြင့် သိမ်းဆည်းပါ။
3. Git Repository ထဲ သိမ်းဆည်းပြီး `terraform plan` ဖြင့် ပြင်ဆင်ချက်များကို Review လုပ်ပါ။
4. `terraform apply` ဖြင့် Cloud ပေါ်တွင် Infrastructure တစ်ခုလုံးကို စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် တည်ဆောက်ပြနိုင်ကြောင်း စမ်းသပ်ပါ။

---

### Project 4 — CI/CD Automation Pipeline
1. GitHub Actions Workflow ရေးဆွဲပါ။
2. Developer က Git Push လုပ်တိုင်း Automated Unit Tests များ Run ပါ။
3. Docker Image Build လုပ်ပြီး **Amazon ECR** သို့ Push လုပ်ပါ။
4. **Amazon ECS Fargate** သို့ Service Update ဖြင့် Zero-Downtime Rolling Deployment လုပ်ပါ။
5. Deployment အပြီး ALB Health Check စစ်ဆေးပြီး Error ဖြစ်ပါက အလိုအလျောက် Rollback ပြန်ဆင်းနိုင်ကြောင်း စမ်းသပ်ပါ။

---

## 🎯 အနှစ်ချုပ်နှင့် နောက်ဆက်တွဲ လေ့လာရန်

ဤလမ်းညွှန်သည် Networking အခြေခံများမှသည် Enterprise Cloud Architecture နှင့် Automation အထိ လိုအပ်သော အခြေခံအုတ်မြစ်အားလုံးကို ပြည့်စုံစွာ လွှမ်းခြုံပေးထားပါသည်။ သင်ခန်းစာတစ်ခုချင်းစီ၏ လက်တွေ့ Command များနှင့် Configuration များကို ကိုယ်တိုင် Hands-on Lab အနေဖြင့် စမ်းသပ်လေ့ကျင့်သွားပါရန် တိုက်တွန်းအပ်ပါသည်။
