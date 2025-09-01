import { NextRequest, NextResponse } from "next/server";

// Serverless enrichment stub: call Wiktionary/Tatoeba etc. (add secrets in Vercel env)
export async function POST(req: NextRequest) {
  const { lemma, language } = await req.json();
  // TODO: fetch from external services, cache in DB
  return NextResponse.json({ ok: true, lemma, language, senses: [] });
}
