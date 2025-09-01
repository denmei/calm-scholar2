"use client";
import { useState } from "react";
import SearchBar from "@/components/Dictionary/SearchBar";
import SenseCard from "@/components/Dictionary/SenseCard";

export default function DictionaryPage() {
  const [results, setResults] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dictionary</h1>
      <SearchBar onResults={setResults} />
      <div className="grid gap-3">
        {results.map((sense) => (
          <SenseCard key={sense.id} sense={sense} />
        ))}
      </div>
    </div>
  );
}
