import { createClient } from "@supabase/supabase-js";

const url =
  typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_SUPABASE_URL : undefined;
const anon =
  typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY : undefined;

export const supabaseConfigured = Boolean(url && anon && !String(url).includes("your-project"));

export const supabase = supabaseConfigured
  ? createClient(url!, anon!)
  : (null as unknown as ReturnType<typeof createClient>);
