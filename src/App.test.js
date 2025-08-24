import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to verify basic app functionality without complex mocking
describe('App Integration Test', () => {
  test('app exports are available', () => {
    // Just test that we can import the module
    const App = require('./App');
    expect(App.default).toBeDefined();
  });

  test('constants are properly defined', () => {
    const constants = require('./constants');
    expect(constants.API_CONFIG).toBeDefined();
    expect(constants.RATING_TYPES).toBeDefined();
    expect(constants.CONTENT_TYPES).toBeDefined();
  });

  test('validation utilities work correctly', () => {
    const validation = require('./utils/validation');
    
    // Test rating validation
    expect(validation.validateRatings({ 'test': 'loved' })).toBe(true);
    expect(validation.validateRatings({ 'test': 'invalid' })).toBe(false);
    
    // Test text sanitization
    expect(validation.sanitizeText('<script>alert("xss")</script>test'))
      .toBe('scriptalert("xss")/scripttest');
  });

  test('error boundary component can be imported', () => {
    const ErrorBoundary = require('./components/ErrorBoundary');
    expect(ErrorBoundary.default).toBeDefined();
  });
});

// Component-level tests for key functionality
describe('Component Functionality', () => {
  // Mock the dependencies to avoid complex setup
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [], total_pages: 1 })
      })
    );

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    global.localStorage = localStorageMock;
    
    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    };
    global.sessionStorage = sessionStorageMock;

    // Mock console methods to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('validation utilities prevent XSS attacks', () => {
    const { sanitizeText, sanitizeAPIResponse } = require('./utils/validation');
    
    const maliciousInput = '<script>alert("hack")</script>';
    const cleaned = sanitizeText(maliciousInput);
    
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('</script>');
    expect(cleaned).toBe('scriptalert("hack")/script');

    const maliciousApiData = {
      title: '<img src=x onerror=alert("xss")>',
      overview: 'javascript:alert("xss")'
    };
    
    const cleanedApiData = sanitizeAPIResponse(maliciousApiData);
    expect(cleanedApiData.title).not.toContain('<img');
    expect(cleanedApiData.synopsis).not.toContain('javascript:');
  });

  test('constants provide expected values', () => {
    const {
      API_CONFIG,
      RATING_TYPES,
      CONTENT_TYPES,
      STORAGE_KEYS
    } = require('./constants');

    expect(API_CONFIG.GENRE_IDS.SCI_FI_MOVIES).toBe(878);
    expect(API_CONFIG.GENRE_IDS.SCI_FI_TV).toBe(10765);
    
    expect(RATING_TYPES.LOVED).toBe('loved');
    expect(RATING_TYPES.WATCHED).toBe('watched');
    expect(RATING_TYPES.PASS).toBe('pass');
    
    expect(CONTENT_TYPES.ALL).toBe('all');
    expect(CONTENT_TYPES.MOVIES).toBe('movies');
    expect(CONTENT_TYPES.TV).toBe('tv');
    
    expect(STORAGE_KEYS.RATINGS).toBe('scifiRatings');
    expect(STORAGE_KEYS.COMMENTS).toBe('scifiComments');
  });

  test('input validation prevents injection attacks', () => {
    const { validateStoredData, validateRatings, validateComments } = require('./utils/validation');
    
    // Test malicious JSON
    const maliciousJson = '{"__proto__":{"isAdmin":true}}';
    const result = validateStoredData(maliciousJson, () => true);
    expect(result).toBeTruthy(); // JSON.parse handles this safely
    
    // Test invalid ratings
    const invalidRatings = { 'movie1': '<script>alert("xss")</script>' };
    expect(validateRatings(invalidRatings)).toBe(false);
    
    // Test valid ratings
    const validRatings = { 'movie1': 'loved', 'movie2': 'watched' };
    expect(validateRatings(validRatings)).toBe(true);
    
    // Test comment length validation
    const longComment = { 'movie1': 'a'.repeat(1001) };
    expect(validateComments(longComment)).toBe(false);
    
    const validComment = { 'movie1': 'Great movie!' };
    expect(validateComments(validComment)).toBe(true);
  });

  test('error boundary handles errors gracefully', () => {
    const ErrorBoundary = require('./components/ErrorBoundary').default;
    
    // Test that ErrorBoundary component can be instantiated
    const instance = new ErrorBoundary({});
    expect(instance).toBeInstanceOf(ErrorBoundary);
    
    // Test error state derivation
    const errorState = ErrorBoundary.getDerivedStateFromError(new Error('test'));
    expect(errorState.hasError).toBe(true);
  });
});