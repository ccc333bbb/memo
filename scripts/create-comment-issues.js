import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import GitHubAPI from './github-api.js';

class CommentIssueCreator {
  constructor() {
    this.githubAPI = new GitHubAPI();
    this.contentDirs = [
      // Blog posts
      'src/pages/en/blog',
      'src/pages/zh/blog', 
      'src/pages/tw/blog',
      // Thoughts
      'src/pages/en/thoughts',
      'src/pages/zh/thoughts',
      'src/pages/tw/thoughts',
      // Projects
      'src/pages/en/projects',
      'src/pages/zh/projects',
      'src/pages/tw/projects'
    ];
  }

  /**
   * 從 markdown 文件提取 frontmatter
   */
  extractFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return null;

    const frontmatter = {};
    const lines = frontmatterMatch[1].split('\n');
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        // 移除引號
        frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
    
    return frontmatter;
  }

  /**
   * 獲取所有已發布的文章
   */
  async getAllPublishedPosts() {
    const posts = [];
    
    for (const dir of this.contentDirs) {
      try {
        const files = await readdir(dir);
        const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'index.astro');
        
        for (const file of mdFiles) {
          const filePath = join(dir, file);
          const content = await readFile(filePath, 'utf-8');
          const frontmatter = this.extractFrontmatter(content);
          
          if (frontmatter && frontmatter.title && frontmatter.status === 'published') {
            // 構建 URL
            const lang = dir.includes('/en/') ? 'en' : dir.includes('/zh/') ? 'zh' : 'tw';
            const contentType = dir.includes('/blog/') ? 'blog' : 
                               dir.includes('/thoughts/') ? 'thoughts' : 
                               dir.includes('/projects/') ? 'projects' : 'blog';
            const slug = file.replace('.md', '');
            const url = `https://your-domain.com/${lang}/${contentType}/${slug}`;
            
            posts.push({
              title: frontmatter.title,
              description: frontmatter.description || '',
              url,
              filePath,
              language: lang,
              contentType
            });
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
      }
    }
    
    return posts;
  }

  /**
   * 為文章創建評論 issue
   */
  async createCommentIssueForPost(post) {
    try {
      // 檢查是否已存在對應的 issue
      const existingIssue = await this.githubAPI.findIssueByTitle(`💬 ${post.title}`);
      
      if (existingIssue) {
        console.log(`✅ 評論 issue 已存在: ${post.title} (#${existingIssue.number})`);
        return existingIssue;
      }

      // 創建新的評論 issue
      const issue = await this.githubAPI.createCommentIssue(
        post.title, 
        post.url, 
        post.description
      );
      
      console.log(`✅ 成功創建評論 issue: ${post.title} (#${issue.number})`);
      return issue;
    } catch (error) {
      console.error(`❌ 為文章創建評論 issue 失敗: ${post.title}`, error.message);
      return null;
    }
  }

  /**
   * 為所有文章創建評論 issues
   */
  async createAllCommentIssues() {
    console.log('🚀 開始為所有文章創建評論 issues...\n');
    
    const posts = await this.getAllPublishedPosts();
    console.log(`📝 找到 ${posts.length} 篇已發布的文章\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const post of posts) {
      console.log(`處理: ${post.title} (${post.language}/${post.contentType})`);
      
      const result = await this.createCommentIssueForPost(post);
      
      if (result) {
        if (result.number) {
          successCount++;
        } else {
          skipCount++;
        }
      } else {
        errorCount++;
      }
      
      // 添加延遲避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 創建結果統計:');
    console.log(`✅ 成功創建: ${successCount}`);
    console.log(`⏭️  已存在跳過: ${skipCount}`);
    console.log(`❌ 創建失敗: ${errorCount}`);
    console.log(`📝 總計處理: ${posts.length}`);
  }
}

// 執行腳本
async function main() {
  const creator = new CommentIssueCreator();
  await creator.createAllCommentIssues();
}

main().catch(console.error); 