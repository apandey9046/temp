import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { noteRepository } from '@/shared/services/storage/noteRepository';
import { type Note } from '@/database/db';
import { FloatingNavbar } from '@/shared/components/ui/FloatingNavbar';
import { Button } from '@/shared/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { SearchModal } from '@/features/search/components/SearchModal';
import { CommandPalette } from '@/shared/components/ui/CommandPalette';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadNotes = async () => {
      const allNotes = await noteRepository.getAll(user.id);
      setNotes(allNotes.sort((a, b) => b.updatedAt - a.updatedAt));
      setIsLoading(false);
    };
    loadNotes();
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  const handleNewNote = async () => {
    if (!user) return;
    const id = Math.random().toString(36).substring(2, 11);
    const newNote: Note = {
      id,
      userId: user.id,
      title: '',
      content: '',
      preview: '',
      isFavorite: false,
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastOpenedAt: Date.now(),
      wordCount: 0,
      characterCount: 0,
      readingTime: 0,
      syncStatus: 'dirty',
      localVersion: 1,
      remoteVersion: 0,
      tags: [],
      isDirty: true,
    };
    await noteRepository.save(newNote);
    navigate(`/note/${id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <FloatingNavbar onNew={handleNewNote} onSearch={() => setIsSearchOpen(true)} />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main className="max-w-[1000px] mx-auto pt-40 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold font-fredoka tracking-tight text-primary">Your Notes</h1>
          <p className="text-muted mt-2 font-playpen text-lg">A space for your thoughts, minimal and distraction-free.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white border border-border rounded-card animate-pulse" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Plus className="w-10 h-10 text-muted" />
            </div>
            <h2 className="text-2xl font-bold font-fredoka">No notes yet</h2>
            <p className="text-muted mt-2 mb-10 font-playpen max-w-[350px]">Create your first note to start documenting your ideas in a premium writing space.</p>
            <Button size="lg" onClick={handleNewNote}>Create New Note</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/note/${note.id}`)}
                className="group relative bg-white p-7 rounded-card border border-border shadow-premium cursor-pointer hover:border-muted hover:shadow-xl transition-all flex flex-col justify-between h-56"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold font-fredoka text-xl truncate pr-6 text-primary">
                      {note.title || 'Untitled'}
                    </h3>
                    {note.isFavorite && <Star className="w-4 h-4 text-primary fill-primary flex-shrink-0" />}
                  </div>
                  <p className="text-secondary-text text-sm line-clamp-3 font-playpen leading-relaxed opacity-80">
                    {note.content || 'No content...'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted font-bold tracking-tight">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(note.updatedAt).toUpperCase()} AGO
                  </div>
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;
