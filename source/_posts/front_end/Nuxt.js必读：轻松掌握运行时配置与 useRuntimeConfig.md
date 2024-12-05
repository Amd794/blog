---
title: Nuxt.js必读：轻松掌握运行时配置与 useRuntimeConfig
date: 2024/7/29
updated: 2024/7/29
author: cmdragon

excerpt:
  本文详细介绍了Nuxt.js中的运行时配置功能，包括定义和使用运行时配置的方法，以及如何通过useRuntimeConfig访问配置。同时，讲解了环境变量与.env文件的使用，特别是在不同环境下的配置管理。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 运行时配置
  - Vue.js
  - SSR
  - 环境变量
  - .env文件
  - useRuntimeConfig
---

<img src="https://static.amd794.com/blog/images/2024_07_29 17_49_17.png@blog" title="2024_07_29 17_49_17.png" alt="2024_07_29 17_49_17.png"/>


<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

Nuxt.js 是一个基于 Vue.js 的框架，它极大地简化了服务端渲染（SSR）和静态站点生成的开发过程。在 Nuxt.js 中，运行时配置是一个强大的功能，允许开发者根据不同的环境（如开发、生产等）动态地调整配置。


## 一、什么是运行时配置？

运行时配置是 Nuxt.js 中的一个特性，它允许你在不同的环境下使用不同的配置。例如，你可能需要在一个环境中使用一个 API 基础 URL，而在另一个环境中使用另一个 URL。运行时配置可以让你轻松实现这一点。

## 二、如何定义运行时配置？

在 Nuxt.js 中，你可以在 `nuxt.config.ts` 文件中定义运行时配置。以下是一个简单的例子：

```
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有密钥，仅在服务器端可用
    apiSecret: '123',

    // 公共密钥，可以在客户端和服务器端访问
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})

```
在这个例子中，`apiSecret` 是一个私有密钥，仅在服务器端可用。`apiBase` 是一个公共密钥，可以在客户端和服务器端访问。

## 三、如何使用 `useRuntimeConfig`？

`useRuntimeConfig` 是一个组合函数，用于在组件或 API 接口中访问运行时配置。以下是如何在组件中使用它的示例：

```
<template>
  <div>
    <h1>API Base URL: {{ config.public.apiBase }}</h1>
  </div>
</template>

<script>
export default {
  setup() {
    const config = useRuntimeConfig()
    return {
      config
    }
  }
}
</script>
```

在服务器端 API 中，你可以这样使用 `useRuntimeConfig`：

```
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  // 使用配置
})
```


## 四、环境变量与 `.env` 文件

你可以在 `.env` 文件中设置环境变量，以便在开发和构建过程中访问它们。例如：

```
NUXT_PUBLIC_API_BASE = "https://api.localhost:5555"
NUXT_API_SECRET = "123"

```

这些变量可以通过 `process.env` 在 Nuxt 应用中访问。

> 在**生产运行时**中，你应该使用平台的环境变量配置，而不是使用 `.env` 文件。**在构建完成后**，当你运行服务器时，`.env` 文件将不会被读取。具体如何设置环境变量取决于你的环境。


## 五、`  app ` 命名空间

在Nuxt.js中，app命名空间是用于存储一些特定的运行时配置的，这些配置通常与应用的全局行为和设置相关。在app命名空间中，有两个重要的键：baseURL和cdnURL。


### 1. app.baseURL

**作用**：`app.baseURL` 是一个用于存储应用的根URL的键。默认情况下，这个值被设置为`'/'`。这个键主要用于在应用中统一处理URL的前缀，例如在API调用、路由链接、静态资源访问等场景中。

**如何使用**：

```
// 在你的组件中访问baseURL
export default {
  setup() {
    const config = useRuntimeConfig()
    console.log('Base URL:', config.app.baseURL)
  }
}

```

### 2. app.cdnURL

**作用**：`app.cdnURL` 是一个用于存储CDN（内容分发网络）URL的键。这个键主要用于在生产环境中，当应用使用CDN来加速静态资源的加载时，提供一个自定义的CDN URL。在开发环境中，这个值通常被设置为空字符串或者默认值。

**如何使用**：

```
// 在你的API服务中访问cdnURL
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const cdnURL = config.app.cdnURL
  console.log('CDN URL:', cdnURL)
})

```

### 设置环境变量

为了在运行时自定义这些值，你可以通过设置环境变量来实现。例如，为了改变`app.baseURL`，你可以在`.env`文件中添加：

```
NUXT_APP_BASE_URL=https://your-custom-base-url.com
```

对于`app.cdnURL`，你可以在`.env`文件中添加：

```
NUXT_APP_CDN_URL=https://your-custom-cdn-url.com
```

### 示例代码

假设你有一个`plugins/my-plugin.ts`文件，你想要在其中使用`app.baseURL`：

```
export default defineNuxtPlugin((NuxtApp) => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL
  console.log('Using base URL:', baseURL)
})

```

对于`server/api/foo.ts`中的`app.cdnURL`：

```
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const cdnURL = config.app.cdnURL
  console.log('Using CDN URL:', cdnURL)
})

```

通过这种方式，你可以确保在不同的环境（如开发、测试、生产）中，应用能够使用不同的配置，从而提高应用的灵活性和可维护性。


## 往期文章归档：

- [Nuxt.js 路由管理：useRouter 方法与路由中间件应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ad9936895e09/)
- [useRoute 函数的详细介绍与使用示例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/eb8617e107bf/)
- [使用 useRequestURL 组合函数访问请求URL | cmdragon's Blog](https://blog.cmdragon.cn/posts/666fa6c8a5ea/)
- [Nuxt.js 环境变量配置与使用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c79d66614163/)
- [服务端渲染中的数据获取：结合 useRequestHeaders 与 useFetch | cmdragon's Blog](https://blog.cmdragon.cn/posts/e38e8d28511a/)
- [使用 useRequestEvent Hook 访问请求事件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2f2570605277/)
- [使用 useNuxtData 进行高效的数据获取与管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5e9f5a2b593e/)
- [Nuxt 3 使用指南：掌握 useNuxtApp 和运行时上下文 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f51bb8ed8307/)
- [使用 useLazyFetch 进行异步数据获取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/117488d6538b/)
- [使用 useLazyAsyncData 提升数据加载体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b8e3c2416dc7/)
- [Nuxt.js 中使用 useHydration 实现数据水合与同步 | cmdragon's Blog](https://blog.cmdragon.cn/posts/177c9c78744f/)
- [useHeadSafe：安全生成HTML头部元素 | cmdragon's Blog](https://blog.cmdragon.cn/posts/56ede6d7b04b/)
- [Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/28859392f373/)
- [探索Nuxt.js的useFetch：高效数据获取与处理指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b4311c856080/)
- [Nuxt.js 错误侦探：useError 组合函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a86a834c8e7a/)
- [useCookie函数：管理SSR环境下的Cookie | cmdragon's Blog](https://blog.cmdragon.cn/posts/f36e9827abb4/)
- [轻松掌握useAsyncData获取异步数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bdaee7956a6e/)
- 

