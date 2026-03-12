import { APIResponse } from '@playwright/test';
import { test, expect } from '../../fixtures/apiFixtures';
import { ResponseValidator } from '../../helpers/validators/ResponseValidator';

test.describe('@acceptance @api @negative Error Handling', () => {
  let response: APIResponse;

  test('GET /posts/{invalid_id} - should handle invalid post ID', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user fetches post with invalid id', async () => {
      response = await jsonplaceholder.getPostById(999999);
    });

    await test.step('Then response should be not found', async () => {
      await ResponseValidator.validateNotFound(response);
    });
  });

  test('GET /users/{invalid_id} - should handle invalid user ID', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user fetches user with invalid id', async () => {
      response = await jsonplaceholder.getUserById(999999);
    });

    await test.step('Then response should be not found', async () => {
      await ResponseValidator.validateNotFound(response);
    });
  });

  test('POST /posts - should handle invalid data', async ({
    jsonplaceholder,
  }) => {
    await test.step('When user creates post with empty data', async () => {
      response = await jsonplaceholder.createPost({
        userId: 1,
        title: '',
        body: '',
      });
    });

    await test.step('Then response should still be created (API accepts empty)', async () => {
      await ResponseValidator.validateStatus(response, 201);
    });
  });
});
