---
title: Nuxt.js 应用中的 vite：configResolved 事件钩子
date: 2024/11/17
updated: 2024/11/17
author: cmdragon

excerpt:
   在 Nuxt 3 中，vite:configResolved 钩子允许开发者在 Vite 配置被解析后访问已解析的配置项。这使得在构建过程中能够根据最终的配置进行动态调整和扩展。

categories:
   - 前端开发

tags:
   - Nuxt
   - Vite
   - 钩子
   - 配置
   - 构建
   - 动态
   - 调整
---

<img src="https://static.amd794.com/blog/images/2024_11_17 14_10_07.png@blog" title="2024_11_17 14_10_07.png" alt="2024_11_17 14_10_07.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Nuxt 3 中，`vite:configResolved` 钩子允许开发者在 Vite 配置被解析后访问已解析的配置项。这使得在构建过程中能够根据最终的配置进行动态调整和扩展。

## 文章大纲

1. [定义与作用](#1-定义与作用)
2. [调用时机](#2-调用时机)
3. [参数说明](#3-参数说明)
4. [示例用法](#4-示例用法)
5. [应用场景](#5-应用场景)
    - [5.1 访问已解析的配置](#51-访问已解析的配置)
    - [5.2 根据环境调整配置](#52-根据环境调整配置)
6. [注意事项](#6-注意事项)
7. [总结](#7-总结)

## 1. 定义与作用

- **`vite:configResolved`** 是 Vite 的一个钩子，允许在 Vite 配置被解析后执行某些操作。
- 通过这个钩子，开发者可以访问最终的 Vite 配置并根据需要进行进一步处理。

## 2. 调用时机

`vite:configResolved` 钩子在 Vite 配置解析完成后立即调用，这时候所有的默认值和用户配置都被合并到一起，形成完整的配置对象。

## 3. 参数说明

钩子接收两个参数：

1. **`viteInlineConfig`**: 解析后的 Vite 配置对象，包含了用户配置及默认值。
2. **`env`**: 当前的环境变量，可以用于根据不同环境做相应的逻辑处理。

## 4. 示例用法

下面是如何使用 `vite:configResolved` 钩子的基本示例，展示了如何访问已解析的 Vite 配置。

### 在 `plugins/viteConfigResolved.js` 文件中的实现

```javascript
// plugins/viteConfigResolved.js
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks('vite:configResolved', (viteInlineConfig, env) => {
    // 输出已解析的 Vite 配置
    console.log('已解析的 Vite 配置:', viteInlineConfig);

    // 根据当前环境动态调整配置
    if (env.NODE_ENV === 'development') {
      viteInlineConfig.server = {
        ...viteInlineConfig.server,
        open: true, // 在开发模式下自动打开浏览器
      };
    }
  });
});
```

## 5. 应用场景

### 5.1 访问已解析的配置

在构建过程中，能够无缝获取到完整的 Vite 配置，方便调试和追踪配置的变更：

```javascript
// 输出当前 Vite 的根目录
console.log('Vite 根目录:', viteInlineConfig.root);
```

### 5.2 根据环境调整配置

您可以根据不同的环境变量动态调整 Vite 配置，以更好地满足开发和生产环境的需求：

```javascript
if (env.NODE_ENV === 'production') {
  viteInlineConfig.build.minify = 'terser'; // 在生产环境中使用更好的压缩工具
}
```

## 6. 注意事项

- **安全性**: 确保对配置的操作不影响到其他依赖于 Vite 配置的功能，避免不必要的错误。
- **性能**: 虽然可以修改 Vite 配置，但尽量保持操作简单，以避免性能下降。

## 7. 总结

通过使用 `vite:configResolved` 钩子，开发者可以方便地访问和处理已解析的 Vite 配置，为项目的构建过程提供更多灵活性。无论是动态调整配置还是调试配置，`vite:configResolved` 都为开发者提供了强大的工具

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：


## 往期文章归档：

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
- [Nuxt.js 应用中的 app：resolve 事件钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9ea12f07cc2a/)
-

