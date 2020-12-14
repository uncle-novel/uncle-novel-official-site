---
title: Java集合之HashMap与ConcurrentHashMap
description: 还没有简介哦~
tags:
  - 集合
  - HashMap
categories:
  - Java
toc: true
mathjax: false
comments: true
date: 2018-05-15 09:58:33
---

## HashMap

### 介绍

在JDK1.7时，底层是由数组+链表与拉链法解决冲突的。

<img src="https://gitee.com/unclezs/image-blog/raw/master/blog/20200912101312.png"/>

在JDK1.8时，底层是由数组+链表与拉链法+链表长度为8时转为红黑树。但是红黑树节点少于6时退化为链表。

<img src="https://gitee.com/unclezs/image-blog/raw/master/blog/20200726194810.png"/>


### 添加元素的时间复杂度

put操作的流程：

第一步：key.hashcode()，时间复杂度O(1)。

第二步：找到桶以后，判断桶里是否有元素，如果没有，直接new一个entey节点插入到数组中。时间复杂度**O(1)**。

第三步：如果桶里有元素，并且元素个数小于6，则调用equals方法，比较是否存在相同名字的key，不存在则new一个entry插入都链表尾部。时间复杂度O(1)+O(n)=**O(n)**。

第四步：如果桶里有元素，并且元素个数大于6，则调用equals方法，比较是否存在相同名字的key，不存在则new一个entry插入都链表尾部。时间复杂度O(1)+O(logn)=O(logn)。红黑树查询的时间复杂度是**logn**。

通过上面的分析，我们可以得出结论，HashMap新增元素的时间复杂度是不固定的，可能的值有O(1)、O(logn)、O(n)。最好情况是O(1)，最坏情况是O(n)

### 扩容机制

扩容条件就是当threshold=loadFactory*capacity大于等于hash表当前的节点个数，HashMap采用2倍扩容。

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    //旧的容量
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    //旧的阈值
    int oldThr = threshold;
    //新的容量与阈值
    int newCap, newThr = 0;
    //如果初始化过了
    if (oldCap > 0) {
      //如果旧的容量大于了最大的容量 2的30次方，装不下了，不再扩容了
        if (oldCap >= MAXIMUM_CAPACITY) {
          //设置为最大，后续不再进入此方法了
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        //两倍扩容
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    //未初始化的时候
    //初始阈值大于0则将新的容量设置为旧的阈值
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    //否则使用默认的容量进行初始化新的容量    
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        //计算新的阈值
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    //计算新的阈值，如果新的阈值为0的话
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ? (int)ft : Integer.MAX_VALUE);
    }
    //更新新的阈值
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
       //遍历每个桶，拷贝到新的hash数组
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            //如果桶不为空
            if ((e = oldTab[j]) != null) {
                //释放以前节点的空间
                oldTab[j] = null;
                //这个桶只有这一个节点
                if (e.next == null)
                   //直接把这个节点放到新的桶里
                    newTab[e.hash & (newCap - 1)] = e;
                //不只有一个节点
                //是树节点的时候    
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                //为链表的时候    
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    //遍历桶的所有节点
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);

                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

### JDK7并发情况的成环问题

在 JDK7 版本下，很多人都知道 HashMap 会有链表成环的问题，但大多数人只知道，是多线程引起的，至于具体细节的原因，和 JDK8 中如何解决这个问题，很少有人说的清楚，百度也几乎看不懂，本文就和大家聊清楚两个问题：

1. JDK7 中 HashMap 成环原因，2
2. JDK8 中是如何解决的。

成环核心原因在JDK7的transfer方法。

```java
    void transfer(Entry[] newTable, boolean rehash) {
        int newCapacity = newTable.length;
        for (Entry<K,V> e : table) {
            //e为空时循环结束
            while(null != e) {
                Entry<K,V> next = e.next;
                if (rehash) {
                    e.hash = null == e.key ? 0 : hash(e.key);
                }
                int i = indexFor(e.hash, newCapacity);
                // 成环的代码主要是在这三行代码
                // 首先插入是从头开始插入的
                e.next = newTable[i];
                newTable[i] = e;
                e = next;
            }
        }
    }
```

JDK8中的扩容方法，重新写了，为resize，链表扩容的核心代码：

```java
    // loHead 表示老值,老值的意思是扩容后，该链表中计算出索引位置不变的元素
    // hiHead 表示新值，新值的意思是扩容后，计算出索引位置发生变化的元素
    // 举个例子，数组大小是 8 ，在数组索引位置是 1 的地方挂着一个链表，链表有两个值，两个值的 hashcode 分别是是9和33。
    // 当数组发生扩容时，新数组的大小是 16，此时 hashcode 是 33 的值计算出来的数组索引位置仍然是 1，我们称为老值
    // hashcode 是 9 的值计算出来的数组索引位置是 9，就发生了变化，我们称为新值。
    Node<K,V> loHead = null, loTail = null;
    Node<K,V> hiHead = null, hiTail = null;
    Node<K,V> next;
    do {
        next = e.next;
        // (e.hash & oldCap) == 0 表示老值链表
        if ((e.hash & oldCap) == 0) {
            if (loTail == null)
                loHead = e;
            else
                loTail.next = e;
            loTail = e;
        }
        // (e.hash & oldCap) != 0 表示新值链表
        else {
            if (hiTail == null)
                hiHead = e;
            else
                hiTail.next = e;
            hiTail = e;
        }
    } while ((e = next) != null);
    // 老值链表赋值给原来的数组索引位置
    if (loTail != null) {
        loTail.next = null;
        newTab[j] = loHead;
    }
    // 新值链表赋值到新的数组索引位置
    if (hiTail != null) {
        hiTail.next = null;
        newTab[j + oldCap] = hiHead;
    }
```

