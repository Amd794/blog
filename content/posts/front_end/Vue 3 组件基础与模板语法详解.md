---
url: /posts/f1d2e045fea28aefaad4d6732b7a05e7/
title: Vue 3 组件基础与模板语法详解
date: 2024-05-24T16:31:13+08:00
lastmod: 2024-05-24T16:31:13+08:00
categories:
  - 前端开发

tags:
  - Vue3特性
  - CompositionAPI
  - Teleport
  - Suspense
  - Vue3安装
  - 组件基础
  - 模板语法
---

<img src="/images/2024_05_24 16_35_34.png" title="2024_05_24 16_35_34.png" alt="2024_05_24 16_35_34.png"/>


## Vue 3 简介

**1. Vue 3 的新特性**

Vue 3引入了许多新的特性，以提高框架的性能和可维护性。下面是一些主要的新特性：

- **Composition API**：这是Vue 3中最大的变化之一，它提供了一种更灵活的方式来组织和重用组件的逻辑。
- **Teleport**：这是一个新的API，允许我们在组件树中将元素“传送”到其他位置。
- **Suspense**：这是一个新的API，允许我们在组件树中等待异步数据加载。
- **Fragment**：这是一个新的内置组件，允许我们在组件中渲染多个根节点。
- **v-memo**：这是一个新的指令，允许我们在渲染过程中缓存组件的输出。
- **更快的渲染速度**：Vue 3中的渲染器已经重写，提供了更快的渲染速度。

**2. 安装与配置**

要使用Vue 3，我们需要先安装它。可以使用npm或yarn来安装Vue 3：

```shell
npm install vue@next
# or
yarn add vue@next

```

安装完成后，我们可以在JavaScript中使用Vue 3：

```vue
import { createApp } from 'vue'

const App = {
data() {
return {
message: 'Hello Vue 3!'
}
}
}

const app = createApp(App)
app.mount('#app')

```

或者在HTML中使用Vue 3：

```vue

<script src="https://unpkg.com/vue@next"></script>

<div id="app">
  {{ message }}
</div>

<script>
  const {createApp} = Vue

  const App = {
    data() {
      return {
        message: 'Hello Vue 3!'
      }
    }
  }

  const app = createApp(App)
  app.mount('#app')
```

## Vue 3 组件基础

**1. 组件的概念**

