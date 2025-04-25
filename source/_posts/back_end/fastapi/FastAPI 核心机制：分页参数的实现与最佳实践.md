---
title: FastAPI 核心机制：分页参数的实现与最佳实践
date: 2025/3/13
updated: 2025/3/13
author: cmdragon

excerpt:
  在构建现代Web应用程序时，分页是一个不可或缺的功能。无论是处理大量数据还是优化用户体验，分页都起到了至关重要的作用。本文将深入探讨如何在FastAPI中实现分页参数（如page、page_size以及总页数计算），并涵盖相关的核心机制、最佳实践、常见问题及解决方案。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 分页
  - Web开发
  - 数据库查询
  - 性能优化
  - 安全实践
  - 错误处理
---

<img src="https://static.amd794.com/blog/images/2025_03_13 01_29_33.png@blog" title="2025_03_13 01_29_33.png" alt="2025_03_13 01_29_33.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

### **1. 分页的基本概念**

分页是将大量数据分割成多个小块（即“页”），以便用户或系统可以逐步加载和处理这些数据。在Web应用中，分页通常用于处理数据库查询结果、API响应等场景。常见的分页参数包括：

- `page`：当前页码。
- `page_size`：每页显示的数据条数。
- `total_pages`：总页数。

### **2. FastAPI中的分页实现**

在FastAPI中，分页可以通过查询参数来实现。以下是一个简单的示例，展示了如何在FastAPI中实现分页功能。

```python
from fastapi import FastAPI, Query
from typing import List, Optional

app = FastAPI()

# 模拟数据库数据
fake_items_db = [{"item_name": f"Item {i}"} for i in range(100)]


@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0)):
    start = (page - 1) * page_size
    end = start + page_size
    items = fake_items_db[start:end]
    total_items = len(fake_items_db)
    total_pages = (total_items + page_size - 1) // page_size
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
    }
```

在这个示例中，我们定义了两个查询参数`page`和`page_size`，并通过计算`start`和`end`
来获取当前页的数据。我们还计算了总页数`total_pages`，并将其包含在响应中。

### **3. 分页参数的最佳实践**

#### **3.1 参数验证**

为了确保分页参数的有效性，我们需要对`page`和`page_size`进行验证。FastAPI提供了`Query`参数验证功能，可以轻松实现这一点。

```python
from fastapi import Query


@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100)):
    # 分页逻辑
    pass
```

在这个示例中，我们使用`gt`（大于）和`le`（小于等于）来限制`page`和`page_size`的取值范围。如果用户提供的参数不符合要求，FastAPI会自动返回422
Validation Error。

#### **3.2 默认值设置**

为分页参数设置合理的默认值可以提升用户体验。例如，将`page_size`的默认值设置为10或20，可以避免用户一次性加载过多数据。

```python
@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100)):
    # 分页逻辑
    pass
```

#### **3.3 总页数计算**

总页数的计算公式为：

```python
total_pages = (total_items + page_size - 1) // page_size
```

这个公式确保了总页数的准确性，即使`total_items`不能被`page_size`整除。

### **4. 数据库查询中的分页**

在实际应用中，分页通常与数据库查询结合使用。以下是一个使用SQLAlchemy进行分页查询的示例。

```python
from sqlalchemy.orm import Session
from fastapi import Depends
from .database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100),
                     db: Session = Depends(get_db)):
    start = (page - 1) * page_size
    items = db.query(Item).offset(start).limit(page_size).all()
    total_items = db.query(Item).count()
    total_pages = (total_items + page_size - 1) // page_size
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
    }
```

在这个示例中，我们使用`offset`和`limit`来实现分页查询，并通过`count`方法获取总数据条数。

### **5. 分页的安全性**

#### **5.1 避免SQL注入**

在使用原始SQL查询时，必须注意避免SQL注入攻击。SQLAlchemy等ORM框架已经内置了防止SQL注入的机制，但在使用原始SQL时，仍需谨慎。

