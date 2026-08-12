import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { OhButton, OhInput, OhLogo } from "../../components/ui";
import { colors } from "../../theme";

export function LoginScreen({ onEnter }: { onEnter: (role: "PATIENT" | "DOCTOR") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <OhLogo />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Same clean login as the web portal</Text>
        <View style={styles.card}>
          <OhInput label="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <OhInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <OhButton title="Sign in as patient" onPress={() => onEnter("PATIENT")} />
          <OhButton
            title="Sign in as doctor"
            variant="secondary"
            style={{ marginTop: 10 }}
            onPress={() => onEnter("DOCTOR")}
          />
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
});
