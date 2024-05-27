---
title: Vue 3入门指南
date: 2024/5/23 19:37:34
updated: 2024/5/23 19:37:34
categories:
  - 前端开发

tags:
  - 框架对比
  - 环境搭建
  - 基础语法
  - 组件开发
  - 响应式系统
  - 状态管理
  - 路由配置
---

<img src="https://static.amd794.com/blog/images/2024_05_23 19_46_00.png@blog" title="2024_05_23 19_46_00.png" alt="2024_05_23 19_46_00.png"/>

## **第1章：Vue 3简介**

### **1.1 Vue.js的历史与发展**

Vue.js由前谷歌工程师尤雨溪（Evan
You）在2014年发布。它的设计目标是提供一个轻量级、渐进式的JavaScript框架，用于构建用户界面。Vue的核心库专注于视图层，易于上手，同时也便于与第三方库或既有项目整合。随着时间的推移，Vue.js因其简洁的API、灵活的组件系统和高效的性能而受到开发者的广泛欢迎。

### **1.2 Vue 3的新特性**

Vue 3在2020年发布，带来了许多重要的更新和改进：

- **Composition API**：提供了一种更灵活的方式来组织和重用组件逻辑，特别是在处理复杂组件时。
- **性能提升**：通过优化虚拟DOM的算法和编译时的优化，Vue 3在渲染大型应用时更加高效。
- **更好的TypeScript支持**：Vue 3的内部架构完全使用TypeScript重写，提供了更好的类型推断和集成。
- **Fragments**：允许组件返回多个根节点，而不需要额外的包装元素。
- **Teleport（传送门）** ：允许将组件的内容渲染到DOM中的不同位置。
- **Suspense**：一种新的内置组件，用于处理异步组件的加载状态。
- **响应式系统的重构**：使用Proxy替代了Object.defineProperty，提高了响应式系统的性能和功能。

### **1.3 Vue 3与其他框架的比较**

Vue 3与其他流行的前端框架（如React和Angular）相比，有其独特的优势和差异：

- **React**：React是一个由Facebook开发的库，以其高效的虚拟DOM算法和组件化开发模式而闻名。Vue
  3提供了更简单的API和更直观的模板语法，而React则依赖于JSX。Vue 3的Composition API在某些方面类似于React的Hooks，但提供了更多的灵活性和控制。
- **Angular**：Angular是一个由Google开发的全功能框架，提供了大量的内置功能，如依赖注入、表单处理和路由。Vue
  3相比之下更加轻量级，易于上手，但仍然提供了足够的工具和库来构建复杂的应用。Angular的学习曲线较陡峭，而Vue 3则更加平滑。

每个框架都有其适用的场景和优势，选择哪个框架通常取决于项目需求、团队熟悉度和个人偏好。Vue 3因其平衡的性能、灵活性和易用性，成为了许多开发者的首选。

## **第2章：环境搭建与项目初始化**

### **2.1 安装Node.js和npm**

