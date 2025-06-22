// Type definitions for cactus.js comment system
export interface CactusConfig {
	node: HTMLElement | null;
	defaultHomeserverUrl: string;
	serverName: string;
	siteName: string;
	commentSectionId: string;
}

declare module './cactus.js' {
	export function initComments(config: CactusConfig): void;
}
