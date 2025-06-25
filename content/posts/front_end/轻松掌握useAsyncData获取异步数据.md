---
url: /posts/e1b1c62b5975f8ebfa61adc507591cf7/
title: 轻松掌握useAsyncData获取异步数据
date: 2024-07-12T00:18:53+08:00
updated: 2024-07-12T00:18:53+08:00
author: cmdragon

summary:
  摘要：本文详细介绍Nuxt.js中的useAsyncData组合式函数，它用于在服务端渲染(SSR)过程中异步获取数据，确保客户端正确水合，避免重复请求。内容包括基本概念、参数说明（key, handler, options）、示例用法、如何监听参数变化自动刷新数据及返回值详解，展示了在页面组件中使用useAsyncData的具体方式和注意事项。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 异步数据
  - SSR
  - 组件函数
  - 数据获取
  - 响应式对象
  - 服务端渲染
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_12 15_51_07.png@blog" title="2024_07_12 15_51_07.png" alt="2024_07_12 15_51_07.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在Nuxt.js中，`useAsyncData`是一个非常有用的组合式函数，它允许我们在服务端渲染（SSR）的过程中异步获取数据，同时确保这些数据能够在客户端正确地水合（hydrate），避免了不必要的重复请求。

## 基本概念

`useAsyncData`是一个组合式函数，它可以在 Nuxt
应用中的页面、组件或插件中使用。这个函数接受一个唯一的键和一个异步函数，异步函数的返回值将作为数据源。`useAsyncData`
返回一个响应式对象，其中包含了数据、加载状态、错误信息以及一个刷新数据的函数。

## 参数说明

1. **key**:

    - 类型：`string`
    - 说明：一个用于唯一标识异步数据请求的键。如果未提供，`useAsyncData`会自动生成一个基于文件名和行号的键。

2. **handler**:

    - 类型：`() => Promise<any>`或`() => any`
    -
   说明：一个异步函数，它返回一个Promise对象，该Promise对象在解析时提供数据。这个函数是必须的，并且其返回值不能是`undefined`
   或`null`，否则可能会导致请求重复。

3. **options**:

    - 类型：`Partial<AsyncDataOptions>`

    - 说明：这是一个可选的对象，可以包含以下属性：

        - `server`:

            - 类型：`boolean`
            - 说明：默认为`true`，表示数据将在服务器端获取。

        - `lazy`:

            - 类型：`boolean`
            - 说明：默认为`false`，表示数据将在路由加载时立即获取。如果设置为`true`，数据将在路由导航后异步获取，不会阻塞导航。

        - `immediate`:

            - 类型：`boolean`
            - 说明：默认为`true`，表示在路由加载时立即触发数据获取。如果设置为`false`，数据获取将被延迟，直到首次访问该路由。

        - `default`:

            - 类型：`(data: any) => any`
            - 说明：一个工厂函数，用于在异步数据解析之前设置`data`的默认值。这在`lazy: true`或`immediate: false`时非常有用。

        - `transform`:

            - 类型：`(data: any) => any`
            - 说明：一个函数，用于在解析`handler`函数的结果后修改数据。

        - `pick`:

            - 类型：`(data: any) => any`
            - 说明：一个函数，用于从`handler`函数的结果中挑选特定的键。

        - `watch`:

            - 类型：`(data: any) => any`
            - 说明：一个函数，用于监听响应式源，并在其变化时自动刷新数据。

        - `deep`:

            - 类型：`boolean`
            - 说明：默认为`true`，表示返回深层响应式对象。如果设置为`false`，则返回浅层响应式对象，这可能在某些情况下提高性能。

## 示例用法

以下是在`pages/index.vue`页面中使用`useAsyncData`的示例：

```html

<template>
    <div>
        <div v-if="pending">加载中...</div>
        <div v-else-if="error">错误：{{ error.message }}</div>
        <div v-else>
            <ul>
                <li v-for="mountain in data" :key="mountain.id">{{ mountain.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    // 使用 useAsyncData 获取数据
    const {data, pending, error, refresh} = await useAsyncData(
            'mountains', // 唯一键，用于确保数据获取的正确性
            () => $fetch('https://api.nuxtjs.dev/mountains') // 异步函数，返回数据
    )
</script>
```

### 参数解释

1. **key**：一个字符串，用于标识这个数据请求的唯一键。在同一个组件中，如果有多个`useAsyncData`调用，每个键都应该是唯一的。
1. **handler**：一个异步函数，它应该返回一个`Promise`，该`Promise`在解析时提供所需的数据。

### 返回值

- **data**：一个响应式引用，包含异步函数解析后的数据。
- **pending**：一个布尔值，表示数据是否正在加载。
- **error**：一个响应式引用，如果数据加载失败，它将包含一个错误对象。
- **refresh**：一个函数，可以用来重新执行异步函数，从而刷新数据。

### 注意事项

- 确保`useAsyncData`的键在整个应用中是唯一的，以避免数据冲突。
- 如果你的数据请求依赖于组件的响应式状态，可以使用`watch`选项来自动重新获取数据。

## 监听参数

`useAsyncData`
组合式函数确实允许你监听外部变量的变化，并在这些变量发生变化时重新运行异步数据获取器。下面是如何在`pages/index.vue`
中使用`watch`选项来监听`page`变量的变化，并相应地更新数据的一个示例。

### 示例代码

