/**
 * Normalise a tag into a URL slug: trim, fold to lowercase and turn runs of
 * whitespace into a single hyphen ("Secure Boot" -> "secure-boot"). Written as
 * its own leaf module — no globs, no platform modules — so the post page can
 * import it without dragging getPosts' markdown globs into the client bundle.
 */
export const slugifyTag = (tag: string): string => tag.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Display form of a tag. Frontmatter is written in lowercase slugs, so the
 * first-seen casing is "nixos" rather than "NixOS". Known proper nouns are
 * mapped here; anything else keeps the form it arrived in.
 */
const TAG_LABELS: Record<string, string> = {
	nixos: 'NixOS',
	typescript: 'TypeScript',
	javascript: 'JavaScript',
	sveltekit: 'SvelteKit',
	svelte: 'Svelte',
	'steam-deck': 'Steam Deck',
	'secure-boot': 'Secure Boot',
	wireshark: 'Wireshark',
	cloudflare: 'Cloudflare',
	usb: 'USB',
	css: 'CSS',
	raid: 'RAID',
	linux: 'Linux',
	rust: 'Rust',
	systemd: 'systemd',
	podman: 'Podman',
	docker: 'Docker',
	ostree: 'OSTree',
	react: 'React',
	websocket: 'WebSocket',
	alpine: 'Alpine',
	quadlet: 'Quadlet'
};

export const displayTag = (tag: string): string => TAG_LABELS[slugifyTag(tag)] ?? tag;
