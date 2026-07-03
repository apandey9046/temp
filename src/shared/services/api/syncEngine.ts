import { db, type Note } from '@/database/db';
import { supabase } from '@/shared/services/supabase/client';
import { noteRepository } from '@/shared/services/storage/noteRepository';

export class SyncEngine {
  private isSyncing = false;
  private retryCounts: Record<string, number> = {};

  async sync(userId: string) {
    if (this.isSyncing || !navigator.onLine) return;
    this.isSyncing = true;

    try {
      // 1. Process local changes (Upload)
      const dirtyNotes = await noteRepository.getDirtyNotes(userId);
      for (const note of dirtyNotes) {
        await this.uploadNote(note);
      }

      // 2. Fetch remote changes (Download)
      await this.downloadChanges(userId);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async uploadNote(note: Note) {
    const { isDirty, ...noteData } = note;

    // Optimistically mark as syncing
    await db.notes.update(note.id, { syncStatus: 'syncing' });

    const { error } = await supabase
      .from('notes')
      .upsert({
        ...noteData,
        updated_at: new Date(note.updatedAt).toISOString(),
        created_at: new Date(note.createdAt).toISOString(),
        version: note.localVersion,
      });

    if (error) {
      console.error(`Failed to upload note ${note.id}:`, error);
      this.handleUploadError(note.id);
    } else {
      await db.notes.update(note.id, {
        isDirty: false,
        syncStatus: 'synced',
        remoteVersion: note.localVersion,
        lastSyncedAt: Date.now()
      });
      delete this.retryCounts[note.id];
    }
  }

  private handleUploadError(id: string) {
    this.retryCounts[id] = (this.retryCounts[id] || 0) + 1;
    const status = this.retryCounts[id] > 3 ? 'error' : 'dirty';
    db.notes.update(id, { syncStatus: status });
  }

  private async downloadChanges(userId: string) {
    const { data: remoteNotes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    if (!remoteNotes) return;

    for (const remote of remoteNotes) {
      const local = await db.notes.get(remote.id);
      const remoteUpdatedAt = new Date(remote.updated_at).getTime();

      if (!local || remoteUpdatedAt > local.updatedAt) {
        // Simple "Last Write Wins" or version check
        await db.notes.put({
          ...remote,
          createdAt: new Date(remote.created_at).getTime(),
          updatedAt: remoteUpdatedAt,
          isDirty: false,
          syncStatus: 'synced',
          lastSyncedAt: Date.now(),
          remoteVersion: remote.version,
          localVersion: remote.version,
        });
      }
    }
  }
}

export const syncEngine = new SyncEngine();
