----
title: FastAPI与SQLAlchemy数据库集成与CRUD操作
date: 2025/04/16 09:50:57
updated: 2025/04/16 09:50:57
author: cmdragon 

excerpt:
  FastAPI与SQLAlchemy集成基础包括环境准备、数据库连接配置和模型定义。CRUD操作通过数据访问层封装和路由层实现，确保线程安全和事务管理。常见错误如422请求验证错误通过Pydantic模型和中间件处理。Session生命周期管理依赖注入系统保证每个请求独立会话。常见报错如数据库连接失败和事务回滚通过检查服务状态、验证连接参数和异常处理解决。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - SQLAlchemy
  - 数据库集成
  - CRUD操作
  - Session管理
  - 错误处理
  - MySQL

----

<img src="https://static.shutu.cn/shutu/jpeg/open84/2025/04/16/0ed0bcb43f45243d9af3fb01121d2490.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 1. FastAPI 与 SQLAlchemy 同步数据库集成基础

## 1.1 环境准备与安装

首先创建虚拟环境并安装必要依赖：

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows
pip install fastapi uvicorn sqlalchemy pymysql
```

## 1.2 数据库连接配置

在`database.py`中配置核心数据库连接：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/mydatabase"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)
```

## 1.3 模型定义与关系映射

在`models.py`中定义数据模型：

```python
from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True)
    age = Column(Integer, default=18)

    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}')>"
```

# 2. CRUD 操作标准实现模式

## 2.1 数据访问层封装

创建`repository.py`实现CRUD操作：

```python
from sqlalchemy.orm import Session
from models import User


class UserRepository:
    @staticmethod
    def create_user(db: Session, user_data: dict):
        """ 创建用户 """
        db_user = User(**user_data)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user(db: Session, user_id: int):
        """ 根据ID获取用户 """
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: int, update_data: dict):
        """ 更新用户信息 """
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            for key, value in update_data.items():
                setattr(db_user, key, value)
            db.commit()
            db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user(db: Session, user_id: int):
        """ 删除用户 """
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return True
        return False
```

## 2.2 路由层实现

在`main.py`中定义API端点：

```python
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from models import Base
from database import engine, SessionLocal
from repository import UserRepository
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()


# 依赖注入获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserCreate(BaseModel):
    name: str
    email: str
    age: int = 18


@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return UserRepository.create_user(db, user.dict())


@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = UserRepository.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
```

# 3. Session 生命周期管理

## 3.1 Session 线程安全策略

通过依赖注入系统保证每个请求独立会话：

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 3.2 事务管理最佳实践

```python
def transfer_funds(db: Session, from_id: int, to_id: int, amount: float):
    try:
        from_user = UserRepository.get_user(db, from_id)
        to_user = UserRepository.get_user(db, to_id)

        if from_user.balance < amount:
            raise ValueError("Insufficient funds")

        from_user.balance -= amount
        to_user.balance += amount

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
```

# 4. 常见错误处理

## 4.1 422 请求验证错误

**示例场景**：

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "age"
      ],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```

**解决方案**：

1. 检查请求体是否匹配Pydantic模型定义
2. 使用OpenAPI文档进行测试
3. 添加中间件捕获验证错误：

```python
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors(), "body": exc.body},
    )
```

# 课后Quiz

**问题1**：以下哪种方式可以有效防止SQL注入攻击？
A) 使用字符串拼接SQL语句
B) 使用ORM的查询参数化功能
C) 在数据库连接字符串添加特殊参数
D) 禁用所有输入验证

**答案**：B) 正确。SQLAlchemy等ORM框架会自动进行参数化查询，将用户输入作为参数传递而不是直接拼接到SQL语句中。

**问题2**：为什么需要在finally块中关闭数据库会话？
A) 为了提升查询性能
B) 确保会话在任何情况下都会被正确关闭
C) 防止其他请求使用该会话
D) 满足数据库连接池的要求

**答案**：B) 正确。无论是否发生异常，finally块中的代码都会执行，保证会话资源的正确释放。

# 常见报错解决方案

**报错1
**：`sqlalchemy.exc.OperationalError: (pymysql.err.OperationalError) (2003, "Can't connect to MySQL server on 'localhost'")`

**原因分析**：

- 数据库服务未启动
- 连接参数（用户名/密码/端口）错误
- 网络防火墙阻止连接

**解决方案**：

1. 检查MySQL服务状态
2. 验证连接字符串参数
3. 使用telnet测试端口连通性
4. 添加连接超时参数：

```python
create_engine(connect_args={"connect_timeout": 10})
```

**报错2
**：`sqlalchemy.exc.InvalidRequestError: This Session's transaction has been rolled back due to a previous exception during flush.`

**原因分析**：

- 数据库操作违反约束（如唯一性约束）
- 事务未正确处理异常

**解决方案**：

1. 检查数据完整性约束
2. 在事务代码块中添加try/except
3. 执行显式回滚操作
4. 使用`session.expire_all()`重置会话状态

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI 表单参数与文件上传完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/378acc9ed556/)
- [FastAPI 请求体参数与 Pydantic 模型完全指南：从基础到嵌套模型实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/17872b9724be/)
- [FastAPI 查询参数完全指南：从基础到高级用法 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/361d6ce26859/)
-