import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { RootNavigator } from "./navigation/RootNavigator";
import { colors } from "./theme";

export default function App() {
  const [role, setRole] = useState<"PATIENT" | "DOCTOR" | null>(null);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <RootNavigator role={role} onEnter={setRole} onLogout={() => setRole(null)} />
    </NavigationContainer>
  );
}
