import HomePage from "@/components/pages/HomePage";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { allCountriesOptions } from "@/lib/getAllCountries";
import { getQueryClient } from "@/lib/get-query-client";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(allCountriesOptions);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
