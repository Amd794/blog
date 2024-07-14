---
title: Nuxt.js 错误侦探：useError 组合函数
date: 2024/7/14
updated: 2024/7/14
author: cmdragon

excerpt:
  摘要：文章介绍Nuxt.js中的useError组合函数，用于统一处理客户端和服务器端的错误，提供statusCode、statusMessage和message属性，示例展示了如何在组件中使用它来捕获和显示错误信息。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 错误处理
  - Vue.js
  - Web开发
  - 服务器端
  - 客户端
  - useError函数
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_14 17_05_22.png@blog" title="2024_07_14 17_05_22.png" alt="2024_07_14 17_05_22.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在构建动态网站时，错误处理是一个关键的环节，它不仅关乎用户体验，也影响着网站的稳定性和可靠性。Nuxt.js 是一个用于构建 Vue.js
应用的框架，它提供了丰富的工具和功能来简化开发过程。在 Nuxt.js 中，`useError`是一个非常有用的可组合函数，它允许开发者在客户端和服务器端都捕获和处理错误。

## 什么是 `useError`？

`useError`是 Nuxt.js
提供的一个可组合函数，用于在组件之间创建一个全局的、响应式的错误处理机制。这意味着，无论在客户端还是服务器端，你都可以通过`useError`
捕获并处理错误。这使得错误处理更加统一和高效。

### `useError` 的返回值

`useError`返回一个对象，包含了以下属性：

1. **statusCode**：

    - 类型：数字（Number）
    - 描述：HTTP 响应的状态码，如 404 表示页面未找到，500 表示服务器错误等。
    - 用途：根据状态码进行不同的错误处理，例如展示不同的错误页面。

2. **statusMessage**：

    - 类型：字符串（String）
    - 描述：HTTP 响应的状态消息，通常是对状态码的简短描述，如 "Not Found" 或 "Internal Server Error"。
    - 用途：可以用来向用户展示更友好的错误信息。

3. **message**：

    - 类型：字符串（String）
    - 描述：错误的详细描述，通常是由错误抛出时提供的。
    - 用途：用于日志记录或向用户展示错误的详细信息。

### 示例：使用 `useError` 处理错误

下面是一个简单的 Nuxt.js 应用示例，展示如何使用`useError`来捕获和处理错误：

```
<template>
  <div>
    <h1>{{ title }}</h1>
    <transition name="fade">
      <p v-if="error.statusCode" class="error-message">
        发生了错误：{{ error.statusCode }} - {{ error.message }}
      </p>
    </transition>
    <!-- 其他组件内容 -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const error = ref(null);

// 在组件挂载后获取错误信息
onMounted(() => {
  const { error: err } = useError();
  error.value = err;

  // 示例错误处理逻辑
  if (error.value.statusCode) {
    console.error('捕获到错误：', error.value);
    // 可以添加自定义的错误处理逻辑，例如重定向到错误页面、显示错误消息等。
  }
});

// 计算属性
const title = computed(() => {
  // 返回页面标题
  return '错误处理示例';
});
</script>

<style scoped>
.error-message {
  color: red;
}

// 添加过渡效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


```


## 往期文章归档：

- [useCookie函数：管理SSR环境下的Cookie | cmdragon's Blog](https://blog.cmdragon.cn/posts/f36e9827abb4/)
- [轻松掌握useAsyncData获取异步数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bdaee7956a6e/)
- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/133b896ec704/)
- [Nuxt框架中内置组件详解及使用指南（五） | cmdragon's Blog](https://blog.cmdragon.cn/posts/707e1176ace8/)
- [Nuxt框架中内置组件详解及使用指南（四） | cmdragon's Blog](https://blog.cmdragon.cn/posts/64c74472d95e/)
- [Nuxt框架中内置组件详解及使用指南（三） | cmdragon's Blog](https://blog.cmdragon.cn/posts/0524f12c820c/)
- [Nuxt框架中内置组件详解及使用指南（二） | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c234037b6fe/)
- [Nuxt框架中内置组件详解及使用指南（一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/22a2f8cb2cf0/)
- [Nuxt3 的生命周期和钩子函数（十一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/693a389ead2d/)
- [Nuxt3 的生命周期和钩子函数（十） | cmdragon's Blog](https://blog.cmdragon.cn/posts/2277c22fe47d/)
- [Nuxt3 的生命周期和钩子函数（九） | cmdragon's Blog](https://blog.cmdragon.cn/2024/07/02/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B9%9D%EF%BC%89%20/)
- [Nuxt3 的生命周期和钩子函数（八） | cmdragon's Blog](https://blog.cmdragon.cn/2024/06/29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%85%AB%EF%BC%89%20/)
- [Nuxt3 的生命周期和钩子函数（七） | cmdragon's Blog](https://blog.cmdragon.cn/2024/06/29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B8%83%EF%BC%89/)
- [Nuxt3 的生命周期和钩子函数（六） | cmdragon's Blog](https://blog.cmdragon.cn/2024/06/29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%85%AD%EF%BC%89/)
- 

