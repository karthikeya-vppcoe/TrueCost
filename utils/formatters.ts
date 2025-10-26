// utils/formatters.ts

/**
 * Formats a number as a currency string (e.g., $1,234.56).
 * @param amount The number to format.
 * @returns A string representing the amount in USD currency format.
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
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