import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="card max-w-md rounded-2xl p-8">
            <p className="text-3xl">⚠</p>
            <h2 className="mt-3 text-xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-sm text-white/65">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40"
              >
                Try again
              </button>
              <Link
                to="/"
                className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-ember-400"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
