import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// 只在非生產環境載入 .env 文件
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

class GitHubAPI {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    
    // 從環境變量或 package.json 獲取倉庫信息
    this.owner = process.env.GITHUB_OWNER || 'ccc333bbb';
    this.repo = process.env.GITHUB_REPO || 'capricious-centauri';
  }

  /**
   * 創建新的 GitHub issue
   * @param {string} title - Issue 標題
   * @param {string} body - Issue 內容
   * @param {string[]} labels - 標籤數組
   * @returns {Promise<Object>} 創建的 issue 信息
   */
  async createIssue(title, body, labels = ['blog-post', 'draft']) {
    try {
      const response = await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        labels,
      });
      
      console.log(`✅ 成功創建 Issue #${response.data.number}: ${title}`);
      return response.data;
    } catch (error) {
      console.error('❌ 創建 Issue 失敗:', error.message);
      throw error;
    }
  }

  /**
   * 更新 GitHub issue
   * @param {number} issueNumber - Issue 編號
   * @param {Object} updates - 更新內容
   * @returns {Promise<Object>} 更新後的 issue 信息
   */
  async updateIssue(issueNumber, updates) {
    try {
      const response = await this.octokit.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        ...updates,
      });
      
      console.log(`✅ 成功更新 Issue #${issueNumber}`);
      return response.data;
    } catch (error) {
      console.error(`❌ 更新 Issue #${issueNumber} 失敗:`, error.message);
      throw error;
    }
  }

  /**
   * 關閉 GitHub issue
   * @param {number} issueNumber - Issue 編號
   * @param {string} comment - 關閉時的評論
   * @returns {Promise<Object>} 關閉後的 issue 信息
   */
  async closeIssue(issueNumber, comment = 'Blog post 已發布，自動關閉此 issue') {
    try {
      // 添加關閉評論
      if (comment) {
        await this.octokit.issues.createComment({
          owner: this.owner,
          repo: this.repo,
          issue_number: issueNumber,
          body: comment,
        });
      }

      // 關閉 issue
      const response = await this.octokit.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        state: 'closed',
      });
      
      console.log(`✅ 成功關閉 Issue #${issueNumber}`);
      return response.data;
    } catch (error) {
      console.error(`❌ 關閉 Issue #${issueNumber} 失敗:`, error.message);
      throw error;
    }
  }

  /**
   * 獲取 issue 信息
   * @param {number} issueNumber - Issue 編號
   * @returns {Promise<Object>} Issue 信息
   */
  async getIssue(issueNumber) {
    try {
      const response = await this.octokit.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ 獲取 Issue #${issueNumber} 失敗:`, error.message);
      throw error;
    }
  }

  /**
   * 搜索 blog post 相關的 issues
   * @param {string} query - 搜索查詢
   * @returns {Promise<Array>} 匹配的 issues
   */
  async searchBlogIssues(query = 'label:blog-post') {
    try {
      const response = await this.octokit.search.issuesAndPullRequests({
        q: `${query} is:issue repo:${this.owner}/${this.repo}`,
        sort: 'created',
        order: 'desc',
      });
      return response.data.items;
    } catch (error) {
      console.error('❌ 搜索 Issues 失敗:', error.message);
      throw error;
    }
  }

  /**
   * 獲取 issue 的評論
   * @param {number} issueNumber - Issue 編號
   * @returns {Promise<Array>} 評論列表
   */
  async getIssueComments(issueNumber) {
    try {
      const response = await this.octokit.issues.listComments({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        per_page: 100,
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ 獲取 Issue #${issueNumber} 評論失敗:`, error.message);
      throw error;
    }
  }

  /**
   * 為 issue 添加評論
   * @param {number} issueNumber - Issue 編號
   * @param {string} comment - 評論內容
   * @returns {Promise<Object>} 創建的評論
   */
  async addComment(issueNumber, comment) {
    try {
      const response = await this.octokit.issues.createComment({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        body: comment,
      });
      
      console.log(`✅ 成功為 Issue #${issueNumber} 添加評論`);
      return response.data;
    } catch (error) {
      console.error(`❌ 為 Issue #${issueNumber} 添加評論失敗:`, error.message);
      throw error;
    }
  }

  /**
   * 根據文章標題搜索對應的 issue
   * @param {string} title - 文章標題
   * @returns {Promise<Object|null>} 找到的 issue 或 null
   */
  async findIssueByTitle(title) {
    try {
      const response = await this.octokit.search.issuesAndPullRequests({
        q: `"${title}" is:issue repo:${this.owner}/${this.repo}`,
        sort: 'created',
        order: 'desc',
      });
      return response.data.items.length > 0 ? response.data.items[0] : null;
    } catch (error) {
      console.error('❌ 搜索 Issue 失敗:', error.message);
      throw error;
    }
  }

  /**
   * 為文章創建評論 issue
   * @param {string} title - 文章標題
   * @param {string} url - 文章 URL
   * @param {string} description - 文章描述
   * @returns {Promise<Object>} 創建的 issue
   */
  async createCommentIssue(title, url, description = '') {
    const body = `# ${title}

${description}

---
**文章鏈接**: ${url}

歡迎在下方發表評論和討論！`;
    
    return await this.createIssue(
      `💬 ${title}`,
      body,
      ['comments', 'blog-post']
    );
  }
}

export default GitHubAPI; 