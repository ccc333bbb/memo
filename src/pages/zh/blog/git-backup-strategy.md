---
layout: ../../../layouts/BlogLayout.astro
title: Git 多平台備份策略 - 代碼安全完整指南
pubDate: 2024-12-01
description: 如何將公共 Git 倉庫同步到多個免費雲平台的完整指南，實現可靠的代碼備份策略。
author: ccc333bbb
language: zh
lang: zh
status: published
---

# Git 多平台備份策略 🛡️

對於公開的 Git 倉庫，推送到多個 Git 雲端服務是最簡單有效的備份策略。本文將詳細介紹如何實現多平台備份，確保你的代碼安全。

## 為什麼需要多平台備份？

GitHub 雖然是最大的代碼託管平台，但並不是 100% 可信的。單一平台可能面臨：
- 服務中斷
- 政策變更
- 安全漏洞
- 地區訪問限制

通過多平台備份，我們可以：
- 分散風險
- 提高可用性
- 確保數據安全
- 優化訪問速度

## 主要免費 Git 雲端服務

### 1. **GitLab** (最推薦) ⭐
- **免費額度**：無限制的公開倉庫
- **存儲限制**：10GB
- **功能**：CI/CD、Issues、Wiki、Pages
- **地址**：https://gitlab.com
- **優勢**：功能最完整，CI/CD 強大

### 2. **Bitbucket** (Atlassian)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：1GB
- **功能**：CI/CD、Issues、Wiki
- **地址**：https://bitbucket.org
- **優勢**：與 Jira、Confluence 集成

### 3. **Gitee** (碼雲 - 國內)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：500MB
- **功能**：Issues、Wiki、Pages
- **地址**：https://gitee.com
- **優勢**：國內訪問速度快

### 4. **GitHub** (主要平台)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：1GB
- **功能**：Pages、Actions、Issues
- **地址**：https://github.com

### 5. **Codeberg** (開源友好)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：無限制
- **功能**：Issues、Wiki
- **地址**：https://codeberg.org
- **優勢**：完全開源，無商業化

### 6. **GitTea** (輕量級)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：無限制
- **功能**：Issues、Wiki
- **地址**：https://gitea.com
- **優勢**：輕量級，速度快

### 7. **SourceForge** (老牌)
- **免費額度**：無限制的公開倉庫
- **存儲限制**：無限制
- **功能**：Issues、Wiki
- **地址**：https://sourceforge.net
- **優勢**：老牌穩定

## 設置多平台備份

### 1. 添加多個遠程倉庫

```bash
# 查看當前遠程倉庫
git remote -v

# 添加 GitLab 備份
git remote add gitlab https://gitlab.com/your-username/memo.git

# 添加 Bitbucket 備份
git remote add bitbucket https://bitbucket.org/your-username/memo.git

# 添加 Gitee 備份
git remote add gitee https://gitee.com/your-username/memo.git

# 添加 Codeberg 備份
git remote add codeberg https://codeberg.org/your-username/memo.git
```

### 2. 創建自動同步腳本

```javascript
import { execSync } from 'child_process';

class MultiPlatformSync {
  constructor() {
    this.remotes = {
      github: 'origin',
      gitlab: 'gitlab',
      bitbucket: 'bitbucket',
      gitee: 'gitee',
      codeberg: 'codeberg'
    };
  }

  async syncToAllPlatforms() {
    console.log('🔄 開始同步到多個平台...');
    
    try {
      // 1. 確保本地是最新的
      this.updateLocal();
      
      // 2. 推送到所有平台
      await this.pushToAllPlatforms();
      
      // 3. 驗證同步狀態
      this.verifySync();
      
      console.log('✅ 多平台同步完成！');
    } catch (error) {
      console.error('❌ 同步失敗:', error.message);
      process.exit(1);
    }
  }

  updateLocal() {
    console.log('📥 更新本地倉庫...');
    execSync('git fetch --all', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });
  }

  async pushToAllPlatforms() {
    const platforms = Object.entries(this.remotes);
    
    for (const [platform, remote] of platforms) {
      try {
        console.log(`📤 推送到 ${platform}...`);
        execSync(`git push ${remote} main`, { stdio: 'inherit' });
        console.log(`✅ ${platform} 同步成功`);
      } catch (error) {
        console.log(`❌ ${platform} 同步失敗:`, error.message);
      }
    }
  }

  verifySync() {
    console.log('🔍 驗證同步狀態...');
    
    Object.entries(this.remotes).forEach(([platform, remote]) => {
      try {
        const status = execSync(`git ls-remote ${remote} main`, { encoding: 'utf8' });
        const commitHash = status.split('\t')[0];
        console.log(`✅ ${platform}: ${commitHash.substring(0, 8)}`);
      } catch (error) {
        console.log(`❌ ${platform}: 無法驗證`);
      }
    });
  }
}

// 執行同步
const sync = new MultiPlatformSync();
sync.syncToAllPlatforms();
```

