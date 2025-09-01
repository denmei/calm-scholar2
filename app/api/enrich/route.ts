// app/api/enrich/route.ts
import { NextRequest, NextResponse } from "next/server";

// Utility: naive language guess
function detectLang(q: string): "EN" | "DE" | "ES" | "SV" | "UNK" {
  const hasUmlaut = /[äöüßÄÖÜ]/.test(q);
  if (hasUmlaut) return "DE";
  if (/^[a-zA-Z]+$/.test(q)) return "EN"; // very naive; improve later
  return "UNK";
}

// Fetch English dictionary data (ipa/phonetics/examples/audio)
async function fetchEnglishLex(lemma: string) {
  // https://api.dictionaryapi.dev/api/v2/entries/en/<word>
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lemma)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json;
}

// Simple translation via MyMemory (free, rate-limited)
async function fetchTranslate(q: string, from: string, to: string) {
  // https://api.mymemory.translated.net/get?q=hello&langpair=en|de
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  // Pull top matches out of matches[] (filter good-quality)
  const matches: Array<{ translation: string; match: number }> =
    (json.matches || []).map((m: any) => ({ translation: m.translation, match: Number(m.match || 0) }));
  const uniq = Array.from(new Set(matches.map((m) => m.translation.trim()))).slice(0, 5);
  return uniq;
}

export async function POST(req: NextRequest) {
  try {
    const { lemma, language } = await req.json();
    if (!lemma || typeof lemma !== "string") {
      return NextResponse.json({ error: "lemma required" }, { status: 400 });
    }

    // Determine active workspace pair later; for now, auto direction around EN as a hub
    const guessed = (language && typeof language === "string" ? language.toUpperCase() : detectLang(lemma)) as
      | "EN"
      | "DE"
      | "ES"
      | "SV"
      | "UNK";

    // Strategy:
    // - If input looks EN: get English lex data (ipa/audio/examples) + offer translations to DE/ES/SV
    // - If input looks not EN (DE/ES/SV): try translating to EN and return as senses
    const senses: any[] = [];

    if (guessed === "EN" || guessed === "UNK") {
      const lex = await fetchEnglishLex(lemma);
      // Collect IPA/audio/examples from english data
      let ipa = "";
      let audioUrl = "";
      let examplePool: string[] = [];

      if (Array.isArray(lex) && lex[0]) {
        const entry = lex[0];
        if (Array.isArray(entry.phonetics) && entry.phonetics.length) {
          const p = entry.phonetics.find((p: any) => p.text) || entry.phonetics[0];
          ipa = p?.text || "";
          audioUrl = p?.audio || "";
        }
        if (Array.isArray(entry.meanings)) {
          entry.meanings.forEach((m: any) => {
            if (Array.isArray(m.definitions)) {
              m.definitions.forEach((d: any) => {
                if (d.example) examplePool.push(String(d.example));
              });
            }
          });
        }
      }

      // Provide translations for DE/ES/SV
      const [de, es, sv] = await Promise.all([
        fetchTranslate(lemma, "en", "de"),
        fetchTranslate(lemma, "en", "es"),
        fetchTranslate(lemma, "en", "sv")
      ]);

      const addTrans = (list: string[] | null | undefined, targetLang: string) => {
        if (!list || !list.length) return;
        for (const t of list) {
          senses.push({
            id: `en-${targetLang}-${lemma}-${t}`,
            lemma,
            translation: t,
            pos: "", // could be improved by parsing meanings
            ipa,
            examples: examplePool.slice(0, 3),
            audioUrl: audioUrl || ""
          });
        }
      };

      addTrans(de, "DE");
      addTrans(es, "ES");
      addTrans(sv, "SV");
    } else {
      // Non-EN input: translate to EN
      const from = guessed.toLowerCase();
      const list = await fetchTranslate(lemma, from, "en");
      if (list && list.length) {
        for (const t of list) {
          senses.push({
            id: `${guessed}-en-${lemma}-${t}`,
            lemma,
            translation: t,
            pos: "",
            ipa: "",
            examples: [],
            audioUrl: ""
          });
        }
      }
    }

    return NextResponse.json({ ok: true, lemma, senses });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "enrich failed" }, { status: 500 });
  }
}
