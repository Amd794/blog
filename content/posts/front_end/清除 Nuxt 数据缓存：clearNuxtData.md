---
url: /posts/b14ec150986ae8b8e56d2c37637e04fd/
title: 清除 Nuxt 数据缓存：clearNuxtData
date: 2024-08-06T00:18:53+08:00
updated: 2024-08-06T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文详细介绍了Nuxt.js框架中的clearNuxtData方法，用于清除useAsyncData和useFetch缓存的数据、错误状态和待处理promises，以实现数据的实时更新和重载。通过实际示例展示了在不同页面如何应用clearNuxtData来提升用户体验和数据新鲜度，包括方法签名、使用场景及具体代码实现步骤。

categories:
  - 前端开发

tags:
  - Nuxt
  - 缓存
  - 数据
  - 清除
  - 组件
  - 刷新
  - 路由
---

<img src="https://static.cmdragon.cn/blog/images/2024_08_06 10_02_16.png@blog" title="2024_08_06 10_02_16.png" alt="2024_08_06 10_02_16.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Nuxt.js 中，`useAsyncData` 和 `useFetch` 是两个非常常用的组合，用于从服务器获取数据并在组件中显示。如果你在应用中使用这两个组合器，你可能会需要一种方式来清除已经缓存的数据，尤其是在路由切换或数据更新时。

## 什么是 `clearNuxtData`？

`clearNuxtData` 是一个用于删除 `useAsyncData` 和 `useFetch` 的缓存数据、错误状态以及待处理的 promises 的方法。这个方法帮助开发者在想要使某些数据失效或重载数据时，能够方便地完成。

### 方法签名

```javascript
clearNuxtData(keys?: string | string[] | ((key: string) => boolean)): void
```

- **keys**：一个或多个在 `useAsyncData` 中使用的键，用于指定清除哪些缓存数据。如果不提供 `keys`，将会清除所有缓存的数据。

## 使用场景

- 当你需要重新获取某个页面的数据。
- 当你路由切换时，想让新页面的数据重新加载。
- 当你想清除特定的缓存数据以避免旧数据对用户的影响。

## 示例：如何使用 `clearNuxtData`

以下是一个简单的 Nuxt.js 应用示例，展示如何使用 `clearNuxtData`。

### 创建 Nuxt 应用

首先，确保你已创建并设置好了一个 Nuxt 应用。如果还没有，可以使用以下命令创建一个新项目。

```bash
npx nuxi@latest init my-nuxt-app
```

进入项目目录：

```bash
cd my-nuxt-app
```

### 1. 安装依赖

确保你的项目中已安装了 Nuxt 相关依赖。

### 2. 使用 `useAsyncData` 获取数据

在 `pages/index.vue` 中，我们将使用 `useAsyncData` 获取一些数据。

```vue
<template>
  <div>
    <h1>首页</h1>
    <button @click="reloadData">重新加载数据</button>
    <ul>
      <li v-for="item in data" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup>

const { data, refresh } = await useAsyncData('my-data-key', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  return await response.json()
})

const reloadData = () => {
  // 清除'我的数据键'的缓存
  clearNuxtData('my-data-key')
  // 重新加载数据
  refresh()
}
</script>
```

在上面的示例中，我们定义了一个按钮用于重新加载数据。`reloadData` 方法中，我们首先通过 `clearNuxtData` 清除了 `my-data-key` 的缓存数据，然后调用 `refresh` 方法重新加载数据。

### 3. 创建另一个页面

我们可以创建一个新的页面，比如 `pages/about.vue`，这个页面也会使用相同数据。

```vue
<template>
  <div>
    <h1>关于页</h1>
    <div>
      <h2>用户列表</h2>
      <ul>
        <li v-for="item in data" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
    <button @click="reloadData">重新加载数据</button>
  </div>
</template>

<script setup>

const { data, refresh } = await useAsyncData('my-data-key', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  return await response.json()
})

const reloadData = () => {
  clearNuxtData('my-data-key')
  refresh()
}
</script>
```

在这里，`about.vue` 也调用了 `clearNuxtData` 和 `refresh`，以确保在点击重新加载按钮时能够获取最新的数据。

### 4. 运行应用

在项目根目录下运行应用：

```bash
npm run dev
```

打开浏览器，访问 `http://localhost:3000`，你应该能够看到首页和关于页，每个页面都可以单独加载数据，并在需要时刷新数据。

## 总结

`clearNuxtData` 提供了一种简单而有效的方式来管理数据的缓存和状态。当你需要控制数据的无效性或者重新获取数据时，这个方法将非常有用。通过上面的示例，你可以开始在自己的 Nuxt 应用中使用 `clearNuxtData`，以提高用户体验和数据新鲜度。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 clearError 清除已处理的错误 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1bf9b90dd386/)
- [使用 addRouteMiddleware 动态添加中间 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a070155dbcfb/)
- [使用 abortNavigation 阻止导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c89ead546424/)
- [使用 $fetch 进行 HTTP 请求 | cmdragon's Blog](https://blog.cmdragon.cn/posts/07d91f7f1ac2/)
- [使用 useState 管理响应式状态 | cmdragon's Blog](https://blog.cmdragon.cn/posts/dad6ac94ddf0/)
- [使用 useServerSeoMeta 优化您的网站 SEO | cmdragon's Blog](https://blog.cmdragon.cn/posts/dd9cb519a7a9/)
- [使用 useSeoMeta 进行 SEO 配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4ab349e1f178/)
- [Nuxt.js必读：轻松掌握运行时配置与 useRuntimeConfig | cmdragon's Blog](https://blog.cmdragon.cn/posts/014b8d25b5e5/)
- [Nuxt.js 路由管理：useRouter 方法与路由中间件应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ad9936895e09/)
- [useRoute 函数的详细介绍与使用示例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/eb8617e107bf/)
- [使用 useRequestURL 组合函数访问请求URL | cmdragon's Blog](https://blog.cmdragon.cn/posts/666fa6c8a5ea/)
- [Nuxt.js 环境变量配置与使用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c79d66614163/)
- [服务端渲染中的数据获取：结合 useRequestHeaders 与 useFetch | cmdragon's Blog](https://blog.cmdragon.cn/posts/e38e8d28511a/)
- [使用 useRequestEvent Hook 访问请求事件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2f2570605277/)
- [使用 useNuxtData 进行高效的数据获取与管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5e9f5a2b593e/)
- [Nuxt 3 使用指南：掌握 useNuxtApp 和运行时上下文 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f51bb8ed8307/)
- [使用 useLazyFetch 进行异步数据获取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/117488d6538b/)
-

