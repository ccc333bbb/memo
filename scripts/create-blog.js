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
    // Use consistent directory structure
    this.blogDirs = {
      en: path.join(__dirname, '../src/pages/en/blog'),
      zh: path.join(__dirname, '../src/pages/zh/blog'), 
      tw: path.join(__dirname, '../src/pages/tw/blog'),
    };
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
   * @param {string} defaultValue - 預設值
   * @returns {Promise<string>} 用戶輸入
   */
  async askQuestion(rl, question, defaultValue = '') {
    return new Promise((resolve) => {
      const displayQuestion = defaultValue 
        ? `${question} (預設: ${defaultValue}): `
        : `${question}: `;
        
      rl.question(displayQuestion, (answer) => {
        const trimmedAnswer = answer.trim();
        resolve(trimmedAnswer || defaultValue);
      });
    });
  }

  /**
   * 驗證用戶輸入
   * @param {string} input - 用戶輸入
   * @param {string} fieldName - 欄位名稱
   * @returns {boolean} 是否有效
   */
  validateInput(input, fieldName) {
    if (!input || input.trim().length === 0) {
      console.error(`❌ ${fieldName} 不能為空`);
      return false;
    }
    
    if (fieldName === '標題' && input.length > 100) {
      console.error(`❌ 標題長度不能超過 100 個字符`);
      return false;
    }
    
    return true;
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
   * 確保目錄存在
   * @param {string} dirPath - 目錄路徑
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      console.log(`📁 創建目錄: ${dirPath}`);
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * 創建 blog post 文件
   * @param {string} lang - 語言代碼
   * @param {string} filename - 文件名
   * @param {string} content - 文件內容
   */
  async createBlogFile(lang, filename, content) {
    if (!this.blogDirs[lang]) {
      throw new Error(`❌ 不支持的語言: ${lang}`);
    }

    const blogDir = this.blogDirs[lang];
    const filepath = path.join(blogDir, filename);
    
    try {
      // 確保目錄存在
      await this.ensureDirectoryExists(blogDir);
      
      // 檢查文件是否已存在
      try {
        await fs.access(filepath);
        throw new Error(`❌ 文件已存在: ${filepath}`);
      } catch (accessError) {
        // 文件不存在，繼續創建
        if (accessError.code !== 'ENOENT') {
          throw accessError;
        }
      }
      
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
      
      // 獲取語言選擇
      console.log('選擇語言:');
      console.log('1. English (en)');
      console.log('2. 简体中文 (zh)');
      console.log('3. 繁體中文 (tw)');
      
      let lang;
      while (!lang) {
        const langChoice = await this.askQuestion(rl, '請選擇語言 (1-3)', '1');
        switch (langChoice) {
          case '1':
            lang = 'en';
            break;
          case '2':
            lang = 'zh';
            break;
          case '3':
            lang = 'tw';
            break;
          default:
            console.log('❌ 無效選擇，請輸入 1、2 或 3');
        }
      }
      
      console.log(`\n選擇的語言: ${lang}\n`);
      
      // 獲取用戶輸入並驗證
      let title;
      while (!title) {
        title = await this.askQuestion(rl, '文章標題');
        if (!this.validateInput(title, '標題')) {
          title = null;
        }
      }
      
      let description;
      while (!description) {
        description = await this.askQuestion(rl, '文章描述');
        if (!this.validateInput(description, '描述')) {
          description = null;
        }
      }
      
      const author = await this.askQuestion(rl, '作者', 'ccc333bbb');
      const tags = await this.askQuestion(rl, '標籤 (用逗號分隔)');
      
      // 生成文件名
      const filename = `${this.generateSafeFilename(title)}.md`;
      
      // 創建 GitHub issue
      console.log('\n🔗 正在創建 GitHub issue...');
      const issueBody = `## Blog Post: ${title}

**語言**: ${lang}
**描述**: ${description}
**作者**: ${author}
**狀態**: Draft
**文件**: \`src/pages/${lang}/blog/${filename}\`

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
        `Blog Post: ${title} (${lang})`,
        issueBody,
        ['blog-post', 'draft', `lang:${lang}`]
      );
      
      // 生成 blog post 內容
      const blogData = {
        title,
        description,
        author,
        lang,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        issueNumber: issue.number,
      };
      
      const frontmatter = this.generateFrontmatter(blogData);
      
      // 創建 blog post 文件
      const filepath = await this.createBlogFile(lang, filename, frontmatter);
      
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