import { NextResponse } from 'next/server';

import { fetchCountriesCatalog } from '@/3_entities/api/country/fetchCountriesCatalog';

/**
 * Lightweight country catalog for selects (name + alpha-3 + region).
 * Heavy fields stay out of this payload; widgets load details/lists separately.
 */
export async function GET() {
  try {
    const data = await fetchCountriesCatalog();

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
