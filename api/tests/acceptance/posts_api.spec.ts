import { APIResponse } from '@playwright/test';
import { test, expect } from '../../fixtures/apiFixtures';
import { Post } from '../../controllers/JsonPlaceholderController';
import { DataFactory } from '../../helpers/factories/DataFactory';
import { ResponseValidator } from '../../helpers/validators/ResponseValidator';
import { PostValidator } from '../../helpers/validators/PostValidator';

test.describe('@acceptance @api Posts API', () => {
  let response: APIResponse;

  test('GET /posts - should return all posts', async ({ jsonplaceholder }) => {
    await test.step('When user fetches all posts', async () => {
      response = await jsonplaceholder.getAllPosts();
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
      await ResponseValidator.validateJson(response);
    });

    await test.step('And response should contain array of posts', async () => {
      await ResponseValidator.validateArrayLength(response, 100);
    });
  });

  test('GET /posts/{id} - should return single post', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user fetches post with id 1', async () => {
      response = await jsonplaceholder.getPostById(1);
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

  test('GET /posts?userId={id} - should return posts by user', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user fetches posts for user 1', async () => {
      response = await jsonplaceholder.getPostsByUser(1);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });

    await test.step('And all posts should belong to user 1', async () => {
      const posts = (await response.json()) as Post[];
      PostValidator.validatePostsBelongToUser(posts, 1);
    });
  });

  test('POST /posts - should create new post', async ({ jsonplaceholder }) => {
    const newPost = DataFactory.createPost();

    await test.step('When user creates a new post', async () => {
      response = await jsonplaceholder.createPost(newPost);
    });

    await test.step('Then response should be created (201)', async () => {
      await PostValidator.validatePostCreated(response, newPost);
    });
  });

  test('PUT /posts/{id} - should update existing post', async ({
    jsonplaceholder,
  }) => {
    const updatedPost = DataFactory.createPost({
      title: 'Updated Title',
      body: 'Updated body content',
    });

    await test.step('When user updates post with id 1', async () => {
      response = await jsonplaceholder.updatePost(1, updatedPost);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });

    await test.step('And response should contain updated post', async () => {
      await PostValidator.validatePostUpdated(response, updatedPost);
    });
  });

  test('DELETE /posts/{id} - should delete post', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user deletes post with id 1', async () => {
      response = await jsonplaceholder.deletePost(1);
    });

    await test.step('Then response should be successful', async () => {
      await ResponseValidator.validateSuccess(response);
    });
  });
});
