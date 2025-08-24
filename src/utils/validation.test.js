import {
  validateRatings,
  validateComments,
  validateContentType,
  sanitizeText,
  sanitizeAPIResponse,
  validateStoredData,
  validatePageNumber,
  VALID_RATINGS,
  VALID_CONTENT_TYPES
} from './validation';

describe('Validation Utilities', () => {
  describe('validateRatings', () => {
    test('validates correct ratings object', () => {
      const validRatings = {
        'movie-1': 'loved',
        'movie-2': 'watched',
        'movie-3': 'pass',
        'movie-4': ''
      };
      expect(validateRatings(validRatings)).toBe(true);
    });

    test('rejects invalid rating values', () => {
      const invalidRatings = {
        'movie-1': 'invalid',
        'movie-2': 'watched'
      };
      expect(validateRatings(invalidRatings)).toBe(false);
    });

    test('rejects non-object values', () => {
      expect(validateRatings(null)).toBe(false);
      expect(validateRatings([])).toBe(false);
      expect(validateRatings('string')).toBe(false);
    });
  });

  describe('validateComments', () => {
    test('validates correct comments object', () => {
      const validComments = {
        'movie-1': 'Great movie!',
        'movie-2': '',
        'movie-3': 'Not bad'
      };
      expect(validateComments(validComments)).toBe(true);
    });

    test('rejects non-string comment values', () => {
      const invalidComments = {
        'movie-1': 123,
        'movie-2': 'valid comment'
      };
      expect(validateComments(invalidComments)).toBe(false);
    });

    test('rejects comments that are too long', () => {
      const longComment = 'a'.repeat(1001);
      const invalidComments = {
        'movie-1': longComment
      };
      expect(validateComments(invalidComments)).toBe(false);
    });
  });

  describe('validateContentType', () => {
    test('validates correct content types', () => {
      VALID_CONTENT_TYPES.forEach(type => {
        expect(validateContentType(type)).toBe(true);
      });
    });

    test('rejects invalid content types', () => {
      expect(validateContentType('invalid')).toBe(false);
      expect(validateContentType('')).toBe(false);
      expect(validateContentType(null)).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    test('removes dangerous characters', () => {
      const maliciousText = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeText(maliciousText);
      expect(sanitized).toBe('scriptalert("xss")/scriptHello');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    test('removes javascript protocol', () => {
      const maliciousText = 'javascript:alert("xss")';
      const sanitized = sanitizeText(maliciousText);
      expect(sanitized).not.toContain('javascript:');
    });

    test('limits text length', () => {
      const longText = 'a'.repeat(1001);
      const sanitized = sanitizeText(longText);
      expect(sanitized).toHaveLength(1000);
    });

    test('handles null and undefined', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
    });
  });

  describe('sanitizeAPIResponse', () => {
    test('sanitizes movie data fields', () => {
      const movieData = {
        title: '<script>alert("xss")</script>Test Movie',
        overview: 'A great <b>movie</b> about heroes',
        id: 123,
        vote_average: 8.5
      };

      const sanitized = sanitizeAPIResponse(movieData);
      expect(sanitized.title).toBe('scriptalert("xss")/scriptTest Movie');
      expect(sanitized.synopsis).toBe('A great bmovie/b about heroes');
      expect(sanitized.id).toBe(123); // Numbers should remain unchanged
    });

    test('handles null input', () => {
      expect(sanitizeAPIResponse(null)).toBeNull();
    });
  });

  describe('validateStoredData', () => {
    test('validates and parses correct JSON', () => {
      const validData = '{"movie-1": "loved"}';
      const validator = (data) => typeof data === 'object';
      const result = validateStoredData(validData, validator);
      expect(result).toEqual({ 'movie-1': 'loved' });
    });

    test('returns null for invalid JSON', () => {
      const invalidData = '{"invalid": json}';
      const validator = () => true;
      const result = validateStoredData(invalidData, validator);
      expect(result).toBeNull();
    });

    test('returns null when validator fails', () => {
      const validJSON = '{"test": "data"}';
      const failingValidator = () => false;
      const result = validateStoredData(validJSON, failingValidator);
      expect(result).toBeNull();
    });
  });

  describe('validatePageNumber', () => {
    test('validates positive numbers', () => {
      expect(validatePageNumber('5')).toBe(5);
      expect(validatePageNumber(10)).toBe(10);
    });

    test('returns 1 for invalid inputs', () => {
      expect(validatePageNumber('invalid')).toBe(1);
      expect(validatePageNumber(0)).toBe(1);
      expect(validatePageNumber(-5)).toBe(1);
    });

    test('caps at maximum value', () => {
      expect(validatePageNumber(2000)).toBe(1000);
    });
  });
});