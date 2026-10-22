import { expect, test } from '@playwright/test';

/**
 * NEW IN 1.63 — Typed API requests  (@docs/api/class-apirequestcontext)
 *
 * request.get(), .post(), ... now accept a TYPE PARAMETER that types the
 * response's json() — no more `as SomeType` casts after the fact, and your
 * validators get real type inference.
 *
 * This spec intentionally uses the raw `request` fixture (not CatFactController)
 * to show the typing primitive; controllers (BaseApiController) can adopt the
 * same pattern internally.
 */

type CatFact = {
  fact: string;
  length: number;
};

test.describe('@learning Typed API responses (1.63)', () => {
  test('response.json() is typed by the request.get<T> parameter', async ({
    request,
  }) => {
    // The type argument flows into response.json() — TS knows `fact`/`length`.
    const response = await request.get<CatFact>('https://catfact.ninja/fact');

    expect(response.ok()).toBe(true);
    const body = await response.json(); // CatFact — hover it!
    expect(response.status()).toBe(200);
    expect(typeof body.fact).toBe('string');
    expect(body.length).toBe(body.fact.length);
  });

  test('works for POST payloads too', async ({ request }) => {
    // jsonplaceholder echoes the created resource directly (id is always 101
    // for POST /posts — a known deterministic behavior of this demo API).
    type CreatedPost = {
      id: number;
      title: string;
      userId?: number;
      body?: string;
    };

    const response = await request.post<CreatedPost>(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: { id: 42, title: 'typed!' },
      },
    );

    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.title).toBe('typed!');
    expect(body.id).toBe(101);
  });
});
