---
title: useHeadSafe：安全生成HTML头部元素
date: 2024/7/17
updated: 2024/7/17
author: cmdragon 

excerpt:
  摘要：“useHeadSafe”是Vue.js组合函数，用于安全生成HTML头部元素，通过限制输入值格式避免XSS等安全风险，提供了安全值白名单确保只有安全属性被添加。

categories:
  - 前端开发

tags:
  - 安全
  - 编程
  - Vuejs
  - HTML
  - XSS
  - 前端
  - 组件
---

<img src="https://static.amd794.com/blog/images/2024_07_17 18_54_04.png@blog" title="2024_07_17 18_54_04.png" alt="2024_07_17 18_54_04.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

在构建网站时，我们常常需要在HTML文档的头部添加各种元信息，如`<meta>`标签、`<script>`标签、`<link>`
标签等，这些信息对于搜索引擎优化、页面加载性能优化、以及用户交互体验都至关重要。然而，直接在JavaScript中动态生成HTML头部元素时，可能会引入安全风险，比如XSS（跨站脚本攻击）。

`useHeadSafe`是一个用于安全生成HTML头部元素的Vue.js组合函数，它通过限制输入值为安全的格式，避免了潜在的安全风险。

## 安全使用`useHeadSafe`

`useHeadSafe`函数的使用方式与`useHead`
类似，但其核心功能在于确保所有输入的数据都是安全的，避免了直接使用用户输入数据时可能带来的安全风险。以下是如何使用`useHeadSafe`
的基本语法：

```
import { useHeadSafe } from 'unhead'

export default {
  setup() {
    const headData = {
      script: [
        { id: 'xss-script', innerHTML: 'alert("xss")' }
      ],
      meta: [
        { 'http-equiv': 'refresh', content: '0;alert(1)' }
      ]
    }

    const { head } = useHeadSafe(headData)

    // 使用生成的头部元素
    return {
      head
    }
  }
}

```

## 安全值白名单

`useHeadSafe`函数内部使用了安全值白名单，确保只有白名单内的属性可以被添加到HTML元素中。以下是白名单的详细内容：

- **htmlAttrs**：`id`,`class`,`lang`,`dir`
- **bodyAttrs**：`id`,`class`
- **meta**：`id`,`name`,`property`,`charset`,`content`
- **noscript**：`id`,`textContent`
- **script**：`id`,`type`,`textContent`
- **link
  **：`id`,`color`,`crossorigin`,`fetchpriority`,`href`,`hreflang`,`imagesrcset`,`imagesizes`,`integrity`,`media`,`referrerpolicy`,`rel`,`sizes`,`type`

## 示例：创建一个简单的登录页面

假设我们正在创建一个简单的登录页面，需要在页面加载时自动刷新页面，同时添加一个安全的`<script>`
标签来执行一些JavaScript代码。我们可以这样使用`useHeadSafe`：

```
<template>
  <div>
    <h1>登录页面</h1>
    <!-- 页面内容 -->
  </div>
</template>

<script>

export default {
  setup() {
    // 定义头部信息
    const headData = {
      title: '登录',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '登录页面' },
      ],
      script: [
        { src: 'https://example.com/login.js', async: true },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    };

    // 使用useHeadSafe确保头部信息的安全
    const { head } = useHeadSafe(headData);

    // 返回head对象，以便在模板中使用
    return {
      head,
    };
  },
};
</script>
```


## 往期文章归档：

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
- [Nuxt3 的生命周期和钩子函数（十） | cmdragon's Blog](https://blog.cmdragon.cn/posts/2277c22fe47d/)
- [Nuxt3 的生命周期和钩子函数（九） | cmdragon's Blog](https://blog.cmdragon.cn/2024/07/02/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B9%9D%EF%BC%89%20/)
- 

