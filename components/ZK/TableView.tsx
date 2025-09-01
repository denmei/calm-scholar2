"use client";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/dexie";
import { useWorkspace } from "@/store/workspace";
import { supabase } from "@/lib/supabase";

type Row = { id: string; lemma?: string; translation: string; pos?: string; tags: string[] };

export default function TableView() {
  const { workspaceId } = useWorkspace();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const user_id = session?.session?.user?.id;

      if (user_id) {
        // Safer join syntax for PostgREST: embed the related table by name
        const { data, error } = await supabase
          .from("senses")
          .select(`
            id, translation, pos, tags, word_id,
            words ( id, lemma )
          `)
          .eq("user_id", user_id);
        if (error) throw error;

        const normalized: Row[] =
          (data ?? []).map((s: any) => ({
            id: s.id,
            lemma: s.words?.lemma ?? "",
            translation: s.translation,
            pos: s.pos ?? "",
            tags: Array.isArray(s.tags) ? s.tags : []
          })) ?? [];
        setRows(normalized);
      } else {
        // Fallback: local Dexie for this workspace
        const local = await db.senses.where("workspace_id").equals(workspaceId).toArray();
        const normalized: Row[] = local.map((s) => ({
          id: s.id,
          // Best-effort lemma from local word_id, or add lemma to Dexie schema later
          lemma: s.word_id?.replace(/^local-/, "").split("-")[0],
          translation: s.translation,
          pos: s.pos ?? "",
          tags: Array.isArray(s.tags) ? s.tags : []
        }));
        setRows(normalized);
      }
    } catch (e) {
      // If Supabase path fails, show Dexie data so UI still updates
      const local = await db.senses.where("workspace_id").equals(workspaceId).toArray();
      const normalized: Row[] = local.map((s) => ({
        id: s.id,
        lemma: s.word_id?.replace(/^local-/, "").split("-")[0],
        translation: s.translation,
        pos: s.pos ?? "",
        tags: Array.isArray(s.tags) ? s.tags : []
      }));
      setRows(normalized);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    load();

    // Reload on “zk-updated” events (fired after Add to ZK)
    function onUpdated() {
      load();
    }
    window.addEventListener("zk-updated", onUpdated);

    return () => window.removeEventListener("zk-updated", onUpdated);
  }, [load]);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Word</th>
            <th className="px-3 py-2 text-left">Translation</th>
            <th className="px-3 py-2 text-left">POS</th>
            <th className="px-3 py-2 text-left">Tags</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.lemma ?? "—"}</td>
              <td className="px-3 py-2">{r.translation}</td>
              <td className="px-3 py-2">{r.pos ?? ""}</td>
              <td className="px-3 py-2">{r.tags.join(", ")}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                No entries yet — add some from the Dictionary.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