AD：[首页 | 一个覆盖广泛主题工具的高效在线平台](https://cmdragon.cn/)
在Vue中，组件是构成应用程序的基本单位。组件是独立的、可复用的Vue实例，具有自己的属性、事件、生命周期钩子等。组件可以看作是页面的最小单位，通过组合这些组件，我们可以构建出复杂的页面。

**2. 组件的创建与注册**

创建Vue组件的方式有多种，可以通过Vue的构造函数，也可以使用`defineComponent`函数。

```vue
// 使用Vue构造函数
const MyComponent = new Vue({
data() {
return {
message: 'Hello'
}
},
template: '
<div>{{ message }}</div>'
})

// 使用defineComponent
const MyComponent = defineComponent({
data() {
return {
message: 'Hello'
}
},
template: '
<div>{{ message }}</div>'
})

```

注册组件可以通过`app.component`方法，也可以在组件内部使用`components`选项。

```vue
// 全局注册
const app = createApp({})
app.component('my-component', MyComponent)

// 局部注册
const MyApp = createApp({})
MyApp.component('my-component', MyComponent)

```

**3. 组件的数据传递**

组件之间的数据传递主要通过`props`和`emit`实现。

**Props**：用于父组件向子组件传递数据。子组件可以通过`defineComponent`的`props`选项声明接收的数据。

```vue
const MyComponent = defineComponent({
props: {
message: {
type: String,
required: true
}
},
template: '
<div>{{ message }}</div>'
})

```

**Emits**：用于子组件向父组件传递数据。子组件可以通过`emit`方法触发事件，并传递数据。
AD：[专业搜索引擎](https://movie.cmdragon.cn:2083/)

```vue
const MyComponent = defineComponent({
methods: {
sendMessage() {
this.$emit('message', 'Hello from child')
}
},
template: `
<button @click="sendMessage">Send</button>`
})

```

**4. Props和Emits**

- Props是父组件传递给子组件的数据。
- Emits是子组件发送给父组件的事件。

**5. Slots**：插槽是Vue提供的一种机制，允许组件的内容被分发到组件的模板中。

```vue
// 父组件
<template>
  <MyComponent>
    <template v-slot:default>Default Slot Content</template>
    <template v-slot:other>Other Slot Content</template>
  </MyComponent>
</template>

// 子组件
<template>
  <div>
    <slot name="default"></slot>
    <slot name="other"></slot>
  </div>
</template>

```

**6. 组件的生命周期**

Vue组件的生命周期包括创建、挂载、更新和销毁四个阶段。每个阶段都有对应的生命周期钩子，可以在这个阶段执行特定的操作。

```vue
defineComponent({
created() {
// 组件创建完成后调用
},
mounted() {
// 组件挂载到DOM后调用
},
updated() {
// 组件更新后调用
},
destroyed() {
// 组件销毁后调用
}
})

```

**7. 组件的样式**

Vue组件的样式可以通过几种方式来定义：

- 在组件的`<style>`标签中定义样式。
- 使用`scoped`属性来限制样式的作用域，使其只应用于当前组件。
- 通过外部CSS文件引入样式。

```vue

<style scoped>
  .my-class {
    color: red;
  }
</style>

```

## Vue 3 模板语法

**1. 插值表达式 (Interpolation)**

在Vue 3中，使用`{{ }}`包围的表达式会进行数据绑定。例如：

```
<p>Message: {{ message }}</p>

```

当`message`的值改变时，页面会自动更新显示。

**2. 指令基础**

Vue的指令是HTML元素上可以附加的行为。常见的指令有`v-bind`,`v-model`, 和`v-on`。

AD：[漫画首页](https://comic.cmdragon.cn:2087/)

- `v-bind`：用于数据绑定，等同于`v-bind:attr="expression"`，如`v-bind:class="{ active: isActive }"`.
- `v-model`：用于双向数据绑定，主要用于表单输入，如`<input v-model="username">`.
- `v-on`：用于监听事件，如`<button v-on:click="doSomething">Click me</button>`.

**3. v-bind, v-model, v-on**

- `v-bind`：`v-bind:key`用于绑定列表元素的唯一标识，`v-bind:class`用于动态绑定CSS类。
- `v-model`：用于数据双向绑定，`v-model:value`绑定数据，`v-model:expression`用于计算属性。
- `v-on`：`v-on:click`用于绑定点击事件，`v-on:input`用于监听输入事件。

**4. v-for**

`v-for`指令用于渲染数组或对象的每个元素，如：

```vue

<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>

```

**5. v-if 与 v-show**

- `v-if`：条件渲染，当表达式为真时元素会被渲染，为假时会被移除。
- `v-show`：条件渲染，无论条件是否满足，元素都会被添加到DOM中，只是通过`display`属性的`none`或`block`来切换可见性。

**6. 计算属性与侦听器**

- **计算属性**：`data`对象中的函数，当依赖的`props`或`data`属性改变时，计算属性会自动重新计算。
- **侦听器**：`watch`对象，监听数据的变化，当数据变化时执行回调。

```vue
data() {
return {
count: 0
}
},
computed: {
formattedCount() {
return this.count.toLocaleString();
}
},
watch: {
count(newCount) {
console.log('Count has changed:', newCount);
}
}

```

**7. 条件渲染与列表渲染**

- 条件渲染：`v-if`和`v-show`用于根据条件展示或隐藏元素。
- 列表渲染：`v-for`遍历数组或对象，可以嵌套使用，方便生成动态列表。

**8. 事件处理**

- 使用`v-on`绑定事件，如`<button v-on:click="doSomething">Click</button>`。
- 可以使用`.sync`修饰符同步原生事件，如`<input v-model.sync="value">`。

**9. 表单输入绑定**

- `v-model`用于表单输入的双向绑定，如`<input type="text" v-model="username">`。
- `v-model.number`或`v-model.integer`等修饰符用于类型验证。

## 高级组件开发

**1. 动态组件**

动态组件允许你在运行时切换组件。要使用动态组件，你可以使用`const component = new VueComponent()`
创建一个组件实例，然后使用`this.$refs.someRef.component = component`来替换它。

```vue
// 定义一个动态组件
const DynamicComponent = {
template: '
<div>Dynamic Component</div>'
}

// 在组件中动态替换组件
new Vue({
el: '#app',
components: {
'dynamic-component': DynamicComponent
},
methods: {
changeComponent() {
this.$refs.dynamicComponent.component = DynamicComponent
}
}
})

```

**2. 异步组件**

异步组件是为了减少初始加载时间而设计的。你可以通过返回一个`Promise`来定义一个异步组件：

```vue
const AsyncComponent = () => ({
// 这里可以使用Promise
component: import('./MyComponent'),
loading: LoadingComponent, // 加载中的组件
error: ErrorComponent // 加载错误的组件
})

```

在组件中使用异步组件：

```vue
components: {
'async-component': AsyncComponent
}

```

**3. 递归组件**

递归组件是指那些可以调用自身的组件。为了防止无限递归，Vue提供了一个`max`属性来限制递归深度：

```vue
const RecursiveComponent = {
template: `
<div>
  {{ message }}
  <recursive-component :max="max - 1" :message="message"></recursive-component>
</div>
`,
props: {
max: {
type: Number,
default: 5
},
message: String
}
}

```

**4. 函数式组件**

函数式组件不接受`props`，也不维护任何实例状态。它们只是返回一个渲染函数：

```vue
const FunctionalComponent = () => {
// 函数式组件的逻辑
return
<div>Functional Component</div>
}

```

在组件中使用函数式组件：

```vue
components: {
'functional-component': FunctionalComponent
}

```

**5. 自定义指令**

自定义指令允许你定义自己的HTML attribute，这些指令可以应用于任何元素，并且可以绑定不同的行为。

```vue
Vue.directive('my-directive', (el, binding, vnode) => {
// 指令的逻辑
})

```

在组件中使用自定义指令：

```vue

<div v-my-directive="someValue"></div>

```

## 构建一个简单的博客应用

### 1. 环境准备

- 使用 Vue CLI 创建一个新的 Vue.js 项目。
- 安装所需的依赖，如`vue-router`用于页面路由，`vuex`用于状态管理，`axios`用于 HTTP 请求等。

### 2. 项目结构

```vue
simple-blog/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- BlogPost.vue
|   |   |-- Navigation.vue
|   |-- views/
|   |   |-- Home.vue
|   |   |-- PostList.vue
|   |-- App.vue
|   |-- main.js
|-- package.json

```

### 3. 实现逻辑

- `Navigation.vue`：实现顶部导航栏。
- `Home.vue`：实现首页布局。
- `PostList.vue`：实现博客文章列表。
- `BlogPost.vue`：实现单篇博客文章的展示。
- `main.js`：入口文件，创建 Vue 实例，配置路由等。

### 4. 示例代码

```vue
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
router,
render: h => h(App),
}).$mount('#app')

```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <Navigation/>
    <router-view/>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue'

  export default {
    components: {
      Navigation
    }
  }
</script>
```

```vue
<!-- Navigation.vue -->
<template>
  <nav>
    <!-- 导航链接 -->
  </nav>
</template>
```

```vue
<!-- PostList.vue -->
<template>
  <div>
    <h1>博客文章列表</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        posts: [] // 从后端 API 获取数据
      }
    },
    created() {
      // 调用 API 获取文章列表
    }
  }
