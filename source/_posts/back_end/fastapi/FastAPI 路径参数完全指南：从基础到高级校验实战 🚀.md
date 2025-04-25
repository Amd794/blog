---
title: FastAPI 路径参数完全指南：从基础到高级校验实战 🚀
date: 2025/3/5
updated: 2025/3/5
author: cmdragon

excerpt:
  探讨 FastAPI 路径参数的核心机制，涵盖从基础类型转换到高级校验的全方位知识。通过详细的代码示例、课后测验和常见错误解决方案，帮助初学者快速掌握 FastAPI 路径参数的使用技巧。您将学习到如何通过类型转换、正则表达式和自定义校验器来构建安全、高效的 API 接口。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 路径参数
  - 类型转换
  - 参数校验
  - 正则表达式
  - API安全
  - RESTful
---

<img src="https://static.amd794.com/blog/images/2025_03_05 17_10_53.png@blog" title="2025_03_05 17_10_53.png" alt="2025_03_05 17_10_53.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

## 第一章：路径参数基础

### 1.1 什么是路径参数？

路径参数是 RESTful API 中用于标识资源的变量，通常出现在 URL 路径中。例如，`/users/{user_id}` 中的 `user_id` 就是一个路径参数。

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}
```

### 1.2 类型转换

FastAPI 会自动将路径参数转换为指定的类型。如果转换失败，将返回 422 错误。

```python
@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}
```

**示例请求**：

- 合法：`/items/123` → `{"item_id": 123}`
- 非法：`/items/abc` → 422 错误

### 1.3 基础校验

使用 Pydantic 的 `Field` 或 `conint` 等工具可以对路径参数进行基础校验。

```python
from pydantic import conint


@app.get("/products/{product_id}")
async def get_product(product_id: conint(gt=1000)):
    return {"product_id": product_id}
```

**示例请求**：

- 合法：`/products/1001` → `{"product_id": 1001}`
- 非法：`/products/999` → 422 错误

### 1.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：路径参数类型转换失败或校验不通过  
**解决方案**：检查路径参数的类型定义和校验规则。

---

## 第二章：高级校验技巧

### 2.1 正则表达式校验

通过正则表达式可以对路径参数进行更复杂的格式校验。

```python
from fastapi import Path


@app.get("/credit-cards/{card_no}")
async def get_card(card_no: str = Path(..., regex=r"^[4-6]\d{15}$")):
    return {"card_no": card_no}
```

**示例请求**：

- 合法：`/credit-cards/4111111111111111` → `{"card_no": "4111111111111111"}`
- 非法：`/credit-cards/1234567812345678` → 422 错误

### 2.2 自定义验证器

通过 Pydantic 的自定义验证器，可以实现更复杂的校验逻辑。

```python
from pydantic import BaseModel, validator


class ProductCode(str):
    @classmethod
    def validate(cls, value):
        if not re.match(r"^[A-Z]{3}-\d{3}[A-Z]$", value):
            raise ValueError("Invalid product code")
        return cls(value)


@app.get("/products/{code}")
async def get_product(code: ProductCode):
    return {"code": code}
```

**示例请求**：

- 合法：`/products/ABC-123X` → `{"code": "ABC-123X"}`
- 非法：`/products/123-ABC` → 422 错误

### 2.3 复合型校验

结合多种校验规则，可以实现更强大的参数验证。

```python
from datetime import date


@app.get("/orders/{order_date}")
async def get_orders(order_date: date = Path(..., regex=r"^\d{4}-\d{2}-\d{2}$")):
    if order_date > date.today():
        raise HTTPException(400, "未来日期非法")
    return query_orders(order_date)
```

**示例请求**：

- 合法：`/orders/2023-10-01` → 返回订单数据
- 非法：`/orders/2023-13-01` → 422 错误

### 2.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：正则表达式不匹配或自定义校验失败  
**解决方案**：检查正则表达式模式和自定义校验逻辑。

---

## 第三章：安全最佳实践

### 3.1 SQL 注入防御

使用参数化查询可以有效防止 SQL 注入攻击。

```python
# 危险示例
@app.get("/search/{keyword}")
async def unsafe_search(keyword: str):
    query = f"SELECT * FROM products WHERE name LIKE '%{keyword}%'"


# 安全方案
@app.get("/search/{keyword}")
async def safe_search(keyword: str):
    return await database.fetch_all(
        "SELECT * FROM products WHERE name LIKE :keyword",
        {"keyword": f"%{keyword}%"}
    )
```

**Quiz**：如何避免 SQL 注入攻击？  
**答案**：使用参数化查询，避免直接拼接 SQL 语句。

### 3.2 路径遍历攻击防护

通过正则表达式限制路径参数，可以防止路径遍历攻击。

```python
from pathlib import Path


@app.get("/files/{file_path:path}")
async def read_file(file_path: str = Path(..., regex=r"^[\w\-/]+$")):
    full_path = BASE_DIR / file_path
    if not full_path.resolve().startswith(BASE_DIR):
        raise HTTPException(403, "非法路径访问")
    return FileResponse(full_path)
```

**示例请求**：

- 合法：`/files/document.txt` → 返回文件内容
- 非法：`/files/../../etc/passwd` → 403 错误

### 3.3 常见错误与解决方案

**错误**：403 Forbidden  
**原因**：路径参数包含非法字符或路径遍历攻击  
**解决方案**：检查路径参数的正则表达式和路径解析逻辑。

---

## 课后实战项目

### 项目 1：订单系统参数校验

```python
@app.get("/orders/{order_id}")
async def get_order(order_id: str = Path(..., regex=r"^[A-Z]{2}\d{6}[A-Z0-9]{4}$")):
    return query_order(order_id)
```

**任务**：实现一个订单查询接口，确保订单号符合指定格式。

### 项目 2：地理坐标解析

```python
@app.get("/coordinates/{coord}")
async def parse_coordinate(coord: str = Path(..., regex=r"^([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)$")):
    return parse_coord(coord)
```

**任务**：实现一个地理坐标解析接口，确保坐标格式正确。

---

## 错误代码应急手册

| 错误代码 | 典型触发场景         | 解决方案                 |
|------|----------------|----------------------|
| 422  | 类型转换失败/正则不匹配   | 检查参数定义的校验规则          |
| 404  | 路径参数格式正确但资源不存在 | 验证业务逻辑中的数据存在性        |
| 500  | 未捕获的参数处理异常     | 添加 try/except 包裹敏感操作 |
| 400  | 自定义校验规则触发拒绝    | 检查验证器的逻辑条件           |

---

## 常见问题解答

**Q：路径参数能否使用枚举类型？**  
A：可以，使用 `Enum` 类实现：

```python
from enum import Enum


class Color(str, Enum):
    RED = "red"
    BLUE = "blue"


@app.get("/colors/{color}")
async def get_color(color: Color):
    return {"color": color}
```

**Q：如何处理带斜杠的路径参数？**  
A：使用 `:path` 参数类型声明：

```python
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file": file_path}
```

---

通过本教程的详细讲解和实战项目，您已掌握 FastAPI 路径参数的核心知识。现在可以通过以下命令测试您的学习成果：

```bash
curl -X GET "http://localhost:8000/credit-cards/4111111111111111"
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [索引的性能影响：优化数据库查询与存储的关键 | cmdragon's Blog](https://blog.cmdragon.cn/posts/076f666ba145/)
-

