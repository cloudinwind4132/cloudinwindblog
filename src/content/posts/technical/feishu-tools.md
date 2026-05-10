---
title: 飞书文档导出为markdown
category: Technical
tags: [工具]
published: 2025-04-02 
---

## 飞书导出为 markdown

> 工具项目地址：https://github.com/Wsine/feishu2md?tab=readme-ov-file

根据本人使用体验，**命令行版本**可以正常使用，docker安装不能正常使用

下载后，使用命令行进入解压后的目录（windows可以用 cmd）

**涉及到的命令**：

1. 进行配置
```shell
./feishu2md.exe config --appId <your_id> --appSecret <your_secret>
```

2. 下载飞书文档
```
feishu2md dl "https://domain.feishu.cn/docx/docxtoken"
```

> 最好将文档的所有权限都设置为 **可阅读**，不然会出现一些问题
