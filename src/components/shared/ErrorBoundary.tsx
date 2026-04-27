import * as Sentry from '@sentry/react-native';
import { Component, type ReactNode } from 'react';
import { Text, View, Pressable } from 'react-native';

interface Props {
  screenName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    Sentry.captureException(error, {
      tags: { screenName: this.props.screenName },
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View
          accessibilityRole="alert"
          accessibilityLabel={`Error on ${this.props.screenName}`}
          className="flex-1 items-center justify-center bg-ohanafy-paper px-6 dark:bg-ohanafy-dark-surface"
        >
          <Text className="mb-3 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
            Something went wrong
          </Text>
          <Text className="mb-6 text-center text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
            {this.props.screenName} hit an unexpected error. Your work is safe.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try again"
            accessibilityHint="Resets the error and reloads this screen"
            onPress={this.reset}
            className="rounded-xl bg-ohanafy-denim px-6 py-3 active:opacity-80"
          >
            <Text className="text-base font-bold text-ohanafy-paper">Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
