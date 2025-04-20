----
title: Tortoise-ORM与FastAPI集成：异步模型定义与实践
date: 2025/04/20 11:38:23
updated: 2025/04/20 11:38:23
author: cmdragon

excerpt:
  Tortoise-ORM通过类继承方式定义数据模型，每个模型类对应数据库中的一张表。模型字段类型与数据库类型自动映射，支持主键、唯一约束、索引等配置。模型间通过外键建立关联，支持异步查询和CRUD操作。FastAPI集成时，通过`register_tortoise`初始化数据库连接，并结合Pydantic模型实现数据验证。常见错误包括字段验证失败和数据库连接超时，可通过中间件和连接池配置解决。

categories:
  - 后端开发
  - FastAPI

tags:
  - Tortoise-ORM
  - FastAPI
  - 异步数据库
  - 模型定义
  - 数据库配置
  - CRUD接口
  - 错误处理

----

<img src="https://static.shutu.cn/shutu/jpeg/open44/2025/04/20/6bcd1d8ab9b0c64e8893ca8577be2c2d.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 第一章 Tortoise-ORM异步模型定义基础

## 1.1 模型类创建方法

在FastAPI项目中，数据模型是连接业务逻辑与数据库的核心枢纽。Tortoise-ORM采用类继承方式定义模型，每个模型类对应数据库中的一张表。以下是用户模型的完整示例：

```python
from tortoise.models import Model
from tortoise import fields


class User(Model):
    id = fields.IntField(pk=True)  # 主键字段，自动递增
    username = fields.CharField(max_length=50, unique=True)  # 唯一用户名
    email = fields.CharField(max_length=100, index=True)  # 带索引的邮箱字段
    created_at = fields.DatetimeField(auto_now_add=True)  # 自动记录创建时间
    is_active = fields.BooleanField(default=True)  # 账户激活状态
    credit = fields.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # 精确数值存储

    class Meta:
        table = "auth_users"  # 自定义表名
        ordering = ["-created_at"]  # 默认排序规则
```

该模型在数据库中会生成如下结构的表（以PostgreSQL为例）：

```sql
CREATE TABLE auth_users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50)    NOT NULL UNIQUE,
    email      VARCHAR(100)   NOT NULL,
    created_at TIMESTAMP      NOT NULL,
    is_active  BOOLEAN        NOT NULL,
    credit     NUMERIC(10, 2) NOT NULL
);
```

## 1.2 字段类型映射原理

Tortoise-ORM的字段系统实现了Python类型与数据库类型的智能转换。当我们执行数据库迁移时，ORM会自动根据模型字段类型生成对应的DDL语句：

| Python字段类型    | PostgreSQL类型     | MySQL类型     | SQLite类型 |
|---------------|------------------|-------------|----------|
| CharField     | VARCHAR          | VARCHAR     | TEXT     |
| UUIDField     | UUID             | CHAR(36)    | TEXT     |
| DatetimeField | TIMESTAMP        | DATETIME(6) | TEXT     |
| JSONField     | JSONB            | JSON        | TEXT     |
| FloatField    | DOUBLE PRECISION | DOUBLE      | REAL     |

特殊的字段参数：

- `auto_now_add=True`：仅在对象创建时记录时间
- `auto_now=True`：每次保存对象时更新时间
- `description='字段说明'`：生成数据库注释
- `db_index=True`：创建独立索引（比index参数更灵活）

## 1.3 模型关联配置

关联关系配置是ORM的核心功能之一。我们通过外键字段建立模型间的关联：

```python
class Author(Model):
    name = fields.CharField(max_length=100)


class Book(Model):
    title = fields.CharField(max_length=200)
    author = fields.ForeignKeyField(
        'models.Author',
        related_name='books',
        on_delete=fields.CASCADE
    )
    published_date = fields.DateField()
```

关联查询示例：

```python
# 获取作者及其所有书籍
author = await Author.filter(name="J.K. Rowling").prefetch_related('books')

# 创建关联对象
await Book.create(
    title="Harry Potter and the Philosopher's Stone",
    author=author,
    published_date=date(1997, 6, 26)
)
```

