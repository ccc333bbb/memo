# Giscus 評論系統

這個項目使用 [Giscus](https://giscus.app/) 作為評論系統，基於 GitHub Discussions，完美支持靜態網站部署。

## 功能特點

- 🔄 **實時同步**: 評論直接存儲在 GitHub Discussions 中
- 🌍 **多語言支持**: 支持英文、簡體中文、繁體中文
- 🎨 **主題適配**: 自動適配網站主題
- 📱 **響應式設計**: 完美支持移動端
- 🔒 **安全可靠**: 基於 GitHub 認證系統

## 工作原理

1. **基於 Discussions**：使用 GitHub Discussions 作為評論存儲
2. **路徑映射**：根據頁面路徑自動創建對應的 discussion
3. **實時同步**：通過 GitHub API 實時獲取和顯示評論
4. **無需後端**：完全客戶端實現，適合靜態部署

## 配置說明

### 1. GitHub 設置

1. **啟用 Discussions**：
   - 前往 GitHub 倉庫設置
   - 在 "Features" 部分啟用 Discussions

2. **安裝 Giscus App**：
   - 前往 [Giscus App](https://github.com/apps/giscus)
   - 點擊 "Install" 並選擇你的倉庫

3. **獲取配置信息**：
   - 前往 [Giscus 配置頁面](https://giscus.app/)
   - 選擇你的倉庫和分類
   - 複製配置信息

### 2. 項目配置

當前配置（在 `src/config/site.ts` 中）：

```typescript
giscus: {
  repo: "ccc333bbb/memo",
  repoId: "R_kgDOO6akLA",
  category: "General", 
  categoryId: "DIC_kwDOO6akLM4Cr_hK",
  mapping: "pathname",
  theme: "purple_dark",
}
```

### 3. 組件使用

在文章中使用評論組件：

```astro
---
import GiscusComments from '../../../components/GiscusComments.astro';
---

<GiscusComments lang="zh" />
```

## 語言支持

### 語言代碼映射

Giscus 組件會自動將我們的語言代碼映射到 Giscus 支持的語言代碼：

- `en` → `en` (English)
- `zh` → `zh-CN` (简体中文)
- `tw` → `zh-TW` (繁體中文)

### 本地化文本

不同語言版本會顯示對應的加載文本：

- 英文：`Loading comments...`
- 簡體中文：`正在加載評論...`
- 繁體中文：`正在載入評論...`

## 組件特性

### 1. 錯誤處理

- 腳本加載失敗時顯示友好的錯誤信息
- 控制台調試信息幫助開發者診斷問題
- 自動重試機制

### 2. 加載狀態

- 顯示本地化的加載文本
- 最小高度確保布局穩定
- 平滑的加載動畫

### 3. 響應式設計

- 移動端優化
- 深色主題支持
- 自適應容器大小

### 4. 調試功能

- 詳細的配置日誌
- 錯誤追蹤
- 性能監控

## 故障排除

### 常見問題

1. **評論不顯示**
   - 檢查 Giscus App 是否已安裝
   - 確認 Discussions 功能已啟用
   - 驗證配置信息是否正確

2. **語言顯示錯誤**
   - 檢查語言代碼映射是否正確
   - 確認 Giscus 支持該語言

3. **樣式問題**
   - 檢查 CSS 是否正確加載
   - 確認主題設置是否正確

### 調試步驟

1. 打開瀏覽器開發者工具
2. 查看控制台是否有錯誤信息
3. 檢查 Giscus 配置日誌
4. 確認腳本是否正確加載

## 文件結構

```
src/
├── components/
│   └── GiscusComments.astro    # Giscus 評論組件
├── config/
│   └── site.ts                 # 網站配置（包含 Giscus 設置）
└── layouts/
    └── BlogLayout.astro        # 博客布局（包含評論組件）
```

## 自定義樣式

評論組件的樣式可以通過修改 `GiscusComments.astro` 文件中的 `<style>` 部分來自定義：

```css
.giscus-container {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

## 版本歷史

- **v2.1.0** - 修復語言映射問題，添加錯誤處理和調試功能
- **v2.0.0** - 從 GitHub Issues 遷移到 Giscus

## 相關資源

- [Giscus 官方文檔](https://giscus.app/)
- [GitHub Discussions 文檔](https://docs.github.com/en/discussions)
- [Giscus App 安裝](https://github.com/apps/giscus)

## 與舊系統的區別

| 特性 | 舊系統 (GitHub Issues) | 新系統 (Giscus) |
|------|----------------------|-----------------|
| 部署方式 | 需要服務器端 API | 完全靜態 |
| 評論存儲 | GitHub Issues | GitHub Discussions |
| 自動創建 | 需要手動創建 Issue | 自動創建 Discussion |
| 主題支持 | 固定主題 | 自動主題切換 |
| 維護成本 | 需要維護 API | 零維護 |

## 更新日誌

- **v2.0.0** - 從 GitHub Issues 遷移到 Giscus
- **v1.0.0** - 初始版本，使用 GitHub Issues API 