import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, Cloud, CloudOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/app/providers/AuthProvider';

interface FloatingNavbarProps {
  title?: string;
  isSaving?: boolean;
  onBack?: () => void;
  onNew?: () => void;
  onSearch?: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  title,
  isSaving,
  onBack,
  onNew,
  onSearch,
}) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-10 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass h-14 px-3 flex items-center gap-1 rounded-full shadow-premium pointer-events-auto min-w-[320px]"
      >
        {onBack && (
          <Button variant="ghost" size="xs" className="rounded-full w-10 h-10 p-0" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}

        <div className="flex items-center gap-3 px-3">
          {!title ? (
            <span className="font-fredoka font-bold text-lg tracking-tight">Notes</span>
          ) : (
            <span className="font-fredoka font-bold text-[13px] uppercase tracking-widest text-primary max-w-[180px] truncate">{title}</span>
          )}
        </div>

        <div className="h-4 w-[1px] bg-divider mx-2" />

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="xs" className="w-10 h-10 rounded-full p-0" onClick={onSearch}>
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs" className="w-10 h-10 rounded-full p-0" onClick={onNew}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-4 w-[1px] bg-divider mx-2" />

        <div className="flex items-center gap-3 px-2">
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 text-[10px] text-muted font-bold tracking-widest uppercase"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
                Saving
              </motion.div>
            ) : (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 text-[10px] text-muted font-bold tracking-widest uppercase"
              >
                {isOnline ? (
                  <Cloud className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <CloudOff className="w-3.5 h-3.5 text-red-400" />
                )}
                Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative ml-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden hover:ring-4 hover:ring-black/5 transition-all"
          >
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-secondary-text" />
            )}
          </button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfile(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-dropdown shadow-2xl p-2 z-[60]"
                >
                  <div className="px-4 py-3 border-b border-divider mb-1">
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider">Account</div>
                    <div className="text-sm font-semibold text-primary truncate mt-0.5">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between group"
                  >
                    Sign Out
                    <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all rotate-180" />
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
};