```vue
<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">错误：{{ error.message }}</div>
    <div v-else>
      <ul>
        <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
      <!-- 假设有一个分页组件或按钮来改变页码 -->
      <button @click="page.value++">下一页</button>
    </div>
  </div>
</template>

<script setup>
    // 创建一个响应式引用来存储当前页码
    const page = ref(1)

    // 使用 useAsyncData 获取数据，并监听 page 变量的变化
    const { data: posts, pending, error, refresh } = await useAsyncData(
      'posts',
      () => $fetch('https://fakeApi.com/posts', {
        params: {
          page: page.value // 将当前页码作为参数传递给 API
        }
      }),
      {
        watch: [page] // 监听 page 变量的变化
      }
    )
</script>
```

### 解释

1. **响应式引用`page`**：我们使用`ref`创建了一个响应式引用`page`，用来存储当前页码。
2. **`useAsyncData`获取数据**：我们使用`useAsyncData`来获取数据，并将`page`作为参数传递给
   API。同时，我们传递了一个包含`watch`选项的对象，其中指定了要监听的响应式引用`page`。
3. **监听`page`变化**：当`page`的值发生变化时，`useAsyncData`会自动重新运行获取器函数，并使用新的页码值来获取数据。
4. **返回数据**：最后，我们将`page`、`posts`、`pending`、`error`和`refresh`函数返回到模板中，以便在模板中访问和使用这些数据。

## 返回值

### 1. `data`

`data`属性包含异步函数返回的结果。在请求完成之前，它可能是`undefined`。

```
const { data } = useAsyncData('key', async () => {
  const response = await fetch('/api/data');
  return await response.json();
});

// 在模板中使用 data
<div>{{ data ? data.someProperty : '加载中...' }}</div>

```

### 2. `pending`

`pending`是一个布尔值，表示数据请求是否正在进行中。

```
const { pending } = useAsyncData('key', async () => {
  // 异步请求...
});

// 在模板中使用 pending
<div v-if="pending">加载中...</div>
<div v-else>{{ data ? data.someProperty : '无数据' }}</div>

```

### 3. `refresh/execute`

`refresh`函数可以用来重新执行异步数据请求。在某些情况下，你可能需要在用户操作后更新数据。

```
const { refresh } = useAsyncData('key', async () => {
  // 异步请求...
});

// 调用 refresh 来重新获取数据
function handleRefresh() {
  refresh();
}

```

在模板中，你可以这样绑定：

```
<button @click="handleRefresh">刷新数据</button>

```

### 4. `error`

如果异步请求失败，`error`属性将包含一个错误对象。

```
const { error } = useAsyncData('key', async () => {
  // 异步请求...
});

// 在模板中使用 error
<div v-if="error">发生错误：{{ error.message }}</div>

```

### 5. `status`

`status`属性是一个字符串，表示当前数据请求的状态。

```
const { status } = useAsyncData('key', async () => {
  // 异步请求...
});

// 在模板中使用 status
<div v-if="status === 'pending'">加载中...</div>
<div v-else-if="status === 'error'">发生错误：{{ error.message }}</div>
<div v-else-if="status === 'success'">{{ data.someProperty }}</div>
<div v-else>未知状态</div>

```

### 完整示例

以下是一个使用`useAsyncData`的完整组件示例：

```
<script setup>
import { useAsyncData } from '#app/composables/useAsyncData';

const { data, pending, error, refresh, status } = useAsyncData('user-profile', async () => {
  const response = await fetch('/api/user/profile');
  if (!response.ok) {
    throw new Error('无法获取用户资料');
  }
  return response.json();
});

function handleRefresh() {
  refresh();
}
</script>

<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">发生错误：{{ error.message }}</div>
    <div v-else-if="status === 'success'">
      <h1>{{ data.name }}</h1>
      <p>{{ data.email }}</p>
    </div>
    <div v-else>未知状态</div>
    <button @click="handleRefresh">刷新数据</button>
  </div>
</template>

```

在这个组件中，我们使用`useAsyncData`来获取用户资料，并在模板中根据不同的状态显示不同的信息。用户可以通过点击按钮来刷新数据。


## 往期文章归档：

- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/133b896ec704/)
- [Nuxt框架中内置组件详解及使用指南（五） | cmdragon's Blog](https://blog.cmdragon.cn/posts/707e1176ace8/)
- [Nuxt框架中内置组件详解及使用指南（四） | cmdragon's Blog](https://blog.cmdragon.cn/posts/64c74472d95e/)
- [Nuxt框架中内置组件详解及使用指南（三） | cmdragon's Blog](https://blog.cmdragon.cn/posts/0524f12c820c/)
- [Nuxt框架中内置组件详解及使用指南（二） | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c234037b6fe/)
- [Nuxt框架中内置组件详解及使用指南（一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/22a2f8cb2cf0/)
- [Nuxt3 的生命周期和钩子函数（十一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/693a389ead2d/)
- [Nuxt3 的生命周期和钩子函数（十） | cmdragon's Blog](https://blog.cmdragon.cn/posts/2277c22fe47d/)
- [Nuxt3 的生命周期和钩子函数（九） | cmdragon's Blog](https://blog.cmdragon.cn/2024-07-02/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B9%9D%EF%BC%89%20/)
- [Nuxt3 的生命周期和钩子函数（八） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%85%AB%EF%BC%89%20/)
- [Nuxt3 的生命周期和钩子函数（七） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B8%83%EF%BC%89/)
- [Nuxt3 的生命周期和钩子函数（六） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%85%AD%EF%BC%89/)
- [Nuxt3 的生命周期和钩子函数（五） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-28/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%BA%94%EF%BC%89/)
- [Nuxt3 的生命周期和钩子函数（四） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-27/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%9B%9B%EF%BC%89/)
- 

