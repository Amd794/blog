---
title: 在不同操作系统上安装 PostgreSQL
date: 2024/12/26
updated: 2024/12/26
author: cmdragon

excerpt:
  PostgreSQL 是当今最受欢迎的开源关系数据库管理系统之一，由于其强大的功能和灵活性，广泛应用于不同的行业和应用场景。在开始使用 PostgreSQL 之前，用户需要了解如何在不同的操作系统（如 Linux、Windows 和 macOS）上正确安装。每种操作系统都有其独特的安装步骤和注意事项，因此掌握这些细节对于顺利搭建数据库环境至关重要。

categories:
  - 前端开发

tags:
  - PostgreSQL
  - 安装指南
  - 操作系统
  - Linux
  - Windows
  - macOS
  - 数据库管理
---

<img src="https://static.amd794.com/blog/images/2024_12_26 16_20_10.png@blog" title="2024_12_26 16_20_10.png" alt="2024_12_26 16_20_10.png"/>

<img src="https://static.amd794.com/blog/images/cmdragon_cn.png" title="cmdragon_cn.png" alt="cmdragon_cn.png"/>


扫描[二维码](https://static.amd794.com/blog/images/cmdragon_cn.png)关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`


PostgreSQL 是一种广泛使用的开源关系数据库管理系统，具有高度的灵活性和强大的功能，适用于多种操作系统。在不同的操作系统上安装 PostgreSQL 时，各自的环境特点和配置要求各不相同。在主要操作系统—包括 Linux、Windows 和 macOS—上安装 PostgreSQL 的步骤及注意事项。通过对这些安装过程的深入分析，读者将能够掌握在不同平台上成功安装和配置 PostgreSQL 的最佳实践，从而实现高效、安全的数据库管理。



### 1. 引言
PostgreSQL 是当今最受欢迎的开源关系数据库管理系统之一，由于其强大的功能和灵活性，广泛应用于不同的行业和应用场景。在开始使用 PostgreSQL 之前，用户需要了解如何在不同的操作系统（如 Linux、Windows 和 macOS）上正确安装。每种操作系统都有其独特的安装步骤和注意事项，因此掌握这些细节对于顺利搭建数据库环境至关重要。

### 2. 在 Linux 上安装 PostgreSQL
Linux 是 PostgreSQL 的主要发展平台，许多 Linux 发行版均提供了 PostgreSQL 的安装包。以下是一些主要的 Linux 发行版上安装 PostgreSQL 的步骤。

#### 2.1 Ubuntu 系列
1. **更新软件包列表**：
   ```bash
   sudo apt update
   ```

2. **安装 PostgreSQL**：
   默认的 Ubuntu 软件库中包含 PostgreSQL，直接使用命令安装：
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

3. **验证安装**：
   安装完成后，可以通过以下命令验证 PostgreSQL 是否正常运行：
   ```bash
   sudo systemctl status postgresql
   ```

4. **配置 PostgreSQL**：
   默认情况下，PostgreSQL 使用 `postgres` 用户进行管理。可以通过以下命令切换到该用户：
   ```bash
   sudo -i -u postgres
   ```

5. **创建数据库和用户**：
   使用 `psql` 工具创建新数据库和用户：
   ```bash
   createdb mydb
   createuser myuser --pwprompt
   ```

#### 2.2 CentOS 系列
1. **安装 EPEL 仓库**：
   ```bash
   sudo yum install epel-release
   ```

2. **安装 PostgreSQL**：
   PostgreSQL 的官方仓库提供了更为最新的版本，可以通过以下步骤添加该仓库并安装：
   ```bash
   sudo yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm
   sudo yum install postgresql12 postgresql12-server postgresql12-contrib
   ```

3. **初始化数据库**：
   安装后，初始化 PostgreSQL 数据库：
   ```bash
   sudo /usr/pgsql-12/bin/postgresql12-setup initdb
   ```

4. **启动 PostgreSQL 服务**：
   ```bash
   sudo systemctl start postgresql-12
   sudo systemctl enable postgresql-12
   ```

5. **防火墙设置**：
   如果需要远程访问，需在防火墙中开放 PostgreSQL 默认端口（5432）：
   ```bash
   sudo firewall-cmd --zone=public --add-port=5432/tcp --permanent
   sudo firewall-cmd --reload
   ```

#### 2.3 其他 Linux 发行版
其他发行版上的安装过程大致相似，用户需要根据可用的包管理工具和软件库进行调整。例如，在 Arch Linux 上，可以使用 `pacman` 进行安装：
```bash
sudo pacman -S postgresql
```

### 3. 在 Windows 上安装 PostgreSQL
在 Windows 上安装 PostgreSQL 相对直观，以下是详细步骤：

#### 3.1 下载安装程序
访问 PostgreSQL 官方网站（https://www.postgresql.org/download/windows/ ）下载 Windows 安装包。安装包包括图形化安装程序，简化了安装过程。

#### 3.2 运行安装程序
1. **启动安装程序**：
   双击下载的 `.exe` 文件以启动安装向导。

2. **选择安装目录**：
   在安装向导中，选择 PostgreSQL 的安装目录。默认的路径通常为：
   ```
   C:\Program Files\PostgreSQL\<版本号>\
   ```

3. **选择组件**：
   在组件选择界面，用户可以选择安装哪些组件，通常包括数据库服务器、pgAdmin（管理工具）等。

4. **设置超级用户**：
   在此步骤中，用户需要设置 PostgreSQL 的超级用户（默认是 `postgres`）的密码。

5. **配置端口**：
   默认情况下，PostgreSQL 使用 5432 端口。用户可以根据需要修改该端口，但建议保持默认值。

6. **选择 Locale**：
   确定数据库的区域设置，通常选择默认即可。

7. **完成安装**：
   完成所有配置后，点击“安装”，等待安装程序完成安装过程。

8. **启动 PostgreSQL**：
   安装完成后，PostgreSQL 服务会自动启动，可以通过“服务”管理工具查看服务状态。

#### 3.3 使用 pgAdmin 管理数据库
在 Windows 安装 PostgreSQL 后，可以通过 pgAdmin 图形化界面管理数据库，创建新数据库、用户并执行 SQL 查询。

### 4. 在 macOS 上安装 PostgreSQL
macOS 用户可以通过 Homebrew 或官方安装包来安装 PostgreSQL，以下是具体方法。

#### 4.1 通过 Homebrew 安装
1. **安装 Homebrew**（如果尚未安装）：
   打开终端并运行以下命令：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **更新 Homebrew**：
   ```bash
   brew update
   ```

3. **安装 PostgreSQL**：
   使用以下命令安装 PostgreSQL：
   ```bash
   brew install postgresql
   ```

4. **启动 PostgreSQL 服务**：
   安装完成后，可以启动 PostgreSQL 服务：
   ```bash
   brew services start postgresql
   ```

5. **创建数据库和用户**：
   切换到 PostgreSQL 用户并创建数据库及用户：
   ```bash
   createuser myuser --pwprompt
   createdb mydb
   ```

#### 4.2 通过官方安装包安装
1. **下载安装包**：
   访问 PostgreSQL 官方网站（https://www.postgresql.org/download/macosx/），下载适合的 `.dmg` 文件。

2. **安装 PostgreSQL**：
   双击 `.dmg` 文件并按步骤安装，通常会引导您设置密码和选择组件。

3. **配置环境变量**：
   安装完成后，可能需要将 PostgreSQL 的 `bin` 目录添加到系统的 PATH 变量中，以便在终端中直接使用 PostgreSQL 命令行工具。

### 5. 安装后的配置
无论是在何种操作系统上安装 PostgreSQL，完成基本安装后，用户都应进行一些基本配置，以确保数据库的顺利运行。

#### 5.1 数据目录权限
确保 PostgreSQL 数据目录对 PostgreSQL 服务账户是可写的，这通常是默认配置，但在手动创建或移动数据目录时需要加以确认。

#### 5.2 远程访问设置
如果需要从远程客户端访问 PostgreSQL 数据库，用户需要在 `pg_hba.conf` 文件中配置允许特定IP或网络的连接。

#### 5.3 性能优化
可以根据具体应用场景调整 PostgreSQL 的性能参数，例如 `shared_buffers`、`work_mem` 和 `maintenance_work_mem` 等。这些参数的合理设置可以显著提高数据库的性能。

### 6. 常见问题及解决方案
在安装 PostgreSQL 时，用户可能会遇到一些常见问题，以下是一些解决方案：

#### 6.1 安装失败
确保在安装过程中没有其他 PostgreSQL 实例正在运行，并查看安装日志以获取详细的错误信息。

#### 6.2 连接问题
如果无法连接到 PostgreSQL，首先检查服务是否正在运行，确保防火墙未阻止连接，此外，确保使用正确的用户凭据。

#### 6.3 数据库管理工具问题
如果遇到 pgAdmin 等管理工具连接不上数据库，可以检查配置文件的连接设置，确保使用正确的主机、端口和用户信息。

### 7. 结论
PostgreSQL 是强大的开源关系型数据库管理系统，其在不同操作系统上的安装过程具备一定的特殊性。本文详细探讨了在 Linux、Windows 和 macOS 上安装 PostgreSQL 的步骤，以及一些关键配置和常见问题的解决方案。通过谨慎遵循这些安装和配置步骤，用户将能够顺利搭建出高效、稳定的 PostgreSQL 数据库环境，从而充分发挥其强大的数据管理能力。

余下文章内容请点击跳转至 个人博客页面 或者 扫码关注或者微信搜一搜：`编程智域 前端至全栈交流与成长`，阅读完整的文章：

## 往期文章归档：

- [PostgreSQL 的系统要求 | cmdragon's Blog](https://blog.cmdragon.cn/posts/fbc881562406/)
- [PostgreSQL 的特点 | cmdragon's Blog](https://blog.cmdragon.cn/posts/460161ea1fb7/)
- [ORM框架与数据库交互 | cmdragon's Blog](https://blog.cmdragon.cn/posts/461e7d030710/)
- [数据库与编程语言的连接 | cmdragon's Blog](https://blog.cmdragon.cn/posts/62cc5ce768cb/)
- [数据库审计与监控 | cmdragon's Blog](https://blog.cmdragon.cn/posts/b43392b9088f/)
- [数据库高可用性与容灾 | cmdragon's Blog](https://blog.cmdragon.cn/posts/a93af3924801/)
- [数据库性能优化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/eb7202efbdae/)
- [备份与恢复策略 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0f3edf9550ac/)
- [索引与性能优化 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0fd4e9a4123a/)
- [事务管理与锁机制 | cmdragon's Blog](https://blog.cmdragon.cn/posts/21e8e33b5a0c/)
- [子查询与嵌套查询 | cmdragon's Blog](https://blog.cmdragon.cn/posts/ef7711d5077d/)
- [多表查询与连接 | cmdragon's Blog](https://blog.cmdragon.cn/posts/cbc5ebea2633/)
- [查询与操作 | cmdragon's Blog](https://blog.cmdragon.cn/posts/45016c6a3d2d/)
- [数据类型与约束 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1aff87ac2263/)
- [数据库的基本操作 | cmdragon's Blog](https://blog.cmdragon.cn/posts/541c699d86de/)
- [数据库设计原则与方法 | cmdragon's Blog](https://blog.cmdragon.cn/posts/daf29831e102/)
- [数据库与数据库管理系统概述 | cmdragon's Blog](https://blog.cmdragon.cn/posts/dc1046549846/)
- [Nuxt.js 应用中的 afterResponse 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/d64fddbcad54/)
- [Nuxt.js 应用中的 request 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0c461d69ac0d/)
- [Nuxt.js 应用中的 error 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1bd4e4574b1a/)
- [Nuxt.js 应用中的 close 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0bb0cade5fa2/)
- [Nuxt.js 应用中的 render：island 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/47bf55a8b641/)
- [Nuxt.js 应用中的 render：html 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0f91c080fd2c/)
- [Nuxt.js 应用中的 render：response 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3ce5250cec36/)
- [Nuxt.js 应用中的 dev：ssr-logs 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/1b63f35eebe8/)
- [Nuxt.js 应用中的 webpack：progress 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/533d23bcbe61/)
- [Nuxt.js 应用中的 webpack：done 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/3e8fa49cbd4b/)
- [Nuxt.js 应用中的 webpack：error 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/0fb47ad58e14/)
- [Nuxt.js 应用中的 webpack：change 事件钩子 | cmdragon's Blog](https://blog.cmdragon.cn/posts/43a57e843f48/)
-


