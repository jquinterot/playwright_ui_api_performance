import { test as base, Page } from '@playwright/test';
import { JsonPlaceholderController } from '../controllers/JsonPlaceholderController';
import { CatFactController } from '../controllers/CatFactController';
import { ApiMockService, mockResponses } from '../helpers/mocks/ApiMockService';

type ApiFixtures = {
  jsonplaceholder: JsonPlaceholderController;
  catfact: CatFactController;
  mock: ApiMockService;
  mockPage: ApiMockService;
};

export const test = base.extend<ApiFixtures>({
  jsonplaceholder: async ({ request }, use) => {
    const controller = new JsonPlaceholderController(request);
    await use(controller);
  },

  catfact: async ({ request }, use) => {
    const controller = new CatFactController(request);
    await use(controller);
  },

  mock: async ({ request }, use) => {
    const mockService = new ApiMockService(request);
    await use(mockService);
  },

  mockPage: async ({ page }, use) => {
    const mockService = new ApiMockService(page.request as any);
    await use(mockService);
  },
});

export { expect } from '@playwright/test';
export { mockResponses };
