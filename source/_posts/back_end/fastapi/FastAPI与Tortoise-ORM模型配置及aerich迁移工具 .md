----
title: FastAPI与Tortoise-ORM模型配置及aerich迁移工具
date: 2025/04/30 00:11:45
updated: 2025/04/30 00:11:45
author: cmdragon

excerpt:
  FastAPI中使用Tortoise-ORM时，模型类通过继承`tortoise.models.Model`并定义`class Meta`来映射数据库字段。元数据配置包括表名、schema、表注释和联合唯一约束等。初始化数据库连接推荐使用`lifespan`事件处理，配置参数包括数据库URL、模型模块路径等。aerich迁移工具用于管理数据库迁移，通过`init-db`、`migrate`和`upgrade`等命令实现迁移文件的生成和应用。常见问题包括模型注册失败和迁移文件冲突，需检查模型路径和清除冲突文件。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - Tortoise-ORM
  - 数据库迁移
  - aerich工具
  - 模型元数据
  - 数据库初始化
  - 常见问题解决方案

----

<img src="https://static.shutu.cn/shutu/jpeg/openf0/2025/04/30/91b7f72f2939f2e0dc1f747d386e4e5d.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第一章：模型类元数据配置基础

## 1.1 模型定义与元数据

在FastAPI中使用Tortoise-ORM时，模型类通过Python类属性与数据库字段建立映射关系。每个模型类必须继承自`tortoise.models.Model`
，并通过`class Meta`定义元数据：

```python
from tortoise.models import Model
from tortoise import fields


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "auth_users"
        table_description = "系统用户数据表"
        schema = "public"
        unique_together = (("username", "email"),)
```

代码解析：

- `table`：指定物理表名称（默认使用类名小写）
- `schema`：数据库schema（适用于PostgreSQL）
- `table_description`：表注释（生成DDL语句时会包含）
- `unique_together`：联合唯一约束

## 1.2 Tortoise-ORM初始化配置

在FastAPI启动时初始化数据库连接，推荐使用`lifespan`事件处理：

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from tortoise import Tortoise


@asynccontextmanager
async def lifespan(app: FastAPI):
    await Tortoise.init(
        db_url='postgres://user:pass@localhost:5432/mydb',
        modules={'models': ['app.models']},
        _create_db=True
    )
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()


app = FastAPI(lifespan=lifespan)
```

关键参数说明：

- `modules`：指定模型所在模块路径
- `_create_db`：自动创建数据库（仅限开发环境）
- `generate_schemas`：自动生成数据库表结构

# 第二章：aerich迁移工具实战

## 2.1 aerich安装与初始化

安装命令：

```bash
pip install aerich
```

初始化迁移环境：

```bash
aerich init -t app.config.TORTOISE_ORM
aerich init-db
```

在项目根目录创建`aerich_config.py`：

```python
TORTOISE_ORM = {
    "connections": {"default": "postgres://user:pass@localhost:5432/mydb"},
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        }
    },
}
```

## 2.2 迁移操作流程

1. 创建迁移文件：

```bash
aerich migrate --name add_user_table
```

2. 查看未应用的迁移：

```bash
aerich show migrations
```

3. 执行升级：

```bash
aerich upgrade
```

4. 回滚变更：

```bash
aerich downgrade -v -1
```

## 2.3 迁移文件示例

生成的迁移文件`migrations/20231111_1200_add_user_table.sql`：

```sql
-- upgrade --
CREATE TABLE "auth_users"
(
    "id"         SERIAL      NOT NULL PRIMARY KEY,
    "username"   VARCHAR(50) NOT NULL UNIQUE,
    "created_at" TIMESTAMP   NOT NULL
);
COMMENT
ON TABLE "auth_users" IS '系统用户数据表';
-- downgrade --
DROP TABLE "auth_users";
```

# 第三章：常见问题解决方案

## 3.1 模型注册失败

错误现象：
`tortoise.exceptions.ConfigurationError: No models in config`

解决方案：

1. 检查`aerich_config.py`中的模型路径是否包含实际模型文件
2. 确认`__init__.py`文件中已导入模型类
3. 确保`aerich migrate`命令在项目根目录执行

## 3.2 迁移文件冲突

错误现象：
`aerich.exceptions.MigrationConflictError: Duplicate migration version`

处理步骤：

1. 删除`migrations`目录下冲突的迁移文件
2. 清空数据库中的`aerich`表记录
3. 重新生成迁移文件

# 课后Quiz

1. 在模型类Meta配置中，table和schema参数有什么区别？
   A) table定义逻辑表名，schema定义物理存储位置  
   B) table定义物理表名，schema定义数据库模式  
   C) 两者可以互换使用  
   D) schema用于定义索引结构

**答案：B**  
解析：table参数指定数据库中的实际表名，schema用于定义数据库模式（如PostgreSQL的schema），两者共同决定表的物理存储位置。

2. 使用aerich进行数据库迁移的正确步骤是：
   A) init-db → migrate → upgrade  
   B) migrate → init-db → upgrade  
   C) upgrade → migrate → init-db  
   D) init-db → upgrade → migrate

**答案：A**  
解析：正确流程为初始化数据库（init-db）、生成迁移文件（migrate）、应用变更（upgrade）。需先初始化迁移环境才能生成有效的迁移文件。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [Pydantic Schema生成指南：自定义JSON Schema | cmdragon's Blog](https://blog.cmdragon.cn/posts/3bd5ffd5fdcb/)
- [Pydantic递归模型深度校验36计：从无限嵌套到亿级数据的优化法则 | cmdragon's Blog](https://blog.cmdragon.cn/posts/614488cbbf44/)
- [Pydantic异步校验器深：构建高并发验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6ed5f943c599/)
- [Pydantic根校验器：构建跨字段验证系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/60d359baeb6c/)
-