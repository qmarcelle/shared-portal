import { http, HttpResponse } from 'msw';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Create an MSW 2.x compatible rest handler from method, URL and resolver
 */
export function createRestHandler(
  method: HttpMethod,
  url: string,
  resolver: (req: any, res: any, ctx: any) => any,
) {
  const methodFn = http[method.toLowerCase() as keyof typeof http];

  return methodFn(url, async ({ request, params }) => {
    // Create a proxy request object that mimics the MSW v1 API
    const req = {
      url: new URL(request.url),
      params,
      body: request.headers.get('Content-Type')?.includes('application/json')
        ? await request.json().catch(() => null)
        : await request.text().catch(() => null),
    };

    // Create context and response utilities that mimic MSW v1
    const ctx = {
      status: (statusCode: number) => ({ statusCode }),
      json: (body: any) => ({ body }),
    };

    // Create a simplified response object
    const res = (context: { statusCode?: number; body?: any }) => {
      return new HttpResponse(JSON.stringify(context.body), {
        status: context.statusCode || 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    return resolver(req, res, ctx);
  });
}
