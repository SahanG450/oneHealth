import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Image } from 'react-native';

// ---- Static content (swap for API data later) ----
const SERVICES = [
  { key: "doctors", route: "Search", label: "Doctors", sub: "Book Appointment", icon: "person-outline" as const },
  { key: "diagnostics", route: "Search", label: "Diagnostics", sub: "Test & health checkup", icon: "flask-outline" as const },
  { key: "dispensaries", route: "Search", label: "Dispensaries", sub: "Find nearby dispensaries", icon: "medkit-outline" as const },
  { key: "pharmacy", route: "Search", label: "Pharmacy", sub: "Order medicines", icon: "medical-outline" as const },
  { key: "queue", route: "Queue", label: "Live Queue", sub: "Track your number", icon: "time-outline" as const },
  { key: "econsult", route: "Bookings", label: "eConsultation", sub: "Get tele consult", icon: "chatbubbles-outline" as const },
];

const RECENT_DOCTORS = [
  { id: "d1", name: "Dr. Anusha Fernando", spec: "General Physician" },
  { id: "d2", name: "Dr. Ruwan Jayasuriya", spec: "Cardiologist" },
];

const SPECIALTIES = [
  { id: "s1", name: "Cardiology", count: "340 Specialists", icon: "heart-outline" as const },
  { id: "s2", name: "Pediatrics", count: "450 Specialists", icon: "body-outline" as const },
];

const OTHER_SERVICES = [
  { id: "o1", label: "Dispensary Locator", icon: "location-outline" as const },
  { id: "o2", label: "BMI Calculator", icon: "calculator-outline" as const },
  { id: "o3", label: "Health Tips", icon: "pulse-outline" as const },
];

export function HomeScreen({ navigation }: { navigation?: any }) {
  return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header: logo instead of location */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              {/*/!* If you have a real logo asset, uncomment this and add the file *!/*/}
              {/*{*/}
              {<Image source={require("../../assets/logo-trimmed (1).png")} style={styles.logoImg} resizeMode="contain" /> }
              {/*/!*<View style={styles.logoBadge}>*!/*/}
              {/*/!*  <Text style={styles.logoBadgeText}>OH</Text>*!/*/}
              {/*/!*</View>*!/*/}

            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.brandDark} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.h1}>What are you looking for?</Text>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={colors.muted} />
            <Text
                style={styles.searchPlaceholder}
                onPress={() => navigation?.navigate?.("Search")}
            >
              Search doctors, dispensaries, medicines...
            </Text>
          </View>

          {/* Service grid */}
          <View style={styles.grid}>
            {SERVICES.map((s) => (
                <TouchableOpacity
                    key={s.key}
                    style={styles.gridCard}
                    activeOpacity={0.85}
                    onPress={() => navigation?.navigate?.(s.route)}
                >
                  <View style={styles.gridIconWrap}>
                    <Ionicons name={s.icon} size={26} color="#fff" />
                  </View>
                  <Text style={styles.gridLabel}>{s.label}</Text>
                  <Text style={styles.gridSub}>{s.sub}</Text>
                </TouchableOpacity>
            ))}
          </View>

          {/* Recently visited doctors */}
          <SectionHeader title="Recently Visited Doctors" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {RECENT_DOCTORS.map((d) => (
                <View key={d.id} style={styles.doctorCard}>
                  <View style={styles.doctorAvatar}>
                    <Ionicons name="person" size={28} color={colors.brand} />
                  </View>
                  <Text style={styles.doctorName} numberOfLines={1}>{d.name}</Text>
                  <Text style={styles.doctorSpec} numberOfLines={1}>{d.spec}</Text>
                </View>
            ))}
          </ScrollView>

          {/* Specialties */}
          <SectionHeader title="Consult Specialized Doctors" action="View All" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {SPECIALTIES.map((sp) => (
                <View key={sp.id} style={styles.specCard}>
                  <View style={styles.specIconWrap}>
                    <Ionicons name={sp.icon} size={26} color="#fff" />
                  </View>
                  <Text style={styles.specName}>{sp.name}</Text>
                  <Text style={styles.specCount}>{sp.count}</Text>
                </View>
            ))}
          </ScrollView>

          {/* Other services list */}
          <SectionHeader title="Other Services" />
          <View style={styles.listCard}>
            {OTHER_SERVICES.map((o, i) => (
                <TouchableOpacity
                    key={o.id}
                    style={[styles.listRow, i < OTHER_SERVICES.length - 1 && styles.listRowBorder]}
                >
                  <Ionicons name={o.icon} size={20} color={colors.brand} style={{ width: 28 }} />
                  <Text style={styles.listLabel}>{o.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </TouchableOpacity>
            ))}
          </View>

          {/* Promo banner */}
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Lab Tests From The{"\n"}Comfort Of Your Home</Text>
            <View style={styles.bannerRow}>
              <View style={styles.bannerItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.brandDark} />
                <Text style={styles.bannerItemText}>100% Safe{"\n"}& Hygienic</Text>
              </View>
              <View style={styles.bannerItem}>
                <Ionicons name="document-text-outline" size={24} color={colors.brandDark} />
                <Text style={styles.bannerItemText}>View Reports{"\n"}Online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>View All Packages</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action ? (
            <TouchableOpacity>
              <Text style={styles.sectionAction}>{action}</Text>
            </TouchableOpacity>
        ) : null}
      </View>
  );
}

