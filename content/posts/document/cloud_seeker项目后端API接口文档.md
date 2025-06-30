---
url: /posts/89b2883807603e48b78af200c2c42c9c/
title: cloud_seeker项目后端API接口文档
date: 2024-06-01T4:29:40+08:00
lastmod: 2024-06-01T4:29:40+08:00
tags:
  - API接口
  - 文档
---

## 搜索

为搜索保留的查询参数名称为 `search`，搜索范围为`disk_name` 和 `files`字段，多个搜索词时用`OR`连接查询结果。

### 搜索所有

同时查询 `disk_name` 或者 `files`中包含查询关键词的所有数据

```
http://localhost:8000/api/v1/cloud/resource/?search=周星驰
```

### 在特定字段上搜索单个术语

```
http://localhost:8000/api/v1/cloud/resource/?search=disk_name:周星驰
```

### 搜索多个术语

```
http://localhost:8000/api/v1/cloud/resource/?search=周星驰&search=刘德华
```

### 在特定字段中搜索多个术语

```
http://localhost:8000/api/v1/cloud/resource/?search=disk_name:周星驰&search=files:唐伯虎
```

## 过滤

允许过滤的字段`disk_type`、`doc_id`、`shared_time`、`disk_name`

### 查找包含指定字段中指定的确切术语的文档。

```
http://localhost:8000/api/v1/cloud/resource/?disk_type=xunlei  # 注意必须小写，aly、xunlei、baidu和quark

# 过滤多个值
http://localhost:8000/api/v1/cloud/resource/?doc_id=6198506b-165c-482d-aa08-3e6eaa93d6d9&doc_id=a7d76f60-31a4-4821-9c25-812128ec34e4

# 过滤搜索结果
http://localhost:8000/api/v1/cloud/resource/?search=6&disk_type=xunlei
```

### 查找指定字段包含值（日期、数字或 strings） 在指定的范围内。

```
http://localhost:8000/api/v1/cloud/resource/?shared_time__range=2024-04-01__2024-04-15

# 大于
http://localhost:8000/api/v1/cloud/resource/?shared_time__gt=2024-04-01

# 大于等于
http://localhost:8000/api/v1/cloud/resource/?shared_time__gte=2024-04-01

# 小于
http://localhost:8000/api/v1/cloud/resource/?shared_time__lt=2024-04-01

#小于等于
http://localhost:8000/api/v1/cloud/resource/?shared_time__lte=2024-04-01
```

### 查找指定字段以 指定范围的值。

```
# 前缀
http://localhost:8000/api/v1/cloud/resource/?doc_id__prefix=ac

# 包含
http://localhost:8000/api/v1/cloud/resource/?doc_id__contains=ac

# 排除
http://localhost:8000/api/v1/cloud/resource/?doc_id__exclude=ac

# 通配符，其中模式支持单字符通配符 （？） 和 多字符通配符 （*）
http://localhost:8000/api/v1/cloud/resource/?disk_name__wildcard=*唐伯虎点秋香*

# in
http://localhost:8000/api/v1/cloud/resource/?disk_type__in=xunlei__aly
```

## 排序

提供可排序字段`shared_time`

### 降序

```
http://localhost:8000/api/v1/cloud/resource/?search=周星驰&ordering=-shared_time
```

### 升序

```
http://localhost:8000/api/v1/cloud/resource/?search=周星驰&ordering=shared_time
```

## 分页

默认返回 8 条数据，最大一次性返回24条数据

```
http://localhost:8000/api/v1/cloud/resource/?search=周星驰&ordering=-shared_time&page=1&page_size=2
```

## 限流

考虑目前服务器性能采取一定的限制

### 访客

每分钟内允许发送请求一次

### 登录用户

每分钟内允许发送请求30次

## 查询高亮

在`highlight`字段内提供关键词高亮，以`em`标签包裹

## Mock

### success

#### 200：

```json
{
  "code": 20000,
  "data": [
    "oB8VR5OzuCVqKTJi+b8J/g=="
  ],
  "message": "执行成功",
  "results": [
    {
      #
    详情页文档ID
    "doc_id"
    :
    "9f73e3cb-28a1-4d8d-be9d-3aa24daae244",
    #
    访问链接的标识
    ：
    https
    :
    //pan.quark.cn/s/923a3ef09aca，不同网盘链接不一样，注意有密码的要拼接密码
    "disk_id"
    :
    "923a3ef09aca",
    #
    资源名称
    "disk_name"
    :
    "周星驰映画 - 师永刚,刘琼雄.mobi",
    #
    访问密码
    "disk_pass"
    :
    "",
    #
    网盘类型
    ：
    夸克
    、
    阿里
    、
    迅雷
    、
    百度云
    "disk_type"
    :
    "QUARK",
    #
    文件列表
    "files"
    :
    "file:周星驰映画 - 师永刚,刘琼雄.mobi",
    #
    分享用户
    "share_user"
    :
    "蝴***师",
    #
    分享日期
    "shared_time"
    :
    "2024-01-03T15:25:33+00:00",
    #
    可能存在的文件拓展
    "extensions"
    :
    [
      {
        "extension": "epub"
      },
      {
        "extension": "mobi"
      }
    ],
    #
    高亮
    "highlight"
    :
    {
      "disk_name": [
        "<em>周星驰</em>映画 - 师永刚,刘琼雄.mobi"
      ],
      "files": [
        "file:<em>周星驰</em>映画 - 师永刚,刘琼雄.mobi"
      ]
    }
    }
  ],
  #
  查询结果数量
  "count": 5,
  #
  上一页的API请求
  "previous": null,
  #
  下一页的API请求
  "next": "http://localhost:8000/api/v1/cloud/resource/?ordering=-shared_time&page=2&page_size=1&search=%E5%91%A8%E6%98%9F%E9%A9%B0"
}
```

### Error

#### 429：

```json
{
  "detail": "请求超过了限速。 Expected available in 58 seconds."
}
```

#### 404

```
{
    "detail": "未找到"
}
```

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
- [IP归属地查询 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-geolocation)
- [图片无损放大 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-upscaler)
- [文本比较工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-compare)
- [IP批量查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-batch-lookup)
- [域名查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/domain-finder)
- [DNS工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/dns-toolkit)
- [网站图标生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/favicon-generator)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)