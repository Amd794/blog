---
url: /posts/838b6733c038fcb291025b2c777b3e8b/
title: 使用 onNuxtReady 进行异步初始化
date: 2024-08-16T00:18:53+08:00
updated: 2024-08-16T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文详细介绍了Nuxt.js框架中的onNuxtReady函数用途、使用场景及其实现步骤，并通过集成分析库的示例代码，指导开发者如何在应用初始化完成后执行异步操作，以优化用户体验。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 初始化
  - 插件
  - 分析
  - 库加载
  - 客户端
  - 异步
---

<img src="/images/2024_08_16 12_02_18.png" title="2024_08_16 12_02_18.png" alt="2024_08_16 12_02_18.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

# 使用 `onNuxtReady` 进行异步初始化

在 Nuxt.js 中，`onNuxtReady`
是一个非常有用的组合式函数，适合在应用程序初始化完成后执行一些不阻塞的代码。对于一些需要运行但不应影响初始渲染的代码（比如加载分析库、初始化第三方服务等），`onNuxtReady`
是理想的选择。

## 什么是 `onNuxtReady`？

`onNuxtReady` 是 Nuxt.js 提供的一个函数，它允许开发者在 Nuxt
应用程序完成初始化后运行某些代码。这意味着在页面首次渲染和用户看到页面之前，这段代码不会执行，因此不会造成用户体验的任何延迟。

**注意**：`onNuxtReady` 仅在客户端运行，这意味着它不会在服务器端渲染期间执行。

## 使用场景

常见的使用场景包括：

- 加载分析工具
- 初始化第三方库（例如图表库、地图服务等）
- 启动 WebSocket 连接

## 如何使用 `onNuxtReady`

在 Nuxt.js 项目中使用 `onNuxtReady` 的基本步骤如下：

1. 创建一个插件文件（如 `plugins/ready.client.ts`）。
2. 使用 `defineNuxtPlugin` 定义插件。
3. 在插件内部调用 `onNuxtReady`，并传入所需的异步逻辑。

以下是一个简单的示例，展示如何使用 `onNuxtReady` 加载一个假设的分析库。

### 示例：集成分析库

#### 步骤 1：创建插件文件

在你的 Nuxt.js 项目中，创建一个新的插件文件 `plugins/ready.client.ts`。

```typescript
// plugins/ready.client.ts

export default defineNuxtPlugin(() => {
    onNuxtReady(async () => {
        // 动态导入分析库
        const myAnalyticsLibrary = await import('my-big-analytics-library')

        // 使用分析库进行初始化
        myAnalyticsLibrary.initialize({
            trackingId: 'YOUR_TRACKING_ID',
        });

        console.log('Analytics library has been initialized.');
    });
});
```

#### 步骤 2：配置 `nuxt.config.ts`

确保你的插件文件在 `nuxt.config.ts` 中被配置为只在客户端运行。

```typescript
// nuxt.config.ts

export default defineNuxtConfig({
    plugins: [
        {src: '~/plugins/ready.client.ts', mode: 'client'},
    ],
});
```

#### 步骤 3：测试

现在，当你的 Nuxt 应用程序启动并加载完成后，`onNuxtReady` 中的代码将运行。分析库将被动态导入并初始化。打开浏览器的开发者工具，你将看到控制台输出：“Analytics
library has been initialized.”

## 总结

`onNuxtReady` 是一个强大的工具，能够让开发者在 Nuxt.js 应用的初始化完成后安全地运行某些逻辑。通过动态导入，你可以在不阻塞页面渲染的情况下加载库，提供更流畅的用户体验。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 onBeforeRouteUpdate 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d400882a80839b72cf628a6de608f0e8/)
- [使用 onBeforeRouteLeave 组合式函数提升应用的用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ec76c32456eed5c68935b916beb053c2/)
- [使用 navigateTo 实现灵活的路由导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f68163dee0a38a46b874f4885c661f48/)
- [使用 Nuxt 3 的 defineRouteRules 进行页面级别的混合渲染 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a067b4aecdd04032860d7102ebcef604/)
- [掌握 Nuxt 3 的页面元数据：使用 definePageMeta 进行自定义配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e0ecc27dccf7a9a8d8bf9a2d4fd3f00b/)
- [使用 defineNuxtRouteMiddleware 创建路由中间件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9820edb9b255785446531ea7b1ac2269/)
- [使用 defineNuxtComponent`定义 Vue 组件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8e9977db3a733bc649877087c3b87e91/)
- [使用 createError 创建错误对象的详细指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/58c4afd983d5e7a26462c4830ef807b5/)
- [清除 Nuxt 状态缓存：clearNuxtState | cmdragon's Blog](https://blog.cmdragon.cn/posts/54aef7263724952013d0fd71fcdcb38e/)
- [清除 Nuxt 数据缓存：clearNuxtData | cmdragon's Blog](https://blog.cmdragon.cn/posts/b14ec150986ae8b8e56d2c37637e04fd/)
- [使用 clearError 清除已处理的错误 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c7681141b499276ec9613c76b8bdb688/)
- [使用 addRouteMiddleware 动态添加中间 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0988eb75d14a8fc3b0db7d072206b8a8/)
- [使用 abortNavigation 阻止导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/52bba0b4e019da067ec5092a151c2bce/)
- [使用 $fetch 进行 HTTP 请求 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a189c208200be9973a4dd8d9029f2ab2/)
- [使用 useState 管理响应式状态 | cmdragon's Blog](https://blog.cmdragon.cn/posts/760deff1b835b737dc6396ad0e4cc8d4/)
- [使用 useServerSeoMeta 优化您的网站 SEO | cmdragon's Blog](https://blog.cmdragon.cn/posts/c321870c8c6db0d7f51b3f97ad7c1f4f/)
- [使用 useSeoMeta 进行 SEO 配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e7e7cf9c3099aeaf57badb3c4ecbb7f3/)
- [Nuxt.js必读：轻松掌握运行时配置与 useRuntimeConfig | cmdragon's Blog](https://blog.cmdragon.cn/posts/bbb706a14f541c1932c5a42b4cab92a6/)
- [Nuxt.js 路由管理：useRouter 方法与路由中间件应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2426831b3d48fe56fd7997565dde6857/)
-

