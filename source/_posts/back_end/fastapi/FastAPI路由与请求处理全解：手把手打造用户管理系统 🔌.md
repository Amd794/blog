---
title: FastAPI路由与请求处理全解：手把手打造用户管理系统 🔌
date: 2025/3/2
updated: 2025/3/2
author: cmdragon

excerpt:
  通过咖啡店点单系统的生动案例，零基础掌握FastAPI路由核心机制。你将：</br> 用真实场景理解@app.get/@app.post等6种HTTP方法装饰器</br> 通过用户管理API实现完整CRUD操作</br> 学习路径参数与查询参数的进阶玩法</br> 获得防误操作锦囊（含参数校验/SQL注入防御方案）

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI路由实战
  - HTTP方法详解
  - 路径参数技巧
  - 查询参数进阶
  - 用户管理API
  - 请求处理陷阱
  - 新手友好教程
---

<img src="https://static.amd794.com/blog/images/2025_03_02 16_06_15.png@blog" title="2025_03_02 16_06_15.png" alt="2025_03_02 16_06_15.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)

🎯 通过**咖啡店点单系统**的生动案例，零基础掌握FastAPI路由核心机制。你将：

- 用真实场景理解`@app.get`/`@app.post`等**6种HTTP方法装饰器**
- 通过用户管理API实现**完整CRUD操作**
- 学习**路径参数**与**查询参数**的进阶玩法
- 获得**防误操作锦囊**（含参数校验/SQL注入防御方案）

#### 第一章：路由就像咖啡店电话转接 ☕

**1.1 基础路由结构**

```python
from fastapi import FastAPI

app = FastAPI()


# 简单GET路由
@app.get("/menu")
async def get_menu():
    return {"饮品": ["美式", "拿铁", "卡布奇诺"]}


# 带路径参数的GET路由
@app.get("/orders/{order_id}")
async def get_order(order_id: int):
    return {"订单号": order_id, "状态": "制作中"}
```

**1.2 HTTP方法对照表**  
| 方法 | 咖啡店比喻 | FastAPI装饰器 |
|-----------|---------------------|--------------------|
| GET | 查看菜单 | `@app.get`         |
| POST | 下单新订单 | `@app.post`        |
| PUT | 修改订单 | `@app.put`         |
| DELETE | 取消订单 | `app.delete`       |

---

#### 第二章：用户管理API实战 👥

**2.1 完整CRUD实现**

```python
from typing import List
from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str
    email: str


fake_db: List[User] = []


# 创建用户
@app.post("/users")
async def create_user(user: User):
    fake_db.append(user)
    return {"操作": "创建成功", "数据": user}


# 获取所有用户
@app.get("/users")
async def get_users():
    return fake_db


# 更新用户
@app.put("/users/{user_id}")
async def update_user(user_id: int, new_user: User):
    for index, user in enumerate(fake_db):
        if user.id == user_id:
            fake_db[index] = new_user
            return {"操作": "更新成功"}
    return {"错误": "用户不存在"}


# 删除用户
@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    global fake_db
    fake_db = [user for user in fake_db if user.id != user_id]
    return {"操作": "删除成功"}
```

**2.2 Swagger UI自动文档**  
访问 `http://localhost:8000/docs` 查看效果：

---

#### 第三章：参数处理黑科技 🔧

**3.1 路径参数 vs 查询参数**

```python
# 路径参数
@app.get("/products/{category}")
async def get_by_category(category: str):
    ...


# 查询参数
@app.get("/search")
async def search_products(keyword: str, limit: int = 10):
    ...
```

**3.2 参数校验技巧**

```python
from fastapi import Query


@app.get("/users")
async def filter_users(
        age: int = Query(..., ge=18, description="最小年龄"),
        is_vip: bool = Query(False)
):
    return [u for u in fake_db if u.age >= age and u.is_vip == is_vip]
```

---

#### 第四章：课后安全实验室 🔐

**任务1：修复SQL注入漏洞**

```python
# 危险代码
@app.get("/user/{name}")
async def get_user(name: str):
    query = f"SELECT * FROM users WHERE name = '{name}'"

# 你的任务：使用参数化查询改写
```

**任务2：添加分页功能**

```python
@app.get("/users")
async def get_users(
        page: int = Query(1, ge=1),
        size: int = Query(10, le=100)
):
    # 实现分页逻辑
    start = (page - 1) * size
    return fake_db[start:start + size]
```

---

### 常见错误诊疗室 🏥

