---
title: Java的Duration的时间格式解析，ISO-8601持续时间格式
description: 还没有简介哦~
tags:
  - Java
  - Duration
  - 源码解析
categories:
  - Java
toc: false
date: 2019-10-03 15:25:16 
---

# 一、前言
  在配置springboot的配置的时候突然看到时间是Duration来配置的，上源码看到这样一个方法
```java
 /**
     * Obtains a {@code Duration} from a text string such as {@code PnDTnHnMn.nS}.
     * <p>
     * This will parse a textual representation of a duration, including the
     * string produced by {@code toString()}. The formats accepted are based
     * on the ISO-8601 duration format {@code PnDTnHnMn.nS} with days
     * considered to be exactly 24 hours.
     * <p>
     * The string starts with an optional sign, denoted by the ASCII negative
     * or positive symbol. If negative, the whole period is negated.
     * The ASCII letter "P" is next in upper or lower case.
     * There are then four sections, each consisting of a number and a suffix.
     * The sections have suffixes in ASCII of "D", "H", "M" and "S" for
     * days, hours, minutes and seconds, accepted in upper or lower case.
     * The suffixes must occur in order. The ASCII letter "T" must occur before
     * the first occurrence, if any, of an hour, minute or second section.
     * At least one of the four sections must be present, and if "T" is present
     * there must be at least one section after the "T".
     * The number part of each section must consist of one or more ASCII digits.
     * The number may be prefixed by the ASCII negative or positive symbol.
     * The number of days, hours and minutes must parse to an {@code long}.
     * The number of seconds must parse to an {@code long} with optional fraction.
     * The decimal point may be either a dot or a comma.
     * The fractional part may have from zero to 9 digits.
     * <p>
     * The leading plus/minus sign, and negative values for other units are
     * not part of the ISO-8601 standard.
     * <p>
     * Examples:
     * <pre>
     *    "PT20.345S" -- parses as "20.345 seconds"
     *    "PT15M"     -- parses as "15 minutes" (where a minute is 60 seconds)
     *    "PT10H"     -- parses as "10 hours" (where an hour is 3600 seconds)
     *    "P2D"       -- parses as "2 days" (where a day is 24 hours or 86400 seconds)
     *    "P2DT3H4M"  -- parses as "2 days, 3 hours and 4 minutes"
     *    "P-6H3M"    -- parses as "-6 hours and +3 minutes"
     *    "-P6H3M"    -- parses as "-6 hours and -3 minutes"
     *    "-P-6H+3M"  -- parses as "+6 hours and -3 minutes"
     * </pre>
     *
     * @param text  the text to parse, not null
     * @return the parsed duration, not null
     * @throws DateTimeParseException if the text cannot be parsed to a duration
     */
    public static Duration parse(CharSequence text) {
		...
    }
```

大致意思就是按照ISO-8601持续时间格式格式都能进行解析；那就说说这个格式怎么写

# 二、ISO-8601持续时间格式

运行间隔以"P"开始，和上面一样也是用"T"分割日期和时间，如P1Y2M10DT2H30M15S

P 开始标记
1Y - 一年
2M - 两个月
10D - 十天
T - 时间和日期分的割标记
2H - 两个小时
30M - 三十分钟
15S 十五秒钟

例子，注意如果没有年月日，"T"也不能省略

P1DT1M - 一天一分钟执行一次
P1W - 一周执行一次
PT1H - 一小时执行一次
PT10S - 十秒执行一次