总的来说，就是将每个桶的节点的hash值遍历出来，如果hash与oldCap取模为0，则表示数据不需要移动桶位置，如果不为0，则在桶的位置为 当前桶的索引+oldCap，举例解释：

oldCap=16，新的容量2倍扩容为32，遍历每个桶，当两个hashcode分别为5和21，在容量为16的时候，都在索引为5的桶，扩容为32时，相当于高位补了1，所以如果hashcode与olcCap取模后不再是以前的位置了则代表新位置为oldcap+oldIndex

<img src="https://gitee.com/unclezs/image-blog/raw/master/blog/20200918105724.png"/>

**总结**

JDK7 是在 while 循环里面，单个计算好数组索引位置后，单个的进行头插法插入数组中，在多线程情况下，会有成环问题

JDK8 ，改用尾插法，是等链表整个 while 循环结束后，才给数组赋值，所以多线程情况下，也不会成环


推荐阅读：[HashMap链表成环的原因和解决方案](https://www.cnblogs.com/wen-he/p/11496050.html)

### hashCode方法

```java
static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

可以看到把hashcode的高16位与低16位进行了异或运算，这样做的好处就是让低16位中包含了高16位的特征，尽量避免了hash冲突。

之所以只取16位还有一个原因，那就是因为最终取模运算使用的是 （n-1）& hashcode方式代替%，之所以能够代替是因为n为2^x方。所以在容量比较少的时候，都是取的低16位的结果。

### 转化为红黑树及退化成链表原因

#### 链表长度为8转化为红黑树原因

HashMap源码中可以看到：

<img src="https://gitee.com/unclezs/image-blog/raw/master/blog/20200912104417.png"/>

这个其实就是泊松分布，节点的分布频率会遵循泊松分布，链表长度达到8个元素的概率为0.00000006，几乎是不可能事件。

还有就是红黑树的平均查找长度为O(logn)而链表为O(n)

#### 节点个数少于6退化链表原因

- 为什么转化为红黑树的阈值8和转化为链表的阈值6不一样，是为了避免频繁来回转化。
- 退化是为了节省空间，红黑树占用的空间是链表的两倍。

首先得注意，网上说的到小于6退化为链表是分时机的，在移除节点的时候并不会判断小于6进行退化成链表，这个退化过程发生在resize中，为树节点的时候调用的spilt方法中进行的。

在remove的时候，通过红黑树根节点及其子节点是否为空来判断是否需要退化。
```java
 final void removeTreeNode(HashMap<K,V> map, Node<K,V>[] tab,boolean  movable) {
      //只贴核心代码
      if (root == null || (movable && (root.right == null || (rl = root.left) == null|| rl.left == null))) {
                tab[index] = first.untreeify(map);  // too small
                return;
            }
 }
```

resize的时候，对红黑树进行了拆分

```java
final void split(HashMap<K,V> map, Node<K,V>[] tab, int index, int bit) {
      TreeNode<K,V> b = this;
      // Relink into lo and hi lists, preserving order
      TreeNode<K,V> loHead = null, loTail = null;
      TreeNode<K,V> hiHead = null, hiTail = null;
      int lc = 0, hc = 0;
      for (TreeNode<K,V> e = b, next; e != null; e = next) {
          next = (TreeNode<K,V>)e.next;
          e.next = null;
          if ((e.hash & bit) == 0) {
              if ((e.prev = loTail) == null)
                  loHead = e;
              else
                  loTail.next = e;
              loTail = e;
              ++lc;
          }
          else {
              if ((e.prev = hiTail) == null)
                  hiHead = e;
              else
                  hiTail.next = e;
              hiTail = e;
              ++hc;
          }
      }
      //在这之前的逻辑是将红黑树每个节点的hash和一个bit进行&运算，
      //根据运算结果将树划分为两棵红黑树，lc表示其中一棵树的节点数
      if (loHead != null) {
          if (lc <= UNTREEIFY_THRESHOLD)
              tab[index] = loHead.untreeify(map);
          else {
              tab[index] = loHead;
              if (hiHead != null) // (else is already treeified)
                  loHead.treeify(tab);
          }
      }
      if (hiHead != null) {
          if (hc <= UNTREEIFY_THRESHOLD)
              tab[index + bit] = hiHead.untreeify(map);
          else {
              tab[index + bit] = hiHead;
              if (loHead != null)
                  hiHead.treeify(tab);
          }
      }
  }
```
这里才用到了 UNTREEIFY_THRESHOLD 的判断，当红黑树节点元素小于等于6时，才调用untreeify方法转换回链表

## ConcurrentHashMap

 JDK7底层实现线程线程安全是通过分段锁Segment，继承自ReentrantLock。
 JDK8底层改为CAS+Synchronized实现。
 
首先使用添加一个元素的时候，发现这个元素对应的Buket是空的，则通过CAS进行添加Buket的第一个元素。
如果元素的对应的Buket的不为空则通过同步代码块进行并发同步控制。


升级原因：
- 减少内存开销:如果使用ReentrantLock则需要节点继承AQS来获得同步支持，增加内存开销，而1.8中只有头节点需要进行同步。
- synchronized则是JVM直接支持的，JVM能够在运行时作出相应的优化措施：锁粗化、锁消除、锁自旋等等。