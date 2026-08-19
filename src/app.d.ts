// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	/** Build-time site identity, injected by vite.config.ts. See $lib/site. */
	const __SITE_ID__: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// svelte:head appends, so every page's description and social title
		// are resolved once in the layout from this (or from a post). A page
		// that also wrote its own <meta name="description"> shipped two of them.
		interface PageData {
			description?: string;
			ogTitle?: string;
		}
		// interface Platform {}
	}
}

export {};
