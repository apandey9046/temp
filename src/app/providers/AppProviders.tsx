import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/components/ui/Toast';
import { AuthProvider } from './AuthProvider';
import { AppBootstrap } from './AppBootstrap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <AppBootstrap>
            {children}
          </AppBootstrap>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};
