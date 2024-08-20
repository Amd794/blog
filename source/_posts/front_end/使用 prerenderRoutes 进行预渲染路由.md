---
title: 使用 prerenderRoutes 进行预渲染路由
date: 2024/8/20
updated: 2024/8/20
author: cmdragon

excerpt:
  prerenderRoutes 函数是 Nuxt 3 中一个强大的工具，它能够帮助开发者优化页面加载速度和改善用户体验。通过使用 prerenderRoutes，你能够灵活地指定需要预渲染的路由，提升网站性能和 SEO 效果。


categories:
  - 前端开发

tags:
  - 前端
  - Nitro
  - 预渲染
  - SEO
  - 路由
  - 优化
  - 教程
---

<img src="https://static.cmdragon.cn/blog/images/2024_08_20 11_28_57.png@blog" title="2024_08_20 11_28_57.png" alt="2024_08_20 11_28_57.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在现代前端开发中，预渲染是提升网站性能和用户体验的一项重要技术。Nitro 的 `prerenderRoutes` 函数允许开发者指定额外需要预渲染的路由，尽管这些路由不一定会在生成的 HTML 中显示。

### 什么是预渲染？

预渲染是指在构建阶段生成静态 HTML 文件的过程，以便在用户请求时直接提供这些文件。这种方法可以显著提高页面加载速度，并且对于 SEO（搜索引擎优化）也有很大的帮助。

### `prerenderRoutes` 的基本用法

`prerenderRoutes` 函数允许你告诉 Nitro 需要预渲染哪些路由，即使这些路由的 HTML 不会直接显示在最终的网页中。

### 基本语法

以下是 `prerenderRoutes` 的基本用法：

```javascript

// 单个路由
prerenderRoutes('/');

// 多个路由
prerenderRoutes(['/', '/about']);
```
在终端窗口中，你可能会看到关于路由预渲染的日志信息。此时，/about 页面应该在你访问主页时已经被预渲染。
### 何时使用 `prerenderRoutes`

使用 `prerenderRoutes` 的场景主要包括：

- 你有某些静态页面需要被预渲染。
- 你想提升特定路由的SEO性能。

请注意，`prerenderRoutes` 只能在服务器端执行，若在浏览器中或其他非预渲染的环境中调用，将不会生效。

### 示例项目

我们将创建一个简单的项目，通过 `prerenderRoutes` 预渲染一些页面。

#### 步骤 1：安装所需依赖

确保你的项目中已安装 Nitro。可以通过以下命令安装：

```bash
npm install nitro
```

#### 步骤 2：项目结构

创建一个简单的项目结构：

```
my-nitro-project/
├── src/
│   ├── pages/
│   │   ├── index.vue
│   │   └── about.vue
│   └── server/
│       └── prerender.js
└── package.json
```

#### 步骤 3：创建页面

在 `src/pages/index.vue` 中添加以下代码：

```vue
<template>
  <div>
    <h1>首页</h1>
    <p>欢迎来到我的网站!</p>
  </div>
</template>
```

在 `src/pages/about.vue` 中添加以下代码：

```vue
<template>
  <div>
    <h1>关于我们</h1>
    <p>这是关于我们的页面。</p>
  </div>
</template>
```

#### 步骤 4：使用 `prerenderRoutes`

在 `src/server/prerender.js` 文件中，添加以下代码：

```javascript
import { defineEventHandler } from 'nitro'

export default defineEventHandler((event) => {
  // 预渲染首页和关于页面
  prerenderRoutes(['/', '/about']);
});
```

#### 步骤 5：构建项目

在项目根目录下，使用以下命令构建项目：

```bash
nitro build
```

#### 步骤 6：启动项目

构建完成后，使用如下命令启动项目：

```bash
nitro start
```

当项目启动后，你将能够访问 `/` 和 `/about` 路由，这些页面将会被预渲染。

### 结论

`prerenderRoutes` 函数是 Nuxt 3 中一个强大的工具，它能够帮助开发者优化页面加载速度和改善用户体验。通过使用 `prerenderRoutes`，你能够灵活地指定需要预渲染的路由，提升网站性能和 SEO 效果。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 createError 创建错误对象的详细指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/93b5a8ec52df/)
- [清除 Nuxt 状态缓存：clearNuxtState | cmdragon's Blog](https://blog.cmdragon.cn/posts/0febec81a1d1/)
- [清除 Nuxt 数据缓存：clearNuxtData | cmdragon's Blog](https://blog.cmdragon.cn/posts/0a7c0cc75cf1/)
- [使用 clearError 清除已处理的错误 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1bf9b90dd386/)
- [使用 addRouteMiddleware 动态添加中间 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a070155dbcfb/)
- [使用 abortNavigation 阻止导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c89ead546424/)
- [使用 $fetch 进行 HTTP 请求 | cmdragon's Blog](https://blog.cmdragon.cn/posts/07d91f7f1ac2/)
- [使用 useState 管理响应式状态 | cmdragon's Blog](https://blog.cmdragon.cn/posts/dad6ac94ddf0/)
- [使用 useServerSeoMeta 优化您的网站 SEO | cmdragon's Blog](https://blog.cmdragon.cn/posts/dd9cb519a7a9/)
-

