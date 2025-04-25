----
title: 使用Tortoise-ORM和FastAPI构建评论系统
date: 2025/04/25 21:37:36
updated: 2025/04/25 21:37:36
author: cmdragon

excerpt:
  在models.py中定义了Comment模型，包含id、content、created_at、updated_at字段，并与User和Article模型建立外键关系。schemas.py中定义了CommentBase、CommentCreate、CommentUpdate和CommentResponse等Pydantic模型，用于数据验证和响应。路由层实现了创建、获取和删除评论的API，使用get_or_none处理不存在的评论，并捕获异常。测试接口通过requests进行创建和异常测试。常见报错包括外键约束失败、验证错误和事件循环未关闭，需检查外键值、请求体匹配和正确关闭事件循环。

categories:
  - 后端开发
  - FastAPI

tags:
  - Tortoise-ORM
  - Pydantic
  - FastAPI
  - 评论系统
  - 数据库模型
  - 数据验证
  - 接口测试

----

<img src="https://static.shutu.cn/shutu/jpeg/open3e/2025/04/25/e11adf11d682fc56231da7e699af1296.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 一、Tortoise-ORM模型定义

我们首先在models.py中定义评论模型：

```python
from tortoise.models import Model
from tortoise import fields


class Comment(Model):
    id = fields.IntField(pk=True)
    content = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    # 外键关系
    user = fields.ForeignKeyField('models.User', related_name='comments')
    article = fields.ForeignKeyField('models.Article', related_name='comments')

    class Meta:
        table = "comments"
        indexes = ("created_at", "user_id", "article_id")

    def __str__(self):
        return f"Comment {self.id} by {self.user.username}"
```

代码解析：

1. `auto_now_add`会在创建时自动记录时间
2. 通过`related_name`建立双向关联查询路径
3. 复合索引提升常用查询条件的效率
4. 继承Model基类获得ORM能力

# 二、Pydantic模型定义

在schemas.py中定义数据验证模型：

```python
from pydantic import BaseModel
from datetime import datetime


class CommentBase(BaseModel):
    content: str
    user_id: int
    article_id: int


class CommentCreate(CommentBase):
    pass


class CommentUpdate(BaseModel):
    content: str


class CommentResponse(CommentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
```

验证要点：

1. 创建模型继承自基础模型
2. 更新模型仅允许修改内容字段
3. 响应模型启用orm_mode以兼容ORM对象
4. 时间字段自动转换时间格式

# 三、路由层实现

核心路由实现在comments.py中：

```python
from fastapi import APIRouter, Depends, HTTPException
from .models import Comment
from .schemas import CommentCreate, CommentResponse

router = APIRouter(prefix="/comments", tags=["comments"])


@router.post("/", response_model=CommentResponse)
async def create_comment(comment: CommentCreate):
    try:
        comment_obj = await Comment.create(**comment.dict())
        return await CommentResponse.from_tortoise_orm(comment_obj)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"创建评论失败: {str(e)}"
        )


@router.get("/{comment_id}", response_model=CommentResponse)
async def get_comment(comment_id: int):
    comment = await Comment.get_or_none(id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    return comment


@router.delete("/{comment_id}")
async def delete_comment(comment_id: int):
    deleted_count = await Comment.filter(id=comment_id).delete()
    if not deleted_count:
        raise HTTPException(status_code=404, detail="评论不存在")
    return {"message": "评论删除成功"}
```

技术要点：

1. 使用`get_or_none`替代`get`避免直接抛出异常
2. 批量删除返回影响行数作为判断依据
3. 异常处理覆盖数据库操作的各种失败场景

# 四、测试接口

使用requests测试接口：

```python
import requests

BASE_URL = "http://localhost:8000/comments"


# 创建测试
def test_create_comment():
    data = {
        "content": "优质技术文章！",
        "user_id": 1,
        "article_id": 1
    }
    response = requests.post(BASE_URL, json=data)
    assert response.status_code == 200
    print(response.json())


# 异常测试
def test_invalid_user():
    data = {
        "content": "错误测试",
        "user_id": 999,
        "article_id": 1
    }
    response = requests.post(BASE_URL, json=data)
    assert response.status_code == 400
    print(response.json())
```

# 五、课后Quiz

1. 当查询不存在的评论ID时，应该返回什么HTTP状态码？
   A) 200
   B) 404
   C) 500
   D) 400

答案：B) 404。`get_or_none`方法会返回None，触发自定义的404异常

2. 如何实现评论的软删除功能？
   A) 直接删除数据库记录
   B) 添加is_deleted字段
   C) 使用数据库回收站功能
   D) 修改内容为"已删除"

答案：B) 添加布尔型is_deleted字段，查询时过滤已删除的记录

# 六、常见报错处理

1. 报错：`tortoise.exceptions.IntegrityError: FOREIGN KEY constraint failed`
   原因：尝试关联不存在的用户或文章ID
   解决：检查外键值是否存在，添加数据库约束

2. 报错：`pydantic.error_wrappers.ValidationError`
   原因：请求体缺少必填字段或字段类型错误
   解决：检查请求体是否匹配schema定义，使用try-except捕获验证错误

3. 报错：`RuntimeError: Event loop is closed`
   原因：异步操作未正确关闭
   解决：在main.py中添加关闭事件循环的hook：

```python
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

app = FastAPI()

register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["app.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
```

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [Pydantic Schema生成指南：自定义JSON Schema | cmdragon's Blog](https://blog.cmdragon.cn/posts/3bd5ffd5fdcb/)
- [Pydantic递归模型深度校验36计：从无限嵌套到亿级数据的优化法则 | cmdragon's Blog](https://blog.cmdragon.cn/posts/614488cbbf44/)
- [Pydantic异步校验器深：构建高并发验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6ed5f943c599/)
- [Pydantic根校验器：构建跨字段验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/60d359baeb6c/)
- [Pydantic配置继承抽象基类模式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/fa86615d7d3a/)
- [Pydantic多态模型：用鉴别器构建类型安全的API接口 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4ab129859b04/)
- [FastAPI性能优化指南：参数解析与惰性加载 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a281359d556b/)
- [FastAPI依赖注入：参数共享与逻辑复用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3b96477f5460/)
- [FastAPI安全防护指南：构建坚不可摧的参数处理体系 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1d6d61c6ff85/)
-