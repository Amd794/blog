----
title: FastAPI安全认证：从密码到令牌的魔法之旅
date: 2025/06/02 13:24:43
updated: 2025/06/02 13:24:43
author: cmdragon

excerpt:
  本章详细介绍了如何在FastAPI中实现OAuth2密码流程的认证机制。通过创建令牌端点，用户可以使用用户名和密码获取JWT访问令牌。代码示例展示了如何使用`CryptContext`进行密码哈希处理，生成和验证JWT令牌，并实现安全路由保护。此外，还提供了JWT令牌的结构解析、常见报错解决方案以及安全增强建议，如使用HTTPS传输令牌和从环境变量读取密钥。最后，通过课后Quiz巩固了关键概念。

categories:
  - 后端开发
  - FastAPI

tags:
  - FastAPI
  - OAuth2
  - JWT
  - 安全认证
  - 密码哈希
  - 令牌校验
  - 访问控制

----

<img src="https://static.shutu.cn/shutu/jpeg/open5f/2025/06/02/3489d9d94a2b502bb25e9c2c82793898.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第一章：FastAPI安全认证核心实现

（注：根据写作规范要求，章节编号从第一章开始编排）

## 一、令牌端点（Token Endpoint）的创建

### 1.1 OAuth2密码流程原理

OAuth2密码流程（Password Grant）是直接通过用户名密码获取访问令牌的认证方式。类比演唱会验票流程：用户先到售票处（令牌端点）用身份证（凭证）换取门票（令牌），之后凭门票入场（访问资源）。

流程步骤：

1. 客户端发送用户名密码到`/token`端点
2. 服务器验证凭证有效性
3. 生成包含用户身份和有效期的JWT令牌
4. 返回访问令牌给客户端

### 1.2 FastAPI端点实现

```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

router = APIRouter(tags=["Authentication"])

# 密码哈希配置（使用bcrypt算法）
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT配置（实际项目应从环境变量读取）
SECRET_KEY = "your-secret-key-keep-it-secret!"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# 用户模型
class UserCreate(BaseModel):
    username: str
    password: str


# 令牌响应模型
class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: UserCreate):
    # 用户验证（示例用静态数据，实际应查数据库）
    if form_data.username != "admin" or not pwd_context.verify(
            "secret",  # 数据库中存储的哈希密码
            form_data.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 生成JWT令牌
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

#### 代码解析：

1. `CryptContext` 使用bcrypt算法进行密码哈希处理
2. `UserCreate`模型规范了客户端请求的数据格式
3. 密码验证使用`verify()`方法比对哈希值
4. `create_access_token`生成带过期时间的JWT令牌

### 1.3 运行环境配置

```bash
# 安装依赖库（版本需严格对应）
fastapi==0.68.1
uvicorn==0.15.0
python-jose[cryptography]==3.3.0
passlib==1.7.4
```

## 二、访问令牌生成与校验

### 2.1 JWT令牌结构解析

示例令牌：  
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY1OTA3MDQwMH0.3w7hJH4KZ6Q-Mje3Q2T3T6k4Vd6QyQ6Qk7v6Qw7q6Qk`

分段说明：

- Header：`{"alg": "HS256", "typ": "JWT"}`
- Payload：`{"sub": "admin", "exp": 1659070400}`
- Signature：使用密钥对前两部分的签名

### 2.2 令牌校验实现

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 此处应查询数据库验证用户存在性
    if username != "admin":
        raise credentials_exception
    return username


# 安全路由示例
@router.get("/protected")
async def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"欢迎您, {current_user}"}
```

#### 校验流程：

1. 从请求头提取Bearer令牌
2. 解码并验证JWT签名
3. 检查令牌有效期
4. 验证用户是否存在（示例简化处理）

## 三、课后Quiz

1. **为什么在密码存储时要使用哈希而不是明文？**  
   A. 提高查询速度  
   B. 防止数据泄露导致密码暴露  
   C. 减少存储空间占用  
   D. 方便密码找回

   **答案**：B。哈希处理后的密码即使泄露也无法逆向获取原始密码

2. **JWT中的签名部分主要作用是什么？**  
   A. 美化令牌格式  
   B. 验证令牌内容未被篡改  
   C. 加速令牌解析  
   D. 支持多种加密算法

   **答案**：B。签名确保令牌在传输过程中未被修改

## 四、常见报错解决方案

### 问题1：401 Unauthorized

- **现象**：`{"detail":"Not authenticated"}`
- **原因**：请求头缺少Authorization字段或格式错误
- **解决**：
  ```bash
  curl -H "Authorization: Bearer your_token" http://localhost:8000/protected
  ```

### 问题2：422 Validation Error

- **现象**：请求体参数校验失败
- **原因**：未按UserCreate模型格式提交数据
- **解决**：检查请求是否包含username和password字段

### 问题3：403 Forbidden

- **现象**：`{"detail": "Invalid authentication credentials"}`
- **原因**：令牌已过期或签名验证失败
- **解决**：重新获取有效令牌，检查密钥一致性

## 五、安全增强建议

1. **生产环境必须**：
    - 通过HTTPS传输令牌
    - 使用环境变量存储密钥
    - 定期轮换加密密钥
2. **推荐方案**：
   ```python
   # 从环境变量读取密钥
   import os
   SECRET_KEY = os.getenv("JWT_SECRET_KEY")
   if not SECRET_KEY:
       raise ValueError("Missing JWT_SECRET_KEY environment variable")
   ```

通过本章学习，开发者可以掌握FastAPI的OAuth2密码流程核心实现，建议结合数据库实现完整的用户管理系统。下一章将讲解权限控制与角色管理的高级应用。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [异步IO与Tortoise-ORM的数据库 | cmdragon's Blog](https://blog.cmdragon.cn/posts/c9824156400c/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-