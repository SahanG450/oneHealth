import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator, Pressable } from "react-native";
import { OhButton, OhInput, OhLogo } from "../../components/ui";
import { colors } from "../../theme";
import { signUp, googleSignIn, type Role } from "./api";

export function SignupScreen({
  onEnter,
  onGoToLogin,
}: {
  onEnter: (role: "PATIENT" | "DOCTOR") => void;
  onGoToLogin: () => void;
}) {
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { role: resultingRole } = await googleSignIn(role);
      onEnter(resultingRole);
    } catch (err: any) {
      Alert.alert("Google sign up failed", err.message ?? "Please try again");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Missing info", "Please fill in name, email and password");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp({ email, password, fullName, phone, role });
      onEnter(role as Role);
    } catch (err: any) {
      Alert.alert("Sign up failed", err.message ?? "Please check your details and try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <OhLogo />
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.sub}>One clean login for patients and doctors</Text>
        <View style={styles.card}>
          <View style={styles.roleRow}>
            {(["PATIENT", "DOCTOR"] as const).map((r) => {
              const active = role === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  disabled={loading}
                  style={[styles.roleBtn, active && styles.roleBtnActive]}
                >
                  <Text style={[styles.roleText, active && styles.roleTextActive]}>
                    {r === "PATIENT" ? "I am a patient" : "I am a doctor"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <OhInput
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
            placeholder="Your full name"
          />
          <OhInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            placeholder="you@example.com"
          />
          <OhInput
            label="Phone (optional)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
            placeholder="+94…"
          />
          <OhInput
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            placeholder="At least 8 characters"
          />
          <OhButton
            title={loading ? "Creating account..." : "Create account"}
            onPress={handleSignUp}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>
          <OhButton
            title={googleLoading ? "Continuing with Google..." : "Sign up with Google"}
            onPress={handleGoogle}
            disabled={googleLoading}
            variant="secondary"
          />
          {googleLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
          <Pressable onPress={onGoToLogin} disabled={loading} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already registered?{" "}
              <Text style={styles.linkAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  wrap: { padding: 20, paddingTop: 40 },
  title: { marginTop: 24, fontSize: 28, fontWeight: "800", color: colors.brandDark },
  sub: { marginTop: 6, color: colors.muted, marginBottom: 20 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },
  roleRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  roleBtnActive: {
    borderColor: "#7CC7F2",
    backgroundColor: colors.brandSoft,
  },
  roleText: { fontSize: 14, fontWeight: "700", color: colors.muted },
  roleTextActive: { color: colors.brandDark },
  linkRow: { marginTop: 18, alignItems: "center" },
  linkText: { color: colors.muted, fontWeight: "600", fontSize: 14 },
  linkAccent: { color: colors.brand, fontWeight: "800" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.muted, fontSize: 13 },
});
