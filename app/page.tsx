import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { Dashboard } from '@/1_widgets/Dashboard';
import { fetchCountriesCatalog } from '@/3_entities/api/country/fetchCountriesCatalog';
import { countryKeys } from '@/3_entities/api/country';
import { featureConfig } from '@/4_shared/configs';

/**
 * Home page (RSC): prefetch light countries catalog on the server,
 * dehydrate into React Query so client widgets start with warm cache.
 * Catalog size follows `featureConfig.catalogLimit` (dev vs prod).
 */
export default async function Home() {
  const catalogLimit = featureConfig.catalogLimit;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: countryKeys.catalog(catalogLimit),
    queryFn: () => fetchCountriesCatalog({ limit: catalogLimit }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
