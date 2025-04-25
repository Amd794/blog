---
title: Nuxt.js 应用中的 app：rendered 钩子详解
date: 2024/10/2
updated: 2024/10/2
author: cmdragon

excerpt:
  摘要：本文详细介绍了 Nuxt.js 应用程序中的 app:rendered 钩子，包括其定义、调用时机、上下文信息以及通过实际案例展示如何记录性能和发送日志到服务器。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 服务器渲染
  - 生命周期
  - 钩子函数
  - 性能监控
  - 日志记录
  - SSR优化
---

<img src="https://static.amd794.com/blog/images/2024_10_02 12_00_37.png@blog" title="2024_10_02 12_00_37.png" alt="2024_10_02 12_00_37.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

## 目录

1. [概述](#1-概述)
2. [`app:rendered` 钩子的定义](#2-apprendered-钩子的定义)
3. [调用时机与上下文](#3-调用时机与上下文)
4. [实际应用示例](#4-实际应用示例)
   - [示例1：记录性能](#示例1记录性能)
   - [示例2：发送日志到服务器](#示例2发送日志到服务器)
5. [注意事项](#5-注意事项)
6. [常见问题与解答](#6-常见问题与解答)
7. [练习题](#7-练习题)
8. [总结](#8-总结)

---

### 1. 概述

在 Nuxt.js 中，`app:rendered` 是一个钩子，可以用来监听服务器端渲染（SSR）完成后的事件。它使开发人员可以在渲染完成后执行特定的逻辑，例如日志记录、性能监控或处理其他需要在服务器端完成渲染的操作。

### 2. `app:rendered` 钩子的定义

`app:rendered` 是 Nuxt.js 应用程序的生命周期钩子之一，主要用于服务器端。钩子可以通过 `app.hook` 函数添加，接收一个参数 `renderContext`，其中包含了关于当前渲染的上下文信息。

### 3. 调用时机与上下文

#### 调用时机

- `app:rendered` 钩子在每个服务器端请求的渲染完成后被调用。这意味着每当用户请求一个新的页面并且服务器成功完成其渲染时，该钩子就会触发。

#### 上下文参数 (`renderContext`)

在调用该钩子时，会提供一个 `renderContext` 对象，通常包含以下内容：

- **url**: 当前访问的 URL。
- **state**: 当前应用的状态，包括 Vuex 状态等。
- **statusCode**: HTTP 响应状态码，指示请求的成功与否。
- **route**: 当前匹配的路由信息。

### 4. 实际应用示例

#### 示例1：记录性能

在这个示例中，我们将记录每次渲染的耗时，以帮助开发者分析性能瓶颈。

```javascript
export default {
  setup(app) {
    app.hook('app:rendered', (renderContext) => {
      const start = Date.now();
      
      // 处理完成的逻辑
      console.log('页面渲染完成:', renderContext.url);
      
      const end = Date.now();
      const duration = end - start;
      console.log(`渲染 ${renderContext.url} 耗时: ${duration}ms`);
    });
  }
};
```

在这个示例中，每次页面渲染成功后，将输出该页面的 URL 和渲染所需的时间。

#### 示例2：发送日志到服务器

在这个示例中，我们将演示如何将渲染信息发送到日志服务器，以进行更深入的分析。

```javascript
export default {
  setup(app) {
    app.hook('app:rendered', async (renderContext) => {
      try {
        const response = await fetch('https://your-log-server.com/log', {
          method: 'POST',
          body: JSON.stringify({
            url: renderContext.url,
            statusCode: renderContext.statusCode,
            state: renderContext.state
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('日志发送成功:', response.status);
      } catch (error) {
        console.error('发送日志失败:', error);
      }
    });
  }
};
```

在这个示例中，每次 SSR 渲染完成后，会将相关信息以 POST 请求形式发送到指定的日志服务器。

### 5. 注意事项

- **性能影响**: 在 `app:rendered` 钩子中执行耗时操作可能会影响响应时间，因此建议将耗时任务（如网络请求）异步处理，或尽量简化处理逻辑。
- **无状态**: 钩子仅在服务器端调用，不会在客户端重新渲染时触发。
- **安全性**: 确保敏感数据不会在日志中泄露，尤其是在生产环境中。

### 6. 常见问题与解答

- **这个钩子会在客户端触发吗？**
  - 不会，`app:rendered` 钩子仅在服务器端完成渲染后触发。
  
- **如何获取完整的渲染状态？**
  - 可以通过 `renderContext.state` 获取组件状态、Vuex 状态等，但需要确保相关状态在渲染之前已经被准备好。

- **如果有多个页面请求，这个钩子会触发多少次？**
  - 每次请求都会触发一次，所以如果用户请求多个页面，钩子会被调用多次，每次调用的上下文将反映当前的请求状态。

### 7. 练习题

1. 尝试在 `app:rendered` 钩子中分析不同页面的访问频率，并存储到数据库。
2. 使用 `app:rendered` 钩子监控用户访问的 URL 和状态，如果状态为 404，记录相应的信息。
3. 结合 Vuex 状态，尝试在渲染后发送有关用户行为的数据回服务器。

### 8. 总结

`app:rendered` 钩子在 Nuxt.js 的 SSR 渲染过程中扮演着关键角色，使开发者可以在渲染完成后执行多种逻辑。通过合理利用这个钩子，开发者可以进行诸如性能监控、日志记录等操作，从而提升用户体验和应用的可维护性。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：


## 往期文章归档：

- [应用中的错误处理概述 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c9b317a962a/)
- [理解 Vue 的 setup 应用程序钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/405db1302a23/)
- [深入理解 Nuxt.js 中的 app：data：refresh 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6f0c4f34bc45/)
- [深入理解 Nuxt.js 中的 app：error：cleared 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/732d62232fb8/)
- [深入理解 Nuxt.js 中的 app：error 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cb83a085e7a4/)
- [深入理解 Nuxt 中的 app created 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/188ad06ef45a/)
- [Nuxt Kit 实用工具的使用示例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a66da411afd2/)
- [使用 Nuxt Kit 的构建器 API 来扩展配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f6e87c3cf111/)
- [Nuxt Kit 使用日志记录工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/37ad5a680e7d/)
- [Nuxt Kit API ：路径解析工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/441492dbf6ae/)
- [Nuxt Kit中的 Nitro 处理程序 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2bd1fe409aca/)
- [Nuxt Kit 中的模板处理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4cf144d7b562/)
- [Nuxt Kit 中的插件：创建与使用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/080baafc9cf0/)
- [Nuxt Kit 中的布局管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1c99e3fc4fb0/)
- [Nuxt Kit 中的页面和路由管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/85c68e006ffc/)
- [Nuxt Kit 中的上下文处理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/83b074b7a330/)
- [Nuxt Kit 组件管理：注册与自动导入 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1097e357ea9a/)
- [Nuxt Kit 自动导入功能：高效管理你的模块和组合式函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/54548c5422db/)
- [使用 Nuxt Kit 检查模块与 Nuxt 版本兼容性 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7739f2e3f502/)
- [Nuxt Kit 的使用指南：从加载到构建 | cmdragon's Blog](https://blog.cmdragon.cn/posts/89214487bbdc/)
- [Nuxt Kit 的使用指南：模块创建与管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4dc052ff586b/)
- [使用 nuxi upgrade 升级现有nuxt项目版本 | cmdragon's Blog](https://blog.cmdragon.cn/posts/07ce67a781de/)
- [如何在 Nuxt 3 中有效使用 TypeScript | cmdragon's Blog](https://blog.cmdragon.cn/posts/cd079a58ef40/)
-

