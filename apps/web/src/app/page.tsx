import HomeScreen from "@/components/screens/HomeScreen";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { allCountriesOptions } from "@/lib/getAllCountries";
import { getQueryClient } from "@/lib/get-query-client";
import { Suspense } from "react";
import LoadingScreen from "@/components/screens/LoadingScreen";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(allCountriesOptions);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingScreen />}>
        <HomeScreen />
      </Suspense>
    </HydrationBoundary>
  );
}
