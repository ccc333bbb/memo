# Memo - Personal Knowledge Hub

A multilingual memo website built with Astro, featuring an elegant ink-style design. This platform serves as a personal knowledge hub for blogs, thoughts, projects, and bookmarks.

## 🌐 線上訪問

- **GitHub Pages：** https://ccc333bbb.github.io/memo/
- **本地開發：** http://localhost:4321/

## 🎨 Features

- **Multilingual Support**: English, Traditional Chinese, Simplified Chinese
- **Ink-Style Design**: Elegant gradients and visual effects
- **Responsive Layout**: Perfect adaptation for desktop and mobile devices
- **Content Management**: GitHub Issues integration for streamlined workflow
- **Current Sections**: Blog posts with Markdown support
- **Planned Sections**: Thoughts, Projects, Bookmarks (coming soon)
- **Auto Deployment**: GitHub Actions for automated build and deployment

## 📁 Project Structure

```text
memo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment config
├── public/
│   ├── avatar.jpg              # Profile avatar
│   └── favicon.svg             # Website icon
├── src/
│   ├── assets/                 # Static assets
│   ├── components/             # Reusable components
│   ├── i18n/                   # Internationalization config
│   ├── layouts/                # Page layouts
│   │   └── Layout.astro        # Main layout
│   └── pages/                  # Page files
│       ├── index.astro         # Landing page
│       ├── en/                 # English pages
│       │   └── blog/           # English blog posts
│       ├── tw/                 # Traditional Chinese pages
│       │   └── blog/           # Traditional Chinese blog posts
│       └── zh/                 # Simplified Chinese pages
│           └── blog/           # Simplified Chinese blog posts
├── scripts/                    # Content management scripts
│   ├── create-blog.js          # Create new blog posts
│   ├── github-api.js           # GitHub API utilities
│   ├── list-blogs.js           # List all blog posts
│   └── publish-blog.js         # Publish blog posts
├── docs/                       # Documentation
│   └── blog-workflow.md        # Blog workflow guide
├── CLAUDE.md                   # Claude Code documentation
├── astro.config.mjs            # Astro configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build/) - Modern static site generator
- **Languages:** TypeScript, Markdown
- **Styling:** CSS3, Responsive design
- **Deployment:** GitHub Pages + GitHub Actions
- **Content Management:** GitHub Issues integration
- **Internationalization:** Built-in Astro i18n support
- **Fonts:** Google Fonts (Noto Serif SC, Noto Sans)

## 🚀 Development Commands

### Basic Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start local development server (http://localhost:4321) |
| `npm run build` | Build production version to `./dist/` directory |
| `npm run preview` | Preview production build locally |

### Content Management

| Command | Description |
|---------|-------------|
| `npm run blog:create` | Create new blog post with GitHub issue |
| `npm run blog:list` | List all blog posts and their status |
| `npm run blog:publish <issue-number>` | Publish blog post and update status |

### Development Workflow

| Command | Description |
|---------|-------------|
| `git add .` | Stage changes |
| `git commit -m "description"` | Commit changes locally |
| `git push origin main` | Push to remote repository, triggers auto-deployment |

## 📝 Content Creation Workflow

### Creating Blog Posts

1. **Create new post with GitHub issue integration:**
   ```bash
   npm run blog:create
   ```
   This will:
   - Prompt for title, description, and language
   - Create a new GitHub issue as draft
   - Generate markdown file in appropriate language directory

2. **Write your content:**
   - Edit the generated `.md` file in `src/pages/{lang}/blog/`
   - Use standard markdown format with frontmatter:

   ```markdown
   ---
   title: Your Post Title
   pubDate: 2024-06-24
   description: Post description
   author: ccc333bbb
   language: en # or tw, zh
   status: draft
   issue: 123 # GitHub issue number
   ---

   # Your Content Here

   Write your blog post content in markdown...
   ```

3. **Preview locally:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:4321/{lang}/blog/your-post-slug`

4. **Publish when ready:**
   ```bash
   npm run blog:publish <issue-number>
   ```

## 🔧 Configuration

### Environment Setup
Create `.env` file from template:
```bash
cp env.example .env
```

Required environment variables:
- `GITHUB_TOKEN`: GitHub Personal Access Token for Issues integration
- `GITHUB_OWNER`: GitHub username (default: ccc333bbb)
- `GITHUB_REPO`: Repository name (default: memo)

### Customization
- **Homepage**: Edit `src/components/` and `src/layouts/Layout.astro`
- **Astro Config**: Modify `astro.config.mjs` for build settings
- **Deployment**: Edit `.github/workflows/deploy.yml` for CI/CD

## 🚧 Planned Features

### Coming Soon
- **💭 Thoughts**: Short-form content and micro-blogging
- **🚀 Projects**: Portfolio showcase with project details
- **🔖 Bookmarks**: Curated link collections with categories

### Future Enhancements
- Advanced search and filtering
- Tag-based content organization
- Import/export functionality for bookmarks
- Enhanced GitHub Issues integration for all content types

## 🔧 Troubleshooting

### Development Issues
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm run dev
```

### Deployment Issues
- Check GitHub Actions logs
- Verify `base` path in `astro.config.mjs`
- Ensure GitHub Pages is enabled with GitHub Actions source
- Confirm `GITHUB_TOKEN` has proper permissions

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📚 Documentation

For detailed development information and workflows, see:
- `CLAUDE.md` - Claude Code documentation and project roadmap
- `docs/blog-workflow.md` - Blog creation and management guide

---

**Developer:** ccc333bbb  
**Project:** Personal Knowledge Hub  
**Website:** https://ccc333bbb.github.io/memo/
