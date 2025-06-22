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
		url.searchParams.set('model', '@cf/meta/llama-3.2-11b-vision-instruct');
		url.searchParams.set('system', 'pretend you are Sean Behan.');
		url.searchParams.set(
			'content',
			"Generate me a 1 paragraph website intro for the following, WITHOUT saying here's a possible intro paragraph. My name is Sean Behan. My email address is contact@seanbehan.ca. My GitHub is codebam. I am a full stack developer. I spend most of my time on Linux writing software and contributing to open source. I'm a quick learner and enjoy learning new things. I am currently looking for work."
		);

		const source = new EventSource(url.toString());
		let hasStarted = false;

		source.onmessage = (event) => {
			try {
				if (!hasStarted) {
					bioElement.innerHTML = '';
					hasStarted = true;
				}

				if (event.data === '[DONE]') {
					source.close();
					return;
				}

				const data = JSON.parse(event.data);
				if (data.response && typeof data.response === 'string') {
					// Basic sanitization for AI response (though it should be safe)
					bioElement.innerHTML += data.response;
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
 * Safely gets an element by ID with type assertion
 * @param id - Element ID
 * @returns HTMLElement or null
 */
export function safeGetElementById(id: string): HTMLElement | null {
	try {
		return document.getElementById(id);
	} catch (error) {
		console.error(`Error getting element by ID '${id}':`, error);
		return null;
	}
}

/**
 * Basic HTML sanitization for user input (not needed for mdsvex content)
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
	// Create a temporary div to parse HTML
	const temp = document.createElement('div');
	temp.textContent = html;
	return temp.innerHTML;
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
