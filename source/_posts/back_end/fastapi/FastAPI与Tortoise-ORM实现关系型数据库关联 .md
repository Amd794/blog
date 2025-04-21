----
title: FastAPI与Tortoise-ORM实现关系型数据库关联
date: 2025/04/21 10:51:41
updated: 2025/04/21 10:51:41
author: cmdragon

excerpt:
  FastAPI与Tortoise-ORM结合实现关系型数据库关联，支持1:1、1:N和M:N关系。1:N关系通过`ForeignKeyField`定义，M:N关系使用`ManyToManyField`处理。Pydantic模型用于数据验证和序列化，路由实现中通过`prefetch_related`优化查询性能。M:N关系通过中间表操作，支持复杂查询。常见报错包括422验证错误和外键约束失败，可通过事务和类型检查解决。安装依赖后，使用uvicorn启动服务进行测试。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - Tortoise-ORM
  - 关系型数据库
  - 1:N关系
  - M:N关系
  - 异步数据库操作
  - 数据库关联实现

----

<img src="https://static.shutu.cn/shutu/jpeg/open3a/2025/04/21/a32558b89ccfb655042065f22b8f0a8f.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

# 一、FastAPI与Tortoise-ORM关系型数据库关联实现

## 1. 关系型数据库关联基础

在关系型数据库中，表与表之间的关联主要分为三种类型：

- **1:1关系**（如用户与身份证）
- **1:N关系**（如作者与书籍）
- **M:N关系**（如学生与课程）

FastAPI通过Tortoise-ORM实现异步数据库操作时，使用`ForeignKeyField`和`ManyToManyField`
字段类型处理关联关系。相比同步ORM，异步实现需要特别注意await的使用和查询优化。

## 2. 1:N关系实现（作者与书籍案例）

### 2.1 模型定义

```python
# models.py
from tortoise.models import Model
from tortoise import fields


class Author(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    # 反向关系查询字段
    books = fields.ReverseRelation["Book"]


class Book(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    author = fields.ForeignKeyField(
        "models.Author",
        related_name="books",
        on_delete=fields.CASCADE
    )
```

### 2.2 Pydantic模型

```python
# schemas.py
from pydantic import BaseModel


class AuthorCreate(BaseModel):
    name: str


class BookCreate(BaseModel):
    title: str
    author_id: int


class AuthorOut(BaseModel):
    id: int
    name: str
    books: list[dict] = []

    class Config:
        orm_mode = True
```

### 2.3 路由实现

```python
# main.py
from fastapi import FastAPI, HTTPException
from models import Author, Book
from schemas import AuthorCreate, BookCreate, AuthorOut

app = FastAPI()


@app.post("/authors/", response_model=AuthorOut)
async def create_author(author: AuthorCreate):
    db_author = await Author.create(**author.dict())
    return await AuthorOut.from_tortoise_orm(db_author)


@app.get("/authors/{author_id}", response_model=AuthorOut)
async def get_author(author_id: int):
    author = await Author.get(id=author_id).prefetch_related("books")
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return await AuthorOut.from_tortoise_orm(author)
```

## 3. M:N关系实现（学生与课程案例）

### 3.1 模型定义

```python
# models.py
class Student(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    courses = fields.ManyToManyField(
        "models.Course",
        related_name="students",
        through="student_course"
    )


class Course(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
```

### 3.2 中间表操作

```python
# 添加选课关系
student = await Student.get(id=1)
course = await Course.get(id=2)
await student.courses.add(course)

# 查询学生选课
student_with_courses = await Student.get(id=1).prefetch_related("courses")
```

### 3.3 复杂查询示例

```python
# 查询选修数学课的学生
math_students = await Student.filter(
    courses__name="Math"
).prefetch_related("courses")
```

## 4. 课后Quiz

**Q1：当建立1:N关系时，为什么要使用prefetch_related()方法？**
A. 提高查询性能
B. 避免循环引用
C. 处理分页请求
D. 验证数据格式

正确答案：A  
解析：prefetch_related()用于预加载关联数据，通过单次数据库查询获取所有相关记录，避免N+1查询问题，显著提升查询效率。

**Q2：M:N关系中，through参数的作用是什么？**
A. 定义中间表名称
B. 指定关联字段类型
C. 设置级联删除规则
D. 声明索引字段

正确答案：A  
解析：through参数用于自定义中间表名称，当需要向中间表添加额外字段时，可以显式创建中间模型。

## 5. 常见报错解决方案

**报错1：422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "author_id"
      ],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```

解决方法：

1. 检查请求体数据格式是否符合JSON规范
2. 确认字段类型与Pydantic模型定义一致
3. 使用try/except捕获类型转换异常

**报错2：IntegrityError外键约束失败**

```
sqlite3.IntegrityError: FOREIGN KEY constraint failed
```

解决方法：

1. 检查关联ID是否存在
2. 确认数据库事务完整性
3. 使用atomic()包裹关联操作：

```python
async with in_transaction():
    author = await Author.create(name="J.K. Rowling")
    await Book.create(title="Harry Potter", author=author)
```

**预防建议：**

1. 始终在数据库操作中使用事务
2. 为关联字段添加索引
3. 使用select_related和prefetch_related优化查询

## 运行准备

安装依赖：

```bash
pip install fastapi uvicorn tortoise-orm pydantic
```

启动服务：

```bash
uvicorn main:app --reload
```

通过以上实现，开发者可以完整掌握FastAPI中异步数据库关联操作的核心要点。建议在Postman中测试接口时，重点关注关联数据的完整性和查询效率表现。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI复杂查询终极指南：告别if-else的现代化过滤架构 | cmdragon's Blog](https://blog.cmdragon.cn/posts/63d68d803116/)
- [FastAPI 核心机制：分页参数的实现与最佳实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6a3cba67a72d/)
- [FastAPI 错误处理与自定义错误消息完全指南：构建健壮的 API 应用 🛠️ | cmdragon's Blog](https://blog.cmdragon.cn/posts/615a966b68d9/)
- [FastAPI 自定义参数验证器完全指南：从基础到高级实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c08aca091616/)
-