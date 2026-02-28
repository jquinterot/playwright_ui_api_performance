import { APIRequestContext, APIResponse } from '@playwright/test';
import { JsonPlaceholderController } from '../../controllers/JsonPlaceholderController';
import { DataFactory, Post, Comment } from '../factories/DataFactory';
import { ResponseValidator } from '../validators/ResponseValidator';

export class PostService {
  private api: JsonPlaceholderController;

  constructor(apiController: JsonPlaceholderController);
  constructor(request: APIRequestContext);
  constructor(arg: JsonPlaceholderController | APIRequestContext) {
    if (arg instanceof JsonPlaceholderController) {
      this.api = arg;
    } else {
      this.api = new JsonPlaceholderController(arg);
    }
  }

  async createPostWithComments(commentCount: number = 3): Promise<{
    post: Post;
    comments: Comment[];
    responses: {
      postResponse: APIResponse;
      commentResponses: APIResponse[];
    };
  }> {
    const postData = DataFactory.createPost();
    const postResponse = await this.api.createPost(postData);
    await ResponseValidator.validateStatus(postResponse, 201);

    const createdPost = await postResponse.json();
    const post: Post = { ...postData, id: createdPost.id };

    const comments: Comment[] = [];
    const commentResponses: APIResponse[] = [];

    for (let i = 0; i < commentCount; i++) {
      const commentData = DataFactory.createComment(post.id!);
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

  async createUpdateAndVerifyPost(): Promise<{
    original: Post;
    updated: Post;
    createResponse: APIResponse;
    updateResponse: APIResponse;
  }> {
    const original = DataFactory.createPost();
    const createResponse = await this.api.createPost(original);
    await ResponseValidator.validateStatus(createResponse, 201);
    const created = await createResponse.json();

    const updated = DataFactory.createPost({
      id: created.id,
      userId: original.userId,
    });
    const updateResponse = await this.api.updatePost(created.id, updated);

    const verifyResponse = await this.api.getPostById(created.id);
    await ResponseValidator.validateSuccess(verifyResponse);

    return { original, updated, createResponse, updateResponse };
  }

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
