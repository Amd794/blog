----
title: FastAPI依赖注入实践：工厂模式与实例复用的优化策略
date: 2025/04/06 01:22:25
updated: 2025/04/06 01:22:25
author: cmdragon

excerpt:
  FastAPI依赖注入系统中，类依赖的默认行为是为每个请求创建新实例，可能导致性能问题。通过工厂模式控制实例创建过程，可解耦配置和服务实例化，支持依赖层级嵌套，符合单一职责原则。使用lru_cache实现带缓存的工厂模式，优化高频调用场景性能。单例模式实现真正的单例依赖，请求级别复用策略在请求处理周期内复用实例。实际应用场景包括配置中心集成和多租户系统，动态配置加载和租户感知的依赖注入。常见报错解决方案涉及422 Validation Error和依赖项初始化失败。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 依赖注入
  - 工厂模式
  - 实例复用
  - 单例模式
  - 多租户系统
  - 性能优化
----

<img src="https://static.shutu.cn/shutu/jpeg/opene8/2025/04/06/c6d40b8e98c312d60a6e9113e4f609d9.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# FastAPI依赖注入深度实践：类依赖的工厂模式与实例复用

## 一、类依赖的基本原理

在FastAPI的依赖注入系统中，类作为依赖项使用时，框架会自动创建类的实例。当我们这样定义一个路由处理函数时：

```python
@app.get("/items/")
def read_items(service: ItemService = Depends()):
    return service.get_items()
```

FastAPI会为每个请求创建一个新的ItemService实例。这种默认行为在某些场景下可能产生性能问题，特别是当依赖类需要执行初始化数据库连接、加载大文件等耗时操作时。

## 二、工厂模式实现

### 2.1 工厂函数基础实现

通过工厂模式控制实例创建过程：

```python
class DatabaseConfig:
    def __init__(self, url: str = "sqlite:///test.db"):
        self.url = url


class DatabaseService:
    def __init__(self, config: DatabaseConfig):
        self.connection = self.create_connection(config.url)

    def create_connection(self, url):
        # 模拟数据库连接
        print(f"Creating new connection to {url}")
        return f"Connection_{id(self)}"


def get_db_service(config: DatabaseConfig = Depends()) -> DatabaseService:
    return DatabaseService(config)


@app.get("/users/")
def get_users(service: DatabaseService = Depends(get_db_service)):
    return {"connection": service.connection}
```

这个实现的特点：

- 解耦配置和服务的实例化
- 支持依赖层级嵌套（DatabaseConfig自动注入到工厂函数）
- 符合单一职责原则

### 2.2 带缓存的工厂模式

优化高频调用场景的性能：

```python
from fastapi import Depends
from functools import lru_cache


class AnalysisService:
    def __init__(self, config: dict):
        self.model = self.load_ai_model(config["model_path"])

    def load_ai_model(self, path):
        print(f"Loading AI model from {path}")
        return f"Model_{id(self)}"


@lru_cache(maxsize=1)
def get_analysis_service(config: dict = {"model_path": "models/v1"}) -> AnalysisService:
    return AnalysisService(config)


@app.get("/predict")
def make_prediction(service: AnalysisService = Depends(get_analysis_service)):
    return {"model": service.model}
```

缓存机制说明：

- 使用lru_cache实现内存缓存
- maxsize=1表示只缓存最新实例
- 当配置参数变化时会自动创建新实例
- 适合模型加载等重量级初始化场景

## 三、实例复用策略

### 3.1 单例模式实现

实现真正的单例依赖：

```python
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class DatabaseSingleton:
    _instance = None

    def __new__(cls, dsn: str):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            cls._instance.engine = create_engine(dsn)
            cls._instance.Session = sessionmaker(bind=cls._instance.engine)
        return cls._instance


@contextmanager
def get_db_session(dsn: str = "sqlite:///test.db"):
    db = DatabaseSingleton(dsn)
    session = db.Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


@app.get("/transactions")
def get_transactions(session=Depends(get_db_session)):
    return {"status": "success"}
```

