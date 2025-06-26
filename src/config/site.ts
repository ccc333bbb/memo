// Site-wide configuration
export const SITE_CONFIG = {
  // Basic site information
  title: "ccc333bbb - Dark Walker's Memo",
  description: "A multilingual memo website featuring blogs, thoughts, projects, and bookmarks",
  author: "ccc333bbb",
  
  // URLs and deployment
  siteUrl: "https://ccc333bbb.github.io",
  baseUrl: "/memo",
  
  // GitHub integration
  github: {
    owner: "ccc333bbb",
    repo: "memo", // Updated to match the actual repo name
    branch: "main",
  },
  
  // Giscus comments configuration
  giscus: {
    repo: "ccc333bbb/memo",
    repoId: "1000776748",
    category: "Announcements",
    categoryId: "DIC_kwDOO6akLM4Cr_hK",
    mapping: "pathname",
    theme: "purple_dark",
  },
  
  // Supported languages
  languages: {
    en: {
      code: "en",
      name: "English",
      label: "EN",
      dir: "ltr",
    },
    zh: {
      code: "zh",
      name: "简体中文", 
      label: "简中",
      dir: "ltr",
    },
    tw: {
      code: "tw", 
      name: "繁體中文",
      label: "繁中", 
      dir: "ltr",
    },
  },
  
  // Default language
  defaultLanguage: "en",
  
  // Navigation paths
  navigation: {
    home: "/",
    blog: "/blog/",
    thoughts: "/thoughts/",
    projects: "/projects/", 
    bookmarks: "/bookmarks/",
    movieReview: "/movie-review/",
  },
} as const;

// Helper function to get language-specific paths
export function getLocalizedPath(lang: string, path: string): string {
  const basePath = SITE_CONFIG.baseUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${lang}/${cleanPath}`;
}

// Helper function to get absolute URL
export function getAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.siteUrl}${cleanPath}`;
}

// Type definitions
export type Language = keyof typeof SITE_CONFIG.languages;
export type NavigationKey = keyof typeof SITE_CONFIG.navigation;