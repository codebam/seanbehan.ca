# Contributing to Sean Behan's Website

Thanks for your interest in contributing! This document outlines the processes and guidelines for contributing to this project.

## Project Setup

### Prerequisites

- Node.js 18+
- pnpm or npm
- Git

### Getting Started

```bash
# Clone the repository
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca

# Install dependencies
npm install

# Start development server
npm run dev
```

## Build Variants

The site comes in two variants:

- `seanbehan.ca` - Main identity focused on personal accomplishments
- `codebam.ca` - Developer-focused identity emphasizing open source

To build each variant:

```bash
# For seanbehan.ca
PUBLIC_SITE=seanbehan npm run build

# For codebam.ca
PUBLIC_SITE=codebam npm run build
```

## Branching Strategy

We follow a simple branching strategy:

- `master` branch contains the latest stable release
- Feature branches are created for new features or improvements
- Pull requests should be made against the `master` branch

## Code Quality

### Linting and Formatting

The project uses:

- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- SvelteKit's built-in type checking

Before committing, run:

```bash
npm run lint
npm run check
```

### Testing

Tests are written with Vitest and are currently minimal. Contributions should include tests where appropriate.

## Contributing Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linters and tests
6. Submit a pull request

Please ensure your code follows existing style patterns and passes all checks.

## Pre-commit Hooks

The project uses Git hooks installed via `.githooks/` directory which:

- Automatically run linting before commits
- Help maintain consistent code quality
