---
title: 常用功能教程
---

## 自定义目录排序规则

在解析出来的章节是乱序的时候，可以先尝试在解析出来章节列表右键进行排序，如果排序成功则无需下一步了。

<img src="https://cdn.unclezs.com/20210710092407.png"/>

#### 自定义排序脚本

自定义排序脚本需要一定的学习成本，如果你会Javascript，那么这将变得十分简单！

假设网页如下：

<img src="https://cdn.unclezs.com/20210710091001.png"/>

这个网页的目录列表部分源码如下：

```xml
<dd class="chapter_list"><a href="/read/5822/706608/">分卷阅读3</a></dd>
<dd class="chapter_list"><a href="/read/5822/706607/">分卷阅读2</a></dd>
<dd class="chapter_list"><a href="https://www.xxxxx.me/read/5822/706606/">分卷阅读1</a></dd>

        
<dd class="chapter_list"><a href="/read/5822/706611/">分卷阅读6</a></dd>
<dd class="chapter_list"><a href="/read/5822/706610/">分卷阅读5</a></dd>
<dd class="chapter_list"><a href="https://www.xxxxx.me/read/5822/706609/">分卷阅读4</a></dd>

        
<dd class="chapter_list"><a href="/read/5822/706614/">分卷阅读9</a></dd>
<dd class="chapter_list"><a href="/read/5822/706613/">分卷阅读8</a></dd>
<dd class="chapter_list"><a href="https://www.xxxxx.me/read/5822/706612/">分卷阅读7</a></dd>

        
<dd class="chapter_list"><a href="/read/5822/706617/">分卷阅读12</a></dd>
<dd class="chapter_list"><a href="/read/5822/706616/">分卷阅读11</a></dd>
<dd class="chapter_list"><a href="https://www.xxxxx.me/read/5822/706615/">分卷阅读10</a></dd>
```

这个时候我们写的目录规则会匹配出来每个章节，我们在写脚本的时候只需要针对两个章节进行比较就好。

章节包含字段：

```js
{
  name: "分卷阅读1",
  url: "https://xxx.com/read/5822/706613/",
}
```

可以通过访问章节的url、name，然后截取出想用来排序的内容，进行比较大小。

章节排序脚本中内置两个变量 a，b。分别代表两个章节，比较两个章节的优先级，如果a排前面则返回负数，否则返回正数。

测试脚本举例：

```js
parseInt((a.name.replace("分卷阅读",""))) - parseInt((b.name.replace("分卷阅读","")));
```

上诉脚本中将章节名称中的数字取出，然后进行了比较大小。

编写完成后放入章节规则中的排序脚本中，进行测试即可：

<img src="https://cdn.unclezs.com/20210710095300.png"/>
