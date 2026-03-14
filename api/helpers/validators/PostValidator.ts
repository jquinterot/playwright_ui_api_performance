import { APIResponse, expect } from '@playwright/test';
import { Post, Comment } from '../types/JsonPlaceholder';

export class PostValidator {
  static async validatePostCreated(
    response: APIResponse,
    expectedPost: Partial<Post>,
  ): Promise<Post> {
    await expect(response.status()).toBe(201);
    const post = (await response.json()) as Post;
    expect(post.id).toBeDefined();
    if (expectedPost.title) {
      expect(post.title).toBe(expectedPost.title);
    }
    if (expectedPost.body) {
      expect(post.body).toBe(expectedPost.body);
    }
    if (expectedPost.userId) {
      expect(post.userId).toBe(expectedPost.userId);
    }
    return post;
  }

  static async validatePostUpdated(
    response: APIResponse,
    expectedPost: Partial<Post>,
  ): Promise<Post> {
    await expect(response.ok()).toBe(true);
    const post = (await response.json()) as Post;
    if (expectedPost.title) {
      expect(post.title).toBe(expectedPost.title);
    }
    if (expectedPost.body) {
      expect(post.body).toBe(expectedPost.body);
    }
    return post;
  }

  static validatePost(post: Post, expectedPost?: Partial<Post>): void {
    expect(post).toBeDefined();
    expect(post.id).toBeDefined();
    expect(post.title).toBeDefined();
    expect(post.body).toBeDefined();
    expect(post.userId).toBeDefined();

    if (expectedPost) {
      if (expectedPost.id) {
        expect(post.id).toBe(expectedPost.id);
      }
      if (expectedPost.title) {
        expect(post.title).toBe(expectedPost.title);
      }
      if (expectedPost.body) {
        expect(post.body).toBe(expectedPost.body);
      }
      if (expectedPost.userId) {
        expect(post.userId).toBe(expectedPost.userId);
      }
    }
  }

  static validatePostsBelongToUser(posts: Post[], userId: number): void {
    expect(posts.length).toBeGreaterThan(0);
    const allBelongToUser = posts.every((post) => post.userId === userId);
    expect(allBelongToUser).toBe(true);
  }

  static validateComment(comment: Comment, postId: number): void {
    expect(comment).toBeDefined();
    expect(comment.id).toBeDefined();
    expect(comment.postId).toBe(postId);
    expect(comment.name).toBeDefined();
    expect(comment.email).toBeDefined();
    expect(comment.body).toBeDefined();
  }
}
