# Sci-Fi Tracker 🚀

A React-based web application for discovering, rating, and tracking science fiction movies and TV series. The app integrates with The Movie Database (TMDB) API and provides elegant fallback to curated mock data.

🌐 **Live Demo**: [https://ben-newman10.github.io/sci-fi-viewer](https://ben-newman10.github.io/sci-fi-viewer)

## Features

- **Discover Sci-Fi Content**: Browse movies and TV series with detailed information
- **Personal Ratings**: Rate content as "Loved it", "Watched", or "Pass"
- **Comments**: Add personal thoughts and reviews for each title
- **Smart Filtering**: Filter content by your ratings with live count updates
- **Data Sources**: Toggle between TMDB API and curated mock data
- **Responsive Design**: Beautiful dark theme optimized for all screen sizes
- **Persistent Storage**: Your ratings and comments are saved locally

## Screenshots

The app features a modern dark space theme with smooth animations and hover effects, displaying content in an adaptive grid layout.

## Tech Stack

- **React** - UI framework with hooks for state management
- **Tailwind CSS** - Utility-first CSS framework for styling
- **TMDB API** - The Movie Database API for live content
- **Local Storage** - Client-side persistence for user data
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ben-newman10/sci-fi-viewer.git
cd sci-fi-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode with hot reloading
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Manually deploy to GitHub Pages
- `npm run eject` - Ejects from Create React App (use with caution)

## Usage

1. **Browse Content**: View the curated collection of sci-fi movies and TV series
2. **Rate Items**: Click the rating buttons to mark content as loved, watched, or pass
3. **Add Comments**: Use the text area to add your personal thoughts
4. **Filter**: Use the filter buttons to view content by rating status
5. **Toggle Data Source**: Switch between TMDB API and mock data using the toggle

## Data Sources

### TMDB API
- Live data from The Movie Database
- Sci-fi movies (genre ID: 878) and TV shows (genre ID: 10765)
- Direct API calls using Bearer token authentication
- Automatic fallback to mock data on failure

### Mock Data
- Curated collection of popular sci-fi content
- Includes recent releases and classics
- Always available as fallback

## Architecture

- **Component Structure**: Main `SciFiTracker` component with extracted `MovieCard`
- **State Management**: React hooks (`useState`, `useEffect`)
- **Data Persistence**: localStorage for ratings and comments
- **Styling**: Tailwind CSS with custom utilities and animations

## Deployment

The app is automatically deployed to GitHub Pages using GitHub Actions:

- **Automatic Deployment**: Every push to the `main` branch triggers a new deployment
- **Build Process**: Uses Node.js 18 and npm ci for consistent builds
- **Environment Variables**: TMDB API key is securely stored as a GitHub secret
- **GitHub Pages**: Deployed using the official GitHub Pages actions

### Manual Deployment

You can also deploy manually using:
```bash
npm run deploy
```

### Environment Setup

For TMDB API integration, you'll need:
1. A TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Set `REACT_APP_TMDB_API_KEY` as a GitHub repository secret
3. Configure GitHub Pages source as "GitHub Actions"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the API
- [Unsplash](https://unsplash.com/) for placeholder images
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework