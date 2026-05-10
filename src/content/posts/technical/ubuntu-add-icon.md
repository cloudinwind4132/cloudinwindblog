---
title: 服务器中添加图标
category: Technical
tags: [服务器, 工具]
published: 2025-02-27
---
在 `/usr/share/applications` 中进行添加，每一个程序创建一个 `xx.desktop`

以 idea 为例:

```shell
[Desktop Entry]
Name=IntelliJ IDEA
Comment=IntelliJ IDEA
Exec=/home/aug/software/java/idea/bin/idea
Icon=/home/aug/software/java/idea/bin/idea.png
Terminal=false
Type=Application
Categories=Developer;
```


