"use client";
import { create } from "zustand";

export type Lang = "EN" | "DE" | "ES" | "SV";

type State = {
  baseLang: Lang;   // input language
  targetLang: Lang; // output language
  setPair: (base: Lang, target: Lang) => void;
};

export const useWorkspace = create<State>((set) => ({
  baseLang: "EN",
  targetLang: "DE",
  setPair: (base, target) => set({ baseLang: base, targetLang: target })
}));
