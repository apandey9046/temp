import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '@/shared/services/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsInitialized(true);
    });

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    return supabase.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshSession = async () => {
    await supabase.auth.refreshSession();
  };

  const value = {
    user,
    session,
    isInitialized,
    isAuthenticated: !!session,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
