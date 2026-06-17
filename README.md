# Nav-item-2026 - 个人导航站

## 项目简介

一个现代化的导航网站项目，提供简洁美观的导航界面和强大的后台管理系统，快速访问常用网站和工具。

本项目基于 **Cloudflare Pages + Workers + D1** 架构，实现全托管、无服务器运行。

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + Vite | 现代化前端框架 |
| 后端 | Cloudflare Workers | 无服务器后端 |
| 数据库 | Cloudflare D1 | 原生SQL数据库 |
| 存储 | Cloudflare KV | 键值存储（缓存） |
| 托管 | Cloudflare Pages | 静态站点托管 |

## ✨ 主要功能

### 前端功能
- 🏠 **首页导航**：美观的卡片式导航界面
- 🔍 **聚合搜索**：支持 Google、百度、Bing、GitHub、站内搜索
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **现代化UI**：采用渐变背景和毛玻璃效果
- 🔗 **友情链接**：支持友情链接弹窗展示
- 📢 **广告位**：支持左右两侧广告位展示

### 后台管理功能
- 👤 **用户管理**：管理员登录、用户信息管理
- 📋 **栏目管理**：主菜单和子菜单的增删改查
- 🃏 **卡片管理**：导航卡片的增删改查
- 📢 **广告管理**：广告位的增删改查
- 🔗 **友链管理**：友情链接的增删改查

### 技术特性
- 🔐 **Token认证**：安全的用户认证机制
- 🗄️ **D1数据库**：Cloudflare原生SQL数据库
- 🔍 **搜索功能**：支持站内搜索和外部搜索
- 📱 **移动端适配**：完美的移动端体验
- 🚀 **全托管部署**：零服务器运维

## 🏗️ 项目结构

```
nav-item/
├── web/                    # 前端项目
│   ├── package.json        # 前端依赖配置
│   ├── vite.config.mjs     # Vite配置
│   ├── index.html          # HTML入口
│   ├── public/             # 静态资源
│   │   ├── background.webp
│   │   ├── default-favicon.png
│   │   ├── robots.txt
│   │   └── static-data.json  # 静态数据回退
│   └── src/                # 前端源码
│       ├── main.js         # Vue应用入口
│       ├── router.js       # 路由配置
│       ├── api.js          # API接口封装
│       ├── App.vue         # 根组件
│       ├── utils/          # 工具函数
│       │   └── request.js  # 请求封装
│       ├── components/     # 公共组件
│       │   ├── MenuBar.vue
│       │   └── CardGrid.vue
│       └── views/          # 页面组件
│           ├── Home.vue    # 首页
│           ├── Admin.vue   # 后台管理
│           └── admin/      # 后台子页面
│               ├── MenuManage.vue
│               ├── CardManage.vue
│               ├── AdManage.vue
│               ├── FriendLinkManage.vue
│               └── UserManage.vue
├── worker/                 # Cloudflare Worker后端
│   ├── index.js           # Worker主文件
│   ├── schema.sql         # D1表结构定义
│   ├── init-d1.sql        # D1数据初始化脚本
│   ├── import-data.js     # 数据导入工具
│   ├── package.json       # Worker依赖
│   └── wrangler.toml      # Wrangler配置
├── wrangler-pages.toml     # Pages部署配置
├── LICENSE
└── README.md
```

## ⚙️ 环境变量配置

### Worker 环境变量（在 wrangler.toml 中配置）
```toml
[vars]
ADMIN_USERNAME = "admin"    # 管理员用户名
ADMIN_PASSWORD = "admin123" # 管理员密码
```

### D1 数据库绑定
- `DB`: nav-item-db（需提前创建）

### KV 命名空间绑定
- `NAV_ITEM_DATA`: 用于缓存

## 🚀 部署指南

### 前置条件
1. 安装 Node.js（建议 v18+）
2. 安装 Wrangler CLI：`npm install -g wrangler`
3. 登录 Cloudflare：`wrangler login`

### 1. 初始化 D1 数据库

```bash
# 创建 D1 数据库
wrangler d1 create nav-item-db

# 应用表结构
wrangler d1 execute nav-item-db --file worker/schema.sql

# 初始化数据（可选）
wrangler d1 execute nav-item-db --file worker/init-d1.sql --remote
```

### 2. 配置 wrangler.toml

确保 `worker/wrangler.toml` 中配置了正确的 D1 和 KV 绑定。

### 3. 部署 Worker 后端

```bash
cd worker
npx wrangler deploy
```

### 4. 构建前端

```bash
cd web
npm install
npm run build
```

### 5. 部署前端到 Pages

```bash
# 方式一：使用 wrangler 部署
npx wrangler pages deploy web/dist

# 方式二：通过 Cloudflare 控制台部署
# 1. 将 web/dist 目录内容上传到 Cloudflare Pages
# 2. 配置构建命令（可选）
```

### 6. 访问应用

- 前端地址：`https://your-pages-domain.pages.dev`
- 后台管理：`https://your-pages-domain.pages.dev/admin`
- 默认管理员账号：`admin` / `admin123`

## 🔄 数据迁移

### 从静态文件导入数据

Worker 提供了 `/api/init` 接口用于初始化数据：

```bash
# 通过脚本导入数据
node worker/import-data.js
```

### 手动添加测试数据

```sql
-- 添加测试菜单
INSERT INTO menus (id, name, order_num) VALUES (1, 'Home', 1);

-- 添加测试卡片
INSERT INTO cards (menu_id, title, url, logo_url) 
VALUES (1, 'Google', 'https://google.com', 'https://google.com/favicon.ico');
```

## 📡 API 接口

### 公开接口（无需认证）
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/menus` | GET | 获取菜单列表 |
| `/api/cards` | GET | 获取卡片列表 |
| `/api/ads` | GET | 获取广告列表 |
| `/api/friends` | GET | 获取友情链接 |

### 认证接口
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/users/me` | GET | 获取当前用户 |

### 管理接口（需认证）
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/menus` | POST/PUT/DELETE | 菜单管理 |
| `/api/cards` | POST/PUT/DELETE | 卡片管理 |
| `/api/ads` | POST/PUT/DELETE | 广告管理 |
| `/api/friends` | POST/PUT/DELETE | 友链管理 |
| `/api/users` | POST/PUT/DELETE | 用户管理 |

## 🔒 安全说明

1. **密码管理**：管理员密码通过环境变量配置，不在代码中硬编码
2. **Token机制**：登录后返回Token，有效期7天
3. **CORS配置**：支持跨域访问，生产环境建议限制域名
4. **输入验证**：所有API接口均有输入验证

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**Jevin** - [GitHub](https://github.com/jevinyan/)

## 🙏 致谢
感谢原作者：eooce，[GitHub](https://github.com/eooce/Nav-Item)
感谢所有为这个项目做出贡献的开发者！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
