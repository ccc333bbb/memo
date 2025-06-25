import fs from 'fs';

// 需要修復的文件列表
const filesToFix = [
  'src/pages/en/bookmarks/index.astro',
  'src/pages/en/movie-review/index.astro',
  'src/pages/en/projects/index.astro',
  'src/pages/en/thoughts/index.astro',
  'src/pages/tw/blog/index.astro',
  'src/pages/tw/bookmarks/index.astro',
  'src/pages/tw/movie-review/index.astro',
  'src/pages/tw/projects/index.astro',
  'src/pages/tw/thoughts/index.astro',
  'src/pages/zh/blog/index.astro',
  'src/pages/zh/bookmarks/index.astro',
  'src/pages/zh/movie-review/index.astro',
  'src/pages/zh/projects/index.astro',
  'src/pages/zh/thoughts/index.astro'
];

// 修復函數
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 修復 map 函數參數類型 - 移除錯誤的 string 類型註解
    content = content.replace(
      /\.map\(\((\w+): string\) =>/g,
      '.map(($1) =>'
    );
    
    // 修復 movie-review 頁面的變量名問題
    if (filePath.includes('movie-review')) {
      // 確保使用正確的變量名
      if (content.includes('const reviews =')) {
        content = content.replace(
          /{posts\.map\(\(post: string\) =>/g,
          '{reviews.map((review) =>'
        );
        content = content.replace(
          /{posts\.map\(\(post\) =>/g,
          '{reviews.map((review) =>'
        );
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 修復完成: ${filePath}`);
  } catch (error) {
    console.error(`❌ 修復失敗: ${filePath}`, error.message);
  }
}

// 執行修復
console.log('🔧 開始修復 TypeScript 錯誤...');
filesToFix.forEach(fixFile);
console.log('🎉 修復完成！'); 