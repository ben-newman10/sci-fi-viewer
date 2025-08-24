import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Star, Eye, EyeOff, Heart, Filter, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';
import { 
  validateRatings, 
  validateComments, 
  validateContentType, 
  validateStoredData,
  validatePageNumber,
  sanitizeAPIResponse
} from './utils/validation';
import {
  API_CONFIG,
  RATING_TYPES,
  RATING_LABELS,
  CONTENT_TYPES,
  CONTENT_TYPE_LABELS,
  FILTER_TYPES,
  FILTER_LABELS,
  STORAGE_KEYS,
  UI_CONFIG,
  IMAGE_CONFIG
} from './constants';
import ErrorBoundary from './components/ErrorBoundary';


const MovieCard = React.memo(({ movie, userRatings, comments, setRating, setComment }) => {
  const rating = userRatings[movie.id];
  const comment = comments[movie.id] || '';

  return (
    <div className="movie-card">
      <div className="movie-card-poster">
        <img 
          src={movie.poster} 
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card-poster-overlay"></div>
        <div className="movie-card-rating">
          <Star className="star-icon" size={14} />
          <span>{movie.imdbRating}</span>
        </div>
      </div>

      <div className="movie-card-content">
        <div className="movie-card-header">
          <h3>{movie.title}</h3>
          <p>{movie.type} • {movie.year}</p>
        </div>
        <p className="movie-card-synopsis">{movie.synopsis}</p>

        <div className="action-buttons">
          <button
            onClick={() => setRating(movie.id, rating === RATING_TYPES.LOVED ? RATING_TYPES.UNRATED : RATING_TYPES.LOVED)}
            className={`action-btn loved ${rating === RATING_TYPES.LOVED ? 'active' : ''}`}
          >
            <Heart className="heart-icon" size={14} />
            <span>{RATING_LABELS[RATING_TYPES.LOVED]}</span>
          </button>
          <div className="action-btn-group">
            <button
              onClick={() => setRating(movie.id, rating === RATING_TYPES.WATCHED ? RATING_TYPES.UNRATED : RATING_TYPES.WATCHED)}
              className={`action-btn watched ${rating === RATING_TYPES.WATCHED ? 'active' : ''}`}
            >
              <Eye size={14} />
              <span>{RATING_LABELS[RATING_TYPES.WATCHED]}</span>
            </button>
            <button
              onClick={() => setRating(movie.id, rating === RATING_TYPES.PASS ? RATING_TYPES.UNRATED : RATING_TYPES.PASS)}
              className={`action-btn pass ${rating === RATING_TYPES.PASS ? 'active' : ''}`}
            >
              <EyeOff size={14} />
              <span>{RATING_LABELS[RATING_TYPES.PASS]}</span>
            </button>
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(movie.id, e.target.value)}
          placeholder="Add your thoughts..."
          className="comment-textarea"
        />
      </div>
    </div>
  );
});

