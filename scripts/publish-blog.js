#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import GitHubAPI from './github-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlogPublisher {
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
   * 解析 frontmatter
   * @param {string} content - 文件內容
   * @returns {Object} frontmatter 對象
   */
  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error('無法解析 frontmatter');
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
   * 更新 frontmatter
   * @param {string} content - 原始內容
   * @param {Object} updates - 更新內容
   * @returns {string} 更新後的內容
   */
  updateFrontmatter(content, updates) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      throw new Error('無法解析 frontmatter');
    }

    const frontmatterStr = frontmatterMatch[1];
    let updatedFrontmatter = frontmatterStr;

    // 更新現有字段
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}:.*$`, 'm');
      const newLine = `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
      
      if (regex.test(updatedFrontmatter)) {
        updatedFrontmatter = updatedFrontmatter.replace(regex, newLine);
      } else {
        updatedFrontmatter += `\n${newLine}`;
      }
    });

    return content.replace(frontmatterMatch[0], `---\n${updatedFrontmatter}\n---`);
  }

  /**
   * 查找包含指定 issue 編號的 blog post
   * @param {number} issueNumber - Issue 編號
   * @returns {Promise<string|null>} 文件路徑或 null
   */
  async findBlogByIssue(issueNumber) {
    try {
      const files = await fs.readdir(this.blogDir);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filepath = path.join(this.blogDir, file);
          const content = await fs.readFile(filepath, 'utf8');
          
          try {
            const frontmatter = this.parseFrontmatter(content);
            if (frontmatter.githubIssue == issueNumber) {
              return filepath;
            }
          } catch (error) {
            // 跳過無法解析的文件
            continue;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ 搜索 blog post 失敗:', error.message);
      return null;
    }
  }

  /**
   * 發布 blog post
   * @param {number} issueNumber - Issue 編號
   */
  async publish(issueNumber) {
    const rl = this.createInterface();
    
    try {
      console.log(`🚀 準備發布 Blog Post (Issue #${issueNumber})\n`);
      
      // 查找對應的 blog post
      const blogFile = await this.findBlogByIssue(issueNumber);
      if (!blogFile) {
        console.log(`❌ 找不到對應 Issue #${issueNumber} 的 blog post`);
        return;
      }

      console.log(`📄 找到 blog post: ${blogFile}`);
      
      // 讀取文件內容
      const content = await fs.readFile(blogFile, 'utf8');
      const frontmatter = this.parseFrontmatter(content);
      
      console.log(`📝 當前標題: ${frontmatter.title}`);
      console.log(`📅 當前狀態: ${frontmatter.status || 'draft'}`);
      
      // 確認發布
      const confirm = await this.askQuestion(rl, '\n確認發布此文章？(y/N): ');
      if (confirm.toLowerCase() !== 'y') {
        console.log('❌ 取消發布');
        return;
      }
      
      // 設置發布日期
      const pubDate = await this.askQuestion(rl, '發布日期 (YYYY-MM-DD，留空使用今天): ');
      const publishDate = pubDate || new Date().toISOString().split('T')[0];
      
      // 更新 frontmatter
      const updatedContent = this.updateFrontmatter(content, {
        status: 'published',
        pubDate: publishDate,
      });
      
      // 寫回文件
      await fs.writeFile(blogFile, updatedContent, 'utf8');
      console.log(`✅ 已更新 blog post 狀態為 published`);
      
      // 更新 GitHub issue
      console.log('\n🔗 正在更新 GitHub issue...');
      
      const issue = await this.githubAPI.getIssue(issueNumber);
      const updatedLabels = issue.labels
        .map(label => label.name)
        .filter(name => name !== 'draft')
        .concat(['published']);
      
      await this.githubAPI.updateIssue(issueNumber, {
        labels: updatedLabels,
        body: issue.body + `\n\n---\n**發布時間**: ${publishDate}\n**狀態**: 已發布`,
      });
      
      console.log(`✅ 已更新 Issue #${issueNumber} 狀態`);
      
      console.log('\n🎉 Blog post 發布準備完成！');
      console.log(`📄 文件: ${blogFile}`);
      console.log(`🔗 Issue: https://github.com/${this.githubAPI.owner}/${this.githubAPI.repo}/issues/${issueNumber}`);
      console.log('\n💡 下一步:');
      console.log(`1. 提交更改: git add "${blogFile}"`);
      console.log(`2. 提交信息: git commit -m "feat(blog): publish ${frontmatter.title} - Closes #${issueNumber}"`);
      console.log('3. 推送更改: git push');
      
    } catch (error) {
      console.error('❌ 發布 blog post 失敗:', error.message);
    } finally {
      rl.close();
    }
  }

  /**
   * 主函數
   */
  async main() {
    const issueNumber = process.argv[2];
    
    if (!issueNumber) {
      console.log('❌ 請提供 Issue 編號');
      console.log('用法: npm run blog:publish <issue-number>');
      return;
    }
    
    const num = parseInt(issueNumber);
    if (isNaN(num)) {
      console.log('❌ 無效的 Issue 編號');
      return;
    }
    
    await this.publish(num);
  }
}

// 執行發布流程
const publisher = new BlogPublisher();
publisher.main(); 