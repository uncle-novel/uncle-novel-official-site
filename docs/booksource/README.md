### 介绍

书源即可爬虫的解析规则，软件支持CSS选择器、JSON-PATH、Xpath、正则4种格式的规则。

- CSS选择器基于Jsoup实现
- JSON-PATH基于[JsonPath](https://github.com/json-path/JsonPath)实现
- Xpath基于[JsoupXpath](https://github.com/zhegexiaohuozi/JsoupXpath)实现
- 正则为标准正则语法

书源主要由6部分组成：

- 基本信息
- 全局参数
- 搜索规则
- 目录规则
- 正文规则
- 详情规则

其中目录规则与正文规则如果无效或不填则使用默认的解析策略。

### 注意

书源非必须，一般可以用于搜索，不写规则，直接进行目录解析与正文解析一样可以使用，书源只是对解析的增强。
