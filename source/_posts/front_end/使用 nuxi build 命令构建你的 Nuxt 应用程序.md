---
title: 使用 nuxi build 命令构建你的 Nuxt 应用程序
date: 2024/8/30
updated: 2024/8/30
author: cmdragon

excerpt:
  nuxi build 命令是构建 Nuxt 应用程序的核心工具，它将你的应用程序打包成适合生产环境的格式。通过理解和使用不同的选项，如 --prerender、--dotenv 和 --log-level，你可以更好地控制构建过程，并为生产环境做好充分准备。

categories:
  - 前端开发

tags:
  - Nuxt
  - 构建
  - 生产
  - 部署
  - 预渲染
  - 环境变量
  - 日志
---

<img src="https://static.cmdragon.cn/blog/images/2024_08_30 11_08_14.png@blog" title="2024_08_30 11_08_14.png" alt="2024_08_30 11_08_14.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Nuxt.js 开发过程中，将应用程序构建为生产环境的可部署版本是关键的一步。`nuxi build` 命令提供了一种方便的方式来完成这个任务。

## 什么是 `nuxi build`？

`nuxi build` 命令用于将 Nuxt 应用程序构建成一个适合生产环境的版本。它会生成一个名为 `.output` 的目录，其中包含你的应用程序代码、服务器端代码和所有依赖项。这个目录准备好用于生产环境部署。

### 基本用法

```bash
npx nuxi build [--prerender] [--dotenv] [--log-level] [rootDir]
```

### 参数说明

- **rootDir**：要打包的应用程序根目录，默认为当前目录 (`.`)。如果你的应用程序位于不同的目录，可以指定其他路径。
- **--prerender**：预渲染应用程序的每个路由。注意：这是一个实验性功能，可能会有变化。
- **--dotenv**：指定一个 `.env` 文件的路径，环境变量将从这个文件中读取，路径相对于根目录。
- **--log-level**：设置日志级别，以控制构建过程中的日志输出详细程度。

## 如何使用 `nuxi build` 命令

### 1. 确保你已经安装了 Nuxt

首先，确保你已经安装了 Nuxt.js，并且项目已经创建并配置好。如果还没有创建项目，你可以使用以下命令创建一个新的 Nuxt 项目：

```bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
```

### 2. 准备构建环境

在运行 `nuxi build` 命令之前，确保你的应用在开发模式下可以正常运行。你可以通过以下命令启动开发服务器进行测试：

```bash
npm run dev
```

### 3. 运行 `nuxi build` 命令

在你的项目目录中，运行以下命令来构建你的应用：

```bash
npx nuxi build
```

这个命令会生成 `.output` 目录，其中包含了构建后的文件和资源。构建过程结束后，你可以将 `.output` 目录部署到生产环境。

### 4. 使用构建选项

#### 使用 `--prerender` 选项

如果你希望预渲染应用程序的每个路由（即在构建时生成静态 HTML 文件），可以使用 `--prerender` 选项：

```bash
npx nuxi build --prerender
```

这个选项会使 `nuxi build` 在构建时生成每个路由的静态页面，这在构建静态站点时非常有用。

#### 使用 `--dotenv` 选项

如果你需要从特定的 `.env` 文件中加载环境变量，可以使用 `--dotenv` 选项。假设你的 `.env` 文件位于项目根目录下的 `config` 文件夹中，命令如下：

```bash
npx nuxi build --dotenv config/.env
```

这将使 Nuxt 从指定的 `.env` 文件中读取环境变量。

#### 设置日志级别

你还可以设置日志级别以控制构建过程中的日志输出。通过 `--log-level` 选项可以指定不同的日志详细程度，例如：

```bash
npx nuxi build --log-level verbose
```

这将输出更详细的构建日志，有助于调试和了解构建过程。

## 示例

假设你已经创建了一个名为 `my-nuxt-app` 的 Nuxt 项目，并且希望构建这个应用。以下是如何使用 `nuxi build` 命令的示例：

1. **基本构建**：

```bash
npx nuxi build
```

2. **预渲染所有路由**：

```bash
npx nuxi build --prerender
```

3. **使用特定的 `.env` 文件**：

```bash
npx nuxi build --dotenv config/.env
```

4. **设置详细日志输出**：

```bash
npx nuxi build --log-level verbose
```

## 总结

`nuxi build` 命令是构建 Nuxt 应用程序的核心工具，它将你的应用程序打包成适合生产环境的格式。通过理解和使用不同的选项，如 `--prerender`、`--dotenv` 和 `--log-level`，你可以更好地控制构建过程，并为生产环境做好充分准备。希望本文的示例和解释能够帮助你顺利构建和部署你的 Nuxt 应用程序。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [掌握 Nuxt 3 的页面元数据：使用 definePageMeta 进行自定义配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6f827ad7a980/)
- [使用 defineNuxtRouteMiddleware 创建路由中间件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/30f5cad8adaa/)
- [使用 defineNuxtComponent`定义 Vue 组件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/df9c2cf37c29/)
-