## 第二章 FastAPI集成实践

### 2.1 数据库配置

在FastAPI启动配置中初始化数据库连接：

```python
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

app = FastAPI()

DB_CONFIG = {
    "connections": {
        "default": "postgres://user:password@localhost:5432/mydb"
    },
    "apps": {
        "models": {
            "models": ["models"],
            "default_connection": "default",
        }
    },
    "use_tz": True,  # 启用时区支持
    "timezone": "Asia/Shanghai"
}

register_tortoise(
    app,
    config=DB_CONFIG,
    generate_schemas=True,  # 自动生成表结构
    add_exception_handlers=True  # 启用ORM异常处理
)
```

### 2.2 路由与模型结合

创建完整的CRUD接口示例：

```python
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()


class UserCreate(BaseModel):
    username: str
    email: str


@router.post("/users")
async def create_user(user: UserCreate):
    db_user = await User.create(**user.dict())
    return {
        "id": db_user.id,
        "created_at": db_user.created_at.isoformat()
    }


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await User.get_or_none(id=user_id).values(
        "username", "email", "created_at")
    return user or {"error": "User not found"}
```

## 第三章 课后Quiz

### 问题1：如何设置UUID主键？

A) `id = fields.UUIDField()`
B) `id = fields.UUIDField(pk=True)`
C) `id = fields.UUIDField(primary_key=True)`

正确答案：C  
解析：在Tortoise-ORM中，设置主键需要显式指定primary_key参数。虽然pk是常用的快捷参数，但UUIDField必须使用完整的primary_key=True才能正确生成主键约束。

### 问题2：异步查询的优势包括？

A) 减少内存占用  
B) 避免阻塞事件循环  
C) 提高CPU利用率

正确答案：B  
解析：异步查询允许事件循环在等待数据库响应时处理其他任务，特别适合高并发的I/O密集型场景。内存占用和CPU利用率主要与程序实现方式相关，并非异步的直接优势。

## 第四章 常见报错解决方案

### 4.1 字段验证失败（422错误）

错误示例：

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "username"
      ],
      "msg": "ensure this value has at most 50 characters",
      "type": "value_error.any_str.max_length"
    }
  ]
}
```

解决方法：

1. 检查请求数据是否符合模型约束
2. 在Pydantic模型中设置相同的验证规则
3. 使用中间件捕获验证异常：

```python
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors()},
    )
```

### 4.2 数据库连接超时

错误信息：
`DBConnectionError: Can't connect to MySQL server on 'localhost'`

排查步骤：

1. 验证数据库服务是否正常运行
2. 检查连接字符串格式：`dialect://user:password@host:port/dbname`
3. 增加连接池配置：

```python
DB_CONFIG = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": "localhost",
                "port": "5432",
                "database": "mydb",
                "user": "user",
                "password": "password",
                "minsize": 3,  # 最小连接数
                "maxsize": 20  # 最大连接数
            }
        }
    }
}
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [Pydantic多态模型：用鉴别器构建类型安全的API接口 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4ab129859b04/)
- [FastAPI性能优化指南：参数解析与惰性加载 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a281359d556b/)
- [FastAPI依赖注入：参数共享与逻辑复用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3b96477f5460/)
- [FastAPI安全防护指南：构建坚不可摧的参数处理体系 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1d6d61c6ff85/)
- [FastAPI复杂查询终极指南：告别if-else的现代化过滤架构 | cmdragon's Blog](https://blog.cmdragon.cn/posts/63d68d803116/)
- [FastAPI 核心机制：分页参数的实现与最佳实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6a3cba67a72d/)
- [FastAPI 错误处理与自定义错误消息完全指南：构建健壮的 API 应用 🛠️ | cmdragon's Blog](https://blog.cmdragon.cn/posts/615a966b68d9/)
- [FastAPI 自定义参数验证器完全指南：从基础到高级实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c08aca091616/)
- [FastAPI 参数别名与自动文档生成完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/67c76d0b9297/)
-