#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import GitHubAPI from './github-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlogLister {
  constructor() {
    this.githubAPI = new GitHubAPI();
    this.blogDirs = {
      en: path.join(__dirname, '../src/pages/en/blog'),
      zh: path.join(__dirname, '../src/pages/zh/blog'),
      tw: path.join(__dirname, '../src/pages/tw/blog'),
    };
  }

  /**
   * 解析 frontmatter
   * @param {string} content - 文件內容
   * @returns {Object} frontmatter 對象
   */
  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatterStr = frontmatterMatch[1];
    const frontmatter = {};

    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        try {
          // 嘗試解析 JSON 值
          frontmatter[key.trim()] = JSON.parse(value);
        } catch {
          // 如果不是 JSON，直接使用字符串
          frontmatter[key.trim()] = value;
        }
      }
    });

    return frontmatter;
  }

  /**
   * 獲取指定語言的 blog posts
   * @param {string} lang - 語言代碼
   * @returns {Promise<Array>} blog posts 數組
   */
  async getBlogPostsByLanguage(lang) {
    const blogDir = this.blogDirs[lang];
    if (!blogDir) {
      console.warn(`⚠️  不支持的語言: ${lang}`);
      return [];
    }

    try {
      // 檢查目錄是否存在
      try {
        await fs.access(blogDir);
      } catch (error) {
        console.warn(`⚠️  目錄不存在: ${blogDir}`);
        return [];
      }

      const files = await fs.readdir(blogDir);
      const blogPosts = [];

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filepath = path.join(blogDir, file);
          const content = await fs.readFile(filepath, 'utf8');
          
          try {
            const frontmatter = this.parseFrontmatter(content);
            if (frontmatter) {
              blogPosts.push({
                filename: file,
                filepath,
                lang,
                ...frontmatter,
              });
            }
          } catch (error) {
            console.warn(`⚠️  無法解析 ${file} 的 frontmatter`);
          }
        }
      }

      return blogPosts;
    } catch (error) {
      console.error(`❌ 讀取 ${lang} blog posts 失敗:`, error.message);
      return [];
    }
  }

  /**
   * 獲取所有語言的 blog posts
   * @returns {Promise<Array>} blog posts 數組
   */
  async getAllBlogPosts() {
    const allPosts = [];
    
    for (const lang of Object.keys(this.blogDirs)) {
      const posts = await this.getBlogPostsByLanguage(lang);
      allPosts.push(...posts);
    }

    return allPosts.sort((a, b) => {
      const dateA = new Date(a.pubDate || '1970-01-01');
      const dateB = new Date(b.pubDate || '1970-01-01');
      return dateB - dateA;
    });
  }

  /**
   * 獲取 GitHub issues 信息
   * @returns {Promise<Array>} issues 數組
   */
  async getGitHubIssues() {
    try {
      const issues = await this.githubAPI.searchBlogIssues('label:blog-post');
      return issues;
    } catch (error) {
      console.error('❌ 獲取 GitHub issues 失敗:', error.message);
      return [];
    }
  }

  /**
   * 格式化狀態顯示
   * @param {string} status - 狀態
   * @returns {string} 格式化的狀態
   */
  formatStatus(status) {
    switch (status) {
      case 'draft':
        return '📝 Draft';
      case 'published':
        return '✅ Published';
      default:
        return '❓ Unknown';
    }
  }

  /**
   * 格式化日期顯示
   * @param {string} date - 日期字符串
   * @returns {string} 格式化的日期
   */
  formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('zh-TW');
  }

  /**
   * 顯示 blog posts 列表
   */
  async listBlogPosts() {
    console.log('📚 Blog Posts 列表\n');

    const blogPosts = await this.getAllBlogPosts();
    const issues = await this.getGitHubIssues();

    if (blogPosts.length === 0) {
      console.log('📭 沒有找到任何 blog posts');
      return;
    }

    // 創建 issue 映射
    const issueMap = new Map();
    issues.forEach(issue => {
      issueMap.set(issue.number, issue);
    });

    console.log('┌─────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ 標題                                    │ 語言 │ 狀態      │ 發布日期   │ Issue │');
    console.log('├─────────────────────────────────────────────────────────────────────────────────────────┤');

    blogPosts.forEach(post => {
      const title = (post.title || 'Untitled').padEnd(40);
      const lang = (post.lang || 'N/A').padEnd(4);
      const status = this.formatStatus(post.status).padEnd(10);
      const pubDate = this.formatDate(post.pubDate).padEnd(10);
      const issueNum = post.githubIssue ? `#${post.githubIssue}` : 'N/A';
      
      console.log(`│ ${title} │ ${lang} │ ${status} │ ${pubDate} │ ${issueNum.padEnd(6)} │`);
    });

    console.log('└─────────────────────────────────────────────────────────────────────────────────────────┘');

    // 顯示統計信息
    const draftCount = blogPosts.filter(p => p.status === 'draft').length;
    const publishedCount = blogPosts.filter(p => p.status === 'published').length;
    const withIssuesCount = blogPosts.filter(p => p.githubIssue).length;
    
    // 按語言統計
    const langStats = {};
    Object.keys(this.blogDirs).forEach(lang => {
      langStats[lang] = blogPosts.filter(p => p.lang === lang).length;
    });

    console.log(`\n📊 統計信息:`);
    console.log(`   • 總文章數: ${blogPosts.length}`);
    console.log(`   • Draft: ${draftCount}`);
    console.log(`   • Published: ${publishedCount}`);
    console.log(`   • 有 GitHub Issue: ${withIssuesCount}`);
    console.log(`\n🌍 語言分布:`);
    Object.entries(langStats).forEach(([lang, count]) => {
      console.log(`   • ${lang}: ${count} 篇`);
    });

    // 顯示 GitHub issues 狀態
    if (issues.length > 0) {
      console.log(`\n🔗 GitHub Issues 狀態:`);
      issues.forEach(issue => {
        const labels = issue.labels.map(l => l.name).join(', ');
        const state = issue.state === 'open' ? '🔓 Open' : '🔒 Closed';
        console.log(`   • #${issue.number}: ${issue.title} (${state}) [${labels}]`);
      });
    }

    console.log(`\n💡 可用命令:`);
    console.log(`   • npm run blog:create - 創建新的 blog post`);
    console.log(`   • npm run blog:publish <issue-number> - 發布 blog post`);
  }
}

// 執行列表顯示
const lister = new BlogLister();
lister.listBlogPosts(); 