---
url: /posts/5265d648f0fd4ea5e11af203bc59301d/
title: 异步编程与Tortoise-ORM框架
date: 2025-04-19T00:13:05+08:00
lastmod: 2025-04-19T00:13:05+08:00
author: cmdragon

summary:
  异步编程通过async/await语法实现协程，单线程可处理多个并发请求，适合IO密集型场景。Tortoise-ORM专为异步设计，支持完整ORM功能和多种数据库，与Pydantic深度集成。整合FastAPI时，通过`register_tortoise`初始化ORM，使用`in_transaction`管理事务，确保操作原子性。常见问题包括未使用await返回协程对象和事件循环关闭错误，需通过正确的事件循环启动和事务管理解决。

categories:
  - FastAPI

tags:
  - 异步编程
  - Tortoise-ORM
  - FastAPI
  - 协程机制
  - 数据库事务
  - Pydantic集成
  - 异步IO

---

<img src="https://static.shutu.cn/shutu/jpeg/open13/2025-04-19/801f67aaf52a17d16502eb6e3ecadf50.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 第一章：异步编程基础与Tortoise-ORM框架定位

## 1.1 异步IO原理与协程机制

当你在快餐店排队时，同步IO就像站在队列中干等取餐，而异步IO则是先下单后去玩手机，听到叫号再取餐。现代Web应用需要同时服务成千上万个这样的"
顾客"，这正是异步编程的价值所在。

Python通过async/await语法实现协程：

```python
async def fetch_data():
    # 模拟IO操作
    await asyncio.sleep(1)
    return {"data": "result"}


# 事件循环驱动执行
async def main():
    task1 = fetch_data()
    task2 = fetch_data()
    await asyncio.gather(task1, task2)  # 并发执行


asyncio.run(main())
```

关键点解析：

- `async def` 声明异步函数（协程）
- `await` 将控制权交还事件循环
- 单个线程可处理多个并发请求

与传统同步模型对比：

| 指标     | 同步模式   | 异步模式     |
|--------|--------|----------|
| 线程使用   | 1请求1线程 | 单线程处理多请求 |
| IO等待处理 | 阻塞     | 非阻塞      |
| 适合场景   | CPU密集型 | IO密集型    |

## 1.2 Tortoise-ORM的异步设计哲学

传统ORM（如Django ORM）在异步环境中会形成性能瓶颈。Tortoise-ORM专为异步而生，其架构设计呈现以下特点：

```python
from tortoise.models import Model
from tortoise import fields


class User(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "auth_user"
```

框架核心优势：

1. 完整的ORM功能支持（关系、事务、聚合）
2. 原生异步查询接口设计
3. 支持PostgreSQL/MySQL/SQLite
4. 与Pydantic深度集成

## 1.3 整合FastAPI的完整示例

创建具备完整功能的API端点：

```python
from fastapi import FastAPI, Depends
from tortoise.contrib.fastapi import register_tortoise
from pydantic import BaseModel

app = FastAPI()


# 请求体模型
class UserCreate(BaseModel):
    name: str


# 响应模型
class UserOut(UserCreate):
    id: int
    created_at: datetime


# 数据库配置
DB_CONFIG = {
    "connections": {"default": "sqlite://db.sqlite3"},
    "apps": {
        "models": {
            "models": ["__main__"],  # 自动发现当前模块的模型
            "default_connection": "default",
        }
    },
}

# 注册Tortoise-ORM
register_tortoise(
    app,
    config=DB_CONFIG,
    generate_schemas=True,  # 自动建表
    add_exception_handlers=True,
)


# 依赖注入数据库连接
async def get_db():
    async with in_transaction() as conn:
        yield conn


@app.post("/users", response_model=UserOut)
async def create_user(user: UserCreate, conn=Depends(get_db)):
    """
    创建用户并返回完整数据
    使用事务保证原子性操作
    """
    db_user = await User.create(**user.dict(), using_db=conn)
    return UserOut.from_orm(db_user)
```

代码要点解析：

- `register_tortoise` 实现ORM初始化
- `in_transaction` 管理事务作用域
- `using_db` 参数确保使用同一连接
- `from_orm` 自动转换模型为Pydantic对象

## 课后Quiz

**Q1：当数据库查询未使用await时会导致什么现象？**
A. 立即返回查询结果  
B. 抛出RuntimeWarning  
C. 返回coroutine对象  
D. 程序崩溃

**正确答案：C**  
解析：异步函数必须使用await执行，否则将返回未被执行的协程对象，这是常见的初学者错误。

**Q2：如何确保多个更新操作在同一个事务中？**
A. 使用@transaction装饰器  
B. 手动begin/commit  
C. 通过in_transaction上下文管理器  
D. 所有操作自动在事务中

**正确答案：C**  
解析：`async with in_transaction() as conn`会创建事务作用域，所有在该上下文中的操作使用同一个连接。

## 常见报错解决方案

**问题1：422 Unprocessable Entity**

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "name"
      ],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**原因分析：**

- 请求体缺少name字段
- 字段类型不匹配（如数字传字符串）
- Pydantic模型校验失败

**解决方案：**

1. 检查请求体是否符合API文档
2. 使用Swagger UI进行测试
3. 查看模型字段定义是否包含required=True

**问题2：RuntimeError: Event loop is closed**
**产生场景：**

```python
# 错误写法
async def get_data():
    await User.all()


# 同步上下文中直接调用
get_data()  
```

**正确处理：**

```python
async def main():
    await get_data()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```

**预防建议：**

- 始终通过事件循环启动异步程序
- 在FastAPI路由中自动管理事件循环
- 避免在同步代码中直接调用协程

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI Cookie 和 Header 参数完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/143aef8a44f0/)
-