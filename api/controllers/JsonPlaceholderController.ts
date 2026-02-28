import { APIRequestContext } from '@playwright/test';
import { BaseApiController } from './BaseApiController';
import { Post, User } from '../helpers/types/JsonPlaceholder';

export type { Post, User };

export class JsonPlaceholderController extends BaseApiController {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getAllPosts() {
    return await this.get('posts');
  }

  async getPostById(id: number) {
    return await this.get(`posts/${id}`);
  }

  async getPostsByUser(userId: number) {
    return await this.get('posts', {
      params: { userId: userId.toString() },
    });
  }

  async createPost(post: Post) {
    return await this.post('posts', {
      data: post,
      headers: this.config.headers,
    });
  }

  async updatePost(id: number, post: Post) {
    return await this.put(`posts/${id}`, {
      data: post,
      headers: this.config.headers,
    });
  }

  async deletePost(id: number) {
    return await this.delete(`posts/${id}`);
  }

  async getAllUsers() {
    return await this.get('users');
  }

  async getUserById(id: number) {
    return await this.get(`users/${id}`);
  }

  async getCommentsByPost(postId: number) {
    return await this.get('comments', {
      params: { postId: postId.toString() },
    });
  }
}