| 错误现象                     | 原因          | 解决方案                  |
|--------------------------|-------------|-----------------------|
| `422 Validation Error`   | 参数类型不匹配     | 检查路径参数是否为int/查询参数是否必填 |
| `405 Method Not Allowed` | 使用错误的HTTP方法 | 确认路由装饰器与方法匹配          |
| `路由冲突`                   | 多个路由相同路径    | 确保路径+方法组合唯一           |

---

### 结语

现在运行 `uvicorn main:app --reload` 启动你的用户管理API吧！遇到问题随时查阅附带的**路由调试检查清单**，编码愉快！ 🚀

---



余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [HTTP协议与RESTful API实战手册（终章）：构建企业级API的九大秘籍 🔐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2d417c3e7cac/)
- [HTTP协议与RESTful API实战手册（二）：用披萨店故事说透API设计奥秘 🍕 | cmdragon's Blog](https://blog.cmdragon.cn/posts/074086de21be/)
- [从零构建你的第一个RESTful API：HTTP协议与API设计超图解指南 🌐 | cmdragon's Blog](https://blog.cmdragon.cn/posts/e5078a4d6fad/)
- [Python异步编程进阶指南：破解高并发系统的七重封印 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f49972bd19a6/)
- [Python异步编程终极指南：用协程与事件循环重构你的高并发系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b279dbab11eb/)
- [Python类型提示完全指南：用类型安全重构你的代码，提升10倍开发效率 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8f8db75c315d/)
- [三大平台云数据库生态服务对决 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d0b1b6a9f135/)
- [分布式数据库解析 | cmdragon's Blog](https://blog.cmdragon.cn/posts/91aae808d87e/)
- [深入解析NoSQL数据库：从文档存储到图数据库的全场景实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5fcc2532e318/)
- [数据库审计与智能监控：从日志分析到异常检测 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c971b2302602/)
- [数据库加密全解析：从传输到存储的安全实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/735fa4090f0b/)
- [数据库安全实战：访问控制与行级权限管理 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5c01d5c0a63b/)
- [数据库扩展之道：分区、分片与大表优化实战 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f71048cd61c/)
- [查询优化：提升数据库性能的实用技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/8e5e3ffe33dd/)
- [性能优化与调优：全面解析数据库索引 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3c6ba213efe2/)
- [存储过程与触发器：提高数据库性能与安全性的利器 | cmdragon's Blog](https://blog.cmdragon.cn/posts/84376403bdf0/)
- [数据操作与事务：确保数据一致性的关键 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f357e8ef59f1/)
- [深入掌握 SQL 深度应用：复杂查询的艺术与技巧 | cmdragon's Blog](https://blog.cmdragon.cn/posts/87c82dea0024/)
- [彻底理解数据库设计原则：生命周期、约束与反范式的应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3f3203c3e56b/)
- [深入剖析实体-关系模型（ER 图）：理论与实践全解析 | cmdragon's Blog](https://blog.cmdragon.cn/posts/91e1bf521e8c/)
- [数据库范式详解：从第一范式到第五范式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/05264e28f9f8/)
- [PostgreSQL：数据库迁移与版本控制 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a58cca68755e/)
- [Node.js 与 PostgreSQL 集成：深入 pg 模块的应用与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d5b4e82e959a/)
- [Python 与 PostgreSQL 集成：深入 psycopg2 的应用与实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9aae8e2f1414/)
- [应用中的 PostgreSQL项目案例 | cmdragon's Blog](https://blog.cmdragon.cn/posts/287f56043db8/)
- [数据库安全管理中的权限控制：保护数据资产的关键措施 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5995b8f15678/)
- [数据库安全管理中的用户和角色管理：打造安全高效的数据环境 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c0cd4cbaa201/)
- [数据库查询优化：提升性能的关键实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3ab8c2f85479/)
- [数据库物理备份：保障数据完整性和业务连续性的关键策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7e3da86fa38b/)
- [PostgreSQL 数据备份与恢复：掌握 pg_dump 和 pg_restore 的最佳实践 | cmdragon's Blog](https://blog.cmdragon.cn/posts/2190f85925ce/)
- [索引的性能影响：优化数据库查询与存储的关键 | cmdragon's Blog](https://blog.cmdragon.cn/posts/076f666ba145/)
- [深入探讨数据库索引类型：B-tree、Hash、GIN与GiST的对比与应用 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7f7df47953c4/)
- [深入探讨触发器的创建与应用：数据库自动化管理的强大工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/5765e6b13d4e/)
- [深入探讨存储过程的创建与应用：提高数据库管理效率的关键工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/98a999d55ec8/)
-


