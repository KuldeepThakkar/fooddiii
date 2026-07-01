import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Keep data fresh for 2 minutes
            staleTime: 2 * 60 * 1000,
            // Keep cached data for 10 minutes (offline fallback)
            gcTime: 10 * 60 * 1000,
            // Retry once on failure, not 3 times
            retry: 1,
            // Don't refetch on window focus (saves bandwidth on mobile)
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});
