---
title: 预处理脚本
description: 
---

## 基本概念

预处理脚本分为两种，

1. 一种是在请求后对源码进行预处里
在请求完整后执行JS脚本，如果启用了动态网页，那么可以直接使用浏览器中的对象（如window、document），如果则不可以使用浏览器中的对象，此时没有result变量。
<img src="https://cdn.unclezs.com/20210629233517.png"/>

2. 一种是在源码处理完成后，在规则匹配执行后进行脚本预处里
脚本的作用是对匹配后的结果进行二次处理。
比如有声小说，我们获取到的正文可能是网页的源码，然后通过预处理脚本对源码进行二次处理，最终找到真实音频链接。
<img src="https://cdn.unclezs.com/20210629233551.png"/>

## 内置变量

- url 当前网页的URL，如在目录规则里面即为当前小说的目录地址
- source 当前网页的源码，如在目录规则里面即为当前小说的目录地址的网页源码
- result 规则匹配后的结果，如小说标题规则中，这里取到的就是小说匹配后的标题
- params 当前的请求参数，在js的读取值时需要采用java方法调用的方式。如获取Cookie可以采用`params.getHeader("Cookie")`。具体见附录[params字段对应的java类](/booksource/script.html#params字段对应的java类)

## 内置工具

工具为utils.xx形式调用，可以方便的实现请求的发送，匹配器调用，绝对路径拼接。

```java
// 输出日志信息（调试时使用）
utils.log(String msg);
// HTTP请求
utils.get(String url);
utils.post(String url, String body);
utils.request(String paramsJson);
// 字符串转换为JSON
utils.toJson(Object obj);
/**
  * 匹配单个结果，同规则项一致
  * eg: xpath://xxx
  *
  * @param src          匹配目标内容
  * @param withTypeRule 带类型的规则 type:rule
  * @return 匹配结果
*/
utils.match(String src, String withTypeRule);
/**
  * 匹配单个结果，同规则项一致
  * eg: xpath://xxx
  *
  * @param src          匹配目标内容
  * @param withTypeRule 带类型的规则 type:rule
  * @return 匹配结果列表（可能是节点列表）
*/
utils.matchList(String src, String withTypeRule);
// 拼接相对URL为完整的的URL
utils.absUrl(String baseUrl, String relativePath);
```

`utils.request(String paramsJson);`中的paramsJson格式为 [请求参数](/booksource/format.html#请求参数)，举例：

```js
var reqParams = {
    url: url,
    headers: {
        "Referer": url,
        "Cookie": params.getHeader("Cookie")
    },
    method: "GET"
}
// 此处不能使用JSON.stringify，否则Andorid端不兼容
var html = utils.request(utils.toJson(reqParams));
result = html
```

JSON.stringify只可用户纯js对象，不能用于js与java混合的，如上的reqParams就只能使用内置工具的toJson而不能使用JSON.stringify。

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
假设当前目录地址为： <https://app.unclezs.com/booksource/>
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

- 处理完成后需要将脚本进行JSON转义再放入规则，可以使用在线转义：[JSON转义](https://www.sojson.com/yasuo.html)，或者在调试工具中复制转义后的脚本。
- JSON.stringify只能用于纯Js对象，不可用于Java对象与Js对象混合的，实例可见[内置工具](/booksource/script.html#内置工具)

## 调试工具

使用PC端书源编辑器的最下面的 **调试工具** 进行调试。

- 自动请求网页保存到source，勾选后则自动请求url，然后把source补上
- 其他字段含义同上面所述

调试完成后记得复制转义后的脚本进行填写。

<img src="https://cdn.unclezs.com/20210629234002.png"/>

## 附录

### Params字段对应的Java类

可以对照着调用方法进行调用，其中属性的通用方法为调用方式为

- `param.xxx`

可以在js中这么调用

```js
params.method;
params.headers.Cookie;
params.getHeader("Cookie");
params.addHeader("Referer","https://app.unclezs.com");
```

```java
public class RequestParams implements Verifiable, Serializable {
  /**
   * 请求链接
   */
  private String url;
  /**
   * 请求方法
   */
  private String method;
  /**
   * 网页编码
   */
  private String charset;
  /**
   * 请求头
   */
  private Map<String, String> headers;
  /**
   * 请求方式
   */
  private String mediaType;
  /**
   * 请求体
   */
  private String body;
  /**
   * 是否为动态网页
   */
  private Boolean dynamic;

  /**
   * 获取请求头
   *
   * @param headerName  名称
   * @param defaultName 默认值
   * @return 请求头
   */
  public String getHeader(String headerName, String defaultName) {}

  /**
   * 获取请求头
   *
   * @param headerName 名称
   * @return 请求头
   */
  public String getHeader(String headerName) {}

  /**
   * 设置请求头 存在则覆盖
   *
   * @param headerName  名称
   * @param headerValue 值
   */
  public void setHeader(String headerName, String headerValue) {}

  /**
   * 设置请求头 如果不存在则设置 存在则忽略
   *
   * @param headerName  名称
   * @param headerValue 值
   */
  public void addHeader(String headerName, String headerValue) {}
}

```
