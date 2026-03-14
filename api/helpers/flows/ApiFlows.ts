import { APIResponse } from '@playwright/test';
import { JsonPlaceholderController } from '../../controllers/JsonPlaceholderController';
import {
  DataFactory,
  Post,
  Comment,
} from '../../helpers/factories/DataFactory';
import { ResponseValidator } from '../../helpers/validators/ResponseValidator';
import { PostValidator } from '../../helpers/validators/PostValidator';

export class PostsApiFlows {
  static async getAllPosts(
    api: JsonPlaceholderController,
  ): Promise<APIResponse> {
    return await api.getAllPosts();
  }

  static async getPostById(
    api: JsonPlaceholderController,
    id: number,
  ): Promise<APIResponse> {
    return await api.getPostById(id);
  }

  static async getPostsByUser(
    api: JsonPlaceholderController,
    userId: number,
  ): Promise<APIResponse> {
    return await api.getPostsByUser(userId);
  }

  static async createPost(
    api: JsonPlaceholderController,
    post?: Partial<Post>,
  ): Promise<{ response: APIResponse; post: Post }> {
    const postData = DataFactory.createPost(post);
    const response = await api.createPost(postData);
    const createdPost = (await response.json()) as Post;
    return { response, post: { ...postData, id: createdPost.id } };
  }

  static async updatePost(
    api: JsonPlaceholderController,
    id: number,
    post?: Partial<Post>,
  ): Promise<{ response: APIResponse; post: Post }> {
    const postData = DataFactory.createPost(post);
    const response = await api.updatePost(id, postData);
    const updatedPost = (await response.json()) as Post;
    return { response, post: { ...postData, id: updatedPost.id } };
  }

  static async deletePost(
    api: JsonPlaceholderController,
    id: number,
  ): Promise<APIResponse> {
    return await api.deletePost(id);
  }

  static async createPostWithComments(
    api: JsonPlaceholderController,
    commentCount: number = 3,
  ): Promise<{
    post: Post;
    comments: Comment[];
    response: APIResponse;
  }> {
    const { response, post } = await this.createPost(api);
    await ResponseValidator.validateStatus(response, 201);

    const comments: Comment[] = [];
    for (let i = 0; i < commentCount; i++) {
      comments.push(DataFactory.createComment(post.id!));
    }

    return { post, comments, response };
  }

  static async createBulkPosts(
    api: JsonPlaceholderController,
    userId: number,
    count: number,
  ): Promise<{ posts: Post[]; responses: APIResponse[] }> {
    const posts: Post[] = [];
    const responses: APIResponse[] = [];

    for (let i = 0; i < count; i++) {
      const postData = DataFactory.createPost({ userId });
      const response = await api.createPost(postData);
      await ResponseValidator.validateStatus(response, 201);
      const created = (await response.json()) as Post;
      posts.push({ ...postData, id: created.id });
      responses.push(response);
    }

    return { posts, responses };
  }
}

export class UsersApiFlows {
  static async getAllUsers(
    api: JsonPlaceholderController,
  ): Promise<APIResponse> {
    return await api.getAllUsers();
  }

  static async getUserById(
    api: JsonPlaceholderController,
    id: number,
  ): Promise<APIResponse> {
    return await api.getUserById(id);
  }
}

export class CommentsApiFlows {
  static async getCommentsByPost(
    api: JsonPlaceholderController,
    postId: number,
  ): Promise<APIResponse> {
    return await api.getCommentsByPost(postId);
  }
}
