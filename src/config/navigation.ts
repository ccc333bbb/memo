import { SITE_CONFIG, type Language } from './site';

// Navigation labels for each language
export const NAVIGATION_LABELS = {
  en: {
    home: 'Home',
    blog: 'Blog', 
    thoughts: 'Thoughts',
    projects: 'Projects',
    bookmarks: 'Bookmarks',
    movieReview: 'Movie Reviews',
  },
  zh: {
    home: '首页',
    blog: '博客',
    thoughts: '想法', 
    projects: '项目',
    bookmarks: '书签',
    movieReview: '观影心得',
  },
  tw: {
    home: '首頁',
    blog: '部落格',
    thoughts: '想法',
    projects: '專案', 
    bookmarks: '書籤',
    movieReview: '觀影心得',
  },
} as const;

// Generate navigation configuration for a specific language
export function getNavigationConfig(lang: Language) {
  const labels = NAVIGATION_LABELS[lang];
  const basePath = `${SITE_CONFIG.baseUrl}/${lang}`;
  
  return {
    home: { 
      label: labels.home, 
      path: `${basePath}/` 
    },
    blog: { 
      label: labels.blog, 
      path: `${basePath}/blog/` 
    },
    thoughts: { 
      label: labels.thoughts, 
      path: `${basePath}/thoughts/` 
    },
    projects: { 
      label: labels.projects, 
      path: `${basePath}/projects/` 
    },
    bookmarks: { 
      label: labels.bookmarks, 
      path: `${basePath}/bookmarks/` 
    },
    movieReview: { 
      label: labels.movieReview, 
      path: `${basePath}/movie-review/` 
    },
  };
}

// Generate language switcher configuration
export function getLanguageSwitcherConfig(currentLang: Language) {
  const otherLanguages = Object.keys(SITE_CONFIG.languages)
    .filter(lang => lang !== currentLang) as Language[];
    
  return otherLanguages.map(lang => ({
    code: lang,
    label: SITE_CONFIG.languages[lang].label,
    name: SITE_CONFIG.languages[lang].name,
  }));
}

// Helper function to check if a path is active
export function isActivePath(currentPath: string, targetPath: string): boolean {
  // Handle root path specially
  if (targetPath.endsWith('/') && currentPath === targetPath) {
    return true;
  }
  
  // For non-root paths, check if current path starts with target path
  if (!targetPath.endsWith('/') && currentPath.startsWith(targetPath)) {
    return true;
  }
  
  return false;
}

// Helper function to get language-switched path
export function getLanguageSwitchPath(currentPath: string, currentLang: Language, targetLang: Language): string {
  const basePath = SITE_CONFIG.baseUrl;
  const currentLangPath = `${basePath}/${currentLang}/`;
  const targetLangPath = `${basePath}/${targetLang}/`;
  
  // If we're on the home page of current language
  if (currentPath === currentLangPath) {
    return targetLangPath;
  }
  
  // Replace the language part of the path
  if (currentPath.startsWith(currentLangPath)) {
    const remainingPath = currentPath.slice(currentLangPath.length);
    return `${targetLangPath}${remainingPath}`;
  }
  
  // Fallback to target language home
  return targetLangPath;
}