```python
from sqlalchemy.sql import text


@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100),
                     db: Session = Depends(get_db)):
    start = (page - 1) * page_size
    query = text("SELECT * FROM items LIMIT :limit OFFSET :offset")
    items = db.execute(query, {"limit": page_size, "offset": start}).fetchall()
    total_items = db.execute(text("SELECT COUNT(*) FROM items")).scalar()
    total_pages = (total_items + page_size - 1) // page_size
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
    }
```

在这个示例中，我们使用参数化查询来避免SQL注入。

#### **5.2 数据隐私**

在处理敏感数据时，确保分页查询不会泄露隐私信息。例如，避免在分页查询中返回未授权的数据。

### **6. 性能优化**

#### **6.1 索引优化**

在数据库查询中，为分页字段（如`id`、`created_at`等）创建索引可以显著提升查询性能。

```sql
CREATE INDEX idx_items_created_at ON items (created_at);
```

#### **6.2 缓存**

对于频繁访问的分页数据，可以使用缓存机制（如Redis）来减少数据库查询次数。

```python
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache


@app.get("/items/")
@cache(expire=60)
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100)):
    # 分页逻辑
    pass
```

在这个示例中，我们使用`fastapi-cache`库来缓存分页查询结果，缓存有效期为60秒。

### **7. 常见错误及解决方案**

#### **7.1 422 Validation Error**

当分页参数不符合验证规则时，FastAPI会返回422 Validation Error。解决方案是确保分页参数的取值范围正确，并在API文档中明确说明。

```python
@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100)):
    # 分页逻辑
    pass
```

#### **7.2 500 Internal Server Error**

当数据库查询失败或分页逻辑出现错误时，可能会返回500 Internal Server Error。解决方案是捕获异常并返回友好的错误信息。

```python
from fastapi import HTTPException


@app.get("/items/")
async def read_items(page: int = Query(1, gt=0), page_size: int = Query(10, gt=0, le=100),
                     db: Session = Depends(get_db)):
    try:
        start = (page - 1) * page_size
        items = db.query(Item).offset(start).limit(page_size).all()
        total_items = db.query(Item).count()
        total_pages = (total_items + page_size - 1) // page_size
        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

在这个示例中，我们捕获了所有异常，并返回500 Internal Server Error。

### **8. 课后Quiz**

1. **如何避免SQL注入攻击？**
    - 使用参数化查询。
    - 避免拼接SQL语句。
    - 使用ORM框架。

2. **如何优化分页查询的性能？**
    - 为分页字段创建索引。
    - 使用缓存机制。
    - 减少查询返回的字段数量。

3. **如何处理分页参数无效的情况？**
    - 使用FastAPI的`Query`参数验证功能。
    - 返回422 Validation Error。
    - 在API文档中明确说明参数要求。

---

**常见报错解决方案：**

- **422 Validation Error**：检查分页参数的取值范围，确保符合验证规则。
- **500 Internal Server Error**：捕获异常并返回友好的错误信息，检查数据库查询逻辑。
- **404 Not Found**：确保分页参数不会导致查询结果为空，处理边界情况。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [FastAPI 错误处理与自定义错误消息完全指南：构建健壮的 API 应用 🛠️ | cmdragon's Blog](https://blog.cmdragon.cn/posts/615a966b68d9/)
- [FastAPI 自定义参数验证器完全指南：从基础到高级实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c08aca091616/)
- [FastAPI 参数别名与自动文档生成完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/67c76d0b9297/)
- [FastAPI Cookie 和 Header 参数完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/143aef8a44f0/)
- [FastAPI 表单参数与文件上传完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/378acc9ed556/)
- [FastAPI 请求体参数与 Pydantic 模型完全指南：从基础到嵌套模型实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/17872b9724be/)
- [FastAPI 查询参数完全指南：从基础到高级用法 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/361d6ce26859/)
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
-

