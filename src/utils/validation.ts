// Input validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate blog title
 */
export function validateTitle(title: string): ValidationResult {
  const errors: string[] = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title cannot be empty');
  }
  
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (title && title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  // Check for invalid characters in filename
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(title)) {
    errors.push('Title contains invalid characters for filename');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate blog description
 */
export function validateDescription(description: string): ValidationResult {
  const errors: string[] = [];
  
  if (!description || description.trim().length === 0) {
    errors.push('Description cannot be empty');
  }
  
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (description && description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate author name
 */
export function validateAuthor(author: string): ValidationResult {
  const errors: string[] = [];
  
  if (!author || author.trim().length === 0) {
    errors.push('Author cannot be empty');
  }
  
  if (author && author.length > 50) {
    errors.push('Author name must be less than 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate tags
 */
export function validateTags(tagsString: string): ValidationResult {
  const errors: string[] = [];
  
  if (tagsString) {
    const tags = tagsString.split(',').map(tag => tag.trim());
    
    if (tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }
    
    for (const tag of tags) {
      if (tag.length > 20) {
        errors.push(`Tag "${tag}" is too long (max 20 characters)`);
      }
      
      if (tag.length < 2) {
        errors.push(`Tag "${tag}" is too short (min 2 characters)`);
      }
    }
    
    // Check for duplicate tags
    const uniqueTags = new Set(tags);
    if (uniqueTags.size !== tags.length) {
      errors.push('Duplicate tags are not allowed');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate language code
 */
export function validateLanguage(lang: string): ValidationResult {
  const errors: string[] = [];
  const validLanguages = ['en', 'zh', 'tw'];
  
  if (!validLanguages.includes(lang)) {
    errors.push(`Invalid language code. Must be one of: ${validLanguages.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate safe filename from title
 */
export function generateSafeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .trim();
}

/**
 * Validate filename
 */
export function validateFilename(filename: string): ValidationResult {
  const errors: string[] = [];
  
  if (!filename || filename.trim().length === 0) {
    errors.push('Filename cannot be empty');
  }
  
  if (filename && !filename.endsWith('.md')) {
    errors.push('Filename must end with .md');
  }
  
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(filename)) {
    errors.push('Filename contains invalid characters');
  }
  
  if (filename.length > 100) {
    errors.push('Filename is too long (max 100 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}