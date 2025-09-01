// app/dictionary/page.tsx
"use client";
import { useState } from "react";
import SearchBar from "@/components/Dictionary/SearchBar";
import SenseCard from "@/components/Dictionary/SenseCard";

export default function DictionaryPage() {
  const [results, setResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dictionary</h1>
      <SearchBar
        onResults={(s) => {
          setSubmitted(true);
          setResults(s);
        }}
      />

      {!submitted && <p className="text-sm text-gray-500">Try searching for “run”.</p>}
      {submitted && results.length === 0 && (
        <div className="rounded border bg-gray-50 p-3 text-sm">No senses returned. Open Console to see the raw API payload.</div>
      )}

      <div className="grid gap-3">
        {results.map((sense, idx) => (
          <SenseCard key={sense.id ?? `row-${idx}`} sense={sense} />
        ))}
      </div>

      {submitted && (
        <details className="text-xs text-gray-600">
          <summary>Debug: raw senses</summary>
          <pre className="overflow-auto rounded bg-gray-50 p-2">{JSON.stringify(results, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
