----
title: DDD分层设计与异步职责划分：让你的代码不再“异步”混乱
date: 2025/05/04 00:18:53
updated: 2025/05/04 00:18:53
author: cmdragon

excerpt:
  DDD分层架构将系统分为用户接口层、应用层、领域层和基础设施层，各层职责明确。领域层处理同步业务逻辑，基础设施层负责异步数据库操作，应用层协调两者。评论模块使用pydantic定义领域模型，保持业务逻辑完整性。Tortoise-ORM实现基础设施层的异步仓储操作。应用层整合领域逻辑与基础设施的异步调用，确保事务管理策略通过原子操作实现。分层调用规则强调领域对象不包含await调用，仓储接口定义在领域层，实现在基础设施层。

categories:
  - 后端开发
  - FastAPI

tags:
  - DDD分层架构
  - 异步编程
  - FastAPI
  - 领域驱动设计
  - Tortoise-ORM
  - 事务管理
  - 代码示例

----

<img src="https://static.shutu.cn/shutu/jpeg/open40/2025/05/04/8c0e943689688158f624cd829c58ee70.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第一章：DDD分层设计与异步职责划分

## 1.1 DDD分层架构解析

领域驱动设计（DDD）将系统分为四层：用户接口层、应用层、领域层和基础设施层。在FastAPI异步架构中，各层职责需要特别关注异步处理边界：

- **领域层**：包含纯业务逻辑（同步）
- **基础设施层**：处理数据库操作（异步）
- 应用层作为协调者，负责调用领域服务和基础设施的异步方法

架构示例：

```python
# 同步领域服务
class CommentService:
    def validate_comment(self, content: str):
        """领域层保持同步逻辑"""
        if len(content) > 1000:
            raise ValueError("评论内容过长")
        # 其他业务规则...


# 异步基础设施
class CommentRepository:
    async def save(self, comment):
        """基础设施层处理异步IO"""
        await comment.save()
```

## 1.2 评论模块领域模型设计

使用pydantic定义领域模型，保持业务逻辑完整性：

```python
from pydantic import BaseModel, Field
from datetime import datetime


class User(BaseModel):
    id: int
    username: str = Field(..., max_length=50)


class Comment(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    author: User
    created_at: datetime = datetime.now()

    def edit(self, new_content: str):
        """领域方法保持同步"""
        if len(new_content) > 1000:
            raise ValueError("内容超过最大限制")
        self.content = new_content
        self.updated_at = datetime.now()
```

## 1.3 基础设施层实现

Tortoise-ORM仓储实现示例：

```python
from tortoise.models import Model
from tortoise import fields


class CommentDBModel(Model):
    """数据库模型"""
    id = fields.IntField(pk=True)
    content = fields.TextField()
    author_id = fields.IntField()
    created_at = fields.DatetimeField(auto_now_add=True)


class TortoiseCommentRepository:
    async def save(self, comment: Comment) -> int:
        """异步保存方法"""
        db_model = await CommentDBModel.create(
            content=comment.content,
            author_id=comment.author.id
        )
        return db_model.id

    async def get(self, comment_id: int) -> Comment:
        """异步查询方法"""
        db_model = await CommentDBModel.get(id=comment_id)
        return Comment(
            content=db_model.content,
            author=User(id=db_model.author_id, username=""),
            created_at=db_model.created_at
        )
```

## 1.4 应用层整合

协调领域逻辑与基础设施的异步调用：

```python
from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("/comments")
async def create_comment(
        comment: Comment,
        repo: TortoiseCommentRepository = Depends()
):
    # 调用同步领域验证
    CommentService().validate_comment(comment.content)

    # 异步保存操作
    comment_id = await repo.save(comment)
    return {"id": comment_id}
```

# 第二章：异步职责边界控制

## 2.1 分层调用规则

异步调用链示例：

```
HTTP请求 -> 路由层（async）-> 应用层（async）-> 领域层（sync）-> 基础设施层（async）
```

关键原则：

1. 领域对象不包含await调用
2. 仓储接口定义在领域层，实现在基础设施层
3. 应用服务负责编排异步流程

## 2.2 事务管理策略

使用Tortoise的原子事务：

```python
from tortoise.transactions import atomic


class CommentRepository:
    @atomic()
    async def create_with_user(self, comment: Comment, user: User):
        """事务操作示例"""
        await UserDBModel.create(id=user.id, username=user.username)
        await CommentDBModel.create(
            content=comment.content,
            author_id=user.id
        )
```

# 课后Quiz

**问题1**：为什么领域层的方法要保持同步？  
A. 简化异步编程复杂度  
B. 保证业务逻辑的原子性  
C. 提高代码执行速度  
D. 方便单元测试

**答案**：A  
解析：业务逻辑保持同步可以避免复杂的async/await处理，使领域模型更专注于业务规则本身。

**问题2**：在事务处理中应该在哪一层实现原子操作？  
A. 应用层调用基础设施层的原子方法  
B. 领域层直接处理事务  
C. 用户接口层控制事务边界  
D. 数据库自动处理所有事务

**答案**：A  
解析：事务属于基础设施实现细节，应用层通过调用基础设施提供的原子方法来管理事务。

# 常见报错解决方案

**422 Validation Error**  
现象：请求返回422状态码  
原因分析：

1. 请求体不符合pydantic模型定义
2. 字段类型不匹配或约束不满足  
   解决方法：
1. 检查请求JSON结构
2. 验证字段类型和长度限制
3. 使用try/except捕获ValidationError

**RuntimeError: Event loop is closed**  
原因：在同步方法中调用了异步代码  
解决方法：

1. 检查领域层是否混入了await调用
2. 确保所有异步操作都在async方法中执行
3. 使用asyncio.run()包装测试代码

**安装与运行**

```bash
# 环境要求
pip install fastapi uvicorn tortoise-orm pydantic

# 启动命令
uvicorn main:app --reload
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI中实现动态条件必填字段的实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1b01bf90607f/)
- [FastAPI中Pydantic异步分布式唯一性校验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cda2eb13bf31/)
- [掌握FastAPI与Pydantic的跨字段验证技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/18ef84c3b234/)
- [FastAPI中的Pydantic密码验证机制与实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9b9eb7489096/)
- [深入掌握FastAPI与OpenAPI规范的高级适配技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6e2a1c070e32/)
- [Pydantic字段元数据指南：从基础到企业级文档增强 | cmdragon's Blog](https://blog.cmdragon.cn/posts/11d2c39a300b/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-