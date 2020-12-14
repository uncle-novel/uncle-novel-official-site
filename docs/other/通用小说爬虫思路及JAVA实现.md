---
title: 通用小说爬虫思路及JAVA实现
description: 想弄一个通用的小说爬虫，经过我的构想，觉得还是用正则匹配才行。首先用正则提取了正文，记过我在多个网站的测试，已经差不多可以适配大多数了贴下正则
tags: 
  - 爬虫
  - 一些娱乐代码
  - Java
categories: 
  - Java 
date: 2019-03-20 08:01:14
---

前面不是写了个小说爬虫吗，然后就觉得维护起来比较麻烦。想弄一个通用的经过我的构想，觉得还是用正则匹配才行。首先用正则提取了正文，记过我在多个网站的测试，已经差不多可以适配大多数了贴下正则

```java
//正则抓取内容
    @Test
    void test12() {
        //String pinyin="āáǎàēéěèīíǐìōóǒA8B0òūúǔùǖǘǚǜüê";
        String ch_punctuation="~。\\u000A\\u0009\\u00A0\\u0020\\u3000";
        //String punctuation="[\\-,\\/,\\|,\\$,\\+,\\%,\\&,\\',\\(,\\),\\*,\\x20-\\x2f,\\x3a-\\x40,\\x5b-\\x60,\\x7b-\\x7e,\\x80-\\xff,\\u3000-\\u3002,\\u300a,\\u300b,\\u300e-\\u3011,\\u2014,\\u2018,\\u2019,\\u201c,\\u201d,\\u2026,\\u203b,\\u25ce,\\uff01-\\uff5e,\\uffe5]";
        //String eh_punctuation="\\u003A\\u0028\\u201C\\uFF0C\\uFF1F\\u3001\\u201D\\uFF01\\uFF1A\\u223C\\u003D\\u2026";
        String unicode_azAZ09="\\uFF41-\\uFF5a\\uFF21-\\uFF3a\\uFF10-\\uFF19";
        String chinese="\\u4E00-\\u9FFF";
        String html = "";
        try {
            html = SpiderUtils.getSource("https://www.88dush.com/xiaoshuo/37/37125/20723618.html");
            //System.out.println(html);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Pattern compile = Pattern.compile("[pvr/\"]>[^字\\w<*][\\pP\\w\\pN\\pL\\pM"
                +unicode_azAZ09+chinese+ch_punctuation
                    + "]{3,}[^字\\w>]{0,2}(<br|</p|</d|<p)");
        Matcher m=compile.matcher(html);
        while(m.find()) 
            String reString=m.group(0).replace("\r\n", "").replace("<br", "\n").replace("</p", "\n")
                    .replace("p>", "\n").replaceAll("&[a-z]{3,6};", "").replace("\n", "").replace("<p", "\n")
                    .replace("/>", "").replace("r>", "").replace("　","").replace("</d","").replace("v>","")
                    .replace("\">", "").replace("　", "").trim();
            if(reString.length()>0) {
                System.out.println(reString);
            }
        }
    }
```

基本实现了提取小说正文的功能，然后就是提取小说目录链接了

```java
//抓Chapter
    @Test
    void TestEncode() {
        String html = "";
        String chinese="\\u4E00-\\u9FFF";
        String url="https://www.88dush.com/xiaoshuo/37/37125/";
        try {
            html = SpiderUtils.getSource(url);
//          System.out.println(html);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Pattern compile = Pattern.compile("\<\a href=\"([\\w./-]+?)\".*?>(["+chinese+" \\d\\pP]+?)</a");
        Matcher m=compile.matcher(html);
        while(m.find()) {   
//          String reString=m.group(0).trim();
            String re1=m.group(1).trim();
            String re2=m.group(2).trim();
            if(re1.length()>5&&re2.length()>5) {
                System.out.println(SpiderUtils.GetAbsUrl(url,re1)+"--------"+re2);
            }
        }
    }
```

这个提取没有正文那么精细了，还可以改进
这样就基本实现了，给一个小说目录就可以爬取整本小说的目的
这是我的思路，就是匹配汉字来筛选正文
匹配a标签加标题来实现目录链接提取
