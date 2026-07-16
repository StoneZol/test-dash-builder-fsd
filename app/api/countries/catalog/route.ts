import { NextRequest, NextResponse } from 'next/server';

import { fetchCountriesCatalog } from '@/3_entities/api/country/fetchCountriesCatalog';

const parseLimit = (raw: string | null) => {
  if (!raw) {
    return 100;
  }

  const value = Number.parseInt(raw, 10);

  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.min(Math.max(value, 1), 100);
};

/**
 * Lightweight country catalog for selects (name + alpha-3 + region).
 * `?limit=` caps payload size (dev uses a small limit via featureConfig).
 */
export async function GET(request: NextRequest) {
  try {
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
    const data = await fetchCountriesCatalog({ limit });

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to build countries catalog';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
