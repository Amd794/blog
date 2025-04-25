---
title: Nuxt.js 应用中的 webpack：done 事件钩子
date: 2024/11/26
updated: 2024/11/26
author: cmdragon

excerpt:
  webpack:done 钩子用于处理 Webpack 编译完成后的逻辑。在 Webpack 编译的所有任务完成后，这个钩子会被调用，通常用于通知开发者编译的状态、执行清理工作或作为开发工具的提示。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - Webpack
  - 钩子
  - 编译
  - 清理
  - UI
  - 加载
---

<img src="https://static.amd794.com/blog/images/2024_11_26 14_35_18.png@blog" title="2024_11_26 14_35_18.png" alt="2024_11_26 14_35_18.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

`webpack:done` 钩子用于处理 Webpack 编译完成后的逻辑。在 Webpack 编译的所有任务完成后，这个钩子会被调用，通常用于通知开发者编译的状态、执行清理工作或作为开发工具的提示。


## 文章目录

- [1. 引言](#1-引言)
- [2. `webpack:done` 钩子概述](#2-webpackdone-钩子概述)
- [3. 代码示例](#3-代码示例)
  - [3.1. 输出编译成功信息](#31-输出编译成功信息)
  - [3.2. 执行清理操作](#32-执行清理操作)
  - [3.3. 在 UI 中显示 loading 状态结束](#33-在-ui-中显示-loading-状态结束)
- [4. 注意事项](#4-注意事项)
- [5. 总结](#5-总结)

## 1. 引言

随着现代前端开发的复杂性不断增加，Webpack 成为构建和打包工具的首选。编译的完成及状态监控在提升开发者体验上至关重要。`webpack:done` 钩子提供了一种优雅的方式来处理编译完成后的逻辑。

## 2. `webpack:done` 钩子概述

### 一般介绍

`webpack:done` 钩子在 Webpack 的所有构建任务完成后触发。它使得开发者能够干预这个时刻，进行成功通知、清理操作或其他需要在构建后运行的逻辑。

### 作用

使用 `webpack:done` 钩子，可以：
- 输出编译成功的信息到控制台。
- 执行任何需要在构建完成时进行的清理操作。
- 停止 loading 指示器或提示用户构建状态已完成。

## 3. 代码示例

### 3.1. 输出编译成功信息

**目的**: 在控制台中输出编译成功的信息。

```javascript
// plugins/webpackDone.js
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:done', () => {
    console.log('\nWebpack 编译完成！💻');
  });
});
```

### 3.2. 执行清理操作

**目的**: 在每次构建完成后，清理临时文件或缓存。

```javascript
// plugins/webpackDone.js
import { defineNuxtPlugin } from '#app';
import fs from 'fs';
import path from 'path';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:done', () => {
    const tempDir = path.resolve(__dirname, 'temp');

    // 清理临时文件夹
    fs.rm(tempDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('清理临时文件失败:', err);
      } else {
        console.log('临时文件已清理！');
      }
    });
  });
});
```

### 3.3. 在 UI 中显示 loading 状态结束

**目的**: 通过 UI 组件库停止 loading 状态显示。

```javascript
// plugins/webpackDone.js
import { defineNuxtPlugin } from '#app';
import { ElLoading } from 'element-plus'; // 假设使用 Element Plus

const loadingInstance = ElLoading.service({ text: '正在编译...', fullscreen: true });

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:done', () => {
    loadingInstance.close(); // 关闭 loading
    console.log('编译完成，所有操作已结束！');
  });
});
```

## 4. 注意事项

- **性能考虑**: 在 `webpack:done` 中执行的操作应尽量快速，以避免影响后续的构建流程。
- **异步操作**: 如果有异步操作，确保它们不会阻塞主线程，建议使用 async/await 或 Promise 进行控制。
- **用户体验**: 所有与用户交互的提示应友好且明确，确保开发者能够快速理解当前状态。

## 5. 总结

通过使用 `webpack:done` 钩子，开发者可以在每次构建完成后进行必要的后续操作或状态更新。无论是输出成功信息、进行清理还是关闭 loading 状态，该钩子都提供了便捷的解决方案

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 webpack：error 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0fb47ad58e14/)
- [Nuxt.js 应用中的 webpack：change 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/43a57e843f48/)
- [Nuxt.js 应用中的 webpack：compiled 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0b6ec5ce3d59/)
- [Nuxt.js 应用中的 webpack：compile 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7336c7f0809e/)
- [Nuxt.js 应用中的 webpack：configResolved事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/afe62aeeaf6f/)
- [Nuxt.js 应用中的 vite：compiled 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/973541933f38/)
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
-

