# Sean Behan's Personal Website

This is a personal website for Sean Behan, built with SvelteKit. It serves as both a portfolio and technical blog.

## Project Structure

The project uses dual-domain variants:

- `seanbehan.ca` - Main identity focused on personal accomplishments
- `codebam.ca` - Developer-focused identity emphasizing open source contributions

Both domains share:

- All posts and content
- Common infrastructure and build process
- Same underlying codebase

### Site Variants Configuration

The two websites are built from the same codebase using environment variables:

```bash
# To build the seanbehan.ca variant
PUBLIC_SITE=seanbehan npm run build

# To build the codebam.ca variant
PUBLIC_SITE=codebam npm run build
```

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone repo and install dependencies
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca
npm install
```

### Development Server

```bash
# Start development server
npm run dev

# Build for development with seanbehan variant
PUBLIC_SITE=seanbehan npm run build

# Build for development with codebam variant
PUBLIC_SITE=codebam npm run build
```

## Build Process

- Built using SvelteKit (Svelte 5) and TypeScript
- Deployed to Cloudflare Pages
- Uses Tailwind CSS for styling with a dark/light theme system
- Implements progressive enhancement techniques

## Assets Optimization

- Profile image optimized in WebP format (13.7KB), with a 112px `avatar.webp` (1.4KB) for the hero byline
- All images follow size constraints and are optimized for web
- Fonts are self-hosted from `static/fonts`, latin-only and axis-trimmed, and preloaded from `app.html`. Rebuild them with `tools/fonts/build-fonts.sh` after upgrading either Fontsource package — see `tools/fonts/README.md`

## Deployment

For deployment, use the standard build process:

```bash
# Build seanbehan.ca variant
PUBLIC_SITE=seanbehan npm run build

# Build codebam.ca variant
PUBLIC_SITE=codebam npm run build
```

The repository includes a `build:codebam` script in package.json that handles building the codebam variant with appropriate settings.

HTML is served with `s-maxage` so Cloudflare can hold it at the edge, but that only takes effect once a Cache Rule marks HTML cacheable — a zone setting, not a repo one. `docs/edge-caching.md` has the rule and the deploy-time purge it requires.
This project uses the `.githooks` directory to automatically set up pre-commit hooks during `npm install`, which will trigger linters and checks before each commit.
