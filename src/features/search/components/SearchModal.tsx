import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { noteRepository } from '@/shared/services/storage/noteRepository';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { type Note } from '@/database/db';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || !user) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      const filtered = await noteRepository.search(user.id, query);
      setResults(filtered.slice(0, 10));
      setIsSearching(false);
    };

    const timeoutId = setTimeout(search, 200);
    return () => clearTimeout(timeoutId);
  }, [query, user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-[600px] bg-white rounded-modal shadow-2xl border border-border overflow-hidden z-[201]"
          >
            <div className="p-4 border-b border-divider flex items-center gap-3">
              {isSearching ? <Loader2 className="w-5 h-5 text-muted animate-spin" /> : <Search className="w-5 h-5 text-muted" />}
              <input
                autoFocus
                placeholder="Search notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-lg font-fredoka placeholder:text-muted"
              />
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {query && results.length === 0 && !isSearching && (
                <div className="py-12 text-center text-muted font-playpen">
                  No notes found for "{query}"
                </div>
              )}
              {!query && (
                <div className="py-12 text-center text-muted font-playpen">
                  Start typing to search your notes...
                </div>
              )}
              {results.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    navigate(`/note/${note.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-muted" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-primary truncate font-fredoka">
                        {note.title || 'Untitled'}
                      </div>
                      <div className="text-xs text-muted truncate font-playpen">
                        {note.content.substring(0, 60)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-all mr-2" />
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-divider bg-secondary/30 flex items-center justify-between text-[11px] text-muted font-medium px-5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-white shadow-sm">ESC</kbd> to close
                </span>
              </div>
              <div>{results.length} results</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