Node.js是一个开源的JavaScript运行环境，它允许在服务器端运行JavaScript代码。npm（Node Package
Manager）是随Node.js一同发布的包管理器，用于安装和管理JavaScript项目的依赖。如果你尚未安装，可以访问官方网站（[https://nodejs.org/）下载适合你操作系统的安装包。安装完成后，可以通过命令行验证Node.js和npm是否已安装：](https://nodejs.org/%EF%BC%89%E4%B8%8B%E8%BD%BD%E9%80%82%E5%90%88%E4%BD%A0%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%AE%89%E8%A3%85%E5%8C%85%E3%80%82%E5%AE%89%E8%A3%85%E5%AE%8C%E6%88%90%E5%90%8E%EF%BC%8C%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87%E5%91%BD%E4%BB%A4%E8%A1%8C%E9%AA%8C%E8%AF%81Node.js%E5%92%8Cnpm%E6%98%AF%E5%90%A6%E5%B7%B2%E5%AE%89%E8%A3%85%EF%BC%9A)

```shell
node -v  # 显示Node.js版本
npm -v  # 显示npm版本

```

### **2.2 安装Vue CLI**

Vue CLI（Vue Create App）是Vue.js官方推荐的项目初始化工具，它能快速创建并配置Vue 3项目。在终端或命令提示符中，运行以下命令安装Vue
CLI全球：

```shell
npm install -g @vue/cli

```

或者使用yarn：

```shell
yarn global add @vue/cli

```

安装完成后，可以使用`vue create`命令创建新项目。

### **2.3 创建Vue 3项目**

创建新项目时，可以使用以下命令，其中`my-project`是你的项目名：

```shell
vue create my-project

```

它会询问你选择哪些特性，如是否包含路由、Vuex和测试等。选择完成后，Vue CLI会自动下载并配置项目。

### **2.4 项目结构概览**

Vue CLI生成的项目结构通常包含以下主要部分：

- `src/`：源代码目录，包含应用的核心逻辑和组件。

    - `main.js`：入口文件，启动应用。
    - `components/`：存放应用的组件。
    - `views/`（或`pages/`）：存放应用的主要视图或页面。
    - `router/`：存放应用的路由配置。

- `public/`：静态资源目录，如HTML、CSS和JavaScript文件。

- `package.json`：项目依赖和配置信息。

- `.env`（或`.env.production`）：环境变量配置文件。

- `vue.config.js`：自定义配置文件，用于调整构建设置。

在开发过程中，你可以根据需要添加、修改或删除这个结构中的文件和目录。Vue CLI会根据这些结构生成构建过程，确保项目的可维护性和扩展性。

## **第3章：Vue 3基础**

### **3.1 Vue实例与生命周期**

在Vue中，每个应用都是通过创建Vue实例来启动的。Vue实例是Vue应用的根组件，它包含了数据、模板、挂载元素、方法、生命周期钩子等选项。生命周期钩子是Vue实例在创建、更新和销毁过程中自动调用的函数，允许你在特定阶段执行自定义逻辑。

例如，`created`钩子在实例被创建后立即调用，而`mounted`钩子在实例挂载到DOM后调用。

```javascript
new Vue({
    data: {
        message: 'Hello Vue!'
    },
    created() {
        console.log('实例创建完成');
    },
    mounted() {
        console.log('实例已挂载到DOM');
    }
});

```

### **3.2 模板语法**

Vue使用基于HTML的模板语法，允许开发者声明式地将DOM绑定到底层Vue实例的数据。Vue模板是语法层面的纯粹HTML，会被Vue解析器解析为渲染函数，生成虚拟DOM并最终渲染成真实DOM。

```vue

<div id="app">
  {{ message }}
</div>

```

### **3.3 数据绑定与响应式原理**

Vue的核心特性之一是响应式数据绑定。当实例的数据发生变化时，视图会自动更新。这是通过使用ES5的`Object.defineProperty`
方法将数据属性转换为getter/setter来实现的。

```javascript
new Vue({
    data: {
        message: 'Hello Vue!'
    }
});

```

### **3.4 计算属性与侦听器**

计算属性是基于它们的依赖进行缓存的，只有在相关依赖发生改变时才会重新求值。这使得计算属性在处理复杂逻辑时比普通方法更高效。

```javascript
new Vue({
    data: {
        firstName: 'Foo',
        lastName: 'Bar'
    },
    computed: {
        fullName() {
            return this.firstName + ' ' + this.lastName;
        }
    }
});

```

侦听器（`watch`）用于观察和响应Vue实例上的数据变动。当你有一些数据需要随着其他数据变动而变动时，使用侦听器非常合适。

```javascript
new Vue({
    data: {
        message: 'Hello Vue!'
    },
    watch: {
        message(newVal, oldVal) {
            console.log('Message changed:', newVal, oldVal);
        }
    }
});

```

### **3.5 条件渲染与列表渲染**

Vue提供了`v-if`、`v-else`和`v-show`指令来控制元素的显示与隐藏。`v-if`在条件变化时会完全移除或插入元素，而`v-show`
只是简单地切换元素的CSS属性`display`。

```vue

<div v-if="seen">现在你看到我了</div>
<div v-show="seen">现在你看到我了</div>

```

列表渲染通过`v-for`指令实现，它可以遍历数组、对象甚至整数。

```vue

<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
</ul>

```

### **3.6 事件处理**

Vue使用`v-on`指令（简写为`@`）来监听DOM事件，并在触发时执行一些JavaScript代码。

```vue

<button v-on:click="counter += 1">增加 1</button>

```

### **3.7 表单输入绑定**

Vue提供了`v-model`指令，用于在表单控件（如`<input>`、`<textarea>`和`<select>`）和Vue实例的数据之间创建双向数据绑定。

```vue
<input v-model="message" placeholder="编辑我">
<p>Message is: {{ message }}</p>

```

这些基础知识是理解和使用Vue 3进行开发的关键。通过这些概念和工具，你可以开始构建功能丰富的Vue应用。

## **第4章：组件化开发**

### **4.1 组件基础**

在Vue中，组件是可复用的Vue实例。组件可以拥有自己的数据、方法、生命周期钩子等，并且可以被其他组件包含或嵌套。组件通过`<component>`
标签或在模板中直接使用组件的标签来使用。

```vue

<my-component></my-component>

```

在Vue 3中，组件的定义使用`defineComponent`函数，这提供了一种类型安全的定义方式。

```vue
const MyComponent = defineComponent({
data() {
return {
message: 'Hello'
};
},
template: '
<div>{{ message }}</div>'
});

```

### **4.2 组件通信**

Vue组件之间的通信有多种方式，包括父子组件通过`props`和事件通信，以及祖先与后代组件间的通信通过`provide / inject`或事件总线。

父子组件通过`props`传递数据，子组件可以通过事件向父组件发送消息。

```vue

<child-component :parent-message="message" @child-event="handleChildEvent"></child-component>

```

### **4.3 插槽（Slots）**

插槽允许开发者向组件的模板中插入内容。插槽的内容会被插入到组件的`<slot>`标签中。

```vue

<template>
  <div>
    <slot></slot>
  </div>
</template>

```

使用插槽时，你可以为插槽提供默认内容，如果组件的使用者没有提供内容，则默认内容会显示。

```vue

<template>
  <div>
    <slot>默认内容</slot>
  </div>
</template>

```

### **4.4 动态组件与异步组件**

动态组件允许你在运行时根据条件切换组件。通过`<component>`标签的`is`属性，你可以指定当前要显示的组件。

```vue

<component :is="currentComponent"></component>

```

异步组件则是先加载组件的定义，而不是立即渲染。这在加载较大或者可能不存在的组件时非常有用。

```javascript
const AsyncComponent = defineAsyncComponent(() =>
    import('./MyComponent.vue')
);
```

## **第5章：Vue 3的响应式系统与Composition API**

### **5.1 响应式基础**

Vue 3的响应式系统是基于数据劫持和依赖收集机制。当数据发生变化时，Vue会自动更新视图。这主要依赖于`reactive`和`ref`。

### **5.2 Composition API简介**

Composition API是Vue 3引入的新的编程模型，它通过函数式编程的方式，将组件的逻辑分解为一系列函数，如`setup`、`onMounted`
等，而不是传统的`created`、`mounted`这样的生命周期钩子。这使得代码更易于理解和测试。

### **5.3 使用ref和reactive创建响应式数据**

- `ref`：用于创建响应式的变量，它返回一个对象，包含当前值和`value`属性，可以用来直接修改值。

```javascript
const count = ref(0);
count.value = 10; // 监听count的变化

```

- `reactive`：用于创建响应式对象，对象的所有属性都会被追踪。

```javascript
const obj = reactive({count: 0});
obj.count = 10; // 监听obj.count的变化

```

### **5.4 使用computed和watch**

- `computed`：用于创建计算属性，它会根据依赖的值自动计算并返回结果，且只在依赖值改变时重新计算。

```javascript
const doubleCount = computed(() => obj.count * 2);

```

- `watch`：用于监听数据变化，可以执行特定的函数，但它不会自动响应数据的改变。

```javascript
watch(obj.count, (newCount) => {
    console.log('Count changed:', newCount);
});

```

### **5.5 生命周期钩子与Composition API**

在Composition API中，生命周期钩子被替换为更灵活的函数，如`setup`、`onMounted`、`onUnmounted`等。这些函数在组件实例创建、挂载、卸载时执行。

```javascript
setup()
{
    const count = ref(0);
    onMounted(() => {
        // 在组件挂载后执行
    });
}

```

### **5.6 自定义Hooks**

虽然Vue官方推荐使用Composition API，但你也可以自定义类似Hook的函数来组织代码，但这些不是官方提供的API，而是开发者实践中的常见做法。

```javascript
function useCount(initialValue) {
    const count = ref(initialValue);
    // ...
    return {count};
}

```

在使用时：

```javascript
const {count} = useCount(0);

```

这有助于将组件逻辑分解为更小、更可复用的部分。

## **第6章：高级特性**

### **6.1 渲染函数与JSX**

渲染函数是一种用于渲染Vue组件的替代方法，它允许你在JavaScript函数中直接定义组件的渲染输出。JSX是一种在JavaScript中编写HTML的语法，可以更方便地编写渲染函数。

### **6.2 自定义指令**

自定义指令是Vue中定义的一种底层的扩展机制，可以用来在组件中对普通DOM元素进行低级别操作。

### **6.3 过渡与动画**

Vue提供了一系列内置的过渡和动画效果，包括`transition`、`transition-group`等。可以使用CSS或JavaScript来实现过渡和动画效果。

### **6.4 混入（Mixins）**

混入是一种在组件之间复用代码的方式，它允许在多个组件中重用一组相同的选项。混入可以包含数据、方法、生命周期钩子等，但需要注意有时候可能会导致数据冲突。

### **6.5 插件开发**

插件是一种Vue的扩展机制，它可以在Vue的构造函数上添加全局方法、指令、过滤器等。开发插件需要遵循一定的规范，如提供一个安装函数，并在安装时调用Vue实例的`use`
方法。

```javascript
const MyPlugin = {
    install(Vue) {
        Vue.directive('my-directive', {
            bind(el, binding, vnode) {
                // ...
            }
        });
    }
};

Vue.use(MyPlugin);
```

## **第7章：状态管理与Vuex**

### **7.1 Vuex简介**

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### **7.2 安装与配置Vuex**

要使用Vuex，首先需要通过npm或yarn安装Vuex库。安装完成后，在Vue项目中创建一个Vuex实例，并将其作为插件安装到Vue应用中。

```shell
npm install vuex --save

```

```javascript
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    // 状态、getters、mutations和actions配置
});

new Vue({
    el: '#app',
    store,
    // ...
});

```

### **7.3 State、Getters、Mutations和Actions**

- **State**：存储应用状态的对象。
- **Getters**：从state中派生出一些状态，类似于计算属性。
- **Mutations**：更改state中状态的唯一方法，必须是同步函数。
- **Actions**：类似于mutations，但可以包含任意异步操作，并通过提交mutations来改变状态。

```javascript
const store = new Vuex.Store({
    state: {
        count: 0
    },
    getters: {
        doubleCount(state) {
            return state.count * 2;
        }
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    },
    actions: {
        incrementAsync({commit}) {
            setTimeout(() => {
                commit('increment');
            }, 1000);
        }
    }
});

```

### **7.4 Modules**

当应用变得复杂时，可以将store分割成模块（modules）。每个模块拥有自己的state、getters、mutations和actions。

```javascript
const moduleA = {
    state: {...},
    getters: {...},
    mutations: {...},
    actions: {...}
};

const store = new Vuex.Store({
    modules: {
        a: moduleA
    }
});

```

### **7.5 Vuex与Composition API**

Vuex与Vue 3的Composition API可以很好地结合使用。使用`setup`函数时，可以通过`useStore`函数来访问Vuex store。

```javascript
import {useStore} from 'vuex';

export default {
    setup() {
        const store = useStore();
        // 使用store
    }
};

```

Vuex提供了一种集中式存储管理应用状态的方式，使得状态的变化可以被追踪，并且可以方便地在组件之间共享状态。通过合理地使用Vuex，可以提高应用的可维护性和可扩展性。

## **第8章：Vue Router**

### **8.1 Vue Router简介**

Vue Router是Vue.js官方的路由管理器。它与Vue.js的核心深度集成，让构建单页面应用变得易如反掌。

### **8.2 安装与配置Vue Router**

要使用Vue Router，首先需要通过npm或yarn安装Vue Router库。安装完成后，在Vue项目中创建一个路由器实例，并将其安装到Vue应用中。

```shell
npm install vue-router --save

```

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    // 路由配置
});

