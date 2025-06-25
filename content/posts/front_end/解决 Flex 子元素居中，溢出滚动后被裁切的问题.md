---
url: /posts/7f84053f9e5c1150830ea768d0f48d7e/
title: 解决 Flex 子元素居中，溢出滚动后被裁切的问题
date: 2024-04-19T20:42:55+08:00
lastmod: 2024-04-19T20:42:55+08:00
categories:
  - 前端开发
tags:
  - 开发记录
---


<img src="https://static.cmdragon.cn/blog/images/image-20240419204802719.png@blog" title="image-20240419204802719.png" alt="image-20240419204802719.png"/>


当面临元素横向滚动时子元素被裁切的问题，同时要求子元素保持居中显示，可通过以下优化措施进行解决：

1. 启用水平滚动：

在容器元素的 CSS 中应用 overflow-x: auto; 属性，以允许内容在水平方向溢出时自动显示滚动条。

```css
   .container {
    overflow-x: auto;
}

```

1. 检查与调整容器宽度： 子元素被裁切可能是由于容器宽度未明确设定或设定过小。确保为容器设定一个合适的宽度，
如占据其父元素的全部宽度，以适应不同屏幕尺寸：

```css
   .container {
    width: 100%;
}

```