const SciFiTracker = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [userRatings, setUserRatings] = useState({});
  const [comments, setComments] = useState({});
  const [contentType, setContentType] = useState(CONTENT_TYPES.ALL);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentTvPage, setCurrentTvPage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [totalTvPages, setTotalTvPages] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const savedRatings = localStorage.getItem(STORAGE_KEYS.RATINGS);
    const savedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const savedContentType = localStorage.getItem('scifiContentType');
    const savedFilter = localStorage.getItem('scifiFilter');
    const savedMoviePage = localStorage.getItem('scifiMoviePage');
    const savedTvPage = localStorage.getItem('scifiTvPage');
    const savedCachedData = sessionStorage.getItem('scifiCachedData');
    
    console.log('Loading saved data from localStorage:', {
      ratingsCount: savedRatings ? Object.keys(JSON.parse(savedRatings)).length : 0,
      commentsCount: savedComments ? Object.keys(JSON.parse(savedComments)).length : 0,
      filter: savedFilter || FILTER_TYPES.ALL,
      contentType: savedContentType || CONTENT_TYPES.ALL,
      moviePage: savedMoviePage || 1,
      tvPage: savedTvPage || 1
    });
    
    // Safely load and validate stored data
    const validatedRatings = validateStoredData(savedRatings, validateRatings);
    const validatedComments = validateStoredData(savedComments, validateComments);
    const validatedCachedData = validateStoredData(savedCachedData, (data) => typeof data === 'object');

    if (validatedRatings) setUserRatings(validatedRatings);
    if (validatedComments) setComments(validatedComments);
    if (savedContentType && validateContentType(savedContentType)) {
      setContentType(savedContentType);
    }
    if (savedFilter) setFilter(savedFilter);
    if (savedMoviePage) setCurrentMoviePage(validatePageNumber(savedMoviePage));
    if (savedTvPage) setCurrentTvPage(validatePageNumber(savedTvPage));
    
    // Clean up expired cache entries and set valid cached data
    if (validatedCachedData) {
      const cleanedCache = {};
      const now = Date.now();
      Object.keys(validatedCachedData).forEach(key => {
        if (key.endsWith('_timestamp')) {
          const timestamp = validatedCachedData[key];
          const cacheKey = key.replace('_timestamp', '');
          if (now - timestamp < UI_CONFIG.CACHE_DURATION && validatedCachedData[cacheKey]) {
            cleanedCache[key] = timestamp;
            cleanedCache[cacheKey] = validatedCachedData[cacheKey];
          }
        } else if (!key.endsWith('_timestamp') && !cleanedCache[`${key}_timestamp`]) {
          // Skip data entries without valid timestamps
        }
      });
      setCachedData(cleanedCache);
    }

    // Clean up invalid data if validation failed
    if (savedRatings && !validatedRatings) {
      localStorage.removeItem(STORAGE_KEYS.RATINGS);
      console.warn('Invalid ratings data removed from localStorage');
    }
    if (savedComments && !validatedComments) {
      localStorage.removeItem(STORAGE_KEYS.COMMENTS);
      console.warn('Invalid comments data removed from localStorage');
    }
    if (savedCachedData && !validatedCachedData) {
      sessionStorage.removeItem('scifiCachedData');
      console.warn('Invalid cached data removed from sessionStorage');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('scifiContentType', contentType);
  }, [contentType]);

  useEffect(() => {
    localStorage.setItem('scifiFilter', filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('scifiMoviePage', currentMoviePage.toString());
  }, [currentMoviePage]);

  useEffect(() => {
    localStorage.setItem('scifiTvPage', currentTvPage.toString());
  }, [currentTvPage]);

  useEffect(() => {
    if (Object.keys(cachedData).length > 0) {
      sessionStorage.setItem('scifiCachedData', JSON.stringify(cachedData));
    }
  }, [cachedData]);

  useEffect(() => {
    const abortController = new AbortController();
    
    // Reset pagination when content type changes
    setCurrentMoviePage(1);
    setCurrentTvPage(1);
    setMovies([]); // Clear existing data
    fetchSciFiContent(false, true, abortController.signal); // Force fresh fetch
    
    return () => {
      abortController.abort();
    };
  }, [contentType]);

  // Periodic cache cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCachedData(prev => {
        const cleaned = {};
        const now = Date.now();
        Object.keys(prev).forEach(key => {
          if (key.endsWith('_timestamp')) {
            const timestamp = prev[key];
            const cacheKey = key.replace('_timestamp', '');
            if (now - timestamp < UI_CONFIG.CACHE_DURATION && prev[cacheKey]) {
              cleaned[key] = timestamp;
              cleaned[cacheKey] = prev[cacheKey];
            }
          }
        });
        return cleaned;
      });
    }, UI_CONFIG.CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // Utility function to remove duplicate movies based on ID
  const deduplicateMovies = (movies) => {
    return movies.filter((item, index, arr) => 
      arr.findIndex(i => i.id === item.id) === index
    );
  };

  const fetchSciFiContent = async (append = false, forceRefresh = false, abortSignal) => {
    // Generate unique request ID to track this request
    const currentRequestId = ++requestIdRef.current;
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const handleResponseError = async (response) => {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            return `(${response.status}) ${errorJson.status_message || 'Unknown API Error'}`;
        } catch (e) {
            return `(${response.status}) Invalid response from server: ${errorText.substring(0, 100)}...`;
        }
    };

    try {
      const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
      if (!API_KEY) {
        throw new Error("TMDB API key is not set. Please add REACT_APP_TMDB_API_KEY to your .env file.");
      }
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        },
        signal: abortSignal
      };
      
      // API rate limiting - ensure minimum time between requests
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const minInterval = 100; // 100ms minimum between requests
      
      if (timeSinceLastRequest < minInterval) {
        await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
      }
      setLastRequestTime(Date.now());
      
      // Check cache first (skip if forcing refresh)
      const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${contentType}-movies-${currentMoviePage}-tv-${currentTvPage}`;
      const cacheTimestamp = cachedData[`${cacheKey}_timestamp`];
      const isCacheValid = cacheTimestamp && (Date.now() - cacheTimestamp < UI_CONFIG.CACHE_DURATION);
      
      if (cachedData[cacheKey] && !append && !forceRefresh && isCacheValid) {
        console.log('Using cached data for', cacheKey, 'cached at', new Date(cacheTimestamp));
        setMovies(cachedData[cacheKey]);
        setLoading(false);
        return;
      } else if (cachedData[cacheKey] && !isCacheValid) {
        console.log('Cache expired for', cacheKey, 'fetching fresh data');
        // Remove expired cache entry
        setCachedData(prev => {
          const { [cacheKey]: removed, [`${cacheKey}_timestamp`]: removedTimestamp, ...rest } = prev;
          return rest;
        });
      }
      
      // Fetch multiple pages for initial load
      const pagesToFetch = append ? 1 : 3;
      const moviePromises = [];
      const tvPromises = [];
      
      // Only fetch based on content type
      if (contentType === CONTENT_TYPES.ALL || contentType === CONTENT_TYPES.MOVIES) {
        for (let i = 0; i < pagesToFetch; i++) {
          const moviePage = append ? currentMoviePage + i : i + 1;
          moviePromises.push(
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISCOVER_MOVIE}?with_genres=${API_CONFIG.GENRE_IDS.SCI_FI_MOVIES}&sort_by=${API_CONFIG.DEFAULT_PARAMS.SORT_BY}&page=${moviePage}`, options)
          );
        }
      }
      
      if (contentType === CONTENT_TYPES.ALL || contentType === CONTENT_TYPES.TV) {
        for (let i = 0; i < pagesToFetch; i++) {
          const tvPage = append ? currentTvPage + i : i + 1;
          tvPromises.push(
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISCOVER_TV}?with_genres=${API_CONFIG.GENRE_IDS.SCI_FI_TV}&sort_by=${API_CONFIG.DEFAULT_PARAMS.SORT_BY}&page=${tvPage}`, options)
          );
        }
      }
      
      const [movieResponses, tvResponses] = await Promise.all([
        moviePromises.length > 0 ? Promise.all(moviePromises) : Promise.resolve([]),
        tvPromises.length > 0 ? Promise.all(tvPromises) : Promise.resolve([])
      ]);
      
      // Check for errors
      for (const response of [...movieResponses, ...tvResponses]) {
        if (!response.ok) {
          const errorMessage = await handleResponseError(response);
          throw new Error(`Failed to fetch data: ${errorMessage}`);
        }
      }
      
      const movieDataPromises = movieResponses.length > 0 ? movieResponses.map(response => response.json()) : [];
      const tvDataPromises = tvResponses.length > 0 ? tvResponses.map(response => response.json()) : [];
      
      const [movieDataArray, tvDataArray] = await Promise.all([
        movieDataPromises.length > 0 ? Promise.all(movieDataPromises) : Promise.resolve([]),
        tvDataPromises.length > 0 ? Promise.all(tvDataPromises) : Promise.resolve([])
      ]);
      
      // Set pagination info from first response
      if (movieDataArray.length > 0 && movieDataArray[0]) {
        setTotalMoviePages(movieDataArray[0].total_pages);
      }
      if (tvDataArray.length > 0 && tvDataArray[0]) {
        setTotalTvPages(tvDataArray[0].total_pages);
      }
      
      // Process all results
      let allMovies = [];
      let allTVShows = [];
      
      if (movieDataArray.length > 0) {
        movieDataArray.forEach(data => {
          const processedMovies = data.results.map(movie => {
            const sanitized = sanitizeAPIResponse(movie);
            return {
              id: `movie-${movie.id}`,
              title: sanitized.title,
              type: "Movie",
              year: new Date(movie.release_date).getFullYear() || 'TBA',
              poster: movie.poster_path ? `${IMAGE_CONFIG.TMDB_BASE_URL}${movie.poster_path}` : IMAGE_CONFIG.FALLBACK_IMAGE,
              synopsis: sanitized.synopsis || "No synopsis available.",
              imdbRating: movie.vote_average.toFixed(1)
            };
          });
          allMovies.push(...processedMovies);
        });
      }
      
      if (tvDataArray.length > 0) {
        tvDataArray.forEach(data => {
          const processedTVShows = data.results.map(show => {
            const sanitized = sanitizeAPIResponse({ ...show, title: show.name });
            return {
              id: `tv-${show.id}`,
              title: sanitized.title,
              type: "TV Series",
              year: new Date(show.first_air_date).getFullYear() || 'TBA',
              poster: show.poster_path ? `${IMAGE_CONFIG.TMDB_BASE_URL}${show.poster_path}` : IMAGE_CONFIG.FALLBACK_IMAGE,
              synopsis: sanitized.synopsis || "No synopsis available.",
              imdbRating: show.vote_average.toFixed(1)
            };
          });
          allTVShows.push(...processedTVShows);
        });
      }
      
      // Check if this request was aborted or superseded
      if (abortSignal?.aborted || currentRequestId !== requestIdRef.current) {
        return;
      }

      const newContent = [...allMovies, ...allTVShows]
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
      
      // Apply deduplication to new content
      const deduplicatedNewContent = deduplicateMovies(newContent);
      
      if (append) {
        setMovies(prev => {
          const combined = [...prev, ...deduplicatedNewContent];
          // Remove duplicates from combined array
          const unique = deduplicateMovies(combined);
          return unique.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        });
      } else {
        setMovies(deduplicatedNewContent);
        // Cache the deduplicated data with timestamp
        setCachedData(prev => ({
          ...prev,
          [cacheKey]: deduplicatedNewContent,
          [`${cacheKey}_timestamp`]: Date.now()
        }));
      }
    } catch (err) {
      // Don't set error for aborted requests
      if (err.name !== 'AbortError' && currentRequestId === requestIdRef.current) {
        setError(err.message);
      }
    } finally {
      // Only update loading state if this is still the current request
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const setRating = React.useCallback((movieId, rating) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
  }, []);

  // Debounced comment saving
  const commentTimeouts = React.useRef({});
  
  // Cleanup comment timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(commentTimeouts.current).forEach(clearTimeout);
      commentTimeouts.current = {};
    };
  }, []);
  
  const setComment = (movieId, comment) => {
    // Clear previous timeout for this movie
    if (commentTimeouts.current[movieId]) {
      clearTimeout(commentTimeouts.current[movieId]);
    }
    
    // Update UI immediately
    setComments(prev => ({ ...prev, [movieId]: comment }));
    
    // Debounce validation and trimming
    commentTimeouts.current[movieId] = setTimeout(() => {
      setComments(prev => {
        const trimmedComment = comment.trim().slice(0, UI_CONFIG.COMMENT_MAX_LENGTH);
        return { ...prev, [movieId]: trimmedComment };
      });
      delete commentTimeouts.current[movieId];
    }, UI_CONFIG.DEBOUNCE_DELAY);
  };

  const loadMoreContent = React.useCallback(async () => {
    if (contentType === CONTENT_TYPES.ALL || contentType === CONTENT_TYPES.MOVIES) {
      setCurrentMoviePage(currentMoviePage + 3);
    }
    if (contentType === CONTENT_TYPES.ALL || contentType === CONTENT_TYPES.TV) {
      setCurrentTvPage(currentTvPage + 3);
    }
    
    await fetchSciFiContent(true, false, null);
  }, [contentType, currentMoviePage, currentTvPage]);

  const canLoadMore = () => {
    if (contentType === CONTENT_TYPES.MOVIES) {
      return currentMoviePage < totalMoviePages;
    } else if (contentType === CONTENT_TYPES.TV) {
      return currentTvPage < totalTvPages;
    } else {
      return currentMoviePage < totalMoviePages || currentTvPage < totalTvPages;
    }
  };

  // Memoize filtered movies to prevent recalculation on every render
  const filteredMovies = useMemo(() => {
    if (filter === FILTER_TYPES.ALL) return movies;
    if (filter === FILTER_TYPES.TO_WATCH) return movies.filter(m => !userRatings[m.id] || userRatings[m.id] === RATING_TYPES.UNRATED);
    return movies.filter(m => userRatings[m.id] === filter);
  }, [movies, userRatings, filter]);

  // Memoize filter counts to prevent recalculation on every render
  const filterCounts = useMemo(() => {
    return {
      all: movies.length,
      [FILTER_TYPES.LOVED]: movies.filter(m => userRatings[m.id] === RATING_TYPES.LOVED).length,
      [FILTER_TYPES.WATCHED]: movies.filter(m => userRatings[m.id] === RATING_TYPES.WATCHED).length,
      [FILTER_TYPES.PASS]: movies.filter(m => userRatings[m.id] === RATING_TYPES.PASS).length,
      [FILTER_TYPES.TO_WATCH]: movies.filter(m => !userRatings[m.id] || userRatings[m.id] === RATING_TYPES.UNRATED).length
    };
  }, [movies, userRatings]);

  const renderFilterButton = React.useCallback((key, label, icon) => {
    const count = filterCounts[key];

    return (
      <button
        onClick={() => setFilter(key)}
        className={`btn filter-btn ${key} ${filter === key ? 'active' : ''}`}
      >
        {icon}
        <span>{label} ({count})</span>
      </button>
    );
  }, [filterCounts, filter]);

  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="loading-indicator-content">
          <Loader2 size={48} className="spinner" />
          <p>Loading Sci-Fi Universe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-indicator">
        <div className="error-indicator-content">
          <AlertCircle size={48} className="error-icon" />
          <p className="error-message">{error}</p>
          <p className="error-subtext">Please check your connection and try again.</p>
          <div className="error-indicator-controls">
            <button onClick={() => fetchSciFiContent(false, true, null)} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="app-container">
      <div className="animated-background">
        <div className="bg-shape1"></div>
        <div className="bg-shape2"></div>
      </div>
      <div className="main-content">
        <header className="app-header">
          <div className="header-content">
            <div className="header-top">
              <div className="header-title">
                <Sparkles size={36} className="text-blue-400" />
                <h1>Sci-Fi Tracker</h1>
              </div>
              <div className="header-controls">
                <div className="content-type-selector">
                  <button
                    onClick={() => setContentType(CONTENT_TYPES.ALL)}
                    className={`content-type-btn ${contentType === CONTENT_TYPES.ALL ? 'active' : ''}`}
                  >
                    {CONTENT_TYPE_LABELS[CONTENT_TYPES.ALL]}
                  </button>
                  <button
                    onClick={() => setContentType(CONTENT_TYPES.MOVIES)}
                    className={`content-type-btn ${contentType === CONTENT_TYPES.MOVIES ? 'active' : ''}`}
                  >
                    {CONTENT_TYPE_LABELS[CONTENT_TYPES.MOVIES]}
                  </button>
                  <button
                    onClick={() => setContentType(CONTENT_TYPES.TV)}
                    className={`content-type-btn ${contentType === CONTENT_TYPES.TV ? 'active' : ''}`}
                  >
                    {CONTENT_TYPE_LABELS[CONTENT_TYPES.TV]}
                  </button>
                </div>
                <button
                  onClick={() => fetchSciFiContent(false, true, null)}
                  className="btn btn-primary"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="filter-controls">
              {renderFilterButton(FILTER_TYPES.ALL, FILTER_LABELS[FILTER_TYPES.ALL], null)}
              {renderFilterButton(FILTER_TYPES.LOVED, FILTER_LABELS[FILTER_TYPES.LOVED], <Heart size={14} />)}
              {renderFilterButton(FILTER_TYPES.WATCHED, FILTER_LABELS[FILTER_TYPES.WATCHED], <Eye size={14} />)}
              {renderFilterButton(FILTER_TYPES.PASS, FILTER_LABELS[FILTER_TYPES.PASS], <EyeOff size={14} />)}
              {renderFilterButton(FILTER_TYPES.TO_WATCH, FILTER_LABELS[FILTER_TYPES.TO_WATCH], null)}
            </div>
          </div>
        </header>
        <main>
          {filteredMovies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <Filter size={64} className="empty-icon" />
                <p>No titles match the current filter.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="content-grid">
                {filteredMovies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    userRatings={userRatings}
                    comments={comments}
                    setRating={setRating}
                    setComment={setComment}
                  />
                ))}
              </div>
              {canLoadMore() && (
                <div className="load-more-section">
                  <button
                    onClick={loadMoreContent}
                    disabled={loadingMore}
                    className="btn btn-primary load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={16} className="spinner" />
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        <span>Load More Content</span>
                      </>
                    )}
                  </button>
                  <p className="load-more-info">
                    {contentType === CONTENT_TYPES.MOVIES && `Movies: Page ${Math.ceil(currentMoviePage/3)} of ${Math.ceil(totalMoviePages/3)}`}
                    {contentType === CONTENT_TYPES.TV && `TV Shows: Page ${Math.ceil(currentTvPage/3)} of ${Math.ceil(totalTvPages/3)}`}
                    {contentType === CONTENT_TYPES.ALL && `Movies: Page ${Math.ceil(currentMoviePage/3)} of ${Math.ceil(totalMoviePages/3)} | TV: Page ${Math.ceil(currentTvPage/3)} of ${Math.ceil(totalTvPages/3)}`}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <SciFiTracker />
  </ErrorBoundary>
);

// Export SciFiTracker for testing
export { SciFiTracker };
export default App;
