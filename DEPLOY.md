# 🚀 部署教程

本文档介绍如何将仿 GitHub 个人主页部署到各种平台。

## 📋 部署前准备

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写以下必需配置（所有变量都需要 `VITE_` 前缀）：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `VITE_GITHUB_USERNAME` | GitHub 用户名 | 你的 GitHub 账号 |
| `VITE_GITHUB_TOKEN` | GitHub 访问令牌 | [GitHub Settings > Tokens](https://github.com/settings/tokens) |
| `VITE_MEMOS_API_BASE` | Memos API 地址 | 你的 Memos 服务地址 |
| `VITE_MEMOS_TOKEN` | Memos 访问令牌 | Memos 后台 → 设置 → API 密钥 |
| `VITE_TGTALK_API_URL` | 说说 API 地址 | 你的说说服务地址 |
| `VITE_ARTICLES_API_URL` | 文章 API 地址 | 你的文章服务 API 或 RSS 源 |

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

### 4. 本地测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 🌐 部署方式

### 方式一：Vercel 部署（推荐）

Vercel 是最简单的部署方式，支持自动部署和环境变量管理。

#### 步骤：

1. **Fork 或导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 **"Add New Project"**
   - 导入你的 GitHub 仓库

2. **配置构建设置**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **配置环境变量**
   - 在 Vercel 项目设置中，找到 **"Environment Variables"**
   - 添加以下变量：

   ```
   VITE_GITHUB_USERNAME=your-github-username
   VITE_GITHUB_TOKEN=ghp_your_token
   VITE_MEMOS_API_BASE=https://your-memos.com/api/v1
   VITE_MEMOS_TOKEN=your_memos_token
   VITE_TGTALK_API_URL=https://your-tgtalk.com/
   VITE_ARTICLES_API_URL=https://your-api.com/posts
   ```

4. **点击 Deploy**

#### 自动部署：
每次推送到 GitHub 主分支，Vercel 会自动重新部署。

---

### 方式二：Cloudflare Pages 部署

Cloudflare Pages 提供全球 CDN 加速，支持 Vite 构建。

#### 步骤：

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Cloudflare Pages"
   git push origin main
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 进入 **Pages → Create a project**

3. **连接 GitHub 仓库**
   - 选择你的个人主页仓库
   - 点击 **Begin setup**

4. **配置构建设置**
   | 设置项 | 值 |
   |--------|-----|
   | Project name | 你的项目名称 |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. **添加环境变量**
   在 **Environment variables** 中添加：
   ```
   VITE_GITHUB_USERNAME=your-github-username
   VITE_GITHUB_TOKEN=ghp_your_token
   VITE_MEMOS_API_BASE=https://your-memos.com/api/v1
   VITE_MEMOS_TOKEN=your_memos_token
   VITE_TGTALK_API_URL=https://your-tgtalk.com/
   VITE_ARTICLES_API_URL=https://your-api.com/posts
   ```

6. **点击 Save and Deploy**

#### 自定义域名（可选）
部署后可以在 Cloudflare Pages 设置中添加自定义域名，享受 Cloudflare 的 CDN 加速。

---

### 方式三：GitHub Pages 部署

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
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm install

         - name: Build
           run: npm run build
           env:
             VITE_GITHUB_USERNAME: ${{ secrets.VITE_GITHUB_USERNAME }}
             VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
             VITE_MEMOS_API_BASE: ${{ secrets.VITE_MEMOS_API_BASE }}
             VITE_MEMOS_TOKEN: ${{ secrets.VITE_MEMOS_TOKEN }}
             VITE_TGTALK_API_URL: ${{ secrets.VITE_TGTALK_API_URL }}
             VITE_ARTICLES_API_URL: ${{ secrets.VITE_ARTICLES_API_URL }}

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **配置 GitHub Secrets**
   - 进入仓库 **Settings → Secrets and variables → Actions**
   - 添加以下 Secrets：
     - `VITE_GITHUB_USERNAME`
     - `VITE_GITHUB_TOKEN`
     - `VITE_MEMOS_API_BASE`
     - `VITE_MEMOS_TOKEN`
     - `VITE_TGTALK_API_URL`
     - `VITE_ARTICLES_API_URL`

4. **启用 GitHub Pages**
   - 进入 **Settings → Pages**
   - Source 选择 **GitHub Actions**

---

### 方式四：Netlify 部署

Netlify 提供简单的拖拽部署和 Git 集成。

#### 步骤：

1. **连接 GitHub 仓库**
   - 访问 [Netlify](https://netlify.com)
   - 点击 **"Add new site" → "Import an existing project"**
   - 选择 GitHub 并授权

2. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **添加环境变量**
   在 **Site settings → Environment variables** 中添加：
   ```
   VITE_GITHUB_USERNAME=your-username
   VITE_GITHUB_TOKEN=your-token
   VITE_MEMOS_API_BASE=https://your-memos.com/api/v1
   VITE_MEMOS_TOKEN=your-memos-token
   VITE_TGTALK_API_URL=https://your-tgtalk.com/
   VITE_ARTICLES_API_URL=https://your-api.com/posts
   ```

4. **点击 Deploy site**

---

### 方式五：服务器部署（Nginx）

自有服务器部署方案。

#### 步骤：

1. **本地构建**
   ```bash
   npm install
   npm run build
   ```

2. **上传文件到服务器**
   ```bash
   scp -r dist/* user@your-server:/var/www/homepage/
   ```

3. **配置 Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/homepage;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 缓存静态资源
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # 安全头
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
   }
   ```

4. **配置 HTTPS（Let's Encrypt）**
   ```bash
   certbot --nginx -d your-domain.com
   ```

---

### 方式六：Docker 部署

使用 Docker 容器化部署。

#### Dockerfile：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建（需要在构建时传入环境变量）
ARG VITE_GITHUB_USERNAME
ARG VITE_GITHUB_TOKEN
ARG VITE_MEMOS_API_BASE
ARG VITE_MEMOS_TOKEN
ARG VITE_TGTALK_API_URL
ARG VITE_ARTICLES_API_URL

ENV VITE_GITHUB_USERNAME=$VITE_GITHUB_USERNAME
ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN
ENV VITE_MEMOS_API_BASE=$VITE_MEMOS_API_BASE
ENV VITE_MEMOS_TOKEN=$VITE_MEMOS_TOKEN
ENV VITE_TGTALK_API_URL=$VITE_TGTALK_API_URL
ENV VITE_ARTICLES_API_URL=$VITE_ARTICLES_API_URL

RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

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
    build:
      context: .
      args:
        VITE_GITHUB_USERNAME: ${VITE_GITHUB_USERNAME}
        VITE_GITHUB_TOKEN: ${VITE_GITHUB_TOKEN}
        VITE_MEMOS_API_BASE: ${VITE_MEMOS_API_BASE}
        VITE_MEMOS_TOKEN: ${VITE_MEMOS_TOKEN}
        VITE_TGTALK_API_URL: ${VITE_TGTALK_API_URL}
        VITE_ARTICLES_API_URL: ${VITE_ARTICLES_API_URL}
    ports:
      - "8080:80"
    restart: unless-stopped
```

#### 部署命令：

```bash
# 创建 .env 文件
cp .env.example .env
# 编辑 .env 填写配置

# 构建并运行
docker-compose up -d --build
```

---

## ⚠️ 常见问题

### 1. 环境变量不生效

确保所有环境变量都以 `VITE_` 开头，例如：
- ✅ `VITE_GITHUB_USERNAME`
- ❌ `GITHUB_USERNAME`

### 2. 构建失败

检查是否安装了所有依赖：
```bash
npm install
```

### 3. API 跨域问题

如果 API 请求失败，检查：
- Memos 服务是否允许跨域
- 说说 API 是否允许跨域
- RSS 源是否允许跨域

### 4. 图片无法显示

- 检查 `VITE_MEMOS_RESOURCE_BASE` 配置
- 确保图片 URL 可访问

---

## 📚 相关文档

- [Vite 官方文档](https://vitejs.dev/)
- [Vercel 文档](https://vercel.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
