# Giscus 評論系統

這個項目使用 [Giscus](https://giscus.app/) 作為評論系統，基於 GitHub Discussions，完美支持靜態網站部署。

## 功能特點

- ✅ **基於 GitHub Discussions**：使用 GitHub Discussions 作為評論後端
- ✅ **靜態網站友好**：無需服務器端 API，完美支持 GitHub Pages
- ✅ **自動主題切換**：支持亮色/暗色主題自動切換
- ✅ **多語言支持**：支持多種語言界面
- ✅ **實時更新**：評論實時同步，無需刷新頁面
- ✅ **美觀的 UI**：與網站設計風格一致的評論界面

## 工作原理

1. **基於 Discussions**：使用 GitHub Discussions 作為評論存儲
2. **路徑映射**：根據頁面路徑自動創建對應的 discussion
3. **實時同步**：通過 GitHub API 實時獲取和顯示評論
4. **無需後端**：完全客戶端實現，適合靜態部署

## 配置說明

### GitHub 倉庫設置

1. **啟用 Discussions**：
   - 前往你的 GitHub 倉庫設置
   - 在 "Features" 部分啟用 "Discussions"

2. **安裝 Giscus App**：
   - 前往 [Giscus App](https://github.com/apps/giscus)
   - 點擊 "Install" 安裝到你的倉庫

3. **獲取配置信息**：
   - 前往 [Giscus 配置頁面](https://giscus.app/)
   - 填入你的倉庫信息
   - 複製生成的配置代碼

### 組件配置

當前配置（在 `src/components/GiscusComments.astro` 中）：

```astro
<GiscusComments 
  repo="ccc333bbb/memo"
  repoId="R_kgDOLqQAAA"
  category="Announcements"
  categoryId="DIC_kwDOLqQAAM4CbqQAAA"
  mapping="pathname"
  strict="false"
  reactionsEnabled="true"
  emitMetadata="false"
  inputPosition="bottom"
  theme="preferred_color_scheme"
  lang="zh-TW"
  loading="lazy"
/>
```

## 使用方法

### 在文章中添加評論組件

在 Markdown 文章的最後添加：

```markdown
---

import GiscusComments from '../../../components/GiscusComments.astro';

<GiscusComments />
```

### 配置參數說明

| 參數 | 描述 | 默認值 |
|------|------|--------|
| `repo` | GitHub 倉庫名稱 | `"ccc333bbb/memo"` |
| `repoId` | 倉庫 ID | `"R_kgDOLqQAAA"` |
| `category` | Discussions 分類 | `"Announcements"` |
| `categoryId` | 分類 ID | `"DIC_kwDOLqQAAM4CbqQAAA"` |
| `mapping` | 路徑映射方式 | `"pathname"` |
| `theme` | 主題設置 | `"preferred_color_scheme"` |
| `lang` | 界面語言 | `"zh-TW"` |

## 文件結構

```
src/
├── components/
│   └── GiscusComments.astro    # Giscus 評論組件
└── pages/
    ├── en/
    ├── zh/
    └── tw/
        ├── blog/
        ├── thoughts/
        └── projects/
            └── *.md            # 包含評論組件的文章
```

## 自定義樣式

評論組件的樣式可以通過修改 `GiscusComments.astro` 文件中的 `<style>` 部分來自定義：

```css
.giscus-container {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

## 故障排除

### 常見問題

1. **評論不顯示**
   - 確認已啟用 GitHub Discussions
   - 檢查 Giscus App 是否已安裝
   - 確認倉庫 ID 和分類 ID 是否正確

2. **主題不匹配**
   - 檢查 `theme` 參數設置
   - 確認網站是否支持主題切換

3. **語言設置問題**
   - 修改 `lang` 參數為對應語言代碼
   - 支持：`zh-TW`, `zh-CN`, `en`, `ja` 等

### 調試方法

1. 打開瀏覽器開發者工具
2. 檢查 Console 是否有錯誤信息
3. 確認 giscus 腳本是否正確加載
4. 檢查網絡請求是否成功

## 最佳實踐

1. **路徑映射**：使用 `pathname` 映射確保每頁有獨立評論
2. **主題一致性**：設置 `theme="preferred_color_scheme"` 自動適配
3. **性能優化**：使用 `loading="lazy"` 延遲加載
4. **用戶體驗**：設置 `inputPosition="bottom"` 讓用戶先看內容

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