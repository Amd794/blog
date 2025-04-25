---
title: Nuxt.js  路由管理：useRouter 方法与路由中间件应用
date: 2024/7/28
updated: 2024/7/28
author: cmdragon

excerpt:
  摘要：本文介绍了Nuxt 3中useRouter方法及其在路由管理和中间件应用中的功能。内容包括使用useRouter添加、移除路由，获取路由信息，基于History API的操作，导航守卫的实现，如定义匿名、命名及全局中间件，以及使用navigateTo和abortNavigation辅助函数。同时，还涉及Promise和错误处理，最后通过一个示例展示了useRouter的常见用法。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - 路由管理
  - useRouter
  - 中间件
  - 前端开发
  - Vue.js
  - Web开发
---

<img src="https://static.amd794.com/blog/images/2024_07_28 17_23_32.png@blog" title="2024_07_28 17_23_32.png" alt="2024_07_28 17_23_32.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

## **一、Nuxt 中的`useRouter`方法**

`
useRouter `是 Nuxt 3 提供的一个用于处理路由的重要工具。它让您能够在应用中方便地进行各种路由操作。比如添加路由、导航、路由守卫等。

## **二、基本功能**

1. `addRoute()`：向路由实例添加新的路由。您可以提供`parentName`将新路由添加为现有路由的子路由。 示例：

```
const router = useRouter();
router.addRoute({ name: 'newRoute', path: '/newPath', component: NewComponent });

```

2. `removeRoute()`：根据名称移除现有路由。 示例：

```
router.removeRoute('newRoute');

```

3. `getRoutes()`：获取所有路由记录的完整列表。 示例：

```
const routes = router.getRoutes();

```

4. `hasRoute()`：检查是否存在具有给定名称的路由。 示例：

```
const hasRoute = router.hasRoute('newRoute');

```

5. `resolve()`：返回路由位置的规范化版本，并包含一个`href`属性，其中包含任何现有的基础路径。 示例：

```
const resolvedRoute = router.resolve({ name: 'newRoute' });

```

## **三、基于 History API 的操作**

1. `back()`：如果可能，返回上一页，与`router.go(-1)`相同。 示例：

```
router.back();

```

2. `forward()`：如果可能，前进到下一页，与`router.go(1)`相同。 示例：

```
router.forward();

```

3. `go()`：在历史记录中向前或向后移动，不受`router.back()`和`router.forward()`中施加的层次结构限制。 示例：

```
router.go(3);  // 向前移动 3 步

```

4. `push()`：通过将新条目推入历史堆栈来以编程方式导航到新的 URL。建议使用`navigateTo`代替。 示例：

```
router.push({ path: "/newUrl" });

```

5. `replace()`：通过替换当前路由历史堆栈中的当前条目来以编程方式导航到新的 URL。建议使用`navigateTo`代替。 示例：

```
router.replace({ hash: "#bio" });
```

## **四、导航守卫**

### 定义中间件

1. **匿名（或内联）中间件**：

    - 直接在页面的`definePageMeta`方法中定义。

   ```
   export default {
     pageMeta: {
       middleware: ['myMiddleware']
     }
   }
   
   ```

1. **命名中间件**：

    - 放置在`middleware/`目录下，并在页面中通过异步导入自动加载。

   ```
   // 在 `middleware/` 目录下创建文件
   export default defineNuxtRouteMiddleware((to, from) => {
     // 中间件逻辑
   })
   
   ```

1. **全局中间件**：

    - 放置在`middleware/`目录下，并以`.global`后缀结尾。

   ```
   // 在 `middleware/` 目录下创建文件
   export default defineNuxtRouteMiddleware((to, from) => {
     // 全局中间件逻辑
   })
   
   ```

### 使用辅助函数

Nuxt.js 提供了两个全局可用的辅助函数来处理导航：

- **`navigateTo`**：用于重定向到给定的路由。

  ```
  return navigateTo('/new-route')
  
  ```

- **`abortNavigation`**：用于中止当前的导航。

  ```
  return abortNavigation()
  
  ```

### 返回值

中间件返回的值决定了导航的行为：

- **无**：不阻止导航，将继续执行下一个中间件函数（如果有的话），或者完成路由导航。
- **`navigateTo`**：重定向到给定的路径，并在服务器端发生重定向时设置重定向代码为 302 Found 或 301 Moved Permanently。
- **`abortNavigation`**：停止当前的导航。
- **`abortNavigation(error)`** ：拒绝当前的导航并提供错误信息。

### 示例

假设我们有一个中间件用于检查用户是否登录，如果未登录则重定向到登录页面：

```
export default defineNuxtRouteMiddleware((to, from) => {
  if (!userIsLoggedIn()) {
    return navigateTo('/login')
  }
})

```

### 注意事项

- **避免无限循环**：在重定向之前检查`to.path`是很重要的，否则可能会导致无限重定向循环。
- **使用辅助函数**：推荐使用`navigateTo`和`abortNavigation`辅助函数来执行重定向或停止导航，以确保与 Nuxt.js 的集成和未来的兼容性。
- **了解变更风险**：尽管`navigateTo`和`abortNavigation`辅助函数是推荐使用的，但其他在 vue-router 文档中描述的返回值可能也能工作。然而，未来
  Nuxt.js 可能会对这些返回值进行更改，因此使用官方推荐的方法是最安全的。

## **五、Promise 和错误处理**

1. `isReady()`：返回一个`Promise`，在路由完成初始导航时解析。 示例：

```
const ready = await router.isReady();

```

2. `onError`：添加一个错误处理程序，每次导航期间发生未捕获的错误时都会调用该处理程序。

## **六、示例应用**

以下是一个简单的 Nuxt 3 应用示例，展示了如何使用`useRouter`的一些常见功能：

```
// pages/index.vue
<template>
  <div>
    <h1>Nuxt 3 Router Demo</h1>
    <button @click="addNewRoute">Add New Route</button>
    <button @click="removeRoute">Remove Route</button>
    <button @click="goToNewUrl">Go to New URL</button>
  </div>
</template>

<script setup>

const addNewRoute = () => {
  router.addRoute({ name: 'newRoute', path: '/newPath', component: () => import('./NewComponent.vue') });
};

const removeRoute = () => {
  router.removeRoute('newRoute');
};

const goToNewUrl = () => {
  router.push({ path: '/newPath' });
};
</script>
```

## 往期文章归档：

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
- [轻松掌握useAsyncData获取异步数据 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bdaee7956a6e/)
- [使用 `useAppConfig` ：轻松管理应用配置 | cmdragon's Blog](https://blog.cmdragon.cn/posts/133b896ec704/)
- 

