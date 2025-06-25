---
url: /posts/d5370e880eaec9085a153caba4961676/
title: Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验
date: 2024-07-16T00:18:53+08:00
updated: 2024-07-16T00:18:53+08:00
author: cmdragon

summary:
  摘要：“Nuxt.js头部魔法：轻松自定义页面元信息，提升用户体验”介绍如何使用useHead函数在Nuxt应用中编程式设置页面头部信息，包括<title>、<meta>、<link>等标签，以增强SEO和用户体验。通过实例展示了如何配置静态和动态标题、元数据、样式、脚本等，使页面更符合SEO标准和个性化需求。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - useHead
  - SEO优化
  - 页面元信息
  - 前端开发
  - Unhead库
  - 动态标题
---

<img src="https://static.cmdragon.cn/blog/images/2024_07_14 17_05_22.png@blog" title="2024_07_14 17_05_22.png" alt="2024_07_14 17_05_22.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

## `useHead` 函数概述

`useHead`是一个用于在 Nuxt 应用中自定义页面头部属性的函数。它由`Unhead`库提供支持，允许开发者以编程和响应式的方式设置每个页面的头部信息。

## `useHead` 函数类型

```
useHead(meta: MaybeComputedRef<MetaObject>): void

```

## `MetaObject` 接口

`MetaObject`接口定义了可以传递给`useHead`的属性类型，如下所示：

```
interface MetaObject {
  title?: string;
  titleTemplate?: string | ((title?: string) => string);
  base?: Base;
  link?: Link[];
  meta?: Meta[];
  style?: Style[];
  script?: Script[];
  noscript?: Noscript[];
  htmlAttrs?: HtmlAttributes;
  bodyAttrs?: BodyAttributes;
}
```

## 参数

### `meta`

**类型**：`MetaObject`

`MetaObject`是`Unhead`库中的一个对象类型，用于封装和管理页面头部的元数据。`Unhead`是一个用于构建动态、可配置的 HTML
头部的库，它允许开发者在 Nuxt.js 应用中灵活地控制页面的元信息。

接受以下头部元数据的对象：

### `title`

`title`属性用于设置页面的静态标题。当用户在浏览器中打开页面时，显示在浏览器标签或书签中的标题就是由这个属性决定的。例如，如果你想为你的页面设置标题为“我的页面”，可以这样设置：

```
useHead({
  title: '我的页面'
});

```

### `titleTemplate`

`titleTemplate`属性允许你使用动态模板来生成标题。这可以是一个字符串模板或者一个函数，该函数接收一个参数（通常是当前的标题）并返回一个新的标题字符串。

**字符串模板**：

```
useHead({
  titleTemplate: '这是我的页面 - {{title}}'
});

```

**函数模板**：

```
const getTitle = (title) => `这是我的页面 - ${title}`;
useHead({
  titleTemplate: getTitle
});

```

### `base`

`base`属性用于设置`<base>`标签的属性，通常用于指定页面中相对链接的基础 URL。例如，如果你的页面是`https://example.com`
，并且你有一个链接指向`/blog`，那么使用`<base href="/blog">`可以确保所有相对链接都从`/blog`开始。

```
useHead({
  base: { href: '/blog' }
});

```

### `link`

`link`属性是一个数组，每个元素都是一个`<link>`标签的配置对象。这些对象通常包含`rel`、`href`、`type`
等属性，用于定义外部样式表、脚本文件或其他资源的链接。

```
useHead({
  link: [
    { rel: 'stylesheet', href: '/styles.css' },
    { rel: 'preload', href: '/fonts/roboto.woff2', as: 'font' }
  ]
});

```

### `meta`

`meta`属性也是一个数组，每个元素都是一个`<meta>`标签的配置对象。这些对象通常包含`name`、`content`、`http-equiv`
等属性，用于定义元信息，如描述、关键词、字符集等。

```
useHead({
  meta: [
    { name: 'description', content: '这是一个关于我的页面的描述' },
    { property: 'og:title', content: '我的页面' }
  ]
});

```

### `style`

`style`属性用于直接在页面上插入 CSS 样式。数组中的每个元素都是一个`<style>`标签的配置对象。

```
useHead({
  style: [
    '<style>body { background-color: #f0f0f0; }</style>',
    '<style id="custom-style">h1 { color: #ff0000; }</style>'
  ]
});

```

### `script`

`script`属性用于插入外部脚本文件或直接插入 JavaScript 代码。数组中的每个元素都是一个`<script>`标签的配置对象。

```
useHead({
  script: [
    '<script src="/js/main.js"></script>',
    '<script id="custom-script">console.log("这是自定义脚本");</script>'
  ]
});

```

### `noscript`

`noscript`属性用于在浏览器不支持脚本时显示的内容。数组中的每个元素都是一个`<noscript>`标签的配置对象。

```
useHead({
  noscript: [
    '<p>您的浏览器不支持脚本，请启用脚本以获取最佳体验。</p>'
  ]
});

```

### `htmlAttrs` 和 `bodyAttrs`

`htmlAttrs`和`bodyAttrs`属性分别用于设置`<html>`和`<body>`标签的属性。例如，你可以设置页面的语言属性：

```
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  bodyAttrs: { class: 'body-class' }
});

```

## 示例：

```
<template>
  <div>
    <h1>我的页面</h1>
  </div>
</template>

<script>
export default {
  setup() {
    // 使用 useHead 函数来设置 MetaObject
    useHead({
      // 设置静态页面标题
      title: '我的页面',
      // 配置动态模板以自定义每个页面的标题
      titleTemplate: 'My Website - %s',
      // 设置 <base> 标签的属性
      base: { href: '/app' },
      // 数组中的每个元素都映射到一个新的 <link> 标签
      link: [
        { rel: 'stylesheet', href: '/styles.css' },
        { rel: 'icon', href: '/favicon.ico' }
      ],
      // 数组中的每个元素都映射到一个新的 <meta> 标签
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '这是我的页面描述' }
      ],
      // 数组中的每个元素都映射到一个新的 <style> 标签
      style: [
        { cssText: 'body { background-color: #f0f0f0; }' }
      ],
      // 数组中的每个元素都映射到一个新的 <script> 标签
      script: [
        { src: '/js/app.js', type: 'text/javascript' }
      ],
      // 设置 <noscript> 标签的内容
      noscript: [
        '本页面需要 JavaScript 来正确显示。请启用 JavaScript 后再试。'
      ],
      // 设置 <html> 标签的属性
      htmlAttrs: {
        lang: 'zh-CN'
      },
      // 设置 <body> 标签的属性
      bodyAttrs: {
        class: 'my-body-class'
      }
    });
  }
};
</script>
```


## 往期文章归档：

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
- [Nuxt3 的生命周期和钩子函数（九） | cmdragon's Blog](https://blog.cmdragon.cn/2024-07-02/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E4%B9%9D%EF%BC%89%20/)
- [Nuxt3 的生命周期和钩子函数（八） | cmdragon's Blog](https://blog.cmdragon.cn/2024-06-29/front_end/nuxt3%20%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%92%8C%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%EF%BC%88%E5%85%AB%EF%BC%89%20/)
- 

