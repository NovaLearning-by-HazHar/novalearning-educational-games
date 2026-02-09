'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-amber-50 p-4">
            <div className="text-center">
              <p className="text-4xl mb-4" aria-hidden="true">🦁</p>
              <p className="text-lg font-medium text-amber-900">
                Oops! Let&apos;s try again!
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-xl text-lg active:scale-95 transition-transform"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
