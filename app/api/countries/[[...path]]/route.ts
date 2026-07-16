import { NextRequest, NextResponse } from 'next/server';

import { makeRequest, readResponseBody } from '@/4_shared/api';
import { serverEnvConfig } from '@/4_shared/configs/serverEnvConfig';

type RouteContext = {
  params: { path?: string[] };
};

const buildUpstreamUrl = (pathSegments: string[] | undefined, search: string) => {
  const base = serverEnvConfig.restCountriesApiBaseUrl.replace(/\/$/, '');
  const path = pathSegments?.filter(Boolean).join('/') ?? '';
  const pathname = path ? `${base}/${path}` : base;
  return search ? `${pathname}?${search}` : pathname;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const upstreamUrl = buildUpstreamUrl(
      context.params.path,
      request.nextUrl.searchParams.toString(),
    );

    const response = await makeRequest(upstreamUrl, {
      token: serverEnvConfig.apiKey,
      cache: 'no-store',
    });

    const body = await readResponseBody(response);

    return NextResponse.json(body, {
      status: response.status,
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Upstream countries proxy failed';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
