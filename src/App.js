import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Heart, Filter, Sparkles, Loader2, AlertCircle, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import './App.css';

// Mock IMDB-style sci-fi data
const mockSciFiContent = [
    {
        id: 1,
        title: "Dune: Part Two",
        type: "Movie",
        year: 2024,
        poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&auto=format",
        synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        imdbRating: 8.5
      },
      {
        id: 2,
        title: "Foundation",
        type: "TV Series",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop&auto=format",
        synopsis: "A complex saga of humans scattered on planets throughout the galaxy all living under the rule of the Galactic Empire.",
        imdbRating: 7.3
      },
      {
        id: 3,
        title: "The Creator",
        type: "Movie",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop&auto=format",
        synopsis: "Against the backdrop of a war between humans and robots with artificial intelligence, a former soldier finds the secret weapon.",
        imdbRating: 6.8
      },
      {
        id: 4,
        title: "Silo",
        type: "TV Series",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&auto=format&sat=-100",
        synopsis: "Men and women live in a giant silo underground with several regulations which they believe are in place to protect them.",
        imdbRating: 8.1
      },
      {
        id: 5,
        title: "Rebel Moon",
        type: "Movie",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=600&fit=crop&auto=format",
        synopsis: "When a peaceful settlement on the edge of a distant moon finds itself threatened by a tyrannical ruling force, a stranger becomes their best hope.",
        imdbRating: 5.6
      },
      {
        id: 6,
        title: "For All Mankind",
        type: "TV Series",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop&auto=format",
        synopsis: "In an alternative version of 1969, the Soviet Union beats the United States to the Moon, and the space race continues for decades.",
        imdbRating: 8.0
      },
      {
        id: 7,
        title: "The Expanse",
        type: "TV Series",
        year: 2022,
        poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&auto=format",
        synopsis: "In the 24th century, a group of humans untangle a vast plot which threatens the Solar System's fragile state of detente.",
        imdbRating: 8.5
      },
      {
        id: 8,
        title: "Interstellar",
        type: "Movie",
        year: 2014,
        poster: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=400&h=600&fit=crop&auto=format",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        imdbRating: 8.7
      },
      {
        id: 9,
        title: "Stranger Things",
        type: "TV Series",
        year: 2024,
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop&auto=format",
        synopsis: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
        imdbRating: 8.7
      },
      {
        id: 10,
        title: "Blade Runner 2049",
        type: "Movie",
        year: 2017,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format",
        synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
        imdbRating: 8.0
      },
      {
        id: 11,
        title: "The Mandalorian",
        type: "TV Series",
        year: 2023,
        poster: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400&h=600&fit=crop&auto=format",
        synopsis: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
        imdbRating: 8.6
      },
      {
        id: 12,
        title: "Avatar: The Way of Water",
        type: "Movie",
        year: 2022,
        poster: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&h=600&fit=crop&auto=format",
        synopsis: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.",
        imdbRating: 7.6
      }
];

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
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [userRatings, setUserRatings] = useState({});
  const [comments, setComments] = useState({});
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem('scifiRatings');
    const savedComments = localStorage.getItem('scifiComments');
    const savedMockMode = localStorage.getItem('scifiMockMode');
    
    if (savedRatings) setUserRatings(JSON.parse(savedRatings));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedMockMode !== null) setUseMockData(JSON.parse(savedMockMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('scifiRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem('scifiComments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('scifiMockMode', JSON.stringify(useMockData));
  }, [useMockData]);

  useEffect(() => {
    if (useMockData) {
      loadMockData();
    } else {
      fetchSciFiContent();
    }
  }, [useMockData]);

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setMovies(mockSciFiContent);
      setError(null);
      setLoading(false);
    }, 500);
  };

  const fetchSciFiContent = async () => {
    setLoading(true);
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
      
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=878&sort_by=popularity.desc&page=1`, options),
        fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=10765&sort_by=popularity.desc&page=1`, options)
      ]);
      
      if (!moviesResponse.ok) {
        const errorMessage = await handleResponseError(moviesResponse);
        throw new Error(`Failed to fetch movies: ${errorMessage}`);
      }

      if (!tvResponse.ok) {
        const errorMessage = await handleResponseError(tvResponse);
        throw new Error(`Failed to fetch TV shows: ${errorMessage}`);
      }
      
      const moviesData = await moviesResponse.json();
      const tvData = await tvResponse.json();
      
      const processedMovies = moviesData.results.slice(0, 8).map(movie => ({
        id: `movie-${movie.id}`,
        title: movie.title,
        type: "Movie",
        year: new Date(movie.release_date).getFullYear() || 'TBA',
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop`,
        synopsis: movie.overview || "No synopsis available.",
        imdbRating: movie.vote_average.toFixed(1)
      }));
      
      const processedTVShows = tvData.results.slice(0, 8).map(show => ({
        id: `tv-${show.id}`,
        title: show.name,
        type: "TV Series",
        year: new Date(show.first_air_date).getFullYear() || 'TBA',
        poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : `https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=600&fit=crop`,
        synopsis: show.overview || "No synopsis available.",
        imdbRating: show.vote_average.toFixed(1)
      }));
      
      const allContent = [...processedMovies, ...processedTVShows]
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
      
      setMovies(allContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setRating = (movieId, rating) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
  };

  const setComment = (movieId, comment) => {
    setComments(prev => ({ ...prev, [movieId]: comment }));
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
                <div className="data-source-toggle">
                  <span className={!useMockData ? 'active' : 'inactive'}>TMDB</span>
                  <button
                    onClick={() => setUseMockData(!useMockData)}
                    className={`toggle-switch ${useMockData ? '' : 'active'}`}
                  >
                    {useMockData ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                  <span className={useMockData ? 'active' : 'inactive'}>Mock</span>
                </div>
                <button
                  onClick={useMockData ? loadMockData : fetchSciFiContent}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default SciFiTracker;
