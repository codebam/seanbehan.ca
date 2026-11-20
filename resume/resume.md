---
title: "SEAN BEHAN"
subtitle: "Senior Full-Stack Developer · TypeScript & Rust"
location: "Greater Toronto Area"
email: "sean@seanbehan.ca"
website: "https://seanbehan.ca"
linkedin: "sean-behan"
github: "codebam"
abstract: "Full-stack and systems developer shipping production software on Cloudflare Workers and in Rust: a Telegram bot framework with 330 GitHub stars and ~1,500 monthly npm downloads, and a Wayland compositor whose desktop shell is a web page. Open to full-time work — remote, or hybrid in the Greater Toronto Area."
---

# EXPERIENCE

### Independent Developer · Open Source
*2021 – Present*

- Created @codebam/cf-workers-telegram-bot, a TypeScript bot framework for Cloudflare Workers — 330 GitHub stars, 214 forks, ~1,500 npm downloads per month
- Write Rust for Linux userspace across eight public repositories, including Viewport, a Wayland compositor whose entire desktop shell is a web page

### Sysadmin and Moderator · mstdn.ca
*Jan. 2024 – Present*

- Run a Mastodon instance serving 36,000+ users: upgrades, federation troubleshooting and moderation across the Fediverse

### Frontend Web Developer · AssetDash
*Apr. 2021 – Oct. 2021*

- Rebuilt the company site on Next.js, TypeScript and React with a Firebase backend, cutting bounce rate 15% and raising user engagement 20%

### Development Intern · AVROD
*Sep. 2019 – Apr. 2020*

- Built a web store with Django and MySQL

### Assistant Automation Coordinator · Elections Canada
*Oct. 2019*

- Kept polling-station computer systems online through the 2019 federal election alongside a team of 10+

# SELECTED WORK

### seanbehan.ca · Personal Site & Storefront
*[seanbehan.ca](https://seanbehan.ca)*

- Astro and EmDash CMS on a Cloudflare Worker with D1 and R2: server-rendered writing, a Stripe-backed storefront, and two site identities built from one codebase with CI-applied migrations

### Tux Robot · Telegram Bot on Cloudflare Workers
*[github.com/codebam/tux-robot](https://github.com/codebam/tux-robot)*

- AI chat bot on a single Cloudflare Worker: grammY in TypeScript, a Svelte 5 web app, Cloudflare AI with Tavily search and document retrieval; live at t.me/TuxRobot

### Viewport · Wayland Compositor
*[github.com/codebam/viewport](https://github.com/codebam/viewport)*

- Compositor in Rust on Smithay where the whole shell — wallpaper, dock, window frames and titlebars — is a web page, behind five interchangeable engine backends: WPE, WebKitGTK, Chromium, CEF and Servo, with the same shell page under each
- Zero-copy path from engine to screen: DMA-BUF frames, drm_syncobj fences and real vblank pacing, so no pixel is copied through the CPU
- Tiling is a tree of CSS flexboxes, so the browser computes every window rectangle and the shell only measures the result; packaged in a Nix flake that builds WPE WebKit from source

### Matrix Workers · Federated Matrix Homeserver
*[github.com/codebam/matrix-workers](https://github.com/codebam/matrix-workers)*

- A Matrix homeserver running entirely on Cloudflare Workers — Hono, D1, R2 and Durable Objects — taken from a proof of concept that failed the Matrix Federation Tester to verified two-way federation with matrix.org: invites, joins, messages, E2EE key exchange and media, across room versions 1–12
- Made federation itself correct: events signed and reference-hashed under each room version's redaction rules, the federation v4 wire format, room v12 ID derivation (MSC4291, MSC4289), and an HTTP/1.1 client over TCP sockets for peers on port 8448, which the runtime's fetch() cannot reach
- Fixed security gaps along the way — a login flow that issued access tokens without credentials, an unauthenticated federation v2 join path, registration moved behind single-use hashed invite tokens — and kept the inherited 45,000-test suite green; live at codebam.ca

### Pastebin-R2 · Serverless Snippet Service
*[github.com/codebam/pastebin-r2](https://github.com/codebam/pastebin-r2)*

- Snippet service on Cloudflare Workers with Hono and R2: REST API, TTL expiry enforced on read and swept by an hourly cron, syntax-highlighted views; live at paste.codebam.ca

# SKILLS

## LANGUAGES

**Expert:**
- TypeScript & JavaScript
- Rust
- Python
- Nix
- Shell

**Proficient:**
- C
- Lua
- SQL
- Java
- HTML & CSS

## PLATFORMS AND FRAMEWORKS

**Web:**
- React & Next.js
- Svelte 5 & Astro
- Hono
- Web Extension API

**Systems:**
- Wayland & Smithay
- Linux
- Nix & NixOS
- Docker & Podman

**Cloud:**
- Cloudflare Workers & Pages
- Durable Objects & D1
- R2 & KV storage
- Stripe billing

# EDUCATION

### Trent University
*Peterborough, ON* | *2016 – 2023*

- Coursework toward an Honours B.Sc. in Computer Science

# AWARDS

- Overleaf Most Interesting Talk, Trent Mathematics and Statistics Conference 2019
- Project Management Award, Electric City Hacks Hackathon 2016

# LEADERSHIP

### Student Leadership · Trent University
*2016 – 2020*

- President, Computer Science Society; Founder, Trent Innovate; Director, Electric City Hacks

# INTERESTS

- Serverless and edge runtimes
- Compositors and windowing
- Declarative builds with Nix
- Applied AI
