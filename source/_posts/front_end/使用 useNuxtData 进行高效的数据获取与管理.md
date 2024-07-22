---
title: 使用 useNuxtData 进行高效的数据获取与管理
date: 2024/7/22
updated: 2024/7/22
author: cmdragon

excerpt:
  深入讲解了Nuxt 3中useNuxtData组合函数的应用，演示了如何通过此函数访问缓存数据，实现组件间数据共享，以及如何在数据更新时利用缓存提高用户体验。文章提供了具体的用法示例，包括数据获取、访问缓存数据和数据更新的场景。

categories:
  - 前端开发

tags:
  - Nuxt3
  - 缓存
  - 数据
  - 共享
  - 组件
  - 更新
  - 性能
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_22 14_42_50.png@blog" title="2024_07_22 14_42_50.png" alt="2024_07_22 14_42_50.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

### `useNuxtData` 概述

`useNuxtData`是 Nuxt 3 中的一个组合函数，用于访问通过其他数据获取函数（如`useAsyncData`、`useLazyAsyncData`、`useFetch`
和`useLazyFetch`等）缓存的数据。它允许在不同的组件之间共享数据，避免重复请求，提高性能。

### 主要功能

1. **访问缓存数据**：通过提供一个唯一的键名来访问之前缓存的数据。
2. **数据共享**：不同的组件可以共享同一数据源，确保数据一致性。
3. **更新**：在数据更新时可以使用缓存数据作为占位符，提高用户体验。

### 用法示例

#### 1. 获取数据并缓存

在`pages/posts.vue`中，我们可以使用`useFetch`来获取帖子数据，并将其缓存到`posts`键名下：

```
// pages/posts.vue
<script setup>

// 使用 useFetch 获取数据并缓存
const { data, error } = await useFetch('/api/posts', { key: 'posts' })

// 处理错误
if (error.value) {
  console.error('获取帖子失败:', error.value)
}
</script>

<template>
  <div>
    <h1>帖子列表</h1>
    <ul>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

```

#### 2. 访问缓存数据

在`pages/posts/[id].vue`中，我们可以使用`useNuxtData`来访问`posts.vue`中缓存的帖子数据：

```
// pages/posts/[id].vue
<script setup>
import { useRoute } from 'vue-router'

// 获取路由参数
const { id } = useRoute().params

// 访问缓存的帖子数据
const { data: posts } = useNuxtData('posts')

// 使用 useLazyFetch 获取单个帖子的详细信息
const { data, error } = useLazyFetch(`/api/posts/${id}`, {
  key: `post-${id}`,
  default() {
    // 从缓存中找到对应的帖子，并将其设置为默认值
    return posts.value.find(post => post.id === id) || null
  }
})

// 处理错误
if (error.value) {
  console.error('获取帖子详情失败:', error.value)
}
</script>

<template>
  <div>
    <h1>帖子详情</h1>
    <div v-if="data">
      <h2>{{ data.title }}</h2>
      <p>{{ data.content }}</p>
    </div>
  </div>
</template>

```

#### 3. 更新

在`pages/todos.vue`中，我们可以使用`useAsyncData`来获取待办事项，并在添加新待办事项时利用缓存进行乐观更新：

```
// pages/todos.vue
<script setup>

// 获取待办事项数据并缓存
const { data: todos, error } = await useAsyncData('todos', () => $fetch('/api/todos'))

// 处理错误
if (error.value) {
  console.error('获取待办事项失败:', error.value)
}
</script>

<template>
  <div>
    <h1>待办事项</h1>
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.task }}</li>
    </ul>
    <NewTodo />
  </div>
</template>

```

在`components/NewTodo.vue`中，我们可以实现添加新待办事项的逻辑：

```
// components/NewTodo.vue
<script setup>
import { ref } from 'vue'

const newTodo = ref('')
const previousTodos = ref([])

// 访问 todos.vue 中 useAsyncData 的缓存值
const { data: todos } = useNuxtData('todos')

const addTodo = async () => {
  const { data, error } = await useFetch('/api/addTodo', {
    method: 'post',
    body: {
      todo: newTodo.value
    },
    onRequest() {
      // 在请求开始时保存当前的 todos 数据
      previousTodos.value = [...todos.value]
      // 乐观更新 UI
      todos.value.push({ id: Date.now(), task: newTodo.value }) // 假设 ID 为当前时间戳
    },
    onRequestError() {
      // 请求失败时回滚数据
      todos.value = previousTodos.value
    },
    async onResponse() {
      // 请求成功后刷新 todos 数据
      await refreshNuxtData('todos')
    }
  })

  // 清空输入框
  newTodo.value = ''
}
</script>

<template>
  <div>
    <input v-model="newTodo" placeholder="添加新待办事项" />
    <button @click="addTodo">添加</button>
  </div>
</template>

```

### 类型定义

`useNuxtData`的类型定义如下：

```
useNuxtData<DataT = any> (key: string): { data: Ref<DataT | null> }
```

- `key`: 用于访问缓存数据的键名。
- `data`: 返回一个响应式引用，包含缓存的数据或`null`。

### 注意事项

- 确保在使用`useNuxtData`时，提供的键名与之前缓存数据时使用的键名一致。
- 在进行乐观更新时，要小心处理数据的回滚，以避免用户看到不一致的状态。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/133b896ec704/)
- [Nuxt框架中内置组件详解及使用指南（五） | cmdragon's Blog](https://blog.cmdragon.cn/posts/707e1176ace8/)
- [Nuxt框架中内置组件详解及使用指南（四） | cmdragon's Blog](https://blog.cmdragon.cn/posts/64c74472d95e/)
- [Nuxt框架中内置组件详解及使用指南（三） | cmdragon's Blog](https://blog.cmdragon.cn/posts/0524f12c820c/)
- [Nuxt框架中内置组件详解及使用指南（二） | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c234037b6fe/)
- [Nuxt框架中内置组件详解及使用指南（一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/22a2f8cb2cf0/)
- 



