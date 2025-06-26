#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// 載入環境變量
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'ccc333bbb';
const REPO = 'memo';

async function checkGiscusConfig() {
  console.log('🔍 檢查 Giscus 配置...\n');

  if (!GITHUB_TOKEN) {
    console.error('❌ 請設置 GITHUB_TOKEN 環境變量');
    console.log('請在 .env 文件中添加：GITHUB_TOKEN=your_token_here');
    return;
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  try {
    // 1. 檢查倉庫信息
    console.log('1. 檢查倉庫信息...');
    const repoResponse = await octokit.repos.get({
      owner: OWNER,
      repo: REPO,
    });
    
    console.log(`✅ 倉庫名稱: ${repoResponse.data.name}`);
    console.log(`✅ 倉庫 ID: ${repoResponse.data.id}`);
    console.log(`✅ 倉庫描述: ${repoResponse.data.description || '無'}`);
    console.log(`✅ 是否私有: ${repoResponse.data.private ? '是' : '否'}`);
    console.log(`✅ 默認分支: ${repoResponse.data.default_branch}\n`);

    // 2. 檢查 Discussions 是否啟用
    console.log('2. 檢查 Discussions 狀態...');
    try {
      const discussionsResponse = await octokit.repos.get({
        owner: OWNER,
        repo: REPO,
      });
      
      if (discussionsResponse.data.has_discussions) {
        console.log('✅ Discussions 已啟用\n');
        
        // 3. 獲取 Discussions 分類
        console.log('3. 獲取 Discussions 分類...');
        try {
          const categoriesResponse = await octokit.graphql(`
            query {
              repository(owner: "${OWNER}", name: "${REPO}") {
                discussionCategories(first: 10) {
                  nodes {
                    id
                    name
                  }
                }
              }
            }
          `);
          
          const categories = categoriesResponse.repository.discussionCategories.nodes;
          console.log('📋 可用的分類:');
          categories.forEach(category => {
            console.log(`   - ${category.name} (ID: ${category.id})`);
          });
          console.log();
          
          // 4. 生成 Giscus 配置
          console.log('4. 生成 Giscus 配置...');
          console.log('📝 請將以下配置複製到 src/config/site.ts:');
          console.log('```typescript');
          console.log('giscus: {');
          console.log(`  repo: "${OWNER}/${REPO}",`);
          console.log(`  repoId: "${repoResponse.data.id}",`);
          console.log(`  category: "${categories[0]?.name || 'General'}",`);
          console.log(`  categoryId: "${categories[0]?.id || '請手動設置'}",`);
          console.log('  mapping: "pathname",');
          console.log('  theme: "purple_dark",');
          console.log('},');
          console.log('```\n');
          
          // 5. 檢查 Giscus App 安裝狀態
          console.log('5. 檢查 Giscus App 安裝狀態...');
          try {
            const appResponse = await octokit.apps.getRepoInstallation({
              owner: OWNER,
              repo: REPO,
            });
            console.log('✅ Giscus App 已安裝');
            console.log(`   App ID: ${appResponse.data.app_id}`);
          } catch (error) {
            console.log('❌ Giscus App 未安裝或無法訪問');
            console.log('請前往 https://github.com/apps/giscus 安裝 Giscus App');
          }
          
        } catch (error) {
          console.log('❌ 無法獲取 Discussions 分類');
          console.log('錯誤:', error.message);
        }
        
      } else {
        console.log('❌ Discussions 未啟用');
        console.log('請在 GitHub 倉庫設置中啟用 Discussions 功能');
      }
      
    } catch (error) {
      console.log('❌ 無法檢查 Discussions 狀態');
      console.log('錯誤:', error.message);
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message);
    if (error.status === 401) {
      console.log('請檢查 GITHUB_TOKEN 是否正確');
    } else if (error.status === 404) {
      console.log('倉庫不存在或無法訪問');
    }
  }
}

checkGiscusConfig().catch(console.error); 