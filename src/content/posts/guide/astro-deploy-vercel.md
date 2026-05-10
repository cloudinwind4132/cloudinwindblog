---
title: "Astro-Pure Blog 多平台部署(2)-Vercel（适用于 Firefly）"
publishDate: 2025-12-11
updatedDate: 2025-12-11
description: "将 astro 部署到 verel"
image: ./images/astro_deploy_2.jpg
category: 博客指南
tags: ["博客指南", "Pure", "Firefly"]
---

> 本篇内容适用于将 Astro-Pure 主题部署到 vercel

> 因为本人按照官方指南 使用 themplate 进行部署的时候，编译出现问题，故写此篇文章

> 此处感谢：[Axi404](https://axi404.com/)，[hana0721](https://hana0721.top/)

本文参考：
- [Axi404 博客上手指南](https://axi404.top/blog/website-vercel)
- [为 Astro 博客添加多部署站点](https://axi404.top/blog/astro-multi-pages)
- [Waline 评论系统配置指南](https://axi404.top/blog/waline-install)

## 1. github 仓库配置

### 1.1 for 仓库
`fork` github仓库: https://github.com/Minakanmi-Yuki/hana-blog

假设 fork 到个人 github 下的仓库名称为 xx-blog

### 1.2 xx-blog 仓库设置

修改配置 `astro.config.ts`，只需要修改 `site`：

```
// https://astro.build/config
export default defineConfig({
  // [Basic]
  site: 'https://xxx.top',
  // Deploy to a sub path
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },

```

## 2. Vercel 平台部署

使用 github 账号登录 vercel

选择 `import github repository`，导入 xx-blog 仓库，然后部署，vercel 会自动完成部署，并提供一个免费的域名


## 3. 绑定专属域名

参考：[绑定自定义域名](https://axi404.top/blog/website-vercel#%E6%AD%A5%E9%AA%A4%E4%B8%83%E5%8F%AF%E9%80%89%E7%BB%91%E5%AE%9A%E4%BD%A0%E7%9A%84%E4%B8%93%E5%B1%9E%E5%9F%9F%E5%90%8D)


## 4. 集成 Waline 评论系统

参考：[Waline 评论系统配置](https://axi404.top/blog/waline-install)

关键：第一个在 https://your-waline-server-url/ui/ 中注册的账号是管理员，务必在部署后直接先行登录。













