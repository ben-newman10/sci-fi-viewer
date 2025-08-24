/**
 * Validation utilities for input sanitization and data validation
 */

// Valid rating values
const VALID_RATINGS = ['loved', 'watched', 'pass', ''];

// Valid content type values
const VALID_CONTENT_TYPES = ['all', 'movies', 'tv'];

/**
 * Validates user ratings object
 * @param {Object} ratings - User ratings object
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateRatings = (ratings) => {
  if (!ratings || typeof ratings !== 'object' || Array.isArray(ratings)) {
    return false;
  }
  
  return Object.values(ratings).every(rating => 
    VALID_RATINGS.includes(rating)
  );
};

/**
 * Validates comments object
 * @param {Object} comments - User comments object
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateComments = (comments) => {
  if (!comments || typeof comments !== 'object' || Array.isArray(comments)) {
    return false;
  }
  
  return Object.values(comments).every(comment => 
    typeof comment === 'string' && comment.length <= 1000 // Limit comment length
  );
};

/**
 * Validates content type value
 * @param {string} contentType - Content type value
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateContentType = (contentType) => {
  return VALID_CONTENT_TYPES.includes(contentType);
};

/**
 * Sanitizes text input to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return text
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

/**
 * Sanitizes API response data
 * @param {Object} movieData - Movie data from API
 * @returns {Object} - Sanitized movie data
 */
export const sanitizeAPIResponse = (movieData) => {
  if (!movieData || typeof movieData !== 'object') {
    return null;
  }

  return {
    ...movieData,
    title: sanitizeText(movieData.title || ''),
    synopsis: sanitizeText(movieData.overview || movieData.synopsis || ''),
    // Keep other fields but sanitize text content
  };
};

/**
 * Validates and sanitizes localStorage data
 * @param {string} data - JSON string from localStorage
 * @param {Function} validator - Validation function
 * @returns {Object|null} - Parsed and validated data or null if invalid
 */
export const validateStoredData = (data, validator) => {
  if (!data || typeof data !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    return validator(parsed) ? parsed : null;
  } catch (error) {
    console.warn('Failed to parse stored data:', error);
    return null;
  }
};

/**
 * Validates pagination values
 * @param {string|number} page - Page number
 * @returns {number} - Valid page number (minimum 1)
 */
export const validatePageNumber = (page) => {
  const num = parseInt(page, 10);
  return isNaN(num) || num < 1 ? 1 : Math.min(num, 1000); // Cap at reasonable maximum
};

export { VALID_RATINGS, VALID_CONTENT_TYPES };