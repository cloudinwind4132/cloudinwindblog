---
title: "Astro-Pure Blog 部署到 github-io"
published: 2025-12-10
description: "如何将 astro-pure 主题部署到 github.io?"
image: https://i.pximg.net/img-original/img/2025/07/12/22/12/04/132620287_p0.jpg
category: 博客指南
tags: ["博客指南", "Pure", "使用指南"]
---

> 本篇内容适用于将 Astro-Pure 主题部署到 xxx.github.io 仓库，然后通过 xxx.github.io 域名访问;

> 但是按照本文方法部署后，导入到vercel 会报错，因为如果想把 blog 导入到 vercel，请看另一篇文章

> 因为本人按照官方指南 使用 themplate 进行部署的时候，编译出现问题，故写此篇文章

> 此处感谢 [huang2202](https://huang2202.github.io/)


## 1. 创建 xxx.github.io 并配置

Settings -> Actions -> General -> Workflow permissions


![](https://p.ipic.vip/iuffch.jpg)



Setting->Pages->Build and deployment->选择 Github Action

![](https://p.ipic.vip/lajmey.jpg)


## 2. git clone 相关代码

```shell
git clone https://github.com/huang2202/huang2202.github.io.git
```

下载到本地后，删除 `.git` 文件夹

## 3. git 配置

```
cd huang2202.github.io

mv huang2202.github.io xxx.github.io
```

关联自己的 github 仓库

```
git init
git remote add origin https://github.com/xxx/xxx.github.io.git

git branch -M main
```

修改配置 `astro.config.ts`，只需要修改 `site`：

```
// https://astro.build/config
export default defineConfig({
  // [Basic]
  site: 'https://xxx.github.io',
  // Deploy to a sub path
  // https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',
  // root: './my-project-directory',
  server: { host: true },

```




## 4. push

```
git add .
git commit -m "init"
git push -u origin main
```



## 5. 登录github仓库，查看 Actions



查看是否部署成功，如果成功，则访问 https://xxx.github.io






