---
url: /posts/618edd124a0fe8340f766e276faa89fb/
title: 异步IO与Tortoise-ORM的数据库
date: 2025-04-29T13:21:47+08:00
lastmod: 2025-04-29T13:21:47+08:00
author: cmdragon

summary:
  异步IO与同步IO的核心区别在于阻塞与非阻塞模式。Tortoise-ORM通过协议层、连接池层和ORM层实现异步数据库操作，支持高效的并发处理。用户管理系统搭建中，Tortoise-ORM与FastAPI结合，实现了用户创建和查询功能，并通过Pydantic进行数据校验。异步ORM适用于高并发场景，参数化查询可防止SQL注入。最佳实践包括连接池配置、查询优化和事务管理，确保系统性能和数据一致性。

categories:
  - FastAPI

tags:
  - 异步IO
  - Tortoise-ORM
  - 数据库操作
  - FastAPI
  - 异步编程
  - 连接池
  - 事务管理

---

<img src="https://static.shutu.cn/shutu/jpeg/open6a/2025-04-29/f09146a0e9eb787bd773e557e4dd75d1.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第一章：异步IO与Tortoise-ORM原理剖析

## 1.1 同步与异步的本质区别

想象你在快餐店点餐：

- **同步模式**：收银员接单后站在炸薯条机前等待，直到薯条炸好才接待下一位顾客
- **异步模式**：收银员接单后立即将订单交给后厨，转身接待下一位顾客，后厨准备好餐点会主动通知收银员

计算机领域的异步IO正是采用这种"非阻塞"模式：

```python
# 同步操作（线程阻塞）
def sync_query():
    result = db.execute("SELECT * FROM users")  # 线程在此等待
    process(result)


# 异步操作（事件驱动）
async def async_query():
    result = await db.execute("SELECT * FROM users")  # 释放控制权
    process(result)
```

## 1.2 Tortoise-ORM的异步实现

Tortoise-ORM通过三层架构实现异步操作：

| 层级   | 职责        | 关键技术             |
|------|-----------|------------------|
| 协议层  | 数据库通信协议解析 | asyncpg/aiomysql |
| 连接池层 | 管理异步数据库连接 | asyncio.Queue    |
| ORM层 | 模型映射与查询构建 | Python元类编程       |

典型查询流程解析：

```python
async def get_users():
    # 以下三个步骤交替执行，全程无阻塞
    users = await User.filter(age__gt=18)  # 1.生成SQL语句
    # 2.从连接池获取连接
    # 3.等待数据库响应
    return users
```

## 1.3 实战：用户管理系统搭建

### 环境准备

```bash
pip install fastapi uvicorn tortoise-orm aiosqlite pydantic
```

### 项目结构

```
project/
├── config.py
├── models.py
├── schemas.py
└── main.py
```

### 模型定义（models.py）

```python
from tortoise.models import Model
from tortoise import fields


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    hashed_password = fields.CharField(max_length=128)
    email = fields.CharField(max_length=100)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "users"
```

### 数据校验（schemas.py）

```python
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr

    class Config:
        schema_extra = {
            "example": {
                "username": "fastapi_user",
                "password": "strongpassword123",
                "email": "user@example.com"
            }
        }
```

### 核心逻辑（main.py）

```python
from fastapi import FastAPI, Depends, HTTPException
from tortoise.contrib.fastapi import register_tortoise
from models import User
from schemas import UserCreate

app = FastAPI()

# 初始化数据库
register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.post("/users/", status_code=201)
async def create_user(user_data: UserCreate):
    # 密码哈希处理（实际项目应使用passlib）
    hashed_password = f"hashed_{user_data.password}"

    try:
        user = await User.create(
            username=user_data.username,
            hashed_password=hashed_password,
            email=user_data.email
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }


@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }
```

## 课后Quiz

**问题1**：以下哪种场景最适合使用异步ORM？  
A) 单用户的桌面应用程序  
B) 需要处理数千并发请求的API服务  
C) 执行复杂事务的财务系统  
D) 数据仓库的批量数据处理

**答案**：B  
解析：异步ORM在高并发IO密集型场景下能显著提升吞吐量，而ACD场景更多需要的是事务完整性或计算能力。

**问题2**：如何避免在ORM查询时发生SQL注入？  
A) 直接拼接字符串  
B) 使用ORM的参数化查询  
C) 手动过滤特殊字符  
D) 限制查询字段长度

**答案**：B  
解析：Tortoise-ORM的查询方法会自动进行参数化处理，有效防止SQL注入，这是最安全的做法。

## 常见报错解决方案

**错误1**：`422 Validation Error`  
原因分析：请求体不符合Pydantic模型要求  
解决方法：

1. 检查请求头`Content-Type`是否为`application/json`
2. 使用Swagger文档测试接口
3. 查看返回信息中的错误字段提示

**错误2**：`RuntimeError: Event loop is closed`  
原因分析：异步代码在错误的位置执行  
解决方法：

