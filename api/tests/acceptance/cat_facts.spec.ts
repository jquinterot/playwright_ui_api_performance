import { test, expect } from '@playwright/test';
import { CatFact } from '../../helpers/types/CatFact';
import { CatFacts } from '../../helpers/types/CatFacts';
import { CatFactController } from '../../controllers/CatFactController';
import { CAT_FACTS } from '../../helpers/objects/CatFacts.ts';

test('Check GET /fact @acceptance', async ({ request }) => {
  let catFact: CatFact;

  await test.step('Given user GET cat facts', async () => {
    const catFactController = new CatFactController(request);
    catFact = await catFactController.getCatFact();
  });

  await test.step('Then cat fact response should contain correct properties', async () => {
    expect(catFact).toHaveProperty('fact');
    expect(catFact).toHaveProperty('length');
    expect(catFact).not.toBe(null);
  });
});

test('Check GET /facts @acceptance', async ({ request }) => {
  let catFacts: CatFacts;

  await test.step('Given user GET cat facts', async () => {
    const catFactController = new CatFactController(request);
    catFacts = await catFactController.getCatFacts();
  });

  await test.step('Then cat facts response should have correct structure', async () => {
    expect(catFacts.data).toBeInstanceOf(Array);
    expect(catFacts.data.length).toBeGreaterThan(0);
    expect(catFacts.data[0]).toHaveProperty('fact');
    expect(catFacts.data[0]).toHaveProperty('length');
    expect(typeof catFacts.data[0].fact).toBe('string');
    expect(typeof catFacts.data[0].length).toBe('number');
  });
});
