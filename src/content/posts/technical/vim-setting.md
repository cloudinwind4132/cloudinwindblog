---
title: Vim 配置-Mac
category: Technical
tags: [vim, 工具]
published: 2025-05-18
password: "yangzhaohui"
---

已有 .vimrc, 

```vim
call plug#begin('~/.vim/plugged')
  Plug 'vim-scripts/taglist.vim'
  Plug 'jlanzarotta/bufexplorer'
  Plug 'fholgado/minibufexpl.vim'
  Plug 'vim-scripts/winmanager'
  Plug 'vim-scripts/genutils'
  Plug 'vim-scripts/lookupfile'
  Plug 'vim-scripts/mark'
  Plug 'ervandew/supertab'
  Plug 'vim-scripts/ShowMarks'
  Plug 'morhetz/gruvbox'
call plug#end()

" An example for a vimrc file.
"
" Maintainer:   Bram Moolenaar <Bram@vim.org>
" Last change:  2019 Jan 26
"
" To use it, copy it to
"     for Unix and OS/2:  ~/.vimrc
"             for Amiga:  s:.vimrc
"  for MS-DOS and Win32:  $VIM\_vimrc
"           for OpenVMS:  sys$login:.vimrc

" When started as 'evim', evim.vim will already have done these settings, bail
" out.
if v:progname =~? "evim"
  finish
endif

" Get the defaults that most users want.
source $VIMRUNTIME/defaults.vim

if has("vms")
  set nobackup          " do not keep a backup file, use versions instead
else
  set backup            " keep a backup file (restore to previous version)
  if has('persistent_undo')
    set undofile        " keep an undo file (undo changes after closing)
  endif
endif

if &t_Co > 2 || has("gui_running")
  " Switch on highlighting the last used search pattern.
  set hlsearch
endif

" Put these in an autocmd group, so that we can delete them easily.
augroup vimrcEx
  au!

  " For all text files set 'textwidth' to 78 characters.
  autocmd FileType text setlocal textwidth=78
augroup END

" Add optional packages.
"
" The matchit plugin makes the % command work better, but it is not backwards
" compatible.
" The ! means the package won't be loaded right away but when plugins are
" loaded during initialization.
if has('syntax') && has('eval')
  packadd! matchit
endif

" Set mapleader
let mapleader = ","

"Fast saving
nmap <silent> <leader>ww :w<cr>
nmap <silent> <leader>wf :w!<cr>

"Fast quiting
nmap <silent> <leader>qw :wq<cr>
nmap <silent> <leader>qf :q!<cr>
nmap <silent> <leader>qq :q<cr>
nmap <silent> <leader>qa :qa<cr>

"Fast remove highlight search
nmap <silent> <leader><cr> :noh<cr>
"nnoremap <silent> <c-l> :noh<cr><c-l>

"Fast redraw
nmap <silent> <leader>rr :redraw!<cr>

" Command line history
cnoremap <C-p> <Up>
cnoremap <C-n> <Down>

" Fast reloading of the .vimrc
map <silent> <leader>ss :source ~/.vimrc<cr>
" Fast editing of .vimrc
map <silent> <leader>ee :e ~/.vimrc<cr>
" When .vimrc is edited, reload it
autocmd! bufwritepost .vimrc source ~/.vimrc

syntax enable

set nu
""""""""""""""""""""""""""""""
" Tag list (ctags)
""""""""""""""""""""""""""""""
let Tlist_Ctags_Cmd = '/opt/homebrew/bin/ctags'
let Tlist_Show_One_File = 1            "不同时显示多个文件的tag，只显示当前文件的
let Tlist_Exit_OnlyWindow = 1          "如果taglist窗口是最后一个窗口，则退出vim
let Tlist_Use_Right_Window = 1         "在右侧窗口中显示taglist窗口
map <silent> <F9> :TlistToggle<cr>

" netrw setting
let g:netrw_winsize = 25
nmap <silent> <leader>fe :Sexplore!<cr>

""""""""""""""""""""""""""""""
" BufExplorer
""""""""""""""""""""""""""""""
let g:bufExplorerDefaultHelp=0       " Do not show default help.
let g:bufExplorerShowRelativePath=1  " Show relative paths.
let g:bufExplorerSortBy='mru'        " Sort by most recently used.
let g:bufExplorerSplitRight=0        " Split left.
let g:bufExplorerSplitVertical=1     " Split vertically.
let g:bufExplorerSplitVertSize = 30  " Split width
let g:bufExplorerUseCurrentWindow=1  " Open in new window.
autocmd BufWinEnter \[Buf\ List\] setl nonumber

let g:miniBufExplMapWindowNavVim = 1
let g:miniBufExplMapWindowNavArrows = 1
let g:miniBufExplMapCTabSwitchBufs = 1
let g:miniBufExplModSelTarget = 1

""""""""""""""""""""""""""""""
" winManager setting
""""""""""""""""""""""""""""""
let g:winManagerWindowLayout = "BufExplorer,FileExplorer|TagList"
let g:winManagerWidth = 30
let g:defaultExplorer = 0
nmap <C-W><C-F> :FirstExplorerWindow<cr>
nmap <C-W><C-B> :BottomExplorerWindow<cr>
nmap <silent> <leader>wm :WMToggle<cr>

" execute project related configuration in current directory
if filereadable("workspace.vim")
    source workspace.vim
endif

""""""""""""""""""""""""""""""
" lookupfile setting
""""""""""""""""""""""""""""""
let g:LookupFile_MinPatLength = 2               "最少输入2个字符才开始查找
let g:LookupFile_PreserveLastPattern = 0        "不保存上次查找的字符串
let g:LookupFile_PreservePatternHistory = 1     "保存查找历史
let g:LookupFile_AlwaysAcceptFirst = 1          "回车打开第一个匹配项目
let g:LookupFile_AllowNewFiles = 0              "不允许创建不存在的文件
if filereadable("./filenametags")                "设置tag文件的名字
let g:LookupFile_TagExpr = '"./filenametags"'
endif
"映射LookupFile为,lk
nmap <silent> <leader>lk :LUTags<cr>
"映射LUBufs为,ll
nmap <silent> <leader>ll :LUBufs<cr>
"映射LUWalk为,lw
nmap <silent> <leader>lw :LUWalk<cr>

" lookup file with ignore case
function! LookupFile_IgnoreCaseFunc(pattern)
    let _tags = &tags
    try
        let &tags = eval(g:LookupFile_TagExpr)
        let newpattern = '\c' . a:pattern
        let tags = taglist(newpattern)
    catch
        echohl ErrorMsg | echo "Exception: " . v:exception | echohl NONE
        return ""
    finally
        let &tags = _tags
    endtry

    " Show the matches for what is typed so far.
    let files = map(tags, 'v:val["filename"]')
    return files
endfunction
let g:LookupFile_LookupFunc = 'LookupFile_IgnoreCaseFunc'

filetype plugin indent on

""""""""""""""""""""""""""""""
" mark setting
""""""""""""""""""""""""""""""
nmap <silent> <leader>hl <Plug>MarkSet
vmap <silent> <leader>hl <Plug>MarkSet
nmap <silent> <leader>hh <Plug>MarkClear
vmap <silent> <leader>hh <Plug>MarkClear
nmap <silent> <leader>hr <Plug>MarkRegex
vmap <silent> <leader>hr <Plug>MarkRegex

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" cscope setting
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
if has("cscope")
  set csprg=/opt/homebrew/bin/cscope
  set csto=1
  set cst
  set nocsverb
  " add any database in current directory
  if filereadable("cscope.out")
      cs add cscope.out
  endif
  set csverb
endif

nmap <leader>css :cs find s <C-R>=expand("<cword>")<CR><CR>
nmap <leader>csg :cs find g <C-R>=expand("<cword>")<CR><CR>
nmap <leader>csc :cs find c <C-R>=expand("<cword>")<CR><CR>
nmap <leader>cst :cs find t <C-R>=expand("<cword>")<CR><CR>
nmap <leader>cse :cs find e <C-R>=expand("<cword>")<CR><CR>
nmap <leader>csf :cs find f <C-R>=expand("<cfile>")<CR><CR>
nmap <leader>csi :cs find i ^<C-R>=expand("<cfile>")<CR>$<CR>
nmap <leader>csd :cs find d <C-R>=expand("<cword>")<CR><CR>

nmap <leader>scs :scs find s <C-R>=expand("<cword>")<CR><CR>
nmap <leader>scg :scs find g <C-R>=expand("<cword>")<CR><CR>
nmap <leader>scc :scs find c <C-R>=expand("<cword>")<CR><CR>
nmap <leader>sct :scs find t <C-R>=expand("<cword>")<CR><CR>
nmap <leader>sce :scs find e <C-R>=expand("<cword>")<CR><CR>
nmap <leader>scf :scs find f <C-R>=expand("<cfile>")<CR><CR>
nmap <leader>sci :scs find i ^<C-R>=expand("<cfile>")<CR>$<CR>
nmap <leader>scd :scs find d <C-R>=expand("<cword>")<CR><CR>

autocmd FileType c,cpp  map <buffer> <leader><space> :w<cr>:make<cr>
nmap <leader>cn :cn<cr>
nmap <leader>cp :cp<cr>
nmap <leader>cw :cw 10<cr>

" mapping
inoremap <expr> <CR>       pumvisible()?"\<C-Y>":"\<CR>"
inoremap <expr> <C-J>      pumvisible()?"\<PageDown>\<C-N>\<C-P>":"\<C-X><C-O>"
inoremap <expr> <C-K>      pumvisible()?"\<PageUp>\<C-P>\<C-N>":"\<C-K>"
inoremap <expr> <C-U>      pumvisible()?"\<C-E>":"\<C-U>"

inoremap <C-]>             <C-X><C-]>
inoremap <C-F>             <C-X><C-F>
inoremap <C-D>             <C-X><C-D>
inoremap <C-L>             <C-X><C-L>

let g:SuperTabRetainCompletionType = 2
let g:SuperTabDefaultCompletionType = "<C-X><C-O>"

""""""""""""""""""""""""""""""
" showmarks setting
""""""""""""""""""""""""""""""
" Enable ShowMarks
let showmarks_enable = 1
" Show which marks
let showmarks_include = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
" Ignore help, quickfix, non-modifiable buffers
let showmarks_ignore_type = "hqm"
" Hilight lower & upper marks
let showmarks_hlline_lower = 1
let showmarks_hlline_upper = 1
nohlsearch

""""""""""""""""""""""""""""""
" markbrowser setting
""""""""""""""""""""""""""""""
" nmap <silent> <leader>mk :MarksBrowser<cr>

set isk=@,48-57,_,192-255
set nobackup
set noundofile
set noswapfile
set cscopequickfix=s-,c-,d-,i-,t-,e-

"colorscheme kellys
colorscheme gruvbox
set background=dark

```

