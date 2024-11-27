---
title: Nuxt.js 应用中的 webpack：progress 事件钩子
date: 2024/11/27
updated: 2024/11/27
author: cmdragon

excerpt:
  webpack:progress 钩子用于监听 Webpack 在构建过程中的进度更新。这是一个非常有用的特性，特别是在构建大型应用时，可以给开发者实时反馈，以便他们知道构建的进展情况。

categories:
  - 前端开发

tags:
  - Nuxt
  - Webpack
  - 进度
  - 构建
  - 钩子
  - 控制台
  - UI
---

<img src="https://static.cmdragon.cn/blog/images/2024_11_27 14_14_09.png@blog" title="2024_11_27 14_14_09.png" alt="2024_11_27 14_14_09.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

`webpack:progress` 钩子用于监听 Webpack 在构建过程中的进度更新。这是一个非常有用的特性，特别是在构建大型应用时，可以给开发者实时反馈，以便他们知道构建的进展情况。


## 文章目录

- [1. 引言](#1-引言)
- [2. `webpack:progress` 钩子概述](#2-webpackprogress-钩子概述)
- [3. 代码示例](#3-代码示例)
  - [3.1. 控制台输出 progress 状态](#31-控制台输出-progress-状态)
  - [3.2. 在 UI 中显示进度条](#32-在-ui-中显示进度条)
  - [3.3. 处理不同阶段的状态更新](#33-处理不同阶段的状态更新)
- [4. 注意事项](#4-注意事项)
- [5. 总结](#5-总结)

## 1. 引言

在现代前端开发中，Webpack 往往用于处理复杂的构建流程。当构建过程较长时，能够直观地展示构建进展可以极大地改善开发体验。`webpack:progress` 钩子使得开发者能够捕获构建的不同阶段及其进度信息，并进行相应的处理和反馈。

## 2. `webpack:progress` 钩子概述

### 一般介绍

`webpack:progress` 钩子是一个事件钩子，主要用于显示构建进度。它会在 Webpack 的构建过程中被调用，参数包括包含当前进度和状态信息的 `statesArray`。

### 作用

通过 `webpack:progress` 钩子，开发者可以：
- 实时输出构建的进度信息。
- 向用户展示构建界面的更新。
- 根据构建的不同状态做出反应。

## 3. 代码示例

### 3.1. 控制台输出 progress 状态

**目的**: 在控制台中输出当前构建进度。

```javascript
// plugins/webpackProgress.js

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:progress', (percentage, message, ...statesArray) => {
    console.log(`构建进度: ${Math.round(percentage * 100)}%`);
    console.log(`当前阶段: ${message}`);
    console.log('状态详情:', statesArray);
  });
});
```

### 3.2. 在 UI 中显示进度条

**目的**: 使用 UI 库展示一个进度条来表示构建进度。

```javascript
// plugins/webpackProgress.js
import { ElLoading } from 'element-plus'; // 使用 Element Plus 作为 UI 组件库

const loadingInstance = ElLoading.service({ text: '正在编译...', fullscreen: true });

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:progress', (percentage) => {
    // 更新 UI 中的进度条
    loadingInstance.text = `构建进度: ${Math.round(percentage * 100)}%`;
  });
});
```

### 3.3. 处理不同阶段的状态更新

**目的**: 可以根据构建过程中的不同状态更新做出相应的反应。

```javascript
// plugins/webpackProgress.js

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('webpack:progress', (percentage, message) => {
    if (percentage < 1) {
      console.log(`构建中... 当前进度: ${Math.round(percentage * 100)}%`);
    } else {
      console.log('构建已完成！');
    }

    // 根据当前阶段的不同输出相应的信息
    if (message.includes('Compiling')) {
      console.log('正在编译...');
    } else if (message.includes('Building')) {
      console.log('正在构建...');
    }
  });
});
```

## 4. 注意事项

- **频率控制**: 在进度更新事件中输出的频率较高，需注意控制输出频率，以避免输出过多导致性能问题或控制台混乱。
- **UI 更新性能**: 若在 UI 界面中显示进度，请确保更新过程不会引发重复渲染，以保持流畅。
- **不同阶段的处理**: 根据实际需求，开发者可以决定是否对进度和状态信息进行复杂的逻辑处理。

## 5. 总结

`webpack:progress` 钩子为开发者提供了一个能够实时获取和处理构建进度信息的机制。通过简单的代码，开发者不仅可以在控制台输出构建进度，还可以在应用的用户界面中反馈进度信息。这种实时反馈为开发者提供了更加直观、友好的编程体验。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 webpack：done 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3e8fa49cbd4b/)
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
-

