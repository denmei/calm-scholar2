"use client";
import { useState } from "react";

export default function SearchBar({ onResults }: { onResults: (senses: any[]) => void }) {
  const [q, setQ] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: query local cache first (Dexie); else call /api/enrich, then cache
    onResults([
      {
        id: "sense-1",
        pos: "verb",
        ipa: "/rʌn/",
        lemma: "run",
        translation: "laufen",
        examples: ["He runs every morning."],
        audioUrl: ""
      }
    ]);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="w-full rounded-md border px-3 py-2 shadow-sm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search in either language…"
      />
      <button className="rounded-md bg-primary px-4 py-2 text-white shadow-sm" type="submit">
        Search
      </button>
    </form>
  );
}