1. 确保所有异步操作都在async函数内
2. 使用`asyncio.run()`正确启动事件循环
3. 检查数据库连接是否正确关闭

**错误3**：`OperationalError: Connection refused`  
原因分析：数据库连接配置错误  
解决方法：

1. 检查`db_url`格式：`dialect://user:password@host:port/database`
2. 确认数据库服务是否正常运行
3. 验证网络防火墙设置

## 最佳实践建议

1. **连接池配置**：根据数据库最大连接数设置`maxsize`

```python
register_tortoise(
    app,
    db_url="postgres://user:pass@localhost:5432/mydb",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
    connection_params={
        "maxsize": 20  # 控制连接池大小
    }
)
```

2. **查询优化**：使用`select_related`预加载关联数据

```python
# 获取用户及其所有文章
async def get_user_with_posts(user_id: int):
    user = await User.get(id=user_id).prefetch_related('posts')
    return user
```

3. **事务管理**：确保数据一致性

```python
async def transfer_funds(from_id, to_id, amount):
    async with in_transaction() as conn:
        from_user = await User.get(id=from_id).for_update()
        to_user = await User.get(id=to_id).for_update()

        if from_user.balance < amount:
            raise ValueError("Insufficient balance")

        from_user.balance -= amount
        to_user.balance += amount

        await from_user.save(using_db=conn)
        await to_user.save(using_db=conn)
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [FastAPI数据库连接池配置与监控 | cmdragon's Blog](https://blog.cmdragon.cn/posts/74b39391a524/)
- [分布式事务在点赞功能中的实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f05753c1a8af/)
- [Tortoise-ORM级联查询与预加载性能优化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/644d88ac6ff1/)
- [使用Tortoise-ORM和FastAPI构建评论系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d7fcb94d965b/)
- [分层架构在博客评论功能中的应用与实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a344f0dfbdbf/)
- [深入解析事务基础与原子操作原理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/823cb13844de/)
- [掌握Tortoise-ORM高级异步查询技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0df919d7ff39/)
- [FastAPI与Tortoise-ORM实现关系型数据库关联 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2c8d6d6e8c53/)
- [Tortoise-ORM与FastAPI集成：异步模型定义与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4b40fac9a431/)
- [异步编程与Tortoise-ORM框架 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ec70904aad68/)
- [FastAPI数据库集成与事务管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7112d376156d/)
- [FastAPI与SQLAlchemy数据库集成 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ac94f11d8558/)
- [FastAPI与SQLAlchemy数据库集成与CRUD操作 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b64fbd2d819d/)
- [FastAPI与SQLAlchemy同步数据库集成 | cmdragon's Blog](https://blog.cmdragon.cn/posts/05564696277e/)
- [SQLAlchemy 核心概念与同步引擎配置详解 | cmdragon's Blog](https://blog.cmdragon.cn/posts/dc3f1adccf0a/)
- [FastAPI依赖注入性能优化策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c3e3f847f09/)
- [FastAPI安全认证中的依赖组合 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d1b6b80e8665/)
- [FastAPI依赖注入系统及调试技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f5d382bc5354/)
- [FastAPI依赖覆盖与测试环境模拟 | cmdragon's Blog](https://blog.cmdragon.cn/posts/88761b137b82/)
- [FastAPI中的依赖注入与数据库事务管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ef1282d9c9b8/)
- [FastAPI依赖注入实践：工厂模式与实例复用的优化策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8b8658ec8dab/)
- [FastAPI依赖注入：链式调用与多级参数传递 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0b359086bd7d/)
- [FastAPI依赖注入：从基础概念到应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ef71d1b7ddfb/)
- [FastAPI中实现动态条件必填字段的实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1b01bf90607f/)
- [FastAPI中Pydantic异步分布式唯一性校验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cda2eb13bf31/)
- [掌握FastAPI与Pydantic的跨字段验证技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/18ef84c3b234/)
- [FastAPI中的Pydantic密码验证机制与实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9b9eb7489096/)
- [深入掌握FastAPI与OpenAPI规范的高级适配技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6e2a1c070e32/)
- [Pydantic字段元数据指南：从基础到企业级文档增强 | cmdragon's Blog](https://blog.cmdragon.cn/posts/11d2c39a300b/)
- [Pydantic Schema生成指南：自定义JSON Schema | cmdragon's Blog](https://blog.cmdragon.cn/posts/3bd5ffd5fdcb/)
- [Pydantic递归模型深度校验36计：从无限嵌套到亿级数据的优化法则 | cmdragon's Blog](https://blog.cmdragon.cn/posts/614488cbbf44/)
- [Pydantic异步校验器深：构建高并发验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6ed5f943c599/)
- [Pydantic根校验器：构建跨字段验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/60d359baeb6c/)
- [Pydantic配置继承抽象基类模式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/fa86615d7d3a/)
-