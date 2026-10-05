---
title: "Course Overview"
description: "ဤလက်စွဲစာအုပ်နှင့် သင်ခန်းစာများသည် MySQL Relational Database Management System (RDBMS) ကို အခြေခံ (Zero / Beginner Level) မှစ၍ လုပ်ငန်းခွင်တွင် သန်းနှင့်ချီသော"
---

## 🐬 MySQL (DBMS) Beginner to Master: လုပ်ငန်းခွင်လက်တွေ့သုံး အဆင့်ဆင့် ပြည့်စုံသော လမ်းညွှန်
### (The Complete Enterprise Relational Database Management System Developer & DBA Guide)

---

## 📌 မိတ်ဆက် (Course Overview)

ဤလက်စွဲစာအုပ်နှင့် သင်ခန်းစာများသည် **MySQL Relational Database Management System (RDBMS)** ကို အခြေခံ (Zero / Beginner Level) မှစ၍ လုပ်ငန်းခွင်တွင် သန်းနှင့်ချီသော Data များကို မြန်ဆန်မှန်ကန်စွာ စီမံနိုင်သော Database Specialist / Senior Backend Engineer / DBA (Database Administrator) အဆင့်အထိ (Master Level) **မြန်မာဘာသာဖြင့် အသေးစိတ် အဆင့်ဆင့်** ရေးသားထားသော ပြည့်စုံသည့် လက်တွေ့လမ်းညွှန် ဖြစ်ပါသည်။

ရိုးရိုး `SELECT *` အဆင့်မှ စတင်ကာ Schema Design, Constraints, Advanced JOINs, Subqueries, Modern Window Functions (MySQL 8.0), Stored Procedures, Triggers, Transactions (ACID), B-Tree Indexing Architecture, `EXPLAIN ANALYZE` ဖြင့် Query Tuning ပြုလုပ်ပုံ၊ သန်းပေါင်းများစွာသော ဒေတာများအတွက် Table Partitioning၊ Master-Slave Replication၊ Point-in-Time Backup & Recovery နှင့် Database Security Hardening အထိ အစုံအလင် ပါဝင်ပါသည်။

---

## 🗺️ MySQL Roadmap (အစမှ အဆုံး လေ့လာရန် လမ်းပြမြေပုံ)

```
========================================================================================
                      [ PHASE 1: DATABASE FOUNDATIONS & ESSENTIALS ]
========================================================================================
   [01. DBMS Architecture] ──► [02. Data Types & DDL] ──► [03. CRUD Operations]
   (Client-Server, InnoDB)     (Tables, Constraints)      (INSERT, UPDATE, DELETE)
                                                                   │
                                                                   ▼
   [06. Relational JOINs]  ◄── [05. Aggregates & GROUP BY] ◄── [04. Filtering & Sorting]
   (INNER, LEFT, E-R Models)   (COUNT, SUM, HAVING, Order) (WHERE, LIKE, Pagination)
========================================================================================
                      [ PHASE 2: INTERMEDIATE SQL & ANALYTICAL MASTERY ]
========================================================================================
   [07. Subqueries & CTEs] ──► [08. Window Functions] ──► [09. Views & Generated Cols]
   (Correlated, Recursive CTE) (RANK, ROW_NUMBER, LEAD)   (Virtual/Stored Columns)
========================================================================================
                      [ PHASE 3: ADVANCED PROGRAMMING & DATA INTEGRITY ]
========================================================================================
   [10. Stored Procedures] ──► [11. Triggers & Events] ──► [12. ACID & Transactions]
   (Functions, Logic Flow)     (Audit Logging, Scheduler) (Isolation, Locking, Deadlocks)
========================================================================================
                      [ PHASE 4: PERFORMANCE TUNING, DBA & PRODUCTION ]
========================================================================================
   [13. Indexing & Optimization] ──► [14. JSON & NoSQL] ──► [15. Table Partitioning]
   (B-Tree, EXPLAIN ANALYZE)         (JSON functions)       (Range, Hash, Big Data)
                                                                   │
                                                                   ▼
   [18. Security & Hardening]   ◄── [17. Replication & HA] ◄── [16. Backup & Recovery]
   (Users, Grants, SQL Injection)   (Master-Slave, GTID)     (mysqldump, PITR, Binlog)
```

---

## 📚 သီးသန့် အခန်းလိုက် သင်ခန်းစာဖိုင်များ (`mysql_lessons/`)

