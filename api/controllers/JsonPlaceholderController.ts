/**
 * JSONPlaceholder Controller
 *
 * Provides API methods for JSONPlaceholder REST API
 * Endpoints: /posts, /users, /comments, /albums, /photos, /todos
 *
 * Base URL: https://jsonplaceholder.typicode.com
 */
import { APIRequestContext, expect } from '@playwright/test';
import { apiConfig } from '../helpers/config/ApiConfig';

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export class JsonPlaceholderController {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = apiConfig.baseUrl;
  }

  /**
   * GET /posts - Fetch all posts
   */
  async getAllPosts() {
    return await this.request.get(`${this.baseUrl}/posts`);
  }

  /**
   * GET /posts/{id} - Fetch single post
   */
  async getPostById(id: number) {
    return await this.request.get(`${this.baseUrl}/posts/${id}`);
  }

  /**
   * GET /posts/{id} - Fetch posts by user
   */
  async getPostsByUser(userId: number) {
    return await this.request.get(`${this.baseUrl}/posts`, {
      params: { userId: userId.toString() },
    });
  }

  /**
   * POST /posts - Create new post
   */
  async createPost(post: Post) {
    return await this.request.post(`${this.baseUrl}/posts`, {
      data: post,
      headers: apiConfig.headers,
    });
  }

  /**
   * PUT /posts/{id} - Update post
   */
  async updatePost(id: number, post: Post) {
    return await this.request.put(`${this.baseUrl}/posts/${id}`, {
      data: post,
      headers: apiConfig.headers,
    });
  }

  /**
   * DELETE /posts/{id} - Delete post
   */
  async deletePost(id: number) {
    return await this.request.delete(`${this.baseUrl}/posts/${id}`);
  }

  /**
   * GET /users - Fetch all users
   */
  async getAllUsers() {
    return await this.request.get(`${this.baseUrl}/users`);
  }

  /**
   * GET /users/{id} - Fetch single user
   */
  async getUserById(id: number) {
    return await this.request.get(`${this.baseUrl}/users/${id}`);
  }

  /**
   * GET /comments?postId={id} - Fetch comments for a post
   */
  async getCommentsByPost(postId: number) {
    return await this.request.get(`${this.baseUrl}/comments`, {
      params: { postId: postId.toString() },
    });
  }
}
