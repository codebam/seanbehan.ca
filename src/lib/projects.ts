import viewportMockup from '../assets/projects/project-viewport.webp';
import matrixMockup from '../assets/projects/project-matrix.webp';
import telegramMockup from '../assets/projects/project-telegram-sdk.webp';
import tuxMockup from '../assets/projects/project-tux.webp';
import pastebinMockup from '../assets/projects/project-pastebin.webp';
import type { FeaturedProject } from './types';

/**
 * Projects featured on the home page.
 *
 * The set follows resume/resume.md — the same work, in the same order, at the
 * length a case study needs rather than a bullet point. When a line there
 * changes, these rows change with it; the résumé is the shorter telling, not a
 * second opinion.
 *
 * The blurbs are written here rather than pulled from GitHub: most of these
 * repos have no description set, and the rest read better trimmed.
 *
 * `stars` and `since` are refreshed from the GitHub API at build time (see
 * github.ts) for the rows that have a repository — the values below are the
 * fallback used when that request fails, so they are worth keeping roughly
 * current but are never load-bearing. `language` stays curated either way.
 */
/**
 * One featured row plus the search snippet that goes in the page head. The
 * `description` above stays the long-form copy for the case study; Google
 * truncates around 155 characters, so the outcome has to lead its own string.
 * The inline intersection keeps `seoDescription` a property of this table
 * rather than widening the shared FeaturedProject type, which the reader lane
 * owns.
 */
