import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Heart, Filter, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';


const MovieCard = ({ movie, userRatings, comments, setRating, setComment }) => {
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
            onClick={() => setRating(movie.id, rating === 'loved' ? '' : 'loved')}
            className={`action-btn loved ${rating === 'loved' ? 'active' : ''}`}
          >
            <Heart className="heart-icon" size={14} />
            <span>Loved it</span>
          </button>
          <div className="action-btn-group">
            <button
              onClick={() => setRating(movie.id, rating === 'watched' ? '' : 'watched')}
              className={`action-btn watched ${rating === 'watched' ? 'active' : ''}`}
            >
              <Eye size={14} />
              <span>Watched</span>
            </button>
            <button
              onClick={() => setRating(movie.id, rating === 'pass' ? '' : 'pass')}
              className={`action-btn pass ${rating === 'pass' ? 'active' : ''}`}
            >
              <EyeOff size={14} />
              <span>Pass</span>
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
};

const SciFiTracker = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [userRatings, setUserRatings] = useState({});
  const [comments, setComments] = useState({});
  const [contentType, setContentType] = useState('all');
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentTvPage, setCurrentTvPage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [totalTvPages, setTotalTvPages] = useState(1);
  const [cachedData, setCachedData] = useState({});

  useEffect(() => {
    const savedRatings = localStorage.getItem('scifiRatings');
    const savedComments = localStorage.getItem('scifiComments');
    const savedContentType = localStorage.getItem('scifiContentType');
    const savedFilter = localStorage.getItem('scifiFilter');
    const savedMoviePage = localStorage.getItem('scifiMoviePage');
    const savedTvPage = localStorage.getItem('scifiTvPage');
    const savedCachedData = sessionStorage.getItem('scifiCachedData');
    
    console.log('Loading saved data from localStorage:', {
      ratingsCount: savedRatings ? Object.keys(JSON.parse(savedRatings)).length : 0,
      commentsCount: savedComments ? Object.keys(JSON.parse(savedComments)).length : 0,
      filter: savedFilter || 'all',
      contentType: savedContentType || 'all',
      moviePage: savedMoviePage || 1,
      tvPage: savedTvPage || 1
    });
    
    if (savedRatings) setUserRatings(JSON.parse(savedRatings));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedContentType) setContentType(savedContentType);
    if (savedFilter) setFilter(savedFilter);
    if (savedMoviePage) setCurrentMoviePage(parseInt(savedMoviePage));
    if (savedTvPage) setCurrentTvPage(parseInt(savedTvPage));
    if (savedCachedData) setCachedData(JSON.parse(savedCachedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('scifiRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem('scifiComments', JSON.stringify(comments));
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
    fetchSciFiContent();
  }, [contentType]);

  const fetchSciFiContent = async (append = false) => {
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
        }
      };
      
      // Check cache first
      const cacheKey = `movies-${currentMoviePage}-tv-${currentTvPage}`;
      if (cachedData[cacheKey] && !append) {
        console.log('Using cached data for', cacheKey);
        setMovies(cachedData[cacheKey]);
        setLoading(false);
        return;
      }
      
      // Fetch multiple pages for initial load
      const pagesToFetch = append ? 1 : 3;
      const moviePromises = [];
      const tvPromises = [];
      
      // Only fetch based on content type
      if (contentType === 'all' || contentType === 'movies') {
        for (let i = 0; i < pagesToFetch; i++) {
          const moviePage = append ? currentMoviePage + i : i + 1;
          moviePromises.push(
            fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=878&sort_by=popularity.desc&page=${moviePage}`, options)
          );
        }
      }
      
      if (contentType === 'all' || contentType === 'tv') {
        for (let i = 0; i < pagesToFetch; i++) {
          const tvPage = append ? currentTvPage + i : i + 1;
          tvPromises.push(
            fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=10765&sort_by=popularity.desc&page=${tvPage}`, options)
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
          const processedMovies = data.results.map(movie => ({
            id: `movie-${movie.id}`,
            title: movie.title,
            type: "Movie",
            year: new Date(movie.release_date).getFullYear() || 'TBA',
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop`,
            synopsis: movie.overview || "No synopsis available.",
            imdbRating: movie.vote_average.toFixed(1)
          }));
          allMovies.push(...processedMovies);
        });
      }
      
      if (tvDataArray.length > 0) {
        tvDataArray.forEach(data => {
          const processedTVShows = data.results.map(show => ({
            id: `tv-${show.id}`,
            title: show.name,
            type: "TV Series",
            year: new Date(show.first_air_date).getFullYear() || 'TBA',
            poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : `https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=600&fit=crop`,
            synopsis: show.overview || "No synopsis available.",
            imdbRating: show.vote_average.toFixed(1)
          }));
          allTVShows.push(...processedTVShows);
        });
      }
      
      const newContent = [...allMovies, ...allTVShows]
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
      
      if (append) {
        setMovies(prev => {
          const combined = [...prev, ...newContent];
          // Remove duplicates
          const unique = combined.filter((item, index, arr) => 
            arr.findIndex(i => i.id === item.id) === index
          );
          return unique.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        });
      } else {
        setMovies(newContent);
        // Cache the data
        setCachedData(prev => ({
          ...prev,
          [cacheKey]: newContent
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const setRating = (movieId, rating) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
  };

  const setComment = (movieId, comment) => {
    setComments(prev => ({ ...prev, [movieId]: comment }));
  };

  const loadMoreContent = async () => {
    if (contentType === 'all' || contentType === 'movies') {
      setCurrentMoviePage(currentMoviePage + 3);
    }
    if (contentType === 'all' || contentType === 'tv') {
      setCurrentTvPage(currentTvPage + 3);
    }
    
    await fetchSciFiContent(true);
  };

  const canLoadMore = () => {
    if (contentType === 'movies') {
      return currentMoviePage < totalMoviePages;
    } else if (contentType === 'tv') {
      return currentTvPage < totalTvPages;
    } else {
      return currentMoviePage < totalMoviePages || currentTvPage < totalTvPages;
    }
  };

  const getFilteredMovies = () => {
    if (filter === 'all') return movies;
    if (filter === 'unwatched') return movies.filter(m => !userRatings[m.id] || userRatings[m.id] === '');
    return movies.filter(m => userRatings[m.id] === filter);
  };

  const renderFilterButton = (key, label, icon) => {
    const count = key === 'all' 
      ? movies.length 
      : key === 'unwatched'
        ? movies.filter(m => !userRatings[m.id] || userRatings[m.id] === '').length
        : movies.filter(m => userRatings[m.id] === key).length;

    return (
      <button
        onClick={() => setFilter(key)}
        className={`btn filter-btn ${key} ${filter === key ? 'active' : ''}`}
      >
        {icon}
        <span>{label} ({count})</span>
      </button>
    );
  }

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

  if (error && !useMockData) {
    return (
      <div className="error-indicator">
        <div className="error-indicator-content">
          <AlertCircle size={48} className="error-icon" />
          <p className="error-message">{error}</p>
          <p className="error-subtext">Switching to mock data as a fallback.</p>
          <div className="error-indicator-controls">
            <button onClick={fetchSciFiContent} className="btn btn-primary">
              Retry
            </button>
            <button onClick={() => setUseMockData(true)} className="btn">
              Use Mock Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredMovies = getFilteredMovies();

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
                    onClick={() => setContentType('all')}
                    className={`content-type-btn ${contentType === 'all' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setContentType('movies')}
                    className={`content-type-btn ${contentType === 'movies' ? 'active' : ''}`}
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => setContentType('tv')}
                    className={`content-type-btn ${contentType === 'tv' ? 'active' : ''}`}
                  >
                    TV Shows
                  </button>
                </div>
                <button
                  onClick={() => fetchSciFiContent()}
                  className="btn btn-primary"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="filter-controls">
              {renderFilterButton('all', 'All', null)}
              {renderFilterButton('loved', 'Loved', <Heart size={14} />)}
              {renderFilterButton('watched', 'Watched', <Eye size={14} />)}
              {renderFilterButton('pass', 'Pass', <EyeOff size={14} />)}
              {renderFilterButton('unwatched', 'Unwatched', null)}
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
              {Object.keys(userRatings).length > 0 && (
                <div className="content-info">
                  <p className="data-restored">
                    ✅ Your ratings and comments have been restored
                  </p>
                </div>
              )}
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
                    {contentType === 'movies' && `Movies: Page ${Math.ceil(currentMoviePage/3)} of ${Math.ceil(totalMoviePages/3)}`}
                    {contentType === 'tv' && `TV Shows: Page ${Math.ceil(currentTvPage/3)} of ${Math.ceil(totalTvPages/3)}`}
                    {contentType === 'all' && `Movies: Page ${Math.ceil(currentMoviePage/3)} of ${Math.ceil(totalMoviePages/3)} | TV: Page ${Math.ceil(currentTvPage/3)} of ${Math.ceil(totalTvPages/3)}`}
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

export default SciFiTracker;
