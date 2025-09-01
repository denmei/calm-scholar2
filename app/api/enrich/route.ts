import { NextRequest, NextResponse } from "next/server";

type Lang = "EN" | "DE" | "ES" | "SV";
const SUPPORTED: Lang[] = ["EN", "DE", "ES", "SV"];

function normLang(x: unknown, fallback: Lang): Lang {
  const s = String(x ?? "").toUpperCase().trim();
  return (SUPPORTED as string[]).includes(s) ? (s as Lang) : fallback;
}

async function fetchTranslate(q: string, from: Lang, to: Lang): Promise<string[]> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from.toLowerCase()}|${to.toLowerCase()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`translate status ${res.status}`);
  const json = await res.json();
  const matches: Array<{ translation: string; match: number }> =
    (json?.matches || []).map((m: any) => ({ translation: String(m.translation || "").trim(), match: Number(m.match || 0) }));

  // Keep reasonable quality & uniqueness
  const uniq: string[] = [];
  for (const m of matches.sort((a, b) => b.match - a.match)) {
    if (!m.translation) continue;
    if (!uniq.includes(m.translation)) uniq.push(m.translation);
    if (uniq.length >= 7) break;
  }
  return uniq;
}

async function fetchEnglishLex(lemma: string) {
  // https://api.dictionaryapi.dev/api/v2/entries/en/<word>
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lemma)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const lemmaRaw = typeof body?.lemma === "string" ? body.lemma : "";
    const lemma = lemmaRaw.trim();
    const baseLang = normLang(body?.baseLang, "EN");
    const targetLang = normLang(body?.targetLang, "DE");

    if (!lemma) return NextResponse.json({ ok: false, error: "lemma required", senses: [] }, { status: 400 });
    if (baseLang === targetLang) {
      return NextResponse.json({ ok: true, lemma, senses: [], error: "Base and target language are the same." });
    }

    let error: string | null = null;

    // 1) Translate lemma from base → target
    let translations: string[] = [];
    try {
      translations = await fetchTranslate(lemma, baseLang, targetLang);
    } catch (e: any) {
      error = e?.message || String(e);
    }

    // 2) If base is English, enrich with IPA/examples/audio
    let ipa = "";
    let examples: string[] = [];
    let audioUrl = "";

    if (baseLang === "EN") {
      const lex = await fetchEnglishLex(lemma);
      if (Array.isArray(lex) && lex[0]) {
        const entry = lex[0];
        if (Array.isArray(entry.phonetics) && entry.phonetics.length) {
          const p = entry.phonetics.find((p: any) => p.text || p.audio) || entry.phonetics[0];
          ipa = String(p?.text || "");
          audioUrl = String(p?.audio || "");
        }
        if (Array.isArray(entry.meanings)) {
          for (const m of entry.meanings) {
            if (Array.isArray(m.definitions)) {
              for (const d of m.definitions) {
                if (d.example) examples.push(String(d.example));
              }
            }
          }
        }
      }
    }

    // 3) Shape senses
    const senses = translations.map((t, i) => ({
      id: `sense-${i}-${Date.now()}`,
      lemma,
      translation: t,
      pos: "", // could be improved by parsing meanings
      ipa: ipa || "",
      examples: examples.slice(0, 3),
      audioUrl: audioUrl || ""
    }));

    return NextResponse.json(
      { ok: true, lemma, baseLang, targetLang, senses, error: error ?? undefined },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "fatal", senses: [] }, { status: 500 });
  }
}
