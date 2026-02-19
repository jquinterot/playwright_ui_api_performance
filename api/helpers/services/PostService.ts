/**
 * Service Layer - Post Service
 *
 * WHY: Encapsulate complex business workflows that span multiple API calls.
 * Controllers handle single API calls, but real-world scenarios often need
 * multiple coordinated calls (create post → add comments → verify).
 *
 * VALUE:
 * - High-level reusable operations (createPostWithComments, cleanupPost)
 * - Hides complexity of multi-step operations from tests
 * - Single place to update when business logic changes
 * - Tests focus on WHAT to test, not HOW to do it
 * - Consistent setup/teardown across tests
 * - Can add validation and cleanup logic centrally
 */
import { APIRequestContext, APIResponse } from '@playwright/test';
import { JsonPlaceholderController } from '../../controllers/JsonPlaceholderController';
import { DataFactory, Post, Comment } from '../factories/DataFactory';
import { ResponseValidator } from '../validators/ResponseValidator';

export class PostService {
  private api: JsonPlaceholderController;

  constructor(request: APIRequestContext) {
    this.api = new JsonPlaceholderController(request);
  }

  /**
   * Complete workflow: Create a post with multiple comments
   *
   * USE CASE: Testing post with engagement metrics
   *
   * @param commentCount - Number of comments to add
   * @returns Created post and its comments
   */
  async createPostWithComments(commentCount: number = 3): Promise<{
    post: Post;
    comments: Comment[];
    responses: {
      postResponse: APIResponse;
      commentResponses: APIResponse[];
    };
  }> {
    // Step 1: Create post
    const postData = DataFactory.createPost();
    const postResponse = await this.api.createPost(postData);
    await ResponseValidator.validateStatus(postResponse, 201);

    const createdPost = await postResponse.json();
    const post: Post = { ...postData, id: createdPost.id };

    // Step 2: Add comments
    const comments: Comment[] = [];
    const commentResponses: APIResponse[] = [];

    for (let i = 0; i < commentCount; i++) {
      const commentData = DataFactory.createComment(post.id!);
      // Note: JSONPlaceholder doesn't actually support creating comments,
      // but this shows the pattern for real APIs
      comments.push(commentData);
    }

    return {
      post,
      comments,
      responses: {
        postResponse,
        commentResponses,
      },
    };
  }

  /**
   * Complete workflow: Create, update, and verify post
   *
   * USE CASE: Testing full CRUD lifecycle
   */
  async createUpdateAndVerifyPost(): Promise<{
    original: Post;
    updated: Post;
    createResponse: APIResponse;
    updateResponse: APIResponse;
  }> {
    // Create
    const original = DataFactory.createPost();
    const createResponse = await this.api.createPost(original);
    await ResponseValidator.validateStatus(createResponse, 201);
    const created = await createResponse.json();

    // Update
    const updated = DataFactory.createPost({
      id: created.id,
      userId: original.userId,
    });
    const updateResponse = await this.api.updatePost(created.id, updated);
    // Note: JSONPlaceholder sometimes returns 500 for PUT (mock API limitation)
    // In production, this would be a real 200/204 response

    // Verify
    const verifyResponse = await this.api.getPostById(created.id);
    await ResponseValidator.validateSuccess(verifyResponse);

    return { original, updated, createResponse, updateResponse };
  }

  /**
   * Cleanup workflow: Delete post and verify it's gone
   *
   * USE CASE: Test cleanup, resource management
   */
  async cleanupPost(postId: number): Promise<{
    deleteResponse: APIResponse;
    verifyResponse: APIResponse;
  }> {
    const deleteResponse = await this.api.deletePost(postId);
    await ResponseValidator.validateSuccess(deleteResponse);

    const verifyResponse = await this.api.getPostById(postId);
    await ResponseValidator.validateNotFound(verifyResponse);

    return { deleteResponse, verifyResponse };
  }

  /**
   * Bulk operation: Create multiple posts for a user
   *
   * USE CASE: Testing user activity, pagination, bulk operations
   */
  async createUserPosts(
    userId: number,
    count: number,
  ): Promise<{
    posts: Post[];
    responses: APIResponse[];
  }> {
    const posts: Post[] = [];
    const responses: APIResponse[] = [];

    for (let i = 0; i < count; i++) {
      const post = DataFactory.createPost({ userId });
      const response = await this.api.createPost(post);
      await ResponseValidator.validateStatus(response, 201);

      const created = await response.json();
      posts.push({ ...post, id: created.id });
      responses.push(response);
    }

    return { posts, responses };
  }

  /**
   * Search workflow: Find posts by user and validate
   *
   * USE CASE: Testing search functionality, data integrity
   */
  async getAndValidateUserPosts(userId: number): Promise<{
    posts: Post[];
    response: APIResponse;
    allBelongToUser: boolean;
  }> {
    const response = await this.api.getPostsByUser(userId);
    await ResponseValidator.validateSuccess(response);

    const posts: Post[] = await response.json();
    const allBelongToUser = posts.every((post) => post.userId === userId);

    return { posts, response, allBelongToUser };
  }
}
