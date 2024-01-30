---
title: Base64编码解码
date: 2024/1/30 16:50
---


![6.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15a5d527debc43c3a88067e2dd821e92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=1024&s=156838&e=jpg&b=26292b)

一、Base64编码技术简介

Base64编码是一种广泛应用于网络传输和数据存储的编码方式。它将原始数据转换为可打印的字符形式，以便于传输和存储。Base64编码后的数据长度是原始数据长度的约3/4，具有一定的压缩效果。

[Base64编码解码 -- 一个覆盖广泛主题工具的高效在线平台(amd794.com)](https://amd794.com/base64encordec)

https://amd794.com/base64encordec

1.1 Base64编码规则

Base64编码规则如下：

1. 对原始数据按6bit分割，如果当前所有bit长度不是6的整数倍，则有剩余bit。
2. 对6bit高位补齐2个0，凑成8bit；在剩余bit前面补齐若干0，凑成8bit。
3. 补齐后的每个字节为索引，根据索引表替换为目标字符。

二、Base64解码技术

2.1 Base64解码规则

Base64解码规则与编码规则相反，主要包括以下步骤：

1. 根据索引表，将字符替换成索引，每个索引为1个字节，对应8bit。
2. 将每个索引的前2个bit去掉，剩余所有bit构成原始数据。

三、Base64编码解码实战

3.1 Java实现Base64编码

```java
public class Base64Encoder {
    public static String encode(String input) {
        byte[] bytes = input.getBytes();
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(Base64.getEncoder().encode(b));
        }
        return sb.toString();
    }
}
```

3.2 Python实现Base64编码

```python
import base64

def encode(input):
    return base64.b64encode(input.encode()).decode()
```

3.3 Java实现Base64解码

```java
public class Base64Decoder {
    public static String decode(String input) {
        byte[] bytes = input.getBytes();
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(Base64.getDecoder().decode(b));
        }
        return sb.toString();
    }
}
```

3.4 Python实现Base64解码

```python
import base64

def decode(input):
    return base64.b64decode(input.encode()).decode()
```

四、总结

Base64编码解码技术是一种在网络传输和数据存储中广泛应用的编码方式。通过编码，可以将二进制数据转换为可打印的字符形式，便于传输和存储。同时，Base64编码解码技术也具有一定的压缩效果。在实际应用中，我们可以根据需要选择合适的编程语言实现Base64编码解码功能。
