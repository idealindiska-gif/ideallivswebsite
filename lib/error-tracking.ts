/**
 * Error Tracking Utility
 *
 * Simple error tracking that logs to console and can be easily upgraded to Sentry/LogRocket
 *
 * To upgrade to Sentry:
 * 1. npm install @sentry/nextjs
 * 2. npx @sentry/wizard@latest -i nextjs
 * 3. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 * 4. Uncomment Sentry code below
 */

// import * as Sentry from '@sentry/nextjs';

interface ErrorContext {
  [key: string]: any;
}

interface ErrorTrackingConfig {
  enabled: boolean;
  environment: string;
  userId?: string;
}

class ErrorTracker {
  private config: ErrorTrackingConfig;

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      environment: process.env.NODE_ENV || 'development',
    };

    // Initialize Sentry if available
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.init({
    //     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //     environment: this.config.environment,
    //     tracesSampleRate: 0.1,
    //   });
    // }
  }

  /**
   * Track an error
   */
  captureError(error: Error, context?: ErrorContext) {
    // Always log to console
    console.error('Error tracked:', error, context);

    if (!this.config.enabled) {
      return;
    }

    // Send to Sentry if available
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error, {
    //     extra: context,
    //   });
    // }

    // Send to custom error endpoint
    this.sendToErrorEndpoint(error, context);
  }

  /**
   * Track API errors specifically
   */
  captureAPIError(
    endpoint: string,
    statusCode: number,
    errorMessage: string,
    context?: ErrorContext
  ) {
    const error = new Error(`API Error: ${errorMessage}`);

    this.captureError(error, {
      ...context,
      type: 'api_error',
      endpoint,
      statusCode,
    });
  }

  /**
   * Track network timeouts
   */
  captureTimeout(endpoint: string, timeoutMs: number, context?: ErrorContext) {
    const error = new Error(`Request timeout: ${endpoint} after ${timeoutMs}ms`);

    this.captureError(error, {
      ...context,
      type: 'timeout_error',
      endpoint,
      timeoutMs,
    });
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string) {
    this.config.userId = userId;

    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.setUser({ id: userId, email });
    // }
  }

  /**
   * Clear user context
   */
  clearUser() {
    this.config.userId = undefined;

    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.setUser(null);
    // }
  }

  /**
   * Send error to custom backend endpoint
   */
  private async sendToErrorEndpoint(error: Error, context?: ErrorContext) {
    try {
      // Only send in production
      if (process.env.NODE_ENV !== 'production') {
        return;
      }

      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        }),
      }).catch(err => {
        // Silently fail - don't want error tracking to break the app
        console.warn('Failed to send error to logging endpoint:', err);
      });
    } catch (err) {
      // Silently fail
      console.warn('Error tracking failed:', err);
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, data?: ErrorContext) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Breadcrumb:', message, data);
    }

    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.addBreadcrumb({
    //     message,
    //     data,
    //   });
    // }
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

/**
 * React error boundary helper
 */
export function logComponentError(error: Error, errorInfo: React.ErrorInfo) {
  errorTracker.captureError(error, {
    type: 'react_error',
    componentStack: errorInfo.componentStack,
  });
}