အောက်ပါ ခေါင်းစဉ်တစ်ခုချင်းစီအတွက် အသေးစိတ် ရှင်းလင်းချက်များ၊ Query Flow Diagram များ၊ လက်တွေ့ SQL Scripts များနှင့် Production Troubleshooting များကို `mysql_lessons/` folder ထဲတွင် သီးသန့် ဖိုင်များဖြင့် အသေးစိတ် လေ့လာနိုင်ပါသည်:

### 🌟 အခြေခံ အယူအဆများနှင့် လုပ်ငန်းခွင်သုံး လက်စွဲ (Foundational Concepts & Real Work Guide)

| စဉ် | ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက ရှင်းလင်းချက်များနှင့် လုပ်ငန်းခွင် Task များ |
| :---: | :--- | :--- | :--- |
| **00** | **Core Concepts & Real Work Guide** | [00_beginner_mysql_core_concepts_and_real_work_guide.md](/mysql/00_beginner_mysql_core_concepts_and_real_work_guide/) | Database, RDBMS, Primary Key, Foreign Key, ACID, Indexing, JOINs ဆိုတာဘာလဲ၊ ဘာကြောင့်သုံးသလဲ၊ မသုံးရင်ဘာဖြစ်မလဲ၊ လုပ်ငန်းခွင် Tasks များ |

---

### 🐬 အပိုင်း (၁) - Database အခြေခံနှင့် SQL Core (Foundations & CRUD)

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **01** | **DBMS Architecture & Storage Engines** | [01_intro_and_dbms_architecture.md](/mysql/01_intro_and_dbms_architecture/) | What is RDBMS?, Client-Server Model (mysqld vs client, port 3306), InnoDB vs MyISAM vs Memory, SQL Standards |
| **02** | **Data Types & Schema Design** | [02_datatypes_and_table_schema_design.md](/mysql/02_datatypes_and_table_schema_design/) | Numerical (INT, BIGINT, DECIMAL), Strings (VARCHAR vs CHAR), Dates, Constraints (PK, FK, UNIQUE, CHECK, NOT NULL) |
| **03** | **CRUD Operations & DML Essentials** | [03_crud_and_sql_essentials.md](/mysql/03_crud_and_sql_essentials/) | DDL, DML, DQL, DCL, TCL ခွဲခြားခြင်း၊ `INSERT` (Bulk insert), `SELECT`, `UPDATE`, `DELETE` vs `TRUNCATE`, Safe Updates |
| **04** | **Filtering, Sorting & Pagination** | [04_filtering_sorting_and_pagination.md](/mysql/04_filtering_sorting_and_pagination/) | `WHERE` operators (`LIKE`, `IN`, `BETWEEN`), `ORDER BY`, `LIMIT` & `OFFSET` (Pagination mathematics and performance) |

---

