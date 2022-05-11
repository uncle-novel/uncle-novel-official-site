---
title: 书源格式
description: 
---

规则由多个[规则项](/booksource/format.html#规则项)组成，下面介绍规则的数据字典格式的含义

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
    "cookie": "String",
    "userAgent": "String",
    "autoReferer": Boolean,
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
    "sort": Boolean,
    "reverse": Boolean,
  },
  "content": {
    "params": 请求参数,
    "enableNext": Boolean,
    "removeTitle": Boolean,
    "traditionToSimple": Boolean,
    "content": 规则项,
    "next": 规则项,
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

### 基本信息

| 名称      | 类型      | 含义                 | 可选值                    | 必填 |
|---------|---------|--------------------|------------------------|----|
| name    | String  | 书源名称，一般为网站名称       | 网站名称，如笔趣阁              | 是  |
| site    | String  | 书源的网址，书源的唯一标识符，不可重复, 以/结尾              | 网址，如<https://novel.com/> | 是  |
| group   | String  | 书源分组               | 分组，如默认                 | 否  |
| enabled | Boolean | 是否启用书源，不启用则不会被用于搜索             | true则启用规则              | 是  |
| audio   | Boolean | 是否为有声小说书源          | true则为有声小说书源           | 否  |
| weight  | Number  | 书源权重，在搜索时，权重高则优先搜索 | 权重数值                   | 否  |

### 全局参数

| 名称        | 类型      | 含义              | 可选值                       | 必填 |
|-----------|---------|-----------------|---------------------------|----|
| dynamic   | Boolean | 全局动态网页（WebView） | true则将启用动态网页，如抓取目录源码、正文源码 | 否  |
| cookie    | String  | 全局Cookie，用于模拟登陆 | Cookie，可以查看 [Cookie抓取教程](/guide/pc/skills.html#获取Cookie)           | 否  |
| userAgent | String  | 全局User-Agent    | true则启用规则                 | 否  |
| autoReferer | Boolean  | 自动添加防盗链    | true则添加                 | 否  |

### 目录规则

| 名称         | 类型                                   | 含义                                   | 必填 |
|------------|--------------------------------------|--------------------------------------|----|
| params     | [请求参数](/booksource/format.html#请求参数) | 请求参数                                 | 否  |
| list       | [规则项](/booksource/format.html#规则项)   | 章节列表规则，匹配章节节点列表，后续的name于url在其基础上进行匹配 | 是  |
| name       | [规则项](/booksource/format.html#规则项)   | 章节名称规则                               | 是  |
| url        | [规则项](/booksource/format.html#规则项)   | 章节链接规则                               | 是  |
| next       | [规则项](/booksource/format.html#规则项)   | 下一页规则，匹配到下一页的URL即可，会采用标题网页区分是否属于同一本小说                                | 否  |
| enableNext | Boolean                              | 允许翻页，启用后才会进行翻页                                 | 否  |
| filter     | Boolean                              | 章节过滤，无书源模式解析时，有时因章节太少而过滤掉了真正的章节，此时禁用即可获取到全真正的章节，书源模式下可直接禁用                                 | 否  |
| autoNext   | Boolean                              | 自动翻页，启用翻页后，是否允许自动翻页。                                 | 否  |
| forceNext  | Boolean                              | 强制翻页，忽略网页标题限制是否为同一本书的章节的策略，强制采用规则匹配结果的下一页链接进行翻页。             | 否  |
| sort       | Boolean                              | 乱序重排(对页内的章节进行排序)                     | 否  |
| sortScript       | String                              | 章节排序脚本（输出结果为 正数 或负数 或 0），用于覆盖默认排序策略                   | 否  |
| reverse       | Boolean                              | 章节逆序                     | 否  |

#### 排序脚本

sortScript字段在sort启用下生效，用于覆盖默认的排序策略，因为默认的排序可能不是那么通用。

具体写法：
内置两个变量 a，b。分别代表两个章节。章节包含字段：

```js
{
  name: "分卷阅读1",
  url: "https://xxx.com/read/xx",
}
```

测试脚本举例：

```js
parseInt((a.name.replace("分卷阅读",""))) - parseInt((b.name.replace("分卷阅读","")));
```

排前面则返回负数，否则返回正数。

### 详情规则

详情规则用于网站不能搜索，但是想要目录解析时能够获取站点的封面时可以定义。规则类型应统一，否则不能够正确获取结果，比如用了xpath就全部用xpath。

| 名称                | 类型                                   | 含义       | 必填 |
|-------------------|--------------------------------------|----------|----|
| params            | [请求参数](/booksource/format.html#请求参数) | 请求参数     | 否  |
| url               | [规则项](/booksource/format.html#规则项)   | 小说目录地址   | 否  |
| title             | [规则项](/booksource/format.html#规则项)   | 小说标题     | 否  |
| author            | [规则项](/booksource/format.html#规则项)   | 作者       | 否  |
| broadcast         | [规则项](/booksource/format.html#规则项)   | 播音(有声小说) | 否  |
| category          | [规则项](/booksource/format.html#规则项)   | 分类       | 否  |
| wordCount         | [规则项](/booksource/format.html#规则项)   | 字数       | 否  |
| introduce         | [规则项](/booksource/format.html#规则项)   | 简介       | 否  |
| latestChapterName | [规则项](/booksource/format.html#规则项)   | 最新章节名    | 否  |
| latestChapterUrl  | [规则项](/booksource/format.html#规则项)   | 最新章节链接   | 否  |
| coverUrl          | [规则项](/booksource/format.html#规则项)   | 封面       | 否  |
| state             | [规则项](/booksource/format.html#规则项)   | 连载状态     | 否  |
| updateTime        | [规则项](/booksource/format.html#规则项)   | 更新时间     | 否  |

### 正文规则

正文规则默认可不填写，采用默认的自动解析的模式进行匹配结果，默认有三种匹配模式：

- auto:1，推荐模式
- auto:2，段落模式
- auto:3，全文模式

| 名称          | 类型      | 含义           | 必填 |
|-------------|---------|--------------|----|
| params      | [请求参数](/booksource/format.html#请求参数)   | 请求参数         | 否  |
| enableNext  | Boolean | 是否启用翻页       | 否  |
| removeTitle | Boolean | 是否移除正文中首行的标题 |  否  |
| content     | [规则项](/booksource/format.html#规则项)  | 正文规则         |  是  |
| next        | [规则项](/booksource/format.html#规则项)  | 下一页规则，匹配到下一页的URL即可，会采用标题网页区分是否属于同一章节        |  否  |
| traditionToSimple     | Boolean  | 正文繁体转为简体         |  否  |
| delayTime     | Long  | 下载延迟，每章节下载完后的延迟毫秒数         |  否  |

### 搜索规则

| 名称         | 类型                                   | 含义                                   | 必填 |
|------------|--------------------------------------|--------------------------------------|----|
| url     | String | 搜索链接                                 | 是  |
| params     | [请求参数](/booksource/format.html#请求参数) | 请求参数                                 | 否  |
| list       | [规则项](/booksource/format.html#规则项)   | 搜索结果列表，匹配结果应该为节点列表                   | 是  |
| detailPage | [规则项](/booksource/format.html#规则项)   | 详情页链接规则                              | 否  |
| detail     | [详情规则](/booksource/format.html#详情规则) | 小说详情 | 是  |

## 规则项

规则项为一个普通规则的格式

```json
{
  "type": "String",
  "rule": "String",
  "replace": [
    {
      "regex": "String",
      "template": "String"
    },
    {
      "regex": "替换正则",
      "template": "替换模板"
    }
  ],
  "script": "String",
  "page": "String",
}
```

| 名称        | 类型   | 含义       | 可选值                                                                        | 必填 |
|-------------|--------|------------|----------------------------------------------------------------------------|----|
| type        | String | 规则类型       | 【css,regex,json,xpath,auto】，其中xpath为//开头和jsonpath规则如果以$.开头可默认不填写type | 是  |
| rule        | String | 规则内容       | 规则类型对应的规则内容                                                                | 是  |
| replace | Array  | 替换净化规则（正则） | 可以多条，其中替换模板，$1代表第一组 类推                                                     | 否  |
| script      | String | JS预处理脚本    | 规则匹配后进行预处理的JS脚本. [查看教程](/booksource/script.html)                               | 否  |
| page      | String | 规则对应的页面    | 搜索时使用. [查看教程](/booksource/search.html)                               | 否  |

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
  "script": Boolean,
  "dynamicDelayTime": Boolean,
}
```

| 名称      | 类型    | 含义              | 可选值                                                  | 必填 |
|-----------|---------|-------------------|------------------------------------------------------|----|
| url       | String  | 请求的URL            | 网址，如<http://www.novel.com>                             | 否  |
| method    | String  | 请求方法              | GET、POST、PUT等HTTP请求方法                                | 否  |
| charset   | String  | 网页编码格式            | UTF-8、GBK等编码格式                                       | 否  |
| headers   | Object  | 请求头               | 指定Referer、User-Agent等请求头                             | 否  |
| mediaType | String  | 媒体类型              | application/json; application/x-www-form-urlencoded等 | 否  |
| body      | String  | 请求体               | 请求体数据，如表单                                            | 否  |
| dynamic   | Boolean | 是否启用动态网页（WebView） | true则启用动态网页模式抓取源码                                    | 否  |
| script   | String | 预处理脚本 | 请求完成后执行的JS，如果动态网页则在webview执行                                    | 否  |
| dynamicDelayTime   | String | 预处理脚本执行延迟 | 防止JS异步请求未完成                                    | 否  |
