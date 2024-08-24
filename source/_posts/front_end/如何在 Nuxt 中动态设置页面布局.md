---
title: 如何在 Nuxt 中动态设置页面布局
date: 2024/8/24
updated: 2024/8/24
author: cmdragon

excerpt:
  摘要：本文介绍如何在Nuxt框架中通过设置setPageLayout函数动态调整页面布局，包括安装Nuxt、创建不同布局文件及中间件，并通过示例演示如何根据不同路径设置相应布局。

categories:
  - 前端开发

tags:
  - Nuxt
  - 布局
  - 动态
  - 设置
  - 中间件
  - 路由
  - 页面
---

<img src="https://static.cmdragon.cn/blog/images/2024_08_24 09_28_57.png@blog" title="2024_08_24 09_28_57.png" alt="2024_08_24 09_28_57.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在使用 Nuxt 框架开发应用时，页面的布局往往是固定的，但有时我们可能需要根据不同的页面或条件来动态调整布局。

## 1. 什么是页面布局

在 Nuxt 中，页面布局是指页面的整体外观和结构，比如头部、导航、侧边栏以及底部等。使用布局可以帮助我们更好地管理页面样式和结构。

## 2. 使用 setPageLayout

`setPageLayout` 是一个用于动态设置页面布局的函数。需要注意的是，此函数只能在组件的 `setup`
函数、插件或路由中间件中使用。例如，我们可以根据用户的访问路径来设置不同的布局。

## 3. 基本使用方法

### 安装 Nuxt

首先，确保你已经安装了 Nuxt。你可以使用以下命令创建一个新的 Nuxt 项目：

```bash
npx nuxi@latest init nuxt-dynamic-layout
cd nuxt-dynamic-layout
npm install
```

### 创建布局文件

在 `layouts` 文件夹中创建两个布局文件，它们将用于不同的页面布局：

**layouts/default.vue**

```vue

<template>
  <div>
    <header>默认布局的头部</header>
    <nuxt/>
    <footer>默认布局的底部</footer>
  </div>
</template>
```

**layouts/other.vue**

```vue

<template>
  <div>
    <header>其它布局的头部</header>
    <nuxt/>
    <footer>其它布局的底部</footer>
  </div>
</template>
```

### 创建中间件

接下来，我们将创建一个中间件来动态设置布局。首先，在 `middleware` 文件夹中创建一个新的文件 `custom-layout.ts`。

**middleware/custom-layout.ts**

```typescript
export default defineNuxtRouteMiddleware((to) => {
    // 根据访问的路径设置布局
    if (to.path === '/other') {
        setPageLayout('other');
    } else {
        setPageLayout('default');
    }
});
```

### 创建页面

现在我们需要创建两个页面，分别使用默认布局和其他布局。在 `pages` 文件夹中创建两个新的页面：

**pages/index.vue**

```vue

<template>
  <div>
    <h1>首页</h1>
    <nuxt-link to="/other">前往其它页面</nuxt-link>
  </div>
</template>
```

**pages/other.vue**

```vue

<template>
  <div>
    <h1>其它页面</h1>
    <nuxt-link to="/">返回首页</nuxt-link>
  </div>
</template>
```

### 配置中间件

最后一步是在 `nuxt.config.ts` 中配置我们的中间件，使其在路由导航时被调用。

**nuxt.config.ts**

```typescript
export default defineNuxtConfig({
    router: {
        middleware: ['custom-layout']
    }
});
```

## 4. 运行项目

完成以上步骤后，你可以通过以下命令启动 Nuxt 项目：

```bash
npm run dev
```

打开浏览器，访问 `http://localhost:3000`。你会看到首页使用的是默认布局，点击链接进入其它页面时，页面布局将变为其它布局。

## 5. 结论

通过上述步骤，你已经了解到如何在 Nuxt 项目中动态设置页面布局。掌握这一功能可以使你的应用更加灵活，能够根据用户的需求展示不同的页面布局。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 addRouteMiddleware 动态添加中间 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a070155dbcfb/)
- [使用 abortNavigation 阻止导航 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c89ead546424/)
-

