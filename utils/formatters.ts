// utils/formatters.ts

/**
 * Formats a number as an Indian Rupee currency string (e.g., ₹1,23,456).
 * Alias of formatINR for backward compatibility.
 * @param amount The number to format.
 * @returns A string representing the amount in INR currency format.
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a large number (INR) to thousands display for chart Y-axes.
 * e.g. 12500 -> "₹12k", 1800 -> "₹2k"
 */
export const formatINRThousands = (value: number): string => {
    return `₹${(value / 1000).toFixed(0)}k`;
};

/**
 * Formats a number as an Indian Rupee string (e.g., ₹1,23,456).
 * @param amount The number to format.
 * @returns A string representing the amount in INR currency format.
 */
export const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a date string into a more readable format (e.g., May 20, 2024).
 * @param dateString The date string to format (e.g., '2024-05-20').
 * @returns A formatted, readable date string.
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Adjust for timezone to prevent off-by-one day errors
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(adjustedDate);
};