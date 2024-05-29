---
title: nuxt开发
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



## 创建Nuxt.js项目

### 步骤 1: 安装 Node.js 和 NPM

确保你的计算机上安装了 Node.js 和 NPM。你可以从 [Node.js 官网](https://nodejs.org/) 下载并安装。

### 步骤 2: 创建 Nuxt.js 项目

打开命令行工具，运行以下命令来创建一个新的 Nuxt.js 项目：

```bash
npx create-nuxt-app my-nuxt-project
```

在这个过程中，你可以选择服务器框架、UI框架等。按照提示完成项目的基本配置。

### 步骤 3: 安装 Twind

进入你的 Nuxt.js 项目目录：

```bash
cd my-nuxt-project
npm i
```

安装 Twind 和相关依赖：

```bash
npx nuxi module add @nuxtjs/tailwindcss
npx tailwindcss init
```

> npm 更偏向于包的长期管理和依赖控制，而 npx 则专注于简化包的临时使用和执行，特别是在需要快速运行或测试一个包的命令行工具时更为方便。

### 步骤 4：安装 ESLint 和 Prettier

#### 1. 安装 ESLint 和 Prettier 以及它们的相关插件：

```bash
npm install --save-dev eslint eslint-plugin-nuxt prettier eslint-plugin-prettier eslint-config-prettier @nuxtjs/eslint-config-typescript
   
```

#### 2. 配置 ESLint

在项目根目录下创建 `.eslintrc.js` 文件，并添加以下内容：

```js
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    rules: {
        // 在这里添加自定义的 ESLint 规则
        semi: 0
    },
}

```

#### 3.  配置 Prettier

在项目根目录下创建 `.prettierrc.js` 文件，并添加以下内容：

```js
module.exports = {
    semi: false,
    tabWidth: 2,
    useTabs: false,
    /*打印宽度，超过后，会将属性换行*/
    printWidth: 120,
    /*禁止使用尾随逗号,对象和数组最后一个逗号去掉*/
    trailingComma: "none",
    /*在对象字面量中的括号之间添加空格*/
    bracketSpacing: true,
    /*使用单引号而不是双引号来定义字符串*/
    singleQuote: true,
    /*当箭头函数只有一个参数时，省略参数前后的括号*/
    arrowParens: "avoid",
    /*script和style标签中间的内容缩进*/
    vueIndentScriptAndStyle: true,
    // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素
    bracketSameLine: false
}
   
```

#### 4. 创建格式化脚本

在 `package.json` 中添加脚本命令：

```bash
"lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
"format": "prettier --write \\"**/*.{js,jsx,ts,tsx,json,css,scss,vue}\\""
```

