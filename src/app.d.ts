// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	/** Build-time site identity, injected by vite.config.ts. See $lib/site. */
	const __SITE_ID__: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
