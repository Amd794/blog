---
url: /posts/a39277914464b007ac61874292578de0/
title: JWT令牌：从身份证到代码防伪的奇妙之旅
date: 2025-06-03T23:14:07+08:00
lastmod: 2025-06-03T23:14:07+08:00
author: cmdragon

summary:
  JWT（JSON Web Token）是一种用于安全传输信息的开放标准，由Header、Payload和Signature三部分组成。Header描述算法和令牌类型，Payload存放实际数据，Signature通过密钥和算法生成，确保数据未被篡改。PyJWT库可用于生成和验证JWT令牌，FastAPI框架中可通过OAuth2PasswordBearer实现身份验证。常见问题包括签名验证失败和令牌过期，需确保密钥一致并定期轮换。JWT适用于身份认证和信息交换，但需避免在Payload中存储敏感数据。

categories:
  - FastAPI

tags:
  - JWT令牌
  - 签名机制
  - PyJWT库
  - FastAPI集成
  - 身份认证
  - 安全传输
  - 报错解决方案

---

<img src="https://static.shutu.cn/shutu/jpeg/openff/2025-06-04/a7247425a44498bda1f03f517b236f79.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第七章：JWT令牌集成方案

---

## 一、JWT令牌的结构与签名机制

### 1.1 什么是JWT令牌？

JWT（JSON Web Token）是一种开放标准（RFC
7519），用于在各方之间安全地传输信息。它由三部分组成，格式为 `Header.Payload.Signature`，常用于身份认证和信息交换。

#### 结构解析：

- **Header**（头部）：描述算法和令牌类型
  ```json
  {
    "alg": "HS256",  // 签名算法（如HS256）
    "typ": "JWT"     // 令牌类型
  }
  ```
- **Payload**（载荷）：存放实际数据（如用户ID、过期时间）
  ```json
  {
    "sub": "user123",   // 主题（Subject）
    "exp": 1717020000   // 过期时间（Unix时间戳）
  }
  ```
- **Signature**（签名）：对前两部分的签名，防止数据篡改
  ```
  HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret_key
  )
  ```

### 1.2 签名机制的工作原理

签名通过密钥（`secret_key`）和指定算法（如HS256）生成。服务端用密钥验证签名是否合法，确保令牌未被篡改。

#### 类比理解：

将JWT想象为一张身份证：

- Header = 证件类型（身份证）
- Payload = 证件信息（姓名、有效期）
- Signature = 防伪标识（公安局的盖章）

---

## 二、PyJWT库的编码/解码实践

### 2.1 环境配置与依赖安装

```bash
# 安装依赖库（指定版本避免兼容性问题）
pip install fastapi==0.95.0 pydantic==1.10.7 pyjwt==2.7.0
```

### 2.2 核心代码实现

#### 步骤1：定义Pydantic模型

```python
from pydantic import BaseModel


class TokenData(BaseModel):
    username: str | None = None
```

#### 步骤2：JWT工具类封装

```python
from datetime import datetime, timedelta
from typing import Optional
import jwt
from jwt.exceptions import ExpiredSignatureError, JWTError

# 配置常量
SECRET_KEY = "your-secret-key-123"  # 生产环境应使用环境变量存储
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_jwt_token(data: dict) -> str:
    """生成JWT令牌"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def validate_jwt_token(token: str) -> Optional[TokenData]:
    """验证并解析JWT令牌"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            return None
        return TokenData(username=username)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### 步骤3：集成到FastAPI路由

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.post("/token")
async def login_for_token(username: str, password: str):
    # 伪代码：实际应查询数据库验证用户
    if not authenticate_user(username, password):
        raise HTTPException(401, "Invalid credentials")
    return {"access_token": create_jwt_token({"sub": username})}


@app.get("/users/me")
async def read_current_user(token: str = Depends(oauth2_scheme)):
    user_data = validate_jwt_token(token)
    if not user_data:
        raise HTTPException(401, "Authentication failed")
    return {"username": user_data.username}
```

---

## 三、课后Quiz

1. **JWT的Signature部分有什么作用？**  
   A. 存放用户数据  
   B. 防止数据篡改  
   C. 定义令牌类型  
   **答案：B**  
   **解析**：签名通过哈希算法验证数据的完整性，确保令牌未被修改。

2. **以下哪种情况会导致`ExpiredSignatureError`？**  
   A. 使用错误的密钥  
   B. 令牌的exp字段已过期  
   C. 令牌格式不正确  
   **答案：B**  
   **解析**：当当前时间超过exp字段的值时，会触发过期异常。

---

## 四、常见报错解决方案

### 问题1：`jwt.exceptions.DecodeError: Invalid signature`

**原因**：签名验证失败，可能因为：

- 密钥不匹配
- 令牌被篡改  
  **解决**：

1. 检查SECRET_KEY是否一致
2. 验证令牌是否来自可信来源

### 问题2：`jwt.exceptions.ExpiredSignatureError`

**原因**：令牌已过期  
**解决**：

1. 重新获取新令牌
2. 调整ACCESS_TOKEN_EXPIRE_MINUTES的值

---

通过本章学习，您已掌握JWT的核心原理和FastAPI集成方法。关键点：始终使用HTTPS传输令牌、避免在Payload中存储敏感数据、定期轮换密钥。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [DDD分层设计与异步职责划分：让你的代码不再“异步”混乱 | cmdragon's Blog](https://blog.cmdragon.cn/posts/62012cf83e26/)
- [异步数据库事务锁：电商库存扣减的防超卖秘籍 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c195d6c4d0b5/)
- [FastAPI中的复杂查询与原子更新指南 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f0e851eb1a74/)
- [深入解析Tortoise-ORM关系型字段与异步查询 | cmdragon's Blog](https://blog.cmdragon.cn/posts/512d338e0833/)
- [FastAPI与Tortoise-ORM模型配置及aerich迁移工具 | cmdragon's Blog](https://blog.cmdragon.cn/posts/7649fa5d5b04/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-