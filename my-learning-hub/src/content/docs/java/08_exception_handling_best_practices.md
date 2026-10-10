---
title: "08. Enterprise Exception Handling"
description: "Throwable Hierarchy၊ Checked vs Unchecked Exceptions၊ try-with-resources၊ Custom Domain Exceptions နှင့် Production Best Practices (မြန်မာဘာသာ အသေးစိတ်)"
---

# 🛑 အခန်း ၈။ Enterprise Exception Handling အကောင်းဆုံး အလေ့အကျင့်များ

ဆော့ဖ်ဝဲလ်တစ်ခုသည် ပုံမှန်အခြေအနေတွင်သာမက မမျှော်လင့်ထားသော အမှားများ (ဥပမာ Network ကျသွားခြင်း၊ Database ချိတ်မရခြင်း၊ Input အချက်အလက် မှားယွင်းခြင်း) နှင့် ကြုံတွေ့ရသည့်အခါ စနစ်တစ်ခုလုံး Crash မဖြစ်ဘဲ သေသေသပ်သပ် ပြန်လည်ကုစားနိုင်ရန် (**Resilience**) အတွက် Exception Handling ကို စနစ်တကျ ရေးသားရန် လိုအပ်ပါသည်။

---

## 🏛️ ၁။ Java `Throwable` Hierarchy Architecture

Java တွင် Error နှင့် Exception အားလုံးသည် `java.lang.Throwable` Class ထံမှ ဆင်းသက်ပါသည်:

```
                          +------------------------+
                          |  java.lang.Throwable   |
                          +------------------------+
                                       ▲
                   ┌───────────────────┴───────────────────┐
                   │                                       │
     +---------------------------+           +---------------------------+
     |     java.lang.Error       |           |   java.lang.Exception     |
     | (JVM Critical Failures)   |           | (Recoverable Conditions)  |
     | - OutOfMemoryError        |           +---------------------------+
     | - StackOverflowError      |                         ▲
     | ⚠️ ဘယ်တော့မှ Catch မလုပ်ရပါ |           ┌─────────────┴─────────────┐
     +---------------------------+           │                           │
                               +-------------------------+   +-------------------------+
                               |    Checked Exceptions   |   |   java.lang.            |
                               | (Compile-time Enforced) |   |   RuntimeException      |
                               | - IOException           |   |  (Unchecked Exceptions) |
                               | - SQLException          |   | - NullPointerException  |
                               | - ClassNotFoundException|   | - IllegalArgumentEx     |
                               +-------------------------+   +-------------------------+
```

### (က) Error (Do NOT Catch!)
JVM ၏ စက်ပိုင်းဆိုင်ရာ ပြင်းထန်သော ပြဿနာများဖြစ်ပြီး ပရိုဂရမ်က ပြန်လည်ကုစားရန် မဖြစ်နိုင်ပါ။ (ဥပမာ RAM ကုန်သွားခြင်း)။ `try-catch` ဖြင့် မဖမ်းသင့်ပါ။

### (ခ) Checked Exceptions (Compile-Time Enforced)
`RuntimeException` မှအပ အခြား `Exception` အားလုံးဖြစ်ပါသည်။ Compiler က မဖြစ်မနေ `try-catch` လုပ်ရန် သို့မဟုတ် Method Signature တွင် `throws` ကြေညာရန် ဖိအားပေးပါသည် (ဥပမာ File ဖတ်ခြင်း၊ Database ချိတ်ဆက်ခြင်း)။

### (ဂ) Unchecked Exceptions (`RuntimeException`)
Developer ၏ ကုဒ်ရေးသားမှု အားနည်းချက် (Logic Bugs) ကြောင့် ဖြစ်ပေါ်လေ့ရှိသည်။ Compiler က ဖမ်းရန် မတိုက်တွန်းဘဲ Runtime တွင် ဖြစ်ပေါ်ပါသည် (ဥပမာ `NullPointerException`, `IndexOutOfBoundsException`)။

---

## 🔄 ၂။ Modern Resource Management: `try-with-resources`

