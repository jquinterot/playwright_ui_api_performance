import { test, expect } from '../../fixtures/apiFixtures';
import { CatFact } from '../../helpers/types/CatFact';
import { CatFacts } from '../../helpers/types/CatFacts';

test('Check GET /fact @acceptance', async ({ catfact }) => {
  let catFact: CatFact;

  await test.step('Given user GET cat facts', async () => {
    catFact = await catfact.getCatFact();
  });

  await test.step('Then cat fact response should contain correct properties', async () => {
    expect(catFact).toHaveProperty('fact');
    expect(catFact).toHaveProperty('length');
    expect(catFact).not.toBe(null);
  });
});

test('Check GET /facts @acceptance', async ({ catfact }) => {
  let catFacts: CatFacts;

  await test.step('Given user GET cat facts', async () => {
    catFacts = await catfact.getCatFacts();
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
