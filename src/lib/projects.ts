import type { FeaturedProject } from './types';

/**
 * Projects featured on the home page.
 *
 * The blurbs are written here rather than pulled from GitHub: two of these
 * repos have no description set, and the rest read better trimmed.
 *
 * `stars` and `since` are refreshed from the GitHub API at build time (see
 * +page.server.ts) — the values below are the fallback used when that request
 * fails, so they are worth keeping roughly current but are never load-bearing.
 * `language` stays curated either way.
 */
export const featuredProjects: FeaturedProject[] = [
	{
		slug: 'viewport',
		repo: 'viewport',
		since: '2026',
		title: 'Viewport',
		description:
			'A Wayland compositor whose entire shell — wallpaper, dock, window frames — is a web page, composited zero-copy alongside native clients. Smithay drives DRM/KMS and input; WPE WebKit renders the UI straight to a DMA-BUF, so no pixel ever touches the CPU.',
		language: 'Rust',
		stars: 0,
		tags: ['wayland', 'smithay', 'wpe-webkit'],
		challenge:
			'Build a native Wayland compositor while letting ordinary web technology own the desktop shell and window layout, without copying rendered frames through the CPU.',
		architecture: [
			'Smithay handles DRM/KMS, input and the xdg-shell protocol.',
			'WPE WebKit renders the HTML shell to DMA-BUFs that become compositor render elements.',
			'JavaScript measures CSS layout and sends window rectangles back to the compositor over IPC.'
		],
		highlights: [
			'Zero-copy composition for the web shell and native Wayland clients',
			'CSS flexbox-based tiling rather than a second layout engine in Rust',
			'Explicit synchronization and output frame pacing'
		]
	},
	{
		slug: 'cloudflare-telegram-bot',
		repo: 'cf-workers-telegram-bot',
		since: '2022',
		title: 'Telegram Bot for Cloudflare Workers',
		description:
			'A Telegram bot framework running entirely on Cloudflare Workers, with Workers AI wired up so bots can answer using Gemini and Gemma.',
		language: 'TypeScript',
		stars: 322,
		homepage: 'https://tux-robot.codebam.ca',
		homepageLabel: 'Try the bot',
		tags: ['cloudflare', 'telegram', 'ai'],
		challenge:
			'Run a useful Telegram bot without a persistent server while keeping webhook handling, shared types and the companion web application deployable together.',
		architecture: [
			'grammY handles Telegram updates inside a Cloudflare Worker.',
			'A Svelte 5 web application provides the browser-facing interface.',
			'Shared packages keep types and helpers consistent across both deployments.'
		],
		highlights: [
			'Separate development and production Worker bindings',
			'Webhook authentication and automated deployment',
			'Workers AI and web-search integrations for bot responses'
		]
	},
	{
		slug: 'cloudflare-discord-bot',
		repo: 'discord-bot',
		since: '2024',
		title: 'Discord Bot',
		description:
			'A Discord bot on Cloudflare Workers that answers slash commands with Workers AI, using Workflows to handle the deferred replies that longer model responses need.',
		language: 'TypeScript',
		stars: 1,
		homepage: 'https://discord.com/oauth2/authorize?client_id=1314059926326349824',
		homepageLabel: 'Add to Discord',
		tags: ['cloudflare', 'discord', 'workers-ai'],
		challenge:
			'Answer Discord slash commands with model output that can take longer than Discord allows an interaction request to remain open.',
		architecture: [
			'A Cloudflare Worker validates and acknowledges each Discord interaction.',
			'Cloudflare Workflows continues work after the deferred response.',
			'Workers AI generates the eventual answer returned to Discord.'
		],
		highlights: [
			'Deferred interaction handling',
			'Durable orchestration for longer AI requests',
			'Serverless deployment with no continuously running bot process'
		]
	},
	{
		slug: 'pastebin-r2',
		repo: 'pastebin-r2',
		since: '2023',
		title: 'Pastebin R2',
		description:
			'A pastebin on Cloudflare Workers backed by R2 object storage: Hono routes the API and web UI, pastes render with syntax highlighting and expire on their own after 48 hours.',
		language: 'TypeScript',
		stars: 4,
		homepage: 'https://paste.codebam.ca',
		homepageLabel: 'Open pastebin',
		tags: ['cloudflare', 'r2', 'hono'],
		challenge:
			'Provide a small paste service whose objects expire predictably, without introducing a separate application server or database for the paste bodies.',
		architecture: [
			'Hono routes the API and browser interface in a Cloudflare Worker.',
			'R2 stores paste bodies and expiry metadata.',
			'Reads enforce expiry immediately while an hourly cron removes expired objects.'
		],
		highlights: [
			'Syntax-highlighted and plain-text views',
			'Configurable lifetimes capped at 48 hours',
			'Create, update, delete, list and metadata endpoints'
		]
	}
];
