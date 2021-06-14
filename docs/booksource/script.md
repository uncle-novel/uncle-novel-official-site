---
title: 预处理脚本
description: 
---

## 基本概念

脚本的作用是采用JS脚本进行对匹配后的结果进行预处理

## 内置变量

- url 当前网页的URL，如在目录规则里面即为当前小说的目录地址
- source 当前网页的源码，如在目录规则里面即为当前小说的目录地址的网页源码
- result 规则匹配后的结果，如小说标题规则中，这里取到的就是小说匹配后的标题

## 内置工具

工具为utils.xx形式调用

```java
// HTTP请求
utils.get(String url);
utils.post(String url, String body);
utils.request(String paramsJson);
/**
  * 匹配单个结果，同规则项一致
  * eg: xpath://xxx
  *
  * @param src          匹配目标内容
  * @param withTypeRule 带类型的规则 type:rule
  * @return 匹配结果
*/
utils.match(String src, String withTypeRule);
// 拼接相对URL为完整的的URL
utils.absUrl(String baseUrl, String relativePath);
```

`utils.request(String paramsJson);`中的paramsJson格式为 [请求参数](/booksource/format.html#请求参数)

## 具体写法

将处理后的结果赋值给result变量，写好后可以用[JS压缩工具](https://tool.oschina.net/jscompress/)进行压缩

1.简单例子
```js
var html = utils.get(url);
result = html;
```

2.获取某有声小说网站音频地址实例

```js
function getHtmlParas(str) {
	var sid = str.split("-");
	var n = sid.length;
	var vid = sid[n - 1].split(".")[0];
	var pid = 0;
	vid = vid - 1;
	return [pid, vid]
}
var params = getHtmlParas(url);
var jsUrl = utils.absUrl(url, result);
var dataJs = utils.get(jsUrl);
dataJs = dataJs.replaceAll(",urlinfo.+?;", ";result = VideoListJson;");
var VideoListJson = eval(dataJs);
result = VideoListJson[params[0]][1][params[1]].split("$")[1];
```