export const featuredProjects: Array<FeaturedProject & { seoDescription: string }> = [
	{
		slug: 'viewport',
		repo: 'viewport',
		since: '2026',
		title: 'Viewport',
		description:
			'A Wayland compositor in Rust on Smithay whose entire shell — wallpaper, dock, window frames and titlebars — is a web page, composited zero-copy alongside native clients across six interchangeable engine backends (chromium, webkitgtk, wpe, servoshell, cef, and servo), backed by a standalone custom Vulkan renderer (viewport-vulkan) with HDR, real-time blur, cross-GPU shadow buffers, and desktop portals.',
		seoDescription:
			'A Rust Wayland compositor with a web shell across six browser engines and a custom Vulkan renderer with HDR and blur.',
		language: 'Rust',
		stars: 4,
		mockup: viewportMockup,
		mockupBackground: '#0b0e14',
		mockupAlt: 'Viewport running nested at 1600×1000 with btop and its web shell',
		tags: ['wayland', 'smithay', 'vulkan'],
		challenge:
			'Build a full-featured native Wayland compositor with HDR, real-time blur, and desktop portals while letting ordinary web technology own the desktop shell and window layout — without copying rendered frames through the CPU.',
		architecture: [
			'Smithay handles DRM/KMS, input and xdg-shell; the standalone viewport-vulkan crate implements a custom Vulkan renderer with dynamic rendering, zero-copy DMA-BUF import, drm_syncobj explicit sync, real vblank pacing, and ICC display color cubes.',
			'Six interchangeable engine backends — chromium, webkitgtk, wpe, servoshell, cef, and servo — render the same HTML shell page to DMA-BUFs that composite below native windows.',
			'Tiling is a tree of CSS flexboxes so the browser computes every window rectangle; foreign-card buffers copy into per-buffer cached cross-GPU shadow buffers on the scanout card instead of being dropped.'
		],
		highlights: [
			'Six interchangeable engine backends behind one shell page: chromium, webkitgtk, wpe, servoshell, cef, and servo',
			'Standalone Vulkan renderer (viewport-vulkan) with HDR/color management (wp-color-management-v1, wp-color-representation-v1), nine-tap real-time background blur, and cross-GPU shadow buffers',
			'In-tree RemoteDesktop, InputCapture, and Clipboard portals (libei with per-session consent), plus a built-in lock screen, live settings panel, and screen magnifier',
			'Nix flake with NixOS modules that also builds WPE WebKit from source'
		]
	},
	{
		slug: 'matrix-workers',
		repo: 'matrix-workers',
		since: '2026',
		title: 'Matrix Workers',
		description:
			'A Matrix homeserver running entirely on Cloudflare Workers — Hono, D1, R2, Durable Objects, and Cloudflare Workflows — taken from a failing proof of concept to verified two-way federation with matrix.org across room versions 1–12, with Matrix v1.19 + v1.20 protocol work, Sliding Sync, E2EE, security hardening, and a 45,000-test suite. Live at codebam.ca.',
		seoDescription:
			'A Matrix homeserver on Cloudflare Workers with v1.20 work, Sliding Sync, matrix.org federation, E2EE, and 45,000 tests.',
		language: 'TypeScript',
		stars: 0,
		homepage: 'https://matrix.to/#/@codebam:codebam.ca',
		homepageLabel: 'Message @codebam',
		mockup: matrixMockup,
		mockupBackground: '#eeeaf7',
		mockupAlt:
			'A federation report for codebam.ca — signed server key, room versions 1–12, E2EE exchanged over federation',
		tags: ['cloudflare', 'matrix', 'federation'],
		challenge:
			'Meet the Matrix client-server and server-to-server specifications well enough that matrix.org accepts this homeserver as a peer — signed events, room-version-specific redaction rules, E2EE key exchange, and Sliding Sync — on an edge runtime with no persistent process.',
		architecture: [
			'Hono routes the client and federation APIs inside one Cloudflare Worker; D1 stores events, R2 holds media, Durable Objects coordinate rooms, sync, keys, rate limits and delayed events, and Cloudflare Workflows handle async room joins and push delivery.',
			'Every event is signed and reference-hashed under its room version’s redaction rules (v1–12, including MSC4291/MSC4289 v12 room IDs), with Matrix v1.19 compliance plus v1.20 work (delayed events, sticky events, header-only Bearer auth) and Sliding Sync (MSC3575/MSC4186).',
			'Peers listening only on port 8448 — unreachable by the runtime’s fetch() — are reached by an HTTP/1.1 client hand-rolled over cloudflare:sockets with TLS.'
		],
		highlights: [
			'Verified two-way federation with matrix.org: invites, joins with participating-server fallback, timeline backfill, messages, E2EE key exchange and remote media across room versions 1–12',
			'Matrix v1.20 protocol work (MSC4140 delayed events, MSC4354 sticky events, header-only Bearer auth) and Sliding Sync (MSC3575/MSC4186) for Element X alongside Element Web and FluffyChat',
			'Passes the Matrix Federation Tester (FederationOK: true), with a 45,000-test vitest suite kept green on every change',
			'Security hardening: removed a credential-free login flow, closed an unauthenticated federation v2 join path, gated registration behind single-use hashed invite tokens, and enforced server ACLs',
			'Live at codebam.ca, answering for @codebam:codebam.ca'
		]
	},
	{
		slug: 'cloudflare-telegram-bot',
		repo: 'cf-workers-telegram-bot',
		since: '2022',
		title: 'Telegram Bot for Cloudflare Workers',
		description:
			'A lightweight, type-safe Telegram bot framework for Cloudflare Workers: handlers chain off the incoming Request, middleware runs before them, and one URL registers the webhook. 330 GitHub stars, 214 forks, 120 releases on npm, and ~1,500 monthly npm downloads.',
		seoDescription:
			'A type-safe Telegram bot framework for Cloudflare Workers with chained handlers and one-URL webhook setup.',
		language: 'TypeScript',
		stars: 330,
		homepage: 'https://cf-workers-telegram-bot.codebam.ca',
		homepageLabel: 'Read the docs',
		mockup: telegramMockup,
		mockupBackground: '#f3e7d8',
		mockupAlt: 'The package page and a Worker that hands its fetch handler to the bot',
		tags: ['cloudflare', 'telegram', 'npm'],
		challenge:
			'Run a useful Telegram bot without a persistent server while keeping webhook handling, shared types and the companion web application deployable together.',
		architecture: [
			'The Worker’s fetch receives Telegram’s webhook and hands the Request to the bot, which dispatches to typed handlers.',
			'Middleware runs before the handlers, and the shared package keeps the bot and its web app on one set of types.',
			'A visit to /<token>/setWebhook registers the Worker with Telegram, so there is no deploy-time CLI step to go live.'
		],
		highlights: [
			'330 GitHub stars, 214 forks, 120 releases on npm, and ~1,500 monthly downloads under Apache-2.0',
			'No runtime dependencies beyond the type definitions',
			'Separate development and production Worker bindings, with a consumer template to start from'
		]
	},
	{
		slug: 'tux-robot',
		repo: 'tux-robot',
		since: '2026',
		title: 'Tux Robot',
		description:
			'The bot that grew out of the framework, rebuilt on grammY: one Cloudflare Worker for the conversation, Cloudflare AI for the answers, Tavily for web search and document retrieval, and a Svelte 5 web app in front of it all. Live at t.me/TuxRobot.',
		seoDescription:
			'A Cloudflare Worker Telegram bot with model answers, web search and document retrieval behind a Svelte web app.',
		language: 'TypeScript',
		stars: 0,
		homepage: 'https://t.me/TuxRobot',
		homepageLabel: 'Message the bot',
		mockup: tuxMockup,
		mockupBackground: '#c9e4f5',
		mockupAlt: 'Tux Robot holding a conversation in Telegram',
		tags: ['cloudflare', 'telegram', 'grammy'],
		challenge:
			'Answer Telegram messages with model output and current web results from a single Worker, without a server that has to stay warm between messages.',
		architecture: [
			'grammY handles Telegram updates inside one Cloudflare Worker.',
			'Cloudflare AI generates the answers, with Gemini and Llama behind it; Tavily supplies web search and document retrieval.',
			'A Svelte 5 web application provides the browser-facing interface.'
		],
		highlights: [
			'Webhook, model calls and retrieval in a single deployment',
			'Search over documents the bot has been sent, not only the web',
			'Rebuilt on grammY after outgrowing the earlier cf-workers-telegram-bot framework'
		]
	},
	{
		slug: 'pastebin-r2',
		repo: 'pastebin-r2',
		since: '2023',
		title: 'Pastebin R2',
		description:
			'A pastebin on Cloudflare Workers in TypeScript with Hono, storing objects in R2 behind a small REST API — create, update, list, info, delete — with syntax-highlighted and plain-text views, and pastes that expire on their own.',
		seoDescription:
			'A TypeScript pastebin on Cloudflare Workers and R2, with expiry, syntax highlighting and a small REST API.',
		language: 'TypeScript',
		stars: 4,
		homepage: 'https://paste.codebam.ca',
		homepageLabel: 'Open pastebin',
		mockup: pastebinMockup,
		mockupBackground: '#e5ede2',
		mockupAlt: 'Pastebin R2 editor and command-line usage',
		tags: ['cloudflare', 'r2', 'hono'],
		challenge:
			'Provide a small paste service whose objects expire predictably, without introducing a separate application server or database for the paste bodies.',
		architecture: [
			'Hono routes the API and browser interface in a Cloudflare Worker.',
			'R2 stores paste bodies and their TTL in custom metadata.',
			'Reads enforce expiry immediately while an hourly cron sweeps what is left.'
		],
		highlights: [
			'Syntax-highlighted and plain-text views',
			'Configurable lifetimes capped at 48 hours',
			'A Nix flake for dev and build, and a live instance at paste.codebam.ca'
		]
	}
];
