# 🚀 部署教程

本文档介绍如何将仿 GitHub 个人主页部署到各种平台。

## 📋 部署前准备

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写以下必需配置：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `GITHUB_USERNAME` | GitHub 用户名 | 你的 GitHub 账号 |
| `GITHUB_TOKEN` | GitHub 访问令牌 | [GitHub Settings > Tokens](https://github.com/settings/tokens) |
| `MEMOS_API_BASE` | Memos API 地址 | 你的 Memos 服务地址 |
| `MEMOS_TOKEN` | Memos 访问令牌 | Memos 后台 → 设置 → API 密钥 |
| `ARTICLES_API_URL` | 文章 API 地址 | 你的文章服务 API |

### 2. 获取 GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 **"Generate new token (classic)"**
3. 勾选以下权限：
   - `repo` - 访问仓库
   - `read:user` - 读取用户信息
   - `read:email` - 读取邮箱
4. 生成并复制 Token

### 3. 获取 Memos Token（可选）

如果使用说说功能：

1. 登录 Memos 管理后台
2. 进入 **设置 → API 密钥**
3. 创建新的访问令牌
4. 复制 JWT Token

---

## 🌐 部署方式

### 方式一：Vercel 部署（推荐）

Vercel 是最简单的部署方式，支持自动部署和环境变量管理。

#### 步骤：

1. **Fork 或导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 **"Add New Project"**
   - 导入你的 GitHub 仓库

2. **配置环境变量**
   - 在 Vercel 项目设置中，找到 **"Environment Variables"**
   - 添加以下变量（名称前加 `VITE_` 前缀）：

   ```
   VITE_GITHUB_USERNAME=your-github-username
   VITE_GITHUB_TOKEN=ghp_your_token
   VITE_MEMOS_API_BASE=https://your-memos.com/api/v1
   VITE_MEMOS_TOKEN=your_memos_token
   VITE_ARTICLES_API_URL=https://your-api.com/posts
   ```

3. **部署设置**
   - Framework Preset: **Vite** 或 **Other**
   - Build Command: 留空（静态站点）
   - Output Directory: `.`（根目录）

4. **点击 Deploy**

#### 自动部署：
每次推送到 GitHub 主分支，Vercel 会自动重新部署。

---

### 方式二：GitHub Pages 部署

GitHub Pages 是免费的静态站点托管服务。

#### 步骤：

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **配置 GitHub Actions**（自动部署）

   创建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Inject Environment Variables
           run: |
             echo "window.GITHUB_USERNAME = '${{ secrets.GITHUB_USERNAME }}';" > config.js
             echo "window.GITHUB_TOKEN = '${{ secrets.GITHUB_TOKEN }}';" >> config.js
             echo "window.MEMOS_API_BASE = '${{ secrets.MEMOS_API_BASE }}';" >> config.js
             echo "window.MEMOS_TOKEN = '${{ secrets.MEMOS_TOKEN }}';" >> config.js
             echo "window.ARTICLES_API_URL = '${{ secrets.ARTICLES_API_URL }}';" >> config.js

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./
   ```

3. **配置 GitHub Secrets**
   - 进入仓库 **Settings → Secrets and variables → Actions**
   - 添加以下 Secrets：
     - `GITHUB_USERNAME`
     - `GITHUB_TOKEN`
     - `MEMOS_API_BASE`
     - `MEMOS_TOKEN`
     - `ARTICLES_API_URL`

4. **启用 GitHub Pages**
   - 进入 **Settings → Pages**
   - Source 选择 **GitHub Actions**

---

### 方式三：Netlify 部署

Netlify 提供简单的拖拽部署和 Git 集成。

#### 步骤：

1. **方式 A：拖拽部署**
   - 本地创建 `config.js` 文件注入环境变量：
     ```javascript
     window.GITHUB_USERNAME = 'your-username';
     window.GITHUB_TOKEN = 'your-token';
     window.MEMOS_API_BASE = 'https://your-memos.com/api/v1';
     window.MEMOS_TOKEN = 'your-memos-token';
     window.ARTICLES_API_URL = 'https://your-api.com/posts';
     ```
   - 在 `index.html` 的 `<head>` 中添加：
     ```html
     <script src="config.js"></script>
     ```
   - 压缩项目文件
   - 访问 [Netlify](https://netlify.com) 拖拽上传

2. **方式 B：Git 部署**
   - 连接 GitHub 仓库
   - 在 **Site settings → Environment variables** 中添加变量
   - 变量名格式：`VITE_` 前缀（如 `VITE_GITHUB_USERNAME`）

---

### 方式四：Cloudflare Pages 部署

Cloudflare Pages 提供全球 CDN 加速。

#### 步骤：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages → Create a project**
3. 连接 GitHub 仓库
4. 配置构建设置：
   - Build command: 留空
   - Build output directory: `/`
5. 添加环境变量（**Settings → Environment variables**）：
   ```
   VITE_GITHUB_USERNAME=your-username
   VITE_GITHUB_TOKEN=your-token
   ```
6. 点击 **Save and Deploy**

---

### 方式五：服务器部署（Nginx）

自有服务器部署方案。

#### 步骤：

1. **准备配置文件**

   创建 `config.js`：
   ```javascript
   window.GITHUB_USERNAME = 'your-username';
   window.GITHUB_TOKEN = 'ghp_your_token';
   window.MEMOS_API_BASE = 'https://memos.yourdomain.com/api/v1';
   window.MEMOS_TOKEN = 'your_memos_token';
   window.ARTICLES_API_URL = 'https://api.yourdomain.com/posts';
   ```

2. **修改 index.html**

   在 `<head>` 标签内添加：
   ```html
   <script src="config.js"></script>
   ```

3. **上传文件到服务器**
   ```bash
   scp -r ./* user@your-server:/var/www/homepage/
   ```

4. **配置 Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/homepage;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 安全头
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
   }
   ```

5. **配置 HTTPS（Let's Encrypt）**
   ```bash
   certbot --nginx -d your-domain.com
   ```

---

### 方式六：Docker 部署

使用 Docker 容器化部署。

#### Dockerfile：

```dockerfile
FROM nginx:alpine

# 复制静态文件
COPY . /usr/share/nginx/html

# 复制自定义 Nginx 配置（可选）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml：

```yaml
version: '3'
services:
  homepage:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_GITHUB_USERNAME=${GITHUB_USERNAME}
      - VITE_GITHUB_TOKEN=${GITHUB_TOKEN}
      - VITE_MEMOS_API_BASE=${MEMOS_API_BASE}
      - VITE_MEMOS_TOKEN=${MEMOS_TOKEN}
      - VITE_ARTICLES_API_URL=${ARTICLES_API_URL}
    volumes:
      - ./config.js:/usr/share/nginx/html/config.js:ro
```

#### 部署命令：

```bash
# 创建 .env 文件后
docker-compose up -d
```

---

## 🔒 安全注意事项

### 1. 保护敏感信息

- **永远不要**将 `.env` 文件提交到 Git
- 确保 `.gitignore` 包含：
  ```
  .env
  config.js
  ```

### 2. GitHub Token 权限

- 使用最小权限原则
- 定期轮换 Token
- 如果 Token 泄露，立即在 GitHub 撤销

### 3. API 安全

- 使用 HTTPS 传输
- 配置 CORS 只允许特定域名
- 考虑添加 API 请求限流

---

## 🛠️ 故障排查

### 问题 1：API 请求失败

**症状**：页面加载但数据为空

**排查**：
1. 检查浏览器控制台（F12 → Console）
2. 查看 Network 标签页的 API 请求状态
3. 确认环境变量是否正确注入

### 问题 2：GitHub API 限流

**症状**：GitHub 数据无法加载

**解决**：
- 确认 GITHUB_TOKEN 已配置
- 未认证请求限制为每小时 60 次
- 认证后限制为每小时 5000 次

### 问题 3：环境变量未生效

**症状**：配置后仍使用默认值

**排查**：
1. 检查变量名是否正确（Vercel 需要 `VITE_` 前缀）
2. 重新部署项目
3. 清除浏览器缓存

---

## 📚 参考文档

- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Netlify 环境变量](https://docs.netlify.com/configure-builds/environment-variables/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

**最后更新**：2024年12月
