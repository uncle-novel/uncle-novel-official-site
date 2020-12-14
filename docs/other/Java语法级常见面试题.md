---
title: Java语法级常见面试题
description: 记录一些基础的Java面试题。
tags:
  - 面试
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2020-09-08 15:15:04
---

## 重载和重写区别

###  重写（Override）

发生在运行时期。

存在于继承体系中，指子类实现了一个与父类在方法声明上完全相同的一个方法。

为了满足里式替换原则，重写有以下三个限制：

- 子类方法的访问权限必须大于等于父类方法；
- 子类方法的返回类型必须是父类方法返回类型或为其子类型。
- 子类方法抛出的异常类型必须是父类抛出异常类型或为其子类型。

使用 @Override 注解，可以让编译器帮忙检查是否满足上面的三个限制条件。

### 重载（Overload）

发生在编译时期

存在于同一个类中，指一个方法与已经存在的方法名称上相同，但是参数类型、个数、顺序至少有一个不同。

应该注意的是，返回值不同，其它都相同不算是重载。

## 抽象类和接口区别

1. 一个子类只能继承一个抽象类,但能实现多个接口 
2. 抽象类可以有构造方法,接口没有构造方法 
3. 抽象类可以有普通成员变量,接口没有普通成员变量 
4. 抽象类和接口都可有静态成员变量,抽象类中静态成员变量访问类型任意，接口只能public static final(默认) 
5. 抽象类可以没有抽象方法,抽象类可以有普通方法,接口中都是抽象方法 
6. 抽象类可以有静态方法，接口不能有静态方法 （1.8中可以有静态方法，但是必须实现）
7. 抽象类中的方法可以是public、protected;接口方法只有public abstract

## 重载的一些问题

```java
public class AppTest {
    public static void main(String[] args) {
        b(1,null);  //A行
        a(null);  //B行
    }

    public static void a(Object a) {

    }

    public static void a(String a) {

    }
    
    public static void b(Integer ab,String a) {

    }
    public static void b(Integer ab,String... a) {

    }
}
```

其中A行报错，因为找到了两个方法。
B行调用的是a(String a)方法，也就代表优先选择子类。

## try_catch_finally

```java
public class FinallyTest {
    public static void main(String[] args) {
        System.out.println(test());
    }

    private static int test() {
        try {
            int a = 1 / 0;
            return 1;
        } catch (Exception e) {
            System.out.println("catch");
            return 2;
        } finally {
            System.out.println("finally");
            return 3;
        }
    }
}
运行打印
catch
finally
3
```

finally不管有没有异常都要处理当try和catch中有return时，finally仍然会执行，finally比return先执行不管有木有异常抛出, finally在return返回前执行finally是在return后面的表达式运算后执行的(此时并没有返回运算后的值，而是先把要返回的值保存起来，管finally中的代码怎么样，返回的值都不会改变，仍然是之前保存的值)，所以函数返回值是在finally执行前确定的

注意: finally中最好不要包含return，否则程序会提前退出，返回值不是try或catch中保存的返回值 finally不执行的几种情况: 程序提前终止如调用了System.exit, 病毒，断电