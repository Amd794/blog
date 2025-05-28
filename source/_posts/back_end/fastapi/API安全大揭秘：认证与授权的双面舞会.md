----
title: API安全大揭秘：认证与授权的双面舞会
date: 2025/05/28 12:14:35
updated: 2025/05/28 12:14:35
author: cmdragon

excerpt:
  API安全的核心需求包括认证与授权机制。认证验证用户身份，如用户名密码登录；授权验证用户是否有权限执行特定操作，如管理员删除数据。典型安全威胁包括未授权访问、凭证泄露和权限提升。FastAPI通过OpenAPI规范支持OAuth2、HTTP Basic等安全方案，依赖注入系统实现灵活验证。OAuth2协议通过授权请求、授权许可、访问令牌等步骤确保安全访问。FastAPI实现OAuth2密码流程示例包括环境准备、核心代码实现和运行测试，确保用户身份验证和权限控制。

categories:
  - 后端开发
  - FastAPI

tags:
  - API安全
  - 认证与授权
  - OAuth2协议
  - FastAPI
  - 安全威胁
  - 依赖注入
  - 访问令牌

----

<img src="https://static.shutu.cn/shutu/jpeg/open71/2025/05/28/7a0bbe27be627e62cd4dbd6c64e64d54.jpeg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>

<img src="https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://api2.cmdragon.cn/upload/cmder/20250304_012821924.jpg)
关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`

[探索数千个预构建的 AI 应用，开启你的下一个伟大创意](https://tools.cmdragon.cn/zh/apps?category=ai_chat)：https://tools.cmdragon.cn/

# 第一章：理解API安全的基本需求

## 为什么需要认证与授权机制

### 认证（Authentication）与授权（Authorization）的区别

- **认证**：验证用户身份的过程（例如：用户名密码登录）。
  > 类比：进入公司大楼时出示工牌（证明你是员工）
- **授权**：验证用户是否有权限执行特定操作（例如：管理员删除数据）。
  > 类比：不同工牌对应不同的门禁权限（普通员工不能进入机房）

### 典型安全威胁场景

1. **未授权访问**：攻击者直接调用`/admin/delete-data`接口删除数据
2. **凭证泄露**：用户密码在传输过程中被窃取
3. **权限提升**：普通用户越权访问管理员接口

### FastAPI的安全设计原则

- 内置支持OpenAPI规范的安全方案（OAuth2、HTTP Basic等）
- 通过**依赖注入系统**实现灵活的安全验证逻辑
- 自动生成交互式API文档中的安全测试界面

---

## OAuth2协议在Web服务中的应用场景

### OAuth2核心概念图解

```
+--------+                               +---------------+
|        |--(A) 授权请求 ->---------------|  资源所有者    |
|        |                               | （用户）       |
|        |<-(B) 授权许可 ----------------|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(C) 授权许可 ->---------------| 授权服务器     |
| 客户端  |                               | （签发令牌）   |
|        |<-(D) 访问令牌 ----------------|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(E) 访问令牌 ->---------------| 资源服务器     |
|        |                               | （存储数据）   |
|        |<-(F) 受保护资源 --------------|               |
+--------+                               +---------------+
```

### FastAPI实现OAuth2密码流程示例

#### 环境准备

```bash
# 安装依赖库（指定版本保证兼容性）
pip install fastapi==0.68.0 uvicorn==0.15.0 
pip install python-jose[cryptography]==3.3.0 
pip install passlib[bcrypt]==1.7.4
```

#### 核心代码实现

```python
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta

# 安全配置常量
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2方案声明
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# 用户数据模型
class User(BaseModel):
    username: str
    disabled: bool = False


class UserInDB(User):
    hashed_password: str


# 令牌生成函数
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 认证依赖项
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(
        status_code=401,
        detail="无法验证凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
    except JWTError:
        raise credential_exception

    # 实际项目应查询数据库
    user = UserInDB(
        username=username,
        hashed_password="fakehash",
        disabled=False
    )
    if user.disabled:
        raise HTTPException(status_code=400, detail="用户已被禁用")
    return user


app = FastAPI()


@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # 验证用户名密码（示例硬编码）
    if form_data.username != "testuser" or form_data.password != "testpass":
        raise HTTPException(
            status_code=401,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": form_data.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/protected/")
async def read_protected_route(current_user: User = Depends(get_current_user)):
    return {"message": "已授权访问", "user": current_user.username}
```

#### 运行与测试

```bash
uvicorn main:app --reload
```

打开浏览器访问 `http://localhost:8000/docs`，在Swagger界面中：

1. 点击 `/token` 端点，输入测试凭证（username: testuser, password: testpass）
2. 复制返回的access_token
3. 点击 `/protected/` 端点，在Authorization弹窗中输入 `Bearer <your-token>`

---

## 课后Quiz

**Q1：认证与授权的根本区别是什么？**  
A) 认证确认身份，授权验证权限  
B) 授权在前，认证在后  
C) 两者是同义词

<details>
<summary>点击查看答案</summary>
正确答案：A  
解析：认证是验证用户身份的过程（如登录），授权是验证该身份是否有权限执行特定操作（如访问管理员接口）。
</details>

**Q2：OAuth2的授权码流程包含哪些主要步骤？**  
A) 客户端直接获取访问令牌  
B) 用户授权 → 获取授权码 → 交换访问令牌  
C) 用户名密码直接传递给资源服务器

<details>
<summary>点击查看答案</summary>
正确答案：B  
解析：完整的授权码流程需要通过授权服务器中转授权码，避免客户端直接接触用户凭证。
</details>

---

## 常见报错解决方案

**报错：422 Unprocessable Entity**

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "password"
      ],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**原因分析**：

- 请求体缺少必填字段（如password字段）
- 字段数据类型不匹配（例如数字传入了字符串）

**解决方法**：

1. 检查Swagger文档中的请求体模型
2. 使用Postman验证请求体格式：

```json
{
  "username": "testuser",
  "password": "testpass"
}
```

3. 在Pydantic模型中使用`...`表示必填字段：

```python
class LoginRequest(BaseModel):
    username: str
    password: str  # 必填字段
```

**预防建议**：

- 启用Pydantic的严格模式：

```python
from pydantic import StrictStr


class LoginRequest(BaseModel):
    username: StrictStr
    password: StrictStr
```

- 在路由中使用`response_model_exclude_unset=True`过滤未设置字段

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

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
- [FastAPI数据库连接池配置与监控 | cmdragon's Blog](https://blog.cmdragon.cn/posts/74b39391a524/)
- [分布式事务在点赞功能中的实现 | cmdragon's Blog](https://blog.cmdragon.cn/posts/f05753c1a8af/)
- [Tortoise-ORM级联查询与预加载性能优化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/644d88ac6ff1/)
- [使用Tortoise-ORM和FastAPI构建评论系统 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d7fcb94d965b/)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
-