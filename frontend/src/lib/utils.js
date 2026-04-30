import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with proper merging.
 * @param {...any} inputs 
 * @returns {string}
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * @param {Function} func - The function to delay
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
