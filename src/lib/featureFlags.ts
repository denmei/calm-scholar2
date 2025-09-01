export type Flags = { enableGraph: boolean; enableEmbeddings: boolean; feature_version: number };

let cache: Flags = { enableGraph: true, enableEmbeddings: false, feature_version: 1 };

export async function getFlags(): Promise<Flags> {
  // TODO: load from Supabase app_config; cache in IndexedDB
  return cache;
}
