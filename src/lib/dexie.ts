import Dexie, { Table } from "dexie";

export type WorkspaceKey = { user_id: string; workspace_id: string };

export interface DictionaryCacheRow {
  id?: number;
  workspace_id: string;
  lemma: string;
  language: string;
  payload: any;
  updated_at: number;
}

export interface SenseRow {
  id: string;
  user_id: string;
  workspace_id: string;
  word_id: string;
  translation: string;
  examples: string[];
  pos?: string;
  ipa?: string;
  audio_url?: string;
  tags?: string[];
  created_at: number;
  updated_at: number;
}

export interface ReviewRow {
  id: string;
  user_id: string;
  sense_id: string;
  direction: "A2B" | "B2A";
  next_review: string; // ISO date
  interval_days: number;
  ease_factor: number;
  repetition_count: number;
  updated_at: number;
}

class CalmDB extends Dexie {
  dictionary_cache!: Table<DictionaryCacheRow, number>;
  senses!: Table<SenseRow, string>;
  reviews!: Table<ReviewRow, string>;

  constructor() {
    super("calm-scholar-db");
    this.version(1).stores({
      dictionary_cache: "++id, workspace_id, lemma, language, updated_at",
      senses: "id, workspace_id, user_id, updated_at",
      reviews: "id, sense_id, user_id, next_review, updated_at"
    });
  }
}

export const db = new CalmDB();
