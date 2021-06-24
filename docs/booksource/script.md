---
title: 预处理脚本
description: 
---

## 基本概念

脚本的作用是对匹配后的结果进行二次处理。

比如有声小说，我们获取到的正文可能是网页的源码，然后通过预处理脚本对源码进行二次处理，最终找到真实音频链接。

## 内置变量

- url 当前网页的URL，如在目录规则里面即为当前小说的目录地址
- source 当前网页的源码，如在目录规则里面即为当前小说的目录地址的网页源码
- result 规则匹配后的结果，如小说标题规则中，这里取到的就是小说匹配后的标题

## 内置工具

工具为utils.xx形式调用，可以方便的实现请求的发送，匹配器调用，绝对路径拼接。

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

3.具体例子

**实例**

目标：获取章节链接时，把章节链接从相对链接变为绝对链接。
如： `/booksource/script.html -> https://app.unclezs.com/booksource/script.html`
假设当前目录地址为： https://app.unclezs.com/booksource/
目录规则为：
```json
"toc": {
  "list": "//*[@id="app"]/div[1]/aside/ul/li/section/ul/li",
  "name": "text()",
  "url": "@href",
},
```

取匹配后《预处理脚本》章节进行举例，匹配结果为
```js
name = 预处理脚本
url = /booksource/script.html
```
如果url的规则包含js脚本，那么脚本中的初始变量为
```js
result = /booksource/script.html
source = 网址https://app.unclezs.com/booksource/的HTML源码
url = https://app.unclezs.com/booksource/
```
此时我们通过脚本将匹配结果`/booksource/script.html`转化为绝对链接。脚本如下：
```js
result = utils.absUrl(url,result);
```
在章节链接规则中加入上述脚本后的匹配结果为：
```js
name = 预处理脚本
url = https://app.unclezs.com/booksource/script.html
```

完整的规则如下：
```json
"toc": {
  "list": "//*[@id="app"]/div[1]/aside/ul/li/section/ul/li",
  "name": "text()",
  "url": {
    "rule":"@href",
    "script": "result = utils.absUrl(url,result);"
  },
},
```

## 注意

处理完成后需要将脚本进行JSON转义再放入规则，可以使用在线转义：[JSON转义](https://www.sojson.com/yasuo.html)

## 调试工具

书源管理里面的最下面的调试工具进行调试