---
title: 四种规则写法
---

## Xpath规则

Xpath基于[JsoupXpath](https://github.com/zhegexiaohuozi/JsoupXpath)，一个纯Java实现的支持W3C Xpath 1.0标准语法的HTML解析器。

如果规则以 `//` 开头则可以省略不写type。

在调试时，可以使用浏览器插件XPath Helper，Chrome浏览器XPath Helper的插件[下载地址](https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl)

### 注意事项

使用JsoupXpath时如果发现自己写的在XPath Helper中能够正确取值，但是在规则中无法取到

- 查看是否为xpath1.0语法
- 在[JsoupXpath Issues](https://github.com/zhegexiaohuozi/JsoupXpath/issues)中查看是否已解决

### 一些函数

- `allText()`提取节点下全部文本，取代类似 `//div/h3//text()`这种递归取文本用法
- `html()`获取全部节点的内部的html
- `outerHtml()`获取全部节点的 包含节点本身在内的全部html
- `num()`抽取节点自有文本中全部数字，如果知道节点的自有文本(即非子代节点所包含的文本)中只存在一个数字，如阅读数，评论数，价格等那么直接可以直接提取此数字出来。如果有多个数字将提取第一个匹配的连续数字。
- `text()` 提取节点的自有文本。更多介绍可参见 [releases/tag/v2.4.1](https://github.com/zhegexiaohuozi/JsoupXpath/releases/tag/v2.4.1)
- `node()` 提取所有节点
- `int position()` 返回当前节点在其所在上下文中的位置
- `int last()` 返回所在上下文的最后那个节点位置
- `int first()` 返回所在上下文的的第一个节点位置
- `string concat(string, string, string*)` 连接若干字符串
- `boolean contains(string, string)` 判断第一个字符串是否包含第二个
- `int count(node-set)` 计算给定的节点集合中节点个数
- `boolean starts-with(string, string)` 判断第一个字符串是否以第二个开头
- `string substring(string, number, number?)` 第一个参数指定字符串，第二个指定起始位置（xpath索引都是从1开始），第三指定要截取的长度，这里要注意在xpath的语法里这，不是结束的位置。substring("12345", 2, 3) returns "234"

### 常用操作符

```js
MINUS: '-';
PLUS:  '+';
AT: '@';
COMMA: ',';
PIPE:  '|';
LESS:  '<';
MORE_:  '>';
LE:  '<=';
GE:  '>=';
START_WITH:  '^=';  // `a^=b` 字符串a以字符串b开头 a startwith b  （JsoupXpath扩展）
END_WITH:  '$=';  // `a*=b` a包含b, a contains b   （JsoupXpath扩展）
CONTAIN_WITH:  '*=';  // a包含b, a contains b  （JsoupXpath扩展）
REGEXP_WITH:  '~=';  // a的内容符合 正则表达式b   （JsoupXpath扩展）
REGEXP_NOT_WITH:  '!~';  //a的内容不符合 正则表达式b   （JsoupXpath扩展）
```

### 写法举例

```
//*[@id="app"]/div[1]/aside/ul/li[1]/section/ul/li[2]/a@href
```

## Css选择器规则

一些使用教程可以查看

- [CSS 选择器参考手册 - w3school 在线教程](https://www.w3school.com.cn/cssref/css_selectors.asp)

### 相关拓展

在软件的规则解析器中，对CSS选择器语法进行了拓展，支持直接选择属性，使用 @属性名 的方式

- text 选择文本
- ownText 选择自己标题的文本
- 其他属性直接 @属性名 即可

### 写法举例

```xml
<!-- HTML -->
<div class=".content">
    <p _attr="我是一个属性">我是一段文字<span>内容</span></p>
</div>
```

1. 选择对应标签的文本

```
.content p@text  得到 “我是一段文字内容”
.content p@ownText 得到 “我是一段文字”
```

2. 选择任意的属性值

```xml
<!-- 规则 -->
.content p@_attr 得到 “我是一个属性”
```

## 正则

支持分组选择，采用 `##` 分割正则与分组，$1代表第一组，$2代表第二组，类推。

使用正则必须带有前缀`regex:`

```js
// 匹配目标
2013年5月 
// 对应正则规则
regex:(.*?)年(.*?)月##$1-$2
// 输出
2013-5
```

## JsonPath规则

JsonPath规则实现基于[JsonPath](https://github.com/json-path/JsonPath)。

如果规则以 `$.` 开头则可以省略不写type字段

基本用法如下：

```json
{
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
            },
        ],
    },
}
```

```js
// 规则
$.store.book[0].author
// 结果
Nigel Rees
```
