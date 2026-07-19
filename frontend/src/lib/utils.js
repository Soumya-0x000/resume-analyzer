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

/**
 * @param {string} str
 * @returns {string} up to 2 uppercase initials
 */
export function getInitials(str) {
    if (!str) return '?';
    return str
        .split(/[\s_.-]+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

/**
 * @param {File} file
 * @returns {Promise<string>} base64 data URL
 */
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
