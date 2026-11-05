# willUnmount

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-willunmount.sabarni.in-0ea5e9)](https://willunmount.sabarni.in)
[![GitHub](https://img.shields.io/badge/github-sabarnix-181717?logo=github)](https://github.com/sabarnix/willUnmount)

Personal technical blog by [Sabarni Das](https://github.com/sabarnix), exploring web performance, React internals, CSS architecture, and frontend engineering.

Live site: [willunmount.sabarni.in](https://willunmount.sabarni.in)

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **UI & Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Content**: [Contentlayer2](https://github.com/timlrx/contentlayer2) with MDX
- **Interactive Demos**: [@codesandbox/sandpack-react](https://sandpack.codesandbox.io/)
- **Code Highlighting**: [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)
- **Math Typesetting**: [KaTeX](https://katex.org/) via `remark-math` and `rehype-katex`
- **Command Palette**: [Kbar](https://github.com/timc1/kbar) local search
- **Analytics**: [Umami](https://umami.is/)
- **Tooling & Linting**: [oxlint](https://oxc.rs/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/)

---

## Project Structure

```text
├── app/                  # Next.js App Router pages and metadata
├── components/           # Reusable UI components (header, footer, theme switcher, search)
├── css/                  # Tailwind CSS configuration and prism styles
├── data/
│   ├── authors/          # Author profiles (default.mdx)
│   ├── blog/             # MDX blog posts
│   ├── headerNavLinks.ts # Navigation menu configuration
│   └── siteMetadata.js   # Global site configuration, social links, analytics
├── layouts/              # Post and listing layouts (PostLayout, PostBanner, ListLayoutWithTags)
├── public/               # Static assets (images, favicons, fonts)
└── scripts/              # Build utilities and postbuild indexing
```

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 22.13`
- **Package Manager**: [pnpm](https://pnpm.io) `>= 11` (enabled via Corepack)

```bash
corepack enable
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

Build the site for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm serve
```

### Linting

Check and fix lint issues:

```bash
pnpm lint
```

Analyze bundle sizes:

```bash
pnpm analyze
```

---

## Writing Posts

Blog posts are stored as `.mdx` files under `data/blog/`. Each post supports Hugo-style frontmatter:

```yaml
---
title: 'Your Article Title'
date: '2026-09-05'
tags: ['react', 'performance', 'frontend']
draft: false
summary: 'Brief overview of the post.'
---
```

Rich MDX features supported out of the box:

- Interactive code sandboxes via Sandpack
- Math expressions with `$` and `$$`
- Code blocks with syntax highlighting and line numbers
- GitHub-style blockquote alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, etc.)

---

## Deployment

The blog is optimized for continuous deployment on [Vercel](https://vercel.com). Any pushes to the `main` branch trigger an automatic build and deployment.

---

## License

[MIT](LICENSE) © [Sabarni Das](https://github.com/sabarnix)
