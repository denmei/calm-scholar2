"use client";
import { useState } from "react";

export default function PromptCard({ prompt, answer }: { prompt: string; answer: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="text-2xl">{prompt}</div>
      {revealed ? (
        <div className="mt-4 text-xl text-green-700">{answer}</div>
      ) : (
        <button onClick={() => setRevealed(true)} className="mt-4 rounded-md border px-3 py-2">
          Reveal
        </button>
      )}
    </div>
  );
}