### 3. 設置 Git 配置

```bash
# 設置推送時自動推送到多個遠程倉庫
git remote set-url --push --add origin https://github.com/ccc333bbb/memo.git
git remote set-url --push --add origin https://gitlab.com/your-username/memo.git
git remote set-url --push --add origin https://bitbucket.org/your-username/memo.git
git remote set-url --push --add origin https://gitee.com/your-username/memo.git
```

### 4. 創建 GitHub Action 自動同步

```yaml
name: Sync to Multiple Platforms

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Git
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"

      - name: Add GitLab remote
        run: |
          git remote add gitlab https://oauth2:${GITLAB_TOKEN}@gitlab.com/your-username/memo.git

      - name: Add Bitbucket remote
        run: |
          git remote add bitbucket https://x-token-auth:${BITBUCKET_TOKEN}@bitbucket.org/your-username/memo.git

      - name: Add Gitee remote
        run: |
          git remote add gitee https://oauth2:${GITEE_TOKEN}@gitee.com/your-username/memo.git

      - name: Push to all platforms
        run: |
          git push gitlab main
          git push bitbucket main
          git push gitee main
        env:
          GITLAB_TOKEN: ${{ secrets.GITLAB_TOKEN }}
          BITBUCKET_TOKEN: ${{ secrets.BITBUCKET_TOKEN }}
          GITEE_TOKEN: ${{ secrets.GITEE_TOKEN }}
```

### 5. 添加 package.json 腳本

```json
{
  "scripts": {
    "sync:all": "node scripts/sync-to-multiple-platforms.js",
    "sync:gitlab": "git push gitlab main",
    "sync:bitbucket": "git push bitbucket main",
    "sync:gitee": "git push gitee main"
  }
}
```

## 推薦的備份組合

### 主要備份（推薦）
1. **GitHub** - 主要開發平台
2. **GitLab** - 功能最完整，CI/CD 強大
3. **Gitee** - 國內訪問速度快

### 額外備份（可選）
4. **Bitbucket** - Atlassian 生態
5. **Codeberg** - 開源友好

## 設置步驟

1. **註冊賬號**：在每個平台註冊賬號
2. **創建倉庫**：在每個平台創建同名倉庫
3. **添加遠程**：使用上面的腳本添加遠程倉庫
4. **設置 Token**：為自動同步設置訪問令牌
5. **測試同步**：運行同步腳本測試

## 備份策略的優勢

- ✅ **免費**：所有平台都提供免費服務
- ✅ **自動化**：可以設置自動同步
- ✅ **分散風險**：多個平台降低單點故障風險
- ✅ **訪問優化**：不同地區可以選擇最快的平台
- ✅ **功能互補**：不同平台有不同的特色功能

## 注意事項

1. **公開倉庫**：此策略主要適用於公開倉庫
2. **存儲限制**：注意各平台的存儲限制
3. **同步頻率**：避免過於頻繁的同步
4. **Token 安全**：妥善保管訪問令牌
5. **版本一致性**：確保所有平台版本一致

通過這種多平台備份策略，你可以確保代碼的安全性和可用性，即使某個平台出現問題，其他平台仍然可以正常使用。

---

*這篇文章介紹了如何通過多平台 Git 備份來保護你的代碼資產。*

---

import GiscusComments from '../../../components/GiscusComments.astro';

<GiscusComments /> 