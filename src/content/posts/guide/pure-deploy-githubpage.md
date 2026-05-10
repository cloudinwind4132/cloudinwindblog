---
title:  "Astro-Pure Blog 多平台部署(3) - github page（适用于 Firefly?）"
published: 2025-12-11
description: "如何将 astro-pure 主题动态部署到 github.io? 需要注意细节"
image: ./images/astro_deploy_3.jpg
category: 博客指南
tags: ["博客指南", "Pure"]
---


> 接第二篇，现在已经有了 xx-blog 仓库

> 目标：私有仓库 xx-blog（Astro 项目） → 每次 commit 自动构建 → 自动发布到公开的 xx.github.io → 通过 https://xx.github.io
 访问

> 方案：👉 GitHub Actions + GitHub Pages（官方推荐玩法）

```
xx-blog (私有, Astro 源码)
        |
        |  git push
        v
GitHub Actions
        |
        |  astro build
        v
xx.github.io (公开, 只存 dist 静态文件)
        |
        v
https://xx.github.io

```

关键点：

- xx-blog：私有，只放源码

- xx.github.io：公开，只放构建后的静态文件

GitHub Actions 负责“搬运 + 构建 + 发布”



## 1. 创建 xx.github.io 仓库

如果用户名为 xx，则创建一个名为 xx.github.io 的仓库，属性为 `Public`

## 2. github page 配置

xx.github.io → Settings → Pages

设置为：
- Source：Deploy from a branch
- Branch：main
- Folder：/ (root)


## 3. github action 配置

Settings -> Actions -> General -> Workflow permissions

![](https://pic.cloudinwind4132.top/1769962883535.png)

## 4. 配置 xx-blog 仓库

### 4.1 修改配置文件
修改 `xx-blog/astro.config.mjs`:


```
export default defineConfig({
  // Top-Level Options
  site: isGithubPages ? 'https://xx.github.io/' : (isCloudflare ? 'https://xx.pages.dev/' : 'https://xx.top/'),
  // site: 'https://hana-blog.pages.dev/',
  // base: '/docs',
  trailingSlash: 'never',

  // Internationalization
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: false
    }
  },

  adapter: isGithubPages ? undefined : (isCloudflare ? cloudflare() : vercel()),
  output: isGithubPages ? 'static' : (isCloudflare ? 'static' : 'server'),

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

```

删除 `package.json` 中的 `overrides` 字段（如果有的话）:
```
"overrides": {
    "@emmetio/css-parser": "0.5.0"
  }
```


### 4.2 创建 token

1. 打开 Github 的创建 Token 的 [页面](https://github.com/settings/personal-access-tokens/new)，

2. 在 Repository access 中选择 xx.github.io 的仓库，仓库权限中给 Content 的 read and write，

3. 在 xx-Blog 的仓库的 settings 中选择 Secrets and variables 中的 Actions 中添加一个 Secret，名字为 PERSONAL_TOKEN，值为刚刚创建的 Token。

### 4.3 新建 GitHub Actions 工作流

在 xx-blog 中创建文件：

```
.github/workflows/deploy.yml
```

内容如下：

```yaml
name: Deploy to xx.github.io

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun i

      - name: Set environment variables
        run: |
          echo "DEPLOYMENT_PLATFORM=github" >> $GITHUB_ENV

      - name: Build site
        run: bun run build:github

      - name: Deploy to xx.github.io
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }}
          external_repository: xx/xx.github.io
          publish_branch: main
          publish_dir: ./dist
          force_orphan: true

```


## 5. 验证

1. 在 cloudblog 中随便改点东西

2. git push origin main

3. 打开：cloudblog → Actions

看是否 Deploy Astro to GitHub Pages 变绿 ✅

4. 查看 xx.github.io 里 应该只有这些东西

```
cloud.github.io/
├── index.html
├── assets/
├── favicon.svg
├── _astro/
├── 404.html
└── ...
```

✔️ 全部是 Astro build 后的 dist 内容




5. 访问：https://xx.github.io

