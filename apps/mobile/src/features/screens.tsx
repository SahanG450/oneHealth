import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { OhButton, OhInput, OhLoading } from "../components/ui";
import { colors } from "../theme";
import { api } from "../lib/api";

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.h1}>Find care faster</Text>
        <Text style={styles.sub}>Search verified doctors, book a number, track the live queue.</Text>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Live queue</Text>
          <Text style={styles.heroNum}>#18</Text>
          <Text style={styles.heroHint}>Your token #42</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SearchScreen() {
  const [q, setQ] = useState("");
  const doctors = [
    { id: "d1", name: "Dr. Anusha Fernando", spec: "General Practice", city: "Colombo" },
    { id: "d2", name: "Dr. Ruwan Jayasuriya", spec: "Pediatrics", city: "Kandy" },
  ].filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.h1}>Find doctors</Text>
        <OhInput placeholder="Name or specialization" value={q} onChangeText={setQ} />
        {doctors.map((d) => (
          <View key={d.id} style={styles.card}>
            <Text style={styles.cardTitle}>{d.name}</Text>
            <Text style={styles.sub}>
              {d.spec} · {d.city}
            </Text>
            <OhButton title="Book number" style={{ marginTop: 12 }} onPress={() => undefined} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export function QueueScreen() {
  const [loading] = useState(false);
  if (loading) return <OhLoading label="Connecting to live queue…" />;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pad}>
        <Text style={styles.h1}>Live queue</Text>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Now serving</Text>
          <Text style={styles.heroNum}>#18</Text>
          <Text style={styles.heroHint}>Subscribes to Supabase Realtime channel queue:{"{dispensaryId}:{sessionId}"}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your token #42</Text>
          <Text style={styles.sub}>Approx. 24 numbers ahead</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function BookingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pad}>
        <Text style={styles.h1}>My bookings</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Token #42</Text>
          <Text style={styles.sub}>Today · WAITING</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pad}>
        <Text style={styles.h1}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nimal Perera</Text>
          <Text style={styles.sub}>patient@onehealth.lk</Text>
          <OhButton title="Sign out" variant="secondary" style={{ marginTop: 16 }} onPress={onLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export function DoctorMobileHome() {
  const [current, setCurrent] = useState(18);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pad}>
        <Text style={styles.h1}>Doctor queue</Text>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Now serving</Text>
          <Text style={styles.heroNum}>#{current}</Text>
        </View>
        <OhButton
          title="Call next"
          onPress={async () => {
            const next = current + 1;
            try {
              await api.updateCurrentQueue("disp-1", {
                currentNumber: next,
                queueDate: new Date().toISOString().slice(0, 10),
              });
            } catch {
              /* demo */
            }
            setCurrent(next);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  pad: { padding: 20 },
  h1: { fontSize: 28, fontWeight: "800", color: colors.brandDark, marginBottom: 8 },
  sub: { color: colors.muted, marginBottom: 16 },
  hero: {
    backgroundColor: colors.brand,
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },
  heroLabel: { color: "rgba(255,255,255,0.85)", fontWeight: "700" },
  heroNum: { color: "#fff", fontSize: 56, fontWeight: "800", marginTop: 6 },
  heroHint: { color: "rgba(255,255,255,0.9)", marginTop: 8 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: colors.ink },
});
