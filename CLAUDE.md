# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based sci-fi movie and TV series tracker application that allows users to discover, rate, and comment on science fiction content. The app integrates with The Movie Database (TMDB) API and provides a fallback to mock data.

**Live Application**: https://ben-newman10.github.io/sci-fi-viewer

## Development Commands

```bash
# Start development server with hot reloading
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to GitHub Pages manually
npm run deploy

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
- Direct API calls using Bearer token authentication
- API key stored as environment variable: `REACT_APP_TMDB_API_KEY`
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

## Deployment

**GitHub Pages Deployment**:
- Automatic deployment on every push to main branch via GitHub Actions
- Uses Node.js 18 and npm ci for consistent builds
- TMDB API key securely stored as GitHub repository secret
- GitHub Pages configured to deploy from GitHub Actions (not branch)

**Deployment Configuration**:
- Homepage URL: `https://ben-newman10.github.io/sci-fi-viewer`
- Build directory: `build/`
- Environment variables: `REACT_APP_TMDB_API_KEY` (GitHub secret)

### Common Issues

- **Textarea Focus Loss**: Ensure MovieCard is not redefined inside parent component
- **API Authentication**: Ensure TMDB API key is properly set in GitHub secrets
- **Image Loading**: Some Unsplash URLs may break; update with working sci-fi themed alternatives
- **Build Failures**: Check that all environment variables are properly configured in GitHub Actions