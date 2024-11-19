---
title: Nuxt.js 应用中的 vite：compiled 事件钩子
date: 2024/11/19
updated: 2024/11/19
author: cmdragon

excerpt:
   在 Nuxt 3 中，vite:compiled 钩子允许开发者在 Vite 编译完成后执行自定义逻辑。通过这个钩子，开发者可以在代码编译完成后进行一些必要的处理，比如输出编译状态、更新 UI 或触发其他事件。

categories:
   - 前端开发

tags:
   - Nuxt
   - Vite
   - 钩子
   - 编译
   - 自定义
   - 热更新
   - 性能
---

<img src="https://static.cmdragon.cn/blog/images/2024_11_19 15_00_51.png@blog" title="2024_11_19 15_00_51.png" alt="2024_11_19 15_00_51.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Nuxt 3 中，`vite:compiled` 钩子允许开发者在 Vite 编译完成后执行自定义逻辑。通过这个钩子，开发者可以在代码编译完成后进行一些必要的处理，比如输出编译状态、更新 UI 或触发其他事件。

## 文章大纲

1. [定义与作用](#1-定义与作用)
2. [调用时机](#2-调用时机)
3. [示例用法](#4-示例用法)
4. [应用场景](#5-应用场景)
    - [5.1 执行自定义逻辑](#51-执行自定义逻辑)
    - [5.2 生成编译信息](#52-生成编译信息)
    - [5.3 触发热更新](#53-触发热更新)
5. [注意事项](#6-注意事项)
    - [6.1 性能考虑](#61-性能考虑)
    - [6.2 异步处理](#62-异步处理)
    - [6.3 开发环境与生产环境的差异](#63-开发环境与生产环境的差异)
6. [总结](#7-总结)

## 1. 定义与作用

- **`vite:compiled`** 是 Vite 的一个钩子，允许开发者在 Vite 编译完成后立即执行某些操作。
- 通过这个钩子，开发者可以在代码编译完成后进行状态记录、触发通知或其他自定义逻辑。

## 2. 调用时机

`vite:compiled` 钩子在 Vite 编译文件后的即时阶段触发，此时可以确保编译好的资源是最新的。

## 3. 示例用法

以下是如何使用 `vite:compiled` 钩子的基本示例，展示了如何在 Vite 编译完成后添加自定义逻辑。

### 在 `plugins/viteCompiled.js` 文件中的实现

```javascript
// plugins/viteCompiled.js
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('vite:compiled', () => {
    console.log('Vite 编译完成');

    // 可以在这里执行其他自定义逻辑
    // 例如，发送一个通知或者更新某个状态
  });
});
```

## 5. 应用场景

### 5.1 执行自定义逻辑

您可以在编译完成后执行一些自定义逻辑，例如发送请求到一个 API 以通知外部服务编译成功。

```javascript
nuxtApp.hooks('vite:compiled', () => {
  const notifyCompletion = async () => {
    try {
      const response = await fetch('/api/notifyCompilationComplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('通知结果:', data);
    } catch (error) {
      console.error('通知请求失败:', error);
    }
  };

  notifyCompletion();
});
```

### 5.2 生成编译信息

在开发过程中，记录编译信息可能会很有用。在钩子中，您可以输出编译的状态。

```javascript
nuxtApp.hooks('vite:compiled', () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 编译完成`);
});
```

### 5.3 触发热更新

您可以在编译完成后触发热更新，以确保开发者看到最新的变化。

```javascript
nuxtApp.hooks('vite:compiled', () => {
  console.log('触发热更新以更新编译后的模块...');
  // 这里可以通过触发某个自定义事件来实现热更新
});
```

## 6. 注意事项

### 6.1 性能考虑

在 `vite:compiled` 钩子中加入自定义逻辑时，注意可能对性能的影响。尽量避免执行阻塞性操作，特别是长时间运行的任务。

### 6.2 异步处理

如果在钩子中执行异步操作（如 API 请求），确保正确处理 Promise。可以使用 `async/await` 或 `.then()` 来管理异步流程。

### 6.3 开发环境与生产环境的差异

在不同环境中，执行的逻辑可能需要有所不同。您可以根据 `process.env.NODE_ENV` 的值，决定是否执行某些操作。

```javascript
nuxtApp.hooks('vite:compiled', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('在开发模式下执行附加逻辑');
  }
});
```

## 7. 总结

通过使用 `vite:compiled` 钩子，开发者能够在 Vite 编译完成时执行自定义操作，进一步提升开发效率和用户体验。如

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 vite：serverCreated 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ab7710befd8e/)
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
-

