/**
 * Application constants and configuration
 */

// TMDB API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  GENRE_IDS: {
    SCI_FI_MOVIES: 878,
    SCI_FI_TV: 10765
  },
  ENDPOINTS: {
    DISCOVER_MOVIE: '/discover/movie',
    DISCOVER_TV: '/discover/tv'
  },
  DEFAULT_PARAMS: {
    SORT_BY: 'popularity.desc',
    PAGE_SIZE: 20,
    VOTE_COUNT_MIN: 10
  },
  MAX_PAGES: 1000
};

// Rating System
export const RATING_TYPES = {
  LOVED: 'loved',
  WATCHED: 'watched',
  PASS: 'pass',
  UNRATED: ''
};

export const RATING_LABELS = {
  [RATING_TYPES.LOVED]: 'Loved',
  [RATING_TYPES.WATCHED]: 'Watched',
  [RATING_TYPES.PASS]: 'Pass',
  [RATING_TYPES.UNRATED]: 'Rate'
};

// Content Types
export const CONTENT_TYPES = {
  ALL: 'all',
  MOVIES: 'movies',
  TV: 'tv'
};

export const CONTENT_TYPE_LABELS = {
  [CONTENT_TYPES.ALL]: 'All',
  [CONTENT_TYPES.MOVIES]: 'Movies',
  [CONTENT_TYPES.TV]: 'TV Shows'
};

// Filter Types
export const FILTER_TYPES = {
  ALL: 'all',
  LOVED: 'loved',
  WATCHED: 'watched',
  TO_WATCH: 'to-watch',
  PASS: 'pass'
};

export const FILTER_LABELS = {
  [FILTER_TYPES.ALL]: 'All',
  [FILTER_TYPES.LOVED]: 'Loved',
  [FILTER_TYPES.WATCHED]: 'Watched',
  [FILTER_TYPES.TO_WATCH]: 'To Watch',
  [FILTER_TYPES.PASS]: 'Pass'
};

// Storage Keys
export const STORAGE_KEYS = {
  RATINGS: 'scifiRatings',
  COMMENTS: 'scifiComments',
  CACHE_PREFIX: 'scifiCache_'
};

// UI Configuration
export const UI_CONFIG = {
  COMMENT_MAX_LENGTH: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300,
  GRID_BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  }
};

// Image Configuration
export const IMAGE_CONFIG = {
  TMDB_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  FALLBACK_IMAGE: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop&crop=center'
};