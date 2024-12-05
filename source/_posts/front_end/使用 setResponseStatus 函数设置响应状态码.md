---
title: 使用 setResponseStatus 函数设置响应状态码
date: 2024/8/25
updated: 2024/8/25
author: cmdragon

excerpt:
  通过 setResponseStatus 函数，你可以轻松地在 Nuxt.js 中设置响应的状态码。这不仅能帮助用户更好地理解发生了什么，还能在需要时显示自定义的错误页面。在实际应用中，合理使用状态码对于提升用户体验至关重要。


categories:
  - 前端开发

tags:
  - Nuxt.js
  - 响应码
  - SSR
  - 404页面
  - Vue.js
  - 状态码
  - Web开发
---

<img src="https://static.amd794.com/blog/images/2024_08_25 11_04_08.png@blog" title="2024_08_25 11_04_08.png" alt="2024_08_25 11_04_08.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在开发应用时，我们常常需要根据不同的情况返回不同的响应状态码。在 Nuxt.js 中，`setResponseStatus` 函数让你能够方便地设置服务器端的响应状态码，特别是在进行服务器端渲染（SSR）时。

### 什么是响应状态码？

HTTP 响应状态码是服务器向客户端返回的数字代码，表明请求的处理结果。常见的状态码包括：


1. **1xx（信息性状态码）** ：

    -   这类状态码主要用于表示请求已被接收，服务器正在处理。其内容通常不会影响客户端的行为。

    -   例如：

        -   **100 Continue**：客户端应继续请求。
        -   **101 Switching Protocols**：服务器正在切换协议。

2. **2xx（成功状态码）** ：

    -   表示请求已成功被服务器接收、理解并处理。

    -   例如：

        -   **200 OK**：请求成功，通常返回所请求的资源。
        -   **201 Created**：请求成功并创建了新的资源。
        -   **204 No Content**：请求成功，但没有返回内容。

3. **3xx（重定向状态码）** ：

    -   表示请求的资源已被移动到其他位置，客户端需要进一步操作以完成请求。

    -   例如：

        -   **301 Moved Permanently**：请求的资源已被永久移动到新位置，返回的响应中会包含新位置的 URL。
        -   **302 Found**：请求的资源临时被移动。

4. **4xx（客户端错误状态码）** ：

    -   表示请求存在问题，导致服务器无法处理。大多数情况下是由于客户端的错误引起的。

    -   例如：

        -   **400 Bad Request**：请求格式不正确。
        -   **401 Unauthorized**：需要身份验证，用户未提供有效凭据。
        -   **403 Forbidden**：服务器拒绝请求，客户端没有权限访问此资源。
        -   **404 Not Found**：请求的资源未找到，通常是页面不存在。

5. **5xx（服务器错误状态码）** ：

    -   表示服务器在处理请求时发生了错误。通常是由于服务器内部的问题。

    -   例如：

        -   **500 Internal Server Error**：服务器发生了未知错误，无法完成请求。
        -   **502 Bad Gateway**：服务器作为网关或代理时，接收到无效响应。
        -   **503 Service Unavailable**：服务器当前无法处理请求，通常是因为过载或正在维护。

### Nuxt.js 中的 `setResponseStatus` 

Nuxt.js 提供了 `setResponseStatus` 函数，你可以在服务器端使用它来设置响应的状态码。有时，我们不仅希望设置状态码，还希望传递一条消息，以便给用户更好的反馈。

#### 基本用法

以下是 `setResponseStatus` 函数的基本使用示例：

```javascript
// 导入 Nuxt 中的组合式函数
const event = useRequestEvent()

// 设置状态码为 404
setResponseStatus(event, 404)

// 如果需要，也可以传递状态消息
setResponseStatus(event, 404, '页面未找到')
```

在这里，我们首先通过 `useRequestEvent()` 获取当前请求的事件对象，然后使用 `setResponseStatus` 来设置响应状态码。

### 创建自定义404页面的示例

下面我们将创建一个自定义 404 页面，当用户访问不存在的页面时，显示该页面及其状态信息。

#### 步骤 1: 创建404页面

在 `pages` 目录下创建一个 `404.vue` 文件，内容如下：

```vue
<template>
  <div>
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
  </div>
</template>

<script setup>

const event = useRequestEvent()
setResponseStatus(event, 404, '页面未找到')
</script>

<style scoped>
h1 {
  color: red;
}
</style>
```

在这个 `404.vue` 页面中，我们使用 `useRequestEvent()` 获取请求事件，并调用 `setResponseStatus` 函数将状态码设置为 404 并附带状态消息。

#### 步骤 2: 测试404页面

启动 Nuxt 应用：

```bash
npm run dev
```

然后尝试访问一个不存在的页面，例如 `http://localhost:3000/不存在的页面`。你应该能够看到自定义的 404 页面以及相应的状态码。

### 总结

通过 `setResponseStatus` 函数，你可以轻松地在 Nuxt.js 中设置响应的状态码。这不仅能帮助用户更好地理解发生了什么，还能在需要时显示自定义的错误页面。在实际应用中，合理使用状态码对于提升用户体验至关重要。


余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [如何在 Nuxt 中动态设置页面布局 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6168aad26848/)
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
-

