import GitHubAPI from './github-api.js';

async function testCommentsSystem() {
  console.log('🧪 測試 GitHub Issues 評論系統...\n');
  
  const githubAPI = new GitHubAPI();
  
  try {
    // 測試 1: 檢查 GitHub API 連接
    console.log('1. 測試 GitHub API 連接...');
    const issues = await githubAPI.searchBlogIssues('label:comments');
    console.log(`✅ 連接成功，找到 ${issues.length} 個評論 issues\n`);
    
    // 測試 2: 創建測試評論 issue
    console.log('2. 測試創建評論 issue...');
    const testIssue = await githubAPI.createCommentIssue(
      '測試文章',
      'https://example.com/test',
      '這是一個測試文章'
    );
    console.log(`✅ 成功創建測試 issue #${testIssue.number}\n`);
    
    // 測試 3: 獲取評論
    console.log('3. 測試獲取評論...');
    const comments = await githubAPI.getIssueComments(testIssue.number);
    console.log(`✅ 成功獲取 ${comments.length} 條評論\n`);
    
    // 測試 4: 添加測試評論
    console.log('4. 測試添加評論...');
    const comment = await githubAPI.addComment(
      testIssue.number,
      '這是一條測試評論！\n\n- 支持 Markdown 格式\n- 自動轉換為 HTML'
    );
    console.log(`✅ 成功添加評論\n`);
    
    // 測試 5: 關閉測試 issue
    console.log('5. 清理測試 issue...');
    await githubAPI.closeIssue(testIssue.number, '測試完成，自動關閉');
    console.log(`✅ 成功關閉測試 issue #${testIssue.number}\n`);
    
    console.log('🎉 所有測試通過！評論系統工作正常。');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error('請檢查以下配置：');
    console.error('1. GITHUB_TOKEN 是否正確設置');
    console.error('2. GITHUB_OWNER 和 GITHUB_REPO 是否正確');
    console.error('3. GitHub Token 是否有足夠權限');
  }
}

testCommentsSystem(); 