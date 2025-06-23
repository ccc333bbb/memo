# Blog 工作流程指南

## 概述

這個指南將幫助您了解如何使用 GitHub Issues 聯動功能來管理您的 blog posts。

## 前置準備

### 1. 配置 GitHub Personal Access Token

1. 前往 [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. 點擊 "Generate new token (classic)"
3. 選擇 "repo" 權限（完整的倉庫訪問權限）
4. 複製生成的 token

### 2. 配置環境變量

```bash
# 複製環境變量示例文件
cp env.example .env

# 編輯 .env 文件
nano .env
```

在 `.env` 文件中填入您的 GitHub token：

```env
GITHUB_TOKEN=ghp_your_actual_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
```

## 工作流程

### 步驟 1: 創建新的 Blog Post

```bash
npm run blog:create
```

這個命令會：
- 提示您輸入文章標題、描述、作者和標籤
- 自動創建對應的 GitHub issue（狀態為 draft）
- 生成 markdown 文件並添加必要的 frontmatter
- 顯示創建的文件路徑和 issue 鏈接

**示例輸出：**
```
📝 創建新的 Blog Post

文章標題: 我的第一篇技術文章
文章描述: 分享一些技術心得和經驗
作者 (預設: kungchiang): 
標籤 (用逗號分隔): 技術,心得

🔗 正在創建 GitHub issue...

✅ 成功創建 Issue #123: Blog Post: 我的第一篇技術文章
✅ 成功創建 blog post: /path/to/src/pages/zh-CN/blog/我的第一篇技術文章.md

🎉 Blog post 創建成功！
📄 文件: /path/to/src/pages/zh-CN/blog/我的第一篇技術文章.md
🔗 Issue: https://github.com/your-username/your-repo/issues/123

💡 提示:
- 編輯文章後，使用 `npm run blog:publish 123` 發布
- 在 commit 信息中包含 `Closes #123` 可自動關閉 issue
```

### 步驟 2: 編輯文章內容

創建完成後，您會得到一個包含基本 frontmatter 的 markdown 文件：

```markdown
---
title: 我的第一篇技術文章
pubDate: 2024-01-15
description: 分享一些技術心得和經驗
author: kungchiang
status: draft
githubIssue: 123
tags: ["技術", "心得"]
---

# 我的第一篇技術文章

分享一些技術心得和經驗

<!-- 在此處開始撰寫您的文章內容 -->
```

### 步驟 3: 查看所有 Blog Posts

```bash
npm run blog:list
```

這個命令會顯示：
- 所有 blog posts 的列表
- 每篇文章的狀態（draft/published）
- 對應的 GitHub issue 編號
- 統計信息

**示例輸出：**
```
📚 Blog Posts 列表

┌─────────────────────────────────────────────────────────────────────────────────┐
│ 標題                                    │ 狀態      │ 發布日期   │ Issue │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 我的第一篇技術文章                      │ 📝 Draft  │ 2024-01-15 │ #123  │
│ Astro 範例文章                          │ ✅ Published │ 2024-06-07 │ N/A   │
└─────────────────────────────────────────────────────────────────────────────────┘

📊 統計信息:
   • 總文章數: 2
   • Draft: 1
   • Published: 1
   • 有 GitHub Issue: 1
```

### 步驟 4: 發布 Blog Post

當您準備好發布文章時：

```bash
npm run blog:publish 123
```

這個命令會：
- 確認您要發布的文章
- 更新文章狀態為 "published"
- 設置發布日期
- 更新 GitHub issue 的標籤和內容
- 提供下一步的 git 操作指導

**示例輸出：**
```
🚀 準備發布 Blog Post (Issue #123)

📄 找到 blog post: /path/to/src/pages/zh-CN/blog/我的第一篇技術文章.md
📝 當前標題: 我的第一篇技術文章
📅 當前狀態: draft

確認發布此文章？(y/N): y
發布日期 (YYYY-MM-DD，留空使用今天): 

✅ 已更新 blog post 狀態為 published

🔗 正在更新 GitHub issue...

✅ 已更新 Issue #123 狀態

🎉 Blog post 發布準備完成！
📄 文件: /path/to/src/pages/zh-CN/blog/我的第一篇技術文章.md
🔗 Issue: https://github.com/your-username/your-repo/issues/123

💡 下一步:
1. 提交更改: git add "src/pages/zh-CN/blog/我的第一篇技術文章.md"
2. 提交信息: git commit -m "feat(blog): publish 我的第一篇技術文章 - Closes #123"
3. 推送更改: git push
```

### 步驟 5: 提交和推送

按照提示執行 git 操作：

```bash
# 添加更改的文件
git add "src/pages/zh-CN/blog/我的第一篇技術文章.md"

# 提交更改（注意 commit 信息中的 Closes #123）
git commit -m "feat(blog): publish 我的第一篇技術文章 - Closes #123"

# 推送更改
git push
```

當您推送包含 `Closes #123` 的 commit 時，GitHub 會自動關閉對應的 issue。

## Frontmatter 字段說明

每個 blog post 的 frontmatter 包含以下字段：

| 字段 | 描述 | 示例 |
|------|------|------|
| `title` | 文章標題 | "我的第一篇技術文章" |
| `pubDate` | 發布日期 | "2024-01-15" |
| `description` | 文章描述 | "分享一些技術心得和經驗" |
| `author` | 作者 | "kungchiang" |
| `status` | 文章狀態 | "draft" 或 "published" |
| `githubIssue` | GitHub issue 編號 | "123" |
| `tags` | 標籤數組 | `["技術", "心得"]` |

## GitHub Issue 標籤

系統會自動為 GitHub issues 添加以下標籤：

- `blog-post`: 標識這是一個 blog post 相關的 issue
- `draft`: 文章處於草稿狀態
- `published`: 文章已發布

## 故障排除

### 常見問題

1. **GitHub API 認證失敗**
   - 檢查 `.env` 文件中的 `GITHUB_TOKEN` 是否正確
   - 確認 token 有足夠的權限（需要 `repo` 權限）

2. **找不到對應的 blog post**
   - 確認 issue 編號是否正確
   - 檢查 blog post 的 frontmatter 中是否包含正確的 `githubIssue` 字段

3. **文件創建失敗**
   - 檢查目錄權限
   - 確認文件名不包含特殊字符

### 手動修復

如果需要手動修復，您可以：

1. 直接編輯 markdown 文件的 frontmatter
2. 在 GitHub 上手動關閉 issue
3. 重新運行相應的腳本

## 最佳實踐

1. **使用描述性的標題**：讓 issue 標題清楚表達文章內容
2. **定期檢查狀態**：使用 `npm run blog:list` 查看所有文章狀態
3. **及時發布**：完成文章後及時發布，避免積累太多 draft
4. **使用標籤**：為文章添加相關標籤，便於分類和搜索
5. **遵循 commit 規範**：使用 `Closes #<issue-number>` 自動關閉 issue 