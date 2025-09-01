// src/lib/importExport.ts

export type CsvSense = {
  Word: string;
  Translation: string;
  Example?: string;
  POS?: string;
  IPA?: string;
  Tags?: string;
};

/**
 * Very small CSV parser that supports:
 * - comma separated values
 * - double-quoted fields
 * - escaped quotes inside fields: ""
 * - trims trailing CR
 */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = line[i + 1];
        if (next === '"') {
          // Escaped quote
          cur += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);

  // Trim trailing CRs/spaces around fields
  return out.map((s) => s.replace(/\r$/, "").trim());
}

export function parseCsv(text: string): CsvSense[] {
  // split into non-empty lines
  const lines = text
    .split(/\n/)
    .map((l) => l.replace(/\r$/, ""))
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  const headerLine = lines[0];
  if (!headerLine) return []; // satisfies TS and guards runtime

  const headers = parseCsvLine(headerLine);
  if (headers.length === 0) return [];

  const rows: CsvSense[] = [];

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const rec: Record<string, string | undefined> = {};

    headers.forEach((h, i) => {
      // If a column is missing, leave it undefined
      rec[h] = cols[i]?.trim();
    });

    // Only push rows that at least have Word + Translation
    if ((rec["Word"] ?? "").length || (rec["Translation"] ?? "").length) {
      rows.push(rec as CsvSense);
    }
  }

  return rows;
}

export function toCsv(rows: CsvSense[]): string {
  const headers = ["Word", "Translation", "Example", "POS", "IPA", "Tags"];

  const escape = (v?: string) => {
    const s = v ?? "";
    // Quote if contains comma, quote, or newline
    if (/[",\n\r]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const out = [headers.join(",")];

  for (const r of rows) {
    out.push(
      [
        escape(r.Word),
        escape(r.Translation),
        escape(r.Example),
        escape(r.POS),
        escape(r.IPA),
        escape(r.Tags)
      ].join(",")
    );
  }

  return out.join("\n");
}
