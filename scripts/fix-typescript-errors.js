import fs from 'fs';
import path from 'path';

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
    
    // 添加類型導入
    if (!content.includes('import type { ContentEntry }')) {
      const importMatch = content.match(/import.*from.*Layout\.astro.*\n/);
      if (importMatch) {
        const importIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, importIndex) + 
                 "import type { ContentEntry } from '../../../types/content';\n" +
                 content.slice(importIndex);
      }
    }
    
    // 修復 import.meta.glob 類型
    content = content.replace(
      /const (\w+) = Object\.values\(import\.meta\.glob\(['"][^'"]*\.md['"], \{ eager: true \}\)\);/g,
      'const $1 = Object.values(import.meta.glob(\'./*.md\', { eager: true })) as ContentEntry[];'
    );
    
    // 修復日期處理
    content = content.replace(
      /new Date\((\w+)\.frontmatter\.(pubDate|date)\)/g,
      '$1.frontmatter.$2 && new Date($1.frontmatter.$2 as string)'
    );
    
    // 修復 map 函數參數類型
    content = content.replace(
      /\.map\(\((\w+)\) =>/g,
      '.map(($1: string) =>'
    );
    
    // 修復變量名（movie-review 頁面使用 review 而不是 post）
    if (filePath.includes('movie-review')) {
      content = content.replace(
        /const (\w+) = Object\.values\(import\.meta\.glob\(['"][^'"]*\.md['"], \{ eager: true \}\)\) as ContentEntry\[\];/g,
        'const reviews = Object.values(import.meta.glob(\'./*.md\', { eager: true })) as ContentEntry[];'
      );
      content = content.replace(/post\./g, 'review.');
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