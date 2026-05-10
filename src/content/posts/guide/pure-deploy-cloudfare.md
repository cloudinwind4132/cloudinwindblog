---
title: "Astro-Pure Blog 多平台部署(4) - cloudflare pages（适用于 Firefly?）"
published: 2025-12-13
description: "如何将 Astro-Pure 主题部署到 Cloudflare Pages 平台?"
image: ./images/astro_deploy_4.jpg
category: 博客指南
tags: ["博客指南", "Pure"]
---

> 接上一篇，现在已经有了 xx-blog 仓库

> 参考：[部署你的 Astro 站点至 Cloudflare](https://docs.astro.build/zh-cn/guides/deploy/cloudflare/#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-cicd-%E8%BF%9B%E8%A1%8C%E9%83%A8%E7%BD%B2)

## 1. 注册 cloudflare 账号

## 2. 登录至 Cloudflare dashboard 

 Compute (Workers) > Workers & Pages ->  Create Application -> 不要直接连接 github，选择下面的 **Get Start**

 
![](https://pic.cloudinwind4132.top/1769962721405.png)


然后 Import an existing Git repository -> 选择你想要部署的仓库（例如 xx-blog）-> Begin setup

配置项目：
- Framework preset（框架预设）：Astro
- Build command（构建命令）：npm run build
- Build output directory（构建输出目录）：dist
- 重要：Variables and Secrets 中添加 `DEPLOYMENT_PLATFORM`，值为 `cloudflare`


## 3. 保存并部署，访问生产的链接




