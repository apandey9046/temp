import Dexie, { type Table } from 'dexie';

export type SyncStatus = 'synced' | 'dirty' | 'syncing' | 'conflict' | 'error';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  preview: string;
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
  wordCount: number;
  characterCount: number;
  readingTime: number; // in minutes
  syncStatus: SyncStatus;
  localVersion: number;
  remoteVersion: number;
  tags: string[];
  folderId?: string;
  isDirty: boolean;
  lastSyncedAt?: number;
}

export class AppDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('NotesAppDB');
    this.version(2).stores({
      notes: 'id, userId, title, isFavorite, isPinned, isArchived, isDeleted, updatedAt, isDirty, syncStatus'
    });
  }
}

export const db = new AppDatabase();
