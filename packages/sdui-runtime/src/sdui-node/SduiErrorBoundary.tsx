import React from "react";
import type { ReactNode } from "react";

interface Props {
  nodeId: string;
  /**
   * Render the fallback for a caught render error. Receives the error so dev
   * fallbacks can surface the message (a static node can't — only schema-parse
   * fallbacks had the message before, render-throws showed a bare label).
   */
  renderFallback: (error?: Error) => ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SduiErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    // Log to telemetry — one bad node shouldn't crash the tree
    console.warn(
      `[SduiErrorBoundary] Node "${this.props.nodeId}" threw:`,
      error.message,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.renderFallback(this.state.error);
    }
    return this.props.children;
  }
}
