import { db, type Note, type SyncStatus } from '@/database/db';

export const noteRepository = {
  async getAll(userId: string) {
    return db.notes
      .where('userId')
      .equals(userId)
      .filter(n => !n.isDeleted)
      .toArray();
  },

  async getById(id: string, userId: string) {
    const note = await db.notes.get(id);
    if (note && note.userId !== userId) return undefined;
    return note;
  },

  async save(note: Note) {
    const now = Date.now();
    const updatedNote = {
      ...note,
      updatedAt: now,
      isDirty: true,
      syncStatus: 'dirty' as SyncStatus,
      localVersion: (note.localVersion || 0) + 1,
    };
    await db.notes.put(updatedNote);
    return updatedNote;
  },

  async delete(id: string, userId: string) {
    const note = await db.notes.get(id);
    if (note && note.userId === userId) {
      await db.notes.update(id, {
        isDeleted: true,
        isDirty: true,
        updatedAt: Date.now(),
        syncStatus: 'dirty'
      });
    }
  },

  async search(userId: string, query: string) {
    const q = query.toLowerCase();
    const all = await this.getAll(userId);
    return all.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  },

  async getDirtyNotes(userId: string) {
    return db.notes
      .where('userId')
      .equals(userId)
      .and(n => n.isDirty)
      .toArray();
  }
};
