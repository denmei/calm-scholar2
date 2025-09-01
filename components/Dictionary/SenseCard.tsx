"use client";
import { useState } from "react";
import { useWorkspace } from "@/store/workspace";
import { addSense } from "@/lib/zk";

export default function SenseCard({ sense }: { sense: any }) {
  const { baseLang, targetLang, workspaceId } = useWorkspace();
  const lemma = sense.lemma ?? "—";
  const translation = sense.translation ?? "—";
  const pos = sense.pos ?? "";
  const ipa = sense.ipa ?? "";
  const examples: string[] = Array.isArray(sense.examples) ? sense.examples : [];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onAdd() {
    setSaving(true);
    setErr(null);
    try {
      const res = await addSense({
        lemma,
        translation,
        baseLang,
        targetLang,
        workspace_id: workspaceId,
        examples,
        pos,
        ipa,
        audioUrl: sense.audioUrl ?? "",
        tags: sense.tags ?? []
      });
      if (!res?.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch (e: any) {
      setErr(e?.message || "Could not add");
    } finally {
      setSaving(false);
    }
  }

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

      <div className="mt-3 flex items-center gap-2">
        <button className="rounded-md border px-3 py-1">Play audio</button>
        <button
          onClick={onAdd}
          disabled={saving || saved}
          className={`rounded-md px-3 py-1 text-white ${saved ? "bg-green-600" : "bg-positive"} disabled:opacity-60`}
        >
          {saved ? "Added ✓" : saving ? "Adding…" : "Add to ZK"}
        </button>
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  );
}
