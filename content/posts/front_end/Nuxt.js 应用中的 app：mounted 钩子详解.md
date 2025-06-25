---
url: /posts/0655a1f20f3c7d66e6b41c961df3103e/
title: Nuxt.js 应用中的 app：mounted 钩子详解
date: 2024-10-05T00:18:53+08:00
updated: 2024-10-05T00:18:53+08:00
author: cmdragon

summary:
  app:mounted 钩子在 Vue 应用的生命周期中扮演着重要角色，提供了在组件被挂载后的执行时机。通过合理利用这个钩子，我们能够提高组件的交互性、用户体验以及性能优化。确保在其内部代码的健壮性和清理机制，将为你的 Vue 应用带来显著的提升。

categories:
  - 前端开发

tags:
  - Nuxt.js
  - app:mounted
  - 生命周期
  - Vue应用
  - DOM操作
  - 组件渲染
  - 钩子函数
---

<img src="https://static.cmdragon.cn/blog/images/2024_10_05 11_34_44.png@blog" title="2024_10_05 11_34_44.png" alt="2024_10_05 11_34_44.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`



---

## 目录

1. [概述](#1-概述)
2. [app:mounted 钩子的详细说明](#2-appmounted-钩子的详细说明)
    - 2.1 [钩子的定义与作用](#21-钩子的定义与作用)
    - 2.2 [调用时机](#22-调用时机)
    - 2.3 [返回值与异常处理](#23-返回值与异常处理)
3. [具体使用示例](#3-具体使用示例)
    - 3.1 [组件渲染后执行逻辑](#31-组件渲染后执行逻辑)
    - 3.2 [第三方库初始化](#32-第三方库初始化)
4. [应用场景](#4-应用场景)
5. [实际开发中的最佳实践](#5-实际开发中的最佳实践)
6. [注意事项](#6-注意事项)
7. [关键要点](#7-关键要点)
8. [练习题](#8-练习题)
9. [总结](#9-总结)

---

### 1. 概述

`app:mounted` 是 Vue 应用中的生命周期钩子，在 Vue 实例被挂载到 DOM 后即会被调用。此钩子的运行标志着组件的初始渲染已完成，因此特别适合用于执行那些依赖于
DOM 的逻辑。

### 2. app:mounted 钩子的详细说明

#### 2.1 钩子的定义与作用

`app:mounted` 钩子允许开发者在 Vue 实例被正确挂载到 DOM 后立即执行一些操作。这类操作通常包括：

- 获取 DOM 元素的实时大小
- 进行动画初始化
- 处理与 UI 相关的插件初始化

#### 2.2 调用时机

- **执行环境**: 该钩子仅在客户端执行。这意味着在服务器端运行时不会被触发。
- **挂载时机**: 当 Vue 实例被创建并挂载完成，即开始渲染 DOM 后，该钩子被调用。这是执行涉及到 DOM 操作或需要实时更新的逻辑的最佳时机。

#### 2.3 返回值与异常处理

`app:mounted` 不会有返回值，而是用于执行需要运行的代码块。如果在这个钩子内部抛出异常，可能会中断后续的执行，因此需要确保代码的稳健性。

### 3. 具体使用示例

#### 3.1 组件渲染后执行逻辑

你可以利用 `app:mounted` 钩子在组件被渲染后访问它们的 DOM 元素并执行一些逻辑。

```javascript
// plugins/mountedPlugin.js
export default defineNuxtPlugin({
    hooks: {
        'app:mounted'() {
            const element = document.querySelector('.my-element');

            // 例如，获取元素的宽度并输出
            if (element) {
                console.log('元素宽度:', element.offsetWidth);
            }
        }
    }
});
```

在这个示例中，我们获取了 `.my-element` 类的 DOM 元素，并在控制台输出其宽度。

#### 3.2 第三方库初始化

`app:mounted` 还可以用作第三方库的初始化。例如，在应用挂载后初始化图表库：

```javascript
// plugins/chartPlugin.js
import Chart from 'chart.js';

export default defineNuxtPlugin({
    hooks: {
        'app:mounted'() {
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});
```

在这个示例中，我们在 DOM 完成挂载后初始化了一个简单的柱状图。

### 4. 应用场景

1. **动态样式或布局处理**: 根据 DOM 元素的初始状态（如宽度、高度）对布局进行调整。
2. **事件绑定**: 在组件的 DOM 元素上绑定自定义事件监听器。
3. **第三方库**: 初始化需要 DOM 的第三方库，如图表库、地图工具等。

### 5. 实际开发中的最佳实践

1. **避免阻塞**: 尽量避免在 `app:mounted` 钩子内执行耗时操作，以维护良好的用户体验。
2. **条件逻辑**: 确保在访问 DOM 元素之前检查其存在与可用状态。
3. **清理资源**: 如果绑定了事件或创建了定时器，确保在组件的销毁（例如，`beforeDestroy` 钩子）时进行清理。

### 6. 注意事项

- **异步请求**: 在 `app:mounted` 内发起异步请求时，必须做好状态管理和数据处理，以免出现未定义状态。
- **测试**: 确保对依赖于 DOM 的功能进行很好的测试，以应对不同浏览器或环境下的表现差异。

### 7. 关键要点

- `app:mounted` 是一个重要的生命周期钩子，只在客户端执行。
- 适用于在组件初始化后执行与 DOM 相关的操作。
- 需注意处理异常和确保资源的及时清理。

### 8. 练习题

1. **动态样式调整**: 编写一个插件，在 `app:mounted` 中根据窗口大小调整某个组件的 CSS 样式。
2. **事件监听**: 利用 `app:mounted` 在特定元素上添加点击事件监听器，并在点击时打印相关信息。
3. **重绘图表**: 实现一个功能，当窗口大小发生改变时，能够重新绘制图表并显示更新后的数据。

### 9. 总结

`app:mounted` 钩子在 Vue 应用的生命周期中扮演着重要角色，提供了在组件被挂载后的执行时机。通过合理利用这个钩子，我们能够提高组件的交互性、用户体验以及性能优化。确保在其内部代码的健壮性和清理机制，将为你的
Vue 应用带来显著的提升。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Nuxt.js 应用中的 app：beforeMount 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bbdca1e3d9a5/)
- [Nuxt.js 应用中的 app：redirected 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c83b294c7a07/)
- [Nuxt.js 应用中的 app：rendered 钩子详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/26479872ffdc/)
- [应用中的错误处理概述 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c9b317a962a/)
- [理解 Vue 的 setup 应用程序钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/405db1302a23/)
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
-


