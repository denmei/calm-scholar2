export type CsvSense = {
    Word: string;
    Translation: string;
    Example?: string;
    POS?: string;
    IPA?: string;
    Tags?: string;
  };
  
  export function parseCsv(text: string): CsvSense[] {
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map((h) => h.trim());
    return lines.map((line) => {
      const cols = line.split(",");
      const rec: any = {};
      headers.forEach((h, i) => (rec[h] = (cols[i] ?? "").trim()));
      return rec as CsvSense;
    });
  }
  
  export function toCsv(rows: CsvSense[]): string {
    const headers = ["Word", "Translation", "Example", "POS", "IPA", "Tags"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.Word ?? "",
          r.Translation ?? "",
          JSON.stringify(r.Example ?? "").replace(/^"|"$/g, '""'),
          r.POS ?? "",
          r.IPA ?? "",
          r.Tags ?? ""
        ].join(",")
      );
    }
    return lines.join("\n");
  }
  