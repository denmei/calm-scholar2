"use client";
import { useWorkspace } from "@/store/workspace";

export default function SenseCard({ sense }: { sense: any }) {
  const { baseLang, targetLang } = useWorkspace();
  const lemma = sense.lemma ?? "—";
  const translation = sense.translation ?? "—";
  const pos = sense.pos ?? "";
  const ipa = sense.ipa ?? "";
  const examples: string[] = Array.isArray(sense.examples) ? sense.examples : [];

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          {lemma} → {translation} <span className="ml-2 text-xs text-gray-500">({baseLang}→{targetLang})</span>
        </div>
        <div className="text-sm text-gray-500">
          {pos} {ipa ? `· ${ipa}` : ""}
        </div>
      </div>
      {!!examples.length && (
        <ul className="mt-2 list-disc pl-5 text-sm font-serif">
          {examples.slice(0, 3).map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      )}
      <div className="mt-3">
        <button className="rounded-md border px-3 py-1">Play audio</button>
        <button className="ml-2 rounded-md bg-positive px-3 py-1 text-white">Add to ZK</button>
      </div>
    </div>
  );
}