new Vue({
    el: '#app',
    router,
    // ...
});

```

### **8.3 路由配置**

在路由器实例中，可以配置多个路由，每个路由都对应一个组件。

```javascript
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'About',
            component: AboutView
        }
    ]
});

```

### **8.4 导航守卫**

导航守卫主要用于过滤不符合条件的导航，或者在导航前后执行一些操作。

- **全局前置守卫**：在路由导航发生之前调用，可以通过`beforeEach`函数进行配置。

```javascript
const router = new VueRouter({
    // ...
});

router.beforeEach((to, from, next) => {
    // ...
});

```

- **路由独享守卫**：在路由配置中，通过`beforeEnter`函数进行配置。

```javascript
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView,
            beforeEnter: (to, from, next) => {
                // ...
            }
        }
    ]
});

```

- **组件内守卫**：在组件内，通过`beforeRouteEnter`、`beforeRouteUpdate`和`beforeRouteLeave`函数进行配置。

```javascript
export default {
    beforeRouteEnter(to, from, next) {
        // ...
    },
    beforeRouteUpdate(to, from, next) {
        // ...
    },
    beforeRouteLeave(to, from, next) {
        // ...
    }
};

```

### **8.5 路由懒加载**

在路由配置中，可以使用动态导入（import）语法，将组件按需加载，以实现路由懒加载。

```javascript
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue')
        }
    ]
});

