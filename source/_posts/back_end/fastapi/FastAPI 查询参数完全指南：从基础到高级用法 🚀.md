---
title: FastAPI 查询参数完全指南：从基础到高级用法 🚀
date: 2025/3/6
updated: 2025/3/6
author: cmdragon 

excerpt:
  探讨 FastAPI 查询参数的核心机制，涵盖从必需与可选参数、默认值到多参数处理的全方位知识。通过详细的代码示例、课后测验和常见错误解决方案，通过类型转换、校验和默认值设置来构建灵活、高效的 API 接口。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 查询参数
  - 必需参数
  - 可选参数
  - 默认值
  - 多参数处理
  - API设计
---

<img src="https://static.amd794.com/blog/images/2025_03_06 00_23_00.png@blog" title="2025_03_06 00_23_00.png" alt="2025_03_06 00_23_00.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

## 第一章：查询参数基础

### 1.1 什么是查询参数？

查询参数是 RESTful API 中用于传递附加信息的变量，通常出现在 URL 的查询字符串中。例如，`/items?skip=0&limit=10` 中的 `skip`
和 `limit` 就是查询参数。

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```

### 1.2 必需与可选参数

在 FastAPI 中，查询参数可以是必需的或可选的。如果参数没有默认值，则它是必需的；如果有默认值，则是可选的。

```python
@app.get("/users/")
async def read_users(user_id: int, is_active: bool = True):
    return {"user_id": user_id, "is_active": is_active}
```

**示例请求**：

- 必需参数：`/users/?user_id=123` → `{"user_id": 123, "is_active": True}`
- 可选参数：`/users/?user_id=123&is_active=False` → `{"user_id": 123, "is_active": False}`

### 1.3 默认值设置

通过为查询参数设置默认值，可以简化 API 的使用。

```python
@app.get("/products/")
async def read_products(page: int = 1, per_page: int = 20):
    return {"page": page, "per_page": per_page}
```

**示例请求**：

- 默认值：`/products/` → `{"page": 1, "per_page": 20}`
- 自定义值：`/products/?page=2&per_page=50` → `{"page": 2, "per_page": 50}`

### 1.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：查询参数类型转换失败或校验不通过  
**解决方案**：检查查询参数的类型定义和校验规则。

---

## 第二章：多参数处理

### 2.1 多个查询参数

FastAPI 支持在同一个接口中处理多个查询参数。

```python
@app.get("/search/")
async def search_items(q: str, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}
```

**示例请求**：

- 多参数：`/search/?q=apple&skip=10&limit=20` → `{"q": "apple", "skip": 10, "limit": 20}`

### 2.2 列表类型参数

通过使用 `List` 类型，可以处理多个相同类型的查询参数。

```python
from typing import List


@app.get("/products/")
async def read_products(categories: List[str] = Query(...)):
    return {"categories": categories}
```

**示例请求**：

- 列表参数：`/products/?categories=electronics&categories=furniture` → `{"categories": ["electronics", "furniture"]}`

### 2.3 复杂参数校验

结合 Pydantic 的 `Field` 和 `Query`，可以对查询参数进行复杂的校验。

```python
from pydantic import Field


@app.get("/orders/")
async def read_orders(order_id: int = Query(..., gt=0), status: str = Field(..., regex=r"^(pending|completed)$")):
    return {"order_id": order_id, "status": status}
```

**示例请求**：

- 合法：`/orders/?order_id=123&status=pending` → `{"order_id": 123, "status": "pending"}`
- 非法：`/orders/?order_id=0&status=invalid` → 422 错误

### 2.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：查询参数类型转换失败或校验不通过  
**解决方案**：检查查询参数的类型定义和校验规则。

---

## 第三章：高级用法与最佳实践

### 3.1 参数别名

通过 `Query` 的 `alias` 参数，可以为查询参数设置别名。

```python
@app.get("/users/")
async def read_users(user_id: int = Query(..., alias="id")):
    return {"user_id": user_id}
```

**示例请求**：

- 别名：`/users/?id=123` → `{"user_id": 123}`

### 3.2 参数描述与文档

通过 `Query` 的 `description` 参数，可以为查询参数添加描述信息，这些信息将显示在 API 文档中。

```python
@app.get("/products/")
async def read_products(category: str = Query(..., description="Filter products by category")):
    return {"category": category}
```

**示例请求**：

- 描述：`/products/?category=electronics` → `{"category": "electronics"}`

### 3.3 参数弃用

通过 `Query` 的 `deprecated` 参数，可以标记查询参数为弃用。

```python
@app.get("/items/")
async def read_items(old_param: str = Query(None, deprecated=True)):
    return {"old_param": old_param}
```

**示例请求**：

- 弃用参数：`/items/?old_param=value` → `{"old_param": "value"}`

### 3.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：查询参数类型转换失败或校验不通过  
**解决方案**：检查查询参数的类型定义和校验规则。

---

## 课后测验

### 测验 1：必需与可选参数

**问题**：如何定义一个必需查询参数和一个可选查询参数？  
**答案**：

```python
@app.get("/items/")
async def read_items(required_param: int, optional_param: str = "default"):
    return {"required_param": required_param, "optional_param": optional_param}
