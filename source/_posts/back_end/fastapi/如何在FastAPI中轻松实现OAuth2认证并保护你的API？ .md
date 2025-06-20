----
title: 如何在FastAPI中轻松实现OAuth2认证并保护你的API？
date: 2025/06/09 05:16:05
updated: 2025/06/09 05:16:05
author: cmdragon

excerpt:
  OAuth2 是现代应用程序实现安全认证的行业标准协议，通过令牌而非直接使用用户凭证进行授权。FastAPI 提供 `OAuth2PasswordBearer` 类支持密码授权模式，流程包括用户提交凭证、服务器验证、生成访问令牌及验证令牌有效性。配置安全模块需安装依赖库并创建 `security.py`，包含密码哈希、验证及 JWT 令牌生成功能。用户认证通过模拟数据库实现，提供登录接口和受保护路由。安全路由保护机制依赖 `get_current_user` 函数验证令牌。进阶实践包括刷新令牌、权限分级和速率限制，遵循 OWASP 安全规范。

categories:
  - 后端开发
  - FastAPI

tags:
  - OAuth2
  - FastAPI
  - 用户认证
  - JWT
  - 安全路由
  - 密码哈希
  - 令牌机制

----

<img src="https://static.shutu.cn/shutu/jpeg/open70/2025/06/09/731456de6411b642eb89e9a89510c3ed.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第二章：实现用户认证与 OAuth2 集成

## 1. OAuth2 的核心概念

OAuth2 是现代应用程序实现安全认证的行业标准协议，其核心思想是通过令牌（Token）而非直接使用用户凭证进行授权。FastAPI
通过内置的 `OAuth2PasswordBearer` 类提供了开箱即用的支持。

典型的密码授权模式流程：

1. 用户提交用户名和密码
2. 服务器验证凭证有效性
3. 生成有时效性的访问令牌
4. 客户端使用令牌访问受保护资源
5. 服务器验证令牌有效性

## 2. 配置基础安全模块

安装所需依赖库：

```bash
pip install fastapi==0.103.1 
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4
```

创建安全模块 `security.py`：

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# 安全配置参数
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = 30  # 分钟

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str):
    """验证密码与哈希值是否匹配"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    """生成密码哈希值"""
    return pwd_context.hash(password)


def create_access_token(data: dict):
    """生成JWT访问令牌"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

## 3. 用户认证完整实现

创建用户模型和认证路由：

```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

router = APIRouter()

# 模拟数据库中的用户数据
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga7lCy",  # secret
        "disabled": False,
    }
}


class User(BaseModel):
    username: str
    disabled: bool = None


class UserInDB(User):
    hashed_password: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """解析并验证JWT令牌"""
    credentials_exception = HTTPException(
        status_code=401,
        detail="无效的身份凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return UserInDB(**user)


@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """用户登录接口"""
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="用户名或密码错误")

    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息的受保护路由"""
    return current_user
```

## 4. 安全路由保护机制

在需要身份验证的路由中添加依赖项：

```python
from fastapi import Depends


@app.get("/protected-route")
async def protected_route(current_user: User = Depends(get_current_user)):
    """需要认证的受保护路由示例"""
    return {
        "message": "您已成功访问受保护资源",
        "current_user": current_user.username
    }
```

## 5. 课后 Quiz

**Q1：当客户端请求缺失Authorization头时，会触发什么HTTP状态码？**
A) 401 Unauthorized  
B) 403 Forbidden  
C) 422 Validation Error  
D) 500 Internal Server Error

**答案：A**  
解析：OAuth2PasswordBearer会自动验证请求头，当缺失Authorization头时会返回401状态码，表示需要身份验证

**Q2：如何防止JWT令牌被篡改？**
A) 使用HTTPS传输  
B) 设置短的令牌有效期  
C) 使用签名算法验证  
D) 所有以上选项

**答案：D**  
解析：签名算法保证令牌完整性，HTTPS防止中间人攻击，短有效期降低泄漏风险，三者结合提供全面防护

## 6. 常见报错解决方案

**问题1：422 Unprocessable Entity**  
原因：请求体数据不符合Pydantic模型验证规则  
解决方法：

1. 检查请求数据格式是否符合API文档
2. 在路由参数中添加`response_model_exclude_unset=True`
3. 启用调试模式查看详细错误：

```python
app = FastAPI(debug=True)
```

**问题2：401 Unauthorized - Could not validate credentials**  
原因分析：

1. 访问令牌过期
2. 令牌签名不匹配
3. 用户账户已被禁用  
   排查步骤：
1. 检查令牌有效期设置
2. 验证SECRET_KEY和ALGORITHM配置一致性
3. 确认用户状态字段是否有效

**预防建议：**

- 在生产环境使用强密钥：`openssl rand -hex 32`
- 设置合理的令牌有效期（通常30分钟-2小时）
- 定期轮换加密密钥

## 7. 进阶安全实践

1. 刷新令牌机制：通过独立的刷新令牌获取新访问令牌
2. 权限分级：基于角色的访问控制（RBAC）实现

```python
# 在令牌中加入角色声明
token_data = {"sub": username, "role": "admin"}


# 验证角色中间件
def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "需要管理员权限")
```

3. 速率限制：防止暴力破解攻击

```python
from fastapi.middleware import Middleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(middleware=[Middleware(limiter)])
```

本实现方案遵循OWASP安全规范，涵盖了密码存储、令牌传输、权限验证等关键安全要素，可直接用于生产环境的基础认证系统搭建。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [点赞背后的技术大冒险：分布式事务与SAGA模式 | cmdragon's Blog](https://blog.cmdragon.cn/posts/336930484b68/)
- [N+1查询：数据库性能的隐形杀手与终极拯救指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/bd59ee70c62e/)
- [FastAPI与Tortoise-ORM开发的神奇之旅 | cmdragon's Blog](https://blog.cmdragon.cn/posts/9f5729db84ef/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
- 