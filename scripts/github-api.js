import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// 只在非生產環境載入 .env 文件
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Configuration constants
const GITHUB_CONFIG = {
  owner: process.env.GITHUB_OWNER || 'ccc333bbb',
  repo: process.env.GITHUB_REPO || 'memo',
  token: process.env.GITHUB_TOKEN,
};

class GitHubAPI {
  constructor() {
    // Validate configuration
    if (!GITHUB_CONFIG.token && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  GITHUB_TOKEN not set. GitHub API features may not work.');
    }
    
    this.octokit = new Octokit({
      auth: GITHUB_CONFIG.token,
    });
    
    this.owner = GITHUB_CONFIG.owner;
    this.repo = GITHUB_CONFIG.repo;
  }

  /**
   * 創建新的 GitHub issue
   * @param {string} title - Issue 標題
   * @param {string} body - Issue 內容
   * @param {string[]} labels - 標籤數組
   * @returns {Promise<Object>} 創建的 issue 信息
   */
  async createIssue(title, body, labels = ['blog-post', 'draft']) {
    // Validate inputs
    if (!title || title.trim().length === 0) {
      throw new Error('Issue title cannot be empty');
    }
    
    if (!body || body.trim().length === 0) {
      throw new Error('Issue body cannot be empty');
    }
    
    if (!GITHUB_CONFIG.token) {
      throw new Error('GitHub token is required to create issues');
    }

    try {
      const response = await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: title.trim(),
        body: body.trim(),
        labels,
      });
      
      console.log(`✅ 成功創建 Issue #${response.data.number}: ${title}`);
      return response.data;
    } catch (error) {
      if (error.status === 401) {
        throw new Error('❌ GitHub token 無效或已過期');
      } else if (error.status === 403) {
        throw new Error('❌ 沒有權限創建 Issue，請檢查 token 權限');
      } else if (error.status === 404) {
        throw new Error(`❌ 倉庫 ${this.owner}/${this.repo} 不存在或無法訪問`);
      } else if (error.status === 422) {
        throw new Error('❌ Issue 數據格式錯誤');
      } else {
        console.error('❌ 創建 Issue 失敗:', error.message);
        throw new Error(`創建 Issue 失敗: ${error.message}`);
      }
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