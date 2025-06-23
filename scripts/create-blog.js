#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import GitHubAPI from './github-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlogCreator {
  constructor() {
    this.githubAPI = new GitHubAPI();
    this.blogDir = path.join(__dirname, '../src/pages/zh-TW/blog');
  }

  /**
   * 創建交互式輸入界面
   */
  createInterface() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * 獲取用戶輸入
   * @param {readline.Interface} rl - readline 接口
   * @param {string} question - 問題
   * @returns {Promise<string>} 用戶輸入
   */
  async askQuestion(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * 生成安全的文件名
   * @param {string} title - 標題
   * @returns {string} 安全的文件名
   */
  generateSafeFilename(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * 生成 blog post 的 frontmatter
   * @param {Object} data - blog 數據
   * @returns {string} frontmatter 字符串
   */
  generateFrontmatter(data) {
    const today = new Date().toISOString().split('T')[0];
    
    return `---
title: ${data.title}
pubDate: ${data.pubDate || today}
description: ${data.description}
author: ${data.author || 'kungchiang'}
status: draft
githubIssue: ${data.issueNumber || ''}
tags: ${data.tags ? JSON.stringify(data.tags) : '[]'}
---

# ${data.title}

${data.description}

<!-- 在此處開始撰寫您的文章內容 -->
`;
  }

  /**
   * 創建 blog post 文件
   * @param {string} filename - 文件名
   * @param {string} content - 文件內容
   */
  async createBlogFile(filename, content) {
    const filepath = path.join(this.blogDir, filename);
    
    try {
      await fs.writeFile(filepath, content, 'utf8');
      console.log(`✅ 成功創建 blog post: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('❌ 創建 blog post 文件失敗:', error.message);
      throw error;
    }
  }

  /**
   * 主創建流程
   */
  async create() {
    const rl = this.createInterface();
    
    try {
      console.log('📝 創建新的 Blog Post\n');
      
      // 獲取用戶輸入
      const title = await this.askQuestion(rl, '文章標題: ');
      const description = await this.askQuestion(rl, '文章描述: ');
      const author = await this.askQuestion(rl, '作者 (預設: ccc333bbb): ') || 'ccc333bbb';
      const tags = await this.askQuestion(rl, '標籤 (用逗號分隔): ');
      
      // 生成文件名
      const filename = `${this.generateSafeFilename(title)}.md`;
      
      // 檢查文件是否已存在
      const filepath = path.join(this.blogDir, filename);
      try {
        await fs.access(filepath);
        console.log('❌ 文件已存在，請使用不同的標題');
        rl.close();
        return;
      } catch (error) {
        // 文件不存在，繼續創建
      }
      
      // 創建 GitHub issue
      console.log('\n🔗 正在創建 GitHub issue...');
      const issueBody = `## Blog Post: ${title}

**描述**: ${description}
**作者**: ${author}
**狀態**: Draft
**文件**: \`src/pages/zh-TW/blog/${filename}\`

### 任務清單
- [ ] 撰寫文章內容
- [ ] 添加圖片和資源
- [ ] 檢查語法和格式
- [ ] 設置發布日期
- [ ] 發布文章

### 備註
此 issue 將在文章發布時自動關閉。
`;
      
      const issue = await this.githubAPI.createIssue(
        `Blog Post: ${title}`,
        issueBody,
        ['blog-post', 'draft']
      );
      
      // 生成 blog post 內容
      const blogData = {
        title,
        description,
        author,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        issueNumber: issue.number,
      };
      
      const frontmatter = this.generateFrontmatter(blogData);
      
      // 創建 blog post 文件
      await this.createBlogFile(filename, frontmatter);
      
      console.log('\n🎉 Blog post 創建成功！');
      console.log(`📄 文件: ${filepath}`);
      console.log(`🔗 Issue: https://github.com/${this.githubAPI.owner}/${this.githubAPI.repo}/issues/${issue.number}`);
      console.log('\n💡 提示:');
      console.log('- 編輯文章後，使用 `npm run blog:publish <issue-number>` 發布');
      console.log('- 在 commit 信息中包含 `Closes #${issue.number}` 可自動關閉 issue');
      
    } catch (error) {
      console.error('❌ 創建 blog post 失敗:', error.message);
    } finally {
      rl.close();
    }
  }
}

// 執行創建流程
const creator = new BlogCreator();
creator.create(); 