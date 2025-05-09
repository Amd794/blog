----
title: 数据库事务回滚：FastAPI中的存档与读档大法
date: 2025/05/10 00:18:52
updated: 2025/05/10 00:18:52
author: cmdragon

excerpt:
  事务回滚机制确保数据库操作的原子性，适用于需要保持数据一致性的场景，如银行转账。FastAPI通过SQLAlchemy的session管理实现事务控制，使用上下文管理器处理事务，确保在异常时回滚。Alembic用于数据库版本控制，生成迁移脚本并管理多环境迁移策略。综合应用案例展示了用户注册时的事务处理，包括检查用户名唯一性、创建用户及其关联记录，并在异常时回滚。课后Quiz和常见报错解决提供了实际操作中的指导和问题处理方法。

categories:
  - 后端开发
  - FastAPI

tags:
  - 事务回滚
  - FastAPI
  - SQLAlchemy
  - Alembic
  - 数据库迁移
  - Web开发
  - Python

----

<img src="https://static.shutu.cn/shutu/jpeg/open08/2025/05/10/69ec9a799973f9e2614fd4d8e4583abe.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

1. 理解事务回滚机制

1.1 为什么需要事务回滚？
数据库事务回滚就像游戏中的存档机制，当执行某个任务失败时，可以回到任务开始前的状态。在Web开发中，当多个数据库操作需要保持原子性时（例如银行转账操作），事务回滚确保数据的一致性。

1.2 FastAPI中的事务实现
通过SQLAlchemy的session管理实现事务控制：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 创建数据库连接（使用SQLite示例）
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Pydantic模型
from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str


# 数据库模型
from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))
```

1.3 事务操作最佳实践
使用上下文管理器处理事务：

```python
def create_user_with_profile(user_data: UserCreate):
    db = SessionLocal()
    try:
        with db.begin():
            # 创建用户
            new_user = User(**user_data.dict())
            db.add(new_user)

            # 创建用户配置（假设需要原子操作）
            db.execute("INSERT INTO profiles (user_id) VALUES (:user_id)",
                       {"user_id": new_user.id})

            return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()
```

2. Alembic数据版本控制

2.1 迁移脚本生成
安装配置Alembic：

```bash
pip install alembic
alembic init migrations
```

修改alembic.ini：

```ini
sqlalchemy.url = sqlite:///./test.db
```

2.2 版本管理操作流程
生成新迁移脚本：

```bash
alembic revision -m "add phone_number column"
```

手动编辑生成的迁移文件：

```python
def upgrade():
    op.add_column('users',
                  Column('phone_number', String(20))
                  )


def downgrade():
    op.drop_column('users', 'phone_number')
```

2.3 多环境迁移策略
在CI/CD中处理不同环境：

```bash
# 生产环境迁移
ALEMBIC_CONFIG=prod_alembic.ini alembic upgrade head

# 回滚到指定版本
alembic downgrade -1
```

3. 综合应用案例

用户注册事务处理：

```python
from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("/register")
async def register_user(user: UserCreate):
    db = SessionLocal()
    try:
        with db.begin():
            # 检查用户名唯一性
            if db.query(User).filter(User.username == user.username).first():
                raise ValueError("Username already exists")

            # 创建用户
            new_user = User(**user.dict())
            db.add(new_user)

            # 创建关联记录
            profile_data = {"user_id": new_user.id, "status": "active"}
            db.execute(
                "INSERT INTO profiles (user_id, status) VALUES (:user_id, :status)",
                profile_data
            )

        return {"message": "Registration successful"}
    except ValueError as ve:
        db.rollback()
        return {"error": str(ve)}
    finally:
        db.close()
```

课后Quiz：
Q: 当执行alembic downgrade命令时，系统实际执行什么操作？
A: 系统会按照迁移脚本的downgrade函数定义执行数据库结构回退操作，每个版本的downgrade会逆序执行。

常见报错解决：
问题：alembic.util.exc.CommandError: Can't locate revision identified by 'xxxx'
解决步骤：

1. 检查migrations/versions目录是否存在对应版本的迁移文件
2. 执行alembic history查看版本链
3. 若存在断链，可删除alembic_version表后重新初始化

预防建议：
• 团队开发时统一管理迁移脚本
• 禁止手动修改数据库版本表
• 每次生成新迁移脚本后立即提交到版本控制系统

（完整示例代码需要安装fastapi, sqlalchemy, alembic等依赖，建议使用Python 3.8+环境，通过uvicorn main:app启动服务）

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [Alembic迁移脚本：让数据库变身时间旅行者 | cmdragon's Blog](https://blog.cmdragon.cn/posts/24a6445f18ef/)
- [数据库连接池：从银行柜台到代码世界的奇妙旅程 | cmdragon's Blog](https://blog.cmdragon.cn/posts/57d1e2810a31/)
- [点赞背后的技术大冒险：分布式事务与SAGA模式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/336930484b68/)
- [N+1查询：数据库性能的隐形杀手与终极拯救指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bd59ee70c62e/)
- [FastAPI与Tortoise-ORM开发的神奇之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9f5729db84ef/)
- [DDD分层设计与异步职责划分：让你的代码不再“异步”混乱 | cmdragon's Blog](https://blog.cmdragon.cn/posts/62012cf83e26/)
- [异步数据库事务锁：电商库存扣减的防超卖秘籍 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c195d6c4d0b5/)
- [FastAPI中的复杂查询与原子更新指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f0e851eb1a74/)
- [深入解析Tortoise-ORM关系型字段与异步查询 | cmdragon's Blog](https://blog.cmdragon.cn/posts/512d338e0833/)
- [FastAPI与Tortoise-ORM模型配置及aerich迁移工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7649fa5d5b04/)
- [异步IO与Tortoise-ORM的数据库 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c9824156400c/)
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
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-