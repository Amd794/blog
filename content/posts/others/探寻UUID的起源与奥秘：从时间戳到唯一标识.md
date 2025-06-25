---
url: /posts/f32ff90fa38342818f5880b6a5458fbb/
title: 探寻UUID的起源与奥秘：从时间戳到唯一标识
date: 2024-03-26T17:06:45+08:00
lastmod: 2024-03-26T17:06:45+08:00
tags:
  - UUID起源
  - 全局唯一性
  - 时间戳原理
  - UUID/GUID区别
  - 对比Snowflake
  - Python&JS实例
  - 分布式系统应用
---


<img src="https://static.cmdragon.cn/blog/images/2024_03_26 17_07_47.png@blog" title="2024_03_26 17_07_47.png" alt="2024_03_26 17_07_47.png"/>

#### 1. UUID起源与原理

UUID（Universally Unique Identifier）是一种唯一标识符，最初由Apollo计算机公司的软件工程师Roedy
Green在1987年提出。其原理是基于时间戳、节点标识、时钟序列和随机数生成唯一标识。

[UUID/GUID生成器 | 一个覆盖广泛主题工具的高效在线平台(cmdragon.cn)](https://cmdragon.cn/uuidgenerator)

https://cmdragon.cn/uuidgenerator

#### 2. UUID优缺点

- 优点：全球唯一性、无需中心化管理、随机性、安全性
- 缺点：较长、无序、不易直观识别

#### 3. UUID与其他算法对比

- UUID vs. GUID：GUID是Microsoft对UUID的实现，本质上相同，但在字节顺序上略有不同。
- UUID vs. Snowflake：Snowflake是Twitter开源的分布式ID生成算法，具有更高的性能和可定制性。
- UUID vs. 自增ID：自增ID简单直观，但在分布式系统中可能存在冲突。

#### 4. Python示例：

```python
import uuid

# 生成UUID
new_uuid = uuid.uuid4()
print(new_uuid)

# 解析UUID
uuid_str = str(new_uuid)
parsed_uuid = uuid.UUID(uuid_str)
print(parsed_uuid)
```

#### 5. JavaScript示例：

```javascript
// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 使用示例
const newUUID = generateUUID();
console.log(newUUID);
```

### 总结：

UUID作为一种全局唯一标识符，在分布式系统、大数据处理、区块链等领域有着广泛的应用。通过深入了解其起源、原理、优缺点以及与其他算法的对比，我们可以更好地选择合适的唯一标识方案。同时，Python和JavaScript提供了简单易用的UUID生成和解析方法，为开发者提供了便利。随着技术的不断发展，UUID在未来的应用前景也将更加广阔。