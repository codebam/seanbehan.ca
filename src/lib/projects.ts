import type { FeaturedProject } from './types';

/**
 * Projects featured on the home page.
 *
 * The blurbs are written here rather than pulled from GitHub: two of these
 * repos have no description set, and the rest read better trimmed.
 *
 * `stars` and `language` are refreshed from the GitHub API at build time (see
 * +page.server.ts) — the values below are the fallback used when that request
 * fails, so they are worth keeping roughly current but are never load-bearing.
 */
export const featuredProjects: FeaturedProject[] = [
	{
		repo: 'viewport-smithay',
		title: 'Viewport',
		description:
			'A Wayland compositor whose entire shell — wallpaper, dock, window frames — is a web page, composited zero-copy alongside native clients. Smithay drives DRM/KMS and input; WPE WebKit renders the UI straight to a DMA-BUF, so no pixel ever touches the CPU.',
		language: 'Rust',
		stars: 0,
		tags: ['wayland', 'smithay', 'wpe-webkit']
	},
	{
		repo: 'cf-workers-telegram-bot',
		title: 'Telegram Bot for Cloudflare Workers',
		description:
			'A Telegram bot framework running entirely on Cloudflare Workers, with Workers AI wired up so bots can answer using Gemini and Gemma.',
		language: 'TypeScript',
		stars: 322,
		homepage: 'https://tux-robot.codebam.ca',
		homepageLabel: 'Try the bot',
		tags: ['cloudflare', 'telegram', 'ai']
	},
	{
		repo: 'discord-bot',
		title: 'Discord Bot',
		description:
			'A Discord bot on Cloudflare Workers that answers slash commands with Workers AI, using Workflows to handle the deferred replies that longer model responses need.',
		language: 'TypeScript',
		stars: 1,
		homepage: 'https://discord.com/oauth2/authorize?client_id=1314059926326349824',
		homepageLabel: 'Add to Discord',
		tags: ['cloudflare', 'discord', 'workers-ai']
	},
	{
		repo: 'pastebin-worker',
		title: 'Pastebin Worker',
		description:
			'An encrypted pastebin API on Workers: ChaCha20-Poly1305 encryption, LZ4 compression, MIME type detection and syntax highlighting.',
		language: 'Rust',
		stars: 6,
		homepage: 'https://pastebin.seanbehan.ca',
		homepageLabel: 'Open pastebin',
		tags: ['cloudflare', 'encryption', 'rust']
	}
];
