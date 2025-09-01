import { supabase } from "@/lib/supabase";
import { db } from "@/lib/dexie";
import type { Lang } from "@/store/workspace";

function emitZkUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("zk-updated"));
  }
}

// Basic IDs
const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export type AddSenseInput = {
  lemma: string;
  translation: string;
  baseLang: Lang;
  targetLang: Lang;
  workspace_id: string;
  examples?: string[];
  pos?: string;
  ipa?: string;
  audioUrl?: string;
  tags?: string[];
};

export async function addSense(input: AddSenseInput) {
  const {
    lemma,
    translation,
    baseLang,
    targetLang,
    workspace_id,
    examples = [],
    pos = "",
    ipa = "",
    audioUrl = "",
    tags = []
  } = input;

  // Try Supabase
  try {
    const { data: session } = await supabase.auth.getSession();
    const user_id = session?.session?.user?.id;
    if (user_id) {
      // 1) Upsert word (base lemma)
      const { data: wordRow, error: wordErr } = await supabase
        .from("words")
        .insert({
          user_id,
          workspace_id,
          language: baseLang,
          lemma
        })
        .select()
        .single();
      if (wordErr && wordErr.code !== "23505") throw wordErr; // ignore unique conflicts if you add a unique later

      const word_id = wordRow?.id ?? (await getExistingWordId(user_id, workspace_id, baseLang, lemma));

      // 2) Insert sense
      const sense_id = newId();
      const { error: senseErr } = await supabase.from("senses").insert({
        id: sense_id,
        user_id,
        word_id,
        translation,
        example: JSON.stringify(examples),
        pos,
        ipa,
        audio_url: audioUrl,
        tags
      });
      if (senseErr) throw senseErr;

      // 3) Create review rows both directions
      const today = new Date().toISOString().slice(0, 10);
      const a2b_id = newId();
      const b2a_id = newId();

      const { error: revErr } = await supabase.from("reviews").insert([
        {
          id: a2b_id,
          user_id,
          sense_id,
          direction: "A2B",
          next_review: today,
          interval_days: 1,
          ease_factor: 2.5,
          repetition_count: 0
        },
        {
          id: b2a_id,
          user_id,
          sense_id,
          direction: "B2A",
          next_review: today,
          interval_days: 1,
          ease_factor: 2.5,
          repetition_count: 0
        }
      ]);
      if (revErr) throw revErr;

      // 4) Also reflect locally (so ZK updates instantly)
      await db.senses.put({
        id: sense_id,
        user_id,
        workspace_id,
        word_id,
        translation,
        examples,
        pos,
        ipa,
        audio_url: audioUrl,
        tags,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      emitZkUpdated();

      return { ok: true, source: "supabase", sense_id };
    }
  } catch (e) {
    // falls through to Dexie
    // eslint-disable-next-line no-console
    console.warn("[addSense] Supabase path failed, using Dexie fallback:", e);
  }

  // Fallback: local only (no auth yet)
  const local_sense_id = newId();
  await db.senses.put({
    id: local_sense_id,
    user_id: "local",
    workspace_id,
    word_id: `local-${lemma}-${baseLang}`,
    translation,
    examples,
    pos,
    ipa,
    audio_url: audioUrl,
    tags,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  // Create local review skeletons
  const today = new Date().toISOString().slice(0, 10);
  await db.reviews.bulkPut([
    {
      id: newId(),
      user_id: "local",
      sense_id: local_sense_id,
      direction: "A2B",
      next_review: today,
      interval_days: 1,
      ease_factor: 2.5,
      repetition_count: 0,
      updated_at: Date.now()
    },
    {
      id: newId(),
      user_id: "local",
      sense_id: local_sense_id,
      direction: "B2A",
      next_review: today,
      interval_days: 1,
      ease_factor: 2.5,
      repetition_count: 0,
      updated_at: Date.now()
    }
  ]);

  emitZkUpdated();

  return { ok: true, source: "dexie", sense_id: local_sense_id };
}

async function getExistingWordId(user_id: string, workspace_id: string, language: string, lemma: string) {
  const { data, error } = await supabase
    .from("words")
    .select("id")
    .eq("user_id", user_id)
    .eq("workspace_id", workspace_id)
    .eq("language", language)
    .eq("lemma", lemma)
    .limit(1)
    .single();
  if (error) return `missing-${lemma}`;
  return data?.id;
}

