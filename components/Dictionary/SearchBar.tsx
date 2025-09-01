// components/Dictionary/SearchBar.tsx
"use client";
import { useState } from "react";

export default function SearchBar({ onResults }: { onResults: (senses: any[]) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lemma: q.trim(), language: "auto" }) // we’ll auto-detect simple cases
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      onResults(data.senses ?? []);
    } catch (e: any) {
      setErr(e.message || "Lookup failed");
      onResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="w-full rounded-md border px-3 py-2 shadow-sm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search in either language…"
      />
      <button className="rounded-md bg-primary px-4 py-2 text-white shadow-sm" type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
      {err && <span className="text-sm text-red-600">{err}</span>}
    </form>
  );
}
