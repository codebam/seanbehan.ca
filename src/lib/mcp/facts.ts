/**
 * The facts an agent asks for first.
 *
 * The answer tool is instructed to use only what it is handed, so the few
 * things every question needs — who this is, where they work, what they do,
 * which links are canonical — are served as structured data rather than left
 * for a model to infer from whichever posts a query happened to retrieve.
 *
 * The identity comes from `SITES.seanbehan` on both Workers, not from the
 * build's own `site`: writing has one canonical origin, and an agent that
 * reached the codebam endpoint should still be told the same facts.
 * `SKILLS` is the one deliberate copy — it mirrors the `knowsAbout` list in
 * astro.config.mjs, which runs under plain node and cannot import this module.
 */
import { HANDLE, LEGAL_NAME, LINKEDIN_URL, SITES, yearsBuilding } from '../site';

/** Mirrors `knowsAbout` in astro.config.mjs; update both together. */
const SKILLS = [
	'TypeScript',
	'Rust',
	'NixOS',
	'Cloudflare Workers',
	'Durable Objects',
	'Wayland',
	'Linux',
	'Serverless architecture'
];

/** The links an agent should quote, not discover by guessing hostnames. */
const GITHUB_URL = 'https://github.com/codebam';
const MASTODON_URL = 'https://mstdn.ca/@codebam';

export function personFacts() {
	const writing = SITES.seanbehan;
	return {
		name: LEGAL_NAME,
		handle: HANDLE,
		role: 'Senior full-stack developer',
		location: 'Ontario, Canada',
		description: writing.description,
		availability: writing.availability,
		email: writing.email,
		years_building: yearsBuilding(),
		skills: SKILLS,
		experience: writing.experience ?? [],
		links: {
			website: writing.url,
			portfolio: SITES.codebam.url,
			github: GITHUB_URL,
			linkedin: LINKEDIN_URL,
			mastodon: MASTODON_URL
		},
		resume: {
			markdown: `${writing.url}/resume.md`,
			plain_text: `${writing.url}/resume.txt`,
			pdf: `${writing.url}/resume.pdf`
		},
		writing: {
			archive: `${writing.url}/posts`,
			feed: `${writing.url}/rss.xml`,
			search: `${writing.url}/search.json`
		},
		mcp: `${writing.url}/mcp`,
		llms_txt: `${writing.url}/llms.txt`
	};
}
