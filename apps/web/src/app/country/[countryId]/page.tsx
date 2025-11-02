import CountryScreen from "@/components/screens/CountryScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { countryOptions } from "@/lib/getCoutry";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

interface CountryPageProps {
  params: Promise<{
    countryId: string;
  }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { countryId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(countryOptions(countryId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary
        fallbackTitle="Failed to load country details"
        fallbackDescription="We couldn't load the country information. Please try again."
      >
        <Suspense fallback={<LoadingScreen />}>
          <CountryScreen countryId={countryId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
