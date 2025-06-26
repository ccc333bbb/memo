# 麵包屑導航功能實現

## 功能概述

為 memo 項目添加了麵包屑導航功能，當用戶訪問具體的文章時，可以清楚地看到當前位置並輕鬆返回上一層。

## 實現方案

### 1. 創建麵包屑組件

創建了 `src/components/Breadcrumb.astro` 組件，具有以下特性：

- **多語言支持**：支持 en、zh、tw 三種語言
- **動態路徑生成**：根據當前路徑自動生成麵包屑
- **智能顯示**：只有當有多於一個麵包屑時才顯示
- **返回按鈕**：提供快速返回上一層的按鈕

### 2. 麵包屑配置

```typescript
const breadcrumbConfig = {
  en: {
    home: 'Home',
    blog: 'Blog',
    thoughts: 'Thoughts',
    projects: 'Projects',
    bookmarks: 'Bookmarks',
    movieReview: 'Movie Reviews',
    back: '← Back'
  },
  zh: {
    home: '首页',
    blog: '博客',
    thoughts: '想法',
    projects: '项目',
    bookmarks: '书签',
    movieReview: '观影心得',
    back: '← 返回'
  },
  tw: {
    home: '首頁',
    blog: '部落格',
    thoughts: '想法',
    projects: '專案',
    bookmarks: '書籤',
    movieReview: '觀影心得',
    back: '← 返回'
  }
};
```

### 3. 路徑解析邏輯

麵包屑組件會自動解析當前路徑並生成對應的麵包屑：

- **首頁**：`/memo/[lang]/`
- **章節頁面**：`/memo/[lang]/blog/`、`/memo/[lang]/thoughts/` 等
- **文章頁面**：`/memo/[lang]/blog/article-name/` 等

### 4. 集成到 BlogLayout

將麵包屑組件集成到 `src/layouts/BlogLayout.astro` 中：

```astro
---
import Layout from './Layout.astro';
import GiscusComments from '../components/GiscusComments.astro';
import Breadcrumb from '../components/Breadcrumb.astro';

const { frontmatter } = Astro.props;
const { title, lang = 'en' } = frontmatter;
---

<Layout title={title} lang={lang}>
  <Breadcrumb 
    lang={lang} 
    currentPath={Astro.url.pathname} 
    title={title}
  />
  
  <main class="blog-container">
    <article class="blog-content">
      <slot />
    </article>

    <section class="comments-section">
      <h2>Comments</h2>
      <GiscusComments
        lang={lang}
        theme="purple_dark"
      />
    </section>
  </main>
</Layout>
```

### 5. 更新所有文章

為所有文章添加了 `BlogLayout.astro` 布局，包括：

**英文版本：**
- `src/pages/en/blog/git-backup-strategy.md`
- `src/pages/en/bookmarks/llm-providers.md`
- `src/pages/en/bookmarks/web-development.md`
- `src/pages/en/projects/memo-website.md`
- `src/pages/en/movie-review/KungFu Jungle.md`
- `src/pages/en/thoughts/first-thought.md`

**簡體中文版本：**
- `src/pages/zh/blog/git-backup-strategy.md`
- `src/pages/zh/bookmarks/llm-providers.md`
- `src/pages/zh/bookmarks/web-development.md`
- `src/pages/zh/projects/memo-website.md`
- `src/pages/zh/movie-review/一个人的武林.md`
- `src/pages/zh/thoughts/first-thought.md`

**繁體中文版本：**
- `src/pages/tw/blog/git-backup-strategy.md`
- `src/pages/tw/bookmarks/llm-providers.md`
- `src/pages/tw/bookmarks/web-development.md`
- `src/pages/tw/projects/memo-website.md`
- `src/pages/tw/movie-review/一個人的武林.md`
- `src/pages/tw/thoughts/first-thought.md`

**特殊版本：**
- `src/pages/zh-tw/movie-review/一個人的武林.md`

## 樣式設計

### 1. 響應式設計

麵包屑組件採用響應式設計，適配不同屏幕尺寸：

```css
@media (max-width: 768px) {
  .breadcrumb {
    top: 70px; /* 移動端導航欄可能更小 */
  }
  
  .breadcrumb-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .breadcrumb-list {
    flex-wrap: wrap;
  }
  
  .back-button {
    align-self: flex-end;
  }
}
```

### 2. 視覺效果

- **毛玻璃效果**：使用 `backdrop-filter: blur(10px)` 創建現代感
- **粘性定位**：麵包屑會粘在導航欄下方
- **懸停效果**：鏈接和按鈕有平滑的過渡動畫
- **返回按鈕動畫**：懸停時有輕微的位移效果

### 3. 無障礙支持

- 使用語義化的 `<nav>` 和 `<ol>` 標籤
- 添加 `aria-label` 和 `aria-current` 屬性
- 確保鍵盤導航支持

## 使用示例

### 麵包屑顯示效果

當用戶訪問文章頁面時，會看到如下麵包屑：

```
Home / Blog / Hello World    [← Back]
```

### 不同語言的麵包屑

**英文：**
```
Home / Blog / Git Backup Strategy    [← Back]
```

**簡體中文：**
```
首页 / 博客 / Git 多平台备份策略    [← 返回]
```

**繁體中文：**
```
首頁 / 部落格 / Git 多平台備份策略    [← 返回]
```

## 技術特點

### 1. 自動路徑解析

麵包屑組件會自動解析當前 URL 路徑，無需手動配置：

```typescript
const generateBreadcrumbs = () => {
  const breadcrumbs = [];
  
  // 添加首頁
  breadcrumbs.push({
    label: config.home,
    path: `/memo/${lang}/`,
    isActive: currentPath === `/memo/${lang}/`
  });
  
  // 解析當前路徑
  const pathSegments = currentPath.replace(`/memo/${lang}/`, '').split('/').filter(Boolean);
  
  // 根據路徑段生成麵包屑...
};
```

### 2. 智能顯示邏輯

只有當有多於一個麵包屑時才顯示組件：

```typescript
const showBreadcrumb = breadcrumbs.length > 1;
```

### 3. 返回按鈕邏輯

只有當有文章標題時才顯示返回按鈕：

```astro
{breadcrumbs.length > 2 && (
  <a href={breadcrumbs[breadcrumbs.length - 2].path} class="back-button">
    {config.back}
  </a>
)}
```

## 維護說明

### 添加新的章節

如需添加新的章節，只需在 `breadcrumbConfig` 中添加對應配置：

```typescript
const breadcrumbConfig = {
  en: {
    // 現有配置...
    newSection: { label: 'New Section', path: '/memo/en/new-section/' },
  },
  // 其他語言...
};
```

### 修改樣式

麵包屑的樣式定義在 `Breadcrumb.astro` 組件的 `<style>` 部分，可以根據需要調整顏色、間距等。

## 測試建議

1. **多語言測試**：確保所有語言版本的麵包屑都正確顯示
2. **響應式測試**：在不同屏幕尺寸下測試麵包屑的顯示效果
3. **導航測試**：測試麵包屑鏈接和返回按鈕的功能
4. **無障礙測試**：確保鍵盤導航和屏幕閱讀器支持

## 總結

麵包屑導航功能的實現解決了用戶在訪問具體文章時無法輕鬆返回上一層的問題。通過創建可重用的組件和統一的布局，確保了所有文章頁面都有一致的導航體驗。該功能支持多語言，具有響應式設計，並遵循無障礙設計原則。 