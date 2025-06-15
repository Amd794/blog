----
title: FastAPI访问令牌的权限声明与作用域管理：你的API安全真的无懈可击吗？
date: 2025/06/15 06:32:07
updated: 2025/06/15 06:32:07
author: cmdragon

excerpt:
  FastAPI中，权限声明通过JWT令牌的`scopes`字段定义用户访问资源范围，如read、write、admin。使用`OAuth2PasswordBearer`配置令牌获取方式和作用域说明，`jwt`进行令牌编解码。通过依赖注入实现权限验证，确保用户访问特定端点时具备相应权限。常见错误包括422（缺少Authorization字段）和401（无效凭证），建议使用RSA非对称加密并定期轮换密钥。生产环境中，作用域管理可扩展至多租户系统和功能权限开关。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - 访问令牌
  - 权限声明
  - 作用域管理
  - JWT
  - 依赖注入
  - API安全

----

<img src="https://static.shutu.cn/shutu/jpeg/open90/2025/06/15/2945733707c7b5fca17ec9ccdcd7a98c.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[发现1000+提升效率与开发的AI工具和实用程序](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

## 第一章 FastAPI访问令牌的权限声明与作用域管理

### 1.1 权限声明的核心作用

在API安全体系中，权限声明（Claims）如同身份证上的信息，用于声明用户的访问权限。JWT令牌中的`scopes`
字段是最典型的权限声明，它定义了用户可以访问的资源范围（如read、write、admin）。

```python
from pydantic import BaseModel
from fastapi import Depends, FastAPI, Security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# 配置OAuth2方案
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={
        "read": "查看数据权限",
        "write": "修改数据权限",
        "admin": "管理员权限"
    }
)


# 用户模型
class User(BaseModel):
    username: str
    scopes: list[str] = []
```

### 1.2 作用域管理的实现逻辑

作用域管理可以通过依赖注入系统实现权限验证层级结构：

```python
# 权限验证依赖项
async def check_permissions(required_scope: str, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])
        user_scopes = payload.get("scopes", [])

        # 使用集合判断作用域包含关系
        if required_scope not in user_scopes:
            raise HTTPException(
                status_code=403,
                detail="权限不足"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="无效凭证"
        )
```

### 1.3 完整API案例实现

实现一个用户管理系统API，包含三种访问级别：

```python
app = FastAPI()


@app.post("/token")
async def login():
    # 实际项目应从数据库验证用户
    return {
        "access_token": jwt.encode(
            {"scopes": ["read", "write"]},
            "SECRET_KEY",
            algorithm="HS256"
        ),
        "token_type": "bearer"
    }


@app.get("/users/me")
async def read_user_me(
        current_user: dict = Depends(check_permissions("read"))
):
    return {"user": current_user}


@app.post("/users")
async def create_user(
        current_user: dict = Depends(check_permissions("write"))
):
    return {"status": "用户创建成功"}


@app.delete("/users/{user_id}")
async def delete_user(
        user_id: int,
        current_user: dict = Depends(check_permissions("admin"))
):
    return {"status": "用户已删除"}
```

#### 系统组件说明：

1. `OAuth2PasswordBearer`：配置API的令牌获取方式和作用域说明
2. `jwt`：使用HS256算法进行令牌编解码
3. `check_permissions`：通过依赖注入实现权限验证复用

### 1.4 课后Quiz

#### Q1：当用户令牌包含["read", "write"]作用域时，可以访问哪些端点？

A) 仅/users/me  
B) /users/me 和 /users  
C) 所有端点  
D) 仅/users

<details>
<summary>答案解析</summary>
正确答案：B<br>
read作用域允许访问/users/me端点，write作用域允许访问POST /users端点，但delete操作需要admin权限。
</details>

#### Q2：返回403 Forbidden的可能原因是什么？

A) 请求头缺少Authorization  
B) 令牌作用域不满足要求  
C) 数据库连接失败  
D) 请求体格式错误

<details>
<summary>答案解析</summary>
正确答案：B<br>
401错误对应认证失败，403表示已认证但权限不足，当令牌缺失必要作用域时触发。
</details>

### 1.5 常见报错解决指南

#### 错误1：422 Unprocessable Entity

```json
{
  "detail": [
    {
      "loc": [
        "header",
        "authorization"
      ],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**原因分析**：  
请求头缺少Authorization字段或格式错误

**解决方案**：

1. 检查请求头是否包含`Authorization: Bearer <token>`
2. 确认使用Postman等工具时未勾选错误认证方式
3. 在Swagger UI中点击"Authorize"按钮设置令牌

#### 错误2：401 Unauthorized

```json
{
  "detail": "Invalid authentication credentials"
}
```

**原因排查**：

1. 令牌过期时间检查
2. 验证令牌签名密钥是否匹配
3. 检查令牌算法是否与服务器配置一致

**预防建议**：

```python
# 建议的令牌生成配置
jwt.encode(
    {
        "sub": "user123",
        "scopes": ["read"],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    },
    "YOUR_SECRET_KEY",  # 推荐使用RSA256更安全
    algorithm="HS256"
)
```

### 1.6 部署注意事项

安装所需依赖：

```bash
pip install fastapi==0.68.0 
pip install pydantic==1.8.2 
pip install python-jose==3.3.0
pip install uvicorn==0.15.0
```

生产环境建议：

1. 使用RSA非对称加密替代HS256
2. 作用域名称采用统一命名规范（如resource:action）
3. 敏感操作开启双重认证
4. 定期轮换加密密钥

通过以上配置，开发者可以构建出符合OWASP安全标准的API权限控制系统。作用域管理方案不仅适用于用户角色，还可扩展至多租户系统、功能权限开关等复杂场景。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [如何在FastAPI中构建一个既安全又灵活的多层级权限系统？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/3c30ceb7d7fa/)
- [FastAPI如何用角色权限让Web应用安全又灵活？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/3f8813fdf899/)
- [FastAPI权限验证依赖项究竟藏着什么秘密？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/a918f4d412db/)
- [如何用FastAPI和Tortoise-ORM打造一个既高效又灵活的角色管理系统？ | cmdragon's Blog](https://blog.cmdragon.cn/posts/c8ac5399cf26/)
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
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
- 