---
title: 使用 addRouteMiddleware 动态添加中间
date: 2024/8/4
updated: 2024/8/4
author: cmdragon

excerpt:
  摘要：文章介绍了Nuxt3中addRouteMiddleware的使用方法，该功能允许开发者动态添加路由中间件，以实现诸如权限检查、动态重定向及路由变化时的特定操作。内容涵盖路由中间件的概念、addRouteMiddleware的语法、参数、使用示例（包括匿名中间件、命名中间件、全局中间件、覆盖现有中间件）及调试技巧。强调了此功能为Nuxt3应用带来的灵活性和便利性。

categories:
  - 前端开发

tags:
  - Nuxt3
  - 中间件
  - 路由
  - 动态
  - 权限
  - 重定向
  - 导航
---

<img src="https://static.amd794.com/blog/images/2024_08_04 10_01_31.png@blog" title="2024_08_04 10_01_31.png" alt="2024_08_04 10_01_31.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`


在 Nuxt3 中，`addRouteMiddleware` 允许开发者在应用程序中动态添加路由中间件。这为你提供了灵活性，可以在不同情况下执行导航守卫，例如处理权限、重定向，以及在路由变化时执行特定操作。
## 什么是路由中间件？

路由中间件是一个函数，可以在用户导航到特定路由前执行某些操作。它通常用于：

- 检查用户权限
- 动态重定向用户
- 登录或加载数据

在 Nuxt3 中，所有中间件通常位于 `middleware/` 目录中，但通过使用 `addRouteMiddleware`，你可以在运行时动态添加它们。

## `addRouteMiddleware` 语法与参数

### 语法

```javascript
addRouteMiddleware(name: string | RouteMiddleware, middleware?: RouteMiddleware, options: AddRouteMiddlewareOptions = {})
```

### 参数
- **name**: (string | RouteMiddleware)  
  - 可以是字符串（用于命名中间件）或一个路由中间件函数，类型为 `RouteMiddleware`。

- **middleware**: (RouteMiddleware)  
  - 这是一个函数，接受两个参数：
    - `to`: 目标路由对象，包含用户要访问的路由信息。
    - `from`: 源路由对象，包含用户当前所在的路由信息。

- **options**: (AddRouteMiddlewareOptions)  
  - 一个可选的对象，用来设置中间件的额外选项。当前可以设置的选项是：
    - `global`: (boolean) 如果设置为 `true`，则该中间件为全局中间件，默认为 `false`。

## 使用 `addRouteMiddleware`

### 1. 匿名路由中间件

在你需要简单的逻辑处理时，创建匿名路由中间件非常方便。

**示例：禁止访问特定页面**

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware((to, from) => {
    // 如果用户尝试访问 /forbidden 路径，则阻止导航
    if (to.path === '/forbidden') {
      console.log('访问被阻止：用户尝试访问从未授权的路径：', to.path);
      return false; // 阻止导航
    }
  });
});
```

#### 解释：

在上述示例中，如果用户尝试访问 `/forbidden` 页面，导航将被阻止并输出日志。

### 2. 命名路由中间件

命名路由中间件可以用字符串命名，便于后续调用和覆盖。

**示例：记录每次导航日志**

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('logger-middleware', (to, from) => {
    console.log('用户从', from.path, '导航到', to.path);
  });
});
```

#### 解释：

在这个示例中，我们为中间件命名为 `logger-middleware`。这个中间件将在每次导航时输出用户的导航日志。可以通过 `addRouteMiddleware` 的方式再次覆盖同名中间件。

### 3. 全局路由中间件

全局中间件在每次路由变更时都会执行，适用于需要在每个路由之间共享逻辑的场景。

**示例：全局访问控制检查**

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth-check', (to, from) => {
    const isAuthorized = false; // 假设这里是你的认证逻辑

    if (!isAuthorized) {
      console.warn('用户未授权，重定向到登录页面');
      return navigateTo('/login'); // 重定向到登录页面
    }
  }, { global: true });
});
```

#### 解释：

在这个示例中，我们创建了一个全局中间件 `auth-check`，每次路由更改时都会检查用户是否被授权。如果用户未授权，则重定向到 `/login` 页面。

### 4. 覆盖现有中间件

当使用命名的中间件时，新的中间件将覆盖已有的同名中间件。如下所示：

```typescript
// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // 原有逻辑
});

// 然后在 plugins 中添加覆盖
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', (to, from) => {
    console.log('覆盖了旧的 auth 中间件');
    // 新的逻辑
  });
});
```

在这个例子中，`plugins/my-plugin.ts` 中的中间件将覆盖 `middleware/auth.js` 中的内容。这样的特性可以帮助我们在特定条件下修改原有逻辑。

## 进行中间件调试

在开发过程中，调试中间件是个重要步骤。可以使用简单的 `console.log` 输出调试信息，帮助理解中间件的执行流程。例如：

```typescript
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  addRouteMiddleware((to, from) => {
    console.log('[Middleware Debug]', 'From:', from.path, 'To:', to.path);
  });
});
```

这可以帮助你确认中间件的执行顺序和路径变更。

## 总结

通过使用 `addRouteMiddleware`，你可以灵活地在 Nuxt3 应用中添加、覆盖和管理路由中间件。这为实现复杂的导航逻辑、访问控制和数据处理提供了必要工具。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 useLazyAsyncData 提升数据加载体验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b8e3c2416dc7/)
- [Nuxt.js 中使用 useHydration 实现数据水合与同步 | cmdragon's Blog](https://blog.cmdragon.cn/posts/177c9c78744f/)
-


