import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  Image,
} from "react-native";
import { colors } from "../theme";

export function OhButton({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        primary ? styles.btnPrimary : styles.btnSecondary,
        loading && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#fff" : colors.brandDark} />
      ) : (
        <Text style={[styles.btnText, !primary && { color: colors.brandDark }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function OhInput(props: React.ComponentProps<typeof TextInput> & { label?: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        {...rest}
        style={[styles.input, style]}
      />
    </View>
  );
}

export function OhLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <View style={styles.loadingBox}>
      <ActivityIndicator size="large" color={colors.brand} />
      <Text style={styles.loadingLabel}>{label}</Text>
    </View>
  );
}

export function OhLogo() {
  return (
    <View style={styles.logoRow}>
      <Image source={require("../../assets/logo.png")} style={{ width: 48, height: 48 }} resizeMode="contain" />
      <Text style={styles.logoText}>OneHealth</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  btnPrimary: {
    backgroundColor: colors.brand,
  },
  btnSecondary: {
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: "#B3DCF5",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  label: {
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  loadingBox: { alignItems: "center", justifyContent: "center", padding: 24, gap: 10 },
  loadingLabel: { color: colors.muted, fontWeight: "600" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    fontStyle: "italic",
    color: colors.brand,
  },
});
