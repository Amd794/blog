----
title: FastAPI中的依赖注入与数据库事务管理
date: 2025/04/09 00:10:29
updated: 2025/04/09 00:10:29
author: cmdragon

excerpt:
  文章介绍了在FastAPI中使用依赖注入和SQLAlchemy进行数据库会话封装的方法，提供了三种事务管理模式的实现：自动事务模式、手动控制模式和装饰器模式。通过代码示例展示了如何创建用户注册功能，并处理事务和错误。强调了使用参数化查询防止SQL注入攻击的重要性，并提供了常见报错的解决方案，包括检查数据库连接参数、管理会话生命周期和调整连接池设置。

categories:
  - 后端开发
  - FastAPI

tags:
  - 依赖注入
  - 数据库会话管理
  - 事务管理
  - FastAPI
  - SQLAlchemy
  - 异步编程
  - SQL注入防护
----

<img src="https://static.shutu.cn/shutu/jpeg/open66/2025/04/09/b80006aec612e1d5c8ba0fa6099c30a3.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

1. 依赖注入基础与数据库会话封装  
   （代码示例运行环境：Python 3.8+，需安装fastapi, uvicorn, sqlalchemy, asyncpg）

```python
from fastapi import Depends, FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# 初始化数据库连接（使用异步引擎）
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# 封装数据库会话依赖
async def get_db() -> AsyncSession:
    """
    生成器函数创建数据库会话上下文
    使用yield代替return实现资源自动释放
    会话自动关闭机制保证连接池回收
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


app = FastAPI()


@app.post("/users/")
async def create_user(
        name: str,
        session: AsyncSession = Depends(get_db)
):
    """
    路由函数通过Depends自动获取数据库会话
    事务管理需要在业务逻辑中显式控制
    注意异步await关键字的正确使用
    """
    from sqlalchemy import text
    try:
        # 执行原生SQL示例（实际建议使用ORM）
        await session.execute(
            text("INSERT INTO users (name) VALUES (:name)"),
            {"name": name}
        )
        await session.commit()
        return {"status": "created"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(500, str(e))
```

2. 事务管理的三种实现模式

（1）自动事务模式（适合简单操作）：

```python
from fastapi import Depends
from databases import Database


async def transaction_wrapper(db: Database = Depends(get_db)):
    async with db.transaction():
        yield
```

（2）手动控制模式（复杂业务场景）：

```python
@app.post("/orders/")
async def create_order(
        user_id: int,
        db: AsyncSession = Depends(get_db)
):
    try:
        await db.begin()
        # 执行多个数据库操作
        await db.commit()
    except SQLAlchemyError:
        await db.rollback()
        raise
```

（3）装饰器模式（代码复用最佳实践）：

```python
from contextlib import asynccontextmanager


@asynccontextmanager
async def managed_transaction(db: AsyncSession):
    try:
        yield
        await db.commit()
    except Exception:
        await db.rollback()
        raise


# 在路由中使用
async def create_order(db: AsyncSession = Depends(get_db)):
    async with managed_transaction(db):
# 业务逻辑代码
```

3. 完整案例：用户注册连带创建档案  
   （包含事务管理和错误处理的最佳实践）

```python
from sqlalchemy import insert
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    profile: dict


@app.post("/register/")
async def register_user(
        user_data: UserCreate,
        db: AsyncSession = Depends(get_db)
):
    async with db.begin():
        try:
            # 插入用户主表
            user_result = await db.execute(
                insert(users_table).values(
                    username=user_data.username,
                    email=user_data.email
                ).returning(users_table.c.id)
            )
            user_id = user_result.scalar()

            # 插入档案子表
            await db.execute(
                insert(profiles_table).values(
                    user_id=user_id,
                    **user_data.profile
                )
            )

            return {"user_id": user_id}

        except IntegrityError as e:
            await db.rollback()
            if "unique constraint" in str(e):
                raise HTTPException(400, "Username already exists")
            raise HTTPException(500, "Database error")
```

课后Quiz：  
Q1：使用原生SQL查询时，如何防止SQL注入攻击？  
A) 直接拼接字符串  
B) 使用参数化查询  
C) 过滤特殊字符  
D) 使用ORM自动处理

正确答案：B  
解析：参数化查询通过将用户输入与SQL语句分离的方式，从根本上阻止注入攻击。示例中的text()
函数配合参数字典即为正确做法。即使用ORM，也需要避免直接拼接查询字符串。

常见报错解决方案：  
错误现象：  
`sqlalchemy.exc.InterfaceError: (sqlalchemy.dialects.postgresql.asyncpg.InterfaceError) <class 'asyncpg.exceptions.ConnectionDoesNotExistError'>`

原因分析：

1. 数据库连接参数配置错误
2. 连接池耗尽未正确释放
3. 异步上下文管理不当

解决步骤：

1. 检查DATABASE_URL格式：postgresql+asyncpg://
2. 确保数据库服务正常运行
3. 在依赖项中正确使用async with管理会话生命周期
4. 调整连接池设置：

```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30
)
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [FastAPI依赖注入作用域与生命周期控制 | cmdragon's Blog](https://blog.cmdragon.cn/posts/986bc72f7b12/)
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
-