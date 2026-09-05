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
export const featuredProjects: FeaturedProject[] = [
	{
		slug: 'codebam-stream',
		// The one row without a repository: the control plane takes Stripe money
		// for a live service, so it stays private and the row links to the
		// service instead of to source nobody is allowed to read.
		since: '2026',
		title: 'Codebam Stream',
		description:
			'Browser-first multistreaming in early access: OBS pushes one signal in over WHIP, your own watch page is the program output, and the same signal leaves again as RTMPS to YouTube, Twitch, X, Kick and Telegram. Cloudflare Workers, Durable Objects, D1 and LiveKit underneath, prepaid hours on top.',
		language: 'TypeScript',
		stars: 0,
		homepage: 'https://stream.codebam.ca',
		homepageLabel: 'Open the dashboard',
		mockup: '/img/project-stream.webp',
		mockupAlt: 'Codebam Stream control room with one program feed and five relay destinations',
		tags: ['durable-objects', 'livekit', 'rtmps'],
		challenge:
			'Relay one live broadcast to five providers that each have their own stream key, rate limit and way of failing — while taking money for it in advance, and never letting a customer watch or push frames they have not paid for.',
		architecture: [
			'WHIP ingest from OBS lands in LiveKit, which serves the browser watch page.',
			'Provider relays are auxiliary outputs, each held by a Durable Object that owns its lifecycle.',
			'Two channels of prepaid credit — destination-hours and browser viewer-hours — are allocated FIFO in D1 and reconciled per customer as usage accrues.'
		],
		highlights: [
			'Publisher epochs and relay generations fence every path, so a stale relay can never attach to a replacement broadcast',
			'Resource-bound capabilities rather than ambient authority inside the Worker',
			'Fail-closed relays and durable refund handling across 18k lines of tested TypeScript'
		]
	},
	{
		slug: 'viewport',
		repo: 'viewport',
		since: '2026',
		title: 'Viewport',
		description:
			'A Wayland compositor in Rust on Smithay whose entire shell — wallpaper, dock, window frames and titlebars — is a web page, composited zero-copy alongside native clients. Five interchangeable engine backends render that same page: WPE, WebKitGTK, Chromium, CEF and Servo.',
		language: 'Rust',
		stars: 4,
		mockup: '/img/project-viewport.webp',
		mockupAlt: 'Viewport desktop shell showing its keyboard controls',
		tags: ['wayland', 'smithay', 'wpe-webkit'],
		challenge:
			'Build a native Wayland compositor while letting ordinary web technology own the desktop shell and window layout, without copying rendered frames through the CPU.',
		architecture: [
			'Smithay handles DRM/KMS, input and the xdg-shell protocol.',
			'An engine backend renders the HTML shell to DMA-BUFs that become compositor render elements.',
			'Tiling is a tree of CSS flexboxes, so the browser computes every window rectangle and the shell only measures the result.'
		],
		highlights: [
			'Five interchangeable engine backends behind one shell page — WPE, WebKitGTK, Chromium, CEF and Servo',
			'Zero-copy from engine to screen: DMA-BUF frames, drm_syncobj fences and real vblank pacing',
			'A Nix flake that builds WPE WebKit from source'
		]
	},
	{
		slug: 'cloudflare-telegram-bot',
		repo: 'cf-workers-telegram-bot',
		since: '2022',
		title: 'Telegram Bot for Cloudflare Workers',
		description:
			'A lightweight, type-safe Telegram bot framework for Cloudflare Workers: handlers chain off the incoming Request, middleware runs before them, and one URL registers the webhook. 325 stars, 214 forks and 120 releases on npm.',
		language: 'TypeScript',
		stars: 325,
		homepage: 'https://cf-workers-telegram-bot.codebam.ca',
		homepageLabel: 'Read the docs',
		mockup: '/img/project-telegram-sdk.webp',
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
			'325 stars, 214 forks and 120 releases on npm, under Apache-2.0',
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
		language: 'TypeScript',
		stars: 0,
		homepage: 'https://t.me/TuxRobot',
		homepageLabel: 'Message the bot',
		mockup: '/img/project-tux.webp',
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
			'Moved off the framework above and onto grammY, which is the honest ordering of the two rows'
		]
	},
	{
		slug: 'pastebin-r2',
		repo: 'pastebin-r2',
		since: '2023',
		title: 'Pastebin R2',
		description:
			'A pastebin on Cloudflare Workers in TypeScript with Hono, storing objects in R2 behind a small REST API — create, update, list, info, delete — with syntax-highlighted and plain-text views, and pastes that expire on their own.',
		language: 'TypeScript',
		stars: 4,
		homepage: 'https://paste.codebam.ca',
		homepageLabel: 'Open pastebin',
		mockup: '/img/project-pastebin.webp',
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
