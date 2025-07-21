import { storage } from "../utils/storage";
import type { AnxietyEntry } from "../types/anxietyTypes";

const ANXIETY_ENTRIES_KEY = "anxiety_entries";

export const anxietyJournalService = {
  async saveEntry(entry: AnxietyEntry): Promise<void> {
    try {
      const existingEntries = await this.getEntries();
      const updatedEntries = [
        ...existingEntries.filter((e) => e.id !== entry.id),
        entry,
      ];
      await storage.setItem(
        ANXIETY_ENTRIES_KEY,
        JSON.stringify(updatedEntries)
      );
    } catch (error) {
      console.error("Error saving anxiety entry:", error);
      throw error;
    }
  },

  async getEntries(): Promise<AnxietyEntry[]> {
    try {
      const entriesJson = await storage.getItem(ANXIETY_ENTRIES_KEY);
      return entriesJson ? JSON.parse(entriesJson) : [];
    } catch (error) {
      console.error("Error loading anxiety entries:", error);
      return [];
    }
  },

  async getEntry(id: string): Promise<AnxietyEntry | null> {
    try {
      const entries = await this.getEntries();
      return entries.find((entry) => entry.id === id) || null;
    } catch (error) {
      console.error("Error loading anxiety entry:", error);
      return null;
    }
  },

  async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.getEntries();
      const filteredEntries = entries.filter((entry) => entry.id !== id);
      await storage.setItem(
        ANXIETY_ENTRIES_KEY,
        JSON.stringify(filteredEntries)
      );
    } catch (error) {
      console.error("Error deleting anxiety entry:", error);
      throw error;
    }
  },

  generateId(): string {
    return `anxiety_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};
