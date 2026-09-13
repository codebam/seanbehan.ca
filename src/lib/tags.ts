/**
 * Normalise a tag into a URL slug: trim, fold to lowercase and turn runs of
 * whitespace into a single hyphen ("Secure Boot" -> "secure-boot"). A leaf
 * module with no content-layer imports, so a template can use it without
 * pulling `emdash` in with it.
 */
export const slugifyTag = (tag: string): string => tag.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Display form of a tag. D1 stores a lowercased slug beside the term's label,
 * and the label is the normal name; this map rescues proper nouns like "nixos"
 * for terms whose label was never filled in, and leaves everything else as it
 * arrived.
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
