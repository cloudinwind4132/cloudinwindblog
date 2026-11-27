---
title: 环境配置全过程
category: Technical
tags: [AI]
image: "api"
published: 2026-11-26
---

本文记录选择中转站、MAC 安装 claude code、设置的过程

## 1.中转站

### 参考1:

> https://www.nodeseek.com/post-694798-1



```
一定要先看掺水率，再考虑性价比
https://hvoy.ai/
掺水率用这个测，测Opus 4.6的就行，Opus 4.7没什么数据，个人测了几个站，一般就三个档次，100%纯血，74%左右（中度掺水），还有14%左右（无良造假）

不知道从哪选的可以先看看测评和推荐
https://hvoy.ai/leaderboard
https://www.helpaio.com/transit
https://www.getcheapai.com/zh-cn/claude-opus-4-6?view=coding

众所周知，claude中转站的掺水率比chatgpt还要高出无数倍，要不是现在kyc封号严重我也不考虑这些，关键openrouter也给老子403了，但是上面这几个网站，排前面的不一定是好的（都吃了赞助了），我的建议是综合起来比对，选好的先用免费额度测试，不要直接充钱，切记一点，这些中转站的跑路概率不比那些卡台小

如果大家有好的，纯的中转站推荐也可以评论区发一下，掺水跑路也可以分享一下，给大家避坑
```



### 参考2

https://github.com/zzsting88/relayAPI

https://github.com/peter123023/awesome-claude-api



### 参考3

https://veridrop.org/



### 本人选择

https://yundu.lol/dashboard



## 2. MAC安装claude code

### Homebrew

官方：https://code.claude.com/docs/zh-CN/quickstart#homebrew

```
brew install --cask claude-code

claude --version
```

更新：

```
# claude-code 跟踪稳定发布渠道，通常比最新版本晚约一周，并跳过有重大回归的版本
brew upgrade claude-code
```



### npm 安装

参考：https://platform.kimi.com/docs/guide/claude-code-kimi#node-js

```
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
```



### 环境配置

安装完不要直接使用，先配置 api:

将以下变量写入 `~/.claude/settings.json` 的 `env` 字段，保存后重启 Claude Code 即可生效

```
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.moonshot.cn/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_MOONSHOT_API_KEY",
    "ANTHROPIC_MODEL": "kimi-k3[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "kimi-k3[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "kimi-k3[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "kimi-k2.7-code",
    "ANTHROPIC_DEFAULT_FABLE_MODEL": "kimi-k3[1m]",
    "CLAUDE_CODE_SUBAGENT_MODEL": "kimi-k3[1m]",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "1000000",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```



即可 使用 claude



## 3. Windows 安装 Claude Code

### 离线安装

参考：https://github.com/DeepTrial/claude-code-offline























