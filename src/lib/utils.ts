/**
 * Creates a debounced version of a function that delays its execution
 * until after `wait` milliseconds have elapsed since the last time it was called.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return function (this: any, ...args: Parameters<T>) {
        const context = this;

        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Example usage:
 * 
 * const debouncedSearch = debounce((query: string) => {
 *     // search logic here
 * }, 300);
 */