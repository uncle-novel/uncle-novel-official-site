---
title: 进阶写法
---

## 规则项进阶写法

进阶写法可以简化规则

下文使用**正文规则中的正文内容规则**进行具体举例

```json
{
    "content":{
      "type": "规则类型",
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

## 替换净化规则

### 字符串模式

使用字符串代替写一个完整的JSON对象

```json
{
    "content":{
      "type": "规则类型",
      "rule": "规则",
      "purifyRules": [
        "替换正则@@替换模板"
        "替换正则@@替换模板",
      ],
      "script": "执行脚本处理匹配结果"
    }
}

```

### 支持混用

可以混用字符串与JSON对象

```json
{
    "content":{
      "type": "规则类型",
      "rule": "规则",
      "purifyRules": [
        "替换正则@@替换模板"
          {
          "regex": "替换正则",
          "template": "替换模板"
        },
      ],
      "script": "执行脚本处理匹配结果"
    }
}
```

### 只有一条？

如果只有一条替换净化规则，可以更精简一点

```json
{
    "content":{
      "type": "规则类型",
      "rule": "规则",
      "purifyRules": {
          "regex": "替换正则",
          "template": "替换模板"
      },
      "script": "执行脚本处理匹配结果"
    }
}
```

再精简一点

```json
{
    "content":{
      "type": "规则类型",
      "rule": "规则",
      "purifyRules": "替换正则@@替换模板",
      "script": "执行脚本处理匹配结果"
    }
}
```

## 规则和类型合并

在写了type的时候优先读取type，没有则使用rule指定的type

```json
{
    "content":{
      "rule": "规则类型:规则",
      "purifyRules": "替换正则@@替换模板",
      "script": "执行脚本处理匹配结果"
    }
}
```

## 不需要净化和脚本处理？

不需要净化和脚本处理的时候，可以更精简一点，注意规则类型必须填写

```json
{
    "content": "规则类型:规则"
}
```
