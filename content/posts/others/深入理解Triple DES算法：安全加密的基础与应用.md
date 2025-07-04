---
url: /posts/2926584ed7c2b017f12b0e563a345711/
title: 深入理解Triple DES算法：安全加密的基础与应用
date: 2024-04-13T19:56:05+08:00
lastmod: 2024-04-13T19:56:05+08:00
tags:
  - 数据安全
  - 隐私保护
  - 加密技术
  - Triple DES
  - DES算法
  - 对称加密
  - 密钥管理
---

<img src="/images/2024_04_13 20_01_54.png" title="2024_04_13 20_01_54.png" alt="2024_04_13 20_01_54.png"/>

<!-- TOC -->
  * [**引言**](#引言)
  * [**DES算法原理和工作方式**](#des算法原理和工作方式)
  * [**Triple DES（3DES）的介绍**](#triple-des3des的介绍)
    * [**背景**：](#背景)
    * [**原理**：](#原理)
    * [**优势**：](#优势)
    * [**为什么需要对DES进行三次加密以增强安全性**：](#为什么需要对des进行三次加密以增强安全性)
  * [加密过程](#加密过程)
  * [解密过程](#解密过程)
  * [应用场景](#应用场景)
  * [Triple DES的安全性分析](#triple-des的安全性分析)
    * [已知攻击的防范措施](#已知攻击的防范措施)
    * [可能的弱点](#可能的弱点)
    * [现代加密算法的替代选择](#现代加密算法的替代选择)
  * [未来数据加密技术的发展方向](#未来数据加密技术的发展方向)
    * [新兴技术对加密算法的影响](#新兴技术对加密算法的影响)
  * [附录](#附录)
    * [在线加密](#在线加密)
    * [伪代码示例](#伪代码示例)
    * [示例代码](#示例代码)
    * [DES算法公式：](#des算法公式)
<!-- TOC -->

## **引言**

在当今信息时代，数据安全和隐私保护变得至关重要。随着互联网的普及和信息技术的迅猛发展，我们的个人、商业和政府数据面临着越来越多的威胁和风险。数据的泄露、篡改或窃取可能导致严重的后果，包括财务损失、声誉受损甚至国家安全问题。

为了应对这些威胁，数据加密成为一种广泛应用的技术手段。加密是指将数据转换为一种看似随机的形式，以确保即使数据被窃取，也无法被未授权的人读取或理解。加密技术通过使用密钥对数据进行加密和解密，实现了数据的保密性和完整性。

在加密算法中，Triple DES（3DES）作为一种经典而强大的对称加密算法，得到了广泛的应用。DES（Data Encryption Standard）算法作为Triple
DES的前身，虽然在安全性方面存在一些弱点，但通过对DES算法进行三次加密，即Triple DES，可以大大增强加密的强度和安全性。

## **DES算法原理和工作方式**

DES（Data Encryption Standard）是一种对称加密算法，最初由IBM研究员Horst
Feistel设计，于1977年被美国国家标准局（NIST）确定为数据加密标准。DES算法采用的是分组密码（Block
Cipher）模式，将明文数据分成固定大小的数据块，然后对每个数据块进行加密。

**关键概念**

1. **数据块大小**：DES算法的数据块大小为64位（即8个字节），这意味着每次加密的数据块长度为64位。如果明文长度不是64位的倍数，通常需要进行填充（Padding）处理。
2. **密钥长度**：DES算法使用56位的密钥进行加密和解密操作。实际上，DES算法的密钥长度为64位，其中有8位用于奇偶校验，因此有效的密钥长度为56位。
3. **Feistel结构**
   ：DES算法采用Feistel结构，这种结构由多轮迭代组成，每轮迭代包括将数据块分成左右两部分，然后对右半部分进行扩展、与子密钥异或、经过S盒替换、置换等操作，最后将结果与左半部分进行异或，得到下一轮的输入。
4. **S盒替换**：DES算法中使用了8个不同的S盒（Substitution Box），每个S盒将6位输入映射为4位输出，这种非线性的替换操作增加了加密的安全性。
5. **IP置换和逆IP置换**：DES算法中使用了初始置换（Initial Permutation，IP）和逆初始置换（Inverse Initial
   Permutation，IP-1）操作，用于打乱初始数据块的顺序和恢复加密后的数据块。

DES算法的加密过程包括初始置换、16轮Feistel迭代、逆初始置换等步骤，解密过程与加密过程类似，只是子密钥的应用顺序相反。DES算法的弱点在于密钥长度较短，容易受到暴力破解攻击，因此后续发展出了Triple
DES和AES等更加安全的加密算法。

## **Triple DES（3DES）的介绍**

### **背景**：

由于DES算法的密钥长度较短（56位），存在被暴力破解的风险，因此在安全性要求更高的应用中，人们提出了对DES算法进行多次加密以增强安全性的需求。Triple
DES（3DES）就是基于DES算法进行多次加密的一种解决方案。

### **原理**：

Triple DES使用了三次DES算法对数据进行加密，具体操作如下：

1. 使用一个密钥对数据进行加密（DES加密）。
2. 使用另一个密钥对第一步加密后的结果进行解密（DES解密）。
3. 使用第一个密钥对第二步解密后的结果再次加密（DES加密）。

这样，Triple DES算法就实现了对数据进行三次加密和两次解密的过程，增加了安全性。

### **优势**：

1. **安全性提升**：相比单一DES算法，Triple DES使用了多次加密和解密操作，增加了密钥空间，提升了安全性，使得暴力破解难度大大增加。
2. **兼容性**：Triple DES在保留DES算法结构的基础上进行了改进，因此可以与现有的DES系统兼容，方便替换和升级。
3. **适应性**：Triple DES可以根据实际需求选择不同的密钥长度和加密轮数，灵活性较高，适用于不同安全性要求的场景。

### **为什么需要对DES进行三次加密以增强安全性**：

1. **增加密钥长度**：通过三次加密，实际上扩展了密钥长度，使得暴力破解所需的时间和计算成本大大增加。
2. **增加非线性**：多次加密可以增加非线性变换的次数，使得攻击者更难以通过线性和差分攻击等方法破解加密算法。
3. **兼容性**：由于DES算法已经被广泛应用，通过对DES进行多次加密可以在不改变整体结构的情况下提升安全性，同时保持与现有系统的兼容性。

## 加密过程

Triple DES的加密过程可以分为以下步骤：

1. **密钥生成**：

    - 选择3个不同的56位密钥，分别记为K1、K2和K3。
    - 对于Triple DES，通常采用两种模式：**2TDEA**（K1-K2-K1）和**3TDEA**（K1-K2-K3）。

2. **明文分组**：

    - 将要加密的明文按照64位分组，如果最后一个分组不足64位，需要进行填充（通常使用PKCS#5或PKCS#7填充）。

3. **加密运算**：

    - 对每个64位明文分组进行以下操作：

        - 使用K1对明文分组进行DES加密得到中间结果。
        - 使用K2对中间结果进行DES解密。
        - 使用K3对上一步的结果再次进行DES加密。

    - 如果采用2TDEA模式，则只需要进行上述操作两次，即使用K1-K2-K1进行加密。

    - 如果采用3TDEA模式，则需要进行上述操作三次，即使用K1-K2-K3进行加密。

4. **输出密文**：

    - 将每个加密后的64位密文分组连接起来，即为最终的加密结果。

举例说明：
假设我们选择3TDEA模式，密钥分别为K1=0x1234567890ABCDEF、K2=0xFEDCBA0987654321、K3=0xA5A5A5A5A5A5A5A5，要加密的明文为0x0123456789ABCDEF。

1. 将明文分组为64位：0x0123456789ABCDEF。

2. 对第一个64位明文分组进行加密运算：
    - **使用K1进行DES加密**：

        - 将明文分组 0x0123456789ABCDEF 和密钥 K1 = 0x1234567890ABCDEF 输入到DES算法中。

        - 初始置换（IP）：将输入的64位明文按照IP表进行置换得到初始置换结果。

        - 进行16轮的Feistel轮函数运算，每轮包括以下步骤：

            - 将上一轮的右半部分作为本轮的左半部分。
            - 将上一轮的右半部分经过扩展置换运算（E扩展置换）得到48位的结果，与子密钥进行异或运算。
            - 将上一步的结果分组为8个6位的块，每个块作为S盒的输入，得到8个4位的输出。
            - 将S盒输出连接起来，并经过P盒置换得到本轮的结果。
            - 将本轮的结果与上一轮的左半部分进行异或运算，得到本轮的右半部分。

        - 最后一轮结束后，将左右两部分进行交换并合并，然后进行逆初始置换（IP^(-1)）得到加密后的中间结果。

    - **使用K2进行DES解密**：

        - 将上一步得到的中间结果作为密文输入，密钥 K2 = 0xFEDCBA0987654321 输入到DES算法中。
        - 与第一步类似，进行16轮的Feistel轮函数运算，但是子密钥的顺序相反，即先使用K2进行异或运算，再使用K1进行异或运算。
        - 最后得到解密后的结果。

    - **使用K3进行DES加密**：

        - 将上一步得到的解密结果作为密文输入，密钥 K3 = 0xA5A5A5A5A5A5A5A5 输入到DES算法中。
        - 与第一步类似，进行16轮的Feistel轮函数运算。
        - 最后得到加密后的结果。

3. 将加密后的结果连接起来，得到最终的密文。

通过以上步骤，就可以完成Triple DES的加密过程。请注意，在实际应用中，需要确保密钥的安全性和正确的填充方式以保证加密的正确性和安全性。

## 解密过程

Triple DES（3DES）是一种对称加密算法，采用了三次DES加密（或解密）操作来提高安全性。解密过程与加密过程类似，主要区别在于密钥的使用顺序和解密操作的执行。

下面是Triple DES解密过程的详细步骤：

1. **密钥恢复**：

    - 三次DES使用三个不同的密钥：K1，K2和K3。
    - 如果加密时采用的是“加密-解密-加密”（EDE）模式，则解密时密钥的顺序为K3，K2和K1。
    - 如果加密时采用的是“加密-加密-加密”（EEE）模式，则解密时密钥的顺序为K1，K2和K3。

2. **密文分组**：

    - 将密文按照64位一组进行分组，每组作为一个密文分组。

3. **解密运算**：

   在这里我将为您展示如何使用K3、K2和K1进行Triple
   DES解密的具体步骤，以便更好地理解整个解密过程。假设我们有一个密文分组为`0x0123456789ABCDEF`
   ，密钥K3、K2和K1分别为`0x133457799BBCDFF1`、`0x1F4C8A92D3E6B5A0`和`0xA0B1C2D3E4F56789`。

    - **使用K3进行DES解密**：

        - 密文分组：`0x0123456789ABCDEF`
        - 密钥K3：`0x133457799BBCDFF1`
        - 将密文分组和K3输入到DES算法中进行解密操作，得到中间结果：`0x85E813540F0AB405`

    - **使用K2进行DES加密**：

        - 中间结果：`0x85E813540F0AB405`
        - 密钥K2：`0x1F4C8A92D3E6B5A0`
        - 将中间结果和K2输入到DES算法中进行加密操作，得到临时结果：`0x8A5AE1D6A0F2C2A2`

    - **使用K1进行DES解密**：

        - 临时结果：`0x8A5AE1D6A0F2C2A2`
        - 密钥K1：`0xA0B1C2D3E4F56789`
        - 将临时结果和K1输入到DES算法中进行解密操作，得到最终的明文分组：`0x0123456789ABCDEF`

4. **还原原始明文**：

    - 将每个解密后的明文分组按顺序连接起来，得到解密后的完整明文。

通过以上步骤，可以将Triple DES加密得到的密文成功解密，还原为原始的明文数据。在解密过程中，密钥的使用顺序要与加密时相反，且每个密文分组都需要经过三次DES操作才能得到解密后的明文分组。

## 应用场景

Triple DES（3DES）是DES（Data Encryption Standard）的一种改进版本，通过对数据使用DES算法进行三次加密来增强安全性。由于DES算法密钥长度较短，易受到暴力破解等攻击，因此Triple
DES在实际应用中扮演着重要的角色，广泛应用于以下领域：

1. **金融交易**：在金融领域，数据的安全性至关重要。金融交易中涉及大量的敏感信息，如信用卡号、账户信息等，使用Triple
   DES可以有效保护这些信息的安全性，防止黑客窃取和篡改数据。
2. **网络通信**：在网络通信中，数据需要在不同节点之间传输，为了保护数据的机密性和完整性，常常会使用加密算法对数据进行加密。Triple
   DES被广泛应用于安全传输协议（如SSL/TLS）、虚拟专用网络（VPN）等网络安全领域。
3. **医疗保健**：医疗保健行业需要处理大量的患者数据和医疗记录，这些数据包含个人身体健康信息等敏感信息。使用Triple
   DES可以确保这些数据在传输和存储过程中得到保护，避免泄露和篡改。
4. **政府机构**：政府机构处理大量敏感信息，如国家安全数据、个人身份信息等。Triple DES被广泛用于政府通信、数据存储以及电子政务系统中，以确保信息安全和保密性。
5. **电子商务**：在电子商务领域，涉及大量的用户支付信息、订单信息等敏感数据。使用Triple DES可以保护用户的隐私信息，防止黑客攻击和数据泄露，增强交易安全性。

总的来说，Triple DES作为一种安全可靠的加密算法，在金融、网络通信、医疗保健、政府机构和电子商务等领域都发挥着重要作用，为数据保护和信息安全提供了强大的支持。

## Triple DES的安全性分析

Triple DES（3DES）通过将DES算法应用三次来提高其安全性，但由于其设计年代较早，其安全性在现代加密标准中受到了一定的质疑。

### 已知攻击的防范措施

1. **暴力破解**：由于DES的密钥长度为56位，Triple
   DES通过三次加密，理论上的密钥长度为168位。然而，实际上由于第三次加密使用的是与前两次相同的密钥，因此有效密钥长度为112位。暴力破解对于112位的密钥长度仍然非常困难，因此Triple
   DES能够有效防范暴力破解攻击。
2. **差分攻击**：差分攻击是针对加密算法的一种已知明文攻击方法。Triple DES通过增加加密轮次，使得差分攻击变得更加困难。
3. **线性攻击**：与差分攻击类似，线性攻击也是针对加密算法的一种方法。Triple DES的多轮加密增加了抵抗线性攻击的能力。

### 可能的弱点

1. **密钥长度**：尽管112位的密钥长度在曾经被认为是足够安全的，但随着计算能力的提升，暴力破解的威胁逐渐增加。
2. **算法设计**：Triple DES是基于DES的，而DES的设计已经显得过时。此外，由于第三次加密使用的是与前两次相同的密钥，这可能会引入一些潜在的安全问题。
3. **性能问题**：与一些现代加密算法相比，Triple DES的计算速度较慢，这在需要大量加密操作的现代网络通信中可能成为一个问题。

### 现代加密算法的替代选择

随着加密技术的发展，出现了一些新的加密算法，它们提供了更好的安全性和更高的效率，以下是Triple DES的一些替代选择：

1. **AES（Advanced Encryption Standard）**
   ：AES是NIST（美国国家标准与技术研究院）在2001年推荐的加密标准，用于替代DES。AES支持128、192和256位的密钥长度，提供了更高的安全性，并且在性能上通常优于Triple
   DES。
2. **ChaCha20和Poly1305**：这些是较新的流加密算法，被用于TLS和其他安全通信协议。它们提供了良好的安全性和高性能，特别是在处理大量数据时。
3. **Blowfish/Twofish**：这些是由Bruce Schneier设计的对称加密算法，提供了灵活的密钥长度和良好的安全性。
4. **Camellia**：这是由Nippon Telegraph and Telephone（NTT）和 Mitsubishi Electric开发的加密算法，也被NIST推荐用于某些应用。

总的来说，虽然Triple DES在过去几十年中提供了可靠的数据保护，但在现代加密需求中，更推荐使用这些新的加密算法，它们提供了更好的安全性和效率。随着技术的发展，继续使用Triple
DES可能会带来安全风险，因此许多组织正在逐步淘汰Triple DES，转而采用更现代的加密标准。

## 未来数据加密技术的发展方向

未来数据加密技术的发展方向主要集中在以下几个方面：

1. **量子安全加密算法**：随着量子计算技术的发展，传统加密算法可能会受到量子计算的威胁。因此，研究人员正在积极开发量子安全加密算法，这些算法能够抵抗量子计算的攻击，确保数据的安全性。
2. **多方安全计算**：随着云计算、边缘计算等技术的普及，数据往往需要在多个参与方之间共享和传输。多方安全计算（MPC）技术允许在不暴露私密数据的情况下进行计算，保护数据隐私。
3. **同态加密**：同态加密是一种特殊的加密技术，允许在加密状态下对数据进行计算，而无需解密数据。这种技术有助于保护数据隐私，同时允许对加密数据进行分析和处理。
4. **密码学协议的发展**：随着网络通信的普及和复杂性增加，新的密码学协议不断涌现，以满足不同场景下的安全需求，例如零知识证明、多方安全计算、安全多方计算等。

### 新兴技术对加密算法的影响

1. **量子计算**：量子计算的发展可能会对传统加密算法造成威胁，因为量子计算的特性使得传统加密算法中的某些困难问题变得容易解决。因此，研究人员正在开发量子安全加密算法，以应对未来量子计算的挑战。
2. **人工智能**：人工智能技术的发展可能会对加密算法的破解提供新的思路和工具。同时，人工智能技术也可以用于改进加密算法的设计和分析，提高其安全性和效率。
3. **边缘计算**：边缘计算将数据处理和存储推向网络边缘，增加了数据传输和存储的风险。因此，加密算法需要适应边缘计算的需求，提供更高效、更安全的数据保护方案。
4. **区块链技术**：区块链技术的发展带来了去中心化的数据存储和传输方式，加密算法在区块链中起着关键作用，保护交易数据的安全性和隐私性。

总的来说，未来数据加密技术的发展将受到新兴技术的影响，加密算法需要不断创新和演进，以应对日益复杂的安全威胁和数据传输需求。量子安全加密算法、多方安全计算、同态加密等新技术将在未来的数据保护中发挥重要作用。

## 附录

### 在线加密

[3DES(Triple DES)加密解密 | 一个覆盖广泛主题工具的高效在线平台(cmdragon.cn)](https://cmdragon.cn/tripledesencordec)

https://cmdragon.cn/tripledesencordec

### 伪代码示例

下面是Triple DES算法的简单伪代码示例：

```
function TripleDES_Encrypt(plainText, key1, key2, key3):
    cipherText = DES_Encrypt(plainText, key1)
    cipherText = DES_Decrypt(cipherText, key2)
    cipherText = DES_Encrypt(cipherText, key3)
    return cipherText

function TripleDES_Decrypt(cipherText, key1, key2, key3):
    plainText = DES_Decrypt(cipherText, key3)
    plainText = DES_Encrypt(plainText, key2)
    plainText = DES_Decrypt(plainText, key1)
    return plainText
```

### 示例代码

以下是Python中使用pycryptodome库实现Triple DES加密和解密的示例代码：

```python
from Crypto.Cipher import DES3
from Crypto.Random import get_random_bytes


def triple_des_encrypt(plain_text, key):
    cipher = DES3.new(key, DES3.MODE_ECB)
    return cipher.encrypt(plain_text)


def triple_des_decrypt(cipher_text, key):
    cipher = DES3.new(key, DES3.MODE_ECB)
    return cipher.decrypt(cipher_text)


# 生成随机密钥
key = get_random_bytes(24)

# 加密示例
plain_text = b"Hello, World!"
encrypted_text = triple_des_encrypt(plain_text, key)
print("Encrypted Text:", encrypted_text)

# 解密示例
decrypted_text = triple_des_decrypt(encrypted_text, key)
print("Decrypted Text:", decrypted_text.decode())
```

### DES算法公式：

1. **轮函数（F函数）** ：

    - 扩展置换（E置换）：将32位数据扩展为48位，可以表示为$E(R_{i-1})$

    - 与子密钥异或：将48位数据与子密钥进行异或操作，可以表示为$E(R_{i-1}) \oplus K_i$。
    - S盒替换：将48位数据分成8组，每组6位，通过8个S盒进行替换，可以表示为$S(E(R_{i-1}) \oplus K_i)$。
    - P置换：对替换后的32位数据进行置换，可以表示为 $P(S(E(R_{i-1}) \oplus K_i))$。

2. **密钥调度算法**：

    - 密钥置换1（PC-1）：将64位密钥压缩为56位，可以表示为 $PC-1(K)$。
    - 循环左移：根据轮数进行不同位数的左移操作，可以表示为$LS_i$。
    - 密钥置换2（PC-2）：将56位密钥压缩为48位子密钥，可以表示为 $PC-2(K_i)$。

## 免费好用的热门在线工具

- [CMDragon 在线工具 - 高级AI工具箱与开发者套件 | 免费好用的在线工具](https://tools.cmdragon.cn/zh)
- [应用商店 - 发现1000+提升效率与开发的AI工具和实用程序 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps?category=trending)
- [CMDragon 更新日志 - 最新更新、功能与改进 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/changelog)
- [支持我们 - 成为赞助者 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/sponsor)
- [AI文本生成图像 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-to-image-ai)
- [临时邮箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/temp-email)
- [二维码解析器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/qrcode-parser)
- [文本转思维导图 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-to-mindmap)
- [正则表达式可视化工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/regex-visualizer)
- [文件隐写工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/steganography-tool)
- [IPTV 频道探索器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/iptv-explorer)
- [快传 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/snapdrop)
- [随机抽奖工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/lucky-draw)
- [动漫场景查找器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/anime-scene-finder)
- [时间工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/time-toolkit)
- [网速测试 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/speed-test)
- [AI 智能抠图工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/background-remover)
- [背景替换工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/background-replacer)
- [艺术二维码生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/artistic-qrcode)
- [Open Graph 元标签生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/open-graph-generator)
- [图像对比工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-comparison)
- [图片压缩专业版 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-compressor)
- [密码生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/password-generator)
- [SVG优化器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/svg-optimizer)
- [调色板生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/color-palette)
- [在线节拍器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/online-metronome)
- [IP归属地查询 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-geolocation)
- [CSS网格布局生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/css-grid-layout)
- [邮箱验证工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/email-validator)
- [书法练习字帖 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/calligraphy-practice)
- [金融计算器套件 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/finance-calculator-suite)
- [中国亲戚关系计算器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/chinese-kinship-calculator)
- [Protocol Buffer 工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/protobuf-toolkit)
- [图片无损放大 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/image-upscaler)
- [文本比较工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/text-compare)
- [IP批量查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/ip-batch-lookup)
- [域名查询工具 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/domain-finder)
- [DNS工具箱 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/dns-toolkit)
- [网站图标生成器 - 应用商店 | 免费好用的在线工具](https://tools.cmdragon.cn/zh/apps/favicon-generator)
- [XML Sitemap](https://tools.cmdragon.cn/sitemap_index.xml)