在 Mac 上配置相同的 Vim 设置，主要有以下几点需要注意

## 1. 安装必要工具

```bash
# 安装 Homebrew（如果没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Vim（Mac 自带版本较旧，建议用 Homebrew 安装）
brew install vim

# 安装 ctags
brew install universal-ctags

# 安装 cscope
brew install cscope

# 安装后清除缓存
# 清除 zsh 命令缓存
hash -r
```

## 2. 创建 .vimrc 文件

```bash
vim ~/.vimrc
```

将原配置粘贴进去，然后修改以下路径差异：

```vim

" 原 Ubuntu 路径 

let Tlist_Ctags_Cmd = '/usr/bin/ctags'
set csprg=/usr/bin/cscope


" 改为 Mac Homebrew 路径

let Tlist_Ctags_Cmd = '/opt/homebrew/bin/ctags'   " Apple Silicon
set csprg=/opt/homebrew/bin/cscope
```
查找实际路径的命令：
```bash
which ctags
which cscope

```

## 3. 安装 Vim 插件

原配置依赖多个插件，需手动安装。推荐用 **vim-plug** 管理：

```bash
# 安装 vim-plug
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

在 `.vimrc` 开头添加：

```vim
call plug#begin('~/.vim/plugged')
  Plug 'vim-scripts/taglist.vim'
  Plug 'jlanzarotta/bufexplorer'
  Plug 'fholgado/minibufexpl.vim'
  Plug 'vim-scripts/winmanager'
  Plug 'vim-scripts/lookupfile'
  Plug 'vim-scripts/mark'
  Plug 'ervandew/supertab'
  Plug 'vim-scripts/ShowMarks'
  Plug 'vim-scripts/MarksBrowser'
