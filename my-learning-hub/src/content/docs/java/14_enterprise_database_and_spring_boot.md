---
title: "14. Enterprise Database, JPA & Spring Boot"
description: "JDBC မှ Connection Pooling (HikariCP)၊ JPA/Hibernate ORM၊ Spring Boot IoC/DI၊ Layered Architecture နှင့် RESTful Microservice တည်ဆောက်ခြင်း (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🏢 အခန်း ၁၄။ Enterprise Database, JPA နှင့် Spring Boot Architecture

၄ နှစ် လုပ်သက်ရှိသော Java Backend Developer တစ်ဦး၏ အဓိက တာဝန်မှာ Core Java စွမ်းရည်များကို အသုံးချ၍ **Database များနှင့် ထိရောက်စွာ ချိတ်ဆက်ခြင်း**၊ **ORM စနစ်များ အသုံးချခြင်း** နှင့် **Spring Boot Enterprise Microservices** များကို စံချိန်စံညွှန်းမီ တည်ဆောက်နိုင်ခြင်း ဖြစ်ပါသည်။

---

## 🏛️ ၁။ Database ချိတ်ဆက်မှု ဆင့်ကဲပြောင်းလဲလာပုံ (Evolution)

```
[Raw JDBC] ───────────> [Connection Pool (HikariCP)] ───────────> [JPA / Hibernate ORM]
(Manual SQL Strings)     (Pre-created reusable TCP connections)     (Object-Oriented Entity Mapping)
```

### (က) Raw JDBC နှင့် SQL Injection ကာကွယ်ခြင်း:
```java
// ❌ ANTI-PATTERN: Statement (SQL Injection ဖြစ်နိုင်သည်)
// String sql = "SELECT * FROM users WHERE email = '" + userInput + "'";

// ✅ BEST PRACTICE: PreparedStatement (Parameterized Query)
String sql = "SELECT id, email, balance FROM users WHERE email = ? AND status = ?";
try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
    pstmt.setString(1, email);
    pstmt.setString(2, "ACTIVE");
    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            double balance = rs.getDouble("balance");
        }
    }
}
```

### (ခ) HikariCP Connection Pooling အဘယ်ကြောင့် လိုအပ်သနည်း?
Web request တစ်ခု ဝင်လာတိုင်း Database ထံသို့ TCP Handshake ပြုလုပ်ကာ Connection အသစ်ဆောက်ခြင်းသည် အလွန် Memory နှင့် အချိန် ကုန်ကျပါသည်။ **HikariCP** သည် JVM ထဲတွင် Connection အသင့်အရေအတွက် (ဥပမာ 10 ခု) ကို ကြိုတင်ဖွင့်ထားပြီး Request ပြီးပါက Pool ထဲသို့ ချက်ချင်း ပြန်လည်အပ်နှံစေပါသည်။

---

## 🍃 ၂။ Spring Boot Core: IoC (Inversion of Control) နှင့် DI

Spring Framework ၏ နှလုံးသားမှာ **Dependency Injection (DI)** ဖြစ်ပြီး Object များကို Developer က `new` မခေါ်တော့ဘဲ Spring IoC Container က အလိုအလျောက် Lifecycle ကို စီမံပေးခြင်း ဖြစ်သည်:

```
+───────────────────────────────────────────────+
|         Spring IoC Container                  |
|                                               |
|  [UserRepository] ──(Injected into)──> [UserService] ──> [UserController]
|                                               |
+───────────────────────────────────────────────+
```

### 3-Tier Layered Architecture:
1. **Controller Layer (`@RestController`)**: HTTP Requests များကို လက်ခံပြီး JSON Response ပြန်ပေးသည်။
2. **Service Layer (`@Service`)**: Core Business Logic များနှင့် Transaction Management ကို ကိုင်တွယ်သည်။
3. **Repository Layer (`@Repository`)**: Spring Data JPA ဖြင့် Database Query များကို လုပ်ဆောင်သည်။

