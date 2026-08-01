/**
 * Creates a debounced version of a function that delays its execution
 * until after `wait` milliseconds have elapsed since the last time it was called.
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return function (...args: Parameters<T>) {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

/**
 * Renders the inline subset of markdown the bio model actually emits: bold,
 * italics, inline code and links. Block constructs (headings, lists) are
 * deliberately unsupported — the bio renders into a <p>, where block elements
 * would be invalid HTML.
 *
 * Input is escaped before any markup is added, so model output can never
 * introduce HTML of its own.
 *
 * @param markdown - Raw markdown text
 * @returns HTML string safe to assign to innerHTML
 */
export function renderInlineMarkdown(markdown: string): string {
	const escaped = markdown
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

	return (
		escaped
			// Links first, so their text can still pick up emphasis below.
			// Only http(s) — javascript: and data: URLs never match.
			.replace(
				/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
			)
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			// Double markers before single, or `**x**` would match as `*` twice.
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/__([^_]+)__/g, '<strong>$1</strong>')
			// Single `*` only. `_foo_` is left alone so identifiers and
			// snake_case words survive intact.
			.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
			.replace(/\n{2,}/g, '<br /><br />')
			.replace(/\n/g, '<br />')
	);
}

/**
 * Initializes AI-generated bio with error handling and security validation
 * @param bioElementId - ID of the element to populate with bio content
 * @returns Cleanup function to close the EventSource
 */
export function initAIBio(bioElementId: string): () => void {
	const bioElement = document.getElementById(bioElementId);
	if (!bioElement) {
		console.warn(`Bio element with ID '${bioElementId}' not found`);
		return () => {};
	}

	try {
		const apiUrl = 'https://damp-recipe-a17d.codebam.workers.dev/';

		// Validate the API URL for security
		if (!isValidExternalURL(apiUrl)) {
			console.error('Invalid API URL for AI bio');
			return () => {};
		}

		const url = new URL(apiUrl);
		url.searchParams.set('model', '@cf/google/gemma-4-26b-a4b-it');
		url.searchParams.set('system', 'pretend you are Sean Behan.');
		url.searchParams.set(
			'content',
			"Generate me a 1 paragraph website intro for the following, WITHOUT saying here's a possible intro paragraph. My name is Sean Behan. My email address is contact@seanbehan.ca. My GitHub is codebam. I am a full stack developer. I spend most of my time on Linux writing software and contributing to open source. I'm a quick learner and enjoy learning new things. I am currently looking for work."
		);

		const source = new EventSource(url.toString());
		// Markdown has to be re-rendered from the whole buffer on each chunk: a
		// `**bold**` span routinely arrives split across several deltas. Assigning
		// the full render each time also replaces the static fallback bio on the
		// first chunk.
		let received = '';

		source.onmessage = (event) => {
			try {
				if (event.data === '[DONE]') {
					source.close();
					return;
				}
				const data = JSON.parse(event.data);
				const content = data.choices?.[0]?.delta?.content || data.response || '';
				if (content) {
					received += content;
					bioElement.innerHTML = renderInlineMarkdown(received);
				}
			} catch (error) {
				console.error('Error processing AI response:', error);
				source.close();
			}
		};

		source.onerror = (error) => {
			console.error('EventSource error:', error);
			source.close();
		};

		// Set a timeout to prevent hanging connections
		const timeout = setTimeout(() => {
			console.warn('AI bio request timed out');
			source.close();
		}, 30000); // 30 seconds

		return () => {
			clearTimeout(timeout);
			source.close();
		};
	} catch (error) {
		console.error('Failed to initialize AI bio:', error);
		return () => {};
	}
}

/**
 * Validates that a URL is safe for external requests
 * @param url - URL to validate
 * @returns boolean indicating if URL is safe
 */
export function isValidExternalURL(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		// Only allow HTTPS for external requests
		return parsedUrl.protocol === 'https:' && parsedUrl.hostname !== 'localhost';
	} catch {
		return false;
	}
}
