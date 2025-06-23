import { ui } from './ui';
import type { ui as uiType } from './ui';

export type Locale = keyof typeof ui;
export type UiKey = keyof typeof ui['zh-CN'];

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return 'en-US';
}

export function useTranslations(lang: Locale) {
  return function t(key: UiKey) {
    return ui[lang][key] || ui['en-US'][key];
  }
} 