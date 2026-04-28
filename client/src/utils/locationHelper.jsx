/**
 * Cleans a location string to show only English/Latin characters.
 * Removes non-ASCII characters and cleans up any empty parentheses or trailing commas left behind.
 * 
 * @param {string} location - The raw location string.
 * @returns {string} - The cleaned English-only location string.
 */
export const getEnglishLocation = (location) => {
    if (!location) return "";

    // Replace non-ASCII characters with empty string
    // This removes scripts like Hindi, Kannada, Tamil, etc.
    let cleaned = location.replace(/[^\x00-\x7F]/g, "");

    // Clean up empty parentheses: "Bengaluru ()" -> "Bengaluru"
    cleaned = cleaned.replace(/\s*\(\s*\)/g, "");

    // Clean up multiple commas and spaces
    cleaned = cleaned.replace(/,\s*,/g, ",");
    cleaned = cleaned.replace(/\s{2,}/g, " ");

    // Remove leading/trailing commas and whitespace
    cleaned = cleaned.trim().replace(/^,|,$/g, "").trim();

    return cleaned || location; // Fallback to original if everything was stripped
};
