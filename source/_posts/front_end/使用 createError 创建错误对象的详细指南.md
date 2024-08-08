---
title: 使用 createError 创建错误对象的详细指南
date: 2024/8/8
updated: 2024/8/8
author: cmdragon

excerpt:
  摘要：本文介绍了createError函数在Nuxt应用开发中的使用方法，用于创建带有附加元数据的错误对象，以提升错误处理的灵活性和用户体验。内容包括函数参数说明、在Vue组件和API路由中的应用实例、自定义错误页面的创建、错误的捕获与处理技巧，以及如何触发致命错误展示全屏错误提示。

categories:
  - 前端开发

tags:
  - 错误处理
  - Nuxt应用
  - Vue组件
  - API路由
  - 自定义错误
  - 元数据
  - 用户体验
---

<img src="https://static.cmdragon.cn/blog/images/2024_08_08 10_00_30.png@blog" title="2024_08_08 10_00_30.png" alt="2024_08_08 10_00_30.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在开发 nuxt 应用时，处理错误是确保用户体验不受影响的重要环节。我们可以使用 `createError` 函数来创建带有附加元数据的错误对象。

## 什么是 `createError`？

`createError` 是一个用于创建错误对象的函数，支持附加元数据，例如状态码、状态消息等。这些错误对象可以在Vue和Nitro部分的应用程序中使用，并且可以被抛出，从而在处理错误时提供更多上下文。

### 函数参数

`createError` 函数接收一个对象作为参数，这个对象可以包含以下属性：

- `cause`: 错误的根本原因（可选）
- `data`: 附加数据（可选）
- `message`: 错误消息（可选）
- `name`: 错误名（可选）
- `stack`: 错误堆栈（可选）
- `statusCode`: HTTP 状态码（可选）
- `statusMessage`: 状态消息（可选）
- `fatal`: 是否致命的标志（可选）

在以下示例中，我们将阐明如何在客户端和服务器端进行错误处理。

## 实例一：在 Vue 组件中使用 `createError`

在 Vue 组件中，我们可以使用 `createError` 抛出错误，以便在用户界面中处理。以下是一个示例，在这个示例中，我们尝试获取电影的详细信息，如果没有找到相关数据，则抛出一个带有 404 状态码的错误。

```vue
<template>
  <div>
    <h1>电影详情</h1>
    <p v-if="!data">加载中...</p>
    <p v-else>{{ data.title }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 使用 useFetch 获取电影数据
const { data } = await useFetch(`/api/movies/${route.params.slug}`)

// 如果没有找到数据，则抛出错误
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: '页面未找到' })
}
</script>
```

在这个例子中，如果电影数据没有找到，则用户将看到一个全屏的错误页面。

## 实例二：在 API 路由中使用 `createError`

除了在 Vue 组件中使用，我们也可以在 API 路由中使用 `createError` 来抛出错误。以下是一个示例，演示如何在 API 路由中处理不存在的资源。

```javascript
export default eventHandler(() => {
  // 假设这里没有找到请求的电影
  throw createError({
    statusCode: 404,
    statusMessage: '页面未找到'
  })
})
```

在这个示例中，当用户请求不存在的电影时，服务器将返回一个 404 错误，表示页面未找到。

## 处理错误

### 自定义错误页面

你可以通过在应用程序源目录中添加 `~/error.vue` 文件来自定义默认错误页面。此文件应包含处理错误的逻辑和显示错误信息的模板。

以下是一个简单的自定义错误页面示例：

```vue
<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>{{ error.statusCode }}</h2>
    <button @click="handleError">清除错误</button>
  </div>
</template>
```

### 错误对象

`error` 对象包含以下字段：

-   `url`: 发生错误的 URL
-   `statusCode`: HTTP 状态码
-   `statusMessage`: 状态消息
-   `message`: 错误详细信息
-   `description`: 错误描述
-   `data`: 附加的错误数据

如果你抛出一个自定义错误，确保使用 `data` 字段来存储自定义内容。

### 捕获和处理错误

建议使用 `onErrorCaptured` 或 `vue:error` 钩子来处理错误。你可以在 Nuxt 插件中配置这个钩子以捕获和处理错误：

```
// plugins/error-handler.ts
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('vue:error', (err) => {
    // 处理错误
  })
})
```

### 清除错误

当你准备移除错误页面时，你可以使用[clearError ](https://blog.cmdragon.cn/posts/1bf9b90dd386/) 函数来清除之前抛出的错误。在需要的时候，例如用户重新访问页面时，你可以使用它来恢复正常状态。

### 触发致命错误

如果你希望在客户端触发一个全屏的错误页面，可以通过设置 `fatal: true` 来实现。例如：

```javascript
throw createError({ statusCode: 500, message: '内部服务器错误', fatal: true })
```

这样一来，用户将看到一个更为明显的错误提示。

## 总结

使用 `createError` 函数可以更灵活地管理错误，提高用户体验。通过添加适当的错误消息和元数据，开发者可以帮助用户更好地理解发生了什么错误，并在需要时采取必要的措施。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [清除 Nuxt 状态缓存：clearNuxtState | cmdragon's Blog](https://blog.cmdragon.cn/posts/0febec81a1d1/)
- [清除 Nuxt 数据缓存：clearNuxtData | cmdragon's Blog](https://blog.cmdragon.cn/posts/0a7c0cc75cf1/)
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
-

