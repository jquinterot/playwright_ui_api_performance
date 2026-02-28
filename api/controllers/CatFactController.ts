import { APIRequestContext } from '@playwright/test';
import { BaseApiController } from './BaseApiController';
import { CatFact } from '../helpers/types/CatFact';
import { CatFacts } from '../helpers/types/CatFacts';

export class CatFactController extends BaseApiController {
  constructor(request: APIRequestContext) {
    super(request, 'https://catfact.ninja');
  }

  async getCatFact(): Promise<CatFact> {
    return await this.getJson<CatFact>('/fact');
  }

  async getCatFacts(): Promise<CatFacts> {
    return await this.getJson<CatFacts>('/facts');
  }
}
