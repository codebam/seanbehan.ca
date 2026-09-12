---
title: "SEAN BEHAN"
subtitle: "Senior Full-Stack Developer · TypeScript & Rust"
location: "Greater Toronto Area"
email: "sean@seanbehan.ca"
website: "https://seanbehan.ca"
linkedin: "sean-behan"
github: "codebam"
abstract: "Senior full-stack and systems developer, open to full-time work — remote, or hybrid in the Greater Toronto Area. I ship serverless bots and web apps on Cloudflare Workers, write Rust for Wayland compositors, and keep my machines reproducible with Nix."
---

# EXPERIENCE

### Independent Developer · Open Source
*2021 – Present*

- Built and run Codebam Stream, a paid live-streaming service: OBS WHIP ingest, browser WHEP playback and RTMPS relay to five providers
- Runs it on Cloudflare Workers, Durable Objects, D1 and LiveKit, with prepaid Stripe credit and per-customer reconciliation across 18k lines of tested TypeScript
- Wrote @codebam/cf-workers-telegram-bot, a TypeScript bot framework for Cloudflare Workers (214 forks, 120 npm releases), then moved my own bots off it onto grammY
- Write Rust for Linux userspace across eight public repositories, including a Wayland compositor whose desktop shell is a web page; 273 public repositories overall, on NixOS daily

### Frontend Web Developer · AssetDash
*Apr. 2021 – Oct. 2021*

- Rebuilt the company site on Next.js, TypeScript and React with a Firebase backend, cutting bounce rate 15% and raising user engagement 20%

### Assistant Automation Coordinator · Elections Canada
*Oct. 2019*

- Kept polling-station computer systems online through the 2019 federal election alongside a team of 10+

### Development Intern · AVROD
*Sept. 2019 – Apr. 2020*

- Built a web store with Django and MySQL, as a course placement at the company

### IT Student Advisor · Trent University Information Technology
*May 2018 – Apr. 2020*

- Diagnosed and repaired student and faculty machines at the library front desk across Windows and macOS

# SELECTED WORK

### Codebam Stream · Live Streaming Control Plane
*[stream.codebam.ca](https://stream.codebam.ca)*

- Cloudflare-native control plane for multistreaming, with a Durable Object per provider relay owning that relay's lifecycle
- Two channels of prepaid credit — destination-hours and browser viewer-hours — allocated FIFO in D1 and reconciled per customer as usage accrues, with durable refund handling
- Publisher epochs, relay generations and resource-bound capabilities fence every path, so a stale relay can never attach to a replacement broadcast

### Tux Robot · Telegram Bot on Cloudflare Workers
*[github.com/codebam/tux-robot](https://github.com/codebam/tux-robot)*

- AI chat bot built on grammY in TypeScript on a single Cloudflare Worker, with a Svelte 5 web app, Cloudflare AI, Tavily search and document retrieval; live at t.me/TuxRobot

### Viewport · Wayland Compositor
*[github.com/codebam/viewport](https://github.com/codebam/viewport)*

- Compositor in Rust on Smithay where the whole shell — wallpaper, dock, window frames and titlebars — is a web page, behind five interchangeable engine backends: WPE, WebKitGTK, Chromium, CEF and Servo, with the same shell page under each
- Zero-copy path from engine to screen: DMA-BUF frames, drm_syncobj fences and real vblank pacing, so no pixel is copied through the CPU
- Tiling is a tree of CSS flexboxes, so the browser computes every window rectangle and the shell only measures the result; packaged in a Nix flake that builds WPE WebKit from source

### Pastebin-R2 · Serverless Snippet Service
*[github.com/codebam/pastebin-r2](https://github.com/codebam/pastebin-r2)*

- Pastebin on Cloudflare Workers in TypeScript with Hono, storing objects in R2 behind a small REST API — create, update, list, info, delete — with syntax-highlighted and plain-text views
- Pastes carry a TTL in R2 custom metadata, enforced on every read and swept by an hourly cron trigger; web UI, Nix flake for dev and build, live at paste.codebam.ca

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
- WHIP, WHEP & RTMPS

**Systems:**
- Wayland & Smithay
- Linux (12 years)
- Nix & NixOS
- Docker & Podman

**Cloud:**
- Cloudflare Workers & Pages
- Durable Objects & D1
- R2 & KV storage
- LiveKit
- Stripe billing

# EDUCATION

### Trent University
*Peterborough, ON* | *2016 – 2023*

- Coursework toward an Honours B.Sc. in Computer Science

# AWARDS AND CERTIFICATES

- Overleaf Most Interesting Talk, Trent Mathematics and Statistics Conference 2019
- Project Management Award, Electric City Hacks Hackathon 2016
- Ontario Worker Health and Safety Awareness Certificate
- AWS Educate Application Developer Certification

# EXTRA CURRICULAR

### Sysadmin and Moderator · mstdn.ca
*Jan. 2024 – Present*

- Run a Mastodon instance: upgrades, federation troubleshooting and moderation across the Fediverse

### President · Trent Computer Science Society
*Sept. 2019 – May 2020*

- Led the society's speaker series and socials for the CS cohort

### Founder and President · Trent Innovate
*Nov. 2018 – Nov. 2019*

- Founded a campus innovation group and ran its executive team

### Director · Electric City Hacks
*Nov. 2016 – Nov. 2019*

- Went from participant to volunteer to organizer to director of the hackathon over four years

# INTERESTS

- Serverless and edge runtimes
- Compositors and windowing
- Declarative builds with Nix
- Linux kernel development
- Applied AI
