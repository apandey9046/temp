import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Settings,
  Keyboard,
  Zap,
  Star,
  Archive,
  Trash2,
  Copy
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { noteRepository } from '@/shared/services/storage/noteRepository';
import { type Note } from '@/database/db';
import { cn } from '@/shared/utils/cn';
import { useToast } from '@/shared/components/ui/Toast';

interface Command {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  section: string;
  danger?: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { id: currentNoteId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

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
    onClose();
  };

  const handleAction = async (action: 'favorite' | 'archive' | 'delete' | 'duplicate') => {
    if (!currentNoteId || !user) return;
    const note = await noteRepository.getById(currentNoteId, user.id);
    if (!note) return;

    switch (action) {
      case 'favorite':
        await noteRepository.save({ ...note, isFavorite: !note.isFavorite });
        toast(note.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
        break;
      case 'archive':
        await noteRepository.save({ ...note, isArchived: !note.isArchived });
        toast(note.isArchived ? 'Restored from archive' : 'Note archived', 'success');
        if (!note.isArchived) navigate('/');
        break;
      case 'delete':
        await noteRepository.delete(currentNoteId, user.id);
        toast('Note moved to trash', 'success');
        navigate('/');
        break;
      case 'duplicate':
        const newId = Math.random().toString(36).substring(2, 11);
        await noteRepository.save({
          ...note,
          id: newId,
          title: `${note.title || 'Untitled'} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDirty: true,
          syncStatus: 'dirty'
        });
        toast('Note duplicated', 'success');
        navigate(`/note/${newId}`);
        break;
    }
    onClose();
  };

  const commands: Command[] = [
    {
      id: 'new-note',
      title: 'New Note',
      icon: <Plus className="w-4 h-4" />,
      shortcut: '⌘ N',
      action: handleNewNote,
      section: 'General'
    },
    {
      id: 'search',
      title: 'Search Notes',
      icon: <Search className="w-4 h-4" />,
      shortcut: '⌘ K',
      action: () => { /* Logic to open search modal */ },
      section: 'General'
    },
    ...(currentNoteId ? [
      {
        id: 'favorite',
        title: 'Toggle Favorite',
        icon: <Star className="w-4 h-4" />,
        action: () => handleAction('favorite'),
        section: 'Current Note'
      },
      {
        id: 'duplicate',
        title: 'Duplicate Note',
        icon: <Copy className="w-4 h-4" />,
        shortcut: '⌘ D',
        action: () => handleAction('duplicate'),
        section: 'Current Note'
      },
      {
        id: 'archive',
        title: 'Archive Note',
        icon: <Archive className="w-4 h-4" />,
        action: () => handleAction('archive'),
        section: 'Current Note'
      },
      {
        id: 'delete',
        title: 'Delete Note',
        icon: <Trash2 className="w-4 h-4" />,
        action: () => handleAction('delete'),
        section: 'Current Note',
        danger: true
      }
    ] : []),
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => navigate('/settings'),
      section: 'System'
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      shortcut: '⌘ /',
      action: () => {},
      section: 'System'
    }
  ];

  const filteredCommands = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-[600px] bg-white rounded-modal shadow-2xl border border-border overflow-hidden z-[301]"
          >
            <div className="p-4 border-b border-divider flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <input
                autoFocus
                placeholder="Search commands..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none focus:outline-none text-lg font-fredoka placeholder:text-muted"
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {filteredCommands.length === 0 && (
                <div className="py-12 text-center text-muted font-playpen">
                  No commands found
                </div>
              )}
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-colors group text-left",
                    index === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      index === selectedIndex ? "bg-white shadow-sm" : "bg-secondary",
                      cmd.danger && "text-red-500"
                    )}>
                      {cmd.icon}
                    </div>
                    <div className={cn(
                      "font-medium font-fredoka",
                      cmd.danger ? "text-red-500" : "text-primary"
                    )}>
                      {cmd.title}
                    </div>
                  </div>
                  {cmd.shortcut && (
                    <div className="text-[10px] font-bold text-muted bg-white border border-border px-1.5 py-0.5 rounded shadow-sm">
                      {cmd.shortcut}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-divider bg-secondary/30 flex items-center justify-between text-[11px] text-muted font-medium px-5">
              <div className="flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 rounded border border-border bg-white">↑↓</kbd> to navigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded border border-border bg-white">↵</kbd> to select</span>
              </div>
              <div className="font-fredoka tracking-tighter">PREMIUM COMMANDS</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
