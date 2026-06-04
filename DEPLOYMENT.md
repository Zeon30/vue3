# 科技新闻网站部署文档

## 目录

1. [环境要求](#环境要求)
2. [服务器准备](#服务器准备)
3. [数据库配置](#数据库配置)
4. [项目部署](#项目部署)
5. [前端构建](#前端构建)
6. [域名配置](#域名配置)
7. [安全组配置](#安全组配置)
8. [SSL证书配置](#ssl证书配置)
9. [数据导入](#数据导入)
10. [常用命令](#常用命令)
11. [故障排查](#故障排查)
12. [部署常见问题总结](#部署常见问题总结)

---

## 环境要求

### 服务器配置

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 1核 | 2核+ |
| 内存 | 1GB | 2GB+ |
| 硬盘 | 20GB | 40GB+ |
| 系统 | Ubuntu 20.04 | Ubuntu 22.04 |

### 软件版本

| 软件 | 版本要求 |
|------|----------|
| Node.js | >= 18.0.0 |
| MySQL | >= 8.0 |
| Nginx | >= 1.18 |
| PM2 | 全局安装 |

---

## 服务器准备

### 1. 登录服务器

```bash
ssh root@your_server_ip
```

### 2. 更新系统

```bash
apt update && apt upgrade -y
```

### 3. 安装 Node.js

```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 4. 安装 MySQL

```bash
apt install -y mysql-server

# 启动 MySQL
systemctl start mysql
systemctl enable mysql

# 安全配置
mysql_secure_installation
```

### 5. 安装 Nginx

```bash
apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

### 6. 安装 PM2

```bash
npm install -g pm2
```

### 7. 安装 Certbot（SSL 证书工具）

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 数据库配置

### 1. 创建数据库和用户

```bash
# 登录 MySQL
mysql -u root -p

# 执行以下 SQL
```

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS tech_news
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 创建用户（请修改密码）
CREATE USER 'tech_news'@'localhost' IDENTIFIED BY '你的强密码';

-- 授权
GRANT ALL PRIVILEGES ON tech_news.* TO 'tech_news'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 2. 配置远程连接（可选）

如需从本地 Navicat 远程连接数据库，需进行以下配置：

#### 2.1 开放安全组端口

在阿里云/腾讯云控制台，添加入方向规则：

| 协议类型 | 端口范围 | 授权对象 | 说明 |
|----------|----------|----------|------|
| 自定义 TCP | 3306 | 你的本地公网IP/32 | MySQL 远程连接 |

> **获取本地公网 IP**：访问 https://ip.sb 或百度搜索「IP」

> ⚠️ **安全建议**：授权对象填写 `你的IP/32`，不要填写 `0.0.0.0/0`（允许所有人访问）

#### 2.2 创建远程访问用户

```bash
mysql -u root -p
```

```sql
-- 创建允许远程连接的用户
CREATE USER 'tech_news'@'%' IDENTIFIED BY '你的强密码';

-- 授权
GRANT ALL PRIVILEGES ON tech_news.* TO 'tech_news'@'%';
FLUSH PRIVILEGES;

-- 验证
SELECT User, Host FROM mysql.user WHERE User = 'tech_news';
EXIT;
```

#### 2.3 修改 MySQL 监听地址

```bash
nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

找到 `bind-address` 行，修改为：

```ini
bind-address = 0.0.0.0
```

保存后重启 MySQL：

```bash
systemctl restart mysql
```

#### 2.4 Navicat 连接设置

打开 Navicat，新建 MySQL 连接：

| 设置项 | 值 |
|--------|-----|
| 连接名 | tech_news（自定义） |
| 主机 | 服务器公网 IP |
| 端口 | 3306 |
| 用户名 | tech_news |
| 密码 | 数据库密码 |

点击「测试连接」，成功后保存。

#### 2.5 更安全的方式：SSH 隧道（推荐）

不开放 3306 端口，通过 SSH 隧道连接更安全。

**Navicat 设置：**

1. **常规** 标签页：
   - 主机：`127.0.0.1`
   - 端口：`3306`
   - 用户名：`tech_news`
   - 密码：数据库密码

2. **SSH** 标签页：
   - 勾选「使用 SSH 通道」
   - 主机：服务器公网 IP
   - 端口：22
   - 用户名：root
   - 认证方式：密码 或 公钥

此方式无需开放 MySQL 端口，通过 SSH 加密通道连接，安全性更高。

### 2. 导入表结构

```bash
# 上传项目后执行
mysql -u tech_news -p tech_news < /root/tech-news-web/database/init.sql
```

### 3. 验证表结构

```bash
mysql -u tech_news -p -e "USE tech_news; SHOW TABLES;"
```

预期输出：
```
+---------------------+
| Tables_in_tech_news |
+---------------------+
| articles            |
| categories          |
| collection_logs     |
| knowledge_edges     |
| knowledge_nodes     |
| search_history      |
| system_config       |
+---------------------+
```

---

## 项目部署

### 1. 上传项目文件

方式一：使用 Git（推荐）

```bash
cd /root
git clone https://github.com/your-repo/tech-news-web.git
```

方式二：使用 SCP 上传

```bash
# 本地执行
scp -r tech-news-web root@your_server_ip:/root/
```

### 2. 配置环境变量

**重要：backend/.env 文件必须手动创建**

```bash
cd /root/tech-news-web/backend

# 创建 .env 文件（使用 nano 编辑）
nano .env
```

粘贴以下内容，**修改 DB_PASSWORD 为你的真实数据库密码**：

```ini
# 服务端口
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=tech_news
DB_PASSWORD=你的强密码
DB_DATABASE=tech_news

# JWT密钥（可选）
JWT_SECRET=your_jwt_secret_here

# CORS 允许的域名
CORS_ORIGIN=https://www.xiaisle.com,https://xiaisle.com,http://localhost:5173

# 日志级别
LOG_LEVEL=info

# 缓存配置
CACHE_ENABLED=true
CACHE_TTL=300
```

保存退出：
```
Ctrl + O → 回车 → Ctrl + X
```

验证文件内容：
```bash
cat .env
```

### 3. 安装依赖

```bash
# 后端
cd /root/tech-news-web/backend
npm install --production
```

### 4. 启动后端服务

```bash
cd /root/tech-news-web

# 创建日志目录
mkdir -p logs

# 启动服务
pm2 start deployment/ecosystem.config.json --update-env

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

验证服务状态：

```bash
pm2 status
```

预期输出：
```
┌────┬─────────────────────┬─────────┬─────────┐
│ id │ name                │ status  │ cpu     │
├────┼─────────────────────┼─────────┼─────────┤
│ 0  │ tech-news-backend   │ online  │ 0%     │
│ 1  │ tech-news-backend   │ online  │ 0%     │
└────┴─────────────────────┴─────────┴─────────┘
```

测试后端 API：

```bash
curl http://127.0.0.1:3000/api/health
```

---

## 前端构建

### 方式一：本地构建后上传（推荐）

避免服务器内存不足导致构建失败。

**在本地 Windows 执行：**

```bash
cd tech-news-web/frontend
npm install
npm install terser --save-dev
npm run build
```

构建完成后，上传 `dist` 目录到服务器：

```bash
# 本地执行
scp -r frontend/dist root@your_server_ip:/root/tech-news-web/frontend/
```

### 方式二：服务器构建

如果服务器内存 ≥ 2GB，可直接在服务器构建：

```bash
cd /root/tech-news-web/frontend
npm install
npm install terser --save-dev
npm run build
```

如果内存不足导致 `Killed`，添加 swap：

```bash
# 创建 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 重新构建
npm run build
```

### 验证前端文件

```bash
ls /root/tech-news-web/frontend/dist/index.html
```

---

## 域名配置

### 1. 域名解析

在域名服务商（阿里云、腾讯云）配置 DNS 解析：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | www | 服务器IP |
| A | @ | 服务器IP |

验证解析：

```bash
ping www.xiaisle.com
```

返回 IP 应为你的服务器公网 IP。

### 2. 配置 Nginx（HTTP 版本，先用于 SSL 申请）

**重要：SSL 申请前必须使用 HTTP-only 配置**

```bash
# 创建 HTTP 配置
cat > /etc/nginx/sites-available/tech-news.conf <<'EOF'
server {
    listen 80;
    server_name www.xiaisle.com xiaisle.com;

    root /root/tech-news-web/frontend/dist;
    index index.html;

    access_log /var/log/nginx/tech-news-access.log;
    error_log /var/log/nginx/tech-news-error.log;

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 创建软链接
ln -sf /etc/nginx/sites-available/tech-news.conf /etc/nginx/sites-enabled/tech-news.conf

# 删除默认配置
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t
```

### 3. 修复目录权限

**重要：Nginx 默认无法访问 /root 目录**

```bash
chmod 755 /root
chmod 755 /root/tech-news-web
chmod 755 /root/tech-news-web/frontend
chmod 755 /root/tech-news-web/frontend/dist
chmod 755 /root/tech-news-web/frontend/dist/assets
```

重载 Nginx：

```bash
systemctl reload nginx
```

测试 HTTP 访问：

```bash
curl -I http://你的服务器IP
curl http://127.0.0.1/api/health
```

---

## 安全组配置

**阿里云/腾讯云服务器必须开放端口**

### 阿里云安全组配置

1. 登录 [阿里云 ECS 控制台](https://ecs.console.aliyun.com/)
2. 找到实例 → 安全组 → 配置规则
3. 添加入方向规则：

| 协议类型 | 端口范围 | 授权对象 | 描述 |
|----------|----------|----------|------|
| 自定义 TCP | 80 | 0.0.0.0/0 | HTTP |
| 自定义 TCP | 443 | 0.0.0.0/0 | HTTPS |

### 验证端口开放

```bash
curl -I http://你的服务器公网IP
```

如果返回响应（非 timeout），说明端口已开放。

---

## SSL证书配置

### 1. 申请 Let's Encrypt 证书

```bash
certbot --nginx -d www.xiaisle.com -d xiaisle.com
```

按提示操作：
- 输入邮箱
- 同意条款：输入 `y`
- 是否订阅邮件：输入 `n`
- 是否重定向 HTTP 到 HTTPS：选择 `2`（推荐）

### 2. 验证 HTTPS

```bash
nginx -t
systemctl reload nginx

curl -I https://www.xiaisle.com
curl https://www.xiaisle.com/health
```

### 3. 自动续期

Certbot 会自动添加续期任务，测试续期：

```bash
certbot renew --dry-run
```

---

## 数据导入

项目已移除定时任务，改为手动导入数据。可通过 SQL 或 CSV 两种方式导入。

### 数据格式说明

#### 1. articles 表（新闻文章）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| title | VARCHAR(500) | ✓ | 文章标题 | "OpenAI 发布 GPT-5" |
| link | VARCHAR(1000) | ✓ | 原文链接（唯一） | "https://techcrunch.com/..." |
| source | VARCHAR(100) | ✓ | 来源网站 | "TechCrunch" |
| category | VARCHAR(50) | ✓ | 分类（见 categories 表） | "AI" |
| author | VARCHAR(200) | | 作者 | "John Doe" |
| media_type | VARCHAR(50) | | 媒体类型 | "权威媒体" |
| summary | TEXT | | 核心摘要 | "OpenAI 正式发布..." |
| tech_tags | VARCHAR(500) | | 技术标签（逗号分隔） | "GPT-5,大语言模型,AGI" |
| tech_term | VARCHAR(200) | | 技术术语 | "GPT-5" |
| tech_term_explain | TEXT | | 术语解释 | "第五代大语言模型" |
| development_stage | VARCHAR(50) | | 发展阶段 | "成熟应用" |
| market_analysis | TEXT | | 市场分析 | "预计加速竞争..." |
| article_date | DATE | ✓ | 文章日期 | "2026-06-03" |

**有效分类值（来自 categories 表）：**
- AI（人工智能）
- TECH（科技巨头）
- Tech（科技产业）
- AUTO（智能汽车）
- US ECONOMY（美国经济）
- BUSINESS（商业动态）
- Tech Analysis（科技分析）
- Dev（软件开发）
- IT（企业IT）
- Product（产品设计）
- Marketing（数字营销）

#### 2. knowledge_nodes 表（知识图谱节点）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| node_id | VARCHAR(200) | ✓ | 节点唯一标识（唯一） | "openai" |
| node_name | VARCHAR(200) | ✓ | 节点名称 | "OpenAI" |
| node_type | ENUM | ✓ | 节点类型 | '技术'/'公司'/'人物'/'概念' |
| source | VARCHAR(100) | | 来源 | "TechCrunch" |
| first_seen | DATE | | 首次出现日期 | "2026-06-03" |
| mention_count | INT | | 提及次数 | 5 |

**node_type 有效值：**
- 技术
- 公司
- 人物
- 概念

#### 3. knowledge_edges 表（知识图谱关系）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| source_node_id | INT | ✓ | 源节点ID（引用 knowledge_nodes.id） | 1 |
| target_node_id | INT | ✓ | 目标节点ID | 2 |
| relation_type | VARCHAR(100) | | 关系类型 | "发布" |
| weight | INT | | 关系权重 | 3 |
| first_seen | DATE | | 首次出现日期 | "2026-06-03" |

#### 4. collection_logs 表（采集日志）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| collection_date | DATE | ✓ | 采集日期 | "2026-06-03" |
| source | VARCHAR(100) | ✓ | 数据源 | "手动导入" |
| status | ENUM | ✓ | 状态 | 'success'/'failed'/'partial' |
| articles_count | INT | | 采集文章数 | 10 |
| error_message | TEXT | | 错误信息 | NULL |
| completed_at | TIMESTAMP | | 完成时间 | NOW() |

### 导入方式一：SQL 导入（推荐）

#### 使用 Navicat 执行 SQL

1. 打开 Navicat，连接到 `tech_news` 数据库
2. 点击 **查询** → **新建查询**
3. 复制 `database/import_example.sql` 内容或编写自定义 SQL
4. 点击 **运行** 执行

#### SQL 示例模板

```sql
-- 插入单篇文章
INSERT INTO articles (title, link, source, category, author, media_type, summary, tech_tags, tech_term, tech_term_explain, development_stage, market_analysis, article_date)
VALUES (
  'OpenAI 发布 GPT-5',
  'https://techcrunch.com/2026/06/03/openai-gpt5',
  'TechCrunch',
  'AI',
  'John Doe',
  '权威媒体',
  'OpenAI 正式发布了新一代大语言模型 GPT-5...',
  'GPT-5,大语言模型,AGI',
  'GPT-5',
  'OpenAI 第五代大语言模型',
  '成熟应用',
  '预计将加速 AI 行业竞争',
  '2026-06-03'
);

-- 插入知识图谱节点
INSERT INTO knowledge_nodes (node_id, node_name, node_type, source, first_seen, mention_count)
VALUES ('openai', 'OpenAI', '公司', 'TechCrunch', '2026-06-03', 5)
ON DUPLICATE KEY UPDATE mention_count = mention_count + VALUES(mention_count);

-- 插入知识图谱关系（先查询节点 ID）
-- SELECT id FROM knowledge_nodes WHERE node_id = 'openai';
INSERT INTO knowledge_edges (source_node_id, target_node_id, relation_type, weight, first_seen)
VALUES (1, 2, '发布', 3, '2026-06-03')
ON DUPLICATE KEY UPDATE weight = weight + VALUES(weight);

-- 记录导入日志
INSERT INTO collection_logs (collection_date, source, status, articles_count, completed_at)
VALUES ('2026-06-03', '手动导入', 'success', 10, NOW());
```

#### 批量插入模板

```sql
-- 批量插入文章
INSERT INTO articles (title, link, source, category, author, media_type, summary, tech_tags, tech_term, tech_term_explain, development_stage, market_analysis, article_date)
VALUES
  ('文章1标题', '链接1', '来源1', 'AI', '作者1', '权威媒体', '摘要1', '标签1', '术语1', '解释1', '成熟应用', '分析1', '2026-06-03'),
  ('文章2标题', '链接2', '来源2', 'TECH', '作者2', '科技博客', '摘要2', '标签2', '术语2', '解释2', '快速成长', '分析2', '2026-06-03'),
  ('文章3标题', '链接3', '来源3', 'AUTO', '作者3', '权威媒体', '摘要3', '标签3', '术语3', '解释3', '商业化', '分析3', '2026-06-03');
```

### 导入方式二：CSV 导入

#### 准备 CSV 文件

参考 `database/import_template.csv`，格式如下：

```csv
title,link,source,category,author,media_type,summary,tech_tags,tech_term,tech_term_explain,development_stage,market_analysis,article_date
OpenAI 发布 GPT-5,https://techcrunch.com/...,TechCrunch,AI,John Doe,权威媒体,OpenAI 正式发布...,GPT-5|大语言模型|AGI,GPT-5,第五代大语言模型,成熟应用,预计加速竞争,2026-06-03
Google 发布 Gemini 2.0,https://theverge.com/...,The Verge,TECH,Jane Smith,权威媒体,Google 推出...,Gemini 2.0|Google AI,Gemini 2.0,多模态模型,快速成长,与 GPT-5 竞争,2026-06-03
```

**注意事项：**
- 第一行是表头，必须与字段顺序一致
- tech_tags 使用 `|` 分隔（或使用逗号）
- article_date 格式：YYYY-MM-DD
- link 必须唯一，重复会报错
- category 必须是有效值（见上表）

#### 使用 Navicat 导入 CSV

1. Navicat → 右键 `articles` 表 → **导入向导**
2. 选择 **CSV 文件**
3. 选择文件路径
4. 字段映射：自动匹配或手动调整
5. **导入模式**：选择 `INSERT` 或 `INSERT IGNORE`（忽略重复）
6. 点击 **开始** 执行导入

### 导入后验证

```sql
-- 查看文章数量
SELECT COUNT(*) FROM articles WHERE article_date = '2026-06-03';

-- 查看知识图谱节点
SELECT * FROM knowledge_nodes ORDER BY mention_count DESC LIMIT 10;

-- 查看导入日志
SELECT * FROM collection_logs WHERE collection_date = '2026-06-03';
```

---

## 常用命令

### PM2 管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs
pm2 logs tech-news-backend --lines 100

# 重启服务
pm2 restart tech-news-backend

# 停止服务
pm2 stop all

# 监控面板
pm2 monit
```

### Nginx 管理

```bash
# 测试配置
nginx -t

# 重载配置
systemctl reload nginx

# 重启服务
systemctl restart nginx

# 查看状态
systemctl status nginx

# 查看错误日志
tail -f /var/log/nginx/tech-news-error.log
```

### MySQL 管理

```bash
# 登录
mysql -u tech_news -p

# 备份数据库
mysqldump -u tech_news -p tech_news > backup_$(date +%Y%m%d).sql

# 恢复数据库
mysql -u tech_news -p tech_news < backup_20260603.sql
```

### SSL 证书管理

```bash
# 查看证书状态
certbot certificates

# 手动续期
certbot renew

# 测试续期
certbot renew --dry-run
```

---

## 故障排查

### 1. 后端服务无法启动

**检查日志：**
```bash
pm2 logs tech-news-backend --lines 100
```

**常见问题：**

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| Access denied for user | .env 中密码错误 | 修正 DB_PASSWORD |
| Unknown database 'tech_news' | 数据库未创建 | 执行 init.sql |
| .env not found | 环境文件缺失 | 手动创建 .env |
| EADDRINUSE: port 3000 | 端口被占用 | `lsof -i :3000` 杀掉进程 |

### 2. 前端页面 500 错误

**检查 Nginx 日志：**
```bash
tail -f /var/log/nginx/tech-news-error.log
```

**常见问题：**

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| Permission denied | Nginx 无权限访问 /root | `chmod 755 /root` |
| No such file or directory | dist 目录不存在 | 上传 dist 或重新构建 |
| cannot load certificate | SSL 证书不存在 | 先用 HTTP 配置再申请 SSL |

### 3. SSL 证书申请失败

**错误：Timeout during connect (likely firewall problem)**

**原因：** 安全组未开放 80 端口

**解决方案：** 在阿里云/腾讯云安全组添加入方向规则（端口 80/443）

### 4. 前端构建失败（Killed）

**原因：** 服务器内存不足（OOM）

**解决方案：**
```bash
# 添加 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
npm run build
```

或使用本地构建上传。

### 5. 浏览器访问域名超时

**检查步骤：**
```bash
# 1. 确认域名解析
ping www.xiaisle.com

# 2. 确认端口开放
curl -I http://服务器IP

# 3. 确认 Nginx 运行
systemctl status nginx

# 4. 确认后端运行
pm2 status
curl http://127.0.0.1:3000/api/health
```

---

## 部署常见问题总结

### 问题 1：backend/.env 文件不存在导致数据库连接失败

**现象：**
```
❌ 数据库连接失败: Access denied for user 'root'@'localhost'
```

**原因：** 项目上传后 .env 文件缺失，后端使用默认配置尝试连接 root 用户

**解决方案：**
```bash
cd /root/tech-news-web/backend
nano .env
# 手动创建并填写配置
pm2 restart tech-news-backend --update-env
```

### 问题 2：前端构建缺少 terser 依赖

**现象：**
```
[vite:terser] terser not found. Since Vite v3, terser has become an optional dependency.
```

**原因：** Vite 3+ 需要手动安装 terser

**解决方案：**
```bash
npm install terser --save-dev
npm run build
```

### 问题 3：服务器内存不足导致构建被 Killed

**现象：**
```
✓ 2215 modules transformed.
Killed
```

**原因：** 1GB 内存服务器构建 Vite 项目触发 OOM

**解决方案：**
- 方案 A：添加 swap（2GB）
- 方案 B：本地构建后上传 dist 目录

### 问题 4：Nginx 无法访问 /root 目录

**现象：**
```
stat() "/root/tech-news-web/frontend/dist/index.html" failed (13: Permission denied)
```

**原因：** Nginx 以 www-data 用户运行，默认无法进入 /root（权限 700）

**解决方案：**
```bash
chmod 755 /root
chmod 755 /root/tech-news-web
chmod 755 /root/tech-news-web/frontend
chmod 755 /root/tech-news-web/frontend/dist
```

### 问题 5：SSL 证书申请前 Nginx 配置已引用证书

**现象：**
```
cannot load certificate "/etc/letsencrypt/live/xiaisle.com/fullchain.pem"
nginx: configuration file /etc/nginx/nginx.conf test failed
```

**原因：** nginx.conf 已配置 SSL，但证书文件不存在，导致 nginx -t 失败，certbot 无法执行

**解决方案：**
- 先创建 HTTP-only 配置
- nginx -t 成功后
- 再运行 certbot --nginx 申请证书

### 问题 6：阿里云安全组未开放端口

**现象：**
```
Timeout during connect (likely firewall problem)
```

**原因：** 云服务器默认只开放 22 端口，80/443 需手动配置

**解决方案：**
- 阿里云控制台 → ECS → 安全组 → 入方向规则
- 添加端口 80、443（授权对象 0.0.0.0/0）

### 问题 7：PM2 ecosystem.config.json JSON 格式错误

**现象：**
```
[PM2][ERROR] File deployment/ecosystem.config.json malformated
SyntaxError: Unexpected token ']'
```

**原因：** 删除 scheduler 配置时留下多余逗号或缺少 }

**解决方案：**
检查 JSON 格式，确保：
```json
{
  "apps": [
    {
      "name": "tech-news-backend",
      ...
    }  // ← 这里没有逗号
  ]    // ← apps 数组正确闭合
}
```

---

## 架构图

```
                    ┌──────────────┐
                    │   Internet   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Nginx     │
                    │  (Port 443)  │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │ 静态文件     │ │  API 代理    │ │  健康检查    │
    │ (前端 dist) │ │ (/api)      │ │ (/health)   │
    └─────────────┘ └──────┬──────┘ └─────────────┘
                           │
                    ┌──────▼───────┐
                    │   Node.js    │
                    │  (Port 3000) │
                    │   Backend    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    MySQL     │
                    │  (Port 3306) │
                    └──────────────┘

    数据导入方式: Navicat 手动执行 SQL 或导入 CSV
```

---

## 部署完成验证清单

部署完成后，依次执行以下验证：

```bash
# 1. PM2 状态（只有 backend）
pm2 status

# 2. 后端健康检查
curl http://127.0.0.1:3000/api/health

# 3. HTTPS 访问
curl https://www.xiaisle.com/health

# 4. API 数据
curl https://www.xiaisle.com/api/articles

# 5. SSL 证书
certbot certificates

# 6. scheduler 已删除
ls /root/tech-news-web/scheduler  # 应报错
```

浏览器验证：
- 访问 https://www.xiaisle.com
- 页面正常显示
- 新闻列表能加载
- 知识图谱能展示

---

*最后更新: 2026-06-03*