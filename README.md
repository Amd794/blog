# 我的Hugo博客

这是一个使用Hugo构建的个人博客，采用自定义设计，使用TailwindCSS进行样式设计。.

## 特点

- 简洁现代的设计
- 响应式布局，适配各种设备
- 深色模式支持
- 使用TailwindCSS实现样式
- 使用Iconify图标库

## 目录结构

```
.
├── archetypes/        # 内容模板
├── content/           # 站点内容
│   ├── posts/         # 博客文章
│   └── about.md       # 关于页面
├── data/              # 数据文件
├── layouts/           # 布局模板
│   ├── _default/      # 默认模板
│   ├── partials/      # 部分模板
│   └── ...
├── static/            # 静态文件
├── hugo.toml          # Hugo配置文件
└── README.md          # 本文件
```

## 本地运行

确保已安装[Hugo](https://gohugo.io/getting-started/installing/)，然后执行以下命令：

```bash
# 开发服务器
hugo server -D

# 构建站点
hugo
```

访问 http://localhost:1313/ 查看站点。

## 添加内容

### 创建新文章

```bash
hugo new content/posts/my-new-post.md
```

### 文章前置元数据示例

```yaml
---
title: "文章标题"
date: 2023-10-01T10:00:00+08:00
categories: ["分类"]
tags: ["标签1", "标签2"]
---
```

## 自定义

### 修改配置

编辑 `hugo.toml` 文件以更改站点配置。

### 修改样式

本站点使用CDN加载TailwindCSS。如需自定义样式，可以编辑 `layouts/_default/baseof.html` 中的TailwindCSS配置。

## 部署

构建站点后，`public` 目录中的内容可以部署到任何静态网站托管服务，如GitHub Pages、Netlify、Vercel等。

