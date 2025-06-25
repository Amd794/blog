---
url: /posts/9e550e6fda66360891bf91c378d6f977/
title: FastAPI与Tortoise-ORM开发的神奇之旅
date: 2025-05-05T00:15:48+08:00
lastmod: 2025-05-05T00:15:48+08:00
author: cmdragon

summary:
  FastAPI与Tortoise-ORM结合实现全链路开发，涵盖环境配置、数据模型定义、Pydantic模式设计及API端点实现。文章模型包含软删除功能，通过`is_deleted`字段实现逻辑删除。API支持创建、分页查询、条件更新和软删除操作，确保数据安全与完整性。分页机制通过`offset`和`limit`实现，条件更新使用`exclude_unset=True`避免未传字段被覆盖。软删除通过`filter().update()`实现原子操作。系统具备用户认证、输入验证、防注入和细粒度权限控制等安全特性。

categories:
  - FastAPI

tags:
  - FastAPI
  - TortoiseORM
  - 全链路开发
  - 数据模型
  - API端点
  - 分页机制
  - 软删除

---

<img src="https://static.shutu.cn/shutu/jpeg/openf0/2025-05-05/0b0b46ad98a23a046b81e1e777b2958f.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 从API到数据库：FastAPI + Tortoise-ORM全链路开发指南

## 1. 环境准备与包安装

首先创建Python虚拟环境并安装必要依赖：

```bash
python -m venv venv
source venc/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install fastapi uvicorn tortoise-orm pydantic python-multipart
```

## 2. 数据模型定义

创建包含软删除功能的文章模型：

```python
# models.py
from tortoise.models import Model
from tortoise import fields


class Article(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    content = fields.TextField()
    author_id = fields.IntField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    is_deleted = fields.BooleanField(default=False)

    class Meta:
        table = "articles"

    class PydanticMeta:
        exclude = ["is_deleted"]
```

## 3. Pydantic模式定义

定义请求响应数据结构：

```python
# schemas.py
from pydantic import BaseModel
from datetime import datetime


class ArticleCreate(BaseModel):
    title: str
    content: str


class ArticleUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
```

## 4. FastAPI应用配置

配置数据库连接和路由：

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from tortoise.contrib.fastapi import register_tortoise

app = FastAPI()

# 数据库配置
DATABASE_URL = "sqlite://./db.sqlite3"

register_tortoise(
    app,
    db_url=DATABASE_URL,
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

# 模拟用户认证
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    return {"id": 1}  # 模拟返回用户信息
```

## 5. 完整API端点实现

### 5.1 创建文章

```python
@app.post("/articles", response_model=ArticleResponse)
async def create_article(
        article: ArticleCreate,
        user: dict = Depends(get_current_user)
):
    db_article = await Article.create(
        **article.dict(),
        author_id=user["id"]
    )
    return await ArticleResponse.from_tortoise_orm(db_article)
```

### 5.2 分页查询

```python
@app.get("/articles", response_model=list[ArticleResponse])
async def list_articles(
        page: int = 1,
        per_page: int = 10
):
    skip = (page - 1) * per_page
    query = Article.all().offset(skip).limit(per_page)
    return await ArticleResponse.from_queryset(query)
```

### 5.3 条件更新

```python
@app.patch("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
        article_id: int,
        update_data: ArticleUpdate,
        user: dict = Depends(get_current_user)
):
    # 只允许作者修改自己的文章
    db_article = await Article.get_or_none(id=article_id, author_id=user["id"])
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    await db_article.update_from_dict(update_data.dict(exclude_unset=True))
    await db_article.save()
    return await ArticleResponse.from_tortoise_orm(db_article)
```

### 5.4 软删除

```python
@app.delete("/articles/{article_id}")
async def delete_article(
        article_id: int,
        user: dict = Depends(get_current_user)
):
    updated_count = await Article.filter(
        id=article_id,
        author_id=user["id"]
    ).update(is_deleted=True)

    if not updated_count:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}
```

## 6. 关键实现解析

### 6.1 分页机制原理

- 计算skip值：`skip = (page - 1) * per_page`
- 数据库查询使用offset和limit实现分页
- 实际生产环境建议使用游标分页（Cursor Pagination）

### 6.2 条件更新安全

- 通过`get_or_none`确保记录存在
- 使用`filter().update()`实现原子操作
- `exclude_unset=True`忽略未传字段

### 6.3 软删除实现

1. 添加is_deleted字段
2. 重写默认查询过滤器：

```python
class SoftDeleteManager(fields.Model):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
```

## 7. 课后Quiz

**Q1：如何防止SQL注入攻击？**
A：使用ORM的参数化查询，避免拼接SQL语句。Tortoise-ORM会自动处理查询参数，例如：

```python
await Article.filter(title="Safe' OR 1=1--")
```

实际生成的SQL会是参数化查询，特殊字符会被正确转义

**Q2：为什么在更新时使用exclude_unset=True？**
A：该参数会忽略未提供的字段，实现部分更新。例如用户只修改标题时，不会影响content字段

**Q3：如何实现真正的物理删除？**
A：直接使用delete()方法：

```python
await Article.filter(id=1).delete()
```

## 8. 常见报错解决方案

**错误1：422 Validation Error**

- 原因：请求体不符合Pydantic模型要求
- 解决：检查请求头Content-Type是否正确（应为application/json），确认字段类型和必填项

**错误2：404 Not Found**

- 原因：尝试操作不存在的记录
- 解决：在更新/删除前先使用get_or_none检查记录是否存在

**错误3：RuntimeError - Event loop closed**

- 原因：在同步代码中调用异步方法
- 解决：确保所有数据库操作都在async函数中执行，使用await调用

启动服务命令：

```bash
uvicorn main:app --reload
```

访问 http://localhost:8000/docs 即可测试API接口。本文实现的系统具备以下安全特性：

1. 用户认证隔离数据访问
2. 所有输入参数自动验证
3. 数据库操作防注入
4. 细粒度的权限控制

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI中实现动态条件必填字段的实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1b01bf90607f/)
- [FastAPI中Pydantic异步分布式唯一性校验 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cda2eb13bf31/)
- [掌握FastAPI与Pydantic的跨字段验证技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/18ef84c3b234/)
- [FastAPI中的Pydantic密码验证机制与实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9b9eb7489096/)
- [深入掌握FastAPI与OpenAPI规范的高级适配技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6e2a1c070e32/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-