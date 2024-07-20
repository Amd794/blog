---
title: 使用 useLazyFetch 进行异步数据获取
date: 2024/7/20
updated: 2024/7/20
author: cmdragon

excerpt:
  摘要：“使用 useLazyFetch 进行异步数据获取”介绍了在Nuxt开发中利用useLazyFetch进行异步数据加载的方法，强调其立即触发导航特性，与useFetch相似的使用方式，以及如何处理数据状态和错误，通过示例展示如何在模板中根据数据加载状态显示不同内容。

categories:
  - 前端开发

tags:
  - Nuxt
  - 异步
  - 数据
  - 加载
  - 框架
  - 前端
  - 编程
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_20 15_31_40.png@blog" title="2024_07_20 15_31_40.png" alt="2024_07_20 15_31_40.png"/>

<img src="https://static.cmdragon.cn/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.cmdragon.cn/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在 nuxt 开发中，我们经常需要进行异步数据获取。`useLazyFetch`是一个对`useFetch`的封装，它提供了一种在处理程序解析之前触发导航的方式。

## 一、`useLazyFetch` 的特点**

1. **立即触发导航**：默认情况下，`useFetch`在异步处理程序解析之前会阻止导航。而`useLazyFetch`通过将`lazy`选项设置为`true`
   ，可以在处理程序解析之前触发导航。


1. **与`useFetch`相同的签名**：`useLazyFetch`具有与`useFetch`相同的签名，这使得它易于使用和理解。

2. 像下面这样调用`useLazyFetch`来获取数据：

```
const { pending, data: posts } = await useLazyFetch('/api/posts')
```

`pending`表示数据获取的状态（是否正在加载），`posts`则存储获取到的数据。

## **二、使用步骤**

1. 调用`useLazyFetch`：使用`useLazyFetch`来获取数据，并将获取到的数据存储在变量中。
2. 处理待处理和错误状态：通过`pending`变量来检查数据是否正在加载，通过`error`变量来处理可能出现的错误。
3. 监视数据变化：使用`watch`函数来监视数据的变化，并在数据加载完成后进行相应的操作。
4. 在模板中使用数据：根据`pending`的值来显示加载中的提示，或者在数据加载完成后显示数据。

## **三、示例代码**

处理待处理和错误状态：

```
<template>
  <div v-if="pending">
    加载中...
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- 对每个 post 进行相关操作 -->
    </div>
  </div>
</template>

```

通过上述模板代码，根据`pending`的值来显示不同的内容。当`pending`为`true`时，显示“加载中...”，否则显示获取到的数据。

监视数据变化：

```
watch(posts, (newPosts) => {
  // 当 posts 数据发生变化时执行的操作
})
```

## **四、注意事项**

1. `useLazyFetch`是编译器转换的保留函数名，因此你不应该将自己的函数命名为`useLazyFetch`。
1. 在使用`useLazyFetch`时，需要根据你的项目实际情况来替换`useFetch`。
2. 要确保提供的 API 路径（如上述示例中的`/api/posts`）是正确有效的。
3. 在处理数据时，需要注意数据可能为空的情况，避免出现异常。


## 往期文章归档：

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
- [Nuxt3 的生命周期和钩子函数（十一） | cmdragon's Blog](https://blog.cmdragon.cn/posts/693a389ead2d/)
- 