```

### 测验 2：列表类型参数

**问题**：如何处理多个相同类型的查询参数？  
**答案**：

```python
from typing import List


@app.get("/products/")
async def read_products(categories: List[str] = Query(...)):
    return {"categories": categories}
```

---

## 错误代码应急手册

| 错误代码 | 典型触发场景         | 解决方案                 |
|------|----------------|----------------------|
| 422  | 类型转换失败/正则不匹配   | 检查参数定义的校验规则          |
| 404  | 查询参数格式正确但资源不存在 | 验证业务逻辑中的数据存在性        |
| 500  | 未捕获的参数处理异常     | 添加 try/except 包裹敏感操作 |
| 400  | 自定义校验规则触发拒绝    | 检查验证器的逻辑条件           |

---

## 常见问题解答

**Q：查询参数能否使用枚举类型？**  
A：可以，使用 `Enum` 类实现：

```python
from enum import Enum


class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


@app.get("/users/")
async def get_users(status: Status):
    return {"status": status}
```

**Q：如何处理带斜杠的查询参数？**  
A：使用 `Query` 的 `alias` 参数或 URL 编码：

```python
@app.get("/files/")
async def read_files(path: str = Query(..., alias="file-path")):
    return {"path": path}
```

---

通过本文的详细讲解和实战项目，您已掌握 FastAPI 查询参数的核心知识。现在可以通过以下命令测试您的学习成果：

```bash
curl -X GET "http://localhost:8000/items/?skip=0&limit=10"
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [FastAPI 路径参数完全指南：从基础到高级校验实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/14c3a0c58061/)
- [FastAPI路由专家课：微服务架构下的路由艺术与工程实践 🌐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/11c340ef08d4/)
- [FastAPI路由与请求处理进阶指南：解锁企业级API开发黑科技 🔥 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8737e29cfe7a/)
- [FastAPI路由与请求处理全解：手把手打造用户管理系统 🔌 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7fa6ec101733/)
- [FastAPI极速入门：15分钟搭建你的首个智能API（附自动文档生成）🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4e5a7adbcde4/)
- [HTTP协议与RESTful API实战手册（终章）：构建企业级API的九大秘籍 🔐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2d417c3e7cac/)
- [HTTP协议与RESTful API实战手册（二）：用披萨店故事说透API设计奥秘 🍕 | cmdragon's Blog](https://blog.cmdragon.cn/posts/074086de21be/)
- [从零构建你的第一个RESTful API：HTTP协议与API设计超图解指南 🌐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e5078a4d6fad/)
- [Python异步编程进阶指南：破解高并发系统的七重封印 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f49972bd19a6/)
- [Python异步编程终极指南：用协程与事件循环重构你的高并发系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b279dbab11eb/)
- [Python类型提示完全指南：用类型安全重构你的代码，提升10倍开发效率 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8f8db75c315d/)
- [三大平台云数据库生态服务对决 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d0b1b6a9f135/)
- [分布式数据库解析 | cmdragon's Blog](https://blog.cmdragon.cn/posts/91aae808d87e/)
- [深入解析NoSQL数据库：从文档存储到图数据库的全场景实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5fcc2532e318/)
- [数据库审计与智能监控：从日志分析到异常检测 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c971b2302602/)
- [数据库加密全解析：从传输到存储的安全实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/735fa4090f0b/)
- [数据库安全实战：访问控制与行级权限管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c01d5c0a63b/)
- [数据库扩展之道：分区、分片与大表优化实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f71048cd61c/)
- [查询优化：提升数据库性能的实用技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8e5e3ffe33dd/)
- [性能优化与调优：全面解析数据库索引 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3c6ba213efe2/)
- [存储过程与触发器：提高数据库性能与安全性的利器 | cmdragon's Blog](https://blog.cmdragon.cn/posts/84376403bdf0/)
- [数据操作与事务：确保数据一致性的关键 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f357e8ef59f1/)
- [深入掌握 SQL 深度应用：复杂查询的艺术与技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/87c82dea0024/)
- [彻底理解数据库设计原则：生命周期、约束与反范式的应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3f3203c3e56b/)
- [深入剖析实体-关系模型（ER 图）：理论与实践全解析 | cmdragon's Blog](https://blog.cmdragon.cn/posts/91e1bf521e8c/)
- [数据库范式详解：从第一范式到第五范式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/05264e28f9f8/)
- [PostgreSQL：数据库迁移与版本控制 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a58cca68755e/)
- [Node.js 与 PostgreSQL 集成：深入 pg 模块的应用与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d5b4e82e959a/)
- [Python 与 PostgreSQL 集成：深入 psycopg2 的应用与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9aae8e2f1414/)
- [应用中的 PostgreSQL项目案例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/287f56043db8/)
- [数据库安全管理中的权限控制：保护数据资产的关键措施 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5995b8f15678/)
- [数据库安全管理中的用户和角色管理：打造安全高效的数据环境 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c0cd4cbaa201/)
- [数据库查询优化：提升性能的关键实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3ab8c2f85479/)
- [数据库物理备份：保障数据完整性和业务连续性的关键策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7e3da86fa38b/)
- [PostgreSQL 数据备份与恢复：掌握 pg_dump 和 pg_restore 的最佳实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2190f85925ce/)
-

