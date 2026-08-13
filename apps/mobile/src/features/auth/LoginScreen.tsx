import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator, Pressable } from "react-native";
import { OhButton, OhInput, OhLogo } from "../../components/ui";
import { colors } from "../../theme";
import { signIn, googleSignIn } from "./api";

export function LoginScreen({
  onEnter,
  onGoToSignup,
}: {
  onEnter: (role: "PATIENT" | "DOCTOR") => void;
  onGoToSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { role } = await signIn(email, password);
      onEnter(role); // role comes from the DB now, not the button tapped
    } catch (err: any) {
      Alert.alert("Sign in failed", err.message ?? "Please check your credentials and try again");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { role } = await googleSignIn("PATIENT");
      onEnter(role);
    } catch (err: any) {
      Alert.alert("Google sign in failed", err.message ?? "Please try again");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.wrap}>
          <OhLogo />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Same clean login as the web portal</Text>
          <View style={styles.card}>
            <OhInput
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
            />
            <OhInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
            />
            <OhButton
                title={loading ? "Signing in..." : "Sign in"}
                onPress={handleSignIn}
                disabled={loading}
            />
            {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>
            <OhButton
                title={googleLoading ? "Continuing with Google..." : "Continue with Google"}
                onPress={handleGoogle}
                disabled={googleLoading}
                variant="secondary"
            />
            {googleLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
            <Pressable onPress={onGoToSignup} disabled={loading} style={styles.linkRow}>
              <Text style={styles.linkText}>
                New to OneHealth?{" "}
                <Text style={styles.linkAccent}>Create an account</Text>
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
  linkRow: { marginTop: 18, alignItems: "center" },
  linkText: { color: colors.muted, fontWeight: "600", fontSize: 14 },
  linkAccent: { color: colors.brand, fontWeight: "800" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.muted, fontSize: 13 },
});