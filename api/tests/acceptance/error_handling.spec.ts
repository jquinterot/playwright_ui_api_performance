import { test, expect, APIResponse } from '@playwright/test';
import { JsonPlaceholderController } from '../../controllers/JsonPlaceholderController';
import { ResponseValidator } from '../../helpers/validators/ResponseValidator';

test.describe('@acceptance @api @negative Error Handling', () => {
  let api: JsonPlaceholderController;
  let response: APIResponse;

  test.beforeEach(async ({ request }) => {
    api = new JsonPlaceholderController(request);
  });

  test('GET /posts/{invalid_id} - should handle invalid post ID', async () => {
    await test.step('When user fetches post with invalid id', async () => {
      response = await api.getPostById(999999);
    });

    await test.step('Then response should be not found', async () => {
      await ResponseValidator.validateNotFound(response);
    });
  });

  test('GET /users/{invalid_id} - should handle invalid user ID', async () => {
    await test.step('When user fetches user with invalid id', async () => {
      response = await api.getUserById(999999);
    });

    await test.step('Then response should be not found', async () => {
      await ResponseValidator.validateNotFound(response);
    });
  });

  test('POST /posts - should handle invalid data', async () => {
    await test.step('When user creates post with empty data', async () => {
      response = await api.createPost({ userId: 1, title: '', body: '' });
    });

    await test.step('Then response should still be created (API accepts empty)', async () => {
      await ResponseValidator.validateStatus(response, 201);
    });
  });
});