---

## 🚀 ၃။ Production-Grade Spring Boot REST Microservice နမူနာ

### အဆင့် ၁: JPA Entity Definition (`User.java`)
```java
package com.company.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private BigDecimal accountBalance;

    // Getters, Setters, Constructors...
}
```

### အဆင့် ၂: Spring Data JPA Repository (`UserRepository.java`)
```java
package com.company.demo.repository;

import com.company.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring က Method အမည်ကို ကြည့်၍ SQL Query အလိုအလျောက် ထုတ်လုပ်ပေးသည်!
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### အဆင့် ၃: Business Service with `@Transactional` (`UserService.java`)
```java
package com.company.demo.service;

import com.company.demo.entity.User;
import com.company.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    // ✅ Recommended: Constructor Injection (Lombok @RequiredArgsConstructor သုံးနိုင်သည်)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional // ACID Transaction: Error တက်ပါက DB သို့ အလိုအလျောက် Rollback ပြုလုပ်မည်
    public User registerUser(User newUser) {
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new IllegalArgumentException("Email already registered!");
        }
        return userRepository.save(newUser);
    }
}
```

### အဆင့် ၄: RESTful API Controller (`UserController.java`)
```java
package com.company.demo.controller;

import com.company.demo.entity.User;
import com.company.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User request) {
        User savedUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
```

---

## 🏆 ၄။ Java Senior Developer တစ်ဦး၏ စံနှုန်းများ

လုပ်ငန်းခွင်တွင်  Developer တစ်ဦးသည် အောက်ပါ အရည်အသွေးများကို ပြသနိုင်ရပါမည်:

1. **Transaction Pitfalls နားလည်ခြင်း**: `@Transactional` သည် Spring AOP Proxy ဖြင့် အလုပ်လုပ်သောကြောင့် Same-class self-invocation (ဥပမာ `this.doSomething()`) လုပ်ပါက Transaction အလုပ်မလုပ်ကြောင်း သိရှိရမည်။
2. **N+1 Query Problem ဖြေရှင်းနိုင်ခြင်း**: JPA တွင် `@ManyToOne` သို့မဟုတ် `@OneToMany` ဆက်နွယ်မှုများ၌ Lazy loading ကြောင့် Query အကြိမ်ပေါင်းများစွာ ထပ်ခေါ်နေခြင်းကို `JOIN FETCH` သို့မဟုတ် `@EntityGraph` ဖြင့် အမြန်ဆုံး ဖြေရှင်းနိုင်ရမည်။
3. **Automated Testing စွမ်းရည်**: Unit Test များကို **JUnit 5** နှင့် **Mockito** အသုံးပြု၍ Controller မှ Service အထိ Coverage ပြည့်မီစွာ ရေးသားနိုင်ရမည်။
4. **Clean Code & Design Principles**: SOLID စည်းမျဉ်းများ၊ Loose Coupling နှင့် Immutable DTO များကို စနစ်တကျ အသုံးချနိုင်ရမည်။

---

## 🎯 အနှစ်ချုပ်

1. Database queries များတွင် SQL Injection ကို ကာကွယ်ရန် **`PreparedStatement`** ကို သုံးပြီး၊ စွမ်းဆောင်ရည်အတွက် **HikariCP Connection Pool** ကို မဖြစ်မနေ အသုံးပြုပါ။
2. **JPA/Hibernate** သည် Database Table များနှင့် Java Objects များကို ချိတ်ဆက်ပေးပြီး SQL ရေးသားမှုကို လျှော့ချပေးသည်။
3. Spring Boot တွင် **Constructor Injection** ကို ဦးစားပေးသုံးပြီး `@Transactional` ဖြင့် Database Data Integrity ကို ကာကွယ်ပါ။
4. 3-Tier Layered Architecture (Controller -> Service -> Repository) ဖြင့် စနစ်ကို Clean & Maintainable ဖြစ်အောင် တည်ဆောက်ပါ။
