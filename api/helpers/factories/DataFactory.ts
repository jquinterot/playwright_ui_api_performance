/**
 * Factory Pattern - Test Data Factory
 *
 * WHY: Generate realistic test data dynamically instead of hardcoding values.
 * Hardcoded data leads to brittle tests and data conflicts in parallel execution.
 *
 * VALUE:
 * - Unique data for each test (no conflicts in parallel runs)
 * - Realistic test data (lorem ipsum, fake emails, etc.)
 * - Easy to maintain - change defaults in one place
 * - Supports test data variations without duplication
 * - Reduces test maintenance when requirements change
 */
export interface Post {
  userId: number;
  id?: number;
  title: string;
  body: string;
}

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface Comment {
  postId: number;
  id?: number;
  name: string;
  email: string;
  body: string;
}

export class DataFactory {
  private static counter = 0;

  /**
   * Generate unique ID using timestamp + counter
   */
  private static generateId(): number {
    return Date.now() + ++this.counter;
  }

  /**
   * Create a post with dynamic data
   * @param overrides - Optional fields to override defaults
   */
  static createPost(overrides?: Partial<Post>): Post {
    const id = this.generateId();
    return {
      userId: 1,
      title: `Test Post Title ${id}`,
      body: `This is a test post body generated at ${new Date().toISOString()}. It contains sample content for testing purposes.`,
      ...overrides,
    };
  }

  /**
   * Create multiple posts
   */
  static createPosts(count: number, overrides?: Partial<Post>): Post[] {
    return Array.from({ length: count }, (_, i) =>
      this.createPost({ ...overrides, userId: overrides?.userId || i + 1 }),
    );
  }

  /**
   * Create a user with dynamic data
   */
  static createUser(overrides?: Partial<User>): User {
    const id = this.generateId();
    return {
      name: `Test User ${id}`,
      username: `testuser_${id}`,
      email: `test_${id}@example.com`,
      phone: `555-0${(id % 1000).toString().padStart(3, '0')}-${(id % 10000)
        .toString()
        .padStart(4, '0')}`,
      website: `test${id}.com`,
      ...overrides,
    };
  }

  /**
   * Create a comment for a post
   */
  static createComment(postId: number, overrides?: Partial<Comment>): Comment {
    const id = this.generateId();
    return {
      postId,
      name: `Commenter ${id}`,
      email: `commenter_${id}@test.com`,
      body: `This is a test comment ${id}. Great post!`,
      ...overrides,
    };
  }

  /**
   * Create invalid post data for negative testing
   */
  static createInvalidPost(
    type: 'empty' | 'long_title' | 'missing_body',
  ): Post {
    switch (type) {
      case 'empty':
        return { userId: 1, title: '', body: '' };
      case 'long_title':
        return {
          userId: 1,
          title: 'A'.repeat(300),
          body: 'Valid body',
        };
      case 'missing_body':
        return {
          userId: 1,
          title: 'Title without body',
          body: '',
        };
      default:
        return this.createPost();
    }
  }
}
