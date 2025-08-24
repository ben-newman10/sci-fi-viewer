import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary component to catch and handle React component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to monitoring service if available
    if (window.reportError) {
      window.reportError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset error state and trigger re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Optional: trigger a page reload as fallback
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <AlertTriangle size={64} className="error-boundary-icon" />
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We encountered an unexpected error. This might be a temporary issue.
            </p>
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="btn btn-primary error-boundary-retry"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="btn error-boundary-reload"
              >
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-boundary-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;