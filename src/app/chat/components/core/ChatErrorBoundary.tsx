'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Button } from '@/components/foundation/Button';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <AlertBar
            alerts={[this.state.error?.message || 'An error occurred']}
          />
          <div className="mt-4">
            <Button
              type="primary"
              callback={this.handleReset}
              label="Try Again"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
