// Environment variable utilities with proper validation

/**
 * Get environment variable with validation
 */
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  
  return value;
}

/**
 * Get optional environment variable
 */
export function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

/**
 * GitHub configuration from environment
 */
export const GITHUB_CONFIG = {
  token: getOptionalEnvVar('GITHUB_TOKEN'),
  owner: getOptionalEnvVar('GITHUB_OWNER', 'ccc333bbb'),
  repo: getOptionalEnvVar('GITHUB_REPO', 'memo'),
} as const;

/**
 * Validate GitHub configuration
 */
export function validateGitHubConfig(): void {
  if (!GITHUB_CONFIG.token && !isProduction()) {
    console.warn('⚠️  GITHUB_TOKEN not set. GitHub API features will not work.');
  }
  
  if (!GITHUB_CONFIG.owner || !GITHUB_CONFIG.repo) {
    throw new Error('GitHub owner and repo must be configured');
  }
}