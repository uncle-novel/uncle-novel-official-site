---
title: 书源格式
description: 
---

## 完整书源

```json
{
  "name": "String",
  "site": "String",
  "group": "String",
  "enabled": Boolean,
  "audio": Boolean,
  "weight": Number,
  "params": {
    "dynamic": Boolean,
    "enabledProxy": Boolean,
    "cookie": "String",
    "userAgent": "String"
  },
  "content": {
    "params": 请求参数,
    "enableNext": Boolean,
    "removeTitle": Boolean,
    "content": 规则项,
    "next": 规则项,
  },
  "toc": {
    "params": 请求参数,
    "list": 规则项,
    "name": 规则项,
    "url": 规则项,
    "next": 规则项,
    "enableNext": Boolean,
    "filter": Boolean,
    "autoNext": Boolean,
    "forceNext": Boolean,
    "sort": Boolean
  },
  "detail": {
    "params": 请求参数,
    "url": 规则项,
    "title": 规则项,
    "author": 规则项,
    "broadcast": 规则项,
    "category": 规则项,
    "wordCount": 规则项,
    "introduce": 规则项,
    "latestChapterName": 规则项,
    "latestChapterUrl": 规则项,
    "coverUrl": 规则项,
    "state": 规则项,
    "updateTime": 规则项
  },
  "search": {
    "params": 请求参数,
    "list": 规则项,
    "detailPage": 规则项,
    "detail": {
      "params": 请求参数,
      "url": 规则项,
      "title": 规则项,
      "author": 规则项,
      "broadcast": 规则项,
      "category": 规则项,
      "wordCount": 规则项,
      "introduce": 规则项,
      "latestChapterName": 规则项,
      "latestChapterUrl": 规则项,
      "coverUrl": 规则项,
      "state": 规则项,
      "updateTime": 规则项
    },
  }
}
```

## 规则项 

规则项为一个普通规则的格式

```json
{
    "content":{
      "type": "规则类型 如：css | regex | json | xpath | auto",
      "rule": "规则",
      "purifyRules": [
        {
          "regex": "替换正则",
          "template": "替换模板"
        },
        {
          "regex": "替换正则",
          "template": "替换模板"
        }
      ],
      "script": "执行脚本处理匹配结果"
    }
}
```

## 请求参数

对于规则中的params规则详细：

```json
{
  "url": "String",
  "method": "String",
  "charset": "String",
  "headers": {
    "String": "String",
    "请求头名": "请求头值"
  },
  "mediaType": "String",
  "body": "String",
  "dynamic": Boolean,
}
```

| 名称      | 类型    | 含义              | 可选值                                                  | 必填 |
|-----------|---------|-------------------|------------------------------------------------------|----|
| url       | String  | 请求的URL            | 网址，如http://www.novel.com                             | 否  |
| method    | String  | 请求方法              | GET、POST、PUT等HTTP请求方法                                | 否  |
| charset   | String  | 网页编码格式            | UTF-8、GBK等编码格式                                       | 否  |
| headers   | Object  | 请求头               | 指定Referer、User-Agent等请求头                             | 否  |
| mediaType | String  | 媒体类型              | application/json; application/x-www-form-urlencoded等 | 否  |
| body      | String  | 请求体               | 请求体数据，如表单                                            | 否  |
| dynamic   | Boolean | 是否启用动态网页（WebView） | true则启用动态网页模式抓取源码                                    | 否  |

