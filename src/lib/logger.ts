type Level = "debug" | "info" | "warn" | "error";

const DEBUG = process.env.NEXT_PUBLIC_APP_ENV !== "prod";

export function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  if (!DEBUG && level === "debug") return;
  const entry = { level, msg, ...meta, ts: new Date().toISOString() };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(entry));
}
