---
title: PageHelper入门初体验
description: PageHelper是国内非常优秀的一款开源的mybatis分页插件，它支持基本主流与常用的数据库，例如mysql、oracle、mariaDB、DB2、SQLite、Hsqldb等。
tags:
  - PageHelper
categories:
  - Java
toc: false
date: 2019-04-09 17:47:52
---

## 一、简介
PageHelper是国内非常优秀的一款开源的mybatis分页插件，它支持基本主流与常用的数据库，例如mysql、oracle、mariaDB、DB2、SQLite、Hsqldb等。

github 的项目地址：https://github.com/pagehelper/Mybatis-PageHelper
gitosc 的项目地址：http://git.oschina.net/free/Mybatis_PageHelper

## 二、简单使用
####  2.1 准备
###### 2.2.1 导入jar包方式
PageHelper[最新下载地址](http://repo1.maven.org/maven2/com/github/pagehelper/pagehelper/)
由于使用了sql 解析工具，你还需要下载[jsqlparser.jar](http://repo1.maven.org/maven2/com/github/jsqlparser/jsqlparser/0.9.5/)
###### 2.2.2 Maven依赖
坐标
```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.1.2</version>
</dependency>
```

#### 2.2 配置
特别注意，新版拦截器是  com.github.pagehelper.PageInterceptor。com.github.pagehelper.PageHelper  现在是一个特殊的  dialect  实现类，是分页插件的默认实现类，提供了和以前相同的用法。
###### 2.2.1 Mybatis的xml配置中配置

```xml
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <property name="param1" value="value1"/>
    </plugin>
</plugins>
```
###### 2.2.2. 在 Spring 配置文件中配置拦截器插件

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <!-- 配置pageHelper -->
  <property name="plugins">
      <array>
          <bean class="com.github.pagehelper.PageInterceptor">
              <property name="properties">
                  <props>
                      <prop key="helperDialect">oracle</prop>
                      <prop key="reasonable">true</prop>
                  </props>
              </property>
          </bean>
      </array>
  </property>
</bean>
```
###### 2.3 参数介绍
1.  **helperDialect** ：分页插件会自动检测当前的数据库链接，自动选择合适的分页方式。 你可以配置helperDialect 属性来指定分页插件使用哪种方言。配置时，可以使用下面的缩写值： oracle , mysql , mariadb , sqlite , hsqldb , postgresql , db2 , sqlserver , informix , h2 , sqlserver2012 , derby  
特别注意：使用 SqlServer2012 数据库时，需要手动指定为  sqlserver2012 ，否则会使用 SqlServer2005 的方式进行分页。 
也可以实现  AbstractHelperDialect ，然后配置该属性为实现类的全限定名称即可使用自定义的实现方法。
2.  **offsetAsPageNum** ：默认值为  false ，该参数对使用  RowBounds  作为分页参数时有效。 当该参数设置为 true  时，会将  RowBounds  中的  offset  参数当成  pageNum  使用，可以用页码和页面大小两个参数进行分页。
3.  **rowBoundsWithCount** ：默认值为 false ，该参数对使用  RowBounds  作为分页参数时有效。 当该参数设置为 true 时，使用  RowBounds  分页会进行 count 查询。
4.  **pageSizeZero** ：默认值为  false ，当该参数设置为  true  时，如果  pageSize=0  或者  RowBounds.limit = 0  就会查询出全部的结果（相当于没有执行分页查询，但是返回结果仍然是  Page  类型）。
5.  **reasonable** ：分页合理化参数，默认值为 false 。当该参数设置为  true  时， pageNum<=0  时会查询第一页， pageNum>pages （超过总数时），会查询最后一页。默认 false  时，直接根据参数进行查询。
6.  **params** ：为了支持 startPage(Object params) 方法，增加了该参数来配置参数映射，用于从对象中根据属性名取值， 可以配置  pageNum,pageSize,count,pageSizeZero,reasonable ，不配置映射的用默认值， 默认值为pageNum=pageNum;pageSize=pageSize;count=countSql;reasonable=reasonable;pageSizeZero=pageSizeZero。
7.  **supportMethodsArguments** ：支持通过 Mapper 接口参数来传递分页参数，默认值 false ，分页插件会从查询方法的参数值中，自动根据上面  params  配置的字段中取值，查找到合适的值时就会自动分页。 使用方法可以参考测试代码中的  com.github.pagehelper.test.basic  包下的  ArgumentsMapTest  和 ArgumentsObjTest 。
8.  **autoRuntimeDialect** ：默认值为  false 。设置为  true  时，允许在运行时根据多数据源自动识别对应方言的分页 （不支持自动选择 sqlserver2012 ，只能使用 sqlserver ），用法和注意事项参考下面的场景五。
9.  **closeConn** ：默认值为  true 。当使用运行时动态数据源或没有设置  helperDialect  属性自动获取数据库类型时，会自动获取一个数据库连接， 通过该属性来设置是否关闭获取的这个连接，默认 true 关闭，设置为 false  后，不会关闭获取的连接，这个参数的设置要根据自己选择的数据源来决定。

#### 2.4 两种常用使用方式
PageHelper的基本使用有6种，大家可以查看文档，最常用的有两种
###### 2.4.1. RowBounds方式的调用（了解）

```java
List<Country> list = sqlSession.selectList("x.y.selectIf", null, new RowBounds(1, 10));
```
使用这种调用方式时，你可以使用RowBounds参数进行分页，这种方式侵入性最小，我们可以看到，通过RowBounds方式调用只是使用了这个参数，并没有增加其他任何内容。

分页插件检测到使用了RowBounds参数时，就会对该查询进行物理分页。

关于这种方式的调用，有两个特殊的参数是针对  RowBounds  的，你可以参看上面的分页插件参数介绍
 
 注：不只有命名空间方式可以用RowBounds，使用接口的时候也可以增加RowBounds参数，例如：

```java
  //这种情况下也会进行物理分页查询
List<Country> selectAll(RowBounds rowBounds);  
```
注意： 由于默认情况下的  RowBounds  无法获取查询总数，分页插件提供了一个继承自  RowBounds  的PageRowBounds ，这个对象中增加了  total  属性，执行分页查询后，可以从该属性得到查询总数。

###### 2.4.2. PageHelper.startPage 静态方法调用（重点）  
这种方式是我们要掌握的 在你需要进行分页的 MyBatis 查询方法前调用PageHelper.startPage 静态方法即可，紧跟在这个方法后的第一个MyBatis 查询方法会被进行分页。
```java
  PageHelper.startPage(page,pagesize);
  dao.findAll(pagesize,page);
```

## 三、例子
主要使用的参数都在PageInfo中
```java
@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    OrderDao dao;
    @Override
    public List<Orders> findAll(Integer pagesize, Integer page) throws Exception {
        PageHelper.startPage(page,pagesize);
        return dao.findAll(pagesize,page);
    }
}

@Controller
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    IOrderService service;
    @RequestMapping("/findAll.do")
    public ModelAndView findAll(@RequestParam(name="page",required = true,defaultValue ="1") Integer page,
                                @RequestParam(name="pageSize",required = true,defaultValue ="10") Integer pageSize) throws Exception {
        ModelAndView mv=new ModelAndView();
        List<Orders> ordersList = service.findAll(pageSize, page);
        PageInfo pageInfo=new PageInfo(ordersList,3);
        mv.addObject("pageInfo",pageInfo);
        mv.setViewName("orders-list");
        return mv;
    }
}
```
