import { useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { syncEngine } from '@/shared/services/api/syncEngine';

export const useSync = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const performSync = () => syncEngine.sync(user.id);

    // 1. Initial sync
    performSync();

    // 2. Periodic sync (30s)
    const intervalId = setInterval(performSync, 30000);

    // 3. Network recovery sync
    window.addEventListener('online', performSync);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', performSync);
    };
  }, [user, isAuthenticated]);
};
