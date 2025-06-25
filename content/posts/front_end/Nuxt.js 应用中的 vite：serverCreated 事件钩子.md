---
url: /posts/29cac3fa837d4b767f01a77d6adc60e1/
title: Nuxt.js 应用中的 vite：serverCreated 事件钩子
date: 2024-11-18T00:18:53+08:00
updated: 2024-11-18T00:18:53+08:00
author: cmdragon

summary:
   通过使用 vite:serverCreated 钩子，开发者可以在 Vite 服务器创建时执行特定的操作，包括添加中间件和自定义配置。这使得在开发环境中能够快速响应请求及调整服务器行为，从而提升开发效率和用户体验。

categories:
   - 前端开发

tags:
   - Nuxt
   - Vite
   - 钩子
   - 中间件
   - 日志
   - 跨域
   - 开发
---

<img src="https://static.cmdragon.cn/blog/images/2024_11_17 14_10_07.png@blog" title="2024_11_17 14_10_07.png" alt="2024_11_17 14_10_07.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Nuxt 3 中，`vite:serverCreated` 钩子允许开发者在 Vite 服务器创建完成后执行自定义逻辑。这一钩子的使用能够让开发者对服务器的行为进行动态调整，从而增强开发体验和系统的灵活性。

## 文章大纲

1. [定义与作用](#1-定义与作用)
2. [调用时机](#2-调用时机)
3. [参数说明](#3-参数说明)
4. [示例用法](#4-示例用法)
5. [应用场景](#5-应用场景)
    - [5.1 服务器中间件的添加](#51-服务器中间件的添加)
    - [5.2 自定义日志功能](#52-自定义日志功能)
    - [5.3 开发环境中的特殊处理](#53-开发环境中的特殊处理)
    - [5.4 处理跨域请求](#54-处理跨域请求)
6. [注意事项](#6-注意事项)
    - [6.1 性能考虑](#61-性能考虑)
    - [6.2 中间件的执行顺序](#62-中间件的执行顺序)
    - [6.3 适应性处理](#63-适应性处理)
7. [总结](#7-总结)

## 1. 定义与作用

- **`vite:serverCreated`** 是 Vite 的一个钩子，允许开发者在 Vite 服务器创建后立即执行某些操作。
- 通过这个钩子，您可以访问到服务器实例并进行自定义配置、增加中间件等操作。

## 2. 调用时机

`vite:serverCreated` 钩子在 Vite 服务器实例创建之后、开始监听请求之前调用。这一时机非常适合对服务器进行初始化或配置操作。

## 3. 参数说明

钩子接收两个参数：

1. **`viteServer`**: 当前创建的 Vite 服务器实例，包含了许多用于操作服务器的方法和属性。
2. **`env`**: 当前的环境变量，允许根据不同的环境采取不同的操作。

## 4. 示例用法

以下是如何使用 `vite:serverCreated` 钩子的基本示例，展示了如何在 Vite 服务器创建时添加自定义逻辑。

### 在 `plugins/viteServerCreated.js` 文件中的实现

```javascript
// plugins/viteServerCreated.js

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('vite:serverCreated', (viteServer, env) => {
    // 输出当前环境
    console.log('当前环境:', env.NODE_ENV);

    // 在服务器创建时添加自定义中间件
    viteServer.middlewares.use((req, res, next) => {
      console.log('请求路径:', req.url);
      next(); // 继续处理请求
    });
  });
});
```

## 5. 应用场景

### 5.1 服务器中间件的添加

通过 `vite:serverCreated` 钩子，您可以轻松向 Vite 服务器添加自定义中间件，处理特定的请求或响应。

```javascript
viteServer.middlewares.use((req, res, next) => {
  if (req.url === '/api/special') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('这是一个特殊的 API 响应');
  } else {
    next(); // 繼續替換為下一个中间件或处理器
  }
});
```

### 5.2 自定义日志功能

在开发过程中，捕捉并打印请求日志是一种常见需求。使用 `vite:serverCreated` 钩子，您可以轻松实现请求日志功能，记录请求的时间、方法和路径。

```javascript
viteServer.middlewares.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 请求方法: ${req.method} | 请求路径: ${req.url}`);
  next(); // 继续处理请求
});
```

### 5.3 开发环境中的特殊处理

您可以根据不同的环境变量，在开发环境中添加一些特定的处理逻辑。例如，您可能希望在开发模式下启用调试信息：

```javascript
if (env.NODE_ENV === 'development') {
  viteServer.middlewares.use((req, res, next) => {
    console.log('开发模式下的请求:', req.url);
    next(); // 继续处理请求
  });
}
```

### 5.4 处理跨域请求

在开发阶段，前端和后端通常运行在不同的端口上，这会导致跨域请求的问题。您可以通过添加 CORS 中间件来解决这个问题：

```javascript
viteServer.middlewares.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有域名进行访问
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的请求方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
  if (req.method === 'OPTIONS') {
    // 处理预检请求
    res.writeHead(204); // 无内容
    return res.end();
  }
  next();
});
```

## 6. 注意事项

### 6.1 性能考虑

在添加中间件时，需考虑对性能的影响。尽量避免在请求处理中进行阻塞操作，如复杂的计算或 I/O 操作。这些可能导致请求延迟或卡顿。

### 6.2 中间件的执行顺序

中间件的执行顺序会影响请求的处理方式。确保在设计中间件时明确运行顺序，避免逻辑冲突，如果一个中间件没有调用 `next()`，后续中间件将无法执行。

### 6.3 适应性处理

在编写中间件时，根据不同的环境变量进行适应性处理是必要的。例如，开发环境可以启用更多的调试信息，而生产环境则应保持简洁。通过 `env` 参数，您可以方便地实现此功能。

## 7. 总结

通过使用 `vite:serverCreated` 钩子，开发者可以在 Vite 服务器创建时执行特定的操作，包括添加中间件和自定义配置。这使得在开发环境中能够快速响应请求及调整服务器行为，从而提升开发效率和用户体验。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 vite：configResolved 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1266785cead8/)
- [Nuxt.js 应用中的 vite：extendConfig 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e1ea2c9a1566/)
- [Nuxt.js 应用中的 schema：written 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/11121d82a55c/)
- [Nuxt.js 应用中的 schema：beforeWrite 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/14f648e6cb9f/)
- [Nuxt.js 应用中的 schema：resolved 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c343331f3f06/)
- [Nuxt.js 应用中的 vite：extendConfig 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5ea147f7e6ee/)
- [Nuxt.js 应用中的 vite：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/76f8905ddea2/)
- [Nuxt.js 应用中的 schema：extend事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/271e7f413d3a/)
- [Nuxt.js 应用中的 listen 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bfdfe1fbb4cc/)
- [Nuxt.js 应用中的 prepare：types 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a893a1ffa34a/)
- [Nuxt.js 应用中的 build：error 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6ea046edf756/)
- [Nuxt.js 应用中的 prerender：routes 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/925363b7ba91/)
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
-

