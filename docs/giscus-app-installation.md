# Giscus App 安裝指南

## 問題診斷

根據檢查結果，發現以下問題：
- ✅ Discussions 功能已啟用
- ✅ 倉庫配置正確
- ❌ **Giscus App 未安裝** - 這是導致評論系統無法正常工作的根本原因

## 安裝步驟

### 1. 安裝 Giscus App

1. **訪問 Giscus App 頁面**：
   - 前往 [https://github.com/apps/giscus](https://github.com/apps/giscus)
   - 點擊 "Install" 按鈕

2. **選擇倉庫**：
   - 選擇 `ccc333bbb/memo` 倉庫
   - 或者選擇 "All repositories" 以安裝到所有倉庫

3. **確認安裝**：
   - 點擊 "Install" 確認安裝

### 2. 驗證安裝

安裝完成後，運行以下命令驗證：

```bash
node scripts/check-giscus-config.js
```

應該看到：
```
✅ Giscus App 已安裝並可訪問
```

### 3. 測試評論功能

1. **訪問網站**：
   - 前往 [https://ccc333bbb.github.io/memo/](https://ccc333bbb.github.io/memo/)

2. **測試評論**：
   - 選擇任意文章頁面
   - 嘗試發表評論
   - 使用 GitHub 帳號登入

## 常見問題

### Q: 為什麼有些頁面可以評論，有些不行？
A: 這是因為 Giscus App 沒有正確安裝，導致無法創建新的 discussion。

### Q: 安裝後還是無法評論怎麼辦？
A: 
1. 確認 Giscus App 已安裝到正確的倉庫
2. 檢查 GitHub 帳號是否有權限
3. 清除瀏覽器快取並重新載入頁面

### Q: 如何檢查 Giscus App 狀態？
A: 運行 `node scripts/check-giscus-config.js` 查看詳細狀態。

## 技術細節

### 錯誤訊息解析

```
POST https://giscus.app/api/discussions 400 (Bad Request)
```

這個錯誤表示：
- Giscus App 沒有安裝
- 或者沒有權限創建 discussion

### 解決方案

1. **安裝 Giscus App**（主要解決方案）
2. **確保 GitHub 帳號有權限**
3. **檢查倉庫設置**

## 聯繫支持

如果安裝後仍有問題，請：
1. 檢查 [Giscus 官方文檔](https://giscus.app/)
2. 查看 [GitHub Discussions 文檔](https://docs.github.com/en/discussions)
3. 在 GitHub Issues 中報告問題 