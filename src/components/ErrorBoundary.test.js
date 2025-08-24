import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    console.error.mockClear();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  test('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an unexpected error. This might be a temporary issue.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
  });

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test('try again button resets error state', () => {
    const mockOnRetry = jest.fn();
    
    render(
      <ErrorBoundary onRetry={mockOnRetry}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainButton);

    // Verify the retry handler is called
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('reload page button triggers page reload', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        reload: mockReload,
      },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /Reload Page/i });
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test('calls onRetry prop when provided', () => {
    const mockOnRetry = jest.fn();

    render(
      <ErrorBoundary onRetry={mockOnRetry}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  test('reports error to monitoring service if available', () => {
    const mockReportError = jest.fn();
    window.reportError = mockReportError;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockReportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );

    delete window.reportError;
  });
});