---
url: /posts/1ab218dde0076479c8612a173c88316c/
title: 使用 useServerSeoMeta 优化您的网站 SEO
date: 2024-07-31T00:18:53+08:00
updated: 2024-07-31T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文介绍了Nuxt3框架中的useServerSeoMeta函数，它用于服务器端渲染(SSR)中设置SEO元标签，以优化性能和搜索引擎排名。内容包括其基本用法、详细示例及各参数说明，强调了服务器端设置元标签对性能的提升和代码简化的好处。

categories:
  - 前端开发

tags:
  - SEO优化
  - Nuxt3
  - 服务器渲染
  - 网站性能
  - OpenGraph
  - Twitter卡
  - 元标签设置
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_31 17_40_32.png@blog" title="2024_07_31 17_40_32.png" alt="2024_07_31 17_40_32.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

## 什么是 `useServerSeoMeta`？

在 Nuxt3 框架中，`useServerSeoMeta` 是一个用于设置 SEO 元标签的函数。与 `useSeoMeta` 不同的是，`useServerSeoMeta`
主要用于服务器端渲染（SSR）。它允许您在服务器端设置页面的 SEO 元标签，从而提升性能并优化搜索引擎排名。

## 为什么使用 `useServerSeoMeta`？

### 1. 性能优化

`useServerSeoMeta` 主要用于在服务器端设置元标签。由于搜索引擎机器人只会扫描页面的初始加载内容，所以元标签不需要在客户端动态更新。这样做可以减少客户端的处理负担，提高页面加载性能。

### 2. 简化代码

由于 `useServerSeoMeta` 不需要在客户端进行响应式更新，它使得 SEO 配置更加简洁。您可以专注于在服务器端定义所有需要的 SEO
元标签，简化了客户端的代码和处理。

## 如何使用 `useServerSeoMeta`？

### 基本用法

在 Nuxt3 项目中，您可以在页面组件的 `<script setup>` 块中使用 `useServerSeoMeta` 来设置 SEO 元标签。以下是一个简单的示例：

```vue

<template>
  <div>
    <h1>欢迎来到我的网站</h1>
  </div>
</template>

<script setup lang="ts">

  useServerSeoMeta({
    title: '我的网站',
    description: '这是我的网站页面描述。',
    keywords: '网站, SEO, Nuxt3',
    robots: 'index, follow',
    canonical: 'https://example.com',
  });
</script>
```

### 详细示例

为了更好地理解 `useServerSeoMeta`，让我们看一个更复杂的示例，涵盖 Open Graph 标签、Twitter Card 标签等。

```vue

<template>
  <div>
    <h1>探索我们的新产品</h1>
    <p>了解更多关于我们的新产品的信息。</p>
  </div>
</template>

<script setup lang="ts">

  useServerSeoMeta({
    title: '我们的新产品 - 神奇网站',
    description: '我们的新产品具有创新的功能，旨在提升您的体验。',
    keywords: '新产品, 创新, 技术',
    robots: 'index, follow',
    canonical: 'https://example.com/new-product',

    ogTitle: '探索我们的新产品',
    ogDescription: '我们的新产品具有创新的功能，旨在提升您的体验。',
    ogImage: 'https://example.com/new-product-image.png',
    ogImageAlt: '新产品图像',
    ogType: 'product',
    ogUrl: 'https://example.com/new-product',
    ogSiteName: '神奇网站',

    twitterCard: 'summary_large_image',
    twitterTitle: '探索我们的新产品',
    twitterDescription: '我们的新产品具有创新的功能，旨在提升您的体验。',
    twitterImage: 'https://example.com/new-product-image.png',
    twitterImageAlt: '新产品图像',
    twitterSite: '@mywebsite',
    twitterCreator: '@creator',

    fbAppId: '1234567890',
    fbPages: 'https://facebook.com/mywebsite',

    viewport: 'width=device-width, initial-scale=1',
    appleMobileWebAppTitle: '神奇网站的新产品',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    msapplicationTileImage: '/mstile-144x144.png',
    themeColor: '#ffffff',

    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': '我们的新产品',
      'description': '我们的新产品具有创新的功能，旨在提升您的体验。',
      'url': 'https://example.com/new-product',
      'image': 'https://example.com/new-product-image.png'
    }
  });
</script>
```

### 参数说明

- **title**: 页面标题。
- **description**: 页面描述。
- **keywords**: 页面关键词。
- **robots**: 指示搜索引擎如何处理页面（如 `index, follow`）。
- **canonical**: 规范化 URL。
- **ogTitle**: Open Graph 标题。
- **ogDescription**: Open Graph 描述。
- **ogImage**: Open Graph 图像 URL。
- **ogImageAlt**: Open Graph 图像替代文本。
- **ogType**: Open Graph 类型（如 `product`）。
- **ogUrl**: 当前页面的 URL。
- **ogSiteName**: 网站名称。
- **twitterCard**: Twitter 卡片类型（如 `summary_large_image`）。
- **twitterTitle**: Twitter 标题。
- **twitterDescription**: Twitter 描述。
- **twitterImage**: Twitter 图像 URL。
- **twitterImageAlt**: Twitter 图像替代文本。
- **twitterSite**: Twitter 账户用户名。
- **twitterCreator**: 内容作者的 Twitter 账户用户名。
- **fbAppId**: Facebook 应用 ID。
- **fbPages**: Facebook 页面 URL。
- **viewport**: 视口设置。
- **appleMobileWebAppTitle**: iOS 应用的标题。
- **appleMobileWebAppCapable**: 是否允许全屏模式（`yes` 或 `no`）。
- **appleMobileWebAppStatusBarStyle**: 状态栏样式。
- **favicon**: 网站图标。
- **appleTouchIcon**: iOS 应用图标。
- **msapplicationTileImage**: Windows 8/10 触摸屏图标。
- **themeColor**: 移动设备浏览器工具栏的主题颜色。
- **schema**: JSON-LD 格式的结构化数据。

## 总结

`useServerSeoMeta` 允许您在服务器端为页面设置 SEO 元标签，从而优化性能和搜索引擎排名。通过将所有的 SEO
设置放在服务器端，您可以减少客户端的处理负担，并确保搜索引擎爬虫抓取到准确的页面信息。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 useLazyAsyncData 提升数据加载体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b8e3c2416dc7/)
- [Nuxt.js 中使用 useHydration 实现数据水合与同步 | cmdragon's Blog](https://blog.cmdragon.cn/posts/177c9c78744f/)
- [useHeadSafe：安全生成HTML头部元素 | cmdragon's Blog](https://blog.cmdragon.cn/posts/56ede6d7b04b/)
- [Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/28859392f373/)
- [探索Nuxt.js的useFetch：高效数据获取与处理指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b4311c856080/)
- [Nuxt.js 错误侦探：useError 组合函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a86a834c8e7a/)
- [useCookie函数：管理SSR环境下的Cookie | cmdragon's Blog](https://blog.cmdragon.cn/posts/f36e9827abb4/)
- 

