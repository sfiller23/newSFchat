import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error;
  errorInfo?: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: { name: "", message: "" },
      errorInfo: "",
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ): Partial<ErrorBoundaryState> {
    // You can log the error to an error reporting service here

    console.error("ErrorBoundary caught an error", error, errorInfo);
    return { error: error, errorInfo: errorInfo.componentStack };
  }

  render() {
    if (this.state.hasError) {
      // You can customize this fallback UI
      return <h1>Something went wrong</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