Java 7 မတိုင်မီက Database Connection သို့မဟုတ် File Stream များကို ပိတ်ရန် `finally` block ထဲတွင် ရေးသားရပြီး Boilerplate ကုဒ်များစွာ ရှုပ်ထွေးခဲ့သည်။ Java 7 မှစတင်ကာ **`AutoCloseable`** Interface ကို အခြေခံသော **`try-with-resources`** ကို အသုံးပြုနိုင်ပါသည်:

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ResourceManagementDemo {

    // ✅ BEST PRACTICE: try-with-resources ဖြင့် ရေးသားခြင်း
    // BufferedReader နှင့် FileReader တို့သည် AutoCloseable ဖြစ်သဖြင့် 
    // Exception တက်သည်ဖြစ်စေ၊ အောင်မြင်သည်ဖြစ်စေ JVM က အလိုအလျောက် close() ခေါ်ပေးသည်!
    public static void readFileModern(String filePath) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("File ဖတ်ရှုရာတွင် ပြဿနာ ဖြစ်ပွားခဲ့သည်: " + e.getMessage());
        }
    }
}
```

---

## 🎯 ၃။ Custom Domain Exceptions တည်ဆောက်ခြင်း

Enterprise Application များတွင် Generic `Exception` သို့မဟုတ် `RuntimeException` အစား လုပ်ငန်းခွင်နှင့် ကိုက်ညီသော **Custom Domain Exceptions** များကို ရေးသားအသုံးပြုသင့်ပါသည်:

```java
// 1. Base Business Runtime Exception
public class BusinessException extends RuntimeException {
    private final String errorCode;

    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

// 2. Specific Domain Exception
public class InsufficientBalanceException extends BusinessException {
    public InsufficientBalanceException(double currentBalance, double requestedAmount) {
        super("ငွေထုတ်ယူရန် မလုံလောက်ပါ - လက်ရှိ: " + currentBalance + ", လိုအပ်ချက်: " + requestedAmount,
              "ERR_INSUFFICIENT_FUNDS");
    }
}
```

---

## 🚨 ၄။ Senior Production Best Practices (ရှောင်ရန် / ဆောင်ရန်)

### (၁) Exception Swallowing ကို လုံးဝ မပြုလုပ်ပါနှင့် (Never Swallow Exceptions!)
```java
// ❌ CATASTROPHIC ANTI-PATTERN:
try {
    paymentGateway.chargeCustomer(order);
} catch (Exception e) {
    // Empty catch block! Error ဖြစ်သွားသည်ကို ဘယ်သူမှ မသိရတော့ဘဲ စနစ်အတွင်း ငွေလိမ်လည်မှုများ ဖြစ်ပေါ်နိုင်သည်!
}

// ✅ BEST PRACTICE: သေချာ Log မှတ်ပါ သို့မဟုတ် Custom Exception ဖြင့် Wrap လုပ်ပါ
try {
    paymentGateway.chargeCustomer(order);
} catch (PaymentGatewayException e) {
    logger.error("Payment failed for order: {}", order.getId(), e);
    throw new OrderProcessingException("Payment gateway unreachable", e); // Exception Chaining
}
```

### (၂) Exception Chaining (Cause ထည့်သွင်းခြင်း)
Exception အသစ်တစ်ခု ပစ်သည့်အခါ မူရင်း Root Cause ကို မပျောက်ပျက်စေရန် Constructor ထဲသို့ မူရင်း exception `e` ကို ထည့်သွင်းပါ:
```java
throw new ServiceException("Database query failed", e); // 'e' ကို ထည့်သွင်းခြင်းဖြင့် Stack trace အပြည့်အစုံ ကျန်ရစ်မည်
```

### (၃) Multi-Catch Blocks
Java 7+ တွင် ဆင်တူသော Exception များကို Pipe (`|`) ဖြင့် တပြိုင်နက် ဖမ်းယူနိုင်သည်:
```java
try {
    executeTask();
} catch (IOException | SQLException e) {
    logger.error("IO or Database failure: " + e.getMessage(), e);
}
```

---

## 🎯 အနှစ်ချုပ်

1. `Error` များကို `catch` မလုပ်ပါနှင့်။ Application အဆင့်တွင် `Exception` များကိုသာ ကိုင်တွယ်ပါ။
2. Database, File, Network Socket များကို စီမံခန့်ခွဲရာတွင် **`try-with-resources`** ကို အမြဲတမ်း အသုံးပြုပါ။
3. အရေးကြီးသော Business Logic များအတွက် **Custom Domain Exceptions** များကို ဖန်တီးပါ။
4. Catch block အတွင်း Exception ကို အသံတိတ် မျိုချခြင်း (`swallowing`) ကို အထူး ရှောင်ကြဉ်ပြီး Logger ဖြင့် စနစ်တကျ မှတ်တမ်းတင်ပါ။
