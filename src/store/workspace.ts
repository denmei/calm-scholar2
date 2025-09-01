"use client";
import { create } from "zustand";

export type Lang = "EN" | "DE" | "ES" | "SV";

type State = {
  baseLang: Lang;             // input language
  targetLang: Lang;           // output language
  workspaceId: string;        // current workspace id (Supabase row id)
  setPair: (base: Lang, target: Lang) => void;
  setWorkspaceId: (id: string) => void;
};

export const useWorkspace = create<State>((set) => ({
  baseLang: "EN",
  targetLang: "DE",
  workspaceId: "demo-workspace", // until you wire real workspaces
  setPair: (base, target) => set({ baseLang: base, targetLang: target }),
  setWorkspaceId: (id) => set({ workspaceId: id })
}));