```

路由器提供了一种强大的方式，用于管理应用的导航和状态。通过合理地使用Vue Router，可以提高应用的性能和可维护性。

## **第9章：构建与部署**

### **9.1 使用Vue CLI进行构建**

Vue CLI是Vue.js的官方构建工具，提供了一系列的工具和功能，用于构建生产环境的Vue应用。

要使用Vue CLI构建生产环境的Vue应用，需要执行以下步骤：

1. 在应用的根目录下，运行`npm run build`命令。
2. 构建后的文件将位于`dist`目录下。
3. 将`dist`目录中的文件部署到服务器上。

### **9.2 分析与优化生产构建**

在构建生产环境的Vue应用时，可以使用Vue CLI提供的分析报告，来分析应用的构建情况。

1. 在应用的根目录下，运行`npm run build --report`命令。
2. 在`dist`目录下会生成一个`report.html`文件，该文件包含了应用的构建报告。
3. 根据报告中的信息，可以对构建进行优化。

### **9.3 部署Vue应用**

在构建完成后，可以将`dist`目录中的文件部署到服务器上。部署方式取决于服务器的类型和配置，常见的部署方式包括：

- **静态服务器**：将`dist`目录中的文件直接放到静态服务器上，例如Nginx或Apache。
- **Node.js服务器**：将`dist`目录中的文件放到Node.js服务器上，并使用`express.static`中间件进行服务。

```javaScript
const express = require('express');
const app = express();

app.use(express.static('dist'));

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

```

- **云服务器**：将`dist`目录中的文件放到云服务器上，例如AWS S3、Azure Blob Storage或Google Cloud Storage。

在部署Vue应用时，需要注意以下问题：

- **URL路径**：确保服务器的URL路径与应用的构建路径一致，以避免资源加载失败。
- **SSL证书**：确保服务器使用正确的SSL证书，以确保应用的安全性。
- **CDN加速**：使用CDN加速，可以提高应用的加载速度。