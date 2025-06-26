// Frontmatter parsing utilities

export interface BlogFrontmatter {
  title: string;
  description?: string;
  pubDate?: string;
  author?: string;
  status?: 'draft' | 'published';
  githubIssue?: number;
  tags?: string[];
  lang?: string;
  layout?: string;
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): BlogFrontmatter | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const frontmatterStr = frontmatterMatch[1];
  const frontmatter: Record<string, any> = {};

  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      try {
        // Try to parse JSON values (arrays, booleans, numbers)
        frontmatter[key.trim()] = JSON.parse(value);
      } catch {
        // If not JSON, use as string (remove quotes if present)
        const cleanValue = value.replace(/^["']|["']$/g, '');
        frontmatter[key.trim()] = cleanValue;
      }
    }
  });

  return frontmatter as BlogFrontmatter;
}

/**
 * Generate frontmatter string from data
 */
export function generateFrontmatter(data: BlogFrontmatter): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `---
layout: ../../../layouts/BlogLayout.astro
title: ${data.title}
pubDate: ${data.pubDate || today}
description: ${data.description || ''}
author: ${data.author || 'ccc333bbb'}
language: ${data.lang || 'en'}
status: ${data.status || 'draft'}
githubIssue: ${data.githubIssue || ''}
tags: ${data.tags ? JSON.stringify(data.tags) : '[]'}
---

# ${data.title}

${data.description || ''}

<!-- 在此處開始撰寫您的文章內容 -->
`;
}

/**
 * Validate frontmatter data
 */
export function validateFrontmatter(data: Partial<BlogFrontmatter>): string[] {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (data.status && !['draft', 'published'].includes(data.status)) {
    errors.push('Status must be either "draft" or "published"');
  }
  
  if (data.lang && !['en', 'zh', 'tw'].includes(data.lang)) {
    errors.push('Language must be one of: en, zh, tw');
  }
  
  return errors;
}