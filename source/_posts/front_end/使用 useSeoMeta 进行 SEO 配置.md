---
title: 使用 useSeoMeta 进行 SEO 配置
date: 2024/7/30
updated: 2024/7/30
author: cmdragon 

excerpt:
  摘要：本文介绍了Nuxt3中的useSeoMeta组合函数，用于简化和优化网站的SEO配置。通过这个工具，开发者可以在Nuxt3项目中方便地设置页面元标签，包括标题、描述以及Open Graph和Twitter Card标签等，支持静态与动态元数据配置，提升网站在搜索引擎和社交媒体上的表现。

categories:
  - 前端开发

tags:
  - SEO优化
  - Nuxt3
  - Web开发
  - 代码示例
  - 元标签
  - 动态配置
  - 前端技术
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_30 17_59_07.png@blog" title="2024_07_30 17_59_07.png" alt="2024_07_30 17_59_07.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在创建现代网站时，搜索引擎优化（SEO）是不可忽视的一个环节。良好的 SEO 配置不仅能提升你的网站在搜索引擎中的排名，还能在社交媒体上更好地展示你的内容。Nuxt3
提供了一个强大的工具 `useSeoMeta` 来帮助你实现这一目标。

### 什么是 `useSeoMeta`？

`useSeoMeta` 是 Nuxt3 提供的一个组合函数（composable），用于定义网站的 SEO 元标签。通过使用 `useSeoMeta`
，你可以以类型安全的方式指定各种元标签，包括标题、描述、Open Graph 标签等。这有助于避免常见的错误，如拼写错误或使用错误的属性名，同时确保你的标签配置符合标准并具有
XSS 安全性。

### 如何使用 `useSeoMeta`

#### 1. 安装 Nuxt3

首先，你需要有一个 Nuxt3 项目。如果还没有项目，可以使用以下命令创建一个新的 Nuxt3 项目：

```bash
npx nuxi@latest init my-nuxt3-app
cd my-nuxt3-app
npm install
```

#### 2. 配置 `useSeoMeta`

在 Nuxt3 项目中，你通常会在页面组件中配置 SEO 元标签。以下是一个简单的 `app.vue` 文件示例，展示了如何使用 `useSeoMeta`
来设置页面的元标签。

##### 示例 1: 静态元标签

在这个示例中，我们设置了一些静态的 SEO 元标签：

```vue

<template>
  <div>
    <h1>欢迎来到我的网站</h1>
  </div>
</template>

<script setup lang="ts">

  useSeoMeta({
    title: '我的神奇网站',
    ogTitle: '我的神奇网站',
    description: '这是我的神奇网站，让我告诉你关于它的一切。',
    ogDescription: '这是我的神奇网站，让我告诉你关于它的一切。',
    ogImage: 'https://example.com/image.png',
    twitterCard: 'summary_large_image',
  });
</script>
```

在上面的代码中，我们使用 `useSeoMeta` 来设置以下元标签：

- `title`: 网页的标题
- `ogTitle`: Open Graph 的标题，用于社交媒体分享
- `description`: 网页的描述
- `ogDescription`: Open Graph 的描述，用于社交媒体分享
- `ogImage`: Open Graph 的图像 URL，用于社交媒体分享
- `twitterCard`: Twitter 卡片的类型，如 `summary_large_image`

##### 示例 2: 动态元标签

有时候，你可能需要根据组件的状态动态生成元标签。以下是如何使用计算属性来实现这一点：

```vue

<template>
  <div>
    <h1>{{ title }}</h1>
    <input v-model="title" placeholder="修改标题"/>
  </div>
</template>

<script setup lang="ts">

  const title = ref('我的标题');

  useSeoMeta({
    title,
    description: computed(() => `这是 ${title.value} 的描述`),
  });
</script>
```

在这个示例中，我们使用 `ref` 来创建一个响应式的标题，并且通过 `computed` 来动态生成描述。这样，当标题发生变化时，描述也会自动更新。

### 参数列表

`useSeoMeta` 支持超过 100 个参数，用于定义各种元标签。以下是一些常见的参数：

#### **基本元标签**

- **title**: 页面标题
- **description**: 页面描述
- **keywords**: 页面关键词
- **robots**: 指示搜索引擎爬虫如何处理页面（如`index, follow`,`noindex, nofollow`）

