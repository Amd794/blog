---
title: 在前端开发项目中整合配置 Prettier 和 ESLint
date: 2024/2/4 1:55:24
updated: 2024/2/4 1:55:24
categories:
  - 前端开发
tags:
  - TypeScript
  - Prettier
  - ESLint
  - 代码格式化
  - 代码风格检查
  - npm 配置
  - linting
  - 项目设置
  - JavaScript 工具
  - 开发者工具
---


引言：
在前端开发中，代码的格式化和规范是非常重要的。Prettier和ESLint是两个常用的工具，可以帮助我们自动格式化代码和检查代码规范。本文将介绍如何在前端开发项目中整合和配置Prettier和ESLint，以提高代码质量和开发效率。

在项目中整合配置 Prettier 和 ESLint 是一种常见的前端开发实践，旨在确保代码风格一致性和遵循编码规范。以下是一个简化的步骤教程，适用于一个基于
Node.js、npm 及其支持 JavaScript 或 TypeScript 的前端项目：

## 1. 初始化项目与安装依赖

首先，确保你已在项目根目录下初始化 package.json 文件：

```Bash
npm init -y 
```

接下来，安装 ESLint、Prettier 及相关插件：

```Bash
# 安装 ESLint 和基础插件
npm install --save-dev eslint

# 安装 Prettier
npm install --save-dev prettier

# 安装用于集成 Prettier 到 ESLint 的插件
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

```

## 2. 配置 ESLint

创建 .eslintrc.js 或 .eslintrc.json 文件以配置 ESLint：

```json5
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    // 如果你的项目使用 TypeScript，请添加如下内容：
    // "parser": "@typescript-eslint/parser",
    // "plugins": ["@typescript-eslint"],
    // "extends": ["plugin:@typescript-eslint/recommended"],

    // 添加自定义规则或覆盖默认规则
  }
}

```

如果你的项目使用 TypeScript，记得添加对应的 TypeScript 支持。

## 3. 配置 Prettier

创建 .prettierrc.json 文件来配置 Prettier：

```json5
// .prettierrc.json
{
  "semi": true,
  // 使用分号结尾
  "tabWidth": 2,
  // 使用2个空格缩进
  "singleQuote": true,
  // 使用单引号
  "printWidth": 80,
  // 每行最大字符数
  "trailingComma": "all"
  // 在对象和数组末尾添加逗号
  // 其他 Prettier 配置项...
}
```

## 4. 添加 npm 脚本

在 package.json 中添加脚本来自动格式化和检查代码：

```json5
"scripts": {
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
  "lint": "eslint .",
  "lint-fix": "eslint --fix ."
},

```

- "format" 脚本会使用 Prettier 格式化所有支持的文件。
- "lint" 脚本运行 ESLint 进行代码检查。
- "lint-fix" 脚本尝试自动修复可自动修复的 ESLint 错误。

## 5. 使用 IDE/编辑器插件

为了在编写代码时实时应用 Prettier 和 ESLint 的规则，你需要在你的 IDE 或文本编辑器中安装相应的插件。例如，在 VSCode 中可以安装
ESLint 和 Prettier - Code formatter 插件。

现在，你已经在项目中成功整合了 Prettier 和 ESLint。每次提交代码前，执行 `npm run lint` 和 `npm run format` 来确保代码符合规范和风格要求。如果项目是
TypeScript 项目，别忘了在 ESLint 配置中启用 TypeScript 相关插件和规则

## 6. 总结：
通过整合和配置Prettier和ESLint，我们可以在前端开发项目中自动格式化代码和检查代码规范。这有助于提高代码质量、统一团队的代码风格，并提高开发效率。通过本文的教程，你可以轻松地在你的项目中使用Prettier和ESLint，并根据个人需求进行定制。记住，在提交代码之前运行`npm run lint`
和`npm run format`命令来确保代码的质量和规范性。
