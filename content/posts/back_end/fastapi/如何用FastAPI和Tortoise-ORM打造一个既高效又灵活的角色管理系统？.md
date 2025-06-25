---
url: /posts/2b0a2003074eba56a6f6c57aa9690900/
title: 如何用FastAPI和Tortoise-ORM打造一个既高效又灵活的角色管理系统？
date: 2025-06-11T13:18:54+08:00
lastmod: 2025-06-11T13:18:54+08:00
author: cmdragon

summary:
  角色模型设计包含核心字段如唯一标识、角色名称、描述、启用状态和创建时间。权限关联通过多对多关系实现，角色与权限通过中间表关联。完整的CRUD接口包括创建角色、获取角色信息等操作。数据库关系映射实战展示了如何为角色分配权限。常见报错解决方案提供了初始化数据库和处理请求体字段错误的指导。

categories:
  - FastAPI

tags:
  - FastAPI
  - Tortoise-ORM
  - 角色模型
  - 权限管理
  - 数据库映射
  - CRUD接口
  - RBAC

---

<img src="https://static.shutu.cn/shutu/jpeg/open61/2025-06-11/60a10b526057dc76b88fe99927cca2f7.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 1. 角色模型设计与数据库关系映射实现

（使用FastAPI+Tortoise-ORM完整实现方案）

## 1.1 角色模型基础结构设计

在权限管理系统中，角色模型需要包含以下核心字段：

```python
# 环境要求：Python 3.8+, 安装依赖包
# pip install fastapi==0.78.0 tortoise-orm==0.19.3 pydantic==1.10.7

from tortoise.models import Model
from tortoise import fields


class Role(Model):
    # 角色唯一标识
    id = fields.IntField(pk=True)
    # 角色名称（唯一约束）
    name = fields.CharField(max_length=50, unique=True)
    # 角色描述信息
    description = fields.TextField()
    # 是否启用该角色
    is_active = fields.BooleanField(default=True)
    # 创建时间（自动记录）
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "auth_roles"
```

对应的Pydantic模型实现：

```python
from pydantic import BaseModel
from datetime import datetime


class RoleCreate(BaseModel):
    name: str
    description: str
    is_active: bool = True


class RoleResponse(RoleCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True  # 启用ORM模式
```

## 1.2 权限关联设计（多对多关系）

在角色模型中添加权限关联字段：

```python
class Permission(Model):
    id = fields.IntField(pk=True)
    code = fields.CharField(max_length=100, unique=True)  # 权限编码
    name = fields.CharField(max_length=50)  # 权限名称

    class Meta:
        table = "auth_permissions"


# 更新角色模型添加关联
class Role(Model):
    # ...原有字段保持不变...
    permissions = fields.ManyToManyField(
        "models.Permission",
        related_name="roles",
        through="role_permissions"  # 中间表名称
    )
```

## 1.3 完整CRUD接口实现

创建FastAPI路由操作：

```python
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/roles", tags=["角色管理"])


@router.post("", response_model=RoleResponse)
async def create_role(role: RoleCreate):
    # 检查角色是否存在
    if await Role.exists(name=role.name):
        raise HTTPException(400, "角色已存在")

    # 创建新角色
    role_obj = await Role.create(**role.dict())
    return await RoleResponse.from_tortoise_orm(role_obj)


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: int):
    role = await Role.get_or_none(id=role_id).prefetch_related("permissions")
    if not role:
        raise HTTPException(404, "角色不存在")
    return role
```

## 1.4 数据库关系映射实战

为角色分配权限的完整示例：

```python
@router.post("/{role_id}/permissions")
async def assign_permission(role_id: int, permission_id: int):
    role = await Role.get_or_none(id=role_id)
    permission = await Permission.get_or_none(id=permission_id)

    if not (role and permission):
        raise HTTPException(404, "角色或权限不存在")

    # 添加关联关系
    await role.permissions.add(permission)
    return {"msg": "权限分配成功"}
```

执行创建请求示例：

```bash
curl -X POST http://localhost:8000/roles \
-H "Content-Type: application/json" \
-d '{"name":"admin","description":"系统管理员"}'
```

## 1.5 课后Quiz

**问题1**：当尝试创建重复角色名称时，系统会抛出什么HTTP状态码？  
A) 200 B) 400 C) 401 D) 404

**答案与解析**：B) 400  
代码中使用了`Role.exists()`检查角色唯一性，当发现重复时会主动抛出400 Bad Request异常，告知客户端请求参数存在问题。

---

## 1.6 常见报错解决方案

**报错1**：`tortoise.exceptions.OperationalError: no such table: auth_roles`

- **原因**：数据库未正确初始化
- **解决方案**：

```python
# 在应用启动时添加初始化代码
from tortoise import Tortoise


async def init_db():
    await Tortoise.init(
        db_url='sqlite://db.sqlite3',
        modules={'models': ['your_module']}  # 替换为实际模型所在模块
    )
    await Tortoise.generate_schemas()
```

