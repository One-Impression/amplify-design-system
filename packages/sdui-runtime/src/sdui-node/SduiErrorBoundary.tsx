import React from "react";
import type { ReactNode } from "react";

interface Props {
  nodeId: string;
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SduiErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
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
      return this.props.fallback;
    }
    return this.props.children;
  }
}
