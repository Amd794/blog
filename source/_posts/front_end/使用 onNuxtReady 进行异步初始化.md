---
title: 使用 onNuxtReady 进行异步初始化
date: 2024/8/16
updated: 2024/8/16
author: cmdragon

excerpt:
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

<img src="https://static.cmdragon.cn/blog/images/2024_08_16 12_02_18.png@blog" title="2024_08_16 12_02_18.png" alt="2024_08_16 12_02_18.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

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
- [使用 useSeoMeta 进行 SEO 配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4ab349e1f178/)
- [Nuxt.js必读：轻松掌握运行时配置与 useRuntimeConfig | cmdragon's Blog](https://blog.cmdragon.cn/posts/014b8d25b5e5/)
- [Nuxt.js 路由管理：useRouter 方法与路由中间件应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ad9936895e09/)
-