### 📊 အပိုင်း (၂) - Relational Modeling နှင့် Intermediate SQL

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **05** | **Aggregate Functions & Grouping** | [05_aggregate_functions_and_grouping.md](/mysql/05_aggregate_functions_and_grouping/) | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING` vs `WHERE`, SQL Query Execution Order (Logical Processing) |
| **06** | **Relational Queries & JOINs** | [06_joins_and_relational_queries.md](/mysql/06_joins_and_relational_queries/) | 1:1, 1:N, N:M Pivot Tables, `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `CROSS JOIN`, `SELF JOIN`, Anti-joins |
| **07** | **Subqueries & Common Table Expressions (CTEs)** | [07_subqueries_and_common_table_expressions_ctes.md](/mysql/07_subqueries_and_common_table_expressions_ctes/) | Scalar Subqueries, Correlated Subqueries, `EXISTS` vs `IN`, CTE (`WITH ... AS`), Recursive CTEs for Hierarchy Trees |
| **08** | **Window Functions & Analytics (MySQL 8.0)** | [08_window_functions_and_analytical_queries.md](/mysql/08_window_functions_and_analytical_queries/) | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`, `OVER (PARTITION BY ... ORDER BY ...)`, Running Totals |

---

### ⚙️ အပိုင်း (၃) - Database Programming နှင့် ACID Concurrency

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **09** | **Views & Generated Columns** | [09_views_and_generated_columns.md](/mysql/09_views_and_generated_columns/) | Database Views, Updatable Views, Security Abstraction, Virtual vs Stored Generated Columns |
| **10** | **Stored Procedures & Functions** | [10_stored_procedures_and_functions.md](/mysql/10_stored_procedures_and_functions/) | Stored Procedures (`IN`, `OUT`, `INOUT`), Custom Functions, Control Flow (`IF`, `CASE`, `WHILE`), Error Handlers |
| **11** | **Triggers & Event Scheduler** | [11_triggers_and_event_scheduler.md](/mysql/11_triggers_and_event_scheduler/) | Triggers (`BEFORE`/`AFTER`, `NEW`/`OLD`), Audit Trail Logging, MySQL Event Scheduler for Automated Maintenance |
| **12** | **ACID Transactions, Locking & Deadlocks** | [12_transactions_acid_and_concurrency.md](/mysql/12_transactions_acid_and_concurrency/) | Atomicity, Consistency, Isolation, Durability, Isolation Levels, Row-level Locking (`FOR UPDATE`), Deadlock Prevention |

---

### 🚀 အပိုင်း (၄) - Performance Tuning, Scaling & DBA Master

| စဉ် | သင်ခန်းစာ ခေါင်းစဉ် | သီးသန့် လေ့လာရန် ဖိုင်လမ်းကြောင်း | အဓိက သင်ယူရမည့် အကြောင်းအရာများ |
| :---: | :--- | :--- | :--- |
| **13** | **B-Tree Indexing & Query Optimization** | [13_indexing_deep_dive_and_query_optimization.md](/mysql/13_indexing_deep_dive_and_query_optimization/) | B-Tree Structure, Clustered vs Secondary Indexes, Composite Index Leftmost Prefix Rule, `EXPLAIN ANALYZE` Tuning |
| **14** | **JSON Data Types & NoSQL in MySQL** | [14_json_datatypes_and_nosql_in_mysql.md](/mysql/14_json_datatypes_and_nosql_in_mysql/) | Native `JSON` Type, Operators (`->`, `->>`), Functions (`JSON_EXTRACT`, `JSON_CONTAINS`), Virtual Column Indexing |
| **15** | **Table Partitioning for Big Data** | [15_partitioning_and_large_scale_data.md](/mysql/15_partitioning_and_large_scale_data/) | Range, List, Hash, Key Partitioning, Partition Pruning, သန်းပေါင်းများစွာသော Logs/Data များ စီမံခန့်ခွဲပုံ |
| **16** | **Backup, Restore & Disaster Recovery** | [16_mysql_backup_restore_and_disaster_recovery.md](/mysql/16_mysql_backup_restore_and_disaster_recovery/) | `mysqldump` Production Flags, Binary Logging (Binlog), Point-in-Time Recovery (PITR), Automated S3 Backups |
| **17** | **Replication, High Availability & Clustering** | [17_replication_high_availability_and_clustering.md](/mysql/17_replication_high_availability_and_clustering/) | Source-Replica (Master-Slave) Asynchronous Replication, GTID, Read/Write Splitting, Group Replication Overview |
| **18** | **Security, User Privileges & Hardening** | [18_security_user_privileges_and_hardening.md](/mysql/18_security_user_privileges_and_hardening/) | User Roles & Privileges (`GRANT`/`REVOKE`), Principle of Least Privilege, SQL Injection Defense, `my.cnf` Hardening |
| **19** | **Query Mental Model & Complex Real-World Architecture** | [19_query_mental_model_and_complex_real_world_architecture.md](/mysql/19_query_mental_model_and_complex_real_world_architecture/) | Query ရေးသားရာတွင် တွေးခေါ်ရမည့် အခြေခံ စည်းမျဉ်း ၆ ချက်၊ SARGability၊ Multi-Vendor FinTech Ledger Schema နှင့် Complex Report Queries |

---

## 🛠️ စတင်လေ့လာရန် လိုအပ်သော Tools များ (Prerequisites)

1. **MySQL Server 8.0+** (သို့မဟုတ် Docker ဖြင့် `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret mysql:8.0`)
2. **GUI Client Tool**: **DBeaver** (အခမဲ့ Open-Source အကြံပြုသည်), **MySQL Workbench**, သို့မဟုတ် **TablePlus**
3. **Command Line Client**: `mysql` CLI

မိတ်ဆွေအနေဖြင့် ပထမဆုံး သင်ခန်းစာ [01_intro_and_dbms_architecture.md](/mysql/01_intro_and_dbms_architecture/) မှ စတင်၍ အဆင့်ဆင့် လေ့လာနိုင်ပါသည်။
