---
title: 使用 nuxi preview 命令预览 Nuxt 应用
date: 2024/9/8
updated: 2024/9/8
author: cmdragon

excerpt:
  摘要：本文介绍了如何使用nuxi preview命令预览Nuxt.js应用，包括安装和准备环境、启动预览服务器的步骤，以及如何指定根目录和使用自定义.env文件等高级用法。通过nuxi preview，开发者能够在本地快速验证应用构建后的实际效果，确保一切按预期工作。

categories:
  - 前端开发

tags:
  - Nuxt
  - 预览
  - 构建
  - 服务器
  - 环境
  - 项目
  - 命令
---

<img src="https://static.amd794.com/blog/images/2024_09_08 13_13_23.png@blog" title="2024_09_08 13_13_23.png" alt="2024_09_08 13_13_23.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在开发基于 Nuxt.js 的应用时，最后一步通常是构建和预览应用，以便确保一切正常。在这一过程中，`nuxi preview` 命令能够帮助你快速启动一个服务器来预览你的应用。

## 什么是 `nuxi preview`？

`nuxi preview` 命令用于在你构建了 Nuxt 应用后，启动一个服务器以便进行预览。它通常在运行 `nuxi build` 命令后使用，以便你可以在本地验证应用是否按预期运行。除此之外，`start` 命令也是 `preview` 的一个别名。

## 安装和准备环境

在使用 `nuxi preview` 之前，请确保你已经安装了 Node.js、npm，以及一个新的 Nuxt 项目。

### 1. 创建一个新的 Nuxt 项目

如果你尚未创建 Nuxt 项目，可以使用如下命令：

```bash
npx nuxi init my-nuxt-app
```

进入项目目录并安装依赖：

```bash
cd my-nuxt-app
npm install
```

### 2. 构建项目

在预览应用之前，你需要首先构建它。运行以下命令进行构建：

```bash
npx nuxi build
```

上述命令会为你的应用生成生产环境的构建文件。

## 使用 `nuxi preview` 命令

### 1. 启动预览服务器

构建完成后，在项目根目录中运行以下命令来启动预览服务器：

```bash
npx nuxi preview
```

此命令将在默认网址 `http://localhost:3000` 启动服务器。

### 2. 指定根目录

如果你的 Nuxt 应用程序不在当前目录中，可以通过 `rootDir` 参数来指定其他目录。例如：

```bash
npx nuxi preview /path/to/your/app
```

### 3. 使用自定义 `.env` 文件

你可以通过 `--dotenv` 选项指定自定义的 `.env` 文件，以便于在预览期间加载其他环境变量。例如：

```bash
npx nuxi preview --dotenv .env.production
```

此命令会加载指定的 `.env.production` 文件。

## 示例：完整的预览流程

以下是一个完整的命令执行示例步骤：

1.  **创建新的 Nuxt 项目**：

    ```bash
    npx nuxi init my-nuxt-app
    cd my-nuxt-app
    npm install
    ```

2.  **构建项目**：

    ```bash
    npx nuxi build
    ```

3.  **启动预览服务器**：

    在项目根目录中运行：

    ```bash
    npx nuxi preview
    ```

4.  **访问预览应用**：

    打开浏览器，访问 `http://localhost:3000`，你将看到应用的预览界面。

## 其他注意事项

*   在执行 `nuxi preview` 时，`process.env.NODE_ENV` 将被设置为 `production`。如果你希望覆盖此设置，可以在 `.env` 文件中定义 `NODE_ENV` 或通过命令行参数传入。
*   预览模式下，`.env` 文件将被加载到 `process.env` 中，但在生产环境中，确保你手动设置环境变量。

## 总结

通过使用 `nuxi preview` 命令，你可以迅速预览构建后的 Nuxt 应用程序。这是验证你应用在生产环境下行为的重要步骤。


余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 nuxi prepare 命令准备 Nuxt 项目 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1df59c03194c/)
- [使用 nuxi init 创建全新 Nuxt 项目 | cmdragon's Blog](https://blog.cmdragon.cn/posts/25142fd0f7a7/)
- [使用 nuxi info 查看 Nuxt 项目详细信息 | cmdragon's Blog](https://blog.cmdragon.cn/posts/15f6f5b42fd0/)
- [使用 nuxi generate 进行预渲染和部署 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ab02ca20e749/)
- [探索 Nuxt Devtools：功能全面指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/79fd8b17a254/)
- [使用 nuxi dev 启动 Nuxt 应用程序的详细指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ef880861a974/)
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
-

