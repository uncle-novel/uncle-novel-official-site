---
author: Unclezs
title: Java8新特性之函数式接口
seo_title: Java8新特性之函数式接口
description: 如果一个接口中，只声明了一个抽象方法，则此接口就称为函数式接口。
pin: false
tags:
  - lamda
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2018-05-14 15:05:43
updated: 2018-05-14 15:05:43
---

## 什么是函数式接口

如果一个接口中，只声明了一个抽象方法，则此接口就称为函数式接口。可以通过增加@FunctionalInterface注解进行编译时判断。

## JDK提供的函数式接口

<img src="https://gitee.com/unclezs/image-blog/raw/master/blog/20200928151158.png"/>

可以看到JDK提供了大量的函数式接口

### Consumer

故名思意就是提供给你一个对象然后你只需要做对应的处理，也可以说是消费即可。

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

### Supplier

可以当作一个供应商一样，只负责传值

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

### Predicate

断言，也就是传入一个值返回对应的true/false，也可以链式调用

```java
@FunctionalInterface
public interface Predicate<T, R> {
    boolean test(T t);
}

public class FunctionTest {
    public static void main(String[] args) {
        System.out.println(aAndB(n -> n < 101, n -> n > 10));
    }

    public static boolean aAndB(Predicate<Integer> a, Predicate<Integer> b){
        return a.and(b).test(100);
    }
}

```

### Function

也就是通过接受一个值，处理过后返回一个值

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

## 自定义函数式接口

在JDK中，只要接口只有一个抽象方法即可当作函数式接口，也就是说我们可以不加@FunctionalInterface

```java
public interface MyConsumer {
    void doIt();
}
```

当然如果加上了则会在编译的时候自动判断是否定义正确的。