#### **Open Graph 标签**

- **ogTitle**: Open Graph 标题
- **ogDescription**: Open Graph 描述
- **ogImage**: Open Graph 图像 URL
- **ogImageAlt**: Open Graph 图像替代文本
- **ogType**: Open Graph 类型（如`website`,`article`,`profile`）
- **ogUrl**: 当前页面的 URL
- **ogSiteName**: 网站名称
- **ogLocale**: Open Graph 语言区域（如`en_US`）

#### **Twitter Card 标签**

- **twitterCard**: Twitter 卡片类型（如`summary`,`summary_large_image`,`app`,`player`）
- **twitterTitle**: Twitter 标题
- **twitterDescription**: Twitter 描述
- **twitterImage**: Twitter 图像 URL
- **twitterImageAlt**: Twitter 图像替代文本
- **twitterSite**: Twitter 账户用户名（通常是`@`开头）
- **twitterCreator**: 内容作者的 Twitter 账户用户名（通常是`@`开头）
- **twitterPlayer**: Twitter 播放器 URL（用于视频卡片）

#### **Facebook 和其他社交平台标签**

- **fbAppId**: Facebook 应用 ID
- **fbPages**: Facebook 页面 URL（如果有多个，使用逗号分隔）

#### **结构化数据**

- **schema**: JSON-LD 格式的结构化数据（如`schema.org`类型）

    - **@context**: JSON-LD 上下文
    - **@type**: 数据类型（如`WebPage`,`Product`,`Article`）
    - **name**: 名称
    - **description**: 描述
    - **url**: URL
    - **image**: 图像 URL
    - **author**: 作者信息
    - **publisher**: 发布者信息
    - **datePublished**: 发布日期
    - **dateModified**: 修改日期

#### **链接相关标签**

- **canonical**: 规范化 URL
- **alternate**: 指定其他语言版本的 URL（如`hrefLang`）
- **rel**: 链接关系（如`nofollow`,`noopener`）

#### **视口和移动设备标签**

- **viewport**: 视口设置（如`width=device-width, initial-scale=1`）
- **appleMobileWebAppTitle**: iOS 应用的标题
- **appleMobileWebAppCapable**: 是否允许全屏模式（`yes`或`no`）
- **appleMobileWebAppStatusBarStyle**: 状态栏样式（如`black-translucent`）

#### **网站图标和徽标**

- **favicon**: 网站图标（通常在`<link rel="icon">`中设置）
- **appleTouchIcon**: iOS 应用图标（`<link rel="apple-touch-icon" href="/path/to/icon.png">`）
- **msapplicationTileImage**: Windows 8/10 触摸屏图标
- **themeColor**: 移动设备浏览器工具栏的主题颜色

#### **安全和隐私相关标签**

- **Content-Security-Policy**: 内容安全策略
- **X-Content-Type-Options**: 防止 MIME 类型嗅探
- **X-Frame-Options**: 防止点击劫持（如`DENY`,`SAMEORIGIN`）
- **X-XSS-Protection**: 启用或禁用 XSS 保护

#### **预加载和预渲染**

- **preload**: 预加载资源（如`<link rel="preload" href="/path/to/resource" as="script">`）
- **prefetch**: 预取资源（如`<link rel="prefetch" href="/path/to/resource">`）
- **prerender**: 预渲染页面（如`<link rel="prerender" href="/path/to/page">`）

#### **图像优化**

- **imageSrcSet**: 图像的不同分辨率（用于响应式设计）
- **imageSizes**: 图像的大小（用于响应式设计）

#### **自定义元数据**

- **applicationName**: 应用程序名称
- **themeColor**: 浏览器的主题颜色
- **ogVideo**: Open Graph 视频 URL
- **ogVideoType**: Open Graph 视频类型（如`video/mp4`）

更多参数可以参阅官方文档或源代码中的参数列表。[SEO Starter HTML Tags · HTML Tag Collections · zhead](https://zhead.dev/collection/seo)

### 总结

使用 `useSeoMeta` 是在 Nuxt3 中设置 SEO 元标签的一种推荐方式。它不仅支持
TypeScript，并且通过类型安全的配置避免了许多常见错误。无论是静态还是动态的元标签配置，`useSeoMeta` 都能提供清晰的 API
来帮助你完成任务。


## 往期文章归档：

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

