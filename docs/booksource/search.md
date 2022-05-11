---
title: 搜索规则写法
---

## 搜索参数介绍

| 名称         | 类型                                   | 含义                                   | 必填 |
|------------|--------------------------------------|--------------------------------------|----|
| url        | String | 搜索链接                                 | 是  |
| params     | [请求参数](/booksource/format.html#请求参数) | 请求参数                                 | 否  |
| list       | [规则项](/booksource/format.html#规则项)   | 搜索结果列表，匹配结果应该为节点列表                   | 是  |
| detailPage | [规则项](/booksource/format.html#规则项)   | 详情页链接规则                              | 否  |
| detail     | [详情规则](/booksource/format.html#详情规则) | 小说详情 | 是  |

搜索规则中，**必填项有 搜索链接，规则列表，标题，目录地址**，不填写完整无法进行测试。

## 搜索参数的位置

可以定义关键词与页码参数。

::: v-pre

- 关键词：`{{keyword}}`
- 页码：`{{page}}`
:::

对于GET请求：

```
https://xxx.com?page={{page}}&kw={{keyword}}
https://xxx.com/search_{{keyword}}/{{page}}
```

对于POST表单或者JSON的，将参数放入请求体中。

```json
{
    "body": "page={{page}}&kw={{keyword}}"
}
```

::: v-pre

- 搜索参数中的`{{xxx}}`可以为**脚本**，比如可以填写 `{{page*100}}`，则会自动识别为脚本，并且会将页码乘以100再进行请求。
:::
- **搜索关键词编码**：如果填写了[请求参数](/booksource/format.html#请求参数)中的编码字段，那么就会采用对应编码对搜索关键词进行unicode编码。

## 搜索结果详情页写法

有时候小说详情信息直接在搜索结果页码就可以取到，有时候是个单独的详情页面，这个时候如果想要取到详情信息则需要查看本节。

<img src="https://cdn.unclezs.com/20210626224743.png" width="400"/>

1. 编写**详情页面**规则，匹配结果为详情页URL（从搜索结果列表中）
2. 编写详情信息的各项规则时（标题、作者、封面等），需要通过page字段区分，规则是针对**详情页面**编写的还是针对搜索结果页面编写的，`page=detail`则代表**详情页面**的规则，`page=search`就代表搜索页的规则.
3. 如果**详情页面**规则未填写则默认从搜索结果页(search)匹配

```json
"url": {
    "rule": "xpath:/body/div[3]/ul",
    "page": "search 或者 detail",
},
```

总的来说：

- 如果规则是基于搜索结果的列表的，那么需要将规则中的page写为search。并且规则是基于搜索结果列表节点的**相对规则**。
- 如果规则是基于自定义详情页面的，那么需要将规则中的page写为detail（或者不写）。并且规则是基于详情页的规则。

**注意**

1. 如果`page=search`时，编写的详情规则（标题、作者、封面等）时，需要时相对于搜索结果列表节点的相对规则，如：目录规则匹配了所有a标签，那么规则应该针对a标签编写：

    ```json
    {
        "list": "xpath://div//a",
        "url": {
            "page": "search",
            "rule": "@href"
        }
    }
    ```

2. 注意此处的详情规则是搜索规则中的小说信息的规则，不是[详情规则](/booksource/format.html#详情规则)。

## 例子

```json
"search": {
    "params": {
      "url": "https://m.xxx.net/s.php",
      "method": "POST",
      "charset": "GBK",
      "mediaType": "application/x-www-form-urlencoded",
      "body": "type=articlename&s={{keyword}}&submit="
    },
    "list": {
      "type": "//",
      "rule": "//p[@class=\"line\"]"
    },
    "detailPage": {
      "type": "//",
      "rule": "///a[2]/@href "
    },
    "detail": {
      "url": {
        "page": "search",
        "type": "xpath",
        "rule": "/a[2]/@href"
      },
      "title": {
        "page": "search",
        "type": "xpath",
        "rule": "//div[@class=\"block_txt2\"]/h2/a/text()"
      },
      "author": {
        "page": "search",
        "type": "xpath",
        "rule": "//div[@class=\"block_txt2\"]/p[3]/text()"
      },
      "category": {
        "type": "xpath",
        "rule": "//div[@class=\"block_txt2\"]/p[4]/a/text()"
      },
      "introduce": {
        "type": "xpath",
        "rule": "//div[@class=\"intro_info\"]/text()"
      },
    }
  }
```
