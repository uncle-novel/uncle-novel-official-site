---
title: 快速入门
description: 
---

```json
{
  "name": "书源名称",
  "site": "https://www.novel.com/",
  "group": "书源分组",
  "enabled": true,
  "audio": false,
  "weight": 0,
  "params": {
    "cookie": ""
  },
  "content": {
    "content": {
      "type": "auto:",
      "rule": "1"
    },
    "next": {
      "type": "xpath",
      "rule": "//a[text()~\u003d\u0027.*?下[一]{0,1}[页节].*\u0027]/@href"
    }
  },
  "toc": {
    "list": {},
    "name": {},
    "url": {},
    "next": {
      "type": "xpath",
      "rule": "//a[text()~\u003d\u0027.*?下[一]{0,1}[页节].*\u0027]/@href"
    },
    "enableNext": true,
    "filter": true,
    "autoNext": true,
    "forceNext": false
  },
  "detail": {
    "title": {},
    "author": {},
    "broadcast": {},
    "category": {},
    "wordCount": {},
    "introduce": {},
    "latestChapterName": {},
    "latestChapterUrl": {},
    "coverUrl": {},
    "state": {},
    "updateTime": {}
  },
  "search": {
    "params": {
      "url": "https://www.imiaobige.com/search.html",
      "method": "POST",
      "charset": "UTF-8",
      "mediaType": "application/x-www-form-urlencoded",
      "body": "searchkey\u003d{{keyword}}"
    },
    "list": 规则项,
    "detailPage": 规则项,
    "detail": {
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
    }
  }
}
```