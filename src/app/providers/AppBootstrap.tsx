import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { SplashScreen } from '@/shared/components/ui/SplashScreen';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export const AppBootstrap: React.FC<AppBootstrapProps> = ({ children }) => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
