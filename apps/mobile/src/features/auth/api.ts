import { supabase } from "../../lib/supabaseClient";

export type Role = "PATIENT" | "DOCTOR";

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id",
            data.user.id)
        .single();

    if (profileError) throw profileError;

    return { session: data.session, role: profile.role as Role };
}