call plug#end()
```

然后在 Vim 内执行：
```
:PlugInstall
```


## 4. 安装配色方案
原配置用了 kellysroot 配色，需手动安装：
```bash
mkdir -p ~/.vim/colors
# 将 kellysroot.vim 放入该目录
```

如果找不到该配色，可替换为内置方案：
```vim
vimcolorscheme desert   " 或 molokai、gruvbox 等
```

## 5. 路径对照总结



| 项目     | Ubuntu            | Mac (Apple Silicon)        |
| -------- | ----------------- | -------------------------- |
| ctags    | `/usr/bin/ctags`  | `/opt/homebrew/bin/ctags`  |
| cscope   | `/usr/bin/cscope` | `/opt/homebrew/bin/cscope` |
| .vimrc   | `~/.vimrc`        | `~/.vimrc`（相同）         |
| 插件目录 | `~/.vim/`         | `~/.vim/`（相同）          |



## ubuntu中配置

1. 安装 vim-plug

   ```vim
   curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
   ```

2. 在 .vimrc 顶部加入插件声明

   ```vim
   call plug#begin('~/.vim/plugged')
     Plug 'vim-scripts/genutils'
     Plug 'vim-scripts/taglist.vim'
     Plug 'jlanzarotta/bufexplorer'
     Plug 'fholgado/minibufexpl.vim'
     Plug 'vim-scripts/winmanager'
     Plug 'vim-scripts/lookupfile'
     Plug 'vim-scripts/mark'
     Plug 'ervandew/supertab'
     Plug 'vim-scripts/ShowMarks'
     Plug 'morhetz/gruvbox'
   call plug#end()
   ```

3. 安装系统依赖

   ```bash
   # ctags 和 cscope
   sudo apt install universal-ctags cscope
   ```

4. 修改 .vimrc 中的路径

   ```vim
   " Ubuntu 路径一般是
   let Tlist_Ctags_Cmd = '/usr/bin/ctags'
   set csprg=/usr/bin/cscope
   
   " 确认实际路径
   " which ctags
   " which cscope
   ```

5. 设置主题并执行安装

   ```
   " .vimrc 中加入
   colorscheme gruvbox
   set background=dark
   ```

然后进入 vim 执行：

```
:PlugInstall
```

