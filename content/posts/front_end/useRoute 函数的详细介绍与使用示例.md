---
url: /posts/f78b155dac56741becfa07c51c38dc0f/
title: useRoute 函数的详细介绍与使用示例
date: 2024-07-27T00:18:53+08:00
updated: 2024-07-27T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文介绍了Nuxt.js中useRoute函数的详细用途与示例，展示了如何在组合式API中使用useRoute获取当前路由信息，包括动态参数、查询参数等，并提供了丰富的计算引用说明，如fullPath、hash、matched等，以及如何正确访问查询参数。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - useRoute
  - 路由
  - API
  - 组件
  - 查询
  - 动态
---

<img src="/images/2024_07_27 15_55_51.png" title="2024_07_27 15_55_51.png" alt="2024_07_27 15_55_51.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在nuxt.js开发中，`useRoute`是一个非常实用的组合函数，它能够帮助我们获取当前路由的各种信息，从而实现更加灵活和动态的页面交互。

## **一、useRoute 函数的基本作用**

`useRoute`函数的主要作用是返回当前路由的相关信息。在 Vue 组件的模板中，我们可以使用`$route`来访问路由，但在组合式 API
中，就需要使用`useRoute`。

## **二、示例展示**

以下是一个使用动态页面参数`slug`来通过`useFetch`调用 API 的示例：

```
<template>
  <div>
    <h1>{{ mountain.title }}</h1>
    <p>{{ mountain.description }}</p>
  </div>
</template>

<script>

export default {
  setup() {
    const route = useRoute();
    const { data: mountain } = await useFetch(`/api/mountains/${route.params.slug}`);
    return {
      mountain
    };
  }
};
</script>

```

在上述示例中，通过`useRoute`获取到当前路由的`params`中的`slug`值，然后将其拼接到 API 路径中，使用`useFetch`获取数据并在页面中展示。

## **三、useRoute 提供的计算引用**

除了动态参数和查询参数，`useRoute`还提供了以下丰富的计算引用：

1. `fullPath`：这是与当前路由关联的编码 URL，包含路径、查询和哈希。例如，如果当前 URL
   是`https://example.com/page?param=value#hash`，那么 `fullPath`将是完整的这个字符串。
2. `hash`：获取 URL 中以`#`开头的解码哈希部分。
3. `matched`：这是与当前路由位置匹配的规范化的匹配路由数组。
4. `meta`：可以用于附加到路由记录的自定义数据。
5. `name`：路由记录的唯一名称。
6. `path`：获取 URL 中编码的路径名部分。
7. `redirectedFrom`：记录在到达当前路由位置之前尝试访问的路由位置。

## **四、查询参数的获取**

如果您需要访问路由的查询参数（例如在路径`/test?example=true`中的`example`），那么可以使用`useRoute().query`
而不是`useRoute().params`。


## 往期文章归档：

- [使用 useRequestURL 组合函数访问请求URL | cmdragon's Blog](https://blog.cmdragon.cn/posts/06f3f8268aaa2d02d711d8e895bb2bc9/)
- [Nuxt.js 环境变量配置与使用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/53eb62f578931146081c71537fd0c013/)
- [服务端渲染中的数据获取：结合 useRequestHeaders 与 useFetch | cmdragon's Blog](https://blog.cmdragon.cn/posts/c88fddf7a8ad9112ff80c9a25cda09d2/)
- [使用 useRequestEvent Hook 访问请求事件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f6aeaffdd673a716b7f013f59aa69af/)
- [使用 useNuxtData 进行高效的数据获取与管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5097e3f618f180282a847588006a51d8/)
- [Nuxt 3 使用指南：掌握 useNuxtApp 和运行时上下文 | cmdragon's Blog](https://blog.cmdragon.cn/posts/074b9dedf36fca34d1469e455c71d583/)
- [使用 useLazyFetch 进行异步数据获取 | cmdragon's Blog](https://blog.cmdragon.cn/posts/382133fd6ac27845d845a7fa96e5ba43/)
- [使用 useLazyAsyncData 提升数据加载体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/954e473bea4ec122949c8c7d84d32c95/)
- [Nuxt.js 中使用 useHydration 实现数据水合与同步 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c7ddeca4690387e7e08c83e6c482a576/)
- [useHeadSafe：安全生成HTML头部元素 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a1ca5111c82292bda5de4994f537d6f8/)
- [Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d5370e880eaec9085a153caba4961676/)
- [探索Nuxt.js的useFetch：高效数据获取与处理指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/29ff9113e98725ee69fa0148a47ae735/)
- [Nuxt.js 错误侦探：useError 组合函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b73679558bc672550fbbb72ae295fdf5/)
- [useCookie函数：管理SSR环境下的Cookie | cmdragon's Blog](https://blog.cmdragon.cn/posts/cd361e1a7930614f1aaf46ad35b28958/)
- [轻松掌握useAsyncData获取异步数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e1b1c62b5975f8ebfa61adc507591cf7/)
- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9e044d4b53eab6a1bec49bb86b4c856c/)
- [Nuxt框架中内置组件详解及使用指南（五） | cmdragon's Blog](https://blog.cmdragon.cn/posts/ff42c6a570627402dbbdd82adbb2ed2a/)
- 

