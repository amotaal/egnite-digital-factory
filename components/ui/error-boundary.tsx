"use client";
import React from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class EditorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[EditorErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-8 bg-cream">
          <div className="text-center max-w-md bg-white rounded-2xl border border-red-200 shadow-sm p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-ink mb-2">Something went wrong</h2>
            <p className="text-ink-muted text-sm mb-1">The editor encountered an unexpected error.</p>
            {this.state.error?.message && (
              <p className="text-xs font-mono bg-red-50 text-red-700 rounded-lg px-3 py-2 mt-3 mb-4 text-start break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors"
              >
                Try Again
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2 border border-gold-light text-gold rounded-lg text-sm font-medium hover:bg-cream-dark transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
