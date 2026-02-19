/**
 * Strategy Pattern - Retry Strategies
 *
 * WHY: Allows defining different retry behaviors for different environments
 * (CI vs local) without changing the core test execution logic. Makes
 * test suite more adaptable to different network conditions and flake tolerance.
 *
 * VALUE:
 * - Flexible retry behavior - aggressive in CI, conservative locally
 * - Easy to add new strategies without modifying existing code
 * - Separates retry logic from test execution
 * - Different strategies for different test types (unit vs e2e)
 */
export interface RetryStrategy {
  /**
   * Determines if a test should be retried based on the error
   */
  shouldRetry(error: Error, attempt: number): boolean;

  /**
   * Returns the delay in milliseconds before next retry
   */
  getDelay(attempt: number): number;

  /**
   * Maximum number of retry attempts
   */
  maxAttempts: number;
}

/**
 * Aggressive retry strategy for CI environments
 * - More retries to handle flaky infrastructure
 * - Longer delays between retries
 * - Retries on almost all errors
 */
export class AggressiveRetryStrategy implements RetryStrategy {
  maxAttempts = 3;

  shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.maxAttempts) return false;

    // Retry on network errors, timeouts, and common flaky errors
    const retryableErrors = [
      'net::',
      'timeout',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'Failed to load',
      'Navigation',
    ];

    return retryableErrors.some((e) =>
      error.message.toLowerCase().includes(e.toLowerCase()),
    );
  }

  getDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.pow(2, attempt) * 1000;
  }
}

/**
 * Conservative retry strategy for local development
 * - Fewer retries to give fast feedback
 * - Shorter delays
 * - Only retries on clearly transient errors
 */
export class ConservativeRetryStrategy implements RetryStrategy {
  maxAttempts = 1;

  shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.maxAttempts) return false;

    // Only retry on obvious transient errors
    const retryableErrors = ['timeout', 'ECONNREFUSED', 'ETIMEDOUT'];

    return retryableErrors.some((e) =>
      error.message.toLowerCase().includes(e.toLowerCase()),
    );
  }

  getDelay(attempt: number): number {
    return 500;
  }
}

/**
 * Factory to create the appropriate retry strategy based on environment
 */
export class RetryStrategyFactory {
  static create(isCI: boolean): RetryStrategy {
    return isCI
      ? new AggressiveRetryStrategy()
      : new ConservativeRetryStrategy();
  }
}