export function SearchScreen() {
  return <PlaceholderScreen title="Search" subtitle="Find doctors, dispensaries, and medicines." />;
}

export function QueueScreen() {
  return <PlaceholderScreen title="Live Queue" subtitle="Track your current queue number." />;
}

export function BookingsScreen() {
  return <PlaceholderScreen title="Bookings" subtitle="View and manage your appointments." />;
}

export function DoctorMobileHome() {
  return <PlaceholderScreen title="Doctor Dashboard" subtitle="Manage appointments and patient queues." />;
}

export function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
      <PlaceholderScreen title="Profile" subtitle="Manage your OneHealth account.">
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </PlaceholderScreen>
  );
}

function PlaceholderScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
      <SafeAreaView style={styles.placeholderSafe} edges={["top"]}>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderTitle}>{title}</Text>
          <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
          {children}
        </View>
      </SafeAreaView>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 8 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoImg: { width: 170, height: 48, marginRight: 8 },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  logoText: { fontSize: 18, fontWeight: "800", color: colors.brandDark },
  bellBtn: { padding: 4 },
  bellDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },

  welcome: { color: colors.brand, fontWeight: "700", marginBottom: 6 },
  h1: { fontSize: 26, fontWeight: "800", color: colors.ink, marginBottom: 18 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
    gap: 8,
  },
  searchPlaceholder: { color: colors.muted, fontSize: 14 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gridCard: {
    width: "48%",
    backgroundColor: colors.brandDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: CARD_GAP,
    minHeight: 120,
    justifyContent: "flex-end",
  },
  gridIconWrap: { marginBottom: 12 },
  gridLabel: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 2 },
  gridSub: { color: "rgba(255,255,255,0.75)", fontSize: 12 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
  sectionAction: { color: colors.brand, fontWeight: "700", fontSize: 13 },

  hScroll: { marginBottom: 4 },
  doctorCard: {
    width: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  doctorName: { fontWeight: "700", color: colors.ink, fontSize: 13, textAlign: "center" },
  doctorSpec: { color: colors.brand, fontSize: 12, marginTop: 2, textAlign: "center" },

  specCard: {
    width: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
  },
  specIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  specName: { fontWeight: "700", color: colors.ink, fontSize: 13 },
  specCount: { color: colors.brand, fontSize: 12, marginTop: 2 },

  listCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  listLabel: { flex: 1, color: colors.ink, fontWeight: "600" },

  banner: {
    backgroundColor: "#fbe4c8",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  bannerTitle: { fontSize: 20, fontWeight: "800", color: colors.ink, marginBottom: 16 },
  bannerRow: { flexDirection: "row", gap: 28, marginBottom: 18 },
  bannerItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  bannerItemText: { fontSize: 12, color: colors.ink, fontWeight: "600" },
  bannerBtn: {
    backgroundColor: colors.brandDark,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  bannerBtnText: { color: "#fff", fontWeight: "700" },
  placeholderSafe: { flex: 1, backgroundColor: colors.white },
  placeholderContent: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  placeholderTitle: { fontSize: 26, fontWeight: "800", color: colors.ink, marginBottom: 8 },
  placeholderSubtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  logoutButton: {
    backgroundColor: colors.brandDark,
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "700" },
});
