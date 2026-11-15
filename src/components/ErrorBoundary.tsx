"use client";

import Link from "next/link";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { logger } from "@services/logger";
import { reportCrash } from "@services/crashReporter";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(`[ErrorBoundary] render failed: ${errorInfo.componentStack}`, error);
    reportCrash("ErrorBoundary");
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return <ErrorFallback />;
  }
}

function ErrorFallback() {
  return (
    <main role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <p className="text-sm text-feedback-error">Something went wrong. Please try again.</p>
      <Link href="/" className="px-6 py-2 rounded-full bg-action-primary text-on-action-primary text-sm font-medium">
        Reload page
      </Link>
    </main>
  );
}
