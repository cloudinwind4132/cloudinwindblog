---
title: Mac 配置 zsh
category: Technical
tags: [mac, 工具]
published: 2026-05-17
---

> 参考：https://makeoptim.com/tool/terminal/

## 最终效果

![最终效果](https://pic.cloudinwind4132.top/1779025710744.png)



## iTerm2

### 下载
前往 [iTerm2 官网](https://www.iterm2.com/)下载并安装。

> 注：建议为 iTerm2 打开完全磁盘访问权限，避免出现默认 Terminal 执行正确，iTerm2 因为权限问题导致执行有误。

### 配置背景
配置快捷键随时从顶部唤起以及背景图片。

**Profiles -> Open Profiles -> Edit Profiles**
![](https://pic.cloudinwind4132.top/1779028808456.png)



基于默认配置 “Default”， 进行 "Duplicate Profile", 并修改名字为 “Top”， 并 "Set as Default", 前面会有一个 ⭐️  

![](https://pic.cloudinwind4132.top/1779037360302.png)

点击 “Window”，进行背景设置

![](https://pic.cloudinwind4132.top/1779037565708.png)

## zsh

macOS 下默认已经安装了 zsh。可执行以下命令，更改默认 Shell 为 zsh。

```bash
chsh -s /bin/zsh
```



### Oh My Zsh

[Oh My Zsh](https://ohmyz.sh/) 是这么介绍自己的。

> Oh My Zsh is a delightful, open source, community-driven framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins, themes, and a few things that make you shout…

简单来说，利用 Oh My Zsh 我们可以轻松管理 zsh 的配置，可以做非常多的定制化功能，比如主题，字体，插件等。

Oh My Zsh 支持 curl、wget 安装，命令如下：

- curl:

  ```bash
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  ```

- wget

  ```bash
  sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
  ```



安装完成后，Oh My Zsh 会加载默认的主题。

## Powerlevel10k

Oh My Zsh 有上百个自带主题，以及其他的外部主题。而 [Powerlevel10k](https://github.com/romkatv/powerlevel10k) 正是现在最流行的主题之一。

执行以下命令，安装 Powerlevel10k:

```bash
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

在 zsh 的配置文件 `~/.zshrc` 中设置 `ZSH_THEME="powerlevel10k/powerlevel10k"`。

![](https://pic.cloudinwind4132.top/1779038153165.png)

## 设置字体

mac 电脑，将 zsh 的主题修改为 `ZSH_THEME="powerlevel10k/powerlevel10k" `，重启 iterm，出现下面的情况：

```bash
Does this look like a diamond (rotated square)?
                  reference: https://graphemica.com/%E2%97%86
```




这是 **Powerlevel10k 的字体检测向导**，它在检测你的终端是否正确安装了 Nerd Font（图标字体）。

原因: Powerlevel10k 需要特殊字体（Nerd Font）来显示图标和特殊符号。向导在问你：`--->    <---` 之间是否显示了一个菱形（◆）。

判断方法:

- **如果你看到菱形符号 ◆** → 输入 `y`
- **如果你看到空白、方块、或乱码** → 输入 `n`



![](https://pic.cloudinwind4132.top/1779038352714.png)

这是向导在检测第二个图标——**锁形符号（🔒）**是否能正常显示。

从截图可以看到，箭头之间显示的是 **`?`（问号方块）**，而不是锁的图标，说明**字体还未生效**。

输入 `n`，然后按以下步骤修复。

### 修复步骤

**第一步：安装字体**

```bash
brew install --cask font-meslo-lg-nerd-font
```

第二步：设置 iTerm2 字体

iTerm2 → Settings (⌘,) → Profiles → Text → Font → 搜索并选择 "MesloLGS NF"


![](https://pic.cloudinwind4132.top/1779038676190.png)

**第三步：重新开一个 iTerm2 窗口**，然后重新运行向导：

```bash
p10k configure
```

