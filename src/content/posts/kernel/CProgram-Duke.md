---
title: C语言（杜克大学）
published: 2025-08-11
category: Linux 内核
tags: [C语言, Linux内核]
---

推荐来源：[CSdiy, Introductory C Programming Specialization](https://csdiy.wiki/%E7%BC%96%E7%A8%8B%E5%85%A5%E9%97%A8/C/Duke-Coursera-Intro-C/)

官方课程地址：[Duke, Introductory C Programming Specialization](https://www.coursera.org/specializations/c-programming)

B站视频地址：[B站, Introductory C Programming Specialization ](https://www.bilibili.com/video/BV1Kp42117vh/?p=26&share_source=copy_web&vd_source=7b952f197435de82efe1dabbfc57b22b)

## C中的类型和格式化输出

按照常规认识进行格式化输出：

```c
char letter = 'G';
int negNumber = -1;
unsigned int age = 33; //无符号数字

printf("My name begins with %c\n", letter);
printf("Look, I am negative! --> %d\n", negNumber);
printf("I am %d years old!\n", age);
// 输出八进制
printf("\t in octal (base 8) = %o\n", age);
// 输出16进制
printf("\t in hex (base 16) = %x\n", age);
```

按照非常规认识进行格式化输出：
```c
char letter = 'G';
int negNumber = -1;
unsigned int age = 33; //无符号数字

// %d 输出 'G'
printf("G's numeric value is %d\n", letter);
printf("-1 as hex(base 16) is %x\n", negNumber);
printf("-1 as an unsigned is %u\n", negNumber);
// %c 输出 33 对应的字符
printf("33 as a letter is %c\n", age);
```

**浮点数**

## typedef 用法

背景：命名**结构类型**需要有 `struct` 关键字

用法一：使用 `typedef` 为**结构类型**定义新的名称

用法二：将 `struct` 声明和 typedef 合并为一个语句

用法三：省略 `struct` **标签**，生成一个没有标签的结构，并将这个结构命名为 `rect_t`


typedef 不仅仅用于 struct ，**案例**：

编写代码处理RGB值，一开始规定RGB值是无符号数，现在想转变为无符号字符，需要在每一个定义处加上 char 

使用 `typedef`, **定义 无符号整数的别名** 为 `rgb_t`

即：`typedef unsigned int rgb_t;`

如果 RGB 值想转变为无符号字符，只需要修改一个地方：

## 枚举类型



## make

**make** 进行编译

回顾一下，make 的输入是一个 Makefile，它包含一个或多个规则，**这些规则**指定了如何从其先决条件（它所依赖的文件）生成目标文件。  **规则**由目标指定、冒号和先决条件文件列表组成。在先决条件列表之后是换行符，然后是根据先决条件重建目标文件所需的命令。命令可以分多行显示，但每行必须以 TAB 字符开头（多个空格不起作用，不小心用空格代替 TAB 字符往往是 Makefile 出现问题的原因）。

运行 make 时，您可以指定要编译的特定目标（如果没有指定，make 会将 Makefile 中的第一个目标作为默认目标）。要编译目标，make 会首先检查它是否是最新的。要检查目标是否是最新的，首先需要确保每个先决条件都是最新的，并可能对其进行重建。当 make 遇到一个本身不属于任何规则目标的文件时，这个过程就结束了。这样的文件就是最新的。

