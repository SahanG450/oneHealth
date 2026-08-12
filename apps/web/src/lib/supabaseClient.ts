import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon && !url.includes("your-project"));

export const supabase = supabaseConfigured
  ? createClient(url!, anon!)
  : (null as unknown as ReturnType<typeof createClient>);
