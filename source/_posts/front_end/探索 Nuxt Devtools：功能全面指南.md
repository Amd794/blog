---
title: 探索 Nuxt Devtools：功能全面指南
date: 2024/9/3
updated: 2024/9/3
author: cmdragon

excerpt:
   摘要：本文介绍了Nuxt Devtools的功能和使用方法，包括自动安装、手动安装和各项主要功能，如页面、组件、构建分析等。

categories:
   - 前端开发

tags:
   - Nuxt
   - Devtools
   - 前端
   - 开发
   - 调试
   - Vue
   - 插件
---

<img src="https://static.amd794.com/blog/images/2024_09_03 16_52_35.png@blog" title="2024_09_03 16_52_35.png" alt="2024_09_03 16_52_35.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`




Nuxt Devtools 是一个强大的开发工具，可以帮助你深入了解和调试 Nuxt 应用。

### 自动安装

您只需转到您的文件并设置为 ：`nuxt.config``devtools``true`

nuxt.config.ts

```
export default defineNuxtConfig({
  devtools: { enabled: true },
})
```

Nuxt 将自动为您安装 DevTools 模块。

### 使用 Nuxi 安装

您可以通过转到项目根目录并运行以下内容来选择每个项目的 Nuxt DevTools

```
npx nuxi@latest devtools enable
```

重新启动您的 Nuxt 服务器并在浏览器中打开您的应用程序。单击底部的 Nuxt 图标（或按 + / + + ）以切换 DevTools。`Shift``Alt``⇧ Shift``⌥ Option``D`

如果你使用或其他 Node 版本管理器，我们建议在切换 Node 版本后再次执行 enable 命令。`nvm`

同样，您可以通过运行以下命令来按项目禁用它：

```
npx nuxi@latest devtools disable
```

### 手动安装

Nuxt DevTools 目前作为一个模块提供（将来可能会更改）。如果您愿意，您也可以将其安装在本地，它将为您的所有团队成员激活。

```
npm i -D @nuxt/devtools
```

nuxt.config.ts

```
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],
})
```

## Nuxt Devtools 主要功能

### 1. 概述

概述选项卡提供应用程序的快速视图。你可以看到 Nuxt 和 Vue 的版本，页面、组件、导入、模块及插件等信息，以及应用的加载时间。如果你使用的 Nuxt 版本不是最新的，概述页面会提示你更新。

### 2. 页面（Pages）

Pages 选项卡展示了当前的路由、布局和中间件信息。你可以快速导航到不同页面，并使用文本框查看每个路由的匹配方式。

### 3. 组件（Components）

Components 选项卡显示应用中使用的所有组件及其来源。你可以搜索组件并查看其源代码。此外，还有一个 Graph 视图，显示组件间的关系及其依赖关系。通过检查 DOM 树，你还可以轻松找到渲染某个 DOM 元素的组件。

### 4. 导入（Imports）

Imports 选项卡展示了所有自动导入的文件。你可以查看哪些文件导入了这些模块，并访问相关文档。

### 5. 模块（Modules）

Modules 选项卡列出了所有已安装的模块，包括模块的 GitHub 仓库、文档和版本信息。你还可以一键安装或删除模块。

### 6. 资产（Assets）

Assets 选项卡显示 Public 目录中的文件。你可以查看文件信息并进行拖放上传。

### 7. 终端（Terminals）

Terminals 选项卡展示了所有活动的终端进程，方便你管理和监控后台任务。

### 8. 运行时配置（Runtime Config）

Runtime Config 选项卡显示项目的运行时配置，并允许你进行编辑。

### 9. 数据负载（Payload）

Payloads 选项卡展示项目的状态和数据负载，帮助你检查应用的数据流。

### 10. 构建分析（Build Analyze）

Build Analyze 选项卡允许你运行构建分析，查看项目的捆绑包大小，并保存报告以便比较不同构建的大小。

### 11. Open Graph

Open Graph 选项卡帮助你进行 SEO 优化。它展示了社交媒体预览卡，并提供缺失的 SEO 标签和代码片段。

### 12. 插件（Plugins）

Plugins 选项卡显示项目中使用的插件及其初始化时间等信息。

### 13. 服务器路由（Server Routes）

Server Routes 选项卡显示所有 Nitro 路由，并提供一个测试端点的工具。

### 14. 存储（Storage）

Storage 选项卡展示了项目中的 Nitro 存储，你可以创建、编辑和删除文件。

### 15. VS Code 服务器（VS Code Server）

VS Code Server 集成使你可以在浏览器中使用 VS Code 编辑和调试 Nuxt 项目。请遵循 [Code Server 安装指南](https://code-server.dev/docs/guide) 来进行设置。

### 16. 钩子（Hooks）

Hooks 选项卡帮助你监控每个钩子的执行时间，找到性能瓶颈。

### 17. 虚拟文件（Virtual Files）

Virtual Files 选项卡显示 Nuxt 为支持约定生成的虚拟文件。

### 18. 检查（Inspect）

Inspect 选项卡允许你检查 Vite 的转换步骤。

### 19. 设置（Settings）

Settings 选项卡让你根据需要配置 DevTools，例如隐藏选项卡、调整顺序、选择主题等。

### 20. Nuxt 图标（Nuxt Icon）

Nuxt 图标位于 DevTools 左上角，点击它可以快速访问一些常用功能，如主题切换、数据刷新等。

### 21. 命令面板（Command Palette）

命令面板提供了快速访问 DevTools 功能的方法。你可以使用 `Ctrl+K` 或 `Cmd+K` 快捷键打开它。

### 22. 分屏（Split Screen）

分屏功能允许你同时使用多个选项卡。点击 DevTools 左上角的图标来启用。

### 23. 弹出窗口（Popup）

弹出窗口功能适用于双屏显示的用户，可以通过点击 DevTools 左上角的图标来打开它。

## 示例：如何使用 Nuxt Devtools

1. **启动 Devtools**

   启动你的 Nuxt 应用，然后在浏览器中打开 Devtools。例如，你可以在 `http://localhost:3000` 的 Nuxt 应用中打开 Devtools。

2. **查看页面**

   点击 “Pages” 选项卡，你会看到所有的路由列表。选择一个路由，查看它的布局和中间件信息，并使用文本框检查路由匹配情况。

3. **检查组件**

   在 “Components” 选项卡中，你可以看到应用中的所有组件及其来源。点击 Graph 视图，了解组件间的关系和依赖。

4. **分析构建**

   转到 “Build Analyze” 选项卡，点击 “Run Analyze” 来查看构建的捆绑包大小，并比较不同构建的报告。

5. **优化 SEO**

   在 “Open Graph” 选项卡中，查看页面的社交媒体预览卡，并添加缺失的 SEO 标签。

通过利用 Nuxt Devtools 的这些功能，你可以更高效地开发、调试和优化你的 Nuxt 应用。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 prefetchComponents 进行组件预取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a73257bce752/)
- [使用 onNuxtReady 进行异步初始化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/64b599de0716/)
- [使用 onBeforeRouteUpdate 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cdd338b2e728/)
- [使用 onBeforeRouteLeave 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cfb92785e131/)
- [使用 navigateTo 实现灵活的路由导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/30bdc45ab749/)
-

