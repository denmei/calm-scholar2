"use client";
import { useState } from "react";
import { useWorkspace } from "@/store/workspace";

type Sense = {
  id?: string;
  lemma?: string;
  translation?: string;
  pos?: string;
  ipa?: string;
  examples?: string[];
  audioUrl?: string;
};

export default function SearchBar({ onResults }: { onResults: (senses: Sense[]) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { baseLang, targetLang } = useWorkspace();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lemma = q.trim();
    if (!lemma) return;
    setLoading(true);
    setErr(null);

    try {
      console.log("[Search] POST /api/enrich", { lemma, baseLang, targetLang });
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ lemma, baseLang, targetLang })
      });
      console.log("[Search] status", res.status);
      const data = await res.json().catch(() => ({}));
      console.log("[Search] data", data);

      const senses = Array.isArray(data?.senses) ? data.senses : [];
      onResults(senses);
      if (data?.error) console.warn("[Search] API reported error:", data.error);
      if (!senses.length) setErr("No results for that query.");
    } catch (e: any) {
      console.error("[Search] error", e);
      setErr(e?.message || "Lookup failed");
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
        placeholder={`Search (${baseLang} → ${targetLang})…`}
      />
      <button className="rounded-md bg-primary px-4 py-2 text-white shadow-sm" type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
      {err && <span className="self-center text-sm text-red-600">{err}</span>}
    </form>
  );
}
