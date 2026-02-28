import { Post, User, Comment } from '../types/JsonPlaceholder';

export { Post, User, Comment };

export class DataFactory {
  private static counter = 0;

  private static generateId(): number {
    return Date.now() + ++this.counter;
  }

  static createPost(overrides?: Partial<Post>): Post {
    const id = this.generateId();
    return {
      userId: 1,
      title: `Test Post Title ${id}`,
      body: `This is a test post body generated at ${new Date().toISOString()}. It contains sample content for testing purposes.`,
      ...overrides,
    };
  }

  static createPosts(count: number, overrides?: Partial<Post>): Post[] {
    return Array.from({ length: count }, (_, i) =>
      this.createPost({ ...overrides, userId: overrides?.userId || i + 1 }),
    );
  }

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
