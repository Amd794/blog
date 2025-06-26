---
url: /posts/11098eb685e9bd4009275da31c80ae6d/
title: Nuxt.js 应用中的 vite：compiled 事件钩子
date: 2024-11-19T00:18:53+08:00
updated: 2024-11-19T00:18:53+08:00
author: cmdragon

summary:
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

<img src="/images/2024_11_19 15_00_51.png" title="2024_11_19 15_00_51.png" alt="2024_11_19 15_00_51.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



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

- [Nuxt.js 应用中的 vite：serverCreated 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/29cac3fa837d4b767f01a77d6adc60e1/)
- [Nuxt.js 应用中的 vite：configResolved 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2d9f94579481d38e0e9a7569cdfc31cb/)
- [Nuxt.js 应用中的 vite：extendConfig 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6bbb5474e945ea9d9a79c6cfcb6ec585/)
- [Nuxt.js 应用中的 schema：written 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bbc449caa5e31f1084aed152323c2758/)
- [Nuxt.js 应用中的 schema：beforeWrite 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9303f1529d95797ca3241f21e2fbc34d/)
- [Nuxt.js 应用中的 schema：resolved 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0a60978d2ce7bbcd5b86f9de0e5c99e2/)
- [Nuxt.js 应用中的 vite：extendConfig 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f2f4ee1ef433b4a19daa99da7bd9f07/)
- [Nuxt.js 应用中的 vite：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cdba81aa5bb32dcc233a8bd29adee923/)
- [Nuxt.js 应用中的 schema：extend事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b1d6a0b2258a699dc8415d298eecab45/)
- [Nuxt.js 应用中的 listen 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/59f320ae722d9803c0c4eb42ccb295b2/)
- [Nuxt.js 应用中的 prepare：types 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/68419c6dd94db64cbb46673ab19a5146/)
- [Nuxt.js 应用中的 build：error 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4a5e09829cf63001943fc481d69e01e0/)
- [Nuxt.js 应用中的 prerender：routes 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7a11deaf9e3d140fd18d7ad3cde4b9d7/)
- [Nuxt.js 应用中的 nitro：build：public-assets 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/271508b42bc005f41e4fa31830a84e83/)
- [Nuxt.js 应用中的 nitro：build：before 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a2820600faa85b49967d91cb7617c284/)
- [Nuxt.js 应用中的 nitro：init 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a8d7636d5643bafcee2bcc1767dcfa3b/)
- [Nuxt.js 应用中的 nitro：config 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/927aa434dc4886c8c357c9000e072b19/)
- [Nuxt.js 应用中的 components：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1189b069abd2cfe9869abbbb4f7f340b/)
- [Nuxt.js 应用中的 components：dirs 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/06467028093d81da701fced5b84150cb/)
- [Nuxt.js 应用中的 imports：dirs 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d59459d9a47584d99ecdca9732024835/)
- [Nuxt.js 应用中的 imports：context 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e94c7e1071e2541e95713c53eafd79ef/)
- [Nuxt.js 应用中的 imports：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1d6dcd3025621c288fddb7d17465133c/)
- [Nuxt.js 应用中的 imports：sources 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cf392e5071f22b4179114cece7e0e8b1/)
- [Nuxt.js 应用中的 server：devHandler 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e3271aac91ec30fc15176811b001ed48/)
- [Nuxt.js 应用中的 pages：extend 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/22eb7478a08b6f78043cd5fae24c7ad4/)
- [Nuxt.js 应用中的 builder：watch 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4cfe5f35f1a903646731a6c05a54d1dc/)
- [Nuxt.js 应用中的 builder：generateApp 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1191139984bd4df519af6d16a616949e/)
- [Nuxt.js 应用中的 build：manifest 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d69fdaae50601566d6f15c4e837c7cf3/)
- [Nuxt.js 应用中的 build：done 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7b79085749b7f156ed36cf16fca42310/)
- [Nuxt.js 应用中的 build：before 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/81e5857d6d3ff5e375f0f6734e25daac/)
- [Nuxt.js 应用中的 app：templatesGenerated 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3c565b88d4290c513e7c55ef934ec509/)
-

