---
title: cloud_seeker项目后端API接口文档
date: 2024/6/1 4:29:40
updated: 2024/6/1 4:29:40
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

默认返回 8  条数据，最大一次性返回24条数据

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
            # 详情页文档ID
            "doc_id": "9f73e3cb-28a1-4d8d-be9d-3aa24daae244",
            # 访问链接的标识：https://pan.quark.cn/s/923a3ef09aca，不同网盘链接不一样，注意有密码的要拼接密码
            "disk_id": "923a3ef09aca",
            # 资源名称
            "disk_name": "周星驰映画 - 师永刚,刘琼雄.mobi",
            # 访问密码
            "disk_pass": "",
            # 网盘类型：夸克、阿里、迅雷、百度云
            "disk_type": "QUARK",
            # 文件列表
            "files": "file:周星驰映画 - 师永刚,刘琼雄.mobi",
            # 分享用户
            "share_user": "蝴***师",
            # 分享日期
            "shared_time": "2024-01-03T15:25:33+00:00",
            # 可能存在的文件拓展
            "extensions": [
                {
                    "extension": "epub"
                },
                {
                    "extension": "mobi"
                }
            ],
            # 高亮
            "highlight": {
                "disk_name": [
                    "<em>周星驰</em>映画 - 师永刚,刘琼雄.mobi"
                ],
                "files": [
                    "file:<em>周星驰</em>映画 - 师永刚,刘琼雄.mobi"
                ]
            }
        }
    ],
    # 查询结果数量
    "count": 5,
    # 上一页的API请求
    "previous": null,
    # 下一页的API请求
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

