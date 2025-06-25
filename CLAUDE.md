# Claude Code Documentation - Memo Website

## Project Overview
A multilingual memo website built with Astro framework, featuring a Chinese ink-style design and GitHub Issues integration for content management.

## Current Architecture
- **Framework**: Astro with TypeScript
- **Languages Supported**: English (en), Traditional Chinese (tw), Simplified Chinese (zh)
- **Content Types**: Blog posts (currently implemented)
- **Deployment**: GitHub Pages with GitHub Actions
- **Content Management**: GitHub Issues integration for blog workflow

## Changelog

### Recent Changes (from git history)
- `bd481da` - Complete redesign of multilingual memo website
- `9e0e7c1` - Fixed static asset path differences between dev and production environments
- `e666216` - Fixed template string issues in Astro frontmatter
- `ab7da7e` - Fixed language switcher URL and added language selection page
- `1ebb69e` - Fixed build issues and deprecation warnings

## Current Structure
```
src/
├── pages/
│   ├── en/blog/          # English blog posts
│   ├── tw/blog/          # Traditional Chinese blog posts
│   ├── zh/blog/          # Simplified Chinese blog posts
│   └── index.astro       # Main landing page
├── components/           # Reusable components
├── layouts/             # Page layouts
├── i18n/               # Internationalization config
└── assets/             # Static assets

scripts/                # Blog management scripts
├── create-blog.js      # Create new blog posts
├── publish-blog.js     # Publish blog posts
├── list-blogs.js       # List all blog posts
└── github-api.js       # GitHub API utilities
```

## Roadmap - Planned Content Types

### 1. Thoughts Section 💭
- **Purpose**: Short-form thoughts, observations, micro-blogging
- **Structure**: 
  - `src/pages/{lang}/thoughts/`
  - Similar to blog but optimized for brevity
  - Timeline-based display
  - Tag-based categorization

### 2. Projects Section 🚀
- **Purpose**: Showcase personal projects and work
- **Structure**:
  - `src/pages/{lang}/projects/`
  - Project cards with thumbnails
  - Tech stack tags
  - Links to GitHub/live demos
  - Status indicators (in-progress, completed, archived)

### 3. Bookmarks Section 🔖
- **Purpose**: Curated collection of useful links and resources
- **Structure**:
  - `src/pages/{lang}/bookmarks/`
  - Categorized collections
  - Description and tags for each bookmark
  - Import/export functionality
  - Search and filtering capabilities

## Technical Considerations

### Content Management Strategy
- Extend GitHub Issues integration to support all content types
- Create separate issue labels for thoughts, projects, bookmarks
- Maintain consistent frontmatter across content types

### Navigation Structure
```
Home
├── Blog
├── Thoughts (NEW)
├── Projects (NEW)
└── Bookmarks (NEW)
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run blog:create` - Create new blog post
- `npm run blog:list` - List all blog posts
- `npm run blog:publish <issue-number>` - Publish blog post

### Environment Setup
- GitHub Personal Access Token required for Issues integration
- Configuration in `.env` file (see `env.example`)

## Next Steps
1. Design and implement Thoughts section
2. Create Projects showcase with portfolio layout
3. Build Bookmarks collection system
4. Extend GitHub Issues workflow for new content types
5. Update navigation and homepage to include new sections

## Notes
- Maintain multilingual support across all new sections
- Keep consistent with existing ink-style design theme
- Ensure responsive design for all new components
- Consider SEO optimization for different content types