</script>
```

```vue
<!-- BlogPost.vue -->
<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      post: Object
    }
  }
</script>
```

### 5. 运行项目

使用`npm run serve`命令启动项目，然后访问`http://localhost:8080`查看效果。

这是一个基本的博客应用，可以根据实际需求继续扩展和优化。

## 附录

### Vue 3 资源推荐

1. **官方文档**：[Vue 3 官方文档](https://v3.vuejs.org/)提供了详尽的指南和 API 参考，是学习 Vue 3 的最佳起点。
2. **Vue Mastery**：[Vue Mastery](https://www.vuemastery.com/)提供了许多免费的 Vue 3 教程视频，适合初学者和进阶开发者。
3. **Vue School**：[Vue School](https://vueschool.io/)提供了付费的 Vue 3 课程，涵盖从基础到高级的所有内容。
4. **GitHub 仓库**：[Vue 3 的 GitHub 仓库](https://github.com/vuejs/vue-next)是查看源代码和贡献代码的好地方。
5. **社区论坛**：[Vue.js 论坛](https://forum.vuejs.org/)是提问和分享经验的好地方。

### 常见问题解答

1. **如何升级到 Vue 3？**

    - 首先，确保你的项目依赖支持 Vue 3。然后，更新`package.json`中的 Vue 依赖版本到 3.x。最后，检查并更新你的代码以适应 Vue 3
      的新特性和变化。

2. **Vue 3 和 Vue 2 有什么主要区别？**

    - Vue 3 引入了 Composition API，提供了更好的逻辑复用和代码组织方式。此外，Vue 3 在性能上有所提升，包括更快的虚拟 DOM
      和更小的包体积。

3. **如何在 Vue 3 中使用 Vuex？**

    - Vuex 4 是专为 Vue 3 设计的版本。你可以通过安装`vuex@next`来使用 Vuex 4，并在你的 Vue 3 项目中配置和使用它。

4. **Vue 3 支持 TypeScript 吗？**

    - 是的，Vue 3 对 TypeScript 提供了更好的支持。你可以使用 TypeScript 来编写 Vue 3 组件，并利用 Vue 3 的类型声明来提高开发效率。

5. **如何处理 Vue 3 中的响应式数据？**

    - Vue 3 使用`ref`和`reactive`函数来创建响应式数据。`ref`用于创建单个响应式数据，而`reactive`用于创建响应式对象。

6. **Vue 3 中的 Teleport 是什么？**

    - Teleport 是 Vue 3 中的一个新特性，允许你将组件的内容渲染到 DOM 树的另一个位置，这在创建模态框或弹出菜单时非常有用。

7. **Vue 3 中的 Fragment 是什么？**

    - 在 Vue 3 中，组件可以返回多个根节点，这被称为 Fragments。这允许你编写更简洁的模板，而不需要额外的包装元素。

8. **如何调试 Vue 3 应用程序？**

    - 你可以使用浏览器的开发者工具来调试 Vue 3 应用程序。Vue 3 支持 Vue 2 的开发者工具扩展，你可以通过它来检查组件状态和追踪事件。

## 免费好用的热门在线工具

- [CMDragon 在线工具 - 高级AI工具箱与开发者套件 | 免费好用的在线工具](https://tools.cmdragon.cn/zh)
- [应用商店 - 发现1000+提升效率与开发的AI工具和实用程序 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps?category=trending)
- [CMDragon 更新日志 - 最新更新、功能与改进 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/changelog)
- [支持我们 - 成为赞助者 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/sponsor)
- [AI文本生成图像 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-to-image-ai)
- [临时邮箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/temp-email)
- [二维码解析器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/qrcode-parser)
- [文本转思维导图 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-to-mindmap)
- [正则表达式可视化工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/regex-visualizer)
- [文件隐写工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/steganography-tool)
- [IPTV 频道探索器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/iptv-explorer)
- [快传 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/snapdrop)
- [随机抽奖工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/lucky-draw)
- [动漫场景查找器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/anime-scene-finder)
- [时间工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/time-toolkit)
- [网速测试 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/speed-test)
- [AI 智能抠图工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/background-remover)
- [背景替换工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/background-replacer)
- [艺术二维码生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/artistic-qrcode)
- [Open Graph 元标签生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/open-graph-generator)
- [图像对比工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-comparison)
- [图片压缩专业版 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-compressor)
- [密码生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/password-generator)
- [SVG优化器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/svg-optimizer)
- [调色板生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/color-palette)
- [在线节拍器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/online-metronome)
- [IP归属地查询 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-geolocation)
- [CSS网格布局生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/css-grid-layout)
- [邮箱验证工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/email-validator)
- [书法练习字帖 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/calligraphy-practice)
- [金融计算器套件 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/finance-calculator-suite)
- [中国亲戚关系计算器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/chinese-kinship-calculator)
- [Protocol Buffer 工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/protobuf-toolkit)
- [图片无损放大 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-upscaler)
- [文本比较工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-compare)
- [IP批量查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-batch-lookup)
- [域名查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/domain-finder)
- [DNS工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/dns-toolkit)
- [网站图标生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/favicon-generator)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
