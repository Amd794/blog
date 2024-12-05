---
title: 使用 Nuxt 的 showError 显示全屏错误页面
date: 2024/8/26
updated: 2024/8/26
author: cmdragon

excerpt:
  摘要：本文介绍Nuxt.js中的showError方法用于显示全屏错误页面，包括其参数类型及使用方式，并演示了如何在页面中捕获并展示错误，还介绍了useError用于管理共享错误状态的方法。

categories:
  - 前端开发

tags:
  - Nuxt
  - 错误
  - 处理
  - 显示
  - 页面
  - 全屏
  - 组件
---

<img src="https://static.amd794.com/blog/images/2024_08_26 08_44_18.png@blog" title="2024_08_26 08_44_18.png" alt="2024_08_26 08_44_18.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在网页开发中，错误是不可避免的。为了提升用户体验，快速有效地处理错误是非常重要的。在 Nuxt.js
中，提供了一种简单的方法来处理和显示全屏错误页面，那就是使用 `showError` 方法。

## 什么是 `showError`？

`showError` 是 Nuxt.js 提供的一个函数，允许你在页面、组件和插件中快速显示全屏的错误信息。使用这个方法，你可以向用户展示友好的错误页面，使他们知道发生了什么问题。

### 参数说明

`showError` 接受一个参数，能够是以下几种类型：

1. 字符串 - 简单的错误信息，如：
   ```javascript
   showError("😱 哦不，一个错误被抛出了。")
   ```

2. 错误对象 - 你可以使用 JavaScript 的 Error 对象，提供更多的信息。

3. 部分对象 - 你可以传入一个对象，其中包含以下选项：
    - `statusCode`：HTTP 状态码（如 404）
    - `statusMessage`：状态信息（如 "页面未找到"）
    - `message`：错误信息
    - `stack`：错误的堆栈跟踪
    - `name`、`cause`、`data` 等

例如：

```javascript
showError({
    statusCode: 404,
    statusMessage: "页面未找到"
});
```

## 如何使用 `showError`

`showError` 方法可以在你的 Nuxt 应用中非常方便地使用。我们将通过以下步骤展示如何实现一个简单的错误处理机制：

1. **安装 Nuxt**：确保你的项目中安装了 Nuxt。

2. **创建页面**：创建一个示例页面，在该页面中你将故意引发一个错误。

3. **捕获错误**：在页面代码中使用 `showError` 来捕获和显示错误。

### 示例 Demo

在这里，我们将创建一个简单的 Nuxt 应用，在其中模拟一个 API 调用错误并使用 `showError` 来处理。

#### 1. 创建新项目

如果你还没有 Nuxt 项目，可以通过以下命令创建一个：

```bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
```

#### 2. 访问页面

在 `pages/index.vue` 文件中添加以下代码：

```vue

<template>
  <div>
    <h1>欢迎来到我的 Nuxt 应用</h1>
    <button @click="fetchData">获取数据</button>
  </div>
</template>

<script setup>

  const fetchData = async () => {
    try {
      // 模拟一个 API 调用
      throw new Error("模拟的网络错误");
    } catch (error) {
      // 使用 showError 显示错误
      showError(error);
    }
  };
</script>
```

### 3. 运行项目

在终端中运行以下命令启动 Nuxt 应用：

```bash
npm run dev
```

访问 `http://localhost:3000` 并点击“获取数据”按钮，你将看到一个全屏错误页面，显示了模拟的网络错误信息。

## 通过 `useError` 管理共享错误状态

如果你需要在多个组件之间共享错误状态，可以使用 `useError` 函数。通过将错误设置到状态中，你可以创建一个响应式的、支持
SSR（服务端渲染）的共享错误状态。

以下是如何使用 `useError` 的简单示例：

```vue

<template>
  <div>
    <h1>错误示例</h1>
    <button @click="triggerError">触发错误</button>
    <p v-if="error">{{ error.message }}</p>
  </div>
</template>

<script setup>

  const error = ref(null);

  // 触发错误的函数
  const triggerError = () => {
    const {setError} = useError();

    // 模拟错误
    const simulatedError = {
      statusCode: 500,
      statusMessage: "服务器内部错误"
    };

    setError(simulatedError);
    showError(simulatedError);
  };
</script>
```

在这个示例中，我们通过按钮触发了共享错误状态，并调用了 `showError` 来显示错误信息。

## 结论

通过使用 Nuxt.js 的 `showError` 和 `useError` 方法，你可以非常方便地处理应用中的错误，提升用户体验。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 setResponseStatus 函数设置响应状态码 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0e3e22c2447a/)
- [如何在 Nuxt 中动态设置页面布局 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6168aad26848/)
- [使用 reloadNuxtApp 强制刷新 Nuxt 应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c2c24219f5c0/)
- [使用 refreshNuxtData 刷新 Nuxt应用 中的数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7696049934fb/)
- [使用 prerenderRoutes 进行预渲染路由 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b28890e5d54d/)
- [使用 preloadRouteComponents 提升 Nuxt 应用的性能 | cmdragon's Blog](https://blog.cmdragon.cn/posts/851697425a66/)
- [使用 preloadComponents 进行组件预加载 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6f58e9a6735b/)
- [使用 prefetchComponents 进行组件预取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a73257bce752/)
- [使用 onNuxtReady 进行异步初始化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/64b599de0716/)
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
-

