---
title: endorsed覆盖JDK中的类
description: endorsed技术是为了覆盖JDK提供的类。但是能够覆盖的类是有限制的，其中不包括java.lang包中的类(出于安全的考虑)
tags:
  - endorsed
  - Java
categories:
  - Java
toc: true
comments: true
date: 2020-07-24 09:42:42
---

## 介绍

endorsed技术是为了覆盖JDK提供的类。但是能够覆盖的类是有限制的，其中不包括java.lang包中的类(出于安全的考虑)。
两种方式：
1. 指定VM参数 -Djava.endorsed.dirs 指定的目录面放置的jar文件，
2. 可以在$JAVA_HOME/jre/lib/endorsed目录存放jar文件而不使用VM参数的方式实现。

## 具体测试

### VM参数

使用Date对象做测试，把Date对象从JDK拷贝出来，再构造中加入
```java
 /**
     * Allocates a <code>Date</code> object and initializes it to
     * represent the specified number of milliseconds since the
     * standard base time known as "the epoch", namely January 1,
     * 1970, 00:00:00 GMT.
     *
     * @param   date   the milliseconds since January 1, 1970, 00:00:00 GMT.
     * @see     java.lang.System#currentTimeMillis()
     */
    public Date(long date) {
        fastTime = date;
        System.out.println("创建了时间实例");
    }
```

然后就是jar包，图方便，我直接编译好Date.css，然后创建文件夹java/util/，把class文件放入进去
<img src="https://gitee.com/unclezs/image-blog/raw/master//blog/20200724095314.png"/>
zip后改后缀名xxx.jar。

编写测试：
```java
 public static void main(String[] args) {
        System.out.println(new Date());
  }
```
指定VM参数 -Djava.endorsed.dirs=D:\java\endorsed
输出

```
创建了时间实例
Fri Jul 24 09:54:48 CST 2020
```
可以看到成功覆盖了JDK的Date对象

### 直接放到jre里面

<img src="https://gitee.com/unclezs/image-blog/raw/master//blog/20200724095823.png"/>

运行测试，不需要VM参数，一样的效果。


## 存在原因

因为JDK的类是由Bootstrap类加载器进行加载的，而这个类加载器由C++编写无法获取到，也是最开始进行类加载的，并且JVM是采用双亲委派机制进行加载class类的。如果你想要在应用程序中替换掉jdk中的某个类是无法做到的，所以提供了endorsed来达到你想要替换到系统中的类。