import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabaseClient";

export type Role = "PATIENT" | "DOCTOR";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
    path: "auth/callback",
});

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

export interface SignUpPayload {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: Role;
}

export async function signUp({ email, password, fullName, phone, role }: SignUpPayload) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed. Please try again.");

    const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, full_name: fullName, phone, role });

    if (profileError) throw profileError;

    return { session: data.session, role };
}

export interface GoogleSignInResult {
    session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];
    role: Role;
    isNewUser: boolean;
}

export async function googleSignIn(
    preferredRole: Role = "PATIENT"
): Promise<GoogleSignInResult> {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true,
        },
    });
    if (error) throw error;
    if (!data.url) throw new Error("Google sign-in failed. Please try again.");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri, {
        showInRecents: true,
    });

    if (result.type !== "success") {
        throw new Error("Google sign-in was cancelled.");
    }

    const code = new URL(result.url).searchParams.get("code");
    if (!code) throw new Error("Google sign-in failed. Please try again.");

    const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) throw sessionError;
    if (!sessionData.user) throw new Error("Google sign-in failed. Please try again.");

    const userId = sessionData.user.id;
    const fullName =
        sessionData.user.user_metadata?.full_name ||
        sessionData.user.user_metadata?.name ||
        sessionData.user.email ||
        "OneHealth User";

    const { data: existing } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    let role: Role;
    let isNewUser = false;
    if (existing?.role) {
        role = existing.role as Role;
    } else {
        isNewUser = true;
        role = preferredRole;
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({ id: userId, full_name: fullName, role });
        if (profileError) throw profileError;
    }

    return { session: sessionData.session, role, isNewUser };
}