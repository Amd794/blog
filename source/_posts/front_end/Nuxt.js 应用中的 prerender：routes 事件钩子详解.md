---
title: Nuxt.js 应用中的 prerender：routes 事件钩子详解
date: 2024/11/6
updated: 2024/11/6
author: cmdragon

excerpt:
   prerender:routes 是 Nuxt.js 中的一个钩子，允许开发者在预渲染过程中扩展要预渲染的路由列表。这对于静态站点生成（SSG）尤为重要，开发者可以根据需求添加额外的动态路由或者其他需要预渲染的页面。

categories:
   - 前端开发

tags:
   - Nuxt
   - SSG
   - 预渲染
   - 钩子
   - 路由
   - 动态
   - SEO
---

<img src="https://static.amd794.com/blog/images/2024_11_06 15_08_04.png@blog" title="2024_11_06 15_08_04.png" alt="2024_11_06 15_08_04.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

# `prerender:routes` 钩子详解

`prerender:routes` 是 Nuxt.js 中的一个钩子，允许开发者在预渲染过程中扩展要预渲染的路由列表。这对于静态站点生成（SSG）尤为重要，开发者可以根据需求添加额外的动态路由或者其他需要预渲染的页面。

---

## 目录

1. [概述](#1-概述)
2. [prerender:routes 钩子的详细说明](#2-prerenderroutes-钩子的详细说明)
   - 2.1 [钩子的定义与作用](#21-钩子的定义与作用)
   - 2.2 [调用时机](#22-调用时机)
   - 2.3 [参数说明](#23-参数说明)
3. [具体使用示例](#3-具体使用示例)
   - 3.1 [扩展预渲染路由的示例](#31-扩展预渲染路由的示例)
4. [应用场景](#4-应用场景)
5. [注意事项](#5-注意事项)
6. [关键要点](#6-关键要点)
7. [总结](#7-总结)

---

### 1. 概述

`prerender:routes` 钩子为开发者提供了在 Nuxt.js 构建过程中扩展和定制要预渲染的路由的能力。通过使用这一钩子，可以根据不同的需求添加额外的路由，确保所有需要的页面都能在构建时被预渲染及生成静态 HTML 文件。

### 2. prerender:routes 钩子的详细说明

#### 2.1 钩子的定义与作用

- **定义**: `prerender:routes` 是 Nuxt.js 的一个生命周期钩子，允许在预渲染阶段向要预渲染的路由列表中添加自定义路由。
- **作用**: 通过此钩子，可以确保特定的动态路由或特定条件下的页面能被包括在静态生成过程中。

#### 2.2 调用时机

- **执行环境**: 在静态生成的过程中被调用，通常用于服务器渲染（SSR），以准备生成静态内容。
- **挂载时机**: 在预渲染的步骤之前，开发者可以添加或修改将要预渲染的路由列表。

#### 2.3 参数说明

- **routes**: 该参数表示当前计划被预渲染的路由阵列。开发者可以在这个阵列中添加更多路由。

### 3. 具体使用示例

#### 3.1 扩展预渲染路由的示例

```javascript
// plugins/prerenderRoutes.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('prerender:routes', (routes) => {
    // 添加额外要预渲染的路由
    routes.push('/example');
    routes.push('/dynamic?id=1'); // 假设这是一个动态路由

    console.log('Current prerender routes:', routes);
  });
});
```

在这个示例中，我们使用 `prerender:routes` 钩子向要预渲染的路由列表中添加了 `/example` 和一个动态路由 `/dynamic?id=1`。这样的配置会确保在构建时这些页面可以被预渲染。

### 4. 应用场景

1. **动态路由支持**: 根据数据动态生成的路由需要在构建时进行预渲染。
2. **条件路由**: 根据环境或特定条件，添加或修改要预渲染的路由。
3. **SEO 优化**: 确保所有对搜索引擎优化（SEO）至关重要的页面都被预渲染。

### 5. 注意事项

- **路由完整性**: 添加的路由必须是有效的路由，否则生成过程可能会出错。
- **动态内容**: 对于需要动态获取数据的路由，确保路由的状态在构建时是可用的。
- **构建时间影响**: 添加过多的路由可能导致构建时间延长，请根据实际需求谨慎添加。

### 6. 关键要点

- `prerender:routes` 钩子允许开发者扩展预渲染的路由列表，以满足项目需求。
- 可以为静态站点生成过程中的路由添加更多灵活性和扩展性。

### 7. 总结

`prerender:routes` 钩子为 Nuxt.js 开发者在静态生成和预渲染过程中提供了极大的灵活性。通过使用该钩子，开发者可以确保所有必要的页面在构建时被预渲染，提升网站性能及 SEO 效果。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 nitro：build：public-assets 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e3ab63fec9ce/)
- [Nuxt.js 应用中的 nitro：build：before 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1c70713c402c/)
- [Nuxt.js 应用中的 nitro：init 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8122bb43e5c6/)
- [Nuxt.js 应用中的 nitro：config 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/61ef115005d4/)
- [Nuxt.js 应用中的 components：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f1df4f41c9a9/)
- [Nuxt.js 应用中的 components：dirs 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0f896139298c/)
- [Nuxt.js 应用中的 imports：dirs 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ddb970c3c508/)
- [Nuxt.js 应用中的 imports：context 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/95d21c3b16f6/)
- [Nuxt.js 应用中的 imports：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/002d9daf4c46/)
- [Nuxt.js 应用中的 imports：sources 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f4858dcadca1/)
- [Nuxt.js 应用中的 server：devHandler 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/801ed4ce0612/)
- [Nuxt.js 应用中的 pages：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/83af28e7c789/)
- [Nuxt.js 应用中的 builder：watch 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/fa5b7db36d2d/)
- [Nuxt.js 应用中的 builder：generateApp 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/adc96aee3b3c/)
- [Nuxt.js 应用中的 build：manifest 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/523de9001247/)
- [Nuxt.js 应用中的 build：done 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/41dece9c782c/)
- [Nuxt.js 应用中的 build：before 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/eb2bd3bbfab8/)
- [Nuxt.js 应用中的 app：templatesGenerated 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b76b5d553a8b/)
- [Nuxt.js 应用中的 app：templates 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ace6c53275c4/)
- [Nuxt.js 应用中的 app：resolve 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9ea12f07cc2a/)
- [Nuxt.js 应用中的 modules：done 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/397fbad66fab/)
- [Nuxt.js 应用中的 modules：before 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5b5669bca701/)
- [Nuxt.js 应用中的 restart 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/25888bf37a0f/)
- [Nuxt.js 应用中的 close 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ec1665a791a5/)
- [Nuxt.js 应用中的 ready 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/37d771762c8f/)
- [Nuxt.js 应用中的 kit：compatibility 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/52224e8e71ec/)
- [Nuxt.js 应用中的 page：transition：finish 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/80acaed2b809/)
- [Nuxt.js 应用中的 page：finish 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2e422732f13a/)
- [Nuxt.js 应用中的 page：start 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9876204f1a7b/)
- [Nuxt.js 应用中的 link：prefetch 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3821d8f8b93e/)
- [Nuxt.js 应用中的 app：suspense：resolve 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/aca9f9d7692b/)
-


