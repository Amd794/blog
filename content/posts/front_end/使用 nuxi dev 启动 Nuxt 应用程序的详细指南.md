---
url: /posts/ffaecaca091c2823b255244bbf0e4e6e/
title: 使用 nuxi dev 启动 Nuxt 应用程序的详细指南
date: 2024-09-02T00:18:53+08:00
updated: 2024-09-02T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文介绍了使用 nuxi dev 命令启动 Nuxt 应用程序的方法，包括安装 Nuxt.js、启动开发服务器及配置选项等详细步骤。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - nuxi dev
  - 开发服务器
  - Vue.js
  - 前端开发
  - 本地环境
  - 应用启动
---

<img src="https://static.cmdragon.cn/blog/images/2024_09_02 15_50_11.png@blog" title="2024_09_02 15_50_11.png" alt="2024_09_02 15_50_11.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



Nuxt.js 是一个流行的 Vue.js 框架，让我们能够快速开发现代化的 Web 应用。nuxi dev 命令是 Nuxt 的开发服务器，用于在本地环境中启动应用，使我们能够快速迭代和调试代码。

## 安装 Nuxt.js

首先，你需要确保已经在你的机器上安装了 Node.js。你可以在终端中运行以下命令来检查 Node.js 是否已安装：

```bash
node -v
```

如果你还没有安装 Node.js，建议去 [Node.js 官方网站](https://nodejs.org/) 下载并安装。

接下来，使用 npm 或 yarn 安装 Nuxt.js。我们可以使用以下命令创建一个新的 Nuxt 应用：

```bash
npx nuxi@latest init my-nuxt-app
```

在这个过程中，系统会提示你选择一些选项，比如选择 CSS 框架、Linting 工具等。根据你的需求选择即可。

## 启动开发服务器

安装完 Nuxt 应用后，进入到你的项目目录：

```bash
cd my-nuxt-app
```

现在，你可以使用 `nuxi dev` 命令来启动开发服务器。基础命令如下：

```bash
npx nuxi dev
```

这将启动一个开发服务器，默认监听在 `http://localhost:3000`。

### 命令选项

`nuxi dev` 命令有多个可选参数，以下是一些常用选项：

- `rootDir`：要提供的应用程序的根目录。默认值为当前目录 `.`。
- `--dotenv`：指向要加载的另一个 `.env` 文件。
- `--open, -o`：启动后自动在浏览器中打开 URL。
- `--port, -p`：指定监听的端口，默认 3000。
- `--host, -h`：指定服务器的主机名，默认 localhost。
- `--https`：使用 https 协议监听。

### 示例：启动开发服务器

假设我们想要将开发服务器设置为在 4000 端口上运行，并在启动后自动打开浏览器。我们可以这样运行命令：

```bash
npx nuxi dev -p 4000 -o
```

### 自签名 HTTPS 证书

如果你想用 HTTPS 启动开发服务器，可以使用 `--https` 选项。但请注意，浏览器会对此进行警告，因为这是自签名证书。为了在开发中使用自签名证书，你需要设置环境变量：

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

然后可以运行以下命令来启动：

```bash
npx nuxi dev --https
```

## 访问你的应用

无论使用什么配置，启动服务器后你都可以在浏览器中访问 `http://localhost:3000` 或指定的端口（如 `http://localhost:4000`）。你应该能看到 Nuxt 应用的欢迎页面。

## 结论

通过上述步骤，你可以轻松启动和配置一个 Nuxt.js 的开发服务器。nuxi dev 命令提供了灵活的选项来满足不同的开发需求。实验并熟悉这些选项后，你将能更有效地开发和调试你的应用。


余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 nuxi clean 命令清理 Nuxt 项目 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e55433e2a415/)
- [使用 nuxi build-module 命令构建 Nuxt 模块 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a9b4b6527399/)
- [使用 nuxi build 命令构建你的 Nuxt 应用程序 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8d1953ced73e/)
- [使用 nuxi analyze 命令分析 Nuxt 应用的生产包 | cmdragon's Blog](https://blog.cmdragon.cn/posts/33e644a829be/)
- [使用 nuxi add 快速创建 Nuxt 应用组件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/52ca85d04329/)
- [使用 updateAppConfig 更新 Nuxt 应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/17068dabc456/)
- [使用 Nuxt 的 showError 显示全屏错误页面 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4f44ac49742b/)
- [使用 setResponseStatus 函数设置响应状态码 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0e3e22c2447a/)
- [如何在 Nuxt 中动态设置页面布局 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6168aad26848/)
- [使用 reloadNuxtApp 强制刷新 Nuxt 应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c2c24219f5c0/)
- [使用 refreshNuxtData 刷新 Nuxt应用 中的数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7696049934fb/)
- [使用 prerenderRoutes 进行预渲染路由 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b28890e5d54d/)
- [使用 preloadRouteComponents 提升 Nuxt 应用的性能 | cmdragon's Blog](https://blog.cmdragon.cn/posts/851697425a66/)
- [使用 preloadComponents 进行组件预加载 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6f58e9a6735b/)
- [使用 prefetchComponents 进行组件预取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a73257bce752/)
- [使用 onNuxtReady 进行异步初始化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/64b599de0716/)
- [使用 onBeforeRouteUpdate 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cdd338b2e728/)
- [使用 onBeforeRouteLeave 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cfb92785e131/)
- [使用 navigateTo 实现灵活的路由导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/30bdc45ab749/)
- [使用 Nuxt 3 的 defineRouteRules 进行页面级别的混合渲染 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4a1749875882/)
-


