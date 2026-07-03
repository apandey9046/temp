import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

// Lazy load features
import LoginPage from '@/features/auth/pages/LoginPage';
import LandingPage from '@/features/notes/pages/LandingPage';
import EditorPage from '@/features/notes/pages/EditorPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/',
    element: <ProtectedRoute><LandingPage /></ProtectedRoute>,
  },
  {
    path: '/note/:id',
    element: <ProtectedRoute><EditorPage /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
