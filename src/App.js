import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Heart, Filter, Sparkles, Loader2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

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
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-yellow-400 font-bold">{movie.imdbRating}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
      </div>

      <div className="relative p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 leading-tight">{movie.title}</h3>
          <p className="text-xs text-gray-400 font-medium">{movie.type} • {movie.year}</p>
          <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{movie.synopsis}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setRating(movie.id, rating === 'loved' ? '' : 'loved')}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              rating === 'loved' 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/50' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${rating === 'loved' ? 'fill-white' : ''}`} />
            <span className="font-semibold">Loved it</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setRating(movie.id, rating === 'watched' ? '' : 'watched')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                rating === 'watched' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="font-medium">Watched</span>
            </button>
            <button
              onClick={() => setRating(movie.id, rating === 'not-interested' ? '' : 'not-interested')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                rating === 'not-interested' 
                  ? 'bg-gray-600 text-white ring-2 ring-gray-500/50' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <EyeOff className="w-3 h-3" />
              <span className="font-medium">Pass</span>
            </button>
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(movie.id, e.target.value)}
          placeholder="Add your thoughts..."
          className="w-full bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg p-3 min-h-[70px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-600"
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

  // Load saved data from state
  useEffect(() => {
    const savedRatings = localStorage.getItem('scifiRatings');
    const savedComments = localStorage.getItem('scifiComments');
    const savedMockMode = localStorage.getItem('scifiMockMode');
    
    if (savedRatings) setUserRatings(JSON.parse(savedRatings));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedMockMode !== null) setUseMockData(JSON.parse(savedMockMode));
  }, []);

  // Save ratings to localStorage
  useEffect(() => {
    localStorage.setItem('scifiRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  // Save comments to localStorage
  useEffect(() => {
    localStorage.setItem('scifiComments', JSON.stringify(comments));
  }, [comments]);

  // Save mock mode preference
  useEffect(() => {
    localStorage.setItem('scifiMockMode', JSON.stringify(useMockData));
  }, [useMockData]);

  // Fetch content based on mode
  useEffect(() => {
    if (useMockData) {
      loadMockData();
    } else {
      fetchSciFiContent();
    }
  }, [useMockData]);

  const loadMockData = () => {
    setLoading(true);
    // Simulate API loading delay
    setTimeout(() => {
      setMovies(mockSciFiContent);
      setError(null);
      setLoading(false);
    }, 1000);
  };

  const fetchSciFiContent = async () => {
    try {
      setLoading(true);
      
      // TMDB API configuration
      const API_KEY = '786f761996ec79129e5c32f42bed5760';
      
      // Using a CORS proxy to bypass browser CORS restrictions
      // Note: In production, you should use your own backend server to make these API calls
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
      const BASE_URL = 'https://api.themoviedb.org/3';
      
      // Alternative free CORS proxies if the above doesn't work:
      // const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
      // const CORS_PROXY = 'https://cors-proxy.htmldriven.com/?url=';
      
      try {
        // Try fetching with CORS proxy
        const [moviesResponse, tvResponse] = await Promise.all([
          fetch(`${CORS_PROXY}${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&sort_by=popularity.desc&page=1`),
          fetch(`${CORS_PROXY}${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10765&sort_by=popularity.desc&page=1`)
        ]);
        
        if (!moviesResponse.ok || !tvResponse.ok) {
          throw new Error('Failed to fetch data from TMDB');
        }
        
        const moviesData = await moviesResponse.json();
        const tvData = await tvResponse.json();
        
        // Process and combine movies and TV shows
        const processedMovies = moviesData.results.slice(0, 8).map(movie => ({
          id: `movie-${movie.id}`,
          title: movie.title,
          type: "Movie",
          year: new Date(movie.release_date).getFullYear() || 'TBA',
          poster: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop`,
          synopsis: movie.overview || "No synopsis available.",
          imdbRating: movie.vote_average.toFixed(1)
        }));
        
        const processedTVShows = tvData.results.slice(0, 8).map(show => ({
          id: `tv-${show.id}`,
          title: show.name,
          type: "TV Series",
          year: new Date(show.first_air_date).getFullYear() || 'TBA',
          poster: show.poster_path 
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : `https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=600&fit=crop`,
          synopsis: show.overview || "No synopsis available.",
          imdbRating: show.vote_average.toFixed(1)
        }));
        
        // Combine and sort by rating
        const allContent = [...processedMovies, ...processedTVShows]
          .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        
        setMovies(allContent);
        setError(null);
      } catch (corsError) {
        // If CORS proxy fails, show informative error
        console.error('CORS proxy error:', corsError);
        throw new Error('CORS proxy unavailable. The TMDB API cannot be accessed directly from browsers due to CORS restrictions.');
      }
    } catch (err) {
      setError(`${err.message} Switching to mock data...`);
      console.error('Error fetching data:', err);
      // Auto-switch to mock data on error
      setTimeout(() => {
        setUseMockData(true);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const setRating = (movieId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating
    }));
  };

  const setComment = (movieId, comment) => {
    setComments(prev => ({
      ...prev,
      [movieId]: comment
    }));
  };

  const getFilteredMovies = () => {
    switch (filter) {
      case 'loved':
        return movies.filter(m => userRatings[m.id] === 'loved');
      case 'watched':
        return movies.filter(m => userRatings[m.id] === 'watched');
      case 'not-interested':
        return movies.filter(m => userRatings[m.id] === 'not-interested');
      case 'unwatched':
        return movies.filter(m => !userRatings[m.id] || userRatings[m.id] === '');
      default:
        return movies;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading sci-fi content...</p>
        </div>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-gray-400">{error}</p>
          <p className="text-xs text-gray-500">
            Unable to connect to TMDB API. Switching to mock data...
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={fetchSciFiContent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => setUseMockData(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Use Mock Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredMovies = getFilteredMovies();

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gray-900 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sci-Fi Tracker
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Data Source Toggle */}
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                  <span className={`text-sm ${!useMockData ? 'text-blue-400' : 'text-gray-400'}`}>TMDB</span>
                  <button
                    onClick={() => setUseMockData(!useMockData)}
                    className="relative"
                  >
                    {useMockData ? (
                      <ToggleRight className="w-8 h-8 text-gray-400 hover:text-gray-300 transition-colors" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-blue-400 hover:text-blue-300 transition-colors" />
                    )}
                  </button>
                  <span className={`text-sm ${useMockData ? 'text-blue-400' : 'text-gray-400'}`}>Mock</span>
                </div>
                <button
                  onClick={useMockData ? loadMockData : fetchSciFiContent}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All ({movies.length})
              </button>
              <button
                onClick={() => setFilter('loved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === 'loved' 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                Loved ({movies.filter(m => userRatings[m.id] === 'loved').length})
              </button>
              <button
                onClick={() => setFilter('watched')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === 'watched' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                Watched ({movies.filter(m => userRatings[m.id] === 'watched').length})
              </button>
              <button
                onClick={() => setFilter('not-interested')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === 'not-interested' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                Not Interested ({movies.filter(m => userRatings[m.id] === 'not-interested').length})
              </button>
              <button
                onClick={() => setFilter('unwatched')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'unwatched' 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Unwatched ({movies.filter(m => !userRatings[m.id] || userRatings[m.id] === '').length})
              </button>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <main className="container mx-auto px-4 py-8">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No titles found with current filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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