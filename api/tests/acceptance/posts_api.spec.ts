import { test, expect, APIResponse } from '@playwright/test';
import {
  JsonPlaceholderController,
  Post,
} from '../../controllers/JsonPlaceholderController';
import { ResponseValidator } from '../../helpers/validators/ResponseValidator';

test.describe('@acceptance @api Posts API', () => {
  let api: JsonPlaceholderController;
  let response: APIResponse;

  test.beforeEach(async ({ request }) => {
    api = new JsonPlaceholderController(request);
  });

  test('GET /posts - should return all posts', async () => {
    await test.step('When user fetches all posts', async () => {
      response = await api.getAllPosts();
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
      await ResponseValidator.validateJson(response);
    });

    await test.step('And response should contain array of posts', async () => {
      await ResponseValidator.validateArrayLength(response, 100);
    });
  });

  test('GET /posts/{id} - should return single post', async () => {
    await test.step('When user fetches post with id 1', async () => {
      response = await api.getPostById(1);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });

    await test.step('And response should contain correct post data', async () => {
      await ResponseValidator.validateBodyContainsKey(response, 'id');
      await ResponseValidator.validateBodyContainsKey(response, 'title');
      await ResponseValidator.validateBodyContainsKey(response, 'body');
    });
  });

  test('GET /posts?userId={id} - should return posts by user', async () => {
    await test.step('When user fetches posts for user 1', async () => {
      response = await api.getPostsByUser(1);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });

    await test.step('And all posts should belong to user 1', async () => {
      const posts = await response.json();
      posts.forEach((post: Post) => {
        expect(post.userId).toBe(1);
      });
    });
  });

  test('POST /posts - should create new post', async () => {
    const newPost: Post = {
      userId: 1,
      title: 'Test Post Title',
      body: 'Test post body content',
    };

    await test.step('When user creates a new post', async () => {
      response = await api.createPost(newPost);
    });

    await test.step('Then response should be created (201)', async () => {
      await ResponseValidator.validateStatus(response, 201);
    });

    await test.step('And response should contain created post', async () => {
      const createdPost = await response.json();
      expect(createdPost.title).toBe(newPost.title);
      expect(createdPost.body).toBe(newPost.body);
      expect(createdPost.userId).toBe(newPost.userId);
      expect(createdPost.id).toBeDefined();
    });
  });

  test('PUT /posts/{id} - should update existing post', async () => {
    const updatedPost: Post = {
      userId: 1,
      title: 'Updated Title',
      body: 'Updated body content',
    };

    await test.step('When user updates post with id 1', async () => {
      response = await api.updatePost(1, updatedPost);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });

    await test.step('And response should contain updated post', async () => {
      const post = await response.json();
      expect(post.title).toBe(updatedPost.title);
      expect(post.body).toBe(updatedPost.body);
    });
  });

  test('DELETE /posts/{id} - should delete post', async () => {
    await test.step('When user deletes post with id 1', async () => {
      response = await api.deletePost(1);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });
  });
});
