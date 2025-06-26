import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GITHUB_CONFIG = {
  owner: process.env.GITHUB_OWNER || 'ccc333bbb',
  repo: process.env.GITHUB_REPO || 'memo',
  token: process.env.GITHUB_TOKEN,
};

async function testTokenPermissions() {
  console.log('🔍 測試 GitHub Token 權限...\n');
  
  if (!GITHUB_CONFIG.token) {
    console.error('❌ GITHUB_TOKEN 未設置');
    console.log('請在 .env 文件中設置 GITHUB_TOKEN');
    return;
  }
  
  const octokit = new Octokit({
    auth: GITHUB_CONFIG.token,
  });
  
  try {
    // 測試 1: 基本認證
    console.log('1. 測試基本認證...');
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ 認證成功: ${user.login}\n`);
    
    // 測試 2: 倉庫訪問權限
    console.log('2. 測試倉庫訪問權限...');
    const { data: repo } = await octokit.repos.get({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
    });
    console.log(`✅ 倉庫訪問成功: ${repo.full_name}\n`);
    
    // 測試 3: Discussions 權限
    console.log('3. 測試 Discussions 權限...');
    const { data: discussions } = await octokit.graphql(`
      query {
        repository(owner: "${GITHUB_CONFIG.owner}", name: "${GITHUB_CONFIG.repo}") {
          discussions(first: 1) {
            nodes {
              id
              title
            }
          }
        }
      }
    `);
    console.log(`✅ Discussions 訪問成功\n`);
    
    // 測試 4: 安裝權限
    console.log('4. 測試安裝權限...');
    try {
      const { data: installations } = await octokit.apps.listInstallationsForAuthenticatedUser();
      console.log(`✅ 安裝權限檢查成功，找到 ${installations.length} 個安裝\n`);
    } catch (error) {
      console.log(`⚠️  安裝權限檢查失敗: ${error.message}\n`);
    }
    
    // 測試 5: 創建 Discussion 權限
    console.log('5. 測試創建 Discussion 權限...');
    try {
      const { data: newDiscussion } = await octokit.graphql(`
        mutation {
          createDiscussion(input: {
            repositoryId: "${repo.node_id}",
            categoryId: "DIC_kwDOO6akLM4Cr_hK",
            title: "測試討論",
            body: "這是一個測試討論"
          }) {
            discussion {
              id
              title
            }
          }
        }
      `);
      console.log(`✅ 創建 Discussion 成功: ${newDiscussion.createDiscussion.discussion.title}\n`);
      
      // 清理測試討論
      await octokit.graphql(`
        mutation {
          deleteDiscussion(input: {
            id: "${newDiscussion.createDiscussion.discussion.id}"
          }) {
            deletedDiscussionId
          }
        }
      `);
      console.log('✅ 已清理測試討論\n');
      
    } catch (error) {
      console.log(`❌ 創建 Discussion 失敗: ${error.message}\n`);
    }
    
    console.log('🎉 Token 權限測試完成！');
    
  } catch (error) {
    console.error('❌ Token 權限測試失敗:', error.message);
    console.log('\n🔧 建議解決方案:');
    console.log('1. 檢查 token 是否正確');
    console.log('2. 確認 token 有足夠權限');
    console.log('3. 重新生成 token 並設置正確的 scopes');
  }
}

testTokenPermissions(); 