---
title: Nuxt.js 应用中的 build：manifest 事件钩子详解
date: 2024/10/22
updated: 2024/10/22
author: cmdragon

excerpt:
   build:manifest 是 Nuxt.js 中的一个生命周期钩子，它在 Vite 和 Webpack 构建清单期间被调用。利用这个钩子，开发者可以自定义 Nitro 渲染在最终 HTML 中的标签所使用的清单。这为对构建输出的深入控制提供了可能，开发者可以根据实际需要调整脚本和样式的引入方式。

categories:
   - 前端开发

tags:
   - Nuxt
   - 钩子
   - 构建
   - 清单
   - 自定义
   - 控制
   - 优化
---

<img src="https://static.amd794.com/blog/images/2024_10_22 11_50_08.png@blog" title="2024_10_22 11_50_08.png" alt="2024_10_22 11_50_08.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



`build:manifest` 是 Nuxt.js 中的一个生命周期钩子，它在 Vite 和 Webpack 构建清单期间被调用。利用这个钩子，开发者可以自定义 Nitro 渲染在最终 HTML 中的 `<script>` 和 `<link>` 标签所使用的清单。这为对构建输出的深入控制提供了可能，开发者可以根据实际需要调整脚本和样式的引入方式。

---

## 目录

1. [概述](#1-概述)
2. [build:manifest 钩子的详细说明](#2-buildmanifest-钩子的详细说明)
   - 2.1 [钩子的定义与作用](#21-钩子的定义与作用)
   - 2.2 [调用时机](#22-调用时机)
   - 2.3 [返回值与异常处理](#23-返回值与异常处理)
3. [具体使用示例](#3-具体使用示例)
   - 3.1 [自定义脚本和样式示例](#31-自定义脚本和样式示例)
4. [应用场景](#4-应用场景)
5. [注意事项](#5-注意事项)
6. [关键要点](#6-关键要点)
7. [总结](#7-总结)

---

### 1. 概述

`build:manifest` 钩子提供了一种方式，使开发者可以在构建过程中修改 Nitro 生成的清单。这对于精细控制包的加载和优化非常重要。

### 2. build:manifest 钩子的详细说明

#### 2.1 钩子的定义与作用

- **定义**: `build:manifest` 是 Nuxt.js 的生命周期钩子，允许开发者定制构建清单的内容。
- **作用**: 该钩子可以用来调整最终输出的脚本和样式表，以满足特定的需求或优化。

#### 2.2 调用时机

- **执行环境**: 该钩子在构建清单阶段被触发，通常在 Vite 和 Webpack 的构建过程中。
- **挂载时机**: `build:manifest` 在 Nitro 准备渲染最终 HTML 时调用。

#### 2.3 返回值与异常处理

- 返回值: 可以返回自定义的清单对象，覆盖默认的构建清单。
- 异常处理: 在钩子中处理异常，以保证不会影响构建过程。

### 3. 具体使用示例

#### 3.1 自定义脚本和样式示例

```javascript
// plugins/buildManifestPlugin.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('build:manifest', (manifest) => {
    // 自定义脚本
    manifest.assets.push({
      version: '1.0.0',
      filepath: 'custom-script.js',
      type: 'script',
    });

    // 自定义样式
    manifest.assets.push({
      version: '1.0.0',
      filepath: 'custom-style.css',
      type: 'link',
    });

    // 输出修改后的清单
    console.log('Custom manifest updated:', manifest);
  });
});
```

在这个示例中，我们向构建清单中添加了自定义的脚本和样式，允许在最终生成的 HTML 中引入这些资源。

### 4. 应用场景

1. **优化加载**: 根据实际需要添加或移除脚本和样式，以提高页面加载性能。
2. **条件加载**: 实现基于环境变量的条件加载，例如在生产环境和开发环境中引入不同的文件。
3. **集成第三方库**: 方便地集成一些第三方库或工具，例如样式框架或分析工具。

### 5. 注意事项

- **测试**: 任何自定义更改都应进行充分测试，以确保不会影响应用的正常运行。
- **文件路径**: 验证新引入的文件路径是否正确，以避免404错误。
- **性能考量**: 在构建清单中添加过多不必要的资源可能会影响性能，所以要谨慎评估。

### 6. 关键要点

- `build:manifest` 钩子允许开发者自定义构建清单以改变最终 HTML 中的资源引入。
- 它提供了一种灵活的方式来调整应用的加载方式，提高应用性能和兼容性。
- 合理使用该钩子可以显著优化构建过程并提升用户体验。

### 7. 总结

`build:manifest` 钩子在 Nuxt.js 中为开发者提供了强大的构建清单定制能力。通过此钩子，开发者可以精准控制最终渲染的 `<script>` 和 `<link>` 标签，确保应用的表现和性能得到优化。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [Nuxt.js 应用中的 app：mounted 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a07f12bddf8c/)
- [Nuxt.js 应用中的 app：beforeMount 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bbdca1e3d9a5/)
- [Nuxt.js 应用中的 app：redirected 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c83b294c7a07/)
- [Nuxt.js 应用中的 app：rendered 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/26479872ffdc/)
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
-

