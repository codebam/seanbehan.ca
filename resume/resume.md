---
title: "SEAN BEHAN"
subtitle: "Senior Full-Stack & Systems Engineer · TypeScript & Rust"
location: "Greater Toronto Area"
email: "sean@seanbehan.ca"
website: "https://seanbehan.ca"
linkedin: "sean-behan"
github: "codebam"
abstract: "Senior full-stack and systems engineer shipping production software in TypeScript and Rust — from Cloudflare Workers edge services (a federated Matrix homeserver and a 330-star Telegram bot framework with ~1,500 monthly npm downloads) to a Rust Wayland compositor with a custom Vulkan renderer. Open to full-time Senior Full-Stack or Systems roles — remote, or GTA hybrid."
---

# EXPERIENCE

### Independent Developer · Open Source
*2021 – Present*

- Architected @codebam/cf-workers-telegram-bot, a zero-dependency TypeScript Cloudflare Workers framework (330 stars, 214 forks, 120 npm releases, ~1,500 monthly downloads)
- Ship distributed TypeScript services on Cloudflare Workers, Durable Objects, Workflows, D1, and R2 — including Matrix Workers (two-way matrix.org federation, 45,000-test suite)
- Build Linux userspace systems in Rust on NixOS across 8+ public repos, including Viewport (Wayland compositor, 6 browser engines) and viewport-vulkan (standalone Vulkan renderer)

### Sysadmin and Moderator · mstdn.ca
*Jan. 2024 – Present*

- Operate a Mastodon instance serving 36,000+ users: upgrades, federation troubleshooting, and moderation across the Fediverse

### Frontend Web Developer · AssetDash
*Apr. 2021 – Oct. 2021*

- Rebuilt the company site on Next.js, TypeScript, and React with Firebase, cutting bounce rate 15% and raising engagement 20%

### Development Intern · AVROD
*Sep. 2019 – Apr. 2020*

- Built a web store with Django and MySQL

### Assistant Automation Coordinator · Elections Canada
*Oct. 2019*

- Kept polling-station computer systems online through the 2019 federal election alongside a team of 10+

### IT Student Advisor · Trent University IT
*May 2018 – Apr. 2020*

- Diagnosed and repaired student and faculty machines across Windows and macOS

# SELECTED WORK

### Viewport & viewport-vulkan · Wayland Compositor & Vulkan Renderer
*[github.com/codebam/viewport](https://github.com/codebam/viewport)*

- Rust/Smithay Wayland compositor whose desktop shell is a web page across six interchangeable backends (chromium, webkitgtk, wpe, servoshell, cef, servo), with CSS flexbox tiling and a Nix flake building WPE WebKit from source
- Authored [viewport-vulkan](https://github.com/codebam/viewport-vulkan), a standalone Vulkan renderer for Smithay: zero-copy DMA-BUF, drm_syncobj fences, vblank pacing, HDR/color management (wp-color-management-v1, wp-color-representation-v1, ICC LUTs), real-time background blur, and cross-GPU shadow buffers
- Built RemoteDesktop, InputCapture, and Clipboard portals (libei with per-session consent), plus an in-tree lock screen, live settings panel, and screen magnifier

### Matrix Workers · Federated Matrix Homeserver
*[github.com/codebam/matrix-workers](https://github.com/codebam/matrix-workers)*

- Matrix homeserver on Cloudflare Workers (Hono, D1, R2, Durable Objects, Workflows) taken from a failing PoC to verified two-way matrix.org federation (invites, joins, backfill, E2EE, media) across room versions 1–12; live at codebam.ca
- Implemented Matrix v1.19 + v1.20 work (delayed/sticky events, header-only Bearer auth), Sliding Sync (MSC3575/MSC4186), room v12 IDs (MSC4291/MSC4289), per-version redaction/signing, and an HTTP/1.1 TLS client over cloudflare:sockets for port-8448 peers
- Hardened auth and federation (removed credential-free login, closed unauthenticated v2 join, gated registration behind single-use hashed tokens) while keeping the 45,000-test suite green

### seanbehan.ca · Personal Site & Storefront
*[seanbehan.ca](https://seanbehan.ca)*

- Astro and EmDash CMS on Cloudflare Workers with D1 and R2: server-rendered writing, Stripe storefront, and two site identities from one codebase with CI migrations

### Tux Robot · Telegram Bot on Cloudflare Workers
*[github.com/codebam/tux-robot](https://github.com/codebam/tux-robot)*

- AI Telegram bot on one Cloudflare Worker (grammY, TypeScript, Svelte 5, Cloudflare AI, Tavily search and document retrieval); live at t.me/TuxRobot

### Pastebin-R2 · Serverless Snippet Service
*[github.com/codebam/pastebin-r2](https://github.com/codebam/pastebin-r2)*

- Hono + R2 snippet service with REST API, read-enforced + hourly-cron TTL expiry, and syntax-highlighted views; live at paste.codebam.ca

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
- Wayland, Smithay & Vulkan
- Linux
- Nix & NixOS
- Docker & Podman

**Cloud:**
- Cloudflare Workers & Pages
- Durable Objects, Workflows & D1
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
