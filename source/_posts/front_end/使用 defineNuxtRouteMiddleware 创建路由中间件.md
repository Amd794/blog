---
title: 使用 defineNuxtRouteMiddleware 创建路由中间件
date: 2024/8/10
updated: 2024/8/10
author:  cmdragon

excerpt:
  本篇文章介绍了如何使用 `defineNuxtRouteMiddleware` 创建和应用路由中间件。通过示例演示了如何处理错误页面和身份验证逻辑。随着对 Nuxt.js 中间件的理解，你可以更灵活地控制应用的路由行为，从而提升用户体验。

categories:
  - 前端开发

tags:
  - Nuxt3
  - 路由
  - 中间件
  - 错误处理
  - 认证
  - 重定向
  - 定制逻辑
---

<img src="https://static.amd794.com/blog/images/2024_08_10 09_54_50.png@blog" title="2024_08_10 09_54_50.png" alt="2024_08_10 09_54_50.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

# 使用 defineNuxtRouteMiddleware 创建路由中间件
在 Nuxt.js 中，路由中间件是一种强大的机制，可以在路由进入之前处理特定的逻辑。例如，你可以根据用户的身份验证状态来重定向用户，或者在某些条件不满足时显示错误页面。

## 什么是路由中间件？

路由中间件是一个函数，它在路由变化之前执行，允许我们在访问特定页面时添加逻辑。它可以帮助你进行身份验证、授权检查、日志记录等。

### 路由中间件的结构

路由中间件的基本结构如下所示：

```javascript
const middleware = (to, from) => {
  // 处理逻辑
};

export default defineNuxtRouteMiddleware(middleware);
```

- `to`：下一个路由的位置对象。
- `from`：当前路由的位置对象。

## 创建和使用路由中间件

### 1. 显示错误页面的中间件

我们首先创建一个中间件，用于检测特定条件并显示错误页面。如果参数 `id` 存在且为 `1`，我们将抛出一个404错误。

#### 创建 `middleware/error.ts`

```javascript

export default defineNuxtRouteMiddleware((to) => {
  if (to.params.id === '1') {
    throw createError({ statusCode: 404, statusMessage: '页面未找到' });
  }
});
```

在这个例子中，如果用户访问的路由包含参数 `id` 且其值为 `1`，则抛出一个404的错误，Nuxt会自动重定向到定义的错误页面。

### 2. 基于身份验证状态的重定向

接下来，我们创建一个中间件，用于检查用户是否已经经过身份验证。如果没有验证，用户将被重定向到登录页面。

#### 创建 `middleware/auth.ts`

```javascript

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useState('auth');

  // 检查用户是否登录
  if (!auth.value.isAuthenticated) {
    return navigateTo('/login'); // 重定向到登录页面
  }

  // 如果用户不在仪表盘页面，则重定向到仪表盘
  if (to.path !== '/dashboard') {
    return navigateTo('/dashboard');
  }
});
```

在上面的代码中，我们使用 `useState` 获取用户的身份验证状态。如果用户没有登录，我们使用 `navigateTo` 进行重定向，导向 `/login` 页面。如果用户不在仪表盘页面，我们也将其重定向到仪表盘。

## 中间件的注册

在创建好中间件后，Nuxt 会自动识别在 `middleware/` 目录下的中间件文件。你可以通过在页面组件中指定中间件来使用它们。例如，在一个页面组件中使用上面的中间件：

#### 在页面中使用中间件

```javascript
<template>
  <div>
    <h1>欢迎来到仪表盘</h1>
  </div>
</template>

<script>
definePageMeta({
  middleware: ["auth"]
  // 或 middleware: 'auth'
})
</script>
```
### 全局使用中间件

如果您希望让每个路由都使用某个中间件，可以在 `nuxt.config.ts` 文件中注册全局中间件
## 总结

路由中间件在管理用户访问权限和错误处理方面非常有用。通过 `defineNuxtRouteMiddleware`，您可以轻松地定义中间件，控制用户如何在 Nuxt 应用程序中流动。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [使用 defineNuxtComponent`定义 Vue 组件 | cmdragon's Blog](https://blog.cmdragon.cn/posts/df9c2cf37c29/)
- [使用 createError 创建错误对象的详细指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/93b5a8ec52df/)
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
-

