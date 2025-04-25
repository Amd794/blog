----
title: FastAPI与SQLAlchemy数据库集成
date: 2025/04/17 15:33:34
updated: 2025/04/17 15:33:34
author: cmdragon

excerpt:
  FastAPI与SQLAlchemy的集成通过创建虚拟环境、安装依赖、配置数据库连接、定义数据模型和实现路由来完成。核心模块包括数据库引擎、会话工厂和声明性基类。数据模型通过SQLAlchemy定义，路由通过FastAPI实现，支持创建和查询用户。测试接口通过curl命令进行，常见报错包括表不存在、请求体验证错误和会话不可用。高级配置涉及连接池优化和单元测试。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - SQLAlchemy
  - 数据库集成
  - 依赖注入
  - 数据模型
  - 错误处理
  - 单元测试

----

<img src="https://static.shutu.cn/shutu/jpeg/open43/2025/04/17/7bcb63bb7fb5fdcff22f284e02d62ced.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 1. FastAPI与SQLAlchemy同步数据库集成实战

## 1.1 项目初始化与依赖安装

在项目根目录执行以下命令创建虚拟环境并安装依赖：

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows
pip install fastapi sqlalchemy uvicorn
```

## 1.2 数据库配置核心模块

创建`database.py`文件：

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 数据库连接配置（使用SQLite示例）
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# 创建数据库引擎（关闭SQLite连接池检查）
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# 会话工厂（关闭自动提交，启用自动刷新）
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 声明性基类
Base = declarative_base()


def get_db():
    """数据库会话依赖生成器"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 1.3 数据模型定义

创建`models.py`文件：

```python
from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True)
```

## 1.4 依赖注入与路由集成

在`main.py`中实现：

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import User
from database import get_db, engine
from pydantic import BaseModel

# 初始化数据库表结构
Base.metadata.create_all(bind=engine)

app = FastAPI()


# Pydantic请求模型
class UserCreate(BaseModel):
    name: str
    email: str


@app.post("/users/")
def create_user(
        user: UserCreate,
        db: Session = Depends(get_db)
):
    """创建用户路由"""
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}")
def read_user(
        user_id: int,
        db: Session = Depends(get_db)
):
    """获取用户详情"""
    user = db.query(User).filter(User.id == user_id).first()
    return user
```

## 1.5 运行与测试

启动服务：

```bash
uvicorn main:app --reload
```

测试接口：

```bash
# 创建用户
curl -X POST "http://localhost:8000/users/" \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com"}'

# 查询用户
curl "http://localhost:8000/users/1"
```

## 1.6 课后Quiz

**问题1：** 当数据库查询返回None时，如何优化API响应？

**答案解析：** 推荐使用FastAPI的HTTPException返回404状态码：

```python
from fastapi import HTTPException


@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

**问题2：** 如何实现数据库事务回滚？

**答案解析：** 在依赖注入中使用try-except块：

```python
@app.post("/orders/")
def create_order(db: Session = Depends(get_db)):
    try:
        # 数据库操作
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
```

## 1.7 常见报错处理

**报错1：** `sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: users`

**解决方案：**

1. 确认已执行`Base.metadata.create_all(bind=engine)`
2. 检查数据库文件路径是否正确
3. 删除旧数据库文件重新生成

**报错2：** `pydantic.error_wrappers.ValidationError: 1 validation error`

**解决方案：**

1. 检查请求体是否与Pydantic模型定义匹配
2. 验证字段类型和约束条件
3. 使用curl测试时添加`-H "Content-Type: application/json"`

**报错3：** `RuntimeError: Session is not available`

**解决方案：**

1. 确认路由函数正确使用Depends(get_db)
2. 检查数据库连接配置是否正确
3. 确保没有在路由外直接调用get_db()

## 1.8 高级配置技巧

### 连接池优化

```python
# 配置MySQL连接池示例
engine = create_engine(
    "mysql+pymysql://user:password@localhost/dbname",
    pool_size=20,
    max_overflow=0,
    pool_recycle=3600
)
```

### 请求生命周期示意图

```
客户端请求 -> 路由处理 -> 创建数据库会话 -> 业务处理 -> 提交事务 -> 关闭会话
                      │                      │
                      └── 异常时回滚事务 ────┘
```

### 单元测试配置

```python
# 测试用例示例
from fastapi.testclient import TestClient


def test_create_user():
    client = TestClient(app)
    response = client.post("/users/", json={
        "name": "Test User",
        "email": "test@example.com"
    })
    assert response.status_code == 200
    assert "id" in response.json()
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI 请求体参数与 Pydantic 模型完全指南：从基础到嵌套模型实战 🚀 | cmdragon's Blog](https://blog.cmdragon.cn/posts/17872b9724be/)
-