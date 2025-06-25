---
url: /posts/7aff487e3d3501d72f105675b194ebdf/
title: FastAPI Cookie 和 Header 参数完全指南：从基础到高级实战 🚀
date: 2025-03-09T00:18:53+08:00
updated: 2025-03-09T00:18:53+08:00
author: cmdragon

summary:
  本教程深入探讨 FastAPI 中 Cookie 和 Header 参数的读取与设置，涵盖从基础操作到高级用法。通过详细的代码示例、课后测验和常见错误解决方案，帮助初学者快速掌握 FastAPI 中 Cookie 和 Header 参数的使用技巧。您将学习到如何通过 Cookie 和 Header 传递数据、进行数据校验以及优化 API 接口的安全性，从而构建高效、安全的 Web 应用。

categories:
  - FastAPI

tags:
  - FastAPI
  - Cookie
  - Header
  - API设计
  - Web开发
  - 数据校验
  - 安全性
---

<img src="https://static.cmdragon.cn/blog/images/2025_03_09 18_00_28.png@blog" title="2025_03_09 18_00_28.png" alt="2025_03_09 18_00_28.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

## 第一章：Cookie 参数基础

### 1.1 什么是 Cookie 参数？

Cookie 是 Web 应用中用于存储用户会话信息的机制。在 FastAPI 中，Cookie 参数可以通过 `Cookie` 类进行处理。

```python
from fastapi import FastAPI, Cookie

app = FastAPI()


@app.get("/items/")
async def read_items(session_id: str = Cookie(None)):
    return {"session_id": session_id}
```

### 1.2 Cookie 参数的使用

通过 `Cookie` 类，可以轻松读取客户端传递的 Cookie 参数。

```python
@app.get("/user/")
async def read_user(user_id: str = Cookie(None)):
    return {"user_id": user_id}
```

**示例请求**：

```bash
curl -b "session_id=abc123" http://localhost:8000/items/
```

### 1.3 Cookie 参数校验

结合 Pydantic 的 `Field`，可以对 Cookie 参数进行数据校验。

```python
from pydantic import Field


@app.get("/validate-cookie/")
async def validate_cookie(session_id: str = Cookie(..., min_length=3)):
    return {"session_id": session_id}
```

**示例请求**：

- 合法：`curl -b "session_id=abc123" http://localhost:8000/validate-cookie/` → `{"session_id": "abc123"}`
- 非法：`curl -b "session_id=a" http://localhost:8000/validate-cookie/` → 422 错误

### 1.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：Cookie 参数类型转换失败或校验不通过  
**解决方案**：检查 Cookie 参数的类型定义和校验规则。

---

## 第二章：Header 参数基础

### 2.1 什么是 Header 参数？

Header 是 HTTP 请求中用于传递元数据的机制。在 FastAPI 中，Header 参数可以通过 `Header` 类进行处理。

```python
from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
async def read_items(user_agent: str = Header(None)):
    return {"user_agent": user_agent}
```

### 2.2 Header 参数的使用

通过 `Header` 类，可以轻松读取客户端传递的 Header 参数。

```python
@app.get("/user/")
async def read_user(x_token: str = Header(None)):
    return {"x_token": x_token}
```

**示例请求**：

```bash
curl -H "X-Token: abc123" http://localhost:8000/user/
```

### 2.3 Header 参数校验

结合 Pydantic 的 `Field`，可以对 Header 参数进行数据校验。

```python
from pydantic import Field


@app.get("/validate-header/")
async def validate_header(x_token: str = Header(..., min_length=3)):
    return {"x_token": x_token}
```

**示例请求**：

- 合法：`curl -H "X-Token: abc123" http://localhost:8000/validate-header/` → `{"x_token": "abc123"}`
- 非法：`curl -H "X-Token: a" http://localhost:8000/validate-header/` → 422 错误

### 2.4 常见错误与解决方案

**错误**：422 Validation Error  
**原因**：Header 参数类型转换失败或校验不通过  
**解决方案**：检查 Header 参数的类型定义和校验规则。

---

## 第三章：高级用法与最佳实践

### 3.1 自定义 Cookie 和 Header 名称

通过 `alias` 参数，可以自定义 Cookie 和 Header 的名称。

```python
@app.get("/custom-cookie/")
async def custom_cookie(session: str = Cookie(None, alias="session_id")):
    return {"session": session}


@app.get("/custom-header/")
async def custom_header(token: str = Header(None, alias="X-Token")):
    return {"token": token}
```

### 3.2 安全性最佳实践

通过 `Secure` 和 `HttpOnly` 标志，可以增强 Cookie 的安全性。

```python
from fastapi.responses import JSONResponse


@app.get("/secure-cookie/")
async def secure_cookie():
    response = JSONResponse(content={"message": "Secure cookie set"})
    response.set_cookie(key="session_id", value="abc123", secure=True, httponly=True)
    return response
```

### 3.3 性能优化

通过 `Header` 的 `convert_underscores` 参数，可以优化 Header 参数的兼容性。

```python
@app.get("/optimized-header/")
async def optimized_header(user_agent: str = Header(None, convert_underscores=False)):
    return {"user_agent": user_agent}
```

### 3.4 常见错误与解决方案

**错误**：400 Bad Request  
**原因**：Header 或 Cookie 参数格式不正确  
**解决方案**：检查参数的格式和校验规则。

---

## 课后测验

### 测验 1：Cookie 参数校验

**问题**：如何定义一个包含校验规则的 Cookie 参数？  
**答案**：

```python
from fastapi import Cookie
from pydantic import Field


@app.get("/validate-cookie/")
async def validate_cookie(session_id: str = Cookie(..., min_length=3)):
    return {"session_id": session_id}
```

### 测验 2：Header 参数校验

**问题**：如何定义一个包含校验规则的 Header 参数？  
**答案**：

```python
from fastapi import Header
from pydantic import Field


@app.get("/validate-header/")
async def validate_header(x_token: str = Header(..., min_length=3)):
    return {"x_token": x_token}
```

---

## 错误代码应急手册

| 错误代码 | 典型触发场景                | 解决方案                 |
|------|-----------------------|----------------------|
| 422  | 类型转换失败/校验不通过          | 检查参数定义的校验规则          |
| 400  | Header 或 Cookie 格式不正确 | 检查参数的格式和校验规则         |
| 500  | 未捕获的参数处理异常            | 添加 try/except 包裹敏感操作 |
| 401  | 未授权访问                 | 检查认证和授权逻辑            |

---

## 常见问题解答

**Q：如何设置安全的 Cookie？**  
A：通过 `Secure` 和 `HttpOnly` 标志设置：

```python
from fastapi.responses import JSONResponse


@app.get("/secure-cookie/")
async def secure_cookie():
    response = JSONResponse(content={"message": "Secure cookie set"})
    response.set_cookie(key="session_id", value="abc123", secure=True, httponly=True)
    return response
```

**Q：如何处理自定义 Header 名称？**  
A：通过 `alias` 参数设置：

```python
@app.get("/custom-header/")
async def custom_header(token: str = Header(None, alias="X-Token")):
    return {"token": token}
```

---

通过本教程的详细讲解和实战项目，您已掌握 FastAPI 中 Cookie 和 Header 参数的核心知识。现在可以通过以下命令测试您的学习成果：

```bash
curl -b "session_id=abc123" http://localhost:8000/items/
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [应用中的 PostgreSQL项目案例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/287f56043db8/)
- [数据库安全管理中的权限控制：保护数据资产的关键措施 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5995b8f15678/)
- [数据库安全管理中的用户和角色管理：打造安全高效的数据环境 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c0cd4cbaa201/)
-

