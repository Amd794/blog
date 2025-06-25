---
url: /posts/17629ae4ff3670792f832752e5cb8c33/
title: FastAPI依赖注入作用域与生命周期控制
date: 2025-04-08T00:02:10+08:00
lastmod: 2025-04-08T00:02:10+08:00
author: cmdragon

summary:
  FastAPI框架中，依赖项的作用域决定了它们的创建和销毁时机，主要分为应用级和请求级两种。应用级依赖在整个应用生命周期内只初始化一次，适合长期保持的昂贵资源；请求级依赖在每个HTTP请求时创建新实例，适合需要频繁初始化的资源。通过`yield`语法可以实现请求级依赖的生命周期控制，确保资源在使用后正确释放。合理划分依赖项作用域和精确控制生命周期，能显著提升应用性能和资源利用率。

categories:
  - FastAPI

tags:
  - FastAPI
  - 依赖注入
  - 作用域
  - 生命周期控制
  - 应用级作用域
  - 请求级作用域
  - 资源管理
---

<img src="https://static.shutu.cn/shutu/jpeg/open5b/2025-04-08/778f5f30b05305afdd003e2d86fedf14.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# FastAPI依赖注入作用域与生命周期控制详解

## 1. 依赖项作用域基础概念

在FastAPI框架中，依赖项的作用域决定了它们的创建和销毁时机。就像图书馆里的公共设施（应用级）与个人借阅的书籍（请求级）的区别，不同作用域的依赖项适用于不同的使用场景。

作用域主要分为两种类型：

1. **应用级作用域（Singleton）**：整个应用生命周期内只初始化一次
2. **请求级作用域（Request）**：每个HTTP请求都会创建新的实例

```python
from fastapi import Depends, FastAPI

app = FastAPI()


# 应用级依赖示例
class DatabasePool:
    def __init__(self):
        print("创建数据库连接池")
        self.pool = "模拟连接池"


db_pool = DatabasePool()


@app.get("/data")
async def get_data(pool: str = Depends(lambda: db_pool.pool)):
    return {"pool": pool}
```

## 2. 作用域划分实践技巧

### 2.1 应用级作用域配置

适合需要长期保持的昂贵资源，推荐在应用启动事件中初始化：

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 应用启动时初始化
    app.state.db_pool = await create_db_pool()
    yield
    # 应用关闭时清理
    await app.state.db_pool.close()


app = FastAPI(lifespan=lifespan)


@app.get("/items")
async def read_items(pool=Depends(lambda: app.state.db_pool)):
    return {"pool": pool.status}
```

### 2.2 请求级作用域实现

使用`yield`语法实现请求级依赖的生命周期控制：

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db():
    # 每个请求创建新会话
    db_session = AsyncSession(bind=engine)
    try:
        yield db_session
    finally:
        # 请求结束后关闭会话
        await db_session.close()


@app.post("/users")
async def create_user(
        user: UserSchema,
        db: AsyncSession = Depends(get_db)
):
    db.add(User(**user.dict()))
    await db.commit()
    return {"status": "created"}
```

## 3. 生命周期控制模式

### 3.1 初始化-使用-销毁流程

```python
from typing import Generator
from fastapi import Depends


class FileProcessor:
    def __init__(self, filename):
        self.file = open(filename, "r")
        print(f"打开文件 {filename}")

    def process(self):
        return self.file.read()

    def close(self):
        self.file.close()
        print("文件已关闭")


def get_processor() -> Generator[FileProcessor, None, None]:
    processor = FileProcessor("data.txt")
    try:
        yield processor
    finally:
        processor.close()


@app.get("/process")
async def process_file(
        processor: FileProcessor = Depends(get_processor)
):
    content = processor.process()
    return {"content": content[:100]}
```

## 4. 混合作用域实战案例

组合不同作用域的依赖项实现高效资源管理：

```python
from fastapi import Depends, BackgroundTasks

# 应用级缓存
cache = {}


# 请求级数据库连接
async def get_db():
    ...


# 缓存依赖（应用级）
def get_cache():
    return cache


@app.post("/cached-data")
async def get_data(
        db: AsyncSession = Depends(get_db),
        cache: dict = Depends(get_cache),
        bg: BackgroundTasks = Depends()
):
    if "data" not in cache:
        result = await db.execute("SELECT ...")
        cache["data"] = result
        bg.add_task(lambda: cache.pop("data", None), delay=3600)
    return cache["data"]
```

## 5. 课后Quiz

### 问题1：请求级依赖的yield语句必须放在try/finally块中吗？

**答案**：不是必须，但推荐使用。finally块确保无论是否发生异常都会执行清理操作，避免资源泄漏

### 问题2：应用级依赖能否访问请求上下文？

**答案**：不能。应用级依赖在请求上下文创建之前就已经初始化，无法访问请求相关信息

## 6. 常见报错解决方案

### 错误1：RuntimeError: Dependency is not yield

**原因**：在异步依赖项中忘记使用yield语法

```python
# 错误示例
async def get_db():
    return Session()


# 正确写法
async def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
```

### 错误2：DependencyOveruseWarning

**现象**：频繁创建昂贵资源导致性能问题
**解决**：检查依赖项作用域是否合理，将数据库连接池等昂贵资源改为应用级作用域

### 错误3：ContextVariableNotFound

**场景**：在应用级依赖中尝试访问请求信息
**处理**：将需要请求信息的依赖改为请求级作用域，或通过参数传递所需数据

## 7. 环境配置与运行

安装依赖：

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv
```

启动服务：

```bash
uvicorn main:app --reload --port 8000
```

测试端点：

```bash
curl http://localhost:8000/items
curl -X POST http://localhost:8000/users -H "Content-Type: application/json" -d '{"name":"John"}'
```

通过合理划分依赖项的作用域和精确控制生命周期，开发者可以显著提升FastAPI应用的性能和资源利用率。建议在实践中结合具体业务需求，通过性能测试确定最佳作用域配置方案。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [HTTP协议与RESTful API实战手册（二）：用披萨店故事说透API设计奥秘 🍕 | cmdragon's Blog](https://blog.cmdragon.cn/posts/074086de21be/)
-