---
url: /posts/b13be226577ac97d43beb8bcac9a5527/
title: 占位图片（Placeholder Image）
date: 2024-01-30T18:50:00+08:00
lastmod: 2024-01-30T18:50:00+08:00
tags:
- 占位图片
- 实现原理
- CSS应用
- JavaScript处理
- 图片上传
- 懒加载优化
- 用户体验
---

<img src="/images/2024_02_03 17_58_43.png" title="2024_02_03 17_58_43.png" alt="2024_02_03 17_58_43.png"/>

## 一、引言

在网页设计和开发中，占位图片（Placeholder Image）是一种常见的技术手段，用于在用户上传图片之前或者图片加载失败时，展示一个临时替代的图片，以提高用户体验。本文将详细介绍占位图片的实现原理和实践应用，并通过实例给出不同场景下的解决方案。

[占位图片生成器 | 一个覆盖广泛主题工具的高效在线平台(cmdragon.cn)](https://cmdragon.cn/placeholder)

https://cmdragon.cn/placeholder

## 二、占位图片实现原理

### 1. CSS实现

通过CSS的`::before`或`::after`伪元素，可以在元素内部插入占位图片。以下是一个简单的示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>占位图片实现</title>
    <style>
        .placeholder {
            width: 200px;
            height: 200px;
            background-image: url('https://cmdragon.cn/upload/images/cmder/200_X_200_L8fk0kE.png');
            background-size: cover;
            background-position: center;
        }

        .placeholder::before {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            background-image: url('https://cmdragon.cn/upload/images/cmder/200_X_200_L8fk0kE.png');
            background-size: cover;
            background-position: center;
        }
    </style>
</head>
<body>
    <div class="placeholder"></div>
</body>
</html>
```

### 2. JavaScript实现

通过JavaScript，可以在图片加载失败时，切换到占位图片。以下是一个简单的示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>占位图片实现</title>
</head>
<body>
    <img id="main-img" src="https://cmdragon.cn/upload/images/cmder/200_X_200_L8fk0kE.png" alt="占位图片">

    <script>
        const mainImg = document.getElementById('main-img');

        mainImg.addEventListener('error', () => {
            mainImg.onerror = null;
            mainImg.src = 'https://cmdragon.cn/upload/images/cmder/200_X_200_L8fk0kE.png';
        });

        mainImg.addEventListener('load', () => {
            mainImg.onload = null;
        });
    </script>
</body>
</html>
```

## 三、占位图片实践应用

### 1. 用户上传图片前的前置处理

在用户上传图片前，可以通过占位图片展示一个临时替代的图片，以防止用户上传空白图片或无法加载的图片。在上传成功后，再替换为实际上传的图片。

### 2. 图片懒加载

在网页中，可以通过占位图片实现图片的懒加载，提高网页加载速度。当用户滚动到图片所在区域时，再异步加载实际图片。

### 3. 图片对比展示

在图片对比的场景下，可以使用占位图片展示两个图片的差异。在对比过程中，将实际图片与占位图片进行比较，突出展示差异部分。

### 4. 图片验证

通过占位图片，可以对用户上传的图片进行验证，如大小、格式、分辨率等。若不符合要求，则展示错误提示信息。

## 四、总结

占位图片技术在网页设计和开发中具有广泛的应用，通过CSS和JavaScript可以实现占位图片的不同效果。在实际项目中，可以根据需求选择合适的实现方式，提高用户体验和网页性能。

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
