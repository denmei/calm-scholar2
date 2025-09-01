import { NextResponse } from "next/server";

export async function GET() {
  const csv = "Word,Translation,Example,POS,IPA,Tags\n";
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="export.csv"'
    }
  });
}
