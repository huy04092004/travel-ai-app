import React from "react";
import { Stack, usePathname } from "expo-router";
import FloatingRobot from "../components/FloatingRobot";

export default function RootLayout() {
  const pathname = usePathname();

  const hideFloatingRobot =
    pathname.includes("/(chatbot)") ||
    pathname.includes("/chatbot") ||
    pathname.startsWith("/(auth)") ||
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot_password" ||
    pathname === "/otp_verification" ||
    pathname === "/create_new_password";

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      {!hideFloatingRobot && <FloatingRobot />}
    </>
  );
}