**报错2**：`422 Unprocessable Entity` 在创建角色时

- **原因**：请求体字段不符合Pydantic模型要求
- **排查步骤**：
    1. 检查请求头是否包含`Content-Type: application/json`
    2. 验证请求体字段是否完整且类型正确
    3. 使用OpenAPI文档进行测试（访问`/docs`端点）

---

通过本文实现的角色管理系统，开发者可以快速构建基于RBAC（基于角色的访问控制）的权限体系。实际部署时建议添加以下增强功能：

1. 添加批量权限分配接口
2. 实现角色继承机制
3. 结合JWT进行权限验证
4. 添加审计日志记录权限变更

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [JWT令牌如何在FastAPI中实现安全又高效的生成与验证？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/79b35f91fefe/)
- [你的密码存储方式是否在向黑客招手？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/5eaec1519e8c/)
- [如何在FastAPI中轻松实现OAuth2认证并保护你的API？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/a1070c09af14/)
- [FastAPI安全机制：从OAuth2到JWT的魔法通关秘籍 | cmdragon's Blog](https://blog.cmdragon.cn/posts/62ff5d35e235/)
- [FastAPI认证系统：从零到令牌大师的奇幻之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/209b68f4f80b/)
- [FastAPI安全异常处理：从401到422的奇妙冒险 | cmdragon's Blog](https://blog.cmdragon.cn/posts/48d0eea47030/)
- [FastAPI权限迷宫：RBAC与多层级依赖的魔法通关秘籍 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ac15f0972638/)
- [JWT令牌：从身份证到代码防伪的奇妙之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ec3aa76fc0de/)
- [FastAPI安全认证：从密码到令牌的魔法之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4541d035d084/)
- [密码哈希：Bcrypt的魔法与盐值的秘密 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e1b940e13b4d/)
- [用户认证的魔法配方：从模型设计到密码安全的奇幻之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/15de786fd044/)
- [FastAPI安全门神：OAuth2PasswordBearer的奇妙冒险 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bbb2f2716edb/)
- [OAuth2密码模式：信任的甜蜜陷阱与安全指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4054bb761a12/)
- [API安全大揭秘：认证与授权的双面舞会 | cmdragon's Blog](https://blog.cmdragon.cn/posts/547a7e3d7ac7/)
- [异步日志监控：FastAPI与MongoDB的高效整合之道 | cmdragon's Blog](https://blog.cmdragon.cn/posts/4a29b618aa59/)
- [FastAPI与MongoDB分片集群：异步数据路由与聚合优化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/6455cdef0c41/)
- [FastAPI与MongoDB Change Stream的实时数据交响曲 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3c81964d922c/)
- [地理空间索引：解锁日志分析中的位置智慧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b933afc93ab1/)
- [异步之舞：FastAPI与MongoDB的极致性能优化之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/73a07166228e/)
- [异步日志分析：MongoDB与FastAPI的高效存储揭秘 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f243ecf59662/)
- [MongoDB索引优化的艺术：从基础原理到性能调优实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2565cdc59f74/)
- [解锁FastAPI与MongoDB聚合管道的性能奥秘 | cmdragon's Blog](https://blog.cmdragon.cn/posts/714772e1fbe0/)
- [异步之舞：Motor驱动与MongoDB的CRUD交响曲 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bd24c2bf486f/)
- [异步之舞：FastAPI与MongoDB的深度协奏 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8d4b0186aaf6/)
- [数据库迁移的艺术：FastAPI生产环境中的灰度发布与回滚策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/67c49b3ab489/)
- [数据库迁移的艺术：团队协作中的冲突预防与解决之道 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c761e999ff26/)
- [驾驭FastAPI多数据库：从读写分离到跨库事务的艺术 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1129cda88dea/)
- [数据库事务隔离与Alembic数据恢复的实战艺术 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e878319e1f7e/)
- [FastAPI与Alembic：数据库迁移的隐秘艺术 | cmdragon's Blog](https://blog.cmdragon.cn/posts/24aeaadbab78/)
- [飞行中的引擎更换：生产环境数据库迁移的艺术与科学 | cmdragon's Blog](https://blog.cmdragon.cn/posts/944b5aca784d/)
- [Alembic迁移脚本冲突的智能检测与优雅合并之道 | cmdragon's Blog](https://blog.cmdragon.cn/posts/24dfbc5f2148/)
- [多数据库迁移的艺术：Alembic在复杂环境中的精妙应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/91ba0550aa71/)
- [数据库事务回滚：FastAPI中的存档与读档大法 | cmdragon's Blog](https://blog.cmdragon.cn/posts/55a63eaa29d3/)
- [Alembic迁移脚本：让数据库变身时间旅行者 | cmdragon's Blog](https://blog.cmdragon.cn/posts/24a6445f18ef/)
- [数据库连接池：从银行柜台到代码世界的奇妙旅程 | cmdragon's Blog](https://blog.cmdragon.cn/posts/57d1e2810a31/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
- 