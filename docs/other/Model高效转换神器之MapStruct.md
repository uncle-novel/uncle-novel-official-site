---
author: Unclezs
title: Model高效转换神器之MapStruct
seo_title: Model高效转换神器之MapStruct
description: MapStruct是一种注释处理器，用于生成类型安全，高性能和无依赖的Bean映射代码。解决了我们日常在各种Vo、Dto、Model之间的转换难题
pin: false
tags:
  - 高效工具
  - mapper
  - mapstruct
  - 属性转换
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2020-12-05 18:23:56
updated: 2020-12-05 18:23:56
---

## 简介

MapStruct是一种注释处理器，用于生成类型安全，高性能和无依赖的Bean映射代码。解决了我们日常在各种Vo、Dto、Model之间的转换难题。

有人问不是有BeanUtil了吗，为什么还要这么累赘的写这样的转换器？

1. BeanUtil原理是利用反射，所以效率低，MapStruct是在编译时生成代码效率高
2. BeanUtil的只是名称类型相同的的转换比较方便
3. MapStruct支持各种复杂类型的转换。

## 配置依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<properties>
    <org.mapstruct.version>1.4.1.Final</org.mapstruct.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <annotationProcessorPaths>
                    <!--如果有用Lombok需要添加下面这个，注意顺序-->
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>${lombok.version}</version>
                    </path>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 入门案例

用了lombok，不用也一样，自己写getter、setter

示例代码在[samples-mapstruct](https://github.com/unclezs/samples/samples-mapstruct)

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
  private String age;
  private String name;
}
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
  private String age;
  private String name;
}
```

编写Mapper

```java
@Mapper
public interface UserMapper {
  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
  User userDto2User(UserDto userDto);
  UserDto userDto2User(User user);
}
```

测试代码

```java
@Slf4j
public class MapStructSample {
  public static void main(String[] args) {
    User user = new User("123", "uncle");
    UserDto userDto = UserMapper.INSTANCE.userDto2User(user);
    log.info("{}",userDto);
  }
}
```

输出

```log
18:20:14.886 [main] INFO com.unclezs.samples.mapstruct.MapStructSample - UserDto(age=123, name=uncle)
```

可以看到生成了代码

<img src="https://gitee.com/unclezs/image-blog/raw/master///20201205183955.png"/>

## 不同的属性名

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDto {
  private String cname;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
  private String name;
}
@Mapper
public interface PersonMapper {
  PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

  @Mapping(source = "name",target = "cname")
  PersonDto personToPersonDto(Person user);
}
```

## 属性嵌套

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonVo {
  private String cname;
  private String userName;
  private String userAge;
}

@Mapper
public interface PersonMapper {
  PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

  @Mapping(source = "name", target = "cname")
  PersonDto personToPersonDto(Person user);

  @Mapping(source = "user",target = "guest")
  @Mapping(source = "name",target = "cname")
  PersonDto personToPersonDtoNested(Person person);

  @Mapping(source = "user.name",target = "userName")
  @Mapping(source = "user.age",target = "userAge")
  @Mapping(source = "name",target = "cname")
  PersonVo personToPersonVoNestedProperty(Person person);
}
```

测试

```java
  @Test
  public void testNested() {
    Person person = new Person();
    person.setName("uncle");
    User user = new User("123", "uncle");
    person.setUser(user);
    PersonDto personDto = PersonMapper.INSTANCE.personToPersonDtoNested(person);
    Assert.assertEquals("uncle", personDto.getCname());
    Assert.assertEquals("uncle", personDto.getGuest().getName());
  }

  @Test
  public void testNestedToProperty() {
    Person person = new Person();
    person.setName("uncle");
    User user = new User("123", "uncle");
    person.setUser(user);
    PersonVo personVo = PersonMapper.INSTANCE.personToPersonVoNestedProperty(person);
    Assert.assertEquals("uncle", personVo.getCname());
    Assert.assertEquals("uncle", personVo.getUserName());
  }
```

## 相关链接

[官方文档](https://mapstruct.org/documentation/stable/reference/html/)
[github官方地址](https://github.com/mapstruct/mapstruct)