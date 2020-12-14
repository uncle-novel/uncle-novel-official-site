---
author: Unclezs
title: 用Jcommander打造自己的Java的命令行工具
seo_title: 用Jcommander打造自己的Java的命令行工具
description: Because life is too short to parse command line parameters
pin: false
tags:
  - Java
  - Jcommander
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2020-12-01 00:34:35
updated: 2020-12-01 00:34:35
---

## 前言

有时候我们用Java开发了一个小工具，希望通过命令行(CLI)或者图形界面直接调用。命令行相较于图形界面，实现迅速，交互更接近于程序员人群，而Jcommander就是Java的这样一款工具。

## 示例

### 依赖

```xml
<dependency>
        <groupId>com.beust</groupId>
        <artifactId>jcommander</artifactId>
        <version>1.78</version>
</dependency>
```

### 例子

```java
package com.unclezs.jcommander;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.UnixStyleUsageFormatter;

import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * 用法示例
 *
 * @author blog.unclezs.com
 * @date 2020/12/1 12:15 上午
 */
public class Main {
    @Parameter(names = {"--path", "-p"}, description = "文件路径", order = 1)
    private String path;
    @Parameter(names = {"--version", "-v"}, description = "版本", order = 2, arity = 0)
    private boolean version;
    @Parameter(names = {"-h"}, description = "帮助", order = 3, arity = 0)
    private boolean usage;
    @Parameter(names = "--help", help = true)
    private boolean help;


    public static void main(String[] args) {
        Main pathUtil = new Main();
        JCommander jCommander = JCommander.newBuilder()
                .programName("pathUtil")
                .addObject(pathUtil)
                .build();
        jCommander.setUsageFormatter(new UnixStyleUsageFormatter(jCommander));
        jCommander.parse(args);
        if (pathUtil.version) {
            System.out.println("pathUtil version 6.6.6");
            return;
        }
        if (pathUtil.path != null) {
            System.out.println("path exist? " + Files.exists(Paths.get(pathUtil.path)));
            return;
        }
        if (pathUtil.usage) {
            jCommander.usage();
            return;
        }
        if (pathUtil.help) {
            System.out.println("help invoke");
        }
    }
}

```

运行后的效果图

<img src="https://gitee.com/unclezs/image-blog/raw/master/20201201004216.png"/>

## 了解更多

- [我自己写的一些示例](https://github.com/unclezs/samples/tree/main/samples-jcommander)
- [官方文档](http://jcommander.org/)
- [另外一款命令行解析工具Apache Commons CLI](https://commons.apache.org/proper/commons-cli/)