### 3.2 请求级别复用

在请求处理周期内复用实例：

```python
from fastapi import Request


class RequestTracker:
    def __init__(self, request: Request):
        self.request = request
        self.start_time = time.time()

    @property
    def duration(self):
        return time.time() - self.start_time


def get_tracker(request: Request) -> RequestTracker:
    if not hasattr(request.state, "tracker"):
        request.state.tracker = RequestTracker(request)
    return request.state.tracker


@app.get("/status")
def get_status(tracker: RequestTracker = Depends(get_tracker)):
    return {"duration": tracker.duration}
```

## 四、实际应用场景

### 4.1 配置中心集成

动态配置加载示例：

```python
from pydantic import BaseSettings


class AppSettings(BaseSettings):
    env: str = "dev"
    api_version: str = "v1"

    class Config:
        env_file = ".env"


def config_factory() -> AppSettings:
    return AppSettings()


def get_http_client(settings: AppSettings = Depends(config_factory)):
    timeout = 30 if settings.env == "prod" else 100
    return httpx.Client(timeout=timeout)
```

### 4.2 多租户系统

租户感知的依赖注入：

```python
class TenantContext:
    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id
        self.config = self.load_tenant_config()

    def load_tenant_config(self):
        # 模拟从数据库加载配置
        return {
            "db_url": f"sqlite:///tenant_{self.tenant_id}.db",
            "theme": "dark" if self.tenant_id == "acme" else "light"
        }


def tenant_factory(tenant_id: str = Header(...)) -> TenantContext:
    return TenantContext(tenant_id)


@app.get("/dashboard")
def get_dashboard(ctx: TenantContext = Depends(tenant_factory)):
    return {"theme": ctx.config["theme"]}
```

## 五、课后Quiz

1. 工厂模式在依赖注入中的主要作用是？
   A) 减少代码量  
   B) 控制实例创建过程  
   C) 提高路由处理速度  
   D) 自动生成API文档

2. 使用lru_cache装饰器缓存服务实例时，当什么情况下会创建新实例？
   A) 每次请求时  
   B) 输入参数变化时  
   C) 服务类代码修改时  
   D) 服务器重启时

3. 在多租户系统中，如何实现不同租户的数据库隔离？
   A) 使用不同的路由前缀  
   B) 基于租户ID动态生成数据库连接  
   C) 为每个租户创建独立应用实例  
   D) 使用请求头认证

（答案：1.B 2.B 3.B）

## 六、常见报错解决方案

### 错误1：422 Validation Error

**现象**：

```json
{
  "detail": [
    {
      "loc": [
        "header",
        "x-tenant-id"
      ],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**原因分析**：

- 请求缺少必要的Header参数
- 工厂函数参数类型声明错误
- 依赖项层级结构不匹配

**解决方案**：

1. 检查请求是否包含所有必需的Header
2. 验证工厂函数的参数类型声明
3. 使用依赖关系图工具调试：
   ```bash
   uvicorn main:app --reload --debug
   ```

### 错误2：依赖项初始化失败

**现象**：

```
RuntimeError: Unable to initialize service - missing config
```

**排查步骤**：

1. 检查依赖项的参数传递链路
2. 验证配置对象的默认值设置
3. 在工厂函数中添加调试日志：
   ```python
   def get_service(config: AppSettings):
       print("Current config:", config.dict())
       return MyService(config)
   ```

**预防建议**：

- 为所有配置参数设置合理的默认值
- 使用pydantic的Field验证：
  ```python
  class AppSettings(BaseSettings):
      db_url: str = Field(..., env="DATABASE_URL")
  ```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [从零构建你的第一个RESTful API：HTTP协议与API设计超图解指南 🌐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e5078a4d6fad/)
-