# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefly is a feature-rich static blog theme built on **Astro 7** with **Svelte 5** for interactive components. It's a fork of [Fuwari](https://github.com/saicaca/fuwari) extended with extensive features. Primary language is Chinese (Simplified) with i18n for zh_CN, en, zh_TW, ja, ru.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build (icons → LQIPs → Astro build → font subsetting → Pagefind indexing) |
| `pnpm preview` | Preview production build |
| `pnpm check` | `astro check` for type/error checking |
| `pnpm type-check` | `tsc --noEmit --isolatedDeclarations` |
| `pnpm lint` | Biome lint + auto-fix |
| `pnpm format` | Biome format |
| `pnpm new-post <filename>` | Scaffold a new blog post |
| `pnpm icons` | Regenerate `src/constants/icons.json` |
| `pnpm lqips` | Regenerate `src/constants/lqips.json` |

Package manager is **pnpm** (enforced). Node.js >= 22 required.

### Additional Scripts

- `scripts/quarantine-bad-posts.mjs` — move broken/draft posts out of `src/content/posts/`

## Architecture

### Astro + Svelte Hybrid

- `.astro` components for static content and layouts
- `.svelte` components for interactive UI (search, settings, pagination, archive) — mounted with `client:load` or `client:visible`
- **Svelte 5 runes** (`$state`, `$derived`, `$effect`, `$props`) — the project uses Svelte 5's runes API, not the legacy `export let` / `$:` syntax
- Swup.js handles SPA-like page transitions with multiple container targets

### Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin — CSS-based configuration, not `tailwind.config.js`
- `@tailwindcss/typography` for prose styling

### Configuration-Driven

All features are toggled/configured via TypeScript files in `src/config/`, exported through the barrel at `src/config/index.ts`. Type definitions live in `src/types/` with per-config `.ts` files, barrel-exported via `src/types/config.ts`.

Key configs include: `siteConfig.ts` (core settings, theme, pagination, special page toggles), `sidebarConfig.ts` (left/right/both, widget ordering), `commentConfig.ts`, `analyticsConfig.ts`, `fontConfig.ts`, `navBarConfig.ts`, `friendsConfig.ts`, `galleryConfig.ts`, `sponsorConfig.ts`, `musicConfig.ts`, `pioConfig.ts` (Live2D/Spine), etc. See `src/config/README.md` for the full list.

Note: `src/config/FooterConfig.html` is an HTML template (not TS), used for footer customization (e.g., ICP备案号).

### Layout System

- `Layout.astro` — base HTML shell (head, body, theme init, analytics, Swup hooks)
- `MainGridLayout.astro` — full page grid with sidebar(s), navbar, wallpaper, footer

### Content Collections

Defined in `src/content.config.ts`:
- `posts` — blog posts (`.md`/`.mdx`) in `src/content/posts/` with frontmatter: title, published, tags, category, draft, pinned, password, comment, etc.
- `spec` — special pages (about, guestbook) in `src/content/spec/`

Notable post features:
- **Encrypted posts**: password-protected via `src/utils/crypto-utils.ts` (Pako + Base64)
- Post sorting/grouping logic in `src/utils/content-utils.ts`

### Special Pages

Astro file-based routes in `src/pages/`: blog listing (`[...page].astro`), post detail (`posts/[...slug].astro`), archive, tags, categories, search, friends, guestbook, about, sponsor, gallery, bangumi, anime, neodb, rss, 404. Each can be toggled on/off in `siteConfig.ts` → `pages`.

### Key Directories

- `src/components/` — organized by domain: `analytics/`, `comment/`, `common/`, `controls/`, `features/`, `layout/`, `misc/`, `pages/`, `widget/`
- `src/plugins/` — 15 custom remark/rehype plugins (Mermaid, PlantUML, KaTeX, GitHub cards, reading time, etc.)
- `src/i18n/` — translation keys in `i18nKey.ts`, language files in `languages/*.ts`, lookup via `translation.ts`
  - **Fallback chain**: requested language → `zh_CN` (Chinese fallback) → `en` (ultimate default). If a key is empty in the current language, it falls back to Chinese before English.
- `src/types/` — TypeScript type definitions for all config modules, barrel-exported via `config.ts`
- `src/utils/` — content sorting, crypto (encrypted posts), date formatting, image processing/LQIP, TOC generation
- `src/pages/` — Astro file-based routing
- `scripts/` — build-time utilities (`generate-icons.js`, `generate-lqips.ts`, `new-post.js`)

### Path Aliases (tsconfig.json)

`@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@i18n/*`, `@layouts/*` → `./src/<dir>/*`; `@/*` → `./src/*`

## Code Style

- **Biome** enforces: tab indentation, double quotes, recommended lint rules
- Relaxed rules for `.svelte`/`.astro` files (useConst off, noUnusedVariables off)
- Commit convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.)

## Build Pipeline

Multi-step: `scripts/generate-icons.js` → `scripts/generate-lqips.ts` → `astro build` → `scripts/subset-fonts.ts` → `pagefind --site dist`

The Astro config lives at `astro.config.mjs` (not `.ts`).

Icons/LQIP data are generated into `src/constants/` and committed. Regenerate with `pnpm icons` or `pnpm lqips`. Font subsetting runs automatically during `pnpm build` (post-build step) for local fonts marked `subset: true`.

## CI/CD

GitHub Actions in `.github/workflows/`:
- `build.yml` — build check on PR/push to master
- `deploy.yml` — deployment workflow
- `biome.yml` — Biome lint check

## Deployment

- **Vercel** (default, `vercel.json`)
- **Cloudflare Workers** (`wrangler.jsonc`, set `CF_WORKERS` env var to use the Cloudflare adapter)
- Static output to `dist/`

