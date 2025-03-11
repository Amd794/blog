---
title: FastAPI 错误处理与自定义错误消息完全指南：构建健壮的 API 应用 🛠️
date: 2025/3/12
updated: 2025/3/12
author: cmdragon

excerpt:
  我们将涵盖常见的错误类型、如何捕获和处理这些错误、以及如何返回自定义的错误消息。通过实例和最佳实践，您将能够有效地应对常见错误，提高 API 的鲁棒性和可维护性。此外，文章中包含课后测验和常见错误解决方案，帮助您巩固所学知识。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 错误处理
  - 自定义错误消息
  - API设计
  - Web开发
  - 数据校验
  - 开发最佳实践
---

<img src="https://static.amd794.com/blog/images/2025_03_12 00_34_56.png@blog" title="2025_03_12 00_34_56.png" alt="2025_03_12 00_34_56.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

## 第一章：FastAPI 中的错误处理基础

### 1.1 什么是错误处理？

错误处理是指在应用程序运行过程中，捕获和处理可能发生的错误，确保程序能够优雅地处理异常情况并给出适当的反馈。

### 1.2 FastAPI 的默认错误响应

FastAPI 提供了内置的错误处理机制，能够自动返回 HTTP 状态码和错误信息。例如，当请求的资源不存在时，会返回 404 错误。

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id != 1:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item_id": item_id}
```

### 1.3 常见的 HTTP 错误状态码

- **400 Bad Request**：请求参数无效或缺失。
- **404 Not Found**：请求的资源未找到。
- **422 Unprocessable Entity**：请求格式正确，但内容有误。
- **500 Internal Server Error**：服务器内部错误。

---

## 第二章：自定义错误消息

### 2.1 自定义错误响应

您可以通过自定义错误响应来改善用户体验，提供更清晰的错误信息。

```python
from fastapi import Request, FastAPI, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error": "Custom error message"},
    )
```

### 2.2 示例：使用自定义错误消息

在前面的例子中，如果请求的资源未找到，将返回自定义的错误消息。

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id != 1:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item_id": item_id}
```

**示例请求**：

```bash
curl "http://localhost:8000/items/2"
```

**返回**：

```json
{
  "detail": "Item not found",
  "error": "Custom error message"
}
```

### 2.3 处理其他异常

除了 HTTPException，您还可以处理其他类型的异常，例如数据库连接错误。

```python
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred", "error": str(exc)},
    )
```

---

## 第三章：最佳实践

### 3.1 记录错误

在生产环境中，记录错误信息是非常重要的，可以帮助您排查问题。

```python
import logging

logging.basicConfig(level=logging.INFO)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )
```

### 3.2 课后测验

1. 如何在 FastAPI 中捕获和处理所有未处理的异常？
2. 当请求参数不符合预期时，FastAPI 会返回什么错误？如何自定义这个错误的响应？
3. 提供一个如何避免 SQL 注入攻击的示例。

### 3.3 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：请求数据格式不正确或缺失必填字段。  
**解决方案**：检查请求体或查询参数的格式和必填性。

**错误**：404 Not Found  
**原因**：请求的资源不存在。  
**解决方案**：确认请求的 URL 是否正确，资源是否存在。

**错误**：500 Internal Server Error  
**原因**：服务器内部错误。  
**解决方案**：检查服务器日志，确认是否存在未处理的异常。

---

通过本教程，您应该能够掌握 FastAPI 中的错误处理机制和自定义错误消息的技巧，为构建更健壮的 API 应用打下基础。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [Python 与 PostgreSQL 集成：深入 psycopg2 的应用与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9aae8e2f1414/)
-

