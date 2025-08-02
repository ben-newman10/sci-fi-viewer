# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based sci-fi movie and TV series tracker application that allows users to discover, rate, and comment on science fiction content. The app integrates with The Movie Database (TMDB) API and provides a fallback to mock data.

## Development Commands

```bash
# Start development server with hot reloading
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (use with caution)
npm run eject
```

## Development Techniques

- When implementing a change, use Puppeteer to iterate on localhost:3000 and test changes in real-time using the Puppeteer MCP server integration.

## Architecture Overview

### Core Structure
- **Single Page Application**: Built with Create React App
- **Component Architecture**: Main `SciFiTracker` component with extracted `MovieCard` component
- **State Management**: React hooks (`useState`, `useEffect`) for local state
- **Data Persistence**: localStorage for user ratings and comments
- **Styling**: Tailwind CSS with custom utilities

### Key Components

**SciFiTracker** (`src/App.js`):
- Main application component managing all state
- Handles data fetching from TMDB API or mock data
- Manages filtering logic for different rating states
- Contains all business logic for rating and commenting

**MovieCard** (extracted component in `src/App.js`):
- Displays individual movie/TV show information
- Handles user interactions (rating buttons, comments)
- Receives props from parent to avoid re-rendering issues

### Data Flow

1. **Data Sources**: 
   - Primary: TMDB API (requires CORS proxy)
   - Fallback: Mock sci-fi content array
   - Toggle between sources via UI control

2. **User Data**: 
   - Ratings stored as `{ movieId: 'loved' | 'watched' | 'not-interested' }`
   - Comments stored as `{ movieId: string }`
   - Both persisted to localStorage with keys `scifiRatings` and `scifiComments`

3. **Filtering**: Real-time filtering based on user ratings with live count updates

### API Integration

**TMDB API Configuration**:
- Uses genre ID 878 for sci-fi movies, 10765 for sci-fi TV shows
- Requires CORS proxy (currently `cors-anywhere.herokuapp.com`)
- API key embedded in code: `786f761996ec79129e5c32f42bed5760`
- Automatically falls back to mock data on API failure

### Styling Architecture

- **Base**: Tailwind CSS via CDN
- **Theme**: Dark space theme with blues, purples, and grays
- **Custom Utilities**: Line clamp utilities in `src/index.css`
- **Components**: Card-based layout with hover animations and transitions

### Critical Implementation Notes

1. **Component Re-rendering Fix**: MovieCard component must be defined outside SciFiTracker to prevent textarea focus loss
2. **Image Handling**: Uses Unsplash images with sci-fi themes as placeholders
3. **Responsive Design**: Grid system adapts from 1 column to 6 columns based on screen size
4. **State Persistence**: All user data automatically saves on change

### Common Issues

- **Textarea Focus Loss**: Ensure MovieCard is not redefined inside parent component
- **CORS Issues**: TMDB API requires proxy; app gracefully degrades to mock data
- **Image Loading**: Some Unsplash URLs may break; update with working sci-fi themed alternatives