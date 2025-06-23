# ccc333bbb - Dark Walker

個人部落格網站，使用 Astro 框架構建，採用水墨風格設計。

## 🌐 線上訪問

- **GitHub Pages：** https://ccc333bbb.github.io/memo/
- **本地開發：** http://localhost:4321/

## 🎨 特色功能

- **水墨風格設計**：優雅的漸變背景和視覺效果
- **響應式佈局**：完美適配桌面和移動設備
- **動畫效果**：頭像浮動、粒子動畫、視差效果
- **部落格系統**：支援 Markdown 文章撰寫
- **自動部署**：GitHub Actions 自動構建和部署

## 📁 項目結構

```text
capricious-centauri/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── public/
│   └── favicon.svg             # 網站圖標
├── src/
│   ├── assets/                 # 靜態資源
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/             # Astro 組件
│   │   └── Welcome.astro       # 首頁組件
│   ├── layouts/                # 頁面佈局
│   │   └── Layout.astro        # 主佈局文件
│   └── pages/                  # 頁面文件
│       ├── index.astro         # 首頁
│       └── blog/               # 部落格文章
│           └── example-post.md # 範例文章
├── astro.config.mjs            # Astro 配置文件
├── package.json                # 項目依賴
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 項目說明
```

## 🛠️ 技術棧

- **框架：** [Astro](https://astro.build/) - 現代靜態網站生成器
- **語言：** TypeScript, Markdown
- **樣式：** CSS3, 響應式設計
- **部署：** GitHub Pages + GitHub Actions
- **字體：** Google Fonts (Noto Serif SC, Noto Sans)

## 🚀 開發命令

### 基本命令

| 命令 | 說明 |
|------|------|
| `npm install` | 安裝項目依賴 |
| `npm run dev` | 啟動本地開發服務器 (http://localhost:4321) |
| `npm run build` | 構建生產版本到 `./dist/` 目錄 |
| `npm run preview` | 本地預覽構建結果 |

### 部落格維護

| 命令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發服務器，實時預覽變更 |
| 編輯 `src/pages/blog/*.md` | 新增或編輯部落格文章 |
| 編輯 `src/components/Welcome.astro` | 修改首頁設計 |

### 部署命令

| 命令 | 說明 |
|------|------|
| `git add .` | 將變更加入暫存區 |
| `git commit -m "描述"` | 提交變更到本地倉庫 |
| `git push origin main` | 推送到遠端倉庫，觸發自動部署 |

## 📝 新增部落格文章

1. 在 `src/pages/blog/` 目錄下建立新的 `.md` 文件
2. 使用以下格式：

```markdown
---
title: 文章標題
pubDate: 2024-06-07
description: 文章描述
author: ccc333bbb
---

# 文章內容

這裡是您的文章內容...
```

3. 保存文件後，訪問 `http://localhost:4321/blog/文件名` 查看效果

## 🎯 自定義配置

### 修改首頁內容
- 編輯 `src/components/Welcome.astro` 修改首頁設計
- 編輯 `src/layouts/Layout.astro` 修改頁面佈局

### 修改部署配置
- 編輯 `astro.config.mjs` 修改 Astro 配置
- 編輯 `.github/workflows/deploy.yml` 修改部署流程

## 🔧 故障排除

### 本地開發問題
```bash
# 清除緩存並重新安裝依賴
rm -rf node_modules package-lock.json
npm install

# 重新啟動開發服務器
npm run dev
```

### 部署問題
- 檢查 GitHub Actions 日誌
- 確認 `astro.config.mjs` 中的 `base` 路徑設置正確
- 確認 GitHub Pages 已啟用並設為 GitHub Actions 源

## 📄 許可證

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**開發者：** ccc333bbb  
**職業：** Dark Walker  
**網站：** https://ccc333bbb.github.io/memo/

# Capricious Centauri

一個基於 Astro 的多語言部落格，支持 GitHub Issues 聯動功能。

## 功能特色

- 🌍 多語言支持 (en-US, zh-CN, zh-TW)
- 📝 GitHub Issues 聯動
- 🚀 自動化工作流程
- 📱 響應式設計

## GitHub Issues 聯動功能

這個部落格系統集成了 GitHub Issues，讓您可以：

- 創建 blog post 時自動創建對應的 GitHub issue
- 管理文章狀態 (draft/published)
- 通過 commit 信息自動關閉 issue
- 簡化寫作和發布流程

### 快速開始

1. **配置環境變量**
   ```bash
   cp env.example .env
   # 編輯 .env 文件，填入您的 GitHub Personal Access Token
   ```

2. **創建新的 blog post**
   ```bash
   npm run blog:create
   ```

3. **查看所有 blog posts**
   ```bash
   npm run blog:list
   ```

4. **發布 blog post**
   ```bash
   npm run blog:publish <issue-number>
   ```

### 工作流程

1. **創建文章** → 自動創建 GitHub issue (draft 狀態)
2. **撰寫內容** → 在本地編輯 markdown 文件
3. **準備發布** → 使用 `npm run blog:publish` 更新狀態
4. **提交代碼** → 在 commit 信息中包含 `Closes #<issue-number>` 自動關閉 issue

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 項目結構

```
src/
├── pages/          # 頁面文件
│   ├── en-US/     # 英文頁面
│   ├── zh-CN/     # 簡體中文頁面
│   └── zh-TW/     # 繁體中文頁面
├── components/     # 組件
├── layouts/        # 布局
└── i18n/          # 國際化配置
scripts/
├── github-api.js   # GitHub API 工具類
├── create-blog.js  # 創建 blog post 腳本
├── publish-blog.js # 發布 blog post 腳本
└── list-blogs.js   # 列出所有 blog posts 腳本
```

## 環境變量

| 變量名 | 描述 | 預設值 |
|--------|------|--------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | 必需 |
| `GITHUB_OWNER` | GitHub 用戶名 | ccc333bbb |
| `GITHUB_REPO` | GitHub 倉庫名 | capricious-centauri |

## 許可證

MIT License
