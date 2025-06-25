// 內容類型定義
export interface ContentFrontmatter {
  title: string;
  description?: string;
  pubDate?: string | Date;
  date?: string | Date;
  tags?: string[];
  category?: string;
  projectStatus?: 'completed' | 'in-progress' | 'archived';
  techStack?: string[];
  sourceUrl?: string;
  demoUrl?: string;
}

export interface ContentEntry {
  url: string;
  frontmatter: ContentFrontmatter;
  rawContent: () => string;
  compiledContent: () => string;
}

// 擴展 import.meta.glob 的返回類型
declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

// 為 import.meta.glob 添加類型支持
declare global {
  interface ImportMeta {
    glob(pattern: string, options?: { eager?: boolean }): Record<string, ContentEntry>;
  }
} 