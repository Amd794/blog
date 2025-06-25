---
url: /posts/6ed51fb844f1329c26155ff2a6ea4cd2/
title: 理解 Vue 的 setup 应用程序钩子
date: 2024-09-30T00:18:53+08:00
updated: 2024-09-30T00:18:53+08:00
author: cmdragon

summary:
   摘要：本文详细介绍了Vue 3中setup函数的应用，包括其概念、特性、使用方法及重要性。setup函数作为组合API的核心，在组件实例化前被调用，用于设置响应式状态、计算属性、方法和生命周期钩子，支持在SSR和CSR中使用。

categories:
   - 前端开发

tags:
   - Vue
   - setup
   - 组件
   - 响应式
   - 计算属性
   - 生命周期
   - 方法
---

<img src="https://static.cmdragon.cn/blog/images/2024_09_30 12_17_49.png@blog" title="2024_09_30 12_17_49.png" alt="2024_09_30 12_17_49.png"/>


<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



在 Vue 3 中，`setup` 函数是组合 API 的核心部分，它为开发者提供了一种新的方式来组织和使用组件的逻辑。在 `setup` 函数内，可以定义组件的响应式状态、计算属性、方法以及生命周期钩子等

## 目录

1. [什么是 setup 函数？](#什么是-setup-函数)
2. [setup 函数的特性](#setup-函数的特性)
3. [如何使用 setup 函数](#如何使用-setup-函数)
   - [1. 创建响应式状态](#1-创建响应式状态)
   - [2. 定义计算属性](#2-定义计算属性)
   - [3. 定义方法](#3-定义方法)
   - [4. 使用生命周期钩子](#4-使用生命周期钩子)
4. [总结](#总结)

---

## 什么是 setup 函数？

`setup` 是一个特殊的生命周期函数，在组件实例化之前调用，用于设置组件的响应式状态、计算属性、方法和其他功能。当组件被创建时，Vue 会先调用 `setup` 函数，并将其返回的对象作为组件的响应式属性。

### 作用范围

- **服务器端和客户端**：`setup` 可以在服务器端渲染（SSR）和客户端渲染（CSR）中使用。

## setup 函数的特性

1. **提前执行**：`setup` 在组件实例创建之前调用。
2. **返回值**：可以返回一个对象，这些值将作为组件的属性和方法可以在模板中使用。
3. **访问 props 和 context**：`setup` 函数接收两个参数：`props` 和 `context`（包含 `attrs`, `slots`, 和 `emit`）。
4. **支持响应式 API**：可以直接使用 Vue 的响应式 API，比如 `ref` 和 `reactive`。

## 如何使用 setup 函数

### 1. 创建响应式状态

使用 `ref` 和 `reactive` 进行状态管理：

```vue
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>
```

### 2. 定义计算属性

计算属性可以通过 `computed` 来定义：

```vue
<template>
  <div>
    <h1>{{ doubledCount }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const doubledCount = computed(() => count.value * 2);
</script>
```

### 3. 定义方法

可以在 `setup` 中定义方法，并将其返回：

```vue
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="changeMessage">Change Message</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello, Vue 3!');

const changeMessage = () => {
  message.value = 'Message Changed!';
};
</script>
```

### 4. 使用生命周期钩子

可以在 `setup` 中使用生命周期钩子，比如 `onMounted` 和 `onUnmounted`：

```vue
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

// 使用 onMounted 生命周期钩子
onMounted(() => {
  console.log('Component is mounted!');
});

// 使用 onUnmounted 生命周期钩子
onUnmounted(() => {
  console.log('Component is unmounted!');
});
</script>
```

## 总结

`setup` 函数是 Vue 3 中一个非常强大的功能，允许开发者以更灵活和模块化的方式组织组件逻辑。通过合理使用 `setup` 函数及其提供的 API，你可以提高组件之间的可重用性和可维护性。

### 关键要点

1. **响应式状态管理**：使用 `ref` 和 `reactive` 轻松管理状态。
2. **计算属性和方法**：通过 `computed` 定义计算属性以及在 `setup` 中定义方法。
3. **生命周期钩子**：可以在 `setup` 中使用各种生命周期钩子来处理组件的生命周期。
4. **优化性能**：`setup` 函数的使用能够在组件之间更好地组织逻辑，提高性能和可维护性。


余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [深入理解 Nuxt.js 中的 app：data：refresh 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6f0c4f34bc45/)
- [深入理解 Nuxt.js 中的 app：error：cleared 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/732d62232fb8/)
- [深入理解 Nuxt.js 中的 app：error 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cb83a085e7a4/)
- [深入理解 Nuxt 中的 app created 钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/188ad06ef45a/)
- [Nuxt Kit 实用工具的使用示例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a66da411afd2/)
- [使用 Nuxt Kit 的构建器 API 来扩展配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f6e87c3cf111/)
- [Nuxt Kit 使用日志记录工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/37ad5a680e7d/)
- [Nuxt Kit API ：路径解析工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/441492dbf6ae/)
- [Nuxt Kit中的 Nitro 处理程序 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2bd1fe409aca/)
- [Nuxt Kit 中的模板处理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4cf144d7b562/)
- [Nuxt Kit 中的插件：创建与使用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/080baafc9cf0/)
- [Nuxt Kit 中的布局管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1c99e3fc4fb0/)
- [Nuxt Kit 中的页面和路由管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/85c68e006ffc/)
- [Nuxt Kit 中的上下文处理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/83b074b7a330/)
- [Nuxt Kit 组件管理：注册与自动导入 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1097e357ea9a/)
- [Nuxt Kit 自动导入功能：高效管理你的模块和组合式函数 | cmdragon's Blog](https://blog.cmdragon.cn/posts/54548c5422db/)
- [使用 Nuxt Kit 检查模块与 Nuxt 版本兼容性 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7739f2e3f502/)
- [Nuxt Kit 的使用指南：从加载到构建 | cmdragon's Blog](https://blog.cmdragon.cn/posts/89214487bbdc/)
- [Nuxt Kit 的使用指南：模块创建与管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4dc052ff586b/)
- [使用 nuxi upgrade 升级现有nuxt项目版本 | cmdragon's Blog](https://blog.cmdragon.cn/posts/07ce67a781de/)
- [如何在 Nuxt 3 中有效使用 TypeScript | cmdragon's Blog](https://blog.cmdragon.cn/posts/cd079a58ef40/)
- [使用 nuxi preview 命令预览 Nuxt 应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f243ae60d60/)
-

