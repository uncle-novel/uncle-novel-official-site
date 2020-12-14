---
author: Unclezs
title: Java中final关键词详解
seo_title: Java中final关键词详解
description: final 关键字看上去简单，但是真正深入理解的人可以说少之又少，读完本文你就知道我在说什么了。本文将常规的用法简化，提出一些用法和深入的思考。
pin: false
tags:
  - Java
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2018-05-17 16:47:30
updated: 2018-05-17 16:47:30
---

## 简介

final 关键字看上去简单，但是真正深入理解的人可以说少之又少，读完本文你就知道我在说什么了。本文将常规的用法简化，提出一些用法和深入的思考。
可能 

## 不同的作用域

### 作用与类

当某个类的整体定义为final时，就表明了你不能打算继承该类，而且也不允许别人这么做。即这个类是不能有子类的。

**注意：** final类中的所有方法都隐式为final，因为无法覆盖他们，所以在final类中给任何方法添加final关键字是没有任何意义的。

### 作用于方法

- private 方法是隐式的final
- final方法是可以被重载的

### 修饰参数

Java允许在参数列表中以声明的方式将参数指明为final，这意味这你无法在方法中更改参数引用所指向的对象。这个特性主要用来向匿名内部类传递数据。

### 修饰变量

> 常规的用法比较简单，这里通过下面三个问题进一步说明。

**1. 编译期常量和非编译期常量**

```java
public class Test {
    //编译期常量
    final int i = 1;
    final static int J = 1;
    final int[] a = {1,2,3,4};
    //非编译期常量
    Random r = new Random();
    final int k = r.nextInt();

    public static void main(String[] args) {

    }
}
```

k的值由随机数对象决定，所以不是所有的final修饰的字段都是编译期常量，只是k的值在被初始化后无法被更改。

**2. static final**

一个既是static又是final 的字段只占据一段不能改变的存储空间，它必须在定义的时候进行赋值，或者在静态代码块进行赋值，否则编译器将不予通过。

**3. blank final**

Java允许生成空白final，也就是说被声明为final但又没有给出定值的字段，但是必须在该字段被使用之前被赋值，这给予我们两种选择：

- 在定义处进行赋值(这不叫空白final) 
- 在构造器中进行赋值，保证了该值在被使用前赋值。 

这增强了final的灵活性。

## final域重排序规则

按照final修饰的数据类型分类： 

### 基本数据类型

- final域写：禁止final域写与构造方法重排序，即禁止final域写重排序到构造方法之外，从而保证该对象对所有线程可见时，该对象的final域全部已经初始化过。 
- final域读：禁止初次读对象的引用与读该对象包含的final域的重排序。 

### 引用数据类型

额外增加约束：禁止在构造函数对一个final修饰的对象的成员域的写入与随后将这个被构造的对象的引用赋值给引用变量 重排序

## final的实现原理

写final域会要求编译器在final域写之后，构造函数返回前插入一个StoreStore屏障。读final域的重排序规则会要求编译器在读final域的操作前插入一个LoadLoad屏障。

 很有意思的是，如果以X86处理为例，X86不会对写-写重排序，所以StoreStore屏障可以省略。由于不会对有间接依赖性的操作重排序，所以在X86处理器中，读final域需要的LoadLoad屏障也会被省略掉。也就是说，以X86为例的话，对final域的读/写的内存屏障都会被省略！具体是否插入还是得看是什么处理器