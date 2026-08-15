import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BookingsScreen,
  DoctorMobileHome,
  HomeScreen,
  ProfileScreen,
  QueueScreen,
  SearchScreen,
} from "../features/screens";
import { LoginScreen } from "../features/auth/LoginScreen";
import { SignupScreen } from "../features/auth/SignupScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: "home", inactive: "home-outline" },
  Search: { active: "search", inactive: "search-outline" },
  Queue: { active: "people", inactive: "people-outline" },
  Bookings: { active: "calendar", inactive: "calendar-outline" },
  Profile: { active: "person-circle", inactive: "person-circle-outline" },
};

function PatientTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { borderTopColor: colors.border },
        tabBarIcon: ({ color, focused, size }) => {
          const icon = tabIcons[route.name];
          return <Ionicons name={focused ? icon.active : icon.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile">{() => <ProfileScreen onLogout={onLogout} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export function RootNavigator({
  role,
  onEnter,
  onLogout,
}: {
  role: "PATIENT" | "DOCTOR" | null;
  onEnter: (role: "PATIENT" | "DOCTOR") => void;
  onLogout: () => void;
}) {
  const [authScreen, setAuthScreen] = useState<"Login" | "Signup">("Login");

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!role ? (
        authScreen === "Signup" ? (
          <Stack.Screen name="Signup">
            {() => (
              <SignupScreen
                onEnter={onEnter}
                onGoToLogin={() => setAuthScreen("Login")}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {() => <LoginScreen onEnter={onEnter} onGoToSignup={() => setAuthScreen("Signup")} />}
          </Stack.Screen>
        )
      ) : role === "DOCTOR" ? (
        <Stack.Screen name="Doctor">{() => <DoctorMobileHome />}</Stack.Screen>
      ) : (
        <Stack.Screen name="Patient">{() => <PatientTabs onLogout={onLogout} />}</Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
