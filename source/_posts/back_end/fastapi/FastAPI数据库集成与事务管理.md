----
title: FastAPI数据库集成与事务管理
date: 2025/04/18 00:15:34
updated: 2025/04/18 00:15:34
author: cmdragon

excerpt:
  FastAPI与SQLAlchemy集成指南：首先配置SQLite数据库连接，创建会话工厂和声明性基类。定义用户模型并映射表结构，使用Pydantic进行数据验证。通过依赖项获取数据库会话，实现用户创建和转账功能。事务控制通过显式开始事务和错误处理确保数据一致性。常见问题包括422验证错误、500服务器错误和完整性错误，需检查请求体、数据库连接和约束。课后Quiz解答事务回滚、SQL注入防护和并发写操作处理。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - SQLAlchemy
  - 数据库集成
  - 事务管理
  - Pydantic
  - 错误处理
  - 并发控制

----

<img src="https://static.shutu.cn/shutu/jpeg/openc5/2025/04/18/b48f607e7f83258ad6352a4c6d5cd488.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# FastAPI数据库集成与事务管理完全指南

## 1. 环境准备与基础配置

在项目根目录创建`database.py`文件：

```python
# 安装依赖：pip install fastapi uvicorn sqlalchemy pydantic
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 配置SQLite数据库连接（生产环境建议使用PostgreSQL）
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True  # 显示生成的SQL语句
)

# 创建数据库会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明性基类
Base = declarative_base()
```

## 2. 模型定义与表结构映射

```python
from sqlalchemy import Column, Integer, String


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True)
    balance = Column(Integer, default=0)


# 创建数据库表（生产环境建议使用迁移工具）
Base.metadata.create_all(bind=engine)
```

## 3. Pydantic数据模型

```python
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    balance: int = 0


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    balance: int

    class Config:
        orm_mode = True  # 启用ORM模式转换
```

## 4. 路由与数据库操作

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


# 依赖项获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 显式开始事务
    transaction = db.begin()
    try:
        db_user = User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        transaction.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"创建用户失败: {str(e)}"
        )
```

## 5. 事务控制与错误处理

多操作事务示例：

```python
def transfer_funds(sender_id: int, receiver_id: int, amount: int, db: Session):
    transaction = db.begin()
    try:
        # 获取发送方账户
        sender = db.query(User).filter(User.id == sender_id).with_for_update().first()
        if not sender or sender.balance < amount:
            raise ValueError("余额不足或账户不存在")

        # 获取接收方账户
        receiver = db.query(User).filter(User.id == receiver_id).with_for_update().first()
        if not receiver:
            raise ValueError("接收方账户不存在")

        # 执行转账
        sender.balance -= amount
        receiver.balance += amount

        db.commit()
        return {"message": "转账成功"}

    except Exception as e:
        transaction.rollback()
        raise HTTPException(status_code=400, detail=str(e))
```

## 6. 常见报错解决方案

**问题1：422 Validation Error**

- 现象：请求参数验证失败
- 解决方法：
    1. 检查请求体是否符合Pydantic模型定义
    2. 使用Swagger UI测试接口
    3. 查看返回的detail字段中的具体错误信息

**问题2：500 Internal Server Error**

- 现象：数据库连接失败
- 解决方法：
    1. 检查数据库URL格式是否正确
    2. 验证数据库服务是否正常运行
    3. 检查数据库用户权限设置

**问题3：IntegrityError (sqlalchemy.exc.IntegrityError)**

- 现象：违反数据库约束
- 解决方法：
    1. 检查唯一性约束字段（如email）
    2. 验证外键关联是否存在
    3. 确保NOT NULL字段都有值

## 7. 课后Quiz

**Q1：以下哪种情况会导致事务自动回滚？**
A) 代码中显式调用commit()
B) 发生未捕获的异常
C) 使用with_for_update()
D) 调用refresh()方法

**正确答案：B**  
解析：当数据库操作过程中出现未捕获的异常时，SQLAlchemy会自动回滚当前事务，保证数据一致性。

**Q2：如何防止SQL注入攻击？**
A) 使用字符串拼接查询
B) 始终使用ORM查询方法
C) 手动转义特殊字符
D) 关闭数据库日志

**正确答案：B**  
解析：SQLAlchemy的ORM系统会自动处理参数化查询，避免直接拼接SQL语句，从根本上防止SQL注入。

**Q3：什么情况下需要使用with_for_update()？**
A) 需要提高查询性能
B) 处理并发写操作
C) 创建数据库索引
D) 执行批量插入

**正确答案：B**  
解析：with_for_update()在事务中锁定查询行，防止其他事务修改，用于处理需要保证数据一致性的并发写操作场景。

通过本文的学习，您应该已经掌握FastAPI集成SQLAlchemy的核心方法，理解事务控制原理，并能够处理常见的数据库操作问题。建议在实际项目中结合Alembic进行数据库迁移管理，并配置连接池优化性能。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI 表单参数与文件上传完全指南：从基础到高级实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/378acc9ed556/)
-