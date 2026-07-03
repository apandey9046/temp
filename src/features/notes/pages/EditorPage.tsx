import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { noteRepository } from '@/shared/services/storage/noteRepository';
import { type Note } from '@/database/db';
import { FloatingNavbar } from '@/shared/components/ui/FloatingNavbar';
import { NoteEditor } from '@/features/editor/components/NoteEditor';
import { useToast } from '@/shared/components/ui/Toast';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SearchModal } from '@/features/search/components/SearchModal';
import { useMarkdownWorker } from '@/features/editor/hooks/useMarkdownWorker';
import { syncEngine } from '@/shared/services/api/syncEngine';
import { CommandPalette } from '@/shared/components/ui/CommandPalette';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [note, setNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const { parse } = useMarkdownWorker();

  useEffect(() => {
    if (!id || !user) return;

    const loadNote = async () => {
      const existingNote = await noteRepository.getById(id, user.id);
      if (existingNote) {
        setNote(existingNote);
        parse(existingNote.content);
      } else {
        toast('Note not found', 'error');
        navigate('/');
      }
      setIsLoading(false);
    };

    loadNote();
  }, [id, user, navigate, toast, parse]);

  const saveNote = useCallback(async (updatedContent: string) => {
    if (!note || !user) return;
    setIsSaving(true);

    let newTitle = note.title;
    if (!newTitle || newTitle === 'Untitled' || newTitle === '') {
        const firstLine = updatedContent.split('\n')[0].replace(/[#*`]/g, '').trim();
        if (firstLine) newTitle = firstLine;
    }

    const updatedNote: Note = {
      ...note,
      content: updatedContent,
      title: newTitle,
      wordCount: updatedContent.split(/\s+/).filter(Boolean).length,
      characterCount: updatedContent.length,
      readingTime: Math.ceil(updatedContent.length / 1000),
    };

    await noteRepository.save(updatedNote);
    setNote(updatedNote);
    setIsSaving(false);
    syncEngine.sync(user.id);
  }, [note, user]);

  const debouncedSave = useDebounce(saveNote, 1000);
  const debouncedParse = useDebounce(parse, 500);

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
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (note) saveNote(note.content);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note, saveNote]);

  const handleContentChange = (content: string) => {
    if (!note) return;
    setNote({ ...note, content });
    debouncedSave(content);
    debouncedParse(content);
  };

  const handleNewNote = async () => {
    if (!user) return;
    const newId = Math.random().toString(36).substring(2, 11);
    const newNote: Note = {
      id: newId,
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
    navigate(`/note/${newId}`);
  };

  if (isLoading) return null;
  if (!note) return null;

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar
        title={note.title || 'Untitled'}
        isSaving={isSaving}
        onBack={() => navigate('/')}
        onSearch={() => setIsSearchOpen(true)}
        onNew={handleNewNote}
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main>
        <NoteEditor
          value={note.content}
          onChange={handleContentChange}
        />
      </main>
    </div>
  );
};

export default EditorPage;
