---
url: /posts/954e473bea4ec122949c8c7d84d32c95/
title: 使用 useLazyAsyncData 提升数据加载体验
date: 2024-07-19T00:18:53+08:00
updated: 2024-07-19T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文介绍useLazyAsyncData函数在Nuxt 3中的使用，以提升数据加载体验。此函数支持异步获取数据并在组件中处理挂起与错误状态，通过pending、error和data属性实现动态加载反馈。示例展示了如何创建Nuxt 3项目并利用该函数获取计数器数据，包括前端代码实现及简易后端模拟。

categories:
  - 前端开发

tags:
  - Nuxt 3
  - useLazyAsyncData
  - 异步加载
  - 数据获取
  - 前端开发
  - 组件优化
  - 用户体验
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_19 14_15_22.png@blog" title="2024_07_19 14_15_22.png" alt="2024_07_19 14_15_22.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

`useLazyAsyncData`是一个非常有用的内置函数，它允许我们在组件中异步获取数据，并在数据加载过程中处理挂起和错误状态。

## 什么是 useLazyAsyncData？

`useLazyAsyncData`是 Nuxt 3 中用于异步获取数据的内置函数。它允许你在组件的`setup`
函数中异步获取数据，并在数据加载过程中处理挂起和错误状态。这个函数返回一个对象，其中包含`pending`
（表示数据是否正在加载）、`error`（表示是否有错误发生）和`data`（表示获取到的数据）等属性。

- `pending`：这是一个布尔值，用于指示数据是否正在加载中。当`pending`为`true`时，表示数据获取仍在进行；当`pending`为`false`
  时，表示数据加载已完成或尚未开始。
- `error`：如果在数据获取过程中发生错误，`error`对象将包含有关错误的详细信息，例如错误消息和错误类型。
- `data`：成功获取到的数据将存储在`data`属性中。

## 示例：获取计数器数据

在这个示例中，我们将使用`useLazyAsyncData`来获取一个简单的计数器数据，并在页面上显示。

### 1. 创建 Nuxt 3 项目

首先，你需要创建一个 Nuxt 3 项目。你可以使用以下命令来创建项目：

```
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app

```

### 2. 创建页面

在`pages`目录下创建一个名为`index.vue`的文件，并添加以下内容：

```
<template>
  <div>
    <!-- 使用 v-if 和 v-else 指令来处理挂起和错误状态 -->
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">加载失败：{{ error.message }}</div>
    <div v-else>{{ count }}</div>
  </div>
</template>

<script setup>

// 使用 useLazyAsyncData 获取数据
const { pending, error, data: count } = useLazyAsyncData('count', () => $fetch('/api/count'));

// 监听 count 的变化
watch(count, (newCount) => {
  console.log('计数器值变化:', newCount);
});
</script>
```

假设我们有一个后端 API 提供计数器数据。您可以使用任何后端语言和框架来实现这个 API，例如使用 Node.js 和 Express 框架：

```
const express = require('express');
const app = express();

app.get('/api/count', (req, res) => {
  // 模拟随机的计数器值
  const count = Math.floor(Math.random() * 100);
  res.send({ count });
});

app.listen(3001, () => {
  console.log('服务器在 3001 端口运行');
});
```

### 3. 运行项目

在终端中运行以下命令来启动开发服务器：

```
npm run dev

```

### 4. 查看效果

打开浏览器并访问`http://localhost:3000`，你应该会看到以下内容：

- 如果数据正在加载，页面将显示“加载中...”。
- 如果数据加载失败，页面将显示错误信息。
- 如果数据加载成功，页面将显示计数器的值。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 中使用 useHydration 实现数据水合与同步 | cmdragon's Blog](https://blog.cmdragon.cn/posts/177c9c78744f/)
- [useHeadSafe：安全生成HTML头部元素 | cmdragon's Blog](https://blog.cmdragon.cn/posts/56ede6d7b04b/)
- [Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/28859392f373/)
- [探索Nuxt.js的useFetch：高效数据获取与处理指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b4311c856080/)
- [Nuxt.js 错误侦探：useError 组合函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a86a834c8e7a/)
- [useCookie函数：管理SSR环境下的Cookie | cmdragon's Blog](https://blog.cmdragon.cn/posts/f36e9827abb4/)
- [轻松掌握useAsyncData获取异步数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bdaee7956a6e/)
- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/133b896ec704/)
- [Nuxt框架中内置组件详解及使用指南（五） | cmdragon's Blog](https://blog.cmdragon.cn/posts/707e1176ace8/)
- [Nuxt框架中内置组件详解及使用指南（四） | cmdragon's Blog](https://blog.cmdragon.cn/posts/64c74472d95e/)
- [Nuxt框架中内置组件详解及使用指南（三） | cmdragon's Blog](https://blog.cmdragon.cn/posts/0524f12c820c/)
- [Nuxt框架中内置组件详解及使用指南（二） | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c234037b6fe/)
- [Nuxt框架中内置组件详解及使用指南（一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/22a2f8cb2cf0/)
- [Nuxt3 的生命周期和钩子函数（十一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/693a389ead2d/)
- 

